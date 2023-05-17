// OUTSIDE
var remove_follow_menu = function(user_id) {
	$("div#follow_menu").remove();
	$("td#follow_user a.btn.tool_btn").attr("onclick", "make_follow_menu("+user_id+");");
};

var make_follow_menu = function(user_id) {
	let follow_btn = $("td#follow_user a.btn.tool_btn");
	let follow_menu = $(`<div id='follow_menu' style='position: absolute; margin-top: 1rem;'>
		<ul style='text-align: start; list-style: none;'>
			<li>
				<a id='follow_public' class='btn tool_btn' style='color:var(--btn-secondary-text);background:var(--btn-secondary-background-default);' onclick=""></a>
			</li>
			<li>
				<a id='follow_private' class='btn tool_btn' style='color: var(--btn-secondary-text); background: var(--btn-secondary-background-default);' onclick=''></a>
			</li>
		</ul>
	</div>`);
	
	if (follow_btn.attr("title").includes("Follow User")) {
		follow_menu.find('a#follow_public').text('follow publicly').attr("onclick", "if( confirm('Are you sure you want to follow this user?')) {rym.request.post('FollowFollowUser',{user_id:"+user_id+"}, null, 'script');} return false;");
	} else {
		follow_menu.find('a#follow_public').text('unfollow publicly').attr("onclick", "if( confirm('Unfollow this user?')) {rym.request.post('FollowUnfollowUser',{user_id:"+user_id+"}, null, 'script');} return false;");
	}
	
	let u = $("span#profilename").text();
	ldb.get("__pfollow_users", function(v){
		if(v === null){
			follow_menu.find('a#follow_private').attr("onclick", "ldb.set('__pfollow_users', ['"+u+"']);remove_follow_menu("+user_id+");");
		} else {
			if (v.includes(u)) {
				follow_menu.find('a#follow_private').attr("onclick", "ldb.set('__pfollow_users', "+JSON.stringify(v)+".filter(e => e !== '"+u+"'));remove_follow_menu("+user_id+");").text("unfollow privately");
			} else {
				follow_menu.find('a#follow_private').attr("onclick", "ldb.set('__pfollow_users', "+JSON.stringify(v)+".concat(['"+u+"']));remove_follow_menu("+user_id+");").text("follow privately");
			}
		}
	});
	
	follow_btn.parent().append(follow_menu);
	follow_btn.attr("onclick", "remove_follow_menu("+user_id+");");
};

var index_public_follows = function() {
	window.public_follows_usernames = []; 
	window.public_follows.each(function(i, e) {
		window.public_follows_usernames.push(
			$(e).find("a.user").text()
		); 
	}); 
	
	ldb.set("__follows", window.public_follows_usernames);
	ldb.get("__follows", function(v) {
		if (v === null) {
			ldb.set("__follows", []);
			v=[];
		}
		$("span#pf_counter").text("("+JSON.stringify(v.length)+"/"+JSON.stringify(window.public_follows.length)+")");
	});
}

// INSIDE
/*
 * PRIVATE FOLLOWS
 * * * * * * * * * */
// TODO: make this work for films too
// add private follows 2 influence contacts_edit to turn film/music on/off 
 
// adds private follow button on user pages
if (window.location.href.includes("://rateyourmusic.com/~") && false) {
	let user_id = $("td a#block").attr("data-user-id");
	
	var oldfetch = window.fetch;
	window.fetch = async (...args) => {
		const oldresponse = await oldfetch(...args);
		console.log(oldresponse);

		var n = await oldresponse.clone().text()
		.then(body => {
			if (body == "$('#follow_user').html('<a title=\"Follow User\" onClick=\"if( confirm(\\'Are you sure you want to follow this user?\\')) {rym.request.post(\\'FollowFollowUser\\',{user_id:"+user_id+"}, null, \\'script\\');} return false;\" class=\"btn tool_btn\" style=\"\">+</a>');") {
				
				return "$('#follow_user').html('<a title=\"Follow User\" onClick=\"make_follow_menu("+user_id+");\" class=\"btn tool_btn\" style=\"\">+</a>');";
			} else if (body == "$('#follow_user').html('<a title=\"You are following this user; click to unfollow.\" onClick=\"if( confirm(\\'Unfollow this user?\\')) {rym.request.post(\\'FollowUnfollowUser\\',{user_id:"+user_id+"}, null, \\'script\\');} return false;\" class=\"btn tool_btn\" style=\"cursor:pointer;background:var(--gen-blue-dark);;color:var(--mono-f);\">+</a>');") {
				
				return "$('#follow_user').html('<a title=\"You are following this user; click to unfollow.\" onClick=\"make_follow_menu("+user_id+");\" class=\"btn tool_btn\" style=\"cursor:pointer;background:var(--gen-blue-dark);;color:var(--mono-f);\">+</a>')"
			}
			return body;
		}).catch(err => console.error(err));

		return {
			ok: true,
			status: 200,
			text: async () => n
		};
	};

	window.make_follow_menu = make_follow_menu;
	window.remove_follow_menu = remove_follow_menu;
	window.refresh_follow_menu = function(){
		window.remove_follow_menu(user_id);
		window.make_follow_menu(user_id);
	};

	$("td#follow_user a.btn.tool_btn").attr("onclick", "make_follow_menu("+user_id+");");
}

// catching chart requests and modifying them to add private follow influence
// TODO: on chart reload keep settings from previous chart aesthetically
if (window.location.href.includes("://rateyourmusic.com/charts")) {
	window.jQuery.fn.textNodes=function(){return this.contents().filter(function(){return (this.nodeType===Node.TEXT_NODE&&this.nodeValue.trim()!=="");});};
	
	$("#page_chart_query_advanced_users_following").parent().textNodes().last().replaceWith(" I'm following publicly\n");
	$(`<label class="page_chart_query_radio_label">
		<input id="page_chart_query_advanced_users_private_following" type="checkbox"> I'm following privately
	</label>`).insertAfter("label:has(#page_chart_query_advanced_users_following)");
	$(`<br>`).insertAfter("div.advanced_section_option_users");
	
	window.RYMchart.onClickCreateChart = function() {
		ldb.get("__pfollow_users", function(v) {
			if (v === null) {
				ldb.set("__pfollow_users", []);
				v = [];
			}
			
			if ($("#page_chart_query_advanced_users_private_following").is(":checked")) {
				window.RYMchart.state.users_urls = window.RYMchart.state.users_urls.concat(v);
			}

			$("#page_chart_query_error").hide(),
			$.ajax({ url: "/api/1/chart/url/", data: { chart: JSON.stringify(window.RYMchart.state) }, type: "POST", dataType: "json", async: !0 }).done(function (e) {
				if (e.status === "success") {
					//alert(JSON.stringify(e)); // debug line
					window.location = e.url;
				} else {
					window.RYMchart.showErrors(e.errors);
				}
			});
		});
	}
}

// list of privately followed users on friends page
if (window.location.href.includes("://rateyourmusic.com/friends/")) {
	$("span.ookiig").text("Users you follow publicly");
	let private_following_list = $(`<div style="padding:23px;" id="private_following_list">
		<div class="clear"></div>
		<span class="ookiig">Users you follow privately</span>
		<hr noshade="noshade">
		<div class="clear"></div>
	</div>`);
	
	ldb.get("__pfollow_users", function(v) {
		for (i = 0; i < v.length; i++) {
			if (v[i] !== "") {
				private_following_list.append(`<div class="or_card_frame">
					<div class="or_card_frame_inner">
						<span class="card_link">
							<a class="user" href="/~`+v[i]+`">`+v[i]+`</a>
						</span>
					</div>
				</div>`);
			}
		}
	});

	$("div.bubble_content > div:has(span.ookiig)").attr("id", "public_following_list");
	$(`<div class="clear" id="b4pfl"></div>`).insertAfter("div.bubble_content > div:has(span.ookiig)");
	private_following_list.insertAfter("div#b4pfl");
	$(`<div style="padding:10px;"></div>`).insertAfter("#private_following_list");
}

// button to save all public following w influence in ldb
// TODO: catch musical influence on/off requests and change list accordingly automatically
if (window.location.href.includes("://rateyourmusic.com/account/contacts_edit")) {
	window.index_public_follows = index_public_follows;

	$("p.small").wrap(`<div id="v3odk" style="display: flex; justify-content: space-between; width: 90%;"></div>`);
	$("#v3odk").append(`<div><a id="index_public_follows">index public follows </a><span id="pf_counter"></span></div>`);
	
	window.public_follows = $("table.mbgen").last().find("tr:has(img[id^=influence][alt^=on])");
	ldb.get("__follows", function(v) {
		if (v === null) {
			ldb.set("__follows", []);
			v = [];
		}
		
		$("span#pf_counter").text("("+JSON.stringify(v.length)+"/"+JSON.stringify(window.public_follows.length)+")");
	});
	
	$("a#index_public_follows").attr("onclick", "window.index_public_follows();");
}
