# SkinVox Makeup AR Feature

## Tổng quan
Tính năng Makeup AR của SkinVox cho phép người dùng thử trang điểm ảo sử dụng công nghệ nhận dạng khuôn mặt AI với MediaPipe.

## Tính năng chính
- 💄 **Lipstick**: Thử các màu son môi khác nhau
- 👁️ **Eyeliner**: Áp dụng các kiểu eyeliner khác nhau
- 🤨 **Eyebrows**: Định hình và tô màu lông mày
- 🌸 **Blush**: Thêm má hồng tự nhiên

## Cấu trúc thư mục
```
client/src/makeup/
├── data/                    # Dữ liệu preset cho các loại makeup
│   ├── LipstickPresets.js
│   ├── EyelashPresets.js
│   ├── EyebrowPresets.js
│   └── BlushPresets.js
├── models/                  # Model classes
│   └── MakeupModel.js
├── components/              # React components
│   └── CameraView.jsx
├── presenters/              # Presenter classes
│   └── CameraPresenter.js
└── styles/                  # CSS styles
    └── CameraView.css
```

## Cách sử dụng

### 1. Truy cập trang Makeup AR
- Điều hướng đến `/makeup-ar` trong ứng dụng
- Hoặc click vào "Makeup AR" trong navigation menu

### 2. Cấp quyền camera
- Trang sẽ yêu cầu quyền truy cập camera
- Cho phép để sử dụng tính năng

### 3. Sử dụng các tính năng
- **Bật/tắt tính năng**: Sử dụng các toggle buttons để bật/tắt từng loại makeup
- **Chọn preset**: Click vào các tab và chọn màu sắc/kiểu dáng mong muốn
- **Điều chỉnh**: Các preset có thể được tùy chỉnh thông qua các thuộc tính

## Presets có sẵn

### Lipstick (8 màu)
- Classic Red, Nude Pink, Deep Berry, Coral
- Plum, Rose, Burgundy, Peach

### Eyeliner (6 kiểu)
- Natural, Dramatic, Winged, Soft
- Cat Eye, Smoky

### Eyebrows (8 màu)
- Natural, Dark, Light, Auburn
- Blonde, Bold, Soft, Defined

### Blush (8 màu)
- Peach Glow, Rose Blush, Coral, Pink
- Apricot, Berry, Natural, Sunset

## Công nghệ sử dụng
- **MediaPipe Face Mesh**: Nhận dạng và theo dõi khuôn mặt
- **Canvas API**: Vẽ makeup effects lên video
- **React**: UI components và state management
- **CSS**: Styling và responsive design

## Yêu cầu hệ thống
- Camera webcam
- Trình duyệt hỗ trợ WebRTC
- Kết nối internet (để load MediaPipe scripts)

## Troubleshooting

### Camera không hoạt động
- Kiểm tra quyền truy cập camera
- Đảm bảo không có ứng dụng khác đang sử dụng camera
- Thử refresh trang

### MediaPipe không load
- Kiểm tra kết nối internet
- Thử refresh trang
- Kiểm tra console để xem lỗi cụ thể

### Makeup không hiển thị đúng
- Đảm bảo khuôn mặt trong khung hình
- Điều chỉnh ánh sáng
- Thử các preset khác nhau

## Phát triển thêm
Để thêm tính năng mới:
1. Thêm preset data vào thư mục `data/`
2. Cập nhật `MakeupModel.js` với methods mới
3. Thêm drawing logic vào `CameraPresenter.js`
4. Cập nhật UI trong `MakeupAR.jsx`

## Dependencies
- `@mediapipe/camera_utils`: "^0.3.1675466862"
- `@mediapipe/face_mesh`: "^0.4.1633559619"
- React và các dependencies khác của SkinVox
