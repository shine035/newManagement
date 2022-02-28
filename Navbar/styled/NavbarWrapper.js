import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

export const NavbarWrapper = styled.div`
  width: 100%;
  display: flex;
  font-size: 14px;
  /* margin: 0 30px;
  justify-content: center; */

  .nav-child__wrapper {
    display: none;
  }

  .nav-item {
    text-decoration: none;
    padding: 8px 10px;
    /* background: var(--color-primary); */
    border-radius: 6px;
    color: var(--color-white);
    margin: 0px 2px;
    transition: 200ms;
    font-weight: 600;
    position: relative;
    line-height: 14px;
    display: flex;
    align-items: center;

    &:hover {
      background: var(--color-white);
      color: var(--color-primary);

      .nav-child__wrapper {
        display: flex;
      }
    }

    &.active {
      background: var(--color-white);
      color: var(--color-primary);
    }
  }
`

export const NavLinkChildStyled = styled(NavLink)`
  padding: 10px 15px;
  color: var(--color-white);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-white);
  color: var(--color-primary);
  font-weight: 600;

  &:hover {
    background: var(--color-primary);
    color: var(--color-white);
  }

  &.active {
    background: var(--color-primary);
    color: var(--color-white);
  }
`

export const NavLinkChildWrapper = styled.div`
  position: absolute;
  top: 36.5px;
  padding: 5px 0;
  left: 0;
  width: max-content;
  display: flex;
  flex-direction: column;
  z-index: 9999;
  overflow: hidden;
  min-width: 100%;
  background: var(--color-white);
  box-shadow: 0px 3px 10px rgba(100, 100, 100, 0.2);
  border-radius: var(--border-radius-primary);
`
