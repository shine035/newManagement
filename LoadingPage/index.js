import React from 'react'
import { Spin } from 'antd'

import styled from 'styled-components'

export const LoginWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`

export default function LoadingPage() {
  return (
    <LoginWrapper>
      <Spin />
    </LoginWrapper>
  )
}
