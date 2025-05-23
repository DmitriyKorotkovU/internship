function slideToggle(element, duration = 200, openClass = 'is-open') {
  if (element._isAnimating) {
    return;
  }
  element._isAnimating = true;

  const isOpen = element.classList.contains(openClass);
  const startHeight = element.scrollHeight;

  element.style.overflow = 'hidden';
  element.style.transition = `height ${duration}ms ease`;

  if (!isOpen) {
    element.classList.add(openClass);
    element.style.height = '0px';
    void element.offsetHeight;
    element.style.height = `${startHeight }px`;

    setTimeout(() => {
      element.style.height = '';
      element.style.transition = '';
      element.style.overflow = '';
      element._isAnimating = false;
    }, duration);
  } else {
    element.style.height = `${element.scrollHeight }px`;
    void element.offsetHeight;
    element.style.height = '0px';

    setTimeout(() => {
      element.classList.remove(openClass);
      element.style.height = '';
      element.style.transition = '';
      element.style.overflow = '';
      element._isAnimating = false;
    }, duration);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const pageBody = document.querySelector('.page__body');
  const burgerButton = document.querySelector('.js-burger-button');
  const navList = document.querySelector('.js-nav-list');
  const nav = document.querySelector('.js-nav');
  const submenuToggles = document.querySelectorAll('.js-menu-toggle');

  // Закрытие всех подменю
  const closeAllSubmenus = () => {
    document.querySelectorAll('.js-submenu').forEach((submenu) => {
      if (submenu.classList.contains('nav__sub-list--open')) {
        slideToggle(submenu, 200, 'nav__sub-list--open');
      }
    });
    submenuToggles.forEach((toggle) => {
      toggle.setAttribute('aria-expanded', 'false');
    });
  };

  // Открытие/закрытие бургер-меню
  burgerButton.addEventListener('click', () => {
    const expanded = burgerButton.getAttribute('aria-expanded') === 'true';
    const willOpen = !expanded;

    burgerButton.setAttribute('aria-expanded', String(willOpen));
    burgerButton.classList.toggle('burger-button--active');
    navList.classList.toggle('nav__list--open');
    pageBody.classList.toggle('page__body--open-popup');

    if (!willOpen) {
      closeAllSubmenus();
    }
  });

  // Открытие/закрытие подменю
  submenuToggles.forEach((toggle) => {
    const targetSelector = toggle.dataset.target;
    const submenu = document.querySelector(targetSelector);

    if (!submenu || !submenu.classList.contains('js-submenu')) {
      return;
    }

    toggle.setAttribute('role', 'button');
    toggle.setAttribute('tabindex', '0');
    toggle.setAttribute('aria-expanded', 'false');

    const toggleSubmenu = () => {
      const isOpen = submenu.classList.contains('nav__sub-list--open');
      slideToggle(submenu, 200, 'nav__sub-list--open');
      toggle.setAttribute('aria-expanded', String(!isOpen));
    };

    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleSubmenu();
    });

    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        toggleSubmenu();
      }
    });
  });

  // Закрытие меню при клике вне навигации
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !burgerButton.contains(e.target)) {
      burgerButton.setAttribute('aria-expanded', 'false');
      burgerButton.classList.remove('burger-button--active');
      navList.classList.remove('nav__list--open');
      pageBody.classList.remove('page__body--open-popup');
      closeAllSubmenus();
    }
  });

  // Закрытие по Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      burgerButton.setAttribute('aria-expanded', 'false');
      burgerButton.classList.remove('burger-button--active');
      navList.classList.remove('nav__list--open');
      pageBody.classList.remove('page__body--open-popup');
      closeAllSubmenus();
    }
  });
});
