import "./App.css";
import SunburstChart from "./components/Chart";

const data: Data = {
  name: "Company Sales",
  children: [
    {
      name: "Electronics",
      children: [
        {
          name: "Computers",
          children: [
            { name: "Laptops", value: 120 },
            { name: "Desktops", value: 80 },
          ],
        },
        {
          name: "Mobile Devices",
          children: [
            { name: "Smartphones", value: 200 },
            { name: "Tablets", value: 50 },
          ],
        },
      ],
    },
    { name: "Furniture", value: 90 },
    {
      name: "Home Appliances",
      children: [
        { name: "Refrigerators", value: 60 },
        { name: "Washers", value: 40 },
      ],
    },
  ],
};

const colors = [
  "rgba(255, 99, 132", // red
  "rgba(54, 162, 235", // blue
  "rgba(255, 206, 86", // yellow
  "rgba(75, 192, 192", // teal
  "rgba(153, 102, 255", // purple
];

function App() {
  return (
    <main className="p-8">
      <SunburstChart data={data} colors={colors} />
    </main>
  );
}

export default App;
