pragma solidity ^0.4.23;

contract MealMenu {

    struct Reservation {
    	bool reserved;
    	bytes32 eaterSecretHash;
    }

    mapping (address => mapping (uint => Reservation)) eaterReservations;

    struct Meal {		
    	string Title; // small Title (include limit in front-end?)
		string Description; // allowed?
		string Where; // small location (include limit in front-end?)
		uint When; //Unix Timestamp
		uint Price; //in wei, needs conversion to Ether (or currency) in front-end
		uint Capacity;

		address[] Eaters;
		address[] confirmedEaters;
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
    	uint Capacity);

    event updatedMeal (
    	uint ID,
    	string Title,
    	string Description,
    	string Where,
    	uint Capacity);

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
    	uint Capacity,
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

    function createMeal(string t, string d, string wr, uint wn, uint p, uint c) public {
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

    function updateMeal(uint id, string t, string d, string wr, uint c) public {
    	require(msg.sender == availableMeals[id].Cook, "Only a the Cook of this meal can update the meal");
    	// Do not allow lowering capacity below current reservation count
    	require(uint8(availableMeals[id].Eaters.length) < c, "You cannot lower the capacity below the number of current reservations"); 

    	availableMeals[id].Title = t;
    	availableMeals[id].Description = d;
    	availableMeals[id].Where = wr;
    	availableMeals[id].Capacity = c;
    	emit updatedMeal(id, t, d, wr, c);
    }

    function reserve(uint id, bytes32 secretHash) payable public {
    	require(availableMeals[id].When > now, "Cannot reserve a meal in the past");
    	require(availableMeals[id].Eaters.length < availableMeals[id].Capacity, "The capacity of this meal has been reached");
    	require(!eaterReservations[msg.sender][id].reserved, "Already made reservation");
    	require(availableMeals[id].Price <= msg.value, "Not enough funds sent for reservation");

    	if (msg.value > availableMeals[id].Price) { // caller sent to much Ether
    		msg.sender.transfer(msg.value - availableMeals[id].Price); //send difference back
    	}

    	// process reservation
    	availableMeals[id].Eaters.push(msg.sender);
    	eaterReservations[msg.sender][id].reserved = true;
    	eaterReservations[msg.sender][id].eaterSecretHash = secretHash;
    	emit reservation(id, msg.sender);
    }

    function unlockReservation(uint foodId, address eater, string secret) public {
    	require(eaterReservations[eater][foodId].reserved, "No reservation found");
    	require(msg.sender == eater || msg.sender == availableMeals[foodId].Cook, "Only Eater and Cook can unlock reservation funds");
    	require(keccak256(bytes(secret)) == eaterReservations[eater][foodId].eaterSecretHash, "Invalid secret provided");

    	// remove reservation to prevent multiple-access (both Eater and Cook unlocking funds)
    	eaterReservations[eater][foodId].reserved = false;
    	delete eaterReservations[eater][foodId].eaterSecretHash;

    	if (msg.sender == availableMeals[foodId].Cook) { 
    		// if Cook unlocks funds, add Eater to confirmedEaters of Meal
    		availableMeals[foodId].confirmedEaters.push(eater);
    	}

    	if (msg.sender == eater) {
    		// if Eater unlocks funds, remove Eater from Eaters of Meal
    		for (uint i = 0; i < availableMeals[foodId].Eaters.length; i++) {
    			if (availableMeals[foodId].Eaters[i] == eater) {
    				// swap in last element to remove gaps
    				availableMeals[foodId].Eaters[i] = availableMeals[foodId].Eaters[availableMeals[foodId].Eaters.length - 1];
    				availableMeals[foodId].Eaters.length -= 1;
    			}
    		}
    	}

    	// transfer locked reservation funds to specified target
    	msg.sender.transfer(availableMeals[foodId].Price);
    }
}
