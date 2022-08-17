using Umbraco.Core.Composing;
using Umbraco.Core;
using umbraco_realestate_demo.Database;
using umbraco_realestate_demo.Utils;

namespace umbraco_realestate_demo.Components
{
    public class ServiceComposer : IUserComposer
    {
        public void Compose(Composition composition)
        {
            composition.Register<ListingContext>();
            composition.Register<ListingFinder>();
        }
    }
}