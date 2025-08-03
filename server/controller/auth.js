const prisma = require('../config/prisma')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
    try {
      const {
        username,       
        email,
        password,
        firstName,
        lastName,
        gender,
        birthDate,
        occupation,
        phone,
        address
      } = req.body;
  
      
      if (!username) return res.status(400).json({ message: 'Username is required!' });
      if (!email) return res.status(400).json({ message: 'Email is required!' });
      if (!password) return res.status(400).json({ message: 'Password is required!' });
  
      
      const existingUser = await prisma.user.findFirst({
        where: { OR: [{ email }, { username }] } // เช็คซ้ำทั้ง email และ username
      });
      if (existingUser) return res.status(400).json({ message: 'Email or Username already exists' });
  
      
      const hashPassword = await bcrypt.hash(password, 10);
  
      
      await prisma.user.create({
        data: {
          username,
          email,
          password: hashPassword,
          firstName,
          lastName,
          gender,
          birthDate: birthDate ? new Date(birthDate) : null,
          occupation,
          phone,
          address
        }
      });
  
      res.send('Register Success');
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Server Error' });
    }
  };
  
  

  exports.login = async (req, res) => {
    try {
      const { emailOrUsername, password } = req.body
  
      // ตรวจสอบว่าเป็น email หรือ username
      const isEmail = emailOrUsername.includes('@')
  
      const user = await prisma.user.findFirst({
        where: isEmail
          ? { email: emailOrUsername }
          : { username: emailOrUsername }
      })
  
      if (!user || !user.enable) {
        return res.status(400).json({ message: 'ไม่พบผู้ใช้หรือบัญชีถูกปิดใช้งาน' })
      }
  
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(400).json({ message: 'รหัสผ่านไม่ถูกต้อง' })
      }
  
      const payload = {
        user_id: user.user_id,
        email: user.email,
        username: user.username,
        role: user.role
      };
  
      jwt.sign(payload, process.env.SECRET, { expiresIn: '1d' }, (err, token) => {
        if (err) return res.status(500).json({ message: 'Token Error' })
        res.json({ payload, token })
      })
      // console.log("JWT SECRET:", process.env.SECRET);

    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'Server Error' })
    }
  }
  

  exports.currentUser = async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: { user_id: req.user.user_id },
        select: {
          user_id: true,
          email: true,
          username: true,
          role: true, 
        }
      });
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: "Server Error" });
    }
  };
  