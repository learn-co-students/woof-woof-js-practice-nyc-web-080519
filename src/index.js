document.addEventListener("DOMContentLoaded", function (){
    const dogBar = document.querySelector("#dog-bar")
    const dogInfo = document.querySelector("#dog-info")
    const goodDogButtons = document.querySelectorAll("#dog-btn")
    
    fetch("http://localhost:3000/pups")
    .then(response => response.json())
    .then(data => renderDogs(data))

    function renderDogs(data) {
        data.forEach(function (dog) {
            dogBar.insertAdjacentHTML('beforeend', `<span data-id="${dog.id}">${dog.name}</span>`)
        })
    }

dogBar.addEventListener("click", function (e) {
    if (e.target.dataset.id) {
        fetch(`http://localhost:3000/pups/${e.target.dataset.id}`)
        .then(response => response.json())
        .then(data => {
            dogInfo.innerHTML = `<img src="${data.image}">
            <h2>${data.name}</h2>
            <button data-id="${data.id}" status="${data.isGoodDog}" id="dog-btn"> ${data.isGoodDog ? "Good Dog!" : "Bad Dog!"}</button > `
        })
    }
})

dogInfo.addEventListener("click", function (e){
    // make sure that the target of the click is in fact a "dog-btn"
    if (e.target.id === "dog-btn") {
        // fetch a patch request to the interpolated dataset.id
        fetch(`http://localhost:3000/pups/${e.target.dataset.id}`, {
            method: "Patch",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({
                isGoodDog: `${!e.target.status}`
            })
        }).then(data => {
            // Change the value of the innerText of that given data entry's "dog-btn"
            e.target.innerText = `${data.isGoodDog ? "Good Dog!" : "Bad Dog!"}`
        })
    }
})

})

