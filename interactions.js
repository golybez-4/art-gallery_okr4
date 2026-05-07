
/*  1. MOUSEOVER / MOUSEOUT — зміна стилю при наведенні миші
      Використовуємо event.target і event.relatedTarget */

// Обробник mouseover: спрацьовує, коли курсор заходить на елемент
function onMouseOver(event) {
  const el = event.target; // елемент, на який наведено курсор

  // Підсвічуємо рядок і комірку таблиці
  if (el.tagName === 'TD' || el.tagName === 'TH') {
    const row = el.closest('tr');
    if (row && !row.classList.contains('table-header-row') &&
        !row.classList.contains('table-subheader-row') &&
        !row.classList.contains('table-footer-row')) {
      row.classList.add('row-hovered');
    }
    el.classList.add('cell-hovered');
  }

  // Підсвічуємо елемент списку <li>
  if (el.tagName === 'LI') {
    el.classList.add('li-hovered');
  }

  // Підсвічуємо картку галереї (або її дочірній елемент)
  if (el.classList.contains('gallery-cell') || el.closest('.gallery-cell')) {
    const card = el.closest('.gallery-cell') || el;
    card.classList.add('card-hovered');
  }

  // Змінюємо колір заголовків h2/h3
  if (el.tagName === 'H2' || el.tagName === 'H3') {
    el.classList.add('heading-hovered');
  }

  // event.relatedTarget — елемент, з якого прийшов курсор (для відлагодження)
  const from = event.relatedTarget;
  if (from) {
    const info = from.id
      ? `#${from.id}`
      : from.className
        ? `.${String(from.className).split(' ')[0]}`
        : from.tagName.toLowerCase();
    el.dataset.from = info;
  }
}

// Обробник mouseout: скидає стилі при виході курсора
function onMouseOut(event) {
  const el = event.target; // елемент, який покинув курсор

  if (el.tagName === 'TD' || el.tagName === 'TH') {
    const row = el.closest('tr');
    if (row) row.classList.remove('row-hovered');
    el.classList.remove('cell-hovered');
  }

  if (el.tagName === 'LI') {
    el.classList.remove('li-hovered');
  }

  if (el.classList.contains('gallery-cell') || el.closest('.gallery-cell')) {
    const card = el.closest('.gallery-cell') || el;
    card.classList.remove('card-hovered');
  }

  if (el.tagName === 'H2' || el.tagName === 'H3') {
    el.classList.remove('heading-hovered');
  }
}

// Делегування подій: один обробник на весь документ
document.addEventListener('mouseover', onMouseOver);
document.addEventListener('mouseout',  onMouseOut);


/* 2. DRAG-AND-DROP — перетягування карток галереї
      Ланцюжок подій: mousedown → mousemove → mouseup */

let dragging  = null; // картка, що перетягується
let dragClone = null; // клон-«привид», який слідує за курсором
let offsetX   = 0;    // зміщення курсора відносно картки по X
let offsetY   = 0;    // зміщення курсора відносно картки по Y

// mousedown — фіксуємо початок перетягування
function onMouseDown(event) {
  const card = event.target.closest('.draggable-card');
  if (!card) return;

  event.preventDefault(); // забороняємо виділення тексту під час перетягування
  dragging = card;

  // Запам'ятовуємо зміщення курсора всередині картки
  const rect = card.getBoundingClientRect();
  offsetX = event.clientX - rect.left;
  offsetY = event.clientY - rect.top;

  // Створюємо клон, що рухатиметься разом із курсором
  dragClone = card.cloneNode(true);
  dragClone.classList.add('drag-clone');
  dragClone.style.width  = rect.width  + 'px';
  dragClone.style.height = rect.height + 'px';
  dragClone.style.left   = rect.left   + window.scrollX + 'px';
  dragClone.style.top    = rect.top    + window.scrollY + 'px';
  document.body.appendChild(dragClone);

  card.classList.add('dragging-origin'); // робимо оригінал напівпрозорим
}

// mousemove — переміщуємо клон слідом за курсором
function onMouseMove(event) {
  if (!dragClone) return;

  dragClone.style.left = (event.clientX - offsetX + window.scrollX) + 'px';
  dragClone.style.top  = (event.clientY - offsetY + window.scrollY) + 'px';

  // Знаходимо елемент під клоном (тимчасово ховаємо клон, щоб він не заважав)
  dragClone.style.display = 'none';
  const below = document.elementFromPoint(event.clientX, event.clientY);
  dragClone.style.display = '';

  // Підсвічуємо drop-зону під курсором
  const targetZone = below ? below.closest('.drop-zone') : null;
  document.querySelectorAll('.drop-zone').forEach(z => z.classList.remove('drop-target'));
  if (targetZone && targetZone !== dragging.closest('.drop-zone')) {
    targetZone.classList.add('drop-target');
  }
}

// mouseup — завершуємо перетягування, переміщуємо або повертаємо картку
function onMouseUp(event) {
  if (!dragging || !dragClone) return;

  dragClone.style.display = 'none';
  const below = document.elementFromPoint(event.clientX, event.clientY);
  dragClone.style.display = '';

  const targetZone = below ? below.closest('.drop-zone') : null;

  if (targetZone && targetZone !== dragging.closest('.drop-zone')) {
    // Успішне скидання — анімуємо переміщення клону до drop-зони
    const targetRect = targetZone.getBoundingClientRect();
    dragClone.style.transition = 'left 0.18s ease, top 0.18s ease';
    dragClone.style.left = (targetRect.left + window.scrollX + 8) + 'px';
    dragClone.style.top  = (targetRect.top  + window.scrollY + 8) + 'px';
    setTimeout(() => {
      targetZone.appendChild(dragging);
      cleanup();
    }, 180);
  } else {
    // Невдале скидання — повертаємо клон на місце оригіналу
    const originRect = dragging.getBoundingClientRect();
    dragClone.style.transition = 'left 0.18s ease, top 0.18s ease';
    dragClone.style.left = (originRect.left + window.scrollX) + 'px';
    dragClone.style.top  = (originRect.top  + window.scrollY) + 'px';
    setTimeout(cleanup, 180);
  }

  document.querySelectorAll('.drop-zone').forEach(z => z.classList.remove('drop-target'));
}

// Очищення після завершення перетягування: видалення клону, скидання стану
function cleanup() {
  if (dragClone) { dragClone.remove(); dragClone = null; }
  if (dragging)  { dragging.classList.remove('dragging-origin'); dragging = null; }
}

// Реєстрація обробників drag-and-drop
document.addEventListener('mousedown', onMouseDown);
document.addEventListener('mousemove', onMouseMove);
document.addEventListener('mouseup',   onMouseUp);


/* 3. Ініціалізація після завантаження DOM */
document.addEventListener('DOMContentLoaded', () => {
  // Позначаємо всі картки галереї як такі, що можна перетягувати
  document.querySelectorAll('.gallery-cell').forEach(cell => {
    cell.classList.add('draggable-card');
  });
  // Drop-зони вже розмічені в HTML класом .drop-zone
});