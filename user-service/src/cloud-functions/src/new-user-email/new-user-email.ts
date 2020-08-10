let nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
  auth: {
    user: process.env['EMAIL'],
    pass: process.env['PASSWORD']
  }
})

const messageTemplate = {
    from: process.env['EMAIL'],
    to: '',
    subject: 'Welcome to Moderately Okay',
    text: 'Enjoy your new account and I hope you plan to get a lot tattoos'
}



/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
exports.newUserEmail = (event, context) => {
    let newUser = JSON.parse(Buffer.from(event.data, 'base64').toString())
    messageTemplate.to = newUser.email
    transporter.sendMail(messageTemplate)
};
 
  

