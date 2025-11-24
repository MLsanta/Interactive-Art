const sections = document.querySelectorAll("section");
let currentSection = 0;
let isScrolling = false;

function scrollToSection(index) {
    if (index < 0 || index >= sections.length) return;
    isScrolling = true;
    sections[index].scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
        isScrolling = false;
        currentSection = index;
    }, 700); // 스크롤 완료 후 플래그 초기화
}

// 마우스 휠 이벤트
window.addEventListener("wheel", (e) => {
    if (isScrolling) return;
    if (e.deltaY > 0) scrollToSection(currentSection + 1);
    else if (e.deltaY < 0) scrollToSection(currentSection - 1);
});

// 모바일 터치 이벤트
let touchStartY = 0;
window.addEventListener("touchstart", (e) => {
    touchStartY = e.touches[0].clientY;
});
window.addEventListener("touchend", (e) => {
    let touchEndY = e.changedTouches[0].clientY;
    if (isScrolling) return;
    if (touchStartY - touchEndY > 50) scrollToSection(currentSection + 1);
    else if (touchEndY - touchStartY > 50) scrollToSection(currentSection - 1);
});
