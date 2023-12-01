/************************************************************/
/************** Controller user *****************************/
/************************************************************/
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Sécurité crypto-js
const cryptoJS = require('crypto-js');

// Variable d'environnement clé secrète
const keyToken = process.env.KEY_TOKEN;

// Fonction pour chiffrer les données avec CRYPTO-JS
function encryptData(data) {
    const encryptedData = cryptoJS.SHA256(data).toString();
    return encryptedData;
  }

// Fonction de création d'un compte
exports.signup = (req, res) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User ({
                // Chiffrer l'e-mail avec CRYPTO-JS
                email: encryptData(req.body.email),
                // Hasher le mot de passe
                password: hash
            })
            user.save()
                .then(() => res.status(201).send({message: 'utilisateur créé !'}))
                .catch(error =>{ 
                    res.status(409).send({ message: 'User pas enregistré : ' + error})})
        })
        .catch(error => res.status(500).json({error}))
}

// Connecter un utilisateur existant //
exports.login = (req, res, next) => {
    // Email encrypté existe dans la BDD ?
    User.findOne({ email: encryptData(req.body.email) })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    // connexion ok :  user avec un token 
                        res.status(200).json({
                        userId: user._id,
                        token : jwt.sign(
                          { userId: user._id },
                          `${keyToken}`,
                          { expiresIn: '24h' }
                      )
                    });
                })
                .catch(error => {
                  res.status(500).json({ error })});
        })
        .catch(error =>{
          res.status(500).json({ error })});
  };

