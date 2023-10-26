const Sauce = require('../models/Sauce');


function createSauce (req, res) {
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id;
    //ajout des informations du formulaire a partir du model sauce
    const sauce = new Sauce({
      ...sauceObject,
      
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: '0',
      dislikes: '0',
	  usersLiked: '[]',
  	  usersDisliked: '[]'
    })
    sauce.save()
      .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
      .catch(error => res.status(400).json({ error }))
  }
  
  function getAllSauces  (req, res) {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.statut(400).json({ error }))
  }

  function getOneSauce   (req, res) {
    Sauce.findOne({ _id: req.params.id })
      .then(thing => res.status(200).json(thing))
      .catch(error => res.status(404).json({ error }));
  }

  module.exports =  {  createSauce, getAllSauces, getOneSauce }
