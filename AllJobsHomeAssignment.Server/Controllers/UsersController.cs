using AllJobsHomeAssignment.Server.Models;
using AllJobsHomeAssignment.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AllJobsHomeAssignment.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "ADMIN")]
public class UsersController : ControllerBase
{
    private readonly IUsersService _svc;
    private readonly ILogger<UsersController> _logger;

    public UsersController(IUsersService svc, ILogger<UsersController> logger)
    {
        _svc = svc;
        _logger = logger;
    }

    // GET: api/users
    [HttpGet]
    public IActionResult GetAll()
    {
        _logger.LogInformation("Listing all users");
        var users = _svc.GetAllAsync().Result.Select(u => new {
            u.Id, u.Email, u.FirstName, u.LastName, u.Phone, u.Address, Role = u.Role, u.CreatedAt, u.UpdatedAt
        }).ToList();
        return Ok(users);
    }

    // GET: api/users/5
    [HttpGet("{id:int}")]
    public IActionResult GetOne(int id)
    {
        var u = _svc.GetByIdAsync(id).Result;
        if (u == null) return NotFound();
        return Ok(new { u.Id, u.Email, u.FirstName, u.LastName, u.Phone, u.Address, Role = u.Role, u.CreatedAt, u.UpdatedAt });
    }

    public class UpdateRoleDto { public UserRole Role { get; set; } }

    // PUT: api/users/5/role
    [HttpPut("{id:int}/role")]
    public async Task<IActionResult> UpdateRole(int id, [FromBody] UpdateRoleDto dto)
    {
        var ok = await _svc.UpdateRoleAsync(id, dto.Role);
        if (!ok) return NotFound();
        _logger.LogInformation("Updated role for user {UserId} to {Role}", id, dto.Role);
        return NoContent();
    }

    // DELETE: api/users/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var ok = await _svc.DeleteAsync(id);
        if (!ok) return NotFound();
        _logger.LogInformation("Deleted user {UserId}", id);
        return NoContent();
    }
}
