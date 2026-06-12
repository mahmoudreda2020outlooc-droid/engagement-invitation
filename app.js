document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. Cover Overlay Fade-Out Logic
    // ==========================================
    const openBtn = document.getElementById('open-btn');
    const coverScreen = document.getElementById('cover-screen');
    const mainContent = document.getElementById('main-content');
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    let isMusicPlaying = false;

    openBtn.addEventListener('click', () => {
        // Smoothly fade out cover
        coverScreen.classList.add('fade-out');
        
        // Reveal main content after transition
        setTimeout(() => {
            coverScreen.style.display = 'none';
            mainContent.style.display = 'block';
            
            // Fade in main layout
            setTimeout(() => {
                mainContent.style.opacity = '1';
                revealOnScroll();
            }, 50);
            
            // Generate slow drifting petals
            createDriftingPetals();
            
        }, 800); // matches the CSS transition length of .cover-overlay.fade-out

        // Play background music
        bgMusic.volume = 0.5;
        bgMusic.play().then(() => {
            isMusicPlaying = true;
            musicToggle.classList.add('visible', 'playing');
            musicToggle.querySelector('i').className = 'fas fa-volume-up';
        }).catch(err => {
            console.log('Music autoplay blocked:', err);
            // Show the button anyway so user can manually start
            musicToggle.classList.add('visible');
            musicToggle.querySelector('i').className = 'fas fa-volume-mute';
        });
    });

    // Music toggle button
    musicToggle.addEventListener('click', () => {
        if (isMusicPlaying) {
            bgMusic.pause();
            isMusicPlaying = false;
            musicToggle.classList.remove('playing');
            musicToggle.querySelector('i').className = 'fas fa-volume-mute';
        } else {
            bgMusic.play().then(() => {
                isMusicPlaying = true;
                musicToggle.classList.add('playing');
                musicToggle.querySelector('i').className = 'fas fa-volume-up';
            }).catch(err => console.log('Play failed:', err));
        }
    });

    // ==========================================
    // 3. Slow Drifting Petals Generator
    // ==========================================
    function createDriftingPetals() {
        const container = document.getElementById('petals-container');
        const petalCount = 20; // Fewer particles for a cleaner look

        for (let i = 0; i < petalCount; i++) {
            const petal = document.createElement('div');
            petal.classList.add('petal');
            
            // Soft large floating circles/shapes
            petal.style.left = Math.random() * 100 + '%';
            petal.style.width = 15 + Math.random() * 25 + 'px';
            petal.style.height = petal.style.width;
            
            // Very slow falling speeds (9 to 18 seconds)
            petal.style.animationDuration = 9 + Math.random() * 9 + 's';
            petal.style.animationDelay = Math.random() * 10 + 's';
            petal.style.transform = `rotate(${Math.random() * 360}deg)`;

            container.appendChild(petal);
        }
    }

    // ==========================================
    // 4. Countdown Timer Logic
    // ==========================================
    // Target date: August 14, 2026, at 18:00 (6:00 PM) Cairo time
    const targetDate = new Date('2026-08-14T18:00:00+03:00').getTime();

    const countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            clearInterval(countdownInterval);
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            document.querySelector('.countdown-section .section-title').textContent = 'لقد بدأت فرحتنا الآن! 🎉';
            return;
        }

        // Calculations
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);

        // Render with leading zeros
        document.getElementById('days').textContent = d < 10 ? '0' + d : d;
        document.getElementById('hours').textContent = h < 10 ? '0' + h : h;
        document.getElementById('minutes').textContent = m < 10 ? '0' + m : m;
        document.getElementById('seconds').textContent = s < 10 ? '0' + s : s;
    }, 1000);

    // ==========================================
    // 5. Scroll Reveal Animation Logic
    // ==========================================
    const revealElements = document.querySelectorAll('.scroll-reveal');

    function revealOnScroll() {
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const revealPoint = 120;
            
            if (elementTop < window.innerHeight - revealPoint) {
                el.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', revealOnScroll);

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        revealElements.forEach(el => observer.observe(el));
    }

    // ==========================================
    // 8. Sharing API Logic
    // ==========================================
    const shareBtn = document.getElementById('btn-share');

    shareBtn.addEventListener('click', async () => {
        const shareData = {
            title: 'دعوة خطوبة أحمد وياسمين 💍',
            text: 'نتشرف بدعوتكم لحضور حفل خطوبتنا ومشاركتنا فرحة العمر. تفاصيل الحفل وتأكيد الحضور عبر الرابط:',
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Share canceled/failed', err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
                
                const toast = document.createElement('div');
                toast.textContent = 'تم نسخ رابط الدعوة بنجاح! 📋';
                toast.style.position = 'fixed';
                toast.style.bottom = '90px';
                toast.style.left = '50%';
                toast.style.transform = 'translateX(-50%)';
                toast.style.backgroundColor = 'var(--primary-color)';
                toast.style.color = '#FFFFFF';
                toast.style.padding = '10px 24px';
                toast.style.borderRadius = '6px';
                toast.style.boxShadow = 'var(--shadow-md)';
                toast.style.fontSize = '0.9rem';
                toast.style.zIndex = '1000';
                toast.style.animation = 'fadeIn 0.3s ease-out';
                
                document.body.appendChild(toast);
                
                setTimeout(() => {
                    toast.style.transition = 'opacity 0.5s ease';
                    toast.style.opacity = '0';
                    setTimeout(() => toast.remove(), 500);
                }, 2500);
                
            } catch (err) {
                alert('فشل نسخ الرابط، يمكنك نسخه يدوياً من شريط العنوان.');
            }
        }
    });
});
