const AWS = require('aws-sdk');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

class CloudStorageService {
  constructor() {
    // Default to Cloudinary for free cloud storage
    this.storageType = process.env.STORAGE_TYPE || 'cloudinary'; // 'local', 's3', 'cloudinary'
  }

  // Get storage configuration based on environment
  getStorageConfig() {
    switch (this.storageType) {
      case 's3':
        return this.getS3Config();
      case 'cloudinary':
        return this.getCloudinaryConfig();
      default:
        return this.getLocalConfig();
    }
  }

  // AWS S3 Configuration
  getS3Config() {
    return multer({
      storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_S3_BUCKET,
        key: function (req, file, cb) {
          const adminId = req.user?.id || 'admin';
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const fileName = `admins/${adminId}/blogs/${adminId}-${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`;
          cb(null, fileName);
        },
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
          cb(null, {
            fieldName: file.fieldname,
            originalName: file.originalname,
            adminId: req.user?.id || 'admin'
          });
        }
      }),
      limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
      },
      fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed!'), false);
        }
      }
    });
  }

  // Cloudinary Configuration
  getCloudinaryConfig() {
    return multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
      },
      fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed!'), false);
        }
      }
    });
  }

  // Local Storage Configuration
  getLocalConfig() {
    const fs = require('fs');
    
    return multer({
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
          const adminId = req.user?.id || 'admin';
          const uploadBasePath = process.env.UPLOAD_PATH || path.join(__dirname, '../public/uploads');
          const uploadPath = path.join(uploadBasePath, 'admins', adminId, 'blogs');
          
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          
          cb(null, uploadPath);
        },
        filename: function (req, file, cb) {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const adminId = req.user?.id || 'admin';
          cb(null, `${adminId}-${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
        }
      }),
      limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
      },
      fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed!'), false);
        }
      }
    });
  }

  // Upload to Cloudinary
  async uploadToCloudinary(file, adminId = 'admin') {
    try {
      console.log('📝 Cloudinary Debug - Starting upload for file:', file.originalname);
      console.log('📝 Cloudinary Debug - File buffer:', file.buffer ? 'exists' : 'missing');
      console.log('📝 Cloudinary Debug - File size:', file.size);
      console.log('📝 Cloudinary Debug - Cloudinary config:', {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'set' : 'missing',
        api_key: process.env.CLOUDINARY_API_KEY ? 'set' : 'missing',
        api_secret: process.env.CLOUDINARY_API_SECRET ? 'set' : 'missing'
      });
      
      if (!file.buffer) {
        throw new Error('File buffer is missing. Make sure multer is using memoryStorage.');
      }
      
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileName = `${adminId}-${file.fieldname}-${uniqueSuffix}`;
      
      console.log('📝 Cloudinary Debug - Generated file name:', fileName);
      
      return new Promise((resolve, reject) => {
        const uploadOptions = {
          public_id: `blogs/${fileName}`,
          folder: `blogs`,
          resource_type: 'auto',
          transformation: [
            { width: 1200, height: 800, crop: 'limit' },
            { quality: 'auto' }
          ]
        };
        
        console.log('📝 Cloudinary Debug - Upload options:', uploadOptions);
        
        const uploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) {
              console.error('❌ Cloudinary Debug - Upload error:', error);
              console.error('❌ Cloudinary Debug - Error details:', JSON.stringify(error, null, 2));
              reject(error);
            } else {
              console.log('✅ Cloudinary Debug - Upload successful:', result.secure_url);
              resolve({
                url: result.secure_url,
                public_id: result.public_id,
                format: result.format,
                bytes: result.bytes
              });
            }
          }
        );
        
        console.log('📝 Cloudinary Debug - Writing buffer to stream');
        uploadStream.end(file.buffer);
      });
    } catch (error) {
      console.error('❌ Cloudinary Debug - Exception in uploadToCloudinary:', error);
      console.error('❌ Cloudinary Debug - Stack:', error.stack);
      throw error;
    }
  }

  // Get file URL based on storage type
  getFileUrl(file) {
    switch (this.storageType) {
      case 's3':
        return file.location; // S3 returns location directly
      case 'cloudinary':
        return file.url; // Cloudinary returns URL
      default:
        // Local storage - return relative path
        const adminId = file.metadata?.adminId || 'admin';
        return `/uploads/admins/${adminId}/blogs/${file.key}`;
    }
  }

  // Delete file from storage
  async deleteFile(fileUrl, adminId = 'admin') {
    try {
      switch (this.storageType) {
        case 's3':
          const s3Key = fileUrl.split('/').slice(-3).join('/'); // Extract key from URL
          await s3.deleteObject({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: s3Key
          }).promise();
          break;
          
        case 'cloudinary':
          const publicId = fileUrl.split('/').slice(-2).join('/').split('.')[0];
          await cloudinary.uploader.destroy(publicId);
          break;
          
        default:
          // Local storage - delete file
          const fs = require('fs');
          const filePath = path.join(__dirname, '../public/uploads', fileUrl);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
          break;
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  // Get storage info
  getStorageInfo() {
    return {
      type: this.storageType,
      configured: this.isConfigured(),
      endpoints: this.getEndpoints()
    };
  }

  // Check if storage is properly configured
  isConfigured() {
    switch (this.storageType) {
      case 's3':
        return !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_S3_BUCKET);
      case 'cloudinary':
        return !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
      default:
        return true; // Local storage is always available
    }
  }

  // Get storage endpoints
  getEndpoints() {
    switch (this.storageType) {
      case 's3':
        return {
          upload: '/api/admin/upload',
          baseUrl: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com`
        };
      case 'cloudinary':
        return {
          upload: '/api/admin/upload',
          baseUrl: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}`
        };
      default:
        return {
          upload: '/api/admin/upload',
          baseUrl: process.env.BASE_URL || 'http://localhost:5000'
        };
    }
  }
}

module.exports = new CloudStorageService();
