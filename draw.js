var canvas = false;     // Nodo del canvas
var ctx = false;        // Contexto del canvas
var drawing = false;    // Si está dibujando
var hasDraw = false;    // Si teminó un dibujo
var draws = [];         // Array de dibujos
var points = [];        // Array de puntos (dibujo)
var currentMouse = { x: 0, y: 0 };  // Posición (x, y) actual del mouse
var previousMouse = { x: 0, y: 0 }; // Posición (x, y) previa del mouse

// Iniciador
const init = () => {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext("2d");
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    canvas.addEventListener("mousedown", (e) => {
        drawing = true;
        previousMouse = { x: currentMouse.x, y: currentMouse.y };
        currentMouse = getMousePosition(canvas, e);
        points = [];
        points.push({ x: currentMouse.x, y: currentMouse.y })
    }, false);

    canvas.addEventListener("mousemove", (e) => {
        if (drawing) {
            previousMouse = { x: currentMouse.x, y: currentMouse.y };
            currentMouse = getMousePosition(canvas, e);
            // saving the points in the points array
            points.push({ x: currentMouse.x, y: currentMouse.y })
            // drawing a line from the previous point to the current point
            draw();
        }
    }, false);

    canvas.addEventListener("mouseup", (e) => {
        drawing = false;
        // Adding the path to the array or the paths
        draws.push(points);
        hasDraw = true;
    }, false);
};

// Función para obtener la posición del mouse
const getMousePosition = (canvas, evt) => {
    var ClientRect = canvas.getBoundingClientRect();
        return { //objeto
            x: Math.round(evt.clientX - ClientRect.left),
            y: Math.round(evt.clientY - ClientRect.top)
    }
};

// Función para dibujar
const draw = () => {
    ctx.beginPath();
    ctx.moveTo(previousMouse.x, previousMouse.y);
    ctx.lineTo(currentMouse.x, currentMouse.y);
    ctx.closePath();
    ctx.stroke();
};

// Función para guardar un dibujo
const save = () => {
    if (hasDraw) {
        const dataURL = canvas.toDataURL();
        const template = layerTemplate();
        document.getElementById('layer-container').appendChild(template);
        document.getElementById(`layer-img-${draws.length}`).src = dataURL;
        hasDraw = false;
    }
};

// Función para generar un template de dibujo
const layerTemplate = () => {
    let template = document.createElement("div");
    template.id = `layer-${draws.length}`;
    template.classList.add('layer');
    template.innerHTML = `<img id="layer-img-${draws.length}">`;
    return template;
};

// Función para revertir un dibujo
const undo = () => {
    if (draws.length > 0) {
        let lastLayer = document.getElementById(`layer-${draws.length}`);
        lastLayer.parentNode.removeChild(lastLayer);
        // remove the last path from the paths array
        draws.splice(-1, 1);
        // draw all the paths in the paths array
        reDraw();
    }
};

// Función para re hacer todos los dibujos
const reDraw = () => {
    // delete everything
    clear();
    // draw all the paths in the paths array
    draws.forEach(path => {
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);  
        for(let i = 1; i < path.length; i++) {
            ctx.lineTo(path[i].x, path[i].y); 
        }
        ctx.stroke();
    });
};

// Función para limpiar el canvas
const clear = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};

// Función para borrar todo
const clearAll = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draws = [];
    document.getElementById('layer-container').innerHTML = '';
};

export { init, save, undo, clearAll };