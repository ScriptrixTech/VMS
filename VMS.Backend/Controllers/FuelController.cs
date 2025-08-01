
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VMS.Backend.DTOs;
using VMS.Backend.Services;

namespace VMS.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FuelController : ControllerBase
{
    private readonly IFuelService _fuelService;

    public FuelController(IFuelService fuelService)
    {
        _fuelService = fuelService;
    }

    [HttpGet("vehicle/{vehicleId}")]
    public async Task<ActionResult<List<FuelRecordResponse>>> GetFuelRecords(int vehicleId)
    {
        try
        {
            var records = await _fuelService.GetFuelRecordsAsync(vehicleId);
            return Ok(records);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost]
    public async Task<ActionResult<FuelRecordResponse>> CreateFuelRecord([FromBody] FuelRecordRequest request)
    {
        try
        {
            var record = await _fuelService.CreateFuelRecordAsync(request);
            return Ok(record);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<FuelRecordResponse>> UpdateFuelRecord(int id, [FromBody] FuelRecordRequest request)
    {
        try
        {
            var record = await _fuelService.UpdateFuelRecordAsync(id, request);
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
    public async Task<IActionResult> DeleteFuelRecord(int id)
    {
        try
        {
            await _fuelService.DeleteFuelRecordAsync(id);
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

    [HttpGet("efficiency/{vehicleId}")]
    public async Task<ActionResult<FuelEfficiencyReport>> GetFuelEfficiencyReport(
        int vehicleId, 
        [FromQuery] DateTime startDate, 
        [FromQuery] DateTime endDate)
    {
        try
        {
            var report = await _fuelService.GetFuelEfficiencyReportAsync(vehicleId, startDate, endDate);
            return Ok(report);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
