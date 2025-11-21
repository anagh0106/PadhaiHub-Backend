// require("dotenv").config();
// const mailer = require("nodemailer");

// const sendMail = async (from, subject, text, userEmail) => {
//     const transport = mailer.createTransport({
//         host: "smtp.gmail.com",
//         port: 465,
//         secure: true,
//         auth: {
//             user: process.env.EMAIL_USER, // admin gmail
//             pass: process.env.EMAIL_PASS, // app password
//         }
//     });

//     const mailOptions = {
//         from: `"Inquiry Bot" <${process.env.EMAIL_USER}>`,
//         to: `"Admin" <${process.env.EMAIL_USER}>`,
//         subject: subject || "New Inquiry", // Fallback subject
//         html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
//             <div style="text-align: center;">
//                 <img src="https://cdn-icons-png.flaticon.com/512/5465/5465858.png" alt="Inquiry" width="60" />
//                 <h2 style="color: #333;">New Inquiry Received</h2>
//             </div>

//             <table style="width: 100%; margin-top: 20px; font-size: 16px;">
//                 <tr>
//                     <td style="font-weight: bold; width: 120px;">Name:</td>
//                     <td>${from || "Not Provided"}</td>
//                 </tr>
//                 <tr>
//                     <td style="font-weight: bold;">Email:</td>
//                     <td>${userEmail || "Not Provided"}</td>
//                 </tr>
//                 <tr>
//                     <td style="font-weight: bold;">Subject:</td>
//                     <td>${subject || "No Subject"}</td>
//                 </tr>
//                 <tr>
//                     <td style="font-weight: bold; vertical-align: top;">Message:</td>
//                     <td style="white-space: pre-line; color: #555;">${text || "No message provided"}</td>
//                 </tr>
//             </table>

//             <p style="margin-top: 30px; text-align: center; font-size: 14px; color: #888;">
//                 This is an automated notification from your website's inquiry form.
//             </p>
//         </div>
//         `,
//         replyTo: userEmail || undefined
//     };

//     try {
//         const mailRes = await transport.sendMail(mailOptions);
//         console.log("✅ Mail Sent Successfully:", mailRes.messageId);
//         return mailRes;
//     } catch (error) {
//         console.error("❌ Error sending mail:", error);
//         throw error;
//     }
// };


// module.exports = {
//     sendMail
// };


require("dotenv").config();
const mailer = require("nodemailer");

const sendMail = async (from, subject, text, userEmail) => {
    const transport = mailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS,
        }
    });

    const mailOptions = {
        from: `"Inquiry Bot" <${process.env.EMAIL}>`,
        to: `"Admin" <${process.env.EMAIL}>`,  // FIXED
        subject: subject || "New Inquiry",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
            <div style="text-align: center;">
                <img src="https://cdn-icons-png.flaticon.com/512/5465/5465858.png" alt="Inquiry" width="60" />
                <h2 style="color: #333;">New Inquiry Received</h2>
            </div>

            <table style="width: 100%; margin-top: 20px; font-size: 16px;">
                <tr>
                    <td style="font-weight: bold; width: 120px;">Name:</td>
                    <td>${from || "Not Provided"}</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">Email:</td>
                    <td>${userEmail || "Not Provided"}</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">Subject:</td>
                    <td>${subject || "No Subject"}</td>
                </tr>
                <tr>
                    <td style="font-weight: bold; vertical-align: top;">Message:</td>
                    <td style="white-space: pre-line; color: #555;">${text || "No message provided"}</td>
                </tr>
            </table>

            <p style="margin-top: 30px; text-align: center; font-size: 14px; color: #888;">
                This is an automated notification from your website's inquiry form.
            </p>
        </div>
        `,
        replyTo: userEmail || undefined
    };

    try {
        const mailRes = await transport.sendMail(mailOptions);
        console.log("✅ Mail Sent Successfully:", mailRes.messageId);
        return mailRes;
    } catch (error) {
        console.error("❌ Error sending mail:", error);
        throw error;
    }
};

module.exports = {
    sendMail
};
