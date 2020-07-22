#!/bin/bash

#convert all jsx file in $1 to $2, where 
#node_modules/.bin/babel file at $3
if [ $# != 3 ]
then 
	echo "USAGE: jsx_sorce_dir js_dist_dir root_dir"
	exit 1
fi

# check if in put dir end with a '/'
sorce_dir="$1"
if [ ${sorce_dir: -1} != '/' ]
then
	sorce_dir=$sorce_dir"/"
fi

dist_dir="$2"
if [ ${dist_dir: -1} != '/' ]
then
	dist_dir=$dist_dir"/"
fi

root_dir="$3"
if [ ${root_dir: -1} != '/' ]
then
	root_dir=$root_dir"/"
fi

echo '{"presets": ["react"]}' > $root_dir".babelrc"

# echo '{"plugins": ["react-html-attrs"]}' > $root_dir".babelrc"
jsx_files=$sorce_dir"*.jsx"

# recursively convert all jsx files in source_dir 
# to js files in dist_dir
echo "************** Start converting files **************"
for file in `ls $jsx_files`; 
do
	newFile=$dist_dir`basename $file .jsx`".js"
	$root_dir"node_modules/.bin/babel" $file > $newFile
	echo "convert $file to $newFile"
done
echo "************** Done **************\n"
exit 0