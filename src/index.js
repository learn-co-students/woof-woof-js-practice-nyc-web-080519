// - CLICK ON DOGS IN THE DOG BAR TO SEE MORE INFO ABOUT THE GOOD PUPPER
//      - Create Dog Bar constant 
//      - Create a dogs url constant 
//      - Fetch Dog information from url
//      - Display Dog information 
// - MORE INFO INCLUDES A DOG PIC, A DOG NAME, AND A DOG BUTTON THAT INDICATES
//   WHETHER IT IS A GOOD DOG OR A BAD DOG
// - CLICK ON GOOD DOG/BAD DOG BUTTON IN ORDER TO TOGGLE PUP GOODNESS
// - CLICK ON "FILTER GOOD DOGS" BUTTON IN ORDER TO JUST SEE GOOD DOGS OR SEE
// ALL DOGS IN DOG BAR

document.addEventListener("DOMContentLoaded", function(){
    const dogBar = document.querySelector("#dog-bar")
    const dogInfo = document.querySelector("#dog-info")
    const dogMain = "http://localhost:3000/pups"
    
    fetch(dogMain)
    .then(function(request){
        return request.json()
    })
    .then(function(dogs){
        dogs.forEach(function(dog){
            dogBar.insertAdjacentHTML('beforeend',`<span data-action = "name", data-id = ${dog.id} >${dog.name}</span>`)
        })
    })

    document.addEventListener("click", function(e){
        if(e.target.dataset.action === "name"){
            dogInfo.innerText = ""
            fetch(`http://localhost:3000/pups/${e.target.dataset.id}`)
            .then(function(response){
                return response.json()
            })
            .then(function(dogData){
                let buttonText
                if (dogData.isGoodDog) {
                    buttonText = "Good Dog!"
                }
                else {
                    buttonText = "Bad Dog!"
                }
                dogInfo.insertAdjacentHTML('beforeend',`
                    <img src=${dogData["image"]}>
                    <h2>${dogData["name"]}</h2>
                    <button data-action = "status", data-id = ${dogData["id"]}>${buttonText}</button>
                `)
            })
        }
        else if(e.target.dataset.action === "status"){
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
            fetch(`http://localhost:3000/pups/${e.target.dataset.id}`,{
                method: "PATCH",
                headers:{
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    isGoodDog: newBool
                }) 
            })
            .then(function(response){
                return response.json()
            })
            .then(function(newStatus){
                document.querySelector("#dog-info > button").innerText = `${newText}`
            })
        }
        else if(e.target.id === "good-dog-filter" && e.target.innerText === "Filter good dogs: OFF"){
            fetch(dogMain)
            .then(function(response){
                return response.json()
            })
            .then(function(dogs){
                dogBar.innerText = ""
                goodDogArray = []
                for (i = 0; i < dogs.length; i++) {
                    if (dogs[i].isGoodDog){goodDogArray.push(dogs[i].name)}
                }
                goodDogArray.forEach(function(dog){
                    dogBar.insertAdjacentHTML('beforeend',`<span>${dog}</span>`)
                })
                document.querySelector("#good-dog-filter").innerText = "Filter good dogs: ON"
            })
        }
        else if(e.target.id === "good-dog-filter" && e.target.innerText === "Filter good dogs: ON"){
            dogBar.innerText = ""
            fetch(dogMain)
            .then(function(request){
                return request.json()
            })
            .then(function(dogs){
                dogs.forEach(function(dog){
                dogBar.insertAdjacentHTML('beforeend',`<span data-action = "name", data-id = ${dog.id} >${dog.name}</span>`)
                })
            document.querySelector("#good-dog-filter").innerText = "Filter good dogs: OFF"
            })

        }
    })

})

