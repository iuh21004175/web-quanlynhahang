require('dotenv').config();
const express = require('express')
const path = require('path');
const app = express();
const manageRouter = require('./router/manage');

// Cấu hình Express để phục vụ file tĩnh trong thư mục 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Cấu hình EJS
app.engine('html', require('ejs').renderFile); // Cho phép sử dụng file .html
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

app.use('/manager', manageRouter);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});