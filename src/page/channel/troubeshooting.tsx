import  { useState } from "react";
import { Modal, Button, Typography,} from "antd";
import { EyeOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

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

export function TroubleshootingModal({
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
              {item.factor} <Text type={item.status === "red" ? "danger" : "secondary"}>({item.status.toUpperCase()})</Text>
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

// Eye Icon button component
interface TroubleButtonProps {
  factor: string;
  status: string;
  steps: string[];
}

export function TroubleButton1({ factor, status, steps }: TroubleButtonProps) {
  const [visible, setVisible] = useState(false);

  // Only show button if status is red
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
