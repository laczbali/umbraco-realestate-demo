using System;
using Umbraco.Core;
using Umbraco.Core.Composing;
using Umbraco.Core.Services.Implement;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using Umbraco.Web.PublishedModels;
using umbraco_realestate_demo.Database;
using umbraco_realestate_demo.Database.Models;
using Umbraco.Web;
using System.Web.Mvc;
using System.Web.Routing;
using Umbraco.Core.Models.PublishedContent;

namespace umbraco_realestate_demo.Components
{
    public class CustomRoutesComposer : ComponentComposer<CustomRoutesComponent> { }

    public class CustomRoutesComponent : IComponent
    {
        public void Initialize()
        {
            RouteTable.Routes.MapRoute("Listing", "listing/{id}", new { controller = "Listing", action = "Get", id = UrlParameter.Optional });
        }

        public void Terminate() { }
    }
}