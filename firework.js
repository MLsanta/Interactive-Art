const canvasF = document.getElementById("fireworkCanvas");
const ctxF = canvasF.getContext("2d");
canvasF.width = canvasF.clientWidth;
canvasF.height = canvasF.clientHeight;

class ParticleF {
    constructor(x, y, speedX, speedY, color, size = 3, gravity = 0.05) {
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.color = color;
        this.size = size;
        this.gravity = gravity;
        this.alpha = 1;
    }
    update() {
        this.speedY += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedX *= 0.98;
        this.speedY *= 0.98;
        this.size *= 0.97;
        this.alpha -= 0.015;
    }
    draw() {
        ctxF.fillStyle = `hsla(${this.color},100%,50%,${this.alpha})`;
        ctxF.beginPath();
        ctxF.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctxF.fill();
    }
}

class RocketF {
    constructor(targetX, targetY) {
        this.x = canvasF.width / 2;
        this.y = canvasF.height;
        this.targetX = targetX;
        this.targetY = targetY;
        this.speedX = (targetX - this.x) / 60;
        this.speedY = (targetY - this.y) / 60;
        this.color = Math.random() * 360;
        this.exploded = false;
    }
    update() {
        if (!this.exploded) {
            this.x += this.speedX;
            this.y += this.speedY;
            if (Math.abs(this.y - this.targetY) < 2) this.explode();
        }
    }
    explode() {
        this.exploded = true;
        const count = 50 + Math.random() * 30;
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4 + 2;
            particlesF.push(
                new ParticleF(
                    this.x,
                    this.y,
                    Math.cos(angle) * speed,
                    Math.sin(angle) * speed,
                    this.color,
                    Math.random() * 3 + 2,
                    0.05
                )
            );
        }
    }
    draw() {
        if (!this.exploded) {
            ctxF.fillStyle = `hsl(${this.color},100%,50%)`;
            ctxF.beginPath();
            ctxF.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctxF.fill();
        }
    }
}

let rocketsF = [];
let particlesF = [];
canvasF.addEventListener("click", (e) =>
    rocketsF.push(new RocketF(e.clientX, e.clientY))
);

function animateF() {
    ctxF.fillStyle = "rgba(17,17,17,0.2)";
    ctxF.fillRect(0, 0, canvasF.width, canvasF.height);
    for (let i = 0; i < rocketsF.length; i++) {
        rocketsF[i].update();
        rocketsF[i].draw();
        if (rocketsF[i].exploded) {
            rocketsF.splice(i, 1);
            i--;
        }
    }
    for (let i = 0; i < particlesF.length; i++) {
        particlesF[i].update();
        particlesF[i].draw();
        if (particlesF[i].size < 0.5 || particlesF[i].alpha <= 0) {
            particlesF.splice(i, 1);
            i--;
        }
    }
    requestAnimationFrame(animateF);
}
animateF();
