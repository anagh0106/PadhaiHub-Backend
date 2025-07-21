const mailer = require("nodemailer");
require("dotenv").config({ path: "../.env" })
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded" : "Missing");
const sendMail = async (to, subject, text) => {
    const transport = mailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        // auth: {
        //     user: process.env.EMAIL_USER,
        //     pass: process.env.EMAIL_PASS
        // }
        auth: {
            user: "anagh0106@gmail.com",       // Exact same email
            pass: "gfzhwajbdcdqpttd" // Copy-paste from Google App Passwords
        }
    });

    const mailOptions = {
        from: `"Anagh" <${process.env.EMAIL_USER}>`, // Ensure sender email matches the authenticated account
        to: to,
        subject: subject,
        html: `${text}`,
    };

    try {
        const mailRes = await transport.sendMail(mailOptions);
        console.log("Mail Sent Successfully: ", mailRes);
        return mailRes;
    } catch (error) {
        console.error('Error sending mail: ', error);
        throw error;
    }
};

module.exports = {
    sendMail
};
