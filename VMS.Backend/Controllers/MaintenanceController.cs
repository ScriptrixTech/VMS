
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VMS.Backend.DTOs;
using VMS.Backend.Services;

namespace VMS.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MaintenanceController : ControllerBase
{
    private readonly IMaintenanceService _maintenanceService;

    public MaintenanceController(IMaintenanceService maintenanceService)
    {
        _maintenanceService = maintenanceService;
    }

    [HttpGet("vehicle/{vehicleId}")]
    public async Task<ActionResult<List<MaintenanceRecordResponse>>> GetMaintenanceRecords(int vehicleId)
    {
        try
        {
            var records = await _maintenanceService.GetMaintenanceRecordsAsync(vehicleId);
            return Ok(records);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost]
    public async Task<ActionResult<MaintenanceRecordResponse>> CreateMaintenanceRecord([FromBody] MaintenanceRecordRequest request)
    {
        try
        {
            var record = await _maintenanceService.CreateMaintenanceRecordAsync(request);
            return Ok(record);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<MaintenanceRecordResponse>> UpdateMaintenanceRecord(int id, [FromBody] MaintenanceRecordRequest request)
    {
        try
        {
            var record = await _maintenanceService.UpdateMaintenanceRecordAsync(id, request);
            return Ok(record);
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMaintenanceRecord(int id)
    {
        try
        {
            await _maintenanceService.DeleteMaintenanceRecordAsync(id);
            return NoContent();
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("upcoming")]
    public async Task<ActionResult<List<MaintenanceRecordResponse>>> GetUpcomingMaintenance()
    {
        try
        {
            var records = await _maintenanceService.GetUpcomingMaintenanceAsync();
            return Ok(records);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("overdue")]
    public async Task<ActionResult<List<MaintenanceRecordResponse>>> GetOverdueMaintenance()
    {
        try
        {
            var records = await _maintenanceService.GetOverdueMaintenanceAsync();
            return Ok(records);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
