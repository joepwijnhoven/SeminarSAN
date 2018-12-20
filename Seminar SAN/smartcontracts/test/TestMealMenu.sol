pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/MealMenu.sol";

contract TestMealMenu {
  function testAmountOfMeals() public {
    //using deployed contract
    MealMenu mealcontract = MealMenu(DeployedAddresses.MealMenu());
    uint amountofmeals = 1;
    mealcontract.createMeal("test", "description", "audi", now + 2, 2, 2);
    Assert.equal(mealcontract.getNumberOfMeals(), amountofmeals, "There should be one meal in the blockchain");
  }

  function testCannotCreateMealsInPast() public {
    MealMenu mealcontract = new MealMenu();
    ThrowProxy throwproxy = new ThrowProxy(address(mealcontract)); 
    MealMenu(address(throwproxy)).createMeal("test", "description", "audi", now -2, 2, 2);
    bool r = throwproxy.execute.gas(200000)(); 
    Assert.isFalse(r, "Cannot create meal in the past");
  }


  //not allowed to create meals with zero capacity
  function testCannotCreateMealsWithZeroCapacity() public {
    MealMenu mealcontract = new MealMenu();
    ThrowProxy throwproxy = new ThrowProxy(address(mealcontract)); 
    MealMenu(address(throwproxy)).createMeal("test", "description", "audi", now +2, 2, 0);
    bool r = throwproxy.execute.gas(200000)(); 
    Assert.isFalse(r, "Cannot create meal with zero capacity");
  }  

  //not allowed to reserver for meal that you are the cook of 

  // Only cook can update meal

  //

}

contract ThrowProxy {
  address public target;
  bytes data;

  constructor(address _target) public {
    target = _target;
  }

  //prime the data using the fallback function.
  function() public {
    data = msg.data;
  }

  function execute() public returns (bool) {
    return target.call(data);
  }
}