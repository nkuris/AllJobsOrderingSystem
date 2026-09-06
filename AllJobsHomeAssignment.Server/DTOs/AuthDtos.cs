namespace AllJobsHomeAssignment.Server.DTOs;

public record LoginRequest(string Email, string Password);

public record RegisterRequest(string Email, string Password, string FirstName, string LastName, string Phone, string Address);

public record AuthResponse(string AccessToken, int UserId, string Email, string Role, string RefreshToken);
