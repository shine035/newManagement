import React, { useState } from 'react'
import PropTypes, { object } from 'prop-types'
import { Button, Space } from 'antd'
import { useToast } from '@chakra-ui/react'

import StorageUnitService from 'src/api/StorageUnitService'
import Icon from 'src/components/Icon/Icon'
import { ModalWrapper } from 'src/components/Modals/styled/ModalWrapper'

const ModalDeleteStorageUnit = props => {
  const toast = useToast()
  const { onCancel, className, onOk, visible, type, color, footer, width, data } = props

  const [isLoading, setisLoading] = useState(false)

  const handleSubmit = () => {
    const body = { ObjectGuid: data.ObjectGuid }

    setisLoading(true)
    StorageUnitService.delete(body)
      .then(res => {
        if (res.isError) return
        toast({
          title: 'Xoá đơn vị bảo quản thành công',
          status: 'success',
          position: 'bottom-right',
          duration: 2000
        })
        if (onOk) onOk()
      })
      .finally(() => setisLoading(false))
  }

  return (
    <ModalWrapper
      title="Xoá đơn vị bảo quản"
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      type={color ? type : false}
      width={width}
      className={className}
      destroyOnClose
      footer={
        footer || footer === null ? (
          footer
        ) : (
          <div className="d-flex justify-content-end">
            <Space>
              <Button type="secondary" key="back" onClick={onCancel}>
                Đóng
              </Button>
              <Button type="primary" key="submit" onClick={handleSubmit} loading={isLoading}>
                Đồng ý
              </Button>
            </Space>
          </div>
        )
      }
    >
      <div className="d-flex flex-column align-items-center">
        <Icon name="delete" size={60} color="red" />
        <p className="mt-2">
          Bạn có chắc chắn muốn xoá đơn vị bảo quản
          <span className="ml-1 font-weight-bold">{data?.Title}</span>
        </p>
      </div>
    </ModalWrapper>
  )
}

ModalDeleteStorageUnit.defaultProps = {
  width: 620,
  className: 'atbd-modal'
}

ModalDeleteStorageUnit.propTypes = {
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  visible: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.string,
  footer: PropTypes.arrayOf(object),
  width: PropTypes.number,
  color: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  data: PropTypes.object
}

export default ModalDeleteStorageUnit
