/***********************************************************************************************/
/**************************************       Modèle User                ***********************/
/***********************************************************************************************/
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

// Définition schéma mongoose user //
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true}
})

// Appliquer le plugin uniqueValidator au schéma //
userSchema.plugin(uniqueValidator)
// Exporter modèle Schema user //
module.exports = mongoose.model('User', userSchema)