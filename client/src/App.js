import { BrowserRouter as Router, Route } from "react-router-dom";
import Landing from './pages/landing'
import "./styles/output.css";

function App() {
  return (
    <>
      <Router>
        <Route path="/" render={(props) => <Landing {...props} />} />
      </Router>
    </>
  );
}

export default App;
