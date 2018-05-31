var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    user: "root",

    password: "root",
    database: "bamazon_db"
});

// connection.connect(function() {
//     if (err){throw (err)};
//     start();
// })

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
            name: "id",
            message: "Enter the ID of the item you would like to purchase.",
            validate: validateInput,
            filter: Number
        },
        {
            type: "input",
            name: "stock_quantity",
            message: "Quantity for purchase:",
            validate: validateInput,
            filter: Number
        }
    ]).then(function (input) {

        var item = input.id;
        var stock_quantity = input.stock_quantity;

        var queryStr = 'SELECT * FROM products WHERE ?';

        connection.query(queryStr, {
            id: item
        }, function (err, res) {
            if (err) throw err;

            if (res.length === 0) {
                console.log("Error, Not a current product id. Enter a product id.");
                start();

            } else {
                var products = res[0];

                if (stock_quantity <= products.stock_quantity) {
                    console.log("The requested product is in stock, placing your order...");

                    var updateQueryStr = "UPDATE products SET stock_quantity = " + (products.stock_quantity - input.stock_quantity);

                    connection.query(updateQueryStr, function (err, res) {
                        if (err) throw err;

                        console.log('Your total is $' + products.price * stock_quantity);
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

    var queryStr = "SELECT id, product_name, department_name, stock_quantity, price FROM products";
    
    connection.query(queryStr, function (err, res) {
        if (err) throw err;

        console.log('Current Product Inventory: ');
        console.log('.............................................\n');

        var prodList = '';
        for (var i = 0; i < res.length; i++) {
            prodList = '';
            prodList += 'Item ID: ' + res[i].id + '  //  ';
            prodList += 'Product Name: ' + res[i].product_name + '  //  ';
            prodList += 'Department: ' + res[i].department_name + '  //  ';
            prodList += 'Quantity: ' + res[i].stock_quantity + ' // ';
            prodList += 'Price: $' + res[i].price + '\n';

            console.log(prodList);
        }

        console.log("---------------------------------------------------------------------\n");

        //Prompt the user for item/stock_quantity they would like to purchase
        purchaseProd();
    })
}

function runApp() {

    start();


}
runApp();