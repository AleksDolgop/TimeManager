// ==UserScript==
// @name         Time manager
// @namespace    http://tampermonkey.net/
// @version      0.3
// @downloadURL https://raw.githubusercontent.com/AleksDolgop/TimeManager/main/script.js
// @updateURL https://raw.githubusercontent.com/AleksDolgop/TimeManager/main/script.js
// @description  Собирает сумму ветров от направлений
// @author       AleksDolgop
// @match         https://www.gismeteo.ru/diary/*/*/*/
// @grant        none
// @require https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.bundle.min.js
// ==/UserScript==

let textBlock = null;
let nowTime = '10:10:10.10'

function updateTime() {
  textBlock.textContent = nowTime
}

(function () {
  'use strict';

  const mainDiv = document.createElement('div');
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

  const timerH = document.createElement('h2');
  timerH.id = 'tempTime'
  timerH.textContent = '10:10:12';
  mainDiv.appendChild(timerH);
  textBlock = timerH

  const butStart = document.createElement('a');
  butStart.textContent = 'start';
  butStart.href = '#';
  butStart.style.textDecoration = 'none';
  butStart.style.width = '50px';
  butStart.style.float = 'left';
  butStart.style.marginTop = '2px';
  // butStart.onclick = resetStorage;
  mainDiv.appendChild(butStart);

  const butPause = document.createElement('a');
  butPause.textContent = 'pause';
  butPause.href = '#';
  butPause.style.textDecoration = 'none';
  butPause.style.width = '50px';
  butPause.style.float = 'left';
  butPause.style.marginTop = '2px';
  // butStart.onclick = resetStorage;
  mainDiv.appendChild(butPause);

  const butReset = document.createElement('a');
  butReset.textContent = 'reset';
  butReset.href = '#';
  butReset.style.textDecoration = 'none';
  butReset.style.width = '50px';
  butReset.style.float = 'left';
  butReset.style.marginTop = '2px';
  // butStart.onclick = resetStorage;
  mainDiv.appendChild(butReset);

  document.body.appendChild(mainDiv);
})();
