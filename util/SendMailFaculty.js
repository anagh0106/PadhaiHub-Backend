const mailer = require("nodemailer");
require("dotenv").config()
const _email = process.env.EMAIL
const _pass = process.env.PASS

const sendMail = async (to, subject, text) => {
    const transport = mailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: _email,
            pass: _pass
        }
    });

    const mailOptions = {
        from: `"Padhaihub Admin" <${_email}>`, // Ensure sender email matches the authenticated account
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
