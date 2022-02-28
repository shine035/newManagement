import styled from 'styled-components'
import { Table } from 'antd'

export const TableStyledFileAnDocWrapper = styled(Table)`
  .ant-table-thead > tr > th {
    background: var(--color-primary);
    color: var(--color-white);
    font-weight: 700;
    font-size: 14px;
  }

  .ant-table-tbody > tr > td {
    text-align: left;
    padding: 8px 10px;
  }

  .ant-table-thead > tr > th {
    padding: 14px 10px;
  }

  .ant-table-row {
    &:hover {
      cursor: pointer;
    }
  }

  .row-inactive {
    background-color: var(--color-row-inactive);
  }

  .ant-tabs-nav-list {
    font-weight: bold;
  }
`
