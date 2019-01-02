var MealMenu = artifacts.require("./MealMenu.sol");
const shouldFail = require('openzeppelin-solidity/test/helpers/shouldFail');

const BigNumber = web3.BigNumber;
require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

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

  it("Cannot reserve meal that has reached capacity", function() {
    return MealMenu.deployed().then(function(instance) {
      return instance.createMeal("test", "description", "audi", new Date().getTime() + 2, 2, 1, {
        from: accounts[0],
        gas: 1000000
      }).then(async function(meal) {
        return instance.reserve(meal.logs[0].args.ID, "secrethash", {
          from: accounts[1],
          gas: 1000000,
          value: meal.logs[0].args.Price
        }).then(async function(rervation) {
          await shouldFail.reverting(instance.reserve(meal.logs[0].args.ID, "secrethash", {
            from: accounts[2],
            gas: 1000000,
            value: meal.logs[0].args.Price
          }));
        });
      });
    });
  });


  it("Cannot reserve meal twice", function() {
    return MealMenu.deployed().then(function(instance) {
      return instance.createMeal("test", "description", "audi", new Date().getTime() + 2, 2, 1, {
        from: accounts[0],
        gas: 1000000
      }).then(async function(meal) {
        return instance.reserve(meal.logs[0].args.ID, "secrethash", {
          from: accounts[1],
          gas: 1000000,
          value: meal.logs[0].args.Price
        }).then(async function(rervation) {
          await shouldFail.reverting(instance.reserve(meal.logs[0].args.ID, "secrethash", {
            from: accounts[1],
            gas: 1000000,
            value: meal.logs[0].args.Price
          }));
        });
      });
    });
  });
});


