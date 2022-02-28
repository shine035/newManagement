import Styled from 'styled-components'

const FormDataMiningWrapper = Styled.div`
  text-align: left;

  .ant-form-item-label  {
    text-align: left;
  }

  .ant-form-item {
    margin-bottom: 10px;
  }

  .ant-input-search>.ant-input-group>.ant-input-group-addon:last-child .ant-input-search-button {
    height: 40px;
  }

  .ant-input[disabled] {
    color: #000;
  }

  .ant-select-disabled.ant-select:not(.ant-select-customize-input) .ant-select-selector {
    color: #000;
  }

  .ant-picker-input > input[disabled] {
    color: #000;
  }

  .ant-radio-disabled + span {
    color: #000;
  }

`

const FormDataMiningTitle = Styled.div`
  text-align: center;
  margin-bottom: 10px; 

  .top-title {
    text-transform: uppercase;
    font-weight:700;
  }
`

export { FormDataMiningWrapper, FormDataMiningTitle }
