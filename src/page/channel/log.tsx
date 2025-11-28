import { Modal, Button, Typography } from "antd";

const { Paragraph } = Typography;

interface PodLogsModalProps {
  visible: boolean;      // state from parent
  onClose: () => void;
  podName: string;
  logs: string;
}

export default function PodLogsModal({ visible, onClose, podName, logs }: PodLogsModalProps) {
  const handleDownload = () => {
    const blob = new Blob([logs], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${podName}-logs.txt`;
    link.click();
  };

  return (
    <Modal
      title={`Pod Logs: ${podName}`}
      open={visible}       // <- use open instead of visible
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
    >
      <div
        style={{
          maxHeight: 400,
          overflowY: "auto",
          backgroundColor: "#1e1e1e",
          padding: 10,
          borderRadius: 4,
        }}
      >
        <Paragraph style={{ whiteSpace: "pre-wrap", color: "#f5f5f5" }}>{logs}</Paragraph>
      </div>
    </Modal>
  );
}
