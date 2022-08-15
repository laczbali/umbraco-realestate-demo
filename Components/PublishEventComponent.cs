﻿using System;
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
using Newtonsoft.Json;

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
            foreach (var node in publishedListings)
            {
                using (var context = new ListingContext())
                {
                    var item = context.ListingItems.FirstOrDefault(i => i.Name == node.Name);
                    if(item == null)
                    {
                       item = new Database.Models.ListingItem();
                       context.ListingItems.Add(item);
                    }

                    item.Name = node.Name;
                    item.HeadLine = node.GetValue<string>("headline");
                    item.Description = node.GetValue<string>("description");
                    item.Contact = node.GetValue<string>("contact");
                    item.Region = node.GetValue<string>("region");
                    item.ListingType = node.GetValue<string>("listingType");
                    item.Price = node.GetValue<int>("price");
                    item.Size = node.GetValue<int>("size");
                    item.Rooms = node.GetValue<int>("rooms");

                    // remove tags that are not needed
                    var nodeTags = JsonConvert.DeserializeObject<IEnumerable<string>>(node.GetValue<string>("tags"));
                    item.Tags.RemoveAll(t => !nodeTags.Contains(t.Name));
                    // add tags, if missing
                    foreach (var tag in nodeTags)
                    {
                        var dbTag = context.Tags.FirstOrDefault(t => t.Name == tag);
                        if (dbTag == null)
                        {
                            dbTag = new Tag(tag);
                            context.Tags.Add(dbTag);
                        }

                        if (!item.Tags.Contains(dbTag))
                        {
                            item.Tags.Add(dbTag);
                        }
                    }



                    context.SaveChanges();

                }
            }
        }

        public void Terminate()
        {
            // unsubscribe at shutdown
            ContentService.Publishing -= ContentService_Publishing;
        }
    }
}