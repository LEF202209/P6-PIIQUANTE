/************************************************************/
/************** Controller user *****************************/
/************************************************************/
const bcrypt = require('bcrypt')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
// variable d'environnement
const keyToken = process.env.KEY_TOKEN

//fonction de création d'un compte
exports.signup = (req, res) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User ({
                email: req.body.email,
                password: hash
            })
            user.save()
                .then(() => res.status(201).send({message: 'utilisateur créé !'}))
                .catch(error => res.status(409).send({ message: 'User pas enregistré : ' + error}))
        })
        .catch(error => res.status(500).json({error}))
}

// Connecter un utilisateur existant //
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
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