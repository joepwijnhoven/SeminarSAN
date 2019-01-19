pragma solidity ^0.4.23;

contract MealMenu {

    mapping (address => mapping (uint => bytes32[])) eaterReservations;

    struct Meal {		
    	string Title; // small Title (include limit in front-end?)
		string Description; // allowed?
		string Where; // small location (include limit in front-end?)
		uint When; //Unix Timestamp
		uint Price; //in wei, needs conversion to Ether (or currency) in front-end
		uint Capacity;

		address[] Eaters;
		string usedSecrets;
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
    	uint ID,
    	address Eater);

    event unlock (
    	uint ID,
    	address Eater,
    	address Target,
    	string Secret);

    Meal[] public availableMeals;

    function getMeal(uint id) public view returns (
    	address Cook,
    	string Title, 
    	string Description, 
    	string Where, 
    	uint When, 
    	uint Price, 
    	uint Capacity,
    	address[] Eaters,
    	string usedSecrets) {
    	Cook = availableMeals[id].Cook;
    	Title = availableMeals[id].Title;
    	Description = availableMeals[id].Description;
    	Where = availableMeals[id].Where;
    	When = availableMeals[id].When;
    	Price = availableMeals[id].Price;
    	Capacity = availableMeals[id].Capacity;
    	Eaters = availableMeals[id].Eaters;
    	usedSecrets = availableMeals[id].usedSecrets;
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
    	require(availableMeals[id].Price <= msg.value, "Not enough funds sent for reservation");

    	if (msg.value > availableMeals[id].Price) { // caller sent to much Ether
    		msg.sender.transfer(msg.value - availableMeals[id].Price); //send difference back
    	}

    	// process reservation
    	availableMeals[id].Eaters.push(msg.sender);
    	eaterReservations[msg.sender][id].push(secretHash);
    	emit reservation(id, msg.sender);
    }

    function unlockReservation(uint foodId, address eater, string secret) public {
    	require(eaterReservations[eater][foodId].length > 0, "No reservation found for supplied Eater");
    	require(msg.sender == eater || msg.sender == availableMeals[foodId].Cook, "Only Eater and Cook can unlock reservation funds");

    	// check whether one of the eaters secret hashes matches (each hash represents one reservation)
    	bool matchFound = false;
    	uint secretMatch;
    	bytes32 secretHash = keccak256(bytes(secret));
    	for (uint i = 0; i < eaterReservations[eater][foodId].length; i++) {
    		if (secretHash == eaterReservations[eater][foodId][i]) {
    			secretMatch = i;
    			matchFound = true;
    			break;
    		}
    	}
    	require(matchFound, "Invalid secret provided");

    	// remove reservation to prevent multiple-access (both Eater and Cook unlocking funds)
    	eaterReservations[eater][foodId][secretMatch] = eaterReservations[eater][foodId][eaterReservations[eater][foodId].length - 1];
    	eaterReservations[eater][foodId].length -= 1;

    	if (msg.sender == availableMeals[foodId].Cook) { 
    		// if Cook unlocks funds, add secret to used secrets
    		if (bytes(availableMeals[foodId].usedSecrets).length == 0) {
				availableMeals[foodId].usedSecrets = secret;
			} else {
    			availableMeals[foodId].usedSecrets = string(abi.encodePacked(availableMeals[foodId].usedSecrets, ",", secret));
			}
    	}

		// Remove Eater from Eaters of Meal
		for (i = 0; i < availableMeals[foodId].Eaters.length; i++) {
			if (availableMeals[foodId].Eaters[i] == eater) {
				// swap in last element to remove gaps
				availableMeals[foodId].Eaters[i] = availableMeals[foodId].Eaters[availableMeals[foodId].Eaters.length - 1];
				availableMeals[foodId].Eaters.length -= 1;
			}
		}

    	// transfer locked reservation funds to specified target
    	msg.sender.transfer(availableMeals[foodId].Price);

    	emit unlock(foodId, eater, msg.sender, secret);
    }
}
