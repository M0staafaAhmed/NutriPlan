const productSearchInput = document.getElementById("product-search-input")
const productSearchBtn = document.getElementById("product-search-btn")
const productsGrid = document.getElementById("products-grid")
const nutriFilters = document.getElementById("nutriFilters")
const productsCount = document.getElementById("products-count")
const barcodeInput = document.getElementById("barcode-input")
const lookupBarcodeBtn = document.getElementById("lookup-barcode-btn")
const productCategories = document.getElementById("product-categories")

// product modal
const productModal = document.getElementById("product-detail-modal")
const productModalImg = document.getElementById("productModalImg")
const productModalBrand = document.getElementById("productModalBrand")
const productModalName = document.getElementById("productModalName")
const productModalCalories = document.getElementById("productModalCalories")
const productModalGrade = document.getElementById("productModalGrade")
const productModalCalories2 = document.getElementById("productModalCalories2")
const productModalProtein = document.getElementById("productModalProtein")
const productModalCarbs = document.getElementById("productModalCarbs")
const productModalFat = document.getElementById("productModalFat")
const productModalSugar = document.getElementById("productModalSugar")
const productModalProteinProggress = document.getElementById("productModalProteinProggress")
const productModalCarbsProggress = document.getElementById("productModalCarbsProggress")
const productModalFatProggress = document.getElementById("productModalFatProggress")
const productModalSugarProggress = document.getElementById("productModalSugarProggress")
const addProductToLogBtn = document.querySelector(".add-product-to-log")

let currentUrl = ""
let productData = null;



let mealData = {
    [getDate()]: {
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        meals: []
    }
}


let mealsData = localStorage.getItem("mealsLoged") ? JSON.parse(localStorage.getItem("mealsLoged")) : mealData;




export function products() {

    productModal.addEventListener("click", (e) => {
        if (e.target == productModal || e.target.classList.contains("close-product-modal")) {
            productModal.classList.add("d-none")
        }
    })


    productsGrid.innerHTML = `
            <div id="products-empty" class="py-12">
                <div class="text-center">
                    <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="text-3xl text-gray-400 fa-solid fa-box-open"></i>
                    </div>
                    <p class="text-gray-500 text-lg mb-2">No products to display</p>
                    <p class="text-gray-400 text-sm">Search for a product or browse by category</p>
                </div>
            </div>
        `

    productSearchBtn.addEventListener("click", () => {
        currentUrl = `https://nutriplan-api.vercel.app/api/products/search?q=${productSearchInput.value}&page=1&limit=24`;
        getProduct(`https://nutriplan-api.vercel.app/api/products/search?q=${productSearchInput.value}&page=1&limit=24`)
    });

    lookupBarcodeBtn.addEventListener("click", () => {
        currentUrl = `https://nutriplan-api.vercel.app/api/products/barcode/${barcodeInput.value}`;
        getProduct(`https://nutriplan-api.vercel.app/api/products/barcode/${barcodeInput.value}`, "barcode")
    });

    addProductToLogBtn.addEventListener("click", () => {
        productModal.classList.add("d-none")

        logProduct(productData);
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Meal Logged",
            html: `
                    <p>${productData.name} has been added to your daily log.</p>
                    <p style="color: #10b981; font-weight: bold; margin-top: 8px;">
                    +${productData.nutrients.calories} kcal,
                    </p>
                    `,
            showConfirmButton: false,
            timer: 1500
        });
    });



    [...nutriFilters.children].forEach((filter) => {
        filter.addEventListener("click", () => {

            [...nutriFilters.children].forEach((item) => {
                item.classList.remove("border")
            })

            filter.classList.add("border")
            getProduct(currentUrl, filter.getAttribute("data-grade"))
        })
    })

    async function getProduct(url, filter = "") {
        let filteredData = [];

        try {
            productsGrid.innerHTML = `
            <div class="flex items-center justify-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        `
            let response = await fetch(url)
            let data = await response.json()



            if (filter == "barcode") {
                filteredData.push(data.result)
            } else {
                filteredData = structuredClone(data.results);

                productsCount.innerText = `Found ${data.results.length} product`


                if (filter != "") {
                    filteredData = data.results.filter((product) => {
                        return product.nutritionGrade == filter
                    })
                }
            }

            productsGrid.innerText = ""
            if (filteredData.length == 0) {
                productsGrid.innerHTML = `
            <div id="products-empty" class="py-12">
                <div class="text-center">
                    <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="text-3xl text-gray-400 fa-solid fa-box-open"></i>
                    </div>
                    <p class="text-gray-500 text-lg mb-2">No products to display</p>
                    <p class="text-gray-400 text-sm">Search for a product or browse by category</p>
                </div>
            </div>
        `
            }
            filteredData.forEach((product) => {
                productsGrid.appendChild(createProductCard(product));
            });
        } catch (error) {
            productsGrid.innerHTML = `
            <div id="products-empty" class="py-12">
                <div class="text-center">
                    <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="text-3xl text-gray-400 fa-solid fa-box-open"></i>
                    </div>
                    <p class="text-gray-500 text-lg mb-2">No products to display</p>
                    <p class="text-gray-400 text-sm">Search for a product or browse by category</p>
                </div>
            </div>
        `
        }
    }

    function createProductCard(product) {

        let nutriBg = product.nutritionGrade == "a" ? "bg-green-500" : product.nutritionGrade == "b" ? "bg-lime-500" : product.nutritionGrade == "c" ? "bg-yellow-500" : product.nutritionGrade == "d" ? "bg-orange-500" : "bg-red-500"
        let noveBg = product.novaGroup == "1" ? "bg-green-500" : product.nutritionGrade == "2" ? "bg-lime-500" : product.nutritionGrade == "3" ? "bg-yellow-500" : "bg-red-500"

        const card = document.createElement("div");
        card.className =
            "product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group";
        card.dataset.barcode = product.barcode;

        const imageWrapper = document.createElement("div");
        imageWrapper.className =
            "relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden";

        const img = document.createElement("img");
        img.className =
            "w-full h-full object-contain group-hover:scale-110 transition-transform duration-300";
        img.src = product.image;
        img.alt = product.name;
        img.loading = "lazy";

        const nutriScore = document.createElement("div");
        nutriScore.className =
            `absolute top-2 left-2 ${nutriBg} text-white text-xs font-bold px-2 py-1 rounded uppercase`;
        nutriScore.innerText = `Nutri-Score ${product.nutritionGrade.toUpperCase()}`;

        const nova = document.createElement("div");
        nova.className =
            `absolute top-2 right-2 ${noveBg} text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center`;
        nova.title = `NOVA ${product.novaGroup}`;
        nova.innerText = product.novaGroup;

        imageWrapper.append(img, nutriScore, nova);

        const content = document.createElement("div");
        content.className = "p-4";

        const brand = document.createElement("p");
        brand.className = "text-xs text-emerald-600 font-semibold mb-1 truncate";
        brand.innerText = product.brand;

        const title = document.createElement("h3");
        title.className =
            "font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors";
        title.innerText = product.name;

        const info = document.createElement("div");
        info.className = "flex items-center gap-3 text-xs text-gray-500 mb-3";

        const weightSpan = document.createElement("span");
        const weightIcon = document.createElement("i");
        weightIcon.className = "fa-solid fa-weight-scale mr-1";
        weightSpan.append(weightIcon, document.createTextNode(".5kg"));

        const caloriesSpan = document.createElement("span");
        const calIcon = document.createElement("i");
        calIcon.className = "fa-solid fa-fire mr-1";
        caloriesSpan.append(calIcon, document.createTextNode(product.nutrients.calories));

        info.append(weightSpan, caloriesSpan);

        const nutritionGrid = document.createElement("div");
        nutritionGrid.className = "grid grid-cols-4 gap-1 text-center";

        const nutrients = [
            { value: product.nutrients.protein, label: "Protein", bg: "bg-emerald-50", text: "text-emerald-700" },
            { value: product.nutrients.carbs, label: "Carbs", bg: "bg-blue-50", text: "text-blue-700" },
            { value: product.nutrients.fat, label: "Fat", bg: "bg-purple-50", text: "text-purple-700" },
            { value: product.nutrients.sugar, label: "Sugar", bg: "bg-orange-50", text: "text-orange-700" },
        ];

        nutrients.forEach(n => {
            const div = document.createElement("div");
            div.className = `${n.bg} rounded p-1.5`;

            const valP = document.createElement("p");
            valP.className = `text-xs font-bold ${n.text}`;
            valP.innerText = n.value;

            const labelP = document.createElement("p");
            labelP.className = "text-[10px] text-gray-500";
            labelP.innerText = n.label;

            div.append(valP, labelP);
            nutritionGrid.appendChild(div);
        });

        content.append(brand, title, info, nutritionGrid);

        card.append(imageWrapper, content);

        card.addEventListener("click", () => {
            productModalImg.setAttribute("src", product.image)
            productModal.classList.remove("d-none")
            productModalGrade.innerText = product.nutritionGrade.toUpperCase()
            productModalBrand.innerText = product.brand
            productModalName.innerText = product.name
            productModalCalories.innerText = `${product.nutrients.calories} kcal`
            productModalCalories2.innerText = product.nutrients.calories
            productModalProtein.innerText = `${product.nutrients.protein}g`
            productModalCarbs.innerText = `${product.nutrients.carbs}g`
            productModalFat.innerText = `${product.nutrients.fat}g`
            productModalSugar.innerText = `${product.nutrients.sugar}g`
            productModalProteinProggress.style.width = `${product.nutrients.protein / 50 * 100}%`;
            productModalCarbsProggress.style.width = `${product.nutrients.carbs / 300 * 100}%`;
            productModalFatProggress.style.width = `${product.nutrients.fat / 70 * 100}%`;
            productModalSugarProggress.style.width = `${product.nutrients.sugar / 90 * 100}%`;
            productData = product;

        });


        return card;
    }

    async function getProductCategory() {
        let response = await fetch("https://nutriplan-api.vercel.app/api/products/categories")
        let data = await response.json();


        data.results.forEach((category) => {
            productCategories.appendChild(createCategoryButton(category))
        })
    }

    function createCategoryButton(category) {


        const categoryStyles = [
            {
                id: "en:breakfasts",
                name: "Breakfast",
                bg: "from-amber-500 to-orange-500",
                icon: "fa-wheat-awn"
            },
            {
                id: "en:cocoa-and-its-products",
                name: "Drinks",
                bg: "from-blue-500 to-cyan-500",
                icon: "fa-bottle-water"
            },
            {
                id: "en:snacks",
                name: "Snacks",
                bg: "from-purple-500 to-pink-500",
                icon: "fa-cookie"
            },
            {
                id: "en:dairies",
                name: "Dairy",
                bg: "from-sky-400 to-blue-500",
                icon: "fa-cheese"
            },
            {
                id: "en:fruits-based-foods",
                name: "Fruits",
                bg: "from-red-500 to-rose-500",
                icon: "fa-apple-whole"
            },
            {
                id: "en:vegetables-based-foods",
                name: "Vegetables",
                bg: "from-green-500 to-emerald-500",
                icon: "fa-carrot"
            },
            {
                id: "en:breads",
                name: "Breads",
                bg: "from-amber-600 to-yellow-500",
                icon: "fa-bread-slice"
            },
            {
                id: "en:meats",
                name: "Meats",
                bg: "from-red-600 to-rose-600",
                icon: "fa-drumstick-bite"
            }
        ];


        let isExist = categoryStyles.find((item) => {
            return item.id == category.id
        })

        if (!isExist) return document.createDocumentFragment();

        const btn = document.createElement("button");

        const style = isExist;

        btn.className = `
    product-category-btn flex-shrink-0 px-5 py-3 
    bg-gradient-to-r ${style.bg}
    text-white rounded-xl font-semibold 
    hover:shadow-lg transition-all
    `;

        btn.dataset.category = category.name;

        const icon = document.createElement("i");
        icon.className = `fa-solid ${style.icon} mr-2`;

        const text = document.createElement("span");
        text.textContent = style.name;

        btn.appendChild(icon);
        btn.appendChild(text);

        btn.addEventListener("click", () => {
            currentUrl = `https://nutriplan-api.vercel.app/api/products/category/${category.name}`
            getProduct(`https://nutriplan-api.vercel.app/api/products/category/${category.name}`)
        })

        return btn;
    }

    function logProduct(product) {

        let todayDate = getDate();
        
        let mealObj = {
            type: "product",
            name: product.name,
            mealId: product.barcode,
            category: product.brand,
            thumbnail: product.image,
            servings: 1,
            nutrition: {
                calories: product.nutrients.calories,
                protein: product.nutrients.protein,
                carbs: product.nutrients.carbs,
                fat: product.nutrients.fat
            },
            loggedAt: new Date().toISOString()
        };

        mealsData[todayDate].meals.push(mealObj);
        mealsData[todayDate].totalCalories += product.nutrients.calories;
        mealsData[todayDate].totalProtein += product.nutrients.protein;
        mealsData[todayDate].totalCarbs += product.nutrients.carbs;
        mealsData[todayDate].totalFat += product.nutrients.fat;
        localStorage.setItem("mealsLoged", JSON.stringify(mealsData));

        // Implementation for logging the product goes here
    }

    getProductCategory()



}


export function getDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}