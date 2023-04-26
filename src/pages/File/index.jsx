import { PageContainer } from '@ant-design/pro-components';
import { Outlet } from '../../.umi/exports';

function Index(props) {
  return (
    <>
      <PageContainer header={{ title: false, breadcrumb: {} }} ghost>
        <Outlet />
      </PageContainer>
    </>
  );
}

export default Index;
