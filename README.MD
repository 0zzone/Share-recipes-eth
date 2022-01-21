# 🍔 Partage de recettes sur la blockchain

## ⭐ Explications

Cette application web vous permet de stocker vos recettes de cuisine directement sur la blockchain Ethereum. Vous renseignez le nom, la durée, les aliments ainsi que la difficulté. Lors de l'affichage d'une recette, ce que vous avez renseigné s'affiche mais effectue une recherche d'image automatique sur internet pour vous afficher des images grâce aux mots clés (le nom de la recette). Vous avez la possibilité de supprimer une recette.

## ⭐ Comment lancer l'application ?

1) Installez truffle `npm install -g truffle`
2) Rendez-vous dans le dossier du projet
3) Déployez les contrats intelligents `truffle migrate --reset`
4) Récupérez `contract_address` depuis votre terminal du contrat `Recette` et coller le dans le fichier `app.js` à la ligne `261`
5) Récupérez l'ABI du contrat dans `Solidity/build/contracts/Recette.js` et coller le dans le fichier `app.js` à la ligne `24`
6) Lancez Ganache
7) Tapez dans votre terminal `node app.js`