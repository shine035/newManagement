import styled from 'styled-components'
import { Table } from 'antd'

export const HomeWrapper = styled.div`
  width: 100%;
`

export const TableWrapper = styled(Table)`
  width: 100%;

  .ant-btn-icon-only {
    border-radius: 50%;
    height: 45px;
    width: 45px;
    transition: 200ms;
    display: flex;
    align-items: center;

    &:hover {
      background: rgba(100, 100, 100, 0.1);
    }
  }

  .ant-table-thead > tr > th {
    background: #eeeeee;
    font-weight: 700;
    padding: 16px 8px;
  }

  .ant-table-tbody > tr > td {
    padding: 0px;
  }

  .ant-space {
    display: flex;
    justify-content: flex-end;
  }
`

export const NewDataPartition = styled.div`
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #bbb;
  border-top: 0;
  margin-bottom: 30px;

  &:last-child {
    margin-bottom: 0;
  }

  .new-data-heading {
    background: var(--color-primary);
    border-radius: 6px 6px 0 0;
    padding: 9px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--color-white);

    .title {
      font-size: 16px;
      font-weight: 700;
      color: var(--color-white);
    }
  }

  tr.ant-table-row.ant-table-row-level-0 {
    cursor: pointer;
  }

  .icon-cursor {
    cursor: pointer;
  }

  .ant-empty-description {
    color: #000000d9;
  }
`
