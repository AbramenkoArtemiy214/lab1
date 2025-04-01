// Генерация случайного дробного массива 10x10
function generateRandomFloatArray() {
    const array = [];
    for (let i = 0; i < 100; i++) {
        array.push(+(Math.random() * 90 + 10).toFixed(4)); // от 10.0000 до 100.0000
    }
    return array;
}

// Отображение массива в таблице с заданной точностью
function displayArray(array, tableId, precision = 2) {
    const table = document.getElementById(tableId);
    table.innerHTML = '';
    
    // Создаем заголовок таблицы
    const headerRow = document.createElement('tr');
    for (let i = 0; i < 10; i++) {
        const th = document.createElement('th');
        th.textContent = i + 1;
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);
    
    // Заполняем таблицу данными
    for (let i = 0; i < 10; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 10; j++) {
            const cell = document.createElement('td');
            const value = array[i * 10 + j];
            cell.textContent = Number(value).toFixed(precision);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
}

// Сохранение массива в файл
function saveArrayToFile(array, filename) {
    const data = array.join('\n');
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Чтение массива из файла (имитация)
async function readArrayFromFile(filename) {
    try {
        const response = await fetch(`resources/${filename}`);
        if (!response.ok) throw new Error('Файл не найден');
        const text = await response.text();
        return text.split('\n').map(Number);
    } catch (error) {
        console.error('Ошибка чтения файла:', error);
        return null;
    }
}

// Основная логика для index.html
if (document.getElementById('originalArray')) {
    let originalArray = generateRandomFloatArray();
    let currentPrecision = 2;
    
    // Инициализация таблицы
    displayArray(originalArray, 'originalArray', currentPrecision);
    
    // Обработчик изменения точности
    document.getElementById('precision').addEventListener('change', function() {
        currentPrecision = parseInt(this.value);
        displayArray(originalArray, 'originalArray', currentPrecision);
    });
    
    // Сохранение исходного массива в файл
    document.getElementById('saveBtn').addEventListener('click', function() {
        saveArrayToFile(originalArray, 'original_array.txt');
        alert('Исходный массив сохранен в файл original_array.txt');
    });
    
    // Сортировка по возрастанию
    document.getElementById('sortAscBtn').addEventListener('click', async function() {
        const sortedArray = [...originalArray].sort((a, b) => a - b);
        saveArrayToFile(sortedArray, 'sorted_array_asc.txt');
        
        // Сохраняем данные для передачи на другую страницу
        sessionStorage.setItem('sortType', 'asc');
        sessionStorage.setItem('precision', currentPrecision);
        window.location.href = 'result.html';
    });
    
    // Сортировка по убыванию
    document.getElementById('sortDescBtn').addEventListener('click', async function() {
        const sortedArray = [...originalArray].sort((a, b) => b - a);
        saveArrayToFile(sortedArray, 'sorted_array_desc.txt');
        
        // Сохраняем данные для передачи на другую страницу
        sessionStorage.setItem('sortType', 'desc');
        sessionStorage.setItem('precision', currentPrecision);
        window.location.href = 'result.html';
    });
}

// Логика для result.html
if (document.getElementById('sortedArray')) {
    const sortType = sessionStorage.getItem('sortType') || 'asc';
    let currentPrecision = parseInt(sessionStorage.getItem('precision')) || 2;
    
    // Установка заголовка
    document.getElementById('sortTitle').textContent = 
        sortType === 'asc' ? 'Массив (по возрастанию)' : 'Массив (по убыванию)';
    
    // Установка выбранной точности
    document.getElementById('precision').value = currentPrecision;
    
    // Загрузка и отображение данных
    async function loadAndDisplayArray() {
        const filename = sortType === 'asc' ? 'sorted_array_asc.txt' : 'sorted_array_desc.txt';
        const sortedArray = await readArrayFromFile(filename);
        
        if (sortedArray) {
            displayArray(sortedArray, 'sortedArray', currentPrecision);
        } else {
            document.getElementById('sortedArray').innerHTML = 
                '<tr><td colspan="10">Не удалось загрузить данные</td></tr>';
        }
    }
    
    // Инициализация
    loadAndDisplayArray();
    
    // Обработчик изменения точности
    document.getElementById('precision').addEventListener('change', function() {
        currentPrecision = parseInt(this.value);
        loadAndDisplayArray();
    });
    
    // Кнопка "Вернуться"
    document.getElementById('backBtn').addEventListener('click', function() {
        window.location.href = 'index.html';
    });
}