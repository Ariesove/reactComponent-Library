const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

// 初始化 Express 应用程序
const app = express();
const PORT = process.env.PORT || 5000;

// 配置 CORS
app.use(cors());

// 配置 Multer 存储设置
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // 文件保存的目录
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // 文件名
  }
});

// 初始化 Multer 中间件
const upload = multer({ storage: storage });

// 创建文件上传处理路由
app.post('/upload', upload.single('chunk'), (req, res) => {
  console.log(`Received chunk ${req.body.index}`);
  res.status(200).json({ message: 'Chunk uploaded successfully' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});