const router = require('express').Router();
const auth = require("../../middleware/auth");

var masterController = require('../Controller/ControllerMaster');

router.route('/dates')
.get(masterController.viewDates);

router.route('/times')
.post(masterController.viewTimes);

router.route('/categories')
.get(masterController.GetCategories)
.post(masterController.AddCategories)

router.route('/subcategories')
.get(masterController.GetsubCategories)
.post(masterController.AddsubCategories)

router.route('/origins')
.get(masterController.GetOrigins)
.post(masterController.AddOrigins)

router.route('/units')
.get(masterController.GetUnits)
.post(masterController.AddUnits)

router.route('/brands')
.get(masterController.GetBrands)
.post(masterController.AddBrands)

router.route('/tags')
.get(masterController.GetTags)
.post(masterController.AddTags)

router.route('/featured')
.get(masterController.GetFeatured)

router.route('/colors')
.get(masterController.GetColors)

router.route('/sizes')
.get(masterController.GetSizes)


// router.route('/login')
// .post(customerController.login);    

// router.route('/loginstatus')
// .post(auth, customerController.loginstatus); 

// router.route('/address')
// .post(auth, customerController.newAddress)
// .delete(auth, customerController.deleteAddress)
// .put(auth, customerController.updateAddress)
// .get(auth,customerController.viewAddress)

// router.route('/cart')
// .get(auth,customerController.viewCart)
// .post(auth, customerController.addCart)
// .delete(auth, customerController.deleteCart)


module.exports = router;