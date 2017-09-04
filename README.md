# watch-gate

> Node.js microservice for handling the check of how many concurrent streams a given user is watching at the same time

## Demo
[View the demo](https://watch-gate-yvrjfrzctm.now.sh)

## Introduction
This project has been designed and developed using a scalable microservices approach. As the diagram below shows, there are a number of microservices that work together in order to provide the full service to the end user, in particular an on-demand streaming service.

## Flow
The users will interact with the platform via the **Client** which is an installable app for mobile phones, tablet, smart TVs, etc. The _Client_ will interact with the **Catalog** microservice API in order to provide the available content to the end user. This microservice (Catalog), has access to the up to date, cached list of the available video content on the platform.

When the users decide what video content they want to watch and click on the Play button, the Client will send a **watch_request** to the Catalog microservice containing the auth-token of the user requesting the resource and the ID of the video that the user wants to watch.

The _Catalog_ microservice will handle the request and add it into a standard queue called _watch_requests_. This list is used to keep track of all incoming requests from the clients. Using the queue will prevent a peak time to slow down the platform and it will guarantee that all requests are processed.

![watch-gate-diagram](https://user-images.githubusercontent.com/2318450/30007361-bbb98d9c-9104-11e7-9bbb-713833f75673.jpg)


## Logging strategy
Basic events such as GET, POST, PATCH, etc are logged to console but persisted for this demo. Ideally, each microservice would have its own log file, rotated according to the amount of information coming through. Locals events like this can be persisted in the local microservice file. Important events, such as the approval of a watch request or a critical error on the microservice would be logged in a centralized elastic search instance. Having critical errors indexed and easily accessible allows a better and faster troubleshooting experience.

![logging-strategy](https://user-images.githubusercontent.com/2318450/30007424-cc8c649a-9105-11e7-9760-2b89ae6f7bfb.jpg)

## Scalability strategy
As illustrated in the diagram above, the microservices are independent applications running inside containers. The containers are orchestrated by a system such as [Kubernetes](https://kubernetes.io/). At peak-time new instances of the watch-gate microservice can be fired up according to the demand of incoming watch_requests. Multiple instances of the microservice can work together handling the messages coming from the initial "front desk" queue.

## Technology Used
This project uses [Feathers](http://feathersjs.com). A Node.js open source web framework for building modern real-time applications. It's built on top of [Express.js](https://expressjs.com/), a fast and unopinionated web framework for Node.js.

A document NoSQL database has been used for this project, MongoDB.

The microservice called "client" implements socket.io to allow real-time interactions with the users.

For the queues I have used [AWS SQS](https://aws.amazon.com/sqs/) as it was quick to setup and I have experienced with it.

I have used socket.io, jQuery and Bootstrap to build a simulator of the Client.

## Notes
All the microservices have been included together in the same application for time requirements and semplicty for demo purposes. Ideally each one would be an independend microservice, as explained above.

## Documentation
https://documenter.getpostman.com/view/75820/watch-gate/6tXb6Ai

![docs-sample-postman](https://user-images.githubusercontent.com/2318450/29997248-63963506-9006-11e7-9eb0-8b1f388a97a9.jpg)

## Improvements
* When the client of a specific user disconnects, its active streams should be removed
* A stream should get removed automatically when it ends (using startTime and duration)

## Getting Started

Getting up and running is as easy as 1, 2, 3.

1. Make sure you have [NodeJS](https://nodejs.org/) and [yarn](https://www.yarnjs.com/) installed.
2. Install your dependencies

    ```
    cd path/to/watch-gate; yarn install
    ```

3. Start your app

    ```
    yarn start
    ```

## Testing
Simply run `yarn test` and all your tests in the `test/` directory will be run.

## Scaffolding
Feathers has a powerful command line interface. Here are a few things it can do:

```
$ yarn install -g feathers-cli             # Install Feathers CLI

$ feathers generate service               # Generate a new Service
$ feathers generate hook                  # Generate a new Hook
$ feathers generate model                 # Generate a new Model
$ feathers help                           # Show all commands
```

## Help
For more information on all the things you can do with Feathers visit [docs.feathersjs.com](http://docs.feathersjs.com).

## Changelog

__0.1.0__

- Initial release

## License

Copyright (c) 2017

Licensed under the [MIT license](LICENSE).
