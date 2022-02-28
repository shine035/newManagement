import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'antd'
import { ModalWrapper } from 'src/components/Modals/styled/ModalWrapper'
import Icon from 'src/components/Icon/Icon'
import { useToast } from '@chakra-ui/react'
import FileDeliveryService from 'src/api/FileDeliveryService'

const ModalDelete = props => {
  const { onCancel, className, visible, type, color, width, objectGuid } = props
  const toast = useToast()

  const deleteDeliveryFile = () => {
    FileDeliveryService.delete({ ObjectGuid: objectGuid })
      .then(res => {
        if (res?.isError) return
        toast({
          title: `Xóa phiếu giao nộp thành công.`,
          status: 'success',
          position: 'bottom-right',
          duration: 2000,
          isClosable: true
        })
        onCancel()
      })
      .finally(() => onCancel())
  }

  return (
    <ModalWrapper
      title="Xác nhận xóa phiếu"
      visible={visible}
      onCancel={onCancel}
      type={color ? type : false}
      width={width}
      className={className}
      destroyOnClose
      footer={[
        <div key="footer" className="d-flex justify-content-end">
          <Button type={type} key="submit" onClick={() => deleteDeliveryFile()}>
            Đồng ý
          </Button>
          <Button type="secondary" key="back" onClick={onCancel}>
            Đóng
          </Button>
        </div>
      ]}
    >
      <div className="ant-modal-body-center">
        <p style={{ paddingBottom: '16px' }}>
          <Icon name="warning" size={60} color="#FFA800" />
        </p>
        <p>Bạn chắc chắn muốn xóa phiếu giao nộp Hồ sơ, Tài liệu này?</p>
      </div>
    </ModalWrapper>
  )
}

ModalDelete.defaultProps = {
  width: 620,
  className: 'atbd-modal'
}

ModalDelete.propTypes = {
  onCancel: PropTypes.func,
  visible: PropTypes.bool,
  objectGuid: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.string,
  width: PropTypes.number,
  color: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
}

export { ModalDelete }
