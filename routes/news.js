const express = require('express');
const { body, validationResult } = require('express-validator');
const News = require('../models/News');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

// Barcha yangiliklarni olish
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const options = {
      limit: limit * 1,
      skip: (page - 1) * limit,
      sort: { createdAt: -1 }
    };

    const news = await News.find({}, null, options);
    const total = await News.countDocuments();

    res.json({
      success: true,
      data: news,
      pagination: {
        currentPage: page * 1,
        totalPages: Math.ceil(total / limit),
        totalItems: total
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

// Bitta yangilikni olish
router.get('/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'Yangilik topilmadi'
      });
    }
    res.json({
      success: true,
      data: news
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server xatoligi'
    });
  }
});

// Yangi yangilik yaratish
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

    const { title, description, isPublished, publishDate } = req.body;
    const image = `/uploads/${req.file.filename}`;

    const news = new News({
      title,
      description,
      image,
      isPublished: isPublished !== undefined ? isPublished : true,
      publishDate: publishDate || Date.now()
    });

    await news.save();

    res.status(201).json({
      success: true,
      message: 'Yangilik muvaffaqiyatli yaratildi',
      data: news
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server xatoligi'
    });
  }
});

// Yangilikni yangilash
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

    const { title, description, isPublished, publishDate } = req.body;
    const updateData = { title, description };

    if (isPublished !== undefined) {
      updateData.isPublished = isPublished;
    }

    if (publishDate) {
      updateData.publishDate = publishDate;
    }

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const news = await News.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'Yangilik topilmadi'
      });
    }

    res.json({
      success: true,
      message: 'Yangilik muvaffaqiyatli yangilandi',
      data: news
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server xatoligi'
    });
  }
});

// Yangilikni o'chirish
router.delete('/:id', auth, async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'Yangilik topilmadi'
      });
    }

    res.json({
      success: true,
      message: 'Yangilik muvaffaqiyatli o\'chirildi'
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
