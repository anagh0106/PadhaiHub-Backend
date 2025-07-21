const mailer = require("nodemailer");
require("dotenv").config({ path: "../.env" })
const email = process.env.EMAIL_USER
const pass = process.env.EMAIL_PASS

const sendMail = async (to, subject, text) => {
    const transport = mailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: email,
            pass: pass
        }
        // auth: {
        //     user: "anagh0106@gmail.com",
        //     pass: "gfzhwajbdcdqpttd"
        // }
    });

    const mailOptions = {
        from: `"Anagh Patel" <${email}>`, // Ensure sender email matches the authenticated account
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
