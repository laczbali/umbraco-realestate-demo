window.onload = function () {
    revealCards();
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
 * Gets a specific page of the listings
 * 
 * If the pageNumber is the same as the current page,
 * - assumes the filters have been updated
 * - resets the page to the first
 * - will also apply the filter input to the query (if any)
 * 
 * If the pageNumber is for a different page,
 * - collects the currently applied filter settings
 * - gets the desired page with those filters applied (if any)
 * 
 * @param {number} pageNumber
 * @param {string} filters What filters to apply, as an URL encoded query string (eg: "&key=value&key2=value2")
 */
async function getPage(pageNumber, filters = null) {
    const url = window.location.href;
    const urlParts = url.split("/");
    if (urlParts[urlParts.length - 1] === '') { urlParts.pop(); }
    // remove the last part of the url, as it points the list-view
    urlParts.pop();
    // add the part for the query controller
    urlParts.push("listing-results")
    const baseQueryUrl = urlParts.join("/");

    // build query url
    let queryUrl = baseQueryUrl
    if (pageNumber !== currentPage()) {
        // function was called by pagination
        // collect active filters, and go to needed page
        queryUrl = `${baseQueryUrl}?page=${pageNumber}`;
        filters = collectFilters();
    } else {
        // function was called by applyFilters
        // since filters changed, we want to reset to page 1
        queryUrl = `${baseQueryUrl}?page=1`;
    }
    if (filters !== null) {
        // function was either called by applyFilters, so they are provided
        // or it was called through pagination, so it was collected
        // if it is null, no filters are set by the user
        queryUrl += filters;
    }

    // display results
    const result = await fetchAsyncText(queryUrl);
    const resultsContainer = document.getElementById("results-container");
    resultsContainer.innerHTML = result;

    revealCards();
}

/**
 * Builds a query param from the contents of the simple search field
 * */
function simpleSearch() {
    let queryUrl = null;
    const searchBox = document.getElementById("searchTerm");
    if (searchBox.value !== "") {
        queryUrl = `&searchterm=${searchBox.value}`;
        queryUrl = encodeURI(queryUrl);
    }
    getPage(currentPage(), queryUrl)
}

/**
 * Queries the listings with the currently applied filters. This will reset pagination to the first page.
 * */
function applyFilters() {
    getPage(currentPage(), collectFilters());
}

/**
 * Collect the input data from all the search filters (except the simple-search-textbox)
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
 * Returns which page we are currently on (based on the page-selector widget)
 * */
function currentPage() {
    const activePageSelector = document.getElementsByClassName("page-selector-current")[0];
    if (activePageSelector === undefined) { return "1"; }
    const currentPageVal = activePageSelector.id.split("-")[1];
    return currentPageVal;
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
