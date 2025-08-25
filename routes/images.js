const express = require('express');
const Image = require('../models/Image');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Barcha rasmlarni olish
router.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    const filter = {};
    
    if (category) {
      filter.category = category;
    }

    const options = {
      limit: limit * 1,
      skip: (page - 1) * limit,
      sort: { createdAt: -1 }
    };

    const images = await Image.find(filter, null, options);
    const total = await Image.countDocuments(filter);

    res.json({
      success: true,
      data: images,
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

// Bitta rasmni olish
router.get('/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Rasm topilmadi'
      });
    }
    res.json({
      success: true,
      data: image
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server xatoligi'
    });
  }
});

// Yangi rasm yuklash
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Rasm yuklash shart'
      });
    }

    const { category = 'other' } = req.body;

    const image = new Image({
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: `/uploads/${req.file.filename}`,
      size: req.file.size,
      mimetype: req.file.mimetype,
      category
    });

    await image.save();

    res.status(201).json({
      success: true,
      message: 'Rasm muvaffaqiyatli yuklandi',
      data: image
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server xatoligi'
    });
  }
});

// Ko'p rasmlarni yuklash
router.post('/multiple', auth, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Kamida bitta rasm yuklash shart'
      });
    }

    const { category = 'other' } = req.body;
    const images = [];

    for (const file of req.files) {
      const image = new Image({
        filename: file.filename,
        originalName: file.originalname,
        path: `/uploads/${file.filename}`,
        size: file.size,
        mimetype: file.mimetype,
        category
      });

      await image.save();
      images.push(image);
    }

    res.status(201).json({
      success: true,
      message: `${images.length} ta rasm muvaffaqiyatli yuklandi`,
      data: images
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server xatoligi'
    });
  }
});

// Rasm ma'lumotlarini yangilash (faqat kategoriya)
router.put('/:id', auth, async (req, res) => {
  try {
    const { category } = req.body;
    
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Kategoriya kiritilishi shart'
      });
    }

    const image = await Image.findByIdAndUpdate(
      req.params.id,
      { category },
      { new: true, runValidators: true }
    );

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Rasm topilmadi'
      });
    }

    res.json({
      success: true,
      message: 'Rasm ma\'lumotlari muvaffaqiyatli yangilandi',
      data: image
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server xatoligi'
    });
  }
});

// Rasmni o'chirish
router.delete('/:id', auth, async (req, res) => {
  try {
    const image = await Image.findByIdAndDelete(req.params.id);
    
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Rasm topilmadi'
      });
    }

    // Faylni serverdan o'chirish
    const filePath = path.join(__dirname, '..', 'uploads', image.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({
      success: true,
      message: 'Rasm muvaffaqiyatli o\'chirildi'
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
