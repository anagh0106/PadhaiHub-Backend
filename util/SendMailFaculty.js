const mailer = require("nodemailer");
require("dotenv").config({ path: "../.env" })
const email="padhaihuba@gmail.com"

const sendMail = async (to, subject, text) => {
    const transport = mailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "padhaihuba@gmail.com",
            pass:"hrxdidplllheoqcy"
        }
    });

    const mailOptions = {
        from: `"Padhaihub Admin" <${email}>`, // Ensure sender email matches the authenticated account
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
