# ratingsite-scripts
customizations i use for rym. theyre kind of evil sorry. ive been maintaining these for myself over the past few years so i dont remember everything it does but here's what i notice missing when i use rym without them:

### css
\- most prominently the chart page is reorganized so all the settings are on the right again<br>
\- spoilers are recolored to look better with dark mode<br>
\- lots of resizing / font changes / recoloring like above in general, this is the stuff thats a bit difficult to remember. another example: fixed awkward spacing on userpage notification box notifications<br>
\- genre page descriptions automatically appear fully expanded<br>

### js
\- some styles that were too annoying to do with normal css<br>
\- genre and charts links are switched to how they were arranged before like summer of 2021. i kept clicking genres habitually and got tired of it pretty fast<br>
\- removes featured reviews from release pages. in the future i plan to just move it down if possible but after recently glancing quickly at how theyre implemented it'll probably be more time than it's worth<br>
\- removes rym box set lists. self explanatory<br>

## using these
i used [user javascript and css](https://chrome.google.com/webstore/detail/user-javascript-and-css/nbhcbdghjpllgmfilhnhkllmkecfmpld) on chrome. when i (finally lol) swtiched to firefox i settled with [custom style script](https://addons.mozilla.org/en-US/firefox/addon/custom-style-script). it likely does not matter which one you use as long as you can figure out how (i will not be telling you)

urls for css/js managers that take them:<br>
https://raw.githubusercontent.com/pianoflattened/ratingsite-scripts/main/all.js <br>
https://raw.githubusercontent.com/pianoflattened/ratingsite-scripts/main/style.css <br>

## "i only want some features" <--- what to do if you are this guy
i do not have the time 2 compartamentalize the marginally volumous css but the more evil parts of the javascript stuff is sectioned off and you can use th scripts without those as follows:

- download the repo however you want not super important
- open up `main.js` + the files you want to incorporate in some text editor
- put the parts in the auxiliary files labelled `INSIDE` where it says to do so in `main.js`
- put the parts in the auxiliary files labelled `OUTSIDE` where it says to do so in `main.js`
- paste the result into whatever browser script thing yr using

it is exactly six steps easy, so pretty easy
