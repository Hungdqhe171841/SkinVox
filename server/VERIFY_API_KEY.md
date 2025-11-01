# Kiểm tra API Key thuộc project nào

## Vấn đề

Bạn đã enable Gemini API trong project `fir-app-4d158` (Project number: 871987427351), nhưng API key có thể thuộc project khác.

## Cách kiểm tra API Key thuộc project nào

### Phương pháp 1: Xem trong Google AI Studio

1. Truy cập: https://aistudio.google.com/app/apikey
2. Đăng nhập với Google account bạn đã dùng để tạo key
3. Xem danh sách API keys
4. Tìm key bắt đầu với `AIzaSyAXr1FJTLF...`
5. Click vào key để xem chi tiết
6. Xem **"Project"** hoặc **"Created in project"**

### Phương pháp 2: Xem trong Google Cloud Console

1. Truy cập: https://console.cloud.google.com/apis/credentials
2. Chọn **TẤT CẢ các projects** (dropdown ở trên)
3. Tìm API key `AIzaSyAXr1...`
4. Click vào để xem chi tiết
5. Xem **"Project"** trong thông tin key

## Cách sửa

### Option A: Enable API trong project của API key

1. Xác định project của API key (theo hướng dẫn trên)
2. Vào project đó
3. Enable **Generative Language API** (generativelanguage.googleapis.com)
4. Đợi 2-3 phút
5. Test lại

### Option B: Tạo API key mới trong project đúng

1. Vào project `fir-app-4d158` (project bạn đã enable API)
2. Vào **"APIs & Services"** > **"Credentials"**
3. Click **"+ CREATE CREDENTIALS"** > **"API key"**
4. Copy key mới
5. Cập nhật trong:
   - Render.com environment variables
   - Local .env file
6. Restart server
7. Test lại

### Option C: Move API key sang project đúng (không khuyến nghị)

API keys không thể move trực tiếp, nên tốt nhất là tạo key mới.

## Kiểm tra nhanh

Sau khi enable API trong đúng project:

1. **Đợi 3-5 phút** để Google propagate
2. Test local:
   ```bash
   node test-gemini-now.js
   ```
3. Kiểm tra response - nếu thấy `✅ SUCCESS!` thì đã OK
4. Restart server trên Render
5. Test qua chatbot UI

## Lưu ý

- Mỗi API key chỉ thuộc về **MỘT project**
- Phải enable API trong **ĐÚNG project** mà API key thuộc về
- Có thể có nhiều API keys, mỗi key thuộc project khác nhau
- Kiểm tra kỹ project nào đang được dùng

## Project hiện tại

Từ screenshot:
- **Project bạn đang xem**: `fir-app-4d158`
- **Project number**: `871987427351`
- **API đã enable**: ✅ Gemini API (generativelanguage.googleapis.com)

Nếu API key thuộc project này → Đợi vài phút rồi test lại
Nếu API key thuộc project khác → Cần enable API trong project đó hoặc tạo key mới

