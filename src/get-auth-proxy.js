import assert from 'assert'
import debug from 'debug'
import jwtDecode from 'jwt-decode'
import popup from 'tricks/window/popup'
import close from 'tricks/window/close'
import until from 'tricks/object/until'
import EventEmitter from 'eventemitter3'

const dbg = debug('lib:auth:get-auth-proxy')
//
// implementation to handle scenario where authentication is handled server side,
// but client receives notification of authentication with jwt and can configure client accordingly
//

export default function({url, redirectUri, parseScope}) {
  dbg('args=%o', arguments[0])
  assert(url, 'url required')
  assert(redirectUri, 'redirect-uri required')
  assert(window, 'window required') // would need work for server-side-render
  window.emitter = new EventEmitter()

  return {
    login: async () => {
      const _popup = popup(`${url}/login`, `${redirectUri}/authenticated`, popupOpts())
      // _popup.emitter = emitter
      dbg('login: popup=%o', _popup)
      const popupMonitor = until((resolve, reject) => {
        if (!_popup || _popup.closed) {
          dbg('login: popup-monitor: popup=%o, closed=%o', _popup, _popup && _popup.closed)
          reject(!_popup ? 'blocked' : 'cancelled')
        }
      }, 100)

      const loggedIn = new Promise((resolve, reject) => {
        window.emitter.on('login', encoded => {
          try {
            dbg('login: event: encoded=%o', encoded)
            assert(encoded, 'id-token required')
            const decoded = jwtDecode(encoded)
            dbg('login: event: decoded=%o', decoded)
            resolve({encoded, decoded})
          } catch (err) {
            dbg('login: event: caught err=%o', err)
            reject(err)
          } finally {
            dbg('login: event: finally')
            close(_popup)
          }
        })
      })

      return Promise.race([popupMonitor, loggedIn])
    },

    logout: async () => {
      // eslint-disable-next-line no-undef
      window.location = `${url}/logout?redirectUri=${redirectUri}`
    },
    parseError: error => `login: ${error}`,
    parseScope,
    url
  }
}

function popupOpts() {
  // http://www.xtf.dk/2011/08/center-new-popup-window-even-on.html

  const width = 550
  const height = 500
  dbg('popup-opts: window.screen-left=%o, screen.left=%o', window.screenLeft, screen.left)
  const dualScreenLeft = window.screenLeft || screen.left || 0
  dbg('popup-opts: window.screen-top=%o, screen.top=%o', window.screenTop, screen.top)
  const dualScreenTop = window.screenTop || screen.top || 0
  dbg(
    'popup-opts: window.inner-width=%o, window.document-element.client-width=%o, screen.width=%o',
    window.innerWidth,
    document.documentElement.clientWidth,
    screen.width
  )
  const _width = window.innerWidth || document.documentElement.clientWidth || screen.width
  dbg(
    'popup-opts: window.inner-height=%o, window.document-element.client-height=%o, screen.height=%o',
    window.innerHeight,
    document.documentElement.clientHeight,
    screen.height
  )
  const _height = window.innerHeight || document.documentElement.clientHeight || screen.height

  const left = _width / 2 - width / 2 + dualScreenLeft
  const top = _height / 2 - height / 2 + dualScreenTop

  const result = {
    resizable: 1,
    scrollbars: 1,
    width,
    height,
    top,
    left
  }

  dbg('popup-opts: result=%o', result)
  return result
}
