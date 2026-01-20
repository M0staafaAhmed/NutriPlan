import { logProduct } from "./ui/logProducts.js";
import {Meals , headerDesc , headerTitle , sectionsDetails , getDate} from "./ui/meals.js"
import { products } from "./ui/products.js";


const sidebarLinks = document.getElementById("sidebarLinks");
const mainContent = document.getElementById("main-content");
const headerMenuBtn = document.getElementById("header-menu-btn");
const sidebarCloseBtn = document.getElementById("sidebar-close-btn");
const sidebarOverlay = document.getElementById("sidebar-overlay");
const sidebar = document.getElementById("sidebar");




headerMenuBtn.addEventListener("click" , ()=>{
    document.body.style.overflow = "hidden";
    sidebarOverlay.classList.add("active")
    sidebar.classList.add("open")
});

sidebarCloseBtn.addEventListener("click" , closeMenu)
sidebarOverlay.addEventListener("click" , closeMenu);

[...sidebarLinks.children].forEach((button , index) => {
    button.addEventListener("click" , ()=>{
        headerTitle.innerText = sectionsDetails[index].title;
        headerDesc.innerText = sectionsDetails[index].desc;
        [...sidebarLinks.children].forEach((element)=>{
            element.firstElementChild.classList.remove("bg-emerald-50" , "text-emerald-700")
            element.firstElementChild.classList.add("text-gray-600" , "hover:bg-gray-50")
        })
        button.firstElementChild.classList.add("bg-emerald-50" , "text-emerald-700")
        button.firstElementChild.classList.remove("text-gray-600" , "hover:bg-gray-50");
        for(let i = 1;i < mainContent.children.length;i++){
            mainContent.children[i].classList.add("d-none")
            if(mainContent.children[i].getAttribute("data-section") == button.firstElementChild.getAttribute("data-section")){
                mainContent.children[i].classList.remove("d-none")
            }
        }
    })
});

function closeMenu(){
    document.body.style.overflow = "";
    sidebarOverlay.classList.remove("active")
    sidebar.classList.remove("open")
}

let mealsData = {
    [getDate()]: {
        totalCalories    : 0,
        totalProtein    : 0,
        totalCarbs    : 0,
        totalFat    : 0,
        meals: []
    }
}

if(!localStorage.getItem("mealsLoged")){
    localStorage.setItem("mealsLoged" , JSON.stringify(mealsData))
}




Meals()
products()
logProduct()






