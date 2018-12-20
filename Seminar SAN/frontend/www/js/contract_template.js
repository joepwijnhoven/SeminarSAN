/*
 * MetaMask will inject a web3.js component automatically
 * It will inject web3 version 0.2.x, which is documented at:
 * https://github.com/ethereum/wiki/wiki/JavaScript-API
 */

if (typeof web3 == "undefined") {
  console.error("No web3 detected. Make sure to use a browser which injects web3, such as the Brave browser.");
} else {
  console.log("web3 version", web3.version.api);
}

const deployedAddress = '0x3e643c4edd02cf80779373602fbe620add1dbdec';

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
          "type": "uint256"
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
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "ID",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "Cook",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "Title",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "Description",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "Where",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "When",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "Price",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "Capacity",
          "type": "uint256"
        }
      ],
      "name": "newMeal",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "ID",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "Title",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "Description",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "Where",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "Capacity",
          "type": "uint256"
        }
      ],
      "name": "updatedMeal",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "MealID",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "Eater",
          "type": "address"
        }
      ],
      "name": "reservation",
      "type": "event"
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
          "name": "Cook",
          "type": "address"
        },
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
          "type": "uint256"
        },
        {
          "name": "Eaters",
          "type": "address[]"
        },
        {
          "name": "confirmedEaters",
          "type": "address[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getNumberOfMeals",
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
          "type": "uint256"
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
          "type": "uint256"
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
        },
        {
          "name": "secretHash",
          "type": "bytes32"
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
      "inputs": [
        {
          "name": "foodId",
          "type": "uint256"
        },
        {
          "name": "eater",
          "type": "address"
        },
        {
          "name": "secret",
          "type": "string"
        }
      ],
      "name": "unlockReservation",
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

/* only for QR codes
function generateQRCodeString(foodId, eaterAddress, secret) {
  return foodId.toString() + eaterAddress.substring(1) + secret;
}

function decodeQRCode(code) {
  return {
    id: code.split("x")[0],
    eater: "0" + code.substr(code.indexOf("x"), 41),
    secret: code.substr(code.indexOf("x") + 41)
  };
}*/

function randomNumberToUTF16AlphaNumerical(a) {
    if (a < 10) {
        return a + 48;
    } else if (a < 36) {
        return a + 55;
    } else if (a < 62) {
        return a + 61;
    } else {
        return randomNumberToUTF16AlphaNumerical(a%62);
    }
}

/*
 * WIP
 */
async function gasEstimation(functionName, arguments, cb) {
  var func = functionName + "(";
  for (type in arguments) {
    func += type + ",";
  }
  func += ")";
  func = func.replace(/,\)/gi, ")");
  var data = web3.eth.abi.encodeFunctionSignature(func);

  for (arg in arguments) {
    data += web3.eth.abi.encodeParameter(arg, arguments[arg]).substring(2);
  }

  web3.eth.estimateGas({
      from: web3.eth.accounts[0], 
      data: data,
      to: deployedAddress
  }, function(err, estimatedGas) {
    if (err) console.log(err);
    cb(err, estimatedGas);
  });
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
    cache.set("account", "N/A");
    cache.set("balance", "N/A");
  }

  // set up event listeners
  //* TODO always receives last event on subscription?
  var contract = web3.eth.contract(deployedAbi);
  var contractInstance = contract.at(deployedAddress);

  var eventListener = contractInstance.allEvents();
  eventListener.watch(function(error, event) {
    // just update the meals cache whenever an event arrives
    console.log(event);
    getMeals();
    // TODO maybe some more fine-grained updating?
    // balance could also have been updated after an event, update accordingly
    web3.eth.getBalance(web3.eth.defaultAccount, function(err, result) {
      cache.set("balance", web3.fromWei(result.toString()));
    });
  });
  //*/
}

/*
 * Retreive from the smart contract the list of upcoming meals.
 * Use cache.set("meals", ...) to notify the UI about the retreived meals. 
 */

async function getMeals() {
  var contract = web3.eth.contract(deployedAbi);
  var contractInstance = contract.at(deployedAddress);

  // clearing cache before fetching meals; TODO probably want to do some smart caching here...
  cache.set("meals", []);

  contractInstance.getNumberOfMeals(async function(err, result) {

    var tempMeals = [];

    for (let i = 0; i < result.toNumber(); i++) {
      //push every meal onto the view (do something about order?)
      var mealResult = await promisify(contractInstance.getMeal, i);
      var meal = {};
      meal.id = i;
      meal.cook = mealResult[0];
      meal.title = mealResult[1];
      meal.description = mealResult[2];
      meal.place = mealResult[3];
      meal.time = mealResult[4].toNumber();
      meal.price = mealResult[5].toNumber();
      meal.capacity = mealResult[6].toNumber();
      meal.reservations = mealResult[7];
      meal.confirmedReservations = mealResult[8];
      // add the new meal to the meals cache, sorting the list by date 
      // - for future meals put soon-est first
      // - for past meals, put latest first
      // - put future meals before past meals
      // TODO is this ok? Maybe also sort on availability ("available capacity")
      tempMeals.push(meal);
    }

    tempMeals.sort(function (a, b) {
      var now = new Date().getTime();
      var aTime = a.time;
      var bTime = b.time;
      if (aTime > now && bTime > now) { // both in the future
        return aTime - bTime; // soon-est first (smallest timestamp)
      } else { // either both in the past, or one in future and other in past
        return bTime - aTime; // latest first and future over past (largest timestamp)
      }
    });

    cache.set("meals", tempMeals);
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
      var mealResult = result;
      var meal = {};
      meal.id = id;
      meal.cook = mealResult[0];
      meal.title = mealResult[1];
      meal.description = mealResult[2];
      meal.place = mealResult[3];
      meal.time = mealResult[4].toNumber();
      meal.price = mealResult[5].toNumber();
      meal.capacity = mealResult[6].toNumber();
      meal.reservations = mealResult[7];
      meal.confirmedReservations = mealResult[8];
      cache.set("meal", meal);
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
  var contract = web3.eth.contract(deployedAbi);
  var contractInstance = contract.at(deployedAddress);

  contractInstance.updateMeal(id, data.title, data.description, data.place, data.capacity, {
    from: web3.eth.accounts[0],
    gas: 1000000
  }, function(err, result) {
      console.log(result);
  });
}

/*
 * Reserve a meal with the given id.
 */

async function reserve(id) {
  var contract = web3.eth.contract(deployedAbi);
  var contractInstance = contract.at(deployedAddress);

  // assumes meal is in cache! Can we do this?
  var reservingMeal = cache.get("meals").find(meal => meal.id == id);

  // generate client secret
  var cryptoValues = new Uint8Array(10); // how long?
  crypto.getRandomValues(cryptoValues); // generate crypto-secure values
  // string-concatenate for generating crypto-secure string
  var secret = "";
  for (value of cryptoValues) { 
    secret = secret + String.fromCharCode(randomNumberToUTF16AlphaNumerical(value)); //convert numbers to characters
  }

  console.log("secret:", secret);
  localStorage.setItem(id, secret);

  // generate keccak256-hash of secret for storing on blockchain
  var secretHash = web3.sha3(secret);
  console.log("secretHash:", secretHash);

  // TODO remove locally stored secret when Cook confirms reservation
  // TODO QR-code display and sending GUI for confirming transfer to cook
  // TODO GUI for withdrawing reservation

  contractInstance.reserve(id, secretHash, {
    from: web3.eth.accounts[0],
    gas: 1000000,
    value: reservingMeal.price
  }, function(error, result) {
    if (error) {
      console.error(error);
    }
    console.log(result);
  });
}

/*
 * Cancel reservation for meal with given id.
 */

async function cancelReservation(id) {
  var contract = web3.eth.contract(deployedAbi);
  var contractInstance = contract.at(deployedAddress);

  var secret = localStorage.getItem(id);

  contractInstance.unlockReservation(id, web3.eth.accounts[0], secret, function(error, result) {
    if (error) {
      console.error(error);
    }
    localStorage.removeItem(id);
    console.log(result);
  });
}

/*
 * Confirm eater and receive reservation funds
 */

async function confirmReservation(id, eater, secret) {
  var contract = web3.eth.contract(deployedAbi);
  var contractInstance = contract.at(deployedAddress);

  contractInstance.unlockReservation(id, eater, secret, function(error, result) {
    if (error) {
      console.error(error);
    }
    console.log(result);
  });
}