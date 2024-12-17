/* Landing Page JavaScript */

"use strict";

const loginForm = document.querySelector("#login");
const signupForm = document.querySelector("#signupForm");

loginForm.onsubmit = function (event) {
    // Prevent the form from refreshing the page,
    // as it will do by default when the Submit event is triggered:
    event.preventDefault();

    // We can use loginForm.username (for example) to access
    // the input element in the form which has the ID of "username".
    const loginData = {
        username: loginForm.username.value,
        password: loginForm.password.value,
    }

    // Disables the button after the form has been submitted already:
    loginForm.loginButton.disabled = true;

    // Time to actually process the login using the function from auth.js!
    login(loginData);
};

signupForm.onsubmit = function (event) {
    // Prevent the form from refreshing the page,
    // as it will do by default when the Submit event is triggered:
    event.preventDefault();

    // We can use loginForm.username (for example) to access
    // the input element in the form which has the ID of "username".
    const signupData = {
        username: signupForm.username.value,
        fullName: signupForm.fullName.value,
        password: signupForm.password.value
    }

    // Disables the button after the form has been submitted already:
    //signupForm.loginButton.disabled = true;

    // Time to actually process the login using the function from auth.js!
    signUp(signupData);
};


function signUp(signupData) {
    // options = {
    //     username: '',
    //     fullName: '',
    //     password: ''
    // }
    const options = { 
        method: "POST",
        headers: {
            // This header specifies the type of content we're sending.
            // This is required for endpoints expecting us to send
            // JSON data.
            "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
    };
    return fetch(apiBaseURL + "/api/users", options)
        .then(response => response.json())
        .then(loginData => {
            if (loginData.message === "Invalid username or password") {
                console.error(loginData)
                // Here is where you might want to add an error notification 
                // or other visible indicator to the page so that the user is  
                // informed that they have entered the wrong login info.
                return null
            }

            window.localStorage.setItem("signup-data", JSON.stringify(loginData));
            window.location.assign("index.html");  // redirect

            return loginData;
        });
}