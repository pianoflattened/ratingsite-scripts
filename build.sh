#!/bin/sh
rm all.js *.min.js
python concat.py
closure -O SIMPLE --js all.js --js_output_file rss-scripts.js
tr -d "\n" < rss-scripts.js > rss-scripts.min.js
rm rss-scripts.js
