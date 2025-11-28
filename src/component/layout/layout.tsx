import React from "react";
import { Layout } from "antd";
import Sidebar from "./sidebar";
import NavbarStatus from "./navbar";

const { Header, Content } = Layout;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <Sidebar />

      <Layout style={{ marginLeft: 230, background: "#fff" }}>
        <Header
          style={{
            height: "auto",
            padding: 0,
            background: "#ffffff",
            position: "sticky",
            top: 0,
            zIndex: 1000,
            borderBottom: "1px solid #e4e4e4",
          }}
        >
          <NavbarStatus />
        </Header>

        <Content
          style={{
            padding: 20,
            background: "#fafafa",
            minHeight: "calc(100vh - 60px)",
            color: "#000",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
