document.addEventListener('DOMContentLoaded', () => {
    const tabs = [...document.querySelectorAll('.ai-tabs__button')];
    function selectTab(button) {
        tabs.forEach((tab) => {
            const selected = tab === button;
            tab.classList.toggle('ai-tabs__button--active', selected);
            tab.setAttribute('aria-selected', String(selected));
            tab.tabIndex = selected ? 0 : -1;
            document.getElementById(tab.getAttribute('aria-controls')).hidden = !selected;
        });
        document.querySelectorAll('a[href="#ai-prices-text"], a[href="#ai-prices-voice"]').forEach((link) => {
            link.href = button.id === 'ai-tab-voice' ? '#ai-prices-voice' : '#ai-prices-text';
        });
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    }
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => selectTab(tab));
        tab.addEventListener('keydown', (event) => {
            if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
            event.preventDefault();
            const next = tabs[(index + (event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1) + tabs.length) % tabs.length];
            selectTab(next); next.focus();
        });
    });
    document.querySelectorAll('.ai-audio').forEach((player) => {
        const audio = player.querySelector('audio');
        const button = player.querySelector('.ai-audio__play');
        const seek = player.querySelector('.ai-audio__seek');
        const current = player.querySelector('.ai-audio__current');
        const duration = player.querySelector('.ai-audio__duration');
        const format = (seconds) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
        const update = () => {
            current.textContent = format(audio.currentTime || 0);
            duration.textContent = format(Number.isFinite(audio.duration) ? audio.duration : 0);
            seek.value = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
        };
        button.addEventListener('click', () => {
            if (!audio.paused) { audio.pause(); return; }
            document.querySelectorAll('.ai-audio audio').forEach((other) => { if (other !== audio) other.pause(); });
            audio.play().catch(() => { button.setAttribute('aria-label', 'Не удалось воспроизвести запись'); });
        });
        audio.addEventListener('play', () => { button.querySelector('span').textContent = '❚❚'; button.setAttribute('aria-label', 'Поставить запись на паузу'); });
        audio.addEventListener('pause', () => { button.querySelector('span').textContent = '▶'; button.setAttribute('aria-label', 'Воспроизвести запись'); });
        audio.addEventListener('loadedmetadata', update);
        audio.addEventListener('timeupdate', update);
        seek.addEventListener('input', () => { if (Number.isFinite(audio.duration)) audio.currentTime = audio.duration * seek.value / 100; });
    });
    const cases = document.querySelector('.b24-cases');
    if (!cases || typeof Swiper === 'undefined') return;
    const current = cases.querySelector('.b24-cases__current');
    const total = cases.querySelector('.b24-cases__total');
    function update(swiper) {
        const pages = Math.max(swiper.snapGrid.length, 1);
        current.textContent = String(Math.min((swiper.snapIndex || 0) + 1, pages)).padStart(2, '0');
        total.textContent = String(pages).padStart(2, '0');
    }
    new Swiper(cases.querySelector('.b24-cases__slider'), {
        slidesPerView: 1, spaceBetween: 20,
        breakpoints: { 601: { slidesPerView: 2 }, 993: { slidesPerView: 3 } },
        a11y: { prevSlideMessage: 'Предыдущий кейс', nextSlideMessage: 'Следующий кейс' },
        pagination: { el: cases.querySelector('.b24-cases__progress'), type: 'progressbar' },
        navigation: { prevEl: cases.querySelector('.b24-cases__prev'), nextEl: cases.querySelector('.b24-cases__next') },
        on: { init: update, snapIndexChange: update, snapGridLengthChange: update, resize: update }
    });
});
