import React, {useEffect} from 'react';
import Cookies from 'js-cookie'

function Index(props) {
  useEffect(() => {
    Cookies.remove("token");
    window.location.hash = '/login'
  }, [])
  return (
    <></>
  );
}

export default Index;
