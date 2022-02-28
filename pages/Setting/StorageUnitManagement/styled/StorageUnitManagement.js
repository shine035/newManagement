import styled from 'styled-components'
import { Breadcrumb, Table } from 'antd'

export const StorageUnitManagementWrapper = styled.div`
  width: 100%;
`

export const SystemAdvanceSearchWrapper = styled.div`
  width: 100%;
  padding: 16px;
  background: var(--color-white);
  border-radius: 6px;
  position: relative;

  .ant-form-item {
    margin-bottom: 8px;
  }
`

export const ButtonCloseAdvanceSearch = styled.div`
  position: absolute;
  right: -12px;

  .icon-close {
    font-size: 20px;
    background: var(--color-red-500);
    border-radius: 50%;
    padding: 1px;
    color: var(--color-white);

    &:hover {
      cursor: pointer;
    }
  }
`

export const BreadcrumbWrapper = styled(Breadcrumb)`
  margin-bottom: 16px;
`
export const TableHeadingWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 0;
  justify-content: space-between;

  .table-heading {
    font-size: 20px;
    color: var(--color-primary);
    font-weight: 600;
    text-transform: uppercase;
  }
`
export const TableContentWrapper = styled(Table)`
  .ant-table-thead > tr > th {
    background: var(--color-primary);
    color: white;
    font-weight: 600;
  }

  .row-inactive {
    background-color: #c1eac1;
  }
`
