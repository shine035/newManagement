import styled from 'styled-components'

export const HeaderWrapper = styled.div`
  width: 100%;

  header {
    height: 70px;
    padding: 10px 30px;
    background: var(--color-primary);
    width: 100%;
    position: fixed;
    z-index: 8888;
    transition: all 400ms ${props => (props.isShowHeader ? 'ease-in' : 'ease-out')};

    .brand {
      font-size: 20px;
      color: #fff;
      font-weight: 600;
      text-transform: uppercase;
      width: max-content;
    }

    .sub-title {
      font-size: 16px;
      color: #fff;
      font-weight: 600;
      text-transform: uppercase;
      width: max-content;
    }

    .img-content {
      margin-bottom: 20px;
    }
  }

  header.home-nav {
    padding: 0;
    height: 150px;
    width: 100%;
    background-size: cover;
    transition: all 400ms ${props => (props.isShowHeader ? 'ease-in' : 'ease-out')};

    .content-background {
      padding: 20px 30px;
      height: 100%;
      /* background: linear-gradient(89.88deg, #0d9d57 0.1%, #0d9d57 62.47%, rgba(13, 157, 87, 0.03) 99.89%); */
    }
  }
`
