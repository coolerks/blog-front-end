import { PageContainer } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { Outlet } from '../../.umi/exports';

function Index(props) {
  const [ok, setOk] = useState(0);
  const [fail, setFail] = useState(0);
  useEffect(() => {
    // const req = async () => {
    //   try {
    //     const res = await axios.post("http://10.54.12.96:8888/api/private/v1/users", {
    //       "username": Math.random().toString(),
    //       "password": Math.random().toString()
    //     }, {
    //       headers: {
    //         Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjUwMCwicmlkIjowLCJpYXQiOjE2ODE3MzU1NzEsImV4cCI6MTY4MTgyMTk3MX0.v3I18LmJN5huOtBCWSczvgz9Trk7ex07LPZp8s6gK1A'
    //       }
    //     });
    //     const {data} = res;
    //     setOk((o) => o + 1);
    //   } catch (e) {
    //     setFail((f) => f + 1);
    //   }
    // }
    // req();
  }, []);
  return (
    <PageContainer header={{ title: false }} ghost>
      设置面板
      <p>成功：{ok}</p>
      <p>失败：{fail}</p>
      <Outlet />
    </PageContainer>
  );
}

export default Index;
