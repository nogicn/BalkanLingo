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
    html: `
    <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              background-color: #f4f4f4;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              padding: 20px;
              background-color: #fff;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #333;
              text-align: center;
            }
            p {
              color: #666;
            }
            h6 {
              color: #4CA;
            }
            .button-container {
              text-align: center;
            }
            .button {
              display: inline-block;
              padding: 10px 20px;
              font-size: 16px;
              text-align: center;
              text-decoration: none;
              background-color: #4CAF50;
              color: #fff;
              border-radius: 5px;
              cursor: pointer;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Vaša jednokratna lozinka</h1>
            <p><strong>Username:</strong> ${name}</p>
            <p><strong>Jednokratna lozinka:</strong> ${email}</p>
            <div class="button-container"><a href="138.201.184.55:3000" class="button">Prijavi se</a></div>
            <hr>
            <p><strong>Molimo vas da se što prije se prijavite u sustav i promjenite lozinku.</p>
            <h6><i>Balkan Lingo, FER projekt</i><h6> 
          </div>
        </body>
      </html>
    `,
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