let express = require('express');
const dbConfig = require('./config/database.js');
var cors = require('cors');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const accountRoutes = require('./app/Routes/RouteAccount');
const productRoutes = require('./app/Routes/RouteProducts');
const customerRoutes = require('./app/Routes/RouteCustomers');
const masterRoutes = require('./app/Routes/RouteMasters');
const storesRoutes = require('./app/Routes/RouteStores');

var port = process.env.PORT || 5000;
let app = express();

app.use(cors());
app.options('*', cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

app.get('/', (req, res) => res.send('Hello World with Express'));

app.use('/account', accountRoutes);
app.use('/shop', productRoutes);
app.use('/customer', customerRoutes);
app.use('/other', masterRoutes)
app.use('/store', storesRoutes)

app.listen(port, () => {
    console.log("Server is listening on port 5000");
});
