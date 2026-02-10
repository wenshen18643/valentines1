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
    const CLICK_THRESHOLD = 3;

    // Try to fetch from file, but don't break if it fails
    fetch('gifs_to_use.txt')
        .then(response => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.text();
        })
        .then(text => {
            const lines = text.split('\n').map(url => url.trim()).filter(url => url.length > 0);
            if (lines.length > 0) {
                gifUrls = lines;
            }
        })
        .catch(err => console.log('Using default GIFs (likely due to CORS on local file):', err));

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
        errorPopup.classList.remove('hidden');
    }

    closePopupBtn.addEventListener('click', () => {
        errorPopup.classList.add('hidden');
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

        // Randomly decide if it's a heart or a GIF
        const isGif = Math.random() > 0.7 && gifUrls.length > 0;

        if (isGif) {
            const img = document.createElement('img');
            img.src = gifUrls[Math.floor(Math.random() * gifUrls.length)];
            img.style.width = '100px';
            img.style.height = 'auto';
            img.style.borderRadius = '10px';
            element.appendChild(img);
        } else {
            element.textContent = ['❤️', '💖', '💝', '💕', '💗', '💘'][Math.floor(Math.random() * 6)];
            element.style.fontSize = Math.random() * 30 + 20 + 'px';
        }

        // Random positioning
        element.style.left = Math.random() * 100 + 'vw';
        element.style.top = '-100px';

        // Random fall duration
        const duration = Math.random() * 3 + 2 + 's';
        element.style.animationDuration = duration;

        showerContainer.appendChild(element);

        // Remove after animation to prevent memory leak
        setTimeout(() => {
            element.remove();
        }, parseFloat(duration) * 1000);
    }
});
