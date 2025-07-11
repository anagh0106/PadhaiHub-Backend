const cardmodel = require("../model/CardModel");

const addCard = async (req, res) => {
    try {
        const { id, text, title, image } = req.body;

        if (!id || !text || !title) {
            return res.status(400).json({
                message: "Please enter all the required fields: id, text, and title"
            });
        }

        const cardData = await cardmodel.create({
            id,
            text,
            title,
            image
        });

        if (cardData) {
            return res.status(201).json({
                message: "Card details successfully added!",
                cardDetails: cardData
            });
        }

        return res.status(500).json({
            message: "Internal Server Error",
        });

    } catch (error) {
        console.error("Error while adding card: ", error);
        return res.status(500).json({
            message: "Something went wrong!",
            error: error.message
        });
    }
}

const getAllCard = async (req, res) => {
    try {
        const cards = await cardmodel.find()

        if (cards.length === 0) {
            return res.status(404).json({
                message: "We are unable to find the cards!",
            })
        }
        return res.status(200).json({
            message: "Cards Retrived Successfully!",
            cards: cards,
        })
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error !",
            error: err.message,
        })
    }
}

module.exports = {
    addCard,
    getAllCard
}
