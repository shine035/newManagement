import React, { useEffect } from 'react'
import { Button } from 'antd'
import PropTypes, { object } from 'prop-types'

// Component
import Icon from 'src/components/Icon/Icon'
import { CloseOutlined } from '@ant-design/icons'

// Style
import { ModalWrapper } from '../styled/ModalWrapper'

const ModalConfirmReception = props => {
  const { onCancel, className, onOk, visible, type, data, color, footer, width } = props

  useEffect(() => {
    // eslint-disable-next-line no-useless-return
    if (!visible) return
  }, [visible])

  return (
    <ModalWrapper
      title="Tiếp nhận"
      visible={visible}
      onOk={onOk}
      closable={false}
      onCancel={onCancel}
      type={color ? type : false}
      width={width}
      className={className}
      destroyOnClose
      footer={
        footer || footer === null
          ? footer
          : [
              <div key="footer" className="d-flex justify-content-end">
                <Button type={type} key="submit" onClick={onOk}>
                  Đồng ý
                </Button>
                <Button type="secondary" key="back" onClick={onCancel} icon={<CloseOutlined />}>
                  Đóng
                </Button>
              </div>
            ]
      }
    >
      <div className="ant-modal-body-center">
        <p style={{ paddingBottom: '16px' }}>
          <Icon name="warning" size={80} color="#FFA800" />
        </p>
        <b>Bạn có chắc chắn tiếp nhận hồ sơ/ sưu tập ảnh:</b>
        <p>{data?.Title || data?.DocumentTitle || data?.GalleryContent}</p>
      </div>
    </ModalWrapper>
  )
}

ModalConfirmReception.defaultProps = {
  width: 620,
  className: 'atbd-modal'
}

ModalConfirmReception.propTypes = {
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  visible: PropTypes.bool,
  data: PropTypes.object,
  className: PropTypes.string,
  type: PropTypes.string,
  footer: PropTypes.arrayOf(object),
  width: PropTypes.number,
  color: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
}

export { ModalConfirmReception }
