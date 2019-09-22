document.addEventListener('DOMContentLoaded', ev => {

  const dogURL = "http://localhost:3000/pups"
  const dogBar = document.querySelector("#dog-bar")
  const dogInfo = document.querySelector("#dog-info")
  const filterBtn = document.querySelector("#good-dog-filter")

  getAllDogs().then(addPupsToDogBar)
  
  function addPupsToDogBar(dogs, filterOn = false){
    dogBar.innerHTML = ""
    if(filterOn){
      dogs.filter(dog => dog.isGoodDog).forEach(renderOneDog)
    } else{
      dogs.forEach(renderOneDog)
    }
    filterBtn.addEventListener('click', onFilterClick)
  }

  function renderOneDog(dog){
    const dogName = `<span id= ${dog.id}>${dog.name}</span>`
    dogBar.insertAdjacentHTML('beforeend', dogName)
    const span = dogBar.querySelector("span")

    dogBar.addEventListener('click', onDogSpanClick)

  }

  function onDogSpanClick(e){
    getADog(e.target.id)
      .then(showMoreInfo)
  }

  function showMoreInfo(dog){
    dogInfo.innerHTML = ''
    const dogStats = `
      <h2>${dog.name}</h2>
      <img src="${dog.image}"/>
      `
    dogInfo.insertAdjacentHTML('beforeend', dogStats)
    
    const dogButton = document.createElement("button")
    dogButton.innerText = dog.isGoodDog? "Good Dog!" : "Bad Dog!"
    dogButton.id = dog.id
    dogInfo.append(dogButton)

    dogButton.addEventListener('click', onDogButtonClick)

  }

  function onDogButtonClick(e){
    let newValue; 
    if(e.target.innerText.includes("Good")){
      e.target.innerText = "Bad Dog!"
      newValue = false
    } else{
      e.target.innerText = "Good Dog!"
      newValue = true 
    }
    const dogId = e.target.id
    updateADog(dogId, newValue)
  }

  function onFilterClick(e){
    let filterOn 
    if(e.target.innerText.includes("OFF")){
      e.target.innerText = "Filter good dogs: ON"
      filterOn = true 
      updateDogSpan(filterOn)
    } else {
      e.target.innerText = "Filter good dogs: OFF"
      filterOn = false
      updateDogSpan(filterOn)
    }
  }

  function updateDogSpan(filterOn){
      if(filterOn){
        getAllDogs().then(dogs => addPupsToDogBar(dogs, true))
      } else {
        getAllDogs().then(dogs => addPupsToDogBar(dogs))
      }
  }

  



  //FETCHES

  function getAllDogs(dogs){
    return fetch(dogURL)
      .then(response => response.json())
  }

  function getADog(id){
    return fetch(dogURL + `/${id}`)
      .then(resp => resp.json())
  }

  function updateADog(dogId, newValue){
    const options = {
      method: "PATCH", 
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        isGoodDog: newValue
      })
    }
    return fetch(dogURL + `/${dogId}`, options)
      .then(resp => resp.json())
  }

  


}); //end of DOM content loaded 
