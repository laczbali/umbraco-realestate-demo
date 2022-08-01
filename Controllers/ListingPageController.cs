using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Umbraco.Core;
using Umbraco.Web;
using Umbraco.Web.Models;
using Umbraco.Web.PublishedModels;

namespace umbraco_realestate_demo.Controllers
{
	public class ListingPageController : Umbraco.Web.Mvc.RenderMvcController
	{
        public override ActionResult Index(ContentModel model)
        {
			var listings = Umbraco.Content(Guid.Parse("060b468a-cc88-426b-a612-c391433adde2"))
			.Children()
			.OfType<ListingItem>()
			.Where(x => x.IsVisible())
			.OrderByDescending(x => x.CreateDate)
			.Take(3);

			var output = listings.Select(item =>
			{
				return new
				{
					name = item.Name,
					tags = item.Tags
				};
			});

			return Json(output, JsonRequestBehavior.AllowGet);
        }
    }
}