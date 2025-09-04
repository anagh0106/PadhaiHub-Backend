const PayModel = require("../model/PaymentModel");
const studentModel = require("../model/StudentInfoModel");

const sendRequest = async (req, res) => {
  try {
    const email = req.user?.email;
    console.log("Email:", email);

    const data = await PayModel.findOne({ email }).populate("StudentInfo");
    console.log("Payment Data:", data);

    return res.json({ email, data });
  } catch (error) {
    console.error("Error in sendRequest:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  sendRequest,
};
