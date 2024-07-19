import React, {Fragment} from "react";
import CreateCourse from '../components/CreateCourse';
import ListCourse from '../components/ListCourse';

const Home = () => {
    return (
        <Fragment>
          <div className="container">
            <CreateCourse />
            <ListCourse />
          </div>
        </Fragment>
    );
};
  
export default Home;