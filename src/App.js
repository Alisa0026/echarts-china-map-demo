import "./styles.css";
import React, { useRef, useEffect } from "react";
import * as echarts from "echarts";
import { chinaMapConfig } from "./config";
import { geoJson } from "./geojson";
import { resData } from "./data";

export default function App() {
  const ref = useRef(null);
  let mapInstance = null;

  const renderMap = () => {
    const renderedMapInstance = echarts.getInstanceByDom(ref.current);
    if (renderedMapInstance) {
      mapInstance = renderedMapInstance;
    } else {
      mapInstance = echarts.init(ref.current);
    }
    mapInstance.setOption(
      chinaMapConfig({ data: resData.data, max: resData.max, min: 0 })
    );
  };

  useEffect(() => {
    echarts.registerMap("china", { geoJSON: geoJson });
    renderMap();
  }, []);

  useEffect(() => {
    window.onresize = function () {
      mapInstance.resize();
    };
    return () => {
      mapInstance && mapInstance.dispose();
    };
  }, []);

  return (
    <div>
      <div style={{ width: "100%", height: "99vh" }} ref={ref}></div>
    </div>
  );
}
