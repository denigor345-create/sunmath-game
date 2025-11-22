// Основная игровая логика
let game;
let levelManager;
let currentScene = null;

const GameConfig = {
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
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

// Инициализация игры когда DOM готов
window.addEventListener('DOMContentLoaded', function() {
    game = new Phaser.Game(GameConfig);
    levelManager = new LevelManager();
});

// Сохраняем ссылку на текущую сцену для Telegram BackButton
Phaser.Scene.prototype.create = function() {
    window.currentScene = this;
};
