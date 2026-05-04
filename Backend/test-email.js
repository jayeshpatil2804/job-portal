const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
    to: process.env.SENDER_EMAIL, // Send to self
    from: process.env.SENDER_EMAIL,
    subject: 'SendGrid Test',
    text: 'Testing SendGrid API from Node.js',
};

sgMail.send(msg)
    .then(() => {
        console.log('Test email sent successfully');
    })
    .catch((error) => {
        console.error('Error sending test email');
        console.error(error.response.body);
    });
