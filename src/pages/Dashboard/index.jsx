import { DashboardOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Outlet } from '../../.umi/exports';
import CoverPicture from '../../components/CoverPicture';

function Index(props) {
  return (
    <PageContainer header={{ title: false }} ghost>
      <CoverPicture />
      <br />
      <DashboardOutlined />
      <Outlet />
    </PageContainer>
  );
}

export default Index;
