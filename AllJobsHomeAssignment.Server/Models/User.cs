using System.ComponentModel.DataAnnotations;

namespace AllJobsHomeAssignment.Server.Models;

public class User
{
    public int Id { get; set; }

    [Required]
    [MaxLength(255)]
    public string Email { get; set; } = null!;

    [Required]
    [MaxLength(512)]
    public string PasswordHash { get; set; } = null!;

    [Required]
    [MaxLength(100)]
    public string FirstName { get; set; } = null!;

    [Required]
    [MaxLength(100)]
    public string LastName { get; set; } = null!;

    [Required]
    [MaxLength(50)]
    public string Phone { get; set; } = null!;

    [Required]
    public string Address { get; set; } = null!;

    public UserRole Role { get; set; } = UserRole.VIEWER;

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
