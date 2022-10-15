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

    });
}


function initSite() {
    loadProducts();
    // This would also be a good place to initialize other parts of the UI
}

let containerOfPhones = document.querySelector(".containerOfPhones");
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
            <h2>${product.price}</h2>
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
    customer.shoppingList.push(this.id);
    numberOfItemsInShoppingList = customer.shoppingList.length;
    window.localStorage.setItem('activeCustomer', JSON.stringify(customer));
    console.log(`Number of items in shopping list after adding to basket is: ${numberOfItemsInShoppingList}`);
    console.log(customer.shoppingList);
}


