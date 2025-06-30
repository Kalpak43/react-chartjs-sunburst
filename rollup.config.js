import typescript from "@rollup/plugin-typescript";

export default {
    input: "src/index.ts",
    output: [
        { file: "dist/index.js", format: "cjs" },
        { file: "dist/index.esm.js", format: "esm" }
    ],
    external: ["react", "chart.js", "chartjs-plugin-datalabels", "color"],
    plugins: [typescript({ tsconfig: "./tsconfig.json" })]
};