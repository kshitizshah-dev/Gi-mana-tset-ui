/* eslint-disable */
import{ useState } from "react";
import { Popover, Badge, Typography, Button, Card } from "antd";
import {
  DatabaseOutlined,
  CloudServerOutlined,
  ThunderboltOutlined,
  ApiOutlined,
  AlertOutlined,
  FireOutlined,
  PauseCircleOutlined,
} from "@ant-design/icons";
import RedisLogsModal from "../navbarsubcomp/redislog";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

export default function NavbarStatus() {
  const navigate = useNavigate();
  const [redisModalVisible, setRedisModalVisible] = useState(false);
  const [selectedRedis, setSelectedRedis] = useState("");
  const [redisLogs, setRedisLogs] = useState("");

  // Sample Data
  const clusters = [
    {
      name: "Cluster 1",
      redis: [
        { name: "redis-a1", cpu: "0.0", memory: "452.1MiB", replicas: 1, status: "Running", logs: "Logs A1..." },
        { name: "redis-a2", cpu: "0.1", memory: "430MiB", replicas: 1, status: "Running", logs: "Logs A2..." },
      ],
    },
    {
      name: "Cluster 2",
      redis: [
        { name: "redis-b1", cpu: "0.2", memory: "500MiB", replicas: 1, status: "Running", logs: "Logs B1..." },
        { name: "redis-b2", cpu: "0.3", memory: "480MiB", replicas: 1, status: "Issue", logs: "Logs B2..." },
      ],
    },
  ];

  // Sample data for other navbar items
  const cpuUsage = 66;
  const memoryUsage: any = 38;
  const nodeStatus: any = "UNHEALTHY";
  const channelsDown: any = 1;
  const viewersStatus: any = "SPIKE!";
  const breaksStatus: any = "CHECK!";

  const overallRedisStatus = clusters.some(c => c.redis.some(r => r.status !== "Running")) ? "error" : "success";

  // Redis Popover
  const redisPopoverContent = (
    <div className="popover-container">
      {clusters.map((cluster, idx) => {
        const clusterStatus = cluster.redis.some(r => r.status !== "Running") ? "error" : "success";
        return (
          <Card key={idx} size="small" style={{ marginBottom: 8 }} title={
            <div className="popover-cluster-header">
              <Text strong>{cluster.name}</Text>
              <Badge
                status={clusterStatus}
                text={`${cluster.redis.filter(r => r.status === "Running").length}/${cluster.redis.length}`}
              />
            </div>
          }>
            {cluster.redis.map((r, ridx) => (
              <Card key={ridx} size="small" type="inner" style={{ marginBottom: 4, padding: "6px 8px" }}>
                <div className="popover-redis-item">
                  <div>
                    <Text>{r.name}</Text>
                    <div className="redis-details">
                      CPU: {r.cpu} | Mem: {r.memory} | Replicas: {r.replicas}
                    </div>
                  </div>
                  <div className="redis-actions">
                    <Badge status={r.status === "Running" ? "success" : "error"} text={r.status} />
                    <Button
                      size="small"
                      onClick={() => {
                        setSelectedRedis(r.name);
                        setRedisLogs(r.logs);
                        setRedisModalVisible(true);
                      }}
                    >
                      Logs
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </Card>
        );
      })}
    </div>
  );

  // Navbar Item component
  const NavbarItem = ({ icon, label, badgeStatus, badgeText, popContent }: any) => (
    <Popover content={popContent} trigger="hover" placement="bottomLeft">
      <div className="navbar-item">
        {icon}
        <Text className="navbar-label">{label}</Text>
        <Badge status={badgeStatus} text={badgeText} />
      </div>
    </Popover>
  );

  // Clickable Channels Popovers
  const channelsDownContent = (
    <div style={{ maxHeight: 300, overflowY: "auto", width: 300 }}>
      <Text strong>Channels Down:</Text>
      {channelsDown > 0 ? (
        <ul style={{ marginLeft: 16 }}>
          <li>
            <span 
              style={{ cursor: "pointer", color: "#1890ff" }} 
              onClick={() => navigate("/channel/3")}
            >
              Channel 3 - Stream disconnected
            </span>
          </li>
        </ul>
      ) : (
        <Text>No channels currently down.</Text>
      )}
    </div>
  );

  const viewersContent = (
    <div style={{ maxHeight: 300, overflowY: "auto", width: 300 }}>
      <Text strong>Viewer Activity:</Text>
      <ul style={{ marginLeft: 16 }}>
        <li>
          <span style={{ cursor: "pointer", color: "#1890ff" }} onClick={() => navigate("/channel/1")}>
            Channel 1: 1200 viewers
          </span>
        </li>
        <li>
          <span style={{ cursor: "pointer", color: "#1890ff" }} onClick={() => navigate("/channel/2")}>
            Channel 2: 980 viewers
          </span>
        </li>
        <li>
          <span style={{ cursor: "pointer", color: "#1890ff" }} onClick={() => navigate("/channel/3")}>
            Channel 3: 500 viewers
          </span>
        </li>
      </ul>
      {viewersStatus === "SPIKE!" && <Text type="danger">Spike detected in Channel 1!</Text>}
    </div>
  );

  const breaksContent = (
    <div style={{ maxHeight: 300, overflowY: "auto", width: 300 }}>
      <Text strong>Ad Break Status:</Text>
      <ul style={{ marginLeft: 16 }}>
        <li>
          <span style={{ cursor: "pointer", color: "#1890ff" }} onClick={() => navigate("/channel/1")}>
            Channel 1: Running on schedule
          </span>
        </li>
        <li>
          <span style={{ cursor: "pointer", color: "#1890ff" }} onClick={() => navigate("/channel/2")}>
            Channel 2: Running on schedule
          </span>
        </li>
        <li>
          <span style={{ cursor: "pointer", color: "#1890ff" }} onClick={() => navigate("/channel/3")}>
            Channel 3: Missed break
          </span>
        </li>
      </ul>
      {breaksStatus === "CHECK!" && <Text type="warning">Check Channel 3 breaks!</Text>}
    </div>
  );

  return (
    <>
      <div className="navbar-container">
        {/* Redis */}
        <NavbarItem
          icon={<DatabaseOutlined />}
          label="Redis"
          badgeStatus={overallRedisStatus}
          badgeText={`${clusters.reduce((acc, c) => acc + c.redis.filter(r => r.status === "Running").length, 0)}/${clusters.reduce((acc, c) => acc + c.redis.length, 0)}`}
          popContent={redisPopoverContent}
        />

        {/* CPU */}
        <NavbarItem
          icon={<CloudServerOutlined />}
          label="CPU"
          badgeStatus={cpuUsage < 80 ? "success" : "error"}
          badgeText={`${cpuUsage}%`}
          popContent={
            <div style={{ maxHeight: 300, overflowY: "auto", width: 300 }}>
              <Text strong>CPU Usage per Node:</Text>
              <ul style={{ marginLeft: 16 }}>
                <li>Node A: 45%</li>
                <li>Node B: 66%</li>
                <li>Node C: 23%</li>
              </ul>
              <Text type="secondary">Overall Load: {cpuUsage}%</Text>
            </div>
          }
        />

        {/* Memory */}
        <NavbarItem
          icon={<ThunderboltOutlined />}
          label="Memory"
          badgeStatus={memoryUsage < 80 ? "success" : "error"}
          badgeText={`${memoryUsage}%`}
          popContent={
            <div style={{ maxHeight: 300, overflowY: "auto", width: 300 }}>
              <Text strong>Memory Usage per Service:</Text>
              <ul style={{ marginLeft: 16 }}>
                <li>Service A: 2.4 GB</li>
                <li>Service B: 1.9 GB</li>
                <li>Service C: 1.1 GB</li>
              </ul>
              <Text type="secondary">Overall Usage: {memoryUsage}%</Text>
            </div>
          }
        />

        {/* Node */}
        <NavbarItem
          icon={<ApiOutlined />}
          label="Node"
          badgeStatus={nodeStatus === "HEALTHY" ? "success" : "error"}
          badgeText={nodeStatus}
          popContent={
            <div style={{ maxHeight: 300, overflowY: "auto", width: 300 }}>
              <Text strong>Node Health:</Text>
              <ul style={{ marginLeft: 16 }}>
                <li>Node A: Healthy</li>
                <li>Node B: Unhealthy (high CPU)</li>
                <li>Node C: Healthy</li>
              </ul>
            </div>
          }
        />

        {/* Channels Down */}
        <NavbarItem
          icon={<AlertOutlined />}
          label="Down"
          badgeStatus={channelsDown === 0 ? "success" : "error"}
          badgeText={`${channelsDown}`}
          popContent={channelsDownContent}
        />

        {/* Viewers */}
        <NavbarItem
          icon={<FireOutlined />}
          label="Viewers"
          badgeStatus={viewersStatus === "SPIKE!" ? "error" : "success"}
          badgeText={viewersStatus}
          popContent={viewersContent}
        />

        {/* Breaks */}
        <NavbarItem
          icon={<PauseCircleOutlined />}
          label="Breaks"
          badgeStatus={breaksStatus === "CHECK!" ? "error" : "success"}
          badgeText={breaksStatus}
          popContent={breaksContent}
        />
      </div>

      <RedisLogsModal
        visible={redisModalVisible}
        onClose={() => setRedisModalVisible(false)}
        redisName={selectedRedis}
        logs={redisLogs}
      />
    </>
  );
}
