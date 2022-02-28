import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { Button, Input, Col, Space, Radio } from 'antd'

// Function Helpers
import { formatDateVN } from 'src/helpers/FomatDateTime'

// API Service
import FileService from 'src/api/FileService'

// Component
import { ModalConfirmReception } from 'src/components/Modals/component/ModalConfirmReception'
import { ModalDenyReception } from 'src/components/Modals/component/ModalDenyReception'

// Styled Component
import { ModalWrapper, RowWrapper } from '../styled/ModalWrapper'

const ModalDetailFile = props => {
  const { languages, nationalAssembly, congressMeeting, meeting } = useSelector(state => state.common)
  const { onCancel, className, onReceive, onReject, visible, type, style, color, width, fileObjectGuid } = props

  // State
  const [detailFile, setDetailFile] = useState({})

  // State Modal
  const [isOpenModalConfirmReception, setIsOpenModalConfirmReception] = useState(false)
  const [isOpenModalDenyReception, setIsOpenModalDenyReception] = useState(false)

  const getFileByObjectGuid = ObjectGuid => {
    FileService.getOne(ObjectGuid).then(res => {
      if (!res.isError && !res.Status) {
        setDetailFile({
          ...res?.Object,
          Languages: getListLanguage(res.Object?.Languages),
          EndDate: formatDateVN(res.Object?.EndDate),
          DeliveryDate: formatDateVN(res.Object?.DeliveryDate),
          NationalAssemblyFrom: getNationalAssemblyByID(res.Object?.NationalAssemblyFrom),
          NationalAssemblyTo: getNationalAssemblyByID(res.Object?.NationalAssemblyTo),
          CongressMeetingFrom: getCongressMeetingByID(res.Object?.CongressMeetingFrom),
          CongressMeetingTo: getCongressMeetingByID(res.Object?.CongressMeetingTo),
          MeetingFrom: getMeetingByID(res.Object?.MeetingFrom),
          MeetingTo: getMeetingByID(res.Object?.MeetingTo)
        })
      }
    })
  }

  const getListLanguage = listLanguage => {
    const list = []
    listLanguage?.forEach(item => {
      list.push(languages.filter(e => e.CodeKey === item))
    })
    return list
  }

  const getNationalAssemblyByID = id => {
    return nationalAssembly.find(item => Number(item.CodeValue) === id)
  }

  const getCongressMeetingByID = id => {
    return congressMeeting.find(item => Number(item.CodeValue) === id)
  }

  const getMeetingByID = id => {
    return meeting.find(item => Number(item.CodeValue) === id)
  }

  const onReceiveFile = () => {
    onReceive()
    setIsOpenModalConfirmReception(false)
  }

  const onRejectFile = content => {
    onReject(content)
    setIsOpenModalDenyReception(false)
  }

  useEffect(() => {
    if (!visible) return
    getFileByObjectGuid(fileObjectGuid)
  }, [fileObjectGuid])

  return (
    <ModalWrapper
      title="Chi tiết hồ sơ"
      visible={visible}
      style={style}
      onCancel={onCancel}
      type={color ? type : false}
      width={width}
      className={className}
      destroyOnClose
      footer={[
        <div className="d-flex justify-content-between" key={1}>
          {/* <Space> */}
          <Button type="danger" key="deny" onClick={() => setIsOpenModalDenyReception(true)}>
            Từ chối
          </Button>
          <Space size="small">
            <Button type="primary" key="reception" onClick={() => setIsOpenModalConfirmReception(true)}>
              Tiếp nhận
            </Button>
            <Button type="secondary" key="back" onClick={onCancel}>
              Đóng
            </Button>
          </Space>
          {/* </Space> */}
        </div>
      ]}
    >
      <RowWrapper gutter={20}>
        <Col span={6}>
          <b>Tiêu đề:</b>
        </Col>
        <Col span={18}>
          <span>{detailFile?.Title}</span>
        </Col>
      </RowWrapper>
      <RowWrapper gutter={20}>
        <Col span={6}>
          <b>Mã hồ sơ:</b>
        </Col>
        <Col span={18}>
          <span>{detailFile?.FileCode}</span>
        </Col>
      </RowWrapper>
      <RowWrapper gutter={20}>
        <Col span={6}>
          <b>Nhóm hồ sơ:</b>
        </Col>
        <Col span={18}>
          <span>
            {detailFile?.GroupFile === 1
              ? 'Hồ sơ giấy'
              : detailFile?.GroupFile === 2
              ? 'Hồ sơ nhìn'
              : detailFile?.GroupFile === 3
              ? 'Hồ sơ nghe nhìn'
              : ''}
          </span>
        </Col>
      </RowWrapper>
      <RowWrapper gutter={20}>
        <Col span={6}>
          <b>Hồ sơ số:</b>
        </Col>
        <Col span={6}>
          <span>{detailFile?.FileNo}</span>
        </Col>
        <Col span={6}>
          <b>Mục lục số:</b>
        </Col>
        <Col span={6}>
          <span>{detailFile?.FileCatalog}</span>
        </Col>
      </RowWrapper>
      <RowWrapper gutter={20}>
        <Col span={6}>
          <b>Mã CQ lưu trữ:</b>
        </Col>
        <Col span={6}>
          <span>{detailFile?.Identifier}</span>
        </Col>
        <Col span={6}>
          <b>Ký hiệu thông tin:</b>
        </Col>
        <Col span={6}>
          <span>{detailFile?.InforSign}</span>
        </Col>
      </RowWrapper>
      <RowWrapper gutter={20}>
        <Col span={6}>
          <b>Số tờ:</b>
        </Col>
        <Col span={6}>
          <span>{detailFile?.PiecesOfPaper}</span>
        </Col>
        <Col span={6}>
          <b>Số trang:</b>
        </Col>
        <Col span={6}>
          <span>{detailFile?.PageNumber}</span>
        </Col>
      </RowWrapper>
      <RowWrapper gutter={20}>
        <Col span={6}>
          <b>Số lượng VB:</b>
        </Col>
        <Col span={6}>
          <span>{detailFile?.TotalDoc}</span>
        </Col>
        <Col span={6}>
          <b>Thời gian kết thúc:</b>
        </Col>
        <Col span={6}>
          <span>{detailFile?.EndDate}</span>
        </Col>
      </RowWrapper>
      <RowWrapper gutter={20}>
        <Col span={6}>
          <b>Khóa:</b>
        </Col>
        <Col span={6}>
          <span>{detailFile?.NationalAssemblyFrom?.CodeKey}</span>
        </Col>
        <Col span={6}>
          <b>Đến:</b>
        </Col>
        <Col span={6}>
          <span>{detailFile?.NationalAssemblyTo?.CodeKey}</span>
        </Col>
      </RowWrapper>
      <RowWrapper gutter={20}>
        <Col span={6}>
          <b>Kỳ họp thứ:</b>
        </Col>
        <Col span={6}>
          <span>{detailFile?.CongressMeetingFrom?.CodeKey}</span>
        </Col>
        <Col span={6}>
          <b>Đến:</b>
        </Col>
        <Col span={6}>
          <span>{detailFile?.CongressMeetingTo?.CodeKey}</span>
        </Col>
      </RowWrapper>

      <RowWrapper gutter={20}>
        <Col span={6}>
          <b>Phiên họp:</b>
        </Col>
        <Col span={6}>
          <span>{detailFile?.MeetingFrom?.CodeKey}</span>
        </Col>
        <Col span={6}>
          <b>Đến:</b>
        </Col>
        <Col span={6}>
          <span>{detailFile?.MeetingTo?.CodeKey}</span>
        </Col>
      </RowWrapper>
      <RowWrapper gutter={20}>
        <Col span={6}>
          <b>Đ/V, cá nhân nộp:</b>
        </Col>
        <Col span={6}>
          <span>{detailFile?.PersonallyFiled}</span>
        </Col>
        <Col span={6}>
          <b>Ngày giao:</b>
        </Col>
        <Col span={6}>
          <span>{detailFile?.DeliveryDate}</span>
        </Col>
      </RowWrapper>
      <RowWrapper gutter={20}>
        <Col span={6}>
          <b>Ngôn ngữ:</b>
        </Col>
        <Col span={18}>
          <span>
            {detailFile?.Languages?.map((item, idx) => {
              if (idx + 1 < detailFile?.Languages?.length) {
                return `${item[0]?.Text}, `
              }
              return item[0]?.Text
            })}
          </span>
        </Col>
      </RowWrapper>
      <div className="custom-col">
        <RowWrapper gutter={20}>
          <Col span={6}>
            <b>Từ khóa</b>
          </Col>
        </RowWrapper>
        <RowWrapper gutter={20}>
          <Col span={6}>
            <b>Vấn đề chính:</b>
          </Col>
          <Col span={18}>
            <span>{detailFile?.KeywordIssue}</span>
          </Col>
        </RowWrapper>
        <RowWrapper gutter={20}>
          <Col span={6}>
            <b>Địa danh:</b>
          </Col>
          <Col span={18}>
            <span>{detailFile?.KeywordPlace}</span>
          </Col>
        </RowWrapper>
        <RowWrapper gutter={20}>
          <Col span={6}>
            <b>Sự kiện:</b>
          </Col>
          <Col span={18}>
            <span>{detailFile?.KeywordEvent}</span>
          </Col>
        </RowWrapper>
      </div>
      <RowWrapper gutter={20}>
        <Col span={6}>
          <b>Chú giải:</b>
        </Col>
        <Col span={18}>
          <span>{detailFile?.Description}</span>
        </Col>
      </RowWrapper>
      <RowWrapper gutter={20}>
        <Col span={6}>
          <b>Tình trạng vật lý:</b>
        </Col>
        <Col span={6}>
          <span>{detailFile?.Format === 1 ? 'Bình thường' : 'Hư hỏng'}</span>
        </Col>
        <Col span={6}>
          <b>Chế độ sử dụng:</b>
        </Col>
        <Col span={6}>
          <span>{detailFile?.Rights === 1 ? 'Hạn chế' : 'Không hạn chế'}</span>
        </Col>
      </RowWrapper>
      <RowWrapper gutter={20} className="align-items-center">
        <Col span={6}>
          <b>Thời hạn bảo quản:</b>
        </Col>
        <Col span={9}>
          <Radio.Group value={detailFile?.StorageTimeType}>
            <Radio value={1}>Vĩnh viễn</Radio>
            <Radio value={2}>Có thời hạn</Radio>
          </Radio.Group>
        </Col>

        {detailFile?.StorageTimeType === 2 && (
          <>
            <Col span={3}>
              <Input disabled defaultValue={detailFile?.Maintenance} />
            </Col>
            <Col span={2}>Năm</Col>
          </>
        )}
      </RowWrapper>
      {/* Modals */}
      <ModalConfirmReception
        visible={isOpenModalConfirmReception}
        type="primary"
        data={detailFile}
        onOk={onReceiveFile}
        onCancel={() => setIsOpenModalConfirmReception(false)}
      />
      <ModalDenyReception
        visible={isOpenModalDenyReception}
        onOk={content => onRejectFile(content)}
        onCancel={() => setIsOpenModalDenyReception(false)}
      />
    </ModalWrapper>
  )
}

ModalDetailFile.defaultProps = {
  width: 756,
  className: 'custom-modal-detail-user atbd-modal'
}

ModalDetailFile.propTypes = {
  fileObjectGuid: PropTypes.string,
  onCancel: PropTypes.func,
  onReceive: PropTypes.func,
  onReject: PropTypes.func,
  visible: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.string,
  style: PropTypes.object,
  width: PropTypes.number,
  color: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
}

export default ModalDetailFile
