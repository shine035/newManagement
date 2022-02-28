import React, { useEffect, useState } from 'react'
import { Button, Form, Select, Row, Col, Space } from 'antd'
import { useToast } from '@chakra-ui/react'
import PropTypes from 'prop-types'
import RoleGroupService from 'src/api/RoleGroup'
import UserManagerService from 'src/api/UserManagerService'
import { ModalWrapper } from '../styled/ModalWrapper'

// API Service

function ModalDetailUser(props) {
  const { data, title, onCancel, className, onOk, visible, type, color, width } = props
  const toast = useToast()
  const [listRole, setListRole] = useState([])
  const [roleGroupObjectGuid, setRoleGroupObjectGuid] = useState('')

  const getListRoleGroup = () => {
    RoleGroupService.getList({ RoleGroupName: '', StatusID: 1 }).then(res => {
      if (res?.isError) return
      setListRole(res?.Object)
      onChangeRoleGroup(data?.RoleGroupID)
    })
  }

  const onChangeRoleGroup = value => {
    const role = listRole.find(item => item?.RoleGroupID === value)

    setRoleGroupObjectGuid(role?.ObjectGuid)
  }

  const updateRoleGroup = () => {
    const body = {
      UserObjectGuid: data?.ObjectGuid,
      RoleGroupObjectGuid: roleGroupObjectGuid
    }

    RoleGroupService.updateRoleGroup(body).then(res => {
      if (res?.isError) return
      toast({
        title: 'Cấp quyền cho người dùng thành công!',
        status: 'success',
        position: 'bottom-right',
        duration: 2000
      })
      onCancel()
    })
  }

  const deleteUser = () => {
    const body = {
      ObjectGuid: data?.ObjectGuid
    }

    UserManagerService.deleteUser(body).then(res => {
      if (res?.isError) return
      toast({
        title: 'Xóa người dùng thành công!',
        status: 'success',
        position: 'bottom-right',
        duration: 2000
      })
      onCancel()
    })
  }

  useEffect(() => {
    if (!visible) return
    getListRoleGroup()
  }, [visible])

  return (
    <ModalWrapper
      title={title || 'Chi tiết người dùng'}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      type={color ? type : false}
      width={width}
      className={className}
      destroyOnClose
      footer={[
        <div className="d-flex justify-content-between" key={1}>
          <Button type="danger" key="back" onClick={() => deleteUser()}>
            Xóa
          </Button>
          <Space>
            <Button type="primary" htmlType="submit" onClick={() => updateRoleGroup()}>
              Ghi lại
            </Button>
            <Button type={type} key="back" onClick={onCancel}>
              Đóng
            </Button>
          </Space>
        </div>
      ]}
    >
      <Form
        labelAlign="left"
        labelCol={{
          span: 6
        }}
        wrapperCol={{
          span: 18
        }}
      >
        <Row className="mb-2">
          <Col span={6}>Tài khoản:</Col>
          <Col span={18}>{data?.UserName}</Col>
        </Row>
        <Row className="mb-2">
          <Col span={6}>Họ và tên:</Col>
          <Col span={18}>{data?.FullName}</Col>
        </Row>
        <Row className="mb-2">
          <Col span={6}>Ngày sinh:</Col>
          <Col span={8}>{data?.birthday}</Col>
          <Col span={3}>Giới tính:</Col>
          <Col span={7}>{data?.gender}</Col>
        </Row>
        <Row className="mb-2">
          <Col span={6}>Quê quán</Col>
          <Col span={18}>{data?.country}</Col>
        </Row>
        <Row className="mb-2">
          <Col span={6}>Chức vụ</Col>
          <Col span={18}>{data?.PositionName}</Col>
        </Row>
        <Row className="mb-2">
          <Col span={6}>Phòng ban</Col>
          <Col span={18}>{data?.UserDeptName}</Col>
        </Row>
        <Form.Item className="mb-2" label="Nhóm quyền" name="RoleGroupID" initialValue={data?.RoleGroupID}>
          <Select getPopupContainer={trigger => trigger.parentNode} onSelect={onChangeRoleGroup}>
            {!!listRole &&
              !!listRole.length &&
              listRole.map(item => <Select.Option value={item?.RoleGroupID}>{item?.RoleGroupName}</Select.Option>)}
          </Select>
        </Form.Item>
        <Row className="mb-3">
          <Col span={6}>Trạng thái</Col>
          <Col span={18}>{data?.StatusName}</Col>
        </Row>
      </Form>
    </ModalWrapper>
  )
}

ModalDetailUser.defaultProps = {
  width: 620,
  className: 'atbd-modal'
}

ModalDetailUser.propTypes = {
  data: PropTypes.object,
  title: PropTypes.string,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  visible: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.string,
  width: PropTypes.number,
  color: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
}

export default ModalDetailUser
