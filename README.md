# react-redux-auth

authentication and authorization for react, redux and react-router 4.x

[![Build Status](https://travis-ci.org/tony-kerz/react-redux-auth.svg?branch=master)](https://travis-ci.org/tony-kerz/react-redux-auth)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

> see [tests](test) for examples (to-do)

## usage

1. `yarn add {this repo}`

## sample configuration

1. in main entry point (e.g. `app/index.js`)
    ```
    //...
    // this import should happen as early as possible for timing
    import './auth-config'
    //...
    ```
1. `./auth-config.js`
    ```
    import {toastr} from 'react-redux-toastr'
    import {configure} from './auth'

    configure({
      impl: {
        provider: 'auth0',
        options: {
          clientId: '3IM9Zk9sCMKTJokbo92bamt83R-tS9vT',
          domain: 'kerzilla.auth0.com',
          returnTo: 'http://localhost:8080',
          options: {
            theme: {
              logo: 'https://vignette4.wikia.nocookie.net/batman/images/7/74/BrokenBat.png'
            },
            languageDictionary: {
              title: 'kerzsoft'
            },
            allowSignUp: false
          }
        }
      },
      // roles can be a string, an array (or'd), or a function for custom
      rules: [
        {
          path: '/stuff',
          roles: roles => {
            return roles.includes('stuff')
          }
        },
        {path: '/nonsense', roles: 'nonsense'}
      ],
      postAuthLocation: ({token}) => {
        // can customize with function (e.g. based on roles)
        return 'stuff'
      },
      notAuthorizedLocation: '/',
      onNotAuthorized: ({path}) => {
        toastr.success('not authorized', `unable to visit route ${path}`)
      }
    })
    ```
> curently only `auth0` identity provider supported, but others may be added

## development

1. `git clone {this repo}`
1. `cd {this repo name}`
1. `yarn`
1. `yarn test`
