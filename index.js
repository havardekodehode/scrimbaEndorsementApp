import {initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import {getDatabase,ref, push, onValue, remove, update} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {databaseURL: "https://endorsementapp-6e001-default-rtdb.europe-west1.firebasedatabase.app/"}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementsInDB = ref(database, "endorsements")

const endorsementSectionEl = document.getElementById("section")
const formEl = document.querySelector("form")






onValue(endorsementsInDB, function(snapshot){
    if(snapshot.exists()){
        let endorsementsArray = Object.entries(snapshot.val())
        // console.log(Object.keys(snapshot.val()));
        clearEndorsements(endorsementSectionEl)

        for (let i = 0; i < endorsementsArray.length; i++) {
            let endorsement = endorsementsArray[i]
            
            let endorsementText = endorsement[1].endorsementText
            let fromText = endorsement[1].fromAndTo.fromValue
            let toText =  endorsement[1].fromAndTo.toValue
            let likes = endorsement[1].likes
            let id = endorsement[0]

            addEndorsement(endorsementText, fromText, toText, likes, id)

            const likeButtonEl = document.getElementById(id)

            likeButtonEl.addEventListener("click", function() {
              
                let endorsementRef = ref(database,`endorsements/${id}`)
                let endorsementUpdatedLikes = {
                    likes: Number(likes)+1
                }
                update(endorsementRef,endorsementUpdatedLikes)
            })
        }
    }else{
        // ulEl.innerHTML = "No items yet"
    }
})

function clearEndorsements(endorsementsEl){
    endorsementsEl.innerHTML = ""
}


formEl.addEventListener("submit", event =>{
    event.preventDefault();

    let inputElements = formEl.querySelectorAll("input");

    let inputArray = []

    inputElements.forEach(function(input){
        if(input.value === "Publish"){
            // Do nothing
        }else{
            inputArray.push(input.value)
        }
    })
    let endorsementText = inputArray[0]
    let fromText = inputArray[1]
    let toText = inputArray[2]
    let likes = 0

    let endorsement = {
        endorsementText: endorsementText,
        fromAndTo:{
            fromValue: `${fromText}`, 
            toValue: `${toText}`
        },
        likes: likes
    }
    push(endorsementsInDB, endorsement)
    formEl.reset();
    
})

function addEndorsement(endorsement, from, to, likes, id){
    const div = document.createElement("div")
    div.innerHTML = `
    <div id="endorsement">
    <p id="to">${to}</p>
    <p id="endorsementText">${endorsement}</p>
    <div class="bottomPair">
        <p id="from">${from}</p>
        <p class="likes" id="${id}" ><button>&#9829;</button>${likes}</p>
    </div>
    `
    endorsementSectionEl.append(div)
}


let endorsement = {
    endorsementtext: "alsdøkfja",
    fromandTo:{From:"human",
                To: "ape"}
}




// likeButtonEl.addEventListener("click", function(){
//     console.log("ffff");
//     let endorsementId = this.id
//     let endorsementRef = this.database.ref("endorsements/" + endorsementId)
//     endorsementRef.update({
//         "likes":`${+1}`
//     })
// })

