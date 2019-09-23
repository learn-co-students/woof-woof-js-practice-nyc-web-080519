document.addEventListener("DOMContentLoaded", function() {
    const dog_bar = document.querySelector("#dog-bar")
    const dog_info = document.querySelector("#dog-info")
    const dog_filter = document.querySelector("#good-dog-filter")
    let dogs;

    fetch("http://localhost:3000/pups")
    .then(response => response.json())
    .then(renderDogs)

    function renderDogs(data) {
        dog_bar.innerHTML = ''
        let goodDogs;
        if (dog_filter.innerText === "Filter good dogs: ON") {
            goodDogs = data.filter(function(dog) {
                return dog.isGoodDog === true
            })
        } else {
            goodDogs = [...data]
        }

        goodDogs.forEach(function (dog) {
            dog_bar.insertAdjacentHTML("beforeend", `<span data-id="${dog.id}">${dog.name}</span>`)
        })
        // debugger
        dogs = [...data]
    }


    dog_bar.addEventListener("click", function(event) {
        let dog = dogs.find(function(dog) {
            return dog.id === parseInt(event.target.dataset.id)
        })
        
        let personality;
        if (dog.isGoodDog) {
            personality = "Good Dog"
        } else {
            personality = "Bad Dog"
        }

        fetch(`http://localhost:3000/pups/${event.target.dataset.id}`)
        .then(response => response.json())
        .then(function(data) {
            const str = `
                <img src="${dog.image}">
                <h2>${dog.name}</h2>
                <button data-id="${dog.id}" data-action="dog_personality">${personality}</button>`
            dog_info.insertAdjacentHTML("beforeend", str)
        })
        dog_info.innerHTML = ''
    })

    dog_info.addEventListener("click", function(event) {
        let dog = dogs.find(function(dog) {
            return dog.id === parseInt(event.target.dataset.id)
        })
        
        if (event.target.dataset.action === "dog_personality") {
            let personality = !(dog.isGoodDog)
            fetch(`http://localhost:3000/pups/${event.target.dataset.id}`, {
                method: "PATCH", 
                headers: {
                    "Content-Type": "application/json",
                    Accepts: "application/json"
                },
                body: JSON.stringify({isGoodDog: personality})
            })
            .then(response => response.json())
            .then(function(data) {
                dog.isGoodDog = personality
                if (personality) {
                    event.target.innerText = "Good Dog"
                } else {
                    event.target.innerText = "Bad Dog"
                }
                renderDogs(dogs)
            })
        }
    })

    dog_filter.addEventListener("click", function(event) {
        if (event.target.innerText === "Filter good dogs: ON") {
            event.target.innerText = "Filter good dogs: OFF"
        } else {
            event.target.innerText = "Filter good dogs: ON"
        }
        renderDogs(dogs)
    })
    
})
