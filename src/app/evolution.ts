export function enhanceEvolution() {
  const controls = document.querySelector<HTMLElement>('[data-evolution-controls]');
  if (!controls) return;
  const buttons = Array.from(controls.querySelectorAll('button'));
  controls.hidden = false;
  buttons.forEach((button, index) => {
    button.onclick = () => {
      const target = document.getElementById(button.getAttribute('aria-controls') ?? '');
      target?.focus();
    };
    button.onkeydown = (event) => {
      const next =
        event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? buttons.length - 1
            : event.key === 'ArrowRight' || event.key === 'ArrowDown'
              ? (index + 1) % buttons.length
              : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
                ? (index + buttons.length - 1) % buttons.length
                : undefined;
      if (next !== undefined) {
        event.preventDefault();
        buttons[next]?.focus();
      }
    };
  });
}
