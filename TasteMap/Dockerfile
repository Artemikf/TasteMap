# 1. Этап сборки (SDK .NET 9)
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Копируем csproj файлы и восстанавливаем зависимости
COPY ["TasteMap/TasteMap.csproj", "TasteMap/"]
COPY ["TasteMap.Application/TasteMap.Application.csproj", "TasteMap.Application/"]
COPY ["TasteMap.Domain/TasteMap.Domain.csproj", "TasteMap.Domain/"]
COPY ["TasteMap.Infrastructure/TasteMap.Infrastructure.csproj", "TasteMap.Infrastructure/"]
RUN dotnet restore "TasteMap/TasteMap.csproj"

# Копируем весь исходный код и собираем
COPY . .
WORKDIR "/src/TasteMap"
RUN dotnet publish "TasteMap.csproj" -c Release -o /app/publish /p:UseAppHost=false

# 2. Этап выполнения (Runtime .NET 9)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "TasteMap.dll"]