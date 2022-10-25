"use strict";

const navShoppingCartBtn =  document.querySelector("#shoppingcart");
const userBtnE = document.getElementById("user");
let itemQuantity = document.querySelector(".item_quantity");

let containerOfPhones = document.querySelector(".containerOfPhones");
let customerId;
let addToShoppingCartBtns;
let shoppingList = [];
let numberOfItemsInShoppingList;
var listOfProducts;
let customer = {};


/** Get products from the json file and store it in a gobal variable */
function loadProducts() {
    fetch("./products.json")
    .then(function(response) {
        return response.json();
    })
    .then(function(products) {
        listOfProducts = products;
        addProductsToWebpage();
        addToShoppingCartBtns = document.getElementsByClassName("addToShoppingCartBtn");    
        addPutToShoppingCartBtnListners();
        navShoppingCartBtn.addEventListener("click", displayShoppingCart);
    });
}

function initSite() {
    loadProducts();
    // This would also be a good place to initialize other parts of the UI
    if (!window.localStorage.getItem('activeCustomer')){
        customerId = Math.floor(Math.random()*999999) + 1000000;
        customer = {
            "customerId": customerId,
            "shoppingList": shoppingList
        }
        window.localStorage.setItem('activeCustomer', JSON.stringify(customer));
        window.localStorage.setItem("numberOfItems", holderOfItems);
    }
    itemQuantity.innerHTML = window.localStorage.getItem("numberOfItems");
    customer = JSON.parse(window.localStorage.getItem('activeCustomer'));
    numberOfItemsInShoppingList = customer.shoppingList.length;
    console.log(`Number of items in shopping list is: ${numberOfItemsInShoppingList}`);
    
   
}


/** Uses the loaded products data to create a visible product list on the website */
function addProductsToWebpage() {
    
    /************let Output för att vi vill ange ett värde som vi sen ska deklarera in i vår main page (containerOfPhones)*********/
    let output = "";
    /************Vi loopar alla produkter från JSON********/
    for (const product of listOfProducts){
    /*****Vi anger += för att ge outputen flera värden då vi loopar så länge produkter finns*******/
    /******************BACKTICKS SÅ VI KAN SKRIVA HTMLKOD OCH LÄGGA IN VÅRA PRODUKTER I ELEMENTEN PÅ ETT SMIDIGT SÄTT****************************/
    let title = product.title
    let btnId = title.split(" ").join("").toLowerCase();
    output += `  
        <div class="ofItems">
            <h1>${product.title}</h1>
            <p>${product.description}</p>
            <img src = "assets/${product.image}"></img>
            <h2>${product.price} kr</h2>
            <button id=${btnId} class="addToShoppingCartBtn"><i class="fa-solid fa-cart-arrow-down"></i>Lägg till i kundvagnen</button>
        </div>
    `
    }
    /**************EFTER ATT LOOPEN HAR GÅTT IGENOM SÅ LÄGGER VI IN INFORMATIONEN I CONTAINER*********/
    containerOfPhones.innerHTML = output;    
}

function addPutToShoppingCartBtnListners(){
    for (const btn of addToShoppingCartBtns){
        btn.addEventListener("click", addToShoppingCart)
    }
}

function addToShoppingCart(){
    let phoneTitle = this.id;
    customer.shoppingList.push(listOfProducts[listOfProducts.findIndex(phoneTitleMatch, this.id)]);
    numberOfItemsInShoppingList = customer.shoppingList.length;

    itemQuantity.innerHTML = numberOfItemsInShoppingList;
    var holderOfItems =itemQuantity.innerHTML;
    window.localStorage.setItem("numberOfItems", holderOfItems);
    window.localStorage.setItem('activeCustomer', JSON.stringify(customer));
    console.log(`Number of items in shopping list after adding to basket is: ${numberOfItemsInShoppingList}`);
    console.log(customer.shoppingList);
    createUlFromShoppingCartList()
    
}

function displayShoppingCart(){
    let list = createUlFromShoppingCartList()
    containerOfPhones.replaceChildren(list);
    containerOfPhones.className = "containerOfShoppingCart";
}

function createUlFromShoppingCartList(){
    let list = document.createElement('ul');
    for(const phone of customer.shoppingList){
        let item = document.createElement('li');
        item.innerHTML = createItemsDiv(phone);
        list.appendChild(item);
    }
    return list;
}

function createItemsDiv(item){
    let title = item.title
    let btnId = `btnRemove${title.split(" ").join("").toLowerCase()}`
    return `  
        <div class="cartItem">            
            <img src = "assets/${item.image}"></img>
            <h1>${item.title}</h1>
            <h2>${item.price} kr</h2>
            <button id=${btnId} class="removeFromShoppingCartBtn"><i class="fa-regular fa-trash-can <i class="fa-regular fa-distribute-spacing-horizontal"></i>Ta bort</button>
        </div>
    `;   
}

function phoneTitleMatch(phone){
    return phone.title.split(" ").join("").toLowerCase() == this
}

userBtnE.addEventListener("click", ()=>{
    let mainE = document.querySelector("main");
    mainE.className = "login-container";
    changeModalToLoginView({loginF: loginForm, container: mainE});
    // mainE.className = "login-container";
    // mainE.innerHTML = `
    // <h1>Login</h1>
    //   <form id="my_form" action="javascript:void(0);">
    //       <input type="text" placeholder="Username" class="field" id="username" pattern="[A-Z,a-z,0-9]{1,10}">
    //       <div class="error_msg_box" id="e_name">"error message"</div>
    //       <input type="password" placeholder="Password" class="field" id="password" pattern="[A-Z,a-z,0-9]{1,10}"> 
    //       <div class="error_msg_box" id="e_pass">"error message"</div>             
    //       <button type="submit" value="Submit" class="btn" id="login_btn">Login</button>
    //       <button class="btn" id="new_user">New user</button>
    //   </from>`;
});

//// Login page //////////////////////////////////


const newUserForm = `<h1>New user</h1><form id="my_form" action="javascript:void(0);">
    <input type="text" placeholder="Choose username" id="c_username" class="field" pattern="[A-Z,a-z,0-9]{1,10}">
    <div class="error_msg_box" id="e_name">"error message"</div>
    <input type="password" placeholder="Choose password" id="c_password" class="field" pattern="[A-Z,a-z,0-9]{1,10}">
    <div class="error_msg_box" id="e_pass">"error message"</div>
    <button type="submit" value="Create user" id="createBtn" class="btn">Create user</button>
    </form>`;
const loginForm = `
<h1>Login</h1>
  <form id="my_form" action="javascript:void(0);">
      <input type="text" placeholder="Username" class="field" id="username" pattern="[A-Z,a-z,0-9]{1,10}">
      <div class="error_msg_box" id="e_name">"error message"</div>
      <input type="password" placeholder="Password" class="field" id="password" pattern="[A-Z,a-z,0-9]{1,10}"> 
      <div class="error_msg_box" id="e_pass">"error message"</div>             
      <button type="submit" value="Submit" class="btn" id="login_btn">Login</button>
      <button class="btn" id="new_user">New user</button>
  </from>`;
const navLogoutOption = `<div class="navbar_options">
        <div id="logout">Logout</div>
    </div>`;
const navLoginOption = `<div class="navbar_options">
        <div id="login">Login</div>
    </div>`;
const navCreateUserOption = `
<div class="navbar_options">
    <div id="nav_new_user">Create a new user</div>
</div>`;



const newUserBtn = document.getElementById("new_user");

const loginBtn = document.getElementById("login_btn");
const containerFormElement = document.querySelector(".container");
const formElement = document.getElementById("my_form");
const nameTakenMessage = "That user name is already taken!"
const nameErrorMessage = "Not a valid username! Valid characters are a-z, A-Z, 0-9 and 1 to 10 in size!"
const passErrorMessage = "Not a valid password! Valid characters are a-z, A-Z, 0-9 and 1 to 10 in size!"
const noUserFound = "Not user with that name is found!"
const wrongPass = "Worng password!"
const regexPattern = /^[a-z,A-Z,0-9]{1,10}$/;

let currentUser = window.localStorage.getItem("current_user");
let eNameE = document.getElementById("e_name");
let ePassE = document.getElementById("e_pass");

// for (const user of users) {
//   window.localStorage.setItem(user.username, JSON.stringify(user));
// }

if (currentUser) {
  //If we have a current in memory then we display the logged in view for the user
  let cu = JSON.parse(currentUser);
  changeNavbar(navLogoutOption);
  changeLoginModalToLoggedInUser(cu, containerFormElement);

  logOutBtn = document.getElementById("logout");
  logOutBtn.addEventListener("click", logOutUser);
}

function changeModal(newOption, modal = containerFormElement) {
  modal.innerHTML = newOption;
}

function changeLoginModalToLoggedInUser(currentUser, loginM = containerFormElement) {
  /**
   * Changes the login modal to the welcome user view
   */

  const loggedInUserH1 = `<h1>Welcome ${currentUser.username}</h1>`;
  loginM.innerHTML = loggedInUserH1;
}

function changeNavbar(newOption = navLogoutOption, nav = navbarElement) {
  /**
   * Changes the navbar to different views/options
   */

  nav.innerHTML = newOption;
}
// pointer="", loginF=loginForm, container=containerFormElement, navLoginOpt=navCreateUserOption
function logOutUser() {
  /**
   * Logs out user by removing them from local storage memory and displaying the login modal
   */
  window.localStorage.removeItem("current_user");
  changeModalToLoginView();
}
function hidden(element){
  element.style.animationName = "hidden";
}

function changeModalToLoginView({pointer = "", loginF = loginForm, container = containerFormElement}) {

  changeModal(loginF, container);
  const newUserBtn2 = document.getElementById("new_user");
  const navNewUserBtn2 = document.getElementById("nav_new_user");
  const loginBtn2 = document.getElementById("login_btn");
  newUserBtn2.addEventListener("click", changeModalToNewUser);
  navNewUserBtn2.addEventListener("click", changeModalToNewUser);
  loginBtn2.addEventListener("click", login);
}

function createUser() {
  const cuserNameE = document.getElementById("c_username");
  const cPasswordE = document.getElementById("c_password");
  const cUsername = cuserNameE.value;
  const cPassword = cPasswordE.value;

  let eNameE = document.getElementById("e_name");
  let ePassE = document.getElementById("e_pass");


  let validUsername = regexPattern.test(cUsername);
  let validPassword = regexPattern.test(cPassword);
  let freeUsername = window.localStorage.getItem(cUsername) ? false : true;

  if (!validUsername) {
    eNameE.textContent = nameErrorMessage;
    console.log("this was printed");
    eNameE.style.animationName = "show";
    cuserNameE.addEventListener("change", function(){ return hidden(eNameE); });
  }
  if (!validPassword){
    ePassE.textContent = passErrorMessage;
    ePassE.style.animationName = "show";
    cPasswordE.addEventListener("change", function(){ return hidden(ePassE); });
  }
  if (!freeUsername){
    eNameE.textContent = nameTakenMessage;
    eNameE.style.animationName = "show";
    cPasswordE.addEventListener("change", function(){ return hidden(eNameE); });
  }
  if (validUsername && validPassword && freeUsername) {
    const newUser = {
      username: cUsername,
      password: cPassword,
    };
    window.localStorage.setItem(newUser.username, JSON.stringify(newUser));
    window.localStorage.setItem("current_user", JSON.stringify(newUser));
    const newUserForm = document.getElementById("my_form");
    changeLoginModalToLoggedInUser(newUser, containerFormElement, newUserForm);
    changeNavbar();
    logOutBtn = document.getElementById("logout");
    logOutBtn.addEventListener("click", logOutUser);
  }
}

function login() {
  const inputUsernameElement = document.getElementById("username");
  const inputPasswordElement = document.getElementById("password");
  let inputUsername = inputUsernameElement.value;
  let inputPassword = inputPasswordElement.value;

  let usernameSave = regexPattern.test(inputUsername);
  let passwordSave = regexPattern.test(inputPassword);

  eNameE.textContent = nameErrorMessage;
  ePassE.textContent = passErrorMessage;

  if (!usernameSave) {
    eNameE.textContent = nameErrorMessage;
    eNameE.style.animationName = "show";
    inputUsernameElement.addEventListener("change", function(){ return hidden(eNameE); });
  }
  else if (!window.localStorage.getItem(inputUsername)){
    eNameE.textContent = noUserFound;
    eNameE.style.animationName = "show";
    inputUsernameElement.addEventListener("change", function(){ return hidden(eNameE); });
  }

  if (!passwordSave) {
    ePassE.textContent = passErrorMessage;
    if(!ePassE.style.animationName=="show") ePassE.style.animationName = "show";
    ePassE.style.animationName = "show";
    inputPasswordElement.addEventListener("change", function(){ return hidden(ePassE); });
  }
  
  let foundUser = window.localStorage.getItem(inputUsername);
  let userObject = JSON.parse(foundUser);
  let correctPass = userObject.password == inputPassword;

  if (!correctPass) {
    ePassE.textContent = wrongPass;
    ePassE.style.animationName = "show";
    inputPasswordElement.addEventListener("change", function(){ return hidden(ePassE); });
    return;
  }

  window.localStorage.setItem("current_user", JSON.stringify(userObject));

  changeLoginModalToLoggedInUser(userObject);
  changeNavbar();

  logOutBtn = document.getElementById("logout");
  logOutBtn.addEventListener("click", logOutUser);
}

function changeModalToNewUser() {
  let navbar = document.querySelector("nav");
  changeNavbar(navLoginOption, navbar);

  containerFormElement.innerHTML = newUserForm;

  const navLoginBtn = document.getElementById("login");
  navOptionElement = document.querySelector(".navbar_options");

  navLoginBtn.addEventListener("click", changeModalToLoginView);

  const creatBtn = document.getElementById("createBtn");
  creatBtn.addEventListener("click", createUser);
}

// loginBtn.addEventListener("click", login);
// newUserBtn.addEventListener("click", changeModalToNewUser);
// navNewUserBtn.addEventListener("click", changeModalToNewUser);
