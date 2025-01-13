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
using Npgsql;

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
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
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
                // Gelen isteði doðrula
                if (request == null || request.TableId <= 0 || string.IsNullOrEmpty(request.OrderContent) || request.TotalAmount <= 0)
                {
                    return BadRequest("Geçersiz istek parametreleri.");
                }

                // Ýstek verilerini logla (isteðe baðlý)
                Console.WriteLine($"TableId: {request.TableId}, OrderContent: {request.OrderContent}, TotalAmount: {request.TotalAmount}");

                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (IDbConnection db = new Npgsql.NpgsqlConnection(connectionString))
                {
                    // Prosedürü çaðýr
                    var parameters = new
                    {
                        TableId = request.TableId,
                        OrderContent = request.OrderContent,
                        TotalAmount = request.TotalAmount
                    };

                    var sql = "CALL InsertOrder(@TableId, @OrderContent, @TotalAmount);";

                    await db.ExecuteAsync(sql, parameters);

                    return Ok("Sipariþ baþarýyla eklendi.");
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, $"Sipariþ ekleme hatasý: {e.Message}");
            }
        }


        [HttpGet("AdminControl")]
        public async Task<IActionResult> AdminControl(string name, string password)
        {
            try
            {
                // Veritabaný baðlantý dizesini al
                string connectionString = _configuration.GetConnectionString("DefaultConnection");

                // Veritabaný baðlantýsýný aç
                using (IDbConnection db = new Npgsql.NpgsqlConnection(connectionString))
                {
                    // Fonksiyonu çaðýran sorgu
                    var query = "SELECT check_user_credentials(@name, @password)";
                    var queryParameters = new { name, password }; // Parametreyi ekliyoruz
                    var result = await db.QueryFirstOrDefaultAsync<bool>(query, queryParameters);

                    // Sonuç döndürülüyor
                    if (result)
                    {
                        return Ok("Kullanýcý doðrulandý.");
                    }
                    else
                    {
                        return Unauthorized("Kullanýcý adý veya þifre yanlýþ.");
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Veri ekleme hatasý: {ex.Message}");
            }
        }


        [HttpGet("GetTables")]
        public async Task<IActionResult> GetTables()
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (IDbConnection db = new Npgsql.NpgsqlConnection(connectionString))
                {
                    var sql = "SELECT * FROM tables Order By table_id asc;";
                    var result = await db.QueryAsync(sql);

                    return Ok(result);
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, $"Veri çekme hatasý: {e.Message}");
            }
        }


        [HttpGet("GetTableDetail")]
        public async Task<IActionResult> GetTableDetail(int table_id)
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (IDbConnection db = new Npgsql.NpgsqlConnection(connectionString))
                {
                    // PostgreSQL fonksiyonunu çaðýr
                    var sql = "SELECT get_order_details_by_table(@TableId)";
                    var result = await db.QuerySingleAsync<string>(sql, new { TableId = table_id });

                    return Ok(result); // React'a metin olarak döndür
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, $"Veri çekme hatasý: {e.Message}");
            }
        }


        [HttpPost("Payment")]
        public async Task<IActionResult> Payment(int table_id)
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (IDbConnection db = new Npgsql.NpgsqlConnection(connectionString))
                {
                    // PostgreSQL fonksiyonunu çaðýr
                    var sql = "SELECT payment(@TableId)";
                    var result = await db.QuerySingleAsync<string>(sql, new { TableId = table_id });

                    return Ok(); // Baþarýlý yanýt döndür
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, $"Veri çekme hatasý: {e.Message}");
            }
        }


        [HttpPost("AddProduct")]
        public async Task<IActionResult> AddProduct([FromForm] Product newProduct)
        {
            try
            {
                string filePath = null;
                if (newProduct.Image != null)
                {
                    var fileName = Path.GetFileName(newProduct.Image.FileName);
                    var savePath = Path.Combine(@"C:\Users\arda_\KOD DOSYALARI\CafeManagementSystem\react-app\cafe_management_system\public\assets\", fileName);
                    using (var stream = new FileStream(savePath, FileMode.Create))
                    {
                        await newProduct.Image.CopyToAsync(stream);
                    }
                    filePath = $"assets/{fileName}"; // Dosya yolunu text formatýnda belirliyoruz
                }

                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (IDbConnection db = new Npgsql.NpgsqlConnection(connectionString))
                {
                    var sql = "INSERT INTO products (itemname, description, price, categoryid, image) VALUES (@Name, @Description, @Price, @CategoryId, @Image)";
                    var parameters = new
                    {
                        Name = newProduct.Name,
                        Description = newProduct.Description,
                        Price = newProduct.Price,
                        CategoryId = newProduct.CategoryId,
                        Image = filePath // Dosya yolunu text formatýnda SQL'e gönderiyoruz
                    };
                    await db.ExecuteAsync(sql, parameters);

                    return Ok("Ürün baþarýyla eklendi!");
                }
            }
            catch (Exception e)
            {
                // Hata mesajýný günlüðe kaydet
                _logger.LogError(e, "Ürün eklenirken bir hata oluþtu.");
                return StatusCode(500, $"Ürün eklenirken bir hata oluþtu: {e.Message}");
            }
        }


        [HttpDelete("DeleteProduct")]
        public async Task<IActionResult> DeleteProduct([FromQuery] int item_id)
        {
            try
            {
                var query = "DELETE FROM products WHERE itemid = @name";
                using (var connection = new NpgsqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    using (var command = new NpgsqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@name", item_id);
                        var result = await command.ExecuteNonQueryAsync();
                        if (result == 0)
                        {
                            return NotFound("Belirtilen ürün bulunamadý.");
                        }
                    }
                }
                return Ok("Ürün baþarýyla silindi.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Bir hata oluþtu: {ex.Message}");
            }
        }


        [HttpGet("GetProducts")]
        public async Task<IActionResult> GetProducts()
        {
            try
            {
                var query = "SELECT itemid, itemname, description, price, categoryid, image FROM products";
                using (var connection = new NpgsqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    using (var command = new NpgsqlCommand(query, connection))
                    {
                        var reader = await command.ExecuteReaderAsync();
                        var products = new List<object>();
                        while (await reader.ReadAsync())
                        {
                            products.Add(new
                            {
                                Id = reader.GetInt32(0),
                                Name = reader.GetString(1),
                                Description = reader.GetString(2),
                                Price = reader.GetInt32(3),
                                CategoryId = reader.GetInt32(4),
                                Image = reader.GetString(5)
                            });
                        }
                        return Ok(products);
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Bir hata oluþtu: {ex.Message}");
            }
        }


        [HttpPut("UpdateProduct")]
        public async Task<IActionResult> UpdateProduct(string name, int price)
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (IDbConnection db = new Npgsql.NpgsqlConnection(connectionString))
                {
                    var sql = "UPDATE Products SET price = @price WHERE itemname = @name";
                    var parameters = new
                    {
                        name,
                        price
                    };

                    var rowsAffected = await db.ExecuteAsync(sql, parameters);

                    if (rowsAffected > 0)
                        return Ok("Ürün baþarýyla güncellendi!");

                    return NotFound("Ürün bulunamadý.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UpdateProduct Hata Var!!");
                return StatusCode(500, $"UpdateProduct Hata Var!! : {ex.Message}");
            }
        }


        [HttpGet("GetCategories")]
        public async Task<IActionResult> GetCategories()
        {
            try
            {
                var query = "SELECT category_id, categoryname FROM categories";
                using (var connection = new NpgsqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    using (var command = new NpgsqlCommand(query, connection))
                    {
                        var reader = await command.ExecuteReaderAsync();
                        var categories = new List<object>();
                        while (await reader.ReadAsync())
                        {
                            categories.Add(new
                            {
                                Id = reader.GetInt32(0),
                                Name = reader.GetString(1)
                            });
                        }
                        return Ok(categories);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Kategoriler alýnýrken bir hata oluþtu.");
                return StatusCode(500, $"Kategoriler alýnýrken bir hata oluþtu: {ex.Message}");
            }
        }


        [HttpGet("GetUsers")]
        public async Task<IActionResult> GetUsers()
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (IDbConnection db = new Npgsql.NpgsqlConnection(connectionString))
                {
                    var query = "SELECT * FROM users";
                    var result = await db.QueryAsync(query);

                    return Ok(result);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Kullanýcýlar getirilirken bir sorun oldu!!");
                return StatusCode(500, $"Kullanýcýlar getirilirken bir sorun oldu!! : {ex.Message}");
            }
        }


        [HttpPut("UpdateUser")]
        public async Task<IActionResult> UpdateUser([FromQuery] int user_id, [FromBody] Users user)
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (IDbConnection db = new Npgsql.NpgsqlConnection(connectionString))
                {
                    var query = "UPDATE users SET username = @Name, password = @Password WHERE userid = @User_id";
                    var paramaters = new
                    {
                        Name = user.Username,
                        Password = user.Password,
                        User_id = user_id
                    };

                    var result = await db.QueryAsync(query, paramaters);

                    return Ok("Kullanýcý Güncellendi");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Kullanýcýlar güncellenirken bir sorun oldu!!");
                return StatusCode(500, $"Kullanýcýlar güncellenirken bir sorun oldu!! : {ex.Message}");
            }
        }


        [HttpPost("AddUser")]
        public async Task<IActionResult> AddUser([FromBody] Users user)
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (IDbConnection db = new Npgsql.NpgsqlConnection(connectionString))
                {
                    // Yeni kullanýcý eklemek için INSERT INTO sorgusu
                    var query = "INSERT INTO users (username, password) VALUES (@Username, @Password)";
                    var parameters = new
                    {
                        Username = user.Username,
                        Password = user.Password
                    };

                    // Sorguyu çalýþtýr
                    var result = await db.ExecuteAsync(query, parameters);

                    // Eðer iþlem baþarýlýysa kullanýcýyý eklediðimiz mesajý döndür
                    return Ok("Kullanýcý baþarýyla eklendi.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Kullanýcý eklenirken bir sorun oldu!!");
                return StatusCode(500, $"Kullanýcý eklenirken bir sorun oldu!! : {ex.Message}");
            }
        }


        [HttpDelete("DeleteUser")]
        public async Task<IActionResult> DeleteUser([FromQuery] int user_id)
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (IDbConnection db = new Npgsql.NpgsqlConnection(connectionString))
                {
                    // Yeni kullanýcý eklemek için INSERT INTO sorgusu
                    var query = "DELETE FROM users WHERE userid = @User_id";
                    var parameters = new
                    {
                       User_id = user_id
                    };

                    // Sorguyu çalýþtýr
                    var result = await db.ExecuteAsync(query, parameters);

                    // Eðer iþlem baþarýlýysa kullanýcýyý eklediðimiz mesajý döndür
                    return Ok("Kullanýcý baþarýyla silindi.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Kullanýcý silinirken bir sorun oldu!!");
                return StatusCode(500, $"Kullanýcý silinirken bir sorun oldu!! : {ex.Message}");
            }
        }

    }
}
