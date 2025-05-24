const settings = ['brightness', 'contrast', 'grayscale', 'sepia', 'invert'];

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();

  settings.forEach(setting => {
    const input = document.getElementById(setting);
    const label = document.getElementById(`${setting}-value`);
    input.addEventListener('input', () => {
      chrome.storage.local.set({ [setting]: input.value });
      label.textContent = input.value + '%';
      applySettings();
    });
  });

  document.getElementById('reset-button').addEventListener('click', () => {
    settings.forEach(setting => {
      const defaultVal = defaultValue(setting);
      document.getElementById(setting).value = defaultVal;
      document.getElementById(`${setting}-value`).textContent = defaultVal + '%';
      chrome.storage.local.set({ [setting]: defaultVal });
    });
    chrome.storage.local.set({ enabled: true });
    document.getElementById('toggle-extension').checked = true;
    applySettings();
  });

  document.getElementById('toggle-extension').addEventListener('change', (e) => {
    chrome.storage.local.set({ enabled: e.target.checked });
    applySettings();
  });
});

function loadSettings() {
  chrome.storage.local.get([...settings, 'enabled'], result => {
    settings.forEach(setting => {
      const val = result[setting] ?? defaultValue(setting);
      document.getElementById(setting).value = val;
      document.getElementById(`${setting}-value`).textContent = val + '%';
    });
    const toggle = document.getElementById('toggle-extension');
    toggle.checked = result.enabled ?? true;
    applySettings();
  });
}

function applySettings() {
  chrome.storage.local.get([...settings, 'enabled'], result => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (tabs[0]?.id) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: (values) => {
            if (!values.enabled) {
              document.documentElement.style.filter = '';
              return;
            }
            const filters = ['brightness', 'contrast', 'grayscale', 'sepia', 'invert']
              .map(s => {
                const val = values[s] ?? ((s === 'brightness' || s === 'contrast') ? 100 : 0);
                return `${s}(${val}%)`;
              }).join(' ');
            document.documentElement.style.filter = filters;
          },
          args: [result]
        });
      }
    });
  });
}

function defaultValue(setting) {
  return (setting === 'brightness' || setting === 'contrast') ? 100 : 0;
}
