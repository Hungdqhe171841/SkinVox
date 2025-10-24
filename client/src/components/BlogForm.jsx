import { useState, useEffect } from 'react'
import { X, Save, Eye, Upload, Plus, Trash2 } from 'lucide-react'

export default function BlogForm({ 
  blog = null, 
  onSave, 
  onCancel, 
  categories = [],
  isEditing = false 
}) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    description: '',
    category: '',
    tags: [],
    images: [],
    affiliateLinks: [],
    status: 'draft',
    formatType: 1
  })
  
  const [loading, setLoading] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [newAffiliateLink, setNewAffiliateLink] = useState({
    productName: '',
    productUrl: '',
    note: ''
  })
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)

  useEffect(() => {
    console.log('BlogForm - Categories received:', categories)
    if (blog && isEditing) {
      setFormData({
        title: blog.title || '',
        content: blog.content || '',
        description: blog.description || '',
        category: blog.category || '',
        tags: blog.tags || [],
        images: blog.images || [],
        affiliateLinks: blog.affiliateLinks || [],
        status: blog.status || 'draft',
        formatType: blog.formatType || 1
      })
    }
  }, [blog, isEditing, categories])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleTagRemove = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleAffiliateLinkAdd = () => {
    if (newAffiliateLink.productName && newAffiliateLink.productUrl) {
      setFormData(prev => ({
        ...prev,
        affiliateLinks: [...prev.affiliateLinks, { ...newAffiliateLink }]
      }))
      setNewAffiliateLink({ productName: '', productUrl: '', note: '' })
    }
  }

  const handleAffiliateLinkRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      affiliateLinks: prev.affiliateLinks.filter((_, i) => i !== index)
    }))
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Vui lòng chọn file hình ảnh');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File quá lớn. Vui lòng chọn file nhỏ hơn 10MB');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      const uploadedFile = result.files[0]; // Admin endpoint returns files array
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, uploadedFile.path]
      }));

      console.log('✅ Image uploaded successfully:', uploadedFile);
    } catch (error) {
      console.error('❌ Upload error:', error);
      setUploadError('Lỗi khi upload hình ảnh. Vui lòng thử lại.');
    } finally {
      setUploading(false);
    }
  }

  const handleMultipleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploading(true);
    setUploadError(null);

    try {
      const uploadPromises = files.map(async (file) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} không phải là file hình ảnh`);
        }

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`${file.name} quá lớn. Vui lòng chọn file nhỏ hơn 10MB`);
        }

        const formData = new FormData();
        formData.append('images', file);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Upload ${file.name} failed`);
        }

        const result = await response.json();
        return result.files[0].path;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));

      console.log('✅ All images uploaded successfully:', uploadedUrls);
    } catch (error) {
      console.error('❌ Upload error:', error);
      setUploadError(error.message || 'Lỗi khi upload hình ảnh. Vui lòng thử lại.');
    } finally {
      setUploading(false);
    }
  }

  const handleImageRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await onSave(formData)
    } catch (error) {
      console.error('Error saving blog:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">
            {isEditing ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề bài viết *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập tiêu đề bài viết..."
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả ngắn
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Mô tả ngắn về bài viết..."
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Danh mục *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Chọn danh mục</option>
              {categories.map((category, index) => (
                <option key={index} value={category.name || category}>
                  {category.name || category}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập tag và nhấn Enter..."
              />
              <button
                type="button"
                onClick={handleTagAdd}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleTagRemove(tag)}
                    className="ml-2 hover:text-blue-600"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nội dung bài viết *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập nội dung bài viết..."
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hình ảnh
            </label>
            <div className="flex flex-wrap gap-4 mb-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Blog image ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => handleImageRemove(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleMultipleImageUpload}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {uploading && (
              <div className="text-blue-600 text-sm">Đang upload ảnh...</div>
            )}
            {uploadError && (
              <div className="text-red-600 text-sm">{uploadError}</div>
            )}
          </div>

          {/* Affiliate Links */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Liên kết sản phẩm
            </label>
            <div className="space-y-4">
              {formData.affiliateLinks.map((link, index) => (
                <div key={index} className="flex gap-2 items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{link.productName}</p>
                    <p className="text-sm text-gray-600">{link.note}</p>
                    <p className="text-sm text-blue-600">{link.productUrl}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAffiliateLinkRemove(index)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-4 border border-gray-300 rounded-lg">
              <h4 className="font-medium mb-3">Thêm liên kết sản phẩm</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  value={newAffiliateLink.productName}
                  onChange={(e) => setNewAffiliateLink(prev => ({ ...prev, productName: e.target.value }))}
                  placeholder="Tên sản phẩm"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="url"
                  value={newAffiliateLink.productUrl}
                  onChange={(e) => setNewAffiliateLink(prev => ({ ...prev, productUrl: e.target.value }))}
                  placeholder="URL sản phẩm"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  value={newAffiliateLink.note}
                  onChange={(e) => setNewAffiliateLink(prev => ({ ...prev, note: e.target.value }))}
                  placeholder="Ghi chú"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleAffiliateLinkAdd}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Thêm liên kết
                </button>
              </div>
            </div>
          </div>

          {/* Format Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Định dạng bài viết
            </label>
            <select
              name="formatType"
              value={formData.formatType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={1}>Bài viết thường</option>
              <option value={2}>Bài viết nổi bật</option>
              <option value={3}>Bài viết hướng dẫn</option>
              <option value={4}>Bài viết đánh giá sản phẩm</option>
              <option value={5}>Bài viết xu hướng</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="draft">Bản nháp</option>
              <option value="published">Đã xuất bản</option>
              <option value="archived">Đã lưu trữ</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save size={16} />
              )}
              {isEditing ? 'Cập nhật' : 'Tạo bài viết'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

