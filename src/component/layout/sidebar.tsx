import { Layout, Menu } from "antd";
import { DashboardOutlined, AppstoreOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

const { Sider } = Layout;

// Auto-detect selected menu item from URL
function getSelectedKey(path: string) {
  if (path === "/") return "dashboard";

  // Handles: /channels, /channels/12, /channels/live/3, etc.
  if (path.startsWith("/channels")) return "channels";

  // Handles: /channel/1, /channel/99
  if (path.startsWith("/channel")) return "channels";

  return "";
}

export default function Sidebar() {
  const location = useLocation();

  return (
    <Sider
      width={230}
      theme="light"
      style={{
        background: "#ffffff",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        overflowY: "auto",
        borderRight: "1px solid #e4e4e4",
      }}
    >
      {/* Logo */}
      <div
        className="sidebar-logo"
        style={{
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          fontWeight: "bold",
          color: "#000",
          borderBottom: "1px solid #e4e4e4",
        }}
      >
        GMANA
      </div>

      {/* Menu */}
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[getSelectedKey(location.pathname)]}
        style={{ background: "#ffffff", marginTop: 10 }}
      >
        <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
          <Link to="/">Dashboard</Link>
        </Menu.Item>

        <Menu.Item key="channels" icon={<AppstoreOutlined />}>
          <Link to="/channels">Channels</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
}
