const homePageText1 = async (req, res) => {
    try {
        const mainText = "Best Tuition Classes in the City";
        const headingLine1 = "Excel in Your";
        const headingLine2 = "Academic Journey";
        const description = "Join thousands of successful students at PadhaiHub. Expert teachers, personalized attention, and proven results for Classes 11 & 12.";

        return res.status(200).json({
            mainText,
            headingLine1,
            headingLine2,
            description
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error !"
        });
    }
};

module.exports = {
    homePageText1
};
