import debug from 'debug'
import config from 'config'
import {configure} from '@watchmen/react-redux-auth'
import getAuth from '@watchmen/react-redux-auth/src/get-auth-hello'
import getProvider from '@watchmen/react-redux-auth/src/hello/azure'
import {webHelpr} from '@watchmen/web-helpr'
import {openSnackbar} from './layout/layout-redux'

const dbg = debug('app:auth-config')

configure({
  impl: getAuth({
    url: config.auth.url,
    domain: 'anthonykerzgmail.onmicrosoft.com',
    clientId: '2feff992-96e6-4420-86a4-1e25348a6d09',
    redirectUri: config.auth.redirect,
    getProvider
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
  onFailure: ({message, dispatch}) => dispatch(openSnackbar(message)),
  onLogin: ({result, dispatch}) => {
    dbg('on-login: result=%o, dispatch=%o', result, dispatch)
    webHelpr.setToken(result.encoded)
  },
  onLogout: ({dispatch}) => {
    dbg('on-logout: dispatch=%o', dispatch)
    webHelpr.unsetToken()
  }
})
