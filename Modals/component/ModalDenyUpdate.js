import React, { useEffect } from 'react'
import PropTypes, { object } from 'prop-types'
import { Button, Form, Input } from 'antd'

// Component
import Icon from 'src/components/Icon/Icon'

// Styled Component
import { ModalWrapper } from '../styled/ModalWrapper'

const { TextArea } = Input

const ModalDenyUpdate = props => {
  const { onCancel, className, onOk, visible, type, color, footer, width } = props
  const [form] = Form.useForm()

  useEffect(() => {
    if (!visible) return
    form.resetFields()
  }, [visible])

  return (
    <ModalWrapper
      title="Từ chối cập nhật"
      visible={visible}
      closable={false}
      onCancel={() => {
        onCancel()
      }}
      type={color ? type : false}
      width={width}
      className={className}
      destroyOnClose
      footer={
        footer || footer === null
          ? footer
          : [
              <div key="footer" className="d-flex justify-content-end">
                <Button type="primary" form="form" htmlType="submit" key="submit">
                  Từ chối
                </Button>
                <Button type="secondary" key="back" onClick={onCancel}>
                  Đóng
                </Button>
              </div>
            ]
      }
    >
      <div className="ant-modal-body-center">
        <p style={{ paddingBottom: '16px' }}>
          <Icon name="cancel" size={80} color="var(--color-red-400)" />
        </p>
        <Form
          form={form}
          id="form"
          initialValues={{ Content: '' }}
          layout="vertical"
          onFinish={() => onOk(form.getFieldsValue(true))}
        >
          <Form.Item
            label="Vui lòng nhập lý do từ chối cập nhật Hồ sơ/Tài liệu:"
            name="Content"
            required
            rules={[{ required: true, message: 'Phải nhập thông tin căn cứ xóa Hồ sơ/Tài liệu.' }]}
          >
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </div>
    </ModalWrapper>
  )
}

ModalDenyUpdate.defaultProps = {
  width: 620,
  className: 'atbd-modal'
}

ModalDenyUpdate.propTypes = {
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  visible: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.string,
  footer: PropTypes.arrayOf(object),
  width: PropTypes.number,
  color: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
}

export { ModalDenyUpdate }
