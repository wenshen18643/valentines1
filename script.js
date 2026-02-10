document.addEventListener('DOMContentLoaded', () => {
    const mainGif = document.getElementById('mainGif');
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const errorPopup = document.getElementById('errorPopup');
    const closePopupBtn = document.getElementById('closePopup');
    const showerContainer = document.getElementById('showerContainer');
    const backgroundPattern = document.getElementById('background-pattern');

    // Generate Faded Background Pattern
    function generateBackgroundPattern() {
        if (!backgroundPattern) return;
        const emojis = ['❤️', '🌷', '🌸', '💕', '🌿'];
        const count = 30; // Number of floating elements

        for (let i = 0; i < count; i++) {
            const el = document.createElement('div');
            el.classList.add('bg-element');
            el.textContent = emojis[Math.floor(Math.random() * emojis.length)];

            // Random Position
            el.style.left = Math.random() * 100 + 'vw';
            el.style.top = Math.random() * 100 + 'vh';

            // Random Size and Rotation
            const size = Math.random() * 1.5 + 1; // 1rem to 2.5rem
            el.style.fontSize = `${size}rem`;
            el.style.transform = `rotate(${Math.random() * 360}deg)`;

            // Random Opacity for "faded" effect
            el.style.opacity = Math.random() * 0.3 + 0.1; // 0.1 to 0.4

            backgroundPattern.appendChild(el);
        }
    }

    generateBackgroundPattern();

    // Default GIFs in case fetch fails (common with file:// protocol)
    // Default GIFs - Updated with valid links and the requested Peachcat sticker
    let gifUrls = [
        "https://media1.tenor.com/m/2aSuT7p_a_UAAAAC/peachcat-cat.gif", // The requested one!
        "https://media.tenor.com/fA1qI7iS_Q8AAAAC/cute-cat.gif",
        "https://media.tenor.com/BiML3H2rQzUAAAAC/cat-love.gif",
        "https://media1.tenor.com/m/Lddp0mafM0oAAAAC/rr.gif" // Rick Roll! (Direct link)
    ];
    let yesScale = 1;
    let yesClickCount = 0;
    const CLICK_THRESHOLD = 6;

    // Try to fetch from file, but don't break if it fails
    fetch('gifs_to_use.txt')
        .then(response => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.text();
        })
        .then(text => {
            const lines = text.split('\n').map(url => url.trim()).filter(url => url.length > 0);
            if (lines.length > 0) {
                // Add valid lines to the list (instead of replacing)
                gifUrls = gifUrls.concat(lines);
                // Remove duplicates
                gifUrls = [...new Set(gifUrls)];
                console.log('Loaded GIFs from file:', gifUrls);
            }
        })
        .catch(err => {
            console.warn('Could not load gifs_to_use.txt, using defaults.', err);
            // This is expected on some hosting if the file is missing or blocked
        });

    // No Button Logic
    noBtn.addEventListener('click', () => {
        yesScale += 0.6; // Increase size significantly faster
        yesBtn.style.transform = `scale(${yesScale})`;

        // Optional: Run away or change text (keeping it simple as per request)
        const messages = ["Are you sure?", "Really?", "Think again!", "Last chance!", "Surely not?", "Beat U", "Meow", "Pretty Please", "PLEASEEE", "I wont touch u"];
        noBtn.textContent = messages[Math.floor(Math.random() * messages.length)];
    });

    // Yes Button Logic
    yesBtn.addEventListener('click', () => {
        yesClickCount++;

        if (yesClickCount < CLICK_THRESHOLD) {
            showErrorPopup();
        } else {
            startShower();
        }
    });

    // Popup Logic
    function showErrorPopup() {
        const popupMessages = [
            { title: "u r ruining the fun! 😠", text: "Don't click that yet!" },
            { title: "Hehe not yet! 😈", text: "Click NO a few more times..." },
            { title: "Patience... ⏳", text: "The button needs to be bigger!" },
            { title: "Nope! ❌", text: "You're too eager!" },
            { title: "Stop it! 🛑", text: "Play the game properly!" },
            { title: "Chill... 🧊", text: "Let the NO button have its moment." }
        ];

        const randomMsg = popupMessages[Math.floor(Math.random() * popupMessages.length)];
        errorPopup.querySelector('h2').textContent = randomMsg.title;
        errorPopup.querySelector('p').textContent = randomMsg.text;

        errorPopup.classList.remove('hidden');
    }

    closePopupBtn.addEventListener('click', () => {
        errorPopup.classList.add('hidden');
    });

    // Letter Popup Logic
    // Letter Popup Logic
    const letterPopup = document.getElementById('letterPopup');
    const closeLetterBtn = document.getElementById('closeLetter');
    const letterTextElement = document.querySelector('.letter-text');
    let letterContent = letterTextElement.innerHTML; // Store the HTML content

    closeLetterBtn.addEventListener('click', () => {
        letterPopup.classList.add('hidden');
    });

    // Shower Logic
    function startShower() {
        showerContainer.classList.remove('hidden');

        // Create falling elements continuously
        setInterval(createFallingElement, 300);
    }

    function createFallingElement() {
        const element = document.createElement('div');
        element.classList.add('falling-element');

        // 5% Chance to be a Letter
        const isLetter = Math.random() < 0.05;

        if (isLetter) {
            element.textContent = '💌';
            element.classList.add('falling-letter');

            // Add click event for the letter
            element.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent bubbling issues
                letterPopup.classList.remove('hidden');

                // Typewriter Effect
                letterTextElement.innerHTML = '';
                let i = 0;
                const speed = 30; // Typing speed

                function typeWriter() {
                    if (i < letterContent.length) {
                        let char = letterContent.charAt(i);

                        // Handle HTML tags (like <br>) instantly
                        if (char === '<') {
                            let tag = '';
                            while (letterContent.charAt(i) !== '>' && i < letterContent.length) {
                                tag += letterContent.charAt(i);
                                i++;
                            }
                            tag += '>';
                            i++;
                            letterTextElement.innerHTML += tag;
                            typeWriter(); // Continue immediately after tag
                        } else {
                            letterTextElement.innerHTML += char;
                            i++;
                            setTimeout(typeWriter, speed);
                        }
                    }
                }
                typeWriter();

                // Remove the letter element once clicked
                element.remove();
            });

        } else {
            // Normal fallback (Hearts or GIFs)
            const isGif = Math.random() > 0.7 && gifUrls.length > 0;

            if (isGif) {
                const img = document.createElement('img');
                img.src = gifUrls[Math.floor(Math.random() * gifUrls.length)];
                img.style.width = '100px';
                img.style.height = 'auto';
                img.style.borderRadius = '10px';

                // If image fails to load (404 etc), remove it so it doesn't look ugly
                img.onerror = function () {
                    this.remove();
                };

                element.appendChild(img);
            } else {
                element.textContent = ['❤️', '💖', '💝', '💕', '💗', '💘'][Math.floor(Math.random() * 6)];
                element.style.fontSize = Math.random() * 30 + 20 + 'px';
            }
        }

        // Random positioning
        element.style.left = Math.random() * 90 + 5 + 'vw'; // Keep away from extreme edges
        element.style.top = '-100px';

        // Random fall duration
        const duration = Math.random() * 3 + 4 + 's'; // Slower fall (4-7s)
        element.style.animationDuration = duration;

        showerContainer.appendChild(element);

        // Remove after animation to prevent memory leak
        setTimeout(() => {
            if (element.parentNode) {
                element.remove();
            }
        }, parseFloat(duration) * 1000);
    }
});
