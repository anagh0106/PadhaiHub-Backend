const mailer = require("nodemailer");
require("dotenv").config({ path: "../.env" })

const sendMail = async (to, subject, text) => {
    const transport = mailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    console.log(process.env.EMAIL_USER);

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
