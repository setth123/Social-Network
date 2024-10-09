import { CssBaseline, ThemeProvider, createTheme } from "@mui/material"
import { themeSetting } from "./theme.js"
import { useMemo } from "react"
import { useSelector } from "react-redux";
import { BrowserRouter, Routes,Route, Navigate } from "react-router-dom";
import AuthPage from "./Pages/auth/index.jsx";
import HomePage from "./Pages/home/index.jsx";
import Profile from "./Pages/profile/index.jsx"
function App() {
  const mode=useSelector((state)=>state.mode);
  const theme=useMemo(()=>createTheme(themeSetting(mode)),[mode]);  
  const isAuth=Boolean(useSelector((state)=>state.token));
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline>
              <Routes>
                <Route path="/" element={isAuth?<HomePage/>:<AuthPage/>}/>
                <Route path="/home" element={isAuth?<HomePage/>:<Navigate to="/"/>}/>
                <Route path="/profile/:userId" element={isAuth?<Profile/>:<Navigate to="/"/>}/>
              </Routes>
          </CssBaseline>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
