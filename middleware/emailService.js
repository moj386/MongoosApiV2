var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: 'mail.zainexpress.ae',
    port: 465,
    auth: {
      user: 'info@zainexpress.ae',
      pass: 'rexd7~Nuhvyt'
    }
  });
  


  exports.sendEmail = async function (to, subject ,text) {

    var mailOptions = { from: 'info@zainexpress.ae', to, subject, text };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
      } else {
      }
    });
}
