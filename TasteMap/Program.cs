using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using TasteMap.Application.Interfaces;
using TasteMap.Application.Services;
using TasteMap.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

// --- 1. ВСЕ РЕГИСТРАЦИИ СЕРВИСОВ ДОЛЖНЫ БЫТЬ ЗДЕСЬ (ДО BUILD) ---

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Регистрация наших сервисов
builder.Services.AddScoped<IAuthService, AuthService>();

// Настройка JWT Аутентификации
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.ASCII.GetBytes(jwtSettings["Key"]!);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false; // Для локальной разработки без HTTPS
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidateAudience = true,
        ValidAudience = jwtSettings["Audience"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// Настройка CORS (чтобы React мог делать запросы к API)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Стандартный порт React
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// --- 2. СБОРКА ПРИЛОЖЕНИЯ ---
var app = builder.Build();

// --- 3. НАСТРОЙКА MIDDLEWARE ЗДЕСЬ (ПОСЛЕ BUILD) ---

// АВТОМАТИЧЕСКОЕ ПРИМЕНЕНИЕ МИГРАЦИЙ
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Раздача статических файлов (так как ты переходишь на React, в будущем это можно будет удалить)
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseCors("AllowReactApp");
app.UseAuthentication(); // Строго ДО UseAuthorization
app.UseAuthorization();

app.MapControllers();

app.Run();