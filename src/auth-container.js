import debug from 'debug'
import _ from 'lodash'
import React, {Component} from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux'
import {withRouter} from 'react-router-dom'
import auth from '.'

const dbg = debug('lib:auth:auth-container')

class AuthContainer extends Component {
  render() {
    dbg('render: props=%o', this.props)
    return (
      <div>
        {this.props.children}
      </div>
    )
  }

  componentWillMount() {
    dbg('cwm: props=%o, auth=%o', this.props, auth)
    const {notAuthorizedLocation} = auth
    const {login, history, resolveRoute, onFailure} = this.props
    const {pathname} = history.location
    const isAuthorized = resolveRoute(pathname)
    dbg('is-authorized=%o', isAuthorized)
    if (_.isUndefined(isAuthorized)) {
      dbg('not authenticated, rerouting to login: history=%o, target=%o', history, pathname)
      login({history, target: pathname})
    }

    // if not-authorized, then either:
    // 1) stay put if at a location per history, or
    // 2) re-route to notAuthorizedLocation
    if (!isAuthorized) {
      dbg(
        'not-authorized: not-authorized-location=%o, pathname=%o',
        notAuthorizedLocation,
        pathname
      )
      history.push(notAuthorizedLocation)
      if (_.isBoolean(isAuthorized)) {
        dbg('not authorized after authentication')
        onFailure && onFailure(`not authorized for path=${pathname}`)
      }
    }
  }

  static propTypes = {
    children: PropTypes.element.isRequired,
    login: PropTypes.func.isRequired,
    resolveRoute: PropTypes.func.isRequired,
    onFailure: PropTypes.func.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired
  }
}

export default withRouter(
  connect(
    state => {
      dbg('connect: state=%o, auth=%o', state, auth)
      return {
        scope: _.get(state, auth.scopePath),
        resolvedRoutes: _.get(state, 'session.resolvedRoutes')
      }
    },
    dispatch => {
      const {actions} = auth
      dbg('connect: actions=%o', actions)
      return bindActionCreators(actions, dispatch)
    }
  )(AuthContainer)
)
