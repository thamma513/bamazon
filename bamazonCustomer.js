var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    user: "root",

    password: "root",
    database: "bamazon_db;"
});

function validateInput(value) {
    var integer = Number.isInteger(parseFloat(value));
    var sign = Math.sign(value);

    if (integer && (sign === 1)) {
        return true;
    } else {
        return 'Please enter a whole non-zero number.';
    }
}


function purchaseProd() {

    inquirer.prompt([{
            type: "input",
            name: "item_id",
            message: "Enter the ID of the item you would like to purchase.",
            validate: validateInput,
            filter: Number
        },
        {
            type: "input",
            name: "quantity",
            message: "Quantity for purchase:",
            validate: validateInput,
            filter: Number
        }
    ]).then(function (input) {

        var item = input.item_id;
        var quantity = input.quantity;

        var queryStr = 'SELECT * FROM products WHERE ?';

        connection.query(queryStr, {
            item_id: item
        }, function (err, data) {
            if (err) throw err;

            if (data.length === 0) {
                console.log("Error, Not a current product id. Enter a product id.");
                start();

            } else {
                var productData = data[0];

                if (quantity <= product.quantity) {
                    console.log("The requested product is in stock, placing your order...");

                    var updateQueryStr = "UPDATE products SET quantity = " + (productData.quantity - quantity);

                    connection.query(updateQueryStr, function (err, data) {
                        if (err) throw err;

                        console.log('Your total is $' + productData.price * quantity);
                        console.log('Please come back to see us soon!');
                        console.log("\n-------------------------------------------------------------------\n");

                        // End the database connection
                        connection.end();

                    })

                } else {
                    console.log('We are currently out of stock for the requested item.');
                    console.log('Pick a product in stock.');
                    console.log("\n-----------------------------------------------------------------\n");

                    start();
                }
            }
        })
    })
}


function start() {

    queryStr = "SELECT * FROM products";
    
    connection.query(queryStr, function (err, data) {
        if (err) throw err;

        console.log('Current Product Inventory: ');
        console.log('.............................................\n');

        var prodList = '';
        for (var i = 0; i < data.length; i++) {
            prodList = '';
            prodList += 'Item ID: ' + data[i].item_id + '  //  ';
            prodList += 'Product Name: ' + data[i].product_name + '  //  ';
            prodList += 'Department: ' + data[i].department_name + '  //  ';
            prodList += 'Price: $' + data[i].price + '\n';

            console.log(prodList);
        }

        console.log("---------------------------------------------------------------------\n");

        //Prompt the user for item/quantity they would like to purchase
        purchaseProd();
    })
}

function runApp() {

    start();


}
runApp();