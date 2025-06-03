// backend/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const authMiddleware = (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Extract token (assuming "Bearer TOKEN_STRING" format)
  const token = authHeader.split(' ')[1];

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request object
    // The payload in the token is { userId: user._id }
    req.user = { userId: decoded.userId };
    next();

  } catch (err) {
    // Token is not valid
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default authMiddleware; 