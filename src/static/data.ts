export const applianceData: Data = {
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
