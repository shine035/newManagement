import React from 'react'
import PropTypes, { object } from 'prop-types'
import { Button } from 'antd'
import { ModalWrapper } from '../styled/ModalWrapper'

const ModalDeleteReception = props => {
  const { onCancel, className, onOk, visible, type, color, footer, width } = props

  return (
    <ModalWrapper
      title="Xác nhận xóa phiếu"
      visible={visible}
      onCancel={onCancel}
      type={color ? type : false}
      width={width}
      className={className}
      destroyOnClose
      footer={
        footer || footer === null
          ? footer
          : [
              <Button type={type} key="submit" onClick={onOk}>
                Xóa
              </Button>,
              <Button type="secondary" key="back" onClick={onCancel}>
                Đóng
              </Button>
            ]
      }
    >
      <p>Bạn đồng ý tiếp nhận phiếu của độc giả Nguyễn Văn A?</p>
    </ModalWrapper>
  )
}

ModalDeleteReception.defaultProps = {
  width: 620,
  className: 'atbd-modal'
}

ModalDeleteReception.propTypes = {
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  visible: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.string,
  footer: PropTypes.arrayOf(object),
  width: PropTypes.number,
  color: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
}

export { ModalDeleteReception }
