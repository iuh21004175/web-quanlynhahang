document.addEventListener('DOMContentLoaded', async function() {
    let listDanhMucMonAn = await getAPIDanhMucMonAn();
    thaoTacVoiBang(listDanhMucMonAn);
    
    // Xử lý form thêm danh mục
    const addCategoryForm = document.getElementById('addCategoryForm');
    addCategoryForm.addEventListener('submit',  async function(e) {
        e.preventDefault();
        // Xử lý thêm danh mục ở đây
        const tenDanhMuc = this.querySelector('#txt-themDanhMuc').value;
        try {
            const response = await fetch('/api/danh-muc-mon-an', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tenDanhMuc })
            });
            const data = await response.json();
            if(data.status){
                // Thêm thành công
                listDanhMucMonAn.push(data.obj);
                thaoTacVoiBang(listDanhMucMonAn);
                showSuccessToastThem();
                // Đóng modal sau khi thêm
                bootstrap.Modal.getInstance(document.getElementById('addCategoryModal')).hide();
                this.reset();
            }
            else{
                showErrorToast();
                console.error('Lỗi server:', data.error);
            }
        } catch (error) {
            showErrorToast();
            console.error('Error:', error);
        }
    
    });

    // Xử lý form chỉnh sửa danh mục
    const editCategoryForm = document.getElementById('editCategoryForm');
    editCategoryForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        // Xử lý cập nhật danh mục ở đây
        const tenDanhMuc = this.querySelector('#txt-suaDanhMuc').value;
        const id = this.querySelector('#editCategoryId').value;
        try {
            const res = await fetch('/api/danh-muc-mon-an', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id, tenDanhMuc })
            })
            const data = await res.json();
            if(data.status){
                // Cập nhật thành công
                const index = listDanhMucMonAn.findIndex(dm => dm.id == id);
                listDanhMucMonAn[index] = data.obj;
                thaoTacVoiBang(listDanhMucMonAn);
                showSuccessToastSua();
            }
            else{
                showErrorToast();
                console.error('Lỗi server:', data.error);
            }
        } catch (error) {
            showErrorToast();
            console.error('Error:', error);
        }
        // Đóng modal sau khi cập nhật
        bootstrap.Modal.getInstance(document.getElementById('editCategoryModal')).hide();
    });
});

async function getAPIDanhMucMonAn(){
    const response = await fetch('/api/danh-muc-mon-an');
    try{
        const data = await response.json();
        if(data.status){
            return data.list;
        }
        else{
            showErrorToast();
            console.error('Lỗi server:', data.error);
            return [];
        }
    }
    catch(error){
        showErrorToast();
        console.error('Error:', error);
    }
}
function thaoTacVoiBang(list){
    const tableDanhSach = document.querySelector('.table-danhSach tbody');
    tableDanhSach.innerHTML = '';
    list.forEach((dm, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${dm.tenDanhMuc}</td>
            <td>
                <button class="btn btn-sm btn-primary btn-sua" 
                    data-bs-toggle="modal" 
                    data-bs-target="#editCategoryModal" 
                    data-bs-tooltip="tooltip"
                    title="Chỉnh sửa"
                    data-id="${dm.id}">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        tableDanhSach.appendChild(tr);
    });
    // Khởi tạo tất cả tooltips
    const tooltips = document.querySelectorAll('[data-bs-tooltip="tooltip"]');
    tooltips.forEach(tooltip => {
        new bootstrap.Tooltip(tooltip);
    });
    document.querySelectorAll('.btn-sua').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.dataset.id;
            const dm = list.find(dm => dm.id == id);
            console.log(id)
            editCategoryForm.querySelector('#txt-suaDanhMuc').value = dm.tenDanhMuc;
            editCategoryForm.querySelector('#editCategoryId').value = id;
        });
    })
}
// Hàm hiển thị thông báo thêm thành công
function showSuccessToastThem() {
    const toastElement = document.getElementById('successToastThem');
    const toast = new bootstrap.Toast(toastElement, {
        delay: 3000 // Tự động ẩn sau 3 giây
    });
    
    // Hiển thị toast
    toast.show();
}
// Hàm hiển thị thông báo thêm thành công
function showSuccessToastSua() {
    const toastElement = document.getElementById('successToastSua');
    const toast = new bootstrap.Toast(toastElement, {
        delay: 3000 // Tự động ẩn sau 3 giây
    });
    
    // Hiển thị toast
    toast.show();
}
// Hàm hiển thị thông báo lỗi
function showErrorToast() {
    const toastElement = document.getElementById('failToast');
    const toast = new bootstrap.Toast(toastElement, {
        delay: 3000 // Tự động ẩn sau 3 giây
    });
    
    // Hiển thị toast
    toast.show();
}