using AmedimCafeApi.Auth;
using AmedimCafeApi.Dtos;
using AmedimCafeApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AmedimCafeApi.Controllers;

/// <summary>Table overview and payment: available to every staff member (Admin and Waiter).</summary>
[ApiController]
[Route("api/tables")]
[Authorize(Roles = Roles.Staff)]
public class TablesController(ITableService tableService) : ControllerBase
{
    [HttpGet]
    public Task<IReadOnlyList<TableSummaryDto>> GetAll(CancellationToken ct) => tableService.GetAllAsync(ct);

    [HttpGet("{id:int}")]
    public Task<TableDetailDto> GetDetail(int id, CancellationToken ct) => tableService.GetDetailAsync(id, ct);

    /// <summary>Closes all open orders of the table.</summary>
    [HttpPost("{id:int}/payment")]
    public Task<PaymentResultDto> Pay(int id, CancellationToken ct) => tableService.PayAsync(id, ct);
}
