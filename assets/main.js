const hostname = window.location.origin;

/*
** Functions called by site
** (put them in its place where possible)
*/
function fadeOutRight() {
	$("main").removeClass("fade-in-left").addClass("fade-out-right");
}

function fadeOutLeft() {
	$("main").removeClass("fade-in-left").addClass("fade-out-left");
}

function fadeOut() { $("main").removeClass("fade-in").addClass("fade-out"); }

function scrollUp() { $("html, body").animate({scrollTop: 0}, 150); }

function darkSideOfTheMoon(enable, persist) {
	if (enable) {
		if ($("html").hasClass("contrast")) {
			// throw "error: Dark theme not enabled, turn off contrast";
		} else {
			$("html").addClass("dark");
			$(".js-darkmode svg").remove(); // !: Find a better way to do this
			$(".js-darkmode").prepend("<svg class='icon' aria-hidden='true' width='1em' height='1em'> <use href='" + hostname + "/assets/symbol-defs.svg#icon-moon-fill'></use></svg>");

			if (persist != false) { localStorage.setItem("theme","dark"); }
		}
	} else {
		$("html").removeClass("dark");
		$(".js-darkmode svg").remove(); // !: Find a better way to do this
		$(".js-darkmode").prepend("<svg class='icon' aria-hidden='true' width='1em' height='1em'> <use href='" + hostname + "/assets/symbol-defs.svg#icon-moon-stroke'></use></svg>");

		if (persist != false) { localStorage.setItem("theme","light"); }
	}
}

function fontSize(size) {
	if (size == "large") {
		$(":root").css("--font-0", "1.2rem");
		localStorage.setItem("textSize","large");
		$(".js-text-adjust svg").remove(); // !: Find a better way to do this
		$(".js-text-adjust ").prepend("<svg class='icon' aria-hidden='true' width='1em' height='1em'> <use href='" + hostname + "/assets/symbol-defs.svg#icon-lowercase-a'></use></svg>");
	} else {
		$(":root").css("--font-0", "");
		localStorage.setItem("textSize","medium");
		$(".js-text-adjust svg").remove(); // !: Find a better way to do this
		$(".js-text-adjust").prepend("<svg class='icon' aria-hidden='true' width='1em' height='1em'> <use href='" + hostname + "/assets/symbol-defs.svg#icon-uppercase-a'></use></svg>");
	}
}

// @someone easter egg
// https://stackoverflow.com/questions/31626852/how-to-add-konami-code-in-a-website-based-on-html
function onKonamiCode(cb) {
	var input = "";
	var key = "38384040373937396665";
	document.addEventListener("keydown", function(e) {
		input += ("" + e.keyCode);
		if (input === key) {
			return cb();
		}
		if (!key.indexOf(input)) return;
		input = ("" + e.keyCode);
	});
}

// Marketplace gets a search bar
if ($("main").is(".marketplace")) {
	$(".header").append(
		"<div class='command-bar'>" +
			"<input id='search' type='text' placeholder='Search&hellip;' data-filter='.modules div'>" +
		"</div>"
	);
	$(".command-bar input").css("margin-left", "calc(100% - 15em)"); // ! very hacky
	$(".command-bar").parents(".header").css("border-color", "var(--scrollbar-border)"); // ! even hackier
}

/* Make accessbility controls exist */
if (typeof(Storage) !== "undefined") {
	$(".caption-menu").css("display", "block");
}

/* Init JS libs */
// Barba.Pjax.start(); // init barbra
Barba.Prefetch.init(); // init barbra

// kounami code 
// adapted from https://codepen.io/SJF/pen/wBdpXV
var r = 255,
	g = 0,
	b = 0;

function rainbowz() {
	if (r > 0 && b == 0) {
		r -= 5;
		g += 5;
	}
	
	if (g > 0 && r == 0) {
		g -= 5;
		b += 5;
	}

	if (b > 0 && g == 0) {
		r += 5;
		b -= 5;
	}

	$(":root").css("--a-r", r + "");
	$(":root").css("--a-g", g + "");
	$(":root").css("--a-b", b + "");
}

onKonamiCode(function() {
	$("body").addClass("someone");
	setInterval(rainbowz, 100);
});

var largeFontSize = false;
$(".js-text-adjust").click(function() {
	if(largeFontSize) {
		// off
		fontSize("normal");
		largeFontSize = false;
	} else {
		// on
		fontSize("large");
		largeFontSize = true;
	}
});

/* Hamburger toggle */
var clickedBurger = false;
$(".burger-button").click(function() {
	if (clickedBurger) {
		// closed
		clickedBurger = false;
		$("html").removeClass("no-scroll-mobile-only");
		$(".header").removeClass("slide-down").delay(300).addClass("slide-up");
	} else {
		// open
		clickedBurger = true;
		$("html").addClass("no-scroll-mobile-only");
		$(".header").removeClass("slide-up").addClass("slide-down");
	}
});

/* Contrast toggle */
var clickedContrast = false;
$(".js-contrast").click(function() {
	if(clickedContrast) {
		// off
		clickedContrast = false;
		$("html").removeClass("contrast no-custom-scrollbar no-custom-input");
		localStorage.setItem("theme","light");
	} else if ($("html").hasClass("dark")) {
		// throw "error: Contrast theme not enabled, turn off dark";
	} else {
		// on
		clickedContrast = true;
		$("html").addClass("contrast no-custom-scrollbar no-custom-input");
		localStorage.setItem("theme","contrast");
	}
});

/* Dark toggle */
/* Contrast toggle */
var clickedDark = false;
$(".js-darkmode").click(function() {
	if(clickedDark) {
		// off
		clickedDark = false;
		darkSideOfTheMoon(false);
	} else if ($("html").hasClass("contrast")) {
		// throw "error: Dark theme not enabled, turn off contrast";
	} else {
		// on
		clickedDark = true;
		darkSideOfTheMoon(true);
	}
});

/* Marketplace */
// Search modules - https://www.w3schools.com/jquery/jquery_filters.asp
$("#search").on("keyup", function() {
	var value = $(this).val().toLowerCase();
	$($(this).data("filter")).filter(function() {
		$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
	});
});

/* Apply styles from local storage */
// text size
if (localStorage.getItem("textSize") == "large") {
	fontSize("large");
	largeFontSize = true;
} else {
	fontSize("normal");
	largeFontSize = false;
}

// contrast
if (localStorage.getItem("theme") == "contrast") {
	$("html").addClass("contrast no-custom-scrollbar no-custom-input");
	clickedContrast = true;
} else {
	$("html").removeClass("contrast no-custom-scrollbar no-custom-input");
	clickedContrast = false;
}

// dark theme
if (localStorage.getItem("theme") == "dark") {
	darkSideOfTheMoon(true);
	clickedDark = true;
} else {
	darkSideOfTheMoon(false, false);
	clickedDark = false;
}

window.matchMedia("(prefers-color-scheme: dark)").addListener(applySystemColorScheme);

function applySystemColorScheme() {
	// apply dark theme if user has elected to use it system-wide
	if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
		// console.log("user has elected to use dark theme in system settings");
		darkSideOfTheMoon(true, false);
		clickedDark = true;
	}

	// apply dark theme if user has elected to use it system-wide
	if (window.matchMedia("(prefers-color-scheme: light)").matches) {
		// console.log("user has elected to use dark theme in system settings");
		darkSideOfTheMoon(false, false);
		clickedDark = false;
	}
}

if (localStorage.getItem("theme") == null) {
	// apply dark theme if user has elected to use it system-wide
	applySystemColorScheme();

	// apply dark theme if user has Dark Reader or Night Eye, but don’t add the local storage
	if ($("style").is(".darkreader") || $("style").is("#nighteyedefaultcss") || $("style").is("#darkmode")) {
		if ($("html").hasClass("contrast")) {
			// throw "error: Dark theme not enabled, turn off contrast";
		} else {
			darkSideOfTheMoon(true, false);
			clickedDark = true;
			// console.log("applied dark theme because user has dark theme extention");
		}
		// console.log("dark theme extention detected!");
	}
}

/* delay links - this is probably a bad idea */
// https://stackoverflow.com/questions/8775541/delay-a-link-click (MIT)
$("a.delaylink[href]").click(function(){
	var self = $(this);
	setTimeout(function() {
		window.location.href = self.attr("href"); // go to href after the slide animation completes
	}, 400);
	return false; // And also make sure you return false from your click handler.
});

/*
** Add a self link for headers in docs pages
** Enabled in the child of elements with .js-self-link
** adapted from thelounge - https://github.com/thelounge/thelounge.github.io/commit/e5774dec659e589331111e8ef27afe3a81de9c2d (MIT)
*/
function addSelfLink(elem) {
	$(elem).each(function() {
		$(this).append($(
			"<a class='self-link instapaper_hide' href='#" + $(this).attr("id") + "' aria-hidden='true' tabindex='-1' title='Permalink to this section'> #</a>"
		));
	});
}

addSelfLink(".js-self-link h2, .js-self-link h3");

/*
** Hide the top part of the navbar when scrolled down
** adapted from W3Schools - https://www.w3schools.com/howto/howto_js_navbar_hide_scroll.asp
*/
window.onscroll = function() {
	var currentScrollPos = window.pageYOffset;
	if (48 > currentScrollPos) {
		$(".header").removeClass("scroll-up");
	} else {
		$(".header").addClass("scroll-up");
	}
	if (currentScrollPos == 0) { $(".header").removeClass("scroll-up"); } // if scrolled to zero, show menu bar
};

/*
** Let the document know when the mouse is being used
** https://codepen.io/anon/pen/XYoJQv
*/

document.body.addEventListener("mousedown", function() {
	$("body").addClass("jerry-mouse");
});

document.body.addEventListener("keydown", function() {
	$("body").removeClass("jerry-mouse");
});
