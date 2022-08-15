using System.Collections.Generic;

namespace umbraco_realestate_demo.Database.Models
{
    public class Media
    {
        public Media() { }
        public Media(string filePath)
        {
            Filepath = filePath;
        }

        public int Id { get; set; }
        public string Filepath { get; set; }

        public virtual ListingItem ListingItem { get; set; }
        public int ListingItemId { get; set; }
    }
}