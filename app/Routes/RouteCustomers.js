const router = require('express').Router();
const auth = require("../../middleware/auth");

var customerController = require('../Controller/ControllerCustomers');




router.route('/otprequest').post(customerController.otp_request); 
router.route('/login').post(customerController.login); 
router.route('/login').put(auth, customerController.register);

   

router.route('/loginstatus')
.post(auth, customerController.loginstatus); 

router.route('/address')
.post(auth, customerController.newAddress)
.delete(auth, customerController.deleteAddress)
.put(auth, customerController.updateAddress)
.get(auth,customerController.viewAddress)

router.route('/cart')
.get(auth,customerController.viewCart)
.post(auth, customerController.addCart)
.delete(auth, customerController.deleteCart)

router.route('/order')
.post(auth, customerController.addOrder)


router.route('/products').post(auth, customerController.products)
router.route('/store/id').post(auth, customerController.see_store)
router.route('/payment').post(auth, customerController.makePayment)


module.exports = router;