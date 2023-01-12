import { ipcRenderer } from "electron";

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector: string, text: string) => {
    const element = document.getElementById(selector);
    if (element) {
      element.innerText = text;
    }
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type as keyof NodeJS.ProcessVersions]);
  }

  config_external_link('bugsplat_url');
  config_external_link('bugsplat_logo_url');
  config_external_link('electron_url');
});

const config_external_link = (id: string) => {
  const link = document.getElementById(id) as HTMLAnchorElement;

  link.addEventListener("click", function (event) {
    ipcRenderer.send('open-external-url-event', link.href);;
    event.preventDefault();
  });
}