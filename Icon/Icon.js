import React from 'react'
import PropTypes from 'prop-types'
import Styled from 'styled-components'

const IconStyled = Styled.i`
  display: inline-block;
  color: ${props => props.color};
  font-size: ${props => props.size}px !important;
  transform: rotate(${props => props.rotate}deg);

`

function Icon(props) {
  const { name, className } = props
  return <IconStyled {...props} className={`icon-${name} ${className || ''}`} />
}

Icon.propTypes = {
  name: PropTypes.string,
  size: PropTypes.number,
  color: PropTypes.string,
  className: PropTypes.string,
  rotate: PropTypes.number
}

export default Icon
