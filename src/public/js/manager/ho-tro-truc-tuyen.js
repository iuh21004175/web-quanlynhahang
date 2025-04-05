document.addEventListener('DOMContentLoaded', function() {
    // Xử lý khi click vào một cuộc hội thoại
    const conversationItems = document.querySelectorAll('.conversation-item');
    conversationItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all conversations
            conversationItems.forEach(conv => conv.classList.remove('active'));
            
            // Add active class to clicked conversation
            this.classList.add('active');
            
            // Remove new message indicator
            this.classList.remove('new-message');
            
            // Remove badge if exists
            const badge = this.querySelector('.badge');
            if (badge) badge.remove();
            
            // In a real application, you would load conversation data here
            const conversationId = this.getAttribute('data-conversation-id');
            console.log('Loading conversation:', conversationId);
            
            // For demo purposes, update header with customer name
            const customerName = this.querySelector('h6').textContent;
            const headerName = document.querySelector('.chat-header h6');
            if (headerName) headerName.textContent = customerName;
            
            // Scroll chat to bottom
            setTimeout(() => {
                scrollChatToBottom();
            }, 100);
        });
    });
    
    // Xử lý gửi tin nhắn
    const messageInput = document.getElementById('messageInput');
    const btnSendMessage = document.getElementById('btnSendMessage');
    
    function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;
        
        // Get current time for the message
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const timeString = `${hours}:${minutes}`;
        
        // Create HTML for the message
        const messageHTML = `
            <div class="message-row staff mb-3">
                <div class="message-content">
                    <div class="message-bubble">
                        ${message}
                    </div>
                    <div class="message-info text-end">
                        <small class="text-muted">${timeString}</small>
                    </div>
                </div>
            </div>
        `;
        
        // Add message to chat
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.insertAdjacentHTML('beforeend', messageHTML);
        
        // Check if we need to send menu or promo
        const sendMenu = document.getElementById('btnSendMenu');
        const sendPromo = document.getElementById('btnSendPromo');
        
        if (sendMenu && sendMenu.checked) {
            setTimeout(() => {
                const menuHTML = `
                    <div class="message-row staff mb-3">
                        <div class="message-content">
                            <div class="message-bubble">
                                Đây là link thực đơn của nhà hàng: <a href="#" class="text-white">https://nhahang.com/thuc-don</a>
                            </div>
                            <div class="message-info text-end">
                                <small class="text-muted">${hours}:${String(parseInt(minutes) + 1).padStart(2, '0')}</small>
                            </div>
                        </div>
                    </div>
                `;
                chatMessages.insertAdjacentHTML('beforeend', menuHTML);
                sendMenu.checked = false;
                scrollChatToBottom();
            }, 500);
        }
        
        if (sendPromo && sendPromo.checked) {
            setTimeout(() => {
                const promoHTML = `
                    <div class="message-row staff mb-3">
                        <div class="message-content">
                            <div class="message-bubble">
                                Nhà hàng đang có chương trình khuyến mãi: Giảm 15% cho đơn đặt bàn online trước 3 ngày. Mã ưu đãi: ONLINE15
                            </div>
                            <div class="message-info text-end">
                                <small class="text-muted">${hours}:${String(parseInt(minutes) + 2).padStart(2, '0')}</small>
                            </div>
                        </div>
                    </div>
                `;
                chatMessages.insertAdjacentHTML('beforeend', promoHTML);
                sendPromo.checked = false;
                scrollChatToBottom();
            }, 1000);
        }
        
        // Clear input and scroll to bottom
        messageInput.value = '';
        scrollChatToBottom();
        
        // Simulate customer typing (for demo)
        simulateCustomerTyping();
    }
    
    function scrollChatToBottom() {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
    
    // Gửi tin nhắn khi nhấn nút hoặc Enter
    if (btnSendMessage && messageInput) {
        btnSendMessage.addEventListener('click', sendMessage);
        
        messageInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
    
    // Xử lý các template tin nhắn nhanh
    const quickReplyItems = document.querySelectorAll('.quick-reply');
    quickReplyItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            messageInput.value = this.textContent;
            messageInput.focus();
        });
    });
    
    // Cuộn xuống cuối cùng khi tải trang
    scrollChatToBottom();
    
    // Xử lý trạng thái sẵn sàng
    const toggleAvailability = document.getElementById('toggleAvailability');
    if (toggleAvailability) {
        toggleAvailability.addEventListener('change', function() {
            const label = this.nextElementSibling;
            if (this.checked) {
                label.textContent = 'Sẵn sàng';
                label.classList.remove('text-muted');
                label.classList.add('text-success');
            } else {
                label.textContent = 'Không sẵn sàng';
                label.classList.remove('text-success');
                label.classList.add('text-muted');
            }
        });
    }
    
    // Xử lý nút làm mới
    const btnRefresh = document.getElementById('btnRefresh');
    if (btnRefresh) {
        btnRefresh.addEventListener('click', function() {
            this.querySelector('i').classList.add('fa-spin');
            
            // Simulate refreshing data
            setTimeout(() => {
                this.querySelector('i').classList.remove('fa-spin');
                // In a real application, you would refresh conversation list here
            }, 1000);
        });
    }
    
    // Xử lý nút đánh dấu đã giải quyết
    const btnResolve = document.getElementById('btnResolve');
    if (btnResolve) {
        btnResolve.addEventListener('click', function() {
            const activeConversation = document.querySelector('.conversation-item.active');
            if (activeConversation) {
                const smallText = activeConversation.querySelector('small:last-child');
                if (smallText) {
                    let text = smallText.textContent;
                    if (!text.includes('Đã giải quyết')) {
                        smallText.textContent = text.split('•')[0] + '• Đã giải quyết';
                        
                        // Change button style
                        this.classList.remove('btn-outline-success');
                        this.classList.add('btn-success');
                        this.innerHTML = '<i class="fas fa-check"></i>';
                        this.title = 'Đã giải quyết';
                    }
                }
            }
        });
    }
    
    // Tìm kiếm cuộc hội thoại
    const searchInput = document.getElementById('searchConversation');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            conversationItems.forEach(item => {
                const name = item.querySelector('h6').textContent.toLowerCase();
                const message = item.querySelector('p').textContent.toLowerCase();
                const info = item.querySelector('small:last-child').textContent.toLowerCase();
                
                if (name.includes(searchTerm) || message.includes(searchTerm) || info.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
    
    // Mô phỏng khách hàng đang gõ
    function simulateCustomerTyping() {
        const chatMessages = document.getElementById('chatMessages');
        const typingHTML = `
            <div class="message-row customer mb-3" id="typingIndicator">
                <div class="message-content">
                    <div class="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;
        
        chatMessages.insertAdjacentHTML('beforeend', typingHTML);
        scrollChatToBottom();
        
        // Mô phỏng phản hồi từ khách hàng sau một khoảng thời gian
        setTimeout(() => {
            const typingIndicator = document.getElementById('typingIndicator');
            if (typingIndicator) typingIndicator.remove();
            
            // Các phản hồi có thể có từ khách hàng
            const responses = [
                "Cảm ơn bạn rất nhiều!",
                "Vâng, tôi hiểu rồi. Cảm ơn bạn!",
                "Thông tin này rất hữu ích.",
                "Tôi có thể hỏi thêm về giờ mở cửa của nhà hàng không?",
                "Nhà hàng có chỗ đậu xe không?",
                "Tôi nên đặt bàn trước bao lâu?"
            ];
            
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            
            const responseHTML = `
                <div class="message-row customer mb-3">
                    <div class="message-content">
                        <div class="message-bubble">
                            ${randomResponse}
                        </div>
                        <div class="message-info">
                            <small class="text-muted">${hours}:${minutes}</small>
                        </div>
                    </div>
                </div>
            `;
            
            chatMessages.insertAdjacentHTML('beforeend', responseHTML);
            scrollChatToBottom();
        }, 2000 + Math.random() * 2000); // Random delay between 2-4 seconds
    }
});