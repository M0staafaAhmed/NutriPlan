const areasContainer = document.getElementById("areasContainer")
const appLoadingOverlay = document.getElementById("app-loading-overlay");
const categoriesGrid = document.getElementById("categories-grid");
const recipesGrid = document.getElementById("recipes-grid");
const recipesCount = document.getElementById("recipes-count");
const searchInput = document.getElementById("search-input");
const mealdetails = document.getElementById("meal-details");
const MealsSection = document.getElementById("MealsSection");
const backToMealsBtn = document.getElementById("back-to-meals-btn");
const detailsImg = document.getElementById("detailsImg");
const detailsTags = document.getElementById("detailsTags");
const detailsTitle = document.getElementById("detailsTitle");
const heroServings = document.getElementById("hero-servings");
const heroCalories = document.getElementById("hero-calories");
const ingredientsNum = document.getElementById("ingredientsNum");
const ingredientsGrid = document.getElementById("ingredientsGrid");
const instructionsGrid = document.getElementById("instructionsGrid");
const logMealBtn = document.getElementById("log-meal-btn");
const videoDetails = document.querySelector("#meal-details iframe");
const caloriesDetails = document.getElementById("caloriesDetails");
const detailsPerServe = document.getElementById("detailsPerServe");
const ingradiantsPerServe = document.querySelectorAll(".ingradiants-per-serve");
const progressPerServe = document.querySelectorAll(".progress-per-serve");

const logMealModal = document.getElementById("log-meal-modal");
const logMealModalImg = document.getElementById("logMealModalImg");
const logModalTitle = document.getElementById("logModalTitle");
const modalCalories = document.getElementById("modal-calories");
const modalProtein = document.getElementById("modal-protein");
const modalCarbs = document.getElementById("modal-carbs");
const modalFats = document.getElementById("modal-fat");
const cancelLogMeal = document.getElementById("cancel-log-meal");
const confirmLogMeal = document.getElementById("confirm-log-meal");
const mealServingsInput = document.getElementById("meal-servings");
const decreaseServings = document.getElementById("decrease-servings");
const increaseServings = document.getElementById("increase-servings");









export const headerTitle = document.querySelector("#header h1");
export const headerDesc = document.querySelector("#header p");
export const sectionsDetails = [
    {
        title: "Meals & Recipes",
        desc: "Discover delicious and nutritious recipes tailored for you"
    },
    {
        title: "Product Scanner",
        desc: "Search packaged foods by name or barcode"
    },
    {
        title: "Food Log",
        desc: "Track your daily nutrition and food intake"
    }
];


let mealData = {
    [getDate()]: {
        totalCalories    : 0,
        totalProtein    : 0,
        totalCarbs    : 0,
        totalFat    : 0,
        meals: []
    }
}


let mealsData = localStorage.getItem("mealsLoged") ? JSON.parse(localStorage.getItem("mealsLoged")) : mealData;




export function Meals() {

    searchInput.addEventListener("input", () => {
        getMeals(`https://nutriplan-api.vercel.app/api/meals/search?q=${searchInput.value}&page=1&limit=25`, searchInput.value)
    });

    backToMealsBtn.addEventListener("click", () => {
        mealdetails.classList.add("d-none");
        MealsSection.classList.remove("d-none");
        headerTitle.innerText = sectionsDetails[0].title;
        headerDesc.innerText = sectionsDetails[0].desc;
    });

    logMealBtn.addEventListener("click" , ()=>{
        logMealModal.classList.remove("d-none")
    })

    logMealModal.addEventListener("click" , (e)=>{
        if(e.target == logMealModal || e.target == cancelLogMeal){
            logMealModal.classList.add("d-none")
        }
    })

    decreaseServings.addEventListener("click", () => {
        mealServingsInput.value = parseFloat(mealServingsInput.value) - 0.5;
        if(mealServingsInput.value <= 1){
            mealServingsInput.value = 1
        }
    });
    
    increaseServings.addEventListener("click", () => {
        mealServingsInput.value = parseFloat(mealServingsInput.value) + 0.5;
        if(mealServingsInput.value >= 10){
            mealServingsInput.value = 10
        }
    });



    async function getAreas() {
        let response = await fetch("https://nutriplan-api.vercel.app/api/meals/areas");
        let data = await response.json();

        for (let i = 0; i < 10; i++) {
            const areaBtn = document.createElement("button");
            areaBtn.className = "px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm whitespace-nowrap hover:bg-gray-200 transition-all";
            areaBtn.innerText = data.results[i].name;
            areaBtn.setAttribute("data-area", data.results[i].name)
            areasContainer.appendChild(areaBtn);
        }

        [...areasContainer.children].forEach((areaBtn) => {
            areaBtn.addEventListener("click", () => {

                console.log(areaBtn.getAttribute("data-area"));

                getMeals(areaBtn.getAttribute("data-area") ? `https://nutriplan-api.vercel.app/api/meals/filter?area=${areaBtn.getAttribute("data-area")}&limit=25` : `https://nutriplan-api.vercel.app/api/meals/random?count=25`, "area");


                [...areasContainer.children].forEach(btn => {
                    btn.classList.remove("bg-emerald-600", "text-white", "hover:bg-emerald-700");
                    btn.classList.add("bg-gray-100", "text-gray-700", "hover:bg-gray-200");
                });

                areaBtn.classList.remove("bg-gray-100", "text-gray-700", "hover:bg-gray-200");
                areaBtn.classList.add("bg-emerald-600", "text-white", "hover:bg-emerald-700");
            });
        });
    }

    async function getCategories() {
        let response = await fetch("https://nutriplan-api.vercel.app/api/meals/categories");
        let data = await response.json();

        for (let i = 0; i < 12; i++) {
            categoriesGrid.appendChild(createCategory(data.results[i]))
        }
    }

    function createCategory(category) {
        let cardColor = "hover:border-pink-400 bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200";
        let iconColor = "bg-gradient-to-br from-pink-400 to-rose-500";
        let iconShape = "fa-solid fa-cake-candles";
        if (category.name == "Beef" || category.name == "Pork") {
            cardColor = "hover:border-red-400 bg-gradient-to-br from-red-50 to-rose-50 border-red-200"
            iconColor = "bg-gradient-to-br from-red-400 to-rose-500"
            iconShape = "fa-solid fa-drumstick-bite"
        } else if (category.name == "Side" || category.name == "Vegan" || category.name == "Vegetarian") {
            cardColor = "hover:border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 border-emerald-200"
            iconColor = "bg-gradient-to-br from-green-400 to-emerald-500"
            iconShape = "fa-solid fa-leaf"
        } else if (category.name == "Chicken" || category.name == "Lamb") {
            cardColor = "bg-gradient-to-br from-amber-50 to-orange-50 hover:border-amber-400 border-emerald-200"
            iconColor = "bg-gradient-to-br from-amber-400 to-orange-500"
            iconShape = "fa-solid fa-drumstick-bite"
        } else if (category.name == "Pasta") {
            cardColor = "bg-gradient-to-br from-amber-50 to-orange-50 hover:border-amber-400 border-emerald-200"
            iconColor = "bg-gradient-to-br from-amber-400 to-orange-500"
            iconShape = "fa-solid fa-bowl-food"
        } else if (category.name == "Miscellaneous") {
            cardColor = "bg-gradient-to-br from-slate-50 to-gray-50 hover:border-slate-400 border-emerald-200"
            iconColor = "bg-gradient-to-br from-slate-400 to-gray-500"
            iconShape = "fa-solid fa-bowl-rice"
        } else if (category.name == "Seafood" || category.name == "Starter") {
            cardColor = "bg-gradient-to-br from-teal-50 to-cyan-50 hover:border-teal-400 border-emerald-200"
            iconColor = "bg-gradient-to-br from-teal-400 to-cyan-500"
            iconShape = "fa-solid fa-utensils"
        }


        const card = document.createElement("div");
        card.className = `category-card ${cardColor} rounded-xl p-3 border hover:shadow-md cursor-pointer transition-all group`;

        card.dataset.category = category.name;

        const innerDiv = document.createElement("div");
        innerDiv.className = "flex items-center gap-2.5";


        const iconDiv = document.createElement("div");
        iconDiv.className = `text-white w-9 h-9 rounded-lg ${iconColor} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`;

        const icon = document.createElement("i");
        icon.className = iconShape;
        iconDiv.appendChild(icon);

        const textDiv = document.createElement("div");
        const h3 = document.createElement("h3");
        h3.className = "text-sm font-bold text-gray-900";
        h3.innerText = category.name;
        textDiv.appendChild(h3);

        innerDiv.appendChild(iconDiv);
        innerDiv.appendChild(textDiv);
        card.appendChild(innerDiv);

        card.addEventListener("click", () => {
            getMeals(`https://nutriplan-api.vercel.app/api/meals/filter?category=${category.name}&page=1&limit=25`, "category")
        })

        return card;
    }

    async function getMeals(link, statues = "first") {
        let data;
        recipesGrid.innerHTML = `
            <div class="flex items-center justify-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        `
        try {
            let response = await fetch(link);
            data = await response.json();
            recipesGrid.innerText = "";
            data.results.forEach((recipe) => {
                recipesGrid.appendChild(createRecipeCard(recipe));
            })
        } catch (error) {
        } finally {
            appLoadingOverlay.classList.add("d-none");
            if (statues == "first") {
                recipesCount.innerText = `Showing ${data.results.length ? data.results.length : 0} recipes`
            } else if (statues == "category") {
                recipesCount.innerText = `Showing ${data.results.length ? data.results.length : 0} ${data.results[0].category} recipes`
            } else if (statues == "area") {
                recipesCount.innerText = `Showing ${data.results.length ? data.results.length : 0} ${data.results[0].area} recipes`
            } else {
                recipesCount.innerText = `Showing ${data.results.length ? data.results.length : 0} recipes for "${statues}"`
                if (statues == "") {
                    recipesCount.innerText = `Showing ${data.results.length ? data.results.length : 0} recipes`
                }
                if (data.results.length == 0) {
                    recipesGrid.innerHTML = `
                        <div class="flex flex-col items-center justify-center py-12 text-center">
                            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <i class="fa-solid fa-search text-gray-400 text-2xl"></i>
                            </div>
                            <p class="text-gray-500 text-lg">No recipes found</p>
                            <p class="text-gray-400 text-sm mt-2">Try searching for something else</p>
                        </div>
                    `
                }
            }
        }

    }

    function createRecipeCard(recipe) {

        const card = document.createElement("div");
        card.className = "recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group";
        card.dataset.mealId = recipe.id;

        const imgContainer = document.createElement("div");
        imgContainer.className = "relative h-48 overflow-hidden";

        const img = document.createElement("img");
        img.className = "w-full h-full object-cover group-hover:scale-110 transition-transform duration-500";
        img.src = recipe.thumbnail;
        img.alt = recipe.name;
        img.loading = "lazy";

        const tagsDiv = document.createElement("div");
        tagsDiv.className = "absolute bottom-3 left-3 flex gap-2";

        const categoryTag = document.createElement("span");
        categoryTag.className = "px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700";
        categoryTag.innerText = recipe.category;

        const areaTag = document.createElement("span");
        areaTag.className = "px-2 py-1 bg-emerald-500 text-xs font-semibold rounded-full text-white";
        areaTag.innerText = recipe.area;

        tagsDiv.appendChild(categoryTag);
        tagsDiv.appendChild(areaTag);
        imgContainer.appendChild(img);
        imgContainer.appendChild(tagsDiv);

        const details = document.createElement("div");
        details.className = "p-4";

        const title = document.createElement("h3");
        title.className = "text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1";
        title.innerText = recipe.name;

        const description = document.createElement("p");
        description.className = "text-xs text-gray-600 mb-3 line-clamp-2";
        description.innerText = recipe.instructions || "";

        const infoDiv = document.createElement("div");
        infoDiv.className = "flex items-center justify-between text-xs";

        const categoryInfo = document.createElement("span");
        categoryInfo.className = "font-semibold text-gray-900";
        categoryInfo.innerHTML = `<i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>${recipe.category}`;

        const areaInfo = document.createElement("span");
        areaInfo.className = "font-semibold text-gray-500";
        areaInfo.innerHTML = `<i class="fa-solid fa-globe text-blue-500 mr-1"></i>${recipe.area}`;

        infoDiv.appendChild(categoryInfo);
        infoDiv.appendChild(areaInfo);

        details.appendChild(title);
        details.appendChild(description);
        details.appendChild(infoDiv);

        card.appendChild(imgContainer);
        card.appendChild(details);

        card.addEventListener("click", () => {
            mealdetails.classList.remove("d-none");
            MealsSection.classList.add("d-none");
            getMealDetails(recipe.id);
            headerTitle.innerText = "Recipe Details";
            headerDesc.innerText = "View full recipe information and nutrition facts";
            heroCalories.innerText = `Calculating...`
            logMealBtn.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin-pulse"></i>
                <span>Claculating...</span>
            `
            logMealBtn.disabled = true;
            caloriesDetails.children[1].innerText = "Calc.."
            caloriesDetails.children[2].innerText = "Calculating.." 
            detailsPerServe.classList.add("d-none")
        })

        return card;
    }

    async function getMealDetails(id) {
        let response = await fetch(`https://nutriplan-api.vercel.app/api/meals/${id}`);
        let data = await response.json();

        
        instructionsGrid.innerText = ""
        ingredientsGrid.innerText = ""
        detailsImg.setAttribute("src", data.result.thumbnail)
        detailsImg.setAttribute("alt", data.result.name)
        detailsTags.children[0].innerText = data.result.category
        detailsTags.children[1].innerText = data.result.area
        detailsTitle.innerText = data.result.name
        videoDetails.setAttribute("src" , data.result.youtube)
        if (data.result.tags[0]) {
            detailsTags.children[2].innerText = data.result.tags[0]
        } else {
            detailsTags.children[2].classList.add("d-none")
        }
        data.result.ingredients.forEach((item) => {
            ingredientsGrid.appendChild(createIngredientItem(item));
        })
        ingredientsNum.innerText = `${data.result.ingredients.length} Items`
        data.result.instructions.forEach((item , index)=>{
            instructionsGrid.appendChild(createInstructionStep(index + 1 , item))
        })

        let ingredientsArr = []
        let ingredientsObj = {}

        data.result.ingredients.forEach((item) => {
            let ingredient = item.measure + " " + item.ingredient;
            ingredientsArr.push(ingredient);
        })

        ingredientsObj = {
            recipeName: data.result.name,
            ingredients: ingredientsArr
        }



        let postResponse = await fetch("https://nutriplan-api.vercel.app/api/nutrition/analyze", {
            method: "post",
            headers: {
                'accept': 'application/json',
                'x-api-key': '6fJavcB0NNfMCjoL3P28JdYs5EMB0WH9vlgB9c9M',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ingredientsObj)
        })

        let natData = await postResponse.json();        

        heroServings.innerText = `${natData.data.servings} servings`
        heroCalories.innerText = `${natData.data.perServing.calories} cal/serving`
        logMealBtn.classList.add("hover:bg-blue-700");
        logMealBtn.innerHTML = `
                <i class="fa-solid fa-clipboard-list"></i>
                <span>Log This Meal</span>
            `
        logMealBtn.disabled = false;
        caloriesDetails.children[1].innerText = natData.data.perServing.calories 
        caloriesDetails.children[2].innerText = natData.data.totals.calories
        ingradiantsPerServe[0].children[1].innerText = `${natData.data.perServing.protein}g` 
        ingradiantsPerServe[1].children[1].innerText = `${natData.data.perServing.carbs}g` 
        ingradiantsPerServe[2].children[1].innerText = `${natData.data.perServing.fat}g` 
        ingradiantsPerServe[3].children[1].innerText = `${natData.data.perServing.fiber}g` 
        ingradiantsPerServe[4].children[1].innerText = `${natData.data.perServing.sugar}g` 
        progressPerServe[0].style.width = `${(natData.data.perServing.protein / 50) * 100}%` 
        progressPerServe[1].style.width = `${(natData.data.perServing.carbs / 250) * 100}%` 
        progressPerServe[2].style.width = `${(natData.data.perServing.fat / 65) * 100}%` 
        progressPerServe[3].style.width = `${(natData.data.perServing.fiber / 25) * 100}%` 
        progressPerServe[4].style.width = `${(natData.data.perServing.sugar / 30) * 100}%` 
        detailsPerServe.classList.remove("d-none")



        // modal info
        logMealModalImg.setAttribute("src" , data.result.thumbnail)
        logMealModalImg.setAttribute("alt", data.result.name)
        logModalTitle.innerText = data.result.name
        modalCalories.innerText = `${natData.data.perServing.calories}`
        modalProtein.innerText = `${natData.data.perServing.protein}g`
        modalCarbs.innerText = `${natData.data.perServing.carbs}g`
        modalFats.innerText = `${natData.data.perServing.fat}g`

        let todayDate = getDate();        

        confirmLogMeal.addEventListener("click" , ()=>{
            logMealModal.classList.add("d-none")

            let mealObj = {
                type: "meal",
                name: data.result.name,
                mealId: data.result.id,
                category: data.result.category,
                thumbnail: data.result.thumbnail,
                servings: mealServingsInput.value,
                nutrition: {
                    calories: natData.data.perServing.calories * mealServingsInput.value,
                    protein: natData.data.perServing.protein * mealServingsInput.value,
                    carbs: natData.data.perServing.carbs * mealServingsInput.value,
                    fat: natData.data.perServing.fat * mealServingsInput.value
                },
                loggedAt: new Date().toISOString()
            };

            mealsData[todayDate].meals.push(mealObj);
            mealsData[todayDate].totalCalories += natData.data.perServing.calories * mealServingsInput.value;
            mealsData[todayDate].totalProtein += natData.data.perServing.protein * mealServingsInput.value;
            mealsData[todayDate].totalCarbs += natData.data.perServing.carbs * mealServingsInput.value;
            mealsData[todayDate].totalFat += natData.data.perServing.fat * mealServingsInput.value;
            localStorage.setItem("mealsLoged", JSON.stringify(mealsData));

            Swal.fire({
                position: "center",
                icon: "success",
                title: "Meal Logged",
                html: `
                <p>${data.result.name} (${mealServingsInput.value} serving) has been added to your daily log.</p>
                <p style="color: #10b981; font-weight: bold; margin-top: 8px;">
                +${natData.data.perServing.calories * mealServingsInput.value}
                </p>
                `,
                showConfirmButton: false,
                timer: 1500
            });
        })

    }

    function createIngredientItem(ingredient) {
        const wrapper = document.createElement("div");
        wrapper.className =
            "flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className =
            "ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300";

        const textSpan = document.createElement("span");
        textSpan.className = "text-gray-700";

        const boldSpan = document.createElement("span");
        boldSpan.className = "font-medium text-gray-900";
        boldSpan.innerText = ingredient.measure;

        textSpan.append(boldSpan, ` ${ingredient.ingredient}`);

        wrapper.append(checkbox, textSpan);

        return wrapper;
    }

    function createInstructionStep(stepNumber, text) {
        const wrapper = document.createElement("div");
        wrapper.className = "flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors";

        const numberBox = document.createElement("div");
        numberBox.className =
            "w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0";
        numberBox.innerText = stepNumber;

        const paragraph = document.createElement("p");
        paragraph.className = "text-gray-700 leading-relaxed pt-2";
        paragraph.innerText = text;

        wrapper.append(numberBox, paragraph);

        return wrapper;
    }


    
    getAreas();
    getCategories();
    getMeals("https://nutriplan-api.vercel.app/api/meals/random?count=25")
}



export function getDate(){
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); 
    const day = String(today.getDate()).padStart(2, '0');
    return`${year}-${month}-${day}`;
}





