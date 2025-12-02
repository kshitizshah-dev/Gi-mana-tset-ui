import { Modal } from "antd";

export function EmailPopup({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={400}   // small email-card size
    >
      <div style={{ textAlign: "center" }}>
        <img
          src="/email.png"   // replace with your image
          alt="Email Preview"
          style={{
            width: "100%",
            borderRadius: 10,
          }}
        />
      </div>
    </Modal>
  );
}
