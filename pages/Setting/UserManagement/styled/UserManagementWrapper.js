import styled from 'styled-components'
import { Breadcrumb, Table } from 'antd'

export const UserManagementWrapper = styled.div`
  width: 100%;
`

export const SearchEasyWrapper = styled.div`
  width: 100%;
  background: #fff;
  border-radius: 6px;
  position: relative;

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

export const SystemAdvanceSearchWrapper = styled.div`
  width: 100%;
  padding: 16px 16px 8px 16px;
  background: var(--color-white);
  border-radius: 6px;
  position: relative;

  .ant-form-item {
    margin-bottom: 8px;
    /* margin-top: 15px; */
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
    font-weight: 700;
  }

  .row-inactive {
    background-color: var(--color-row-inactive);
  }
`
