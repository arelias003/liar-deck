
var darken = false;

document.addEventListener("DOMContentLoaded", () => {
 
    generateCards();

    document.getElementById("refreshButton").addEventListener("mousedown", darkenPageReset);
    document.getElementById("refreshButton").addEventListener("mousedown", darkenPageReset);

    darkenPageTimeout();
});

function darkenPageTimeout() {
    const overlay = document.getElementById('darkOverlay');
    setTimeout(() => {
        overlay.classList.remove('active');
    }, 400); // duration of the effect
}

function darkenPageReset() {
    const overlay = document.getElementById('darkOverlay');

    if (!darken) {
        darken = true;
        overlay.classList.add('active');
        setTimeout(() => {
            generateCards();
            overlay.classList.remove('active');
            darken=false;
        }, 400); // duration of the effect
    }
}

function generateCards() {
    let cardContainer = document.getElementById("cardContainer");

    // Clear existing cards
    cardContainer.innerHTML = "";

    // Generate cards for the player
    for (let i = 0; i < 5; i++) {
        const card = document.createElement("div");
        card.className = "card";
        card.textContent = Math.random() >= 0.5 ? 'Heart ♥️'  : 'Spade ♠️';
        card.style.border = "1px solid black";
        card.style.padding = "10px";
        card.style.margin = "5px";
        card.style.display = "inline-block";
        card.style.backgroundColor = 'white'
        card.onclick = function() {
            if (card.style.backgroundColor == 'white') {
                card.style.backgroundColor = 'lightgray';
            } else {
                card.style.backgroundColor = 'white';
            }
        };
        cardContainer.appendChild(card);
    }
}
