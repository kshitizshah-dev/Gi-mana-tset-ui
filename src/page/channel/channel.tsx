/* eslint-disable */

import { useState, useEffect } from "react";
import {
  Card,
  Table,
  Tag,
  Button,
  Typography,
  Row,
  Col,
  Modal,
  Popover,
  Space,
} from "antd";
import PodLogsModal from "./log";
import NotesModal from "./noteKnowledge";
import { EyeOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom"; // <-- import this

const { Title, Text, Paragraph } = Typography;

// --- Troubleshooting Modal & Button ---
interface TroubleshootingItem {
  factor: string;
  status: string;
  steps: string[];
}

interface TroubleshootingModalProps {
  visible: boolean;
  onClose: () => void;
  items: TroubleshootingItem[];
}

function TroubleshootingModal({
  visible,
  onClose,
  items,
}: TroubleshootingModalProps) {
  return (
    <Modal
      title="Troubleshooting Guide"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Typography>
        {items.map((item, idx) => (
          <div key={idx} style={{ marginBottom: 20 }}>
            <Title level={5}>
              {item.factor}{" "}
              <Text type={item.status === "red" ? "danger" : "secondary"}>
                ({item.status.toUpperCase()})
              </Text>
            </Title>
            <ol>
              {item.steps.map((step, sidx) => (
                <li key={sidx}>
                  <Paragraph>{step}</Paragraph>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </Typography>
    </Modal>
  );
}

function TroubleButton({
  factor,
  status,
  steps,
}: {
  factor: string;
  status: string;
  steps: string[];
}) {
  const [visible, setVisible] = useState(false);
  if (status !== "red") return null;
  return (
    <>
      <Button
        type="default"
        icon={<EyeOutlined />}
        size="small"
        onClick={() => setVisible(true)}
      />
      <TroubleshootingModal
        visible={visible}
        onClose={() => setVisible(false)}
        items={[{ factor, status, steps }]}
      />
    </>
  );
}

// --- ChannelList Component ---
interface RCAItem {
  factor: string;
  status: string;
  details: string;
}

interface Channel {
  key: string;
  name: string;
  status: string;
  lastChecked: string;
  ssaiStatus: string;
  viewerCount: number;
  insertionRate: string;
  fillRate: string;
  impressionRate: string;
  rca: RCAItem[];
  podName: string;
  logs: string;
}

interface ChannelListProps {
  channelsData: Channel[];
}

export default function ChannelList({ channelsData }: ChannelListProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPod, setSelectedPod] = useState("");
  const [podLogs, setPodLogs] = useState("");
  const [notesVisible, setNotesVisible] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  const location = useLocation(); // <-- useLocation hook

  // --- Auto-expand row based on URL ---
  useEffect(() => {
    const pathParts = location.pathname.split("/"); // e.g., "/channel/2"
    const channelIdFromUrl = pathParts[2];
    if (channelIdFromUrl) {
      setExpandedKeys([channelIdFromUrl]);
    } else {
      setExpandedKeys([]);
    }
  }, [location.pathname]); // <-- runs whenever URL changes

  const statusColors: Record<string, string> = {
    UP: "green",
    FALLBACK: "orange",
    DOWN: "red",
  };

  const columns = [
    { title: "Channel Name", dataIndex: "name", key: "name" },
    {
      title: "Current Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={statusColors[status]}>{status}</Tag>
      ),
    },
    { title: "Last Checked", dataIndex: "lastChecked", key: "lastChecked" },
    {
      title: "Current SSAI Status",
      dataIndex: "ssaiStatus",
      key: "ssaiStatus",
    },
    {
      title: "Viewer Count (Live)",
      dataIndex: "viewerCount",
      key: "viewerCount",
    },
    {
      title: "Insertion Rate",
      dataIndex: "insertionRate",
      key: "insertionRate",
    },
    { title: "Fill Rate", dataIndex: "fillRate", key: "fillRate" },
    {
      title: "Impression Rate",
      dataIndex: "impressionRate",
      key: "impressionRate",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Button
          size="small"
          onClick={() => {
            const newTab = window.open();
            if (newTab) {
              newTab.document.write(`
                <html>
                  <head><title>Preview - ${record.name}</title></head>
                  <body style="margin:0; display:flex; justify-content:center; align-items:center; height:100vh; background:#000;">
                    <img src="/previewimage.png" style="max-width:100%; max-height:100%;" />
                  </body>
                </html>
              `);
              newTab.document.close();
            }
          }}
        >
          Preview
        </Button>
      ),
    },
  ];

  const expandedRowRender = (record: Channel) => (
    <>
      <Row gutter={[16, 16]} style={{ marginTop: 10 }}>
        {record.rca.map((item, idx) => (
          <Col span={8} key={idx}>
            <Card size="small" bordered>
              <Text strong>{item.factor}</Text>
              <br />
              <Tag color={item.status === "OK" ? "green" : "red"}>
                {item.status}
              </Tag>
              <Paragraph style={{ marginTop: 5 }}>{item.details}</Paragraph>

              {/* Troubleshooting button */}
              {["Redis Status", "Node Status", "CPU Status"].includes(
                item.factor
              ) && (
                <TroubleButton
                  factor={item.factor}
                  status={item.status === "Issue" ? "red" : "green"}
                  steps={
                    item.factor === "Redis Status"
                      ? [
                          "Check Redis pod logs",
                          "Restart Redis pod if necessary",
                          "Verify latency <50ms",
                        ]
                      : item.factor === "Node Status"
                      ? [
                          "Check node health",
                          "Restart unhealthy pods",
                          "Verify cluster connectivity",
                        ]
                      : [
                          "Check CPU usage",
                          "Identify high CPU processes",
                          "Optimize or restart workload",
                        ]
                  }
                />
              )}
            </Card>
          </Col>
        ))}
      </Row>

      {/* Image Section */}
      <Row style={{ marginTop: 20, }}>
        <Col span={24}>
          <div  style={{ padding: 0,background:'#c6cfde' }}>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <img
                src="/image1.png"
                alt="Preview 1"
                style={{ width: "30%", display: "block" }}
              />
              <img
                src="/image2.png"
                alt="Preview 2"
                style={{ width: "30%", display: "block" }}
              />
              <img
                src="/image3.png"
                alt="Preview 3"
                style={{ width: "30%", display: "block" }}
              />
            </div>
          </div>
        </Col>
      </Row>

      <Row style={{ marginTop: 15 }}>
        <Col>
          <Button
            type="primary"
            style={{ marginRight: 10 }}
            onClick={() => {
              setSelectedPod(record.podName);
              setPodLogs(record.logs);
              setModalVisible(true);
            }}
          >
            Check Logs
          </Button>

          <Popover
            content={
              <Space direction="horizontal">
                <Button
                  size="small"
                  onClick={() => {
                    alert(`Restarted Cuemana-in for ${record.name}`);
                    const blob = new Blob(
                      [
                        `Logs for ${record.name} - Cuemana-in\nSample log content...`,
                      ],
                      { type: "text/plain" }
                    );
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${record.name}_cuemana_logs.txt`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  Cuemana-in
                </Button>

                <Button
                  size="small"
                  onClick={() => {
                    alert(`Restarted User Handler for ${record.name}`);
                    const blob = new Blob(
                      [
                        `Logs for ${record.name} - User Handler\nSample log content...`,
                      ],
                      { type: "text/plain" }
                    );
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${record.name}_userhandler_logs.txt`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  User Handler
                </Button>
              </Space>
            }
            title="Select Restart Target"
            trigger="click"
          >
            <Button style={{ marginRight: 10 }}>Restart</Button>
          </Popover>

          <Button style={{ marginRight: 10 }}>Notify Team</Button>
          <Button type="default" onClick={() => setNotesVisible(true)}>
            Knowledge Sharing
          </Button>
        </Col>
      </Row>
    </>
  );

  return (
    <div style={{ padding: 20 }}>
      <Title level={3}>📺 GMANA Channels Overview</Title>

      <Card>
        <Table
          columns={columns}
          dataSource={channelsData}
          pagination={false}
          expandable={{
            expandedRowRender,
            rowExpandable: (record) => record.rca && record.rca.length > 0,
            expandedRowKeys: expandedKeys,
            onExpand: (expanded, record) => {
              if (expanded) setExpandedKeys([record.key]);
              else setExpandedKeys([]);
            },
          }}
          rowClassName={(record) =>
            expandedKeys.includes(record.key) ? "expanded-row" : ""
          } // <-- here
        />
      </Card>

      <PodLogsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        podName={selectedPod}
        logs={podLogs}
      />
      <NotesModal
        visible={notesVisible}
        onClose={() => setNotesVisible(false)}
      />
    </div>
  );
}

// --- Sample channels data ---
export const sampleChannelsData: Channel[] = [
  {
    key: "1",
    name: "Channel 1 (News)",
    status: "UP",
    lastChecked: "12:03:32 PM",
    ssaiStatus: "Healthy",
    viewerCount: 1200,
    insertionRate: "41.5k",
    fillRate: "95%",
    impressionRate: "39.4k",
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
    key: "2",
    name: "Channel 2 (Sports)",
    status: "UP",
    lastChecked: "12:03:32 PM",
    ssaiStatus: "Healthy",
    viewerCount: 1500,
    insertionRate: "38.2k",
    fillRate: "93%",
    impressionRate: "35.5k",
    rca: [
      { factor: "Redis Status", status: "Issue", details: "Latency: 12ms" },
      { factor: "CPU Status", status: "OK", details: "Usage: 45%" },
      { factor: "Memory Status", status: "OK", details: "Usage: 60%" },
      { factor: "Node Status", status: "OK", details: "All nodes healthy" },
      { factor: "Source Status", status: "OK", details: "Source URL responding" },
      { factor: "Total Active Viewers", status: "OK", details: "1500 viewers" },
    ],
    podName: "cuemana-in-2",
    logs: `Sample pod logs for Channel 2...`,
  },
  {
    key: "3",
    name: "Channel 3 (Sports)",
    status: "DOWN",
    lastChecked: "12:03:32 PM",
    ssaiStatus: "Healthy",
    viewerCount: 800,
    insertionRate: "28.0k",
    fillRate: "87%",
    impressionRate: "24.4k",
    rca: [
      { factor: "Redis Status", status: "Issue", details: "Latency: 12ms" },
      { factor: "CPU Status", status: "OK", details: "Usage: 45%" },
      { factor: "Memory Status", status: "OK", details: "Usage: 60%" },
      { factor: "Node Status", status: "OK", details: "All nodes healthy" },
      { factor: "Source Status", status: "OK", details: "Source URL responding" },
      { factor: "Total Active Viewers", status: "OK", details: "800 viewers" },
    ],
    podName: "cuemana-in-3",
    logs: `Sample pod logs for Channel 3...`,
  },
  {
    key: "4",
    name: "Channel 4 (Sports)",
    status: "FALLBACK",
    lastChecked: "12:03:32 PM",
    ssaiStatus: "Healthy",
    viewerCount: 1100,
    insertionRate: "32.5k",
    fillRate: "89%",
    impressionRate: "28.9k",
    rca: [
      { factor: "Redis Status", status: "Issue", details: "Latency: 12ms" },
      { factor: "CPU Status", status: "OK", details: "Usage: 45%" },
      { factor: "Memory Status", status: "OK", details: "Usage: 60%" },
      { factor: "Node Status", status: "OK", details: "All nodes healthy" },
      { factor: "Source Status", status: "OK", details: "Source URL responding" },
      { factor: "Total Active Viewers", status: "OK", details: "1100 viewers" },
    ],
    podName: "cuemana-in-4",
    logs: `Sample pod logs for Channel 4...`,
  },
  {
    key: "5",
    name: "Channel 5 (Sports)",
    status: "UP",
    lastChecked: "12:03:32 PM",
    ssaiStatus: "Healthy",
    viewerCount: 1300,
    insertionRate: "36.7k",
    fillRate: "92%",
    impressionRate: "33.7k",
    rca: [
      { factor: "Redis Status", status: "Issue", details: "Latency: 12ms" },
      { factor: "CPU Status", status: "OK", details: "Usage: 45%" },
      { factor: "Memory Status", status: "OK", details: "Usage: 60%" },
      { factor: "Node Status", status: "OK", details: "All nodes healthy" },
      { factor: "Source Status", status: "OK", details: "Source URL responding" },
      { factor: "Total Active Viewers", status: "OK", details: "1300 viewers" },
    ],
    podName: "cuemana-in-5",
    logs: `Sample pod logs for Channel 5...`,
  },
];

