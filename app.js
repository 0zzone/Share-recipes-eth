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
  return new web3.eth.Contract(process.env.ABI, process.env.CONTRACT_ADDRESS);
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
    await contract.methods.addRecette(name, time, difficulty).send({from: process.env.DEFAULT_ADDRESS, gas:3000000});
    await contract.methods.addIngredients(tab_ingr, tab_ingr.length).send({from: process.env.DEFAULT_ADDRESS, gas:3000000});
    
    res.redirect('/');
});


app.post('/delete', async (req, res) => {
  const contract = Contract();
  await contract.methods.deleteRecette(req.body.id).send({from: process.env.DEFAULT_ADDRESS, gas:3000000});
  res.redirect('/');
});


// Listening
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});