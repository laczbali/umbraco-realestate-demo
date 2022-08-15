using System.Data.Entity;
using umbraco_realestate_demo.Database.Models;

namespace umbraco_realestate_demo.Database
{
    public class ListingContext : DbContext
    {
        public ListingContext() : base("CutomDatabase") { }

        public DbSet<ListingItem> ListingItems { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<Media> Media { get; set; }
    }
}