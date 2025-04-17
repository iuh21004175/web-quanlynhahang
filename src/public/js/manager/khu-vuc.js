document.addEventListener('DOMContentLoaded', async function() {
    const addAreaForm = document.getElementById('addAreaForm');
    const addAreaModal = document.getElementById('addAreaModal');
    const editAreaModal = document.getElementById('editAreaModal');
    const editAreaForm = document.getElementById('editAreaForm');
    
    let listKhuVuc = await getAPIKhuVuc();
    thaoTacVoiBang(listKhuVuc);


    // Xử lý form thêm khu vực
    document.getElementById('addAreaForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        // TODO: Xử lý thêm khu vực
        const tenKhuVuc = document.querySelector('.txt-themKhuVuc').value;
        try{
            const res = await fetch('/api/khu-vuc', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tenKhuVuc
                })
            })
            const data = await res.json();
            if(data.status){
                showSuccessToastThem();
                listKhuVuc.unshift(data.obj);
                bootstrap.Modal.getInstance(addAreaModal).hide();
                addAreaForm.reset();
                thaoTacVoiBang(listKhuVuc);
            }
            else{
                showErrorToast();
                console.log(data.error);
            }
        }
        catch(err){
            showErrorToast();
            console.log(err);
        }
    });

    // Xử lý form chỉnh sửa khu vực
    document.getElementById('editAreaForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const tenKhuVuc = document.querySelector('.txt-suaKhuVuc').value;
        const areaId = document.querySelector('.txt-suaKhuVuc').dataset.id;
        try{
            const res = await fetch('/api/khu-vuc', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tenKhuVuc,
                    id: areaId
                })
            })
            const data = await res.json();
            if(data.status){
                showSuccessToastSua();
                const index = listKhuVuc.findIndex(item => item.id == areaId);
                if(index !== -1){
                    listKhuVuc[index].tenKhuVuc = tenKhuVuc;
                }
                bootstrap.Modal.getInstance(editAreaModal).hide();
                editAreaForm.reset();
                thaoTacVoiBang(listKhuVuc);
            }
            else{
                showErrorToast();
                console.log(data.error);
            }
        }
        catch(error){
            showErrorToast();
            console.log(error);
        }
    });
});
async function getAPIKhuVuc() {
    try{
        const res = await fetch('/api/khu-vuc')
        const data = await res.json();
        if(data.status){
            return data.list;
        }
        else{
            showErrorToast();
            console.log(data.error);
            return []
        }
    }
    catch(err){
        showErrorToast();
        console.log(err);
        return []
    }
}
function thaoTacVoiBang(list){
    const tableBody = document.querySelector('.table-danhSach tbody');
    tableBody.innerHTML = ''; // Xóa nội dung cũ
    list.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.tenKhuVuc}</td>
            <td>
                <button class="btn btn-sm btn-primary btn-sua" 
                    data-bs-toggle="modal"
                    data-bs-target="#editAreaModal"
                    data-bs-tooltip="tooltip"
                    data-id="${item.id}"
                    title="Chỉnh sửa">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    const tooltips = document.querySelectorAll('[data-bs-tooltip="tooltip"]');
    tooltips.forEach(tooltip => {
        new bootstrap.Tooltip(tooltip);
    });
    document.querySelectorAll('.btn-sua').forEach(button => {
        button.addEventListener('click', function() {
            const areaId = this.dataset.id;
            const areaName = this.closest('tr').querySelector('td:nth-child(2)').textContent;
            document.querySelector('.txt-suaKhuVuc').value = areaName;
            document.querySelector('.txt-suaKhuVuc').dataset.id = areaId;
        });
    });
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
// Hàm hiển thị thông báo sửa thành công
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