global using Microsoft.AspNetCore.Mvc;
using AmedimCafeApi.Models;
using Microsoft.OpenApi.Models;
using Npgsql;
using System.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddLogging();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Cafe API", Version = "v1" });
});

// CORS Desteği Ekleniyor
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Add the IConfiguration instance which accesses appsettings.json
IConfiguration configuration = builder.Configuration;

// Add the connection string to the DI container
builder.Services.AddScoped<IDbConnection>(db => new NpgsqlConnection(
    configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// CORS Politikasını Kullan
app.UseCors("AllowAllOrigins");

app.UseAuthorization();

app.MapControllers();

app.Run();
