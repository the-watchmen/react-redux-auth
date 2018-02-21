// see: https://github.com/erikras/ducks-modular-redux
//
import {createAction, handleActions} from 'redux-actions'
import {handle} from 'redux-pack'
import debug from 'debug'
import {stringify} from '@watchmen/helpr'
import _ from 'lodash'
import isAuthorized from './is-authorized'
import auth from '.'

const dbg = debug('lib:auth:get-auth-redux')

const LOGIN = 'auth/login'
const LOGOUT = 'auth/logout'
const RESOLVE_ROUTE = 'auth/resolve-route'
const SET_ROLES = 'auth/set-roles'

function parseScope({token}) {
  dbg('parse-scope: token=%o', token)
  return token.scope ? token.scope.split(' ') : []
}

export default function({postAuthLocation, impl, onLogin, onLogout, onFailure}) {
  dbg('args=%o, auth=%o', arguments[0], auth)

  return {
    actions: {
      // allow passing token here for server-side-proxy case...
      login: ({history, target, token}) => {
        dbg('login-action: history=%o, target=%o, token=%o', history, target, token)
        return (dispatch, getState) => {
          dbg('login-action-thunk: dispatch=%o', dispatch)
          dispatch({
            type: LOGIN,
            promise: impl.login({token, getState}),
            meta: {
              onSuccess: result => {
                dbg('login: on-success: result=%o', result)
                const {decoded} = result
                let _target
                if (target) {
                  _target = target
                } else {
                  if (_.isFunction(postAuthLocation)) {
                    _target = postAuthLocation({token: decoded})
                  } else if (_.isString(postAuthLocation)) {
                    _target = postAuthLocation
                  } else {
                    throw new TypeError(
                      `unexpected type for post-auth-location=${postAuthLocation}`
                    )
                  }
                }
                const {location} = history
                dbg(
                  'login: on-success: decoded=%o, location=%o, target=%o',
                  decoded,
                  location,
                  _target
                )
                if (_target != location) {
                  history.push(_target)
                }
                onLogin && onLogin({result, dispatch})
              },
              onFailure: result => {
                dbg('login: on-failure: result=%o, dispatch=%o', result, dispatch)
                const {parseError} = impl
                const message = parseError ? parseError(result) : stringify(result)
                onFailure && onFailure({message, dispatch})
              }
            }
          })
        }
      },
      logout: ({history}) => {
        dbg('logout-action: history=%o', history)
        return dispatch => {
          dbg('logout-thunk: history=%o', history)
          dispatch({
            type: LOGOUT,
            promise: impl.logout(),
            meta: {
              onSuccess: () => {
                //
                // impl.logout() could involve redirects
                // causing a page refresh, so this code here
                // (including any onLogout action provided)
                // should prolly be concerned with things other than local state
                // which would be reset (e.g. could send out a remote call if required)
                //
                dbg('logout: on-success: auth=%o', auth)
                history.push(auth.notAuthorizedLocation)
                onLogout && onLogout({dispatch})
              }
            }
          })
        }
      },
      resolveRoute: path => {
        dbg('resolve-route-action: path=%o', path)
        return (dispatch, getState) => {
          dbg('resolve-route-thunk: path=%o', path)
          const state = getState()
          const {resolvedRoutes, scope} = state.session
          const result = isAuthorized({path, rules: auth.rules, scope, resolvedRoutes})
          dispatch(createAction(RESOLVE_ROUTE)({[path]: result}))
          return result
        }
      },
      setRoles: roles => {
        dbg('set-roles: roles=%o', roles)
        return dispatch => {
          dbg('set-roles-thunk: roles=%o', roles)
          dispatch({
            type: SET_ROLES,
            promise: roles,
            meta: {
              onSuccess: result => {
                dbg('set-roles: on-success: result=%o', result)
              }
            }
          })
        }
      },
      // to-do: determine if this can be simplified (called from auth-container)
      onFailure: message => {
        dbg('on-failure-action: message=%o', message)
        return dispatch => {
          dbg('on-failure-thunk: message=%o', message)
          dispatch(onFailure(message))
        }
      }
    },
    reducer: handleActions(
      {
        [LOGIN]: (state, action) =>
          handle(state, action, {
            start: () => ({
              ...state,
              active: true,
              target: action.payload
            }),
            success: () => {
              dbg('login-success: state=%o, action=%o', state, action)
              const token = action.payload
              const {decoded} = token
              const _parseScope = impl.parseScope || parseScope
              const scope = _parseScope({token: decoded})
              const resolvedRoutes = resolveRoutes({state, scope})
              return {
                ...state,
                token,
                scope,
                resolvedRoutes,
                active: false,
                target: null
              }
            },
            failure: () => {
              dbg('login-failure: state=%o, action=%o', state, action)
              return {
                ...state,
                active: false
              }
            }
          }),
        [LOGOUT]: (state, action) =>
          handle(state, action, {
            start: _state => ({
              ..._state,
              active: true,
              target: action.payload
            }),
            success: _state => ({
              ..._state,
              active: false,
              token: null,
              scope: null,
              resolvedRoutes: {}
            })
          }),
        [RESOLVE_ROUTE]: (state, action) => {
          dbg('reducer: resolve-route: state=%o, action=%o', state, action)
          return {
            ...state,
            resolvedRoutes: {...state.resolvedRoutes, ...action.payload}
          }
        },
        [SET_ROLES]: (state, action) => {
          dbg('reducer: set-roles: state=%o, action=%o', state, action)
          const scope = action.payload
          const resolvedRoutes = resolveRoutes({state, scope})
          return {
            ...state,
            resolvedRoutes,
            scope
          }
        }
      },
      {
        active: false,
        token: null,
        scope: null,
        target: null,
        recentHistory: [],
        resolvedRoutes: {}
      }
    )
  }
}

function resolveRoutes({state, scope}) {
  const {rules} = auth
  let {resolvedRoutes} = state
  dbg('resolve-routes: pre=%o', resolvedRoutes)
  resolvedRoutes = _.transform(resolvedRoutes, (result, val, key) => {
    result[key] = isAuthorized({path: key, rules, scope, resolvedRoutes})
  })
  dbg('resolve-routes: post=%o', resolvedRoutes)
  return resolvedRoutes
}
