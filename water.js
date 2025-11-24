const canvasW = document.getElementById("waterCanvas");
const ctxW = canvasW.getContext("2d");
canvasW.width = canvasW.clientWidth;
canvasW.height = canvasW.clientHeight;
const waterHeight = canvasW.height / 2;
const pointCount = 150;
const spread = 0.2;
const tension = 0.025;
const damping = 0.025;

let pointsW = [];
for (let i = 0; i < pointCount; i++) {
    pointsW.push({
        x: i * (canvasW.width / (pointCount - 1)),
        y: waterHeight,
        vy: 0,
    });
}

let mouse = { x: -1000, y: -1000 };
canvasW.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

function animateW() {
    ctxW.fillStyle = "rgba(0,0,0,1";
    ctxW.fillRect(0, 0, canvasW.width, canvasW.height);

    for (let i = 0; i < pointsW.length; i++) {
        const dy = waterHeight - pointsW[i].y;
        pointsW[i].vy += tension * dy - pointsW[i].vy * damping;
        pointsW[i].y += pointsW[i].vy;
    }

    let leftDeltas = new Array(pointsW.length).fill(0);
    let rightDeltas = new Array(pointsW.length).fill(0);
    for (let j = 0; j < 5; j++) {
        for (let i = 0; i < pointsW.length; i++) {
            if (i > 0) {
                leftDeltas[i] = spread * (pointsW[i].y - pointsW[i - 1].y);
                pointsW[i - 1].vy += leftDeltas[i];
            }
            if (i < pointsW.length - 1) {
                rightDeltas[i] = spread * (pointsW[i].y - pointsW[i + 1].y);
                pointsW[i + 1].vy += rightDeltas[i];
            }
        }
    }

    for (let i = 0; i < pointsW.length; i++) {
        const dx = Math.abs(pointsW[i].x - mouse.x);
        if (dx < 50) pointsW[i].vy += (mouse.y - pointsW[i].y) * 0.02;
    }

    ctxW.fillStyle = "#ffd1dc";
    ctxW.beginPath();
    ctxW.moveTo(0, canvasW.height);
    ctxW.lineTo(pointsW[0].x, pointsW[0].y);
    for (let i = 1; i < pointsW.length; i++)
        ctxW.lineTo(pointsW[i].x, pointsW[i].y);
    ctxW.lineTo(canvasW.width, canvasW.height);
    ctxW.closePath();
    ctxW.fill();

    requestAnimationFrame(animateW);
}
animateW();
