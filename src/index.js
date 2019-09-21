document.addEventListener("DOMContentLoaded", () => {

  const dogBar = document.getElementById("dog-bar")
  const dogInfo = document.getElementById("dog-info")
  const filterButton = document.getElementById("good-dog-filter")

 fetch("http://localhost:3000/pups")
    .then(resp => resp.json())
    .then(doggos => {
      // console.table(doggos)
      // console.log(doggos[0].name)
      doggos.forEach(makeDoggoSpan)
    })

  //show individual dog info  
  dogBar.addEventListener("click", e => {
    // console.dir(e.target)
    if (e.target.tagName === "SPAN") {
      const id = e.target.dataset.id
      fetch(`http://localhost:3000/pups/${id}`)
      .then(resp => resp.json())
      .then(showDoggoInfo) 
    }
  })

  //toggle good dog
  dogInfo.addEventListener("click", e => {
    if (e.target.dataset.action === "goodDog") {
      const id = e.target.dataset.id

      let update;
      if (e.target.innerText.includes("Good")){
        update = false
      } else {
        update = true
      }

      fetch(`http://localhost:3000/pups/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({isGoodDog: update})
      })
      .then(resp => resp.json())
      .then(doggo => {
        showDoggoInfo(doggo)
        if (filterButton.innerText.includes("ON")) {
          dogBar.innerHTML = "";
          fetch("http://localhost:3000/pups")
            .then(resp => resp.json())
            .then(doggos => {
              doggos.forEach(doggo => {
                if (doggo.isGoodDog) {
                  makeDoggoSpan(doggo)
                }
              })
            })
        }
      })
    }
  })

  //filter good dogs
  filterButton.addEventListener("click", () => {
    dogBarFilter();
  })

  function dogBarFilter() {
    if (filterButton.innerText.includes("ON")) {
      filterButton.innerText = "Filter good dogs: OFF";
      dogBar.innerHTML = "";
      fetch("http://localhost:3000/pups")
      .then(resp => resp.json())
      .then(doggos => {
        doggos.forEach(makeDoggoSpan)
    })
    } else {
      filterButton.innerText = "Filter good dogs: ON";
      dogBar.innerHTML = "";
      fetch("http://localhost:3000/pups")
        .then(resp => resp.json())
        .then(doggos => {
          doggos.forEach(doggo => {
            if (doggo.isGoodDog) {
              makeDoggoSpan(doggo)
            }
          })
        })
    }
  }


  function showDoggoInfo(doggo) {
    let goodDog;
    if (doggo.isGoodDog) {
      goodDog = "Good Dog!"
    } else {
      goodDog = "Bad Dog!"
    }

    dogInfo.innerHTML = `
    <div id="dog-info">
      <img src=${doggo.image}>
      <h2>${doggo.name}</h2>
      <button data-id="${doggo.id}" data-action="goodDog">${goodDog}</button>
    </div>
    `
  }

  function makeDoggoSpan(doggoObj) {
    dogBar.insertAdjacentHTML('beforeend', `
    <span data-id=${doggoObj.id}>${doggoObj.name}</span>
    `)
  }



})