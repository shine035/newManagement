import React, { useEffect, useState } from 'react'
import { Col, Row, Spin } from 'antd'
import PropTypes from 'prop-types'
import { LoadingOutlined } from '@ant-design/icons'

// API Services
import GeneralStatisticService from 'src/api/GeneralStatistic'

import { StatisBlockWrapper, BoxStatisWrapper } from '../styled'

const BoxStatis = ({ title, total, color, backgroundColor, paper, look, sound }) => {
  return (
    <BoxStatisWrapper color={color} backgroundColor={backgroundColor}>
      <div className="statis-box-title">{title}</div>
      <div className="statis-box-total">{total}</div>
      <div className="statis-box-paper">{paper}</div>
      <div className="statis-box-paper">{look}</div>
      <div className="statis-box-paper">{sound}</div>
    </BoxStatisWrapper>
  )
}

function DocumentSecret() {
  const [isLoading, setisLoading] = useState(false)
  const [confideltialStatistic, setConfideltialStatistic] = useState({
    FileTotal: 0,
    DocumentTotal: 0,
    PageAmountTotal: 0
  })

  useEffect(() => {
    getInitData()
  }, [])

  const getInitData = () => {
    setisLoading(true)
    GeneralStatisticService.getConfideltialStatistic()
      .then(res => {
        if (res.isError) return
        setConfideltialStatistic({ ...res.Object })
      })
      .finally(() => setisLoading(false))
  }

  return (
    <StatisBlockWrapper>
      <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} spinning={isLoading}>
        <Row justify="center" align="top" gutter={60}>
          <Col xs={24} lg={8} xl={7}>
            <BoxStatis
              title="Tổng số Hồ sơ"
              total={confideltialStatistic.FileTotal}
              backgroundColor="#C0E5CE"
              color="#0D9D57"
              paper={`${confideltialStatistic.FileTotal_ConfidentialLevel1} : ĐVBQ Mật`}
              look={`${confideltialStatistic.FileTotal_ConfidentialLevel2} : ĐVBQ Tối mật`}
              sound={`${confideltialStatistic.FileTotal_ConfidentialLevel3} : ĐVBQ Tuyệt mật`}
            />
          </Col>
          <Col xs={24} lg={8} xl={7}>
            <BoxStatis
              title="Tổng số Tài liệu"
              total={confideltialStatistic.DocumentTotal}
              backgroundColor="#FFE0B2"
              color="#FF6F00"
              paper={`${confideltialStatistic.DocumentTotal_ConfidentialLevel1} : Tài liệu mật`}
              look={`${confideltialStatistic.DocumentTotal_ConfidentialLevel2} : Tài liệu Tối mật`}
              sound={`${confideltialStatistic.DocumentTotal_ConfidentialLevel3} : Tài liệu Tuyệt mật`}
            />
          </Col>
          <Col xs={24} lg={8} xl={7}>
            <BoxStatis
              title="Tổng số tờ tài liệu"
              total={confideltialStatistic.PageAmountTotal}
              backgroundColor="#FFCDD2"
              color="#CE3135"
              paper={`${confideltialStatistic.PageAmountTotal_ConfidentialLevel1} : Tờ tài liệu mật`}
              look={`${confideltialStatistic.PageAmountTotal_ConfidentialLevel2} : Tờ tài liệu Tối mật`}
              sound={`${confideltialStatistic.PageAmountTotal_ConfidentialLevel3} : Tờ tài liệu Tuyệt mật`}
            />
          </Col>
        </Row>
      </Spin>
    </StatisBlockWrapper>
  )
}

DocumentSecret.propTypes = {}

BoxStatis.propTypes = {
  title: PropTypes.string,
  total: PropTypes.string,
  color: PropTypes.string,
  backgroundColor: PropTypes.string,
  paper: PropTypes.string,
  look: PropTypes.string,
  sound: PropTypes.string
}

export default DocumentSecret
