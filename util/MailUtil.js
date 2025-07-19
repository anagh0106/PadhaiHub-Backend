const mailer = require("nodemailer");
const path = require("path");

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

    const mailOptions = {
        from: `"Anagh" <anagh0106@gmail.com>`, // Ensure sender email matches the authenticated account
        to: to,
        subject: subject,
        html: `<h1>${text}</h1>`,
        // attachments: [
        //     {
        //         filename: "welcome.gif",
        //         path: path.join(__dirname, "welcome.gif"),
        //     }
        // ]
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
