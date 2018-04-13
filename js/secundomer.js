// State variables
active = false;
need_erase = false;
rounded = false;
rounded_num = 0;
var date;
var new_round_date;
var stop_date;

var stop_date_fix;
var id;

// time divs
var full_time_div;
var round_time_div;

// buttons
var circle_button;
var start_button;

// canvas variables
var full_canvas;
var circle_canvas;

var radiusClock;
var xCenterClock;
var yCenterClock;

function init() {
    full_time_div = $(".full_time");
    round_time_div = $(".circle_time");
    circle_button = $(".circle");
    start_button = $(".start");

    full_canvas = $("#full_canvas").get(0);
    full_canvas_context = full_canvas.getContext('2d');
    full_canvas_context.strokeRect(0, 0, full_canvas.width, full_canvas.height);

    circle_canvas = $("#circle_canvas").get(0);
    circle_canvas_context = circle_canvas.getContext('2d');
    circle_canvas_context.strokeRect(0, 0, circle_canvas.width, circle_canvas.height);

    radiusClock = full_canvas.height / 2 - 15;
    xCenterClock = full_canvas.width / 2;
    yCenterClock = full_canvas.height / 2;

    setCanvasToDefault();
}

function makeScreen(canvas) {
    clearScreen(canvas);
    drawClock(canvas.getContext('2d'));
}

function clearScreen(canvas) {
    context = canvas.getContext('2d');
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function drawClock(context) {
    context.strokeStyle = "#000000";
    context.lineWidth = 1;
    context.beginPath();
    context.arc(xCenterClock, yCenterClock, radiusClock, 0, 2 * Math.PI, true);
    context.moveTo(xCenterClock, yCenterClock);
    context.stroke();
    context.closePath();

    var radiusNum = radiusClock - 10;
    var radiusPoint;
    for (var time = 0; time < 60; time++) {
        context.beginPath();
        if (time % 5 === 0) {
            radiusPoint = 5;
        } else {
            radiusPoint = 2;
        }
        var xPointM = xCenterClock + radiusNum * Math.cos(-6 * time * (Math.PI / 180) + Math.PI / 2);
        var yPointM = yCenterClock - radiusNum * Math.sin(-6 * time * (Math.PI / 180) + Math.PI / 2);
        context.arc(xPointM, yPointM, radiusPoint, 0, 2 * Math.PI, true);
        context.stroke();
        context.closePath();
    }

    for(var th = 1; th <= 12; th++){
        context.beginPath();
        context.font = 'bold 25px sans-serif';
        var xText = xCenterClock + (radiusNum - 30) * Math.cos(-30*th*(Math.PI/180) + Math.PI/2);
        var yText = yCenterClock - (radiusNum - 30) * Math.sin(-30*th*(Math.PI/180) + Math.PI/2);
        if(th <= 9){
            context.strokeText(th, xText - 5 , yText + 10);
        }else{
            context.strokeText(th, xText - 15 , yText + 10);
        }
        context.stroke();
        context.closePath();
    }
}
function getTimeDifference(time1, time2) {
    return new Date(time1.getTime() - time2.getTime() - stop_date_fix);
}

function circleOrErase() {
    if(need_erase && !active) erase();
    else circle();
}
function circle() {
    if(active) {
        rounded_num++;
        $( "article" ).append(
            "<section class='w-100 h-100'><div class='container d-inline-flex w-100 h-100 text-center'>" +
            "<div class='round-info round-info-circle w-50'>Круг " + rounded_num + ": </div>" +
            "<div class='round-info round-info-time w-50 text-right'>" +
            timeToString(getTimeDifference(new Date(), date)) + "</div>" +
            "</div></section>"
        );
        new_round_date = new Date(new Date().getTime() - stop_date_fix);
        rounded = true;
    }
}


function startStopFunction() {
    if (active) stopFunction();
    else if(need_erase)continueFunction();
    else startFunction();
}

function continueFunction() {
    stop_date_fix += new Date().getTime() - stop_date.getTime();
    activate();
}

function startFunction() {
    date = new Date();
    new_round_date = date;
    stop_date_fix = 0;
    activate();
}

function activate() {
    active = true;
    maskErase();
    start_button.text("Стоп").css('color', 'red');
    id = setInterval(updateTime, 10)
}

function erase() {
    setTimeToDefault();
    setCanvasToDefault();
    deleteErase();
    $("article").empty();
    rounded_num = 0;
    rounded = false;
}
function maskErase() {
    circle_button.text("Круг");
}
function deleteErase() {
    maskErase();
    need_erase = false;
}

function updateTime() {
    dif_date = getTimeDifference(new Date(), date);
    setCanvasTime(full_canvas, dif_date);
    setFullTime(dif_date);
    if(rounded){
        d = getTimeDifference(new Date(), new_round_date);
        setRoundTime(d);
        setCanvasTime(circle_canvas, d);
    }
    else {
        setCanvasTime(circle_canvas, dif_date);
        setRoundTime(dif_date);
    }
}

function setCanvasTime(canvas, date) {
    seconds = date.getSeconds();
    minutes = date.getMinutes();

    makeScreen(canvas);
    context = canvas.getContext('2d');
    drawSeconds(context, seconds);
    drawMinutes(context, minutes, seconds);
}

function timeToString(date) {
    mili_seconds = Math.floor(date.getMilliseconds()/100);
    seconds = date.getSeconds();
    minutes = date.getMinutes();

    if(mili_seconds.toString().length === 1) mili_seconds = '0' + mili_seconds;
    if(seconds.toString().length === 1) seconds = '0' + seconds;
    if(minutes.toString().length === 1) minutes = '0' + minutes;

    return minutes + ':' + seconds + ',' + mili_seconds;
}

function setFullTime(full_date) {
    time = timeToString(full_date);
    full_time_div.text(time);
}

function setRoundTime(round_time) {
    time = timeToString(round_time);
    round_time_div.text(time);
}


function stopFunction() {
    clearInterval(id);
    addErase();
    start_button.text("Старт").css('color', 'green');
    active = false;
    stop_date = new Date();
}

function addErase() {
    need_erase = true;
    circle_button.text("Сброс");
}

function setCanvasToDefault() {
    makeScreen(full_canvas);
    makeScreen(circle_canvas);

    drawDefaultArrows(full_canvas);
    drawDefaultArrows(circle_canvas);

}
function drawMinutes(context, minutes, seconds){
    angle = 6 * (minutes + seconds/60);
    context.beginPath();
    context.strokeStyle =  "#000000";
    context.lineWidth = 3;
    context.moveTo(xCenterClock, yCenterClock);
    context.lineTo(xCenterClock + (radiusClock - 100) * Math.cos(Math.PI/2 - angle *(Math.PI/180)),
        yCenterClock - (radiusClock - 100) * Math.sin(Math.PI/2 - angle *(Math.PI/180)));
    context.stroke();
    context.closePath();
}
function drawSeconds(context, seconds){
    angle = 6 * seconds;
    context.beginPath();
    context.strokeStyle =  "#FF0000";
    context.moveTo(xCenterClock, yCenterClock);
    context.lineTo(xCenterClock + (radiusClock - 50) * Math.cos(Math.PI/2 - angle * (Math.PI/180)),
        yCenterClock - (radiusClock - 50) * Math.sin(Math.PI/2 - angle*(Math.PI/180)));
    context.stroke();
    context.closePath();
}
function drawDefaultArrows(canvas) {
    context = canvas.getContext('2d');
    drawSeconds(context, 0);
    drawMinutes(context, 0, 0);
}

function setTimeToDefault() {
    time = "00:00,00";
    full_time_div.text(time);
    round_time_div.text(time);
}
