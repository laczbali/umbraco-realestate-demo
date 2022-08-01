# umbraco-realestate-demo

This is a repo for an at-home task, to get introduced to the Umbraco CMS.

**Expected outcome**
- Website is built using Umbraco 7 or 8  (not 9)
- A nice looking website running locally (no server setup)
  - Do not use you time on building the  frontend from scratch,
  use a free template like [this one](https://www.free-css.com/free-css-templates/page253/estateagency)
  ([in action](https://www.free-css.com/assets/files/free-css-templates/preview/page253/estateagency/))
  or some framework like [bootstrap](https://getbootstrap.com/)
- User can setup home and about page content in Umbraco backend.
- User manages listings in Umbraco backend
- Listings have properties that are used for filtering (Area, size, price, etc..)
- Listings have headline, description, images, etc..

**Bonus points**
- Free text search using built-in search function in Umbraco (using Examine)
- Async search and filter (using JavaScript to fetch content in the listing page without refresh)
- Home and about page are built using Umbraco grid
- Listing has multiple image that are rendered in a swiper on the website
- Nice and tidy project structure
- Proper Git repo setup (Git ignore, etc.)
- Project runs without any issue when cloned on other machines

**Notes**
A great resource to learn Umbraco v8 is [this playlist](https://www.youtube.com/playlist?list=PL90L_HquhD-_N2mO8kYzhZL15sh1lyxVK)
Umbraco API doc is [here](https://our.umbraco.com/apidocs/v8/csharp/api/Umbraco.Core.Models.html)
ModelBuilder resources:
- [Official docs](https://our.umbraco.com/Documentation/Reference/Templating/Modelsbuilder/Builder-Modes-v8_5)
- [Question about type conflicts](https://our.umbraco.com/forum/developers/razor/75519-modelsbuilder-the-type-exists-in-both-webdll-and-temporary)
- [Chaning to DLL](https://our.umbraco.com/forum/using-umbraco-and-getting-started/102401-change-from-purelive-to-dll)

**Questions**
- General setup
  - How does a proper .gitignore look?
  - Am I setting up ModelsBuilder properly? 
	- in `web.config` I set `ModelsBuilder.ModelsMode` to `LiveAppData`
	- I included the `App_Data\Models` folder into the project
	- Added `App_Data\Models` to git
  - Build \ Run process outside of Visual Studio?
- Database
  - Any way to easily migrate database contents?
  - Any way to store backoffice settings in a JSON or something?
  - Can it work with a non-SQL Server DB?
- Usage
  - How to configure page URLs?
  - Scoped CSS?
