# Namangan Yoshlar Texopark Admin Panel Backend

Bu loyiha Namangan Yoshlar Texopark admin panelining backend qismidir.

## Texnologiyalar

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Multer (File Upload)
- BCryptJS (Password Hashing)

## O'rnatish

1. Dependencies o'rnatish:
```bash
npm install
```

2. Environment variables sozlash:
`.env` faylini yarating va quyidagi ma'lumotlarni kiriting:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/namangan_texopark
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

3. MongoDB ishga tushirish:
MongoDB local yoki MongoDB Atlas cloud xizmatidan foydalanishingiz mumkin.

4. Serverni ishga tushirish:

Development rejimida:
```bash
npm run dev
```

Production rejimida:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Admin ro'yxatdan o'tish
- `POST /api/auth/login` - Admin tizimga kirish

### Banner
- `GET /api/banner` - Barcha bannerlarni olish
- `GET /api/banner/:id` - Bitta bannerni olish
- `POST /api/banner` - Yangi banner yaratish (Auth required)
- `PUT /api/banner/:id` - Bannerni yangilash (Auth required)
- `DELETE /api/banner/:id` - Bannerni o'chirish (Auth required)

### News
- `GET /api/news` - Barcha yangiliklarni olish
- `GET /api/news/:id` - Bitta yangilikni olish
- `POST /api/news` - Yangi yangilik yaratish (Auth required)
- `PUT /api/news/:id` - Yangilikni yangilash (Auth required)
- `DELETE /api/news/:id` - Yangilikni o'chirish (Auth required)

### Directions
- `GET /api/directions` - Barcha yo'nalishlarni olish
- `GET /api/directions/:id` - Bitta yo'nalishni olish
- `POST /api/directions` - Yangi yo'nalish yaratish (Auth required)
- `PUT /api/directions/:id` - Yo'nalishni yangilash (Auth required)
- `DELETE /api/directions/:id` - Yo'nalishni o'chirish (Auth required)

### Choose
- `GET /api/choose` - Barcha choose ma'lumotlarini olish
- `GET /api/choose/:id` - Bitta choose ma'lumotini olish
- `POST /api/choose` - Yangi choose yaratish (Auth required)
- `PUT /api/choose/:id` - Choose ma'lumotini yangilash (Auth required)
- `DELETE /api/choose/:id` - Choose ma'lumotini o'chirish (Auth required)

### Questions
- `GET /api/questions` - Barcha savollarni olish
- `GET /api/questions/:id` - Bitta savolni olish
- `POST /api/questions` - Yangi savol yaratish (Auth required)
- `PUT /api/questions/:id` - Savolni yangilash (Auth required)
- `DELETE /api/questions/:id` - Savolni o'chirish (Auth required)

### Images
- `GET /api/images` - Barcha rasmlarni olish
- `GET /api/images/:id` - Bitta rasmni olish
- `POST /api/images` - Bitta rasm yuklash (Auth required)
- `POST /api/images/multiple` - Ko'p rasmlarni yuklash (Auth required)
- `PUT /api/images/:id` - Rasm ma'lumotlarini yangilash (Auth required)
- `DELETE /api/images/:id` - Rasmni o'chirish (Auth required)

## Fayl yuklash

Rasmlar `uploads/` papkasiga saqlanadi va `/uploads/filename` orqali ochiq API mavjud.

Qo'llab-quvvatlanadigan formatlar: JPEG, JPG, PNG, GIF, WebP
Maksimal fayl hajmi: 5MB

## Database Schema

### User
- username: String (required, unique)
- email: String (required, unique)
- password: String (required, hashed)
- role: String (admin/moderator)
- isActive: Boolean

### Banner
- title: String (required)
- description: String (required)
- image: String (required)
- isActive: Boolean

### News
- title: String (required)
- description: String (required)
- image: String (required)
- isPublished: Boolean
- publishDate: Date

### Direction
- title: String (required)
- description: String (required)
- image: String (required)
- duration: String (required)
- lessonDuration: String (required)
- lessonDays: String (required)
- ageRange: String (required)
- requirements: String (required)
- isActive: Boolean

### Choose
- title: String (required)
- titleDescription: String (required)
- description: String (required)
- isActive: Boolean

### Question
- question: String (required)
- answer: String (required)
- isActive: Boolean
- order: Number

### Image
- filename: String (required)
- originalName: String (required)
- path: String (required)
- size: Number (required)
- mimetype: String (required)
- category: String (banner/news/directions/gallery/other)

## Security

- JWT token authentication
- Password hashing with BCryptJS
- Input validation with express-validator
- CORS enabled
- Helmet for security headers
# Namangan-Yoshlar-admin-backend
# Yoshlar-admin-backend
