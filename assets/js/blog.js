document.addEventListener('DOMContentLoaded', () => {
    const pagination = document.querySelector('.blog-pagination');
    if (pagination) {
        const total = 3;
        const requested = Number(new URLSearchParams(window.location.search).get('page')) || 1;
        const current = Math.min(total, Math.max(1, Math.floor(requested)));
        pagination.querySelector('.blog-pagination__current').textContent = String(current).padStart(2, '0');
        pagination.querySelector('.blog-pagination__track span').style.width = `${current / total * 100}%`;
        const prev = pagination.querySelector('.blog-pagination__prev');
        const next = pagination.querySelector('.blog-pagination__next');
        prev.href = `?page=${current - 1}`;
        next.href = `?page=${current + 1}`;
        if (current === 1) { prev.removeAttribute('href'); prev.setAttribute('aria-disabled', 'true'); }
        if (current === total) { next.removeAttribute('href'); next.setAttribute('aria-disabled', 'true'); }
    }

    const related = document.querySelector('.blog-related');
    if (!related || typeof Swiper === 'undefined') return;
    const current = related.querySelector('.blog-related__current');
    const total = related.querySelector('.blog-related__total');
    function updateRelatedCounter(swiper) {
        const pages = Math.max(swiper.snapGrid.length, 1);
        const page = Math.min((swiper.snapIndex || 0) + 1, pages);
        current.textContent = String(page).padStart(2, '0');
        total.textContent = String(pages).padStart(2, '0');
    }

    new Swiper(related.querySelector('.blog-related__slider'), {
        slidesPerView: 1,
        spaceBetween: 20,
        a11y: { prevSlideMessage: 'Предыдущая статья', nextSlideMessage: 'Следующая статья' },
        breakpoints: { 600: { slidesPerView: 2, spaceBetween: 20 }, 993: { slidesPerView: 3, spaceBetween: 29 } },
        pagination: { el: related.querySelector('.blog-related__progress'), type: 'progressbar' },
        navigation: { prevEl: related.querySelector('.blog-related__prev'), nextEl: related.querySelector('.blog-related__next') },
        on: {
            init: updateRelatedCounter,
            snapIndexChange: updateRelatedCounter,
            snapGridLengthChange: updateRelatedCounter,
            resize: updateRelatedCounter
        }
    });
});
