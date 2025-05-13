document.addEventListener('DOMContentLoaded', function() {
    // Исходный текст с несколькими абзацами
    const fullText = `
        Осень - прекрасное время года, когда листья деревьев окрашиваются в золотые и багряные тона. Это пора урожая, подготовки к зиме и уютных вечеров. Осенью природа постепенно готовится к зимнему сну, дни становятся короче, а ночи длиннее.
        
        Зима - самое холодное время года, когда природа засыпает под снежным покровом. Это время новогодних праздников, зимних видов спорта и теплых семейных вечеров. Морозные узоры на окнах и искрящийся снег создают волшебную атмосферу.
        
        Весна - время пробуждения природы, когда все вокруг оживает после зимней спячки. Появляются первые цветы, прилетают птицы, дни становятся длиннее и теплее. Весной особенно ощущается обновление и начало нового цикла жизни.
        
        Лето - самое теплое время года, когда природа находится в полном расцвете. Это время каникул, отпусков, походов и купания в водоемах. Долгие солнечные дни и короткие теплые ночи делают лето любимым временем года для многих людей.
    `;

    // Создаем компонент и добавляем его на страницу
    const textComponent = createTextComponent(fullText);
    document.getElementById('text-component').appendChild(textComponent);
});

// Функция для создания компонента текста
function createTextComponent(text) {
    const container = document.createElement('div');
    container.className = 'text-component';
    
    // Разделяем текст на абзацы
    const paragraphs = text.split('\n').filter(p => p.trim() !== '');
    
    // Создаем состояние компонента (свернуто/развернуто)
    let isExpanded = false;
    
    // Функция для отображения текста в зависимости от состояния
    function renderText() {
        container.innerHTML = '';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'text-content';
        
        paragraphs.forEach(paragraph => {
            const p = document.createElement('p');
            p.className = 'paragraph';
            
            if (isExpanded) {
                // Если текст развернут - показываем весь абзац
                p.textContent = paragraph.trim();
            } else {
                // Если текст свернут - показываем только первое предложение
                const firstSentence = getFirstSentence(paragraph.trim());
                p.textContent = firstSentence;
            }
            
            contentDiv.appendChild(p);
        });
        
        container.appendChild(contentDiv);
        
        // Создаем кнопку переключения
        const toggleButton = document.createElement('button');
        toggleButton.className = 'toggle-button';
        toggleButton.textContent = isExpanded ? 'Свернуть' : 'Показать подробнее';
        toggleButton.onclick = function() {
            isExpanded = !isExpanded;
            renderText();
        };
        
        container.appendChild(toggleButton);
    }
    
    // Первоначальная отрисовка
    renderText();
    
    return container;
}

// Функция для извлечения первого предложения из текста
function getFirstSentence(text) {
    // Находим первую точку, восклицательный или вопросительный знак
    const sentenceEnd = text.match(/[.!?]/);
    
    if (sentenceEnd) {
        return text.substring(0, sentenceEnd.index + 1);
    }
    
    // Если не найдено знаков препинания - возвращаем весь текст
    return text;
}