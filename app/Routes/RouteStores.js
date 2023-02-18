const router = require('express').Router();
const auth = require("../../middleware/auth");

var storeController = require('../Controller/ControllerStores');

router.route('/register').post(storeController.register);
router.route('/login').post(storeController.login);    
router.route('/products').get(auth, storeController.myproducts);
router.route('/product').post(auth, storeController.addproduct)

router.route('/product/status').post(auth, storeController.updateStatus)

router.route('/product/id')
.post(auth, storeController.single)
.put(auth, storeController.updateSingle)

router.route('/product/color')
.put(auth, storeController.addColor)

router.route('/product/extrainfo')
.put(auth, storeController.updateExtraInfo)

router.route('/product/photos')
.post(auth, storeController.UpdateImages);
router.route('/nearbystores').post(storeController.getNearBuyStores)


router.route('/order/all').get(auth, storeController.myOrders)



module.exports = router;