const getCheckedValues = (form, name) => {
  return Array.from(form.elements).reduce((values, element) => {
    if (element.name === name && element.checked) {
      values.push(element.value);
    }
    return values;
  }, []);
};

const applyFilter = () => {
  const topicsForm = document.getElementById("topics-filter-form");
  const channelsForm = document.getElementById("channels-filter-form");
  const videosFilter = document.getElementById("videos-channels-filtered-data");
  const channelsFilter = document.getElementById("channels-filtered-data");
  const topics = getCheckedValues(topicsForm, "topics[]");
  const channels = getCheckedValues(channelsForm, "channels[]");
  const topicsFilterValue = `${topics
    .map((value) => `item.${value} == '1'`)
    .join(" || ")}`;
  const channelsFilterValue = `[${channels
    .map((channelId) => `'${channelId}'`)
    .join(",")}].some(channelId => channelId === item.channelId)`;
  videosFilter.setAttribute(
    "filter",
    `(${topicsFilterValue}) && ${channelsFilterValue}`
  );
  channelsFilter.setAttribute("filter", topicsFilterValue);
};

const addTopicsFilterListener = () => {
  const form = document.getElementById("topics-filter-form");
  form.addEventListener(
    "change",
    () => {
      applyFilter();
    },
    true
  );
};

const addChannelsFilterListener = () => {
  const form = document.getElementById("channels-filter-form");
  form.addEventListener(
    "change",
    () => {
      applyFilter();
    },
    true
  );
};

const addFilterApplier = () => {
  document.getElementById("channels-data").addEventListener("change", () => {
    setImmediate(() => {
      applyFilter();
    });
  });
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
  addTopicsFilterListener();
  addChannelsFilterListener();
  addFilterApplier();
  // applyFilter();
};

main();
