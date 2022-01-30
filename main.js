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

  const topicsFilterValue =
    topics.length > 0
      ? `(${topics.map((value) => `item.${value} == '1'`).join(" || ")})`
      : "false";

  channelsFilter.setAttribute("filter", topicsFilterValue);

  setTimeout(() => {
    const channels = getCheckedValues(channelsForm, "channels[]");
    const channelsFilterValue = `[${channels
      .map((channelId) => `'${channelId}'`)
      .join(",")}].some(channelId => channelId === item.channelId)`;

    videosFilter.setAttribute(
      "filter",
      [topicsFilterValue, channelsFilterValue].filter(Boolean).join(" && ")
    );
  }, 100);

  const paginator = document.getElementById(
    "videos-channels-filtered-shuffled-paginated-data"
  );
  paginator.setAttribute("limit", 24);
};

const addTopicsFilterListener = () => {
  let timer = null;
  const form = document.getElementById("topics-filter-form");
  form.addEventListener(
    "change",
    () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        applyFilter();
      }, 1000);
    },
    true
  );
};

const addChannelsFilterListener = () => {
  const form = document.getElementById("channels-filter-form");
  let timer = null;
  form.addEventListener(
    "change",
    () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        applyFilter();
      }, 1000);
    },
    true
  );
};

const addFilterApplier = () => {
  document.getElementById("channels-data").addEventListener("change", () => {
    setTimeout(() => {
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

const addScrollFooterListener = () => {
  const footer = document.querySelector("footer");
  const paginator = document.getElementById(
    "videos-channels-filtered-shuffled-paginated-data"
  );
  const onIntersection = ([{ isIntersecting }]) => {
    if (isIntersecting) {
      const limit = Number(paginator.getAttribute("limit"));
      paginator.setAttribute("limit", limit + limit);
    }
  };
  const observer = new IntersectionObserver(onIntersection, { threshold: 1 });
  observer.observe(footer);
};

const addNextButtonListener = () => {
  const nextButton = document.getElementById("next");
  const paginator = document.getElementById(
    "videos-channels-filtered-shuffled-paginated-data"
  );
  const initialLimit = Number(paginator.getAttribute("limit"));
  nextButton.addEventListener(
    "click",
    () => {
      const limit = Number(paginator.getAttribute("limit"));
      paginator.setAttribute("limit", limit + initialLimit);
      setTimeout(() => {
        document
          .getElementById("videos-list")
          .querySelector(`yt-video:nth-child(${limit})`)
          .scrollIntoView({ block: "start", behavior: "auto" });
      }, 200);
    },
    true
  );
};

const main = () => {
  addVideoClickListener();
  addTopicsFilterListener();
  addChannelsFilterListener();
  addNextButtonListener();
};

main();
