require('dotenv').config();
const express = require('express');
const session = require('express-session');
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

app.get("/api/suggestions", async (req, res) => {
    const { province, district, ward_street, address } = req.query;
  
    const query = new URLSearchParams({
      province,
      district,
      ward_street,
      address: address || "",
    });
  
    try {
      const response = await fetch(
        `https://services.giaohangtietkiem.vn/services/address/getAddressLevel4?${query}`,
        {
          headers: {
            Token: "APITokenSample-ca441e70288cB0515F310742", // thay token thật tại đây
            "X-Client-Source": "PARTNER_CODE", // thay partner code thật nếu cần
          },
        }
      );
  
      const data = await response.json();
      res.json(data);
    } catch (err) {
      console.error("Error fetching address suggestions:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });


// Cấu hình Express để phục vụ file tĩnh trong thư mục 'public'
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

// Cấu hình EJS
app.engine('html', require('ejs').renderFile); // Cho phép sử dụng file .html
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

app.use('/api', apiRouter);
app.use('/manager', manageRouter);
app.use('/', customerRouter); // Đường dẫn cho router khách hàng

app.use((req, res, next) => {
    res.status(404).render('404.html'); // Render trang 404 nếu không tìm thấy route
});

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