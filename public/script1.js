// отправка формы
document.forms["userForm"].addEventListener("submit", e => {
    e.preventDefault();
    const form = document.forms["userForm"];
    const login = form.elements["login"].value;
    const password = form.elements["password"].value;
    console.log(login);
    console.log(password);
    signupJwt(login, password);
    //reset();
});

async function signupJwt(userLogin, userPassword) {
    // отправляет запрос и получаем ответ
    const response = await fetch("/signup", {
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
    const login = form.elements["login"].value;
    const password = form.elements["password"].value;
    console.log(login);
    console.log(password);
    signin(login, password);
}

async function signin(userLogin, userPassword) {
    // отправляет запрос и получаем ответ
    const response = await fetch("/signin", {
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
        // set token in cookie
        document.cookie = `token=${users.token}`;
        console.log(users);

        console.log('ok signup');
    }
    // если запрос прошел неправильно
    else {
        console.log('Error signup');
    }
}


async function MeUsers() {
    // отправляет запрос и получаем ответ
    const response = await fetch("/me/", {
        method: "GET",
        headers: { "Accept": "application/json", 
                    "Authorization": "Bearer" + document.cookie}
    });
    // если запрос прошел нормально
    if (response.ok === true) {
        console.log('me user ok');
        // получаем данные
        const user = await response.json();
        //let rows = document.querySelector("tbody"); 

        let loginLabel = document.createElement('div');

        loginLabel.innerHTML = user.login;
        document.body.append(loginLabel);

        console.log(user);
    }
    else {

        console.log('Error me');
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
    else {

        console.log('Error users');
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
    form.elements["login"].value = '';
    form.elements["password"].value = '';
}