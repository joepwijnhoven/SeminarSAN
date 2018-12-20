var MealMenu = artifacts.require("./MealMenu.sol");

contract('MealMenu', function(accounts) {
  it("Eater should be able to reserve for meal", function() {
    return MealMenu.deployed().then(function(instance) {
      return instance.createMeal("test", "description", "audi", new Date().getTime() + 2, 2, 2, {
        from: accounts[0],
        gas: 1000000
      }).then(function(meal) {
        return instance.reserve(meal.logs[0].args.ID, "secrethash", {
          from: accounts[1],
          gas: 1000000,
          value: meal.logs[0].args.Price
        }).then(function(reservation) {
          return instance.getMeal.call(meal.logs[0].args.ID);
        }).then(function (mealResult) {
          assert.equal(mealResult[7].includes(accounts[1].toString()), true, "User has not reserved for meal");
        });
      });
    });
  });

//Deze test werkt nog niet :/
  it("Cook should not be able to reserve for his/her own meal", function() {
    return MealMenu.deployed().then(function(instance) {
      return instance.createMeal("test", "description", "audi", new Date().getTime() + 2, 2, 2, {
        from: accounts[0],
        gas: 1000000
      }).then(function(meal) {
        console.log(1);
        return instance.reserve(meal.logs[0].args.ID, "secrethash", {
          from: accounts[0],
          gas: 1000000,
          value: meal.logs[0].args.Price
        }).then(function(reservation) {
          return instance.getMeal.call(meal.logs[0].args.ID);
        }).catch(function (error) {
          console.log(error);
          assert.equal(mealResult[7].length, 0, "Cook has reserved for meal");
        });
      });
    });
  });
});


