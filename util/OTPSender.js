// // const mailer = require("nodemailer");
// // require("dotenv").config()
// // const _email = process.env.EMAIL
// // const _pass = process.env.PASS


// // const sendMail = async (to, subject, text) => {
// //     // Creating the transporter with Gmail service
// //     const transport = mailer.createTransport({
// //         service: "smtp.gmail.com",
// //         secure: false,
// //         port: 465,
// //         auth: {
// //             user: _email,
// //             pass: _pass
// //         }
// //     });

// //     const mailOptions = {
// //         from: `"PadhaiHub" <${_email}>`, // Sender's email
// //         to: to,                      // Recipient's email
// //         subject: subject,            // Subject of the email
// //         html: `${text}`,     // HTML body content

// //     };

// //     // try {
// //     //     const mailRes = await transport.sendMail(mailOptions); // Send the email
// //     //     console.log("Mail Sent Successfully: ", mailRes);
// //     //     return mailRes;
// //     // } catch (error) {
// //     //     console.error('Error sending mail: ', error);
// //     //     throw error; // It's better to throw the error with the correct object
// //     // }
// //     try {
// //         // recommended: verify connection config first (helps debugging)
// //         await transport.verify();
// //         const info = await transport.sendMail(mailOptions);
// //         console.log("Mail Sent Successfully: ", info);
// //         return info;
// //     } catch (err) {
// //         console.error("Error sending mail: ", err);
// //         throw err;
// //     }
// // };

// // module.exports = {
// //     sendMail
// // };


// // // otpsender.js (or mailer.js)
// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const _email = process.env.EMAIL;
// const _pass = process.env.PASS;

// if (!_email || !_pass) {
//     console.warn("EMAIL or PASS env vars are missing. Check your .env file.");
// }

// const transport = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true, // true for port 465, false for 587
//     auth: {
//         user: _email,
//         pass: _pass, // use App Password or OAuth2 for real Gmail accounts
//     },
//     // optional: add tls if you need to accept self-signed certs
//     // tls: { rejectUnauthorized: false }
// });

// const sendMail = async (to, subject, html) => {
//     const mailOptions = {
//         from: `"PadhaiHub" <${_email}>`,
//         to,
//         subject,
//         html,
//     };

//     try {
//         // recommended: verify connection config first (helps debugging)
//         await transport.verify();
//         const info = await transport.sendMail(mailOptions);
//         console.log("Mail Sent Successfully: ", info);
//         return info;
//     } catch (err) {
//         console.error("Error sending mail: ", err);
//         throw err;
//     }
// };

// module.exports = { sendMail };


const nodemailer = require("nodemailer");
require("dotenv").config();

const _email = process.env.EMAIL;
const _pass = process.env.PASS;

if (!_email || !_pass) {
    console.warn("EMAIL or PASS env vars are missing. Check your .env file.");
}

const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for port 465, false for 587
    auth: {
        user: _email,
        pass: _pass, // use App Password or OAuth2 for real Gmail accounts
    },
    // optional: add tls if you need to accept self-signed certs
    // tls: { rejectUnauthorized: false }
});

const sendMail = async (to, subject, html) => {
    const mailOptions = {
        from: `"PadhaiHub" <${_email}>`,
        to,
        subject,
        html,
    };

    try {
        // recommended: verify connection config first (helps debugging)
        await transport.verify();
        const info = await transport.sendMail(mailOptions);
        console.log("Mail Sent Successfully: ", info);
        return info;
    } catch (err) {
        console.error("Error sending mail: ", err);
        throw err;
    }
};

module.exports = { sendMail };
