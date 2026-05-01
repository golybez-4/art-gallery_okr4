// ===== events.js — Картинна Галерея =====

// Підсвічує картку при наведенні — викликається через атрибут onmouseover і через властивість
function highlightCard(event) {
    event.currentTarget.style.boxShadow = "0 4px 16px rgba(201,168,76,0.5)";
    event.currentTarget.style.borderColor = "#c9a84c";
}

// Скидає стилі картки при відведенні миші
function resetCard(event) {
    event.currentTarget.style.boxShadow = "";
    event.currentTarget.style.borderColor = "#d4c5a9";
}

// Перший обробник mouseover через addEventListener — виводить назву картини у підпис
function showPaintingTitle(event) {
    var status = document.getElementById("gallery-caption");
    if (status) status.textContent = event.currentTarget.dataset.title || "";
}

// Другий обробник тієї самої події mouseover — змінює курсор на zoom-in
function setZoomCursor(event) {
    event.currentTarget.style.cursor = "zoom-in";
}

// Обробник-об'єкт: браузер викликає handleEvent при настанні події
// event.currentTarget — завжди елемент .painting-card, де зареєстрований обробник
var cardFocusLogger = {
    handleEvent: function(event) {
        var status = document.getElementById("gallery-caption");
        if (status) status.textContent = event.currentTarget.dataset.title || "";
    }
};

document.addEventListener("DOMContentLoaded", function () {

    var cards = document.querySelectorAll(".painting-card");

    cards.forEach(function(card) {

        // Спосіб 2: обробник через властивість DOM-елемента (перша картка також має атрибут у HTML)
        card.onmouseover = highlightCard;
        card.onmouseout  = resetCard;

        // Спосіб 3: addEventListener — два різні обробники на одну подію mouseover
        card.addEventListener("mouseover", showPaintingTitle);
        card.addEventListener("mouseover", setZoomCursor);

        // Обробник-об'єкт на mouseenter (не спливає, спрацьовує лише при вході у картку)
        card.addEventListener("mouseenter", cardFocusLogger);
    });

    // removeEventListener: знімає cardFocusLogger з першої картки після першого відведення миші
    // Потрібно передавати ТЕ САМЕ посилання на об'єкт, що і при addEventListener
    var firstCard = cards[0];
    if (firstCard) {
        firstCard.addEventListener("mouseleave", function removeLoggerOnce() {
            firstCard.removeEventListener("mouseenter", cardFocusLogger); // видаляємо об'єкт-обробник
            firstCard.removeEventListener("mouseleave", removeLoggerOnce); // функція видаляє саму себе
        });
    }

    // Скидає підпис при виході курсора з усієї галереї
    var galleryWrap = document.getElementById("paintings-gallery");
    if (galleryWrap) {
        galleryWrap.addEventListener("mouseleave", function() {
            var status = document.getElementById("gallery-caption");
            if (status) status.textContent = "\u00a0";
        });
    }

    // Делегування подій: обробник onclick на <ul>, event.target визначає обраний <li>
    var genreList = document.getElementById("genres-list");
    var lastLi = null;
    if (genreList) {
        genreList.onclick = function(event) {
            var target = event.target;
            if (target.tagName !== "LI") return; // ігноруємо кліки поза <li>
            if (lastLi) lastLi.classList.remove("li-active"); // знімаємо попереднє підсвічування
            target.classList.add("li-active");   // підсвічуємо обраний елемент
            lastLi = target;
        };
    }

    // Прийом «Поведінка»: один обробник на весь #filter-menu
    // data-action на кнопці визначає, який метод menuActions викликати
    var filterMenu = document.getElementById("filter-menu");
    if (filterMenu) {
        filterMenu.addEventListener("click", function(event) {
            var btn = event.target.closest("[data-action]"); // знаходимо кнопку з data-action
            if (!btn) return;
            var action = btn.dataset.action; // читаємо значення: "all", "renaissance" тощо
            if (typeof menuActions[action] === "function") {
                menuActions[action](); // динамічно викликаємо потрібний метод
            }
            filterMenu.querySelectorAll(".filter-btn").forEach(function(b) {
                b.classList.remove("filter-btn--active");
            });
            btn.classList.add("filter-btn--active"); // позначаємо активну кнопку
        });
    }
});

// Таблиця дій меню: ключ = значення data-action, значення = функція фільтрації
// Щоб додати новий фільтр — додати кнопку з data-action у HTML і метод тут
var menuActions = {

    // Показати всі картки
    all: function() {
        document.querySelectorAll(".painting-card").forEach(function(c) {
            c.style.opacity = "1";
        });
    },

    // Показати лише картки з data-era="renaissance", решту приглушити
    renaissance: function() {
        document.querySelectorAll(".painting-card").forEach(function(c) {
            c.style.opacity = c.dataset.era === "renaissance" ? "1" : "0.25";
        });
    },

    // Показати лише картки з data-era="impressionism"
    impressionism: function() {
        document.querySelectorAll(".painting-card").forEach(function(c) {
            c.style.opacity = c.dataset.era === "impressionism" ? "1" : "0.25";
        });
    },

    // Показати лише картки з data-era="modern"
    modern: function() {
        document.querySelectorAll(".painting-card").forEach(function(c) {
            c.style.opacity = c.dataset.era === "modern" ? "1" : "0.25";
        });
    }
};