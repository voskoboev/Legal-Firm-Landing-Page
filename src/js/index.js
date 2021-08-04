toggleMobileMenu()

function toggleMobileMenu() {
  const body = document.querySelector('body'),
    btn = document.querySelector('.header__btn--menu-mobile'),
    menu = document.querySelector('.header__menu')

  btn.addEventListener('click', () => {
    menu.classList.toggle('header__menu--active')
    body.classList.toggle('body--inactive')
  })
}
