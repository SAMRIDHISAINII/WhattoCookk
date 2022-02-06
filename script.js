'use strict';

const placeholders = ['Chinese..', 'Mexican..', 'American..', 'Mediterranean..', 'Southern..',
    'French..', 'Greek..'];
let counter = 0;
let inquire = document.getElementById('cuisine-input');
let length = placeholders.length;

function changePlaceholder() {
    if (counter >= length) {
        counter = 0;
    }
    inquire.setAttribute('placeholder', placeholders[counter]);
    counter++;
}

setInterval(changePlaceholder, 3000);


function displayRandomResults(responseJson) {
    $('#results-list').empty();
    const ingredients = [];
    for (let i = 0; i < responseJson.recipes[0].extendedIngredients.length; i++) {
        ingredients.push(`<li>${responseJson.recipes[0].extendedIngredients[i].original}</li>`);
    }
    $('#results-list').append(
        `<li><h2>${responseJson.recipes[0].title}</h2>
        <a href="${responseJson.recipes[0].sourceUrl}" target="_blank"><img src="${responseJson.recipes[0].image}" 
        alt="Photo of ${responseJson.recipes[0].title}"/>
        </a></li>
        <ul class="ingredients">
        <h3>Ingredients:</h3>
        ${ingredients.join('')}
        </ul>
        <li><pre><h3>Instructions:</h3>${responseJson.recipes[0].instructions.replace(/(?:\r\n|\r|\n|     |\.)/g, '<br>')}</pre></li>` //regex added to alter large string to better format
    )
    $('#results').removeClass('hidden');
}

function displayCuisineResults(responseJson) {
    $('#results-list').empty();
    const ingredients = [];
    for (let i = 0; i < responseJson.extendedIngredients.length; i++) {
        ingredients.push(`<li>${responseJson.extendedIngredients[i].original}</li>`);
    }
    $('#results-list').append(
        `<li><h2>${responseJson.title}</h2>
        <a href="${responseJson.sourceUrl}" target="_blank"><img src="${responseJson.image}" 
        alt="Photo of ${responseJson.title}"/>
        </a></li>
        <ul class="ingredients">
        <h3>Ingredients:</h3>
        ${ingredients.join('')}
        </ul>
        <li><pre><h3>Instructions:</h3>${responseJson.instructions.replace(/(?:\r\n|\r|\n|     |\.)/g, '<br>')}</pre></li>` //regex added to alter large string to better format
    )
    $('#results').removeClass('hidden');
}

function watchCuisineButton() {
    $('section').on('click', '#cuisine-submit', event => {
        event.preventDefault();
        const searchTerm = $('#cuisine-input').val();
        fetch(`https://api.spoonacular.com/recipes/search?cuisine=${searchTerm}&apiKey=aa96834077e04f6a8ce4a44dc2cac362`)
            .then(response => response.json())
            .then(responseJson => getCuisineResults(responseJson))
            .catch(error => console.log('Cuisine went wrong'));
    });
}

function getCuisineResults(responseJson) {
    $('#results-list').empty();
    const i = Math.floor(Math.random() * 9); //Random number generator to get a random recipe out of the ten returned.
    const recipeId = `${responseJson.results[i].id}`;
    getRecipeById(recipeId);
}

function getRecipeById(recipeId) {
    fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?includeNutrition=false&apiKey=aa96834077e04f6a8ce4a44dc2cac362`)
        .then(response => response.json())
        .then(responseJson => displayCuisineResults(responseJson))
        .catch(error => console.log('Id went wrong'));
}

function watchRandomButton() {
    $('section').on('click', '#random-meal', event => {
        event.preventDefault();
        fetch('https://api.spoonacular.com/recipes/random?apiKey=aa96834077e04f6a8ce4a44dc2cac362')
            .then(response => response.json())
            .then(responseJson => displayRandomResults(responseJson))
            .catch(error => console.log('Something went wrong'));
    });
}


$(watchCuisineButton);
$(watchRandomButton);
