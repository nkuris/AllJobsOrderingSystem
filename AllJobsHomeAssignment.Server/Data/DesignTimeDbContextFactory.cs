using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;

namespace AllJobsHomeAssignment.Server.Data;

public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        // Use the same default connection used in appsettings.json for design-time operations.
        var connectionString = "server=localhost;port=3306;database=AllJobsDb;user=root;password=ChangeMe!";

        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
        // Specify a server version to avoid attempting AutoDetect at design time.
        var serverVersion = new MySqlServerVersion(new Version(8, 0, 32));
        optionsBuilder.UseMySql(connectionString, serverVersion);

        return new ApplicationDbContext(optionsBuilder.Options);
    }
}
