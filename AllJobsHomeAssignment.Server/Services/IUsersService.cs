using AllJobsHomeAssignment.Server.Models;

namespace AllJobsHomeAssignment.Server.Services;

public interface IUsersService
{
    Task<List<User>> GetAllAsync();
    Task<User?> GetByIdAsync(int id);
    Task<bool> UpdateRoleAsync(int id, UserRole role);
    Task<bool> DeleteAsync(int id);
}
