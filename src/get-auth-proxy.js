import assert from 'assert'
import debug from 'debug'
import jwtDecode from 'jwt-decode'

const dbg = debug('lib:auth:get-auth-proxy')
//
// implementation to handle scenario where authentication is handled server side,
// but client receives notification of authentication with jwt and can configure client accordingly
//

export default function({parseScope}) {
  dbg('parse-scope=%o', arguments[0])

  return {
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
      throw new Error('logout not implemented')
    },
    parseScope
  }
}
