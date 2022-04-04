// отправка формы
document.forms["userForm"].addEventListener("submit", e => {
    e.preventDefault();
    const form = document.forms["userForm"];
    const name = form.elements["name"].value;
    const password = form.elements["password"].value;
    console.log(name);
    console.log(password);
    signupJwt(name, password);
    //reset();
});

async function signupJwt(userLogin, userPassword) {
    // отправляет запрос и получаем ответ
    const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json"},
        body: JSON.stringify({
            login: userLogin,
            password: userPassword
        })
    });
    // если запрос прошел нормально
    if (response.ok === true) {
        // получаем данные
        const users = await response.json();

        console.log(users.token);

        localStorage.setItem('bearerToken', users.token);
        //alert( localStorage.getItem('bearerToken') );
        console.log(localStorage.getItem('bearerToken')); //


        console.log(users);

        console.log('ok signup');
    }
    // если запрос прошел неправильно
    else {

        console.log('Error signup');
    }
}


function signinPre() {
    
    const form = document.forms["userForm"];
    const name = form.elements["name"].value;
    const password = form.elements["password"].value;
    console.log(name);
    console.log(password);
    signin(name, password);
}

async function signin(userName, userPassword) {
    // отправляет запрос и получаем ответ
    const response = await fetch("/api/next", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json"},
        body: JSON.stringify({
            login: userName,
            password: userPassword
        })
    });
    // если запрос прошел нормально
    /*
    if (response.ok === true) {
        
        // получаем данные
        const user = await response.json();
        //let rows = document.querySelector("tbody");
        let TokenLabel = document.createElement('div');
        console.log(user.token);
        //document.cookie = "name=bearerToken; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
        //delete document.cookie['bearerToken'];
        //document.cookie = user.token;
        //alert(document.cookie);

        localStorage.setItem('bearerToken', user.token);
        //alert( localStorage.getItem('bearerToken') );

        console.log(user);
        */
       // если запрос прошел нормально
    if (response.ok === true) {
        // получаем данные
        const users = await response.json();

        console.log(users);

        console.log('ok signup');
    }
    // если запрос прошел неправильно
    else {

        console.log('Error signup');
    }
}


async function signup(userName, userPassword) {
    // отправляет запрос и получаем ответ
    const response = await fetch("/signup", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json"},
        body: JSON.stringify({
            name: userName,
            password: userPassword
        })
    });
    // если запрос прошел нормально
    if (response.ok === true) {
        // получаем данные
        const users = await response.json();


        console.log(users.token);

        localStorage.setItem('bearerToken', users.token);
        //alert( localStorage.getItem('bearerToken') );
        localStorage.getItem('bearerToken'); //

        console.log(users.token);

        console.log(users);
    }
    // если запрос прошел неправильно
    else {

        console.log('Error signup');
    }
}
//!!!!!
function Get1UserPre() {
    const form = document.forms["userForm"];
    const name = form.elements["name"].value;
    const password = form.elements["password"].value;
    console.log(name);
    console.log(password);
    Get1User(name, password);
}
// Получение пользователя
async function Get1User(userName, userPassword) {
    const response = await fetch("/useri", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json"},
        body: JSON.stringify({
            name: userName,
            password: userPassword
        })
    });
    // если запрос прошел нормально
    if (response.ok === true) {
        // получаем данные
        const users = await response.json();

        console.log(users);
    }
}
//

async function MeUsers() {
    // отправляет запрос и получаем ответ
    const response = await fetch("/me/" + localStorage.getItem('bearerToken'), {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    // если запрос прошел нормально
    if (response.ok === true) {
        // получаем данные
        const user = await response.json();
        //let rows = document.querySelector("tbody"); 

        let loginLabel = document.createElement('div');

        loginLabel.innerHTML = user.login;
        document.body.append(loginLabel);

        console.log(user);
    }
}

// Получение всех пользователей
async function GetUsers() {
    // отправляет запрос и получаем ответ
    const response = await fetch("/users", {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    // если запрос прошел нормально
    if (response.ok === true) {
        // получаем данные
        const users = await response.json();

        console.log(users);
    }
}

//!!!
//GetUsers();


function GetUserPre() {
    const form = document.forms["userForm"];
    const token = form.elements["token"].value;
    console.log(token);
    GetUser(token);
}

// Получение пользователя
async function GetUser(token) {
    // отправляет запрос и получаем ответ
    const response = await fetch("/users/" + token, {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    // если запрос прошел нормально
    if (response.ok === true) {
        // получаем данные
        const user = await response.json();
        //let rows = document.querySelector("tbody"); 
        console.log(user);
    } else {
        //const user = await response.json();
        console.log('error1');
    }
}


// отправка формы
/*
document.forms["userForm"].addEventListener("submit", e => {
    e.preventDefault();
    const form = document.forms["userForm"];
    const name = form.elements["name"].value;
    const password = form.elements["password"].value;
    console.log(name);
    console.log(password);
    signup(name, password);
    //reset();
});
*/


function reset(){
    const form = document.forms["userForm"];
    form.elements["name"].value = '';
    form.elements["password"].value = '';
}