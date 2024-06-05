# CSE416 Team Hornets

===How to run===

1) Populate the database
	A) Ensure MongoDB Community Edition is installed and configured
	B) Open the terminal and cd into the "processing" folder
	C) From there, run "python3 populate_db.py" . This script will read all of the data files and populate your database

2) Run the server
	A) Ensure JDK 21 is installed: https://download.oracle.com/java/21/latest/jdk-21_windows-x64_bin.exe
	B) Open the terminal and cd into the "server" folder
	C) From there, run "./gradlew.bat" . This script will start the Spring server and run it on localhost:8080

3) Run the client
	A) Ensure NodeJS with NPM is installed
	B) Open the terminal and cd into the "web/graphical_user_interface" folder
	C) From there, run "npm install" to download and install all of the client application's dependencies
	D) Then run "npm start" to start the client app . It should automatically open in your browser
