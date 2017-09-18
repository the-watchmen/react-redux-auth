# react-redux-auth

authentication and authorization for react, redux and react-router 4.x

[![Build Status](https://travis-ci.org/tony-kerz/react-redux-auth.svg?branch=master)](https://travis-ci.org/tony-kerz/react-redux-auth)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

> see [tests](test) for examples (to-do)

## usage

- `yarn add {this repo}`

- uses [redux-pack](https://github.com/lelandrichardson/redux-pack), so need to follow directions and add middleware

## sample configuration

1. in main entry point (e.g. `app/index.js`)
    ```
    //...
    // this import should happen as early as possible for timing
    import './auth-config'
    //...
    ```
1. `./auth-config.js`

    1. [auth0](https://auth0.com/): [example](example/auth-config.auth0.js)
    1. [hello.js](https://adodson.com/hello.js/)
        1. [azure](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-authentication-scenarios): [example](example/auth-config.hello.azure.js)
        1. [node-oidc-provider](https://github.com/panva/node-oidc-provider): [example](example/auth-config.hello.oidc.js)
        1. [keycloak](http://www.keycloak.org/): [example](example/auth-config.hello.keycloak.js)
          1. [configuration notes](keycloak.md) 

## development

1. `git clone {this repo}`
1. `cd {this repo name}`
1. `yarn`
1. `yarn test`
