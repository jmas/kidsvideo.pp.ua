const addVideoClickListener = () => {
  // Check that browser supports dialog element
  if (!(typeof HTMLDialogElement === "function")) {
    return;
  }
  document.body.addEventListener("click", (event) => {
    const target = event.target.closest("a");
    if (target && target.href.startsWith("https://www.youtube.com/watch?v=")) {
      event.preventDefault();
      const dialog = document.getElementById("video-dialog");
      const [, videoId] = target.href.match(
        /^https:\/\/www\.youtube\.com\/watch\?v=(.+?)$/
      );
      dialog.innerHTML = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      dialog.open = true;
    } else if (!event.target.closest("dialog")) {
      const dialog = document.getElementById("video-dialog");
      dialog.textContent = "";
      dialog.open = false;
    }
  });
};

const main = () => {
  addVideoClickListener();
};

main();
