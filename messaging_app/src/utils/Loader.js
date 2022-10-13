import React from "react";
import CircleLoader from "react-spinners/CircleLoader";
const Loader = () => {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircleLoader color={"#00489e"} loading={true} size={120} />
    </div>
  );
};

export default Loader;
