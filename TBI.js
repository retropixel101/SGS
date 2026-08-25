/* =========================================================
   SGS TOP BAR INJECTOR
   Loads TB.html and makes every tab fully interactive.
   ========================================================= */

(() => {
  "use strict";

  /* =========================================================
     SETTINGS
     ========================================================= */

  const TOPBAR_CONTAINER_ID = "sgs-topbar";

  /*
   * Your shared top bar file.
   * Keep TB.html in the same folder as this JS file.
   */
  const TOPBAR_FILE = "TB.html";

  /*
   * Automatically figures out where this JS file is located.
   */
  const SCRIPT_URL =
    document.currentScript?.src ||
    new URL("TBI.js", document.baseURI).href;

  const SITE_ROOT = new URL("./", SCRIPT_URL);
  const TOPBAR_URL = new URL(TOPBAR_FILE, SCRIPT_URL).href;

  const TIME_ID = "sgs-datetime";


  /* =========================================================
     PAGE ROUTES
     ========================================================= */

  const routes = {
    home: "homepage.html",
    games: "games.html",
    utilities: "unfin.html",
    browser: "unfin.html",
    music: "unfin.html",
    forums: "unfin.html",
    settings: "unfin.html"
  };


  /* =========================================================
     CREATE / FIND TOP BAR CONTAINER
     ========================================================= */

  function getContainer() {

    let container =
      document.getElementById(
        TOPBAR_CONTAINER_ID
      );

    if (!container) {

      container =
        document.createElement("div");

      container.id =
        TOPBAR_CONTAINER_ID;

      if (document.body.firstChild) {

        document.body.insertBefore(
          container,
          document.body.firstChild
        );

      } else {

        document.body.appendChild(
          container
        );

      }
    }

    return container;
  }


  /* =========================================================
     DETERMINE CURRENT PAGE
     ========================================================= */

  function getPageKey() {

    const path =
      window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();


    /*
     * HOME
     */

    if (
      !path ||
      path === "index.html" ||
      path === "homepage.html" ||
      path === ""
    ) {
      return "home";
    }


    /*
     * GAMES PAGE
     */

    if (
      path === "games.html"
    ) {
      return "games";
    }


    /*
     * INDIVIDUAL GAME PAGES
     *
     * Anything inside /HTML/ is considered
     * part of the Games section.
     */

    if (
      window.location.pathname
        .toLowerCase()
        .includes("/html/")
    ) {
      return "games";
    }


    /*
     * UNFINISHED PAGES
     */

    if (
      path === "unfin.html"
    ) {
      return null;
    }


    return null;
  }


  /* =========================================================
     UPDATE ACTIVE TAB
     ========================================================= */

  function updateActiveButton() {

    const container =
      getContainer();

    if (!container) return;


    const currentPage =
      getPageKey();


    const tabs =
      container.querySelectorAll(
        ".tab[data-page]"
      );


    tabs.forEach(tab => {

      const page =
        tab.dataset.page;


      tab.classList.toggle(
        "active",
        page === currentPage
      );

    });

  }


  /* =========================================================
     NAVIGATE
     ========================================================= */

  function navigate(page) {

    const target =
      routes[page];


    if (!target) {
      console.warn(
        "SGS Topbar: No route defined for:",
        page
      );

      return;
    }


    const targetURL =
      new URL(
        target,
        SITE_ROOT
      ).href;


    /*
     * If we're already on the requested page,
     * don't reload it.
     */

    const currentPath =
      window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();


    const targetPath =
      target
        .split("/")
        .pop()
        .toLowerCase();


    if (
      currentPath === targetPath
    ) {
      return;
    }


    /*
     * HOME also supports index.html
     * and homepage.html.
     */

    if (
      page === "home" &&
      (
        currentPath === "" ||
        currentPath === "index.html" ||
        currentPath === "homepage.html"
      )
    ) {
      return;
    }


    /*
     * Actually switch pages.
     */

    window.location.assign(
      targetURL
    );

  }


  /* =========================================================
     SET UP TAB BUTTONS
     ========================================================= */

  function setupButtons() {

    const container =
      getContainer();

    if (!container) return;


    const tabs =
      container.querySelectorAll(
        ".tab[data-page]"
      );


    tabs.forEach(tab => {

      /*
       * Remove any old listener marker.
       * This prevents duplicate handlers if
       * the top bar is ever reloaded.
       */

      if (
        tab.dataset.sgsBound === "true"
      ) {
        return;
      }


      tab.dataset.sgsBound = "true";


      tab.addEventListener(
        "click",
        function(event) {

          event.preventDefault();
          event.stopPropagation();


          const page =
            this.dataset.page;


          if (!page) {
            return;
          }


          navigate(page);

        }
      );

    });


    updateActiveButton();

  }


  /* =========================================================
     CLOCK
     ========================================================= */

  function updateDateTime() {

    const element =
      document.getElementById(
        TIME_ID
      );


    if (!element) {
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
      ).padStart(2, "0");


    const seconds =
      String(
        now.getSeconds()
      ).padStart(2, "0");


    const ampm =
      hours >= 12
        ? "PM"
        : "AM";


    hours =
      hours % 12 || 12;


    element.textContent =
      `${month} ${day}, ${year} • ${hours}:${minutes}:${seconds} ${ampm}`;

  }


  /* =========================================================
     LOAD TB.html
     ========================================================= */

  async function loadTopbar() {

    const container =
      getContainer();


    if (!container) {

      console.error(
        "SGS Topbar: Could not create container."
      );

      return;
    }


    try {

      const response =
        await fetch(
          TOPBAR_URL,
          {
            method: "GET",
            cache: "no-store"
          }
        );


      if (!response.ok) {

        throw new Error(
          `Could not load TB.html. HTTP ${response.status}`
        );

      }


      /*
       * Insert the separate TB.html file.
       */

      container.innerHTML =
        await response.text();


      /*
       * Make the buttons work.
       */

      setupButtons();


      /*
       * Start the clock.
       */

      updateDateTime();


      setInterval(
        updateDateTime,
        1000
      );


      console.log(
        "SGS Topbar: TB.html loaded successfully."
      );


    } catch (error) {

      console.error(
        "SGS Topbar:",
        error
      );


      /*
       * Fallback if TB.html cannot be loaded.
       */

      container.innerHTML = `

        <div style="
          width:100%;
          min-height:58px;
          display:flex;
          align-items:center;
          padding:9px 18px;
          background:linear-gradient(
            90deg,
            #ff0000,
            #660000
          );
          color:#fff;
          font-family:'Segoe UI',Arial,sans-serif;
          font-weight:700;
        ">

          Secret Game Site

        </div>

      `;

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
