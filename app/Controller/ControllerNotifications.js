var admin = require("firebase-admin");

var ze_account = require("../../assets/ze_admin.json");
var storeController = require('../Controller/ControllerStores');
var adminController = require('../Controller/ControllerAdmin');



var ze_admin = admin.initializeApp({
    credential: admin.credential.cert(ze_account),
    databaseURL: "https://onlinestore-7d8f2-default-rtdb.firebaseio.com"
});


exports.single = async function (req, res) {
    try {
        await ze_admin.messaging().sendMulticast({
            tokens: ['dSgDwcoPckQVpmh1SCAW2h:APA91bGQ4FJHdrfyb7aOiaSN3H22eYkopvQdVHEhQpI8CDfSRufasxtMEW7j4lnE9bUS7jx-BP07MCJCS1vf5zbPDoq2jIJG-mlm3N1SCDD0_yUhZ7d6DRcGRWhUYoZIkr0PX5TwaQ7P'],
            "notification": {
                "title": 'Kibsons',
                "body": 'Kibsons new arrivals'
            },
            "data": {
                "action": "PRODUCTS", "actionParam": "10", "actionType": "EPM", "headerParam": "Notification"
            },
            "apns": {
                "headers": {
                    "mutable-content": "1"
                },
                "payload": {
                    "aps": {
                        "content-available": 1,
                        "sound": "default",
                        "mutable-content": 1
                    },
                },
                "fcm_options": { "image": "https://kibsecomimgstore.blob.core.windows.net/products/display/HPL_GLAORNLXXPCSAC_20220628182236.jpg" }
            },
            "webpush": {
                "headers": { "image": "https://kibsecomimgstore.blob.core.windows.net/products/display/HPL_GLAORNLXXPCSAC_20220628182236.jpg" }
            },
        });
        res.send('sent');
    } catch (error) {
        res.send(error.message);
    }
}

exports.topic = async function (req, res) {
    try {
        const { doctype, docno, action, actionType,actionDocType="", actionParam, title, body, notiType, verifiedImageURL } = req.body

        if (!doctype) {
            res.json({ status: 0, message: "Doctype should not be empty" });
            return
        }
        if (!docno) {
            res.json({ status: 0, message: "Docno should not be empty" });
            return
        }
        if (!title) {
            res.json({ status: 0, message: "Title should not be empty" });
            return
        }

        const topic = notiType === 0 ? "KIBSONS_HOME_2022" : "KIBSONS_PROMOTION_2021"
        const __data = { "action": action, "actionType": actionType, "actionParam": actionParam, "headerParam": title, "actionTitle": title, "doctype": doctype, "docno": docno, actionDocType }

        let payload = {}
        if (verifiedImageURL) {
            payload =
            {
                topic,
                notification: { title, body },
                "data": __data,
                "apns": {
                    "headers": { "mutable-content": "1" },
                    "payload": { "aps": { "content-available": 1, "sound": "default" } },
                    "fcm_options": { "image": verifiedImageURL }
                },
                "webpush": { "headers": { "image": verifiedImageURL } },
            }
        } else {
            payload =
            {
                topic,
                notification: { title, body },
                "data": __data,
                "apns": { "payload": { "aps": { "content-available": 1, "sound": "default" } } },
            }
        } 
        await ze_admin.messaging().send(payload);
        res.json({ status: 1, message: 'Success!', data: 'Sent' });
    } catch (error) {
        res.json({ status: 0, message: error.message });
    }
}

exports.outlook_single = async function (req, res) {
    const { doctype, docno, title, body, fcmToken } = req.body
    try {
        await ze_admin.messaging().sendMulticast({
            tokens: [fcmToken],
            notification: {
                title: title,
                body: body,
            },
            "data": { "doctype": doctype, "docno": docno },
        });
        res.send('sent');
    } catch (error) {
        res.send(error.message);
    }
}



exports.document_notification = async function (req, res) {
    const { doctype, docno, title, body, store_id } = req.body
    try {
        const fcmTokens = await storeController.getFCMToken(store_id)

        await ze_admin.messaging().sendMulticast({
            tokens: fcmTokens,
            notification: { title, body },
            android: {
                priority: "high",
                notification: {
                    channelId: "sound_channel"
                }
            },
            
            "data": { "DOCTYPE": doctype, "DOCNO": docno , "android_channel_id": "yourUniquePushId" },
            "apns": { "payload": { "aps": { "content-available": 1, "sound": "ring.mp3" } } },
        });
        res.json({ status: 1, message: 'Success!', data: 'Sent' });
    } catch (error) {
        res.json({ status: 0, message: error.message });
    }
}


exports.single_notification = async function (title, body, store_id) {

    try {
        const fcmTokens = await storeController.getFCMToken(store_id)
        const fcmTokens2 = await adminController.getFCMToken(store_id)
        const ______token = fcmTokens.concat(fcmTokens2)

        await ze_admin.messaging().sendMulticast({
            tokens: ______token,
            notification: { title, body },
            android: {
                priority: "high",
                notification: {
                    channelId: "sound_channel"
                }
            },
            "data": { "DOCTYPE": '', "DOCNO": '' , "android_channel_id": "yourUniquePushId" },
            "apns": { "payload": { "aps": { "content-available": 1, "sound": "ring.mp3" } } },
        });
    } catch (error) {
    }
}
