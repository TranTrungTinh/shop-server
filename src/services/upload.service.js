const cloudinary = require('../configs/upload.config')

// ? 1. Upload from url image
const uploadFromUrl = async (url, folderName) => {
  return await cloudinary.uploader.upload(url, {
    folder: ['product', folderName].join('/'),
    use_filename: true,
    unique_filename: false,
    overwrite: false,
    invalidate: true,
    transformation: [
      { width: 500, height: 500, crop: 'limit' }
    ]
  })
}