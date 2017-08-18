import debug from 'debug'
import {
  configure,
  getHelloAuth as getAuth,
  getAzureHelloProvider as getProvider
} from 'react-redux-auth'
import {openSnackbar} from './layout/layout-redux'

const dbg = debug('app:auth-config')

configure({
  impl: getAuth({
    clientId: '2feff992-96e6-4420-86a4-1e25348a6d09',
    domain: 'anthonykerzgmail.onmicrosoft.com',
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
