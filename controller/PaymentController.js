// const PayModel = require("../model/PaymentModel");
// const studentModel = require("../model/StudentInfoModel");

// const sendRequest = async (req, res) => {
//   try {
//     const email = req.user?.email;
//     console.log("Email:", email);

//     const data = await studentModel.findOne({ email })
//     console.log("Payment Data:", data);

//     const getting = await PayModel.findOne({ email }).populate('studentData')
//     console.log("Fetch Data ", getting);

//     // const newData = await PayModel.create({
//     //   email,
//     //   data
//     // })

//     // return res.json({ newData });
//   } catch (error) {
//     console.error("Error in sendRequest:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// module.exports = {
//   sendRequest,
// };


const PayModel = require("../model/PaymentModel");
const StudentModel = require("../model/StudentInfoModel");

const sendRequest = async (req, res) => {
  try {
    const email = req.user?.email;
    console.log("Email:", email);

    const studentData = await StudentModel.findOne({ email })
    console.log(studentData);

  } catch (error) {
    console.error("Error in sendRequest:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const getAllRequest = async (req, res) => {
  try {
    const getAllStudents = await PayModel.find()
  } catch (error) {
    console.error("Error in sendRequest:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  sendRequest,
  getAllRequest
};
