const router = require('express').Router();
const auth = require("../../middleware/auth");

var storeController = require('../Controller/ControllerStores');

router.route('/register').post(storeController.register);
router.route('/register').put(storeController.store_update);
router.route('/login').post(storeController.login);    
router.route('/products').get(auth, storeController.myproducts);
router.route('/product').post(auth, storeController.addproduct)
router.route('/list').get(auth, storeController.list)

router.route('/testsms').get(storeController.smstest)


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

router.route('/product/photos')
.delete(auth, storeController.deleteImages);


router.route('/upload/photo')
.post(auth, storeController.update_store_photo);



router.route('/nearbystores').post(storeController.getNearBuyStores)


router.route('/order/all').get(auth, storeController.myOrders)
router.route('/order/id').post(auth, storeController.singleOrders)
router.route('/order/updatestatus').post(auth, storeController.singleOrderStatus)
router.route('/order/payments').get(auth, storeController.myPayments)

router.route('/id').get(auth, storeController.myStore)


router.route('/nearbystoresV2').post(storeController.getNearBuyStoresV2)

router.route('/admin/products').post(auth, storeController.adminProducts);


router.route('/updateFCMToken').post(auth, storeController.updateFCMToken)

router.route('/search/suggestion').post(storeController.getSuggestionList)
router.route('/search/stores').post(storeController.getSearchedStores)
router.route('/search/products').post(storeController.getSearchedProducts)


router.route('/updateKeyword').get(storeController.updateKeywords)

module.exports = router;