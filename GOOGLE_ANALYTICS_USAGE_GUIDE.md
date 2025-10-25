# Hướng dẫn sử dụng Google Analytics cho SkinVox

## 🔍 Vấn đề hiện tại
Google Analytics script đã hoạt động đúng trên client-side (console logs cho thấy success), nhưng dashboard vẫn hiển thị "No data received".

## 🛠️ Cách kiểm tra và sử dụng Google Analytics

### **Bước 1: Kiểm tra Real-time Reports**

1. **Truy cập Google Analytics Dashboard:**
   - Mở [Google Analytics](https://analytics.google.com/)
   - Đăng nhập vào tài khoản của bạn
   - Chọn property "Default fir-app-4d15"

2. **Kiểm tra Real-time Reports:**
   - Trong menu bên trái, chọn **Reports** > **Real-time**
   - Hoặc truy cập trực tiếp: https://analytics.google.com/analytics/web/#/realtime

3. **Quan sát dữ liệu:**
   - Mở website của bạn: https://skin-vox.vercel.app/
   - Điều hướng qua các trang khác nhau
   - Kiểm tra xem có dữ liệu xuất hiện trong Real-time reports không

### **Bước 2: Kiểm tra DebugView (Quan trọng)**

1. **Truy cập DebugView:**
   - Trong Google Analytics, chọn **Admin** > **DebugView**
   - Hoặc truy cập: https://analytics.google.com/analytics/web/#/debugview

2. **Kích hoạt Debug Mode:**
   - Mở website với parameter `?_dbg=1`
   - Ví dụ: https://skin-vox.vercel.app/?_dbg=1

3. **Quan sát events:**
   - Trong DebugView, bạn sẽ thấy các events được gửi từ website
   - Kiểm tra xem có events nào xuất hiện không

### **Bước 3: Kiểm tra Data Stream Configuration**

1. **Truy cập Data Streams:**
   - Trong Google Analytics, chọn **Admin** > **Data Streams**
   - Chọn stream "Skinvox"

2. **Kiểm tra cấu hình:**
   - **Measurement ID**: G-C4NFL3C9TF
   - **Website URL**: https://skin-vox.vercel.app/
   - **Enhanced measurement**: Enabled

3. **Kiểm tra tag instructions:**
   - Nhấp vào "View tag instructions"
   - Đảm bảo tag được cài đặt đúng cách

### **Bước 4: Test Google Analytics Events**

1. **Mở website và Developer Console:**
   - Truy cập: https://skin-vox.vercel.app/
   - Mở Developer Tools (F12)
   - Chuyển đến tab Console

2. **Gửi test event thủ công:**
   ```javascript
   // Test page view
   gtag('event', 'page_view', {
     page_title: 'Test Page',
     page_location: window.location.href
   });

   // Test custom event
   gtag('event', 'test_event', {
     event_category: 'Test',
     event_label: 'Manual Test',
     value: 1
   });

   // Test ecommerce event
   gtag('event', 'view_item', {
     currency: 'VND',
     value: 100000,
     items: [{
       item_id: 'test_item',
       item_name: 'Test Product',
       item_category: 'Test Category',
       quantity: 1,
       price: 100000
     }]
   });
   ```

3. **Kiểm tra DataLayer:**
   ```javascript
   // Kiểm tra DataLayer
   console.log('DataLayer:', window.dataLayer);
   console.log('DataLayer length:', window.dataLayer.length);
   ```

### **Bước 5: Sử dụng Google Analytics Reports**

#### **5.1. Real-time Reports (Thời gian thực)**
- **Vị trí**: Reports > Real-time
- **Mục đích**: Xem hoạt động của người dùng ngay lập tức
- **Sử dụng**: Kiểm tra xem Google Analytics có hoạt động không

#### **5.2. Engagement Reports (Báo cáo tương tác)**
- **Vị trí**: Reports > Engagement
- **Mục đích**: Xem cách người dùng tương tác với website
- **Các báo cáo quan trọng**:
  - **Events**: Xem tất cả events được track
  - **Pages and screens**: Trang nào được xem nhiều nhất
  - **Conversions**: Các chuyển đổi quan trọng

#### **5.3. Acquisition Reports (Báo cáo thu nạp)**
- **Vị trí**: Reports > Acquisition
- **Mục đích**: Xem người dùng đến từ đâu
- **Các báo cáo quan trọng**:
  - **Traffic acquisition**: Nguồn traffic chính
  - **User acquisition**: Cách người dùng mới đến website

#### **5.4. User Reports (Báo cáo người dùng)**
- **Vị trí**: Reports > User
- **Mục đích**: Hiểu về người dùng
- **Các báo cáo quan trọng**:
  - **Demographics**: Độ tuổi, giới tính, vị trí
  - **Tech**: Thiết bị, trình duyệt, hệ điều hành

### **Bước 6: Tạo Custom Events (Sự kiện tùy chỉnh)**

#### **6.1. Tạo Conversion Events:**
1. **Truy cập**: Admin > Events > Create event
2. **Tạo events quan trọng**:
   - `blog_view`: Khi người dùng xem blog
   - `ar_view`: Khi người dùng mở AR
   - `admin_login`: Khi admin đăng nhập
   - `blog_create`: Khi admin tạo blog mới

#### **6.2. Tạo Custom Dimensions:**
1. **Truy cập**: Admin > Custom definitions > Custom dimensions
2. **Tạo dimensions quan trọng**:
   - `blog_category`: Danh mục blog
   - `product_type`: Loại sản phẩm
   - `user_role`: Vai trò người dùng

### **Bước 7: Sử dụng Explorations (Khám phá)**

#### **7.1. Tạo Custom Reports:**
1. **Truy cập**: Explore > Free form
2. **Tạo báo cáo tùy chỉnh**:
   - Blog performance analysis
   - Product interaction analysis
   - User journey analysis

#### **7.2. Tạo Funnel Analysis:**
1. **Truy cập**: Explore > Funnel exploration
2. **Phân tích user journey**:
   - Home → Blog → Blog Detail
   - Home → BeautyBar → AR View
   - Login → Admin Dashboard → Blog Create

### **Bước 8: Troubleshooting**

#### **8.1. Nếu không thấy dữ liệu trong Real-time:**
1. **Kiểm tra Measurement ID**: Đảm bảo `G-C4NFL3C9TF` đúng
2. **Kiểm tra website URL**: Đảm bảo `https://skin-vox.vercel.app/` đúng
3. **Kiểm tra browser console**: Tìm lỗi JavaScript
4. **Kiểm tra network requests**: Tìm requests đến Google Analytics

#### **8.2. Nếu thấy dữ liệu trong Real-time nhưng không thấy trong reports khác:**
1. **Đợi 24-48 giờ**: Dữ liệu cần thời gian để xử lý
2. **Kiểm tra data filters**: Đảm bảo không có filter nào chặn dữ liệu
3. **Kiểm tra data retention**: Đảm bảo data retention settings đúng

### **Bước 9: Best Practices**

#### **9.1. Privacy và Compliance:**
1. **Thêm Privacy Policy**: Thông báo người dùng về việc sử dụng analytics
2. **Cấu hình data retention**: Đặt thời gian lưu trữ dữ liệu phù hợp
3. **Sử dụng consent mode**: Tuân thủ GDPR và các quy định khác

#### **9.2. Performance:**
1. **Sử dụng Google Tag Manager**: Quản lý tags hiệu quả hơn
2. **Implement sampling**: Giảm tải cho website có traffic cao
3. **Monitor data quality**: Đảm bảo dữ liệu chính xác

### **Bước 10: Monitoring và Alerts**

#### **10.1. Tạo Custom Alerts:**
1. **Truy cập**: Admin > Custom alerts
2. **Tạo alerts quan trọng**:
   - Traffic drop alert
   - Error rate alert
   - Conversion rate alert

#### **10.2. Sử dụng Google Analytics Intelligence:**
1. **Truy cập**: Reports > Intelligence insights
2. **Xem insights tự động**: Google Analytics sẽ tự động phát hiện các xu hướng quan trọng

## 🚀 Next Steps

1. **Kiểm tra Real-time Reports** ngay bây giờ
2. **Sử dụng DebugView** để kiểm tra events
3. **Test manual events** trong browser console
4. **Tạo custom events** cho các tương tác quan trọng
5. **Sử dụng Explorations** để phân tích sâu hơn

## 📞 Support

Nếu vẫn gặp vấn đề:
1. Kiểm tra Real-time Reports
2. Sử dụng DebugView
3. Test manual events
4. Kiểm tra browser console
5. Verify Measurement ID và website URL
