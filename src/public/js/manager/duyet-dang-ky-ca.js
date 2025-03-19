document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const weekFilter = document.getElementById('week-filter');
    const statusFilter = document.getElementById('status-filter');
    const tableBody = document.querySelector('#registerShiftTable tbody');
    const selectAllCheckbox = document.getElementById('select-all');
    const bulkApproveBtn = document.getElementById('btn-bulk-approve');
    const approveModal = new bootstrap.Modal(document.getElementById('approveModal'));
    const rejectModal = new bootstrap.Modal(document.getElementById('rejectModal'));
    const btnApproveConfirm = document.getElementById('btn-approve-confirm');
    const btnRejectConfirm = document.getElementById('btn-reject-confirm');
    const shiftIdInput = document.getElementById('shift-id');
    const rejectShiftIdInput = document.getElementById('reject-shift-id');
    const rejectReasonInput = document.getElementById('reject-reason');
    const successToast = new bootstrap.Toast(document.getElementById('successToast'));

    // Set default week to current week
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
    const firstDayOfYear = new Date(year, 0, 1);
    const pastDaysOfYear = (new Date(year, month, day) - firstDayOfYear) / 86400000;
    const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    
    // Format: YYYY-Www
    const formattedWeek = `${year}-W${weekNumber.toString().padStart(2, '0')}`;
    weekFilter.value = formattedWeek;

    // Fetch data and populate table
    function loadShiftRegistrations() {
        // Lấy giá trị từ bộ lọc
        const week = weekFilter.value;
        const status = statusFilter.value;
        
        // Clear table and show loading
        //tableBody.innerHTML = '<tr><td colspan="8" class="text-center">Đang tải dữ liệu...</td></tr>';
        
        // Fetch API
        fetch(`/api/shift-registrations?week=${week}&status=${status}`)
            .then(response => response.json())
            .then(data => {
                // Clear loading
                tableBody.innerHTML = '';
                
                if (data.length === 0) {
                    tableBody.innerHTML = '<tr><td colspan="8" class="text-center">Không có dữ liệu</td></tr>';
                    return;
                }
                
                // Populate table
                data.forEach(reg => {
                    const row = document.createElement('tr');
                    
                    // Format date
                    const date = new Date(reg.date);
                    const formattedDate = date.toLocaleDateString('vi-VN', { 
                        weekday: 'long', 
                        day: '2-digit', 
                        month: '2-digit', 
                        year: 'numeric' 
                    });
                    
                    // Status badge class
                    let statusClass = '';
                    let statusText = '';
                    switch(reg.status) {
                        case 'pending':
                            statusClass = 'status-pending';
                            statusText = 'Chờ duyệt';
                            break;
                        case 'approved':
                            statusClass = 'status-approved';
                            statusText = 'Đã duyệt';
                            break;
                        case 'rejected':
                            statusClass = 'status-rejected';
                            statusText = 'Từ chối';
                            break;
                    }
                    
                    // Buttons based on status
                    let actionButtons = '';
                    if (reg.status === 'pending') {
                        actionButtons = `
                            <button class="btn btn-sm btn-success action-btn approve-btn" 
                                    data-id="${reg.id}" 
                                    data-bs-tooltip="tooltip"
                                    title="Duyệt">
                                <i class="fas fa-check"></i>
                            </button>
                            <button class="btn btn-sm btn-danger action-btn reject-btn"
                                    data-id="${reg.id}"
                                    data-bs-tooltip="tooltip"
                                    title="Từ chối">
                                <i class="fas fa-times"></i>
                            </button>
                        `;
                    } else {
                        actionButtons = `
                            <button class="btn btn-sm btn-secondary action-btn" disabled>
                                <i class="fas fa-check"></i>
                            </button>
                            <button class="btn btn-sm btn-secondary action-btn" disabled>
                                <i class="fas fa-times"></i>
                            </button>
                        `;
                    }
                    
                    row.innerHTML = `
                        <td>
                            <input type="checkbox" class="shift-checkbox" 
                                   data-id="${reg.id}" ${reg.status !== 'pending' ? 'disabled' : ''}>
                        </td>
                        <td>${reg.employeeName}</td>
                        <td>${formattedDate}</td>
                        <td>${reg.shiftName}</td>
                        <td>${reg.startTime} - ${reg.endTime}</td>
                        <td>${reg.note || '-'}</td>
                        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                        <td>
                            ${actionButtons}
                        </td>
                    `;
                    
                    tableBody.appendChild(row);
                });
                
                // Initialize tooltips
                const tooltips = [].slice.call(document.querySelectorAll('[data-bs-tooltip="tooltip"]'));
                tooltips.map(function (tooltipTriggerEl) {
                    return new bootstrap.Tooltip(tooltipTriggerEl);
                });
                
                // Attach event listeners to new buttons
                attachEventListeners();
            })
            .catch(error => {
                console.error('Error:', error);
                //tableBody.innerHTML = `<tr><td colspan="8" class="text-center text-danger">Đã xảy ra lỗi khi tải dữ liệu</td></tr>`;
            });
    }
    
    // Attach event listeners to dynamic content
    function attachEventListeners() {
        // Approve buttons
        document.querySelectorAll('.approve-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                shiftIdInput.value = id;
                approveModal.show();
            });
        });
        
        // Reject buttons
        document.querySelectorAll('.reject-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                rejectShiftIdInput.value = id;
                rejectModal.show();
            });
        });
        
        // Checkboxes
        document.querySelectorAll('.shift-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', updateBulkApproveButton);
        });
    }
    
    // Update bulk approve button state
    function updateBulkApproveButton() {
        const checkedBoxes = document.querySelectorAll('.shift-checkbox:checked').length;
        bulkApproveBtn.disabled = checkedBoxes === 0;
    }
    
    // Approve shift registration
    function approveShift(id) {
        fetch(`/api/shift-registrations/${id}/approve`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            successToast.show();
            loadShiftRegistrations();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Đã xảy ra lỗi khi duyệt ca làm việc');
        });
    }
    
    // Reject shift registration
    function rejectShift(id, reason) {
        fetch(`/api/shift-registrations/${id}/reject`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ reason: reason })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            successToast.show();
            document.querySelector('.toast-body').textContent = 'Đã từ chối ca làm việc!';
            loadShiftRegistrations();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Đã xảy ra lỗi khi từ chối ca làm việc');
        });
    }
    
    // Bulk approve selected shifts
    function bulkApprove() {
        const selectedIds = Array.from(document.querySelectorAll('.shift-checkbox:checked'))
                                 .map(cb => cb.getAttribute('data-id'));
        
        if (selectedIds.length === 0) return;
        
        fetch('/api/shift-registrations/bulk-approve', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ids: selectedIds })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            successToast.show();
            loadShiftRegistrations();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Đã xảy ra lỗi khi duyệt hàng loạt ca làm việc');
        });
    }

    // Event Listeners
    weekFilter.addEventListener('change', loadShiftRegistrations);
    statusFilter.addEventListener('change', loadShiftRegistrations);
    
    // Select all checkbox
    selectAllCheckbox.addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.shift-checkbox:not([disabled])');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
        updateBulkApproveButton();
    });
    
    // Bulk approve button
    bulkApproveBtn.addEventListener('click', bulkApprove);
    
    // Confirm approve button in modal
    btnApproveConfirm.addEventListener('click', function() {
        const id = shiftIdInput.value;
        approveModal.hide();
        approveShift(id);
    });
    
    // Confirm reject button in modal
    btnRejectConfirm.addEventListener('click', function() {
        const id = rejectShiftIdInput.value;
        const reason = rejectReasonInput.value;
        rejectModal.hide();
        rejectShift(id, reason);
        rejectReasonInput.value = '';
    });
    
    // Initial load
    loadShiftRegistrations();
});