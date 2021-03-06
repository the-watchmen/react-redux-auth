import debug from 'debug'
import {stringify} from '@watchmen/helpr'

const dbg = debug('lib:auth:hello:keycloak')

export default function({url, domain, redirectUri}) {
  dbg('url=%o, domain=%o, redirectUri=%o', url, domain, redirectUri)
  return {
    parseError: ({error}) => {
      if (error.error_description) {
        return error.error_description.replace(/\+/g, ' ')
      } else if (error.message) {
        return error.message
      }
      return stringify(error)
    },
    parseScope: ({token}) => {
      dbg('parse-scope: token=%o', token)
      return token.groups || []
    },
    options: {
      oauth: {
        version: 2,
        auth: `${url}/auth/realms/${domain}/protocol/openid-connect/auth`,
        // hello doesn't seem to handle just "id_token" for response_type...
        response_type: 'id_token token',
        grant: `${url}/token`
      },
      scope: {
        basic: 'openid'
      },
      login: p => {
        dbg('login: p=%o', p)
        p.qs.nonce = new Date().getTime()
      },
      logout: p => {
        const logoutUrl = `${url}/auth/realms/${domain}/protocol/openid-connect/logout?redirect_uri=${redirectUri}/`
        dbg('logout: p=%o, url=%o', p, logoutUrl)
        return logoutUrl
      },
      refresh: true,
      base: ''
    }
  }
}
