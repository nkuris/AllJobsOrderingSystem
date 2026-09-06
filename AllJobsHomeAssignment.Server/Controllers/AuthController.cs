using AllJobsHomeAssignment.Server.Data;
using AllJobsHomeAssignment.Server.DTOs;
using AllJobsHomeAssignment.Server.Models;
using AllJobsHomeAssignment.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Security.Cryptography;

namespace AllJobsHomeAssignment.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly IConfiguration _config;

    public AuthController(ApplicationDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    // POST: api/auth/register
    // Public endpoint. New users always receive the VIEWER role.
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest req)
    {
        if (await _db.Users.AnyAsync(u => u.Email == req.Email))
            return Conflict(new { message = "Email already registered" });

        var now = DateTime.UtcNow;
        var user = new User
        {
            Email = req.Email,
            PasswordHash = PasswordHasher.Hash(req.Password),
            FirstName = req.FirstName,
            LastName = req.LastName,
            Phone = req.Phone,
            Address = req.Address,
            Role = UserRole.VIEWER,
            CreatedAt = now,
            UpdatedAt = now
        };

        _db.Users.Add(user);
        try
        {
            await _db.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            // Log and return error details to help diagnose DB/migration issues during development
            Console.Error.WriteLine($"Register: SaveChanges failed: {ex}");
            return StatusCode(500, new { message = "Failed to save user", error = ex.Message, detail = ex.InnerException?.Message });
        }

        return Ok(new { message = "Registered" });
    }

    // POST: api/auth/login
    // Public endpoint. Returns JWT on success.
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        var user = await _db.Users.SingleOrDefaultAsync(u => u.Email == req.Email);
        if (user == null) return NotFound(new { message = "Email not found" });

        // Verify password using the current PasswordHasher implementation.
        if (!PasswordHasher.Verify(user.PasswordHash, req.Password))
            return Unauthorized(new { message = "Invalid credentials" });

        var token = GenerateToken(user);

        // create refresh token and store
        var refresh = CreateRefreshToken(user.Id);
        _db.RefreshTokens.Add(refresh);
        try
        {
            await _db.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Login: SaveChanges failed when adding refresh token: {ex}");
            return StatusCode(500, new { message = "Failed to create refresh token", error = ex.Message, detail = ex.InnerException?.Message });
        }

        return Ok(new AuthResponse(token, user.Id, user.Email, user.Role.ToString(), refresh.Token));
    }

    // GET: api/auth/me
    // Requires authentication. Returns basic user info.
    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me()
    {
        var sub = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(sub, out var userId)) return Unauthorized();

        var user = await _db.Users.FindAsync(userId);
        if (user == null) return NotFound();

        return Ok(new { user.Id, user.Email, Role = user.Role.ToString(), user.FirstName, user.LastName });
    }

    private string GenerateToken(User user)
    {
        var jwt = _config.GetSection("Jwt");
        var key = jwt["Key"] ?? throw new InvalidOperationException("JWT Key not configured");
        var issuer = jwt["Issuer"] ?? "AllJobs";
        var audience = jwt["Audience"] ?? "AllJobsClient";
        var expiresMinutes = int.TryParse(jwt["ExpiresMinutes"], out var m) ? m : 60;

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            // Role claim used by [Authorize(Roles = "ADMIN")]
            new Claim(ClaimTypes.Role, user.Role.ToString())
        };

        var keyBytes = Encoding.UTF8.GetBytes(key);
        var securityKey = new SymmetricSecurityKey(keyBytes);
        var creds = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiresMinutes),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private RefreshToken CreateRefreshToken(int userId)
    {
        var rnd = RandomNumberGenerator.GetBytes(32);
        var token = Convert.ToBase64String(rnd);
        return new RefreshToken
        {
            UserId = userId,
            Token = token,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        };
    }

    // POST: api/auth/refresh
    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] string refreshToken)
    {
        if (string.IsNullOrEmpty(refreshToken)) return BadRequest();
        var rt = await _db.RefreshTokens.Include(r => r.User).FirstOrDefaultAsync(r => r.Token == refreshToken);
        if (rt == null || !rt.IsActive) return Unauthorized(new { message = "Invalid refresh token" });

        // rotate
        rt.RevokedAt = DateTime.UtcNow;
        var newRt = CreateRefreshToken(rt.UserId);
        _db.RefreshTokens.Add(newRt);
        await _db.SaveChangesAsync();

        var token = GenerateToken(rt.User!);
        return Ok(new AuthResponse(token, rt.UserId, rt.User!.Email, rt.User.Role.ToString(), newRt.Token));
    }
}
