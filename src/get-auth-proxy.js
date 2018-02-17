import assert from 'assert'
import debug from 'debug'
import jwtDecode from 'jwt-decode'

const dbg = debug('lib:auth:get-auth-proxy')
//
// implementation to handle scenario where authentication is handled server side,
// but client receives notification of authentication with jwt and can configure client accordingly
//

export default function({url, redirectUri, parseScope}) {
  dbg('args=%o', arguments[0])
  assert(url, 'url required')
  assert(redirectUri, 'redirect-uri required')

  return {
    // to-do: this will get called on not-authorized,
    // but this implementation expects token to be resolved already
    // so it won't reroute to login url.
    // need to refine to support a two-phase approach where login will redirect
    // and a post-login triggered by redirect from idp ->
    // authenticated-route will process the token
    //
    login: async ({token}) => {
      try {
        dbg('login: token=%o', token)
        assert(token, 'token required')
        const encoded = token
        const decoded = jwtDecode(encoded)
        dbg('login: decoded=%o', decoded)
        return {encoded, decoded}
      } catch (err) {
        dbg('login: err=%o', err)
        throw err
      }
    },
    logout: async () => {
      // throw new Error('logout not implemented')
      // eslint-disable-next-line no-undef
      window.location = `${url}/logout?redirectUri=${redirectUri}`
    },
    parseScope,
    url
  }
}
