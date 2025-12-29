// This script runs in the background and waits for the user to click the extension's icon.

// Function to be injected into the active tab.
function scrapeAndCopyLinks() {
  // Find all anchor tags whose href contains "/in/", typical for LinkedIn profiles.
  const profileLinks = document.querySelectorAll('a[href*="/in/"]');

  // Use a Set to store unique, clean URLs.
  // 1. Spread the NodeList into an array [...profileLinks]
  // 2. Map each link to its href and remove query parameters (e.g., "?miniProfileUrn=...")
  // 3. The Set automatically handles deduplication.
  const uniqueUrls = new Set([...profileLinks].map(link => link.href.split('?')[0]));

  // Convert the Set back to an array and join with newlines.
  const textToCopy = [...uniqueUrls].join('\n');

  if (textToCopy) {
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        // Log success message in the page's console for developer feedback.
        console.log(`[Coletor de Links] Sucesso! ${uniqueUrls.size} links exclusivos foram copiados.`);
        // Note: You could expand this to show a visible notification to the user.
      })
      .catch(err => {
        console.error('[Coletor de Links] Falha ao copiar links: ', err);
      });
  } else {
    console.log('[Coletor de Links] Nenhum link de perfil do LinkedIn encontrado na página.');
  }
}

// Add a listener for when the user clicks the extension's action button (the icon in the toolbar).
chrome.action.onClicked.addListener((tab) => {
  // Ensure the tab has a URL before trying to execute a script.
  // This prevents errors on special pages like chrome://extensions.
  if (tab.url && (tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id }, // The target is the currently active tab.
      function: scrapeAndCopyLinks // The function to inject and execute.
    });
  } else {
    console.log('Este script não pode ser executado em páginas especiais do Chrome.');
  }
});
