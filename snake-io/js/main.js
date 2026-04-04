window.onload = () => {
    const game = new Game();
    
    document.getElementById('start-btn').addEventListener('click', () => {
        const name = document.getElementById('player-name').value;
        game.start(name);
    });
    
    document.getElementById('restart-btn').addEventListener('click', () => {
        const name = document.getElementById('player-name').value;
        game.start(name);
    });
};
