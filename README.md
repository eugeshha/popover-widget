![CI](https://github.com/eugeshha/popover-widget/actions/workflows/web.yml/badge.svg)

# Popover Widget

Реализация popover виджета на чистом JavaScript без использования jQuery, аналогично Bootstrap popover компоненту.

## Описание

Popover Widget - это современная реализация всплывающих подсказок, которая:
- Показывается сверху от целевого элемента
- Центрируется по горизонтали относительно элемента
- Имеет заголовок и текст содержимого
- Поддерживает анимации появления/исчезновения
- Автоматически позиционируется в пределах viewport
- Закрывается при клике вне области или нажатии Escape

## Функциональность

- ✅ Создание popover с заголовком и содержимым
- ✅ Позиционирование сверху от элемента
- ✅ Центрирование по горизонтали
- ✅ Анимации появления/исчезновения
- ✅ Автоматическое скрытие при клике вне области
- ✅ Закрытие по клавише Escape
- ✅ Адаптивное позиционирование в пределах viewport
- ✅ Полное покрытие автотестами

## Использование

### HTML
```html
<button class="btn" data-title="Заголовок" data-content="Содержимое popover">
  Показать popover
</button>
```

### JavaScript
```javascript
import { PopoverWidget } from './js/app.js';

const popoverWidget = new PopoverWidget();
const button = document.querySelector('.btn');

// Показать popover
popoverWidget.show(button, 'Заголовок', 'Содержимое');

// Скрыть popover
popoverWidget.hide();

// Переключить видимость
popoverWidget.toggle(button, 'Заголовок', 'Содержимое');
```

## Установка и запуск

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm start

# Сборка для продакшена
npm run build

# Запуск тестов
npm test

# Покрытие тестами
npm run coverage
```

## Технологии

- **JavaScript ES6+** - основной язык
- **Webpack 5** - сборка проекта
- **Jest** - тестирование
- **CSS3** - стилизация с анимациями
- **HTML5** - разметка

## Структура проекта

```
src/
├── css/
│   └── style.css          # Стили popover виджета
├── js/
│   ├── app.js            # Основной класс PopoverWidget
│   └── app.test.js       # Автотесты
├── img/
│   └── netology.svg      # Логотип
├── index.html            # Демо страница
└── index.js              # Точка входа
```

## Демо

[Посмотреть в действии](https://eugeshha.github.io/popover-widget/)

## Лицензия

MIT