document.addEventListener('DOMContentLoaded', function() {
    // Минимально допустимая средняя оценка
    const MIN_AVERAGE_GRADE = 3.5;
    
    // Хранилище оценок по предметам
    const gradesMap = {
        math: [],
        physics: [],
        history: [],
        literature: []
    };
    
    // Элементы интерфейса
    const subjectSelect = document.getElementById('subject');
    const gradeSelect = document.getElementById('grade');
    const addGradeBtn = document.getElementById('addGrade');
    const subjectsList = document.getElementById('subjectsList');
    
    // Названия предметов для отображения
    const subjectNames = {
        math: 'Математика',
        physics: 'Физика',
        history: 'История',
        literature: 'Литература'
    };
    
    // Обработчик добавления оценки
    addGradeBtn.addEventListener('click', function() {
        const selectedSubject = subjectSelect.value;
        const selectedGrade = parseInt(gradeSelect.value);
        
        // Добавляем оценку в массив
        gradesMap[selectedSubject].push(selectedGrade);
        
        // Обновляем табло
        updateDashboard();
    });
    
    // Функция обновления табло
    function updateDashboard() {
        subjectsList.innerHTML = '';
        
        for (const subject in gradesMap) {
            const grades = gradesMap[subject];
            
            if (grades.length === 0) continue;
            
            const average = calculateAverage(grades);
            const isLow = average < MIN_AVERAGE_GRADE;
            
            const subjectElement = document.createElement('div');
            subjectElement.className = 'subject-info';
            
            subjectElement.innerHTML = `
                <strong>${subjectNames[subject]}</strong>
                <div>Оценки: ${grades.join(', ')}</div>
                <div>Средний балл: <span class="${isLow ? 'warning' : 'success'}">${average.toFixed(2)}</span></div>
                ${isLow ? '<div class="warning">Внимание: средний балл ниже допустимого!</div>' : ''}
            `;
            
            subjectsList.appendChild(subjectElement);
        }
    }
    
    // Функция расчета среднего значения
    function calculateAverage(grades) {
        const sum = grades.reduce((total, grade) => total + grade, 0);
        return sum / grades.length;
    }
    
    // Инициализация табло
    updateDashboard();
});