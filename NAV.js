/* =========================================================
   SGS MASTER NAVIGATION
   File: NAV.js

   CHANGE PAGE DESTINATIONS HERE ONLY.
   ========================================================= */

const SGS_ROUTES = {
    home: "index.html",
    games: "games.html",

    utilities: "unfin.html",
    browser: "unfin.html",
    music: "unfin.html",
    forums: "unfin.html",
    settings: "unfin.html"
};


/* =========================================================
   NAVIGATION
   ========================================================= */

function SGS_Go(route) {

    const destination = SGS_ROUTES[route];

    if (!destination) {
        console.error("SGS: Route does not exist:", route);
        return;
    }

    window.location.href = destination;
}


/* =========================================================
   FIND CURRENT PAGE
   ========================================================= */

function SGS_CurrentPage() {

    let page = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    if (!page || page === "") {
        page = "index.html";
    }

    for (const route in SGS_ROUTES) {

        const destination = SGS_ROUTES[route]
            .split("/")
            .pop()
            .toLowerCase();

        if (page === destination) {
            return route;
        }
    }

    return null;
}


/* =========================================================
   CONNECT NAVIGATION BUTTONS
   ========================================================= */

function SGS_SetupNavigation() {

    const buttons = document.querySelectorAll("[data-nav]");

    buttons.forEach(button => {

        const route = button.getAttribute("data-nav");

        if (!SGS_ROUTES[route]) {
            console.warn(
                "SGS: No route configured for:",
                route
            );
            return;
        }

        /*
         * Remove any old navigation behavior.
         */
        button.removeAttribute("href");

        /*
         * Make it clickable.
         */
        button.style.cursor = "pointer";

        button.addEventListener("click", function(event) {

            event.preventDefault();

            SGS_Go(route);

        });

    });


    /* =====================================================
       ACTIVE TAB
       ===================================================== */

    const currentPage = SGS_CurrentPage();

    document.querySelectorAll(".tab[data-nav]").forEach(tab => {

        const route = tab.getAttribute("data-nav");

        tab.classList.remove("active");

        if (route === currentPage) {
            tab.classList.add("active");
        }

    });

}


/* =========================================================
   START
   ========================================================= */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        SGS_SetupNavigation
    );

} else {

    SGS_SetupNavigation();

}
