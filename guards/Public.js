import React from 'react'
import propTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'

const Public = ({ component, path }) => {
  const isLoggedIn = !localStorage.getItem('user')

  return isLoggedIn ? <Route component={component} path={path} /> : <Redirect to="/" />
}

Public.propTypes = {
  component: propTypes.any.isRequired,
  path: propTypes.string.isRequired
}

export default Public
