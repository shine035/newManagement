import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Form, DatePicker, Row, Col, Space, Input, Spin, InputNumber, Radio, Select } from 'antd'
import { useToast } from '@chakra-ui/react'
import moment from 'moment'
import { useSelector } from 'react-redux'

// API
import FileDeliveryService from 'src/api/FileDeliveryService'

// Style
import { ModalWrapper } from 'src/components/Modals/styled/ModalWrapper'
import { FormDataMiningTitle, FormDataMiningWrapper } from 'src/components/Modals/styled/FormDataMiningWrapper'

const initialValuesForm = {
  ObjectGuid: '00000000-0000-0000-0000-000000000000',
  UnitPersonalDelivery: 0,
  PersonalDelivery: '',
  DeliveryDate: '',
  DeliveryStartDate: '',
  Title: '',
  StartDate: '',
  EndDate: '',
  NumberOfBundle: '',
  LockupTool: '',
  Description: '',
  NationalAssembly: 0,
  FilePermanent: null,
  FileLimit: null,
  Placestorage: '',
  PurPose: '',
  Type: 1,
  UnitNumberOfBundle: '',
  UnitFilePermanent: '',
  UnitFileLimit: '',
  CancelType: '',
  DeliveryInputDate: ''
}
const { Option } = Select

const CreateEditTicketDelivery = props => {
  const { visible, objectGuid, onCancel, onOk, className, width } = props
  const [form] = Form.useForm()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const { unitPersinalDelivery, nationalAssembly } = useSelector(state => state.common)
  useEffect(() => {
    if (!visible) return
    if (objectGuid) {
      getOneFileDelivery()
    }
  }, [visible])

  const disabledStartDate = current => {
    return current && current > moment(form.getFieldValue('DeliveryDate')).endOf('day')
  }

  const disabledEndDate = current => {
    return current && current < moment(form.getFieldValue('DeliveryDate')).endOf('day')
  }

  const getOneFileDelivery = () => {
    FileDeliveryService.getOne(objectGuid).then(res => {
      if (res?.isError) return
      form.setFieldsValue({
        ...res?.Object,
        UnitPersonalDelivery: res?.Object.UnitPersonalDelivery,
        PersonalDelivery: res?.Object.PersonalDelivery,
        DeliveryStartDate: moment(res?.Object?.DeliveryStartDate),
        Title: res?.Object.Title || '',
        LockupTool: res?.Object.LockupTool || '',
        Description: res?.Object.Description || '',
        NationalAssembly: res?.Object.NationalAssembly || '',
        FilePermanent: res?.Object.FilePermanent || '',
        FileLimit: res?.Object.FileLimit || '',
        Placestorage: res?.Object.Placestorage || '',
        PurPose: res?.Object.PurPose || '',
        Type: res?.Object.Type,
        UnitNumberOfBundle: res?.Object.UnitNumberOfBundle || '',
        UnitFilePermanent: res?.Object.UnitFilePermanent || '',
        UnitFileLimit: res?.Object.UnitFileLimit || '',
        CancelType: res?.Object.CancelType,
        DeliveryInputDate: moment(res?.Object.DeliveryInpDeliveryInputDateutDate) || '',
        StartDate: moment(res?.Object.StartDate) || '',
        EndDate: moment(res?.Object.EndDate) || '',
        NumberOfBundle: res?.Object.NumberOfBundle || '',
        DeliveryDate: moment(res?.Object.DeliveryDate) || ''
      })
    })
  }

  const insertUpdate = data => {
    const body = {
      ...data,
      DeliveryDate: moment(data?.DeliveryDate).format(),
      StartDate: moment(data?.StartDate).format(),
      EndDate: moment(data?.EndDate).format()
    }
    setIsLoading(false)
    FileDeliveryService.insertUpdate(body)
      .then(res => {
        if (res?.isError) return
        toast({
          title: `${
            !objectGuid
              ? 'Thêm phiếu nhập, xuất hồ sơ tài liệu thành công'
              : 'Sửa phiếu nhập, xuất hồ sơ tài liệu thành công'
          }`,
          status: 'success',
          position: 'bottom-right',
          duration: 2000,
          isClosable: true
        })
        onCancel()
        onOk()
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <ModalWrapper
      title={`${!objectGuid ? 'Thêm phiếu nhập, xuất hồ sơ tài liệu' : 'Sửa phiếu nhập, xuất hồ sơ tài liệu'}`}
      visible={visible}
      onOk={onOk}
      width={width}
      onCancel={onCancel}
      className={className}
      destroyOnClose
      footer={[
        <div key="footer" className="d-flex justify-content-end">
          {/* <div>
            {objectGuid && (
              <Button type="danger" onClick={() => setIsOpenModalDeleteTicket(true)}>
                Xóa
              </Button>
            )}
          </div> */}
          <Space>
            <Button type="primary" key="submit" htmlType="submit" form="formMining">
              Lập phiếu
            </Button>
            <Button type="secondary" key="back" onClick={onCancel}>
              Đóng
            </Button>
          </Space>
        </div>
      ]}
    >
      <FormDataMiningWrapper>
        <Form
          form={form}
          layout="horizontal"
          id="formMining"
          initialValues={initialValuesForm}
          onFinish={() => insertUpdate(form.getFieldsValue(true))}
          wrapperCol={{ flex: 1 }}
          colon={false}
        >
          <Spin size="small" spinning={isLoading}>
            <FormDataMiningTitle>
              <p className="top-title">PHIẾU GIAO NỘP HỒ SƠ, TÀI LIỆU</p>
            </FormDataMiningTitle>
            <Row gutter={20}>
              <Col span={24}>
                <Form.Item
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  name="Type"
                  label=""
                  rules={[
                    {
                      required: true,
                      message: 'Chưa chọn loại thời hạn bảo quản'
                    }
                  ]}
                >
                  <Radio.Group>
                    <Radio value={1}>Giao nhận và nhập kho</Radio>
                    <Radio value={2}>Xuất kho</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={20}>
              <Col span={24}>
                <Form.Item
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  label="Cơ quan, đơn vị giao"
                  name="UnitPersonalDelivery"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập Cơ quan, đơn vị giao'
                    }
                  ]}
                >
                  <Select
                    placeholder="Chọn Cơ quan, đơn vị giao"
                    getPopupContainer={trigger => trigger.parentNode}
                    showSearch
                  >
                    <Option key={0} value={0}>
                      Chọn
                    </Option>
                    {unitPersinalDelivery &&
                      unitPersinalDelivery.length &&
                      unitPersinalDelivery.map((item, idx) => (
                        <Option key={idx} value={Number(item.CodeValue)}>
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
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  label="Cá nhân giao"
                  name="PersonalDelivery"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập Tên Cá nhân giao'
                    },
                    {
                      max: 200,
                      message: 'Tên cá nhân giao nhỏ hơn 200 ký tự'
                    }
                  ]}
                >
                  <Input placeholder="Nhập tên cá nhân giao" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  labelCol={{ span: 8 }}
                  // wrapperCol={{ span: 20 }}
                  label="Thời gian giao"
                  name="DeliveryStartDate"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng chọn Thời gian giao'
                    }
                  ]}
                >
                  <DatePicker
                    getPopupContainer={trigger => trigger.parentNode}
                    style={{ width: '100%' }}
                    format="DD/MM/YYYY"
                    placeholder="Chọn Thời gian"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Thời gian nhập kho"
                  name="DeliveryDate"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng chọn Thời gian nhập kho'
                    }
                  ]}
                >
                  <DatePicker
                    getPopupContainer={trigger => trigger.parentNode}
                    style={{ width: '100%' }}
                    format="DD/MM/YYYY"
                    placeholder="Chọn Thời gian"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={0}>
              <Col span={24}>
                <Form.Item
                  labelCol={{ span: 4 }}
                  label={
                    <>
                      <p style={{ fontWeight: 600 }}>
                        Nội dung tiêu đề
                        <br />
                        Hồ sơ, Tài liệu
                      </p>
                    </>
                  }
                  name="Title"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập Nội dung tiêu đề Hồ sơ, Tài liệu'
                    },
                    {
                      max: 1000,
                      message: 'Tiêu đề Hồ sơ, Tài liệu nhỏ hơn 1000 ký tự'
                    }
                  ]}
                >
                  <Input.TextArea placeholder="Nhập Nội dung tiêu đề Hồ sơ, Tài liệu" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={20}>
              <Col span={10}>
                <Form.Item label="Thời gian Hồ sơ Tài liệu: Từ" name="StartDate">
                  <DatePicker
                    getPopupContainer={trigger => trigger.parentNode}
                    style={{ width: '100%' }}
                    format="DD/MM/YYYY"
                    placeholder="Chọn ngày"
                    disabledDate={disabledStartDate}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Đến" name="EndDate">
                  <DatePicker
                    getPopupContainer={trigger => trigger.parentNode}
                    style={{ width: '100%' }}
                    format="DD/MM/YYYY"
                    placeholder="Chọn ngày"
                    disabledDate={disabledEndDate}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="NationalAssembly"
                  label="Quốc hội khóa"
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
                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    placeholder="Chọn Quốc hội khóa"
                    getPopupContainer={trigger => trigger.parentNode}
                  >
                    <Option key={0} value={0}>
                      Chọn
                    </Option>
                    {!!nationalAssembly &&
                      !!nationalAssembly.length &&
                      nationalAssembly.map((item, idx) => (
                        <Option key={idx + 1} value={Number(item.CodeValue)}>
                          {item.Text}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={20}>
              <Col span={12}>
                <Form.Item labelCol={{ span: 8 }} label="Số lượng" name="NumberOfBundle">
                  <InputNumber min={0} placeholder="Nhập số lượng" />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="UnitNumberOfBundle">
                  <InputNumber min={0} placeholder="mét" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Loại hủy" name="CancelType">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item labelCol={{ span: 8 }} label="Hồ sơ vĩnh viễn" name="FilePermanent">
                  <InputNumber min={0} />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="UnitFilePermanent">
                  <InputNumber min={0} placeholder="mét" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item labelCol={{ span: 8 }} label="Hồ sơ có giới hạn" name="FileLimit">
                  <InputNumber min={0} />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="UnitFileLimit">
                  <InputNumber min={0} placeholder="mét" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={20}>
              <Col span={24}>
                <Form.Item
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  label="Nơi bảo quản"
                  name="Placestorage"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập Cơ quan, đơn vị giao'
                    },
                    {
                      max: 1000,
                      message: 'Nơi bảo quản nhỏ hơn 1000 ký tự'
                    }
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={20}>
              <Col span={24}>
                <Form.Item
                  label="Công cụ tra cứu"
                  name="LockupTool"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  rules={[
                    {
                      max: 1000,
                      message: 'Công cụ tra cứu nhỏ hơn 1000 ký tự'
                    }
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            {/* <Row gutter={20}>
              <Col span={24}>
                <Form.Item
                  label="Mục đích"
                  name="PurPose"
                  rules={[
                    {
                      max: 2000,
                      message: 'Mục đích nhỏ hơn 2000 ký tự'
                    }
                  ]}
                >
                  <Input.TextArea />
                </Form.Item>
              </Col>
            </Row> */}
            <Row gutter={20}>
              <Col span={24}>
                <Form.Item
                  label="Ghi chú"
                  labelCol={{ span: 4 }}
                  name="Description"
                  rules={[
                    {
                      max: 2000,
                      message: 'Ghi chú nhỏ hơn 2000 ký tự'
                    }
                  ]}
                >
                  <Input.TextArea />
                </Form.Item>
              </Col>
            </Row>
          </Spin>
        </Form>
      </FormDataMiningWrapper>
    </ModalWrapper>
  )
}

CreateEditTicketDelivery.defaultProps = {
  width: 1000,
  className: 'atbd-modal'
}

CreateEditTicketDelivery.propTypes = {
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  visible: PropTypes.bool,
  objectGuid: PropTypes.string,
  width: PropTypes.number,
  className: PropTypes.string
}

export { CreateEditTicketDelivery }
