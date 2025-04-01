// Генерация случайного массива 10x10
function generateRandomArray() {
    const array = [];
    for (let i = 0; i < 100; i++) {
        array.push(Math.floor(Math.random() * 91) + 10); // от 10 до 100
    }
    return array;
}

// Отображение массива в таблице
function displayArray(array, tableId) {
    const table = document.getElementById(tableId);
    table.innerHTML = '';
    
    for (let i = 0; i < 10; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 10; j++) {
            const cell = document.createElement('td');
            cell.textContent = array[i * 10 + j];
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
}

// Находим максимальный элемент
function findMaxValue(array) {
    return Math.max(...array);
}

// Основная логика для index.html
if (document.getElementById('originalArray')) {
    const originalArray = generateRandomArray();
    displayArray(originalArray, 'originalArray');
    
    const maxValue = findMaxValue(originalArray);
    document.getElementById('maxValue').textContent += maxValue;
    
    // Сохраняем массив в sessionStorage для использования на другой странице
    sessionStorage.setItem('originalArray', JSON.stringify(originalArray));
    
    // Обработчик кнопки сортировки
    document.getElementById('sortBtn').addEventListener('click', function() {
        const sortedArray = [...originalArray].sort((a, b) => a - b);
        sessionStorage.setItem('sortedArray', JSON.stringify(sortedArray));
        window.location.href = 'result.html';
    });
}

// Логика для result.html
if (document.getElementById('sortedArray')) {
    const sortedArray = JSON.parse(sessionStorage.getItem('sortedArray'));
    displayArray(sortedArray, 'sortedArray');
}