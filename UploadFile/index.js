import React from 'react'
import PropTypes from 'prop-types'
import { Button, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

// const API_ENDPOINT = process.env.REACT_APP_DOMAIN
// const url = `${API_ENDPOINT}/api/FileUpload/UploadNormalFile`
const url = `https://hethongluutru.xyz/api/FileUpload/UploadNormalFile`

function UploadFile(props) {
  const { multiple, accept, disabled, fileList, onChange } = props

  return (
    <Upload
      multiple={multiple}
      accept={accept}
      disabled={disabled}
      action={url}
      fileList={fileList}
      onChange={onChange}
    >
      <Button type="primary" icon={<UploadOutlined />}>
        Chọn file
      </Button>
    </Upload>
  )
}

UploadFile.propTypes = {
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
  accept: PropTypes.string,
  fileList: PropTypes.array,
  onChange: PropTypes.func
}

export default UploadFile
