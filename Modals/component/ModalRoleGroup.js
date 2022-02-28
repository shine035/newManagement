import React, { useState } from 'react'
import { Button, Divider, Form, Input, Checkbox } from 'antd'
import PropTypes from 'prop-types'
import { ModalWrapper } from '../styled/ModalWrapper'

function ModalRoleGroup(props) {
  const { title, onCancel, className, onOk, visible, data, type, color, width } = props
  const [checkedList, setCheckedList] = useState([])
  const [checkAll, setCheckAll] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false)
  const optionsCheckbox = ['Vào tab', 'Thêm', 'Sửa', 'Xóa', 'Copy', 'Lịch sử']

  const onChangeCheckAll = e => {
    setCheckedList(e.target.checked ? optionsCheckbox : [])
    setIndeterminate(false)
    setCheckAll(e.target.checked)
  }

  const onChangeCheckItem = list => {
    setCheckedList(list)
    setIndeterminate(!!list.length && list.length < optionsCheckbox.length)
    setCheckAll(list.length === optionsCheckbox.length)
  }

  const onCreateRoleGroup = () => {}

  return (
    <ModalWrapper
      title={title || 'Thêm nhóm quyền'}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      type={color ? type : false}
      width={width}
      className={className}
      destroyOnClose
      footer={[
        <div className="d-flex justify-content-between" key={1}>
          <div>{data && <Button type="danger">Xóa nhóm quyền</Button>}</div>
          <div>
            <Button type="primary" form="form" key="submit" htmlType="submit">
              Ghi lại
            </Button>
            <Button type={type} key="back" onClick={onCancel}>
              Đóng
            </Button>
          </div>
        </div>
      ]}
    >
      <Form
        id="form"
        labelAlign="left"
        labelCol={{
          span: 4
        }}
        wrapperCol={{
          span: 20
        }}
        onFinish={onCreateRoleGroup}
      >
        <Form.Item
          name="RoleGroupName"
          label="Tên nhóm quyền"
          rules={[{ required: true, message: 'Nhập tên nhóm quyền' }]}
          initialValue={data?.RoleGroupName}
        >
          <Input />
        </Form.Item>
        <Divider>Chọn quyền</Divider>
        <Form.Item label="CT Kỳ họp">
          <Checkbox onChange={onChangeCheckAll} indeterminate={indeterminate} checked={checkAll}>
            Check all
          </Checkbox>
          <Checkbox.Group options={optionsCheckbox} value={checkedList} onChange={onChangeCheckItem} />
        </Form.Item>
      </Form>
    </ModalWrapper>
  )
}

ModalRoleGroup.defaultProps = {
  width: 900,
  className: 'atbd-modal'
}

ModalRoleGroup.propTypes = {
  title: PropTypes.string,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  visible: PropTypes.bool,
  data: PropTypes.object,
  className: PropTypes.string,
  type: PropTypes.string,
  width: PropTypes.number,
  color: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
}

export default ModalRoleGroup
