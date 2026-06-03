document.addEventListener('DOMContentLoaded', () => {
    // 1. Floating Hearts Background Animation
    const heartsContainer = document.getElementById('hearts-container');
    const heartIcons = ['fa-heart', 'fa-heart', 'fa-star'];
    const colors = ['#ffb6c1', '#ffd1dc', '#ffc0cb', '#b76e79'];

    function createHeart() {
        const heart = document.createElement('i');
        const iconClass = heartIcons[Math.floor(Math.random() * heartIcons.length)];
        heart.classList.add('fas', iconClass, 'floating-heart');
        
        // Random properties
        const size = Math.random() * 15 + 10;
        const left = Math.random() * 100;
        const duration = Math.random() * 3 + 4;
        const color = colors[Math.floor(Math.random() * colors.length)];

        heart.style.fontSize = `${size}px`;
        heart.style.left = `${left}vw`;
        heart.style.top = `100vh`;
        heart.style.color = color;
        heart.style.animationDuration = `${duration}s`;

        heartsContainer.appendChild(heart);

        // Remove after animation completes
        setTimeout(() => {
            heart.remove();
        }, duration * 1000);
    }

    // Buat hati setiap 300ms
    setInterval(createHeart, 300);

    // 2. Open Gift Button Logic
    const openGiftBtn = document.getElementById('open-gift-btn');
    const welcomeSection = document.getElementById('welcome-section');
    const mainContent = document.getElementById('main-content');
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    const musicIcon = musicToggle.querySelector('i');
    
    let isMusicPlaying = false;
    let isSurpriseOpened = false;

    openGiftBtn.addEventListener('click', () => {
        // Tembak confetti di awal
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ffb6c1', '#ffd1dc', '#b76e79', '#ffffff']
        });

        // Transisi hilangkan welcome section
        welcomeSection.style.opacity = '0';
        
        setTimeout(() => {
            welcomeSection.style.display = 'none';
            mainContent.classList.remove('hidden');
            musicToggle.classList.remove('opacity-0');
            isSurpriseOpened = true;

            // Coba putar musik
            bgMusic.play().then(() => {
                isMusicPlaying = true;
            }).catch((err) => {
                console.log("Auto-play diblokir browser, user harus play manual", err);
                musicIcon.classList.remove('fa-music');
                musicIcon.classList.add('fa-volume-mute');
            });
            
            // Re-trigger observer untuk elemen yang baru muncul
            document.querySelectorAll('.fade-in-section').forEach(el => {
                observer.observe(el);
            });
        }, 1000);
    });

    // 3. Music Toggle Logic
    musicToggle.addEventListener('click', () => {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicIcon.classList.remove('fa-music');
            musicIcon.classList.add('fa-volume-mute');
        } else {
            bgMusic.play();
            musicIcon.classList.remove('fa-volume-mute');
            musicIcon.classList.add('fa-music');
        }
        isMusicPlaying = !isMusicPlaying;
    });

    // 4. Intersection Observer for Fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                
                // Trigger typing animation only once when letter section is visible
                if (entry.target.querySelector('#typewriter-container') && !isTypingStarted) {
                    isTypingStarted = true;
                    startTyping();
                }

                // Trigger confetti when age section is visible
                if (entry.target.id === 'age-section' && !isAgeConfettiFired) {
                    isAgeConfettiFired = true;
                    fireAgeConfetti();
                }
                
                // Optional: unobserve after animating
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    let isAgeConfettiFired = false;
    function fireAgeConfetti() {
        var duration = 3 * 1000;
        var end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#ffb6c1', '#ffd1dc']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#b76e79', '#ffffff']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }

    // 5. Typewriter Effect Logic
    let isTypingStarted = false;
    const typewriterText = document.getElementById('typewriter-text');
    const letterContent = document.getElementById('letter-content').innerHTML.replace(/\\n/g, '<br>');
    
    // Convert text to pure text and br tags, but here we just use innerHTML slowly
    let i = 0;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = letterContent;
    const nodes = Array.from(tempDiv.childNodes);
    
    // Simple character by character typing
    let rawText = letterContent;
    let currentHtml = "";
    let charIndex = 0;

    function startTyping() {
        if (charIndex < rawText.length) {
            // Check for HTML tags (like <br>)
            if (rawText.charAt(charIndex) === '<') {
                let tag = "";
                while(rawText.charAt(charIndex) !== '>' && charIndex < rawText.length){
                    tag += rawText.charAt(charIndex);
                    charIndex++;
                }
                tag += '>';
                currentHtml += tag;
            } else {
                currentHtml += rawText.charAt(charIndex);
            }
            
            typewriterText.innerHTML = currentHtml;
            charIndex++;
            setTimeout(startTyping, 40); // Kecepatan ngetik
        }
    }

    // 6. Lightbox Gallery Logic
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightboxBtn = document.getElementById('close-lightbox');

    galleryItems.forEach(item => {
        item.addEventListener('click', (e) => {
            lightboxImg.src = e.target.src;
            lightbox.classList.remove('hidden');
            
            // Sedikit delay agar transisi opacity/scale berjalan
            setTimeout(() => {
                lightbox.classList.remove('opacity-0');
                lightboxImg.classList.remove('scale-95');
                lightboxImg.classList.add('scale-100');
            }, 10);
        });
    });

    function closeLightbox() {
        lightbox.classList.add('opacity-0');
        lightboxImg.classList.remove('scale-100');
        lightboxImg.classList.add('scale-95');
        
        setTimeout(() => {
            lightbox.classList.add('hidden');
        }, 300);
    }

    closeLightboxBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // 7. Love Button Final Animation
    const loveBtn = document.getElementById('love-btn');
    loveBtn.addEventListener('click', () => {
        // Hujan hati layar penuh
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount,
                origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 },
                shapes: ['circle'],
                colors: ['#ffb6c1', '#ffc0cb', '#ff69b4', '#b76e79']
            }));
        }, 250);
        
        loveBtn.innerHTML = "<i class='fas fa-heart text-white'></i> LOVE YOUU MOREE!";
        loveBtn.classList.add('bg-pink-600');
    });

});
