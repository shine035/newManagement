import styled from 'styled-components'

export const UserInfoWrapper = styled.div`
  display: flex;
  align-items: center;

  .user-information {
    padding-right: 16px;

    .user-name {
      font-weight: 600;
      color: #fff;
      margin-bottom: 0px;
      width: max-content;
    }

    .user-role {
      color: #eee;
      font-size: 13px;
      margin-bottom: 0px;
      text-align: right;
    }
  }

  .ant-dropdown.ant-dropdown-placement-bottomRight {
    z-index: 9999 !important;
  }
`
