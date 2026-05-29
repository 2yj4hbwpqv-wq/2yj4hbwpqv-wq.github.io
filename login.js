let myName = localStorage.getItem('localName');
let myUser = localStorage.getItem('localUser');
let themeBtn = document.getElementById('theme-btn');
let currentTheme = localStorage.getItem('appTheme');

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

if (myName !== null && myName !== "") {
    window.location.href = "chats.html";
}

let loginBtn = document.getElementById('login-btn');
if (loginBtn) {
    loginBtn.onclick = function() {
        let nameText = document.getElementById('name-input').value.trim();
        let userText = document.getElementById('username-input').value.trim();

        if (nameText === "" || userText === "") {
            alert("Пожалуйста, заполните оба поля!");
            return;
        }

        if (userText.charAt(0) !== '@') {
            userText = '@' + userText;
        }

        localStorage.setItem('localName', nameText);
        localStorage.setItem('localUser', userText);
        
        window.location.href = "chats.html";
    };
}