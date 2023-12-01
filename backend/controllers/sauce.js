const Sauce = require('../models/Sauce');
const fs= require('fs');
const xss= require('xss');
var messageMAJ='';

  // Sécurité xss : Échapper chaque propriété de sauceObj
function escapeObject (sauceObj) {
    for (let key in sauceObj) {
      if (typeof sauceObj[key] === 'string') {
     sauceObj[key] = xss(sauceObj[key]);
     }}
     return sauceObj
}

// Fonction pour créer une sauce
function createSauce (req, res) {
    // Importer les données saisies
    let sauceObject = JSON.parse(req.body.sauce);
    // Appel de la fonct° esapeObject, modifier info° pour éviter les failles xss
    sauceObject = escapeObject(sauceObject);

    delete sauceObject._id;
    delete sauceObject._userId;
    // Ajout des informations du formulaire à partir du modèle sauce
    const sauce = new Sauce({
      ...sauceObject, 
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: '0',
      dislikes: '0',
	  usersLiked: '[]',
  	  usersDisliked: '[]'
    })
    // Sauvegarde des données ajoutées dans BDD
    sauce.save()
      .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
      .catch(error => res.status(400).json({ error }))
  }

  // Fonction pour lire toutes les sauces
function getAllSauces  (req, res) {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.statut(400).json({ error }))
  }

  // Fonction pour lire une sauce qui possède l'Id en paramètre
function getOneSauce   (req, res) {
    Sauce.findOne({ _id: req.params.id })
      .then(thing => res.status(200).json(thing))
      .catch(error => res.status(404).json({ error }));
  }

  // Fonction pour modifier une sauce
function modifySauce (req,res){
    // importer les nouvelles données
    // téléchargement fichier ?
    let sauceObject = req.file? 
    {
        // format objet transmis sous forme de chaîne de caractères
        ...JSON.parse(req.body.sauce),
        imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }:
    {...(req.body)};    
    delete sauceObject._userId;
    const updateSauce =() => {
        Sauce.updateOne({_id:req.params.id},{...sauceObject,_id:req.params.id})
        .then(() => res.status(200).json({message:'Sauce modifiée!'}))
        .catch(error => res.status(400).json({error}))
    }
    // On cherche la sauce à modifier à partir de l’ID
    Sauce.findOne ({_id:req.params.id})
    .then((sauce) =>{
        if (!sauce){
            res.status(404).json({message:'sauce inexistante!'})
        }
        else if (sauce.userId!==req.auth.userId) {
            res.status(403).json({message:'accès non autorisé!'})
        }
        else {
            // Appel de la fonct° esapeObject, modifier info° pour éviter les failles xss
            sauceObject = escapeObject(sauceObject);
            // Mise à jour des données
            if (req.file) {
                const filename = sauce.imageUrl.split('/images/')[1];         
                if (filename !== req.file.filename) {
                    // supprimer ancien fichier
                    fs.unlink(`images/${filename}`, () => updateSauce());
                } 
                else {
                    updateSauce();
                }
            }
            else {
                updateSauce();
            }
        }
    })
    .catch(error => res.status(400).json({error}))
  }
 
// Fonction pour supprimer une sauce
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

// Fonction pour liker/disliker une sauce
function likeSauce (req,res){
    const userId = req.body.userId;
    const like = req.body.like;
    Sauce.findOne ({_id:req.params.id})
    .then((sauce) =>{
        if (!sauce){
            res.status(404).json({message:'sauce inexistante!'})
        }
        else {
            const userLiked = sauce.usersLiked.includes(userId);
            const userDisliked = sauce.usersDisliked.includes(userId);
            const update = {};
            switch (like) {
                // 1 = liker la sauce
                case 1 : {
                    // Utilisateur n a pas déjà liké ou disliké la sauce ?
                    if (!userLiked && !userDisliked) {
                        update.$inc = {likes:1};
                        update.$push ={usersLiked:userId};
                        messageMAJ='Like ajouté !'
                    }
                    else {
                        res.status(403).json({message:'Double vote interdit!'});
                    }
                }
                break;
                // -1 = disliker la sauce
                case -1 : {
                    if (!userLiked && !userDisliked) {
                        update.$inc = {dislikes:1};
                        update.$push ={usersDisliked:userId};
                        messageMAJ='Dislike ajouté !'
                    }
                    else {
                        res.status(403).json({message:'Double vote interdit!'});
                    }
                }
                break;
                // annuler son choix : on enlève le like ou le dislike
                case 0 : {
                    // utilisateur a aimé la sauce ?
                    if (userLiked) {
                        update.$inc = {likes:-1};
                        update.$pull ={usersLiked:userId};
                        messageMAJ='Like supprimé !'
                    }
                    // utilisateur n'a pas aimé la sauce ?
                    else if (userDisliked) {
                        update.$inc = {dislikes:-1};
                        update.$pull ={usersDisliked:userId};
                        messageMAJ='Dislike supprimé !'
                    } else{
                        res.status(400).json({message:'Action invalide !'});   
                    }
                }
                break;
                // valeur like reçue invalide
                default:
                    res.status(400).json({message:`la valeur like ${like} n'est pas valide !`})
            }
            if (update.$pull || update.$push || update.$inc){
            Sauce.updateOne({_id:req.params.id},update)
            .then(() => {
                res.status(200).json({message:`$messageMAJ`})
            })
            .catch(error => res.status(400).json({error}))
            }
        }
    })
    .catch(error => res.status(400).json({error}))
  }

module.exports =  {  createSauce, getAllSauces, getOneSauce, modifySauce, deleteSauce,likeSauce }
