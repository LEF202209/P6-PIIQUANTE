/************************************************************/
/*****************    app.js    *****************************/
/************************************************************/

// Importation du module des variables d'environnement 'dotenv'
require('dotenv').config();

// Importer  module 'express'
const express = require('express');
// Créer une application express
const app = express();
app.use(express.json());
// Importer bibliothèque mongoose
const mongoose = require('mongoose');
// Importer des fichiers de routing user
const userRoutes = require('./routes/user')
// Importer des fichiers de routing sauce
const sauceRoutes = require('./routes/sauce')
const path = require('path');
// Variables d'environnement
const userName= process.env.DB_USERNAME
const password = process.env.DB_PASSWORD
const accessMongo = process.env.DB_ACCESSMONGO
const dataBaseName = process.env.DB_NAME
// Importer module de sécurité 'helmet'
const helmet = require('helmet');

//  cors : déclaration des autorisations //
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

// Se connecter à Mongo DB - Informations de connexion dans variables d'environnement
mongoose.connect(`mongodb+srv://${userName}:${password}@${accessMongo}/${dataBaseName}?retryWrites=true&w=majority`,
{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=> console.log('Connexion à MongoDB réussie !'))
.catch(()=> console.log('Connexion à MongoDB échouée!'));

// Route pour servir des fichiers statiques à partir du répertoire "images"
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes pour l'authentification des utilisateurs
app.use('/api/auth',userRoutes);
// Routes pour les fonctionnalités liées aux sauces
app.use('/api/sauces',sauceRoutes);

// Sécurité : protection des Headers
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy : "cross-origin" })) ;

// Exporter l'applicat° pour qu'on puisse y accéder depuis les autres fichiers notamment notre server node //
module.exports = app;