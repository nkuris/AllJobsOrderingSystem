using System;
using System.Security.Cryptography;

namespace AllJobsHomeAssignment.Server.Services;

public static class PasswordHasher
{
    public static string Hash(string password)
    {
        const int iterations = 100_000;
        using var rng = RandomNumberGenerator.Create();
        var salt = new byte[16];
        rng.GetBytes(salt);

        // Use static Pbkdf2 method (constructors are obsolete)
        var hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, iterations, HashAlgorithmName.SHA256, 32);
        return $"{iterations}.{Convert.ToBase64String(salt)}.{Convert.ToBase64String(hash)}";
    }

    public static bool Verify(string hashedPassword, string providedPassword)
    {
        if (string.IsNullOrEmpty(hashedPassword)) return false;
        var parts = hashedPassword.Split('.');
        if (parts.Length != 3) return false;

        if (!int.TryParse(parts[0], out var iterations)) return false;
        var salt = Convert.FromBase64String(parts[1]);
        var storedHash = Convert.FromBase64String(parts[2]);

        var computed = Rfc2898DeriveBytes.Pbkdf2(providedPassword, salt, iterations, HashAlgorithmName.SHA256, storedHash.Length);
        return CryptographicOperations.FixedTimeEquals(computed, storedHash);
    }
}
