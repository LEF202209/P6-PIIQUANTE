//importation du module de variable d'environnement
require('dotenv').config();
// importer body-parser
const bodyParser = require('body-parser');
// importer express module
const express = require('express');
// créer une application express
const app = express();
// importer mongoose
const mongoose = require('mongoose');
// importer des fichiers de routing user
const userRoutes = require('./routes/user')
// importer des fichiers de routing sauce
const sauceRoutes = require('./routes/sauce')
// variables d'environnement
const userName= process.env.DB_USERNAME
const password = process.env.DB_PASSWORD
const accessMongo = process.env.DB_ACCESSMONGO

//  cors : déclaration des autorisations //
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

// se connecter à Mongoose
mongoose.connect(`mongodb+srv://${userName}:${password}@${accessMongo}/?retryWrites=true&w=majority`,
{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=> console.log('Connexion à MongoDB réussie !'))
.catch(()=> console.log('Connexion à MongoDB échouée!'));
// Utilisation du body-parser pour analyser les corps de requête pour les données JSON
app.use(bodyParser.json());
app.use('/api/auth',userRoutes);
app.use('/api/sauces',sauceRoutes);
// exporter l'applicat° pour qu'on puisse y accéder depuis les autres fichiers notemment notre server node //
module.exports = app;