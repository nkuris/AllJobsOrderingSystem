using AllJobsHomeAssignment.Server.Data;
using AllJobsHomeAssignment.Server.Models;
using AllJobsHomeAssignment.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AllJobsHomeAssignment.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Require authentication for all product endpoints
public class ProductsController : ControllerBase
{
    private readonly IProductService _svc;
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(IProductService svc, ILogger<ProductsController> logger)
    {
        _svc = svc;
        _logger = logger;
    }

    // GET: api/products?search=&status=
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] string? search, [FromQuery] ProductStatus? status)
    {
        _logger.LogInformation("Fetching products with search: {search} and status: {status}", search, status);
        try
        {
            if (status.HasValue && !Enum.IsDefined(typeof(ProductStatus), status.Value))
            {
                _logger.LogWarning("Invalid status value: {status}", status);

                return BadRequest(new { message = "Invalid status value." });
            }
            if (!string.IsNullOrEmpty(search) && search.Length > 100)
            {
                _logger.LogWarning("Search string too long: {search}", search);
                return BadRequest(new { message = "Search string too long." });
            }
            var list = await _svc.GetAllAsync(search, status);
            return Ok(list);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching products");
            return StatusCode(500, new { message = "An error occurred while fetching products." });
        }
    }

    // GET: api/products/5
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetOne(int id)
    {

        try
        {
            _logger.LogInformation("Fetching product with ID: {Id}", id);
            var p = await _svc.GetByIdAsync(id);
            if (p == null)
            { _logger.LogWarning("Product not found with ID: {Id}", id); return NotFound(); }

            return Ok(p);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching product with ID: {Id}", id);
            return StatusCode(500, new { message = "An error occurred while fetching the product." });
        }
    }

    // POST: api/products
    // ADMIN only: create a product
    [HttpPost]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> Create([FromBody] Product model)
    {
        try
        {
            _logger.LogInformation("Creating a new product: {@Product}", model);
            var created = await _svc.CreateAsync(model);
            return CreatedAtAction(nameof(GetOne), new { id = created.Id }, created);
        }
        catch (ArgumentException aex)
        {
            _logger.LogWarning(aex, "Validation error creating product: {@Product}", model);
            return BadRequest(new { message = aex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating product: {@Product}", model);
            return StatusCode(500, new { message = "An error occurred while creating the product." });
        }
    }

    // PUT: api/products/5
    // ADMIN only: update product
    [HttpPut("{id:int}")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> Update(int id, [FromBody] Product updated)
    {
        _logger.LogInformation("Updating product with ID: {Id} ", id);

        if (updated == null)
        {
            _logger.LogWarning("Update request with null product data for ID: {Id}", id);
            return BadRequest(new { message = "Invalid product data." });
        }
        try
        {
            await _svc.UpdateAsync(id, updated);
            return NoContent();
        }
        catch (ArgumentException aex)
        {
            _logger.LogWarning(aex, "Validation error updating product ID {Id}", id);
            return BadRequest(new { message = aex.Message });
        }
        catch (KeyNotFoundException)
        {
            _logger.LogWarning("Product not found with ID: {Id}", id);
            return NotFound();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating product with ID: {Id}", id);
            return StatusCode(500, new { message = "An error occurred while updating the product." });
        }
    }

    // PATCH: api/products/5/status
    // ADMIN only: toggle status
    [HttpPatch("{id:int}/status")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> ToggleStatus(int id)
    {
        _logger.LogInformation("Toggling status for product with ID: {Id}", id);
        try
        {
            if (id == 0)
            {
                _logger.LogWarning("Invalid product ID: {Id}", id);
                return BadRequest(new { message = "Invalid product ID." });
            }

            var p = await _svc.ToggleStatusAsync(id);
            if (p == null) return NotFound();
            return Ok(p);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error toggling status for product with ID: {Id}", id);
            return StatusCode(500, new { message = "An error occurred while toggling the product status." });
        }
    }
}
