// ==UserScript==
// @name         Time manager
// @namespace    http://tampermonkey.net/
// @version      1.0
// @downloadURL https://raw.githubusercontent.com/AleksDolgop/TimeManager/main/script.js
// @updateURL https://raw.githubusercontent.com/AleksDolgop/TimeManager/main/script.js
// @description  Собирает сумму ветров от направлений
// @author AleksDolgop
// @include https://rm.i-link.pro/*
// @grant none
// @require https://cdn.jsdelivr.net/npm/js-date-format@0.0.2/js-date-format.min.js
// ==/UserScript==

/**
 * @type {HTMLDivElement}
 */
let mainDiv;
/**
 * @type {HTMLDivElement}
 */
let tasksDiv;

/**
 * @type {HTMLDivElement}
 */
let btnsDiv;

/**
 * @type {HTMLDivElement}
 */
let timerDiv;

/**
 * @type {HTMLHeadingElement}
 */
let textBlock;

let fulSize = false;

function createMainDiv() {
  mainDiv = document.createElement('div');
  mainDiv.id = 'tampTimeManager';
  mainDiv.style.position = 'fixed';
  mainDiv.style.textAlign = 'center';
  mainDiv.style.bottom = 0;
  mainDiv.style.right = 0;
  mainDiv.style.backgroundColor = '#fff';
  mainDiv.style.border = '1px solid black';
  mainDiv.style.height = '100px';
  mainDiv.style.width = '200px';
  mainDiv.style.zIndex = 1000;
  mainDiv.style.marginBottom = '10px';
  mainDiv.style.paddingTop = '10px';
  mainDiv.style.marginRight = '10px';

  timerDiv = document.createElement('div');
  mainDiv.appendChild(timerDiv);
  btnsDiv = document.createElement('div');
  btnsDiv.style.position = 'absolute';
  btnsDiv.style.bottom = '5px';
  mainDiv.appendChild(btnsDiv);

  // tasks

  tasksDiv = document.createElement('div');
  tasksDiv.style.position = 'absolute';
  tasksDiv.style.textAlign = 'center';
  tasksDiv.style.bottom = '-1px';
  tasksDiv.style.left = '-506px';
  tasksDiv.style.backgroundColor = '#fff';
  tasksDiv.style.border = '1px solid black';
  tasksDiv.style.height = '110px';
  tasksDiv.style.width = '500px';
  tasksDiv.style.display = 'none';
  mainDiv.appendChild(tasksDiv);

  const textTaskDiv = document.createElement('div');
  textTaskDiv.id = 'tempTextTask';
  textTaskDiv.style.position = 'absolute';
  textTaskDiv.style.width = '100%';
  textTaskDiv.style.bottom = '10px';
  tasksDiv.appendChild(textTaskDiv);

  const textInput = document.createElement('input');
  textInput.type = 'text';
  textInput.style.width = '85%';
  textInput.style.height = '15px';

  textTaskDiv.appendChild(textInput);

  const btnAddTask = document.createElement('input');
  btnAddTask.type = 'button';
  btnAddTask.value = 'add';
  btnAddTask.style.marginLeft = '1%';
  btnAddTask.onclick = () => {
    if (textInput.value.trim().length) {
      addTask(textInput.value);
      textInput.value = '';
    }
  };
  textTaskDiv.appendChild(btnAddTask);

  const btnResize = document.createElement('input');
  btnResize.type = 'button';
  btnResize.value = '<<';
  btnResize.style.border = '1px solid black';
  btnResize.style.position = 'absolute';
  btnResize.style.top = '-1px';
  btnResize.style.left = '-33px';
  btnResize.style.height = '112px';
  btnResize.style.width = '30px';
  btnResize.onclick = () => {
    if (fulSize) {
      fulSize = false;
      btnResize.value = '<<';
      tasksDiv.style.display = 'none';
      btnResize.style.left = '-33px';
    } else {
      fulSize = true;
      btnResize.value = '>>';
      tasksDiv.style.display = 'block';
      btnResize.style.left = '-538px';
    }
  };
  btnResize.onmouseover = () => {};
  btnResize.onmouseleave = () => {};
  mainDiv.appendChild(btnResize);

  // timer
  textBlock = document.createElement('h1');
  textBlock.style.fontFamily = 'Arial';
  textBlock.style.fontSize = '30px';
  textBlock.style.lineHeight = '20px';
  updateTime();
  timerDiv.appendChild(textBlock);

  document.body.appendChild(mainDiv);

  loadTasks();
}

let taskList;
function loadTasks() {
  taskList = window.localStorage.tempTimeTasks;
  if (typeof taskList === 'string') {
    try {
      taskList = JSON.parse(taskList);
    } catch {
      taskList = [];
    }
  } else {
    taskList = [];
  }

  taskList.map(item => addTask(item.text, item.date, item.timePoint, false));
}

function clearTasks() {
  delete window.localStorage.tempTimeTasks;
  while (tasksDiv.children.length > 1) {
    tasksDiv.removeChild(tasksDiv.lastChild);
  }
  tasksDiv.style.height = '110px';

  loadTasks();
}

function deleteTask(timePoint) {
  tasksDiv.removeChild(tasksDiv.children.find(item => item.id === timePoint));
  taskList = taskList.filter(item => item.timePoint !== timePoint);
  window.localStorage.tempTimeTasks = JSON.stringify(taskList);
}

function pxValueToInt(value) {
  return parseInt(value.replace(/px/g, ''), 10);
}

function addTask(
  text,
  date = Date.now(),
  timePoint = timeFormater(timeMsec),
  newItem = true
) {
  const taskDiv = document.createElement('div');
  taskDiv.id = timePoint;
  taskDiv.style.width = '94%';
  taskDiv.style.borderBottom = '1px solid black';
  taskDiv.style.height = '20px';
  taskDiv.style.marginLeft = '3%';
  taskDiv.style.marginTop = '5px';
  taskDiv.textContent = timePoint + '  |   ' + text;
  taskDiv.style.textAlign = 'left';
  tasksDiv.appendChild(taskDiv);

  if (newItem) {
    taskList.push({ text, date, timePoint });
    window.localStorage.tempTimeTasks = JSON.stringify(taskList);
  }

  console.log(taskList.length, taskList);
  if (taskList.length > 1) {
    tasksDiv.style.height =
      pxValueToInt(tasksDiv.style.height) +
      pxValueToInt(taskDiv.style.height) +
      pxValueToInt(taskDiv.style.marginTop) +
      'px';
  }
}

function timeFormater(msec) {
  const fixLen = (value, len) => {
    if (typeof value !== 'string') {
      value = value.toString();
    }
    return (value.length < len ? '0'.repeat(len - value.length) : '') + value;
  };
  if (typeof msec === 'string') {
    msec = parseInt(msec, 10);
  }
  const ms = fixLen((msec % 1000) / 10, 2);
  msec = Math.floor(msec / 1000);
  const sec = fixLen(msec % 60, 2);
  msec = Math.floor(msec / 60);
  const min = fixLen(msec % 60, 2);
  msec = Math.floor(msec / 60);
  const hour = fixLen(msec % 60, 2);
  msec = Math.floor(msec / 60);
  return `${hour}:${min}:${sec}.${ms}`;
}

let timeMsec = parseInt(window.localStorage.tempTimeMsec, 10) || 0;
function updateTime() {
  textBlock.textContent = timeFormater(timeMsec);
}

let interval;
function startTimer() {
  interval = setInterval(() => {
    timeMsec += 10;
    window.localStorage.tempTimeMsec = timeMsec;
    updateTime();
  }, 10);
}

function pauseTimer() {
  clearInterval(interval);
  updateTime();
}

function resetTimer() {
  if (timeMsec && confirm('Are you shure?')) {
    clearTasks();
    clearInterval(interval);
    window.localStorage.tempTimeMsec = timeMsec = 0;
    updateTime();
  }
}

/**
 * @param {string} text
 * @param {(this: GlobalEventHandlers, ev: MouseEvent) => any} func
 * @param {CSSStyleDeclaration} styles
 */
function createButton(text, func, styles = undefined) {
  const elem = document.createElement('input');
  elem.type = 'button';
  elem.value = text;
  elem.href = '#';
  elem.style.textDecoration = 'none';
  elem.style.height = '35px';
  for (const key in styles) {
    elem.style[key] = styles[key];
  }
  elem.onclick = func;
  btnsDiv.appendChild(elem);
}

(function () {
  'use strict';

  createMainDiv();
  createButton('start', startTimer, {
    width: '60px',
    float: 'left',
    marginTop: '2px',
    marginLeft: '5px',
  });
  createButton('pause', pauseTimer, {
    width: '60px',
    float: 'left',
    marginTop: '2px',
    marginLeft: '5px',
  });
  createButton('reset', resetTimer, {
    width: '60px',
    float: 'left',
    marginTop: '2px',
    marginLeft: '5px',
  });
})();
