const router = require('express').Router();
const auth = require("../../middleware/auth");

var customerController = require('../Controller/ControllerCustomers');

router.route('/otprequest').post(customerController.otp_request); 
router.route('/login').post(customerController.login); 
router.route('/login').put(auth, customerController.register);
router.route('/otp').post(customerController.login_register);



   

router.route('/loginstatus')
.post(auth, customerController.loginstatus); 

router.route('/address')
.post(auth, customerController.newAddress)
.delete(auth, customerController.deleteAddress)
.put(auth, customerController.updateAddress)
.get(auth,customerController.viewAddress)

router.route('/address/id').get(auth,customerController.viewAddress_single)
router.route('/address/default').post(auth,customerController.setDefaultAddress)



router.route('/cart')
.get(auth,customerController.viewCart)
.post(auth, customerController.addCart)
.delete(auth, customerController.deleteCart)
.put(auth, customerController.setCart)

router.route('/order').post(auth, customerController.addOrder)
router.route('/order/instruction').post(customerController.updateOrderInstruction)


router.route('/order/id')
.post(auth, customerController.viewOrder)

router.route('/order/all')
.get(auth, customerController.viewOrders)

router.route('/order/repeat')
.post(auth, customerController.repeatOrder)

router.route('/order/home')
.get(auth, customerController.viewOrderHome)




router.route('/products').post(customerController.products)
router.route('/store/id').post(customerController.see_store)
router.route('/payment').post(auth, customerController.makePayment)
router.route('/payment/cash').post(auth, customerController.makeCashPayment)




router.route('/wishlist/products').post(auth, customerController.add_wishlist_products)
router.route('/wishlist/restaurant').post(auth, customerController.add_wishlist_restaurant)

router.route('/wishlist/products').get(auth, customerController.view_wishlist_products)
router.route('/wishlist/restaurant').get(auth, customerController.view_wishlist_restaurant)


router.route('/search').post(customerController.search)
router.route('/account/delete').post(auth, customerController.deleteAccount)




module.exports = router;