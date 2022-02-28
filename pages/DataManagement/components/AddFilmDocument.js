import React, { useEffect, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { Breadcrumb, Form, Input, Col, Row, Select, DatePicker, Radio, Button, Spin, Space, InputNumber } from 'antd'
import { useToast } from '@chakra-ui/toast'

// API Service
import FilmService from 'src/api/FilmService'
import FileService from 'src/api/FileService'

// Components
import UploadFile from 'src/components/UploadFile'
import { ModalDeleteDocument } from 'src/components/Modals/component/ModalDeleteDocument'

// Function Helpers
import { isObjectGuidDefault } from 'src/helpers/ObjectGuid'
import { getActiveLinkByPathName } from 'src/helpers/string'
import { localeVN, dateFormat } from 'src/helpers/FomatDateTime'

// Styled Component
import { BreadcrumbWrapper, AddDocumentWrapper, FormAddDocumentWrapper, BoxWrapper } from '../styled/AddDocumentWrapper'

const { Option } = Select
const { TextArea } = Input

const initialValues = {
  ObjectGuid: '00000000-0000-0000-0000-000000000000',
  EventName: '',
  MovieTitle: '',
  ArchivesNumber: '',
  InforSign: '',
  Languages: ['TV'],
  Recorder: '',
  RecordDate: '',
  PlayTime: '',
  Quality: '',
  RecordPlace: '',
  Description: '',
  FilmStatus: 2,
  Format: 1,
  SecurityLevel: 1,
  StorageTimeType: 2,
  Maintenance: '',
  Mode: 2,
  FileNationalAssembly: 0,
  FileCongressMeeting: 0,
  FileMeeting: 0,
  NationalAssembly: null,
  CongressMeeting: null,
  Meeting: null,
  FileObjectGuid: '00000000-0000-0000-0000-000000000000',
  FileSecurityLevel: 0
}

function AddFilmDocument() {
  const history = useHistory()
  const [form] = Form.useForm()
  const toast = useToast()
  const { languages, nationalAssembly, congressMeeting, meeting, securityLevel } = useSelector(state => state.common)
  const { FileObjectGuid, ObjectGuid } = useParams()

  // State
  const [fileName, setFileName] = useState('')
  const [fileLink, setFileLink] = useState({})
  const [fileList, setFileList] = useState([])

  // State Modal
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false)

  // State Loading
  const [isLoading, setIsLoading] = useState(false)

  // State List QHK, KHT, PH
  const [listNationalAssembly, setListNationalAssembly] = useState([])
  const [listCongressMeeting, setListCongressMeeting] = useState([])
  const [listMeeting, setListMeeting] = useState([])

  const insertUpdateFilmDocument = (data, isContinue = false) => {
    const body = {
      ...data,
      FileObjectGuid,
      NationalAssembly: data.NationalAssembly || 0,
      CongressMeeting: data.CongressMeeting || 0,
      Meeting: data.Meeting || 0,
      PlayTime: data.PlayTime || '00:00:00',
      RecordDate: moment(data.RecordDate).format()
    }
    setIsLoading(true)
    FilmService.insertUpdate(body)
      .then(res => {
        setIsLoading(false)
        if (res.isError) return
        toast({
          title: `${!ObjectGuid ? 'Thêm mới tài liệu phim thành công' : 'Sửa tài liệu phim thành công'}`,
          status: 'success',
          position: 'bottom-right',
          duration: 2000,
          isClosable: true
        })
        if (!isContinue) {
          history.push(`${fileLink.url}/${FileObjectGuid}/film`)
        } else {
          setFileList([])
          form.setFieldsValue({
            ...form.getFieldsValue(true),
            ObjectGuid: '00000000-0000-0000-0000-000000000000',
            MovieTitle: '',
            ArchivesNumber: '',
            InforSign: '',
            Languages: ['TV'],
            PlayTime: '',
            Quality: '',
            Description: '',
            FilmStatus: 2,
            Format: 1,
            SecurityLevel: 1,
            StorageTimeType: 2,
            Maintenance: '',
            Mode: 2
          })
        }
      })
      .finally(() => setIsLoading(false))
  }

  const onChangeFile = ({ file: newFile }) => {
    setFileList([newFile])

    if (newFile?.status === 'done') {
      form.setFieldsValue({
        ...form.getFieldsValue(true),
        FilmPath: newFile?.response?.Object
      })
    } else if (newFile?.status === 'removed') {
      setFileList([])
    } else if (newFile?.status === 'error') {
      toast({
        title: `Tải file lên thất bại`,
        status: 'error',
        position: 'bottom-right',
        duration: 2000,
        isClosable: true
      })
    }
  }

  const onSubmitForm = (isContinue = false) => {
    form.validateFields().then(() => {
      insertUpdateFilmDocument(form.getFieldsValue(true), isContinue)
    })
  }

  const getFilmDocumentByObjectGuid = () => {
    FilmService.getOne(ObjectGuid).then(res => {
      if (!res.isError && !res.Status) {
        form.setFieldsValue({
          ...res.Object,
          NationalAssembly: res.Object?.NationalAssembly !== 0 ? res.Object?.NationalAssembly : null,
          CongressMeeting: res.Object?.CongressMeeting !== 0 ? res.Object?.CongressMeeting : null,
          Meeting: res.Object?.Meeting !== 0 ? res.Object?.Meeting : null,
          RecordDate: moment(res.Object?.RecordDate)
        })

        if (res.Object?.FilmPath) {
          const lastIndex = res.Object?.FilmPath?.lastIndexOf('\\')
          const listFile = {
            uid: '0',
            name: `${res.Object?.FilmPath?.slice(lastIndex + 1)}`,
            status: 'done',
            response: {
              Object: res.Object?.FilmPath
            }
          }
          setFileList([listFile])
        }
      }
    })
  }

  const getFileByObjectGuid = () => {
    FileService.getOne(FileObjectGuid).then(res => {
      if (!res.isError && !res.Status) {
        setFileName(res.Object?.FileNo)

        form.setFieldsValue({
          ...form.getFieldsValue(true),
          FileNationalAssembly: res.Object?.NationalAssembly,
          FileCongressMeeting: res.Object?.CongressMeeting,
          FileMeeting: res.Object?.Meeting,
          FileSecurityLevel: res.Object?.SecurityLevel
        })
        if (res.Object?.NationalAssembly) {
          setListNationalAssembly(
            nationalAssembly.filter(item => Number(item.CodeValue) === res.Object?.NationalAssembly)
          )
        }
        if (res.Object?.CongressMeeting) {
          setListCongressMeeting(congressMeeting.filter(item => Number(item.CodeValue) === res.Object?.CongressMeeting))
        }
        if (res.Object?.Meeting) {
          setListMeeting(meeting.filter(item => Number(item.CodeValue) === res.Object?.Meeting))
        }
      }
    })
  }

  const onDeleteFilmDocument = content => {
    const body = {
      ObjectGuid,
      Content: content.Content
    }
    FilmService.delete(body)
      .then(res => {
        if (res.isError) return
        toast({
          title: `Tài liệu đã được xóa thành công`,
          status: 'success',
          position: 'bottom-right',
          duration: 2000,
          isClosable: true
        })
        history.push(`${fileLink.url}/${FileObjectGuid}/film`)
      })
      .finally(() => {
        setIsOpenModalDelete(false)
      })
  }

  useEffect(() => {
    setFileLink(getActiveLinkByPathName(history.location.pathname))
    getFileByObjectGuid()
    if (ObjectGuid) {
      getFilmDocumentByObjectGuid()
    }
  }, [])

  return (
    <>
      <BreadcrumbWrapper>
        <Breadcrumb.Item>Quản lý dữ liệu</Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={fileLink.url}>{fileLink.name}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Hồ sơ {fileName}</Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={`${fileLink.url}/${FileObjectGuid}/film`}>Tài liệu phim ảnh, âm thanh</Link>
        </Breadcrumb.Item>
        {!ObjectGuid ? (
          <Breadcrumb.Item>Thêm mới Tài liệu phim ảnh, âm thanh</Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item>Xem, Sửa Tài liệu phim ảnh, âm thanh</Breadcrumb.Item>
        )}
      </BreadcrumbWrapper>
      <AddDocumentWrapper>
        <FormAddDocumentWrapper>
          <Form
            layout="vertical"
            initialValues={initialValues}
            form={form}
            labelAlign="left"
            scrollToFirstError={{ behavior: 'smooth', block: 'center', inline: 'center' }}
          >
            <Spin size="small" spinning={isLoading}>
              <BoxWrapper>
                <Row gutter={20}>
                  <Col span={24}>
                    <Form.Item
                      label="Tên sự kiện"
                      name="EventName"
                      required
                      rules={[
                        {
                          required: true,
                          message: 'Chưa nhập Tên sự kiện'
                        },
                        {
                          max: 500,
                          message: 'Tên sự kiện <= 500 ký tự'
                        }
                      ]}
                    >
                      <Input placeholder="Tên sự kiện" allowClear />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col span={24}>
                    <Form.Item
                      label="Tiêu đề"
                      name="MovieTitle"
                      required
                      rules={[
                        {
                          required: true,
                          message: 'Chưa nhập Tiêu đề'
                        },
                        {
                          max: 500,
                          message: 'Tiêu đề <= 500 ký tự'
                        }
                      ]}
                    >
                      <Input placeholder="Tiêu đề" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col span={4}>
                    <Form.Item
                      label="Số lưu trữ"
                      name="ArchivesNumber"
                      required
                      rules={[
                        {
                          required: true,
                          message: 'Chưa nhập Số lưu trữ'
                        },
                        {
                          max: 50,
                          message: 'Số lưu trữ <= 50 ký tự'
                        }
                      ]}
                    >
                      <Input placeholder="Số lưu trữ" />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      label="Khóa"
                      name="NationalAssembly"
                      rules={[
                        () => ({
                          validator(_, value) {
                            if (value === 0) {
                              form.setFieldsValue({
                                ...form.getFieldsValue(true),
                                NationalAssembly: null
                              })
                            }
                            return Promise.resolve()
                          }
                        })
                      ]}
                    >
                      <Select
                        showSearch
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        placeholder="Chọn Khóa"
                        getPopupContainer={trigger => trigger.parentNode}
                        disabled={!listNationalAssembly.length}
                      >
                        <Option key={0} value={0}>
                          Không chọn
                        </Option>
                        {!!listNationalAssembly &&
                          !!listNationalAssembly.length &&
                          listNationalAssembly.map((item, idx) => (
                            <Option key={idx} value={Number(item.CodeValue)}>
                              {item.Text}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      name="CongressMeeting"
                      label="Kỳ họp thứ"
                      rules={[
                        () => ({
                          validator(_, value) {
                            if (value === 0) {
                              form.setFieldsValue({
                                ...form.getFieldsValue(true),
                                CongressMeeting: null
                              })
                            }
                            return Promise.resolve()
                          }
                        })
                      ]}
                    >
                      <Select
                        showSearch
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        placeholder="Chọn Kỳ họp thứ"
                        getPopupContainer={trigger => trigger.parentNode}
                        disabled={!listNationalAssembly.length}
                      >
                        <Option key={0} value={0}>
                          Không chọn
                        </Option>
                        {!!listCongressMeeting &&
                          !!listCongressMeeting.length &&
                          listCongressMeeting.map((item, idx) => (
                            <Option key={idx} value={Number(item.CodeValue)}>
                              {item.Text}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      name="Meeting"
                      label="Phiên họp"
                      rules={[
                        () => ({
                          validator(_, value) {
                            if (value === 0) {
                              form.setFieldsValue({
                                ...form.getFieldsValue(true),
                                Meeting: null
                              })
                            }
                            return Promise.resolve()
                          }
                        })
                      ]}
                    >
                      <Select
                        showSearch
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        placeholder="Chọn Phiên họp"
                        getPopupContainer={trigger => trigger.parentNode}
                        disabled={!listNationalAssembly.length}
                      >
                        <Option key={0} value={0}>
                          Không chọn
                        </Option>
                        {!!listMeeting &&
                          !!listMeeting.length &&
                          listMeeting.map((item, idx) => (
                            <Option key={idx} value={Number(item.CodeValue)}>
                              {item.Text}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8} className="custom-col-8">
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
                    <Form.Item
                      noStyle
                      shouldUpdate={(prevValues, currentValues) =>
                        prevValues.StorageTimeType !== currentValues.StorageTimeType
                      }
                    >
                      {({ getFieldValue }) =>
                        getFieldValue('StorageTimeType') === 2 ? (
                          <>
                            <Col span={4}>
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
                            </Col>
                            <div>Năm</div>
                          </>
                        ) : null
                      }
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col span={24}>
                    <Form.Item name="Languages" label="Ngôn ngữ">
                      <Select
                        mode="multiple"
                        showSearch
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        allowClear
                        showArrow
                        placeholder="Chọn ngôn ngữ"
                        getPopupContainer={trigger => trigger.parentNode}
                      >
                        {languages.map((item, idx) => (
                          <Option key={idx} value={item.CodeKey}>
                            {item.Text}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col span={4}>
                    <Form.Item
                      name="Mode"
                      label="Chế độ sử dụng"
                      required
                      rules={[
                        {
                          required: true,
                          message: 'Chưa chọn Chế độ sử dụng'
                        }
                      ]}
                    >
                      <Select placeholder="Chọn Chế độ sử dụng" getPopupContainer={trigger => trigger.parentNode}>
                        <Option value={1}>Hạn chế</Option>
                        <Option value={2}>Không hạn chế</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      name="InforSign"
                      label="Ký hiệu thông tin"
                      rules={[
                        {
                          max: 30,
                          message: 'Ký hiệu thông tin <= 30 ký tự'
                        }
                      ]}
                    >
                      <Input placeholder="Ký hiệu thông tin" />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      name="Recorder"
                      label="Tác giả"
                      rules={[
                        {
                          max: 300,
                          message: 'Ký hiệu thông tin <= 300 ký tự'
                        }
                      ]}
                    >
                      <Input placeholder="Tác giả" />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      name="RecordDate"
                      label="Thời gian"
                      required
                      rules={[
                        {
                          required: true,
                          message: 'Chưa chọn Thời gian'
                        }
                      ]}
                    >
                      <DatePicker
                        getPopupContainer={trigger => trigger.parentNode}
                        style={{ width: '100%' }}
                        locale={localeVN}
                        format={dateFormat}
                        inputReadOnly
                      />
                    </Form.Item>
                  </Col>
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) => prevValues.PlayTime !== currentValues.PlayTime}
                  >
                    <Col span={4}>
                      <Form.Item
                        name="PlayTime"
                        label="Thời lượng"
                        rules={[
                          () => ({
                            validator(_, value) {
                              if (!value || value.length <= 8) {
                                const playTime = value.replace(/(\d{2})(?=(\d)+(?!\d))/g, '$1:')
                                form.setFieldsValue({
                                  ...form.getFieldsValue(true),
                                  PlayTime: playTime
                                })
                                return Promise.resolve()
                              }
                              return Promise.resolve()
                            }
                          }),
                          { pattern: new RegExp('^\\d{2}:\\d{2}:\\d{2}$'), message: 'Sai định dạng Thời lượng' }
                        ]}
                      >
                        <Input placeholder="00:00:00" />
                      </Form.Item>
                    </Col>
                  </Form.Item>
                  <Col span={4}>
                    <Form.Item
                      name="Quality"
                      label="Chất lượng"
                      rules={[
                        {
                          max: 50,
                          message: 'Chất lượng <= 50 ký tự'
                        }
                      ]}
                    >
                      <Input placeholder="Chất lượng" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col span={24}>
                    <Form.Item
                      label="Địa điểm"
                      name="RecordPlace"
                      rules={[
                        {
                          max: 300,
                          message: 'Địa điểm <= 300 ký tự'
                        }
                      ]}
                    >
                      <Input placeholder="Địa điểm" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={20} style={{ alignItems: 'baseline' }}>
                  <Col>File tài liệu</Col>
                  <Col>
                    <Form.Item name="FilmPath">
                      <UploadFile accept="mp3, .mp4, .wma" fileList={fileList} onChange={onChangeFile} />
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
                          max: 500,
                          message: 'Ký hiệu thông tin <= 500 ký tự'
                        }
                      ]}
                    >
                      <TextArea />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col span={4}>
                    <Form.Item
                      name="Format"
                      label="Tình trạng vật lý"
                      required
                      rules={[
                        {
                          required: true,
                          message: 'Chưa chọn tình trạng vật lý'
                        }
                      ]}
                    >
                      <Select placeholder="Chọn Tình trạng vật lý" getPopupContainer={trigger => trigger.parentNode}>
                        <Option value={1}>Bình thường</Option>
                        <Option value={2}>Hư hỏng</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      name="SecurityLevel"
                      label="Độ bảo mật"
                      required
                      rules={[
                        {
                          required: true,
                          message: 'Chưa nhập mã định danh văn bản'
                        }
                      ]}
                    >
                      <Select placeholder="Chọn Độ bảo mật" getPopupContainer={trigger => trigger.parentNode}>
                        {!!securityLevel &&
                          !!securityLevel.length &&
                          securityLevel.map((item, idx) => (
                            <Option key={idx} value={Number(item?.CodeValue)}>
                              {item?.Text}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <div className="d-flex justify-content-center">
                  <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues !== currentValues}>
                    {({ getFieldValue }) => (
                      <Space size={20}>
                        {!isObjectGuidDefault(getFieldValue('ObjectGuid')) && (
                          <Button type="danger" key="delete" onClick={() => setIsOpenModalDelete(true)}>
                            Xóa
                          </Button>
                        )}
                        <Button type="primary" onClick={() => onSubmitForm(false)}>
                          Ghi lại
                        </Button>
                        {isObjectGuidDefault(getFieldValue('ObjectGuid')) && (
                          <Button type="primary" onClick={() => onSubmitForm(true)}>
                            Ghi lại và thêm tiếp
                          </Button>
                        )}

                        <Button onClick={() => history.goBack()} key="back">
                          Quay lại
                        </Button>
                      </Space>
                    )}
                  </Form.Item>
                </div>
              </BoxWrapper>
            </Spin>
          </Form>
        </FormAddDocumentWrapper>
      </AddDocumentWrapper>

      <ModalDeleteDocument
        visible={isOpenModalDelete}
        onOk={content => onDeleteFilmDocument(content)}
        onCancel={() => setIsOpenModalDelete(false)}
      />
    </>
  )
}

AddFilmDocument.propTypes = {}

export default AddFilmDocument
