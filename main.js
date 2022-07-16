import { init, save, undo, clearAll } from './draw.js';

document.addEventListener("DOMContentLoaded", init, false);
document.getElementById('save-button').addEventListener('click', save, false);
document.getElementById('undo-button').addEventListener('click', undo, false);
document.getElementById('clear-button').addEventListener('click', clearAll, false);