Masters = require('../Model/ModelMasters');
var moment = require('moment');
const Times = Masters.Times;
const Categories = Masters.Categories;
const subCategories = Masters.subCategories;
const Origins = Masters.Origins;
const Units = Masters.Units;
const Brands = Masters.Brands;
const Tags = Masters.Tags;
const Featured = Masters.Featured;

const Colors = Masters.Colors;
const Sizes = Masters.Sizes;

exports.viewDates = async function (req, res) {
    try {

        const __thisDate = new Date();
        var c = moment(__thisDate);
        var a = moment(__thisDate);
        var b = moment(c.add(5, 'days'));
        const __timeNow = moment().format('HH');
        if (__timeNow > 17) {
            a = moment(a.add(1, 'days'));
        }
        var dateArray = []
        for (var m = moment(a); m.isBefore(b); m.add(1, 'days')) {
            dateArray.push(m.format('YYYY-MM-DD'))
        }
        res.json({ status: 1, message: 'Success', data: dateArray });

    } catch (err) {
        res.json({ status: 0, message: err.message });
    }
};

exports.viewTimes = async function (req, res) {
    try {

        const {date} = req.body;
        var a = moment(date);

        const req_dd = a.format('DD')
        const now_dd = moment().format('DD');
        const now_hh = moment().format('HH');

        if(req_dd < now_dd){
            res.json({ status: 0, message: 'No slot available' });
            return
        }

        Times.find({}, function(err, data) {
            var result = data
            if( req_dd == now_dd){
                result = data.filter(x=> x.timeEnd >= now_hh)
            }
            res.json({ status: 1, message: 'Success', data: result });
            return
         })

    } catch (err) {
        res.json({ status: 0, message: err.message });
    }
};

exports.GetCategories = async function (req, res) {
    try{
       const data =  await Categories.find()
       res.json({ status: 1, message: 'Success', data });

    }catch(err){
        res.json({ status: 0, message: err.message });
    }
};

exports.AddCategories = async function (req, res) {
    try{
        const category = new Categories(req.body)
        await category.save()
        res.json({ status: 1, message: 'Success', data: category });
    }catch(err){
        res.json({ status: 0, message: err.message });
    }
};

exports.GetsubCategories = async function (req, res) {
    const { category_docno } = req.body
    try{
       const data =  await subCategories.find({category_docno})
       res.json({ status: 1, message: 'Success', data });

    }catch(err){
        res.json({ status: 0, message: err.message });
    }
};

exports.AddsubCategories = async function (req, res) {
    try{
        const category = new subCategories(req.body)
        await category.save()
        res.json({ status: 1, message: 'Success', data: category });
    }catch(err){
        res.json({ status: 0, message: err.message });
    }
};

exports.GetOrigins = async function (req, res) {
    try{
       const data =  await Origins.find()
       res.json({ status: 1, message: 'Success', data });
    }catch(err){
        res.json({ status: 0, message: err.message });
    }
};

exports.AddOrigins  = async function (req, res) {
    try{
        var bulk = Origins.collection.initializeUnorderedBulkOp();
        const __data = req.body;
        __data.forEach(item => {
            bulk.insert( { _id: item["alpha-2"], description: item.name, country_code: item["country-code"], isActive: true } );
        });
        bulk.execute();
        res.json({ status: 1, message: 'Success', data: "done" });
    }catch(err){
        res.json({ status: 0, message: err.message });
    }
};

exports.GetUnits = async function (req, res) {
    try{
       const data =  await Units.find()
       res.json({ status: 1, message: 'Success', data });
    }catch(err){
        res.json({ status: 0, message: err.message });
    }
};

exports.AddUnits  = async function (req, res) {
    try{
        const unit = new Units(req.body)
        await unit.save()
        res.json({ status: 1, message: 'Success', data: unit });
    }catch(err){
        res.json({ status: 0, message: err.message });
    }
};


exports.GetBrands = async function (req, res) {
    try{
       const data =  await Brands.find()
       res.json({ status: 1, message: 'Success', data });
    }catch(err){
        res.json({ status: 0, message: err.message });
    }
};

exports.AddBrands  = async function (req, res) {
    try{
        const unit = new Brands(req.body)
        await unit.save()
        res.json({ status: 1, message: 'Success', data: unit });
    }catch(err){
        res.json({ status: 0, message: err.message });
    }
};


exports.GetTags = async function (req, res) {
    try{
       const data =  await Tags.find()
       res.json({ status: 1, message: 'Success', data });
    }catch(err){
        res.json({ status: 0, message: err.message });
    }
};

exports.AddTags  = async function (req, res) {
    try{
        const tage = new Tags(req.body)
        await tage.save()
        res.json({ status: 1, message: 'Success', data: tage });
    }catch(err){
        res.json({ status: 0, message: err.message });
    }
};

exports.GetFeatured = async function (req, res) {
    try{
       const data =  await Featured.find()
       res.json({ status: 1, message: 'Success', data });
    }catch(err){
        res.json({ status: 0, message: err.message });
    }
};

exports.GetColors = async function (req, res) {
    try{
       const data =  await Colors.find()
       res.json({ status: 1, message: 'Success', data });
    }catch(err){
        res.json({ status: 0, message: err.message });
    }
};

exports.GetSizes = async function (req, res) {
    try{
       const data =  await Sizes.find()
       res.json({ status: 1, message: 'Success', data });
    }catch(err){
        res.json({ status: 0, message: err.message });
    }
};