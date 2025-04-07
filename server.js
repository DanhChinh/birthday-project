const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware để phục vụ tệp tĩnh trong thư mục public
app.use(express.static('public'));

// Đường dẫn đến file logs.txt ở thư mục gốc
const logPath = path.join(__dirname, 'logs.txt');

// Middleware ghi log truy cập
app.use((req, res, next) => {
    const log = `[${new Date().toISOString()}] ${req.method} ${req.url}\n`;

    // Kiểm tra và tạo file nếu chưa tồn tại (nếu cần thiết)
    fs.access(logPath, fs.constants.F_OK, (err) => {
        if (err) {
            // File chưa tồn tại -> tạo mới
            fs.writeFile(logPath, log, (err) => {
                if (err) console.error('Lỗi tạo log:', err);
            });
        } else {
            // File đã tồn tại -> ghi tiếp
            fs.appendFile(logPath, log, (err) => {
                if (err) console.error('Lỗi ghi log:', err);
            });
        }
    });

    next();
});
app.listen(PORT, () => {
    console.log(`Server chạy ở http://localhost:${PORT}`);
});