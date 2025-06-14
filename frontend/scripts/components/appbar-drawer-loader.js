async function loadComponent(componentPath, placeholderId) {
  try {
    const response = await fetch(componentPath);
    const parser = new DOMParser();
    const doc = parser.parseFromString(await response.text(), "text/html");
    const template = doc.querySelector("template");

    if (template) {
      document
        .getElementById(placeholderId)
        .appendChild(template.content.cloneNode(true));

      // Set username after app bar loads
      if (placeholderId === "app-bar-placeholder") {
        const userNameElement = document.getElementById("esm");
        const userData = JSON.parse(localStorage.getItem("userData"));
        if (userData && userData.name && userNameElement) {
          userNameElement.innerHTML = userData.name.split(" ")[0];
        } else if (userNameElement) {
          userNameElement.innerText = "Guest";
        }

        singoutButton = document.getElementById("signout-button");
        singoutButton.addEventListener("click", function () {
          // Clear user data from localStorage
          localStorage.removeItem("userData");
          localStorage.removeItem("userToken");
          // Redirect to the sign-in page
          window.location.href = "../auth/signin.html";
        });
      }

      // After component is loaded, initialize language functionality
      if (window.languageManager) {
        // Initialize language buttons
        if (placeholderId === "app-bar-placeholder") {
          window.languageManager.initDropdownLanguageSwitch();
        } else if (placeholderId === "drawer-placeholder") {
          window.languageManager.initDrawerLanguageSwitch();
        }

        // Apply translations to the newly loaded component
        const currentLang = localStorage.getItem("language") || "en";
        window.languageManager.updateComponentTranslations(
          currentLang,
          placeholderId
        );
      }
    }
  } catch (error) {
    console.error(`Error loading ${componentPath}:`, error);
  }
}

// Load components when page loads
window.addEventListener("DOMContentLoaded", () => {
  loadComponent("../appbar/appbar.html", "app-bar-placeholder");
  loadComponent("../drawer/drawer.html", "drawer-placeholder");
});