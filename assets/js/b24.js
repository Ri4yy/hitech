document.addEventListener('DOMContentLoaded', () => {
    const prices = document.querySelector('[data-b24-prices]');
    if (prices) {
        prices.querySelectorAll('[data-period]').forEach((button) => {
            button.addEventListener('click', () => {
                const period = button.dataset.period;
                prices.querySelectorAll('[data-period]').forEach((item) => {
                    const active = item === button;
                    item.classList.toggle('b24-prices__period--active', active);
                    item.setAttribute('aria-pressed', String(active));
                });
                prices.querySelectorAll('[data-year][data-month]').forEach((amount) => {
                    amount.textContent = amount.dataset[period];
                    amount.closest('.b24-tariff').classList.toggle('is-month', period === 'month');
                });
            });
        });
    }

    const cases = document.querySelector('.b24-cases');
    if (!cases || typeof Swiper === 'undefined') return;
    const current = cases.querySelector('.b24-cases__current');
    const total = cases.querySelector('.b24-cases__total');
    function updateCounter(swiper) {
        const pages = Math.max(swiper.snapGrid.length, 1);
        current.textContent = String(Math.min((swiper.snapIndex || 0) + 1, pages)).padStart(2, '0');
        total.textContent = String(pages).padStart(2, '0');
    }
    new Swiper(cases.querySelector('.b24-cases__slider'), {
        slidesPerView: 1,
        spaceBetween: 20,
        breakpoints: { 601: { slidesPerView: 2, spaceBetween: 20 }, 993: { slidesPerView: 3, spaceBetween: 20 } },
        a11y: { prevSlideMessage: 'Предыдущий кейс', nextSlideMessage: 'Следующий кейс' },
        pagination: { el: cases.querySelector('.b24-cases__progress'), type: 'progressbar' },
        navigation: { prevEl: cases.querySelector('.b24-cases__prev'), nextEl: cases.querySelector('.b24-cases__next') },
        on: { init: updateCounter, snapIndexChange: updateCounter, snapGridLengthChange: updateCounter, resize: updateCounter }
    });
});
