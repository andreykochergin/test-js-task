"use strict"

// ---------------------------------------
// Составляющие выражения задания
var a = 7,
    b = 4;

// ---------------------------------------
// Настройки программы
var canvas = document.getElementById("axis"),
    context = canvas.getContext("2d"),
    currentStep = 0, // текущий шаг
    axisStep = 35.3; // размер шага по оси

// ----------------------------------------
// Инициализация программы
function init() {
    // Алгоритм работы программы
    // 1. Загрузить изображение;
    // 2. Отобразить вопрос и выражение;
    // 3. Шаг 1 (см.сценарий);
    // 4. Шаг 2 (см.сценарий);
    // 5. Шаг 3 (см.сценарий);
    loadImage();
    loadQuestion();
    step(); // перейти к шагу 1
}

// -----------------------------------------
// Загрузка изображения числовой оси
// и добавление данных выражения и ответа.

// Загружает изображение оси в canvas
function loadImage() {
    var image = new Image();
    image.src = "img/sprite.png";
    image.onload = function() {
        context.drawImage(image, 0, 150, 800, 83);
    }
}

// Загружает выражение вопроса и его значение (ответ)
function loadQuestion() {
    $(".expressionA").html(a);
    $(".expressionB").html(b);
    $(".answer").html("?");
}

// -----------------------------------------
// Сценарий

// Переходит на шаг вперед по сценарию
// с определением и вызовом
// функции для текущего шага.
function step() {
    // Сделать шаг вперед
    currentStep++;

    // Необходимо для настройки z-index
    // чтобы линии были поверх изображения.
    context.globalCompositeOperation = 'destination-over';

    switch (currentStep) {
        case 1:
            step1();
            break;
        case 2:
            step2();
            break;
        case 3:
            step3();
            break;
    }
}

// Создает линию для числа A
// от начала числовой оси.
function step1() {
    createLine(a, 33);
}

// Создает линию для числа B после A
function step2() {
    createLine(b, (a + 1) * axisStep);
}

// Переходит к шагу 3, который
// позволяет вычислить сумму выражения.
function step3() {
    var input = '<input class="answerInput" type="number">',
        sum = a + b;

    $(".answer").html(input); // заменить ? на поле ввода

    // Проверка/валидация введенного ответа
    $(".answerInput").on("change", function() {
        if(this.value == sum) $(".answer").html(sum);
        else $(this).css("color", "red");
    });
}

// Рисует линию над числовой осью
// учитывая ее длинну и отступы,
// в соотвествии с переданным числом.
function createLine(number, offset) {
    var offsetLine = offset,
        id = "B";

    // Если изначальное смещение = 33
    // значит идет работа с первой(a) линией,
    // тогда необходимо убрать дополнительное смещение
    // предусмотренное для последней линии(b),
    // и прибавить 1 к числу, поскольку отчет
    // по числовой оси начинается с ноля.
    if(offset == 33) {
        id = "A";
        offsetLine = 0;
        number = number + 1;
    }

    // Высота линии увеличивается
    // в зависимости от велечины числа.
    // Из минимальной допустимой высоты линии
    // вычесть число умноженное к примеру на 7.
    var cp1x = offset, // начало линии по горизонтали
        cp1y = 150 - (number * 7), // начало линии по вертикале
        cp2x = number * axisStep + offsetLine, // конец линии по горизонтали
        cp2y = 150 - (number * 7), // конец линии по горизонтали
        x = number * axisStep + offsetLine, // конечная точка по горизонтале
        y = 155; // конечная точка по вертикале

    // ----------------
    // Начало отрисовки стрелки
    context.beginPath();

    context.lineWidth = 1;
    context.strokeStyle = "red";

    // Линия
    context.moveTo(offset, 160);
    context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);

    // Стрелка
    context.moveTo(x, y);
    context.lineTo(x + 2, y - 8);
    context.moveTo(x, y);
    context.lineTo(x - 5, y - 6);

    context.stroke();

    context.closePath();
    // конец отрисовки
    // ----------------

    // Отобразить поле ввода
    showAnswer(id, cp1y, number * axisStep, offsetLine);
}

// Отображает поле ввода ответа
// пока введенное значение не будет верно,
// после чего заменяет его валидным значением.
function showAnswer(id, height, width, offset) {
    var inputClass = ".input" + id,
        answerClass = ".answer" + id,
        expressionClass = ".expression" + id,
        number = a;

    // Определяем вопрос для A или B
    // по значению offset.
    // Поскольку у B линии offset > 0
    // меняем значения.
    if(offset != 0) {
        offset -= 10;
        number = b;
    }

    // Стиль для поля ввода или валидного ответа
    // смещает элемент в соотвествии с
    // высотой и шириной линии.
    var style = {
        "position": "absolute",
        "display": "block",
        "width": "30px",
        "top": height - 20 + "px",
        "left": width / 2 + offset + "px",
        "font-size": "100%",
    };

    // Добавить стили кнопкам
    // и установить обработчик события
    // когда пользователь меняет значение поля.
    $(inputClass).css(style).on("change", function() {

        // Проверка на валидацию
        // Верный ответ
        if(this.value == number) {
            // Скрыть поле ввода и отобразить
            // на его месте валидный ответ.
            $(inputClass).css("display", "none");
            $(answerClass).css(style).html(number);
            $(expressionClass).css("background", "white");

            // Перейти к следующему шагу
            step();
        }
        // Неверный ответ
        else {
            // Запретить отображение отрицательных чисел
            if(this.value < 0) {
                this.value = 0;
            }
            // Изменить цвет елемента выражения
            // который не совпадает с
            // введенным в поле ввода ответом.
            $(expressionClass).css({
                "background-color": "orange",
                "padding": "0.1em",
            });
            // Изменить цвет поля ввода
            $(inputClass).css("color", "red");
        }
    });
}

// Запустить программу
init();