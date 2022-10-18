var listOfProducts;
/** Get products from the json file and store it in a gobal variable */
function loadProducts() {
    fetch("./products.json")
    .then(function(response) {
        return response.json();
    })
    .then(function(products) {
        listOfProducts = products;
        addProductsToWebpage();
    });
}


function initSite() {
    loadProducts();
    // This would also be a good place to initialize other parts of the UI
}

let containerOfPhones = document.querySelector(".containerOfPhones");
/** Uses the loaded products data to create a visible product list on the website */
function addProductsToWebpage() {
}

console.log(containerOfPhones);
