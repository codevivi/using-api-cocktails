"use strict";
const letterList = document.getElementById("letter-list");
const bla = document.getElementById("bla");
let letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
letters.forEach((letter) => {
  letterList.innerHTML += `
    <div class="list-group mb-2">
            <button type="button" data-letter="${letter.toLowerCase()}" onClick="getLetterList(event)" class="get-list-by-letter-btn btn btn-outline-primary dropdown-toggle d-flex justify-content-end align-items-center" data-bs-toggle="dropdown" aria-expanded="false"">
               ${letter} 
            </button>
            <ul class="letter-list dropdown-menu w-75"></ul>
        </div>
    `;
});

function getLetterList(event) {
  let letter = event.target.dataset.letter;
  let listEl = document.querySelector(`button[data-letter="${letter.toLowerCase()}"]+ul`);
  if (listEl.innerHTML !== "") {
    return;
  }
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${letter}`)
    .then((res) => {
      if (res.status !== 200) {
        console.log(res);
        throw new Error("Sorry.. application failed");
      }
      return res.json();
    })
    .then((data) => {
      if (data.drinks === null) {
        listEl.innerHTML += `
        <li>
             <button type="button" class="drop-down-item list-group-item list-group-item-action" aria-current="true" width="50">
       There are no drinks starting with letter ${letter.toUpperCase()};
        </button>
    </li>
        `;
      }
      data.drinks.forEach((drink) => {
        console.log(drink);
        listEl.innerHTML += `
        <li>
        <button type="button" class="drop-down-item list-group-item list-group-item-action" aria-current="true" width="50"  data-drinkid="${drink.idDrink}" onClick="moreInfo(event)">

           ${drink.strDrink} 
            <img src="${drink.strDrinkThumb}/preview" style="float:left;margin-right:0.5em">Caption
        </button>
    </li>
        `;
      });
    })
    .catch((e) => console.log(e));
}

function moreInfo(event) {
  let drinkId = event.target.dataset.drinkid;
  console.log(drinkId);
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`)
    .then((res) => {
      console.log(res, "*****");
      if (res.status === 200) {
        return res.json();
      } else {
        console.log("Connection to api failed");
      }
    })
    .then((data) => {
      let drink = data.drinks[0];
      console.log(data);

      let ingredients = [];
      for (let key in drink) {
        if (key.startsWith("strIngredient")) {
          if (drink[key]) {
            console.log(drink[key]);
            ingredients.push(drink[key]);
          }
        }
      }
      bla.innerHTML = `
       <div class="info">
                        <h1 class="modal-title fs-5">${drink.strDrink}</h1>
                    <div class="modal-body">
                    <p>${drink.strAlcoholic} ${drink.strCategory}</p>
                    <img src="${drink.strDrinkThumb}" alt="${drink.strDrink} image">
                    <p>${drink.strInstructions}</p>

                    <h2>Ingredients:</h2>
                    <ul class="ingredients">
                    ${ingredients
                      .map((item) => {
                        return `<li>${item} <img src="https://www.thecocktaildb.com/images/ingredients/${item}.png"></li>`;
                      })
                      .reduce((acc, curr) => acc + curr)}
                    <ul/>
                   
                    </div>
                    </div>
      `;
      bla.scrollIntoView();
    })
    .catch((e) => console.log(e));
}
