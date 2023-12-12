const express = require('express');
const path = require("path");
const nodemailer = require('nodemailer');
const fs = require('fs');

const router = express.Router();

router.post('/sendMessage', (req, res) => {
  var generatedKey = 'Nogic';
  var emailSend = 'balkanlingo@gmail.com';

  // Create a transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // SMTP server host for Gmail
  port: 587, // SMTP port for TLS
  secure: false, // false for TLS - as long as you're not using SSL
    auth: {
      user: 'balkanlingo@gmail.com',
      pass: '***REMOVED***',
    },
  });

  // Define the email content
  const mailOptions = {
    from: 'balkanlingo@gmail.com',
    to: emailSend,
    subject: 'Password set',
    text: 'Proba',
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });

  res.redirect("/");
});

module.exports = router;
