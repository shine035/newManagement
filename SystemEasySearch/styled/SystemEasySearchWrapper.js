import styled from 'styled-components'

export const SearchEasyWrapper = styled.div`
  width: 100%;
  padding: 16px;
  background: #fff;
  border-radius: 6px;
  position: relative;
  margin-bottom: 15px;

  .ant-input-search > .ant-input-group > .ant-input-group-addon:last-child .ant-input-search-button {
    height: 40px;
    border-radius: 0 6px 6px 0;
    min-width: 40px;
  }

  .ant-btn {
    height: 40px;
    align-items: center;
  }

  .ant-input-search-button {
    min-width: 40px;
  }
`
