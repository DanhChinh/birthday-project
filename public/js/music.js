// Lấy các phần tử
const toggleBtn = document.getElementById('toggle-music');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const audioPlayer = document.getElementById('music-player');


let playCount = 0;
const maxPlays = 5;

// Khi bài nhạc kết thúc
audioPlayer.addEventListener('ended', () => {
    playCount++;
    if (playCount < maxPlays) {
        audioPlayer.currentTime = 0;
        audioPlayer.play();
    } else {
        console.log('Phát đủ 5 lần!');
    }
});
// Thiết lập mặc định là dừng nhạc
let isPlaying = false;

// Xử lý sự kiện khi người dùng nhấn nút
toggleBtn.addEventListener('click', () => {
    if (isPlaying) {
        audioPlayer.pause(); // Dừng nhạc
        playIcon.style.display = 'inline'; // Hiển thị icon play
        pauseIcon.style.display = 'none'; // Ẩn icon pause
    } else {
        audioPlayer.play(); // Phát nhạc
        playIcon.style.display = 'none'; // Ẩn icon play
        pauseIcon.style.display = 'inline'; // Hiển thị icon pause
    }
    isPlaying = !isPlaying; // Thay đổi trạng thái
});
