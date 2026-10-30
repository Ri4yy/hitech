document.addEventListener('DOMContentLoaded', () => {
    const root = document.querySelector('.context-cases');
    if (!root || typeof Swiper === 'undefined') return;
    function update(swiper) {
        const total = Math.max(swiper.snapGrid.length, 1);
        root.querySelector('.context-cases__current').textContent = String(swiper.snapIndex + 1).padStart(2, '0');
        root.querySelector('.context-cases__total').textContent = String(total).padStart(2, '0');
    }
    new Swiper(root.querySelector('.context-cases__slider'), {
        slidesPerView: 1, spaceBetween: 30,
        navigation: { prevEl: root.querySelector('.context-cases__prev'), nextEl: root.querySelector('.context-cases__next') },
        pagination: { el: root.querySelector('.context-cases__progress'), type: 'progressbar' },
        a11y: { prevSlideMessage: 'Предыдущий кейс', nextSlideMessage: 'Следующий кейс' },
        on: { init: update, slideChange: update, resize: update }
    });
    const galleries = [];
    root.querySelectorAll('.context-case__image').forEach((gallery) => {
        galleries.push(new Swiper(gallery.querySelector('.context-case__gallery'), {
            slidesPerView: 1, spaceBetween: 20, nested: true,
            navigation: { prevEl: gallery.querySelector('.context-case__prev'), nextEl: gallery.querySelector('.context-case__next') },
            a11y: { prevSlideMessage: 'Предыдущее изображение', nextSlideMessage: 'Следующее изображение' }
        }));
    });
    window.addEventListener('resize', () => { requestAnimationFrame(() => galleries.forEach((gallery) => gallery.update())); });
});
