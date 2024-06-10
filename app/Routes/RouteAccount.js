let router = require('express').Router();
const axios = require('axios');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const ListData = require('../../utils/filedata')
const fileList = require('../../utils/changeName')


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


router.get('/accas', async function (req, res) {
   
    const localFolderPath = './images'; 
    if (!fs.existsSync(localFolderPath)) {
      fs.mkdirSync(localFolderPath);
    }
    ListData.forEach(async element => {
        const webpImageUrl = 'https://glambeaute.com/wp-content/uploads/2023/05/6294015147360_1.webp';
        await downloadAndConvertImage(element, localFolderPath);
    });
    

    
    res.json({
        status: 'API',
        message: 'Welcome to ZainExpress.ae',
    });
});



async function downloadAndConvertImage(url, localFolderPath) {
    try {
      
      const match = url.match(/\/(\d+_1)\.webp$/);
      const extractedString = match[1];
      const localPath = path.join(localFolderPath, extractedString)

      const response = await axios.get(url, { responseType: 'arraybuffer' });
  
      // Create a buffer from the response data
      const buffer = Buffer.from(response.data, 'binary');
  
      // Determine the file extension from the URL
      const fileExtension = path.extname(url);
  
      // Convert WebP buffer to JPG buffer using sharp
      //const jpgBuffer = await sharp(buffer).jpeg().toBuffer();
      const jpgBuffer = await sharp(buffer)
      .jpeg({
        quality: 100,
        progressive: true,
        force: false,
        trellisQuantisation: true,
        overshootDeringing: true,
      })
      .toBuffer();
  
      // Save the converted image to the local path with a .jpg extension
      fs.writeFileSync(localPath + '.jpg', jpgBuffer);
  
      console.log('Image downloaded and converted successfully!');
    } catch (error) {
      console.error('Error downloading and converting image:', error.message);
    }
  }



  router.get('/change', async function (req, res) {
   
    const localFolderPath = './images'; 
    if (!fs.existsSync(localFolderPath)) {
      fs.mkdirSync(localFolderPath);
    }

    fileList.forEach((item) => {
      const currentFilename = `${item.img}.jpg`;
      const newFilename = `${item.new}.MAIN.jpg`;
    
      const currentPath = path.join(localFolderPath, currentFilename);
      const newPath = path.join(localFolderPath, newFilename);
    
      fs.rename(currentPath, newPath, (err) => {
        if (err) {
          console.error(`Error renaming file ${currentFilename}:`, err);
        } else {
          console.log(`File ${currentFilename} renamed to ${newFilename}`);
        }
      });
    });



    
    res.json({
        status: 'API',
        message: 'Welcome to ZainExpress.ae',
    });
});



module.exports = router;