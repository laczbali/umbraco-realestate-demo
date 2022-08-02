window.onload = function () {
    revealCards();
}

async function getPage(pageNumber) {
    const url = `https://localhost:44390/listing-results?page=${pageNumber}`;
    const result = await fetchAsyncText(url);

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

async function fetchAsyncText(url) {
    let response = await fetch(url);
    let data = await response.text();
    return data;
}