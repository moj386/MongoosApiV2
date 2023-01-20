const router = require('express').Router();
const auth = require("../../middleware/auth");

var storeController = require('../Controller/ControllerStores');

router.route('/register')
.post(storeController.register);

router.route('/login')
.post(storeController.login);    
 
router.route('/product')
.post(auth, storeController.addproduct)

router.route('/product/id')
.post(auth, storeController.single)
.put(auth, storeController.updateSingle)

router.route('/product/color')
.put(auth, storeController.addColor)

router.route('/product/extrainfo')
.put(auth, storeController.updateExtraInfo)

router.route('/product/photos')
.post(auth, storeController.UpdateImages);

router.route('/products').get(auth, storeController.myproducts);

router.route('/nearbystores').post(storeController.getNearBuyStores)


module.exports = router;