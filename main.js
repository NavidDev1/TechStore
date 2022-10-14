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

/** Uses the loaded products data to create a visible product list on the website */
function addProductsToWebpage() {
    let containerOfItems = document.querySelector(".classOfContainers");
    let output = "";
    output += `
        <div class="ofItems">
            <h1>${listOfProducts[0].title}</h1>
            <p>${listOfProducts[0].image}</p>

        </div>
    `
    containerOfItems.innerHTML = output;
}