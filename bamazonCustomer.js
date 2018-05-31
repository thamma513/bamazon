var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  user: "root",

  password: "root",
  database: "bamazon_db;"
});

function purchaseProd() {
    inquirer.prompt([
        {
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
        },
    ]).then(function(input) {

        var item = input.item_id;
        var quantity = input.quantity;

        connection.query(queryStr, {item_id: item}, function(err, data) {
            if (err) throw err;

            if (data.length === 0) {
                console.log("Error, Not a current product id. Enter a product id.")
                start();
            } else {
                var prodData = data[0];

                if (quantity <= prodData.stock_quantity)
            }
        })
    })
}


connection.connect(function(err) {
  if (err) throw err;
  
  start();
});

function start() {
    connection.query(queryStr, function(err, data) {
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