var a = 7,
    b = 4;

var canvas = document.getElementById("axis"),
    context = canvas.getContext("2d"),
    currentStep = 0;
    axisStep = 35.3;

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
    step();
}

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

// Переходит на шаг вперед по сценарию
// с вызовом функции текущего шага
function step() {
    currentStep++;

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

// Шаги сценария
function step1() {
    createLine(a, 33);
}

function step2() {
    createLine(b, (a + 1) * axisStep);
}

function step3() {
    var input = '<input class="answerInput" type="number">',
        sum = a + b;

    $(".answer").html(input);
    $(".answerInput").on("change", function() {
        if(this.value == sum) $(".answer").html(sum);
        else $(this).css("color", "red");
    });
}

// Рисует линию над числовой осью
// учитывая ее длинну и отступы
function createLine(number, offset) {
    // + 3 необходимо для выравнивания линии
    // относительно изображения.
    var offsetLine = offset,
        id = "B";

    // Если изначальное смещение = 30
    // значит идет работа с первой(a) линией,
    // тогда необходимо убрать дополнительное смещение
    // предусмотренное для последней линии(b),
    // и прибавить 1 к числу, поскольку отчет
    // по числовой оси начинается с ноля.
    if(offset === 33) {
        id = "A";
        offsetLine = 0;
        number = number + 1;
    }

    // Высота линии увеличивается
    // в зависимости от велечины числа.
    // Из минимальной допустимой высоты линии
    // вычесть число умноженное к примеру на 7.
    var cp1x = offset,
        cp1y = 150 - (number * 7),
        cp2x = number * axisStep + offsetLine,
        cp2y = 150 - (number * 7),
        x = number * axisStep + offsetLine,
        y = 155;

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

    // Отобразить поле ввода
    showAnswer(id, cp1y, number * axisStep, offsetLine);
}

// Отображает поле ввода ответа
// пока введенное значение не будет верно
function showAnswer(id, height, width, offset) {
    var className = ".input" + id,
        number = a;

    // Определяем A или B вопрос
    // по значению offset.
    if(offset != 0) {
        offset -= 10;
        number = b;
    }

    var style = {
        "position": "absolute",
        "display": "block",
        "top": height - 20 + "px",
        "left": (width / 2) + offset + "px",
        "font-size": "80%",
    };

    // Добавить стили кнопкам
    // и установить обработчик события
    // когда пользователь меняет значение поля.
    $(className).css(style).on("change", function() {
        // Верный ответ
        if(this.value == number) {
            $(className).css("display", "none");
            $(".answer" + id).css(style).html(number);
            $(".expression" + id).css("background", "white");
            // Перейти на следующий шаг
            step();
        }
        // Неверный ответ
        else {
            // Запретить отображение отрицательных чисел
            if(this.value < 0) {
                this.value = 0;
            }
            $(".expression" + id).css({
                "background-color": "orange",
                "padding": "0.1em",
            });
            $(className).css("color", "red");
        }
    });
}

// Запустить программу
init();