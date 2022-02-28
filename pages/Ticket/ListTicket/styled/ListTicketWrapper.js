import styled from 'styled-components'
import { Breadcrumb, Table } from 'antd'

export const ListTicketWrapper = styled.div`
  width: 100%;

  .mb-10 {
    margin-bottom: 10px;
  }
`

export const SystemAdvanceSearchWrapper = styled.div`
  width: 100%;
  padding: 10px;
  background: #fff;
  border-radius: 6px;
  position: relative;

  .ant-form-item {
    margin-bottom: 0px;
  }

  .ant-form-vertical .ant-form-item-label {
    padding: 0 0 1px;
  }

  .pd-top-10 {
    padding-top: 10px;
  }
`

export const SearchEasyWrapper = styled.div`
  width: 100%;
  background: #fff;
  border-radius: 6px;
  /* margin-bottom: 8px; */
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
    height: 45px;
  }

  .ant-table-tbody > tr:hover {
    .float-action__wrapper {
      display: inline-flex;
    }
  }

  .ant-table-tbody > tr > td {
    text-align: left;
    padding: 8px 10px;
  }

  .ant-table-thead > tr > th {
    padding: 10px;
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
    background-color: #e0e0e0;
  }

  .document-item {
    padding: 8px 8px 8px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: 200ms;
    min-height: 48px;

    &__name {
      display: flex;
      align-items: center;

      .name {
        padding: 0 8px;
      }
    }
  }
`
