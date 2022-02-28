import styled from 'styled-components'

export const NotificationsWrapper = styled.div`
  cursor: pointer;
  margin: 0 15px;
`

export const NotificationsItem = styled.div`
  padding: 10px 15px;
  background: var(--color-white);
  transition: 200ms;

  &::last-child {
    margin-bottom: 0;
  }

  &.unread {
    background: var(--color-green-50);
  }

  &:hover {
    background: var(--color-border);
    cursor: pointer;
  }

  .time {
    font-size: 11px;
    color: #bababa;
  }
`

export const NotificationListStyled = styled.div`
  background: var(--color-white);
  border-radius: 4px;
  min-width: 350px;
  max-width: 450px;
  box-shadow: var(--box-shadow-primary);
  left: -320px;
  position: absolute;
  margin-top: 20px;

  .notify-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--color-white);

    &__title {
      width: 100%;
      background: var(--color-primary);
      margin: 10px;
      padding: 8px;
      text-align: center;
      border-radius: 4px;
    }

    &__action {
      padding: 10px 15px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid var(--color-border);
    }

    &__remove {
      color: var(--color-red-600);
      font-size: 12px;
      cursor: pointer;
    }

    &__read-all {
      color: var(--color-blue-600);
      font-size: 12px;
      cursor: pointer;
    }
  }
`

export const NumberNotify = styled.div`
  width: 22px;
  height: 22px;
  background: var(--color-red-600);
  color: var(--color-white);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 50%;
  font-size: 12px;
`
