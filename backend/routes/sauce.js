/************************************************************/
/***************** Routes sauce  ****************************/
/************************************************************/

const express = require('express');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce')

// route Post création sauce
router.post('/',auth,multer,sauceCtrl.createSauce);
// route Get récupération de toutes les sauces 
router.get('/',auth,sauceCtrl.getAllSauces);
// route Get récupération d'une sauce 
router.get('/:id',auth,sauceCtrl.getOneSauce);
// route Put modification d'une sauce 
router.put('/:id',auth,multer,sauceCtrl.modifySauce);
// route Delete pour suppression d'une sauce 
router.delete('/:id',auth ,sauceCtrl.deleteSauce);
// route Post pour liker et disliker une sauce
router.post('/:id/like',auth ,sauceCtrl.likeSauce);

module.exports = router;