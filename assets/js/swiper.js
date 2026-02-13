

document.addEventListener('DOMContentLoaded', () => {
    // document.querySelectorAll('.swiper-cases').forEach((item) => {
    //     let container = item.closest('.cases-tabs__content-slider-wrapper')
    //     let navigationNext = container.querySelector('.swiper-cases-button-next')
    //     let navigationprev = container.querySelector('.swiper-cases-button-prev')

    //     new Swiper(item, {
    //         // Optional parameters
    //         spaceBetween: 20,
    //         slidesPerView: 1,
    //         enabled: true,
          
    //         // Navigation arrows
    //         navigation: {
    //           nextEl: navigationNext,
    //           prevEl: navigationprev,
    //         },
    //         on: {
    //             init: function () {
    //                 if (window.ScrollTrigger) ScrollTrigger.refresh();
    //             }
    //         }
    //     });
    // })

    function setCasesControlsVisibility(swiper, controlsRoot, totalSlides) {
        if (!controlsRoot) return;

        const slidesPerView = Number(swiper.params.slidesPerView) || 1;
        const shouldShowControls = totalSlides > slidesPerView;

        const btns = controlsRoot.querySelector('.swiper-controls__btns');
        const fraction = controlsRoot.querySelector('.swiper-controls__fraction');

        if (btns) btns.style.display = shouldShowControls ? '' : 'none';
        if (fraction) fraction.style.display = shouldShowControls ? '' : 'none';
    }

    document.querySelectorAll('.swiper-cases').forEach((casesSliderEl) => {
        const caseItem = casesSliderEl.closest('.cases__item');
        if (!caseItem) return;

        const totalSlides = casesSliderEl.querySelectorAll('.swiper-slide').length;
        const controlsRoot = caseItem.querySelector('.swiper-controls');
        const casesCurrent = caseItem.querySelector('.swiper-cases-current');
        const casesTotal = caseItem.querySelector('.swiper-cases-total');
        const casesPagination = caseItem.querySelector('.swiper-pagination-cases');
        const casesBtnNext = caseItem.querySelector('.swiper-cases-btn-next');
        const casesBtnPrev = caseItem.querySelector('.swiper-cases-btn-prev');

        new Swiper(casesSliderEl, {
            slidesPerView: 1,
            enabled: true,
            loop: true,
            spaceBetween: 20,

            breakpoints: {
                0: {
                    allowTouchMove: true,
                    spaceBetween: 20,
                    slidesPerView: 1,
                },
                601: {
                    allowTouchMove: true,
                    spaceBetween: 20,
                    slidesPerView: 2
                },
                993: {
                    allowTouchMove: true,
                    spaceBetween: 20,
                    slidesPerView: 3
                },
            },

            on: {
                init: function () {
                    updateCustomPagination(this, casesCurrent, casesTotal);
                    setCasesControlsVisibility(this, controlsRoot, totalSlides);
                    if (window.ScrollTrigger) ScrollTrigger.refresh();
                },
                slideChange: function () {
                    updateCustomPagination(this, casesCurrent, casesTotal);
                },
                breakpoint: function () {
                    setCasesControlsVisibility(this, controlsRoot, totalSlides);
                },
                resize: function () {
                    setCasesControlsVisibility(this, controlsRoot, totalSlides);
                }
            },

            pagination: {
                el: casesPagination,
                type: "progressbar",
            },

            navigation: {
                nextEl: casesBtnNext,
                prevEl: casesBtnPrev,
            },
        });
    });

    const reviewsSliderEl = document.querySelector('.swiper-reviews');
    const reviewsTotalSlides = reviewsSliderEl ? reviewsSliderEl.querySelectorAll('.swiper-slide').length : 0;
    const reviewsSection = reviewsSliderEl ? (reviewsSliderEl.closest('.reviews') || reviewsSliderEl.parentElement) : null;
    const reviewsControlsRoot = reviewsSection ? reviewsSection.querySelector('.swiper-controls') : null;
    let infoCurrent = document.querySelector('.swiper-reviews-current');
    let infoTotal = document.querySelector('.swiper-reviews-total');
    new Swiper('.swiper-reviews', {
        slidesPerView: 1,
        enabled: true,
        loop: true,
        spaceBetween: 20,

        breakpoints: {
            0: {
                allowTouchMove: true,
                spaceBetween: 20,
                slidesPerView: 1,
            },
            600: {
                allowTouchMove: true,
                spaceBetween: 20,
                slidesPerView: 2
            },
            1025: {
                allowTouchMove: true,
                spaceBetween: 20,
                slidesPerView: 3
            },
        },
    
        on: {
            init: function () {
                updateCustomPagination(this, infoCurrent, infoTotal);
                setCasesControlsVisibility(this, reviewsControlsRoot, reviewsTotalSlides);
                if (window.ScrollTrigger) ScrollTrigger.refresh();
            },
            slideChange: function () {
                updateCustomPagination(this, infoCurrent, infoTotal);
            },
            breakpoint: function () {
                setCasesControlsVisibility(this, reviewsControlsRoot, reviewsTotalSlides);
            },
            resize: function () {
                setCasesControlsVisibility(this, reviewsControlsRoot, reviewsTotalSlides);
            }
        },
    
        pagination: {
            el: ".swiper-pagination-reviews",
            type: "progressbar",
        },
      
        navigation: {
            nextEl: '.swiper-reviews-btn-next',
            prevEl: '.swiper-reviews-btn-prev',
        },
    });
    
    let resultCurrent = document.querySelector('.swiper-result-current');
    let resultTotal = document.querySelector('.swiper-result-total');
    new Swiper('.swiper-result', {
        slidesPerView: 1,
        enabled: true,
        effect: "fade",
        loop: true,
        spaceBetween: 20,
    
        on: {
            init: function () {
                updateCustomPagination(this, resultCurrent, resultTotal);
                if (window.ScrollTrigger) ScrollTrigger.refresh();
            },
            slideChange: function () {
                updateCustomPagination(this, resultCurrent, resultTotal);
            }
        },
    
        pagination: {
            el: ".swiper-pagination-result",
            type: "progressbar",
        },
      
        navigation: {
            nextEl: '.swiper-result-btn-next',
            prevEl: '.swiper-result-btn-prev',
        },
    });

    function updateCustomPagination(swiper, currentNumber, totalNumber) {
        const current = swiper.realIndex + 1;
        const total = swiper.slides.length;
    
        if (currentNumber) currentNumber.textContent = current.toString().padStart(2, '0');
        if (totalNumber) totalNumber.textContent = total.toString().padStart(2, '0');
    }

    const swiperCertificate = new Swiper('.swiper-certificate', {
        // Optional parameters
        slidesPerView: 3,
        enabled: true,
    
        breakpoints: {
            320: {
                allowTouchMove: true,
                slidesPerView: 1,
            },
            600: {
                allowTouchMove: true,
                spaceBetween: 16,
                slidesPerView: 2,
            },
            769: {
                allowTouchMove: true,
                spaceBetween: 16,
                slidesPerView: 3,
            },
            1201: {
                allowTouchMove: true,
                spaceBetween: 38,
                slidesPerView: 3,
            },
        },
      
        // Navigation arrows
        navigation: {
          nextEl: '.swiper-certificate-btn-next',
          prevEl: '.swiper-certificate-btn-prev',
        },
    });
})
