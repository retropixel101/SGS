(() => {
  "use strict";

  const CONTAINER_ID = "sgs-topbar";
  const TOPBAR_FILE = "TB.html";
  const CLOCK_ID = "sgs-datetime";


  /* =========================================================
     ROUTES
     ========================================================= */

  const routes = {
    home: "index.html",
    games: "games.html",
    utilities: "unfin.html",
    browser: "unfin.html",
    music: "unfin.html",
    forums: "unfin.html",
    settings: "unfin.html"
  };


  /* =========================================================
     LOAD TOP BAR
     ========================================================= */

  async function loadTopbar() {

    let container =
      document.getElementById(CONTAINER_ID);

    if (!container) {

      container =
        document.createElement("div");

      container.id =
        CONTAINER_ID;

      document.body.prepend(container);
    }


    try {

      const response =
        await fetch(
          TOPBAR_FILE,
          {
            cache: "no-store"
          }
        );


      if (!response.ok) {

        throw new Error(
          "TB.html failed to load: HTTP " +
          response.status
        );

      }


      container.innerHTML =
        await response.text();


      setupNavigation();
      updateActiveTab();
      updateClock();


      setInterval(
        updateClock,
        1000
      );


      console.log(
        "SGS: Top bar loaded."
      );


    } catch (error) {

      console.error(
        "SGS: Failed to load TB.html.",
        error
      );

    }

  }


  /* =========================================================
     NAVIGATION
     ========================================================= */

  function setupNavigation() {

    const container =
      document.getElementById(
        CONTAINER_ID
      );


    if (!container) {
      return;
    }


    const tabs =
      container.querySelectorAll(
        ".tab[data-page]"
      );


    tabs.forEach(tab => {

      tab.addEventListener(
        "click",
        function(event) {

          event.preventDefault();


          const page =
            this.dataset.page;


          const target =
            routes[page];


          if (!target) {

            console.error(
              "SGS: No route for:",
              page
            );

            return;
          }


          /*
           * IMPORTANT:
           *
           * Use a relative URL from the
           * actual current SGS directory.
           */

          window.location.assign(
            target
          );

        }
      );

    });

  }


  /* =========================================================
     ACTIVE TAB
     ========================================================= */

  function getCurrentPage() {

    const filename =
      window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();


    if (
      filename === "" ||
      filename === "index.html"
    ) {

      return "home";

    }


    if (
      filename === "games.html"
    ) {

      return "games";

    }


    return null;

  }


  function updateActiveTab() {

    const container =
      document.getElementById(
        CONTAINER_ID
      );


    if (!container) {
      return;
    }


    const currentPage =
      getCurrentPage();


    const tabs =
      container.querySelectorAll(
        ".tab[data-page]"
      );


    tabs.forEach(tab => {

      if (
        tab.dataset.page ===
        currentPage
      ) {

        tab.classList.add(
          "active"
        );

      } else {

        tab.classList.remove(
          "active"
        );

      }

    });

  }


  /* =========================================================
     CLOCK
     ========================================================= */

  function updateClock() {

    const clock =
      document.getElementById(
        CLOCK_ID
      );


    if (!clock) {
      return;
    }


    const now =
      new Date();


    const month =
      now.toLocaleString(
        "en-US",
        {
          month: "long"
        }
      );


    const day =
      now.getDate();


    const year =
      now.getFullYear();


    let hours =
      now.getHours();


    const minutes =
      String(
        now.getMinutes()
      ).padStart(
        2,
        "0"
      );


    const seconds =
      String(
        now.getSeconds()
      ).padStart(
        2,
        "0"
      );


    const ampm =
      hours >= 12
        ? "PM"
        : "AM";


    hours =
      hours % 12 || 12;


    clock.textContent =
      `${month} ${day}, ${year} • ${hours}:${minutes}:${seconds} ${ampm}`;

  }


  /* =========================================================
     START
     ========================================================= */

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      loadTopbar,
      {
        once: true
      }
    );

  } else {

    loadTopbar();

  }

})();
