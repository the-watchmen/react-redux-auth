import debug from 'debug'
import _ from 'lodash'
import {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {bindActionCreators} from 'redux'
import PropTypes from 'prop-types'
import auth from '../auth-config'

const dbg = debug('app:auth:if-authorized-container')

const {actions} = auth

class IfAuthorizedContainer extends Component {
  componentWillMount() {
    dbg('cwm: props=%o', this.props)
    this.props.resolveRoute(this.getPath())
  }

  render() {
    dbg('render: props=%o', this.props)
    const {resolvedRoutes} = this.props
    const path = this.getPath()
    const isAuthorized = resolvedRoutes[path]
    dbg('render: path=%o, is-authorized=%o', path, isAuthorized)
    return isAuthorized ? this.props.children : null
  }

  getPath = () => this.props.children.props[this.props.path]

  static propTypes = {
    children: PropTypes.element.isRequired
  }
}

// withRouter allows contained links to re-render when route changes
// which allows for active class to be applied appropriately...
export default withRouter(
  connect(
    state => {
      dbg('connect: state=%o', state)
      return {
        scope: _.get(state, auth.scopePath),
        resolvedRoutes: _.get(state, 'session.resolvedRoutes')
      }
    },
    dispatch => {
      dbg('connect: actions=%o', actions)
      return bindActionCreators(actions, dispatch)
    }
  )(IfAuthorizedContainer)
)
