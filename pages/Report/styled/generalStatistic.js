import styled from 'styled-components'
import { Table } from 'antd'

export const ReportsExploitationWrapper = styled.div`
  width: 100%;
`

export const SystemAdvanceSearchFileAndDocWrapper = styled.div`
  width: 100%;
  background: #fff;
  border-radius: 6px;
  position: relative;

  .ant-form-item {
    margin-bottom: 8px;
  }
`

export const TableHeadingWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;

  .table-heading {
    font-size: 20px;
    color: var(--color-primary);
    font-weight: 600;
    text-transform: uppercase;
  }
`

export const TableStyledWrapper = styled(Table)`
  .ant-table-thead > tr > th {
    background: var(--color-primary);
    color: var(--color-white);
    font-weight: 700;
    font-size: 14px;
    text-align: center;
  }
`
