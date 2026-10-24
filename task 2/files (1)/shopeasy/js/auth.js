/* ==========================================
   auth.js
   Simple login/register system using Local Storage
   NOTE: This is just for a college project.
   Passwords are stored in plain text in local storage,
   which is NOT safe for a real website, but is fine
   for learning purposes here.
   ========================================== */

// get list of registered users (array of {name, email, password})
function getUsers() {
    var data = localStorage.getItem("users");
    if (data === null) {
        return [];
    }
    return JSON.parse(data);
}

function saveUsers(usersArray) {
    localStorage.setItem("users", JSON.stringify(usersArray));
}

/* -------------------------------------------
   REGISTER PAGE
   ------------------------------------------- */
function handleRegister(event) {
    event.preventDefault();

    var name = document.getElementById("regName").value.trim();
    var email = document.getElementById("regEmail").value.trim();
    var password = document.getElementById("regPassword").value.trim();
    var msgBox = document.getElementById("registerMsg");

    if (name === "" || email === "" || password === "") {
        msgBox.innerText = "Please fill all the fields.";
        msgBox.className = "form-msg error-msg";
        return;
    }

    if (password.length < 4) {
        msgBox.innerText = "Password should be at least 4 characters.";
        msgBox.className = "form-msg error-msg";
        return;
    }

    var users = getUsers();

    // check if email is already registered
    for (var i = 0; i < users.length; i++) {
        if (users[i].email === email) {
            msgBox.innerText = "An account with this email already exists.";
            msgBox.className = "form-msg error-msg";
            return;
        }
    }

    // save new user
    users.push({ name: name, email: email, password: password });
    saveUsers(users);

    msgBox.innerText = "Registration successful! Redirecting to login...";
    msgBox.className = "form-msg success-msg";

    // wait a second, then send them to the login page
    setTimeout(function () {
        window.location.href = "login.html";
    }, 1200);
}

/* -------------------------------------------
   LOGIN PAGE
   ------------------------------------------- */
function handleLogin(event) {
    event.preventDefault();

    var email = document.getElementById("loginEmail").value.trim();
    var password = document.getElementById("loginPassword").value.trim();
    var msgBox = document.getElementById("loginMsg");

    var users = getUsers();
    var foundUser = null;

    for (var i = 0; i < users.length; i++) {
        if (users[i].email === email && users[i].password === password) {
            foundUser = users[i];
            break;
        }
    }

    if (foundUser === null) {
        msgBox.innerText = "Incorrect email or password.";
        msgBox.className = "form-msg error-msg";
        return;
    }

    // save logged in user (without password) so navbar can show their name
    localStorage.setItem("currentUser", JSON.stringify({ name: foundUser.name, email: foundUser.email }));

    msgBox.innerText = "Login successful! Redirecting...";
    msgBox.className = "form-msg success-msg";

    setTimeout(function () {
        window.location.href = "index.html";
    }, 1000);
}

// logs the user out and sends them back to the home page
function handleLogout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

// returns the currently logged in user, or null if nobody is logged in
function getCurrentUser() {
    var data = localStorage.getItem("currentUser");
    if (data === null) {
        return null;
    }
    return JSON.parse(data);
}

// changes the navbar to show "Login/Register" or "Hi, name! / Logout"
function updateNavAuthLinks() {
    var authBox = document.getElementById("navAuthLinks");
    if (!authBox) return;

    var user = getCurrentUser();

    if (user === null) {
        authBox.innerHTML =
            "<li><a href='login.html'>Login</a></li>" +
            "<li><a href='register.html'>Register</a></li>";
    } else {
        authBox.innerHTML =
            "<li>Hi, " + user.name + "</li>" +
            "<li><a href='#' onclick='handleLogout()'>Logout</a></li>";
    }
}

// used on checkout.html to make sure only logged in users can checkout
function requireLogin() {
    var user = getCurrentUser();
    if (user === null) {
        alert("Please login first to continue with checkout.");
        window.location.href = "login.html";
    }
}