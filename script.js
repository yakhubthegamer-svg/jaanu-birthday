/* ----------------------------------------------------
   HAPPY BIRTHDAY SURPRISE APP - MAIN SCRIPT
   ---------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

    // Audio Player
    let audioCtx = null;
    let isMusicPlaying = false;
    const bgMusic = new Audio('music.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0.5;

    // Canvas State
    const canvas = document.getElementById('ambientCanvas');
    const ctx = canvas.getContext('2d');
    let petals = [];
    let sparkles = [];
    let roseParticles = [];
    let kissParticles = [];

    // --- 1. AMBIENT ROSES, SPARKLES & EMITTER CANVAS ---
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // BACKGROUND ROSE PETAL SHAPE CLASS
    class Petal {
        constructor(x, y) {
            this.x = x !== undefined ? x : Math.random() * canvas.width;
            this.y = y !== undefined ? y : -20;
            this.size = Math.random() * 10 + 8;
            this.speedY = Math.random() * 1.5 + 0.8;
            this.speedX = Math.random() * 2 - 1;
            this.rotation = Math.random() * 360;
            this.rotSpeed = Math.random() * 2 - 1;
            const roseColors = ['#ff0040', '#d90429', '#ff2a5f', '#b7094c'];
            this.color = roseColors[Math.floor(Math.random() * roseColors.length)];
            this.opacity = Math.random() * 0.5 + 0.3;
        }
        update() {
            this.y += this.speedY;
            this.x += Math.sin(this.y * 0.015) + this.speedX;
            this.rotation += this.rotSpeed;
            if (this.y > canvas.height + 30) {
                this.y = -20;
                this.x = Math.random() * canvas.width;
            }
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-this.size, -this.size / 2, -this.size, this.size, 0, this.size);
            ctx.bezierCurveTo(this.size, this.size, this.size, -this.size / 2, 0, 0);
            ctx.fill();
            ctx.restore();
        }
    }

    // RED ROSES FALLING FROM TOP MIDDLE OF SCREEN (🌹 ONLY)
    class RoseParticle {
        constructor(startX, startY) {
            this.x = startX + (Math.random() * 220 - 110);
            this.y = startY + (Math.random() * 40 - 20);
            this.speedY = Math.random() * 3 + 2; // FALL DOWNWARD
            this.speedX = Math.random() * 3 - 1.5;
            this.opacity = 1;
            this.fade = 0.009;
        }
        update() {
            this.y += this.speedY;
            this.x += Math.sin(this.y * 0.02) * 1.5 + this.speedX;
            this.opacity -= this.fade;
        }
    }

    // LIP KISS MARKS FALLING FROM TOP MIDDLE OF SCREEN (💋 ONLY)
    class KissParticle {
        constructor(startX, startY) {
            this.x = startX + (Math.random() * 200 - 100);
            this.y = startY + (Math.random() * 40 - 20);
            this.speedY = Math.random() * 3 + 2; // FALL DOWNWARD
            this.speedX = Math.random() * 3 - 1.5;
            this.opacity = 1;
            this.fade = 0.01;
        }
        update() {
            this.y += this.speedY;
            this.x += Math.sin(this.y * 0.02) * 1.5 + this.speedX;
            this.opacity -= this.fade;
        }
    }

    class Sparkle {
        constructor(x, y) {
            this.x = x || Math.random() * canvas.width;
            this.y = y || Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.alpha = Math.random();
            this.speed = Math.random() * 0.02 + 0.01;
        }
        update() {
            this.alpha += this.speed;
            if (this.alpha > 1 || this.alpha < 0) this.speed = -this.speed;
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.alpha);
            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // Initial ambient background
    for (let i = 0; i < 25; i++) petals.push(new Petal());
    for (let i = 0; i < 30; i++) sparkles.push(new Sparkle());

    // HIGH-FPS ANIMATION LOOP
    function animateCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        petals.forEach(p => { p.update(); p.draw(); });
        sparkles.forEach(s => { s.update(); s.draw(); });

        // RENDER RED ROSES (🌹 FALLING FROM TOP MIDDLE)
        if (roseParticles.length > 0) {
            roseParticles = roseParticles.filter(r => r.opacity > 0);
            ctx.save();
            ctx.font = '32px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
            roseParticles.forEach(r => {
                r.update();
                ctx.globalAlpha = Math.max(0, r.opacity);
                ctx.fillText('🌹', r.x, r.y);
            });
            ctx.restore();
        }

        // RENDER LIP KISS MARKS (💋 FALLING FROM TOP MIDDLE)
        if (kissParticles.length > 0) {
            kissParticles = kissParticles.filter(k => k.opacity > 0);
            ctx.save();
            ctx.font = '32px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
            kissParticles.forEach(k => {
                k.update();
                ctx.globalAlpha = Math.max(0, k.opacity);
                ctx.fillText('💋', k.x, k.y);
            });
            ctx.restore();
        }

        requestAnimationFrame(animateCanvas);
    }
    animateCanvas();

    // Mouse sparkle trail
    window.addEventListener('mousemove', (e) => {
        if (Math.random() < 0.1) {
            sparkles.push(new Sparkle(e.clientX, e.clientY));
            if (sparkles.length > 50) sparkles.shift();
        }
    });

    // --- 2. HOLD TO UNLOCK SURPRISE EXPERIENCE ---
    const giftBoxTrigger = document.getElementById('giftBoxTrigger');
    const holdProgress = document.getElementById('holdProgress');
    const lockScreen = document.getElementById('lockScreen');
    const mainContent = document.getElementById('mainContent');

    let holdTimer = null;
    let holdDuration = 0;
    const maxHold = 100;

    function startHold(e) {
        e.preventDefault();
        holdDuration = 0;
        clearInterval(holdTimer);
        holdTimer = setInterval(() => {
            holdDuration += 4;
            holdProgress.style.width = `${holdDuration}%`;
            if (holdDuration >= maxHold) {
                clearInterval(holdTimer);
                unlockSurprise();
            }
        }, 30);
    }

    function endHold() {
        clearInterval(holdTimer);
        if (holdDuration < maxHold) {
            holdDuration = 0;
            holdProgress.style.width = '0%';
        }
    }

    if (giftBoxTrigger) {
        giftBoxTrigger.addEventListener('click', () => {
            unlockSurprise();
        });
        giftBoxTrigger.addEventListener('mousedown', startHold);
        giftBoxTrigger.addEventListener('mouseup', endHold);
        giftBoxTrigger.addEventListener('mouseleave', endHold);
        giftBoxTrigger.addEventListener('touchstart', startHold);
        giftBoxTrigger.addEventListener('touchend', endHold);
    }

    function unlockSurprise() {
        if (lockScreen) lockScreen.classList.add('hidden');
        if (mainContent) mainContent.classList.remove('hidden');

        triggerFireworks();
        initAndPlayMusic();
        setTimeout(initScratchCards, 300); // wait for layout to paint before sizing canvas
    }

    // --- 3. ROMANTIC MP3 MUSIC PLAYER (LOOPS FOREVER) ---
    function initAndPlayMusic() {
        if (isMusicPlaying) return;
        bgMusic.play().then(() => {
            isMusicPlaying = true;
        }).catch(err => {
            console.warn("Autoplay waiting for user gesture:", err);
            isMusicPlaying = false;
        });
    }

    // Enable music on first user interaction anywhere on screen if autoplay was blocked
    const startAudioOnInteraction = () => {
        if (!isMusicPlaying && bgMusic) {
            bgMusic.play().then(() => {
                isMusicPlaying = true;
                document.removeEventListener('click', startAudioOnInteraction);
                document.removeEventListener('touchstart', startAudioOnInteraction);
            }).catch(() => {});
        }
    };
    document.addEventListener('click', startAudioOnInteraction);
    document.addEventListener('touchstart', startAudioOnInteraction);

    // --- 4. TOGETHERNESS TIMER ---
    function updateTimer() {
        const start = new Date("2022-01-01").getTime();
        const now = new Date().getTime();
        const diff = Math.max(0, now - start);

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('daysCount').textContent = String(days).padStart(2, '0');
        document.getElementById('hoursCount').textContent = String(hours).padStart(2, '0');
        document.getElementById('minsCount').textContent = String(minutes).padStart(2, '0');
        document.getElementById('secsCount').textContent = String(seconds).padStart(2, '0');
    }
    setInterval(updateTimer, 1000);
    updateTimer();

    // --- 5. FLOATING BALLOON POPPING GAME ---
    const balloonContainer = document.getElementById('balloonContainer');
    const balloonWishes = [
        "🌸 You make my world blooming & beautiful!",
        "💎 You are my priceless treasure, Jaanu!",
        "👑 Happy Birthday to the Queen of my heart!",
        "🎂 May all your dreams & wishes come true today!",
        "💖 I love you more than words could ever say!"
    ];
    const balloonColors = ['#ff2a5f', '#ff7aa2', '#ffd700', '#c0133c', '#ff5277'];

    function renderBalloons() {
        balloonContainer.innerHTML = '';
        balloonWishes.forEach((wish, idx) => {
            const b = document.createElement('div');
            b.className = 'balloon';
            b.style.setProperty('--balloon-color', balloonColors[idx % balloonColors.length]);
            b.style.animationDelay = `${idx * 0.4}s`;
            
            b.addEventListener('click', () => {
                popSound();
                alert(`🎈 Special Wish Revealed:\n\n"${wish}"`);
                b.style.opacity = '0.3';
                b.style.pointerEvents = 'none';
            });
            
            balloonContainer.appendChild(b);
        });
    }
    renderBalloons();

    function popSound() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.setValueAtTime(300, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
    }

    // --- 6. INTERACTIVE CANDLE BLOW-OUT ---
    const candles = document.querySelectorAll('.candle');
    const cakeStatus = document.getElementById('cakeStatus');
    const wishModal = document.getElementById('wishModal');
    let candlesLit = candles.length;

    candles.forEach(candle => {
        candle.addEventListener('click', () => {
            if (!candle.classList.contains('off')) {
                candle.classList.add('off');
                candlesLit--;
                popSound();
                
                if (candlesLit > 0) {
                    cakeStatus.innerHTML = `<i class="fas fa-fire flame-icon"></i> ${candlesLit} Candle${candlesLit > 1 ? 's' : ''} left! Keep blowing!`;
                } else {
                    cakeStatus.innerHTML = `<i class="fas fa-check-circle gold-icon"></i> All Candles Blown Out! ✨`;
                    wishModal.classList.remove('hidden');
                    triggerFireworks();
                }
            }
        });
    });

    window.reLightCandles = function() {
        candles.forEach(c => c.classList.remove('off'));
        candlesLit = candles.length;
        wishModal.classList.add('hidden');
        cakeStatus.innerHTML = `<i class="fas fa-fire flame-icon"></i> 5 Candles Glowing. Click them to blow them out!`;
    };

    // --- 7. ROSES & KISSES FALLING FROM TOP MIDDLE OF SCREEN ---
    let roseTotal = 0;
    let kissTotal = 0;

    function popSound() {
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.08);
            gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.08);
        } catch(e) {}
    }

    const sendRosesBtn = document.getElementById('sendRosesBtn');
    const sendKissesBtn = document.getElementById('sendKissesBtn');

    if (sendRosesBtn) {
        sendRosesBtn.addEventListener('click', () => {
            roseTotal += 100;
            document.getElementById('roseCount').textContent = roseTotal;
            
            if (roseParticles.length > 25) roseParticles.splice(0, 10);

            const topMiddleX = window.innerWidth / 2;
            const topMiddleY = -30;

            for (let i = 0; i < 15; i++) {
                roseParticles.push(new RoseParticle(topMiddleX, topMiddleY));
            }
            popSound();
        });
    }

    if (sendKissesBtn) {
        sendKissesBtn.addEventListener('click', () => {
            kissTotal += 10;
            document.getElementById('kissCount').textContent = kissTotal;
            
            if (kissParticles.length > 25) kissParticles.splice(0, 10);

            const topMiddleX = window.innerWidth / 2;
            const topMiddleY = -30;

            for (let i = 0; i < 15; i++) {
                kissParticles.push(new KissParticle(topMiddleX, topMiddleY));
            }
            popSound();
        });
    }

    // --- 8. REAL HTML5 CANVAS SCRATCH CARD SYSTEM ---
    function initScratchCards() {
        const scratchCanvases = document.querySelectorAll('.scratch-canvas');

        scratchCanvases.forEach(canvasEl => {
            const container = canvasEl.parentElement;

            // Use offsetWidth/Height so it works even if called before layout paint
            const w = container.offsetWidth  || 300;
            const h = container.offsetHeight || 220;

            canvasEl.width  = w;
            canvasEl.height = h;

            const sCtx = canvasEl.getContext('2d');

            // ---- Draw metallic gold foil ----
            const grad = sCtx.createLinearGradient(0, 0, w, h);
            grad.addColorStop(0,   '#c8960c');
            grad.addColorStop(0.2, '#ffd700');
            grad.addColorStop(0.4, '#fff4b8');
            grad.addColorStop(0.6, '#ffd700');
            grad.addColorStop(0.8, '#aa7c11');
            grad.addColorStop(1,   '#d4af37');
            sCtx.fillStyle = grad;
            sCtx.fillRect(0, 0, w, h);

            // Shimmer sparkle dots
            sCtx.fillStyle = 'rgba(255,255,255,0.3)';
            for (let i = 0; i < 80; i++) {
                sCtx.beginPath();
                sCtx.arc(Math.random() * w, Math.random() * h, Math.random() * 2.5 + 0.5, 0, Math.PI * 2);
                sCtx.fill();
            }

            // Diagonal stripe shimmer
            sCtx.strokeStyle = 'rgba(255,255,255,0.12)';
            sCtx.lineWidth = 8;
            for (let i = -h; i < w + h; i += 22) {
                sCtx.beginPath();
                sCtx.moveTo(i, 0);
                sCtx.lineTo(i + h, h);
                sCtx.stroke();
            }

            // Instruction text
            sCtx.fillStyle = '#3a1a00';
            sCtx.font = 'bold 16px "Outfit", sans-serif';
            sCtx.textAlign = 'center';
            sCtx.textBaseline = 'middle';
            sCtx.fillText('🪙  Scratch Here  🪙', w / 2, h / 2 - 14);
            sCtx.font = 'italic 12px "Playfair Display", serif';
            sCtx.fillStyle = '#5a3000';
            sCtx.fillText("Rub to reveal your Birthday Reward!", w / 2, h / 2 + 14);

            let isScratching = false;
            let totalPixels = 0;
            let done = false;

            function getPos(e, touch) {
                const r = canvasEl.getBoundingClientRect();
                const src = touch ? e.touches[0] : e;
                return { x: src.clientX - r.left, y: src.clientY - r.top };
            }

            function scratch(x, y) {
                if (done) return;
                sCtx.globalCompositeOperation = 'destination-out';
                sCtx.beginPath();
                sCtx.arc(x, y, 26, 0, Math.PI * 2);
                sCtx.fill();
                totalPixels++;
                if (totalPixels > 30) checkScratchCompletion(sCtx, canvasEl);
            }

            // Mouse
            canvasEl.addEventListener('mousedown',  e => { isScratching = true;  scratch(...Object.values(getPos(e, false))); });
            canvasEl.addEventListener('mousemove',  e => { if (isScratching) scratch(...Object.values(getPos(e, false))); });
            window .addEventListener('mouseup',     () => { isScratching = false; });

            // Touch
            canvasEl.addEventListener('touchstart', e => { e.preventDefault(); isScratching = true;  scratch(...Object.values(getPos(e, true))); }, { passive: false });
            canvasEl.addEventListener('touchmove',  e => { e.preventDefault(); if (isScratching) scratch(...Object.values(getPos(e, true))); }, { passive: false });
            canvasEl.addEventListener('touchend',   () => { isScratching = false; });
        });
    }

    function checkScratchCompletion(sCtx, canvasEl) {
        const imageData = sCtx.getImageData(0, 0, canvasEl.width, canvasEl.height);
        const pixels = imageData.data;
        let cleared = 0;

        for (let i = 3; i < pixels.length; i += 16) {
            if (pixels[i] === 0) cleared++;
        }

        const percent = (cleared / (pixels.length / 16)) * 100;
        if (percent > 38) {
            canvasEl.style.transition = 'opacity 0.6s ease';
            canvasEl.style.opacity = '0';
            canvasEl.style.pointerEvents = 'none';
            popSound();

            // Rose shower celebration on reveal
            const midX = window.innerWidth / 2;
            for (let i = 0; i < 18; i++) {
                roseParticles.push(new RoseParticle(midX, -30));
            }
        }
    }

    // --- 9. SMOOTH SLOW HEARTBEAT SYNC SENSOR ---
    const heartbeatBtn = document.getElementById('heartbeatBtn');
    const heartbeatStatus = document.getElementById('heartbeatStatus');

    function playSlowSmoothHeartbeat() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        function singleBeat(delay) {
            setTimeout(() => {
                const osc1 = audioCtx.createOscillator();
                const gain1 = audioCtx.createGain();
                osc1.type = 'sine';
                osc1.frequency.setValueAtTime(60, audioCtx.currentTime);
                osc1.frequency.exponentialRampToValueAtTime(25, audioCtx.currentTime + 0.2);
                gain1.gain.setValueAtTime(0.3, audioCtx.currentTime);
                gain1.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
                osc1.connect(gain1);
                gain1.connect(audioCtx.destination);
                osc1.start();
                osc1.stop(audioCtx.currentTime + 0.2);

                setTimeout(() => {
                    const osc2 = audioCtx.createOscillator();
                    const gain2 = audioCtx.createGain();
                    osc2.type = 'sine';
                    osc2.frequency.setValueAtTime(70, audioCtx.currentTime);
                    osc2.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.2);
                    gain2.gain.setValueAtTime(0.4, audioCtx.currentTime);
                    gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
                    osc2.connect(gain2);
                    gain2.connect(audioCtx.destination);
                    osc2.start();
                    osc2.stop(audioCtx.currentTime + 0.2);
                }, 180);
            }, delay);
        }

        singleBeat(0);
        singleBeat(1000);
        singleBeat(2000);
    }

    if (heartbeatBtn) {
        heartbeatBtn.addEventListener('click', () => {
            playSlowSmoothHeartbeat();
            
            heartbeatBtn.classList.add('slow-smooth-beat');
            heartbeatStatus.textContent = "Synced! Beating slowly & deeply with you ❤️";
            heartbeatStatus.style.color = "#ffd700";

            setTimeout(() => {
                heartbeatBtn.classList.remove('slow-smooth-beat');
                heartbeatStatus.textContent = "Touch Heart To Sync Beat";
                heartbeatStatus.style.color = "var(--gold-accent)";
            }, 3800);
        });
    }

    // --- 10. REASONS WHY I LOVE YOU DECK ---
    const loveReasons = [
        "Your smile brightens up my whole world even on the darkest days.",
        "The gentle and caring way you look after me and our family.",
        "Your contagious laugh that brings instant joy to my heart.",
        "How you support my dreams and stand by me like a rock.",
        "Your kindness to everyone around you inspires me every day.",
        "The cozy feeling of holding your hand wherever we go.",
        "You are not just my wife, but my absolute best friend in the entire world.",
        "How gorgeous you look every single moment without even trying."
    ];

    let currentReasonIdx = 0;
    const drawBtn = document.getElementById('drawLoveCardBtn');
    const loveText = document.getElementById('loveReasonText');
    const loveNum = document.getElementById('loveReasonNumber');
    const loveDisplay = document.getElementById('loveCardDisplay');

    if (drawBtn) {
        drawBtn.addEventListener('click', () => {
            currentReasonIdx = (currentReasonIdx + 1) % loveReasons.length;
            loveDisplay.style.transform = 'scale(0.95)';
            loveDisplay.style.opacity = '0.5';

            setTimeout(() => {
                loveText.textContent = `"${loveReasons[currentReasonIdx]}"`;
                loveNum.textContent = `Love Note #${currentReasonIdx + 1}`;
                loveDisplay.style.transform = 'scale(1)';
                loveDisplay.style.opacity = '1';
                
                const topMiddleX = window.innerWidth / 2;
                const topMiddleY = -30;
                for (let i = 0; i < 6; i++) {
                    kissParticles.push(new KissParticle(topMiddleX, topMiddleY));
                }
            }, 200);
        });
    }

    // --- 11. PHOTO LIGHTBOX MODAL ---
    window.openPhotoModal = function(src, title, desc) {
        document.getElementById('modalImg').src = src;
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalDesc').textContent = desc;
        document.getElementById('photoModal').classList.remove('hidden');
    };

    window.closePhotoModal = function() {
        document.getElementById('photoModal').classList.add('hidden');
    };

    // --- 12. FIREWORKS ENGINE ---
    window.triggerFireworks = function() {
        if (typeof confetti === 'function') {
            const count = 180;
            const defaults = { origin: { y: 0.7 } };

            function fire(particleRatio, opts) {
                confetti({
                    ...defaults,
                    ...opts,
                    particleCount: Math.floor(count * particleRatio)
                });
            }

            fire(0.25, { spread: 26, startVelocity: 55, colors: ['#ffd700', '#ff2a5f'] });
            fire(0.2, { spread: 60, colors: ['#ffffff', '#ff7aa2'] });
            fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
            fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, colors: ['#ffd700', '#ffffff'] });
            fire(0.1, { spread: 120, startVelocity: 45 });
        }
    };

    // Initialize scratch card gold foil
    setTimeout(initScratchCards, 100);

});
