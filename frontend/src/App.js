import './App.css';
import React, {Fragment} from "react";
import CreateCourse from './components/CreateCourse';
import ListCourse from './components/ListCourse';

function App() {
  return (
    <Fragment>
      <div className="container">
        <CreateCourse />
        <ListCourse />
      </div>
    </Fragment>
  );
}

export default App;
