# Shortly: Deployment

> In this sprint, you will learn about basic deployment and various build tools.
> The tools and techniques you gain experience with here will allow you to kick off your group projects with a bang.

> Deployment, at times, can be really painful.
> In particular, deployment bugs often take longer cycles to investigate than local code, which can feel very frustrating, and, deployment bugs may often feel like they are just nuances to someone else's tools that they did not take the time to document well.
> This is in fact often true, but it comes with the territory, and learning to enjoy the perhaps slower-seeming process will help you develop a set of tools that gives you tremendous power as an engineer.

> In the spirit of deployment you will find many of the instructions given at a rather high level.
> It will be up to you and your pair to orient and figure out the details of how to do what needs doing.

## Table of Contents

1. [High level goals of this sprint](#high-level-goals-of-this-sprint)
1. [Bare minimum requirements](#bare-minimum-requirements)
    1. [Learn Heroku](#learn-heroku)
    1. [Orientation to Deploying Shortly on DigitalOcean](#orientation-to-deploying-shortly-on-digitalocean)
    1. [Tests](#tests)
    1. [Get your code ready for deployment](#get-your-code-ready-for-deployment)
    1. [Create a DigitalOcean account](#create-a-digitalocean-account)
    1. [Build a MEAN stack DigitalOcean droplet](#build-a-mean-stack-digitalocean-droplet)
    1. [Pull your shortly-deploy repo into your droplet](#pull-your-shortly-deploy-repo-into-your-droplet)
    1. [PM2](#pm2)
    1. [Create a Gruntfile](#create-a-gruntfile)
    1. [Refactor your database](#refactor-your-database)
1. [Advanced Content](#advanced-content)
    1. [Refactor server to use promises](#refactor-server-to-use-promises)
    1. [Use another cloud service](#use-another-cloud-service)
1. [Nightmare Mode](#nightmare-mode)
    1. [Docker](#docker)

## High level goals of this sprint

  - Learn how to deploy on Heroku
  - Learn how to deploy on DigitalOcean
  - Feel some pain around deployment bugs and the pace of deployment
  - Gain some rudimentary exposure to how build tools (like Grunt) can make your life easier
  - Gain some more exposure to MongoDB and Mongoose

## Bare minimum requirements

### Learn Heroku

Heroku is widely popular for good reason. Getting started with it is incredibly easy, and the documentation is just fantastic. Many developers and startups will begin with Heroku, allowing them to focus on rapid development, potentially moving on to more sophisticated deployment options only when the need arises.

Learning to get started with Heroku is not such an interesting challenge, but you should have it as a tool in your toolbelt. Expect to spend about an hour and no more working with Heroku before moving onto deploying Shortly on DigitalOcean.

- <input type="checkbox"> Complete [Getting Started with Node.js on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction)

### Orientation to Deploying Shortly on DigitalOcean

We're giving you a canonical version of the shortly-express repo to start with. Before diving in, do a code review, out loud with your pair. Take a few minutes with your pair to compare this canonical repo to your work from the last sprint. How was your app architected differently? Could your code have been DRYer? Are there any functional differences between your apps and this one? There are many many ways to write code, and you can often learn as much from reading code as you can from writing it.

### Tests

You will find all tests in this repo are in a pending state. They are all written for [MongoDB](https://www.mongodb.org/). Before you begin the MongoDB refactor later in the sprint, remove 'x' from each `describe` block in the tests.

- <input type="checkbox"> This repo uses `supertest`, a powerful library for testing HTTP. Use it to write at least 2 additional tests for the application

### Get your code ready for deployment

- <input type="checkbox"> Fork the shortly-deploy repo
- <input type="checkbox"> Clone down your repo `npm install`, `node server/index.js`, and make sure you can access the shortly code on `localhost:8080`

### Create a DigitalOcean account

- <input type="checkbox"> _Before you sign up_, Google "digital ocean coupon" to check if there are any deals for new users
- <input type="checkbox"> Create an account with some appropriate billing information
  - Only create __1 account per pair__
- <input type="checkbox"> Set up a billing alert so that you receive an email should your monthly usage exceed some amount you decide. Feel free to make this amount as small as you feel necessary

### Build a MEAN stack DigitalOcean droplet

Most deployment services, DigitalOcean included, allow you to pay them for giving you access to a Linux server that has an IP address exposed to the world wide web. Generally, you house and run your application code inside the Linux server you are paying to use so that others can access it. Often times, once you have access to one of these deployment servers, you have to install, in addition to your application code, programs and code that your application code needs, like, for example, NodeJS, git, or MongoDB.

DigitalOcean calls the Linux servers they offer "droplets," and you can create many different kinds of droplets that already contain programs and code that might be useful for your application. 

- <input type="checkbox"> Create a new DigitalOcean droplet, use **MySQL on 18.04** You can choose the smallest size, in any datacenter, give it any hostname you like. and do **not** need to select any additional options. **Do be sure to create an SSH key** for it

It will take about a minute to create the droplet, at which point in time you will be given the external facing IP address of the droplet.

### Pull your shortly-deploy repo into your droplet

[SSH](https://en.wikipedia.org/wiki/Secure_Shell) or Secure Shell, is a protocol that allows you to securely log into remote servers from the terminal. Typically, when using SSH, you will need to be explicit about which user you are logging in as. In order to use SSH, from inside the terminal on your local machine, you issue the following command:

```
ssh <user-name>@<ip-address-of-the-server-you-want-to-log-into>
```

- <input type="checkbox"> SSH into the droplet you created as user `root`, answering `yes` to the question you are probably asked. You will not be able to do this if you did not successfully create an SSH key in the step above
- <input type="checkbox"> Grab the password for the root user from the email Digital Ocean sent. 
  - <input type="checkbox"> You can log into the Droplet as `root` using either the password emailed to you or with an SSH key if you added one during creation.
  - <input type="checkbox"> The MySQL `root` password and phpMyAdmin admin password are in `/root/.digitalocean_password`.
- <input type="checkbox"> Once inside your droplet, install Node with <a href="https://github.com/creationix/nvm#install--update-script">nvm</a>
  ```bash
  $ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
  ...
  => Appending nvm source string to /root/.bashrc
  \# Pay attention to this path -------------^^^
  ...
  \# Look for the "Appending nvm source string.." in the output and run `source` on whatever file `nvm` appended.
  ...
  \# path from nvm output
  $ source ~/.bashrc
  $ nvm install 8
  ```
- <input type="checkbox"> Clone down the shortly-deploy repo somewhere inside it. Do `npm install`
- <input type="checkbox"> Now run `node server/index.js` and hit the correct port and IP address from inside your browser to see your shortly-deploy app deployed to the world. Address any bugs
- <input type="checkbox"> If your server is runnnig on any port other than `80`, you may have to open an additional port through your droplets firewall to allowing incoming connections from the internet OR change your app's PORT to 80. See this <a href="https://www.digitalocean.com/docs/networking/firewalls/how-to/manage-droplets/#view-firewall-rules-applied-to-a-droplet" target="_blank">article</a> for more info. 


### PM2

You may or may not have noticed that when you close your remote SSH session, your node process (server) stops running.  

*Solution:* Keep your terminal open for the life of your app..  

Actually, there's a more practical solution: <a href="http://pm2.keymetrics.io/" target="_blank">PM2</a>.  PM2 will allow you to start and manage your long-running node process(es). 
To use it, kill your `node server/index.js` process, and allow PM2 to start `server/index.js` for you. Check out the examples to see how:
```shell
$ npm install -g pm2

$ pm2 examples
```


### Create a Gruntfile

Building and deploying an app involves a number of important tasks that need to be performed in a certain order. When you're trying to rapidly prototype your app, this can become repetitive and is prone to error. Grunt is one of many super useful tools that can automate a wide variety of tasks for you.

Use [Grunt](http://gruntjs.com/) to create tasks that do the following:

- <input type="checkbox"> Start your server
- <input type="checkbox"> Concatenate your client files before deployment
- <input type="checkbox"> Uglify your code before deployment. Don't forget to update your views to point to the minified versions of your css and js asset files in the `public/dist` folder. The folder `public/dist` is already .gitignored for you, but make sure that you aren't committing your compiled scripts and/or css to your Github repo
- <input type="checkbox"> Run `eslint` before deployment. If `eslint` fails, the build process should exit
- <input type="checkbox"> Run your Mocha tests before deployment. If any tests fail, the build process should exit
- <input type="checkbox"> Watch your source code for changes in order to rerun any of the Grunt tasks you created as is appropriate

When you're done, feel free to take up to 20 minutes to combine many of your tasks to run with a single command.

- <input type="checkbox"> Create a `grunt deploy` task that utilizes tasks already created in order to build and run your app locally
- <input type="checkbox"> Add a `prod` option such that when you run `grunt deploy --prod` you will prepare your code base for production and push it up to the production droplet

### Refactor your database

In the previous sprint, our shortened links were stored using `sqlite`, a server-less database engine. Sqlite is great for many things, but is not the best choice in most cases for well-trafficked production sites for [various reasons](http://stackoverflow.com/questions/913067/sqlite-as-a-production-database-for-a-low-traffic-site).

MongoDB, on the other hand, is one of the [most widely used databases in production environments](https://www.mongodb.com/who-uses-mongodb) and offers the most popular alternative to using an RDBMS.



- <input type="checkbox"> Remove the 'x' from each `describe` block in the tests
- <input type="checkbox"> Refactor the app to use MongoDB and Mongoose, making the tests pass and checking your application locally. Be sure to use [promises](http://mongoosejs.com/docs/promises.html). If the built-in promises are too limiting for you, plug in your preferred library.
  - You may need to install MongoDB on the droplet. Google "MongoDB Ubuntu 18.04". Digital Ocean produces great articles on how to install packages on Ubuntu.
- <input type="checkbox"> Push your refactored code up to production and profit

## Advanced Content

> Our advanced content is intended to throw you in over your head, requiring you to solve problems with very little support or oversight, much like you would as a mid or senior level engineer.

### Refactor server to use promises

- <input type="checkbox"> Several routes in the server use nested callbacks. Refactor them all to use promises.

### Use another cloud service

- <input type="checkbox"> Deploy your site to another service of your choosing:
   - [Azure](https://azure.microsoft.com/en-us/pricing/free-trial/)
   - [AWS](https://aws.amazon.com/) is *massive*, and you should give it a try if ready to get in a little over your head. The best place to get started learning about AWS is by taking taking the [AWS quickLab on EC2](https://aws.qwiklab.com/)

## Nightmare Mode

### Docker

- <input type="checkbox"> [Install the Docker Toolbox](https://docs.docker.com/engine/installation/mac/) on your local machine
- <input type="checkbox"> Use `docker-machine` (installed above) to [create "machines" on DigitalOcean](https://docs.docker.com/machine/drivers/digital-ocean/)
- <input type="checkbox"> Use a [Dockerfile](https://docs.docker.com/engine/reference/builder/), with the [node image](https://hub.docker.com/_/node/) as a base, to create a Docker image for your shortly web server
- <input type="checkbox"> Use the [mongo docker image](https://hub.docker.com/_/mongo/) to launch a mongo container, [linking](https://docs.docker.com/v1.8/userguide/dockerlinks/) your shortly web server container to it
- <input type="checkbox"> [Compose](https://docs.docker.com/compose/) the two containers and launch them both on DigitalOcean
- <input type="checkbox"> Use your newfound Docker prowess to [roll your own CDN](https://www.scalescale.com/rolling-your-own-cdn-build-a-3-continent-cdn-for-25-in-1-hour/)
