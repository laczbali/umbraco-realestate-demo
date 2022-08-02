window.onload = function () {
    revealCards();
}

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
    const queryUrl = `${baseQueryUrl}?page=${pageNumber}`;

    // display results
    const result = await fetchAsyncText(queryUrl);
    const resultsContainer = document.getElementById("results-container");
    resultsContainer.innerHTML = result;

    revealCards();
}

function revealCards() {
    const cards = Array.from(document.getElementsByClassName("card-fading-isopaque"));
    cards.forEach(function (card, i) {
        setTimeout(function () {
            card.classList.remove("card-fading-isopaque");
        }, i * 250);
    });
}

function filtersChanged() {
    // gather filter data
    let filterData = {
        checked: {},
        setNumeric: []
    };

    const inputs = Array.from(document.getElementsByClassName("filter-input"));
    inputs.forEach(input => {
        switch (input.type) {
            case "checkbox":
                // if it is checked, add it to the checkbox array
                if (input.checked) {
                    const checkboxType = input.id.split("-")[0];
                    if (filterData.checked[checkboxType] === undefined) { filterData.checked[checkboxType] = []; }
                    filterData.checked[checkboxType].push(input.value);
                }
                break;

            case "number":
                // if the value is not empty, add it to the numeric array
                if (input.value !== null && input.value !== undefined && input.value !== '') {
                    let numericObject = {};
                    numericObject[input.id] = Number.parseInt(input.value);
                    filterData.setNumeric.push(numericObject);
                }
                break;

            default: console.warn("invalid type " + input.type); break;
        }
    });

    console.log(filterData);
}

async function fetchAsyncText(url) {
    let response = await fetch(url);
    let data = await response.text();
    return data;
}
