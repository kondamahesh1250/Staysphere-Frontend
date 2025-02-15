// import './App.css';
import { Route, Routes } from "react-router-dom";
import Homescreen from "./Screens/Homescreen.jsx";
import Navbar from './Components/Navbar.jsx';
import Roomdetails from './Screens/Roomdetails.jsx';
import Bookingscreen from './Screens/Bookingscreen.jsx';
import Loginscreen from './Screens/Loginscreen.jsx';
import Registerscreen from './Screens/Registerscreen.jsx';
import Profilescreen from './Screens/Profilescreen.jsx';
import Adminscreen from './Screens/Adminscreen.jsx';
import Landingpage from './Components/Landingpage.jsx';
import 'antd/dist/reset.css'; // Use reset.css for Ant Design 5+


function App() {

  return (
    <>
      <div className="App">
        <>
          <Navbar />
          <Routes>
            <Route path={'/'} exact Component={Landingpage}></Route>
            <Route path={"/homescreen"} exact Component={Homescreen}></Route>
            <Route path={'/viewroom/:id'} exact Component={Roomdetails}></Route>
            <Route path={'/book/:id/:fromDate/:toDate'} exact Component={Bookingscreen}></Route>
            <Route path={'/register'} exact Component={Registerscreen}></Route>
            <Route path={'/login'} exact Component={Loginscreen}></Route>
            <Route path={'/profile'} exact Component={Profilescreen}></Route>
            <Route path={'/admin'} exact Component={Adminscreen}></Route>
          </Routes>
        </>
      </div>
    </>
  );
}

export default App;
