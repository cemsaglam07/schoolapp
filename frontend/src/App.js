import './App.css';
import React, {Fragment} from "react";
import CreateCourse from './components/CreateCourse';

function App() {
  return (
    <Fragment>
      <div className="container">
        <CreateCourse />
      </div>
    </Fragment>
  );
}

export default App;
