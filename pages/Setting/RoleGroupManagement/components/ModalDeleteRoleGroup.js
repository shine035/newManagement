import React, { useState } from 'react'
import PropTypes, { object } from 'prop-types'
import { Button, Space } from 'antd'
import { useToast } from '@chakra-ui/react'

import RoleGroupService from 'src/api/RoleGroup'
import Icon from 'src/components/Icon/Icon'
import { ModalWrapper } from 'src/components/Modals/styled/ModalWrapper'

const ModalDeleteRoleGroup = props => {
  const toast = useToast()
  const { onCancel, className, onOk, visible, type, color, footer, width, roleData } = props

  const [isLoading, setisLoading] = useState(false)

  const handleSubmit = () => {
    const body = { RoleGroupID: roleData.RoleGroupID }

    setisLoading(true)
    RoleGroupService.delete(body)
      .then(res => {
        if (res.isError) return
        toast({
          title: 'Xoá nhóm quyền thành công',
          status: 'success',
          position: 'top',
          duration: 2000
        })
        if (onOk) onOk()
      })
      .finally(() => setisLoading(false))
  }

  return (
    <ModalWrapper
      title="Xoá nhóm quyền"
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
          Bạn có chắc chắn muốn xoá nhóm quyền
          <span className="ml-1 font-weight-bold">{roleData?.RoleGroupName}</span>
        </p>
      </div>
    </ModalWrapper>
  )
}

ModalDeleteRoleGroup.defaultProps = {
  width: 620,
  className: 'atbd-modal'
}

ModalDeleteRoleGroup.propTypes = {
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  visible: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.string,
  footer: PropTypes.arrayOf(object),
  width: PropTypes.number,
  color: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  roleData: PropTypes.object
}

export default ModalDeleteRoleGroup
