const express = require('express');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce')

router.post('/',auth,multer,sauceCtrl.createSauce);
router.get('/',auth,multer,sauceCtrl.getAllSauces);
router.get('/:id',auth,multer,sauceCtrl.getOneSauce);
router.put('/:id',auth,multer,sauceCtrl.modifySauce);
module.exports = router;