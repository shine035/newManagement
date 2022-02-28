import styled from 'styled-components'
import { Breadcrumb, Table, Form } from 'antd'

export const RoleGroupWrapper = styled.div`
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

  .ant-table-thead > tr > th {
    background: var(--color-primary);
    color: white;
  }

  .row-inactive {
    background-color: #c1eac1;
  }
`

export const TabRoleWrapper = styled.div`
  padding: 10px 16px;
  background: var(--color-border-2);
  border-radius: 6px;
  margin-bottom: 10px;
  text-align: left;

  .tab-role-name {
    font-weight: 600;
    margin-bottom: 5px;
    font-size: 13px;
  }

  .ant-checkbox-wrapper {
    width: max-content;
    margin-bottom: 3px;
  }
`

export const FormDetailWrapper = styled(Form)`
  .ant-form-item-label label {
    font-weight: 600;
  }
`
