**Update npm to latest version:**
sudo npm install npm@latest -g

**Update Node to latest version:**
sudo n stable

## MAKE SURE THESE ARE RAN BEFORE TRYING TO RUN LOCALLY:

`cd cook-frontend`

`yarn`

**This installs dependencies**


## PUSHING THIS REPO TO HEROKU

`heroku git:remote -a autogarcon2`

`cd ./{root of repo}`

```git push heroku `git subtree split --prefix web/cook-frontend master`:master --force```

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Bootstrap documentation

Official docs:

https://react-bootstrap.netlify.com/components/alerts/

Unofficial Spacing docs:

https://mdbootstrap.com/docs/react/utilities/spacing/

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify

### Installation

* Go to [https://github.com/bricao16/AutoGarcon](https://github.com/bricao16/AutoGarcon) and click the green ‘Clone or download’ button on the top right and then click download ZIP

* Open up the folder and click ‘Extract all’ on the top right

* Install [Visual Studio Code](https://code.visualstudio.com/)

* Make sure Node.js is installed by typing **node -v** in terminal (something similar to v.6.9.5 should appear) - if it isn’t installed, install and run the Node.js installer from the Node.js website’s downloads page

* Update npm version by typing: **npm install npm --global**

* Install React by typing in terminal: **npm install -g create-react-app**

* Create react project by typing in terminal: **create-react-app (projectname)**
 
* In AutoGarcon-master file from GitHub, go into the folders: 

  * AutoGarcon-master > web > cook-frontend
  
  * Delete all of the files from the React project that you just created
  
  * Copy and paste all of the files from cook-frontend into React project that you just created <projectname>
 
* Import the following packages to run by using following commands:
 
  * **Npm install react-router-dom**
  
  * **Npm install react-bootstrap**
  
  * **Npm install @material-ui/core**
  
* Run project by typing: 

  * **cd (projectname)**
 
  * **Npm start**

### Heroku Install and Deployment 

* Create a Heroku account if you don’t already have one at [https://signup.heroku.com/trailhead](https://signup.heroku.com/trailhead)

* After logging in, create a new Heroku app by clicking the ‘Create new app’ button 

* Enter in an app name and then click the ‘Create app’ button

* Download and install the Heroku CLI from https://devcenter.heroku.com/articles/heroku-cli

* Open Command Prompt

* Log into your Heroku account by typing in: heroku login into Command Prompt

* Initialize a git repository in a new or existing directory by typing into Command Prompt:

   * **Cd my-project/**
 
   * **Git init**
 
   * **Heroku git:remote -a (heroku-app-name)**

* Commit code to the repository and deploy it to Heroku by typing into Command Prompt:

   * **Git add .**

   * **Git commit -am “update”**

   * **Git push heroku master**

* Open up the app by typing into a web browser:

   * **(heroku-app-name).herokuapp.com** 

