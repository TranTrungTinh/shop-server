const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dnguyen',
  api_key: '123456789',
  api_secret: '123456789',
});

module.exports = cloudinary;