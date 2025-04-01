document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const visitorForm = document.getElementById('visitorForm');
    const fullNameInput = document.getElementById('fullName');
    const addressInput = document.getElementById('address');
    const phoneInput = document.getElementById('phone');
    const lastVisitInput = document.getElementById('lastVisit');
    const editIdInput = document.getElementById('editId');
    const submitBtn = document.getElementById('submitBtn');
    const cancelEditBtn = document.getElementById('cancelEdit');
    const visitorsList = document.getElementById('visitorsList');
    const formTitle = document.getElementById('formTitle');
    
    // Хранилище данных
    let visitors = JSON.parse(localStorage.getItem('visitors')) || [];
    let editMode = false;
    let currentEditId = null;
    
    // Отображение данных
    function displayVisitors() {
        if (visitors.length === 0) {
            visitorsList.innerHTML = '<tr><td colspan="5" class="no-visitors">Нет записей о посетителях</td></tr>';
            return;
        }
        
        visitorsList.innerHTML = '';
        
        visitors.forEach(visitor => {
            const row = document.createElement('tr');
            if (visitor.id === currentEditId) {
                row.classList.add('edit-mode');
            }
            
            row.innerHTML = `
                <td>${visitor.fullName}</td>
                <td>${visitor.address}</td>
                <td>${visitor.phone}</td>
                <td>${formatDate(visitor.lastVisit)}</td>
                <td class="actions">
                    <button onclick="editVisitor(${visitor.id})" class="btn-success">Изменить</button>
                    <button onclick="deleteVisitor(${visitor.id})" class="btn-danger">Удалить</button>
                </td>
            `;
            
            visitorsList.appendChild(row);
        });
    }
    
    // Форматирование даты
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('ru-RU', options);
    }
    
    // Добавление/обновление посетителя
    visitorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const visitorData = {
            fullName: fullNameInput.value.trim(),
            address: addressInput.value.trim(),
            phone: phoneInput.value.trim(),
            lastVisit: lastVisitInput.value
        };
        
        if (editMode) {
            // Редактирование существующей записи
            const index = visitors.findIndex(v => v.id === currentEditId);
            if (index !== -1) {
                visitors[index] = { ...visitors[index], ...visitorData };
            }
        } else {
            // Добавление новой записи
            const newVisitor = {
                id: Date.now(),
                ...visitorData
            };
            visitors.unshift(newVisitor);
        }
        
        // Сохранение и обновление
        saveToLocalStorage();
        resetForm();
        displayVisitors();
    });
    
    // Редактирование посетителя
    window.editVisitor = function(id) {
        const visitor = visitors.find(v => v.id === id);
        if (visitor) {
            editMode = true;
            currentEditId = id;
            
            // Заполнение формы
            fullNameInput.value = visitor.fullName;
            addressInput.value = visitor.address;
            phoneInput.value = visitor.phone;
            lastVisitInput.value = visitor.lastVisit;
            editIdInput.value = visitor.id;
            
            // Изменение интерфейса
            submitBtn.textContent = 'Обновить';
            submitBtn.className = 'btn-success';
            formTitle.textContent = 'Редактировать посетителя';
            cancelEditBtn.style.display = 'block';
            
            // Прокрутка к форме
            document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
            
            // Обновление таблицы для подсветки редактируемой строки
            displayVisitors();
        }
    };
    
    // Удаление посетителя
    window.deleteVisitor = function(id) {
        if (confirm('Вы уверены, что хотите удалить этого посетителя?')) {
            visitors = visitors.filter(v => v.id !== id);
            saveToLocalStorage();
            
            if (editMode && currentEditId === id) {
                resetForm();
            }
            
            displayVisitors();
        }
    };
    
    // Отмена редактирования
    cancelEditBtn.addEventListener('click', resetForm);
    
    // Сброс формы
    function resetForm() {
        editMode = false;
        currentEditId = null;
        visitorForm.reset();
        editIdInput.value = '';
        submitBtn.textContent = 'Добавить';
        submitBtn.className = 'btn-primary';
        formTitle.textContent = 'Добавить нового посетителя';
        cancelEditBtn.style.display = 'none';
        
        // Обновление таблицы для снятия подсветки
        displayVisitors();
    }
    
    // Сохранение в localStorage
    function saveToLocalStorage() {
        localStorage.setItem('visitors', JSON.stringify(visitors));
    }
    
    // Маска для телефона (+375)
phoneInput.addEventListener('input', function(e) {
    let value = this.value.replace(/\D/g, '');
    let formattedValue = '';
    
    if (value.length > 0) {
        formattedValue += '+375 (';
        if (value.length > 3) {
            formattedValue += value.substring(3, Math.min(5, value.length));
        }
        if (value.length >= 5) {
            formattedValue += ') ' + value.substring(5, Math.min(8, value.length));
        }
        if (value.length >= 8) {
            formattedValue += '-' + value.substring(8, Math.min(10, value.length));
        }
        if (value.length >= 10) {
            formattedValue += '-' + value.substring(10, Math.min(12, value.length));
        }
    }
    
    this.value = formattedValue;
});
    
    // Установка текущей даты по умолчанию
    const today = new Date().toISOString().split('T')[0];
    lastVisitInput.value = today;
    
    // Первоначальная загрузка данных
    displayVisitors();
});