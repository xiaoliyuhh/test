import { useRoutes } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import router from './router';

function App() {
  const ourlet = useRoutes(router);

  return (
    <ConfigProvider locale={zhCN}>
      <div className="App" style={{ height: '100%' }}>
        {ourlet}
      </div>
    </ConfigProvider>
  );
}

export default App;
