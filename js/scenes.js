console.log('Scenes.js loading...');

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        console.log('MainScene constructor');
    }

    preload() {
        console.log('MainScene: preload started');
    }

    create() {
        console.log('MainScene: create started');
        console.log('Camera size:', this.cameras.main.width, 'x', this.cameras.main.height);
        
        // Включаем кнопку "Назад" в Telegram
        if (window.TelegramBridge) {
            window.TelegramBridge.setBackButton(false);
        }
        
        // Очищаем сцену
        this.children.removeAll();
        
        // Фон
        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x1a1a2e)
            .setOrigin(0);
        
        // Заголовок
        this.add.text(this.cameras.main.centerX, 80, '🌞 Солнце Знаний', {
            fontSize: '42px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontWeight: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        this.add.text(this.cameras.main.centerX, 130, 'Перетащи звезду с ответом к солнцу!', {
            fontSize: '18px',
            fill: '#cccccc',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Создаем кнопки уровней
        this.createLevelButtons();
        
        // Кнопка сброса прогресса
        this.createResetButton();
        
        console.log('MainScene: fully loaded');
    }

    createLevelButtons() {
        console.log('Creating level buttons...');
        
        const totalLevels = levelManager.getTotalLevels();
        console.log('Total levels:', totalLevels);
        
        const buttonSize = 80;
        const startY = this.cameras.main.centerY;
        
        for (let i = 1; i <= totalLevels; i++) {
            const x = this.cameras.main.centerX + (i - 2.5) * 100;
            const y = startY;

            // Фон кнопки уровня
            const button = this.add.rectangle(x, y, buttonSize, buttonSize, this.getLevelColor(i));
            button.setStrokeStyle(3, 0xffffff);
            button.setInteractive();

            // Номер уровня
            const levelText = this.add.text(x, y - 5, i, {
                fontSize: '24px',
                fill: '#ffffff',
                fontWeight: 'bold'
            }).setOrigin(0.5);

            // Статус уровня
            const statusText = this.add.text(x, y + 15, this.getLevelStatus(i), {
                fontSize: '12px',
                fill: '#ffffff'
            }).setOrigin(0.5);

            // Иконка замка для недоступных уровней
            if (!levelManager.canPlayLevel(i)) {
                button.fillColor = 0x7f8c8d;
                this.add.text(x, y, '🔒', { fontSize: '20px' }).setOrigin(0.5);
                statusText.setText('Заблокирован');
            } else if (levelManager.isLevelCompleted(i)) {
                this.add.text(x, y - 20, '✅', { fontSize: '16px' }).setOrigin(0.5);
            }

            // Обработчик клика
            if (levelManager.canPlayLevel(i)) {
                button.on('pointerdown', () => {
                    console.log('Level selected:', i);
                    levelManager.currentLevel = i;
                    this.scene.start('GameScene');
                });

                // Эффект при наведении
                button.on('pointerover', () => {
                    button.setScale(1.1);
                });

                button.on('pointerout', () => {
                    button.setScale(1);
                });
            }
        }

        // Описание уровней
        this.add.text(this.cameras.main.centerX, startY + 60, 
            '🎯 Цель: правильно решить 80% примеров за отведенное время', {
            fontSize: '14px',
            fill: '#cccccc',
            fontFamily: 'Arial',
            align: 'center'
        }).setOrigin(0.5);
    }

    getLevelColor(level) {
        const colors = [0x3498db, 0x2ecc71, 0xe74c3c, 0xf39c12, 0x9b59b6];
        return colors[(level - 1) % colors.length];
    }

    getLevelStatus(level) {
        if (!levelManager.canPlayLevel(level)) return '';
        if (levelManager.isLevelCompleted(level)) return 'Пройден';
        
        const levelData = levels[level];
        return `${levelData.questionsCount} вопр. / ${levelData.time} сек`;
    }

    createResetButton() {
        const resetButton = this.add.text(this.cameras.main.centerX, this.cameras.main.height - 60, '🔄 Сбросить прогресс', {
            fontSize: '16px',
            fill: '#e74c3c',
            backgroundColor: '#ffffff',
            padding: { x: 15, y: 8 },
            borderRadius: 10
        }).setOrigin(0.5).setInteractive();

        resetButton.on('pointerdown', () => {
            levelManager.resetProgress();
            this.scene.restart();
        });

        resetButton.on('pointerover', () => {
            resetButton.setScale(1.05);
        });

        resetButton.on('pointerout', () => {
            resetButton.setScale(1);
        });
    }
}

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init() {
        console.log('GameScene: init');
        // Включаем кнопку "Назад" в Telegram
        if (window.TelegramBridge) {
            window.TelegramBridge.setBackButton(true);
        }
    }

    create() {
        console.log('GameScene: create');
        
        this.gameActive = true;
        this.currentLevelData = levelManager.getCurrentLevel();
        console.log('Current level data:', this.currentLevelData);
        
        // Инициализируем счет
        this.score = { correct: 0, total: 0 };
        this.timeLeft = this.currentLevelData.time;
        this.stars = this.physics.add.group();
        
        // Создаем сцену
        this.createBackground();
        this.createSun();
        this.createUI();
        this.createQuestionManager();
        this.createNewStar();
        this.setupTimer();
        this.setupDragAndDrop();
        
        console.log('GameScene: fully loaded');
    }

    createBackground() {
        // Градиентный фон
        const graphics = this.add.graphics();
        const height = this.cameras.main.height;
        graphics.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x16213e, 0x16213e, 1);
        graphics.fillRect(0, 0, this.cameras.main.width, height);
        
        // Звезды на фоне
        for (let i = 0; i < 50; i++) {
            const x = Phaser.Math.Between(0, this.cameras.main.width);
            const y = Phaser.Math.Between(0, this.cameras.main.height);
            const size = Phaser.Math.FloatBetween(0.5, 2);
            this.add.circle(x, y, size, 0xffffff, 0.3);
        }
    }

    createSun() {
        // Солнце в верхней части
        this.sun = this.physics.add.sprite(this.cameras.main.centerX, 150, null);
        this.sun.setImmovable(true);
        
        // Рисуем солнце
        const sunGraphics = this.add.graphics();
        sunGraphics.fillStyle(0xffeb3b, 1);
        sunGraphics.fillCircle(0, 0, 40);
        sunGraphics.lineStyle(4, 0xff9800, 1);
        sunGraphics.strokeCircle(0, 0, 45);
        sunGraphics.generateTexture('sun', 90, 90);
        sunGraphics.destroy();
        
        this.sun.setTexture('sun');
        
        // Свечение вокруг солнца
        const glow = this.add.circle(this.sun.x, this.sun.y, 60, 0xff9800, 0.3);
        this.tweens.add({
            targets: glow,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
        
        // Отображаем название уровня
        this.add.text(this.cameras.main.centerX, 30, this.currentLevelData.name, {
            fontSize: '18px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5);
    }

    createUI() {
        this.updateUI();
    }

    createQuestionManager() {
        this.questionManager = new QuestionManager(this.currentLevelData.questions);
    }

    createNewStar() {
    if (this.score.total >= this.currentLevelData.questionsCount || !this.gameActive) {
        return;
    }

    console.log('Creating new star...');
    
    const star = this.physics.add.sprite(100, this.cameras.main.height - 100, null);
    star.setInteractive({ draggable: true });
    
    // Рисуем звезду
    const starGraphics = this.add.graphics();
    starGraphics.fillStyle(0xffffff, 1);
    this.drawStar(starGraphics, 0, 0, 5, 20, 10);
    starGraphics.generateTexture('star', 40, 40);
    starGraphics.destroy();
    
    star.setTexture('star');
    star.setScale(0.8);
    
    // Создаем отдельный текст для вопроса и сохраняем ссылку на него
    star.questionText = this.add.text(star.x, star.y, '?', {
        fontSize: '14px',
        fill: '#000000',
        fontWeight: 'bold'
    }).setOrigin(0.5);
    
    // Сохраняем данные вопроса в звезде
    star.questionData = this.questionManager.getRandomQuestion();
    
    // Добавляем звезду в группу
    this.stars.add(star);
    
    // Плавное появление
    star.setAlpha(0);
    star.questionText.setAlpha(0);
    this.tweens.add({
        targets: [star, star.questionText],
        alpha: 1,
        duration: 500
    });
    
    console.log('New star created with question:', star.questionData.question);
}
    checkStarSunCollision(star) {
        const distance = Phaser.Math.Distance.Between(
            star.x, star.y, 
            this.sun.x, this.sun.y
        );
        
        if (distance < 100) {
            this.showQuestionPopup(star);
        } else {
            this.returnStarToStart(star);
        }
    }

    returnStarToStart(star) {
        this.tweens.add({
            targets: [star, star.questionText],
            x: 100,
            y: this.cameras.main.height - 100,
            duration: 600,
            ease: 'Back.easeOut'
        });
    }

    showQuestionPopup(star) {
        this.gameActive = false;
        
        const question = star.questionData;
        const popup = document.createElement('div');
        popup.className = 'question-popup';
        
        popup.innerHTML = `
            <h3>${question.question}</h3>
            <div class="answers-container">
                ${question.answers.map((answer, index) => 
                    `<button class="answer-btn" data-index="${index}">${answer}</button>`
                ).join('')}
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // Обработчики ответов
        popup.querySelectorAll('.answer-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const selectedAnswer = parseInt(e.target.dataset.index);
                this.handleAnswer(selectedAnswer, question.correct, star, popup);
            });
        });
    }

    handleAnswer(selected, correct, star, popup) {
        this.score.total++;
        const isCorrect = selected === correct;
        
        if (isCorrect) {
            this.score.correct++;
            // Анимация правильного ответа
            this.correctAnswerAnimation(star);
        } else {
            // Анимация неправильного ответа
            this.incorrectAnswerAnimation(star);
        }
        
        document.body.removeChild(popup);
        this.updateUI();
        
        if (this.score.total >= this.currentLevelData.questionsCount) {
            this.endLevel();
        } else {
            this.gameActive = true;
            if (isCorrect) {
                this.createNewStar();
            } else {
                this.returnStarToStart(star);
            }
        }
    }

    correctAnswerAnimation(star) {
        // Анимация поглощения звезды солнцем
        this.tweens.add({
            targets: [star, star.questionText],
            x: this.sun.x,
            y: this.sun.y,
            scale: 0,
            alpha: 0,
            duration: 800,
            ease: 'Power2',
            onComplete: () => {
                star.destroy();
                if (star.questionText) {
                    star.questionText.destroy();
                }
                // Эффект вспышки солнца
                this.sun.setTint(0x00ff00);
                this.time.delayedCall(200, () => {
                    this.sun.clearTint();
                });
            }
        });
    }

    incorrectAnswerAnimation(star) {
        // Анимация отбрасывания звезды
        star.setTint(0xff0000);
        this.tweens.add({
            targets: [star, star.questionText],
            x: 100,
            y: this.cameras.main.height - 100,
            duration: 800,
            ease: 'Bounce.easeOut',
            onComplete: () => {
                star.clearTint();
            }
        });
    }

    updateTimer() {
        if (!this.gameActive) return;
        
        this.timeLeft--;
        this.updateUI();
        
        if (this.timeLeft <= 0) {
            this.endLevel();
        }
    }

    updateUI() {
        document.getElementById('timer').textContent = `Время: ${this.timeLeft}`;
        document.getElementById('score').textContent = 
            `Верно: ${this.score.correct}/${this.currentLevelData.questionsCount}`;
        document.getElementById('progress').textContent = 
            `Прогресс: ${Math.round((this.score.correct / this.currentLevelData.questionsCount) * 100)}%`;
        document.getElementById('level').textContent = 
            `Уровень: ${levelManager.currentLevel}`;
    }

    endLevel() {
        this.gameActive = false;
        if (this.timer) this.timer.remove();
        
        const successRate = (this.score.correct / this.currentLevelData.questionsCount) * 100;
        const levelPassed = levelManager.completeLevel(levelManager.currentLevel, successRate);
        
        // Отправляем результаты в Telegram
        if (window.TelegramBridge && window.TelegramBridge.sendData) {
            window.TelegramBridge.sendData({
                action: 'level_completed',
                level: levelManager.currentLevel,
                score: successRate,
                passed: levelPassed,
                correct: this.score.correct,
                total: this.currentLevelData.questionsCount
            });
        }
        
        this.showLevelResults(successRate, levelPassed);
    }

    showLevelResults(successRate, levelPassed) {
        const resultsDiv = document.createElement('div');
        resultsDiv.className = `question-popup ${levelPassed ? 'level-completed' : 'level-failed'}`;
        
        let message = '';
        if (levelPassed) {
            message = `
                <h3>🎉 Уровень ${levelManager.currentLevel} пройден!</h3>
                <p>Правильных ответов: ${this.score.correct}/${this.currentLevelData.questionsCount}</p>
                <p>Результат: <strong>${successRate.toFixed(1)}%</strong></p>
                <p style="font-size: 14px; margin-top: 10px;">Требовалось: ${this.currentLevelData.requiredScore}%</p>
            `;
        } else {
            message = `
                <h3>😔 Уровень ${levelManager.currentLevel} не пройден</h3>
                <p>Правильных ответов: ${this.score.correct}/${this.currentLevelData.questionsCount}</p>
                <p>Результат: <strong>${successRate.toFixed(1)}%</strong></p>
                <p style="font-size: 14px; margin-top: 10px;">Требуется: ${this.currentLevelData.requiredScore}%</p>
            `;
        }
        
        const hasNextLevel = levelManager.currentLevel < levelManager.getTotalLevels();
        
        resultsDiv.innerHTML = message + `
            <div class="buttons-container">
                <button id="retryLevel" class="menu-btn">🔄 Повторить</button>
                ${hasNextLevel && levelPassed ? 
                    `<button id="nextLevel" class="menu-btn">🚀 Следующий уровень</button>` : ''}
                <button id="levelSelect" class="menu-btn">📋 Выбор уровня</button>
            </div>
        `;
        
        document.body.appendChild(resultsDiv);
        
        // Обработчики кнопок
        document.getElementById('retryLevel').addEventListener('click', () => {
            document.body.removeChild(resultsDiv);
            this.scene.restart();
        });
        
        const nextLevelBtn = document.getElementById('nextLevel');
        if (nextLevelBtn) {
            nextLevelBtn.addEventListener('click', () => {
                if (levelPassed) {
                    levelManager.unlockNextLevel();
                    document.body.removeChild(resultsDiv);
                    this.scene.restart();
                }
            });
        }
        
        document.getElementById('levelSelect').addEventListener('click', () => {
            document.body.removeChild(resultsDiv);
            this.scene.start('MainScene');
        });
    }

    update() {
        // Дополнительная логика обновления кадра
    }
}

// Убедитесь что классы доступны глобально
window.MainScene = MainScene;
window.GameScene = GameScene;

console.log('Scenes.js loaded successfully');


