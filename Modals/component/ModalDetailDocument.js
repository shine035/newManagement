import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Button, Input, Col, Space, Radio } from 'antd'

// API Service
import DocumentService from 'src/api/DocumentService'

// Function Helpers
import { formatDateVN } from 'src/helpers/FomatDateTime'
// import {
//   getListLanguage,
//   getNationalAssemblyByID,
//   getCongressMeetingByID,
//   getMeetingByID,
//   getSecurityLevelByID,
//   getOrganNameByID,
//   getAgencyCreateByID,
//   getTypeNameByID
// } from 'src/helpers/GetInfoByID'

// Component
import { ModalConfirmReception } from './ModalConfirmReception'
import { ModalDenyReception } from './ModalDenyReception'

// Styled Component
import { ModalWrapper, RowWrapper } from '../styled/ModalWrapper'

const ModalDetailDocument = props => {
  const {
    languages,
    nationalAssembly,
    congressMeeting,
    meeting,
    agencyCreate,
    organName,
    documentTypes,
    securityLevel
  } = useSelector(state => state.common)
  const { onCancel, className, onReceive, onReject, visible, type, color, width, documentObjectGuid } = props

  // State
  const [inforDocument, setInforDocument] = useState({})

  // State Modal
  const [isOpenModalConfirmReception, setIsOpenModalConfirmReception] = useState(false)
  const [isOpenModalDenyReception, setIsOpenModalDenyReception] = useState(false)

  const getDocumentByObjectGuid = () => {
    DocumentService.getOneDocumentSync(documentObjectGuid).then(res => {
      if (!res.isError && !res.Status) {
        setInforDocument({
          ...res?.Object,
          Languages: getListLanguage(res.Object?.Languages),
          IssuedDate: formatDateVN(res.Object?.IssuedDate),
          NationalAssembly: getNationalAssemblyByID(res.Object?.NationalAssembly),
          CongressMeeting: getCongressMeetingByID(res.Object?.CongressMeeting),
          Meeting: getMeetingByID(res.Object?.Meeting),
          AgencyCreate: getAgencyCreateByID(res.Object?.AgencyCreate),
          OrganName: getOrganNameByID(res?.Object?.OrganName),
          TypeName: getTypeNameByID(res?.Object?.TypeName),
          SecurityLevel: getSecurityLevelByID(res?.Object?.SecurityLevel)
        })
      }
    })
  }

  const getListLanguage = listLanguage => {
    const list = listLanguage?.map(item => languages.filter(e => e.CodeKey === item))
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

  const getAgencyCreateByID = id => {
    return agencyCreate.find(item => Number(item.CodeValue) === id)
  }

  const getOrganNameByID = id => {
    return organName.find(item => Number(item.CodeValue) === id)
  }

  const getTypeNameByID = id => {
    return documentTypes.find(item => Number(item.CodeValue) === id)
  }

  const getSecurityLevelByID = id => {
    return securityLevel.find(item => Number(item.CodeValue) === id)
  }

  const onReceiveDocument = () => {
    onReceive()
    setIsOpenModalConfirmReception(false)
    onCancel()
  }

  const onRejectDocument = content => {
    onReject(content)
    setIsOpenModalDenyReception(false)
    onCancel()
  }

  useEffect(() => {
    if (!visible) return
    getDocumentByObjectGuid(documentObjectGuid)
  }, [visible, documentObjectGuid])

  return (
    <ModalWrapper
      title="Chi tiết tài liệu giấy"
      visible={visible}
      onCancel={onCancel}
      type={color ? type : false}
      width={width}
      className={className}
      destroyOnClose
      footer={[
        <div className="d-flex justify-content-end" key={1}>
          <Space size="small">
            <Button type="danger" key="deny" onClick={() => setIsOpenModalDenyReception(true)}>
              Từ chối
            </Button>
            <Button type="primary" key="reception" onClick={() => setIsOpenModalConfirmReception(true)}>
              Tiếp nhận
            </Button>
            <Button type="secondary" key="back" onClick={onCancel}>
              Đóng
            </Button>
          </Space>
        </div>
      ]}
    >
      <RowWrapper gutter={20}>
        <Col span={6}>
          <b>Tiêu đề:</b>
        </Col>
        <Col span={18}>
          <span>{inforDocument?.Subject}</span>
        </Col>
      </RowWrapper>
      <RowWrapper gutter={20}>
        <Col span={6}>
          <b>Mã định danh VB:</b>
        </Col>
        <Col span={18}>
          <span>{inforDocument?.DocCode}</span>
        </Col>
      </RowWrapper>
      <RowWrapper gutter={20}>
        <Col span={6}>
          <b>Số và ký hiệu:</b>
        </Col>
        <Col span={18}>
          <span>{inforDocument?.FileNotation}</span>
        </Col>
      </RowWrapper>
      <RowWrapper gutter={20}>
        <Col span={6}>
          <b>Số văn bản:</b>
        </Col>
        <Col span={6}>
          <span>{inforDocument?.CodeNumber}</span>
        </Col>
        <Col span={6}>
          <b>Loại văn bản:</b>
        </Col>
        <Col span={6}>
          <span>{inforDocument?.TypeName?.Text}</span>
        </Col>
      </RowWrapper>
      <RowWrapper gutter={20}>
        <Col span={6}>
          <b>CQ, tổ chức BH:</b>
        </Col>
        <Col span={6}>
          <span>{inforDocument?.OrganName?.Text}</span>
        </Col>
        <Col span={6}>
          <b>Đơn vị soạn thảo:</b>
        </Col>
        <Col span={6}>
          <span>{inforDocument?.AgencyCreate?.Text}</span>
        </Col>
      </RowWrapper>
      <RowWrapper gutter={20}>
        <Col span={6}>
          <b>Lĩnh vực:</b>
        </Col>
        <Col span={6}>
          <span>{inforDocument?.Field}</span>
        </Col>
        <Col span={6}>
          <b>Ngày văn bản:</b>
        </Col>
        <Col span={6}>
          <span>{inforDocument?.IssuedDate}</span>
        </Col>
      </RowWrapper>
      <RowWrapper gutter={20}>
        <Col span={6}>
          <b>Ký hiệu thông tin:</b>
        </Col>
        <Col span={6}>
          <span>{inforDocument?.InforSign}</span>
        </Col>
      </RowWrapper>
      <RowWrapper gutter={20}>
        <Col span={6}>
          <b>Số tờ:</b>
        </Col>
        <Col span={6}>
          <span>{inforDocument?.PiecesOfPaper}</span>
        </Col>
        <Col span={6}>
          <b>Số trang:</b>
        </Col>
        <Col span={6}>
          <span>{inforDocument?.PageAmount}</span>
        </Col>
      </RowWrapper>
      <RowWrapper gutter={20}>
        <Col span={6}>
          <b>Ngôn ngữ:</b>
        </Col>
        <Col span={18}>
          <span>
            {inforDocument?.Languages?.map((item, idx) => {
              if (idx + 1 < inforDocument?.Languages?.length) {
                return `${item[0]?.Text}, `
              }
              return item[0]?.Text
            })}
          </span>
        </Col>
      </RowWrapper>
      <RowWrapper gutter={20}>
        <Col span={6}>
          <b>Độ mật:</b>
        </Col>
        <Col span={18}>
          <span>{inforDocument?.SecurityLevel?.Text}</span>
        </Col>
      </RowWrapper>
      <RowWrapper gutter={20}>
        <Col span={6}>
          <b>Bút tích:</b>
        </Col>
        <Col span={18}>
          <span>{inforDocument?.IssuedDate}</span>
        </Col>
      </RowWrapper>
      <RowWrapper gutter={20}>
        <Col span={6}>
          <b>Trích yếu nội dung:</b>
        </Col>
        <Col span={18}>
          <span>{inforDocument?.IssuedDate}</span>
        </Col>
      </RowWrapper>

      <div className="custom-col">
        <RowWrapper gutter={20}>
          <Col span={6}>
            <b>Vấn đề chính:</b>
          </Col>
          <Col span={18}>
            <span>{inforDocument?.KeywordIssue}</span>
          </Col>
        </RowWrapper>
        <RowWrapper gutter={20}>
          <Col span={6}>
            <b>Địa danh:</b>
          </Col>
          <Col span={18}>
            <span>{inforDocument?.KeywordPlace}</span>
          </Col>
        </RowWrapper>
        <RowWrapper gutter={20}>
          <Col span={6}>
            <b>Sự kiện:</b>
          </Col>
          <Col span={18}>
            <span>{inforDocument?.KeywordEvent}</span>
          </Col>
        </RowWrapper>
      </div>
      <RowWrapper gutter={20}>
        <Col span={6}>
          <b>Chú giải:</b>
        </Col>
        <Col span={18}>
          <span>{inforDocument?.Description}</span>
        </Col>
      </RowWrapper>
      <RowWrapper gutter={20}>
        <Col span={6}>
          <b>Tình trạng vật lý:</b>
        </Col>
        <Col span={6}>
          <span>{inforDocument?.Format}</span>
        </Col>
        <Col span={6}>
          <b>Chế độ sử dụng:</b>
        </Col>
        <Col span={6}>
          <span>{inforDocument?.Mode}</span>
        </Col>
      </RowWrapper>
      <RowWrapper gutter={20}>
        <Col span={6}>
          <b>Mức độ tin cậy:</b>
        </Col>
        <Col span={6}>
          <span>{inforDocument?.ConfidenceLevel}</span>
        </Col>
      </RowWrapper>
      <RowWrapper gutter={20}>
        <Col span={6}>
          <b>File tài liệu:</b>
        </Col>
        <Col span={6}>
          <a>Tài liệu.doc</a>
          <a>Tài liệu.doc</a>
        </Col>
      </RowWrapper>
      <RowWrapper gutter={20}>
        <Col span={6}>
          <b>Mã hồ sơ lưu trữ:</b>
        </Col>
        <Col span={6}>
          <span>Bình thường</span>
        </Col>
      </RowWrapper>
      <RowWrapper gutter={20}>
        <Col span={6}>
          <b>Tiêu đề hồ sơ:</b>
        </Col>
        <Col span={6}>
          <span>Bình thường</span>
        </Col>
      </RowWrapper>
      <RowWrapper gutter={20}>
        <Col span={6}>
          <b>Khóa:</b>
        </Col>
        <Col span={3}>
          <span>{inforDocument?.NationalAssembly?.CodeKey}</span>
        </Col>
        <Col span={4}>
          <b>Kỳ họp thứ:</b>
        </Col>
        <Col span={3}>
          <span>{inforDocument?.CongressMeeting?.CodeKey}</span>
        </Col>
        <Col span={4}>
          <b>Phiên họp:</b>
        </Col>
        <Col span={4}>
          <span>{inforDocument?.Meeting?.CodeKey}</span>
        </Col>
      </RowWrapper>
      <RowWrapper gutter={20}>
        <Col span={6}>
          <b>Thời hạn bảo quản:</b>
        </Col>
        <Col span={9}>
          <Radio.Group value={inforDocument?.StorageTimeType}>
            <Radio value={1}>Vĩnh viễn</Radio>
            <Radio value={2}>Có thời hạn</Radio>
          </Radio.Group>
        </Col>
        <Col span={3}>
          <Input value={inforDocument?.Maintenance} />
        </Col>
        <Col span={2}>Năm</Col>
      </RowWrapper>
      {/* Modals */}
      <ModalConfirmReception
        visible={isOpenModalConfirmReception}
        type="primary"
        data={inforDocument}
        onOk={onReceiveDocument}
        onCancel={() => setIsOpenModalConfirmReception(false)}
      />
      <ModalDenyReception
        visible={isOpenModalDenyReception}
        onOk={content => onRejectDocument(content)}
        onCancel={() => setIsOpenModalDenyReception(false)}
      />
    </ModalWrapper>
  )
}

ModalDetailDocument.defaultProps = {
  width: 756,
  className: 'atbd-modal'
}

ModalDetailDocument.propTypes = {
  onCancel: PropTypes.func,
  onReceive: PropTypes.func,
  onReject: PropTypes.func,
  visible: PropTypes.bool,
  documentObjectGuid: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.string,
  width: PropTypes.number,
  color: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
}

export default ModalDetailDocument
