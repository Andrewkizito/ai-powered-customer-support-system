import { Routes, Route } from "react-router-dom";
import "./index.css";

function Home() {
  return (
    <div className="container mx-auto p-8 text-center relative z-10">
      <h1 className="text-4xl font-bold">Welcome</h1>
    </div>
  );
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;
