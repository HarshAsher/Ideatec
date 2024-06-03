const sideMenu = document.querySelector('aside');
const menubtn = document.querySelector('#menu_bar');
const closebtn = document.querySelector('#close_btn');

const themeToggler = document.querySelector('.theme-toggler');



menubtn.addEventListener('click',()=>{
       sideMenu.style.display = "block"
})
closebtn.addEventListener('click',()=>{
    sideMenu.style.display = "none"
})

themeToggler.addEventListener('click',()=>{
     document.body.classList.toggle('dark-theme-variables')
     themeToggler.querySelector('span:nth-child(1)').classList.toggle('active')
     themeToggler.querySelector('span:nth-child(2)').classList.toggle('active')
})