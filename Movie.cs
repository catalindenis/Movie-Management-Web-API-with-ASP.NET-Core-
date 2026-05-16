public class Movie
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public string? Genre { get; set; }
    public int Year { get; set; }
    public double Rating { get; set; }
    public string? PosterUrl { get; set; }    
    public string? ImdbRating { get; set; }   
    public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;

    
    public int UserId { get; set; }
    public string? Plot { get; set; }
}