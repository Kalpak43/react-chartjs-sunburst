interface Data {
  name: string;
  value?: number;
  children?: Data[];
}

interface DataNode {
  label: string;
  data?: number;
  parentIndex: number;
}
