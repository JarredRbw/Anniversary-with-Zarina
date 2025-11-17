import React, { Component } from 'react';
import './App.css';
import Main from './Main';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMain: false,
      isAnimating: false
    };
  }

  handleClick = () => {
    if (this.state.isAnimating) return;
    
    this.setState({ isAnimating: true });
    
    // 延迟切换，让信封动画完成
    setTimeout(() => {
      this.setState({ showMain: true });
    }, 800);
  }

  render() {
    if (this.state.showMain) {
      return <Main />;
    }

    return (
      <div className={`envelope-container ${this.state.isAnimating ? 'fade-out' : ''}`}>
        <div className="envelope" onClick={this.handleClick}>
          <div className="envelope-front">
            <div className="envelope-flap"></div>
            <div className="envelope-body"></div>
          </div>
          <div className="envelope-back"></div>
          <div className="letter">
            <div className="text">你收到一封信，点击查收！</div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

