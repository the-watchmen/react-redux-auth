import assert from 'assert'
import debug from 'debug'
import jwtDecode from 'jwt-decode'
import Keycloak from 'keycloak-js'

const dbg = debug('lib:auth:get-auth-keycloak')

export default function({options, scopeClaim = '?', scopeDelimiter, redirectUri}) {
  dbg('args=%o', arguments[0])

  const keycloak = new Keycloak(options)
  keycloak.init()

  dbg('keycloak=%o', keycloak)

  return {
    login: async () => {
      dbg('login: keycloak=%o', keycloak)
      keycloak.login({redirectUri})
      return new Promise(
        resolve => {
          keycloak.onAuthSuccess = authResult => {
            dbg('on-auth-success: authResult=%o', authResult)
            const encoded = authResult.idToken
            assert(encoded, 'id-token required')
            const decoded = jwtDecode(encoded)
            dbg('on-authenticated: decoded=%o', decoded)
            resolve({encoded, decoded})
          }
        },
        reject => {
          keycloak.onAuthError = err => {
            dbg('on-auth-error: err=%o', err)
            reject(err)
          }
        }
      )
    },
    logout: async () => {
      keycloak.logout({redirectUri})
    },
    scopeClaim,
    scopeDelimiter
  }
}
