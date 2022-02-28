import React, { useState } from 'react'
import { Row, Col, Form, Input, Button, Checkbox } from 'antd'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useToast } from '@chakra-ui/react'
import ReCAPTCHA from 'react-google-recaptcha'

import loginBackGround from 'src/assets/images/login-background.svg'
import logoQuocHoi from 'src/assets/images/logo-quoc-hoi.png'

import { login } from 'src/store/authentication/actionCreator'
import UserService from 'src/api/UserService'
import { LoginWrapper, LoginBanner, FormLoginWrapper, LoginFormLayout } from './styled/LoginWrapper'

const Login = () => {
  const history = useHistory()
  const toast = useToast()
  const [form] = Form.useForm()

  const [isLoading, setIsLoading] = useState(false)
  const [isShowCapcha, setIsShowCapcha] = useState(false)
  const [capchaSiteKey, setCapchaSiteKey] = useState('')
  const [recaptchaResponse, setRecaptchaResponse] = useState('')
  const [isCaplock, setIsCaplock] = useState(false)
  const dispatch = useDispatch()

  const onFinish = values => {
    const { username, password, remember } = values
    setIsLoading(true)

    const body = {
      Username: username,
      Password: password,
      IsRememberPassword: remember,
      RecaptchaResponse: recaptchaResponse
    }
    UserService.login(body)
      .then(res => {
        if (res.isError) return
        if (res.Status === -2) {
          setIsShowCapcha(true)
          setCapchaSiteKey(res.Object.RecaptchaSitekey)
          return
        }
        if (!res.isError && res.Status === 0) {
          const data = {
            user: {
              ...res.Object.User
            },
            token: res.Object.UserToken.Token
          }
          dispatch(login(data))
          history.push('/search')
          toast({
            title: 'Chúc bạn có những trải nghiệm tuyệt vời!',
            status: 'success',
            position: 'bottom-right',
            duration: 2000
          })
        }
      })
      .finally(() => setIsLoading(false))
  }

  const onFinishFailed = () => {}

  const onChangeCapcha = e => {
    setRecaptchaResponse(e)
  }

  const handleKeyPress = (event, pathName) => {
    if (!form.getFieldValue(pathName)) return setIsCaplock(false)
    return setIsCaplock(event.getModifierState('CapsLock'))
  }

  return (
    <LoginWrapper>
      <Row className="w-100">
        <Col xs={{ span: 0 }} lg={{ span: 14 }}>
          <LoginBanner>
            <img src={logoQuocHoi} alt="logo-quoc-hoi" width="80px" />
            <div className="banner-name-app">Hệ thống lưu trữ </div>
            <img src={loginBackGround} alt="Login V2" className="img-fluid" />
          </LoginBanner>
        </Col>
        <Col xs={{ span: 24 }} lg={{ span: 10 }}>
          <LoginFormLayout>
            <FormLoginWrapper>
              <div className="form-heading">Đăng nhập</div>
              <div className="form-login">
                <Form
                  name="basic"
                  layout="vertical"
                  form={form}
                  initialValues={{ username: '', password: '', remember: false }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                >
                  <Form.Item
                    label="Tài khoản"
                    name="username"
                    required
                    rules={[
                      () => ({
                        validator(_, value) {
                          if (isCaplock && value) return Promise.reject(new Error('Bạn đang bật capslock'))
                          if (!value) return Promise.reject(new Error('Tên đăng nhập không được để trống'))
                          if (value && value.length > 30)
                            return Promise.reject(new Error('Tên đăng nhập không được dài quá 30 ký tự'))
                          return Promise.resolve()
                        }
                      })
                    ]}
                  >
                    <Input onKeyUp={e => handleKeyPress(e, 'username')} />
                  </Form.Item>
                  <Form.Item
                    label="Mật khẩu"
                    name="password"
                    required
                    rules={[
                      () => ({
                        validator(_, value) {
                          if (isCaplock && value) return Promise.reject(new Error('Bạn đang bật capslock'))
                          if (!value) return Promise.reject(new Error('Mật khẩu không được để trống'))
                          if (value && value.length > 30)
                            return Promise.reject(new Error('Mật khẩu không được dài quá 30 ký tự'))
                          return Promise.resolve()
                        }
                      })
                    ]}
                  >
                    <Input.Password onKeyDown={e => handleKeyPress(e, 'username')} />
                  </Form.Item>
                  <Form.Item name="remember" valuePropName="checked" className="mb-1">
                    <Checkbox>Duy trì đăng nhập</Checkbox>
                  </Form.Item>
                  {isShowCapcha && <ReCAPTCHA sitekey={capchaSiteKey} onChange={onChangeCapcha} />}
                  <Form.Item className="mt-3">
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      className="w-100 justify-content-center"
                      loading={isLoading}
                    >
                      Đăng nhập
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </FormLoginWrapper>
          </LoginFormLayout>
        </Col>
      </Row>
    </LoginWrapper>
  )
}

Login.propTypes = {}

export default Login
