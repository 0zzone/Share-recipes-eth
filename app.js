// Imports
const Web3 = require('web3');
const express = require('express');
const { all } = require('express/lib/application');
const app = express();
const port = 3000;
let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
var bodyParser = require('body-parser');
var gis = require('g-i-s');
require('dotenv').config()

// EJS
app.set('views', './views');
app.set('view engine', 'ejs');

//  Middlewares
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({
    extended: true
  }))
    
// Function
const Contract = () => {
  return new web3.eth.Contract([
    {
      "inputs": [],
      "name": "getNombreRecettes",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "getRecette",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "time",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "nombreIngredients",
              "type": "uint256"
            },
            {
              "internalType": "string[]",
              "name": "ingredients",
              "type": "string[]"
            },
            {
              "internalType": "enum Recette.Difficulty",
              "name": "difficulty",
              "type": "uint8"
            }
          ],
          "internalType": "struct Recette.infosRecette",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "getDifficulty",
      "outputs": [
        {
          "internalType": "enum Recette.Difficulty",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "getTime",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "getIngredients",
      "outputs": [
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string[]",
          "name": "_ingredients",
          "type": "string[]"
        },
        {
          "internalType": "uint256",
          "name": "_nombreIngredients",
          "type": "uint256"
        }
      ],
      "name": "addIngredients",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_time",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_difficulty",
          "type": "uint256"
        }
      ],
      "name": "addRecette",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "getRecetteName",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getAllRecettes",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "time",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "nombreIngredients",
              "type": "uint256"
            },
            {
              "internalType": "string[]",
              "name": "ingredients",
              "type": "string[]"
            },
            {
              "internalType": "enum Recette.Difficulty",
              "name": "difficulty",
              "type": "uint8"
            }
          ],
          "internalType": "struct Recette.infosRecette[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "deleteRecette",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ], "0x3d227DaE29cfEd222cfE19A0A6c4B6caFa7B39a0");
}

// Routes
app.get('/', async (req, res) => {
    tab = []
    const contract = Contract();
    let nombre = await contract.methods.getNombreRecettes().call().then(async (nombreRecette) => {
      for(let i=0; i<nombreRecette; i++){
        const infosRecette = await contract.methods.getRecette(i).call().then(recette => {
            tab.push({
                'name': recette[0],
                'time': recette[1],
                'difficulty': recette[4],
                'id': i
            });
        });
    }
    res.render('index', {allRecettes: tab});

    });
});

app.get('/content/:id', async (req, res) => {
  let id = req.params.id;
  const contract = Contract();
  const infosRecette = await contract.methods.getRecette(id).call().then(recette => {
    let phrase = ""
    for(var i=0; i<recette[3].length; i++){
        if(i < recette[3].length - 1){
            phrase += recette[3][i] + ', '
        }
        else{
            phrase += recette[3][i]
        }
    }
    data = {
        'name': recette[0],
        'time': recette[1],
        'ingredients': phrase,
        'difficulty': recette[4],
    };
    gis(recette[0] + ' recette', function logResults(error, results) {
      if (error) {
        console.log(error);
      }
      else {
        res.render('content', {content: data, allResults: results, id_recette:id});
      }
    });
  });
});


app.get('/add', (req, res) => {
    res.sendFile(__dirname + '/views/add.html');
});

app.post('/addPost', async (req, res) => {
    let name = req.body.name;
    let time = req.body.time;
    let ingr = req.body.ingredients.split(',');
    tab_ingr = []
    for(var i=0; i<ingr.length; i++){
        tab_temp = ingr[i].split(' ')
        tab_temp.forEach(el => {
            if(el.length > 0){
              tab_ingr.push(el);
            }
        });
    }
    let difficulty = req.body.difficulty;


    const contract = Contract();
    await contract.methods.addRecette(name, time, difficulty).send({from: "0xD5b801C9CFf16243c1e7112285d5698E476e73a7", gas:3000000});
    await contract.methods.addIngredients(tab_ingr, tab_ingr.length).send({from: "0xD5b801C9CFf16243c1e7112285d5698E476e73a7", gas:3000000});
    
    res.redirect('/');
});


app.post('/delete', async (req, res) => {
  const contract = Contract();
  await contract.methods.deleteRecette(req.body.id).send({from: "0xD5b801C9CFf16243c1e7112285d5698E476e73a7", gas:3000000});
  res.redirect('/');
});


// Listening
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});