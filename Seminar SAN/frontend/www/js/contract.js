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

var now = (new Date()).getTime();
var _meals = {
  "a1": {
    cook: "0x123",
    title: "Delicious curry",
    description: "Rice, curry with chicken and nuts. Very spicy!!!",
    time: now,
    place: "MF14",
    price: 4.50,
    reservations: ['0x2'],
    capacity: 5
  },
  "a2": {
    cook: "0x1",
    title: "Sandwiches",
    description: "An assortment of sandwiches, with ham, chese and vegetables.",
    time: now + 1000*60*60*24*3,
    place: "Next to the stairs in Auditorium",
    price: 3.50,
    reservations: undefined,
    capacity: 10
  },
  "a3": {
    cook: "0x123",
    title: "Chinese delight",
    description: "This will be a surprise :)",
    time: now + 1000*60*60*24*3,
    place: "Auditorium",
    price: 7.50,
    reservations: ['0x1', '0x2', '0x7'],
    capacity: 3
  }
};

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
  cache.set("showAddBalance", true);

  //Get current account from web3
  if(web3.eth.accounts.length > 0) {
    cache.set("account", web3.eth.defaultAccount);
    web3.eth.getBalance(web3.eth.defaultAccount, function(err, result) {
      cache.set("balance", web3.fromWei(result.toString()));
    })
  } else {
    cache.set("account", "0x123");
    cache.set("balance", "7.5");
  }
 
  console.log(web3);
} 

/*
 * Retreive from the smart contract the list of upcoming meals.
 * Use cache.set("meals", ...) to notify the UI about the retreived meals. 
 */

function getMeals() {
  var meals = Object.keys(_meals).map(function (id) {
    var meal = _meals[id];
    meal.id = id;
    return meal;
  });
  cache.set("meals", meals);
}

/*
 * Retreive from the smart contract the details about the meal with a given id.
 * Use cache.set("meal", ...) to notify the UI about the retreived meal.
 *
 * Arguments:
 *
 * - id (string): id of the meal that is to be updated
 */

function getMeal(id) {
  cache.set("meal", _meals[id]);
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
  id = "" + (new Date()).getTime();
  var meal = data;
  meal.id = id;
  meal.cook = cache.get("account");
  _meals[id] = meal;
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
  Object.keys(data).forEach(function (key) {
    _meals[id][key] = data[key];
  })
}

/*
 * Reserve a meal with the given id.
 */

function reserve(id) {
  _meals[id].reservations = (_meals[id].reservations || []).concat(cache.get("account"));
}

/*
 * Add balance to the current account.
 *
 * NOTE: this function may not be necessary when integrated with a smart contract.
 */

function addBalance() {
  cache.set("balance", (cache.get("balance") || 0) + 1);
}