import assert from 'assert'
import minimatch from 'minimatch'
import _ from 'lodash'
import debug from 'debug'
import config from 'config'

const dbg = debug('lib:auth:is-authorized')

export default function({path, rules, scope, resolvedRoutes}) {
  dbg('args=%o', arguments[0])

  if (_.get(config, 'auth.force')) {
    dbg('warning: auth.force set, returning true (should only happen during development)')
    return true
  }

  if (!scope) {
    dbg('no scope, returning undefined...')
    return undefined
  }

  let result = resolvedRoutes[path]
  if (_.isBoolean(result)) {
    dbg('route already resolved: {%o: %o}, returning...', path, result)
    return result
  }

  const some = _.some(rules, rule => {
    dbg('rule=%o', rule)
    const {roles} = rule
    assert(rule.path, 'path required')
    assert(roles, 'roles required')
    if (minimatch(path, rule.path)) {
      dbg('matched=%o, auth required...', path)
      dbg('scope=%o', scope)

      if (_.isString(roles)) {
        result = scope.includes(roles)
      } else if (_.isArray(roles)) {
        result = _.some(roles, role => scope.includes(role))
      } else if (_.isFunction(roles)) {
        result = roles(scope)
      } else {
        throw new TypeError(`unexpected roles type=${roles}`)
      }

      // if match, then rule determines pass/fail (don't try other rules)
      return true
    }
  })

  assert(some, `rule required for protected route=${path}`)
  dbg('is-authorized=%o', result)
  return result
}
