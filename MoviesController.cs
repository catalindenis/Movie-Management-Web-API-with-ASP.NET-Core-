using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Movie_App.Data;
using Movie_App.Models;
using Movie_App.ModelsDTO;

namespace Movie_App.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MoviesController : ControllerBase
{
    private readonly MovieContext _context;

    public MoviesController(MovieContext context)
    {
        _context = context;
    }

   
    [HttpGet]
    public async Task<ActionResult<List<Movie>>> Get([FromQuery] int userId)
    {
        var items = await _context.Movies.Where(m => m.UserId == userId).ToListAsync();
        return Ok(items);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Movie>> GetById(int id)
    {
        var item = await _context.Movies.FirstOrDefaultAsync(i => i.Id == id);
        return item == null ? NotFound() : Ok(item);
    }

    [HttpPost]
    public async Task<ActionResult> Post(AddMovie itemToBeAdded, [FromQuery] int userId)
    {
        using (var client = new HttpClient())
        {
            string apiKey = "e8bf6825";
            var response = await client.GetFromJsonAsync<OmdbResponse>($"http://www.omdbapi.com/?t={itemToBeAdded.Title}&apikey={apiKey}");

            if (response == null || response.Response == "False")
            {
                return BadRequest("Film negăsit!");
            }

            var movie = new Movie
            {
                Title = itemToBeAdded.Title,
                UserId = userId,
                // Prioritizăm datele din API
                Year = int.TryParse(response.Year?.Substring(0, 4), out int y) ? y : itemToBeAdded.Year,
                Genre = itemToBeAdded.Genre,
                Rating = itemToBeAdded.Rating,
                PosterUrl = response.Poster,
                ImdbRating = response.imdbRating,
                Plot = response.Plot 
            };

            _context.Movies.Add(movie);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var movie = await _context.Movies.FindAsync(id);
        if (movie == null) return NotFound();

        _context.Movies.Remove(movie);
        await _context.SaveChangesAsync();
        return Ok();
    }
}


public class OmdbResponse
{
    public string? Response { get; set; }
    public string? Poster { get; set; }
    public string? imdbRating { get; set; }
    public string? Year { get; set; } 
    public string? Plot { get; set; }
}