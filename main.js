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
  const view = document.getElementById("view");
  document.body.addEventListener("click", (event) => {
    const target = event.target.closest("a");
    if (event.target.id === "next") {
      event.preventDefault();
    } else if (
      target &&
      target.href.startsWith("https://www.youtube.com/watch?v=")
    ) {
      event.preventDefault();
      const [, videoId] = target.href.match(
        /^https:\/\/www\.youtube\.com\/watch\?v=(.+?)$/
      );
      view.innerHTML = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      document.body.classList.add("viewing");
    } else if (event.target.id === "exit") {
      const getRandom = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
      };
      const a = getRandom(10, 30);
      const b = getRandom(10, 30);
      const operations = ["+", "-"];
      const operation = operations[getRandom(1, operations.length - 1)];
      const example = `${a} ${operation} ${b}`;
      const getResult = new Function(`return ${example};`);
      if (
        parseInt(
          prompt(
            `Чтобы выйти из режима просмотра, вычислите:\n${example} = `,
            ""
          ),
          10
        ) === getResult()
      ) {
        view.textContent = "";
        document.body.classList.remove("viewing");
      }
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

const addBeforeUnloadListener = () => {
  window.addEventListener("beforeunload", (event) => {
    if (document.body.classList.contains("viewing")) {
      event.preventDefault();
      event.returnValue =
        "Вы сейчас просматриваете видео, действительно хотите выйти?";
    }
  });
};

const main = () => {
  addVideoClickListener();
  addTopicsFilterListener();
  addChannelsFilterListener();
  addNextButtonListener();
  addBeforeUnloadListener();
};

main();
