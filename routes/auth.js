const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const router = express.Router();

// Admin ro'yxatdan o'tish
router.post('/register', [
  body('username').trim().isLength({ min: 3 }).withMessage('Username kamida 3 ta belgi bo\'lishi kerak'),
  body('email').isEmail().withMessage('Email noto\'g\'ri formatda'),
  body('password').isLength({ min: 6 }).withMessage('Parol kamida 6 ta belgi bo\'lishi kerak')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Ma\'lumotlar noto\'g\'ri',
        errors: errors.array()
      });
    }

    const { username, email, password } = req.body;

    // Foydalanuvchi mavjudligini tekshirish
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'Bunday foydalanuvchi allaqachon mavjud'
      });
    }

    // Yangi foydalanuvchi yaratish
    user = new User({
      username,
      email,
      password
    });

    await user.save();

    // Token yaratish
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'Foydalanuvchi muvaffaqiyatli ro\'yxatdan o\'tdi',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server xatoligi'
    });
  }
});

// Admin tizimga kirish
router.post('/login', [
  body('email').isEmail().withMessage('Email noto\'g\'ri formatda'),
  body('password').exists().withMessage('Parol kiritilishi shart')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Ma\'lumotlar noto\'g\'ri',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Foydalanuvchini topish
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Email yoki parol noto\'g\'ri'
      });
    }

    // Parolni tekshirish
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Email yoki parol noto\'g\'ri'
      });
    }

    // Foydalanuvchi faol emasligini tekshirish
    if (!user.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Hisobingiz faol emas'
      });
    }

    // Token yaratish
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: 'Muvaffaqiyatli tizimga kirildi',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server xatoligi'
    });
  }
});

module.exports = router;
