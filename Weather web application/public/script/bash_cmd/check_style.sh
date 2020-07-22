#!/bin/bash

# checking js files' style one by one and print the current process
echo "************** Check style errors **************"
eslint="./node_modules/.bin/eslint "
entry_file="./server.js"
js_server_dir="./public/script/js_server"

echo "checking $entry_file"
$eslint$entry_file

for file in `ls $js_server_dir`
do 
	checkfile="$js_server_dir/$file"
	echo "checking $checkfile"
	$eslint$checkfile
done
echo "************** Done **************\n"
exit 0