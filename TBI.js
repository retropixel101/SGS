/* =========================================================
   SGS TOP BAR INJECTOR
   Loads TB.html
   Handles clock
   Handles navigation
   Handles active/selected tab
   ========================================================= */

(async function () {

  try {

    /* =====================================================
       LOAD TOP BAR
       ===================================================== */

    const response = await fetch("TB.html", {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(
        `Could not load TB.html (HTTP ${response.status})`
      );
    }

    const html = await response.text();

    document.body.insertAdjacentHTML(
      "afterbegin",
      html
    );


    /* =====================================================
       CLOCK
       ===================================================== */

    function updateDateTime() {

      const datetime =
        document.getElementById("datetime");

      if (!datetime) return;

      const now = new Date();

      const month = now.toLocaleString("en-US", {
        month: "long"
      });

      const day = now.getDate();
      const year = now.getFullYear();

      let hours = now.getHours();

      const minutes =
        String(now.getMinutes()).padStart(2, "0");

      const seconds =
        String(now.getSeconds()).padStart(2, "0");

      const ampm =
        hours >= 12 ? "PM" : "AM";

      hours = hours % 12 || 12;

      datetime.textContent =
        `${month} ${day}, ${year} • ${hours}:${minutes}:${seconds} ${ampm}`;
    }

    updateDateTime();

    setInterval(updateDateTime, 1000);


    /* =====================================================
       CURRENT PAGE
       ===================================================== */

    const currentPath =
      window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();


    /* =====================================================
       TAB NAVIGATION
       ===================================================== */

    const tabs =
      document.querySelectorAll(".navbar .tab");


    tabs.forEach(tab => {

      const name =
        tab.textContent
          .trim()
          .toLowerCase();


      /* ---------------------------------------------------
         REMOVE OLD ACTIVE STATE
         --------------------------------------------------- */

      tab.classList.remove("active");


      /* ---------------------------------------------------
         DETERMINE DESTINATION
         --------------------------------------------------- */

      let destination = null;

      switch (name) {

        case "home":
          destination = "index.html";
          break;

        case "games":
          destination = "games.html";
          break;

        case "utilities":
          destination = "unfin.html";
          break;

        case "browser":
          destination = "unfin.html";
          break;

        case "music player":
          destination = "unfin.html";
          break;

        case "forums":
          destination = "unfin.html";
          break;

        case "settings":
          destination = "unfin.html";
          break;

      }


      /* ---------------------------------------------------
         NAVIGATION
         --------------------------------------------------- */

      if (destination) {

        tab.onclick = function () {

          window.location.href =
            destination;

        };

      }


      /* ---------------------------------------------------
         ACTIVE TAB
         --------------------------------------------------- */

      if (
        destination &&
        destination.toLowerCase() === currentPath
      ) {

        tab.classList.add("active");

      }

    });


    /* =====================================================
       SPECIAL CASE:
       ROOT DIRECTORY = HOME
       ===================================================== */

    if (
      currentPath === "" ||
      currentPath === "/" ||
      currentPath === "index.html"
    ) {

      tabs.forEach(tab => {

        if (
          tab.textContent
            .trim()
            .toLowerCase() === "home"
        ) {

          tab.classList.add("active");

        }

      });

    }


    /* =====================================================
       SGS READY
       ===================================================== */

    console.log(
      "SGS: TB.html loaded and top bar initialized."
    );


  } catch (error) {

    console.error(
      "SGS: Failed to load or initialize TB.html.",
      error
    );

  }

})();
