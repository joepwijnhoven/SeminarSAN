var Migrations = artifacts.require("./MealMenu.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
