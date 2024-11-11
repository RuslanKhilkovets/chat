import useTrackOnlineUsers from "../../hooks/useTrackOnlineUsers";

const OnlineTracker = () => {
  const { onlineUsers } = useTrackOnlineUsers();

  return (
    <div className="tab">
      <h2 style={{ fontSize: "32px", color: "#E1FF00" }}>
        Current online users
      </h2>
        <div style={logsContainerStyle}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Login</th>
                <th style={tableHeaderStyle}>ID</th>
              </tr>
            </thead>
            <tbody>
              {onlineUsers?.map((user) => (
                <tr key={user._id} style={{ borderBottom: "1px solid #ccc" }}>
                  <td style={tableCellStyle}>
                    {user.login}
                  </td>
                  <td
                    style={tableCellStyle}
                  >
                    {user._id}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  );
};

const logsContainerStyle = {
  maxHeight: "90vh",
  overflowY: "auto",
  position: "relative",
};

const tableHeaderStyle = {
  padding: "10px",
  backgroundColor: "#333",
  color: "#fff",
  textAlign: "left",
  position: "sticky",
  top: 0,
  zIndex: 1,
};

const tableCellStyle = {
  padding: "10px",
};

const getLogLevelColor = (level) => {
  switch (level) {
    case "info":
      return "#00bfff";
    case "warning":
      return "#ffcc00";
    case "error":
      return "#ff3333";
    default:
      return "#333";
  }
};

export default OnlineTracker;
