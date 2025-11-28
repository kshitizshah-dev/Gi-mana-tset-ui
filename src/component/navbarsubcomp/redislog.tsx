import { Modal, Button, Typography } from "antd";

const { Paragraph } = Typography;

interface RedisLogsModalProps {
  visible: boolean; // accepted for your usage, mapped to "open"
  onClose: () => void;
  redisName: string;
  logs: string;
}

export default function RedisLogsModal({
  visible,
  onClose,
  redisName,
  logs,
}: RedisLogsModalProps) {
  const handleDownload = () => {
    try {
      const blob = new Blob([logs], { type: "text/plain;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${redisName}-logs.txt`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (e) {
      console.error("Download failed:", e);
    }
  };

  return (
    <Modal
      title={`Redis Logs: ${redisName}`}
      open={visible}           // ✔ AntD v5 uses "open"
      onCancel={onClose}
      footer={[
        <Button key="download" type="primary" onClick={handleDownload}>
          Download
        </Button>,
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
      ]}
      width={800}
      destroyOnClose
    >
      <div
        style={{
          maxHeight: "400px",
          overflowY: "auto",
          backgroundColor: "#1e1e1e",
          padding: 10,
          borderRadius: 4,
        }}
      >
        <Paragraph style={{ whiteSpace: "pre-wrap", color: "#f5f5f5" }}>
          {logs}
        </Paragraph>
      </div>
    </Modal>
  );
}
