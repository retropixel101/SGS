/* =========================================================
   SGS TOP BAR INJECTOR
   Loads the top bar from TB.html
   ========================================================= */

(async function () {

  try {

    const response = await fetch("TB.html", {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(
        `Could not load TB.html (HTTP ${response.status})`
      );
    }

    const html = await response.text();

    /*
     * Inject the top bar at the very beginning
     * of the page.
     */
    document.body.insertAdjacentHTML(
      "afterbegin",
      html
    );


    /* =====================================================
       START TOP BAR CLOCK
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
       TOP BAR READY
       ===================================================== */

    console.log("SGS: TB.html loaded successfully.");

  } catch (error) {

    console.error(
      "SGS: Failed to load TB.html.",
      error
    );

  }

})();
