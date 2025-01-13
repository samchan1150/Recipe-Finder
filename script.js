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
    categorySelect.innerHTML = '<option value="All">All</option>';

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
    areaSelect.innerHTML = '<option value="All">All</option>';

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
    ingredientSelect.innerHTML = '<option value="All">All</option>';

    data.meals.forEach(item => {
        const option = document.createElement('option');
        option.value = item.strIngredient;
        option.textContent = item.strIngredient;
        ingredientSelect.appendChild(option);
    });
}

function displayResults(meals) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

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
            <button class="viewRecipe" data-id="${meal.idMeal}">View Recipe</button>
        `;
        resultsDiv.appendChild(recipeDiv);
    });

    // Add event listeners to the View Recipe buttons
    const viewRecipeButtons = document.querySelectorAll('.viewRecipe');
    viewRecipeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const mealId = button.getAttribute('data-id');
            fetchMealDetails(mealId);
        });
    });
}

async function fetchMealDetails(mealId) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    const data = await response.json();
    const meal = data.meals[0];

    // Populate modal with meal details
    document.getElementById('modalTitle').textContent = meal.strMeal;
    document.getElementById('modalImage').src = meal.strMealThumb;

    const ingredientsList = document.getElementById('modalIngredients');
    ingredientsList.innerHTML = ''; // Clear previous ingredients
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient) {
            const li = document.createElement('li');
            li.textContent = `${ingredient} - ${measure}`;
            ingredientsList.appendChild(li);
        }
    }

    document.getElementById('modalInstructions').textContent = meal.strInstructions;
    document.getElementById('modalYouTubeLink').href = meal.strYoutube;

    // Show the modal
    document.getElementById('recipeModal').style.display = "block";
}

// Close the modal when the user clicks on <span> (x)
document.querySelector('.close').onclick = function() {
    document.getElementById('recipeModal').style.display = "none";
}

// Close the modal when the user clicks anywhere outside of the modal
window.onclick = function(event) {
    const modal = document.getElementById('recipeModal');
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

// Load categories, areas, and ingredients on page load
loadCategories();
loadAreas();
loadIngredients();