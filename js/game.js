// Основная конфигурация игры
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
    backgroundColor: '#1a1a2e',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [MainScene, GameScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

// Глобальные переменные
let game;
let levelManager;

// Запуск игры когда страница загружена
window.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing game...');
    
    // Инициализируем менеджер уровней
    levelManager = new LevelManager();
    console.log('Level manager initialized');
    
    // Создаем игру
    game = new Phaser.Game(config);
    console.log('Phaser game created');
});

// Утилиты для отладки
window.debugGame = function() {
    console.log('Game:', game);
    console.log('Level Manager:', levelManager);
    console.log('Current Scene:', game.scene.getScenes(true));
};
