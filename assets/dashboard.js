function searchCards() {

    const input = document
        .getElementById("searchInput")
        .value
        .toLowerCase()
        .trim();

    const cards = document.querySelectorAll(".searchable");

    cards.forEach(function (card) {

        const text = card.innerText.toLowerCase();

        if (text.includes(input)) {

            card.classList.remove("hidden");

        } else {

            card.classList.add("hidden");

        }

    });
}