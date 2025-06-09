import { useState } from "react";
import "./App.css";
import CustomTooltip from "./components/custom-tooltip";
import { applianceData } from "./static/data";
import SunburstChart from "./components/sunburst-chart";
import cn from "./utils/cn.util";

function filterByName(data: Data, keyword: string): Data | null {
  // Check if current node matches the keyword
  if (data.name === keyword) {
    return data; // Return the matching node with all its children
  }

  // If current node has children, search recursively
  if (data.children) {
    for (const child of data.children) {
      const result = filterByName(child, keyword);
      if (result) {
        return result; // Return the first match found
      }
    }
  }

  // No match found in this branch
  return null;
}

function filterWithPath(data: Data, keyword: string): Data | null {
  // Helper function to check if a node or any of its descendants contain the keyword
  function hasMatchingDescendant(node: Data, keyword: string): boolean {
    if (node.name.toLowerCase().includes(keyword.toLowerCase())) {
      return true;
    }
    if (node.children) {
      return node.children.some((child) =>
        hasMatchingDescendant(child, keyword)
      );
    }
    return false;
  }

  // Helper function to filter and build the result tree
  function buildFilteredTree(node: Data, keyword: string): Data | null {
    const isMatch = node.name.toLowerCase().includes(keyword.toLowerCase());
    const hasMatchingChild =
      node.children?.some((child) => hasMatchingDescendant(child, keyword)) ||
      false;

    // If this node matches or has matching descendants, include it
    if (isMatch || hasMatchingChild) {
      const filteredNode: Data = {
        name: node.name,
        ...(node.value !== undefined && { value: node.value }),
      };

      // If this node matches the keyword, include ALL its children
      if (isMatch && node.children) {
        filteredNode.children = node.children;
      }
      // If this node doesn't match but has matching descendants, filter children
      else if (!isMatch && node.children) {
        const filteredChildren = node.children
          .map((child) => buildFilteredTree(child, keyword))
          .filter((child): child is Data => child !== null);

        if (filteredChildren.length > 0) {
          filteredNode.children = filteredChildren;
        }
      }

      return filteredNode;
    }

    return null;
  }

  return buildFilteredTree(data, keyword);
}

function App() {
  const [data, setData] = useState(applianceData);
  const [searchTimer, setSearchTimer] = useState<NodeJS.Timeout>();

  function handleArcClick(data: any) {
    const { label } = data;
    const filtered = filterByName(applianceData, label);
    if (filtered) {
      setData(filtered);
    }
  }

  function searchByKeyword(keyword: string) {
    // Clear previous timer if exists
    if (searchTimer) {
      clearTimeout(searchTimer);
    }

    // Create new timer
    const timer = setTimeout(() => {
      const filtered = filterWithPath(applianceData, keyword);
      if (filtered) {
        setData(filtered);
      } else {
        setData(applianceData); // Reset to original data if no matches
      }
    }, 500);

    // Store new timer
    setSearchTimer(timer);
  }

  const chartConfig: ChartConfig = {
    cutout: "10%",
    colors: [
      "rgb(255, 99, 132)", // red
      "rgb(54, 162, 235)", // blue
      "rgb(255, 206, 86)", // yellow
      "rgb(75, 192, 192)", // teal
      "rgb(153, 102, 255)", // purple
    ],
    title: {
      text: data.name,
      align: "start",
      fontSize: 20,
      color: "#ff0000",
    },
    labels: {
      enabled: true,
      showValues: true,
      // valuesOnly: true,
      fontSize: 8,
      color: "#fff",
    },
    tooltip: {
      enabled: true,
      custom: CustomTooltip,
      customOffsetX: -50,
      customOffsetY: -100,
    },
    onArcClick: handleArcClick,
  };

  return (
    <main className={cn("p-8")}>
      <SunburstChart data={data} config={chartConfig} />
      <br />
      <input type="text" onChange={(e) => searchByKeyword(e.target.value)} />
    </main>
  );
}

export default App;
