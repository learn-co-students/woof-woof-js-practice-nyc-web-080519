document.addEventListener('DOMContentLoaded', (event) => {

    const dogBar = document.querySelector("#dog-bar")
    const dogInfo = document.querySelector("#dog-info")
    const dogFilter = document.querySelector("#good-dog-filter")

    fetchDogs("off");

   function fetchDogs(status) {
       fetch("http://localhost:3000/pups")
        .then(response => response.json())
        .then(json => listDogs(json, status))
   }

    dogBar.addEventListener("click", function(e) {
        fetch(`http://localhost:3000/pups/${e.target.dataset.dog_id}`)
        .then(response => response.json())
        .then(json => displayDogInfo(json))
    })

    dogInfo.addEventListener("click", function(e) {
        let payloadStatus = ""
        if (e.target.className === "change") {
            if (e.target.innerText === "Good Dog!") {
                e.target.innerText = "Bad Dog!"
                payloadStatus = false
            }
            else {
                e.target.innerText = "Good Dog!"
                payloadStatus = true
            }
            fetch(`http://localhost:3000/pups/${e.target.dataset.good_id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    "isGoodDog": payloadStatus
                })
            })
            
        }
    })

    dogFilter.addEventListener("click", function(e) {
        filterStatus = e.target.innerHTML.split(":")[1]
        if (filterStatus === " OFF") {
            e.target.innerHTML = "Filter good dogs: ON"
            fetchDogs("on")
        }
        else {
            e.target.innerHTML = "Filter good dogs: OFF"
            fetchDogs("off")
        }
    })

    function listDogs(dogs, status) {
        for (let i = 0; i < dogs.length; i++) {
            if (dogBar.children[i]) {
                dogBar.children[i].remove()
            }
            if (status === "off") {
                dogBar.insertAdjacentHTML("beforeend", `<span data-dog_id="${dogs[i].id}">${dogs[i].name}</span>`)
            }
            else {
                if (dogs[i].isGoodDog === true) {
                    dogBar.insertAdjacentHTML("beforeend", `<span data-dog_id="${dogs[i].id}">${dogs[i].name}</span>`)
                }
            }
        }
    }

    function displayDogInfo(dog) {
        const goodDogStatus = dog.isGoodDog
        buttonText = ""
        if (goodDogStatus === true) {
            buttonText = "Good Dog!"
        }
        else {
            buttonText = "Bad Dog!"
        }
        dogInfo.innerHTML = 
        `<img src="${dog.image}">
        <h2>${dog.name}</h2>
        <button class="change" data-good_id="${dog.id}">${buttonText}</button>`
    }
});