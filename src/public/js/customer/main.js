/**
 * Authentication JavaScript
 */
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginForm = document.getElementById('loginForm');
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    const registerForm = document.getElementById('registerForm');
    
    // Xử lý hiển thị/ẩn mật khẩu
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
    
    // Xử lý form đăng nhập
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const txtTenDangNhap = document.getElementById('loginUsername');
            const txtMatKhau = document.getElementById('loginPassword'); 
            const luuDangNhap = document.getElementById('rememberMe');
            try {
                const res = await fetch('/api/dang-nhap-khach-hang', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ tenDangNhap: txtTenDangNhap.value.trim(), matKhau: txtMatKhau.value.trim(), luuDangNhap: luuDangNhap.checked })
                });
                const data = await res.json();
                if(data.status){
                    // Đăng nhập thành công
                    showSuccessToastDangNhap(); // Hiển thị thông báo thành công
                    // Đóng modal
                    bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide(); // Đóng modal
                    this.reset(); // Reset form
                    setTimeout(() => {
                        window.location.reload(); // Tải lại trang
                    }, 2000); // Chuyển hướng sau 2 giây
                }
                else{
                    showErrorToast(); // Hiển thị thông báo lỗi
                    // Đăng nhập thất bại
                    console.error(data.error); // In ra lỗi để kiểm tra
                    alert(data.error); // Hiển thị thông báo lỗi
                }
                    
            } catch (error) {
                showErrorToast(); // Hiển thị thông báo lỗi
                console.error('Error:', error); // In ra lỗi để kiểm tra
            }
        })
    }
    if(registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const txtTen = document.getElementById('fullName');
            const txtSDT = document.getElementById('phone');
            const txtTenDangNhap = document.getElementById('username');
            const txtMatKhau = document.getElementById('password');
            const txtXacNhanMatKhau = document.getElementById('confirmPassword');
            const txtDiaChi = document.getElementById('address');
            const txtNgaySinh = document.getElementById('birthdate');
            const gioiTinh = document.querySelector('input[name="gender"]:checked');

            const isValidTen = kiemTraTen(txtTen);
            const isValidSDT = await kiemTraSDT(txtSDT);
            const isValidTenDangNhap = await kiemTraTenDangNhap(txtTenDangNhap);
            const isValidMatKhau = kiemTraMatKhau(txtMatKhau);
            const isValidXacNhanMatKhau = kiemTraXacNhanMatKhau(txtMatKhau, txtXacNhanMatKhau);
            const isValidDiaChi = kiemTraDiaChi(txtDiaChi);
            const isValidNgaySinh = kiemTraNgaySinh(txtNgaySinh);

            if(isValidTen && isValidSDT && isValidTenDangNhap && isValidMatKhau && isValidXacNhanMatKhau && isValidDiaChi && isValidNgaySinh){
                const khachHang = {
                    ten: txtTen.value.trim(),
                    gioiTinh: gioiTinh ? gioiTinh.value : null,
                    ngaySinh: txtNgaySinh.value.trim(),
                    soDienThoai: txtSDT.value.trim(),
                    diaChi: txtDiaChi.value.trim(),
                    tenDangNhap: txtTenDangNhap.value.trim(),
                    matKhau: txtMatKhau.value.trim()
                };
                try {
                    const response = await fetch('/api/dang-ky', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(khachHang)
                    })
                    const data = await response.json();
                    if(data.status){
                        showSuccessToastThem(); // Hiển thị thông báo thành công
                        // Đăng ký thành công
                        bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide(); // Đóng modal
                        this.reset(); // Reset form
                    }
                    else{
                        showErrorToast(); // Hiển thị thông báo lỗi
                        // Đăng ký thất bại
                        console.log(data.error); // In ra lỗi để kiểm tra
                    }
                } catch (error) {
                    showErrorToast(); // Hiển thị thông báo lỗi
                    console.error('Error:', error); // In ra lỗi để kiểm tra
                }
            }
        })
    }
    
});

function kiemTraTen(txtTen){
    let isValid = true;
    const errorMessage = txtTen.closest('.input-group').nextElementSibling;
    errorMessage.innerHTML = "&nbsp;"; // Reset error message
    if(txtTen.value.trim() === ""){
        isValid = false;
        errorMessage.innerHTML = "Tên không được để trống";
    }
    return isValid;
}
async function kiemTraTenDangNhap(txtTenDangNhap){
    let isValid = true;
    const errorMessage = txtTenDangNhap.closest('.input-group').nextElementSibling;
    errorMessage.innerHTML = "&nbsp;"; // Reset error message
    if(txtTenDangNhap.value.trim() === ""){
        isValid = false;
        errorMessage.innerHTML = "Tên đăng nhập không được để trống";
    }else if(txtTenDangNhap.value.length < 6){
        isValid = false;
        errorMessage.innerHTML = "Tên đăng nhập phải có ít nhất 6 ký tự";
    }else if(txtTenDangNhap.value.length > 20){
        isValid = false;
        errorMessage.innerHTML = "Tên đăng nhập không được quá 20 ký tự";
    }else if(!/^[a-zA-Z0-9]+$/.test(txtTenDangNhap.value)){
        isValid = false;
        errorMessage.innerHTML = "Tên đăng nhập chỉ được chứa chữ cái và số";
    }else if(!/^[a-zA-Z]/.test(txtTenDangNhap.value)){
        isValid = false;
        errorMessage.innerHTML = "Tên đăng nhập phải bắt đầu bằng chữ cái";
    }
    else{
        try{
            const res = await fetch('/api/kiem-tra-ten-dang-nhap', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tenDangNhap: txtTenDangNhap.value.trim() })
            });
            const data = await res.json();
            if(data.status){
                isValid = false;
                errorMessage.innerHTML = "Tên đăng nhập đã tồn tại";
            }
        }
        catch(error){
            showErrorToast(); // Hiển thị thông báo lỗi
            // In ra lỗi để kiểm tra
            console.error('Error:', error);
            isValid = false;
            errorMessage.innerHTML = "Lỗi kiểm tra tên đăng nhập";
        }

    }
    return isValid;
}
async function kiemTraSDT(txtSDT){
    let isValid = true;
    const errorMessage = txtSDT.closest('.input-group').nextElementSibling;
    errorMessage.innerHTML = "&nbsp;"; // Reset error message
    const regex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if(txtSDT.value.trim() === ""){
        isValid = false;
        errorMessage.innerHTML = "Số điện thoại không được để trống";
    }else if(!regex.test(txtSDT.value)){
        isValid = false;
        errorMessage.innerHTML = "Số điện thoại không hợp lệ";
    }
    else{
        try{
            const res = await fetch('/api/kiem-tra-so-dien-thoai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ soDienThoai: txtSDT.value.trim() })
            });
            const data = await res.json();
            if(data.status){
                isValid = false;
                errorMessage.innerHTML = "Số điện thoại đã tồn tại";
            }
        }
        catch(error){
            showErrorToast(); // Hiển thị thông báo lỗi
            // In ra lỗi để kiểm tra
            console.error('Error:', error);
            isValid = false;
            errorMessage.innerHTML = "Lỗi kiểm tra số điện thoại";
        }

    }
    return isValid;
}
function kiemTraMatKhau(txtMatKhau){
    let isValid = true;
    const errorMessage = txtMatKhau.closest('.input-group').nextElementSibling;
    errorMessage.innerHTML = "&nbsp;"; // Reset error message
    if(txtMatKhau.value.trim() === ""){
        isValid = false;
        errorMessage.innerHTML = "Mật khẩu không được để trống";
    }else if(txtMatKhau.value.length < 6){
        isValid = false;
        errorMessage.innerHTML = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    return isValid;
}
function kiemTraXacNhanMatKhau(txtMatKhau, txtXacNhanMatKhau){
    let isValid = true;
    const errorMessage = txtXacNhanMatKhau.closest('.input-group').nextElementSibling;
    errorMessage.innerHTML = "&nbsp;"; // Reset error message
    if(txtXacNhanMatKhau.value.trim() === ""){
        isValid = false;
        errorMessage.innerHTML = "Xác nhận mật khẩu không được để trống";
    }else if(txtMatKhau.value !== txtXacNhanMatKhau.value){
        isValid = false;
        errorMessage.innerHTML = "Mật khẩu xác nhận không khớp";
    }
    return isValid;
}
function kiemTraDiaChi(txtDiaChi){
    let isValid = true;
    const errorMessage = txtDiaChi.closest('.input-group').nextElementSibling;
    errorMessage.innerHTML = "&nbsp;"; // Reset error message
    if(txtDiaChi.value.trim() === ""){
        isValid = false;
        errorMessage.innerHTML = "Địa chỉ không được để trống";
    }
    return isValid;
}
function kiemTraNgaySinh(txtNgaySinh){
    let isValid = true;
    const errorMessage = txtNgaySinh.closest('.input-group').nextElementSibling;
    errorMessage.innerHTML = "&nbsp;"; // Reset error message
    if(txtNgaySinh.value.trim() === ""){
        isValid = false;
        errorMessage.innerHTML = "Ngày sinh không được để trống";
    }
    else{
        const today = new Date();
        const birthDate = new Date(txtNgaySinh.value);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        if(age < 18){
            isValid = false;
            errorMessage.innerHTML = "Bạn phải từ 18 tuổi trở lên để đăng ký tài khoản";
        }
    }
    
    return isValid;
}
function showSuccessToastThem() {
    const toastElement = document.getElementById('successToastThem');
    const toast = new bootstrap.Toast(toastElement, {
        delay: 3000 // Tự động ẩn sau 3 giây
    });
    
    // Hiển thị toast
    toast.show();
}
function showSuccessToastDangNhap() {
    const toastElement = document.getElementById('successToastDangNhap');
    const toast = new bootstrap.Toast(toastElement, {
        delay: 2000 // Tự động ẩn sau 3 giây
    });
    
    // Hiển thị toast
    toast.show();
}
function showErrorToast() {
    const toastElement = document.getElementById('failToast');
    const toast = new bootstrap.Toast(toastElement, {
        delay: 3000 // Tự động ẩn sau 3 giây
    });
    
    // Hiển thị toast
    toast.show();
}