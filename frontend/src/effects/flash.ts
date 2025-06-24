export function flashScreen(): void {
    const flashDiv = document.querySelector(".flash") as HTMLElement | null;
    
    if (flashDiv) {
        flashDiv.style.display = "block";
        setTimeout(() => {
            flashDiv.style.display = "none";
        }, 50);
    }
}