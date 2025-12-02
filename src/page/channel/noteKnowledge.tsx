import { Modal, Typography, Divider } from "antd";

const { Title, Paragraph, Text, Link } = Typography;

interface InfoModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function InfoModal({ visible, onClose }: InfoModalProps) {
  return (
    <Modal
      title="SSAI & System Metrics Documentation"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Typography>
        <Title level={4}>1. Redis</Title>
        <Paragraph>
          Redis is an in-memory data store used as a database, cache, and message broker. In SSAI systems, Redis is used to store session data, ad break schedules, and other fast-access data required for live streaming.
        </Paragraph>

        <Divider />

        <Title level={4}>2. CPU</Title>
        <Paragraph>
          CPU usage represents how much processing power is currently being used by your nodes. High CPU utilization may indicate performance bottlenecks or heavy workloads.
        </Paragraph>

        <Divider />

        <Title level={4}>3. Memory</Title>
        <Paragraph>
          Memory usage shows the amount of RAM being used. Nodes with insufficient memory may fail to process requests efficiently, leading to service degradation.
        </Paragraph>


        <Divider />

        <Title level={4}>4. Nodes</Title>
        <Paragraph>
          Nodes are individual servers or pods running your SSAI application. Node health indicates whether the server is operating normally. Unhealthy nodes can cause service interruptions.
        </Paragraph>

        <Divider />

        <Title level={4}>5. SSAI Metrics</Title>
        <Paragraph>
          <Text strong>Insertion Rate:</Text> The number of ads successfully inserted into the stream per unit time.<br />
          <Text strong>Fill Rate:</Text> The percentage of ad opportunities that were successfully filled with an ad.<br />
          <Text strong>Impression Rate:</Text> The number of ad impressions delivered to viewers in a given period.
        </Paragraph>

        <Divider />

        <Title level={4}>6. How to Read Statuses</Title>
        <Paragraph>
          <Text strong>Green / Success:</Text> Component is operating normally.<br />
          <Text strong>Orange / Warning:</Text> Component has minor issues, monitor closely.<br />
          <Text strong>Red / Error:</Text> Component has a critical issue that needs immediate attention.
        </Paragraph>

        <Divider />

        <Title level={4}>7. Useful Links</Title>
        <Paragraph>
          For more detailed documentation on SSAI and metrics, refer to:
          <ul>
            <li><Link href="https://redis.io/documentation" target="_blank">Redis Documentation</Link></li>
            <li><Link href="https://www.ansible.com/resources/get-started" target="_blank">Node & Server Management</Link></li>
            <li><Link href="https://developer.adobe.com/analytics" target="_blank">Ad Metrics & Analytics</Link></li>
          </ul>
        </Paragraph>
      </Typography>
    </Modal>
  );
}
