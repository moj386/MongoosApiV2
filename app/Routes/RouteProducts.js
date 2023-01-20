let router = require('express').Router();

var productController = require('../Controller/ControllerProduct');


// router.route('/addproduct')
//     .get(productController.index)
//     .post(productController.new);

router.route('/product')
    .post(productController.products)


router.route('/product/:product_id')
    .get(productController.view)
    // .patch(productController.update)
    // .put(productController.update)
    // .delete(productController.delete);





    
module.exports = router;