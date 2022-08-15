using System;
using Umbraco.Core;
using Umbraco.Core.Composing;
using Umbraco.Core.Services.Implement;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using Umbraco.Web.PublishedModels;

namespace umbraco_realestate_demo.Components
{
    public class PublishEventComponent : IComponent
    {
        [RuntimeLevel(MinLevel = RuntimeLevel.Run)]
        public class PublishEventComposer : ComponentComposer<PublishEventComponent>
        { }

        public void Initialize()
        {
            // subscribe at startup
            ContentService.Publishing += ContentService_Publishing;
        }

        private void ContentService_Publishing(Umbraco.Core.Services.IContentService sender, Umbraco.Core.Events.ContentPublishingEventArgs e)
        {
            var publishedListings = e.PublishedEntities.Where(node => node.ContentType.Alias == "listingItem");
            foreach(var node in publishedListings)
            {
                // TODO: save listings in custom DB
            }
        }

        public void Terminate()
        {
            // unsubscribe at shutdown
            ContentService.Publishing -= ContentService_Publishing;
        }
    }
}