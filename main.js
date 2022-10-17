const phones = {
	iphonex: 0,
	oneplus5: 1,
	galaxys8: 2,
	lgv30: 3
};
const navShoppingCartBtn =  document.querySelector("#shoppingcart");

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
    }
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
            <button id=${btnId} class="addToShoppingCartBtn">Lägg till i kundvagnen</button>
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
    switch (this.id) {
        case "iphonex":
            customer.shoppingList.push(listOfProducts[phones.iphonex]);
            break;
        case "oneplus5":
            customer.shoppingList.push(listOfProducts[phones.oneplus5]);
            break;
        case "galaxys8":
            customer.shoppingList.push(listOfProducts[phones.galaxys8]);
            break;
        case "lgv30":
            customer.shoppingList.push(listOfProducts[phones.lgv30]);
            break;    
        default:
            console.log("No such product found to add to the shopping list!");
            break;
    }
    numberOfItemsInShoppingList = customer.shoppingList.length;
    window.localStorage.setItem('activeCustomer', JSON.stringify(customer));
    console.log(`Number of items in shopping list after adding to basket is: ${numberOfItemsInShoppingList}`);
    console.log(customer.shoppingList);
}

function displayShoppingCart(){
    let list = createUlFromShoppingCartList()
    containerOfPhones.replaceChildren(list);
    containerOfPhones.className = "containerOfShoppingCart";
}

function createUlFromShoppingCartList(){
    let list = document.createElement('ul');
    for(const phone of customer.shoppingList){
        item = document.createElement('li');
        item.innerHTML = createItemsDiv(phone);
        list.appendChild(item);
    }
    console.log(list);
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
            <button id=${btnId} class="removeFromShoppingCartBtn">Ta bort</button>
        </div>
    `;   
}
console.log(navShoppingCartBtn)
navShoppingCartBtn.addEventListener("click",function(){
    createUlFromShoppingCartList()
})
