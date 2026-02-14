function InitPageSettings() {
  const pageBody = document.body;
  
  window.addEventListener("load", () => {
    pageBody.classList.remove("is-loading");
  });
}