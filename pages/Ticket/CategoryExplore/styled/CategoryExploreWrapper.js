import styled from 'styled-components'
import { Breadcrumb, Table } from 'antd'

export const CategoryExploreWrapper = styled.div`
  width: 100%;
`

export const SearchEasyWrapper = styled.div`
  width: 100%;
  background: #fff;
  border-radius: 6px;
  margin-bottom: 8px;
  position: relative;

  .ant-input-search > .ant-input-group > .ant-input-group-addon:last-child .ant-input-search-button {
    height: 40px;
    border-radius: 0 6px 6px 0;
    min-width: 40px;
  }

  .ant-input-search-button {
    min-width: 40px;
  }
`

export const SystemAdvanceSearchWrapper = styled.div`
  width: 100%;
  padding: 10px 10px 2px 10px;
  background: #fff;
  border-radius: 6px;
  position: relative;
  .ant-form-item {
    margin-bottom: 8px;
  }
`

export const BreadcrumbWrapper = styled(Breadcrumb)`
  margin-bottom: 16px;
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
  }

  .ant-table-thead > tr > th {
    padding: 11px 10px;
  }
`
