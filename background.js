chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ brightness: 100, contrast: 100, grayscale: 0, sepia: 0, invert: 0 });
});