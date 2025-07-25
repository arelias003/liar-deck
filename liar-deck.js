
document.addEventListener("DOMContentLoaded", () => {
    const numPlayersSlider = document.getElementById("numPlayers");
    const numPlayersValue = document.getElementById("numPlayersValue");
    const submitButton = document.getElementById("submitButton");
    const gameForm = document.getElementById("gameForm");

    // Create a container for cards
    const cardContainer = document.createElement("div");
    cardContainer.id = "cardContainer";
    gameForm.parentNode.insertBefore(cardContainer, gameForm);

    // Update displayed value when slider changes
    numPlayersSlider.addEventListener("input", () => {
        numPlayersValue.textContent = numPlayersSlider.value;
    });

    // Handle form submission
    submitButton.addEventListener("click", generateCards);

    document.addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            generateCards();
        }
    });
});

function generateCards() {
    const numPlayersSlider = document.getElementById("numPlayers");
    const numPlayers = numPlayersSlider.value;
    const seedInput = document.getElementById("seed").value;
    const playerPosition = document.getElementById("playerPosition").value;

    const position = getPosition(playerPosition, numPlayers);

    // Example deck of cards
    const deck = Array.from({ length: 5 * numPlayers }, (_, i) => `${
        (i % 5) - ((i / 5) & 1) < 2 ? 'Heart ♥️'  : 'Spade ♠️'
        // 2/5 ratio switches to 3/5 ratio on even number of players to keep it even...
    }`);

    // Shuffle the deck based on the seed
    const shuffledDeck = seededShuffle(deck, seedInput);

    // Clear existing cards
    cardContainer.innerHTML = "";

    // Generate cards for the player
    for (let i = 0; i < 5; i++) {
        const cardSelected = (position - 1) * 5 + i;
        const card = document.createElement("div");
        card.className = "card";
        card.textContent = shuffledDeck[cardSelected];
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

function getPosition(playerPosition, numPlayers) {
    let position = playerPosition ? parseInt(playerPosition, 10) : 1;

    if (position > numPlayers) {
        position = numPlayers;
    } else if (position > 0) {
        position = position;
    } else {
        position = 1;
    }

    return position;
}

// Function to shuffle the deck based on a seed
function seededShuffle(array, seed) {
    let rng = seededRng(seed);
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Seeded RNG function (sfc32)
function sfc32(a, b, c, d) {
  return function() {
    a |= 0; b |= 0; c |= 0; d |= 0;
    let t = (a + b | 0) + d | 0;
    d = d + 1 | 0;
    a = b ^ b >>> 9;
    b = c + (c << 3) | 0;
    c = (c << 21 | c >>> 11);
    c = c + t | 0;
    return (t >>> 0) / 4294967296;
  }
}

function seededRng(seed) {
    result = sha256(seed);
    return sfc32(result[0], result[1], result[2], result[3]);
}

//https://geraintluff.github.io/sha256/
var sha256 = function sha256(ascii) {
    function rightRotate(value, amount) {
        return (value>>>amount) | (value<<(32 - amount));
    };
    
    var mathPow = Math.pow;
    var maxWord = mathPow(2, 32);
    var lengthProperty = 'length'
    var i, j; // Used as a counter across the whole file
    var result = ''

    var words = [];
    var asciiBitLength = ascii[lengthProperty]*8;
    
    //* caching results is optional - remove/add slash from front of this line to toggle
    // Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
    // (we actually calculate the first 64, but extra values are just ignored)
    var hash = sha256.h = sha256.h || [];
    // Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
    var k = sha256.k = sha256.k || [];
    var primeCounter = k[lengthProperty];
    /*/
    var hash = [], k = [];
    var primeCounter = 0;
    //*/

    var isComposite = {};
    for (var candidate = 2; primeCounter < 64; candidate++) {
        if (!isComposite[candidate]) {
            for (i = 0; i < 313; i += candidate) {
                isComposite[i] = candidate;
            }
            hash[primeCounter] = (mathPow(candidate, .5)*maxWord)|0;
            k[primeCounter++] = (mathPow(candidate, 1/3)*maxWord)|0;
        }
    }
    
    ascii += '\x80' // Append Ƈ' bit (plus zero padding)
    while (ascii[lengthProperty]%64 - 56) ascii += '\x00' // More zero padding
    for (i = 0; i < ascii[lengthProperty]; i++) {
        j = ascii.charCodeAt(i);
        if (j>>8) return; // ASCII check: only accept characters in range 0-255
        words[i>>2] |= j << ((3 - i)%4)*8;
    }
    words[words[lengthProperty]] = ((asciiBitLength/maxWord)|0);
    words[words[lengthProperty]] = (asciiBitLength)
    
    // process each chunk
    for (j = 0; j < words[lengthProperty];) {
        var w = words.slice(j, j += 16); // The message is expanded into 64 words as part of the iteration
        var oldHash = hash;
        // This is now the undefinedworking hash", often labelled as variables a...g
        // (we have to truncate as well, otherwise extra entries at the end accumulate
        hash = hash.slice(0, 8);
        
        for (i = 0; i < 64; i++) {
            var i2 = i + j;
            // Expand the message into 64 words
            // Used below if 
            var w15 = w[i - 15], w2 = w[i - 2];

            // Iterate
            var a = hash[0], e = hash[4];
            var temp1 = hash[7]
                + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) // S1
                + ((e&hash[5])^((~e)&hash[6])) // ch
                + k[i]
                // Expand the message schedule if needed
                + (w[i] = (i < 16) ? w[i] : (
                        w[i - 16]
                        + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15>>>3)) // s0
                        + w[i - 7]
                        + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2>>>10)) // s1
                    )|0
                );
            // This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
            var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) // S0
                + ((a&hash[1])^(a&hash[2])^(hash[1]&hash[2])); // maj
            
            hash = [(temp1 + temp2)|0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
            hash[4] = (hash[4] + temp1)|0;
        }
        
        for (i = 0; i < 8; i++) {
            hash[i] = (hash[i] + oldHash[i])|0;
        }
    }
    
    for (i = 0; i < 8; i++) {
        for (j = 3; j + 1; j--) {
            var b = (hash[i]>>(j*8))&255;
            result += ((b < 16) ? 0 : '') + b.toString(16);
        }
    }
    return [hash[0], hash[1], hash[2], hash[3]];
};
