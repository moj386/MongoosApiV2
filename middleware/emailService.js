var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: 'mail.zainexpress.ae',
    port: 465,
    auth: {
      user: 'info@zainexpress.ae',
      pass: 'rexd7~Nuhvyt'
    }
  });
  
  var mailOptions = {
    from: 'info@zainexpress.ae',
    to: 'umair@kibsons.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
  };
  
  const sendEmail = ()=>
  
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  module.exports = sendEmail;