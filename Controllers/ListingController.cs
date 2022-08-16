using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Umbraco.Core;
using Umbraco.Web;
using Umbraco.Web.Mvc;

namespace umbraco_realestate_demo.Controllers
{
	public class ListingController : RenderMvcController
    {
        public ActionResult Get(int id)
        {
            var listings = Umbraco.ContentAtXPath("//listings[@isDoc]").First();
            ViewData["id"] = id;
            return View("~/Views/DbListingItem.cshtml", listings);
        }
    }
}