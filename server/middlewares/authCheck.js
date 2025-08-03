const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

exports.authCheck = async (req, res, next) => {
  try {
    const headerToken = req.headers.authorization;
    if (!headerToken) {
      return res.status(401).json({ message: 'No Token, Authorization Denied' });
    }

    const token = headerToken.split(' ')[1];
    const decode = jwt.verify(token, process.env.SECRET);
    req.user = decode; // payload: { user_id, email, role, username }

    const user = await prisma.user.findUnique({
      where: { user_id: decode.user_id } 
    });

    if (!user?.enable) {
      return res.status(403).json({ message: 'This account is disabled' });
    }

    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Token Invalid or Expired' });
  }
};

exports.adminCheck = async (req, res, next) => {
  try {
    const { user_id } = req.user;

    const adminUser = await prisma.user.findUnique({
      where: { user_id }
    });

    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access Denied: Admin Only' });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Admin Access Error' });
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin Only' });
  }
  next();
};
