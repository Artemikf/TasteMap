using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using TasteMap.Application.DTOs;
using TasteMap.Application.Interfaces;
using TasteMap.Domain.Entities;
using TasteMap.Infrastructure.Data;

namespace TasteMap.Application.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly IEmailService _emailService; // Добавили сервис почты

    public AuthService(AppDbContext context, IConfiguration configuration, IEmailService emailService)
    {
        _context = context;
        _configuration = configuration;
        _emailService = emailService;
    }

    public async Task<AuthResponseDto> RegisterAsync(UserRegisterDto dto)
    {
        if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
            throw new Exception("Пользователь с таким Email уже существует.");

        // Генерируем 6-значный код
        var verificationCode = new Random().Next(100000, 999999).ToString();

        var user = new User
        {
            Email = dto.Email,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = dto.IsRestaurantOwner ? "RestaurantOwner" : "User",
            VerificationCode = verificationCode,
            IsEmailVerified = false
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Отправляем письмо с кодом
        var emailMessage = $@"
            <h2>Добро пожаловать в TasteMap!</h2>
            <p>Ваш код подтверждения регистрации: <strong>{verificationCode}</strong></p>";

        await _emailService.SendEmailAsync(user.Email, "Код подтверждения TasteMap", emailMessage);

        // Возвращаем токен (фронтенд сможет пустить юзера на страницу ввода кода)
        var token = GenerateJwtToken(user);

        return new AuthResponseDto
        {
            Token = token,
            Email = user.Email,
            Role = user.Role,
            FirstName = user.FirstName
        };
    }

    public async Task<bool> VerifyEmailAsync(string email, string code)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user == null) throw new Exception("Пользователь не найден.");
        if (user.IsEmailVerified) throw new Exception("Почта уже подтверждена.");
        if (user.VerificationCode != code) throw new Exception("Неверный код подтверждения.");

        user.IsEmailVerified = true;
        user.VerificationCode = null; // Очищаем код после использования
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<AuthResponseDto> LoginAsync(UserLoginDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            throw new Exception("Неверный email или пароль.");

        var token = GenerateJwtToken(user);

        return new AuthResponseDto
        {
            Token = token,
            Email = user.Email,
            Role = user.Role,
            FirstName = user.FirstName
        };
    }

    private string GenerateJwtToken(User user)
    {
        // Берем секретный ключ из appsettings.json (создадим его на следующем шаге)
        var jwtSettings = _configuration.GetSection("Jwt");
        var key = Encoding.ASCII.GetBytes(jwtSettings["Key"]!);

        // Вшиваем в токен данные пользователя (Claims)
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddHours(2), // Токен живет 2 часа
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            Issuer = jwtSettings["Issuer"],
            Audience = jwtSettings["Audience"]
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}