import { Button, Card, Col, Layout, Row, Skeleton, Space } from "antd";
import Meta from "antd/es/card/Meta";
import { Link, useLocation } from "react-router-dom";
import { PlayCircleOutlined } from "@ant-design/icons";
import PNC2 from "../images/pnc2.jpg";
import PNC3 from "../images/pnc3.jpg";
import { useEffect } from "react";
import QueryString from "qs";

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    const qs = QueryString.parse(location.search, { ignoreQueryPrefix: true });
    console.log(qs);
  }, [location]);

  return (
    <Layout>
      <Layout.Header />
      <Layout.Content style={{ padding: 50 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Link to="monitor">
              <Card
                hoverable
                actions={[<PlayCircleOutlined />]}
                cover={<img alt="example" src={PNC2} />}
              >
                <Meta
                  title="Point and Click"
                  description="simple point and click"
                />
              </Card>
            </Link>
          </Col>
          <Col span={6}>
            <Link to="replay">
              <Card
                hoverable
                actions={[<PlayCircleOutlined />]}
                cover={<img alt="example" src={PNC3} />}
              >
                <Meta
                  title="Replay Point and Click"
                  description="Upload the log file to replay p&c"
                />
              </Card>
            </Link>
          </Col>
        </Row>
      </Layout.Content>
    </Layout>
  );
};

export default Home;
