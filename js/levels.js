const levels = {
    1: {
        name: "Уровень 1: Сложение и вычитание",
        time: 90,
        questionsCount: 8,
        requiredScore: 80,
        questions: [
            {
                question: "5 + 3 = ?",
                answers: ["7", "8", "9", "6"],
                correct: 1
            },
            {
                question: "12 - 4 = ?",
                answers: ["6", "7", "8", "9"],
                correct: 2
            },
            {
                question: "7 + 6 = ?",
                answers: ["12", "13", "14", "15"],
                correct: 1
            },
            {
                question: "15 - 8 = ?",
                answers: ["6", "7", "8", "9"],
                correct: 1
            },
            {
                question: "9 + 9 = ?",
                answers: ["16", "17", "18", "19"],
                correct: 2
            },
            {
                question: "20 - 11 = ?",
                answers: ["8", "9", "10", "11"],
                correct: 1
            },
            {
                question: "14 + 5 = ?",
                answers: ["18", "19", "20", "21"],
                correct: 1
            },
            {
                question: "17 - 9 = ?",
                answers: ["7", "8", "9", "10"],
                correct: 1
            }
        ]
    },
    2: {
        name: "Уровень 2: Умножение",
        time: 75,
        questionsCount: 10,
        requiredScore: 80,
        questions: [
            {
                question: "3 × 4 = ?",
                answers: ["10", "12", "14", "16"],
                correct: 1
            },
            {
                question: "5 × 6 = ?",
                answers: ["25", "30", "35", "40"],
                correct: 1
            },
            {
                question: "7 × 3 = ?",
                answers: ["20", "21", "22", "23"],
                correct: 1
            },
            {
                question: "8 × 4 = ?",
                answers: ["28", "30", "32", "34"],
                correct: 2
            },
            {
                question: "6 × 7 = ?",
                answers: ["40", "42", "44", "46"],
                correct: 1
            },
            {
                question: "9 × 5 = ?",
                answers: ["40", "45", "50", "55"],
                correct: 1
            },
            {
                question: "4 × 8 = ?",
                answers: ["28", "30", "32", "34"],
                correct: 2
            },
            {
                question: "2 × 9 = ?",
                answers: ["16", "18", "20", "22"],
                correct: 1
            },
            {
                question: "5 × 9 = ?",
                answers: ["40", "45", "50", "55"],
                correct: 1
            },
            {
                question: "7 × 6 = ?",
                answers: ["40", "42", "44", "46"],
                correct: 1
            }
        ]
    },
    3: {
        name: "Уровень 3: Деление",
        time: 60,
        questionsCount: 10,
        requiredScore: 80,
        questions: [
            {
                question: "12 ÷ 3 = ?",
                answers: ["3", "4", "5", "6"],
                correct: 1
            },
            {
                question: "20 ÷ 4 = ?",
                answers: ["4", "5", "6", "7"],
                correct: 1
            },
            {
                question: "18 ÷ 6 = ?",
                answers: ["2", "3", "4", "5"],
                correct: 1
            },
            {
                question: "24 ÷ 8 = ?",
                answers: ["2", "3", "4", "5"],
                correct: 1
            },
            {
                question: "35 ÷ 7 = ?",
                answers: ["4", "5", "6", "7"],
                correct: 1
            },
            {
                question: "42 ÷ 6 = ?",
                answers: ["6", "7", "8", "9"],
                correct: 1
            },
            {
                question: "27 ÷ 9 = ?",
                answers: ["2", "3", "4", "5"],
                correct: 1
            },
            {
                question: "32 ÷ 4 = ?",
                answers: ["6", "7", "8", "9"],
                correct: 2
            },
            {
                question: "45 ÷ 5 = ?",
                answers: ["8", "9", "10", "11"],
                correct: 1
            },
            {
                question: "56 ÷ 7 = ?",
                answers: ["7", "8", "9", "10"],
                correct: 1
            }
        ]
    },
    4: {
        name: "Уровень 4: Смешанные операции",
        time: 50,
        questionsCount: 12,
        requiredScore: 80,
        questions: [
            {
                question: "15 + 8 - 3 = ?",
                answers: ["18", "19", "20", "21"],
                correct: 2
            },
            {
                question: "7 × 3 + 4 = ?",
                answers: ["23", "24", "25", "26"],
                correct: 2
            },
            {
                question: "24 ÷ 6 × 2 = ?",
                answers: ["6", "7", "8", "9"],
                correct: 2
            },
            {
                question: "18 - 9 + 5 = ?",
                answers: ["12", "13", "14", "15"],
                correct: 2
            },
            {
                question: "5 × 4 - 6 = ?",
                answers: ["12", "13", "14", "15"],
                correct: 2
            },
            {
                question: "36 ÷ 9 + 7 = ?",
                answers: ["10", "11", "12", "13"],
                correct: 1
            },
            {
                question: "14 + 3 × 2 = ?",
                answers: ["19", "20", "21", "22"],
                correct: 1
            },
            {
                question: "25 - 12 ÷ 3 = ?",
                answers: ["19", "20", "21", "22"],
                correct: 2
            },
            {
                question: "8 × 3 - 10 = ?",
                answers: ["12", "13", "14", "15"],
                correct: 2
            },
            {
                question: "45 ÷ 5 + 8 = ?",
                answers: ["15", "16", "17", "18"],
                correct: 2
            },
            {
                question: "27 - 9 × 2 = ?",
                answers: ["7", "8", "9", "10"],
                correct: 2
            },
            {
                question: "16 ÷ 4 + 12 = ?",
                answers: ["14", "15", "16", "17"],
                correct: 2
            }
        ]
    }
};

class QuestionManager {
    constructor(levelQuestions) {
        this.questions = levelQuestions;
        this.usedIndices = new Set();
    }

    getRandomQuestion() {
        const availableIndices = this.questions.map((_, index) => index)
            .filter(index => !this.usedIndices.has(index));
        
        if (availableIndices.length === 0) {
            // Если все вопросы использованы, начинаем заново
            this.usedIndices.clear();
            return this.getRandomQuestion();
        }

        const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        this.usedIndices.add(randomIndex);
        
        return this.questions[randomIndex];
    }

    reset() {
        this.usedIndices.clear();
    }
}

class LevelManager {
    constructor() {
        this.currentLevel = 1;
        this.completedLevels = new Set();
        this.loadProgress();
    }

    getCurrentLevel() {
        return levels[this.currentLevel];
    }

    isLevelCompleted(levelNumber) {
        return this.completedLevels.has(levelNumber);
    }

    completeLevel(levelNumber, score) {
        const level = levels[levelNumber];
        if (score >= level.requiredScore) {
            this.completedLevels.add(levelNumber);
            this.saveProgress();
            return true;
        }
        return false;
    }

    canPlayLevel(levelNumber) {
        if (levelNumber === 1) return true;
        return this.isLevelCompleted(levelNumber - 1);
    }

    unlockNextLevel() {
        const nextLevel = this.currentLevel + 1;
        if (levels[nextLevel]) {
            this.currentLevel = nextLevel;
            this.saveProgress();
            return true;
        }
        return false;
    }

    saveProgress() {
        const progress = {
            currentLevel: this.currentLevel,
            completedLevels: Array.from(this.completedLevels)
        };
        localStorage.setItem('sunMathProgress', JSON.stringify(progress));
    }

    loadProgress() {
        const saved = localStorage.getItem('sunMathProgress');
        if (saved) {
            try {
                const progress = JSON.parse(saved);
                this.currentLevel = progress.currentLevel || 1;
                this.completedLevels = new Set(progress.completedLevels || []);
            } catch (e) {
                console.error('Error loading progress:', e);
                this.resetProgress();
            }
        }
    }

    resetProgress() {
        this.currentLevel = 1;
        this.completedLevels.clear();
        localStorage.removeItem('sunMathProgress');
    }

    getTotalLevels() {
        return Object.keys(levels).length;
    }

    setLevel(levelNumber) {
        if (this.canPlayLevel(levelNumber)) {
            this.currentLevel = levelNumber;
            return true;
        }
        return false;
    }
}