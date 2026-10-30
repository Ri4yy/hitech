document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.home-header');
    const toggle = header.querySelector('.btn-menu');
    const trigger = header.querySelector('.home-header__trigger');
    const services = header.querySelector('.home-header__services');
    toggle.addEventListener('click', () => { const open = toggle.classList.contains('open'); toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню'); });
    let closeTimer;
    services.addEventListener('mouseenter', () => { clearTimeout(closeTimer); services.classList.add('is-open'); trigger.setAttribute('aria-expanded', 'true'); });
    services.addEventListener('mouseleave', () => { closeTimer = setTimeout(() => { services.classList.remove('is-open'); trigger.setAttribute('aria-expanded', 'false'); }, 350); });
    trigger.addEventListener('click', () => { const open = services.classList.toggle('is-open'); trigger.setAttribute('aria-expanded', String(open)); });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') { services.classList.remove('is-open'); trigger.setAttribute('aria-expanded','false'); if (toggle.classList.contains('open')) toggle.click(); } });
    document.addEventListener('click', (event) => { if (!services.contains(event.target)) { services.classList.remove('is-open'); trigger.setAttribute('aria-expanded','false'); } });
});
