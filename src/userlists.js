// OUTSIDE
window.show_lists = function(username, form) {
	ldb.get("__lists", function(lists) {
		listselem = window.generate_lists(username, form, lists);
		switch (form) {
		case "user":
			$(listselem).insertAfter("div#content style:first");
			break;
		case "charts":
			break;
		}	
	});
};

window.generate_lists = function(username, form, lists) {
	switch (form) {
	case "user":
		return `<div class="overlay" id="genre_vote_abuse_banner">
			<div class="abuse_banner">
				<span class="rendered_text">
					<center>
						<h5><b><span class="rendered_text_color">
							<span class="rendered_text_color_inner">edit lists</span>
						</span></b></h5>
					</center>
					<br>
					`+generate_lists("charts")+`
				</span>
				<div style="text-align:center; margin:1.5em;"><a onclick="window.new_list('user', this)" class="btn blue_btn">add list</a>&nbsp;<a onclick="this.parentNode.parentNode.parentNode.remove();" class="btn blue_btn">close</a></div>
			</div>
		</div>`;
	case "charts":
		lists = `<div id="user_lists">`;
		ldb.get("__lists", function(v) {
			if (v === null) v = {};
			for (const [listname, users] of Object.entries(v)) {
				if (form == "user") {
					let item = $(`<div class="user_list_item" onclick="window.toggle_list('`+username+`', '`+form+`', '`+listname+`')">`+listname+`<span class="toggle_mark"></span></div>`);
					if (users.includes(username)) {
						item.find(".toggle_mark").text("✅");
					}
					lists += item;
				}
			}
			lists += "</div>";
		});
		return lists;
	}
	return `<div id="user_lists"></div>`;
};

window.toggle_list = function(username, form, listname) {
	ldb.get("__lists", function(lists) {
		toggled = $("div.user_list_item:contains('"+listname+"') span").text().contains("✅");
		if (toggled) {
			$("div.user_list_item:contains('"+listname+"') span").text("");
			if (form == "user") {
				lists[username] = Array.from(new Set(lists[username].delete(listname)));
				ldb.set("__lists", lists);
			}
		} else {
			$("div.user_list_item:contains('"+listname+"') span").text("✅");
			if (form == "user") {
				lists[username] = Array.from(new Set(lists[username].concat([listname])));
				ldb.set("__lists", lists);
			}
		}
	});
};

// TODO: INPUT APPEARS AS A NEW LIST ITEM, AUTOMATICALLY ADD THE USER OF THE PAGE YR ON
window.new_list = function(form, elem) {
	console.log("didnt make this yet lol lmao haha");
	//$(elem.parentNode.parentNode).append(`<input type="text">`) 
};

// INSIDE // 
if (is_user_page) {
	ldb.get("__lists", function(v) {
		let username = username_from_href();
		if (v === null) v = {};

		$("table.mbgen td#follow_user").after($(`<td>
			<a id="user_lists" class="btn tool_btn" onclick="window.show_lists('`+username+`', 'user');">📋</a>
		</td>`));
	});
}
