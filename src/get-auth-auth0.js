import assert from 'assert'
import debug from 'debug'
import jwtDecode from 'jwt-decode'
import Auth0Lock from 'auth0-lock'

const dbg = debug('lib:auth:get-auth-auth0')

export default function({
  clientId,
  domain,
  options,
  returnTo,
  scopeClaim = 'http://auth0/scope',
  scopeDelimiter
}) {
  const lock = new Auth0Lock(clientId, domain, {...options, auth: {redirect: false}})

  return {
    login: async () => {
      dbg('login')
      lock.show()
      return new Promise(resolve => {
        lock.on('authenticated', authResult => {
          dbg('on-authenticated: authResult=%o', authResult)
          const encoded = authResult.idToken
          assert(encoded, 'id-token required')
          const decoded = jwtDecode(encoded)
          dbg('on-authenticated: decoded=%o', decoded)
          resolve({encoded, decoded})
        })
      })
    },
    logout: async () => {
      lock.logout({returnTo})
    },
    scopeClaim,
    scopeDelimiter
  }
}
