import styled from 'styled-components'
import { Breadcrumb, Table } from 'antd'

export const FileCatalougeWrapper = styled.div`
  width: 100%;

  .ant-tabs > .ant-tabs-nav .ant-tabs-nav-wrap {
    border-bottom: 1px solid #ced4da;
  }

  .ant-menu-horizontal {
    border-radius: 8px;
  }
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

export const FileCatalougeAdvanceSearchWrapper = styled.div`
  width: 100%;
  padding: 10px 10px 2px 10px;
  background: var(--color-white);
  border-radius: 6px;
  position: relative;

  .ant-form-item {
    margin-bottom: 5px;
  }

  .ant-form-vertical .ant-form-item-label {
    padding: 0 0 1px;
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
  margin-bottom: 10px;
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

  .ant-btn {
    gap: 8px;
    height: 40px;
    padding: 8px;
    align-items: center;
  }
`

export const TableStyledWrapper = styled(Table)`
  .ant-table-thead > tr > th {
    background: var(--color-primary);
    color: var(--color-white);
    font-weight: 700;
    font-size: 14px;
  }

  .ant-table-tbody > tr > td {
    text-align: left;
    padding: 8px;
  }

  .ant-table-thead > tr > th {
    padding: 8px;
  }

  .ant-table-row {
    &:hover {
      cursor: pointer;
    }
  }

  .row-inactive {
    background-color: var(--color-row-inactive);
  }

  .row-delete {
    background-color: #b1b3b1;
  }

  td.ant-table-cell.action-styled {
    text-align: right !important;
    padding-right: 18px !important;
  }
`
