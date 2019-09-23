document.addEventListener("DOMContentLoaded", function(){
    addDogs()
    loadDogBar()
    dogSpanClick()
    changeBehavior()
    filterDog()
})

const url = 'http://localhost:3000/pups'
const dogs = []

function addDogs(){
    fetch(url)
    .then(function (response) {
        return response.json()
    })
    .then(function (dogsArr) {
        dogsArr.forEach(function(dog){
            const dogInfo = {id: dog.id, name: dog.name, isGoodDog: dog.isGoodDog, image: dog.image}
            dogs.push(dogInfo)
        })
    })
}


function loadDogBar(){
    const dogBar = document.querySelector('#dog-bar');
    fetch(url)
    .then(function(response){
        return response.json()
    })
    .then(function(dogs){
        dogs.forEach(function(dog){
            let name = dog.name;
            let dogSpan = document.createElement('span')
            dogSpan.dataset['id'] = dog.id
            dogSpan.innerText = name;
            dogBar.append(dogSpan)
        })
    })
}

function dogSpanClick(){
    const container = document.querySelector('#dog-bar');
    container.addEventListener("click", function(event){
        let dog = event.target
        if(dog.tagName === "SPAN"){
            let dogId = dog.dataset.id
            fetch(`${url}/${dogId}`)
            .then(function(response){
                return response.json()
            })
            .then(addDogInfo)
        }
    })
}

function addDogInfo(dog){
    const dogContainer = document.querySelector("#dog-summary-container")
    // this reset the dogContainer
    dogContainer.innerHTML = ""
    let name = dog.name
    let img = dog.image
    let behavior = dog.isGoodDog
    if(behavior === true){
        behavior = "Good Dog!"
    } else {
        behavior = "Bad Dog!"
    }
    let dogDiv = document.createElement('div')
    dogDiv.innerHTML = `<img src=${img}> <h2>${name}</h2><button>${behavior}</button>`
    dogDiv.id = 'dog-info'
    dogDiv.dataset['id'] = dog.id
    dogContainer.append(dogDiv)
}

function addFilteredDogs(dog){
    const dogContainer = document.querySelector("#dog-summary-container")
    let name = dog.name
    let img = dog.image
    let behavior = dog.isGoodDog
    if (behavior === true) {
        behavior = "Good Dog!"
    } else {
        behavior = "Bad Dog!"
    }
    let dogDiv = document.createElement('div')
    dogDiv.innerHTML = `<img src=${img}> <h2>${name}</h2><button>${behavior}</button>`
    dogDiv.id = 'dog-info'
    dogDiv.dataset['id'] = dog.id
    dogContainer.append(dogDiv)
}

function changeBehavior(){
    let dog = document.querySelector("#dog-summary-container")
    dog.addEventListener('click', function(event){
        let dogTarget = event.target
        if(dogTarget.tagName === "BUTTON"){
            let dogDiv = dogTarget.closest('div')
            let dogId = dogDiv.dataset.id
            let beh = dogDiv.querySelector('button')
            let behBool = true;
            if(beh.innerText === "Good Dog!"){
                beh.innerText = "Bad Dog!";
                behBool = false;
            } else {
                beh.innerText = "Good Dog"
            }
            fetch(`${url}/${dogId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify({ isGoodDog: behBool })
            } )
            .then(function (response) {
                return response.json()
            })
        }
    })
}

function filterDog(){
    let filterBtn = document.querySelector("button#good-dog-filter")
    filterBtn.addEventListener("click", function(event){
        const btn = event.target
        if (btn.innerText === "Filter good dogs: OFF"){
            const goodDog = getDogs(true)
            btn.innerText = "Filter good dogs: ON"
            document.querySelector("#dog-summary-container").innerHTML = ""
            goodDog.forEach(addFilteredDogs)
        } else {
            const badDog = getDogs(false)
            document.querySelector("#dog-summary-container").innerHTML = ""
            btn.innerText = "Filter good dogs: OFF"
            badDog.forEach(addFilteredDogs)
        }
    })
}

function getDogs(boolean){
    const result = []
    dogs.forEach(function(dog){
        if (dog.isGoodDog === boolean){
            result.push(dog)
        }
    })
    return result
}