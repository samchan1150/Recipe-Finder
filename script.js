document.getElementById('search').addEventListener('click', () => {
    const meal = document.getElementById('meal').value;
    const category = document.getElementById('category').value;
    const area = document.getElementById('area').value;
    const ingredient = document.getElementById('ingredient').value;

    fetchFilteredRecipes(meal, category, area, ingredient);
});

async function fetchFilteredRecipes(meal, category, area, ingredient) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${meal}`);
    const data = await response.json();
    const meals = data.meals || [];

    // Filter based on selected category, area, and ingredient
    const filteredMeals = meals.filter(meal => {
        const matchesCategory = category === "All" || meal.strCategory === category;
        const matchesArea = area === "All" || meal.strArea === area;
        const matchesIngredient = ingredient === "All" || meal.strIngredient1 === ingredient;

        return matchesCategory && matchesArea && matchesIngredient;
    });

    displayResults(filteredMeals);
}

async function loadCategories() {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
    const data = await response.json();
    const categorySelect = document.getElementById('category');
    categorySelect.innerHTML = '<option value="All">All</option>'; // Default option

    data.meals.forEach(item => {
        const option = document.createElement('option');
        option.value = item.strCategory;
        option.textContent = item.strCategory;
        categorySelect.appendChild(option);
    });
}

async function loadAreas() {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
    const data = await response.json();
    const areaSelect = document.getElementById('area');
    areaSelect.innerHTML = '<option value="All">All</option>'; // Default option

    data.meals.forEach(item => {
        const option = document.createElement('option');
        option.value = item.strArea;
        option.textContent = item.strArea;
        areaSelect.appendChild(option);
    });
}

async function loadIngredients() {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
    const data = await response.json();
    const ingredientSelect = document.getElementById('ingredient');
    ingredientSelect.innerHTML = '<option value="All">All</option>'; // Default option

    data.meals.forEach(item => {
        const option = document.createElement('option');
        option.value = item.strIngredient;
        option.textContent = item.strIngredient;
        ingredientSelect.appendChild(option);
    });
}

function displayResults(meals) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results

    if (!meals.length) {
        resultsDiv.innerHTML = '<p>No recipes found.</p>';
        return;
    }

    meals.forEach(meal => {
        const recipeDiv = document.createElement('div');
        recipeDiv.classList.add('recipe');
        recipeDiv.innerHTML = `
            <h3>${meal.strMeal}</h3>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" style="width:100%">
            <p>Category: ${meal.strCategory}</p>
            <p>Area: ${meal.strArea}</p>
            <a href="${meal.strSource}" target="_blank">View Recipe</a>
        `;
        resultsDiv.appendChild(recipeDiv);
    });
}

// Load categories, areas, and ingredients on page load
loadCategories();
loadAreas();
loadIngredients();
