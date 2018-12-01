/*
 * MetaMask will inject a web3.js component automatically
 * It will inject web3 version 0.2.x, which is documented at:
 * https://github.com/ethereum/wiki/wiki/JavaScript-API
 */

if (typeof web3 == "undefined") {
  console.error("No web3 detected. Make sure to use a browser which injects web3, such as teh Brave browser.");
} else {
  console.log("web3 version", web3.version.api);
}

const deployedAddress = '0x3e643c4edd02cf80779373602fbe620add1dbdec';//'0xd05d7165e493191b5ebc0e20926fda1bfc911fc2';

const deployedAbi = [
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "availableMeals",
      "outputs": [
        {
          "name": "Title",
          "type": "string"
        },
        {
          "name": "Description",
          "type": "string"
        },
        {
          "name": "Where",
          "type": "string"
        },
        {
          "name": "When",
          "type": "uint256"
        },
        {
          "name": "Price",
          "type": "uint256"
        },
        {
          "name": "Capacity",
          "type": "uint8"
        },
        {
          "name": "Cook",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "getMeal",
      "outputs": [
        {
          "name": "Title",
          "type": "string"
        },
        {
          "name": "Description",
          "type": "string"
        },
        {
          "name": "Where",
          "type": "string"
        },
        {
          "name": "When",
          "type": "uint256"
        },
        {
          "name": "Price",
          "type": "uint256"
        },
        {
          "name": "Capacity",
          "type": "uint8"
        },
        {
          "name": "Reserved",
          "type": "uint8"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getNumbeOfMeals",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "t",
          "type": "string"
        },
        {
          "name": "d",
          "type": "string"
        },
        {
          "name": "wr",
          "type": "string"
        },
        {
          "name": "wn",
          "type": "uint256"
        },
        {
          "name": "p",
          "type": "uint256"
        },
        {
          "name": "c",
          "type": "uint8"
        }
      ],
      "name": "createMeal",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "id",
          "type": "uint256"
        },
        {
          "name": "t",
          "type": "string"
        },
        {
          "name": "d",
          "type": "string"
        },
        {
          "name": "wr",
          "type": "string"
        },
        {
          "name": "c",
          "type": "uint8"
        }
      ],
      "name": "updateMeal",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "reserve",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "withdraw",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];


/*
 * Utility functions, which may be useful.
 */

function getJSON(url) { 
  return new Promise(function (resolve, reject) {
    $.getJSON(url, function( data ) {
      resolve(data);
    })
    .catch(function (err) {
      reject(err.statusText);
    });
  });
}

function promisify(f, ...a) {
  var that = this;
  return new Promise(function (resolve, reject) {
    f.apply(that, a.concat(function (err, result) {
      if (err) { reject(err); return; };

      resolve(result);
    }))
  })
}

/*
 * Initialize the app:
 * - Set appName (using cache.set("appName", ...)) to a string that will be displayed in the top left corner.
 * - Set currency (using cache.set("currency", ...)) to a string that will be displayed next to the prices.
 * - Set showAddBalance (using cache.set("showAddBalance", ...)) to a boolean stating whether to show the "Add Balance" button or not.
 * - Set account (using cache.set("account", ...)) to the currently logged in wallet account.
 * - Set balance (using cache.set("balance", ...)) to the balance of the currently logged in wallet account.
 */

function init() {
  cache.set("appName", "Lunch Box");
  cache.set("currency", "ETH");
  cache.set("showAddBalance", false);
  if(web3.eth.accounts.length > 0) {
    cache.set("account", web3.eth.defaultAccount);
    web3.eth.getBalance(web3.eth.defaultAccount, function(err, result) {
      cache.set("balance", web3.fromWei(result.toString()));
    })
  } else {
    cache.set("account", "0x123");
    cache.set("balance", "7.5");
  }
}

/*
 * Retreive from the smart contract the list of upcoming meals.
 * Use cache.set("meals", ...) to notify the UI about the retreived meals. 
 */

async function getMeals() {
  var contract = web3.eth.contract(deployedAbi);
  var contractInstance = contract.at(deployedAddress);
  console.log(contractInstance);
  contractInstance.getNumberOfMeals(function(err, result) {
    for (i = 0; i < result.getFixed(); i++) {
      //push every meal onto the view (do something about order?)
      getMeal(i, function(error, result) {
        var meal = result;
        meal.id = i;
        cache.set("meals", cache.get("meals").push(meal));
      });
    }
  });
  //console.log(contractInstance.availableMeals.getData([0,1]));
}

/*
 * Retreive from the smart contract the details about the meal with a given id.
 * Use cache.set("meal", ...) to notify the UI about the retreived meal.
 *
 * Arguments:
 *
 * - id (string): id of the meal that is to be updated
 */

async function getMeal(id) {
    var contract = web3.eth.contract(deployedAbi);
    var contractInstance = contract.at(deployedAddress);

    contractInstance.getMeal(id, function(err, result) {
        console.log(result);
    });
}

/*
 * Create in the smart contract a new meal advertisement.
 *
 * Arguments:
 *
 * - data (object): object containing the following fields:
 *
 *     time (integer): UNIX timestamp (UTC), in milliseconds
 *     price (integer): price for the meal, in wads
 *     title (string): short description of the meal
 *     description (string): longer description of the meal
 *     place (string): where the meal will be served
 *     capacity (integer): number of meals to be served
 */

function createMeal(data) {
  var contract = web3.eth.contract(deployedAbi);
  var contractInstance = contract.at(deployedAddress);
  
  // what should be the gas amount???
  contractInstance.createMeal(data.title, data.description, data.place, data.time, data.price, data.capacity, {
    from: web3.eth.accounts[0],
    gas: 1000000
  }, function(err, result) {
      console.log(result);
  });
}

/*
 * Update in the smart contract the information about a meal.
 *
 * Arguments:
 *
 * - id (string): id of the meal that is to be updated
 * - data (object): object containing the following fields:
 *
 *     title (string): short description of the meal
 *     description (string): longer description of the meal
 *     place (string): where the meal will be served
 *     capacity (integer): number of meals to be served
 */

function changeMeal(id, data) {
}

/*
 * Reserve a meal with the given id.
 */

async function reserve(id) {
}
