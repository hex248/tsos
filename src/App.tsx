import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "@/Index";
import Settings from "./Settings";
import Layout from "./Layout";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Layout>
                            <Index />
                        </Layout>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <Layout>
                            <Settings />
                        </Layout>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
