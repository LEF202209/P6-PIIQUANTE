//importation du module des variables d'environnement
require('dotenv').config();

// importer express module
const express = require('express');
// créer une application express
const app = express();
app.use(express.json());
// importer bibliothèque mongoose
const mongoose = require('mongoose');
// importer des fichiers de routing user
const userRoutes = require('./routes/user')
// importer des fichiers de routing sauce
const sauceRoutes = require('./routes/sauce')
const path = require('path');
// variables d'environnement
const userName= process.env.DB_USERNAME
const password = process.env.DB_PASSWORD
const accessMongo = process.env.DB_ACCESSMONGO
const dataBaseName = process.env.DB_NAME
// sécurité
const helmet = require('helmet');

//  cors : déclaration des autorisations //
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

// se connecter à Mongo DB
mongoose.connect(`mongodb+srv://${userName}:${password}@${accessMongo}/${dataBaseName}?retryWrites=true&w=majority`,
{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=> console.log('Connexion à MongoDB réussie !'))
.catch(()=> console.log('Connexion à MongoDB échouée!'));

// route pour servir des fichiers statiques à partir du répertoire "images"
app.use('/images', express.static(path.join(__dirname, 'images')));

// liens vers les routes sauce et auth
app.use('/api/auth',userRoutes);
app.use('/api/sauces',sauceRoutes);

// sécurité : protection des Headers
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy : "cross-origin" })) ;

// exporter l'applicat° pour qu'on puisse y accéder depuis les autres fichiers notamment notre server node //
module.exports = app;