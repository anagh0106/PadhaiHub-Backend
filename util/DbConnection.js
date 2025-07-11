// const mongoose = require("mongoose"); // Corrected spelling of "mongoose"
// const MONGO_URI = "mongodb+srv://anagh0106:nMYDSCNmmp89XBRr@cluster0.bnc2r.mongodb.net/alpeshpatel?retryWrites=true&w=majority&appName=Cluster0"
// // mongodb+srv://anagh0106:nMYDSCNmmp89XBRr@cluster0.bnc2r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
// // const uri = "mongodb://127.0.0.1:27017/alpeshpatel";
// const dbConnection = async () => {
//     try {
//         await mongoose.connect(MONGO_URI);
//         console.log("Database Connection Established Successfully!");
//     } catch (err) {
//         console.error("Database Connection Error:", err);
//     }
// };

// module.exports = { dbConnection };

const mongoose = require("mongoose");
require("dotenv").config();
const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Database Connection Established Successfully!");
    } catch (err) {
        console.error("❌ Database Connection Error:", err.message);
    }
};

module.exports = { dbConnection };
