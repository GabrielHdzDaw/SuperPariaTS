export function setupParallaxMouse(targetId: string) {
    const gameBoard = document.getElementById(targetId);
    if (!gameBoard) throw new Error(`#${targetId} no encontrado`);

    const mouse = { x: 0, y: 0 };
    const smoothMouse = { x: 0, y: 0 };

    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = window.innerHeight - e.clientY;
    });

    function updateParallax() {
        smoothMouse.x += (mouse.x - smoothMouse.x) * 0.05;
        smoothMouse.y += (mouse.y - smoothMouse.y) * 0.05;

        const xOffset = ((smoothMouse.x / window.innerWidth) - 0.5) * -10;
        const yOffset = ((smoothMouse.y / window.innerHeight) - 0.5) * 5;
        if (gameBoard) {
            gameBoard.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        }
        requestAnimationFrame(updateParallax);
    }

    updateParallax();
}