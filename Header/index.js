import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import Logo from 'src/assets/images/logo-quoc-hoi.png'
import imgBackground from 'src/assets/images/header-background.svg'
import Navbar from 'src/components/Navbar/Navbar'
import { Col, Space, Avatar } from 'antd'
import { HeaderWrapper } from './styled/HeaderWrapper'
import UserInfo from '../UserInfo/UserInfo'

const Header = props => {
  const { isShowHeader } = props
  useEffect(() => {}, [])

  return (
    <HeaderWrapper>
      {!isShowHeader ? (
        <header className="d-flex justify-content-between align-items-center">
          <Space size={50}>
            <Space size={10}>
              <Avatar src={Logo} alt="logo-app" size={40} />
              <Col className="d-flex align-items-center">
                <span className="brand">Hệ thống lưu trữ</span>
              </Col>
            </Space>
            <Navbar />
          </Space>
          <UserInfo />
        </header>
      ) : (
        <header className="home-nav" style={{ backgroundImage: `url(${imgBackground})` }}>
          <div className="content-background">
            <Space size={10} className="img-content">
              <Avatar src={Logo} alt="logo-app" size={60} />
              <div>
                <Col className="brand">Tỉnh uỷ Tây Ninh</Col>
                <Col className="sub-title">Cơ sở dữ liệu hồ sơ - tài liệu lưu trữ Tỉnh uỷ Tây Ninh</Col>
              </div>
            </Space>
            <Space className="d-flex justify-content-lg-between">
              <Navbar />
              <UserInfo />
            </Space>
          </div>
        </header>
      )}
    </HeaderWrapper>
  )
}

Header.propTypes = {
  isShowHeader: PropTypes.bool
}

export default Header
