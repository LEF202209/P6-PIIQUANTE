/************************************************************/
/************** Controller user *****************************/
/************************************************************/
const bcrypt = require('bcrypt')
const User = require('../models/User')

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