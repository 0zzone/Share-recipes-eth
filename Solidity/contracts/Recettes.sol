pragma solidity >=0.4.22 <0.9.0;

contract Recette {

    enum Difficulty {facile, moyen, difficile}

    uint nombreRecette;

    struct infosRecette {
        string name;
        uint time;
        uint nombreIngredients;
        string[] ingredients;
        Recette.Difficulty difficulty;
    }

    mapping(uint => infosRecette) Recettes;

    function getNombreRecettes() public view returns(uint) {
        return nombreRecette;
    }

    function getRecette(uint _id) public view returns(infosRecette memory) {
        return Recettes[_id];
    }

    function getDifficulty(uint _id) public view returns(Difficulty){
        return Recettes[_id].difficulty;
    }

    function getTime(uint _id) public view returns(uint) {
        return Recettes[_id].time;
    }

    function getIngredients(uint _id) public view returns(string[] memory) {
        uint numIngredients = Recettes[_id].nombreIngredients;
        string[] memory ingredients = new string[](numIngredients);
        for(uint i=0; i<numIngredients; i++){
            ingredients[i] = Recettes[_id].ingredients[i];
        }
        return ingredients;
    }

    function addIngredients(string[] memory _ingredients, uint _nombreIngredients) public {
        require(_ingredients.length == _nombreIngredients, "Nombres incorrects !");
        Recettes[nombreRecette].nombreIngredients = _nombreIngredients;
        for(uint i=0; i<_ingredients.length; i++){
            Recettes[nombreRecette].ingredients.push(_ingredients[i]);
        }
        nombreRecette++;
    }

    function addRecette(string memory _name, uint _time, uint _difficulty) public {
        bytes memory name = bytes(Recettes[nombreRecette].name);
        require(name.length == 0, "La recette a deja ete cree !");
        require(_difficulty >= 0, "La difficulte doit etre comprise entre 0 et 2");
        require(_difficulty <= 2, "La difficulte doit etre comprise entre 0 et 2");
        Recettes[nombreRecette].name = _name;
        Recettes[nombreRecette].time = _time;
        if(_difficulty == 0){
            Recettes[nombreRecette].difficulty = Difficulty.facile;
        }
        else if(_difficulty == 1){
            Recettes[nombreRecette].difficulty = Difficulty.moyen;
        }
        else{
            Recettes[nombreRecette].difficulty = Difficulty.difficile;
        }
    }

    function getRecetteName(uint _id) public view returns(string memory) {
        return Recettes[_id].name;
    }

    function getAllRecettes() public view returns(infosRecette[] memory){
        infosRecette[] memory recettes = new infosRecette[](nombreRecette);
        for(uint i=0; i<nombreRecette; i++){
            recettes[i] = getRecette(i);
        }
        return recettes;
    }

    function deleteRecette(uint _id) public {
        delete Recettes[_id];
        nombreRecette--;
    }

}