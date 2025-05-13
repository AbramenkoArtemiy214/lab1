// Загрузка страницы сезона
function loadSeason(season) {
    const contentDiv = document.getElementById('season-content');
    contentDiv.innerHTML = '<p>Загрузка...</p>';
    
    fetch(`${season}.html`)
        .then(response => response.text())
        .then(html => {
            contentDiv.innerHTML = html;
            
            // Добавляем кнопку для загрузки JSON данных
            const jsonBtn = document.createElement('button');
            jsonBtn.className = `load-btn ${season}-btn`;
            jsonBtn.textContent = `Загрузить данные о ${getSeasonName(season)}`;
            jsonBtn.onclick = () => loadSeasonData(season);
            contentDiv.appendChild(jsonBtn);
        })
        .catch(error => {
            contentDiv.innerHTML = `<p>Ошибка загрузки страницы: ${error}</p>`;
        });
}

// Загрузка JSON данных о сезоне
function loadSeasonData(season) {
    const contentDiv = document.getElementById('season-content');
    const dataDiv = document.createElement('div');
    dataDiv.className = 'season-data';
    dataDiv.innerHTML = '<p>Загрузка данных...</p>';
    contentDiv.appendChild(dataDiv);
    
    fetch(`${season}.json`)
        .then(response => response.json())
        .then(data => {
            let html = `<h3>Характеристики ${getSeasonName(season)}</h3>`;
            html += `<p><strong>Температура:</strong> ${data.temperature}</p>`;
            html += `<p><strong>Продолжительность:</strong> ${data.duration}</p>`;
            html += `<p><strong>Особенности:</strong></p><ul>`;
            
            data.features.forEach(feature => {
                html += `<li>${feature}</li>`;
            });
            
            html += `</ul>`;
            dataDiv.innerHTML = html;
            
            // Добавляем кнопку для загрузки дополнительной информации
            const infoBtn = document.createElement('button');
            infoBtn.className = `load-btn ${season}-btn`;
            infoBtn.textContent = `Дополнительная информация о ${getSeasonName(season)}`;
            infoBtn.onclick = () => loadAdditionalInfo(season);
            contentDiv.appendChild(infoBtn);
        })
        .catch(error => {
            dataDiv.innerHTML = `<p>Ошибка загрузки данных: ${error}</p>`;
        });
}

// Загрузка дополнительной информации из текстового файла
function loadAdditionalInfo(season) {
    const contentDiv = document.getElementById('season-content');
    const infoDiv = document.createElement('div');
    infoDiv.className = 'additional-info';
    infoDiv.innerHTML = '<p>Загрузка информации...</p>';
    contentDiv.appendChild(infoDiv);
    
    fetch(`${season}-info.txt`)
        .then(response => response.text())
        .then(text => {
            infoDiv.innerHTML = `<h3>Дополнительная информация</h3><p>${text}</p>`;
        })
        .catch(error => {
            infoDiv.innerHTML = `<p>Ошибка загрузки информации: ${error}</p>`;
        });
}

// Получение названия сезона на русском
function getSeasonName(season) {
    const names = {
        'autumn': 'осени',
        'winter': 'зиме',
        'spring': 'весне',
        'summer': 'лету'
    };
    return names[season];
}