// Minimal interactivity for System 5 (QR)
(function () {
  const input = document.getElementById('qr-input');
  const saveBtn = document.getElementById('qr-save-btn');
  const list = document.getElementById('qr-list');
  const content = document.getElementById('qr-content');
  const preview = document.getElementById('qr-image-preview');

  if (!input || !saveBtn || !list || !content) return;

  const state = {
    items: [
      { id: uid(), text: 'https://example.com/demo-qr-1' },
      { id: uid(), text: 'WRS-STM-QR:ABC123' },
    ],
    selectedId: null,
  };

  function uid() {
    return 'id-' + Math.random().toString(36).slice(2, 9);
  }

  function render() {
    list.innerHTML = '';
    state.items.forEach((item) => {
      const li = document.createElement('li');
      const label = document.createElement('span');
      label.textContent = item.text;
      label.style.cursor = 'pointer';
      label.title = 'クリックで右上に表示';
      label.onclick = () => select(item.id);

      const del = document.createElement('button');
      del.textContent = '削除';
      del.onclick = () => remove(item.id);

      li.appendChild(label);
      li.appendChild(del);
      if (item.id === state.selectedId) li.style.borderColor = '#5dafff';
      list.appendChild(li);
    });

    const selected = state.items.find(i => i.id === state.selectedId);
    content.textContent = selected ? selected.text : '未選択';
    // プレビュー画像は任意（要素が存在する場合のみ）
    if (preview) {
      preview.src = 'images2/QRn.png';
    }
  }

  function select(id) {
    state.selectedId = id;
    render();
  }

  function remove(id) {
    const idx = state.items.findIndex(i => i.id === id);
    if (idx !== -1) state.items.splice(idx, 1);
    if (state.selectedId === id) state.selectedId = null;
    render();
  }

  saveBtn.addEventListener('click', () => {
    const text = (input.value || '').trim();
    if (!text) return;
    const item = { id: uid(), text };
    state.items.unshift(item);
    state.selectedId = item.id;
    input.value = '';
    render();
  });

  render();
})();

// Lightbox for gallery images
(function () {
  const overlayId = 'lightbox-overlay';
  function ensureOverlay() {
    let overlay = document.getElementById(overlayId);
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = overlayId;
      overlay.className = 'lightbox-overlay';
      overlay.innerHTML = '<div class="lightbox-content"><button class="lightbox-close" type="button">閉じる</button><img class="lightbox-img" alt="preview"></div>';
      document.body.appendChild(overlay);
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) hide();
      });
      overlay.querySelector('.lightbox-close').addEventListener('click', hide);
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') hide();
      });
    }
    return overlay;
  }

  function show(src, alt) {
    const overlay = ensureOverlay();
    const img = overlay.querySelector('.lightbox-img');
    img.src = src;
    img.alt = alt || '';
    overlay.classList.add('active');
  }

  function hide() {
    const overlay = document.getElementById(overlayId);
    if (overlay) overlay.classList.remove('active');
  }

  function bind() {
    const images = document.querySelectorAll('.gallery img');
    images.forEach((img) => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => show(img.src, img.alt));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();

// Portfolio tabs (Software/Hardware)
(function () {
  const tabs = document.getElementById('portfolio-tabs');
  if (!tabs) return;
  const buttons = tabs.querySelectorAll('button[data-target]');
  const sections = document.querySelectorAll('.portfolio-section');

  function activate(targetSelector) {
    sections.forEach((sec) => {
      if (targetSelector === '#software') {
        // Show all software sections (multiple)
        if (sec.id === 'hardware') {
          sec.classList.remove('active');
        } else {
          sec.classList.add('active');
        }
      } else if (targetSelector === '#hardware') {
        if (sec.id === 'hardware') {
          sec.classList.add('active');
        } else {
          sec.classList.remove('active');
        }
      }
    });
    buttons.forEach((b) => b.classList.toggle('active', b.getAttribute('data-target') === targetSelector));
    // Sync header tabs as well
    document.querySelectorAll('#header-tabs button[data-target]').forEach((b) => {
      b.classList.toggle('active', b.getAttribute('data-target') === targetSelector);
    });
    // Toggle header nav groups
    document.querySelectorAll('.nav-group').forEach((ng) => {
      const scope = ng.getAttribute('data-scope');
      const shouldShow = (targetSelector === '#software' && scope === 'software') || (targetSelector === '#hardware' && scope === 'hardware');
      ng.classList.toggle('active', shouldShow);
    });
    try { localStorage.setItem('portfolioTab', targetSelector); } catch (_) {}
    if (history && history.replaceState) {
      history.replaceState(null, '', targetSelector);
    }
  }

  function bindButtons(root) {
    root.querySelectorAll('button[data-target]').forEach((btn) => {
      btn.addEventListener('click', () => activate(btn.getAttribute('data-target')));
    });
  }
  bindButtons(document);

  const saved = (function(){ try { return localStorage.getItem('portfolioTab'); } catch (_) { return null; }})();
  const hash = location.hash === '#hardware' ? '#hardware' : '#software';
  activate(saved || hash || '#software');
})();


