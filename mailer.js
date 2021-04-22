const nodemailer = require('nodemailer');

const sendEmail = (to, message) => new Promise((resolve, reject) => {
  const from = process.env.EMAIL;
  const email = from;
  const password = process.env.PASSWORD;
  const smtpTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: email,
      pass: password,
    },
  });
  const mailOptions = {
    from,
    to,
    subject: 'StudyMate',
    text: message,
  };
  smtpTransport.sendMail(mailOptions, (error) => {
    if (error) {
      reject(error);
    } else {
      resolve('Mail sent successfully');
    }
  });
});

module.exports = sendEmail;
