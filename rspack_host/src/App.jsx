import React from "react";
import RemoteComponent from "./component/RemoteComponent";

const App = () => {
  return (
    <div>
      <div>This is Host</div>
      <RemoteComponent />
    </div>
  );
};

export default App;
