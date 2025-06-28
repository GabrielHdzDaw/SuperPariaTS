const html = document.documentElement;

type TransitionType = 'open' | 'close';

function playTransition(type: TransitionType): Promise<void> {
  return new Promise((resolve) => {
    html.classList.remove('open-circle', 'close-circle');
    void html.offsetWidth; // fuerza reflow

    const handleAnimationEnd = () => {
      html.removeEventListener('animationend', handleAnimationEnd);
      resolve();
    };

    html.addEventListener('animationend', handleAnimationEnd);
    html.classList.add(`${type}-circle`);
  });
}

export async function circleTransition(action?: () => void | Promise<void>): Promise<void> {
  try {
    await playTransition('close');
    if (action) await Promise.resolve(action());
    await playTransition('open');
  } catch (err) {
    console.error('Error en la transición circular:', err);
    throw err;
  }
}
