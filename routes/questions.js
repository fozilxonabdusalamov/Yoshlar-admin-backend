const express = require('express');
const { body, validationResult } = require('express-validator');
const Question = require('../models/Question');
const auth = require('../middleware/auth');
const router = express.Router();

// Barcha savollarni olish
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find().sort({ order: 1, createdAt: -1 });
    res.json({
      success: true,
      data: questions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server xatoligi'
    });
  }
});

// Bitta savolni olish
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Savol topilmadi'
      });
    }
    res.json({
      success: true,
      data: question
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server xatoligi'
    });
  }
});

// Yangi savol yaratish
router.post('/', auth, [
  body('question').trim().notEmpty().withMessage('Savol kiritilishi shart'),
  body('answer').trim().notEmpty().withMessage('Javob kiritilishi shart')
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

    const { question, answer, isActive, order } = req.body;

    const newQuestion = new Question({
      question,
      answer,
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0
    });

    await newQuestion.save();

    res.status(201).json({
      success: true,
      message: 'Savol muvaffaqiyatli yaratildi',
      data: newQuestion
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server xatoligi'
    });
  }
});

// Savolni yangilash
router.put('/:id', auth, [
  body('question').trim().notEmpty().withMessage('Savol kiritilishi shart'),
  body('answer').trim().notEmpty().withMessage('Javob kiritilishi shart')
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

    const { question, answer, isActive, order } = req.body;
    const updateData = { question, answer };

    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    if (order !== undefined) {
      updateData.order = order;
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({
        success: false,
        message: 'Savol topilmadi'
      });
    }

    res.json({
      success: true,
      message: 'Savol muvaffaqiyatli yangilandi',
      data: updatedQuestion
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server xatoligi'
    });
  }
});

// Savolni o'chirish
router.delete('/:id', auth, async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Savol topilmadi'
      });
    }

    res.json({
      success: true,
      message: 'Savol muvaffaqiyatli o\'chirildi'
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
