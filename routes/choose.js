const express = require('express');
const { body, validationResult } = require('express-validator');
const Choose = require('../models/Choose');
const auth = require('../middleware/auth');
const router = express.Router();

// Barcha choose ma'lumotlarini olish
router.get('/', async (req, res) => {
  try {
    const chooseItems = await Choose.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: chooseItems
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server xatoligi'
    });
  }
});

// Bitta choose ma'lumotini olish
router.get('/:id', async (req, res) => {
  try {
    const chooseItem = await Choose.findById(req.params.id);
    if (!chooseItem) {
      return res.status(404).json({
        success: false,
        message: 'Ma\'lumot topilmadi'
      });
    }
    res.json({
      success: true,
      data: chooseItem
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server xatoligi'
    });
  }
});

// Yangi choose ma'lumoti yaratish
router.post('/', auth, [
  body('title').trim().notEmpty().withMessage('Sarlavha kiritilishi shart'),
  body('titleDescription').trim().notEmpty().withMessage('Sarlavha tavsifi kiritilishi shart'),
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

    const { title, titleDescription, description, isActive } = req.body;

    const chooseItem = new Choose({
      title,
      titleDescription,
      description,
      isActive: isActive !== undefined ? isActive : true
    });

    await chooseItem.save();

    res.status(201).json({
      success: true,
      message: 'Ma\'lumot muvaffaqiyatli yaratildi',
      data: chooseItem
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server xatoligi'
    });
  }
});

// Choose ma'lumotini yangilash
router.put('/:id', auth, [
  body('title').trim().notEmpty().withMessage('Sarlavha kiritilishi shart'),
  body('titleDescription').trim().notEmpty().withMessage('Sarlavha tavsifi kiritilishi shart'),
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

    const { title, titleDescription, description, isActive } = req.body;
    const updateData = { title, titleDescription, description };

    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    const chooseItem = await Choose.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!chooseItem) {
      return res.status(404).json({
        success: false,
        message: 'Ma\'lumot topilmadi'
      });
    }

    res.json({
      success: true,
      message: 'Ma\'lumot muvaffaqiyatli yangilandi',
      data: chooseItem
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server xatoligi'
    });
  }
});

// Choose ma'lumotini o'chirish
router.delete('/:id', auth, async (req, res) => {
  try {
    const chooseItem = await Choose.findByIdAndDelete(req.params.id);
    
    if (!chooseItem) {
      return res.status(404).json({
        success: false,
        message: 'Ma\'lumot topilmadi'
      });
    }

    res.json({
      success: true,
      message: 'Ma\'lumot muvaffaqiyatli o\'chirildi'
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
