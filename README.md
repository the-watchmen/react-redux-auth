# react-redux-auth

authentication and authorization strategy for react, redux and react-router 4.x

[![Build Status](https://travis-ci.org/tony-kerz/react-redux-auth.svg?branch=master)](https://travis-ci.org/tony-kerz/react-redux-auth)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

> see [tests](test) for examples

## usage

1. `npm install {this repo}`

## sample configuration

```
import debug from 'debug'
import {toastr} from 'react-redux-toastr'
import {getAuthRedux, getAuthAuth0} from 'react-redux-auth'

const dbg = debug('app:auth-config')

export default {
  ...getAuthRedux({
    postAuthLocation: ({token}) => {
      // can customize with function (e.g. based on roles)
      dbg('post-auth-location: token=%o', token)
      return 'stuff'
    },
    // put stuff that varies across env in config...
    impl: getAuthAuth0({
      clientId: 'client-id-123',
      domain: 'my-domain.auth0.com',
      returnTo: 'http://localhost:8080',
      options: {
        theme: {
          logo: 'https://my-logos/my-logo.png'
        },
        languageDictionary: {
          title: 'my-title'
        },
        allowSignUp: false
      }
    })
  }),
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
  notAuthorizedLocation: '/',
  onNotAuthorized: ({path}) => {
    toastr.success('not authorized', `unable to visit route ${path}`)
  }
}
```

> see tests

## development

1. `git clone {this repo}`
1. `cd {this repo name}`
1. `yarn`
1. `yarn test`
