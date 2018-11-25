pragma solidity ^0.4.23;

contract MealMenu {

    mapping (address => uint) pendingWithdrawals;

    struct Meal {
		address Cook;
    	bytes32 Title; // small Title (include limit in front-end?)
		string Description; // allowed?
		bytes32 Where; // small location (include limit in front-end?)
		uint When; //Unix Timestamp
		uint Price; //in wei, needs conversion to Ether (or currency) in front-end
		uint8 Capacity; //support <256

		address[] Eaters;
    }

    Meal[] public availableMeals; // use generated getter(?) for getMeals in front-end

    function getMeal(uint id) public view returns (
    	bytes32 Title, 
    	string Description, 
    	bytes32 Where, 
    	uint When, 
    	uint Price, 
    	uint8 Capacity,
    	uint8 Reserved) {
    	Title = availableMeals[id].Title;
    	Description = availableMeals[id].Description;
    	Where = availableMeals[id].Where;
    	When = availableMeals[id].When;
    	Price = availableMeals[id].Price;
    	Capacity = availableMeals[id].Capacity;
    	Reserved = uint8(availableMeals[id].Eaters.length);
    }

    function createMeal(bytes32 t, string d, bytes32 wr, uint wn, uint p, uint8 c) public {
    	Meal memory m;
    	m.Cook = msg.sender;
    	m.Title = t;
    	m.Description = d;
    	m.Where = wr;
    	m.When = wn;
    	m.Price = p;
    	m.Capacity = c;
    	availableMeals.push(m);
    }

    function updateMeal(uint id, bytes32 t, string d, bytes32 wr, uint8 c) public {
    	require(msg.sender == availableMeals[id].Cook, "Only a the Cook of this meal can update the meal");
    	// Do not allow lowering capacity below current reservation count
    	require(uint8(availableMeals[id].Eaters.length) < c, "You cannot lower the capacity below the number of reservations"); 
    	availableMeals[id].Title = t;
    	availableMeals[id].Description = d;
    	availableMeals[id].Where = wr;
    	availableMeals[id].Capacity = c;
    }

    function reserve(uint id) payable public {
    	require(uint8(availableMeals[id].Eaters.length) < availableMeals[id].Capacity, "The capacity of this meal has been reached");
    	pendingWithdrawals[availableMeals[id].Cook] += msg.value;
    	availableMeals[id].Eaters.push(msg.sender);
    }

    // https://solidity.readthedocs.io/en/v0.5.0/common-patterns.html#withdrawal-from-contracts
    function withdraw() public {
    	uint amount = pendingWithdrawals[msg.sender];
        pendingWithdrawals[msg.sender] = 0;
        msg.sender.transfer(amount);
    }
}
