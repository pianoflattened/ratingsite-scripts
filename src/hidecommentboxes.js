// OUTSIDE
window["show_comment_box"] = function() {
	$("div.section_comments div.comments.view")["css"]("display", "block");
	ldb.get("__hidden_commentboxes", function(v) {
		if (v === null) v = [];
		ldb.set("__hidden_commentboxes", v.filter(e => e != album_id));
	});
	$("a#btn_hide_comments").text("hide comment box")["attr"]("onclick", "window.hide_comment_box();");
};

window["hide_comment_box"] = function() {
	$("div.section_comments div.comments.view")["css"]("display", "none");
	ldb.get("__hidden_commentboxes", function(v) {
		if (v === null) v = [];
		ldb.set("__hidden_commentboxes", v.concat(album_id));
	});
	$("a#btn_hide_comments").text("show comment box")["attr"]("onclick", "window.show_comment_box();");
};

// INSIDE
if (window.location.href.includes("://rateyourmusic.com/release/") || window.location.href.includes("://rateyourmusic.com/film")) {
	let album_id;
	try {
		album_id = $("div.album_title input.album_shortcut")["val"]().split("[Album")[1].slice(0, -1);
	} catch (a) {
		console.log(a);
		album_id = $("div.return_banner a.album")["attr"]("title").split("[Album")[1].slice(0, -1);
	}
	
	$(".section_comments .release_page_header").append($(`<span style="float:right;">&nbsp;[<a id="btn_hide_comments"></a>]</span>`));
	ldb.get("__hidden_commentboxes", function(v) {
		if (v === null) v = [];
		
		if (v.includes(album_id)) {
			$("div.section_comments div.comments.view")["css"]("display", "none");
			$("a#btn_hide_comments").text("show comment box")["attr"]("onclick", "window.show_comment_box();");
		} else {
			$("a#btn_hide_comments").text("hide comment box")["attr"]("onclick", "window.hide_comment_box();");
		}
	});
}
console.log("loaded hidecommentboxes");
