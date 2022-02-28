import React, { useEffect, useState } from 'react'
import { Dropdown, Space, Avatar, Badge, Spin } from 'antd'
import { useDispatch } from 'react-redux'
import { useToast } from '@chakra-ui/react'

import InfiniteScroll from 'react-infinite-scroll-component'

// Store Redux
import actions from 'src/store/common/actions'

// API Service
import NotifyService from 'src/api/NotifyService'

// Ultis
import { formatDateVN } from 'src/helpers/FomatDateTime'

// Component
import Icon from 'src/components/Icon/Icon'

// Styled
import { NotificationsWrapper, NotificationsItem, NotificationListStyled } from './styled/NotificationsWrapper'

function Notifications() {
  const toast = useToast()

  const dispatch = useDispatch()

  // State
  const [isLoading, setIsLoading] = useState(false)
  const [numberUnread, setNumberUnread] = useState(null)
  const [listNotify, setListNotify] = useState([])
  const [paginationData, setPaginationData] = useState({
    CurrentPage: 1,
    PageSize: 10
  })

  useEffect(() => {
    setPaginationData({
      CurrentPage: 1,
      PageSize: 10
    })
    getTotalUnread()
  }, [])

  const getTotalUnread = () => {
    setIsLoading(true)
    NotifyService.totalUnread()
      .then(res => {
        if (res && res.isError) return
        setNumberUnread(res?.Object)
      })
      .finally(() => setIsLoading(false))
  }

  const getListNotify = body => {
    setIsLoading(true)
    setPaginationData(body)
    NotifyService.getList(paginationData.PageSize, paginationData.CurrentPage)
      .then(res => {
        if (res.isError) return

        setListNotify(res?.Object)
      })
      .finally(() => setIsLoading(false))
  }

  const handleMarkAll = e => {
    e.stopPropagation()
    setIsLoading(true)
    NotifyService.updateAllReaded()
      .then(res => {
        if (res.isError) return
        getTotalUnread()
        getListNotify(paginationData)
      })
      .finally(() => setIsLoading(false))
  }

  const handleRemoveAll = e => {
    e.stopPropagation()
    setIsLoading(true)
    NotifyService.deleteAll()
      .then(res => {
        if (res.isError) return
        setListNotify([])
      })
      .finally(() => setIsLoading(false))
  }

  const fetchMoreData = () => {
    setTimeout(() => {
      const body = {
        ...paginationData,
        CurrentPage: paginationData.CurrentPage + 1
      }
      setPaginationData(body)
      NotifyService.getList(paginationData.PageSize, paginationData.CurrentPage).then(res => {
        if (res.isError) return
        if (!listNotify) return
        setListNotify(listNotify.concat(res?.Object))
      })
    }, 1000)
  }

  const handleNoTice = value => {
    if (value?.TicketStatusID === 1 || value?.TicketStatusID === 3 || value?.TicketStatusID === 5) {
      if (value?.NotifyID) {
        if (value?.TicketObjectGuid) {
          dispatch(actions.setTicketObjectGuid(value?.TicketObjectGuid))
          dispatch(actions.setOpenModalDataMining())
        }
        setIsLoading(true)
        NotifyService.updateReaded(value?.NotifyID)
          .then(res => {
            if (res.isError) return
            getListNotify(paginationData)
            getTotalUnread()
          })
          .finally(() => setIsLoading(false))
      }
    } else {
      setIsLoading(true)
      NotifyService.updateReaded(value?.NotifyID)
        .then(res => {
          if (res.isError) return
          getListNotify(paginationData)
          getTotalUnread()
        })
        .finally(() => setIsLoading(false))
      toast({
        title: `${
          value?.TicketStatusID === 2
            ? 'Phiếu đã được tiếp nhận'
            : value?.TicketStatusID === 4
            ? 'Phiếu đã được duyệt'
            : value?.TicketStatusID === 6
            ? 'Phiếu đã bị từ chối'
            : value?.TicketStatusID === 7
            ? 'Phiếu đã bị xóa'
            : value?.TicketStatusID === 8
            ? 'Phiếu đã được trả'
            : value?.TicketStatusID === 9
            ? 'Phiếu đã quá hạn trả'
            : value?.Title
        }`,
        status: 'warning',
        duration: 5000,
        position: 'bottom-right',
        isClosable: true
      })
    }
  }

  const NotificationList = (
    <NotificationListStyled>
      <div className="notify-header">
        <div className="notify-header__title">
          <Badge count={numberUnread} offset={[20, 5]}>
            Thông báo
          </Badge>
        </div>
      </div>

      <div id="scrollableDiv" style={{ height: 300, overflow: 'auto' }}>
        <InfiniteScroll
          dataLength={listNotify && listNotify.length ? listNotify.length : 0}
          next={fetchMoreData}
          hasMore
          scrollableTarget="scrollableDiv"
        >
          <Spin size="small" spinning={isLoading}>
            {listNotify &&
              listNotify.length > 0 &&
              listNotify.map((item, ind) => (
                <NotificationsItem key={ind} className={!item?.IsRead && 'unread'} onClick={() => handleNoTice(item)}>
                  <div className="d-flex flex-column">
                    <Space align="start">
                      <div className="d-flex flex-row">
                        <Avatar
                          size={30}
                          style={{ backgroundColor: '#0c9d57' }}
                          icon={<Icon name="sports_kabaddi" color="white" />}
                        />
                        <div className="content" style={{ width: '100%' }}>
                          <div dangerouslySetInnerHTML={{ __html: item?.Title }} />
                        </div>
                      </div>
                    </Space>
                    <div className="content" style={{ width: '100%' }}>
                      <div className="time d-flex justify-content-end">{formatDateVN(item?.CreateDate)}</div>
                    </div>
                  </div>
                </NotificationsItem>
              ))}
          </Spin>
        </InfiniteScroll>
      </div>
      {listNotify && listNotify.length > 0 && (
        <Space className="notify-header__action">
          <div aria-hidden className="notify-header__read-all" onClick={e => handleMarkAll(e)}>
            Đánh dấu tất cả đã đọc
          </div>
          <div aria-hidden className="notify-header__remove" onClick={e => handleRemoveAll(e)}>
            Xoá tất cả
          </div>
        </Space>
      )}
    </NotificationListStyled>
  )
  return (
    <NotificationsWrapper onClick={() => getListNotify({ ...paginationData, CurrentPage: 1 })}>
      <Dropdown
        overlay={NotificationList}
        trigger={['click']}
        placement="bottomRight"
        overlayStyle={{ marginTop: '20px' }}
      >
        <Badge count={numberUnread}>
          <Icon name="notifications" size={24} color="white" />
        </Badge>
      </Dropdown>
    </NotificationsWrapper>
  )
}

Notifications.propTypes = {}

export default Notifications
