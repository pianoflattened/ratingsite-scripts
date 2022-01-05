// OUTSIDE
var update_user_notes = function() {
	ldb.get("__notes", function(v) {
		if (v === null) {
			v = {};
		}
		v[$('span#profilename').text()] = $("textarea#user_notes").val();
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
		let notes = $(`<div style="margin: 0 0.5em; display: flex; justify-content: space-between;">
			<span>notes</span>
			<span style="font-weight: bold;">[<a onclick="$('textarea#user_notes').is(':disabled') ? $('textarea#user_notes').removeAttr('disabled') : $('textarea#user_notes').attr('disabled', '');">edit</a>]</span>
		</div>
		<div class="venuebox" style="padding: 0; border: 1px var(--mono-c) solid;">
			<textarea disabled id="user_notes" oninput="window.update_user_notes();"></textarea>
		</div>`);
		
		ldb.get("__notes", function(v) {
			notes.find("textarea#user_notes").val(v[$("span#profilename").text()]);
			$("td:has(div.profilehii) + td div").append(notes);
		});
	}
}
