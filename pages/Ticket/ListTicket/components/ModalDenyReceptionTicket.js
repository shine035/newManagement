import React, { useEffect } from 'react'
import PropTypes, { object } from 'prop-types'
import { Button, Form, Input } from 'antd'

// Component
import Icon from 'src/components/Icon/Icon'

// Styled Component
import { ModalWrapper } from 'src/components/Modals/styled/ModalWrapper'

const { TextArea } = Input

const ModalDenyReceptionTicket = props => {
  const { onCancel, className, onOk, visible, type, color, footer, width } = props
  const [form] = Form.useForm()

  useEffect(() => {
    if (!visible) return
    form.resetFields()
  }, [visible])

  return (
    <ModalWrapper
      title="Từ chối tiếp nhận"
      visible={visible}
      closable={false}
      onCancel={() => {
        form.resetFields()
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
            label="Bạn có chắc chắn muốn từ chối phiếu này, vui lòng nhập lý do: "
            name="Content"
            required
            rules={[{ required: true, message: 'Bạn chưa nhập lý do từ chối' }]}
          >
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </div>
    </ModalWrapper>
  )
}

ModalDenyReceptionTicket.defaultProps = {
  width: 620,
  className: 'atbd-modal'
}

ModalDenyReceptionTicket.propTypes = {
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  visible: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.string,
  footer: PropTypes.arrayOf(object),
  width: PropTypes.number,
  color: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
}

export { ModalDenyReceptionTicket }
