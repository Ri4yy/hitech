document.addEventListener('DOMContentLoaded', () => {
    let menu = document.querySelector('.header-mobile'),
        btnMenu = document.querySelector('.btn-menu'),
        html = document.querySelector('html');

    btnMenu.addEventListener('click', (e) => {
        btnMenu.classList.toggle('open')
        menu.classList.toggle('open')

        html.classList.toggle('no-scroll')
    })
    function resize() {
        let width = window.innerWidth;

        if (width > 1024) {
            menu.classList.remove('open')
            html.classList.remove('no-scroll')
        } else {
            return
        }
    }

    window.addEventListener('resize', () => {
        resize()
    })
    resize()

    // faq
    let accordionItems = document.querySelectorAll('.faq__item');

    accordionItems.forEach((item) => {
        let btn = item.querySelector('.faq__item-top');
        let content = item.querySelector('.faq__item-content');

        btn.addEventListener('click', (e) => {
            item.classList.toggle('active')
        })
    })

    // === Динамическое приближение текста к низу преимущества ===
    document.querySelectorAll('.advantages__item').forEach(item => {
        const text = item.querySelector('.advantages__item-text');
        if (!text) return;

        item.addEventListener('mouseenter', () => {
            const itemStyles = getComputedStyle(item);
            const padTop = parseFloat(itemStyles.paddingTop);
            const padBot = parseFloat(itemStyles.paddingBottom);
            const itemHeight = item.clientHeight; 
            const textRect = text.getBoundingClientRect();

            const textHeight = text.offsetHeight;

            let marginTop = itemHeight - padBot - padTop - textHeight;
            if (marginTop < 0) marginTop = 0; 

            text.style.marginTop = marginTop + 'px';
        });
        item.addEventListener('mouseleave', () => {
            text.style.marginTop = '';
        });
    });

    function tabs(wrapperMain, wrapperTab, wrapperContent, activeTab, activeContent) {
        $(wrapperTab).on('click', 'li:not('+activeTab+')', function () {
            $(this)
                .addClass(activeTab).siblings().removeClass(activeTab)
                .closest(wrapperMain).find(wrapperContent).removeClass(activeContent).eq($(this).index()).addClass(activeContent);
        });
    }
    tabs('.tabs', '.tabs__list', '.tabs__content', 'active-tab', 'active');

    // Infinite marquee: clone track for seamless loop
    document.querySelectorAll('[data-marquee]').forEach((marquee) => {
        const track = marquee.querySelector('.advantages-marquee__track');
        if (!track) return;
        const clone = track.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        marquee.appendChild(clone);
    });

    // Team stack slider (About page) — кастом под макет: один baseline по Y, заполнение по ширине
    document.querySelectorAll('[data-team-stack]').forEach((stack) => {
        const content = stack.closest('.team__content') || stack.parentElement;
        const prevBtn = content ? content.querySelector('.team__nav--prev') : null;
        const nextBtn = content ? content.querySelector('.team__nav--next') : null;
        const captionName = content ? content.querySelector('.team__caption-name') : null;
        const captionRole = content ? content.querySelector('.team__caption-role') : null;

        const items = Array.from(stack.querySelectorAll('.team-stack__item'));
        if (items.length < 2) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const mq992 = window.matchMedia('(max-width: 993px)');
        const mq600 = window.matchMedia('(max-width: 601px)');
        const AUTOPLAY_DELAY = 320000;
        let activeIndex = 0;
        let timer = null;

        // 4 слота как на макете: слева → активный → правый → крайний правый
        const slotClasses = ['is-slot-0', 'is-slot-1', 'is-slot-2', 'is-slot-3'];

        function mod(n, m) {
            return ((n % m) + m) % m;
        }

        function getVisibleSlotsCount() {
            if (mq600.matches) return 1;
            if (mq992.matches) return 2;
            return 4;
        }

        function apply() {
            items.forEach((el) => {
                el.classList.remove('is-active', ...slotClasses);
                el.setAttribute('aria-hidden', 'true');
                // Принудительно скрываем всё, что не попало в видимые слоты
                // (чтобы на <992 не оставались видимыми "лишние" элементы)
                el.style.opacity = '0';
                el.style.visibility = 'hidden';
            });

            const visibleCount = getVisibleSlotsCount();

            const order = visibleCount === 1
                ? [mod(activeIndex, items.length)]
                : visibleCount === 2
                    ? [mod(activeIndex, items.length), mod(activeIndex + 1, items.length)]
                    : [
                        mod(activeIndex - 1, items.length),
                        mod(activeIndex, items.length),
                        mod(activeIndex + 1, items.length),
                        mod(activeIndex + 2, items.length),
                    ];

            const slots = visibleCount === 1
                ? ['is-slot-1']
                : visibleCount === 2
                    ? ['is-slot-1', 'is-slot-2']
                    : slotClasses;

            order.forEach((idx, slot) => {
                const el = items[idx];
                if (!el) return;
                el.classList.add(slots[slot]);
                el.style.zIndex = String(10 - slot);
                el.setAttribute('aria-hidden', 'false');
                el.style.opacity = '1';
                el.style.visibility = 'visible';
                if (slots[slot] === 'is-slot-1') el.classList.add('is-active');
            });

            const activeEl = items[mod(activeIndex, items.length)];
            const name = activeEl?.dataset?.name || '';
            const role = activeEl?.dataset?.role || '';
            if (captionName) captionName.textContent = name;
            if (captionRole) captionRole.textContent = role;
        }

        function stopAutoplay() {
            if (timer) window.clearInterval(timer);
            timer = null;
        }

        function startAutoplay() {
            if (prefersReducedMotion) return;
            stopAutoplay();
            timer = window.setInterval(() => {
                activeIndex = mod(activeIndex + 1, items.length);
                apply();
            }, AUTOPLAY_DELAY);
        }

        function goNext() {
            activeIndex = mod(activeIndex + 1, items.length);
            apply();
            startAutoplay();
        }

        function goPrev() {
            activeIndex = mod(activeIndex - 1, items.length);
            apply();
            startAutoplay();
        }

        prevBtn?.addEventListener('click', goPrev);
        nextBtn?.addEventListener('click', goNext);

        stack.addEventListener('mouseenter', stopAutoplay);
        stack.addEventListener('mouseleave', startAutoplay);

        mq992.addEventListener('change', () => {
            apply();
        });
        mq600.addEventListener('change', () => {
            apply();
        });

        apply();
        startAutoplay();
    });

    // Contacts info card toggle
    const contactsInfoCards = document.querySelectorAll('.contacts-info');
    contactsInfoCards.forEach((card) => {
        const button = card.querySelector('.contacts-info__btn');
        const wrappers = card.querySelectorAll('.contacts-info__wrapper');
        if (!button || wrappers.length < 2) return;

        wrappers.forEach((wrapper) => wrapper.classList.remove('hidden'));
        button.setAttribute('aria-expanded', 'false');

        button.addEventListener('click', () => {
            const isOpen = card.classList.toggle('open');
            button.classList.toggle('open', isOpen);
            button.setAttribute('aria-expanded', String(isOpen));
        });
    });

    // GSAP animations
    if (window.gsap) {
        gsap.registerPlugin(ScrollTrigger);

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isMobile = window.matchMedia('(max-width: 768px)').matches;

        if (!prefersReducedMotion && !isMobile) {
            // Hero: анимация сразу при загрузке
            const heroExists = document.querySelector('.hero');
            if (heroExists) {
                const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } });
                heroTl.from('.hero__info-title span', { yPercent: 100, opacity: 0, stagger: 0.1 });
                heroTl.from('.hero__info-list-item', { y: 20, opacity: 0, stagger: 0.08 }, '-=0.3');
                heroTl.from('.hero__info-btn', { y: 20, opacity: 0 }, '-=0.3');
                heroTl.from('.hero__image', { x: 40, opacity: 0 }, '-=0.6');
            }

            // Остальные блоки: анимации по скроллу
            document.querySelectorAll('.section').forEach((section) => {
                const elements = section.querySelectorAll('h2, h3, .container__inner, .advantages__item, .collaboration__item, .tariffs__item, .why-choose-us__wrapper, .differences__item, .b2b__right-item, .works__item, .seo-indicators__item, .callback__form, .partners__item, .faq__item');
                if (!elements.length) return;

                gsap.set(elements, { opacity: 0, y: 30 });
                gsap.to(elements, {
                  y: 0,
                  opacity: 1,
                  duration: 0.8,
                  stagger: 0.08,
                  ease: 'power2.out',
                  scrollTrigger: {
                      trigger: section,
                      start: 'top 75%',
                      once: true
                  }
                });
            });

            // Отдельная анимация для блока reviews, без скрытия карточек слайдера
            const reviews = document.querySelector('.reviews');
            if (reviews) {
                const reviewsSection = reviews.closest('.section') || reviews;
                const reviewElements = reviews.querySelectorAll('.reviews__top, .reviews__wrapper, .swiper-reviews, .swiper-controls');
                if (reviewElements.length) {
                    gsap.set(reviewElements, { opacity: 0, y: 30 });
                    gsap.to(reviewElements, {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        stagger: 0.08,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: reviewsSection,
                            start: 'top 75%',
                            once: true
                        }
                    });
                }
            }
        }
    }

    const contactsMapEl = document.getElementById('contacts-map');

    function loadYandexMapsApiV3(apiKey) {
        return new Promise((resolve, reject) => {
            if (window.ymaps3 && window.ymaps3.ready) {
                resolve(window.ymaps3);
                return;
            }
            if (!apiKey) {
                reject(new Error('apiKey is required'));
                return;
            }

            const script = document.createElement('script');
            script.src = `https://api-maps.yandex.ru/v3/?apikey=${encodeURIComponent(apiKey)}&lang=ru_RU`;
            script.async = true;
            script.onload = () => resolve(window.ymaps3);
            script.onerror = () => reject(new Error('Failed to load Yandex Maps API v3'));
            document.head.appendChild(script);
        });
    }

    async function geocodeAddress(apiKey, address) {
        try {
            const url =
                `https://geocode-maps.yandex.ru/1.x/?apikey=${encodeURIComponent(apiKey)}` +
                `&geocode=${encodeURIComponent(address)}&format=json&results=1`;
            const res = await fetch(url);
            if (!res.ok) return null;
            const data = await res.json();
            const pos = data?.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject?.Point?.pos;
            if (!pos) return null;
            const [lng, lat] = pos.split(' ').map(Number);
            return Number.isFinite(lng) && Number.isFinite(lat) ? [lng, lat] : null;
        } catch {
            return null;
        }
    }

    function offsetCenterByPixels(center, zoom, offsetX, offsetY) {
        const [lng, lat] = center;
        const worldSize = 256 * Math.pow(2, zoom);

        const x = ((lng + 180) / 360) * worldSize;
        const sinLat = Math.sin((lat * Math.PI) / 180);
        const y =
            (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * worldSize;

        const shiftedX = x + offsetX;
        const shiftedY = y + offsetY;

        const shiftedLng = (shiftedX / worldSize) * 360 - 180;
        const n = Math.PI - (2 * Math.PI * shiftedY) / worldSize;
        const shiftedLat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));

        return [shiftedLng, shiftedLat];
    }

    async function initContactsMapV3() {
        if (!contactsMapEl) return;

        const apiKey = (contactsMapEl.dataset.ymapsApikey || '').trim();
        const address = contactsMapEl.dataset.ymapsAddress || 'Чебоксары, ул. Т. Кривова, 4';
        if (!apiKey) return;

        try {
            const ymaps3 = await loadYandexMapsApiV3(apiKey);
            await ymaps3.ready;

            ymaps3.import.registerCdn('https://cdn.jsdelivr.net/npm/{package}', '@yandex/ymaps3-default-ui-theme@latest');
            const uiTheme = await ymaps3.import('@yandex/ymaps3-default-ui-theme');

            const {
                YMap,
                YMapDefaultSchemeLayer,
                YMapDefaultFeaturesLayer,
                YMapFeatureDataSource,
                YMapMarker,
                YMapLayer,
                YMapControls,
            } = ymaps3;
            const { YMapZoomControl, YMapGeolocationControl } = uiTheme;

            const fallbackCoords = [47.2519, 56.1322];
            const coords = (await geocodeAddress(apiKey, address)) || fallbackCoords;
            const shiftedCenter = [coords[0] - 0.0010, coords[1]];
            const initialZoom = 17;
            const isMobile = window.matchMedia('(max-width: 767px)').matches;
            const mapCenter = isMobile
                ? offsetCenterByPixels(shiftedCenter, initialZoom, 50, 150)
                : shiftedCenter;

            let customization = null;
            try {
                const customizationRes = await fetch('/assets/customization.json', { cache: 'force-cache' });
                if (customizationRes.ok) customization = await customizationRes.json();
            } catch {}

            const map = new YMap(
                contactsMapEl,
                {
                    location: { center: mapCenter, zoom: initialZoom },
                    mode: 'vector',
                },
                [
                    new YMapDefaultSchemeLayer(customization ? { customization } : {}),
                    new YMapDefaultFeaturesLayer({}),
                    new YMapFeatureDataSource({ id: 'marker-source' }),
                    new YMapLayer({ source: 'marker-source', type: 'markers', zIndex: 2020 }),
                    new YMapFeatureDataSource({ id: 'geolocation-source' }),
                    new YMapLayer({ source: 'geolocation-source', type: 'markers', zIndex: 2030 }),
                ]
            );

            const controls = new YMapControls({ position: 'right' });
            controls.addChild(new YMapZoomControl({}));
            controls.addChild(new YMapGeolocationControl({ source: 'geolocation-source' }));
            map.addChild(controls);

            const markerEl = document.createElement('div');
            markerEl.style.position = 'relative';
            markerEl.style.transform = 'translate(-50%, -100%)';
            markerEl.style.width = '42px';
            markerEl.style.height = '54px';
            markerEl.style.pointerEvents = 'none';

            const markerImg = document.createElement('img');
            markerImg.src = '/assets/img/icons/i-point.svg';
            markerImg.alt = '';
            markerImg.width = 42;
            markerImg.height = 54;
            markerImg.draggable = false;
            markerImg.style.display = 'block';
            markerEl.appendChild(markerImg);

            const marker = new YMapMarker({ source: 'marker-source', coordinates: coords }, markerEl);
            map.addChild(marker);
        } catch {
            // no-op
        }
    }

    initContactsMapV3();
})


