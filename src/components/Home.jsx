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
              STP
            </Button>
          </Link>
          <Link to="/reaction">
            <Button type="primary" block>
              reaction
            </Button>
          </Link>
          <Link to="/rhythm">
            <Button type="default" block>
              MTA
            </Button>
          </Link>
          <Link to="/MTP">
            <Button type="primary" block>
              MTP
            </Button>
          </Link>
        </Space>
      </Layout.Content>
    </Layout>
  );
};

export default Home;
