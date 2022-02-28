import React, { useState, useEffect } from 'react'
// import PropTypes from 'prop-types'
import { NavLink, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'

import Icon from 'src/components/Icon/Icon'
import { NavbarWrapper, NavLinkChildStyled, NavLinkChildWrapper } from './styled/NavbarWrapper'

function Navbar() {
  const { listTab } = useSelector(state => state.common)
  const [isShowHome] = useState(listTab.find(item => item.TabID === 1)?.IsVisitTab)
  const [isShowSearch] = useState(listTab.find(item => item.TabID === 2)?.IsVisitTab)
  const [isShowDataMangement] = useState(listTab.find(item => item.TabID === 3)?.IsVisitTab)
  const [isShowRequestManagement] = useState(listTab.find(item => item.TabID === 4)?.IsVisitTab)
  const [isShowReport] = useState(listTab.find(item => item.TabID === 5)?.IsVisitTab)
  const [isShowSettings] = useState(listTab.find(item => item.TabID === 6)?.IsVisitTab)
  const history = useHistory()
  const [activeLink, setActiveLink] = useState('')

  const getActiveLink = pathname => {
    if (pathname.includes('/look-file')) {
      return '/look-file'
    }
    if (pathname.includes('/audio-file')) {
      return '/audio-file'
    }
    if (pathname.includes('/delivery-file')) {
      return '/delivery-file'
    }
    return '/paper-file'
  }

  useEffect(() => {
    setActiveLink(getActiveLink(history.location.pathname))
  })

  return (
    <NavbarWrapper>
      {isShowHome && (
        <NavLink exact to="/" activeClassName="active" className="nav-item">
          Trang chủ
        </NavLink>
      )}
      {isShowSearch && (
        <NavLink exact to="/search" activeClassName="active" className="nav-item">
          Tra cứu - Tìm kiếm
        </NavLink>
      )}
      {isShowDataMangement && (
        <NavLink to={activeLink} activeClassName="active" className="nav-item">
          Quản lý dữ liệu
          <Icon name="arrow_drop_down" size={20} className="ml-1" />
          <NavLinkChildWrapper className="nav-child__wrapper">
            <NavLinkChildStyled to="/paper-file" activeClassName="active" className="nav-child-item">
              Hồ sơ giấy
            </NavLinkChildStyled>
            <NavLinkChildStyled to="/look-file" activeClassName="active" className="nav-child-item">
              Hồ sơ nhìn
            </NavLinkChildStyled>
            <NavLinkChildStyled to="/audio-file" activeClassName="active" className="nav-child-item">
              Hồ sơ nghe, nhìn
            </NavLinkChildStyled>
            <NavLinkChildStyled to="/delivery-file" activeClassName="active" className="nav-child-item">
              Giao nhận tài liệu
            </NavLinkChildStyled>
          </NavLinkChildWrapper>
        </NavLink>
      )}
      {isShowRequestManagement && (
        <NavLink exact to="/ticket" activeClassName="active" className="nav-item">
          Quản lý yêu cầu SDDL
        </NavLink>
      )}
      {isShowReport && (
        <NavLink to="/report" activeClassName="active" className="nav-item">
          Báo cáo thống kê
          <Icon name="arrow_drop_down" size={20} className="ml-1" />
          <NavLinkChildWrapper className="nav-child__wrapper">
            <NavLinkChildStyled exact to="/report" activeClassName="active" className="nav-child-item">
              Thống kê chung
            </NavLinkChildStyled>
            <NavLinkChildStyled exact to="/report/file-catalogue" activeClassName="active" className="nav-child-item">
              Mục lục hồ sơ phông LT
            </NavLinkChildStyled>
            <NavLinkChildStyled
              exact
              to="/report/document-catalogue"
              activeClassName="active"
              className="nav-child-item"
            >
              Danh sách tài liệu
            </NavLinkChildStyled>
            <NavLinkChildStyled exact to="/report/document-keyword" activeClassName="active" className="nav-child-item">
              Danh sách từ khóa
            </NavLinkChildStyled>
            <NavLinkChildStyled exact to="/report/document-secret" activeClassName="active" className="nav-child-item">
              Danh sách tài liệu mật
            </NavLinkChildStyled>
            <NavLinkChildStyled exact to="/report/report-explore" activeClassName="active" className="nav-child-item">
              Báo cáo phục vụ khai thác
            </NavLinkChildStyled>
          </NavLinkChildWrapper>
        </NavLink>
      )}
      {isShowSettings && (
        <NavLink to="/settings" activeClassName="active" className="nav-item">
          Quản trị hệ thống
          <Icon name="arrow_drop_down" size={20} className="ml-1" />
          <NavLinkChildWrapper className="nav-child__wrapper">
            <NavLinkChildStyled exact to="/settings" activeClassName="active" className="nav-child-item">
              Quản lý người dùng
            </NavLinkChildStyled>
            <NavLinkChildStyled exact to="/settings/roles" activeClassName="active" className="nav-child-item">
              Nhóm quyền
            </NavLinkChildStyled>
            {/* {isShowStorageUnit && (
              <NavLinkChildStyled exact to="/settings/storage-unit" activeClassName="active" className="nav-child-item">
                Đơn vị bảo quản
              </NavLinkChildStyled>
            )} */}
          </NavLinkChildWrapper>
        </NavLink>
      )}
    </NavbarWrapper>
  )
}

Navbar.propTypes = {}

export default Navbar
