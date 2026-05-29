let geminiApiKey = ""; 
let myName = localStorage.getItem('localName');
let myUser = localStorage.getItem('localUser');
let themeBtn = document.getElementById('theme-btn');
let currentTheme = localStorage.getItem('appTheme');

let sendSound = new Audio('https://actions.google.com/sounds/v1/cartoon/pop.ogg');
let receiveSound = new Audio('https://actions.google.com/sounds/v1/ui/beep_short.ogg');

if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
    if (themeBtn) themeBtn.innerText = '☀️';
}

if (themeBtn) {
    themeBtn.onclick = function() {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('appTheme', 'dark');
            themeBtn.innerText = '☀️';
        } else {
            localStorage.setItem('appTheme', 'light');
            themeBtn.innerText = '🌙';
        }
    };
}

if (myName === null || myName === "") {
    window.location.href = "index.html";
}

let apiUrl = "http://web4.informatics.ru:82/api/582662d57723dccca6166441adeec0bf";
let chatWindow = document.getElementById('chat-window');

document.getElementById('profile-name-display').innerText = myName;
document.getElementById('profile-username-display').innerText = myUser;

document.getElementById('open-profile-btn').onclick = function() { document.getElementById('profile-panel').classList.add('active'); };
document.getElementById('close-profile-btn').onclick = function() { document.getElementById('profile-panel').classList.remove('active'); };

document.getElementById('logout-btn').onclick = function() {
    localStorage.removeItem('localName');
    localStorage.removeItem('localUser');
    window.location.href = "index.html";
};

let activeChat = "general";
let botHistories = { "gemini": [], "влад": [], "кот": [], "гопник": [], "учитель": [] };
let msgCounter = 0;

let memesDb = [
    "https://media3.giphy.com/media/VbnUQpnihPSIgIXuZv/giphy.gif",
    "https://media2.giphy.com/media/13HgwGsXF0aiGY/giphy.gif",
    "https://media1.giphy.com/media/L1R1tvI9svkIWwpVYr/giphy.gif",
    "https://media4.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif",
    "https://media0.giphy.com/media/3oKIPnAiaCRi8PrD68/giphy.gif",
    "https://media1.giphy.com/media/xTiTnxpQ3ghPiB2Hp6/giphy.gif",
    "https://media2.giphy.com/media/yYSSBtDgbbRzq/giphy.gif",
    "https://media3.giphy.com/media/QMHoU66sBXqqLqYvGO/giphy.gif",
    "https://i.pinimg.com/originals/a6/63/06/a66306e6bf474da605f6b2167a840eaf.gif",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Surprised_Pikachu_HD_Wallpaper.jpg/640px-Surprised_Pikachu_HD_Wallpaper.jpg",
    "https://upload.wikimedia.org/wikipedia/ru/thumb/e/e9/Harold_hiding_the_pain.jpg/640px-Harold_hiding_the_pain.jpg",
    "https://upload.wikimedia.org/wikipedia/ru/3/30/Disaster_Girl.jpg"
];

let memePicker = document.getElementById('meme-picker');
let msgInput = document.getElementById('message-input');
let sendBtn = document.getElementById('send-btn');

memesDb.forEach(function(url) {
    let img = document.createElement('img');
    img.src = url;
    img.className = 'meme-option';
    img.onclick = function() {
        msgInput.value = "IMG:" + url;
        sendBtn.disabled = false;
        memePicker.classList.remove('active');
        sendBtn.click(); 
    };
    memePicker.appendChild(img);
});

function getCurrentTime() {
    let now = new Date();
    let m = now.getMinutes();
    return now.getHours() + ":" + (m < 10 ? "0" + m : m);
}

function renderMessage(text, author, time, isTyping, msgId, isRead) {
    let div = document.createElement('div');
    div.className = 'message';
    if (isTyping) div.id = 'typing-indicator';
    
    let content = text;
    if (text.startsWith("IMG:")) {
        content = '<img src="' + text.substring(4) + '" class="msg-image">';
    }

    if (author === myName) {
        div.classList.add('my-message');
        let tickHtml = isRead ? '<span class="msg-tick read">✓✓</span>' : '<span class="msg-tick" id="tick-' + msgId + '">✓</span>';
        div.innerHTML = content + '<span class="msg-time">' + time + tickHtml + '</span>';
    } else {
        if (isTyping) {
            div.innerHTML = "<b>" + author + ":</b><br><span class='typing'>Печатает...</span>";
        } else {
            div.innerHTML = "<b>" + author + ":</b><br>" + content + '<span class="msg-time">' + time + '</span>';
        }
    }

    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function removeTypingIndicator() {
    let ind = document.getElementById('typing-indicator');
    if (ind) ind.remove();
}

function loadGeneralChat() {
    chatWindow.innerHTML = "Загрузка...";
    fetch(apiUrl)
        .then(function(res) { return res.json(); })
        .then(function(data) {
            chatWindow.innerHTML = "";
            for (let i = 0; i < data.length; i++) {
                renderMessage(data[i].text, data[i].sender, "12:00", false, 0, true);
            }
        });
}

function loadBotChat() {
    chatWindow.innerHTML = "";
    let history = botHistories[activeChat];
    for (let i = 0; i < history.length; i++) {
        renderMessage(history[i].text, history[i].author, history[i].time, false, 0, true);
    }
}

let chatItems = document.querySelectorAll('.chat-item');
for (let i = 0; i < chatItems.length; i++) {
    chatItems[i].onclick = function(event) {
        let item = event.currentTarget;
        for (let j = 0; j < chatItems.length; j++) { chatItems[j].classList.remove('active'); }
        item.classList.add('active');

        activeChat = item.getAttribute('data-id');
        let status = item.getAttribute('data-status');
        
        document.getElementById('header-name').innerText = item.querySelector('.chat-name').innerText;
        document.getElementById('header-avatar').src = item.querySelector('.chat-avatar').src;
        
        let headerStatus = document.getElementById('header-status');
        headerStatus.className = 'status-dot ' + status;
        document.getElementById('header-prompt').innerText = (status === 'online') ? 'В сети' : 'Был(а) недавно';

        if (activeChat === "general") loadGeneralChat();
        else loadBotChat();
    };
}

loadGeneralChat();

document.getElementById('clear-chat-btn').onclick = function() {
    if (activeChat === "general") {
        alert("Вы не можете удалить историю общего сервера!");
        return;
    }
    if (confirm("Вы точно хотите очистить историю с этим ботом?")) {
        botHistories[activeChat] = [];
        loadBotChat();
    }
};

function getSmartAnswer(text, persona) {
    let t = text.toLowerCase();
    
    if (t.startsWith("img:")) {
        let reactions = ["Хахаха, жиза!", "Ору 😂", "Ахаха, сохранил себе", "Классика!", "Смешно)"];
        return reactions[Math.floor(Math.random() * reactions.length)];
    }

    if (t.includes("мем") || t.includes("картинк") || t.includes("смешн") || t.includes("код") || t.includes("прог")) {
        return "IMG:" + memesDb[Math.floor(Math.random() * memesDb.length)];
    }

    let arr = [];
    if (persona === "влад") {
        if (t.includes("привет") || t.includes("ку")) arr = ["Здарова!", "О, привет, " + myName];
        else if (t.includes("дел")) arr = ["Да норм, баги фикшу"];
        else if (t.includes("дот") || t.includes("игр") || t.includes("го ")) arr = ["О, погнали пати!", "Залетай в дискорд"];
        else arr = ["Да забей на это", "Не шарю вообще", "Может в доту лучше?"];
    }
    else if (persona === "кот") arr = ["ОКАК!", "Мяу...", "*умывается*", "Мррр... ОКАК!"];
    else if (persona === "гопник") {
        if (t.includes("деньг") || t.includes("мелоч")) arr = ["А если найду?", "А подпрыгнуть?"];
        else if (t.includes("семк")) arr = ["Семки святое, не трожь."];
        else arr = ["Слыш, ты с какого района?", "Поясни за шмот", "Есть позвонить?"];
    }
    else if (persona === "учитель") {
        if (t.includes("оценк") || t.includes("два")) arr = ["Двойка в журнал!", "Родителей в школу!"];
        else arr = ["Где комментарии к коду?", "Завтра на пересдачу!", "Ваш код не компилируется."];
    }
    else if (persona === "gemini") {
        arr = ["Я ИИ, я работаю над этим.", "Интересный запрос, " + myName + ".", "Скрипт выполнен успешно."];
    }

    return arr[Math.floor(Math.random() * arr.length)];
}

msgInput.oninput = function() { 
    sendBtn.disabled = msgInput.value === ""; 
    if (msgInput.value.trim() === "/meme") {
        memePicker.classList.add('active');
    } else {
        memePicker.classList.remove('active');
    }
};

sendBtn.onclick = function() {
    let text = msgInput.value;
    if (text === "") return;

    msgCounter++;
    let currentMsgId = msgCounter;
    let time = getCurrentTime();
    
    memePicker.classList.remove('active');
    
    renderMessage(text, myName, time, false, currentMsgId, false);
    msgInput.value = "";
    sendBtn.disabled = true;
    
    sendSound.play().catch(function(){});

    if (activeChat === "general") {
        fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sender: myName, text: text }) });
    } else {
        botHistories[activeChat].push({ text: text, author: myName, time: time });
        let botName = document.getElementById('header-name').innerText;
        renderMessage("", botName, "", true, 0, false);

        setTimeout(function() {
            removeTypingIndicator();
            receiveSound.play().catch(function(){});
            
            let tickSpan = document.getElementById('tick-' + currentMsgId);
            if (tickSpan) {
                tickSpan.innerHTML = "✓✓";
                tickSpan.className = "msg-tick read";
            }

            let botTime = getCurrentTime();
            let answer = getSmartAnswer(text, activeChat);
            
            botHistories[activeChat].push({ text: answer, author: botName, time: botTime });
            
            if (activeChat === document.querySelector('.chat-item.active').getAttribute('data-id')) {
                renderMessage(answer, botName, botTime, false, 0, true);
            }
        }, 1500);
    }
};