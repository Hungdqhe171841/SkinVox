# SkinVox - AI-Powered Skin Analysis Website

SkinVox là một website phân tích da thông minh sử dụng công nghệ AI để cung cấp các khuyến nghị chăm sóc da cá nhân hóa.

## 🚀 Tính năng chính

- **Phân tích da bằng AI**: Sử dụng công nghệ computer vision tiên tiến trên web
- **Khuyến nghị cá nhân hóa**: Gợi ý chế độ chăm sóc da dựa trên phân tích
- **Theo dõi tiến trình**: Giám sát hành trình sức khỏe da với phân tích chi tiết
- **Beauty Journal**: Blog và tài nguyên chăm sóc da chuyên nghiệp
- **Bảo mật dữ liệu**: Mã hóa và bảo mật thông tin người dùng
- **Giao diện web thân thiện**: Thiết kế hiện đại, responsive trên mọi thiết bị

## 🛠️ Công nghệ sử dụng

### Frontend
- **React 18** - UI Framework
- **Vite** - Build tool và dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Data fetching và caching
- **React Hook Form** - Form handling
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security headers
- **Morgan** - HTTP request logger

## 📁 Cấu trúc dự án

```
SkinVox/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API services
│   │   └── main.jsx       # Entry point
│   ├── public/            # Static assets
│   ├── package.json       # Frontend dependencies
│   └── vite.config.js     # Vite configuration
├── server/                # Backend (Node.js + Express)
│   ├── routes/            # API routes
│   ├── models/            # Database models
│   ├── config/            # Configuration files
│   ├── package.json       # Backend dependencies
│   └── server.js          # Server entry point
├── package.json           # Root package.json
└── README.md             # Project documentation
```

## 🚀 Hướng dẫn cài đặt

### Yêu cầu hệ thống
- Node.js >= 18.0.0
- npm >= 8.0.0
- MongoDB >= 5.0

### 1. Clone repository
```bash
git clone <repository-url>
cd SkinVox
```

### 2. Cài đặt dependencies
```bash
# Cài đặt tất cả dependencies (root, client, server)
npm run install-all

# Hoặc cài đặt từng phần:
npm install                    # Root dependencies
cd client && npm install       # Frontend dependencies
cd ../server && npm install    # Backend dependencies
```

### 3. Cấu hình môi trường

#### Backend (.env)
Tạo file `.env` trong thư mục `server/`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skinvox
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

#### Frontend (.env)
Tạo file `.env` trong thư mục `client/`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Khởi động MongoDB
```bash
# Sử dụng MongoDB Compass hoặc MongoDB Community Server
mongod
```

### 5. Chạy ứng dụng

#### Chạy cả Frontend và Backend
```bash
npm run dev
```

#### Chạy riêng lẻ
```bash
# Backend only
npm run server

# Frontend only  
npm run client
```

## 📱 Truy cập ứng dụng

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 🔧 Scripts có sẵn

### Root level
- `npm run dev` - Chạy cả frontend và backend
- `npm run server` - Chỉ chạy backend
- `npm run client` - Chỉ chạy frontend
- `npm run install-all` - Cài đặt tất cả dependencies
- `npm run build` - Build frontend cho production
- `npm start` - Chạy backend production

### Frontend (client/)
- `npm run dev` - Development server
- `npm run build` - Build cho production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code

### Backend (server/)
- `npm run dev` - Development với nodemon
- `npm start` - Production server

## 🗄️ Database Schema

### User Model
```javascript
{
  username: String (required, unique)
  email: String (required, unique)
  password: String (required, hashed)
  avatar: String (optional)
  role: String (enum: 'user', 'admin')
  isActive: Boolean (default: true)
  lastLogin: Date
  createdAt: Date
  updatedAt: Date
}
```

## 🔐 Authentication

Ứng dụng sử dụng JWT (JSON Web Tokens) cho authentication:
- **Register**: POST `/api/auth/register`
- **Login**: POST `/api/auth/login`
- **Get Profile**: GET `/api/auth/me`

## 🎨 UI Components

### Các trang chính
- **Home** - Trang chủ với giới thiệu tính năng
- **Login** - Đăng nhập
- **Register** - Đăng ký tài khoản
- **Dashboard** - Bảng điều khiển chính
- **Profile** - Quản lý thông tin cá nhân

### Tính năng UI
- Responsive design
- Dark/Light mode support
- Form validation
- Loading states
- Error handling
- Toast notifications

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy dist/ folder
```

### Backend (Heroku/Railway)
```bash
cd server
# Set environment variables
# Deploy to platform
```

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Support

Nếu bạn gặp vấn đề hoặc có câu hỏi, vui lòng tạo issue trên GitHub repository.

---

**SkinVox Team** - Advanced AI-Powered Skin Analysis Platform