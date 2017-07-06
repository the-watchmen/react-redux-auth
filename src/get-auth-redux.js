// see: https://github.com/erikras/ducks-modular-redux
//
import assert from 'assert'
import {createAction, handleActions} from 'redux-actions'
import debug from 'debug'
import _ from 'lodash'
import auth from '../auth-config'
import isAuthorized from './is-authorized'

const dbg = debug('app:get-auth-redux')

const LOGIN_BEGIN = 'auth/login-begin'
const LOGIN = 'auth/login'
const LOGOUT_BEGIN = 'auth/logout-begin'
const LOGOUT = 'auth/logout'
const RESOLVE_ROUTE = 'auth/resolve-route'

const loginBegin = createAction(LOGIN_BEGIN)
const logoutBegin = createAction(LOGOUT_BEGIN)

export default function({postAuthLocation, impl}) {
  dbg('default')
  return {
    scopeClaim: impl.scopeClaim,
    scopePath: `session.token.decoded.${impl.scopeClaim}`,
    actions: {
      login: ({history, target} = {}) => {
        dbg('login-action: history=%o, target=%o', history, target)
        return async (dispatch, getState) => {
          dbg('login-thunk')
          dispatch(loginBegin(target))
          const loginResult = await impl.login()
          const {decoded} = loginResult
          let _target
          if (target) {
            dbg('specified target=%o', target)
            _target = target
          } else {
            if (_.isFunction(postAuthLocation)) {
              _target = postAuthLocation({token: decoded})
            } else if (_.isString(postAuthLocation)) {
              _target = postAuthLocation
            } else {
              throw new TypeError(`unexpected type for post-auth-location=${postAuthLocation}`)
            }
          }
          const {location} = history
          dbg('post-login: decoded=%o, location=%o, target=%o', decoded, location, _target)
          // apply authentication scope to resolved-routes...
          const scope = decoded[impl.scopeClaim]
          assert(scope, 'scope required')
          const {rules} = auth
          let {resolvedRoutes} = getState().session
          resolvedRoutes = _.transform(resolvedRoutes, (result, val, key) => {
            result[key] = isAuthorized({path: key, rules, scope, resolvedRoutes})
          })
          dbg('resolved-routes=%o', resolvedRoutes)
          dispatch(createAction(LOGIN)({token: loginResult, resolvedRoutes}))
          if (_target != location) {
            history.push(_target)
          }
        }
      },
      logout: target => {
        dbg('logout-action: target=%o', target)
        return async dispatch => {
          dbg('logout-thunk: target=%o', target)
          dispatch(logoutBegin(target))
          await impl.logout({dispatch, action: LOGOUT})
          dispatch(createAction(LOGOUT)())
        }
      },
      resolveRoute: path => {
        dbg('resolve-route-action: path=%o', path)
        return (dispatch, getState) => {
          dbg('resolve-route-thunk: path=%o', path)
          const state = getState()
          const {resolvedRoutes} = state.session
          const scope = _.get(state, auth.scopePath)
          const result = isAuthorized({path, rules: auth.rules, scope, resolvedRoutes})
          dispatch(createAction(RESOLVE_ROUTE)({[path]: result}))
          return result
        }
      }
    },
    reducer: handleActions(
      {
        [LOGIN_BEGIN]: (state, action) => {
          dbg('reducer: login-begin: state=%o, action=%o', state, action)
          return {
            ...state,
            active: true,
            target: action.payload
          }
        },
        [LOGIN]: (state, action) => {
          dbg('reducer: login: state=%o, action=%o', state, action)
          return {
            ...state,
            ...action.payload,
            active: false,
            target: null
          }
        },
        [LOGOUT_BEGIN]: (state, action) => {
          dbg('reducer: logout-begin: state=%o, action=%o', state, action)
          return {
            ...state,
            active: true,
            target: action.payload
          }
        },
        [LOGOUT]: (state, action) => {
          dbg('reducer: logout: state=%o, action=%o', state, action)
          return {
            ...state,
            active: false,
            token: null,
            resolvedRoutes: {}
          }
        },
        [RESOLVE_ROUTE]: (state, action) => {
          dbg('reducer: resolve-route: state=%o, action=%o', state, action)
          return {
            ...state,
            resolvedRoutes: {...state.resolvedRoutes, ...action.payload}
          }
        }
      },
      {
        active: false,
        token: null,
        target: null,
        recentHistory: [],
        resolvedRoutes: {}
      }
    )
  }
}
