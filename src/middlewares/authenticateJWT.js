const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || '78789898';

export const authenticateJWT = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header not found.' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token not found.' });
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      console.error('JWT Verification Error:', err);
      res.status(403).json({ error: 'Invalid or expired token.' });
    }
  };