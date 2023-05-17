// OUTSIDE
window["mute_user"] = function(form, user) {
	if (confirm("mute "+user+"?")) {
		ldb.get("__muted", function(v) {
			if (v === null) v = [];
			ldb.set("__muted", v.concat(user));
			
			switch (form) {
			case "comment":
				$(".comment:has(.comment_header a.user:text('"+user+"'))").remove();
				break;
			case "user":
				$("a#mute_user")["css"]({
					background: "var(--ui-detail-primary)",
					color: "var(--text-white)"
				})["attr"]("onclick", "window.unmute_user("+JSON.stringify(user)+")");
				break;
			case "review":
				$(".review:has(span.review_user a.user:text('"+user+"'))").remove();
				break;
			}
		});
	}
};

window["unmute_user"] = function(user) {
	user = user.trim();
	if (confirm("unmute "+user+"?")) {
		ldb.get("__muted", function(v) {
			ldb.set("__muted", v.filter(e => e != user));
			$("a#mute_user")["attr"]("style", "")["attr"]("onclick", "window.mute_user('user', '"+user+"')");
		});
	}
}

// INSIDE
if (is_release_page) {
	let add_mute_btn = function() {
		let t = $(this);
		let classes = t["attr"]("class").split(/\s+/);
		if (classes.includes("comment")) {
			ldb.get("__muted", function(v) {
				if (v === null) v = [];
				
				let username = t.find(".comment_header a.user").text().trim();
				if (v.includes(username)) {
					t.remove();
				} else {
					t.find(".comment_mod:not(:has(span.btn_mute))").append($(`<span class="btn_mute" onclick="window.mute_user('comment', '`+username+`')">🔇</span>`));
				}
			});
		} else if (classes.includes("review")) {
			ldb.get("__muted", function(v) {
				if (v === null) v = [];
				
				let username = t.find("span.review_user a.user").text().trim();
				console.log(username);
				if (v.includes(username)) {
					t.remove();
				} else {
					t.find("span.review_date:not(:has(span.btn_mute))").after($(`<span class="btn_mute" onclick="window.mute_user('review', '`+username+`')">🔇</span>`))
				}
			});
		}
	};
	
	$(".comment:has(.comment_header a.user)")["each"](add_mute_btn);
	$(".comments")["arrive"](".comment", add_mute_btn);
	$("div.review")["each"](add_mute_btn);
}

if (is_user_page) {
	let username = username_from_href();
	
	ldb.get("__muted", function(v) {
		if (v === null) v = [];

		$("table.mbgen td:has(a#block)").before($(`<td>
<a id="mute_user" class="btn tool_btn" onclick="window.mute_user('user', '`+username+`');">🔇</a>
		</td>`));
		
		if (v.includes(username)) {
			$("a#mute_user")["css"]({
				background: "var(--ui-detail-primary)",
				color: "var(--text-white)"
			})["attr"]("onclick", "window.unmute_user('"+username+"')");
		}
	});
}
