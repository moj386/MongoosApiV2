const router = require('express').Router();
const auth = require("../../middleware/auth");

var adminController = require('../Controller/ControllerAdmin');


router.route('/register').post(adminController.register); 
router.route('/login').post(adminController.login);

   


module.exports = router;