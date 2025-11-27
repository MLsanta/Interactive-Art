const canvasW = document.getElementById("waterCanvas");
const ctxW = canvasW.getContext("2d");
canvasW.width = canvasW.clientWidth;
canvasW.height = canvasW.clientHeight;
const waterHeight = canvasW.height / 2;

// ⭐️ 최적화: 포인트 수 150 -> 70으로 대폭 감소
const pointCount = 70;
const spread = 0.2;
const tension = 0.025;
const damping = 0.025;
const propagationIterations = 3; // ⭐️ 최적화: 파동 전파 반복 횟수 5 -> 3으로 감소

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
    // 캔버스 내에서의 상대 좌표를 사용하도록 수정 (옵션)
    const rect = canvasW.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});

function animateW() {
    // ⭐️ 최적화: 배경 채우기 투명하게 (clear only) 또는 제거
    ctxW.clearRect(0, 0, canvasW.width, canvasW.height);
    // ctxW.fillStyle = "rgba(0,0,0,0.2"; // 배경색이 필요하다면 사용
    // ctxW.fillRect(0, 0, canvasW.width, canvasW.height);

    // 1. 탄성 및 감쇠 적용 (중력 복원력)
    for (let i = 0; i < pointsW.length; i++) {
        const dy = waterHeight - pointsW[i].y;
        pointsW[i].vy += tension * dy - pointsW[i].vy * damping;
        pointsW[i].y += pointsW[i].vy;
    }

    // 2. 파동 전파 (Water Propagation)
    let leftDeltas = new Array(pointsW.length).fill(0);
    let rightDeltas = new Array(pointsW.length).fill(0);

    // ⭐️ 최적화: 반복 횟수 감소
    for (let j = 0; j < propagationIterations; j++) {
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

    // 3. 마우스 상호작용
    for (let i = 0; i < pointsW.length; i++) {
        // x 좌표는 canvas 기준으로 계산해야 하므로, mouse.x는 캔버스 내 좌표여야 합니다.
        const dx = Math.abs(pointsW[i].x - mouse.x);
        if (dx < 50) pointsW[i].vy += (mouse.y - pointsW[i].y) * 0.02;
    }

    // 4. 드로잉
    ctxW.fillStyle = "#87ceeb";
    ctxW.beginPath();
    ctxW.moveTo(0, canvasW.height);

    // 곡선(Bezier) 드로잉으로 변경하여 시각적 품질 향상 (선택 사항)
    ctxW.lineTo(pointsW[0].x, pointsW[0].y);
    for (let i = 0; i < pointsW.length - 1; i++) {
        const x_mid = (pointsW[i].x + pointsW[i + 1].x) / 2;
        const y_mid = (pointsW[i].y + pointsW[i + 1].y) / 2;
        const cp_x = (x_mid + pointsW[i].x) / 2;
        const cp_y = pointsW[i].y;
        // 2차 베지어 곡선으로 더 부드럽게 연결
        ctxW.quadraticCurveTo(pointsW[i].x, pointsW[i].y, x_mid, y_mid);
    }
    // 마지막 포인트까지 연결
    ctxW.lineTo(pointsW[pointsW.length - 1].x, pointsW[pointsW.length - 1].y);

    ctxW.lineTo(canvasW.width, canvasW.height);
    ctxW.closePath();
    ctxW.fill();

    requestAnimationFrame(animateW);
}
animateW();
