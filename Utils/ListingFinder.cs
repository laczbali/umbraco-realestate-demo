﻿using System;
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
		public static Database.Models.ListingItem GetListingFromDb(int id)
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
		public static IEnumerable<Database.Models.ListingItem> GetLatestFromDb(int numItems = 3)
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
		public static IEnumerable<ListingItem> FilterListings(NameValueCollection queryParams)
		{
			var helper = Umbraco.Web.Composing.Current.UmbracoHelper;
			var listingParent = helper.ContentAtXPath("//listings[@isDoc]").First();

			// get all listings, sort by most recent first
			var allListings = listingParent
				.Children()
				.OfType<ListingItem>()
				.Where(x => x.IsVisible())
				.OrderByDescending(x => x.CreateDate);

			var types = queryParams["type"]?.Split(',');
			var regions = queryParams["region"]?.Split(',');
			var tags = queryParams["tags"]?.Split(',');
			int.TryParse(queryParams["min-area"], out int minArea);
			int.TryParse(queryParams["min-rooms"], out int minRooms);
			int.TryParse(queryParams["max-price"], out int maxPrice);
			if (maxPrice == 0) { maxPrice = int.MaxValue; }

			var filteredListings = allListings
				.Where(x =>
				{
					if (x.Size < minArea) { return false; }
					if (x.Rooms < minRooms) { return false; }
					if (x.Price > maxPrice) { return false; }

					if ((types != null) && (!types.Contains(x.ListingType))) { return false; }
					if ((regions != null) && (!regions.Contains(x.Region))) { return false; }
					if (tags != null)
					{
						if (x.Tags.Intersect(tags).Count() != tags.Count()) { return false; }
					}

					return true;
				});

			return filteredListings;
		}

	}
}