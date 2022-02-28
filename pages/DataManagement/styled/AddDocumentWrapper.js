import styled from 'styled-components'
import { Breadcrumb } from 'antd'

export const AddDocumentWrapper = styled.div`
  width: 100%;

  .ant-form-vertical .ant-form-item-label {
    padding: 0 0 1px;
  }

  .ant-input[disabled] {
    color: #000000d9;
  }

  span.ant-select-selection-item {
    color: #000000d9;
  }

  .ant-radio-disabled .ant-radio-inner::after {
    background-color: #000000d9;
  }

  .ant-radio-disabled + span {
    color: #000000d9;
  }

  .ant-picker-input > input[disabled] {
    color: #000000d9;
  }

  span.ant-select-selection-item-content {
    color: #000000d9;
  }
`
export const ButtonCloseAdvanceSearch = styled.div`
  position: absolute;
  right: -12px;
`

export const BreadcrumbWrapper = styled(Breadcrumb)`
  margin-bottom: 10px;
`
export const FormAddDocumentWrapper = styled.div`
  width: 100%;
`
export const BoxWrapper = styled.div`
  width: 100%;
  background: #fff;
  border-radius: 6px;
  position: relative;
  padding: 10px 16px;
  margin-bottom: 10px;

  .bg-keyword {
    background: #f2f2f2;
    border-radius: 8px;
    padding: 16px 16px 0 16px;
    margin-bottom: 20px;
  }

  .title-box {
    margin-bottom: 10px;
  }

  .title-label {
    color: var(--color-primary);
    font-weight: 700;
    font-size: 18px;
  }

  .ant-divider-horizontal {
    border-color: #ccc;
    margin: 8px 0 16px;
  }

  .ant-form-item-label > label {
    font-weight: 600;
  }

  .ant-form-item-control-input-content > span {
    display: flex;
  }

  .ant-select-multiple .ant-select-selection-item-remove > .anticon {
    vertical-align: 0;
    background: var(--color-white);
    border-radius: 8px;
    font-size: 13px;
  }

  .ant-col {
    font-weight: 600;
  }

  .custom-col-8 {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`
