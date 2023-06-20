const toggler=document.querySelector('.toggler')
const menu = document.querySelector('.side-nav')
toggler.addEventListener('click',()=>{
    menu.classList.toggle('show')
})
