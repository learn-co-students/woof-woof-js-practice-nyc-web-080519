document.addEventListener("DOMContentLoaded", function() {
    const dogBar = document.querySelector("div#dog-bar")
    const dogInfo = document.querySelector("div#dog-info")
    const allDogs = []

    function filtered(bool) {
        if (bool) {
            dogBar.innerHTML = ""
            filteredDogs = allDogs.filter(function(dog) {
                return dog.isGoodDog
            })
            filteredDogs.forEach(function(dog) {
                dogBar.insertAdjacentHTML("beforeend", `<span data-id="${dog.id}">${dog.name}</span>`)
            })
        }
        else {
            dogBar.innerHTML = ""
            allDogs.forEach(function(dog) {
                dogBar.insertAdjacentHTML("beforeend", `<span data-id="${dog.id}">${dog.name}</span>`)
            })
        }
    }

    fetch("http://localhost:3000/pups")
    .then(function(response) {
        return response.json()
    })
    .then(function(data) {
        data.forEach(function(dog) {
            allDogs.push(dog)
            dogBar.insertAdjacentHTML("beforeend", `<span data-id="${dog.id}">${dog.name}</span>`)
        })
    })

    document.addEventListener("click", function(e) {
        if (e.target.tagName === "SPAN") {
            fetch(`http://localhost:3000/pups/${e.target.dataset.id}`)
            .then(function(response) {
                return response.json()
            })
            .then(function(dog) {
                //clears out the dog so only one is shown at a time
                dogInfo.innerHTML = ""
                let buttonText
                if (dog.isGoodDog) {
                    buttonText = "Good Dog!"
                }
                else {
                    buttonText = "Bad Dog!"
                }
                dogInfo.insertAdjacentHTML("beforeend",
                `<img src="${dog.image}">
                <h2>${dog.name}</h2>
                <button data-action="goodBad" data-id="${dog.id}">${buttonText}</button>
                `)
            })
        }
        else if (e.target.dataset.action === "goodBad") {
            let newText
            let newBool
            if (e.target.innerText === "Good Dog!") {
                newText = "Bad Dog!"
                newBool = false
            }
            else {
                newText = "Good Dog!"
                newBool = true
            }
            fetch(`http://localhost:3000/pups/${e.target.dataset.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({isGoodDog: newBool})
            })
            .then(function(response) {
                return response.json()
            })
            .then(function(data) {
                e.target.innerText = newText
            })
        }
        else if (e.target.id === "good-dog-filter") {
            if (e.target.innerText === "Filter good dogs: OFF") {
                e.target.innerText = "Filter good dogs: ON"
                filtered(true)
            }
            else {
                e.target.innerText = "Filter good dogs: OFF"
                filtered(false)
            }
        }
    })
})