const router = require('express').Router();
const auth = require("../../middleware/auth");

var adminController = require('../Controller/ControllerAdmin');


router.route('/register').post(adminController.register); 
router.route('/login').post(adminController.login);
router.route('/orders/pending').get(auth,adminController.viewPendingOrders);
   


module.exports = router;