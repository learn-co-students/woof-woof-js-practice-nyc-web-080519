const dogBar = document.querySelector("#dog-bar")
const dogInfo = document.querySelector("#dog-info")

fetch("http://localhost:3000/pups")
.then(resp => resp.json())
.then(function(dogs){
    dogs.forEach(function(dog) {
    const str =
    `
    <span data-id=${dog.id}>${dog.name}</span>
    `
    dogBar.insertAdjacentHTML("afterbegin", str)
    
    })//forEach
})//end of then

dogBar.addEventListener("click", function(event){
    if(event.target.dataset.id === event.target.dataset.id) {
       fetch(`http://localhost:3000/pups/${event.target.dataset.id}`)
       .then(resp => resp.json())
       .then(function(dog){
        const dogBio =
        `
        <img src="${dog.image}"> 
        <h2>${dog.name}</h2> 
        <button id="button">Good Dog!</button>
        `
        dogInfo.insertAdjacentHTML("afterbegin", dogBio)
        
        if(dogInfo.childElementCount !== 0)
        dogInfo.innerHTML = " "
        dogInfo.insertAdjacentHTML("afterbegin", dogBio)
       })
    }
})

document.addEventListener("click", function(event){
    if(event.target.tagName === "BUTTON"){
        let goodButton = event.target
        // console.log(goodButton)
        if(goodButton.innerText === "Good Dog!") {
            goodButton.innerText = "Bad Dog!"
        } else {
            goodButton.innerText = "Good Dog!"
        }
    }
})