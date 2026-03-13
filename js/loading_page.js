function InitPageSettings() {
    window.addEventListener("DOMContentLoaded", () => {
      const pageBody = document.body;
    
      if (pageBody) {
        pageBody.classList.remove("is-loading");
      }
    });
}

InitPageSettings();