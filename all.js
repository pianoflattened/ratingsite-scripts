// https://github.com/DVLP/localStorageDB
!function(){var r,c,e=window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB;e?(c={k:"",v:""},(e=e.open("d2",1)).onsuccess=function(e){r=this.result},e.onerror=function(e){console.error("indexedDB request error"),console.log(e)},e.onupgradeneeded=function(e){r=null,e.target.result.createObjectStore("s",{keyPath:"k"}).transaction.oncomplete=function(e){r=e.target.db}},window.ldb={get:function e(t,n){r?r.transaction("s").objectStore("s").get(t).onsuccess=function(e){e=e.target.result&&e.target.result.v||null,n(e)}:setTimeout(function(){e(t,n)},100)},set:function(e,t,n){c.k=e,c.v=t;let o=r.transaction("s","readwrite");o.oncomplete=function(e){"Function"==={}.toString.call(n).slice(8,-1)&&n()},o.objectStore("s").put(c),o.commit()}}):console.error("indexDB not supported")}();

// jquery
var $ = window.$;

var username_from_href = function() {
	let spl = window.location.href.split("~");
	return spl[spl.length-1].trim();
};

var sleep = function (ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
};

// !! place everything under OUTSIDE here
var make_popup_form = function(title, content, close) {
	return $(`<div class="overlay" id="genre_vote_abuse_banner">
		<div class="abuse_banner" style="max-height: none;">
			<span class="rendered_text" style="line-height: 1.3;">
				<center>
					<h4 style="color: var(--text-primary);">
						<b>
							`+title+`
						</b>
					</h4>
				</center>
				<br>
				`+content+`
			</span>
			<div style="text-align:center; margin:1.5em;">
				<a onclick="this.parentNode.parentNode.parentNode.remove();" class="btn blue_btn">`+close+`</a>
			</div>
		</div>
	</div>`).insertAfter("div#content style:first");
};

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
	 * IMPORT / EXPORT LDB
	 * * * * * * * * * * * */
	/*
									  `--sdsshhss+:``````                                                        
							  ../+shsdddmssyhddNMMNNNNNNmmhysddh:`                                              
						  `./ds+o+sydmNmhdyshdhmNNMMMMMMMMNddNNNNmo-                                            
					   .:yhoo:::hmmy::-````:.-syyhdNmMNMMMMMMMMMNydhd/`                                         
					  :No/. -+-:y:.         ` ``/y/:syhmMMMMMMNm/```:yd+`                                       
					/hyo   `.-.`-  .          .-:/s..`--+hysho+-`     .dh-                                      
				  .yd-`   `.-+/-:.`..` `     `-` ```       ``          `+hyo-                                   
				 :mo`    .-ooyodyyh+o---..``  ``                         `.oN`                                  
			   `+mo    -smyhhymhhMNNmmdhNyys-:shy:`                        `dy`                                 
			  `dh-    /NMMNMMmMMMNMMMMMMMNNMNdNNMN+                        `.ds                                 
			 `+N     -yMMMMMMMMMMMMMMMNMMMMMMMMNMMh.                         .M/                                
			 om-    /MMMMMMMMMMMMNNMMMMNMMMMMMMMMMm/`                         +N/`                              
			-N/    -dMMMMMMMMMMMMNdMMMNMMMMMMMMMMMMMh+.                        +Mm:                             
		   -N+    .mMMMMMMmNMMNdMNymMMMMMMMMMMMMMMMMMMm/                        /Mh                             
		   dy     hMMMMMNdmdmMMNddmmmmMMMMMMMMMMMMMMMMMN:                       oMo                             
		  sm.    sMMMMyyyhssmdhdddydsNmmmNNNNMMMMMMMMMMMNy.                     -N/                             
		 :dh    :MMMMm/.-+:--o+/:so+odhdNMmNmMMMMMMMMMMMMMm:`                    d+                             
		 +N:    hMMMNs-`..`-://+.-::+ohhmNMMMNNNMMMMMMMMMMMMh`                   do                             
		 -M-   .MMMMd+/...``.``.`.::/:+hmNNMNMNNNNNMMMMMMMMMNy.                  od                             
		 -M    +MMmdddoo:``` ```-.`--/oyddsddNNmdmNNMNdMMMMMMMd+                 /m`                            
		 -M`   oMd+h:syo+//.-.-.::-+yhh+/oooosyhsohmdhmNMMMMMMNs`               ./Nm/.                          
		 `M-   sMmy:```..-----/- +:./o+o+:/soyddd/sdNmNMMNMMMMN+-              /mMMmNNh.                        
		  M:   /Nho-`.```````.--`....--/::.-:./:::/+yhmMNMNMMMMm. `           .NMho-+hMd                        
		  do   smd-. `````````-:.-:-:-/-:--/s:+o+oyhhdNNNMMMMMMmysy/`        `dNmho...hM                        
		  +N   dNyo: `--...-..---...-/:--/-://::+syshNNMMMMMMMMMMMMNh+       +mdsydo.`oM.                       
		  `N:  dsy+:--::--::-.-.-.--:/::++osyh/syhmNNMMNMNMMMMMMMMMMMM:      /y+:.+++`/M-                       
		   ds  dNys+::+-++/..-:`..::/:``-/:/oyymodNMNmmdNNNMMNNNNNmNMMd     `h/`   `/-/M-                       
		   :N/ NMN+/:``.`.//o+++`:`./+.-oshmMNMdo/smmhdhmdNdmNdyoosNMMN.    sMy+/  `//.M-                       
			do myhNNmhdyoy/y+:oo-.      `+oMMMNmhoyymmmmdddh:::.smhyMMy-   .MMMs+  .:./M-                       
		   :N: yoMmsoyymNmos:  .:/```      `/++/...-/-.`../:o+sd++h/hd/`   :MMm`  /:`:-M                        
		   +No-:hs      `       `+//-```       -.`-o+oss/``-.o:/s-+ssho`   :NM-   -//dsN                        
			`ym ::.-:/:`         ``.+-.`              ``oy/dM-syy./hdds---sydMy.`  ``/M.                        
			:Mh +Ndo:.`    `::.    `/sh+```         ````..`.++-+o/ymmdmmmNMhhdy:`.`  hM+                        
			.M: `h+`           /d:  ..my+/..``      ` `` ```so/oyy+/sodNdymNdhy:.    dMMh-                      
			oMh: ydoy-`         :s`-y+/.hN++y+/.`` `   ``:/.hNNmmh+o/-hysoy+/oy+`   `NMMMm-                     
			-NMy:-Mmydy-`       /`.mNms`:ymhdNNd+o::..`:shs.hNNho/-y/::/:ys+oso+.` ..NMMMMNhsoo:`               
			 .-/hddmdNmho:`..   ` /NMMmo./mMMmNMmo::./yhmMy+MNMdo:-:-``::s:::/-`...:/MMMMMMMNhNNd:`             
				yNsdhshNMmddy/.   yMMMNdo.-ommdy+..`./hmNhohmdh+..`   . .:/.``:-``/ yMMMMMMMN:oMMMdys+/--`      
				+moo+/smNNmdo//   hMMMMmd+-`.//o---`..`:/.-:/o-`   `    `.:-``. ``--NMMMMMMMd.yMMMMMMMMMNmhy+/-.
				 -hmhyymhhds-:`  :hMMMMMMNdo: ` .-.``     `` ``   `      `-`       oMMMMMMMM- dMMMMNMMMMNMNNMMNm
				  -Myyhshmo:-`  `oymNMMMMMNmd:` :+:.`      ``  ``     ` ``..       dMMMMMMMm.+mMMMMMMMMMNNNMNNMN
				   oN` `.-`-`    :+ydNMNs::---:/dNmh/      ` `..     `  `         sMMMMMMMh..MMMMMMMMMMMMMMNNmmm
				   `sm. ```.      `::oo+`.//+omMMMmh-`     ```--`       `        +MMMMMMM+  hMMMMMMMMNNdyo+:-...
					 dh-              `  `+hhhymMmy+.`       ...`               /NMMMMMM+  -MNMMMMNm+.`         
					  sm`           ` ` ` -/+sydysy-.       `.` `       `      /MMMMMMMo   -mNMdmh+:    ``   -+o
					  `dh`        ./s+yys//oyh+yy/-`:+.`    ```  `            /MMMMMMMd   :-/hmd+`  `..``  yMNNM
					   `sN         ` `..--.    `-odmMms:-   ``               /MmoMMMMy`  .NdNN.``.`--.`  `/NMNNM
						.mo.  `      `    `..-oymNMNmdy-` ```               yMNo.dMN+`   /mMMMo .+s/..  /+oNMMMM
						 -oms.       `:-/oooo+o/os+sddo::....    ``       `hMNd+oMN/     oMMMMd/`       s:+NMMMM
						   -mN         `````..`.:ohmdmddss//-..`         :NMm/:oNN:     -NMhNNyy:-oys+-+hy:`oMMM
						-ohmMMh.            ..-/smNNmNNNNdy+.:` `      -hNNNs:yNN-     .dMNmhosydNMMNs./-`   dMM
					 .+dNMMMMMMN-      ` -./+ydmmMMmmNNMNdy/`        `+NMMh//mMh-     .dmm+/+mNNMMhs--/`   ` oMM
				   .omMMMMNdmMMMNo    -////ymdMMMMMNmmmmhy-         :hMMho:yNMy`     `ymh-`syo+ho:  :o`  -```ooM
				`:yNMMMNdMNmNNMMMM+`  `:+o+shmNNMMNmdhhy..        -hMMNhoodMMh      `/N+:`yds  `   -o`  `.`:+- +
			  ./dmNMMMMMMMMMNmNMMNNy.    `:/oyhmdmh+//-.        -yNMMNhymNMMy.      oNm:`oNh.      :`  `.`-o:  .
			.oddssyNMMMMNMMNhNMMmmMMms-`  .``-:-.-/``         .oNMMMdmNMMMNo` ..   -mMh+:mNo     .     ` ::--`/.
		  -smhmdMMMMMMydMMNo+MMM+dMMNNMh+. `                `:mMMNNNNMMMMM/ `.-`  `dMN:+mMs`    :+   `  :o.`:sM-
		 sNNNNmMMMMNNo.NMm+`mMMNomMMNNMMMm+oo.           `  :NMMMMMMMMMMMo``-/    yMNmosNs`    +d      ..:+hNdmh
	   -hMMNm/mMMMMm//dMd/`oMMN//mMMNNMMMMNyso/`.-`  `-o/-`  .yNMMMMMMMNs``/o.   +MMNsydd:   `:N/    -:`.osyy+/N
	  +NMmmhh+NmsMm/.dMd-`-NMMy sMMMMMNos-       ...sdd.       :mMMMMMMy..ods`  :mMMdsNm:  `..ms    `-.`  :hhym+
	 yMd/-:+hdMy:M-/NdN+``dMMM-.mMMMM/.                         `hMMMdy-.yNo:  .NMMMmNM:.`.`/hm`        .+.-dm/.
	*/
	 
	// nothing fancy
	window.open_rss_settings = function() {
		make_popup_form("rss settings", `<h5 style="color: var(--text-primary);">raw ldb data</h5>
		<p>ldb is where all data necessary for private follows / user notes is stored. the format is somewhat user-readable so if you can figure out whats going on i encourage you to modify your data raw</p>
		<a class="btn blue_btn" onclick="$('textarea#import_ldb').length==0 ? window.make_ldb_field(this, 'window.import_ldb') : $('textarea#import_ldb, textarea#import_ldb+a.btn').remove();">import ldb json</a>
		<br><br>
		<a class="btn blue_btn" onclick="$('textarea#export_ldb').length==0 ? window.make_ldb_field(this, 'window.export_ldb', false) : console.log(); window.export_ldb();">export ldb json</a>`);
	};
	
	window.make_ldb_field = function(e, callback, submit=true) {
		$(e).after($(`<textarea id="`+callback.split(".")[1]+`" style="margin-top: 2px;"></textarea>`));
		if (submit) {
			$(`textarea#`+callback.split(".")[1]).after($(`<a class="btn blue_btn" onclick="`+callback+`();">submit</a>`));
		}
	};
	
	window.import_ldb = function() {
		$("div#import_message").remove();
		let attempt = $("textarea#import_ldb").val();
		if ((n => { // sorry this is ugly
			try {
				JSON.parse(n); return true;
			} catch (e) {
				$("textarea#import_ldb + a").after($(`<div id="import_message">`+e.toString()+`<br><br>`+JSON.stringify(n)+`</div>`));
				return false;
			}
		})(attempt)) {
			try {
				let parsed_json = JSON.parse(attempt);
				console.log(parsed_json);
				for (const [k, v] of Object.entries(parsed_json)) {
					console.log(k, v);
					ldb.set(k, v); // i literally do not care what this is
				}
				$("textarea#import_ldb + a").after($(`<div id="import_message">success!</div>`));
			} catch (e) {
				$("textarea#import_ldb + a").after($(`<div id="import_message">`+e.toString()+`<br><br>`+JSON.stringify(n)+`</div>`));
			}
		}
	};
	
	window.export_ldb = function() { // this will not get you anything beyond __notes, __follows, __pfollow_users
		$("div#export_message").remove();
		
		let ldb_keys = ["__notes", "__follows", "__pfollow_users", "__muted"];
		let read_ldb = function(keys, finish, o={}) {
			let k = keys.shift();
			ldb.get(k, function(v) {
				if (v !== null) o[k] = v;
				if (keys.length < 1) return finish(o);
				return read_ldb(keys, finish, o);
			});
		};
		
		// DISGUSTING
		read_ldb(ldb_keys, function(o) {
			$("textarea#export_ldb").val(JSON.stringify(o));
		});
	};
	
	$("div#header_extended_section div.header_theme_buttons").append($(`<div onclick="window.open_rss_settings();return false;" class="header_theme_button">
		<div class="header_theme_button_label">rss settings</div>
	</div>`));
	$(".header_theme_button").css("width", "33.333333333333333333333%");
	
	
	/*
	 * REMOVE RYM BOX SET
	 * * * * * * * * * * */
	let rymboxset = /http(s|):\/\/rateyourmusic.com\/list\/[A-Za-z0-9_]+\/rym[-_](ultimate[-_]|)box[-_]set/;
	if (rymboxset.test(window.location.href)) {
		let gayemopasta = `gay emo this album is emo and gay and gay, thats all i can say is that its gayemo its gay all of it is gay i saw one of their shows and they are both gay and even more and more they didnt care they just played guitars and let it all out this emo emo...if emo will never die brb i need a fucking drink i fucking love kiwi i hate emo my brother is gay my brother is gay lol x i am on frickin 5.4 emo emo emo gay adn gay and emo. girl i love kiwi but also i fucking love gayx2 so ima be gay cause i fink gayx2 will never die so i must be gay bc i fink gayx2 will never die lol so lets pretend i am not gay..at least for the night oh wait i am gay lol but im still gay also fucking gay emo YEAH!!!!! I LOVE EMO !!!!!!...... 9 times out of 10 it IS emo!!! AND 1 IS gay!!9 times out of 10. FINE 2 IS GAY GET OVER YOURSELVES <3 AND BLESSED YOU ARE!!!I AM GAY AT A GAYFEST FOR THE NIGHT!!!!! <333 SEE YOU IN THE MEADOW <3333 SO BLESSED TO BE A CATHOLIC AND AN EVIL EMO PRIEST SORRY I KNOW THAT SHITI’M REALLY GAY SO NO ONE ELSE MIGHT BABY THAT’S RIGHT NOT BABY YA CAN GET BEER IF YOU ARE GOING TO A GAYFEST IN THE EMO'S CAPITAL BABY WE CAN GET SODA AND EATING SAUSAGES OR A KIND OF OTHER KIND OF FOOD WE JUST GET A CULTURE [MIDWESTY], SORRY MOTHER FUCKER BUT IT’S GAY SO YOU HAVE TO TAKE MY MOM BY THE HAND AND SHOOK HER AROUND AND BECOME OUT OF HER SENSITIVE NORMAL SENSITIVE STATE AND THEN YOU HAVE TO FEED HER A HUGE BURGER AND A SMALL JELLYFISH BUT DONT WE CANT DO THAT? FUCK NO! CANT WE!! FUCKING NAW!!! WE HAVE A NICE DINNER AND THEN WE HAVE TO GO TO A GAYFEST FOR THE NIGHT WHICH IS WAY MORE FUN THAN MY DINNER OR SPAGHETTI AND THEN WE HAVE TO GO TO GAYFEST BECAUSE THE GAYFEST IS WAY MORE FUN THAN MY DINNER IF YOU HAVE A PLACE WHERE YOU LIVE THAT HAS A GAYFEST FOR THE NIGHT THIS IS WHERE I AM ALLOWED BECAUSE I AM ALLOWED BY AUTHORITIES TO GO TO A GAYFEST FOR THE NIGHT BUT YOU NEED TO GO TO MY PLACE THAT HAS A GAYFEST FOR THE NIGHT TO BECAUSE I AM ALLOWED TO GO TO A GAYFEST FOR THE NIGHT ALL BECAUSE IM GAY AND EMO VERY EMO AND IM A TERRIBLE PERSON AND I LIKE TO BLEACH MY BLOOD AND PLACE A KIMONO IN MY BRAIN IN CASE I DELETE IT FOR SUCH REASONS. YOU SILLY IDIOT DUMMY I AM NOT GAY SO BLEACH MY BLOOD AND PLACE A KIMONO IN MY BRAIN IF YOU DO NOT BELIEVE ME THEN TELL SOMEONE IN YOUR COUNTRY THAT WOULD DIE IF YOU TELL THEM EVERY SINGLE SECRET OF YOUR LIFE YOU WILL DIE A HORRIBLE DEATH AND THEN YOU WILL FORGIVE YOUR FELLOW HUMANS FOR NOT BELIEVING YOU THAT I AM GAY AND IM SO EMO THAT WHEN I SAY HORRIBLE DEATH THEY WILL FORGET ALL OF IT BECAUSE I TELL THEM EVERY SECRET OF MY LIFE. IF YOU DO NOT BELIEVE ME OR THINK I AM NOT GAY OR EXIST THE KIND OF GAY THAT EMO HAS NONE TO DO WITH IT IF YOU DO NOT BELIEVE ME THEN TELL SOMEONE IN YOUR COUNTRY THAT I AM GAY AND EXIST THE KIND OF GAY THAT EMO HAS NONE TO DO WITH IT THIS IS HOW IM ALLOWED TO DIE BY AUTHORITIES. I LIKE TO PURPOSEFULLY PURPOSEFULLY POISON MY OWN BLOOD TO BE SURE MY NERVES ARE KILLED AND THEN FIND AN ORPHAN WHO WOULD DIE TOO SO I WOULD HAVE A BOYFRIEND AND TELL HIM EVERY SECRET I HAD EVER KNOWN AND THEN THE PARENT WITH THAT MOTHER FUCKING KID AND HIS MOTHER I WATCHED US KILL THEM TWICE FOR TWO TINY LITTLE FRIES AND EATING A CRUMBLED BOWL OF DOUGHBOARD POTATO KETCHUP AT HIS SCHOOL BECAUSE HE IS GAY AS FUCK AND WHEN I WON THE PARENT GAVE ME THE GAYEST EMO HUG OF MY LIFE IF YOU DONT BELIEVE ME THEN TELL SOMEONE IN YOUR COUNTRY THAT I AM GAY AND IM SO EMO THAT WHEN I SAY HORRIBLE DEATH THEY WILL FORGET ALL OF IT BECAUSE I`;
		make_popup_form(`<span style="color: crimson" class="rendered_text_color">
			<span class="rendered_text_color_inner">
				<i class="fas fa-exclamation-triangle"></i>&nbsp;THIS LIST IS AN RYM ULTIMATE BOX SET LIST&nbsp;<i class="fas fa-exclamation-triangle"></i>
			</span>
		</span>`, gayemopasta, "I want to see this list anyway");
	}
	
	if (!window.location.href.includes("://rateyourmusic.com/account/friends/")) {
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
		window.update_user_notes = function(user_id) {
			ldb.get("__notes", function(v) {
				if (v === null) {
					v = {};
				}
				v[user_id] = $("textarea#user_notes").val();
				ldb.set("__notes", v);
			});
		};
		
		if ($("div#allNotifications").length == 0) {
			let user_id = $("a#block").attr("data-user-id");
			let notes = $(`<div class="notes_container" style="margin: 0 0.5em; display: flex; justify-content: space-between;">
				<span>notes</span>
				<span style="font-weight: bold;">[<a onclick="$('textarea#user_notes').is(':disabled') ? $('textarea#user_notes').removeAttr('disabled') : $('textarea#user_notes').attr('disabled', '');">edit</a>]</span>
			</div>
			<div class="venuebox notes_container" style="padding: 0; border: 1px var(--mono-c) solid;">
				<textarea disabled id="user_notes" oninput="window.update_user_notes('`+user_id+`');"></textarea>
			</div>`);
			
			if ($("div.note:has(a#block)").length >= 1) {
				ldb.get("__notes", function(v) {
					notes.find("textarea#user_notes").val(v[user_id]);
					$("div.note:has(a#block)").parent().append(notes);
					$("div.notes_container").css("max-width", "33%");
					$("div.notes_container:first").css("margin-top", "1em");
				});
			} else {
				ldb.get("__notes", function(v) {
					notes.find("textarea#user_notes").val(v[user_id]);
					$("td:has(div.profilehii) + td div").first().append(notes);
				});
			}
		}
	}
	
	/* 
	 * MUTING USERS / COMMENT BOXES 
	 * * * * * * * * * * * * * * * */
	 
	window.mute_user = function(from, user) {
		if (from == "comment") {
			if (confirm("mute "+user+"?")) {
				ldb.get("__muted", function(v) {
					if (v === null) v = [];
					ldb.set("__muted", v.concat($(user)));
					$(".comment:has(.comment_header a.user:contains('"+user+"'))").remove();
				});
			}
		} else if (from == "user") {
			if (confirm("mute "+user+"?")) {
				ldb.get("__muted", function(v) {
					if (v === null) v = [];
					ldb.set("__muted", v.concat($(user)));
					$("a#mute_user").css({
						background: "var(--ui-detail-primary)",
						color: "var(--text-white)"
					}).attr("onclick", "window.unmute_user("+JSON.stringify(user)+")");
				});
			}
		}
	};
	
	window.unmute_user = function(user) {
		if (confirm("unmute "+user+"?")) {
			ldb.get("__muted", function(v) {
				ldb.set("__muted", v.filter(e => e != user));
				$("a#mute_user").attr("style", "");
			});
		}
	}
	
	if (window.location.href.includes("://rateyourmusic.com/release/")) {
		ldb.get("__muted", function(v) {
			if (v === null) v = [];
			
			$(".comment:has(.comment_header a.user)").each(function() {
				let username = $(this).find(".comment_header a.user").text();
				if (v.includes(username)) {
					$(this).remove();
				} else {
					$(this).find(".comment_mod").append($(`<span onclick="window.mute_user('comment', `+JSON.stringify(username)+`)" class="icon-outline">🔇</span>`));
				}
			});
		});
	}
	
	// background:var(--ui-detail-primary);color:var(--text-white);
	if (window.location.href.includes("://rateyourmusic.com/~")) {
		let username = username_from_href();
		
		ldb.get("__muted", function(v) {
			$("td#follow_user").after($(`<td>
				<a id="mute_user" class="btn tool_btn" onclick="window.mute_user('user', `+JSON.stringify(username)+`);">🔇</a>
			</td>`));
			
			if (v.includes(username)) {
				$("a#mute_user").css({
					background: "var(--ui-detail-primary)",
					color: "var(--text-white)"
				});
			}
		});
	}


	/*
	 * PRIVATE FOLLOWS
	 * * * * * * * * * */
	// TODO: make this work for films too
	// add private follows 2 influence contacts_edit to turn film/music on/off
	// page cataloguing - check rates below, see if any of them are private follows, highlight accordingly + incorporate rating into average
	
	// THIS BREAKS IF ANYONE CHANGES USERNAMES - COME UP WITH A WAY TO FIX THIS
	// MAYBE STORE USERNAMES WITH IDS AND THEN IF A USERPAGE IS VISITED (SINCE URLS WILL WORK FROM TH FOLLOWING SECTION OF THE SITE W THE SAME NAME) AND THE ID MATCHES BUT NOT THE USERNAME THE USERNAME CHANGES
	// GOOD IDEA
	// get username from url not page
	// think i fixed this
	 
	// adds private follow button on user pages. second condition is in case redirects ruin it potentially
	if (window.location.href.includes("://rateyourmusic.com/~") && $("a#block").length >= 1) {
		let user_id = $("a#block").attr("data-user-id");
		let username = username_from_href();
		
		if ($("div.note:has(a#block)").length >= 1) {
			$("div.note a#block").after($(`<a id='follow_private' class='btn tool_btn' style='color: var(--btn-secondary-text); background: var(--btn-secondary-background-default);' onclick='window.toggle_private_follow(`+JSON.stringify(user_id)+`, `+JSON.stringify(username)+`, true);'></a>`));
			
			ldb.get("__pfollow_users", function(v){
				if (!v.blocked.hasOwnProperty(user_id)) {
					v.blocked[user_id] = username;
					ldb.set("__pfollow_users", v);
					// tell user to set a proxy user. rn its hardcoded to be flybluebirdfly. if yr not banned from making multiple accs you can set it to an alt
				}
				
				if (v === null || !v.hasOwnProperty(user_id)) {
					$('a#follow_private').text("follow privately");
				} else {
					$('a#follow_private').text("unfollow privately");
				}
			});
		} else {
			window.make_follow_menu = function(user_id) {
				let follow_btn = $("td#follow_user a.btn.tool_btn");
				let username = username_from_href();
				let follow_menu = $(`<div id='follow_menu' style='position: absolute; margin-top: 1rem;'>
					<ul style='text-align: start; list-style: none;'>
						<li>
							<a id='follow_public' class='btn tool_btn' style='color:var(--btn-secondary-text);background:var(--btn-secondary-background-default);' onclick=""></a>
						</li>
						<li>
							<a id='follow_private' class='btn tool_btn' style='color: var(--btn-secondary-text); background: var(--btn-secondary-background-default);' onclick='window.toggle_private_follow(`+JSON.stringify(user_id)+`, `+JSON.stringify(username)+`);window.remove_follow_menu(`+user_id+`);'></a>
						</li>
					</ul>
				</div>`);
				
				if (follow_btn.attr("title").includes("Follow User")) {
					follow_menu.find('a#follow_public').text('follow publicly').attr("onclick", "if( confirm('Are you sure you want to follow this user?')) {rym.request.post('FollowFollowUser',{user_id:"+user_id+"}, null, 'script');} return false;");
				} else {
					follow_menu.find('a#follow_public').text('unfollow publicly').attr("onclick", "if( confirm('Unfollow this user?')) {rym.request.post('FollowUnfollowUser',{user_id:"+user_id+"}, null, 'script');} return false;");
				}
				
				ldb.get("__pfollow_users", function(v){
					if (v === null || !Object.keys(v).includes(JSON.stringify(user_id))) {
						follow_menu.find('a#follow_private').text("follow privately");
					} else {
						follow_menu.find('a#follow_private').text("unfollow privately");
					}
				});
				
				follow_btn.parent().append(follow_menu);
				follow_btn.attr("onclick", "remove_follow_menu("+user_id+");");
			};
			window.remove_follow_menu = function(user_id) {
				$("div#follow_menu").remove();
				$("td#follow_user a.btn.tool_btn").attr("onclick", "make_follow_menu("+user_id+");");
			};
			
			window.refresh_follow_menu = function(){
				window.remove_follow_menu(user_id);
				window.make_follow_menu(user_id);
			};
			
			window.toggle_private_follow = function(user_id, username, blocked=false) {
				ldb.get("__pfollow_users", function(v) {
					if (v === null) {
						v = {};
					}
					
					if (v.hasOwnProperty(user_id)) {
						// gross!
						v = Object.fromEntries(Object.entries(v).filter(([k]) => k != user_id));
					} else {
						v[user_id] = username;
					}
					
					if (blocked) {
						if (!v.hasOwnProperty("blocked")) {
							v.blocked = {};
						}
						
						if (v.blocked.hasOwnProperty(user_id)) {
							v.blocked = Object.fromEntries(Object.entries(v.blocked).filter(([k]) => k != user_id));
							$('a#follow_private').text("follow privately");
						} else {
							v.blocked[user_id] = username;
							$('a#follow_private').text("unfollow privately");
						}
					}
					
					ldb.set("__pfollow_users", v);
				});
			};
			
			ldb.get("__pfollow_users", function(v) { // perhaps i should make this more efficient than loading all the fucking private follows to test one. but i dont want to learn indexeddb so that would necessitate some really ugly syntax. oh well
				if (v[user_id] != username && v.hasOwnProperty(user_id)) {
					v[user_id] = username; // name changes happen + break charts
				}
			
				// sorry
				let follow_resp = "$('#follow_user').html('<a title=\"Follow User\" onClick=\"if( confirm(\\'Are you sure you want to follow this user?\\')) {rym.request.post(\\'FollowFollowUser\\',{user_id:"+user_id+"}, null, \\'script\\');} return false;\" class=\"btn tool_btn\" style=\"\">+</a>');";
				let unfollow_resp = "$('#follow_user').html('<a title=\"You are following this user; click to unfollow.\" onClick=\"if( confirm(\\'Unfollow this user?\\')) {rym.request.post(\\'FollowUnfollowUser\\',{user_id:"+user_id+"}, null, \\'script\\');} return false;\" class=\"btn tool_btn\" style=\"cursor:pointer;background:var(--gen-blue-dark);;color:var(--mono-f);\">+</a>');";
				
				var oldfetch = window.fetch;
				window.fetch = async (...args) => {
					const oldresponse = await oldfetch(...args);
					console.log(oldresponse);

					var n = await oldresponse.clone().text()
					.then(body => {
						// shorten this sometime
						if (body == follow_resp) {
							return "$('#follow_user').html('<a title=\"Follow User\" onClick=\"make_follow_menu("+user_id+");\" class=\"btn tool_btn\" style=\"\">+</a>');";
						} else if (body == unfollow_resp) {
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
				
				$("td#follow_user a.btn.tool_btn").attr("onclick", "make_follow_menu("+user_id+");");
			});
		}
	}
	
	// catching chart requests and modifying them to add private follow influence
	// TODO: on chart reload keep settings from previous chart aesthetically
	if (window.location.href.includes("://rateyourmusic.com/charts")) {
		window.jQuery.fn.textNodes=function(){return this.contents().filter(function(){return (this.nodeType===Node.TEXT_NODE&&this.nodeValue.trim()!=="");});};
		
		let createchart_ajax = function(is_private_following) {
			$("#page_chart_query_error").hide(),
			$.ajax({ url: "/api/1/chart/url/", data: { chart: JSON.stringify(window.RYMchart.state) }, type: "POST", dataType: "json", async: !0 }).done(function (e) {
				if (e.status === "success") {
					//alert(JSON.stringify(e)); // debug line
					window.location = e.url;
				} else {
					window.RYMchart.showErrors(e.errors);
				}
			});
		};
		
		$("#page_chart_query_advanced_users_following").parent().textNodes().last().replaceWith(" I'm following publicly\n");
		$(`<label class="page_chart_query_radio_label">
			<input id="page_chart_query_advanced_users_private_following" type="checkbox"> I'm following privately
		</label>`).insertAfter("label:has(#page_chart_query_advanced_users_following)");
		$(`<br>`).insertAfter("div.advanced_section_option_users");
		
		window.RYMchart.onClickCreateChart = function() {
			let is_private_following = $("#page_chart_query_advanced_users_private_following").is(":checked");
			
			ldb.get("__pfollow_users", function(u) {
				if (u === null) {
					ldb.set("__pfollow_users", {});
					u = {};
				}
				
				console.log(u);
				let {blocked, ...v} = u;
				// exclude blocked users from chart (it will not work if you include them)
				v = Object.values(v).filter(function (e){
					console.log(e);
					console.log(Object.values(blocked));
					return Object.values(blocked).indexOf(e) <= -1
				});
				console.log(v);
				
				if (is_private_following) {
					if (window.RYMchart.state.users_following) {
						ldb.get("__follows", function(w) {
							if (w === null) {
								ldb.set("__follows", []);
								w = [];
							}

							createchart_ajax(is_private_following);
						});
					} else {
						window.RYMchart.state.users_urls = window.RYMchart.state.users_urls.concat(v);
						createchart_ajax(is_private_following);
					}
				} else {
					createchart_ajax(is_private_following);
				}
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
		
		ldb.get("__pfollow_users", function(u) {
			if (u === null) {
				ldb.set("__pfollow_users", {});
				u = {};
			}
			let v = Object.values(u);
			
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
		window.index_public_follows = function() {
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
		};

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
	
	// pfollow rates
	// add rss setting to turn this off
	if (window.location.href.includes("://rateyourmusic.com/release/") && false) { // will continue working on this later i do not want to do this rn
		$("div.section_catalog span.navspan").wrapInner($(`<div style="display:flex;justify-content:space-between;"><div id="release_navbuttons"></div></div>`));
		$("div#release_navbuttons").before($(`<a class="navlinknext" id="index_rates" style="width:fit-content;" onclick="window.index_rates();">index rates</a>`));
		
		let old_navCatalog = window.RYMmediaPage.navCatalog;
		// resp looks like this:
		/*
		 * document.getElementById('catalog_list').innerHTML = '<span class="navspan"><a class="navlinkprev" href="javascript:RYMmediaPage.navCatalog(\'l\', 2529590, true, \'ratings\', \'/1\');">&lt;&lt;</a><span class="navpage">Page </span> <a class="navlinknum" href = "javascript:RYMmediaPage.navCatalog(\'l\', 2529590, true, \'ratings\', \'/1\');">1</a> <span class="navlinkcurrent">2</span></span> <div class="catalog_line  "><div class="catalog_date"><div class="catalog_date_inner" id="catalog_date_inner_l_2529590">2 Jan 2018</div></div>\n               <div class="catalog_header "><div class="lazyload" data-bkg="//e.snmc.io/i/25/s/09424c94b8f8690db20a5458aca18070/8362691" style="float:left;margin-right:7px;display:inline-block;border-radius:3px;width:25px;height:25px; center no-repeat;background-size:cover;background-color:var(--mono-0);"></div>\n                  <span class="catalog_user"> <a class="user" href = "/~mondegreenn">mondegreenn</a></span>\n                  <span class="catalog_ownership">&nbsp;</span><span class="catalog_no_track_ratings"></span><span class="catalog_rating"><img src = "//e.snmc.io/2.5/img/images/3m.png" width="90" height="16" style="border:0;" alt="1.50 stars" title="1.50 stars" /></span>\n                  <span class="catalog_rating_system_comment hide-for-small"></span>\n               </div>\n         <div style="clear:both;"></div></div><div class="catalog_line  "><div class="catalog_date"><div class="catalog_date_inner" id="catalog_date_inner_l_2529590">8 Nov 2017</div></div>\n               <div class="catalog_header "><div class="lazyload" data-bkg="//e.snmc.io/i/25/s/8919d8932d7e73c1665cd3863732ea7d/7902758" style="float:left;margin-right:7px;display:inline-block;border-radius:3px;width:25px;height:25px; center no-repeat;background-size:cover;background-color:var(--mono-0);"></div>\n                  <span class="catalog_user"> <a class="user" href = "/~BrothermanTrill">BrothermanTrill</a></span>\n                  <span class="catalog_ownership">&nbsp;</span><span class="catalog_no_track_ratings"></span><span class="catalog_rating"><img src = "//e.snmc.io/2.5/img/images/5m.png" width="90" height="16" style="border:0;" alt="2.50 stars" title="2.50 stars" /></span>\n                  <span class="catalog_rating_system_comment hide-for-small"></span>\n               </div>\n         <div style="clear:both;"></div></div><div class="catalog_line  "><div class="catalog_date"><div class="catalog_date_inner" id="catalog_date_inner_l_2529590">17 Aug 2015</div></div>\n               <div class="catalog_header "><div class="lazyload" data-bkg="//e.snmc.io/i/25/s/a445f43bf9913940fe0e91d885657fae/6965048" style="float:left;margin-right:7px;display:inline-block;border-radius:3px;width:25px;height:25px; center no-repeat;background-size:cover;background-color:var(--mono-0);"></div>\n                  <span class="catalog_user"> <a class="user" href = "/~moltenhorror">moltenhorror</a></span>\n                  <span class="catalog_ownership">Digital</span><span class="catalog_no_track_ratings"></span><span class="catalog_rating"><img src = "//e.snmc.io/2.5/img/images/6m.png" width="90" height="16" style="border:0;" alt="3.00 stars" title="3.00 stars" /></span>\n                  <span class="catalog_rating_system_comment hide-for-small"></span>\n               </div>\n         <div style="clear:both;"></div></div><div class="catalog_line  "><div class="catalog_date"><div class="catalog_date_inner" id="catalog_date_inner_l_2529590">9 Jun 2015</div></div>\n               <div class="catalog_header "><div class="lazyload" data-bkg="//e.snmc.io/i/25/s/46df99a0e79402404971746d325bd6e2/6275546" style="float:left;margin-right:7px;display:inline-block;border-radius:3px;width:25px;height:25px; center no-repeat;background-size:cover;background-color:var(--mono-0);"></div>\n                  <span class="catalog_user"> <a class="user" href = "/~puntugruhm">puntugruhm</a></span>\n                  <span class="catalog_ownership">&nbsp;</span><span class="catalog_no_track_ratings"></span><span class="catalog_rating"><img src = "//e.snmc.io/2.5/img/images/2m.png" width="90" height="16" style="border:0;" alt="1.00 stars" title="1.00 stars" /></span>\n                  <span class="catalog_rating_system_comment hide-for-small">X</span>\n               </div>\n         <div style="clear:both;"></div></div><div class="catalog_line  "><div class="catalog_date"><div class="catalog_date_inner" id="catalog_date_inner_l_2529590">19 Aug 2013</div></div>\n               <div class="catalog_header "><div class="lazyload" data-bkg="//e.snmc.io/i/25/s/4d280365d9f8a8ee6c20d674576e4a76/3990993" style="float:left;margin-right:7px;display:inline-block;border-radius:3px;width:25px;height:25px; center no-repeat;background-size:cover;background-color:var(--mono-0);"></div>\n                  <span class="catalog_user"> <a class="user" href = "/~wackydelly">wackydelly</a></span>\n                  <span class="catalog_ownership">&nbsp;</span><span class="catalog_no_track_ratings"></span><span class="catalog_rating"><img src = "//e.snmc.io/2.5/img/images/5m.png" width="90" height="16" style="border:0;" alt="2.50 stars" title="2.50 stars" /></span>\n                  <span class="catalog_rating_system_comment hide-for-small">Rhonda&#39;s Glasses</span>\n               </div>\n         <div style="clear:both;"></div></div><div class="catalog_line  "><div class="catalog_date"><div class="catalog_date_inner" id="catalog_date_inner_l_2529590">26 Apr 2012</div></div>\n               <div class="catalog_header "><div class="lazyload" data-bkg="//e.snmc.io/i/25/s/3750a990c9433b93472b593f00ec95e6/8209531" style="float:left;margin-right:7px;display:inline-block;border-radius:3px;width:25px;height:25px; center no-repeat;background-size:cover;background-color:var(--mono-0);"></div>\n                  <span class="catalog_user"> <a class="user" href = "/~blacklizard">blacklizard</a></span>\n                  <span class="catalog_ownership">Owned</span><span class="catalog_no_track_ratings"></span><span class="catalog_rating"><img src = "//e.snmc.io/2.5/img/images/5m.png" width="90" height="16" style="border:0;" alt="2.50 stars" title="2.50 stars" /></span>\n                  <span class="catalog_rating_system_comment hide-for-small">Poco interessante (5)</span>\n               </div>\n         <div style="clear:both;"></div></div><div class="catalog_line  "><div class="catalog_date"><div class="catalog_date_inner" id="catalog_date_inner_l_2529590">7 Oct 2011</div></div>\n               <div class="catalog_header "><div style="float:left;margin-right:7px;width:25px;height:25px;border-radius:3px;background:var(--mono-d8)"></div>\n                  <span class="catalog_user"> <a class="user" href = "/~fetalape">fetalape</a></span>\n                  <span class="catalog_ownership">Owned</span><span class="catalog_no_track_ratings"></span><span class="catalog_rating"><img src = "//e.snmc.io/2.5/img/images/1m.png" width="90" height="16" style="border:0;" alt="0.50 stars" title="0.50 stars" /></span>\n                  <span class="catalog_rating_system_comment hide-for-small"></span>\n               </div>\n         <div style="clear:both;"></div></div><div class="catalog_line  "><div class="catalog_date"><div class="catalog_date_inner" id="catalog_date_inner_l_2529590">1 Oct 2011</div></div>\n               <div class="catalog_header "><div class="lazyload" data-bkg="//e.snmc.io/i/25/s/20cb74ef7f1b0ea8ae5a0f92ee5934bd/5776876" style="float:left;margin-right:7px;display:inline-block;border-radius:3px;width:25px;height:25px; center no-repeat;background-size:cover;background-color:var(--mono-0);"></div>\n                  <span class="catalog_user"> <a class="user" href = "/~Eye_Shaking_King">Eye_Shaking_King</a></span>\n                  <span class="catalog_ownership">Cassette</span><span class="catalog_no_track_ratings"></span><span class="catalog_rating"><img src = "//e.snmc.io/2.5/img/images/4m.png" width="90" height="16" style="border:0;" alt="2.00 stars" title="2.00 stars" /></span>\n                  <span class="catalog_rating_system_comment hide-for-small">❀ | listenable</span>\n               </div>\n         <div style="clear:both;"></div></div><div class="catalog_line  "><div class="catalog_date"><div class="catalog_date_inner" id="catalog_date_inner_l_2529590">23 May 2011</div></div>\n               <div class="catalog_header "><div class="lazyload" data-bkg="//e.snmc.io/i/25/s/b4412d280a32b2496913e2e471dba587/8705069" style="float:left;margin-right:7px;display:inline-block;border-radius:3px;width:25px;height:25px; center no-repeat;background-size:cover;background-color:var(--mono-0);"></div>\n                  <span class="catalog_user"> <a class="user" href = "/~Bitchfork">Bitchfork</a></span>\n                  <span class="catalog_ownership">Digital</span><span class="catalog_no_track_ratings"></span><span class="catalog_rating"><img src = "//e.snmc.io/2.5/img/images/1m.png" width="90" height="16" style="border:0;" alt="0.50 stars" title="0.50 stars" /></span>\n                  <span class="catalog_rating_system_comment hide-for-small"></span>\n               </div>\n         <div style="clear:both;"></div></div><div class="catalog_line  "><div class="catalog_date"><div class="catalog_date_inner" id="catalog_date_inner_l_2529590">16 Nov 2009</div></div>\n               <div class="catalog_header "><div class="lazyload" data-bkg="//e.snmc.io/i/25/s/12de0dba23ae7c6affb3e553ec6d53f0/3528398" style="float:left;margin-right:7px;display:inline-block;border-radius:3px;width:25px;height:25px; center no-repeat;background-size:cover;background-color:var(--mono-0);"></div>\n                  <span class="catalog_user"> <a class="user" href = "/~iskra1903">iskra1903</a></span>\n                  <span class="catalog_ownership">Owned</span><span class="catalog_no_track_ratings"></span><span class="catalog_rating"><img src = "//e.snmc.io/2.5/img/images/6m.png" width="90" height="16" style="border:0;" alt="3.00 stars" title="3.00 stars" /></span>\n                  <span class="catalog_rating_system_comment hide-for-small">SV Waldhof Mannheim</span>\n               </div>\n         <div style="clear:both;"></div></div><div class="catalog_line  "><div class="catalog_date"><div class="catalog_date_inner" id="catalog_date_inner_l_2529590">8 Nov 2009</div></div>\n               <div class="catalog_header "><div class="lazyload" data-bkg="//e.snmc.io/i/25/s/8a4e5f20fe08109bd0e8d457c1eccfee/9607885" style="float:left;margin-right:7px;display:inline-block;border-radius:3px;width:25px;height:25px; center no-repeat;background-size:cover;background-color:var(--mono-0);"></div>\n                  <span class="catalog_user"> <a class="user" href = "/~AntiWarhol">AntiWarhol</a></span>\n                  <span class="catalog_ownership">Digital</span><span class="catalog_no_track_ratings"></span><span class="catalog_rating"><img src = "//e.snmc.io/2.5/img/images/1m.png" width="90" height="16" style="border:0;" alt="0.50 stars" title="0.50 stars" /></span>\n                  <span class="catalog_rating_system_comment hide-for-small">gossip, addiction, self-denial</span>\n               </div>\n         <div style="clear:both;"></div></div><div class="catalog_line  "><div class="catalog_date"><div class="catalog_date_inner" id="catalog_date_inner_l_2529590">9 Oct 2009</div></div>\n               <div class="catalog_header "><div class="lazyload" data-bkg="//e.snmc.io/i/25/s/75a4959f28a6ad016363824f857651a0/7127729" style="float:left;margin-right:7px;display:inline-block;border-radius:3px;width:25px;height:25px; center no-repeat;background-size:cover;background-color:var(--mono-0);"></div>\n                  <span class="catalog_user"> <a class="user" href = "/~ZSRR">ZSRR</a></span>\n                  <span class="catalog_ownership">Digital</span><span class="catalog_no_track_ratings"></span><span class="catalog_rating"><img src = "//e.snmc.io/2.5/img/images/5m.png" width="90" height="16" style="border:0;" alt="2.50 stars" title="2.50 stars" /></span>\n                  <span class="catalog_rating_system_comment hide-for-small"></span>\n               </div>\n         <div style="clear:both;"></div></div>'; refreshLazyLoadList()
		 * */

		window.index_rates = async function() {
			let ratepages = parseInt($("div#release_navbuttons a.navlinknext").prev().text());
			let release_id = parseInt($("div.album_title input.album_shortcut").val().split("[Album")[1].slice(0, -1));
			
			ldb.get("__pfollow_users", function(u) {
				let first = true;
				let {blocked, ...v} = u;
				
				Array(ratepages).fill(0).map(function(_, i) {
					if (!(parseInt($("span.navlinkcurrent").text()) == i+1)) {
						// dont careif this breaks if i did this wrong i am not getting banned
						//RYMmediaPage.navCatalog('l', release_id, true, 'ratings', '/'+JSON.stringify(i+1));
						// i have to wait for the response here - maybe just watch the page for an update like a user would
						// google this
						await sleep(Math.random(21, 67));
					}
					$("div.catalog_line:not(:has(div.catalog_header.friend))").each(function(_, e) {
						if (!$(e).is(".my_rating")) {
							if (Object.values(v).indexOf($(e).find("a.user").text()) <= -1) {
								// probably need to make a second section for pfollow rates. fine
							}
						}
						await sleep(Math.random(21, 67));
					});
					first = false;
				});
			});
		}
	}
});
