
using VMS.Backend.DTOs;
using VMS.Backend.Models;

namespace VMS.Backend.Services;

public interface IUserService
{
    Task<IEnumerable<UserResponse>> GetAllUsersAsync();
    Task<UserResponse> GetUserByIdAsync(string userId);
    Task<UserResponse> UpdateUserAsync(string userId, UpdateUserRequest request);
    Task DeleteUserAsync(string userId);
    Task<IEnumerable<UserResponse>> GetUsersByRoleAsync(string role);
    Task AssignRoleAsync(string userId, string role);
    Task RemoveRoleAsync(string userId, string role);
}
