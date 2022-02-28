import styled from 'styled-components'
import { Breadcrumb, Table, Tree } from 'antd'

export const SearchWrapper = styled.div`
  width: 100%;
  .ant-tabs > .ant-tabs-nav .ant-tabs-nav-wrap {
    border-bottom: 1px solid #ced4da;
  }
  .ant-input-search > .ant-input-group > .ant-input-group-addon:last-child .ant-input-search-button {
    height: 40px;
    border-radius: 0 6px 6px 0;
  }

  .ant-btn-round {
    height: 40px;
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

export const TableHeadingWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 10px;
  justify-content: space-between;

  .table-heading {
    font-size: 20px;
    color: var(--color-primary);
    font-weight: 600;
    text-transform: uppercase;
  }
`

export const TableWrapper = styled(Table)`
  width: 100%;

  .ant-btn-icon-only {
    border-radius: 50%;
    height: 45px;
    width: 45px;
    transition: 200ms;

    &:hover {
      background: rgba(100, 100, 100, 0.1);
    }
  }

  .ant-table-thead > tr > th {
    background: #eee;
    font-weight: 600;
  }
`

export const DataListWrapper = styled.div`
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
      padding: 0 8px;
      font-weight: 600;
      font-size: 16px;
    }
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
    }

    &:hover {
      background: #eee;
      cursor: pointer;
    }

    &__status-name > div {
      width: max-content;
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

  .d-flex.justify-content-end {
    padding: 10px;
  }
`

export const SystemAdvanceSearchWrapper = styled.div`
  width: 100%;
  padding: 10px 10px 2px 10px;
  background: var(--color-white);
  border-radius: 6px;
  position: relative;

  .ant-form-item {
    margin-bottom: 8px;
  }
`

export const BreadcrumbWrapper = styled(Breadcrumb)`
  margin-bottom: 16px;
`

export const TreeWrapper = styled(Tree)`
  .ant-tree-list-holder-inner {
    padding: 0 10px;
  }

  .ant-space-item {
  }

  span.ant-tree-node-content-wrapper {
    padding: 0 0 0 10px;
  }

  .ant-tree-switcher {
    display: none;
  }

  .ant-tree .ant-tree-treenode {
    display: flex;
    width: 100%;
    align-items: center;
    padding: 0 8px;
  }

  .ant-tree .ant-tree-node-content-wrapper {
    width: 100%;
  }

  .ant-tree-checkbox {
    margin: 0;
  }

  .ant-tree-treenode {
    width: 100%;
    align-items: center;
    min-height: 50px;
  }

  span.ant-tree-node-content-wrapper.ant-tree-node-content-wrapper-normal {
    width: 100%;
  }

  .ant-tree-treenode-switcher-open {
    width: unset;
  }

  .ant-space-align-center {
    width: 100%;
    justify-content: space-between;
  }

  i.icon-parent {
    padding-top: 5px;
  }

  span.ant-tree-node-content-wrapper.ant-tree-node-content-wrapper-normal.ant-tree-node-selected,
  span.ant-tree-node-content-wrapper.ant-tree-node-content-wrapper-open.ant-tree-node-selected {
    background-color: #fff;
  }

  span.ant-tree-checkbox-inner {
    border-radius: 4px;
  }

  .document-proposed {
    color: var(--color-primary);
  }

  .document-mining {
    color: var(--color-red-500);
  }

  .document-receiving {
    color: var(--color-blue-600);
  }

  .ant-empty-description {
    color: #000000d9;
  }

  .name {
    color: #000000d9;
  }
`
