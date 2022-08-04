window.onload = function () {
    // run the listing-reveal "animation"
    revealCards();

    // remove stored item from previous session
    localStorage.removeItem("listings-query");
}

/**
 * Gets the listings, at the requested page number, with the requested filters
 * 
 * - When called by the search button, it queries the first page, with the searchbox value
 * - When called by the filter apply, it queries the first page, with the filter values
 * - When called by the paginations, it queries the requested page, with the last used additional params
 * 
 * @param {number} pageNumber If null, the 1st page will be queried
 * @param {string} filters Will be applied if not null 
 * @param {boolean} reuseFilters If true, and filters is null, will re-use the last used filters
 * */
async function getListings(pageNumber = null, filters = null, reuseFilters = false) {
    // get the base API url
    const url = window.location.href;
    const urlParts = url.split("/");
    if (urlParts[urlParts.length - 1] === '') { urlParts.pop(); }
    // remove the last part of the url, as it points the list-view
    urlParts.pop();
    // add the part for the query controller
    urlParts.push("listing-results");
    const baseQueryUrl = urlParts.join("/");

    // add page number
    if (pageNumber === null) { pageNumber = 1; }
    let queryUrl = `${baseQueryUrl}?page=${pageNumber}`;

    // add filters, if applicable
    if (filters === null && reuseFilters) {
        // no filters were provided, but we need to reuse the previous (pagination)
        filters = localStorage.getItem("listings-query");
    }
    if (filters !== null && filters !== "null") {
        // we have filters (either provided or reused)
        queryUrl += filters;
    }

    localStorage.setItem("listings-query", filters);

    // fetch & display results
    const result = await fetchAsyncText(queryUrl);
    const resultsContainer = document.getElementById("results-container");
    resultsContainer.innerHTML = result;
    revealCards();
}

/**
 * Queries the listings with the contents of the simple search field (1st page)
 * */
function simpleSearch() {
    let queryUrl = null;
    const searchBox = document.getElementById("searchTerm");
    if (searchBox.value !== "") {
        queryUrl = `&searchterm=${searchBox.value}`;
        queryUrl = encodeURI(queryUrl);
    }

    getListings(null, queryUrl);
}

/**
 * Queries the listings with the applied filters (1st page)
 * */
function applyFilters() {
    getListings(null, collectFilters());
}

/**
 * Gets the desired page, with the current parameters
 * @param {any} pageNumber
 */
function getPage(pageNumber) {
    getListings(pageNumber, null, true);
}

/**
 * Collect the input data from all the search filters (except the simple-search-textbox)
 * Returns the URL encoded query string (" &region=North&tags=parking,pet-friendly ")
 * Returns null, if no filters are specified
 * */
function collectFilters() {
    // build a query string "&tags=a,b&regions=x,y&types=rent"
    let filterQuery = "";

    // get listing type (rent/sale)
    let typeValues = [];
    const typeBoxes = Array.from(document.getElementsByClassName("filter-listingtype"));
    typeBoxes.forEach(box => {
        if (box.checked) {
            typeValues.push(box.value);
        }
    });
    if (typeValues.length > 0) { filterQuery += `&type=${typeValues.join(',')}`; }

    // get region
    let regionValues = [];
    const regionBoxes = Array.from(document.getElementsByClassName("filter-region"));
    regionBoxes.forEach(box => {
        if (box.checked) {
            regionValues.push(box.value);
        }
    });
    if (regionValues.length > 0) { filterQuery += `&region=${regionValues.join(',')}`; }

    // get tags
    let tagValues = [];
    const tagBoxes = Array.from(document.getElementsByClassName("filter-tag"));
    tagBoxes.forEach(box => {
        if (box.checked) {
            tagValues.push(box.value);
        }
    });
    if (tagValues.length > 0) { filterQuery += `&tags=${tagValues.join(',')}`; }

    // get min-area
    const minAreaInput = document.getElementsByClassName("filter-area")[0];
    const minAreaValue = Number.parseInt(minAreaInput.value);
    if (!isNaN(minAreaValue)) {
        filterQuery += `&min-area=${minAreaValue}`;
    }

    // get min-rooms
    const minRoomsInput = document.getElementsByClassName("filter-rooms")[0];
    const minRoomsValue = Number.parseInt(minRoomsInput.value);
    if (!isNaN(minRoomsValue)) {
        filterQuery += `&min-rooms=${minRoomsValue}`;
    }

    // get max-price
    const maxPriceInput = document.getElementsByClassName("filter-price")[0];
    const maxPriceValue = Number.parseInt(maxPriceInput.value);
    if (!isNaN(maxPriceValue)) {
        filterQuery += `&max-price=${maxPriceValue}`;
    }

    if (filterQuery === '') {
        return null;
    } else {
        return encodeURI(filterQuery);
    }
}

/**
 *  Goes through each listing card, and removes the opaque class from them, with a bit of a delay
 * */
function revealCards() {
    const cards = Array.from(document.getElementsByClassName("card-fading-isopaque"));
    cards.forEach(function (card, i) {
        setTimeout(function () {
            card.classList.remove("card-fading-isopaque");
        }, i * 100);
    });
}

/**
 * Sends an HTTP GET request, to the desired URL. Returns the response as TEXT
 * @param {any} url
 */
async function fetchAsyncText(url) {
    let response = await fetch(url);
    let data = await response.text();
    return data;
}
