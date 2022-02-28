import React, { useEffect, useState } from 'react'
import { Button, Empty } from 'antd'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

// API Service
import CommonService from 'src/api/CommonService'

// Helpers
import { formatDateAndTime } from 'src/helpers/FomatDateTime'

//
import TruncateText from 'src/components/TruncateText'

// styled
import { ModalWrapper, TableContentWrapper } from '../styled/ModalWrapper'

export const ModalHistory = props => {
  const { title, onCancel, className, onOk } = props
  const [isLoading, setIsLoading] = useState(false)
  const [historyData, setHistoryData] = useState([])
  const { objectGuidHistory, isOpenModalHistory } = useSelector(state => state.common)

  useEffect(() => {
    if (!isOpenModalHistory) return
    getDataHistory()
  }, [isOpenModalHistory])

  const getDataHistory = () => {
    setIsLoading(true)
    CommonService.history(objectGuidHistory)
      .then(res => {
        if (res?.Error) return
        const newList = res?.Object.map((item, index) => {
          return {
            ...item,
            index: index + 1
          }
        })
        setHistoryData(newList)
      })
      .finally(() => setIsLoading(false))
  }

  const columns = [
    {
      title: 'STT',
      key: 'index',
      align: 'center',
      dataIndex: 'index'
    },
    {
      title: 'Thời gian thực hiện',

      dataIndex: 'CreateDate',
      render: text => formatDateAndTime(text)
    },
    {
      title: 'Người thực hiện',
      dataIndex: 'UserName'
    },
    {
      title: 'Nội dung',
      dataIndex: 'LogContent',
      width: '50%',
      render: value => (
        <TruncateText maxLine={2} content={value} maxWidth="500px">
          <i>{value}</i>
        </TruncateText>
      )
    }
  ]
  return (
    <ModalWrapper
      title={title || 'Xem lịch sử'}
      visible={isOpenModalHistory}
      onOk={onOk}
      onCancel={onCancel}
      closable={false}
      width={900}
      className={className}
      destroyOnClose
      footer={[
        <div className="d-flex justify-content-end" key={1}>
          <Button type="primary" key="back" onClick={onCancel}>
            Đóng
          </Button>
        </div>
      ]}
    >
      <TableContentWrapper
        className="table-history"
        loading={isLoading}
        columns={columns}
        dataSource={historyData}
        pagination={false}
        locale={{
          emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có nội dung thay đổi!" />
        }}
      />
    </ModalWrapper>
  )
}

ModalHistory.defaultProps = {
  className: 'atbd-modal'
}

ModalHistory.propTypes = {
  title: PropTypes.string,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  className: PropTypes.string
}
