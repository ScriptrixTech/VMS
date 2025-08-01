
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VMS.Backend.DTOs;
using VMS.Backend.Services;

namespace VMS.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class VehiclesController : ControllerBase
{
    private readonly IVehicleService _vehicleService;

    public VehiclesController(IVehicleService vehicleService)
    {
        _vehicleService = vehicleService;
    }

    [HttpGet]
    public async Task<ActionResult<List<VehicleResponse>>> GetVehicles([FromQuery] VehicleSearchRequest searchRequest)
    {
        try
        {
            var vehicles = await _vehicleService.GetVehiclesAsync(searchRequest);
            return Ok(vehicles);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<VehicleResponse>> GetVehicle(int id)
    {
        try
        {
            var vehicle = await _vehicleService.GetVehicleByIdAsync(id);
            return Ok(vehicle);
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

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<VehicleResponse>> CreateVehicle([FromBody] VehicleRequest request)
    {
        try
        {
            var vehicle = await _vehicleService.CreateVehicleAsync(request);
            return CreatedAtAction(nameof(GetVehicle), new { id = vehicle.Id }, vehicle);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<VehicleResponse>> UpdateVehicle(int id, [FromBody] VehicleRequest request)
    {
        try
        {
            var vehicle = await _vehicleService.UpdateVehicleAsync(id, request);
            return Ok(vehicle);
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteVehicle(int id)
    {
        try
        {
            await _vehicleService.DeleteVehicleAsync(id);
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

    [HttpPost("{id}/assign")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AssignVehicle(int id, [FromBody] VehicleAssignRequest request)
    {
        try
        {
            await _vehicleService.AssignVehicleAsync(id, request);
            return Ok(new { message = "Vehicle assigned successfully" });
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

    [HttpPost("{id}/unassign")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UnassignVehicle(int id)
    {
        try
        {
            await _vehicleService.UnassignVehicleAsync(id);
            return Ok(new { message = "Vehicle unassigned successfully" });
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

    [HttpPost("validate-vin")]
    public async Task<IActionResult> ValidateVIN([FromBody] string vin)
    {
        try
        {
            var isValid = await _vehicleService.ValidateVINAsync(vin);
            return Ok(new { isValid });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
