// Oyun Verileri (Mock Data)
const gamesData = [
    {
        id: 1,
        title: "Tetris Kelime Oyunu",
        student: "Öğrenci 1",
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80", // Retro gaming
        url: "https://your-github-username.github.io/tetris-word-game/", // Buraya Github Pages linki gelecek
        likes: 124,
        isLikedByUser: false,
        comments: [
            { author: "Ahmet Hoca", text: "Hem eğitici hem eğlenceli, eline sağlık!", date: "2 saat önce" }
        ]
    },
    {
        id: 2,
        title: "Sonsuz Sudoku",
        student: "Öğrenci 2",
        image: "https://images.unsplash.com/photo-1596720078044-65673ecfed48?w=600&q=80", // Puzzle
        url: "https://your-github-username.github.io/infinite-sudoku/",
        likes: 89,
        isLikedByUser: true,
        comments: []
    },
    {
        id: 3,
        title: "Matematik Bilardosu",
        student: "Öğrenci 3",
        image: "https://images.unsplash.com/photo-1574780654013-09af529a6e11?w=600&q=80", // Billiards
        url: "https://your-github-username.github.io/math-billiards/",
        likes: 256,
        isLikedByUser: false,
        comments: [
            { author: "Zeynep", text: "9-ball modu çok zor ama harika :D", date: "1 gün önce" },
            { author: "Mehmet", text: "Görsel efektler süper.", date: "5 saat önce" }
        ]
    },
    {
        id: 4,
        title: "Yılan Oyunu (Optimize)",
        student: "Öğrenci 4",
        image: "https://images.unsplash.com/photo-1526566762798-8fac9c07aa98?w=600&q=80", // Snake/Arcade pattern
        url: "https://your-github-username.github.io/snake-game/",
        likes: 45,
        isLikedByUser: false,
        comments: []
    }
];

let currentGameId = null;

// DOM Elements
const gamesGrid = document.getElementById('games-grid');
const playModal = document.getElementById('play-modal');
const gameIframe = document.getElementById('game-iframe');
const playModalTitle = document.getElementById('play-modal-title');
const modalLikeBtn = document.getElementById('modal-like-btn');
const modalLikeCount = document.getElementById('modal-like-count');

const commentsModal = document.getElementById('comments-modal');
const commentsList = document.getElementById('comments-list');
const commentsCount = document.getElementById('comments-count');
const commentInput = document.getElementById('comment-input');
const toast = document.getElementById('toast');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderGames();
});

// Render Games
function renderGames() {
    gamesGrid.innerHTML = '';
    
    gamesData.forEach(game => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `
            <div class="image-wrapper">
                <img src="${game.image}" alt="${game.title}" class="game-image">
                <div class="play-overlay" onclick="openGame(${game.id})">
                    <i class="ph-fill ph-play-circle"></i>
                </div>
            </div>
            <div class="game-info">
                <h4>${game.title}</h4>
                <div class="student-name">
                    <i class="ph-fill ph-student"></i>
                    ${game.student}
                </div>
                <div class="card-footer">
                    <div class="stats">
                        <div class="stat-item ${game.isLikedByUser ? 'liked' : ''}" id="card-like-${game.id}">
                            <i class="${game.isLikedByUser ? 'ph-fill' : 'ph'} ph-heart"></i>
                            <span class="count">${game.likes}</span>
                        </div>
                        <div class="stat-item">
                            <i class="ph ph-chat-circle"></i>
                            <span>${game.comments.length}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        gamesGrid.appendChild(card);
    });
}

// Oynatıcı Modalı
function openGame(id) {
    const game = gamesData.find(g => g.id === id);
    if (!game) return;
    
    currentGameId = id;
    playModalTitle.innerText = game.title;
    gameIframe.src = game.url;
    
    // Modal Beğeni Butonu Durumu
    updateModalLikeButton(game);
    
    playModal.classList.add('active');
}

function closePlayModal() {
    playModal.classList.remove('active');
    gameIframe.src = ""; // Stop the game audio/video running in bg
    currentGameId = null;
}

// Beğeni Sistemi
function toggleLikeFromModal() {
    if (!currentGameId) return;
    
    const game = gamesData.find(g => g.id === currentGameId);
    if (!game) return;
    
    game.isLikedByUser = !game.isLikedByUser;
    game.likes += game.isLikedByUser ? 1 : -1;
    
    updateModalLikeButton(game);
    renderGames(); // Update grid behind it
    
    showToast(game.isLikedByUser ? "Oyun beğenildi! ❤️" : "Beğeni geri alındı.");
}

function updateModalLikeButton(game) {
    if (game.isLikedByUser) {
        modalLikeBtn.classList.add('liked');
        modalLikeBtn.innerHTML = `<i class="ph-fill ph-heart"></i><span id="modal-like-count">${game.likes}</span>`;
    } else {
        modalLikeBtn.classList.remove('liked');
        modalLikeBtn.innerHTML = `<i class="ph ph-heart"></i><span id="modal-like-count">${game.likes}</span>`;
    }
}

// Yorumlar Modalı
function openCommentsFromModal() {
    if (!currentGameId) return;
    renderComments();
    commentsModal.classList.add('active');
}

function closeCommentsModal() {
    commentsModal.classList.remove('active');
}

function renderComments() {
    const game = gamesData.find(g => g.id === currentGameId);
    if (!game) return;
    
    commentsCount.innerText = game.comments.length;
    commentsList.innerHTML = '';
    
    if (game.comments.length === 0) {
        commentsList.innerHTML = `
            <div class="no-comments">
                <i class="ph ph-ghost"></i>
                <p>Henüz yorum yapılmamış. İlk yorumu sen yaz!</p>
            </div>
        `;
        return;
    }
    
    game.comments.forEach(comment => {
        const initial = comment.author.charAt(0).toUpperCase();
        const html = `
            <div class="comment">
                <div class="comment-avatar">${initial}</div>
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="comment-author">${comment.author}</span>
                        <span class="comment-date">${comment.date}</span>
                    </div>
                    <div class="comment-text">${comment.text}</div>
                </div>
            </div>
        `;
        commentsList.insertAdjacentHTML('beforeend', html);
    });
    
    // Scroll to bottom
    commentsList.scrollTop = commentsList.scrollHeight;
}

function submitComment() {
    const text = commentInput.value.trim();
    if (!text || !currentGameId) return;
    
    const game = gamesData.find(g => g.id === currentGameId);
    
    game.comments.push({
        author: "Misafir Çelebi",
        text: text,
        date: "Az önce"
    });
    
    commentInput.value = '';
    renderComments();
    renderGames(); // Update comment count in grid
    
    showToast("Yorumunuz başarıyla eklendi! 📝");
}

// Enter tuşu ile yorum gönderme
commentInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        submitComment();
    }
});

// Toast Mesajı Gösterme
let toastTimeout;
function showToast(message) {
    toast.innerText = message;
    toast.classList.add('show');
    
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
