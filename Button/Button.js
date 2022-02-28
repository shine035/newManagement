import React from 'react'
import PropTypes from 'prop-types'
import Styled from 'styled-components'

const ButtonStyled = Styled.button`
  display: flex;
  color: ${props => props.color};
  font-size: ${props => props.size}px !important;
  transform: rotate(${props => props.rotate}deg);
  gap: 8px;
  height: 40px;
  padding: 10px;
  background: var(--color-white);
  text-shadow: none;
  box-shadow: none;
  border: 1px solid ${props => props.color};
  border-radius: 8px;
  align-items: center;
  outline: ${props => props.color} !important;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};

  &:hover {
    color: var(--color-white);
    background: ${props => props.color};

    i {
      color: var(--color-white);
    }
  }
`

function ButtonCustom(props) {
  const { text, icon } = props
  return (
    <ButtonStyled {...props}>
      {icon && icon}
      {text}
    </ButtonStyled>
  )
}

ButtonCustom.propTypes = {
  text: PropTypes.string,
  icon: PropTypes.node,
  size: PropTypes.number,
  color: PropTypes.string,
  background: PropTypes.string,
  className: PropTypes.string,
  rotate: PropTypes.number,
  disabled: PropTypes.bool
}

export default ButtonCustom
