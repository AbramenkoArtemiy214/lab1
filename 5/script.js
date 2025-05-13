// База данных файловой системы
let fileSystemDB = [
    // Пример начальных данных
    {
        id: 1,
        parentId: null,
        name: "Документы",
        size: 10.5,
        createdAt: new Date("2023-01-15").getTime(),
        isDirectory: true
    },
    {
        id: 2,
        parentId: 1,
        name: "Работа",
        size: 5.2,
        createdAt: new Date("2023-02-20").getTime(),
        isDirectory: true
    },
    {
        id: 3,
        parentId: 1,
        name: "Личное",
        size: 3.8,
        createdAt: new Date("2023-03-10").getTime(),
        isDirectory: true
    },
    {
        id: 4,
        parentId: 2,
        name: "report.docx",
        size: 1.2,
        createdAt: new Date("2023-04-05").getTime(),
        isDirectory: false
    },
    {
        id: 5,
        parentId: 3,
        name: "photo.jpg",
        size: 2.5,
        createdAt: new Date("2023-05-12").getTime(),
        isDirectory: false
    },
    {
        id: 6,
        parentId: null,
        name: "Музыка",
        size: 15.7,
        createdAt: new Date("2023-01-20").getTime(),
        isDirectory: true
    }
];

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    updateDirectorySelect();
    renderFileSystem();
});

// Обновление выпадающего списка каталогов
function updateDirectorySelect() {
    const select = document.getElementById('parentDir');
    select.innerHTML = '<option value="null">Корневой каталог</option>';
    
    fileSystemDB.filter(item => item.isDirectory).forEach(dir => {
        const option = document.createElement('option');
        option.value = dir.id;
        option.textContent = getDirectoryPath(dir.id);
        select.appendChild(option);
    });
}

// Получение пути к каталогу
function getDirectoryPath(dirId) {
    let path = [];
    let currentId = dirId;
    
    while (currentId) {
        const dir = fileSystemDB.find(item => item.id === currentId);
        if (dir) {
            path.unshift(dir.name);
            currentId = dir.parentId;
        } else {
            currentId = null;
        }
    }
    
    return path.join(' / ');
}

// Добавление нового каталога
function addDirectory() {
    const parentId = document.getElementById('parentDir').value;
    const name = document.getElementById('dirName').value.trim();
    const size = parseFloat(document.getElementById('dirSize').value);
    
    if (!name) {
        alert('Введите название каталога');
        return;
    }
    
    if (isNaN(size) || size < 0) {
        alert('Введите корректный объем');
        return;
    }
    
    // Проверка на уникальность имени в данном каталоге
    const siblings = fileSystemDB.filter(item => 
        item.parentId === (parentId === 'null' ? null : parseInt(parentId)))
        .map(item => item.name.toLowerCase());
        
    if (siblings.includes(name.toLowerCase())) {
        alert('Каталог с таким именем уже существует в выбранной папке');
        return;
    }
    
    // Создание нового каталога
    const newDir = {
        id: fileSystemDB.length > 0 ? Math.max(...fileSystemDB.map(item => item.id)) + 1 : 1,
        parentId: parentId === 'null' ? null : parseInt(parentId),
        name: name,
        size: size,
        createdAt: new Date().getTime(),
        isDirectory: true
    };
    
    fileSystemDB.push(newDir);
    
    // Очистка полей ввода
    document.getElementById('dirName').value = '';
    document.getElementById('dirSize').value = '';
    
    // Обновление интерфейса
    updateDirectorySelect();
    renderFileSystem();
    
    document.getElementById('result').innerHTML = 
        `<p>Каталог "${name}" успешно добавлен.</p>`;
}

// Поиск файла с минимальным объемом
function findMinimalFile() {
    const files = fileSystemDB.filter(item => !item.isDirectory);
    
    if (files.length === 0) {
        document.getElementById('result').innerHTML = 
            '<p>В файловой системе нет файлов.</p>';
        return;
    }
    
    const minFile = files.reduce((min, file) => file.size < min.size ? file : min);
    
    document.getElementById('result').innerHTML = 
        `<p>Файл с минимальным объемом: <strong>${minFile.name}</strong> (${minFile.size} МБ)</p>`;
}

// Поиск файлов по первой букве названия
function findFilesByLetter() {
    const letter = document.getElementById('searchLetter').value.trim().toLowerCase();
    
    if (!letter || letter.length !== 1) {
        alert('Введите одну букву для поиска');
        return;
    }
    
    const files = fileSystemDB.filter(item => 
        !item.isDirectory && item.name.toLowerCase().startsWith(letter));
    
    if (files.length === 0) {
        document.getElementById('result').innerHTML = 
            `<p>Файлов, начинающихся на букву "${letter.toUpperCase()}", не найдено.</p>`;
        return;
    }
    
    let resultHTML = `<p>Файлы, начинающиеся на букву "${letter.toUpperCase()}":</p><ul>`;
    files.forEach(file => {
        resultHTML += `<li>${file.name} (${file.size} МБ)</li>`;
    });
    resultHTML += '</ul>';
    
    document.getElementById('result').innerHTML = resultHTML;
}

// Отображение структуры файловой системы
function renderFileSystem() {
    const rootElement = document.getElementById('fileSystem');
    rootElement.innerHTML = '';
    
    // Находим корневые элементы (parentId === null)
    const rootItems = fileSystemDB.filter(item => item.parentId === null);
    
    // Сортируем: сначала каталоги, потом файлы
    rootItems.sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
    });
    
    // Рендерим корневые элементы
    rootItems.forEach(item => {
        renderFileSystemItem(item, rootElement);
    });
}

// Рендер одного элемента файловой системы (рекурсивно)
function renderFileSystemItem(item, parentElement) {
    const li = document.createElement('li');
    
    const itemDiv = document.createElement('div');
    itemDiv.className = 'file-item';
    
    const nameSpan = document.createElement('span');
    nameSpan.textContent = item.name;
    if (item.isDirectory) {
        nameSpan.style.fontWeight = 'bold';
    }
    
    const sizeSpan = document.createElement('span');
    sizeSpan.textContent = `${item.size} МБ`;
    sizeSpan.style.color = '#666';
    
    itemDiv.appendChild(nameSpan);
    itemDiv.appendChild(sizeSpan);
    li.appendChild(itemDiv);
    
    // Если это каталог, ищем его содержимое
    if (item.isDirectory) {
        const children = fileSystemDB.filter(child => child.parentId === item.id);
        
        if (children.length > 0) {
            // Сортируем: сначала каталоги, потом файлы
            children.sort((a, b) => {
                if (a.isDirectory && !b.isDirectory) return -1;
                if (!a.isDirectory && b.isDirectory) return 1;
                return a.name.localeCompare(b.name);
            });
            
            const ul = document.createElement('ul');
            children.forEach(child => {
                renderFileSystemItem(child, ul);
            });
            li.appendChild(ul);
        }
    }
    
    parentElement.appendChild(li);
}