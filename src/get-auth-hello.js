import assert from 'assert'
import debug from 'debug'
import jwtDecode from 'jwt-decode'
import hello from 'hellojs'
import _ from 'lodash'

const dbg = debug('lib:auth:get-auth-hello')

const providerKey = 'provider'

export default function({url, clientId, domain, redirectUri, getProvider, parseScope}) {
  dbg('args=%o', arguments[0])

  const provider = getProvider({url, domain, redirectUri})
  dbg('provider=%o', provider)

  hello.init({[providerKey]: provider.options})

  hello.init({
    [providerKey]: clientId
  })

  return {
    login: async () => {
      try {
        dbg('login: calling hello.login()')
        // {force: true}?
        const auth = await hello(providerKey).login({redirect_uri: redirectUri})
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
    },
    parseError: provider.parseError,
    parseScope: parseScope || provider.parseScope,
    redirectUri
  }
}
