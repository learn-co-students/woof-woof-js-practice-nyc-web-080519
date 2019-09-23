document.addEventListener("DOMContentLoaded", () => {

    //  ------------ DECLARE & EXECUTE ---------------

    const bar = document.querySelector("#dog-bar")
    let data = []
    const doggoInfo = document.querySelector("#dog-info")
    const filter = document.querySelector("#good-dog-filter")

    getDogs().then(function (dogs) {
        data = dogs
        populateBar(dogs)
    });

    //  ------------ OPERATE ---------------

    function getDogs(){
        return fetch("http://localhost:3000/pups")
        .then(resp => resp.json())
    }

    function populateBar(dogs) {
        while (bar.firstChild) {
            bar.removeChild(bar.firstChild);
        }

        let goodDogs = []
        if (filter.innerHTML.includes(" ON")) {
            goodDogs = dogs.filter(dog => {return dog.isGoodDog === true})
        } else {
            goodDogs = dogs
        }

        goodDogs.forEach(function (dog) {
            bar.insertAdjacentHTML("beforeend", `<span id="${dog.id}">${dog.name}</span>`);
        });
    }

    function displayDog(dogName) {
        //remove previous dog
        while (doggoInfo.firstChild) {
            doggoInfo.removeChild(doggoInfo.firstChild);
        }
        // find new dog
        let dogOBJ = data.find(dog => { return dog.name === dogName })

        // is the dog good or bad?
        let good = "";
        if (dogOBJ.isGoodDog) {
            good = "Good"
        } else {
            good = "Bad"
        }
        // display the dog
        doggoInfo.insertAdjacentHTML("beforeend", `
            <img src=${dogOBJ.image}>
            <h2>${dogOBJ.name}</h2>
            <button class="goodness" data-id="${dogOBJ.id}" id="${dogOBJ.id}">${good} Dog!</button>
        `)
    }

    function flipGoodness(dogID) {
        let dogOBJ = data.find(dog => { return dog.id === parseInt(dogID) })
        swapped = !dogOBJ.isGoodDog

        return fetch(`http://localhost:3000/pups/${dogID}`, {
            method:"PATCH",
            headers:{
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({isGoodDog: swapped})
        })
        .then(resp => resp.json())
        .then(renderChange(dogOBJ, swapped))

    }

    function renderChange(obj, swapped) {
        obj.isGoodDog = swapped
        displayDog(obj.name)
    }

    //  ------------ LISTEN ---------------

    document.addEventListener("click", e => {
        // debugger
        if (e.target.id === "good-dog-filter") {
            if (filter.innerHTML.includes(" ON")) {
                filter.innerHTML = filter.innerHTML.replace("ON", "OFF")
            } else {
                filter.innerHTML = filter.innerHTML.replace("OFF", "ON")
            }
        }
        populateBar(data)
    })

    document.addEventListener("click", e => {
        if (e.target.nodeName === "SPAN") {
            displayDog(e.target.innerHTML)
        }
    })

    document.addEventListener("click", e => {
        if (e.target.className === "goodness") {
            flipGoodness(e.target.id)
        }
        populateBar(data)
    })

});

