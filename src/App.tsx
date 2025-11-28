  import "./index.css"; 
  import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
  import AppLayout from "./component/layout/layout";
  import DashboardOverview from "./page/dashboard";
  import ChannelList, { sampleChannelsData } from "./page/channel/channel";

  function App() {
    return (
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
             <Route path="/channels" element={<ChannelList channelsData={sampleChannelsData} />} />
               <Route path="/channel/:id" element={<ChannelList channelsData={sampleChannelsData} />} />
          </Routes>
        </AppLayout>
      </Router>
    );
  }

  export default App;
