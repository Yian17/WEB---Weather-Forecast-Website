#!/bin/bash

echo "************* Install npm library *************"
npm install
echo "************** Done **************\n"

echo "************* Checking file tree *************"
required_root_dir="./"
required_dir="views public test"
for dir in $required_dir
do
	path="$required_root_dir$dir" 	
	if [ -d "$path" ]
	then
		echo "$path √"
	else
		mkdir $path
		echo "create DIR $path"
	fi
done

required_public_root_dir="./public/"
required_public_dir="data script css img font"
for dir in $required_public_dir
do 	
	path="$required_public_root_dir$dir" 	
	if [ -d "$path" ]
	then
		echo "$path √"
	else
		mkdir $path
		echo "create DIR $path"
	fi
done

required_script_root_dir="./public/script/"
required_script_dir="bash_cmd js_client js_server jsx"
for dir in $required_script_dir
do 	
	path="$required_script_root_dir$dir" 	
	if [ -d "$path" ]
	then
		echo "$path √"
	else
		mkdir $path
		echo "create DIR $path"
	fi
done
echo "************** Done **************\n"

echo "************** Instruction **************"
echo "CHOOSE 'Use a popular style guide', ENTER"
echo "CHOOSE 'Airbnb', ENTER"
echo "PRESS 'y', ENTER"
echo "CHOOSE JavaScript, ENTER"
echo "************** Now **************"
npm run init_lint
echo "************** Done **************\n"

npm run react
npm run lint
npm run fix

echo "************** Running tests **************"
npm test
echo "************** Done **************\n"
# exit 0


















