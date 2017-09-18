import debug from 'debug'
import config from 'config'
import {configure, getAuthHello as getAuth, helloProviders} from 'react-redux-auth'
import {openSnackbar} from './layout/layout-redux'

const dbg = debug('app:auth-config')

configure({
  impl: getAuth({
    url: config.auth.url,
    domain: 'anthonykerzgmail.onmicrosoft.com',
    clientId: '2feff992-96e6-4420-86a4-1e25348a6d09',
    redirectUri: config.auth.redirect,
    getProvider: helloProviders.azure
  }),
  // roles can be a string, an array (or'd), or a function for custom
  rules: [
    {
      path: '/stuff',
      roles: roles => {
        return roles.includes('admin')
      }
    },
    {path: '/nonsense', roles: 'nonsense'}
  ],
  postAuthLocation: ({token}) => {
    // can customize with function (e.g. based on roles)
    dbg('post-auth-location: token=%o', token)
    return 'stuff'
  },
  notAuthorizedLocation: '/',
  // onFailure should be function that takes argument containing error string
  onFailure: openSnackbar
})
