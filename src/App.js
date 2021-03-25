import React, { Component } from "react";
import ImageSlider from "./Components/ImageSlider"; 
import "./App.css";
import SliderImages from './Components/SliderImages';

class App extends Component {
  constructor(props) {
    super(props);
  }
  render () {
    return (
      <div className="App">
        <ImageSlider  
          slides={SliderImages}
          swiped={this.swiped}
          onSwiped={this.onSwiped}
        /> 
      </div>
    );
  }
}

export default App;