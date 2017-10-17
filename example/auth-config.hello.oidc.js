import debug from 'debug'
import config from 'config'
import {configure} from '@watchmen/react-redux-auth'
import getAuth from '@watchmen/react-redux-auth/src/get-auth-hello'
import getProvider from '@watchmen/react-redux-auth/src/hello/oidc'
import {axios} from '@watchmen/web-helpr'
import {openSnackbar} from './layout/layout-redux'

const dbg = debug('app:auth-config')

configure({
  impl: getAuth({
    url: config.auth.url,
    domain: 'domain-1',
    clientId: 'client-1',
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
  // onFailure should be function that takes argument containing error string
  onFailure: openSnackbar,
  onLogin: result => axios.setToken(result.token.encoded),
  onLogout: axios.unsetToken
})
