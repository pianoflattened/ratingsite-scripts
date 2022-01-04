// OUTSIDE
var update_user_notes = function(username) {
	ldb.get("__notes", function(v) {
		v[username] = $("textarea#user_notes").value;
		ldb.set("__notes", v);
	});
}


// INSIDE
/* 
 * USER NOTES
 * * * * * * */
if (window.location.href.includes("://rateyourmusic.com/~")) {
	window.update_user_notes = update_user_notes;
	
	if (!$("div#allNotifications").length) {
		$("td:has(div.profilehii) + td div").append($(`<div style="margin: 0 0.5em; display: flex; justify-content: space-between;">
			<span>notes</span>
			<span style="font-weight: bold;">[<a>edit</a>]</span>
		</div>
		<div class="venuebox" style="padding: 0; border: 1px var(--mono-c) solid;">
			<textarea id="user_notes" oninput="window.updateUserNotes($('span#profilename').text())"></textarea>
		</div>`));
	}
}
