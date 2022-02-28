import React from 'react'
import PropTypes, { object } from 'prop-types'
import { Button } from 'antd'

// Component
import Icon from 'src/components/Icon/Icon'

// Styled Component
import { ModalWrapper } from 'src/components/Modals/styled/ModalWrapper'

const ModalDeleteTicket = props => {
  const { onCancel, className, onOk, visible, type, color, footer, width } = props
  return (
    <ModalWrapper
      title="Xác nhận xóa phiếu"
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      closable={false}
      type={color ? type : false}
      width={width}
      className={className}
      destroyOnClose
      footer={
        footer || footer === null
          ? footer
          : [
              <div key="footer" className="d-flex justify-content-end">
                <Button type="danger" key="submit" onClick={onOk}>
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
      </div>
      <div className="ant-modal-body-center">
        <p style={{ paddingBottom: '16px' }}>
          <b>Bạn chắc chắn xóa phiếu này</b>
        </p>
      </div>
    </ModalWrapper>
  )
}

ModalDeleteTicket.defaultProps = {
  width: 620,
  className: 'atbd-modal'
}

ModalDeleteTicket.propTypes = {
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  visible: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.string,
  footer: PropTypes.arrayOf(object),
  width: PropTypes.number,
  color: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
}

export { ModalDeleteTicket }
