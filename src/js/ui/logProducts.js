const foodlogDate = document.getElementById("foodlog-date");
const totalCalories = document.getElementById("totalCalories");
const totalProtein = document.getElementById("totalProtein");
const totalCarbs = document.getElementById("totalCarbs");
const totalFat = document.getElementById("totalFat");
const totalCaloriesProggress = document.getElementById("totalCaloriesProggress");
const totalProteinProggress = document.getElementById("totalProteinProggress");
const totalCarbsProggress = document.getElementById("totalCarbsProggress");
const totalFatProggress = document.getElementById("totalFatProggress");
const clearFoodlogBtn = document.getElementById("clear-foodlog");
const mealsNum = document.getElementById("mealsNum");
const loggedItemsList = document.getElementById("logged-items-list");
const weeklyAvg = document.getElementById("weeklyAvg");
const totalItemsThisWeek = document.getElementById("totalItemsThisWeek");

let mealsLoged = JSON.parse(localStorage.getItem("mealsLoged")) || {};

export function logProduct() {
    const date = new Date();

    const formattedDate = date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric"
    });

    foodlogDate.innerText = formattedDate;

    totalCalories.innerText = `${Math.floor(mealsLoged[getDate()].totalCalories)} / 2000 kcal`;
    totalProtein.innerText = `${Math.floor(mealsLoged[getDate()].totalProtein)} / 50 g`;
    totalCarbs.innerText = `${Math.floor(mealsLoged[getDate()].totalCarbs)} / 250 g`;
    totalFat.innerText = `${Math.floor(mealsLoged[getDate()].totalFat)} / 65 g`;
    totalCaloriesProggress.style.width = `${((mealsLoged[getDate()].totalCalories / 2000) * 100)}%`;
    totalProteinProggress.style.width = `${(mealsLoged[getDate()].totalProtein / 50) * 100}%`;
    totalCarbsProggress.style.width = `${(mealsLoged[getDate()].totalCarbs / 250) * 100}%`;
    totalFatProggress.style.width = `${(mealsLoged[getDate()].totalFat / 65) * 100}%`;
    mealsNum.innerText = `Logged Items (${mealsLoged[getDate()].meals.length})`;

    loggedItemsList.innerText = "";
    if (mealsLoged[getDate()].meals.length === 0) {
        clearFoodlogBtn.classList.add("d-none");
        loggedItemsList.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <i class="fa-solid fa-utensils text-4xl mb-3 text-gray-300"></i>
                <p class="font-medium">No meals logged today</p>
                <p class="text-sm">
                    Add meals from the Meals page or scan products
                </p>
            </div>
        `;
    } else {
        clearFoodlogBtn.classList.remove("d-none");
        mealsLoged[getDate()].meals.forEach((meal , index) => {
            loggedItemsList.appendChild(createMealLogItem(meal , index));
        });
    }

    clearFoodlogBtn.addEventListener("click", () => {
        mealsLoged[getDate()] = {
            totalCalories: 0,
            totalProtein: 0,
            totalCarbs: 0,
            totalFat: 0,
            meals: []
        };
        localStorage.setItem("mealsLoged", JSON.stringify(mealsLoged));
        logProduct();
    });



    function createMealLogItem(meal, index) {
        const card = document.createElement("div");
        card.className = "flex items-center justify-between bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all";

        // Left Side
        const left = document.createElement("div");
        left.className = "flex items-center gap-4";

        const img = document.createElement("img");
        img.src = meal.thumbnail;
        img.alt = meal.name;
        img.className = "w-14 h-14 rounded-xl object-cover";

        const info = document.createElement("div");

        const title = document.createElement("p");
        title.className = "font-semibold text-gray-900";
        title.textContent = meal.name;

        const details = document.createElement("p");
        details.className = "text-sm text-gray-500";
        details.innerHTML = `
        ${meal.servings} serving
        <span class="mx-1">•</span>
        <span class="text-emerald-600">${meal.type == "meal" ? "Meal" : "product"}</span>
    `;

        const time = document.createElement("p");
        time.className = "text-xs text-gray-400 mt-1";
        time.textContent = new Date(meal.loggedAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

        info.append(title, details, time);
        left.append(img, info);

        // Right Side
        const right = document.createElement("div");
        right.className = "flex items-center gap-4";

        const caloriesBox = document.createElement("div");
        caloriesBox.className = "text-right";

        const calories = document.createElement("p");
        calories.className = "text-lg font-bold text-emerald-600";
        calories.textContent = Math.round(meal.nutrition.calories);

        const kcal = document.createElement("p");
        kcal.className = "text-xs text-gray-500";
        kcal.textContent = "kcal";

        caloriesBox.append(calories, kcal);

        const macros = document.createElement("div");
        macros.className = "hidden md:flex gap-2 text-xs text-gray-500";

        const protein = document.createElement("span");
        protein.className = "px-2 py-1 bg-blue-50 rounded";
        protein.textContent = `${meal.nutrition.protein}g P`;

        const carbs = document.createElement("span");
        carbs.className = "px-2 py-1 bg-amber-50 rounded";
        carbs.textContent = `${meal.nutrition.carbs}g C`;

        const fat = document.createElement("span");
        fat.className = "px-2 py-1 bg-purple-50 rounded";
        fat.textContent = `${meal.nutrition.fat}g F`;

        macros.append(protein, carbs, fat);

        // Delete Button
        const removeBtn = document.createElement("button");
        removeBtn.className = "remove-foodlog-item text-gray-400 hover:text-red-500 transition-all p-2";
        removeBtn.dataset.index = index;

        const trashIcon = document.createElement("i");
        trashIcon.className = "fa-solid fa-trash-can";

        removeBtn.appendChild(trashIcon);

        right.append(caloriesBox, macros, removeBtn);

        card.append(left, right);

        removeBtn.addEventListener("click", () => {
            mealsLoged[getDate()].totalCalories -= meal.nutrition.calories;
            mealsLoged[getDate()].totalProtein -= meal.nutrition.protein;
            mealsLoged[getDate()].totalCarbs -= meal.nutrition.carbs;
            mealsLoged[getDate()].totalFat -= meal.nutrition.fat;
            mealsLoged[getDate()].meals.splice(index, 1);
            localStorage.setItem("mealsLoged", JSON.stringify(mealsLoged));
            logProduct();
        });

        return card;
    }





}



function getDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}