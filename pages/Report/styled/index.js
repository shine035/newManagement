import styled from 'styled-components'
import { Breadcrumb } from 'antd'

export const GenaralReportWrapper = styled.div`
  width: 100%;
`

export const BreadcrumbWrapper = styled(Breadcrumb)`
  margin-bottom: 16px;
`

export const StatisBlockWrapper = styled(Breadcrumb)`
  background: var(--color-white);
  border-radius: var(--border-radius-primary);
  padding: 20px;
`

export const BoxStatisWrapper = styled(Breadcrumb)`
  background: ${props => props.backgroundColor};
  border-radius: var(--border-radius-primary);
  padding: 15px;
  text-align: center;
  height: 170px;

  .statis-box-title {
    font-weight: 700;
    font-size: 20px;
    line-height: 23px;
    text-transform: uppercase;
    color: var(--text-primary);
    margin-bottom: 12px;
  }

  .statis-box-total {
    font-weight: bold;
    font-size: 30px;
    line-height: 30px;
    color: ${props => props.color};
  }
  .statis-box-paper {
    margin-top: 5px;
    font-size: 15px;
    color: black;
  }
`

export const ExploitStatisticWrapper = styled(Breadcrumb)`
  background: var(--color-white);
  border-radius: var(--border-radius-primary);
  padding: 20px;
`

export const BoxExploitWrapper = styled(Breadcrumb)`
  border-radius: var(--border-radius-primary);
  border: 1px solid var(--color-border-2);
  padding: 20px;
`
export const NoteExploitWrapper = styled(Breadcrumb)`
  border-radius: var(--border-radius-primary);
  border: 1px solid var(--color-border-2);
  color: #000000;
  padding: 20px;

  .sytle-box-flex {
    display: flex;
    padding: 8px 0px;
    width: 250px;
  }

  .style-box-exploit {
    width: 35px;
    height: 20px;
    background: #0d9d57;
    margin-right: 15px;
  }

  .yellow {
    background: #ffa800;
  }

  .red {
    background: #ce3135;
  }
`
export const BackgroundExploitWrapper = styled(Breadcrumb)`
  border-radius: var(--border-radius-primary);
  border: 1px solid var(--color-border-2);
  color: #000000;
  padding: 20px;
  background: #f3f3f3;
  width: 235px;
`

export const ProfileStatisticsWrapper = styled.div`
  background: var(--color-white);
  border-radius: var(--border-radius-primary);
  padding: 0px 20px;

  .style-advances-search {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    margin-bottom: 8px;
    min-width: 250px;
    height: 50px;
  }

  .style-record {
    display: flex;
    align-items: center;
    min-width: 120px;
    margin-right: 15px;
    font-weight: bold;
    height: 50px;
  }
`

export const BoxExploitTitle = styled(Breadcrumb)`
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  text-transform: uppercase;
  color: #212529;
`

export const BoxNumberExploited = styled.div`
  border-radius: var(--border-radius-primary);
  border: 1px solid var(--color-primary);
  padding: 20px 10px;
  margin: 10px 0 10px;

  .count {
    font-weight: bold;
    font-size: 24px;
    line-height: 28px;
    color: var(--color-primary);
    text-align: center;
    margin-bottom: 10px;
  }

  .title {
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;
    text-transform: uppercase;
    text-align: center;
  }
`
