// Инициализация Telegram Web App
let tg = window.Telegram?.WebApp;

if (tg) {
    // Расширяем на весь экран
    tg.expand();
    
    // Получаем данные пользователя
    let user = tg.initDataUnsafe?.user;
    console.log("Telegram User:", user);
    
    // Можно использовать тему Telegram
    document.documentElement.style.setProperty('--bg-color', tg.themeParams.bg_color || '#1a1a2e');
} else {
    console.log("Telegram Web App not detected - running in browser mode");
}

// Функции для взаимодействия с Telegram
const TelegramBridge = {
    // Закрыть игру
    closeGame: function() {
        if (tg) {
            tg.close();
        }
    },
    
    // Отправить данные в бота
    sendData: function(data) {
        if (tg && tg.sendData) {
            tg.sendData(JSON.stringify(data));
        } else {
            console.log("Game data:", data);
        }
    },
    
    // Показать всплывающее окно
    showAlert: function(message) {
        if (tg && tg.showAlert) {
            tg.showAlert(message);
        } else {
            alert(message);
        }
    },
    
    // Получить данные пользователя
    getUser: function() {
        if (tg) {
            return tg.initDataUnsafe?.user;
        }
        return null;
    },
    
    // Включить/выключить кнопку назад
    setBackButton: function(visible) {
        if (tg && tg.BackButton) {
            if (visible) {
                tg.BackButton.show();
            } else {
                tg.BackButton.hide();
            }
        }
    }
};

// Обработчик кнопки "Назад" в Telegram
if (tg && tg.BackButton) {
    tg.BackButton.onClick(() => {
        // Возвращаемся к выбору уровней
        if (window.currentScene && window.currentScene.scene) {
            window.currentScene.scene.start('MainScene');
        }
    });
}
