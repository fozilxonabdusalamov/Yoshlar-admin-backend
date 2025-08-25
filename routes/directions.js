const express = require('express');
const { body, validationResult } = require('express-validator');
const Direction = require('../models/Direction');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

// Barcha yo'nalishlarni olish
router.get('/', async (req, res) => {
  try {
    const directions = await Direction.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: directions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server xatoligi'
    });
  }
});

// Bitta yo'nalishni olish
router.get('/:id', async (req, res) => {
  try {
    const direction = await Direction.findById(req.params.id);
    if (!direction) {
      return res.status(404).json({
        success: false,
        message: 'Yo\'nalish topilmadi'
      });
    }
    res.json({
      success: true,
      data: direction
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server xatoligi'
    });
  }
});

// Yangi yo'nalish yaratish
router.post('/', auth, upload.single('image'), [
  body('title').trim().notEmpty().withMessage('Sarlavha kiritilishi shart'),
  body('description').trim().notEmpty().withMessage('Tavsif kiritilishi shart'),
  body('duration').trim().notEmpty().withMessage('Davomiyligi kiritilishi shart'),
  body('lessonDuration').trim().notEmpty().withMessage('Dars davomiyligi kiritilishi shart'),
  body('lessonDays').trim().notEmpty().withMessage('Dars kunlari kiritilishi shart'),
  body('ageRange').trim().notEmpty().withMessage('Yosh chegarasi kiritilishi shart'),
  body('requirements').trim().notEmpty().withMessage('Talablar kiritilishi shart')
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

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Rasm yuklash shart'
      });
    }

    const { 
      title, 
      description, 
      duration, 
      lessonDuration, 
      lessonDays, 
      ageRange, 
      requirements, 
      isActive 
    } = req.body;
    
    const image = `/uploads/${req.file.filename}`;

    const direction = new Direction({
      title,
      description,
      image,
      duration,
      lessonDuration,
      lessonDays,
      ageRange,
      requirements,
      isActive: isActive !== undefined ? isActive : true
    });

    await direction.save();

    res.status(201).json({
      success: true,
      message: 'Yo\'nalish muvaffaqiyatli yaratildi',
      data: direction
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server xatoligi'
    });
  }
});

// Yo'nalishni yangilash
router.put('/:id', auth, upload.single('image'), [
  body('title').trim().notEmpty().withMessage('Sarlavha kiritilishi shart'),
  body('description').trim().notEmpty().withMessage('Tavsif kiritilishi shart'),
  body('duration').trim().notEmpty().withMessage('Davomiyligi kiritilishi shart'),
  body('lessonDuration').trim().notEmpty().withMessage('Dars davomiyligi kiritilishi shart'),
  body('lessonDays').trim().notEmpty().withMessage('Dars kunlari kiritilishi shart'),
  body('ageRange').trim().notEmpty().withMessage('Yosh chegarasi kiritilishi shart'),
  body('requirements').trim().notEmpty().withMessage('Talablar kiritilishi shart')
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

    const { 
      title, 
      description, 
      duration, 
      lessonDuration, 
      lessonDays, 
      ageRange, 
      requirements, 
      isActive 
    } = req.body;

    const updateData = {
      title,
      description,
      duration,
      lessonDuration,
      lessonDays,
      ageRange,
      requirements
    };

    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const direction = await Direction.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!direction) {
      return res.status(404).json({
        success: false,
        message: 'Yo\'nalish topilmadi'
      });
    }

    res.json({
      success: true,
      message: 'Yo\'nalish muvaffaqiyatli yangilandi',
      data: direction
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server xatoligi'
    });
  }
});

// Yo'nalishni o'chirish
router.delete('/:id', auth, async (req, res) => {
  try {
    const direction = await Direction.findByIdAndDelete(req.params.id);
    
    if (!direction) {
      return res.status(404).json({
        success: false,
        message: 'Yo\'nalish topilmadi'
      });
    }

    res.json({
      success: true,
      message: 'Yo\'nalish muvaffaqiyatli o\'chirildi'
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
