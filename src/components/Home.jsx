import { Button, Layout, Space } from "antd";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <Layout>
      <Layout.Header />
      <Layout.Content style={{ padding: 50 }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Link to="/pointing">
            <Button type="default" block>
              pointing
            </Button>
          </Link>
          <Link to="/reaction">
            <Button type="primary" block>
              reaction
            </Button>
          </Link>
          <Link to="/rhythm">
            <Button type="default" block>
              rhythm
            </Button>
          </Link>
          <Button type="primary" block>
            Primary
          </Button>
        </Space>
      </Layout.Content>
    </Layout>
  );
};

export default Home;
