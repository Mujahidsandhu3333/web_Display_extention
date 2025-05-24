const settings = ['brightness', 'contrast', 'grayscale', 'sepia', 'invert'];

chrome.storage.local.get(settings, values => {
  const filters = settings.map(s => `${s}(${values[s] || defaultValue(s)}${s === 'brightness' || s === 'contrast' ? '%' : '%'})`).join(' ');
  document.documentElement.style.filter = filters;
});

function defaultValue(setting) {
  return (setting === 'brightness' || setting === 'contrast') ? 100 : 0;
}