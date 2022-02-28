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

function StatisBlock() {
  const [isLoading, setisLoading] = useState(false)
  const [generalStatistic, setGeneralStatistic] = useState({
    FileTotal: 0,
    DocumentTotal: 0,
    PageAmountTotal: 0
  })

  useEffect(() => {
    getInitData()
  }, [])

  const getInitData = () => {
    setisLoading(true)
    GeneralStatisticService.getGeneralStatistic()
      .then(res => {
        if (res.isError) return
        setGeneralStatistic({ ...res.Object })
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
              total={generalStatistic.FileTotal}
              backgroundColor="#C0E5CE"
              color="#0D9D57"
              paper={`${generalStatistic.FileTotal_Paper} : ĐVBQ Giấy`}
              look={`${generalStatistic.FileTotal_Look} : ĐVBQ Nhìn`}
              sound={`${generalStatistic.FileTotal_Sound} : ĐVBQ Nghe nhìn`}
            />
          </Col>
          <Col xs={24} lg={8} xl={7}>
            <BoxStatis
              title="Tổng số Tài liệu"
              total={generalStatistic.DocumentTotal}
              backgroundColor="#FFE0B2"
              color="#FF6F00"
              paper={`${generalStatistic.DocumentTotal_Paper} : Tài liệu giấy`}
              look={`${generalStatistic.DocumentTotal_Look} : Tài liệu ảnh`}
              sound={`${generalStatistic.DocumentTotal_Sound} : Tài liệu phim, âm thanh`}
            />
          </Col>
          <Col xs={24} lg={8} xl={7}>
            <BoxStatis
              title="Tổng số tờ tài liệu"
              total={generalStatistic.PageAmountTotal}
              backgroundColor="#FFCDD2"
              color="#CE3135"
            />
          </Col>
        </Row>
      </Spin>
    </StatisBlockWrapper>
  )
}

StatisBlock.propTypes = {}

BoxStatis.propTypes = {
  title: PropTypes.string,
  total: PropTypes.string,
  color: PropTypes.string,
  backgroundColor: PropTypes.string,
  paper: PropTypes.string,
  look: PropTypes.string,
  sound: PropTypes.string
}

export default StatisBlock
