import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log("Authorization Header:", authHeader);

        // Extract the token from the header
        const token = authHeader?.split(' ')[1];
        if (!token) {
            console.log("Error: Token is missing or in an invalid format");
            return res.status(401).json({ message: 'Authentication token is missing or invalid format' });
        }

        // Decode and verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);

        req.admin = { userId: decoded.adminId };
        next();
    } catch (error) {
        console.error("Authentication Error:", error.message);
        return res.status(401).json({ message: 'Unauthorized' });
    }
};