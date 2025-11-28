
import { Button, Card, Typography, Row, Col } from "antd";
import ChannelList from "./channel/channel";

const { Title } = Typography;

// Sample data for channels
const channelsData = [
  {
    key: "3",
    name: "Channel 1 (News)",
    status: "FALLBACK",
    lastChecked: "12:03:32 PM",
    ssaiStatus: "FALLBACK",
    viewerCount: 1200,
     insertionRate: "28.0k",
    fillRate: "87%",
    impressionRate: "24.4k",
    rca: [
      { factor: "Redis Status", status: "OK", details: "Latency: 80ms" },
      { factor: "CPU Status", status: "Issue", details: "Usage: 95%" },
      { factor: "Memory Status", status: "OK", details: "Usage: 60%" },
      { factor: "Node Status", status: "Issue", details: "Pod ssai-node-1 is unhealthy" },
      { factor: "Source Status", status: "OK", details: "Source URL responding" },
      { factor: "Total Active Viewers", status: "OK", details: "1200 viewers" },
    ],
    podName: "cuemana-in-3e20fe68-fa8b-461c-adc1-a4c05f3be761-6587fbfd66r8x2v",
    logs: `Sample pod logs for Channel 1...`,
  },
  {
    key: "4",
    name: "Channel 2 (Sports)",
    status: "DOWN",
    lastChecked: "12:03:32 PM",
    ssaiStatus: "DOWN",
    viewerCount: 1200,
    insertionRate: "32.5k",
    fillRate: "89%",
    impressionRate: "28.9k",
    rca: [
      { factor: "Redis Status", status: "Issue", details: "Latency: 12ms" },
      { factor: "CPU Status", status: "OK", details: "Usage: 45%" },
      { factor: "Memory Status", status: "OK", details: "Usage: 60%" },
      { factor: "Node Status", status: "OK", details: "All nodes healthy" },
      { factor: "Source Status", status: "OK", details: "Source URL responding" },
      { factor: "Total Active Viewers", status: "OK", details: "1200 viewers" },
    ],
    podName: "cuemana-in-2",
    logs: `Sample pod logs for Channel 2...`,
  },
];

export default function Dashboard() {
  return (
    <div style={{ padding: 20 }}>

      <Card>
        <Title level={4}>Channel Status & Real-Time Monitor (Focus Channels)</Title>
        <ChannelList channelsData={channelsData} />
      </Card>

      {/* Support Actions */}
      <Card style={{ marginTop: 20 }}>
        <Title level={4}>Support Actions</Title>
        <Row gutter={[16, 16]}>
          <Col>
            <Button type="primary">Auto-Resolve Issues (Scan Infrastructure)</Button>
          </Col>
          <Col>
            <Button type="default">Redirect to Source (Bypass SSAI)</Button>
          </Col>
          <Col>
            <Button type="default">Notify Team</Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
