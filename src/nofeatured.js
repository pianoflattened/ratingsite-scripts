// INSIDE
/*
 * REMOVE FEATURED REVIEWS
 * * * * * * * * * * * * * */
// thank you jquery
if (window.location.href.includes("rateyourmusic.com/release")) {
	$(".review:has(.review_featured)").remove(); // lol maybe move it instead
}
