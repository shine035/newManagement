import Styled from 'styled-components'
import { Modal, Row, Table, Input } from 'antd'

export const ModalWrapper = Styled(Modal)`
  .ant-modal-body {
      padding: 10px 20px;
  }

  .ant-modal-close-x {
    width: 50px;
    height: 55px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-white);
  }

  .ant-modal-header {
    background: var(--color-primary);
    padding: 15px 20px;
    text-align: center;
  }

  .ant-modal-title {
    color: var(--color-white);
    font-weight: 600;
  }

  .custom-col {
    padding: 10px 16px 0 16px;
    margin-bottom: 16px;
    background: #F2F2F2;
    border-radius: 8px;

  }
`

export const TableContentWrapper = Styled(Table)`
   .ant-table-tbody > tr > td {
    padding: 5px;
  }

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
    background: var(--color-primary);
    color: white;
    text-align: center;
  }
  
  &.table-history .ant-table-thead > tr > th {
    font-weight: 600;
  }

  &.table-list-document .ant-table-thead > tr > th {
    font-weight: 600;
    padding: 5px
  }

}
`

export const RowWrapper = Styled(Row)`
  padding-bottom: 10px;
`

export const TableWrapper = Styled(Table)`
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
    padding: 11px 16px;
  }

  .ant-table-tbody > tr > td {
    padding: 0px 16px;
  }

  .ant-space {
    display: flex;
    justify-content: flex-end;
  }
`

export const NewDataPartition = Styled.div`
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #bbb;
  border-top: 0;
  margin-bottom: 30px;

  &:last-child {
    margin-bottom: 0;
  }

  .new-data-heading {
    height: 40px;
    background: var(--color-primary);
    border-radius: 6px 6px 0 0;
    padding: 9px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--color-white);

    .title {
      font-size: 15px;
      font-weight: 700;
      color: var(--color-white);
    }
  }

  ul.ant-pagination.ant-pagination-simple {
    padding: 16px 0;
    display: flex;
    justify-content: flex-end;
  }

  .ant-empty-description {
    color: #000000d9;
  }
`

export const SearchWrapper = Styled(Input.Search)`
  width: 50%;

  input.ant-input {
    height: 30px;
    border: none;
  }

  .ant-input-wrapper .ant-input-group {
    display: flex;
    align-items: center;
  }

  button {
    height: 30px;
    justify-content: center;
    border: none;
  }

  .ant-input-group .ant-input:hover {
    border-color: snow;
    border-right-width: 0px;
    border-right-width: 0px !important;
  }

  .ant-input:focus, .ant-input-focused {
      border-color: snow;
      border-right-width: 0px !important;
      box-shadow: none;
  }
`

export const DataListWrapper = Styled.div`
  background: #fff;
  border-radius: 6px;
  overflow: hidden;


  .data-list-heading {
    background: var(--color-primary);
    font-size: 18px;
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 15px;
    padding: 12px 10px;
    color: var(--text-white);
  }

  .brief-wrapper {
    padding: 10px;
  }

  .brief-item {
    margin-bottom: 20px;

    &::last-child() {
      margin-bottom: 0;
    }
  }

  .brief-item__name {
    display: flex;
    align-items: center;
    margin-bottom: 8px;

    .name {
      padding: 0;
      font-weight: 600;
      font-size: 16px;
    }
  }

  .document-item {
    padding: 0px;
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

    &:hover {
      background: #eee;
      cursor: pointer;
    }

    .document-proposed {
      color: var(--color-primary);
    }

    .document-mining {
      color: var(--color-red-500);
    }

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
  }
`
