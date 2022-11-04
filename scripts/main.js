"use strict";
import LoginPage from "./login.js"
import SignUpPage from "./sign_up_page.js";


const navShoppingCartBtn =  document.querySelector("#shoppingcart");
const userBtnE = document.getElementById("user");
const mainE = document.querySelector("main");
let loginPage = new LoginPage();
let signUpPage = new SignUpPage();
let itemQuantity = document.querySelector(".item_quantity");
let containerOfPhones = document.querySelector(".containerOfPhones");
let addToShoppingCartBtns;
let shoppingList = [];
var listOfProducts;
let customer = {};
let productsLoaded = false;
let productsLoadedResolve;
let removeFromShoppingCartBtns;
let headerofcart;
let confirmPurchase;
let totalSum;
let confirmPurchaseBtn;
let popUp;



/** Get products from the json file and store it in a gobal variable */
function loadProducts() {
    fetch("./products.json")
    .then(function(response) {
        return response.json();
    })
    .then(function(products) {
        listOfProducts = products;
        productsLoaded = true; 
        productsLoadedResolve();       
    })
}

function initSite() {
    loadProducts();
    waitForPoductsLoaded().then(addProductsToWebpage);
    
    if (!window.localStorage.getItem('activeCustomer')){
      createNewActiveCustomer();
    }
    customer = JSON.parse(window.localStorage.getItem('activeCustomer'));  
    displayQuantityOfShoppingCartItems(); 
}

window.initSite = initSite;

async function waitForPoductsLoaded(){
  if(!productsLoaded){
    await new Promise((resolve) => {
      productsLoadedResolve = resolve;
    })
  }
}

function createNewActiveCustomer() {
  let tempUsername;
    let freeUsername = false;
    while(!freeUsername){
      tempUsername = Math.floor(Math.random()*999999) + 1000000;
      setTimeout(20);
      freeUsername = window.localStorage.getItem(tempUsername)? false : true;
    }

    customer = {            
        "username": tempUsername,
        "password": cPassword,
        "shoppingList": shoppingList,
        "orders": []
    }
    window.localStorage.setItem('activeCustomer', JSON.stringify(customer));
}

/** Uses the loaded products data to create a visible product list on the website */
function addProductsToWebpage(container=containerOfPhones) {
    
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
    container.innerHTML = output;
    container.className = "containerOfPhones"; 

    addToShoppingCartBtns = document.getElementsByClassName("addToShoppingCartBtn");    
    addPutToShoppingCartBtnListners();
    navShoppingCartBtn.addEventListener("click", displayShoppingCart);
}

function addPutToShoppingCartBtnListners(){
    for (const btn of addToShoppingCartBtns){
        btn.addEventListener("click", addToShoppingCart)
    }
}

function addToShoppingCart(){
    let cust = JSON.parse(window.localStorage.getItem("activeCustomer"));
    cust.shoppingList.push(listOfProducts[listOfProducts.findIndex(phoneTitleMatch, this.id)]);

    itemQuantity.innerHTML = cust.shoppingList.length;
    window.localStorage.setItem('activeCustomer', JSON.stringify(cust));
    window.localStorage.setItem(cust.username, JSON.stringify(cust));
    console.log(`cust.shoppingList.lenght: ${cust.shoppingList.length}`);    
}

function displayShoppingCart(){
    let list = createUlFromShoppingCartList()
    containerOfPhones.replaceChildren(list);
    containerOfPhones.className = "containerOfShoppingCart";

    let headerofcart = document.createElement("h1");
    headerofcart.className = "cartHeader"
    headerofcart.innerHTML = `<i class="fa-solid fa-cart-shopping"></i>` + "Kundvagn" ;
    list.insertAdjacentElement("beforebegin", headerofcart);

    confirmPurchase = document.createElement("button")
    confirmPurchase.className = "confirmBtn"
    confirmPurchase.innerHTML = `<i class="fa-solid fa-check"></i>` + " " + "Slutför ditt köp"
    list.insertAdjacentElement("afterend", confirmPurchase)
    
    totalSum = document.createElement("p")
    totalSum.className = "totalSum"
    totalSum.innerHTML = totalCart ()
    list.insertAdjacentElement("afterend", totalSum)

    removeFromShoppingCartBtns = document.getElementsByClassName("removeFromShoppingCartBtn");
    removeItemFromShoppingCartListner();

    confirmPurchase.addEventListener("click", () => {
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Ditt köp lyckades!",
            showConfirmButton: true,
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "index.html";
            } 
          }) 
      });
}

function createUlFromShoppingCartList(){
    let cust = JSON.parse(window.localStorage.getItem("activeCustomer"));
    let list = document.createElement('ul');
    for(const phone of cust.shoppingList){
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

function removeItemFromShoppingCartListner(){
  for (const btn of removeFromShoppingCartBtns){
      btn.addEventListener("click", removeItemFromShoppingCart);
  }
}

function removeItemFromShoppingCart(){
  var holder = customer.shoppingList.findIndex(phoneTitleMatch, this.id);
  
  customer.shoppingList.splice(holder,1);
  localStorage.setItem("activeCustomer", JSON.stringify(customer));
  localStorage.setItem("numberOfItems", customer.shoppingList.length);
  itemQuantity.innerHTML = customer.shoppingList.length;
  displayShoppingCart();
}

function displayQuantityOfShoppingCartItems(){
  itemQuantity.innerHTML = window.localStorage.getItem("activeCustomer") ? JSON.parse(window.localStorage.getItem("activeCustomer")).shoppingList.length : 0;
  console.log(`Number of items in customer shopping list is: ${customer.shoppingList.length}`);
  console.log(`Number of items in activeCustomer shopping list is: ${JSON.parse(window.localStorage.getItem("activeCustomer")).shoppingList.length}`);
}

function totalCart() {
  let aCust = JSON.parse(window.localStorage.getItem("activeCustomer"));
  let array = [];
  for (const object of aCust.shoppingList) {
    array.push(object.price);
  }
  console.log(array);
  const totalValue = array.reduce((prev, next) => prev + next, 0);
  return "Totalt Pris:" + " " + totalValue + " " + "kr";
}

// Get to the Login Page

userBtnE.addEventListener("click", ({lp=loginPage})=>{
    let mainE = document.querySelector("main");
    mainE.className = "login-container";
    lp.renderLoginPage();
    
    const newUserBtn2 = document.getElementById("new_user");
    const loginBtn2 = document.getElementById("login_btn");
    newUserBtn2.addEventListener("click", changeModalToNewUser);    
    loginBtn2.addEventListener("click", login);
});

//Bild av Adrien Olichon: https://www.pexels.com/sv-se/foto/svartvitt-konst-monster-design-3137058/

function changeModal(newOption, modal = mainE) {
  modal.innerHTML = newOption;
}

function changeModalToLoginView(loginF, container) {

  changeModal(loginF, container);
  const newUserBtn2 = document.getElementById("new_user");
  const loginBtn2 = document.getElementById("login_btn");
  newUserBtn2.addEventListener("click", changeModalToNewUser);
  loginBtn2.addEventListener("click", login);
}

function createUser() {
  /**
   * Create a new user and ads it to local storage as new user and active customer
   *
   */
  let signUpPage = new SignUpPage();
  signUpPage.createUser();
  const loginContainerE = document.querySelector(".login-container");
  addProductsToWebpage(loginContainerE);
  addPutToShoppingCartBtnListners();
  displayQuantityOfShoppingCartItems();  
}

function login({lp=loginPage}) {
  /**
   * Logs in user by adding them to local storage as active customer
   *
   */

  lp.loginUser();
  customer = JSON.parse(window.localStorage.getItem("activeCustomer"));
  if(confirm("Vill du se dina tidigare köp?") == true){
    console.log("Byt denna text mot en funktion för att visa tidigare kör");
  }
  else{
    renderShoppingPage();
}
}
let renderShoppingPage = () => {
  /**
   * Render the shopping page
   *
   */
   addProductsToWebpage();
   displayQuantityOfShoppingCartItems();
   addToShoppingCartBtns = document.getElementsByClassName(
     "addToShoppingCartBtn"
   );
   addPutToShoppingCartBtnListners();
}

function changeModalToNewUser({sup = signUpPage}) {
  sup.renderSignUpPage();

  const navShoppingCartBtn = document.getElementById("shoppingcart");
  navShoppingCartBtn.addEventListener("click", displayShoppingCart);

  const navLoginOpt = document.getElementById("user");
  navLoginOpt.addEventListener("click", changeModalToLoginView);

  const createUserBtn = document.getElementById("createBtn");
  createUserBtn.addEventListener("click", createUser);
}
