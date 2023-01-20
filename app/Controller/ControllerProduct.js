Product = require('../Model/ModelProducts');

exports.index = function (req, res) {

    Product.get(function (err, data) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Contacts retrieved successfully",
            data: data
        });
    });
};
// Handle create contact actions
exports.new = function (req, res) {
    const commisionFee = 1.06;
    var product = new Product(req.body);
    const storeRate = product.storeRate;
    const discountPercentage = product.discountPercentage;
    var sellingRate = product.storeRate;
    if(discountPercentage && discountPercentage > 0){
        sellingRate = (storeRate - (storeRate * discountPercentage) / 100).toFixed(2);
    }
    const rateBeforeDiscount =(storeRate * commisionFee).toFixed(2);
    sellingRate = (sellingRate * commisionFee).toFixed(2);

    product.rate = sellingRate;
    product.rateBeforeDiscount = rateBeforeDiscount;

    product.save(function (err) {
        // Check for validation error
        if (err)
        res.json({ status: 1, message: err.message });
        else
            res.json({ status: 1, message: 'New product created!', data: product });
    });
};

exports.view = function (req, res) {

    Product.find({isActive: true}, function (err, data) {
        if (err)
            res.send(err);
        res.json({
            message: 'Contact details loading..',
            data: data
        });
    });
};


exports.products = function (req, res) {
    
    const { category, featured, } = req.body 
    var filter = { isActive: true } 
    if(category)
    Object.assign(filter, {category})
    if(featured)
    Object.assign(filter, {featured})

    Product.find(filter, function (err, data) {
        if (err) {return res.json({ status:0, message:err.message}); }
        
        
        res.json({ status:1, message: 'Success', data: data });
    });
};


// // Handle update contact info
// exports.update = function (req, res) {
//     Contact.findById(req.params.contact_id, function (err, contact) {
//         if (err)
//             res.send(err);
//         contact.name = req.body.name ? req.body.name : contact.name;
//         contact.gender = req.body.gender;
//         contact.email = req.body.email;
//         contact.phone = req.body.phone;
// // save the contact and check for errors
//         contact.save(function (err) {
//             if (err)
//                 res.json(err);
//             res.json({
//                 message: 'Contact Info updated',
//                 data: contact
//             });
//         });
//     });
// };
// // Handle delete contact
// exports.delete = function (req, res) {
//     Contact.remove({
//         _id: req.params.contact_id
//     }, function (err, contact) {
//         if (err)
//             res.send(err);
//         res.json({
//             status: "success",
//             message: 'Contact deleted'
//         });
//     });
// };