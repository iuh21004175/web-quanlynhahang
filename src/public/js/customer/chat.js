/**
 * Chat Widget Functionality
 */
document.addEventListener('DOMContentLoaded', async function() {
    // DOM Elements
    const chatButton = document.getElementById('chatButton');
    const chatContainer = document.getElementById('chatContainer');
    const chatClose = document.getElementById('chatClose');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const userId = document.getElementById('userId').value;
    const socket = io();
    
    socket.on('connect', async () => {
        console.log('Kết nối thành công:', socket.id);
        socket.emit('khach-hang-vao-chat', {id: userId});
        // Toggle chat open/close
            
        // Lắng nghe tin nhắn nhà hàng gửi đến hồi thoại
        socket.on(`tin-nhan-nha-hang-${userId}`, function(data) {
            if (!chatContainer.classList.contains('active')) {
                const unreadBadge = document.getElementById('unreadBadge');
                unreadBadge.classList.add('show');
                document.getElementById('chatButton').classList.add('new-message');
                unreadBadge.innerHTML = parseInt(unreadBadge.textContent) + 1 || 1;
            }
            addMessage(data, 'admin');
            console.log(1)
        });
            
             
            
    });
    if(userId) {
        const listTinNhan = await getAPITinNhan(userId);
        await renderTinNhan(listTinNhan);
            
        const hoiThoai = await getAPIHoiThoai(userId);
        if(hoiThoai.nguoiGuiCuoi == 0 && parseInt(hoiThoai.soChuaDocKhach) > 0) {
            const unreadBadge = document.getElementById('unreadBadge');
            unreadBadge.classList.add('show');
            document.getElementById('chatButton').classList.add('new-message');
            unreadBadge.innerHTML = hoiThoai.soChuaDocKhach;
        }
        // Send message on button click
        chatSend.addEventListener('click', sendMessage);
                
        // Send message on Enter key
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
        
    chatClose.addEventListener('click', function() {
        socket.emit('khach-hang-doc-tin-nhan', { 
            idKhachHang: userId,
            status: false
        });
        chatContainer.classList.remove('active');
    });
    // Hiển thị tin nhắn chưa đọc khi vửa vào trang web
    chatButton.addEventListener('click', function() {
        socket.emit('khach-hang-doc-tin-nhan', {
            idKhachHang: userId,
            status: true
        });
        chatContainer.classList.add('active');
        const unreadBadge = document.getElementById('unreadBadge');
        unreadBadge.classList.remove('show');
        unreadBadge.innerHTML = 0;
        document.getElementById('chatButton').classList.remove('new-message');
        scrollToBottom();
        console.log('Đã đọc tin nhắn');
    });
    /**
    * Add a message to the chat
    */
    function sendMessage() {
        const chatInput = document.getElementById('chatInput');
        const messageText = chatInput.value.trim();
        
        if (messageText) {
            socket.emit('khach-hang-gui-tin-nhan', { 
                idKhachHang: userId, 
                noiDung: messageText,
                thoiGianGui: new Date().toISOString() 
            });
            addMessage({noiDung: messageText, thoiGianGui: new Date()}, 'user');
            chatInput.value = ''; // Clear input field
        }
    }
    

});
async function getAPITinNhan(id) {
    try {
        const response = await fetch(`/api/tin-nhan?id=${id}`);
        const data = await response.json();
        if (data.status) {
            return data.list;
        } else {
            console.error('Lỗi khi lấy tin nhắn:', data.error);
            return [];
        }
    } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        return [];
    }
}
async function getAPIHoiThoai(id){
    try {
        const response = await fetch(`/api/hoi-thoai?id=${id}`);
        const data = await response.json();
        if (data.status) {
            return data.obj;
        } else {
            console.error('Lỗi khi lấy hội thoại:', data.error);
            return null;
        }
    } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        return null;
    }
}
async function renderTinNhan(list) {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = ''; // Clear existing messages
    // Render messages
    list.forEach(tinNhan => {
        const sender = tinNhan.nguoiGui === 1 ? 'user' : 'admin';
        addMessage(tinNhan, sender);
    })
    
}
function addMessage(tinNhan, sender) {
    const time = new Date(tinNhan.thoiGianGui).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.innerHTML = `
        <div class="message-content">${tinNhan.noiDung}</div>
        <div class="message-time">${time}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

function scrollToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}