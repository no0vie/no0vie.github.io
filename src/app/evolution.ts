export function enhanceEvolution() {
  const root = document.querySelector<HTMLElement>('[data-evolution-map]');
  if (!root) return;
  const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
  const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-stage-panel]'));
  const pager = root.querySelector<HTMLElement>('[data-evolution-pager]');
  const previous = root.querySelector<HTMLButtonElement>('[data-evolution-previous]');
  const next = root.querySelector<HTMLButtonElement>('[data-evolution-next]');
  const live = root.querySelector<HTMLElement>('[data-evolution-live]');
  const localeLink = document.querySelector<HTMLAnchorElement>('a[hreflang]');
  if (tabs.length === 0 || panels.length !== tabs.length || !pager || !previous || !next) return;

  root.classList.add('is-enhanced');
  pager.hidden = false;
  let selectedIndex = Math.max(
    0,
    tabs.findIndex((tab) => `#${tab.dataset.stageId}` === window.location.hash),
  );

  function select(
    index: number,
    options: { focus?: boolean; announce?: boolean; updateUrl?: boolean } = {},
  ) {
    selectedIndex = (index + tabs.length) % tabs.length;
    tabs.forEach((tab, tabIndex) => {
      const selected = tabIndex === selectedIndex;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && options.focus) tab.focus();
    });
    panels.forEach((panel, panelIndex) => {
      panel.hidden = panelIndex !== selectedIndex;
    });
    const selectedTab = tabs[selectedIndex];
    const stageId = selectedTab?.dataset.stageId;
    if (stageId && options.updateUrl !== false) history.replaceState(null, '', `#${stageId}`);
    if (stageId && localeLink) {
      const localeUrl = new URL(localeLink.href);
      localeUrl.hash = stageId;
      localeLink.href = localeUrl.toString();
    }
    if (options.announce && live && selectedTab) live.textContent = selectedTab.innerText.trim();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(index, { announce: true }));
    tab.addEventListener('keydown', (event) => {
      const target =
        event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? tabs.length - 1
            : event.key === 'ArrowRight' || event.key === 'ArrowDown'
              ? index + 1
              : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
                ? index - 1
                : undefined;
      if (target === undefined) return;
      event.preventDefault();
      select(target, { focus: true, announce: true });
    });
  });
  previous.addEventListener('click', () =>
    select(selectedIndex - 1, { focus: true, announce: true }),
  );
  next.addEventListener('click', () => select(selectedIndex + 1, { focus: true, announce: true }));
  select(selectedIndex, { updateUrl: false });
}
