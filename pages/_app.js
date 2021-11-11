import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { wrapper } from "../src/Redux/configureStore";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import GlobalThemeProvider from "../styles/GlobalThemeProvider";

//api
import { Me } from "../src/Redux/Async/userAsync";

//components
import Header from "../src/Components/Layout/Header";
import FloatingButton from "../src/Components/Button/FloatingButton";

//전체 레이아웃을 담당하는 컴포넌트입니다.
function MyApp({ Component, pageProps }) {
  const dispatch = useDispatch();
  const router = useRouter();
  // next js 토큰 확인
  const [isToken, setIsToken] = useState(typeof window !== "undefined" ? localStorage.getItem("token") : null);
  const [locationX, setLocationX] = useState(null);
  const container = useRef(null);

  useEffect(() => {
    if (isToken) {
      dispatch(Me());
    }
  }, [isToken]);

  useEffect(() => {
    function isMobile() {
      const user = navigator.userAgent;
      let is_mobile = false;
      if (
        user.indexOf("iPhone") > -1 ||
        user.indexOf("Android") > -1 ||
        user.indexOf("iPad") > -1 ||
        user.indexOf("iPod") > -1
      ) {
        is_mobile = true;
      }
      return is_mobile;
    }

    if (!isMobile()) setLocationX(container.current.offsetParent.offsetWidth - container.current.offsetLeft);
    if (isMobile()) setLocationX(container.current.offsetWidth);

    window.addEventListener("resize", () => {
      setLocationX(container.current.offsetParent.offsetWidth - container.current.offsetLeft);
    });
    return window.removeEventListener("resize", () => {});
  }, []);

  const floatButton = () => {
    if (router.pathname === "/event") return router.push("/event/write");
    if (router.pathname === "/combination") return router.push("/combination/write");
  };

  return (
    <GlobalThemeProvider>
      <Wrapper ref={container}>
        <Header />
        <Component {...pageProps} />
        {router.pathname === "/event" || router.pathname === "/combination" ? (
          <FloatingButton onClick={floatButton} locationX={locationX} />
        ) : null}
      </Wrapper>
    </GlobalThemeProvider>
  );
}

const Wrapper = styled.div`
  max-width: 500px;
  width: 100vw;
  padding: 5px 5px 100px 5px;
  box-sizing: border-box;
`;

// withRedux 함수로 컴포넌트를 감싸준다.
export default wrapper.withRedux(MyApp);
