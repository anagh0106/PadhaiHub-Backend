const mailer = require("nodemailer");
require("dotenv").config()
const _email=process.env.EMAIL
const _pass=process.env.PASS

const sendMail = async (to, subject, text) => {
    // Creating the transporter with Gmail service
    const transport = mailer.createTransport({
        service: "gmail",
        auth: {
            user: _email,
            pass: _pass
        }
    });

    const mailOptions = {
        from: `"PadhaiHub" <${_email}>`, // Sender's email
        to: to,                      // Recipient's email
        subject: subject,            // Subject of the email
        html: `${text}`,     // HTML body content

    };

    try {
        const mailRes = await transport.sendMail(mailOptions); // Send the email
        console.log("Mail Sent Successfully: ", mailRes);
        return mailRes;
    } catch (error) {
        console.error('Error sending mail: ', error);
        throw error; // It's better to throw the error with the correct object
    }
};

module.exports = {
    sendMail
};
