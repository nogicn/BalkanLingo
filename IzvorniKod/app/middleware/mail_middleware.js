const nodemailer = require('nodemailer');
const sendEmail = (email, password) => 
{
    // Create a transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // SMTP server host for Gmail
    port: 587, // SMTP port for TLS
    secure: false, // false for TLS - as long as you're not using SSL
      auth: {
        user: 'balkanlingo@gmail.com',
        pass: process.env.GMAIL_KEY //ne diraj
      },
    });
  
    // Define the email content
    const mailOptions = {
      from: 'balkanlingo@gmail.com',
      to: email,
      subject: 'Password reset',
      html: `
      <html>
        <head></head>
        <body style="font-family: 'Arial', sans-serif;
          background-color: #f0f0f0; padding: 10%">
          <div class="container" style="max-width: 600px;
              margin: 20px auto;
              padding: 20px;
              background-color: #fff;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <h1 style="color: #333;
                  text-align: center;">Vaša jednokratna lozinka</h1>
            <p style="color: #666;">
              <strong>Email:</strong> ${email}
            </p>
            <img style="display:none">
            <p style="color: #666;">
              <strong>Jednokratna lozinka:</strong> ${password}
            </p>
            <div class="button-container" style="text-align: center;">
              <a href="https://balkanlingo.online/login" class="button" style="display: inline-block;
                  padding: 10px 20px;
                  font-size: 16px;
                  text-align: center;
                  text-decoration: none;
                  background-color: #4CAF50;
                  color: #fff;
                  border-radius: 5px;
                  cursor: pointer;">Prijavi se</a>
            </div>
            <hr>
            <p style="color: #666;">
              <strong>Molimo vas da se što prije prijavite u sustav i promijenite lozinku.</strong>
            </p>
            <h6 style="color: #4CA;">
              <i>Balkan Lingo, FER projekt</i>
              <h6>
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
  
}

module.exports = sendEmail;