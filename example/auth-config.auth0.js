import debug from 'debug'
import config from 'config'
import {configure} from '@watchmen/react-redux-auth'
import getAuth from '@watchmen/react-redux-auth/src/get-auth-auth0'
import {axios} from '@watchmen/web-helpr'
import {openSnackbar} from './layout/layout-redux'

const dbg = debug('app:auth-config')

configure({
  impl: getAuth({
    clientId: '3IM9Zk9sCMKTJokbo92bamt83R-tS9vT',
    domain: 'kerzilla.auth0.com',
    returnTo: config.auth.redirect,
    options: {
      theme: {
        logo: 'https://vignette4.wikia.nocookie.net/batman/images/7/74/BrokenBat.png'
      },
      languageDictionary: {
        title: 'kerzsoft'
      },
      allowSignUp: false
    }
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
  onFailure: ({message, dispatch}) => dispatch(openSnackbar(message)),
  onLogin: result => axios.setToken(result.token.encoded),
  onLogout: axios.unsetToken
})
