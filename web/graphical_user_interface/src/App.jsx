import './App.css';
import HomePage from './Components/Home/HomePage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <HomePage />
      <ToastContainer />
    </>
  );
}

export default App;
