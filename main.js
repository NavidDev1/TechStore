"use strict";
const navShoppingCartBtn =  document.querySelector("#shoppingcart");
let itemQuantity = document.querySelector(".item_quantity");

let containerOfPhones = document.querySelector(".containerOfPhones");
let tempUsername;
let addToShoppingCartBtns;
let shoppingList = [];
let numberOfItemsInShoppingList;
var listOfProducts;
let customer = {};
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
        tempUsername = (Math.floor(Math.random()*999999) + 1000000).toString();
        customer = {
            "username": tempUsername,
            "shoppingList": shoppingList,
            "password": "",
            "orders": [],

        }
        window.localStorage.setItem('activeCustomer', JSON.stringify(customer));
        window.localStorage.setItem("numberOfItems", itemQuantity.innerHTML);
    }
    itemQuantity.innerHTML = window.localStorage.getItem("numberOfItems");
    customer = JSON.parse(window.localStorage.getItem('activeCustomer'));
    itemQuantity.innerHTML = customer.shoppingList.length;
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
        btn.addEventListener("click", addToShoppingCart);
    }
}

function addToShoppingCart(){
    let phoneTitle = this.id; //no needed because we asign it to this.id instead?
    customer.shoppingList.push(listOfProducts[listOfProducts.findIndex(phoneTitleMatch, this.id)]);
    numberOfItemsInShoppingList = customer.shoppingList.length;

    itemQuantity.innerHTML = numberOfItemsInShoppingList;
    var holderOfItems =itemQuantity.innerHTML;
    window.localStorage.setItem("numberOfItems", holderOfItems);
    window.localStorage.setItem('activeCustomer', JSON.stringify(customer));
    console.log(`Number of items in shopping list after adding to basket is: ${numberOfItemsInShoppingList}`);
    console.log(customer.shoppingList);
    createUlFromShoppingCartList();
    displayOrders();
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

    removeFromShoppingCartBtns = document.getElementsByClassName("removeFromShoppingCartBtns") ;
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
                itemQuantity.innerHTML = window.localStorage.removeItem("numberOfItems");
               //customer = JSON.parse(window.localStorage.removeItem('activeCustomer'));
               //windows.localStorage.setItem(customer.username, JSON.stringify(customer))
               let totalSumString = totalCart();
               let order = {
                "items":customer.shoppingList,
                "totalPrice":totalSumString,
               }
               console.log("jag har körts");
               customer.orders.push(order);
               windows.localStorage.setItem("activeCustomer", JSON.stringify(customer))
            } 
          }) 
      });
    

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
    let title = item.title;
    let btnId = `btnRemove${title.split(" ").join("").toLowerCase()}`
    return `  
        <div class="cartItem">            
            <img src = "assets/${item.image}"></img>
            <h1>${item.title}</h1>
            <h2>${item.price} kr</h2>
            <button id=${btnId} class="removeFromShoppingCartBtns"><i class="fa-regular fa-trash-can <i class="fa-regular fa-distribute-spacing-horizontal"></i>Ta bort</button>
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



function totalCart (){
let array = [];    
for (const object of customer.shoppingList){
       array.push(object.price)
      
    }
    console.log(array)
    const totalValue = array.reduce((prev,next) => prev + next, 0);
    return "Totalt Pris:" + " " + totalValue + " " + "kr"
}


function displayOrders() {
  let date = new Date();
  let actualDate = date.toISOString();
  let totalSumString = totalCart();

  let order = {
    items: customer.shoppingList,
    totalPrice: totalSumString,
    date: actualDate,
  };
  customer.orders.push(order);
  window.localStorage.setItem("activeCustomer", JSON.stringify(customer));
  let container = document.querySelector("main");
  container.className = "orderPage";

  let orderList = [];
  for (const order of customer.orders) {
    for (const product of order.items) {
      let prod = {
        title: product.title,
        price: product.price,
        date: order.date,
      };
      orderList.push(prod);
    }
  }
 let orderUl = createUlFromList(orderList);
  
let page = document.querySelector("main");
page.replaceChildren(orderUl); 
  
 
}

function createUlFromList(list){
  let listUl = document.createElement('ul');
  for(const itemX of list){
      let item = document.createElement('li');
      item.innerHTML = createOrderDiv(itemX);
      listUl.appendChild(item);
  }
  return list;
}
function createOrderDiv(item){
    let title = item.title;
    let price = item.price;
    let date = item.date;
    return `  
    <div class="ofItems">
        <h1>Din order:</h1>
        <p>${title}</p>
        <p>${price}</p>
        <p>${date}</p>
    </div>
`;   
}


