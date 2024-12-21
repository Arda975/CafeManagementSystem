using Microsoft.AspNetCore.Mvc;
using AmedimCafeApi.Models;
using Dapper;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.SqlServer.Server;
using Swashbuckle.AspNetCore.Annotations;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace AmedimCafeAPI_Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class Cafe_Controller : Controller
    {

        private readonly ILogger<Cafe_Controller> _logger;
        private readonly IConfiguration _configuration;
        public Cafe_Controller(ILogger<Cafe_Controller> logger, IConfiguration configuration)
        {
            _configuration = configuration;
            _configuration = configuration;
        }



        [HttpGet("GetMenuWithCode")]
        public async Task<IActionResult> GetDishes(int category_id)
        {
            try
            {
                // Veritabaný baðlantý dizesini al
                string connectionString = _configuration.GetConnectionString("DefaultConnection");

                // Veritabaný baðlantýsýný aç
                using (IDbConnection db = new Npgsql.NpgsqlConnection(connectionString))
                {

                    // Fonksiyonu çaðýran sorgu
                    var queryParameters = new { category_id }; // Parametreyi ekliyoruz
                    var result = await db.QueryAsync("SELECT ItemName, Description, Price, Image FROM getitemsbycategory(@category_id)", queryParameters);

                    // Sonuç döndürülüyor
                    return Ok(result);

                }
            }
            catch (Exception ex)
            {
                // Hata durumunda geri dön
                return StatusCode(500, $"Veri çekme hatasý: {ex.Message}");
            }
        }



        [HttpPost("InsertOrder")]
        public async Task<IActionResult> InsertOrder([FromBody] OrderRequest request)
        {
            try
            {
                if (request == null || request.TableId <= 0 || string.IsNullOrEmpty(request.OrderContent) || request.TotalAmount <= 0)
                {
                    return BadRequest("Geçersiz istek parametreleri.");
                }

                // Ýstek verilerini logla
                Console.WriteLine($"TableId: {request.TableId}, OrderContent: {request.OrderContent}, TotalAmount: {request.TotalAmount}");

                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (IDbConnection db = new Npgsql.NpgsqlConnection(connectionString))
                {
                    var queryParameters = new { TableId = request.TableId, OrderContent = request.OrderContent, TotalAmount = request.TotalAmount };
                    var sql = "CALL InsertOrder(@TableId, @OrderContent, @TotalAmount);";

                    await db.ExecuteAsync(sql, queryParameters);

                    return Ok("Sipariþ baþarýyla eklendi.");
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, $"Veri ekleme hatasý: {e.Message}");
            }
        }





    }
}
