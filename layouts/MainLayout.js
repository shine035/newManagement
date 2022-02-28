import React, { useState } from "react";
import PropTypes from "prop-types";
import { Layout } from "antd";
import FadeIn from "react-fade-in";

// Components
// import Header from "../components/Header";

const { Content } = Layout;

MainLayout.propTypes = {
  children: PropTypes.node,
};

export default function MainLayout(props) {
  const { children } = props;
  const [isShowHeader, setIsShowHeader] = useState(true);

  window.onscroll = () => {
    if (window.pageYOffset > 130) {
      setIsShowHeader(false);
    }
    if (window.pageYOffset === 0) {
      setIsShowHeader(true);
    }
  };

  return (
    <Layout className="site-layout">
      {/* <Header
      //  isShowHeader={isShowHeader}
      /> */}
      <Content
        className="site-layout-background"
        style={{
          margin: isShowHeader ? "160px 20px 16px 20px" : "86px 20px 16px 20px",
          minHeight: 280,
        }}
      >
        <FadeIn>{children}</FadeIn>
      </Content>
      kkkkkkkkkk
      <p>qqqqqqqqqqqqqqqq</p>
    </Layout>
  );
}
