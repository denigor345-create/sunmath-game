// Добавьте эти классы в начало файла, перед остальным кодом

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        console.log('MainScene: preload');
    }

    create() {
        console.log('MainScene: create');
        
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
            fontWeight: 'bold'
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
        const totalLevels = levelManager.getTotalLevels();
        const buttonSize = 70;
        const spacing = 15;
        const startX = this.cameras.main.centerX - ((totalLevels * (buttonSize + spacing)) / 2) + (buttonSize / 2);
        const startY = this.cameras.main.centerY - 50;

        for (let i = 1; i <= totalLevels; i++) {
            const x = startX + (i - 1) * (buttonSize + spacing);
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
    }

    getLevelColor(level) {
        const colors = [0x3498db, 0x2ecc71, 0xe74c3c, 0xf39c12];
        return colors[(level - 1) % colors.length];
    }

    getLevelStatus(level) {
        if (!levelManager.canPlayLevel(level)) return '';
        if (levelManager.isLevelCompleted(level)) return 'Пройден';
        
        const levelData = levels[level];
        return `${levelData.questionsCount} вопр.`;
    }

    createResetButton() {
        const resetButton = this.add.text(this.cameras.main.centerX, this.cameras.main.height - 60, '🔄 Сбросить прогресс', {
            fontSize: '16px',
            fill: '#e74c3c',
            backgroundColor: '#ffffff',
            padding: { x: 15, y: 8 }
        }).setOrigin(0.5).setInteractive();

        resetButton.on('pointerdown', () => {
            levelManager.resetProgress();
            this.scene.restart();
        });
    }
}

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init() {
        console.log('GameScene: init');
        this.gameActive = true;
    }

    create() {
        console.log('GameScene: create');
        
        // Включаем кнопку "Назад" в Telegram
        if (window.TelegramBridge) {
            window.TelegramBridge.setBackButton(true);
        }

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

        const star = this.physics.add.sprite(100, this.cameras.main.height - 100, null);
        star.setInteractive({ draggable: true });
        
        // Рисуем звезду
        const starGraphics = this.add.graphics();
        starGraphics.fillStyle(0xffffff, 1);
        this.drawStar(starGraphics, 0, 0, 5, 20, 10);
        starGraphics.generateTexture('star', 40, 40);
        starGraphics.destroy();
        
        star.setTexture('star');
        
        // Добавляем текст вопроса
        const questionText = this.add.text(0, 0, '?', {
            fontSize: '16px',
            fill: '#000000',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        star.add(questionText);
        
        star.questionData = this.questionManager.getRandomQuestion();
        this.stars.add(star);
    }

    drawStar(graphics, cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let step = Math.PI / spikes;

        graphics.beginPath();
        graphics.moveTo(cx, cy - outerRadius);

        for (let i = 0; i < spikes; i++) {
            let x = cx + Math.cos(rot) * outerRadius;
            let y = cy + Math.sin(rot) * outerRadius;
            graphics.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            graphics.lineTo(x, y);
            rot += step;
        }

        graphics.lineTo(cx, cy - outerRadius);
        graphics.closePath();
        graphics.fillPath();
    }

    setupTimer() {
        this.timer = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }

    setupDragAndDrop() {
        this.input.on('dragstart', (pointer, gameObject) => {
            if (!this.gameActive) return;
            this.currentStar = gameObject;
            this.children.bringToTop(gameObject);
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            if (!this.gameActive) return;
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragend', (pointer, gameObject) => {
            if (!this.gameActive) return;
            this.checkStarSunCollision(gameObject);
        });
    }

    checkStarSunCollision(star) {
        const distance = Phaser.Math.Distance.Between(star.x, star.y, this.sun.x, this.sun.y);
        
        if (distance < 100) {
            this.showQuestionPopup(star);
        } else {
            this.returnStarToStart(star);
        }
    }

    returnStarToStart(star) {
        this.tweens.add({
            targets: star,
            x: 100,
            y: this.cameras.main.height - 100,
            duration: 500
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
            star.destroy();
        } else {
            this.returnStarToStart(star);
        }
        
        document.body.removeChild(popup);
        this.updateUI();
        this.gameActive = true;
        
        if (isCorrect) {
            if (this.score.total < this.currentLevelData.questionsCount) {
                this.createNewStar();
            } else {
                this.endLevel();
            }
        }
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
        
        this.showLevelResults(successRate, levelPassed);
    }

    showLevelResults(successRate, levelPassed) {
        const resultsDiv = document.createElement('div');
        resultsDiv.className = 'question-popup';
        
        let message = levelPassed ? 
            `<h3>🎉 Уровень пройден!</h3><p>Результат: ${successRate.toFixed(1)}%</p>` :
            `<h3>😔 Уровень не пройден</h3><p>Результат: ${successRate.toFixed(1)}%</p>`;
        
        resultsDiv.innerHTML = message + `
            <div class="buttons-container">
                <button id="retryLevel" class="menu-btn">Повторить</button>
                <button id="levelSelect" class="menu-btn">Выбор уровня</button>
            </div>
        `;
        
        document.body.appendChild(resultsDiv);
        
        document.getElementById('retryLevel').addEventListener('click', () => {
            document.body.removeChild(resultsDiv);
            this.scene.restart();
        });
        
        document.getElementById('levelSelect').addEventListener('click', () => {
            document.body.removeChild(resultsDiv);
            this.scene.start('MainScene');
        });
    }
}
