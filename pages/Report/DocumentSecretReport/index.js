import React from 'react'

import { Breadcrumb } from 'antd'

import ExploitSecretStatistic from '../components/ExploitSecretStatistic'
import DocumentSecret from '../components/DocumentSecret'
import { GenaralReportWrapper, BreadcrumbWrapper, ProfileStatisticsWrapper } from '../styled'

function DocumentSecretReport() {
  // State

  return (
    <GenaralReportWrapper>
      <BreadcrumbWrapper>
        <Breadcrumb.Item>Báo cáo thống kê</Breadcrumb.Item>
        <Breadcrumb.Item>Thống kê tài liệu mật</Breadcrumb.Item>
      </BreadcrumbWrapper>
      <DocumentSecret />
      <div className="pb-4" />
      <ExploitSecretStatistic />
      <div className="pb-4" />
      <ProfileStatisticsWrapper />
    </GenaralReportWrapper>
  )
}

DocumentSecretReport.propTypes = {}

export default DocumentSecretReport
