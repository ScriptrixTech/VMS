
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VMS.Backend.DTOs;
using VMS.Backend.Services;

namespace VMS.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly IReportService _reportService;

    public DashboardController(IReportService reportService)
    {
        _reportService = reportService;
    }

    [HttpGet("stats")]
    public async Task<ActionResult<DashboardStatsResponse>> GetDashboardStats()
    {
        try
        {
            var stats = await _reportService.GetDashboardStatsAsync();
            return Ok(stats);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
