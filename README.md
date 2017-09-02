# watch-gate

## About

> Node.js microservice for handling the check of how many concurrent streams a given user is watching at the same time

## Introduction

This project has been designed and developed using a scalable microservices approach. As the diagram below shows, there are a number of microservices that work together in order to provide the full service to the end user, in particular an on-demand streaming service.

## Flow

The users will interact with the platform via the **Client** which is an installable app for mobile phones, tablet, smart TVs, etc. The _Client_ will interact with the **Catalog** microservice API in order to provide the available content to the end user. This microservice (Catalog), has access to the up to date, cached list of the available video content on the platform.

When the users decide what video content they want to watch and click on the Play button, the Client will send a **watch_request** to the Catalog microservice containing the auth-token of the user requesting the resource and the ID of the video that the user wants to watch.

The _Catalog_ microservice will handle the request and add it into a standard queue called _watch_requests_. This list is used to keep track of all incoming requests from the clients. Using the queue will prevent a peak time to slow down the platform and it will guarantee that all requests are processed.


## Logging

## Scalability

## Technology Used

This project uses [Feathers](http://feathersjs.com). A Node.js open source web framework for building modern real-time applications. It's built on top of [Express.js](https://expressjs.com/), a fast and unopinionated web framework for Node.js.

For the queues I have used [AWS SQS](https://aws.amazon.com/sqs/) as it was quick to setup and I have experienced with it.

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
