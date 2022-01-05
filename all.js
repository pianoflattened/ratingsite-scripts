// https://github.com/DVLP/localStorageDB
!function(){var r,c,e=window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB;e?(c={k:"",v:""},(e=e.open("d2",1)).onsuccess=function(e){r=this.result},e.onerror=function(e){console.error("indexedDB request error"),console.log(e)},e.onupgradeneeded=function(e){r=null,e.target.result.createObjectStore("s",{keyPath:"k"}).transaction.oncomplete=function(e){r=e.target.db}},window.ldb={get:function e(t,n){r?r.transaction("s").objectStore("s").get(t).onsuccess=function(e){e=e.target.result&&e.target.result.v||null,n(e)}:setTimeout(function(){e(t,n)},100)},set:function(e,t,n){c.k=e,c.v=t;let o=r.transaction("s","readwrite");o.oncomplete=function(e){"Function"==={}.toString.call(n).slice(8,-1)&&n()},o.objectStore("s").put(c),o.commit()}}):console.error("indexDB not supported")}();

// jquery
var $ = window.$;

// !! place everything under OUTSIDE here
// idk how i wrote this holy shit
var getBox = function(e, i={}) {
	let nodename = e.parent().nodeName;
	if (i.override) {
		i.override -= 1;
		return getBox(e.parent(), i);
	}
	if (nodename == "B") {
		return getBox(e.parent(), i);	
	} else if (nodename == "TD") {
		let cs = e.parent().attr("colspan");
		if (cs === null) {
			return getBox(e.parentElement, i);
		} else if (cs == "2" || cs == 2) /* lol */ {
			if (i.tabledepth) {
				i.tabledepth += 1;
			} else {
				i.tabledepth = 1;
			}
		} else {
			return getBox(e.parent(), i);
		}
		return getBox(e.parent(), i);
	} else if (nodename == "TABLE") {
		if (i.tabledepth) {
			i.tabledepth -= 1;
			return getBox(e.parent(), i);
		} else {
			return e.parent();
		}
	} else if (nodename == "TR") {
		return getBox(e.parent(), i);
	} else if (nodename == "TBODY") {
		return getBox(e.parent(), i);
	} else if (nodename == "DIV") {
		let classname = e.parent().attr("class");
		if (classname == "list_name") {
			return getBox(e.parent(), i);
		} else if (classname == "list_info") {
			return getBox(e.parent(), i);
		} else if (classname == "page_section_lists_list_image") {
			return getBox(e.parent(), i);
		}
	} else if (nodename == "LI") {
		return e.parent();
	} else {
		return e.parent();
	}
};

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

var update_user_notes = function(username) {
	ldb.get("__notes", function(v) {
		if (v === null) {
			v = {};
		}
		v[username] = $("textarea#user_notes").value;
		ldb.set("__notes", v);
	});
}

var rymboxset = /http(s|):\/\/rateyourmusic.com\/list\/[A-Za-z0-9_]+\/rym[-_](ultimate[-_]|)box[-_]set/;

window.addEventListener('DOMContentLoaded', function() {
	console.log("hey");
	
	/* 
	 * AESTHETIC STUFF
	 * * * * * * * * * */

	// forgot exactly what this is for but im just changing some colors here dont worry too much about it. may be something about the wiki
	$(':root').css('--ui-detail-neutral', '#4a4c52').css('--ui-divider-line', '#4a4c52');
	
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
	
	
	/*
	 * REMOVE RYM BOX SET
	 * * * * * * * * * * */
	if (rymboxset.test(window.location.href)) {
		$(`<div class="overlay" id="genre_vote_abuse_banner">
			<div class="abuse_banner">
				<span class="rendered_text">
					<center>
						<h5>
							<b>
								<span style="color: crimson" class="rendered_text_color">
									<span class="rendered_text_color_inner">
										<i class="fas fa-exclamation-triangle"></i>&nbsp;THIS LIST IS AN RYM ULTIMATE BOX SET LIST&nbsp;<i class="fas fa-exclamation-triangle"></i>
									</span>
								</span>
							</b>
						</h5>
					</center>
					<br>
					gay emo this album is emo and gay and gay, thats all i can say is that its gayemo its gay all of it is gay i saw one of their shows and they are both gay and even more and more they didnt care they just played guitars and let it all out this emo emo...if emo will never die brb i need a fucking drink i fucking love kiwi i hate emo my brother is gay my brother is gay lol x i am on frickin 5.4 emo emo emo gay adn gay and emo. girl i love kiwi but also i fucking love gayx2 so ima be gay cause i fink gayx2 will never die so i must be gay bc i fink gayx2 will never die lol so lets pretend i am not gay..at least for the night oh wait i am gay lol but im still gay also fucking gay emo YEAH!!!!! I LOVE EMO !!!!!!...... 9 times out of 10 it IS emo!!! AND 1 IS gay!!9 times out of 10. FINE 2 IS GAY GET OVER YOURSELVES <3 AND BLESSED YOU ARE!!!I AM GAY AT A GAYFEST FOR THE NIGHT!!!!! <333 SEE YOU IN THE MEADOW <3333 SO BLESSED TO BE A CATHOLIC AND AN EVIL EMO PRIEST SORRY I KNOW THAT SHITI’M REALLY GAY SO NO ONE ELSE MIGHT BABY THAT’S RIGHT NOT BABY YA CAN GET BEER IF YOU ARE GOING TO A GAYFEST IN THE EMO'S CAPITAL BABY WE CAN GET SODA AND EATING SAUSAGES OR A KIND OF OTHER KIND OF FOOD WE JUST GET A CULTURE [MIDWESTY], SORRY MOTHER FUCKER BUT IT’S GAY SO YOU HAVE TO TAKE MY MOM BY THE HAND AND SHOOK HER AROUND AND BECOME OUT OF HER SENSITIVE NORMAL SENSITIVE STATE AND THEN YOU HAVE TO FEED HER A HUGE BURGER AND A SMALL JELLYFISH BUT DONT WE CANT DO THAT? FUCK NO! CANT WE!! FUCKING NAW!!! WE HAVE A NICE DINNER AND THEN WE HAVE TO GO TO A GAYFEST FOR THE NIGHT WHICH IS WAY MORE FUN THAN MY DINNER OR SPAGHETTI AND THEN WE HAVE TO GO TO GAYFEST BECAUSE THE GAYFEST IS WAY MORE FUN THAN MY DINNER IF YOU HAVE A PLACE WHERE YOU LIVE THAT HAS A GAYFEST FOR THE NIGHT THIS IS WHERE I AM ALLOWED BECAUSE I AM ALLOWED BY AUTHORITIES TO GO TO A GAYFEST FOR THE NIGHT BUT YOU NEED TO GO TO MY PLACE THAT HAS A GAYFEST FOR THE NIGHT TO BECAUSE I AM ALLOWED TO GO TO A GAYFEST FOR THE NIGHT ALL BECAUSE IM GAY AND EMO VERY EMO AND IM A TERRIBLE PERSON AND I LIKE TO BLEACH MY BLOOD AND PLACE A KIMONO IN MY BRAIN IN CASE I DELETE IT FOR SUCH REASONS. YOU SILLY IDIOT DUMMY I AM NOT GAY SO BLEACH MY BLOOD AND PLACE A KIMONO IN MY BRAIN IF YOU DO NOT BELIEVE ME THEN TELL SOMEONE IN YOUR COUNTRY THAT WOULD DIE IF YOU TELL THEM EVERY SINGLE SECRET OF YOUR LIFE YOU WILL DIE A HORRIBLE DEATH AND THEN YOU WILL FORGIVE YOUR FELLOW HUMANS FOR NOT BELIEVING YOU THAT I AM GAY AND IM SO EMO THAT WHEN I SAY HORRIBLE DEATH THEY WILL FORGET ALL OF IT BECAUSE I TELL THEM EVERY SECRET OF MY LIFE. IF YOU DO NOT BELIEVE ME OR THINK I AM NOT GAY OR EXIST THE KIND OF GAY THAT EMO HAS NONE TO DO WITH IT IF YOU DO NOT BELIEVE ME THEN TELL SOMEONE IN YOUR COUNTRY THAT I AM GAY AND EXIST THE KIND OF GAY THAT EMO HAS NONE TO DO WITH IT THIS IS HOW IM ALLOWED TO DIE BY AUTHORITIES. I LIKE TO PURPOSEFULLY PURPOSEFULLY POISON MY OWN BLOOD TO BE SURE MY NERVES ARE KILLED AND THEN FIND AN ORPHAN WHO WOULD DIE TOO SO I WOULD HAVE A BOYFRIEND AND TELL HIM EVERY SECRET I HAD EVER KNOWN AND THEN THE PARENT WITH THAT MOTHER FUCKING KID AND HIS MOTHER I WATCHED US KILL THEM TWICE FOR TWO TINY LITTLE FRIES AND EATING A CRUMBLED BOWL OF DOUGHBOARD POTATO KETCHUP AT HIS SCHOOL BECAUSE HE IS GAY AS FUCK AND WHEN I WON THE PARENT GAVE ME THE GAYEST EMO HUG OF MY LIFE IF YOU DONT BELIEVE ME THEN TELL SOMEONE IN YOUR COUNTRY THAT I AM GAY AND IM SO EMO THAT WHEN I SAY HORRIBLE DEATH THEY WILL FORGET ALL OF IT BECAUSE I
				</span>
				<div style="text-align:center; margin:1.5em;">
					<a onclick="this.parentNode.parentNode.parentNode.remove();" class="btn blue_btn">I want to see this list anyway</a>
				</div>
			</div>
		</div>`).insertAfter("div#content style:first");
	}
	if (!window.location.href.includes("://rateyourmusic.com/account/friends/")) {
		$("a").each(function() {
			if (rymboxset.test(this.href)) {
				getBox($(this)).remove();
				console.log("REMOVED RYM BOX SET LIST");
			}
		});
	}
	
	
	/*
	 * REMOVE FEATURED REVIEWS
	 * * * * * * * * * * * * * */
	if (window.location.href.includes("://rateyourmusic.com/release")) {
		$(".review:has(.review_featured)").remove(); // lol maybe move it instead
	}
	
	
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
				<textarea disabled id="user_notes" oninput="window.update_user_notes($('span#profilename').text())"></textarea>
			</div>`);
			
			ldb.get("__notes", function(v) {
				notes.find("textarea#user_notes").value = v[$("span#profilename").text()];
				$("td:has(div.profilehii) + td div").append(notes);
			});
		}
	}


	/*
	 * PRIVATE FOLLOWS
	 * * * * * * * * * */
	// TODO: make this work for films too
	// add private follows 2 influence contacts_edit to turn film/music on/off 
	 
	// adds private follow button on user pages
	if (window.location.href.includes("://rateyourmusic.com/~")) {
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
		
		console.log("usr");
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
				
				if ($("#page_chart_query_advanced_users_private_following").is(":checked");) {
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
});
