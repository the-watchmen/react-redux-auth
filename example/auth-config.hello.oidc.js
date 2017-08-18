import debug from 'debug'
import {
  configure,
  getHelloAuth as getAuth,
  getOidcHelloProvider as getProvider
} from 'react-redux-auth'
import {openSnackbar} from './layout/layout-redux'

const dbg = debug('app:auth-config')

configure({
  impl: getAuth({
    clientId: 'foo',
    returnTo: 'http://localhost:8080/',
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
  onNotAuthorized: ({path, dispatch}) => {
    dbg('on-not-authorized: unable to visit route=%o, dispatch=%o', path, dispatch)
    dispatch(openSnackbar(`not authorized: unable to visit route ${path}`))
  }
})
