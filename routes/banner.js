const express = require('express');
const { body, validationResult } = require('express-validator');
const Banner = require('../models/Banner');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

// Barcha bannerlarni olish
router.get('/', async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: banners
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server xatoligi'
    });
  }
});

// Bitta bannerni olish
router.get('/:id', async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner topilmadi'
      });
    }
    res.json({
      success: true,
      data: banner
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server xatoligi'
    });
  }
});

// Yangi banner yaratish
router.post('/', auth, upload.single('image'), [
  body('title').trim().notEmpty().withMessage('Sarlavha kiritilishi shart'),
  body('description').trim().notEmpty().withMessage('Tavsif kiritilishi shart')
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

    const { title, description, isActive } = req.body;
    const image = `/uploads/${req.file.filename}`;

    const banner = new Banner({
      title,
      description,
      image,
      isActive: isActive !== undefined ? isActive : true
    });

    await banner.save();

    res.status(201).json({
      success: true,
      message: 'Banner muvaffaqiyatli yaratildi',
      data: banner
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server xatoligi'
    });
  }
});

// Bannerni yangilash
router.put('/:id', auth, upload.single('image'), [
  body('title').trim().notEmpty().withMessage('Sarlavha kiritilishi shart'),
  body('description').trim().notEmpty().withMessage('Tavsif kiritilishi shart')
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

    const { title, description, isActive } = req.body;
    const updateData = { title, description };

    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const banner = await Banner.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner topilmadi'
      });
    }

    res.json({
      success: true,
      message: 'Banner muvaffaqiyatli yangilandi',
      data: banner
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server xatoligi'
    });
  }
});

// Bannerni o'chirish
router.delete('/:id', auth, async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner topilmadi'
      });
    }

    res.json({
      success: true,
      message: 'Banner muvaffaqiyatli o\'chirildi'
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
