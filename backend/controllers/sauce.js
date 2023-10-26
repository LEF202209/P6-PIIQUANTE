const Sauce = require('../models/Sauce');
const fs= require('fs');


function createSauce (req, res) {
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id;
    delete sauceObject._userId;
    //ajout des informations du formulaire a partir du model sauce
    const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
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

  function modifySauce (req,res){
    // format objet transmis sous forme de chaîne de caractères
    // si téléchargement fichier
    const sauceObject = req.file? 
    {
        ...JSON.parse(req.body.sauce),
        imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }:
    {...req.body};
    delete sauceObject._userId;
    Sauce.findOne ({_id:req.params.id})
    .then((sauce) =>{
        if (!sauce){
            res.status(404).json({message:'sauce inexistante!'})
        }
        else if (sauce.userId!==req.auth.userId) {
            res.status(403).json({message:'accès non autorisé!'})
        }
        else {
            Sauce.updateOne({_id:req.params.id},{...sauceObject,_id:req.params.id})
            .then(() => res.status(200).json({message:'Sauce modifiée!'}))
            .catch(error => res.status(400).json({error}))
        }
    })
    .catch(error => res.status(400).json({error}))
  }

  function deleteSauce (req,res){
    Sauce.findOne ({_id:req.params.id})
    .then((sauce) =>{
        if (!sauce){
            res.status(404).json({message:'sauce inexistante!'})
        }
        else if (sauce.userId!==req.auth.userId) {
            res.status(403).json({message:'accès non autorisé!'})
        }
        else {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({_id:req.params.id})
            .then(() => res.status(200).json({message:'Sauce supprimée!'}))
            .catch(error => res.status(400).json({error}))
        }) 
    }})
}

  module.exports =  {  createSauce, getAllSauces, getOneSauce, modifySauce, deleteSauce }
