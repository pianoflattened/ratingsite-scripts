// OUTSIDE

// INSIDE
/* 
 * AESTHETIC STUFF
 * * * * * * * * * */

// forgot exactly what this is for but im just changing some colors here dont worry too much about it. may be something about the wiki
// $(':root').css('--ui-detail-neutral', '#4a4c52').css('--ui-divider-line', '#4a4c52');

// move the charts link bc it switched places with the genre one and i was clicking it habitually
let chartslink = $("div.header_charts");
let newcharts = chartslink.clone(true, true);
chartslink.remove();
newcharts.insertAfter("div.header_links a.header_item:nth-child(2)");

// search results look weird centered - this moves them to the left
if (window.location.href.includes("://rateyourmusic.com/search")) {
	$('column_container_left').removeClass("large-8");
}

// i hate how this icon looks lol. it is a warning icon though so like if you want it you can keep it
$("img[src=\"https://www.gstatic.com/images/icons/material/system/1x/warning_amber_24dp.png\"]").remove();

if (is_release_page) {
	$(".tcreport_comment_report").each(function() {this.innerHTML = '<i class="far fa-flag"></i>'});
}
