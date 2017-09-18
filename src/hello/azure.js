import debug from 'debug'

const dbg = debug('lib:auth:hello:azure')

// for azure, read this to enable implicit-grant
// https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-dev-understanding-oauth2-implicit-grant

export default function({domain, redirectUri}) {
  const base = `https://login.microsoftonline.com/${domain}/oauth2`
  return {
    options: {
      oauth: {
        version: 2,
        auth: `${base}/authorize?resource=https://graph.windows.net/`,
        response_type: 'id_token',
        grant: `${base}/token`
      },
      login: p => {
        dbg('login: p=%o', p)
      },
      logout: p => {
        dbg('logout: p=%o', p)
        return `${base}/logout?post_logout_redirect_uri=${redirectUri}`
      },
      refresh: true,
      base: ''
    }
  }
}
