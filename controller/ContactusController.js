const { sendMail } = require("../util/Contactus");
const Contact = require("../model/ContactUsModel");

const processContactRequest = async (req, res) => {
    try {
        const { email, phone, subject, message, name } = req.body;

        // Basic validation
        if (!email || !phone || !subject || !message || !name) {
            return res.status(400).json({
                error: "Please fill in all fields",
            });
        }

        // Optional: sanitize input
        const trimmedEmail = email.trim().toLowerCase();
        const trimmedSubject = subject.trim();
        const trimmedMessage = message.trim();
        const trimmedName = name.trim();

        // Check if same inquiry already exists
        const duplicate = await Contact.findOne({
            email: trimmedEmail,
            phone: phone,
            subject: trimmedSubject,
            message: trimmedMessage,
            name: trimmedName,
        });

        if (duplicate) {
            return res.status(400).json({
                error: "You have already submitted this inquiry",
            });
        }

        // Save new contact
        const newContact = new Contact({
            email: trimmedEmail,
            phone,
            subject: trimmedSubject,
            message: trimmedMessage,
            name: trimmedName
        });

        await newContact.save();

        // Send mail with proper arguments
        await sendMail(trimmedName, trimmedSubject, trimmedMessage, trimmedEmail);

        return res.status(200).json({
            success: "Message sent successfully!",
        });

    } catch (error) {
        console.error("Error processing contact request:", error);
        return res.status(500).json({
            error: "Something went wrong. Please try again later.",
        });
    }
};

module.exports = { processContactRequest };
