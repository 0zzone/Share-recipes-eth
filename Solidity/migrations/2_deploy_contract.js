const Recettes = artifacts.require("Recette");

module.exports = function(deployer) {
  deployer.deploy(Recettes);
};