const mongoose = require("mongoose")
const schema = mongoose.Schema

const contactus = new schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            validate: {
                validator: function (v) {
                    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v); // Simple email validation
                },
                message: props => `${props.value} is not a valid email address!`
            }

        },
        phone: {
            type: String,
            required: true,
            validate: {
                validator: function (v) {
                    return /\d{10}/.test(v); // Simple validation for 10-digit phone numbers
                },
                message: props => `${props.value} is not a valid phone number!`
            }

        },
        subject: {
            type: String,
            required: true,
            maxlength: 100 // Limit subject length to 100 characters

        },
        message: {
            type: String,
            required: true,
            maxlength: 500 // Limit message length to 500 characters

        }
    }
)

module.exports = mongoose.model("ContactUs", contactus)