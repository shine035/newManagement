import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Input, Space } from 'antd'
import { useToast } from '@chakra-ui/react'

// API Services
import StorageUnitService from 'src/api/StorageUnitService'

import { ModalWrapper } from 'src/components/Modals/styled/ModalWrapper'

const { TextArea } = Input

export const CreateUpdateStorageUnit = props => {
  const toast = useToast()
  const [form] = Form.useForm()

  const { onCancel, className, onOk, data, visible, type, color, width } = props

  const [isSubmitLoading, setIsSubmitLoading] = useState(false)

  const handleSubmit = () => {
    form.validateFields().then(response => {
      const body = {
        ObjectGuid: data?.ObjectGuid || '00000000-0000-0000-0000-000000000000',
        ...response
      }

      setIsSubmitLoading(true)
      StorageUnitService.insertUpdate(body)
        .then(res => {
          if (res.Error) return
          toast({
            title: data ? 'Sửa đơn vị bảo quản thành công' : 'Tạo mới đơn vị bảo quản thành công',
            status: 'success',
            position: 'bottom-right',
            duration: 2000
          })
          if (onOk) onOk()
        })
        .finally(() => setIsSubmitLoading(false))
    })
  }

  useEffect(() => {
    if (!visible) return
    if (data)
      form.setFieldsValue({ StorageUnitCode: data.StorageUnitCode, Title: data.Title, Description: data.Description })
  }, [visible])

  return (
    <ModalWrapper
      title={data ? 'Sửa đơn vị bảo quản' : 'Thêm đơn vị bảo quản'}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      type={color ? type : false}
      width={width}
      className={className}
      destroyOnClose
      footer={[
        <div className="d-flex justify-content-end" key={1}>
          <Space>
            <Button type={type} key="back" onClick={onCancel}>
              Đóng
            </Button>
            <Button loading={isSubmitLoading} type="primary" htmlType="submit" onClick={() => handleSubmit()}>
              Ghi lại
            </Button>
          </Space>
        </div>
      ]}
    >
      <Form form={form} layout="vertical" initialValues={{ StorageUnitCode: '', Title: '', Description: '' }}>
        <Form.Item
          label="Số đơn vị bảo quản"
          name="StorageUnitCode"
          rules={[
            { required: true, message: 'Số đơn vị bảo quản không được để trống!' }
            // {
            //   pattern: new RegExp('/[a-zA-Z0-9s]/gi'),
            //   message: 'Số đơn vị bảo quản không được chứa dấu và ký tự đặc biệt'
            // }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Tiêu đề"
          name="Title"
          rules={[{ required: true, message: 'Tiêu đề đơn vị bảo quản không được để trống!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Ghi chú" name="Description">
          <TextArea />
        </Form.Item>
      </Form>
    </ModalWrapper>
  )
}

CreateUpdateStorageUnit.defaultProps = {
  width: 620,
  className: 'atbd-modal'
}

CreateUpdateStorageUnit.propTypes = {
  data: PropTypes.object,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  visible: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.string,
  width: PropTypes.number,
  color: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
}
