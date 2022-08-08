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
        queryUrl = `&searchterm=${encodeURIComponent(searchBox.value)}`;
    }

    getListings(null, queryUrl);
}

/**
 * Calls simpleSerach with debouncing
 * */
const processSearchChange = debounce(() => simpleSearch());

/**
 * Queries the listings with the applied filters (1st page)
 * */
function applyFilters() {
    getListings(null, collectFilters());
}

/**
 * Calls applyFilters with debouncing
 * */
const processFilterChange = debounce(() => applyFilters());

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
    let filter = {};

    // go through each input, add value to output if set
    const inputs = Array.from(document.getElementsByClassName("filter-input"));
    inputs.forEach(input => {
        switch (input.type) {
            case 'checkbox':
                if (input.checked) {
                    // add to filter, if checkbox is checked
                    if (filter[input.name] === undefined) { filter[input.name] = []; }
                    filter[input.name].push(encodeURIComponent(input.value));
                }
                break;

            default:
                if (input.value !== '' && input.value !== null) {
                    // add to filter, if value is not empty
                    if (filter[input.name] === undefined) { filter[input.name] = []; }
                    filter[input.name].push(encodeURIComponent(input.value));
                }
                break;
        }
    });

    // join keys (input-groups) by '&' and values by ','
    const result = Object.keys(filter).map(key => {
        return `${key}=${filter[key].join(',')}`;
    }).join('&');

    // return result, if any
    if (result !== '') {
        return '&' + result;
    } else {
        return null;
    }
}

/**
 * Clears all filter inputs & re-queries the listings
 * */
function clearTerms() {
    // only run if needed (last query was made with search/filter terms)
    const lastQuery = localStorage.getItem('listings-query');
    if (lastQuery === undefined || lastQuery === null || lastQuery === 'null') { return; }

    // clear filters
    const inputs = Array.from(document.getElementsByClassName("filter-input"));
    inputs.forEach(input => {
        switch (input.type) {
            case 'checkbox':
                input.checked = false;
                break;

            default:
                input.value = '';
                break;
        }
    });

    // clear searchbox
    const searchBox = document.getElementById("searchTerm");
    searchBox.value = '';

    // re-query listings
    getListings(null, null, false);
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

/**
 * Runs a callback function after debouncing
 * 
 * Call as
 * const processInput = debounce(() => callback());
 * <input onkeyup="processInput()" ...>
 * @param {any} func
 * @param {any} timeout
 */
function debounce(func, timeout = 600) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}
