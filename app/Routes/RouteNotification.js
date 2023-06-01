let router = require('express').Router();

//const auth = require("../../middleware/auth");

let notificationController = require('../Controller/ControllerNotifications')

router.route('/single')
    .post(notificationController.single)
router.route('/topic')
    .post(notificationController.topic)
router.route('/outlook')
    .post(notificationController.outlook_single)
router.route('/document')
    .post(notificationController.document_notification)   
    
module.exports = router;