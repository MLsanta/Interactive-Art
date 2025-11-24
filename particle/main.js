const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
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
        ctx.fillStyle = `hsla(${this.color}, 100%, 50%, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Rocket {
    constructor(targetX, targetY) {
        this.x = canvas.width / 2; // 바닥 중앙에서 발사
        this.y = canvas.height;
        this.targetX = targetX;
        this.targetY = targetY;
        this.speedX = (targetX - this.x) / 60; // 60 프레임 내 도달
        this.speedY = (targetY - this.y) / 60;
        this.color = Math.random() * 360;
        this.exploded = false;
    }

    update() {
        if (!this.exploded) {
            this.x += this.speedX;
            this.y += this.speedY;
            if (Math.abs(this.y - this.targetY) < 2) {
                // 목표 도달
                this.explode();
            }
        }
    }

    explode() {
        this.exploded = true;
        const count = 50 + Math.random() * 30;
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4 + 2;
            particles.push(
                new Particle(
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
            ctx.fillStyle = `hsl(${this.color},100%,50%)`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

let rockets = [];
let particles = [];

canvas.addEventListener("click", (e) => {
    rockets.push(new Rocket(e.clientX, e.clientY));
});

function animate() {
    ctx.fillStyle = "rgba(17,17,17,0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 로켓 업데이트
    for (let i = 0; i < rockets.length; i++) {
        rockets[i].update();
        rockets[i].draw();
        if (rockets[i].exploded) {
            rockets.splice(i, 1);
            i--;
        }
    }

    // 폭발 파티클 업데이트
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].size < 0.5 || particles[i].alpha <= 0) {
            particles.splice(i, 1);
            i--;
        }
    }

    requestAnimationFrame(animate);
}

animate();
