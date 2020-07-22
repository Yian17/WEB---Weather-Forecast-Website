#!/bin/bash

# fix js files' style one by one and print the current process
echo "************** Fix style error **************"
eslint="./node_modules/.bin/eslint "
entry_file="./server.js "
js_server_dir="./public/script/js_server"

echo "fixing $entry_file"
$eslint$entry_file"--fix"

for file in `ls $js_server_dir`
do 
	checkfile="$js_server_dir/$file "
	echo "fixing $checkfile"
	$eslint$checkfile"--fix"
done
echo "************** Done **************\n"
exit 0