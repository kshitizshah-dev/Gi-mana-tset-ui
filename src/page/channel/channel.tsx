// ChannelListFull.tsx
/* eslint-disable */
import { useEffect, useMemo, useState } from "react";
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
  Select,
} from "antd";
import {
  LoadingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useLocation } from "react-router-dom";


const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

/**
 * Single-file, cleaned, working implementation of:
 * - ChannelList (table)
 * - ExpandedRowContent (RCA cards, troubleshooting, diagnosis)
 * - Troubleshooting modal & button
 * - Diagnosis button (simulated)
 * - Simple PodLogsModal and NotesModal (inline placeholder modals)
 *
 * Drop this file into a React+TypeScript project that uses Ant Design and react-router.
 * Adjust styles/imports/assets as needed.
 */

/* ---------------------- Types ---------------------- */
type RCAItem = {
  factor: string;
  status: "OK" | "Issue" | string;
  details: string;
};

type Channel = {
  key: string;
  name: string;
  status: "UP" | "DOWN" | "FALLBACK" | string;
  lastChecked: string;
  ssaiStatus: string;
  viewerCount: number;
  insertionRate?: string;
  fillRate?: string;
  impressionRate?: string;
  rca: RCAItem[];
  podName: string;
  logs: string;
  email?: string;
  owner: string;
};

type DiagnosisResult = {
  redis: "OK" | "Issue";
  cpu: "OK" | "Issue";
  memory: "OK" | "Issue";
  source: "OK" | "Issue";
  totalViewers: "OK" | "Issue";
};

/* ---------------------- Sample Data ---------------------- */
export const sampleChannelsData: Channel[] = [
  {
    key: "1",
    name: "Channel 1 (News)",
    status: "UP",
    owner: "Anish",
    lastChecked: "2025-12-01 12:03:32",
    ssaiStatus: "Healthy",
    email: "anish@gmail.com",
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
    podName: "cuemana-in-3e20fe68",
    logs: `Sample pod logs for Channel 1...`,
  },
  {
    key: "2",
    name: "Channel 2 (Sports)",
    status: "UP",
    lastChecked: "2025-12-01 12:03:32",
    ssaiStatus: "Healthy",
    viewerCount: 1500,
    owner: "Kshitiz",
    email:"kshitiz@gmail.com",
    insertionRate: "38.2k",
    fillRate: "93%",
    impressionRate: "35.5k",
    rca: [
      { factor: "Redis Status", status: "Issue", details: "Latency: 120ms" },
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
    lastChecked: "2025-12-01 12:03:32",
    ssaiStatus: "Healthy",
    viewerCount: 800,
    email: "anish@gmail.com",
    owner: "Anish",
    insertionRate: "28.0k",
    fillRate: "87%",
    impressionRate: "24.4k",
    rca: [
      { factor: "Redis Status", status: "Issue", details: "Latency: 150ms" },
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
    name: "Channel 2 (Sports)",
    status: "UP",
    lastChecked: "2025-12-01 12:03:32",
    ssaiStatus: "Healthy",
    viewerCount: 1500,
    owner: "Kshitiz",
        email:"kshitiz@gmail.com",
    insertionRate: "38.2k",
    fillRate: "93%",
    impressionRate: "35.5k",
    rca: [
      { factor: "Redis Status", status: "Issue", details: "Latency: 120ms" },
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
    key: "5",
    name: "Channel 2 (Sports)",
    status: "UP",
    lastChecked: "2025-12-01 12:03:32",
    ssaiStatus: "Healthy",
    viewerCount: 1500,
    owner: "Kshitiz",
        email:"kshitiz@gmail.com",
    insertionRate: "38.2k",
    fillRate: "93%",
    impressionRate: "35.5k",
    rca: [
      { factor: "Redis Status", status: "Issue", details: "Latency: 120ms" },
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
    key: "6",
    name: "Channel 2 (Sports)",
    status: "UP",
    lastChecked: "2025-12-01 12:03:32",
    ssaiStatus: "Healthy",
    viewerCount: 1500,
    owner: "Kshitiz",
    email:"kshitiz@gmail.com",
    insertionRate: "38.2k",
    fillRate: "93%",
    impressionRate: "35.5k",
    rca: [
      { factor: "Redis Status", status: "Issue", details: "Latency: 120ms" },
      { factor: "CPU Status", status: "OK", details: "Usage: 45%" },
      { factor: "Memory Status", status: "OK", details: "Usage: 60%" },
      { factor: "Node Status", status: "OK", details: "All nodes healthy" },
      { factor: "Source Status", status: "OK", details: "Source URL responding" },
      { factor: "Total Active Viewers", status: "OK", details: "1500 viewers" },
    ],
    podName: "cuemana-in-2",
    logs: `Sample pod logs for Channel 2...`,
  },
];

/* ---------------------- Helpers ---------------------- */
const statusColors: Record<string, string> = {
  UP: "green",
  FALLBACK: "orange",
  DOWN: "red",
};

const getTroubleshootingSteps = (factor: string): string[] => {
  if (factor === "Redis Status") {
    return ["Check Redis pod logs", "Restart Redis pod if necessary", "Verify latency <50ms"];
  } else if (factor === "Node Status") {
    return ["Check node health", "Restart unhealthy pods", "Verify cluster connectivity"];
  } else if (factor === "CPU Status") {
    return ["Check CPU usage", "Identify high CPU processes", "Optimize or restart workload"];
  }
  return ["No troubleshooting steps available."];
};

/* ---------------------- PodLogsModal (inline simple) ---------------------- */
function PodLogsModal({ visible, onClose, podName, logs }: { visible: boolean; onClose: () => void; podName: string; logs: string; }) {
  return (
    <Modal title={`Logs: ${podName}`} open={visible} onCancel={onClose} footer={null} width={800}>
      <pre style={{ maxHeight: 400, overflow: "auto", whiteSpace: "pre-wrap" }}>{logs}</pre>
    </Modal>
  );
}

/* ---------------------- NotesModal (inline simple) ---------------------- */
function NotesModal({ visible, onClose }: { visible: boolean; onClose: () => void; }) {
  return (
    <Modal title="Knowledge Sharing" open={visible} onCancel={onClose} footer={null}>
      <Paragraph>Share notes or knowledge here.</Paragraph>
    </Modal>
  );
}

/* ---------------------- Troubleshooting Modal & Button ---------------------- */
function TroubleshootingModal({ visible, onClose, items }: { visible: boolean; onClose: () => void; items: { factor: string; status: string; steps: string[] }[]; }) {
  return (
    <Modal title="Troubleshooting Guide" open={visible} onCancel={onClose} footer={null} width={700}>
      <Typography>
        {items.map((item, idx) => (
          <div key={idx} style={{ marginBottom: 20 }}>
            <Title level={5}>
              {item.factor}{" "}
              <Text type={item.status === "red" ? "danger" : "secondary"}>({item.status.toUpperCase()})</Text>
            </Title>
            <ol>
              {item.steps.map((step, sidx) => (
                <li key={sidx}>
                  <Paragraph style={{ margin: 0 }}>{step}</Paragraph>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </Typography>
    </Modal>
  );
}

function TroubleButton1({ factor, status, steps }: { factor: string; status: string; steps: string[] }) {
  const [visible, setVisible] = useState(false);
  // show only when status indicates issue (match caller: pass "red" for issue)
  if (status !== "red") return null;
  return (
    <>
      <Button type="default" icon={<EyeOutlined />} size="small" onClick={() => setVisible(true)} style={{ marginRight: 8 }}>
        Fix
      </Button>
      <TroubleshootingModal visible={visible} onClose={() => setVisible(false)} items={[{ factor, status, steps }]} />
    </>
  );
}

/* ---------------------- TroubleButton that runs step-by-step ---------------------- */
type TroubleStep = { step: string; status: "pending" | "checking" | "ok" | "issue" };

function TroubleRunner({
  factor,
  onStart,
  isRunning,
  status,
}: {
  factor: string;
  onStart: () => void;
  isRunning: boolean;
  status: string;
}) {
  // Only display when status indicates Issue (caller passes "red" for issue)
  if (status !== "red") return null;
  return (
    <Button size="small" style={{ marginTop: 5 }} onClick={onStart} loading={isRunning} disabled={isRunning}>
      {isRunning ? "Running..." : `Troubleshoot ${factor}`}
    </Button>
  );
}

/* ---------------------- DiagnosisButton (simulated) ---------------------- */
const DIAGNOSIS_CHECKS = ["Checking Redis status...", "Checking CPU status...", "Checking Memory status...", "Checking Source status...", "Checking Total Viewers..."];

function DiagnosisButton({ onFinish, onProgress }: { record: Channel; onFinish: (r: DiagnosisResult) => void; onProgress: (s: string) => void; }) {
  const [loading, setLoading] = useState(false);

  const handleDiagnosisClick = () => {
    if (loading) return;
    setLoading(true);
    onProgress("Starting diagnosis...");

    let idx = 0;
    const run = () => {
      if (idx < DIAGNOSIS_CHECKS.length) {
        onProgress(DIAGNOSIS_CHECKS[idx]);
        idx++;
        setTimeout(run, 500);
      } else {
        setTimeout(() => {
          const result: DiagnosisResult = {
            redis: Math.random() > 0.4 ? "OK" : "Issue",
            cpu: Math.random() > 0.4 ? "OK" : "Issue",
            memory: Math.random() > 0.4 ? "OK" : "Issue",
            source: Math.random() > 0.4 ? "OK" : "Issue",
            totalViewers: Math.random() > 0.4 ? "OK" : "Issue",
          };
          setLoading(false);
          onFinish(result);
          onProgress("");
        }, 600);
      }
    };

    run();
  };

  return (
    <Button type="default" onClick={handleDiagnosisClick} loading={loading} disabled={loading} style={{ marginLeft: 10 }}>
      {loading ? "Diagnosing..." : "Diagnosis"}
    </Button>
  );
}

/* ---------------------- ExpandedRowContent Component ---------------------- */
function ExpandedRowContent({
  record,
  setSelectedPod,
  setPodLogs,
  setModalVisible,
  setNotesVisible,
  troubleshootingGlobalLock,
}: {
  record: Channel;
  setSelectedPod: (p: string) => void;
  setPodLogs: (l: string) => void;
  setModalVisible: (v: boolean) => void;
  setNotesVisible: (v: boolean) => void;
  troubleshootingGlobalLock: boolean; // if true prevent starting multiple troubleshooters concurrently
}) {
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [runningDiagnosisStep, setRunningDiagnosisStep] = useState<string>("");
  const [troubleshootingFactor, setTroubleshootingFactor] = useState<string | null>(null);
  const [troubleSteps, setTroubleSteps] = useState<TroubleStep[]>([]);
  const [visible, setVisible] = useState(false);

  const isTroubleshootingRunning = troubleshootingFactor !== null;

  const startTroubleshooting = (factor: string) => {
    if (isTroubleshootingRunning || troubleshootingGlobalLock) return;
    setTroubleshootingFactor(factor);
    const steps = getTroubleshootingSteps(factor);
    const initial: TroubleStep[] = steps.map((s) => ({ step: s, status: "pending" }));
    setTroubleSteps(initial);

    let idx = 0;
    const run = () => {
      if (idx < steps.length) {
        // mark checking
        setTroubleSteps((prev) => prev.map((p, i) => (i === idx ? { ...p, status: "checking" } : p)));
        setTimeout(() => {
          const ok = Math.random() > 0.3; // random result
          setTroubleSteps((prev) => prev.map((p, i) => (i === idx ? { ...p, status: ok ? "ok" : "issue" } : p)));
          idx++;
          run();
        }, 800);
      } else {
        // finish
        setTimeout(() => {
          setTroubleshootingFactor(null);
        }, 400);
      }
    };
    run();
  };

  const renderStatusIcon = (s: TroubleStep["status"]) => {
    switch (s) {
      case "checking":
        return <LoadingOutlined spin style={{ color: "#1890ff" }} />;
      case "ok":
        return <CheckCircleOutlined style={{ color: "green" }} />;
      case "issue":
        return <CloseCircleOutlined style={{ color: "red" }} />;
      default:
        return <div style={{ width: 14 }} />;
    }
  };

  const renderTroubleshootingSection = (factor: string) => {
    if (troubleshootingFactor === factor) {
      return (
        <div style={{ marginTop: 10, padding: 8, background: "#fafafa", borderRadius: 6 }}>
          <Text strong style={{ display: "block", marginBottom: 8 }}>
            Troubleshooting {factor}:
          </Text>
          {troubleSteps.map((t, i) => (
            <Paragraph key={i} style={{ marginBottom: 6 }}>
              <Space>
                {renderStatusIcon(t.status)}
                <Text style={{ opacity: t.status === "ok" ? 0.8 : 1 }}>{t.step}</Text>
                {(t.status === "ok" || t.status === "issue") && (
                  <Tag color={t.status === "ok" ? "green" : "red"}>{t.status.toUpperCase()}</Tag>
                )}
              </Space>
            </Paragraph>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {/* RCA Cards */}
      <Row gutter={[16, 16]} style={{ marginTop: 10 }}>
        {record.rca.map((item, idx) => {
          const isTroubleshootable = ["Redis Status", "Node Status", "CPU Status"].includes(item.factor);
          return (
            <Col span={8} key={idx}>
              <Card size="small" bordered>
                <Text strong>{item.factor}</Text>
                <br />
                <Tag color={item.status === "OK" ? "green" : "red"} style={{ marginTop: 6 }}>
                  {item.status}
                </Tag>
                <Paragraph style={{ marginTop: 8 }}>{item.details}</Paragraph>

                {/* Inline small action buttons */}
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 6 }}>
                  {/* Troubleshooting modal button (shows a modal with steps) */}
                  <TroubleButton1
                    factor={item.factor}
                    status={item.status === "Issue" ? "red" : "green"}
                    steps={getTroubleshootingSteps(item.factor)}
                  />

                  {/* Troubleshooter runner (step-by-step) */}
                  {isTroubleshootable && (
                    <TroubleRunner
                      factor={item.factor}
                      onStart={() => startTroubleshooting(item.factor)}
                      isRunning={troubleshootingFactor === item.factor}
                      status={item.status === "Issue" ? "red" : "green"}
                    />
                  )}
                </div>

                {renderTroubleshootingSection(item.factor)}
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Images */}
      <Row style={{ marginTop: 20 }}>
        <Col span={24}>
          <div style={{ padding: 6, background: "#c6cfde", borderRadius: 6 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <img src="/image1.png" alt="Preview 1" style={{ width: "30%", display: "block" }} />
              <img src="/image2.png" alt="Preview 2" style={{ width: "30%", display: "block" }} />
              <img src="/image3.png" alt="Preview 3" style={{ width: "30%", display: "block" }} />
            </div>
          </div>
        </Col>
      </Row>

      {/* Action Buttons */}
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

<Button type="primary" onClick={() => setVisible(true)}>
        Compose Email
      </Button>

      <Modal
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        width={600}
        title={null}
        centered
        styles={{ body: { padding: 0 } }}
      >
        <div className="w-full bg-white rounded-md shadow-lg font-sans">

          {/* Gmail Compose Header */}
          <div className="flex justify-between items-center px-4 py-2 border-b bg-gray-100">
            <span className="font-medium text-gray-800">New Message</span>
            <button
              className="text-gray-500 hover:text-black"
              onClick={() => setVisible(false)}
            >
              ✕
            </button>
          </div>

          {/* Fields */}
          <div className="px-4 py-2 space-y-2">

            {/* To */}
            <div className="flex items-center border-b pb-1">
              <span className="w-16 text-gray-500">To</span>
              <input
                type="email"
                placeholder={record.email || 'Enter recipient email'}
                className="flex-1 outline-none"
                value={record.email || 'Enter recipient email'}
              />
            </div>

            {/* Subject */}
            <div className="flex items-center border-b pb-1">
              <span className="w-16 text-gray-500">Subject</span>
              <input
                type="text"
                placeholder="Enter subject"
                className="flex-1 outline-none"
              />
            </div>
          </div>

          {/* Editable Body */}
          <div className="px-4 py-3 min-h-[180px] max-h-[300px] overflow-y-auto border-b">
            <textarea
              placeholder="Write your message..."
              className="w-full h-[200px] outline-none resize-none"
            ></textarea>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-between px-4 py-3">
            <Button type="primary">Send</Button>

            <div className="flex gap-3 text-gray-600 text-lg">
              <button className="hover:text-black">📎</button>
              <button className="hover:text-black">🖼️</button>
              <button className="hover:text-black">😊</button>
              <button className="hover:text-black">⋯</button>
            </div>
          </div>
        </div>
      </Modal>

          

          <Popover
            content={
              <Space direction="horizontal">
                <Button size="small" onClick={() => alert(`Restarted Cuemana-in for ${record.name}`)}>
                  Cuemana-in
                </Button>
                <Button size="small" onClick={() => alert(`Restarted User Handler for ${record.name}`)}>
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
          <Button type="primary">Auto-Resolve Issues (Scan Infrastructure)</Button>
          <Button type="default">Redirect to Source (Bypass SSAI)</Button>

          <DiagnosisButton
            record={record}
            onFinish={(res) => {
              setDiagnosis(res);
            }}
            onProgress={(s) => setRunningDiagnosisStep(s)}
          />

          {/* Diagnosis Status Message */}
          {runningDiagnosisStep ? (
            <Text type="secondary" style={{ marginLeft: 15 }}>
              <Space>
                <LoadingOutlined spin style={{ color: "#1890ff" }} />
                {runningDiagnosisStep}
              </Space>
            </Text>
          ) : null}
        </Col>
      </Row>

      {/* Diagnosis Result */}
      {diagnosis && (
        <Row style={{ marginTop: 12 }}>
          <Col>
            <Text strong>Diagnosis Complete:</Text>
            <Space size="middle" style={{ marginLeft: 12 }}>
              {Object.entries(diagnosis).map(([k, v]) => (
                <Tag key={k} color={v === "OK" ? "green" : "red"}>
                  {k.charAt(0).toUpperCase() + k.slice(1)}: {v}
                </Tag>
              ))}
            </Space>
          </Col>
        </Row>
      )}
    </>
  );
}

/* ---------------------- ChannelList (Parent) ---------------------- */
export default function ChannelList({ channelsData = sampleChannelsData }: any ) {
  const location = useLocation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPod, setSelectedPod] = useState("");
  const [podLogs, setPodLogs] = useState("");
  const [notesVisible, setNotesVisible] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [ownerFilter, setOwnerFilter] = useState<string | null>(null);

  

  // troubleshooting global lock to avoid multiple simultaneous runs (optional)
  const [troubleshootingLock] = useState(false);

  useEffect(() => {
    const pathParts = location.pathname.split("/");
    const channelIdFromUrl = pathParts[2];
    if (channelIdFromUrl) {
      setExpandedKeys([channelIdFromUrl]);
    } else {
      setExpandedKeys([]);
    }
  }, [location.pathname]);

  const owners = useMemo(() => {
    const setOwners = new Set<string>();
    channelsData.forEach((c:any) => setOwners.add(c.owner));
    return Array.from(setOwners);
  }, [channelsData]);

  const filteredData = useMemo(() => {
    if (!ownerFilter) return channelsData;
    return channelsData.filter((c:any) => c.owner === ownerFilter);
  }, [channelsData, ownerFilter]);

  const columns = [
    { title: "Channel Name", dataIndex: "name", key: "name", render: (name: string) => <Text>{name}</Text> },
    {
      title: "Current Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => <Tag color={statusColors[status] || "default"}>{status}</Tag>,
    },
    { title: "Last Checked", dataIndex: "lastChecked", key: "lastChecked" },
    { title: "Channel Owner", dataIndex: "owner", key: "owner" },
    { title: "Current SSAI Status", dataIndex: "ssaiStatus", key: "ssaiStatus" },
    { title: "Viewer Count (Live)", dataIndex: "viewerCount", key: "viewerCount" },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Channel) => (
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

  // expandedRowRender should return a React element (component) not a function using hooks
  const expandedRowRender = (record: Channel) => (
    <ExpandedRowContent
      record={record}
      setSelectedPod={(p) => {
        setSelectedPod(p);
      }}
      setPodLogs={(l) => setPodLogs(l)}
      setModalVisible={(v) => setModalVisible(v)}
      setNotesVisible={(v) => setNotesVisible(v)}
      troubleshootingGlobalLock={troubleshootingLock}
    />
  );

  return (
    <div style={{ padding: 20 }}>
      <Title level={3}>📺 GMANA Channels Overview</Title>

      <Card style={{ marginBottom: 12 }}>
        <Space>
          <Text strong>Filter by Owner:</Text>
          <Select
            placeholder="Select owner"
            value={ownerFilter || undefined}
            style={{ width: 200 }}
            allowClear
            onChange={(val) => setOwnerFilter(val || null)}
          >
            {owners.map((o) => (
              <Option value={o} key={o}>
                {o}
              </Option>
            ))}
          </Select>
        </Space>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={false}
          expandable={{
            expandedRowRender,
            rowExpandable: (r) => r.rca && r.rca.length > 0,
            expandedRowKeys: expandedKeys,
            onExpand: (expanded, record) => {
              if (expanded) setExpandedKeys([record.key]);
              else setExpandedKeys([]);
            },
          }}
          rowClassName={(record: any) => (expandedKeys.includes(record.key) ? "expanded-row" : "")}
        />
      </Card>

      <PodLogsModal visible={modalVisible} onClose={() => setModalVisible(false)} podName={selectedPod} logs={podLogs} />
      <NotesModal visible={notesVisible} onClose={() => setNotesVisible(false)} />
    </div>
  );
}
