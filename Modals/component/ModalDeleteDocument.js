import React, { useEffect } from 'react'
import PropTypes, { object } from 'prop-types'
import { Button, Form, Input } from 'antd'

// Component
import Icon from 'src/components/Icon/Icon'

// Styled Component
import { ModalWrapper } from '../styled/ModalWrapper'

const { TextArea } = Input

const ModalDeleteDocument = props => {
  const { onCancel, title, className, onOk, visible, type, color, footer, width } = props
  const [formDelete] = Form.useForm()

  useEffect(() => {
    if (!visible) return
    formDelete.resetFields()
  }, [visible])

  return (
    <ModalWrapper
      title={title || 'Xác nhận xóa hồ sơ/ Tài liệu'}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      closable={false}
      type={color ? type : false}
      width={width}
      className={className}
      destroyOnClose
      afterClose={formDelete.resetFields()}
      footer={
        footer || footer === null
          ? footer
          : [
              <div key="footer" className="d-flex justify-content-end">
                <Button type="danger" key="submit" htmlType="submit" form="formDelete">
                  Xóa
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
          <Icon name="delete" size={80} color="var(--color-red-400)" />
        </p>
        <Form
          form={formDelete}
          id="formDelete"
          layout="vertical"
          onFinish={() => onOk(formDelete.getFieldsValue(true))}
        >
          <Form.Item
            label="Vui lòng nhập lý do xóa Hồ sơ/Tài liệu:"
            name="Content"
            required
            rules={[{ required: true, message: 'Phải nhập thông tin căn cứ xóa Hồ sơ/Tài liệu' }]}
          >
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </div>
    </ModalWrapper>
  )
}

ModalDeleteDocument.defaultProps = {
  width: 620,
  className: 'atbd-modal'
}

ModalDeleteDocument.propTypes = {
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  visible: PropTypes.bool,
  title: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.string,
  footer: PropTypes.arrayOf(object),
  width: PropTypes.number,
  color: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
}

export { ModalDeleteDocument }
