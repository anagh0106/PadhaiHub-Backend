const mailer = require("nodemailer");
const path = require("path");
require("dotenv").config({ path: "../.env" })
const email = "padhaihuba@gmail.com"

const sendMail = async (to, subject, text) => {
    // Creating the transporter with Gmail service
    const transport = mailer.createTransport({
        service: "gmail",
        auth: {
            user: "padhaihuba@gmail.com",
            pass: "hrxdidplllheoqcy"
        }
    });

    const mailOptions = {
        from: `"Padhaihub" <${email}>`, // Sender's email
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
