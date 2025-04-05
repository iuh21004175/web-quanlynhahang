require('dotenv').config();
const express = require('express')
const cookieParser = require('cookie-parser');
const path = require('path');
const socketIo = require('socket.io');
const http = require('http');
const app = express();
const customerRouter = require('./router/customer');
const manageRouter = require('./router/manage');
const apiRouter = require('./router/api');
const chatService = require('./services/chat');
app.use(cookieParser());

// Cấu hình Express để phục vụ file tĩnh trong thư mục 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Cấu hình EJS
app.engine('html', require('ejs').renderFile); // Cho phép sử dụng file .html
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

app.use('/api', apiRouter);
app.use('/manager', manageRouter);
app.use('/', customerRouter); // Đường dẫn cho router khách hàng


// Cấu hình Socket.IO
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*'
    }
});
chatService(io); // Khởi tạo dịch vụ chat với Socket.IO
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});