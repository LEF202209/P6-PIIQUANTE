/************************************************************/
/************* middleware password validator*****************/
/************************************************************/
const passwordValidator = require('password-validator');

// Création du schéma de mot de passe
const schemaPassword = new passwordValidator();

// Ajout propriétés
schemaPassword
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits()                                 // Must have at least 1 digit
.has().not().spaces()                           // Should not have spaces
.has().symbols()                                // Should have symbols
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values


module.exports = (req, res, next) => {
    if(schemaPassword.validate(req.body.password)){
        next()
    }else{
        console.log('Le mot de passe doit contenir entre 8 et 20 caractères, au moins une majuscule, une minuscule, un chiffre un caractère spécial et les espaces ne sont pas autorisés, blacklists non autorisés'  )
        return res.status(400).json({error : `Le mot de passe doit contenir entre 8 et 20 caractères, au moins une majuscule, une minuscule, un chiffre un caractère spécial et les espaces ne sont pas autorisés, blacklists non autorisés `})
    }
}