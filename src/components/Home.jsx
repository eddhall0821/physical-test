import { Button, Card, Col, Layout, Row, Skeleton, Space } from "antd";
import Meta from "antd/es/card/Meta";
import { Link } from "react-router-dom";
import {
  EditOutlined,
  PlayCircleOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import PNC from "../images/pnc.png";

const Home = () => {
  return (
    <Layout>
      <Layout.Header />
      <Layout.Content style={{ padding: 50 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Link to="pnc">
              <Card
                hoverable
                // style={{ width: 240 }}
                actions={[<PlayCircleOutlined />]}
                cover={<img alt="example" src={PNC} />}
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
                // style={{ width: 240 }}
                actions={[<PlayCircleOutlined />]}
                cover={<img alt="example" src={PNC} />}
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
