document.addEventListener("DOMContentLoaded", function () {

    const search =
        document.getElementById("topicSearch");

    const cards =
        Array.from(
            document.querySelectorAll(".topic-card")
        );

    const count =
        document.getElementById("topicCount");

    const noResults =
        document.getElementById("noResults");

    if (!search) {
        return;
    }

    function updateTopics() {

        const value =
            search.value
                .trim()
                .toLowerCase();

        let visible = 0;

        cards.forEach(function (card) {

            const text =
                card.innerText.toLowerCase();

            const matched =
                text.includes(value);

            card.style.display =
                matched
                    ? "flex"
                    : "none";

            if (matched) {
                visible++;
            }
        });

        count.textContent =
            value
                ? visible + " matching topics"
                : cards.length + " topics";

        noResults.style.display =
            visible === 0
                ? "block"
                : "none";
    }

    search.addEventListener(
        "input",
        updateTopics
    );

    updateTopics();
});
