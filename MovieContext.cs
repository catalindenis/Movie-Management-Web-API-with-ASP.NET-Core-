using Microsoft.EntityFrameworkCore;
using Movie_App.Models;

namespace Movie_App.Data;

public class MovieContext : DbContext
{
    public MovieContext(DbContextOptions<MovieContext> options) : base(options) { }

    public DbSet<Movie> Movies { get; set; } = null!;
    public DbSet<User> Users { get; set; } = null!;

    public Task<List<Movie>> GetAllAsync() => Movies.ToListAsync();

    public async Task<Movie?> GetByIdAsync(int id) =>
        await Movies.Where(i => i.Id == id).FirstOrDefaultAsync();

    public async Task AddAsync(Movie item)
    {
        await Movies.AddAsync(item);
        await base.SaveChangesAsync();
    }

    public async Task UpdateAsync(Movie item)
    {
        Movies.Update(item);
        await base.SaveChangesAsync();
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var item = await Movies.Where(i => i.Id == id).FirstOrDefaultAsync();
        if (item == null) return false;

        Movies.Remove(item);
        await base.SaveChangesAsync();
        return true;
    }
}