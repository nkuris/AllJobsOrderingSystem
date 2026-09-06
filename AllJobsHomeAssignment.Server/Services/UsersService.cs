using AllJobsHomeAssignment.Server.Data;
using AllJobsHomeAssignment.Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace AllJobsHomeAssignment.Server.Services;

public class UsersService : IUsersService
{
    private readonly ApplicationDbContext _db;
    private readonly ILogger<UsersService> _logger;

    public UsersService(ApplicationDbContext db, ILogger<UsersService> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task<List<User>> GetAllAsync()
    {
        _logger.LogInformation("Fetching all users");
        return await _db.Users.OrderBy(u => u.Id).ToListAsync();
    }

    public async Task<User?> GetByIdAsync(int id)
    {
        _logger.LogInformation("Fetching user by id: {UserId}", id);
        return await _db.Users.FindAsync(id);
    }

    public async Task<bool> UpdateRoleAsync(int id, UserRole role)
    {
        var u = await _db.Users.FindAsync(id);
        if (u == null)
        {
            _logger.LogWarning("Attempted to update role for non-existent user {UserId}", id);
            return false;
        }
        _logger.LogInformation("Updating role for user {UserId} to {Role}", id, role);
        u.Role = role;
        u.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var u = await _db.Users.FindAsync(id);
        if (u == null)
        {
            _logger.LogWarning("Attempted to delete non-existent user {UserId}", id);
            return false;
        }
        _db.Users.Remove(u);
        await _db.SaveChangesAsync();
        _logger.LogInformation("Deleted user {UserId}", id);
        return true;
    }
}
