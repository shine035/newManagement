import styled from 'styled-components'

export const LoginWrapper = styled.div`
  width: 80%;
  max-width: 1000px;
  margin: auto;
  box-shadow: 0px 2px 20px rgba(13, 157, 87, 0.25);
  border-radius: var(--border-radius-primary);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .banner-name-app {
    color: var(--color-primary);
    font-size: 30px;
    line-height: 35px;
    font-weight: 600;
    margin: 20px 0;
    text-transform: uppercase;
  }
`

export const LoginBanner = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 0;
  flex-direction: column;

  @media (max-width: 768px) {
    display: none;
  }
`

export const LoginFormLayout = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    left: 0;
    height: 80%;
    width: 1px;
    background: var(--color-primary);
  }
`

export const FormLoginWrapper = styled.div`
  width: 80%;
  max-width: 450px;

  .form-heading {
    padding: 20px 16px;
    color: var(--color-primary);
    display: flex;
    align-items: center;
    font-size: 30px;
    justify-content: center;
    line-height: 35px;
    font-weight: 700;
    margin-bottom: 20px;
  }

  .ant-form-item-label label,
  label.ant-checkbox-wrapper span {
    font-weight: 600;
  }
`
