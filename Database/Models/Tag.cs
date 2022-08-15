using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace umbraco_realestate_demo.Database.Models
{
    public class Tag
    {
        public Tag() { }
        public Tag(string name)
        {
            Name = name;
        }

        [Key]
        public string Name { get; set; }
        public virtual List<ListingItem> ListingItems { get; set; } = new List<ListingItem>();
    }
}