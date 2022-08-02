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
	public class ListingResultsController : Umbraco.Web.Mvc.RenderMvcController
	{
		[OutputCache(Duration = 0)]
        public override ActionResult Index(ContentModel model)
        {
			return View("~/Views/Partials/ListingResults.cshtml");
        }
    }
}