var Migrations = artifacts.require("./Migrations.sol");
var Identity = artifacts.require("./identity.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(Identity);
};