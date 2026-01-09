        // Initialize Lucide icons
        lucide.createIcons();

        // Reveal on scroll logic
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

        // Timeline scroll line logic
        window.addEventListener('scroll', () => {
            const timelineLine = document.getElementById('scroll-line');
            const timelineSection = document.getElementById('how-it-works');

            if (timelineSection) {
                const rect = timelineSection.getBoundingClientRect();
                const scrollPercentage = Math.min(Math.max((window.innerHeight / 2 - rect.top) / rect.height * 100, 0), 100);
                timelineLine.style.height = `${scrollPercentage}%`;
            }
        });

        // Add glass navbar behavior on scroll
        window.addEventListener('scroll', () => {
            const nav = document.querySelector('nav');
            if (window.scrollY > 50) {
                nav.querySelector('div').classList.add('shadow-xl');
            } else {
                nav.querySelector('div').classList.remove('shadow-xl');
            }
        });
   