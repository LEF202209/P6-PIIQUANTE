/***********************************************************************************************/
/**************************************       Modèle Sauce                **********************/
/***********************************************************************************************/
const mongoose = require('mongoose');

// Définition schéma mongoose sauce//
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  usersLiked: { type: [String], default: [] },
  usersDisliked: { type: [String], default: [] }
});
// Exporter modèle Schema sauce //
module.exports = mongoose.model('Sauce', sauceSchema);