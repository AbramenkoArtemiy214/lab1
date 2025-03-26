document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const intervalInput = document.getElementById('interval');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const audioPlayer = document.getElementById('audioPlayer');
    const currentSongDisplay = document.getElementById('currentSong');
    const songCatalog = document.getElementById('songCatalog');
    
    // Каталог песен (Map в виде объекта)
    const songsMap = {
        1: { title: "Песня 1", url: "songs/song1.mp3" },
        2: { title: "Песня 2", url: "songs/song2.mp3" },
        3: { title: "Песня 3", url: "songs/song3.mp3" },
        4: { title: "Песня 4", url: "songs/song4.mp3" },
    };
    
    let playbackInterval;
    let isPlaying = false;
    
    // Заполняем каталог песен
    function populateSongCatalog() {
        songCatalog.innerHTML = '';
        for (const [key, song] of Object.entries(songsMap)) {
            const li = document.createElement('li');
            li.textContent = `${key}. ${song.title}`;
            songCatalog.appendChild(li);
        }
    }
    
    // Воспроизведение случайной песни
    function playRandomSong() {
        if (!isPlaying) return;
        
        const songKeys = Object.keys(songsMap);
        const randomKey = songKeys[Math.floor(Math.random() * songKeys.length)];
        const song = songsMap[randomKey];
        
        currentSongDisplay.textContent = `${randomKey}. ${song.title}`;
        audioPlayer.src = song.url;
        audioPlayer.play();
        
        // Когда песня закончится, запустим следующую через интервал
        audioPlayer.onended = function() {
            if (isPlaying) {
                playbackInterval = setTimeout(playRandomSong, intervalInput.value * 1000);
            }
        };
    }
    
    // Начало воспроизведения
startBtn.addEventListener('click', function() {
    const interval = parseInt(intervalInput.value);

    if (isNaN(interval)) {
        alert('Пожалуйста, введите корректное число');
        return;
    }

    if (interval < 5 || interval > 60) {
        alert('Интервал должен быть от 5 до 60 секунд');
        return;
    }

    if (!isPlaying) {
        isPlaying = true;
        startBtn.disabled = true;
        stopBtn.disabled = false;
        playRandomSong();
    }
});
    
    // Остановка воспроизведения
    stopBtn.addEventListener('click', function() {
        if (isPlaying) {
            isPlaying = false;
            startBtn.disabled = false;
            stopBtn.disabled = true;
            clearTimeout(playbackInterval);
            audioPlayer.pause();
            currentSongDisplay.textContent = '—';
        }
    });
    
    // Инициализация
    function init() {
        populateSongCatalog();
        stopBtn.disabled = true;
    }
    
    init();
});