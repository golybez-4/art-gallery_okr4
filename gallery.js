// ===== ЗОВНІШНІЙ СКРИПТ: gallery.js =====

// --- 1. Функція «Діалог з користувачем» ---
// Використовує: prompt, confirm, alert, змінні, умовне розгалуження, цикл
function dialogWithUser() {
    var name = prompt("Вітаємо в Картинній Галереї!\nЯк вас звати?", "");
    if (!name || name.trim() === "") {
        alert("Ім'я не введено. До побачення!");
        return;
    }
    var agree = confirm("Дякуємо, " + name + "!\nБажаєте дізнатися про поточні виставки?");
    if (!agree) {
        alert("Гаразд, " + name + ". Завжди раді бачити вас у галереї!");
        return;
    }
    var exhibitions = ["«Класики Відродження»", "«Світло імпресіонізму»", "«Сучасний погляд»"];
    var message = "Поточні виставки галереї:\n";
    for (var i = 0; i < exhibitions.length; i++) {
        message += (i + 1) + ". " + exhibitions[i] + "\n";
    }
    alert(message + "\nЗапрошуємо, " + name + "!");
}

// --- 2. Функція виводу інформації про розробника ---
// Параметр «посада» має значення за замовчуванням
function showDeveloper(surname, firstName, position) {
    if (position === undefined) {
        position = "Веб-розробник";
    }
    alert(
        "Розробник сторінки:\n" +
        "Прізвище: " + surname + "\n" +
        "Ім'я: " + firstName + "\n" +
        "Посада: " + position
    );
}

// --- 3. Функція порівняння двох рядків ---
// Більший рядок виводиться через alert
function compareTwoStrings(str1, str2) {
    if (str1.length >= str2.length) {
        alert("Довший рядок: \"" + str1 + "\" (" + str1.length + " символів)");
    } else {
        alert("Довший рядок: \"" + str2 + "\" (" + str2.length + " символів)");
    }
}

// --- 4. Зміна фону сторінки на 30 секунд через document.body.style ---
function changeBackgroundFor30s() {
    var originalBg = document.body.style.backgroundColor;
    var originalColor = document.body.style.color;
    document.body.style.backgroundColor = "#2c1a0e";
    document.body.style.color = "#e8d5a3";
    setTimeout(function () {
        document.body.style.backgroundColor = originalBg;
        document.body.style.color = originalColor;
    }, 30000);
}


// --- 5. Створення текстового вузла ---
function addTextNode() {
    var textNode = document.createTextNode("Вітаємо у галереї!");
    var paragraph = document.createElement("p");
    paragraph.appendChild(textNode);
    document.body.appendChild(paragraph);
}

// --- 6. Створення вузла елемента ---
function createNewElement() {
    var newDiv = document.createElement("div");
    newDiv.innerHTML = "Нова виставка!";
    newDiv.style.padding = "10px";
    newDiv.style.backgroundColor = "#f0e8dc";
    document.body.appendChild(newDiv);
}