import {createEventFormHTML, createEventDOMHTML, createEventEditHTML} from "./createEventHTML.js"
import {delBtnListener, editBtnListener, saveBtnListener, saveEditBtnListener} from "./eventListeners"
// create funtion that makes HTML snippet to add events to DOM
// being called in addEventsToDOM()

const eventsDOMElement = ( eventData) => {
    let newHTML = document.createElement("article")
    let editEventBtn = document.createElement("button")
    let delEventBtn = document.createElement("button")
    editEventBtn.setAttribute("id", `edit-${eventData.id}`)
    delEventBtn.setAttribute("id", `del-${eventData.id}`)
    editEventBtn.innerHTML = "Edit Event"
    delEventBtn.innerHTML = "Delete Event"
    delBtnListener(delEventBtn)
    editBtnListener(editEventBtn)
    newHTML.setAttribute("id", `event-user:${eventData.userId}`)
    newHTML.innerHTML = createEventDOMHTML(eventData)
    newHTML.appendChild(delEventBtn)
    newHTML.appendChild(editEventBtn)
    return newHTML
}

const eventFormElement = () => {
    let eventFormSection = document.createElement("section")
    let savBtn = document.createElement("button")
    let id = +sessionStorage.getItem("userId")
    eventFormSection.setAttribute("id", "event-form")
    eventFormSection.innerHTML = createEventFormHTML(id)
    savBtn.setAttribute("id", "create-event")
    savBtn.innerHTML = "Save Event"
    saveBtnListener(savBtn)
    eventFormSection.appendChild(savBtn)
    return eventFormSection
}

// This makes the edit form and takes the arguments of the event id and the previously
// inputed values

const eventEditElement = (name, date, time, location, eventId) => {
    let eventEditSection = document.createElement("section")
    let savEditBtn = document.createElement("button")
    let id = +sessionStorage.getItem("userId")
    eventEditSection.setAttribute("id", "event-edit")
    eventEditSection.innerHTML = createEventEditHTML(id, name, date, time, location)
    savEditBtn.setAttribute("id", `${eventId}`)
    savEditBtn.innerHTML = "Update Event"
    saveEditBtnListener(savEditBtn)
    eventEditSection.appendChild(savEditBtn)
    return eventEditSection
}

// created a function that adds userEvents to the DOM also created delete and edi buttons IF we get there
//being called in addEventToDB()

const addEventElementToDOM = (dataObj) => {
    let eventLog = document.querySelector("#event-div")
    let newEventHTML = eventsDOMElement(dataObj)
    eventLog.appendChild(newEventHTML)
    return eventLog
}

// This takes an array of objects and creates them into the HTML that will be added to the DOM.
// Only events the current user created will have "delete" and "edit" buttons

const createEventListElements = (obj, currId) => {
    addEventElementToDOM(obj)
    // this removes the edit and delete buttons on all events that are not created by the
    // current user
    if (obj.userId !== currId) {
        document.querySelector(`#del-${obj.id}`).remove()
        document.querySelector(`#edit-${obj.id}`).remove()
    }
}
export {eventFormElement, addEventElementToDOM, eventEditElement, createEventListElements}