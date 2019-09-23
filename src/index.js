document.addEventListener('DOMContentLoaded', (loadevent) => {
  let allDogs = []


  const topDogBar = document.querySelector("#dog-bar");
  const dogInfoSection = document.querySelector("#dog-info");


  function filterTopDogsBar() {
    topDogBar.innerHTML = ""
    filteredDogs = allDogs.filter( function(dog) { return dog.isGoodDog == true})
    filteredDogs.forEach( function(dog) {
    topDogBar.insertAdjacentHTML("beforeend", `
    <span data-dogid="${dog.id}" class="dog_span">${dog.name}</span>
      `)})} // ends buildTopDogsBar

  function buildTopDogsBar() {
    topDogBar.innerHTML = ""
    allDogs.forEach( function(dog) {
    topDogBar.insertAdjacentHTML("beforeend", `
    <span data-dogid="${dog.id}" class="dog_span">${dog.name}</span>
      `)})} // ends buildTopDogsBar


  document.addEventListener("click", function(event){
    switch (true) {
      case (event.target.classList == "dog_span"):
        dog = allDogs.find( function(dog) { return dog.id == event.target.dataset.dogid});
        dogInfoSection.innerHTML = `
            <img src="${dog.image}">
            <h2>${dog.name}</h2> <br />
            <button data-dogid="${dog.id}" class="good_dog_button">______</button>
            `   //AT this point all dog info lines are added, now need to print button
        if(dog.isGoodDog == true) {
          dogInfoSection.querySelector("button").innerText = "Good Dog!"
        } else {
          dogInfoSection.querySelector("button").innerText = "Bad Dog!"
        }// ends good dog button if statement
        break

      case (event.target.classList == "good_dog_button"):
        dog = allDogs.find( function(dog) { return dog.id == event.target.dataset.dogid});
        if(dog.isGoodDog === true) {
          body = {isGoodDog: false}
        } else {
          body = {isGoodDog: true}
        } // Ends goodDog togle if statement/data declations
        fetch(`http://localhost:3000/pups/${dog.id}`,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: "PATCH",
          body: JSON.stringify(body)
        })
        .then( function(results) { 
            return results.json()
          }) //Ends second THEN statement reformatting results into JSON
        .then( function (results) { 
          if(results.isGoodDog == true) {
            event.target.innerText = "Good Dog!"
            dog.isGoodDog = true
          } else {
            event.target.innerText = "Bad Dog!"
            dog.isGoodDog = false
          }// ends good dog button if statement
        })//Ends 3rd THEN Statement that acts on the button press
     // ends case statement for good_dog_button
      break

      case (event.target.id == "good-dog-filter"):
        if (event.target.innerText == "Filter good dogs: OFF") {
          event.target.innerText = "Filter good dogs: ON"
          filterTopDogsBar()
        } else {
          event.target.innerText = "Filter good dogs: OFF"
          buildTopDogsBar()
        }
      }  // ENDS SWITCH STATEMENT
  })  //Ends Delegated Event Listener

  //Tbhis is the initial fetch that gathers, stores, and displays all initial dogs data
  fetch ("http://localhost:3000/pups")
  .then ( function(results) {
    return results.json()
  }) //Ends firest .THEN statement
  .then (function(results) { 
    allDogs = results
    buildTopDogsBar()
  })  /// Ends Fetch that grabs all dogs data and builds top bar
  
});  //Enb of DOMContentLoaded Event