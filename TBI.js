/* =========================================================
   SGS TOP BAR INJECTOR
   Loads TB.html
   Handles navigation
   Handles active tab
   Handles clock
   ========================================================= */

(() => {
  "use strict";


  /* =========================================================
     SETTINGS
     ========================================================= */

  const TOPBAR_FILE = "TB.html";
  const CONTAINER_ID = "sgs-topbar";
  const CLOCK_ID = "sgs-datetime";


  /* =========================================================
     PAGE ROUTES
     ========================================================= */

  const routes = {
    "home": "index.html",
    "games": "games.html",
    "utilities": "unfin.html",
    "browser": "unfin.html",
    "music player": "unfin.html",
    "forums": "unfin.html",
    "settings": "unfin.html"
  };


  /* =========================================================
     GET TOPBAR CONTAINER
     ========================================================= */

  function getContainer() {

    let container =
      document.getElementById(CONTAINER_ID);

    if (!container) {

      container =
        document.createElement("div");

      container.id =
        CONTAINER_ID;

      document.body.insertBefore(
        container,
        document.body.firstChild
      );
    }

    return container;
  }


  /* =========================================================
     GET CURRENT PAGE
     ========================================================= */

  function getCurrentPage() {

    let filename =
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


  /* =========================================================
     FIND TAB NAME
     ========================================================= */

  function getTabName(tab) {

    return tab.textContent
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");

  }


  /* =========================================================
     NAVIGATE
     ========================================================= */

  function navigate(tabName) {

    const name =
      tabName
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");


    const target =
      routes[name];


    if (!target) {

      console.warn(
        "SGS Topbar: No route for:",
        name
      );

      return;
    }


    console.log(
      "SGS Topbar: Navigating to:",
      target
    );


    /*
     * Build the URL relative to the current
     * SGS folder.
     */

    const destination =
      new URL(
        target,
        window.location.href
      ).href;


    window.location.href =
      destination;

  }


  /* =========================================================
     SET ACTIVE TAB
     ========================================================= */

  function updateActiveTab() {

    const container =
      getContainer();


    const currentPage =
      getCurrentPage();


    const tabs =
      container.querySelectorAll(
        ".tab"
      );


    tabs.forEach(tab => {

      tab.classList.remove(
        "active"
      );


      const name =
        getTabName(tab);


      if (
        currentPage === "home" &&
        name === "home"
      ) {

        tab.classList.add(
          "active"
        );

      }


      if (
        currentPage === "games" &&
        name === "games"
      ) {

        tab.classList.add(
          "active"
        );

      }

    });

  }


  /* =========================================================
     SET UP TAB CLICKS
     ========================================================= */

  function setupTabs() {

    const container =
      getContainer();


    const tabs =
      container.querySelectorAll(
        ".tab"
      );


    tabs.forEach(tab => {

      /*
       * Remove any onclick attribute that
       * may already exist inside TB.html.
       */

      tab.removeAttribute(
        "onclick"
      );


      /*
       * Prevent duplicate listeners.
       */

      if (
        tab.dataset.sgsNavigationBound ===
        "true"
      ) {
        return;
      }


      tab.dataset.sgsNavigationBound =
        "true";


      tab.addEventListener(
        "click",
        function(event) {

          event.preventDefault();
          event.stopImmediatePropagation();


          const name =
            getTabName(this);


          console.log(
            "SGS Topbar: Tab clicked:",
            name
          );


          navigate(name);

        },
        true
      );

    });


    updateActiveTab();

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
     LOAD TB.html
     ========================================================= */

  async function loadTopbar() {

    const container =
      getContainer();


    try {

      /*
       * TB.html is in the same folder
       * as TBI.js.
       */

      const topbarURL =
        new URL(
          TOPBAR_FILE,
          document.currentScript?.src ||
          window.location.href
        );


      const response =
        await fetch(
          topbarURL.href,
          {
            cache: "no-store"
          }
        );


      if (!response.ok) {

        throw new Error(
          `TB.html returned HTTP ${response.status}`
        );

      }


      const html =
        await response.text();


      /*
       * Insert TB.html.
       */

      container.innerHTML =
        html;


      /*
       * Set up navigation.
       */

      setupTabs();


      /*
       * Start clock.
       */

      updateClock();


      setInterval(
        updateClock,
        1000
      );


      console.log(
        "SGS Topbar: TB.html loaded."
      );


    } catch (error) {

      console.error(
        "SGS Topbar failed:",
        error
      );

    }

  }


  /* =========================================================
     START
     ========================================================= */

  if (
    document.readyState === "loading"
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
