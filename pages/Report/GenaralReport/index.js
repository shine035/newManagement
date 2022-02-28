import React from 'react'

// import PropTypes from 'prop-types'
import { Breadcrumb } from 'antd'

import StatisBlock from '../components/StatisBlock'
import ExploitStatistic from '../components/ExploitStatistic'
import { GenaralReportWrapper, BreadcrumbWrapper, ProfileStatisticsWrapper } from '../styled'

function GenaralReport() {
  // State

  return (
    <GenaralReportWrapper>
      <BreadcrumbWrapper>
        <Breadcrumb.Item>Báo cáo thống kê</Breadcrumb.Item>
        <Breadcrumb.Item>Thống kê chung</Breadcrumb.Item>
      </BreadcrumbWrapper>
      <StatisBlock />
      <div className="pb-4" />
      <ExploitStatistic />
      <div className="pb-4" />
      <ProfileStatisticsWrapper />
    </GenaralReportWrapper>
  )
}

GenaralReport.propTypes = {}

export default GenaralReport
