"use strict";
import LoginPage from "./login.js";
import SignUpPage from "./sign_up_page.js";

const navShoppingCartBtn = document.querySelector("#shoppingcart");
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
let confirmPurchase;
let totalSum;

const fieldValidator = {
  isValidInputFormat(inputValue) {
    return /^[a-z,A-Z,0-9]{1,10}$/.test(inputValue);
  },
};
const elementHider = {
  hideElement(element) {
    element.style.animationName = "hidden";
  },
};
const elementGetterErrorDivUsername = {
  getErrorDivForNameFieldE() {
    return document.getElementById("e_name");
  },
};
const elementGetterErrorDivPassword = {
  getErrorDivForPassFieldE() {
    return document.getElementById("e_pass");
  },
};
const displayerOfNotValidInputErrorMsg = {
  displayNotValidInputErrorMsg(errorDiv, errorMsg, inputField) {
    errorDiv.innerText = errorMsg;
    errorDiv.style.animationName = "show";
    inputField.addEventListener("change", () => this.hideElement(errorDiv));
  },
};
const customerObjectGetter = {
  getCustomerObject(name) {
    return window.localStorage.getItem(name)
      ? JSON.parse(window.localStorage.getItem(name))
      : null;
  },
};
const customerChecker = {
  isCustomer(customerName) {
    return window.localStorage.getItem(customerName) ? true : false;
  },
};
const mainElementGetter = {
  getMainE() {
    return document.querySelector("main");
  },
};

Object.assign(LoginPage.prototype, fieldValidator);
Object.assign(LoginPage.prototype, elementHider);
Object.assign(LoginPage.prototype, elementGetterErrorDivUsername);
Object.assign(LoginPage.prototype, elementGetterErrorDivPassword);
Object.assign(LoginPage.prototype, displayerOfNotValidInputErrorMsg);
Object.assign(LoginPage.prototype, customerObjectGetter);
Object.assign(LoginPage.prototype, customerChecker);
Object.assign(LoginPage.prototype, mainElementGetter);

Object.assign(SignUpPage.prototype, fieldValidator);
Object.assign(SignUpPage.prototype, elementHider);
Object.assign(SignUpPage.prototype, elementGetterErrorDivUsername);
Object.assign(SignUpPage.prototype, elementGetterErrorDivPassword);
Object.assign(SignUpPage.prototype, displayerOfNotValidInputErrorMsg);
Object.assign(SignUpPage.prototype, customerObjectGetter);
Object.assign(SignUpPage.prototype, customerChecker);
Object.assign(SignUpPage.prototype, mainElementGetter);

/** Get products from the json file and store it in a gobal variable */
function loadProducts() {
  fetch("./products.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (products) {
      listOfProducts = products;
      productsLoaded = true;
      productsLoadedResolve();
    });
}

function initSite() {
  loadProducts();
  waitForPoductsLoaded()
    .then(addProductsToWebpage)
    .then(addPutToShoppingCartBtnListners)
    .then(navShoppingCartBtn.addEventListener("click", displayShoppingCart));

  if (!window.localStorage.getItem("activeCustomer")) {
    createNewActiveCustomer();
  }
  customer = JSON.parse(window.localStorage.getItem("activeCustomer"));
  displayQuantityOfShoppingCartItems();
}

window.initSite = initSite;

async function waitForPoductsLoaded() {
  if (!productsLoaded) {
    await new Promise((resolve) => {
      productsLoadedResolve = resolve;
    });
  }
}

function createNewActiveCustomer() {
  let tempUsername;
  let freeUsername = false;
  while (!freeUsername) {
    tempUsername = Math.floor(Math.random() * 999999) + 1000000;
    setTimeout(20);
    freeUsername = window.localStorage.getItem(tempUsername) ? false : true;
  }

  customer = {
    username: tempUsername,
    password: "",
    shoppingList: shoppingList,
    orders: [],
  };
  window.localStorage.setItem("activeCustomer", JSON.stringify(customer));
}

let createDivsContainingItemsFromList = (list = listOfProducts) => {
  /** Uses the loaded products data to create a visible product list on the website */

  /************let Output f??r att vi vill ange ett v??rde som vi sen ska deklarera in i v??r main page (containerOfPhones)*********/
  let output = "";
  /************Vi loopar alla produkter fr??n JSON********/
  for (const product of list) {
    /*****Vi anger += f??r att ge outputen flera v??rden d?? vi loopar s?? l??nge produkter finns*******/
    /******************BACKTICKS S?? VI KAN SKRIVA HTMLKOD OCH L??GGA IN V??RA PRODUKTER I ELEMENTEN P?? ETT SMIDIGT S??TT****************************/
    let title = product.title;
    let btnId = title.split(" ").join("").toLowerCase();
    output += `  
        <div class="ofItems">
            <h1>${product.title}</h1>
            <p>${product.description}</p>
            <img src = "assets/${product.image}"></img>
            <h2>${product.price} kr</h2>
            <button id=${btnId} class="addToShoppingCartBtn"><i class="fa-solid fa-cart-arrow-down"></i>L??gg till i kundvagnen</button>
        </div>
    `;
  }
  return output;
};

function addProductsToWebpage(container = containerOfPhones) {
  /** Adds divs created with the products in the products.json, into the a container */
  container.innerHTML = createDivsContainingItemsFromList();
  container.className = "containerOfPhones";
}

function addPutToShoppingCartBtnListners() {
  /**Helper function to add eventlistners to all add to shopping cart btns */
  addToShoppingCartBtns = document.getElementsByClassName(
    "addToShoppingCartBtn"
  );
  for (const btn of addToShoppingCartBtns) {
    btn.addEventListener("click", addToShoppingCart);
  }
}

function addToShoppingCart() {
  /**Adds the correct item from the listOfProcuts to the customers shopping list when the customers clicks on add item to shopping list*/
  let cust = JSON.parse(window.localStorage.getItem("activeCustomer"));
  cust.shoppingList.push(
    listOfProducts[listOfProducts.findIndex(phoneTitleMatch, this.id)]
  );

  itemQuantity.innerHTML = cust.shoppingList.length;
  window.localStorage.setItem("activeCustomer", JSON.stringify(cust));
  window.localStorage.setItem(cust.username, JSON.stringify(cust));
}

function displayShoppingCart() {
  /**Renders shopping cart to the main contianer */
  let list = createUlFromShoppingCartList();
  containerOfPhones.replaceChildren(list);
  containerOfPhones.className = "containerOfShoppingCart";

  let headerofcart = document.createElement("h1");
  headerofcart.className = "cartHeader";
  headerofcart.innerHTML = '<i class="fa-solid fa-cart-shopping"></i> Kundvagn';
  list.insertAdjacentElement("beforebegin", headerofcart);

  confirmPurchase = document.createElement("button");
  confirmPurchase.className = "confirmBtn";
  confirmPurchase.innerHTML =
    '<i class="fa-solid fa-check"></i> Slutf??r ditt k??p';
  list.insertAdjacentElement("afterend", confirmPurchase);

  totalSum = document.createElement("p");
  totalSum.className = "totalSum";
  totalSum.innerHTML = totalCart();
  list.insertAdjacentElement("afterend", totalSum);

  removeItemFromShoppingCartListner();

  confirmPurchase.addEventListener("click", () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Ditt k??p lyckades!",
      showConfirmButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        displayOrders();
        let aCustomer = JSON.parse(localStorage.getItem("activeCustomer"));
        aCustomer.shoppingList = [];
        if (localStorage.getItem(aCustomer.username)) {
          localStorage.setItem(aCustomer.username, JSON.stringify(aCustomer));
        }
        localStorage.setItem("activeCustomer", JSON.stringify(aCustomer));
        displayQuantityOfShoppingCartItems();
      }
    });
  });
}

function createUlFromShoppingCartList() {
  let cust = JSON.parse(window.localStorage.getItem("activeCustomer"));
  let list = document.createElement("ul");
  for (const phone of cust.shoppingList) {
    let item = document.createElement("li");
    item.innerHTML = createItemsDiv(phone);
    list.appendChild(item);
  }
  return list;
}

function createItemsDiv(item) {
  let title = item.title;
  let btnId = title.split(" ").join("").toLowerCase();
  return `  
        <div class="cartItem">            
            <img src = "assets/${item.image}"></img>
            <h1>${item.title}</h1>
            <h2>${item.price} kr</h2>
            <button id=${btnId} class="removeFromShoppingCartBtn"><i class="fa-regular fa-trash-can <i class="fa-regular fa-distribute-spacing-horizontal"></i>Ta bort</button>
        </div>
    `;
}

function phoneTitleMatch(phone) {
  return phone.title.split(" ").join("").toLowerCase() == this;
}

function removeItemFromShoppingCartListner() {
  removeFromShoppingCartBtns = document.getElementsByClassName(
    "removeFromShoppingCartBtn"
  );
  for (const btn of removeFromShoppingCartBtns) {
    btn.addEventListener("click", removeItemFromShoppingCart);
  }
}

function removeItemFromShoppingCart() {
  let cust = JSON.parse(window.localStorage.getItem("activeCustomer"));
  var holder = cust.shoppingList.findIndex(phoneTitleMatch, this.id);

  cust.shoppingList.splice(holder, 1);
  localStorage.setItem("activeCustomer", JSON.stringify(cust));
  localStorage.setItem("numberOfItems", cust.shoppingList.length);
  itemQuantity.innerHTML = cust.shoppingList.length;
  displayShoppingCart();
}

function displayQuantityOfShoppingCartItems() {
  let aCust = JSON.parse(window.localStorage.getItem("activeCustomer"));
  itemQuantity.innerHTML = aCust ? aCust.shoppingList.length : 0;
  console.log(
    `Number of items in customer shopping list is: ${aCust.shoppingList.length}`
  );
  console.log(
    `Number of items in activeCustomer shopping list is: ${aCust.shoppingList.length}`
  );
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

userBtnE.addEventListener("click", ({ lp = loginPage }) => {
  let mainE = document.querySelector("main");
  mainE.className = "login-container";
  lp.renderLoginPage();

  const newUserBtn2 = document.getElementById("new_user");
  const loginBtn2 = document.getElementById("login_btn");
  newUserBtn2.addEventListener("click", changeModalToNewUser);
  loginBtn2.addEventListener("click", login);
});

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
  /**Create a new user and ads it to local storage as new user and active customer*/
  let signUpPage = new SignUpPage();
  const userCreated = signUpPage.createUser();
  if (!userCreated) {
    return;
  }
  const loginContainerE = document.querySelector(".login-container");
  addProductsToWebpage(loginContainerE);
  addPutToShoppingCartBtnListners();
  displayQuantityOfShoppingCartItems();
}

function login({ lp = loginPage }) {
  /**Logs in user by adding them to local storage as active customer*/

  const userIsLoggedIn = lp.loginUser();
  if (!userIsLoggedIn) {
    return;
  }
  customer = JSON.parse(window.localStorage.getItem("activeCustomer"));
  if (confirm("Vill du se dina tidigare k??p?") == true) {
    displayOrders();
  } else {
    renderShoppingPage();
  }
}
let renderShoppingPage = () => {
  /**Render the shopping page*/
  addProductsToWebpage();
  displayQuantityOfShoppingCartItems();
  addToShoppingCartBtns = document.getElementsByClassName(
    "addToShoppingCartBtn"
  );
  addPutToShoppingCartBtnListners();
};

function changeModalToNewUser({ sup = signUpPage }) {
  sup.renderSignUpPage();

  const navShoppingCartBtn = document.getElementById("shoppingcart");
  navShoppingCartBtn.addEventListener("click", displayShoppingCart);

  const navLoginOpt = document.getElementById("user");
  navLoginOpt.addEventListener("click", changeModalToLoginView);

  const createUserBtn = document.getElementById("createBtn");
  createUserBtn.addEventListener("click", createUser);
}

function displayOrders() {
  let aCustomer = JSON.parse(window.localStorage.getItem("activeCustomer"));
  let container = document.querySelector("main");

  let date = new Date().toISOString().split('T', 1)[0];
  let totalSumString = totalCart();
  let output = "";
  let order = {
    items: aCustomer.shoppingList,
    totalPrice: totalSumString,
    date: date,
  };

  let orderList = [];
  let orderItemList = [];

  aCustomer.orders.push(order);

  window.localStorage.setItem("activeCustomer", JSON.stringify(aCustomer));

  let listOfOrdItems = document.createElement("ul");
  var TotalOrderString = document.createElement("h1");
  TotalOrderString.innerText = "Din order:";
  listOfOrdItems.appendChild(TotalOrderString);
  for (const order of aCustomer.orders) {
    // let prod = {}
    for (const product of order.items) {
      let prod = {
        title: product.title,
        price: product.price,
        date: order.date,
      };
      orderItemList.push(prod);
    }
    let orderL = {
      orderDate: order.date,
      items: orderItemList,
      total: order.totalPrice
    }
    orderList.push(orderL)
  }
  console.log({orderItemList}) //telefoner i per order
  console.log({orderList}) //Order listan
  let id = 1;
  for (const odr of orderList) {
    output = `
      <div class="ofItems">
        <h1>Order:${id}</h1>
        <p>${odr.total}</p>
        <p>${odr.orderDate}</p>
      </div>`;
    let order = document.createElement("li");
    order.innerHTML = output;
    listOfOrdItems.appendChild(order);
    id++;
  }
  container.replaceChildren(listOfOrdItems);
  container.className = "orderPage";
}
