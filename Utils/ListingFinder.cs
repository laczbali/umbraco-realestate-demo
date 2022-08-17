using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Umbraco.Core;
using Umbraco.Web;
using Umbraco.Web.Models;
using Umbraco.Web.PublishedModels;
using Umbraco.Examine;
using System.Collections.Specialized;
using umbraco_realestate_demo.Database;

namespace umbraco_realestate_demo.Utils
{
    public class ListingFinder
    {
        /// <summary>
        /// Returns a listing item from the custom DB
        /// </summary>
        /// <param name="id">The items ID in the custom DB</param>
        /// <returns></returns>
        public static Database.Models.ListingItem GetListing(int id)
        {
            using (var context = new ListingContext())
            {
                var item = context.ListingItems
                    .Include("Media").Include("Tags")
                    .FirstOrDefault(i => i.Id == id);
                return item;
            }
        }

        /// <summary>
        /// Returns the latest items from the custom DB (based on the CreateDate field)
        /// </summary>
        /// <param name="numItems">How many items should it return</param>
        /// <returns></returns>
        public static IEnumerable<Database.Models.ListingItem> GetLatest(int numItems = 3)
        {
            using (var context = new ListingContext())
            {
                var latest = context.ListingItems
                    .Include("Media")
                    .OrderByDescending(x => x.CreateDate).Take(numItems);
                return latest.ToList();
            }
        }

        /// <summary>
        /// Will perform an Examine search on all listing fields
        /// Returns ListingItem-s matching the 'searchTerm'
        /// </summary>
        /// <param name="searchTerm"></param>
        /// <returns></returns>
        public static IEnumerable<ListingItem> SearchListings(string searchTerm)
        {
            Examine.ExamineManager.Instance.TryGetIndex("ExternalIndex", out var index);
            var searcher = index.GetSearcher();
            var results = searcher
                .CreateQuery("content")
                .NodeTypeAlias("listingItem")
                .And()
                .ManagedQuery(searchTerm)
                .Execute()
                .Where(res => res.Id != null);

            var helper = Umbraco.Web.Composing.Current.UmbracoHelper;
            return results
                .Select(res => helper.Content(res.Id))
                .OfType<ListingItem>();
        }

        /// <summary>
        /// Returns a subset of ListingItem-s, based on the query params passed.
        /// Will check listing type, region, tags, area, rooms, price (if params are provided)
        /// </summary>
        /// <param name="queryString">Request.QueryString</param>
        /// <returns></returns>
        public static IEnumerable<Database.Models.ListingItem> FilterListings(NameValueCollection queryParams)
        {
            var types = queryParams["type"] != null ? queryParams["type"].Split(',') : new string[] {};
            var typeslen = types.Length; // ( 'ArrayLength' is not supported in LINQ to Entities. )

            var regions = queryParams["region"] != null ? queryParams["region"].Split(',') : new string[] {};
            var regionlen = regions.Length; // ( 'ArrayLength' is not supported in LINQ to Entities. )

            var tags = queryParams["tags"] != null ? queryParams["tags"].Split(',') : new string[] {};
            var taglen = tags.Length;  // ( 'ArrayLength' is not supported in LINQ to Entities. )

            int.TryParse(queryParams["min-area"], out int minArea);
            int.TryParse(queryParams["min-rooms"], out int minRooms);
            int.TryParse(queryParams["max-price"], out int maxPrice);
            if (maxPrice == 0) { maxPrice = int.MaxValue; }

            using (var context = new ListingContext())
            {
                var filteredListings = context.ListingItems
                    .Include("Tags").Include("Media")
                    .Where(x =>
                        x.Size >= minArea
                        && x.Rooms >= minRooms
                        && x.Price <= maxPrice
                        && (typeslen == 0 || types.Contains(x.ListingType))
                        && (regionlen == 0 || regions.Contains(x.Region))
                        && (x.Tags.Select(t => t.Name).Intersect(tags).Count() == taglen)
                    );

                return filteredListings.ToList();
            }
        }

    }
}