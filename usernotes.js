// OUTSIDE
var update_user_notes = function(username) {
	ldb.get("__notes", function(v) {
		if (v === null) {
			v = {};
		}
		v[username] = $("textarea#user_notes").val();
		ldb.set("__notes", v);
	});
}

// INSIDE
/* 
 * USER NOTES
 * * * * * * */
if (window.location.href.includes("://rateyourmusic.com/~")) {
	window.update_user_notes = update_user_notes;
	
	if ($("div#allNotifications").length == 0) {
		let spl = window.location.href.split("~");
		let username = spl[spl.length-1];
		let notes = $(`<div class="notes_container" style="margin: 0 0.5em; display: flex; justify-content: space-between;">
			<span>notes</span>
			<span style="font-weight: bold;">[<a onclick="$('textarea#user_notes').is(':disabled') ? $('textarea#user_notes').removeAttr('disabled') : $('textarea#user_notes').attr('disabled', '');">edit</a>]</span>
		</div>
		<div class="venuebox notes_container" style="padding: 0; border: 1px var(--mono-c) solid;">
			<textarea disabled id="user_notes" oninput="window.update_user_notes('`+username+`');"></textarea>
		</div>`);
		
		if ($("div.note:has(a#block)").length >= 1) {
			ldb.get("__notes", function(v) {
				notes.find("textarea#user_notes").val(v[username]);
				$("div.note:has(a#block)").parent().append(notes);
				$("div.notes_container").css("max-width", "33%");
				$("div.notes_container:first").css("margin-top", "1em");
			});
		} else {
			ldb.get("__notes", function(v) {
				notes.find("textarea#user_notes").val(v[username]);
				$("td:has(div.profilehii) + td div").first().append(notes);
			});
		}
	}
}
