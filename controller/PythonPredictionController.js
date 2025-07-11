const { default: axios } = require("axios");
const Prediction = require("../model/PythonPredictionModel");

const savePrediction = async (req, res) => {
    try {
        const { hours } = req.body;
        const email = req.user?.email; 

        if (typeof hours !== 'number' || hours < 0 || hours > 12) {
            return res.status(400).json({
                message: "Hours must be a number between 0 and 12",
            });
        }

        // 🔗 Call Flask API
        const flaskResponse = await axios.post('http://localhost:5000/predict', {
            hours,
        });

        const predictedScore = flaskResponse.data.predicted_score;

        // 📦 Save in MongoDB
        const prediction = new Prediction({
            hours,
            predictedScore,
            //   email, // If you want to store email too
        });

        await prediction.save();

        return res.status(201).json({
            message: '✅ Prediction successful and saved!',
            prediction,
        });

    } catch (error) {
        console.error("❌ Error:", error.message);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};
const getAllPredictions = async (req, res) => {
    try {
        const history = await Prediction.find().sort({ createdAt: -1 });
        res.status(200).json(history);
    } catch (error) {
        console.error("❌ Error fetching predictions:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    savePrediction,
    getAllPredictions,
};
