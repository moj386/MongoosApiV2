let router = require('express').Router();
// Set default API response
router.get('/', function (req, res) {
    res.json({
        status: 'API',
        message: 'Welcome to ZainExpress.ae',
    });
});
// Import contact controller
var contactController = require('../Controller/ControllerAccount');
// Contact routes
router.route('/contacts')
    .get(contactController.index)
    .post(contactController.new);

router.route('/contacts/:contact_id')
    .get(contactController.view)
    // .patch(contactController.update)
    // .put(contactController.update)
    // .delete(contactController.delete);
// Export API routes
module.exports = router;