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
 * @param {URLSearchParams} filters Will be applied if not null 
 * @param {boolean} reuseFilters If true, and filters is null, will re-use the last used filters
 * */
function getListings(pageNumber = null, filters = null, reuseFilters = false) {
    // get the base API url
    const queryUrl = new URL("/umbraco/surface/listings/get", window.location.href);

    // add page number
    if (pageNumber === null) { pageNumber = 1; }
    queryUrl.searchParams.append("page", pageNumber)

    // add filters, if applicable
    if (filters === null && reuseFilters) {
        // no filters were provided, but we need to reuse the previous (pagination)
        const oldFilter = localStorage.getItem("listings-query");
        if (oldFilter !== null && oldFilter !== "null") {
            filters = new URLSearchParams(oldFilter);
        } else {
            filters = new URLSearchParams();
        }
    }
    if (filters !== null && filters !== "null") {
        // we have filters (either provided or reused)
            for (const [key, value] of filters.entries()) {
                queryUrl.searchParams.append(key, value);
            }
    }

    localStorage.setItem("listings-query", filters ? filters.toString() : null);

    // fetch & display results
    fetchUrl(queryUrl.href, (request) => {
        const result = request.responseText;
        const resultsContainer = document.getElementById("results-container");
        resultsContainer.innerHTML = result;
        revealCards();
    });
}

/**
 * Gets the desired page, with the current parameters
 * @param {any} pageNumber
 */
function getPage(pageNumber) {
    getListings(pageNumber, null, true);
}

/**
 * Queries the listings with the contents of the simple search field (1st page)
 * */
function simpleSearch() {
    let queryUrl = null;
    const searchBox = document.getElementById("searchTerm");
    if (searchBox.value !== "") {
        queryUrl = new URLSearchParams();
        queryUrl.append("searchterm", searchBox.value)
    }

    getListings(null, queryUrl);
}

/**
 * Calls simpleSerach with debouncing
 * */
const processSearchChange = debounce(
    () => simpleSearch()
);

/**
 * Collect the input data from all the search filters (except the simple-search-textbox)
 * Returns them as URLSearchParams
 * Returns null, if no filters are specified
 * */
function collectFilters() {
    let filter = new URLSearchParams();;

    // go through each input, add value to output if set
    const inputs = Array.from(document.getElementsByClassName("filter-input"));
    inputs.forEach(input => {
        switch (input.type) {
            case 'checkbox':
                if (input.checked) {
                    // add to filter, if checkbox is checked
                    filter.append(input.name, input.value);
                }
                break;

            default:
                if (input.value !== '' && input.value !== null) {
                    // add to filter, if value is not empty
                    filter.append(input.name, input.value);
                }
                break;
        }
    });

    // return result, if any
    if (filter.toString() !== '') {
        return filter;
    } else {
        return null;
    }
}

/**
 * Calls applyFilters with debouncing
 * */
const processFilterChange = debounce(
    () => getListings(null, collectFilters())
);

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
 * Sends an HTTP GET request, to the desired URL. Once it is done, it calls 'callback' with the response object
 * @param {any} url
 * @param {any} callback
 */
function fetchUrl(url, callback) {
    const http = new XMLHttpRequest();
    http.open("GET", url);
    http.send();
    http.onreadystatechange = (event) => {
        if (event.target.readyState !== 4) { return; }
        callback(event.target);
    };
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
