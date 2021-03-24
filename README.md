# abec
Abstract Bios Evolution Core



## Installation
The **abec** library is a set of tools to use in JavaScript and runs both back-end and front-end, running inside the NodeJS -and web-browser platforms -respectively.

- it can be installed locally on a Linux host via `npm install abec`
- in can be referenced in the browser like this `<script src="./somePathTo/abec.min.js"></scripr>`



## Examples
The full documentation elaborates a lot more than the few examples below, but these should get you up to speed read quick:


### server-side
To create a local file-server:
1. in the host (server) terminal, navigate to the folder you want to host
2. run: `abec host`
3. done .. have a look at the console output, you should see a URL any local network user can access

If you want to have more control over this, have a look in the `/dist/abec` source-code.
The `allReady` event is listened upon, same as shown in client-side, below.


### client-side
Once you've added the **abec** script to your HTML, you can access all its tools when it's ready, like this:
```javascript
listen("allReady").then(popwin("yo mama"));
```

### (more to come)
This section currently under construction, more info to be disclosed, though the library works.
