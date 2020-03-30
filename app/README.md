# AutoGarcon

How to Run Auto-Garcon App
--------------------------------------
Installing Android Studio
1) Go to the web address https://developer.android.com/studio
2) Download and install Android Studio
2) Follow Android Studio's setup wizard (install any recommended SDK packages).

Loading Code From Github
--------------------------------------
1) Open Android Studio
2) If on the Android Studio Welcome Page, if not go to step 3.
	1) Select "Check out project from Version Control" -> "Git"
2) If in Android Studio and did not do step 2.1.
	1) "File" -> "New" -> "Project from Version Control" -> "GitHub".
4) Enter your github username and password (if have not done so already).
5) In the pop-up enter the url "https://github.com/bricao16/AutoGarcon"
6) Clone
7) Open the Project

Runnning Auto-Garcon App
--------------------------------------
Instructions on how to run from https://developer.android.com/training/basics/firstapp/running-app

### Run on a real device
Set up your device as follows:

    Connect your device to your development machine with a USB cable. If you developed on Windows, you might need to install the appropriate USB driver for your device.
    Perform the following steps to enable USB debugging in the Developer options window:
        Open the Settings app.
        If your device uses Android v8.0 or higher, select System. Otherwise, proceed to the next step.
        Scroll to the bottom and select About phone.
        Scroll to the bottom and tap Build number seven times.
        Return to the previous screen, scroll to the bottom, and tap Developer options.
        In the Developer options window, scroll down to find and enable USB debugging.

Run the app on your device as follows:

    In Android Studio, select your app from the run/debug configurations drop-down menu in the toolbar.
    In the toolbar, select the device that you want to run your app on from the target device drop-down menu.

    Click Run (Green sideways triangle in tool bar)
    Android Studio installs Auto-Garcon on your connected device and starts it.

### Run on an emulator

    In Android Studio, create an Android Virtual Device (AVD) that the emulator can use to install and run your app.
    
    To set up emulator:
    1) Select the drop down emulator menu from the tool bar.
    2) Select Open AVD Manager
    3) Select Create New Device
    4) Select New Hardware Profile
    5) Set Screen Size to 5.2 inches
    6) set resolution to 1080 x 1920
    7) leave everything else the same (can change the name to something if you want)
    8) Finish
    9) Select created device from list of phones
    10) Select Pie as the system image (may require download follow promted steps)
    11) Finish
    
    In the toolbar, select your app from the run/debug configurations drop-down menu.

    From the target device drop-down menu, select the AVD that you want to run your app on.

    Click Run (Green sideways triangle in tool bar)
    Android Studio installs the Auto-Garcon on the AVD and starts the emulator.









<b>File Descriptions</b>
-------------------------------
src/main
* This folder contains all the main components for the Auto-Garcon app.
* It contains...
  1. Java files
  2. Resource files
  3. The Manifest

.gitignore
 * contains all the files needed to ignore

LICENSE.txt
* Apache License needed for the Auto-Garcon app
  
README.md
* This document

build.gradle
* contains configuration options common to all modules

google-services.json
* Was used for testing firebase configurations on initial login attempts
* Enables Google APIs or Firebase services for the application  

proguard-rules.pro
* Rules files to perform compile time optimization for code
