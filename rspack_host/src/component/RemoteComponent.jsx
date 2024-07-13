import React from "react";

import { loadRemoteModule } from "../utils/loadRemote";

const RemoteComponent = ({ fallback = null, ...props }) => {
  const Component = React.lazy(
    loadRemoteModule()
  );

  return (
    <React.Suspense fallback={fallback}>
      <Component {...props} />
    </React.Suspense>
  );
};

export default RemoteComponent;
