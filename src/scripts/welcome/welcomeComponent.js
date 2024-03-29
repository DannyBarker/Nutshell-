import { API } from "../api";
import { mainEntryToDom } from "../mainEntryToDom";
import { createDashboard,createNav } from "../mainComponent";
import { populateDom } from "../main.js"

const domContainer = document.querySelector("#dashboard-container")

function welcomeComponent() {
    let welcomeDiv =  document.createElement("div")
    welcomeDiv.setAttribute("id", "welcome-div")
    let welcomeHeader = document.createElement("h1")
    welcomeHeader.setAttribute("id", "welcome-header")
    let registerHeader = document.createElement("h3")
    registerHeader.setAttribute("id", "registerHeader")
    let registerButton = document.createElement("button")
    registerButton.setAttribute("id", "reg-btn")
    welcomeHeader.textContent = "Welcome to Nutshell!"
    registerHeader.textContent = "Please register"
    registerButton.textContent = "Click Here To Register"
    registerButton.addEventListener("click", event => {
        document.getElementById("reg-btn").style.visibility = "hidden"
        if (document.querySelector("#login-form")) {
            document.getElementById("lgn-btn").style.visibility = "visible"
            document.querySelector("#login-form").remove()
        }
        domContainer.appendChild(registerFormComponent())
    })
    let loginButton = document.createElement("button")
    loginButton.setAttribute("id", "lgn-btn")
    loginButton.textContent = "Log In"
    loginButton.addEventListener("click", () => {
        document.getElementById("lgn-btn").style.visibility = "hidden"
        document.getElementById("registerHeader").style.visibility = "hidden"
        if (document.querySelector("#register-form")) {
            document.getElementById("reg-btn").style.visibility = "visible"
            document.querySelector("#register-form").remove()
        }
        domContainer.appendChild(loginFormComponent())
    })
    welcomeDiv.appendChild(welcomeHeader)
    welcomeDiv.appendChild(registerHeader)
    welcomeDiv.appendChild(registerButton)
    welcomeDiv.appendChild(loginButton)
    return welcomeDiv
}
const storage = ( userData, createdData) => {
    userData.forEach( user => {
        if (user.username === createdData.username) {
            sessionStorage.setItem("userId", user.id)
            let userID = sessionStorage.getItem("userId")
            console.log("userID: ", userID);
        }


    });
}
const loginValidation = (userData, username, password) => {
    let wrongUsers = ""
    userData.forEach( user => {
        if (user.username === username && user.password === password) {
            wrongUsers = "true"
            domContainer.innerHTML = ""
            sessionStorage.setItem("userId", user.id)
            let loginID = sessionStorage.getItem("userId")
            mainEntryToDom(createNav(), createDashboard())
            populateDom()


        }
    });
    return wrongUsers
}

const registerValidation = (newUser, newEmail, newPassword) => {
    let usernameStr = newUser.toLowerCase()
    let emailStr = newEmail.toLowerCase()
    console.log("usernameStr: ", usernameStr);
    console.log("emailStr: ", emailStr);
    let TFstr = true
    API.getData("users").then(data => {
        data.forEach ( userData => {
            let userNameLC = userData.username
            let emailLC = userData.email
            if (userNameLC.toLowerCase() === usernameStr || emailLC.toLowerCase() === emailStr) {
                TFstr = false
            }
        });
        if (TFstr) {
            let createdUser = createNewUser(newUser, newEmail, newPassword)
            API.addData("users", createdUser)
            .then(() => {
                API.getData("users").then( newData => storage(newData, createdUser))
                domContainer.innerHTML = ""
                mainEntryToDom(createNav(), createDashboard())
                populateDom()

            })
        } else {
            alert("Username/email is already taken!")
        }
    })
}

function registerFormComponent() {
    let registerDiv = document.createElement("form")
    registerDiv.setAttribute("id", "register-form")
    let userName = document.createElement("input")
    userName.setAttribute("class", "form-control")
    userName.setAttribute("type", "text")
    userName.setAttribute("name", "user-name")
    userName.setAttribute("id", "user-name")
    let email = document.createElement("input")
    email.setAttribute("class", "form-control")
    email.setAttribute("type", "text")
    email.setAttribute("name", "email")
    email.setAttribute("id", "email")
    let password = document.createElement("input")
    password.setAttribute("class", "form-control")
    password.setAttribute("type", "text")
    password.setAttribute("name", "password")
    password.setAttribute("id", "password")
    let labelUserName = document.createElement("label")
    labelUserName.textContent = "User Name"
    let labelEmail = document.createElement("label")
    labelEmail.textContent = "Email"
    let labelPassword = document.createElement("label")
    labelPassword.textContent = "Password"
    let fieldsetUserName = document.createElement("fieldset")
    let fieldsetEmail = document.createElement("fieldset")
    let fieldsetPassword = document.createElement("fieldset")
    let regSubmitBtn = document.createElement("button")
    regSubmitBtn.setAttribute("id", "reg-submit-btn")
    regSubmitBtn.textContent = "Submit"
    regSubmitBtn.addEventListener("click", event => {

        event.preventDefault()
        let newUser = userName.value
        let newEmail = email.value
        let newPassword = password.value
        if (newUser && newEmail && newPassword){
            registerValidation(newUser, newEmail, newPassword)

        }
        else{
            alert("Please fill out all fields!")
        }

    })
    fieldsetUserName.appendChild(labelUserName)
    fieldsetUserName.appendChild(userName)
    fieldsetEmail.appendChild(labelEmail)
    fieldsetEmail.appendChild(email)
    fieldsetPassword.appendChild(labelPassword)
    fieldsetPassword.appendChild(password)
    registerDiv.appendChild(fieldsetUserName)
    registerDiv.appendChild(fieldsetEmail)
    registerDiv.appendChild(fieldsetPassword)
    registerDiv.appendChild(regSubmitBtn)
    return registerDiv
}

const loginFormComponent = () => {
    let loginForm = document.createElement("form")
    loginForm.setAttribute("id", "login-form")
    let loginFieldset = document.createElement("fieldset")
    let loginLegend = document.createElement("legend")
    loginLegend.setAttribute("id", "lgn-legend")
    loginLegend.textContent = "Log In Here:"
    let userNameInput = document.createElement("input")
    userNameInput.setAttribute("class", "form-control")
    userNameInput.setAttribute("placeholder", "Username:")
    userNameInput.setAttribute("type", "text")
    userNameInput.setAttribute("name", "user-name-login")
    userNameInput.setAttribute("id", "user-name-login")
    let passwordInput = document.createElement("input")
    passwordInput.setAttribute("class", "form-control")
    passwordInput.setAttribute("placeholder", "Password:")
    passwordInput.setAttribute("type", "text")
    passwordInput.setAttribute("name", "password-login")
    passwordInput.setAttribute("id", "password-login")
    let submitLoginBtn = document.createElement("button")
    submitLoginBtn.textContent = "Log In"
    submitLoginBtn.addEventListener("click", () => {
        event.preventDefault()
        let usrnmValue = userNameInput.value
        let pswdValue = passwordInput.value
        API.getData("users").then( newData => {
            let userString = loginValidation(newData, usrnmValue, pswdValue)
            if (userString === "" ) {
                alert("Username and Password do not match!")
            }
        })
    })
    loginFieldset.appendChild(loginLegend)
    loginFieldset.appendChild(userNameInput)
    loginFieldset.appendChild(passwordInput)
    loginFieldset.appendChild(submitLoginBtn)
    loginForm.appendChild(loginFieldset)
    return loginForm
}

function createNewUser(username, email, password){
    return {
        username,
        email,
        password
    }
}

export {welcomeComponent}