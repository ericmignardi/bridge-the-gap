const headerToggle = document.querySelector('.header__toggle');
const mobileMenu = document.querySelector('.mobile__header');

var isMobileMenuOpen = false;

headerToggle.addEventListener('click', () => {
    isMobileMenuOpen = !isMobileMenuOpen;

    if (isMobileMenuOpen) {
        mobileMenu.style.display = "flex";
        document.body.style.overflowY = "hidden";
    } else {
        mobileMenu.style.display = "none";
        document.body.style.overflowY = "auto";
    }
});

const submitButton = document.querySelector('.input__button');

submitButton.addEventListener('click', async (e) => {
    e.preventDefault();

    // Get the values when the button is clicked
    const genre = document.querySelector('#genre').value;
    const difficulty = document.querySelector('#difficulty').value;
    const key = document.querySelector('#key').value;
    const tempo = document.querySelector('#tempo').value;

    // Ensure that all fields have valid values (simple validation)
    if (!genre || !difficulty || !key || !tempo) {
        console.error('All fields must be filled');
        return;  // Don't submit if any field is empty
    }

    const song = { genre, difficulty, key, tempo };

    try {
        const response = await fetch('http://localhost:8000/songs', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(song),
        });

        if (!response.ok) {
            // Log the error response if the submission failed
            console.error(`Failed to submit the song. Status: ${response.status} - ${response.statusText}`);
            return;
        }

        // Wait for the response to be parsed as JSON
        const data = await response.json();
        console.log(data); // Log the data received from the server

        // Call displaySongs with the response data
        displaySongs(data);

    } catch (error) {
        // Catch any network errors
        console.error('There was an error with the fetch operation:', error);
    }
});

const displaySongs = (songs) => {
    const container = document.querySelector('.output__container'); // Ensure the class is correct

    // Clear the container before adding new songs (optional)
    container.innerHTML = '';

    // Loop through each song and create a card for it
    songs.forEach(song => {
        // Create the card div
        const card = document.createElement('div');
        card.classList.add('output__card');  // Add a class for styling

        // Create all child elements first
        const title = document.createElement('h3');
        title.textContent = song.title;

        const genre = document.createElement('p');
        genre.textContent = `Genre: ${song.genre}`;

        const difficulty = document.createElement('p');
        difficulty.textContent = `Difficulty: ${song.difficulty}`;

        const key = document.createElement('p');
        key.textContent = `Key: ${song.key}`;

        const tempo = document.createElement('p');
        tempo.textContent = `Tempo: ${song.tempo}`;

        // Append all child elements to the card
        card.appendChild(title);
        card.appendChild(genre);
        card.appendChild(difficulty);
        card.appendChild(key);
        card.appendChild(tempo);

        // Finally, append the card to the container
        container.appendChild(card);
    });
};
