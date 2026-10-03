using System;
using TasteMap.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1. Регистрируем подключение к базе данных (Этого блока не хватало)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Регистрируем контроллеры
builder.Services.AddControllers();

// 3. Регистрируем Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 4. Регистрируем авторизацию
builder.Services.AddAuthorization();

var app = builder.Build();

// АВТОМАТИЧЕСКОЕ ПРИМЕНЕНИЕ МИГРАЦИЙ
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    // Это автоматически создаст базу в Docker и накатит таблицы
    dbContext.Database.Migrate();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Раздача статических файлов (HTML из wwwroot)
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseAuthorization();

app.MapControllers();

app.Run();