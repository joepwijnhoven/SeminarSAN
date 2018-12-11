pragma solidity ^0.4.23;

contract MealMenu {

    mapping (address => uint) pendingWithdrawals;
    mapping (address => mapping (uint => bool)) eaterReservations;
    mapping (address => uint) MunchieBalance; // our own sub-currency

    struct Meal {		
    	string Title; // small Title (include limit in front-end?)
		string Description; // allowed?
		string Where; // small location (include limit in front-end?)
		uint When; //Unix Timestamp
		uint Price; //in wei, needs conversion to Ether (or currency) in front-end
		uint8 Capacity; //support <256

		address[] Eaters;
		address Cook;
    }

    event newMeal (
    	uint ID,
    	address Cook,
    	string Title, 
    	string Description, 
    	string Where, 
    	uint When, 
    	uint Price, 
    	uint8 Capacity);

    event updatedMeal (
    	uint ID,
    	string Title,
    	string Description,
    	string Where,
    	uint8 Capacity);

    event reservation (
    	uint MealID,
    	address Eater);

    Meal[] public availableMeals;

    function getMeal(uint id) public view returns (
    	address Cook,
    	string Title, 
    	string Description, 
    	string Where, 
    	uint When, 
    	uint Price, 
    	uint8 Capacity,
    	address[] Eaters) {
    	Cook = availableMeals[id].Cook;
    	Title = availableMeals[id].Title;
    	Description = availableMeals[id].Description;
    	Where = availableMeals[id].Where;
    	When = availableMeals[id].When;
    	Price = availableMeals[id].Price;
    	Capacity = availableMeals[id].Capacity;
    	Eaters = availableMeals[id].Eaters;
    }

    function getNumberOfMeals() public view returns (uint) {
    	return availableMeals.length;
    }

    function createMeal(string t, string d, string wr, uint wn, uint p, uint8 c) public {
    	require(wn > now, "Not allowed to create meals in the past");
    	require(c > 0, "Zero-capacity meals are not allowed");
    	Meal memory m;
    	m.Cook = msg.sender;
    	m.Title = t;
    	m.Description = d;
    	m.Where = wr;
    	m.When = wn;
    	m.Price = p;
    	m.Capacity = c;
    	availableMeals.push(m);
    	emit newMeal(availableMeals.length - 1, msg.sender, t, d, wr, wn, p, c);
    }

    function updateMeal(uint id, string t, string d, string wr, uint8 c) public {
    	require(msg.sender == availableMeals[id].Cook, "Only a the Cook of this meal can update the meal");
    	// Do not allow lowering capacity below current reservation count
    	require(uint8(availableMeals[id].Eaters.length) < c, "You cannot lower the capacity below the number of current reservations"); 
    	availableMeals[id].Title = t;
    	availableMeals[id].Description = d;
    	availableMeals[id].Where = wr;
    	availableMeals[id].Capacity = c;
    	emit updatedMeal(id, t, d, wr, c);
    }

    function reserve(uint id) payable public {
    	require(availableMeals[id].When > now, "Cannot reserve a meal in the past");
    	require(uint8(availableMeals[id].Eaters.length) < availableMeals[id].Capacity, "The capacity of this meal has been reached");
    	if (eaterReservations[msg.sender][id]) { // already reserved
    		//send back the Ether
    		msg.sender.transfer(msg.value);
		} else {
	    	//pendingWithdrawals[availableMeals[id].Cook] += msg.value; // not used because withdraw()
	    	availableMeals[id].Eaters.push(msg.sender);
	    	eaterReservations[msg.sender][id] = true;
	    	// directly send Ether to Cook
	        availableMeals[id].Cook.transfer(availableMeals[id].Price);
	    	emit reservation(id, msg.sender);
		}
    }

    /*
    // https://solidity.readthedocs.io/en/v0.5.0/common-patterns.html#withdrawal-from-contracts
    function withdraw() public {
    	uint amount = pendingWithdrawals[msg.sender];
        pendingWithdrawals[msg.sender] = 0;
        msg.sender.transfer(amount);
    }
    */
}
