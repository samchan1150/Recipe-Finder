document.getElementById('search').addEventListener('click', () => {
    const meal = document.getElementById('meal').value;
    if (meal) {
        fetchRecipes(meal);
    } else {
        alert("Please enter a meal name.");
    }
});

async function fetchRecipes(meal) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${meal}`);
    const data = await response.json();
    displayResults(data.meals);
}

function displayResults(meals) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results

    if (!meals) {
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