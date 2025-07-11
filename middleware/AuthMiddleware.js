const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check if token is present
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];

    try {
        // Verify and decode token
        const decoded = jwt.verify(token, "Galu_0106");

        // Attach user to request object
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role || "user",
            studentId: decoded.studentId,
        };

        next();
    } catch (err) {
        console.error(`Token verification failed: ${err.message}`);
        return res.status(401).json({
            message: err.name === "TokenExpiredError"
                ? "Session expired, please login again"
                : "Invalid token",
        });
    }
};

module.exports = authMiddleware;
