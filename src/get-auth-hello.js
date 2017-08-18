import assert from 'assert'
import debug from 'debug'
import jwtDecode from 'jwt-decode'
import hello from 'hellojs'
import _ from 'lodash'

const dbg = debug('lib:auth:get-auth-hello')

const providerKey = 'provider'

export default function({clientId, domain, returnTo, getProvider, scopeClaim, scopeDelimiter}) {
  dbg('args=%o', arguments[0])

  const provider = getProvider({domain, returnTo})
  dbg('provider=%o', provider)

  hello.init({[providerKey]: provider})

  hello.init({
    [providerKey]: clientId
  })

  return {
    login: async () => {
      try {
        dbg('login: calling hello.login()')
        const auth = await hello(providerKey).login({redirect_uri: returnTo, force: true})
        dbg('login: after await: auth=%o', auth)
        // const encoded = _.get(auth, 'authResponse.access_token')
        const encoded = _.get(auth, 'authResponse.id_token')
        assert(encoded, 'id-token required')
        const decoded = jwtDecode(encoded)
        dbg('on-authenticated: decoded=%o', decoded)
        return {encoded, decoded}
      } catch (err) {
        dbg('login: err=%o', err)
        throw err
      }
    },
    logout: async () => {
      hello(providerKey).logout(providerKey, {force: true})
      // redirect here? ref to history?
    },
    scopeClaim,
    scopeDelimiter
  }
}
