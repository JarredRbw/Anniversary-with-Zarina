import React, { Component } from 'react';
import './App.css';
import Main from './Main';
import Timeline from './Timeline';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMain: false,
      showTimeline: false,
      isAnimating: false
    };
  }

  handleClick = () => {
    if (this.state.isAnimating) return;
    
    this.setState({ isAnimating: true });
    
    // 延迟切换，让信封动画完成，先显示 timeline
    setTimeout(() => {
      this.setState({ showTimeline: true });
    }, 800);
  }

  handleShowTimeline = () => {
    this.setState({ showTimeline: true, showMain: false });
  }

  handleBackToMain = () => {
    this.setState({ showTimeline: false, showMain: true });
  }

  handleTimelineComplete = () => {
    // Timeline 完成后自动跳转到 Main
    setTimeout(() => {
      this.setState({ showTimeline: false, showMain: true });
    }, 2000);
  }

  render() {
    if (this.state.showTimeline) {
      return <Timeline onBack={this.handleBackToMain} onComplete={this.handleTimelineComplete} />;
    }

    if (this.state.showMain) {
      return <Main onShowTimeline={this.handleShowTimeline} />;
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

