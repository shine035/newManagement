import React, { useEffect, useState } from 'react'
import { Breadcrumb, Form, Input, Col, Row, Select, DatePicker, Radio, Button, Spin, Space, InputNumber } from 'antd'
import { useToast } from '@chakra-ui/react'
import { Link, useHistory, useParams } from 'react-router-dom'
import moment from 'moment'
import { useSelector } from 'react-redux'

// Helpers
import { getActiveLinkByPathName } from 'src/helpers/string'
import { localeVN, dateFormat } from 'src/helpers/FomatDateTime'

// Component
import { ModalDeleteDocument } from 'src/components/Modals/component/ModalDeleteDocument'

// API Service
import GalleryService from 'src/api/GalleryService'
import FileService from 'src/api/FileService'

// styled
import { BreadcrumbWrapper, AddDocumentWrapper, FormAddDocumentWrapper, BoxWrapper } from '../styled/AddDocumentWrapper'

const { Option } = Select

const initialValuesForm = {
  ObjectGuid: '00000000-0000-0000-0000-000000000000',
  OrganizationCollectCode: '',
  InforSign: '',
  StorageTimeType: 2,
  Maintenance: '',
  GalleryContent: '',
  StartDate: null,
  EndDate: null,
  FileNationalAssembly: null,
  FileCongressMeeting: null,
  FileMeeting: null,
  NationalAssembly: 0,
  CongressMeeting: 0,
  Meeting: 0,
  NegativeNo: 0,
  PositiveNo: 0,
  Description: '',
  GalleryStatus: 2,
  FileObjectGuid: '00000000-0000-0000-0000-000000000000',
  PhotoType: 1
}

function AddGallery() {
  const [form] = Form.useForm()
  const history = useHistory()
  const toast = useToast()
  const [fileName, setFileName] = useState('')
  const [fileLink, setFileLink] = useState({})

  const { FileObjectGuid, ObjectGuid } = useParams()
  const { nationalAssembly, congressMeeting, meeting } = useSelector(state => state.common)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpenModalDeleteDocument, setIsOpenModalDeleteDocument] = useState(false)
  const [fileNationalAssembly, setFileNationalAssembly] = useState(null)
  const [fileCongressMeeting, setFileCongressMeeting] = useState(null)
  const [fileMeeting, setFileMeeting] = useState(null)

  // State List QHK, KHT, PH
  const [listNationalAssembly, setListNationalAssembly] = useState([])
  const [listCongressMeeting, setListCongressMeeting] = useState([])
  const [listMeeting, setListMeeting] = useState([])

  const disabledStartDate = current => {
    return current && current > moment(form.getFieldValue('EndDate')).endOf('day')
  }

  const disabledEndDate = current => {
    return current && current < moment(form.getFieldValue('StartDate')).endOf('day')
  }

  useEffect(() => {
    setFileLink(getActiveLinkByPathName(history.location.pathname))
    if (FileObjectGuid) {
      FileService.getOne(FileObjectGuid).then(res => {
        if (res.isError) return
        setFileName(res.Object?.FileNo)
        form.setFieldsValue({
          NationalAssembly: res.Object.NationalAssembly ? res.Object.NationalAssembly : null,
          CongressMeeting: res.Object.CongressMeeting ? res.Object.CongressMeeting : null,
          Meeting: res.Object.Meeting ? res.Object.Meeting : null
        })
        if (res.Object.NationalAssembly) {
          setListNationalAssembly(
            nationalAssembly.filter(item => Number(item.CodeValue) === res.Object?.NationalAssembly)
          )
          setFileNationalAssembly(res.Object.NationalAssembly)
        }
        if (res.Object.CongressMeeting) {
          setListCongressMeeting(congressMeeting.filter(item => Number(item.CodeValue) === res.Object?.CongressMeeting))
          setFileCongressMeeting(res.Object.CongressMeeting)
        }
        if (res.Object.Meeting) {
          setListMeeting(meeting.filter(item => Number(item.CodeValue) === res.Object?.Meeting))
          setFileMeeting(res.Object.Meeting)
        }
      })
    }
    if (ObjectGuid) getGalleryByObjectGuid(ObjectGuid)
  }, [])

  const getGalleryByObjectGuid = GalleryID => {
    setIsLoading(true)
    GalleryService.getOne(GalleryID)
      .then(res => {
        if (res.isError) return
        form.setFieldsValue({
          ...res.Object,
          EndDate: moment(res.Object?.EndDate),
          StartDate: moment(res.Object?.StartDate),
          Maintenance: res?.Object?.Maintenance || ''
        })
      })
      .finally(() => setIsLoading(false))
  }

  const deleteOK = reason => {
    setIsLoading(true)
    GalleryService.delete({
      ...reason,
      ObjectGuid
    })
      .then(res => {
        if (res.isError) return
        toast({
          title: 'Hồ sơ đã bị xóa thành công',
          status: 'success',
          position: 'bottom-right',
          duration: 2000,
          isClosable: true
        })
        setIsOpenModalDeleteDocument(false)
        history.push(`${fileLink.url}/${FileObjectGuid}/gallery`)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const onFinish = values => {
    setIsLoading(true)
    GalleryService.insertUpdate({
      ...values,
      ObjectGuid,
      FileObjectGuid,
      GalleryStatus: 2,
      FileNationalAssembly: fileNationalAssembly,
      FileCongressMeeting: fileCongressMeeting,
      FileMeeting: fileMeeting,
      EndDate: moment(values?.EndDate).format(),
      StartDate: moment(values?.StartDate).format()
    })
      .then(res => {
        if (res.isError) return
        toast({
          title: `${ObjectGuid ? 'Sửa sưu tập ảnh thành công' : 'Thêm mới sưu tập ảnh thành công'}`,
          status: 'success',
          position: 'bottom-right',
          duration: 2000,
          isClosable: true
        })
        history.push(`${fileLink.url}/${FileObjectGuid}/gallery`)
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <>
      <BreadcrumbWrapper>
        <Breadcrumb.Item>Quản lý dữ liệu</Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={fileLink.url}>{fileLink.name}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Hồ sơ {fileName}</Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={`${fileLink.url}/${FileObjectGuid}/gallery`}>Sưu tập ảnh</Link>
        </Breadcrumb.Item>
        {!ObjectGuid ? (
          <Breadcrumb.Item>Thêm mới Sưu tập ảnh</Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item>Xem, Sửa Sưu tập ảnh</Breadcrumb.Item>
        )}
      </BreadcrumbWrapper>
      <AddDocumentWrapper>
        <FormAddDocumentWrapper>
          <Form
            layout="vertical"
            initialValues={initialValuesForm}
            form={form}
            labelAlign="left"
            onFinish={onFinish}
            scrollToFirstError={{ behavior: 'smooth', block: 'center', inline: 'center' }}
            // onValuesChange={(changedValues, allValues) => handleChange(allValues)}
          >
            <Spin size="small" spinning={isLoading}>
              <BoxWrapper>
                <Row gutter={20}>
                  <Col span={4}>
                    <Form.Item
                      label="Mã ĐVBQ/ST ảnh"
                      name="OrganizationCollectCode"
                      required
                      rules={[
                        {
                          required: true,
                          message: 'Mã ĐVBQ nhỏ hơn 5 ký tự',
                          max: 5
                        }
                      ]}
                    >
                      <Input placeholder="Nhập mã ĐVBQ/ST ảnh" />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      name="StorageTimeType"
                      label="Thời hạn bảo quản"
                      rules={[
                        {
                          required: true,
                          message: 'Chưa chọn loại thời hạn bảo quản'
                        }
                      ]}
                    >
                      <Radio.Group>
                        <Radio value={1}>Vĩnh viễn</Radio>
                        <Radio value={2}>Có thời hạn</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col span={4} className="custom-col-8">
                    <Form.Item
                      noStyle
                      shouldUpdate={(prevValues, currentValues) =>
                        prevValues.StorageTimeType !== currentValues.StorageTimeType
                      }
                    >
                      {({ getFieldValue }) =>
                        getFieldValue('StorageTimeType') === 2 ? (
                          <>
                            <Form.Item
                              name="Maintenance"
                              style={{ marginBottom: 'unset' }}
                              rules={[
                                {
                                  required: true,
                                  message: 'Chưa nhập thời hạn bảo quản'
                                }
                              ]}
                            >
                              <InputNumber min={1} max={70} />
                            </Form.Item>
                            <div>Năm</div>
                          </>
                        ) : null
                      }
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col span={24}>
                    <Form.Item
                      label="Nội dung STA"
                      name="GalleryContent"
                      required
                      rules={[
                        {
                          required: true,
                          message: 'Chưa nhập Nội dung STA'
                        },
                        {
                          max: 500,
                          message: 'Tiêu đề  ít hơn 500 ký tự'
                        }
                      ]}
                    >
                      <Input.TextArea rows={3} placeholder="Nhập nội dung STA" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col span={4}>
                    <Form.Item
                      name="StartDate"
                      label="Thời gian bắt đầu"
                      rules={[
                        {
                          required: true,
                          message: 'Chưa nhập Thời gian bắt đầu'
                        }
                      ]}
                    >
                      <DatePicker
                        getPopupContainer={trigger => trigger.parentNode}
                        style={{ width: '100%' }}
                        locale={localeVN}
                        format={dateFormat}
                        inputReadOnly
                        disabledDate={disabledStartDate}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      name="EndDate"
                      label="Thời gian kết thúc"
                      rules={[
                        {
                          required: true,
                          message: 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu'
                        }
                      ]}
                    >
                      <DatePicker
                        getPopupContainer={trigger => trigger.parentNode}
                        style={{ width: '100%' }}
                        locale={localeVN}
                        format={dateFormat}
                        inputReadOnly
                        disabledDate={disabledEndDate}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={4}>
                    <Form.Item name="NegativeNo" label="Số lượng phim (âm bản)">
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item name="PositiveNo" label="Số lượng ảnh (dương bản)">
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item name="PhotoType" label="Loại hình">
                      <Select placeholder="Chọn" getPopupContainer={trigger => trigger.parentNode} showSearch>
                        <Option value={1}>Chân dung</Option>
                        <Option value={2}>Hoạt động</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col span={4}>
                    <Form.Item name="NationalAssembly" label="Khóa">
                      <Select placeholder="Chọn" getPopupContainer={trigger => trigger.parentNode} showSearch>
                        <Option key={0} value={0}>
                          Chọn
                        </Option>
                        {listNationalAssembly &&
                          listNationalAssembly.length &&
                          listNationalAssembly.map(item => (
                            <Option key={Number(item.CodeValue)} value={Number(item.CodeValue)}>
                              {item.Text}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item name="CongressMeeting" label="Kỳ họp thứ">
                      <Select placeholder="Chọn" getPopupContainer={trigger => trigger.parentNode} showSearch>
                        <Option key={0} value={0}>
                          Chọn
                        </Option>
                        {listCongressMeeting &&
                          listCongressMeeting.length &&
                          listCongressMeeting.map(item => (
                            <Option key={Number(item.CodeValue)} value={Number(item.CodeValue)}>
                              {item.Text}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item name="Meeting" label="Phiên họp">
                      <Select placeholder="Chọn" getPopupContainer={trigger => trigger.parentNode} showSearch>
                        <Option key={0} value={0}>
                          Chọn
                        </Option>
                        {listMeeting &&
                          listMeeting.length &&
                          listMeeting.map(item => (
                            <Option key={Number(item.CodeValue)} value={Number(item.CodeValue)}>
                              {item.Text}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col span={24}>
                    <Form.Item
                      name="Description"
                      label="Ghi chú"
                      rules={[
                        {
                          required: false,
                          message: 'Ghi chú',
                          max: 500
                        }
                      ]}
                    >
                      <Input.TextArea rows={3} placeholder="Nhập ghi chú" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col span={4}>
                    <Form.Item
                      name="InforSign"
                      label="Ký hiệu thông tin"
                      rules={[
                        {
                          required: false,
                          message: 'Chưa nhập Ký hiệu thông tin',
                          max: 30
                        }
                      ]}
                    >
                      <Input placeholder="Nhập ký hiệu thông tin" />
                    </Form.Item>
                  </Col>
                </Row>
                <div className="d-flex justify-content-center">
                  <Space size={20}>
                    {ObjectGuid && form.getFieldValue('GalleryStatus') === 2 && (
                      <Button type="danger" onClick={() => setIsOpenModalDeleteDocument(true)}>
                        Xóa
                      </Button>
                    )}
                    {((ObjectGuid && form.getFieldValue('GalleryStatus') === 2) || !ObjectGuid) && (
                      <Button type="primary" htmlType="submit">
                        Ghi lại
                      </Button>
                    )}
                    <Button type="secondary" key="back" onClick={() => history.goBack()}>
                      Quay lại
                    </Button>
                  </Space>
                </div>
              </BoxWrapper>
            </Spin>
          </Form>
        </FormAddDocumentWrapper>
        <ModalDeleteDocument
          visible={isOpenModalDeleteDocument}
          type="primary"
          onOk={deleteOK}
          onCancel={() => setIsOpenModalDeleteDocument(false)}
        />
      </AddDocumentWrapper>
    </>
  )
}

AddGallery.propTypes = {}

export default AddGallery
