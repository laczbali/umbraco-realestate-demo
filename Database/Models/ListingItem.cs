using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace umbraco_realestate_demo.Database.Models
{
    public class ListingItem
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime CreateDate { get; set; }

        public string Contact { get; set; }
        public string Description { get; set; }
        public string HeadLine { get; set; }
        public virtual List<Media> Media { get; set; } = new List<Media>();
        public string ListingType { get; set; } // TODO validate
        public int Price { get; set; }
        public string Region { get; set; } // TODO validate
        public int Rooms { get; set; }
        public int Size { get; set; }
        public virtual List<Tag> Tags { get; set; } = new List<Tag>();
    }
}