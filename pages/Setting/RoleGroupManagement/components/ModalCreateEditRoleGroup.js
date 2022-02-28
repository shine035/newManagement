import React, { useState, useEffect } from 'react'
import PropTypes, { object } from 'prop-types'
import { Button, Space, Spin, Form, Input, Checkbox } from 'antd'
import { useToast } from '@chakra-ui/react'
import { forEach } from 'lodash'

import RoleGroupService from 'src/api/RoleGroup'
import Icon from 'src/components/Icon/Icon'
import { ModalWrapper } from 'src/components/Modals/styled/ModalWrapper'
import { TabRoleWrapper, FormDetailWrapper } from '../styled/RoleGroupWrapper'

const ModalCreateEditRoleGroup = props => {
  const toast = useToast()
  const [form] = Form.useForm()

  const { onCancel, className, onOk, visible, type, color, footer, width, roleData } = props

  const [isLoading, setisLoading] = useState(false)
  const [isLoadingSubmit, setisLoadingSubmit] = useState(false)
  const [roleGroupDataList, setRoleGroupDataList] = useState([])

  useEffect(() => {
    if (!visible) return
    initData()
  }, [visible])

  const handleSubmit = () => {
    form.validateFields().then(() => {
      const value = form.getFieldsValue(true)

      const ListRole = value.ListRole.map(role => {
        const newRole = {
          ...role
        }
        delete newRole.RoleName
        return { ...newRole }
      })

      const body = {
        RoleGroup: {
          ...value,
          ListRole,
          RoleGroupID: roleData ? roleData.RoleGroupID : 0
        }
      }

      setisLoadingSubmit(true)
      RoleGroupService.insertUpdate(body)
        .then(res => {
          if (res.isError) return
          toast({
            title: 'Lưu nhóm quyền thành công',
            status: 'success',
            position: 'top',
            duration: 2000
          })
          if (onOk) onOk()
        })
        .finally(() => setisLoadingSubmit(false))
    })
  }

  const initData = () => {
    setisLoading(true)
    RoleGroupService.getOne(roleData ? roleData.RoleGroupID : 0)
      .then(res => {
        if (res.isError) return
        const newRoleGroupDataList = []
        const roles = {}
        res.Object.ListRole.forEach(data => {
          if (!roles[data.TabID]) {
            roles[data.TabID] = {
              TabID: data.TabID,
              TabName: data.TabName,
              Roles: [
                {
                  RoleValue: data.RoleValue,
                  RoleName: data.RoleName,
                  IsRole: data.IsRole,
                  TabID: data.TabID
                }
              ]
            }
          } else {
            roles[data.TabID].Roles.push({
              RoleValue: data.RoleValue,
              RoleName: data.RoleName,
              IsRole: data.IsRole,
              TabID: data.TabID
            })
          }
        })

        forEach(roles, value => {
          newRoleGroupDataList.push(value)
        })
        setRoleGroupDataList(newRoleGroupDataList)

        const flatArrayRole = []
        newRoleGroupDataList.forEach(tab => {
          tab.Roles.forEach(tabItem => flatArrayRole.push(tabItem))
        })
        form.setFieldsValue({
          ListRole: flatArrayRole,
          RoleGroupName: res.Object.RoleGroupName
        })
      })
      .finally(() => setisLoading(false))
  }

  const isCheckAll = Tab => {
    if (!Tab.Roles || !Tab.Roles.length) return false
    return Tab.Roles.every(role => role.IsRole)
  }

  const handleCheckRole = (e, TabID, RoleID) => {
    const { checked } = e.target
    let newRoleGroupDataList = [...roleGroupDataList]
    const newTabData = newRoleGroupDataList.find(tab => tab.TabID === TabID)
    const newRolesData = newTabData.Roles.map(role => {
      if (RoleID === 0) {
        return {
          ...role,
          IsRole: checked
        }
      }
      if (role.RoleValue === RoleID) {
        return {
          ...role,
          IsRole: checked
        }
      }
      return role
    })

    newTabData.Roles = newRolesData
    newRoleGroupDataList = newRoleGroupDataList.map(tab => {
      if (tab.TabID === TabID) {
        return {
          ...newTabData
        }
      }
      return tab
    })
    setRoleGroupDataList(newRoleGroupDataList)
    const flatArrayRole = []
    newRoleGroupDataList.forEach(tab => {
      tab.Roles.forEach(tabItem => flatArrayRole.push(tabItem))
    })
    form.setFieldsValue({
      ListRole: flatArrayRole
    })
  }

  return (
    <ModalWrapper
      title="Thêm nhóm quyền"
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      type={color ? type : false}
      width={width}
      className={className}
      destroyOnClose
      bodyStyle={{
        maxHeight: 'calc(100vh - 300px)',
        overflow: 'auto'
      }}
      footer={
        footer || footer === null ? (
          footer
        ) : (
          <div className="d-flex justify-content-end">
            <Space>
              <Button type="secondary" key="back" onClick={onCancel}>
                Đóng
              </Button>
              <Button
                type="primary"
                key="submit"
                onClick={handleSubmit}
                loading={isLoadingSubmit}
                icon={<Icon name="save" size={18} className="mr-2" />}
              >
                Ghi lại
              </Button>
            </Space>
          </div>
        )
      }
    >
      {isLoading ? (
        <div className="loading-wrapper">
          <Spin />
        </div>
      ) : (
        <FormDetailWrapper
          form={form}
          name="basic"
          layout="vertical"
          initialValues={{ RoleGroupName: '', ListRole: [] }}
        >
          <Form.Item
            label="Tên nhóm quyền"
            name="RoleGroupName"
            rules={[{ required: true, message: 'Tên nhóm quyền không được để trống' }]}
          >
            <Input placeholder="Nhập tên nhóm quyền" />
          </Form.Item>
          <Form.Item label="Chọn quyền" name="ListRole" className="mb-0">
            <>
              {roleGroupDataList.map((Tab, index) => (
                <TabRoleWrapper key={index}>
                  <div className="tab-role-name" key={Tab.TabID}>
                    {Tab.TabName}
                  </div>
                  <Space className="tab-role-list" wrap>
                    <Checkbox checked={isCheckAll(Tab)} onChange={e => handleCheckRole(e, Tab.TabID, 0)}>
                      Tất cả
                    </Checkbox>
                    {!!Tab.Roles &&
                      Tab.Roles.map((role, idx) => (
                        <Checkbox
                          key={idx}
                          checked={role.IsRole}
                          onChange={e => handleCheckRole(e, Tab.TabID, role.RoleValue)}
                        >
                          {role.RoleName}
                        </Checkbox>
                      ))}
                  </Space>
                </TabRoleWrapper>
              ))}
            </>
          </Form.Item>
        </FormDetailWrapper>
      )}
    </ModalWrapper>
  )
}

ModalCreateEditRoleGroup.defaultProps = {
  width: 820,
  className: 'atbd-modal'
}

ModalCreateEditRoleGroup.propTypes = {
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

export default ModalCreateEditRoleGroup
