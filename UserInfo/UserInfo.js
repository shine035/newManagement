import React from 'react'
import { Avatar, Menu, Dropdown } from 'antd'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useToast } from '@chakra-ui/react'

// components
import Notifications from 'src/components/Notifications'

// store
import { logOut } from 'src/store/authentication/actionCreator'

// styled
import { UserInfoWrapper } from './styled/UserInfoWrapper'

function UserInfo() {
  const history = useHistory()
  const dispatch = useDispatch()
  const toast = useToast()

  const { user } = useSelector(state => state.auth)
  const { roleTypeID } = useSelector(state => state.common)
  const handleLogOut = () => {
    dispatch(logOut())
    history.push('/')
    toast({
      title: 'Hẹn gặp lại',
      status: 'success',
      position: 'top-right',
      duration: 2000
    })
  }

  const menu = (
    <Menu>
      <Menu.Item>Thông tin cá nhân</Menu.Item>
      <Menu.Item danger onClick={() => handleLogOut()}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  )
  return (
    <UserInfoWrapper>
      <Notifications />
      <div className="user-information">
        <p className="user-name">{user?.FullName}</p>
        <p className="user-role">
          {roleTypeID === 1
            ? 'Admin'
            : roleTypeID === 2
            ? 'Chủ nhiệm'
            : roleTypeID === 3
            ? 'Vụ trưởng'
            : roleTypeID === 4
            ? 'QLLT'
            : roleTypeID === 5
            ? 'Độc giả'
            : 'Không xác định'}
        </p>
      </div>
      <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
        <Avatar
          src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          size={40}
          style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
        />
      </Dropdown>
    </UserInfoWrapper>
  )
}

UserInfo.propTypes = {}

export default UserInfo
