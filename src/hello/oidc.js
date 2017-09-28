import debug from 'debug'

const dbg = debug('lib:auth:hello:oidc')

export default function({redirectUri}) {
  const base = 'http://localhost:3000'

  return {
    options: {
      oauth: {
        version: 2,
        auth: `${base}/auth`,
        // hello doesn't seem to handle just "id_token" for response_type...
        response_type: 'id_token token',
        grant: `${base}/token`
      },
      scope: {
        basic: 'openid'
      },
      login: p => {
        dbg('login: p=%o', p)
        p.qs.nonce = new Date().getTime()
      },
      logout: p => {
        dbg('logout: p=%o', p)
        return `${base}/session/end?post_logout_redirect_uri=${redirectUri}`
      },
      refresh: true,
      base: ''
    }
  }
}
