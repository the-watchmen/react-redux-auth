import debug from 'debug'
import config from 'config'
import {configure} from '@watchmen/react-redux-auth'
import getAuth from '@watchmen/react-redux-auth/src/get-auth-hello'
import getProvider from '@watchmen/react-redux-auth/src/hello/keycloak'
import {webHelpr} from '@watchmen/web-helpr'
import {openSnackbar} from './layout/layout-redux'

const dbg = debug('app:auth-config')

configure({
  impl: getAuth({
    url: config.auth.url,
    domain: 'realm-1',
    clientId: 'client-1',
    redirectUri: config.auth.redirect,
    getProvider
  }),
  // roles can be a string, an array (or'd), or a function for custom
  rules: [
    {
      path: '/stuff',
      roles: roles => {
        return roles.includes('group-1')
      }
    },
    {
      path: '/such',
      roles: ['group-1']
    },
    {path: '/nonsense', roles: 'group-1'}
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
