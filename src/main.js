let content, dropZone, filename;

function showContent(html, name) {
  content.innerHTML = html;
  content.style.display = 'block';
  dropZone.style.display = 'none';
  filename.textContent = name || 'untitled.md';
}

function showEmpty() {
  content.style.display = 'none';
  dropZone.style.display = 'flex';
  filename.textContent = '';
}

function showError(msg) {
  content.innerHTML = `<div style="color:#e74c3c;padding:2em;text-align:center;">${msg}</div>`;
  content.style.display = 'block';
  dropZone.style.display = 'none';
}

async function loadFile(file) {
  if (!file.name.match(/\.(md|markdown)$/i)) {
    showError('Please select a .md or .markdown file');
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      showContent(marked.parse(e.target.result, { breaks: true, gfm: true }), file.name);
    } catch {
      showError('Failed to parse markdown');
    }
  };
  reader.onerror = () => showError('Failed to read file');
  reader.readAsText(file);
}

async function loadFilePath(path) {
  const name = path.split(/[/\\]/).pop();
  try {
    const text = await window.__TAURI__.core.invoke('read_md_file', { path });
    showContent(marked.parse(text, { breaks: true, gfm: true }), name);
  } catch (err) {
    showError(String(err));
  }
}

function init() {
  content = document.getElementById('content');
  dropZone = document.getElementById('drop-zone');
  filename = document.getElementById('filename');
  const openBtn = document.getElementById('open-btn');
  const app = document.getElementById('app');

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.md,.markdown,text/markdown';
  fileInput.style.display = 'none';
  document.body.appendChild(fileInput);

  openBtn.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      loadFile(e.target.files[0]);
    }
    fileInput.value = '';
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
      e.preventDefault();
      fileInput.click();
    }
  });

  const { event } = window.__TAURI__;

  event.listen('tauri://drag-enter', () => {
    app.classList.add('drag-over');
  });

  event.listen('tauri://drag-over', () => {
    app.classList.add('drag-over');
  });

  event.listen('tauri://drag-leave', () => {
    app.classList.remove('drag-over');
  });

  event.listen('tauri://drag-drop', (e) => {
    app.classList.remove('drag-over');
    const paths = e.payload.paths || [];
    if (paths.length > 0) {
      loadFilePath(paths[0]);
    }
  });

  event.listen('open-file', (e) => {
    const path = e.payload;
    if (path) loadFilePath(path);
  });

  window.__TAURI__.core.invoke('get_pending_file').then((path) => {
    if (path) loadFilePath(path);
  });
}

if (typeof marked !== 'undefined') {
  init();
} else {
  const check = () => {
    if (typeof marked !== 'undefined') {
      init();
    } else {
      setTimeout(check, 50);
    }
  };
  check();
}
