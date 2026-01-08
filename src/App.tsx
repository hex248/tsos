import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "@/Index";
import Settings from "./Settings";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
