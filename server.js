const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware để phục vụ tệp tĩnh trong thư mục public
app.use(express.static('public'));

// Middleware ghi log mỗi lần truy cập
app.use((req, res, next) => {
    const log = `[${new Date().toISOString()}] ${req.method} ${req.url}\n`;
    fs.appendFile(path.join(__dirname, 'logs', 'access.log'), log, err => {
        if (err) console.error('Lỗi ghi log:', err);
    });
    next();
});

app.listen(PORT, () => {
    console.log(`Server chạy ở http://localhost:${PORT}`);
});
