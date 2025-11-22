// Простая инициализация Telegram
let tg = window.Telegram?.WebApp;

if (tg) {
    tg.ready();
    tg.expand();
    console.log('Telegram Web App initialized');
}

// Простой мост для Telegram
window.TelegramBridge = {
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
