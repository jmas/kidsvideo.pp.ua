const applyFilterForm = () => {
  const form = document.getElementById("filter-form");
  const filter = document.getElementById("videos-channels-filtered-data");
  const elements = Array.from(form.elements);
  const conditionItems = [];
  elements.forEach((element) => {
    if (element.type === "checkbox" && element.checked) {
      conditionItems.push([element.name, element.value]);
    }
  });
  filter.setAttribute(
    "filter",
    conditionItems
      .map(([name, value]) => `item.${name} == '${value}'`)
      .join(" || ")
  );
};

const addFilterFormListener = () => {
  const form = document.getElementById("filter-form");
  form.addEventListener(
    "change",
    () => {
      applyFilterForm();
    },
    true
  );
};

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
  addFilterFormListener();
  applyFilterForm();
};

main();
