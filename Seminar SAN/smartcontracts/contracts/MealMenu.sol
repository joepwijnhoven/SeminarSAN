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

		bool Reserved;
		address Eater;
    }

    Meal[] public availableMeals;

    function getMeals() public returns(Meal[]){
		return availableMeals;
    }

    function getMeal(uint id) public returns(Meal) {
		return availableMeals[id];
    }

    function createMeal(bytes32 t, string d, bytes32 wr, uint wn, uint p, uint8 c) public {
    	availableMeals.push(Meal({
    			Cook: msg.sender,
    			Title: t,
    			Description: d,
    			Where: wr,
    			When: wn,
    			Price: p,
    			Capacity: c,
    			Reserved: false,
    			Eater: address(0)
    		}));
    }

    function updateMeal(uint id, bytes32 t, string d, bytes32 wr, uint8 c) public {
    	require(msg.sender == availableMeals[id].Cook, "Only a the Cook of this meal can update the meal");
    	availableMeals[id].Title = t;
    	availableMeals[id].Description = d;
    	availableMeals[id].Where = wr;
    	availableMeals[id].Capacity = c;
    }

    function reserve(uint id) payable public {
    	require(!availableMeals[id].Reserved);
    	pendingWithdrawals[availableMeals[id].Cook] += msg.value;
    	availableMeals[id].Reserved = true;
    	availableMeals[id].Eater = msg.sender;
    }

    // https://solidity.readthedocs.io/en/v0.5.0/common-patterns.html#withdrawal-from-contracts
    function withdraw() public {
    	uint amount = pendingWithdrawals[msg.sender];
        pendingWithdrawals[msg.sender] = 0;
        msg.sender.transfer(amount);
    }
}
