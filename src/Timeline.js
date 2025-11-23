import React, { Component } from 'react';
import './Timeline.css';
import { timelineData } from './data/timelineData';

class Timeline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      birthdayCountdown: {
        day: 0,
        hour: 0,
        minute: 0,
        second: 0
      },
      lineHeight: 0,
      lineTop: 0
    };
    this.timelineRef = null;
    this.itemsContainerRef = null;
    this.timelineContainerRef = null;
    this.intersectionObserver = null;
  }

  setupIntersectionObserver = () => {
    // 创建 Intersection Observer
    // 支持双向滚动动画：元素进入视口时添加 in-view，离开时移除
    const options = {
      root: null,
      rootMargin: '-50px',
      threshold: 0.1
    };

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // 元素进入视口时添加 in-view class，触发进入动画
          entry.target.classList.add('in-view');
        } else {
          // 元素离开视口时移除 in-view class，允许再次进入时重新触发动画
          entry.target.classList.remove('in-view');
        }
      });
    }, options);

    // 观察所有需要动画的元素
    setTimeout(() => {
      const items = document.querySelectorAll('.timeline-item');
      const header = document.querySelector('.timeline-header');
      
      // 观察 header
      if (header) {
        this.intersectionObserver.observe(header);
      }
      
      // 观察所有 timeline items（content 的动画会随 item 一起触发）
      items.forEach(item => {
        this.intersectionObserver.observe(item);
      });
    }, 200);
  }

  componentDidMount() {
    // 计算19岁生日倒计时（2025年11月24日）
    this.calculateBirthdayCountdown();
    this.countdownInterval = setInterval(() => {
      this.calculateBirthdayCountdown();
    }, 1000);
    
    // 计算时间线位置 - 使用更可靠的方法确保DOM完全渲染
    this.initializeTimeline();
  }

  // 初始化时间线，确保DOM完全渲染后再计算
  initializeTimeline = () => {
    // 使用 requestAnimationFrame 等待浏览器完成布局
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // 双重 requestAnimationFrame 确保布局和绘制都完成
        // 延迟一点时间确保所有items都渲染完成
        setTimeout(() => {
          this.calculateTimelineLine();
          
          // 验证计算是否正确，如果元素位置为0或异常，延迟重试
          this.verifyAndRetryCalculation();
          
          // 使用防抖处理resize事件
          this.resizeTimer = null;
          window.addEventListener('resize', this.handleResize);
          
          // 设置Intersection Observer来触发出现动画
          this.setupIntersectionObserver();
          
          // 再次计算线条长度，确保覆盖所有内容（延迟一段时间让所有内容加载）
          setTimeout(() => {
            this.calculateTimelineLine();
          }, 500);
        }, 100);
      });
    });
  }

  // 验证计算是否正确，如果不正确则重试
  verifyAndRetryCalculation = (retryCount = 0) => {
    const maxRetries = 3;
    const retryDelay = 200; // 每次重试延迟200ms
    
    if (retryCount >= maxRetries) {
      return; // 超过最大重试次数，放弃
    }
    
    // 检查计算是否正确
    if (!this.timelineRef || !this.itemsContainerRef) {
      return;
    }
    
    const items = this.timelineRef.querySelectorAll('.timeline-item');
    if (items.length === 0) {
      // 如果没有items，延迟重试
      if (retryCount < maxRetries) {
        setTimeout(() => {
          this.verifyAndRetryCalculation(retryCount + 1);
        }, retryDelay);
      }
      return;
    }
    
    const firstItem = items[0];
    const lastItem = items[items.length - 1];
    const firstRect = firstItem.getBoundingClientRect();
    const lastRect = lastItem.getBoundingClientRect();
    
    // 检查元素是否有有效的位置（高度和位置都不为0）
    const hasValidPosition = 
      firstRect.height > 0 && 
      lastRect.height > 0 && 
      Math.abs(firstRect.top - lastRect.top) > 0;
    
    // 检查当前状态中的线条高度是否合理
    const currentLineHeight = this.state.lineHeight;
    const calculatedHeight = Math.abs(lastRect.bottom - firstRect.top) + 100;
    const heightDifference = Math.abs(currentLineHeight - calculatedHeight);
    
    // 如果位置无效或高度差异过大（超过100px），重试计算
    if (!hasValidPosition || (currentLineHeight > 0 && heightDifference > 100)) {
      if (retryCount < maxRetries) {
        setTimeout(() => {
          this.calculateTimelineLine();
          this.verifyAndRetryCalculation(retryCount + 1);
        }, retryDelay);
      }
    }
  }

  componentWillUnmount() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    window.removeEventListener('resize', this.handleResize);
  }

  scrollToBottom = () => {
    // 滚动容器是 .timeline-container，需要滚动这个元素
    const container = document.querySelector('.timeline-container');
    const footer = document.querySelector('.timeline-footer');
    
    if (container) {
      if (footer) {
        // 如果找到footer，滚动到footer
        footer.scrollIntoView({ behavior: 'smooth', block: 'end' });
      } else {
        // 否则滚动到容器底部
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        });
      }
    } else {
      // 如果找不到容器，回退到window滚动
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  }

  handleResize = () => {
    // 防抖处理，避免频繁计算
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }
    this.resizeTimer = setTimeout(() => {
      this.calculateTimelineLine();
    }, 200);
  }

  calculateBirthdayCountdown = () => {
    const now = new Date();
    const birthday = new Date(2025, 10, 24); // 2025年11月24日（月份从0开始）
    
    // 如果生日已过，计算下一年的生日
    if (now > birthday) {
      birthday.setFullYear(birthday.getFullYear() + 1);
    }
    
    const diff = birthday - now;
    
    // 确保不会出现负数
    if (diff <= 0) {
      this.setState({
        birthdayCountdown: { day: 0, hour: 0, minute: 0, second: 0 }
      });
      return;
    }
    
    const day = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hour = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minute = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const second = Math.floor((diff % (1000 * 60)) / 1000);
    
    this.setState({
      birthdayCountdown: { day, hour, minute, second }
    });
  }

  // 计算时间线位置和高度
  calculateTimelineLine = () => {
    if (!this.timelineRef || !this.itemsContainerRef) {
      return;
    }
    
    const items = this.timelineRef.querySelectorAll('.timeline-item');
    if (items.length === 0) {
      return;
    }
    
    const timelineRect = this.timelineRef.getBoundingClientRect();
    const firstItem = items[0];
    const lastItem = items[items.length - 1];
    
    if (!firstItem || !lastItem) {
      return;
    }
    
    const firstItemRect = firstItem.getBoundingClientRect();
    const lastItemRect = lastItem.getBoundingClientRect();
    
    // 计算相对于timeline容器的位置
    // 线条从第一个item的上方开始
    const lineTop = Math.max(0, firstItemRect.top - timelineRect.top - 100); // 上方延伸100px
    
    // 获取footer位置，确保线条不会和footer冲突
    const wrapper = this.timelineRef.closest('.timeline-wrapper');
    const footer = wrapper?.querySelector('.timeline-footer');
    
    // 计算最后一个item的底部位置
    // 线条需要完全覆盖最后一个事件（生日事件），确保足够长
    let finalBottom = lastItemRect.bottom - timelineRect.top + 300; // 下方延伸300px，确保完全覆盖最后一个事件
    
    // 获取items容器的底部
    const itemsContainerRect = this.itemsContainerRef.getBoundingClientRect();
    const itemsContainerBottom = itemsContainerRect.bottom - timelineRect.top;
    
    // 确保线条延伸到items容器底部，覆盖所有内容
    finalBottom = Math.max(finalBottom, itemsContainerBottom + 200);
    
    // 计算所有items的总高度（73个事件）
    const totalItemsHeight = lastItemRect.bottom - firstItemRect.top;
    
    // 确保线条至少覆盖所有items + 额外的空间
    // 对于73个事件，每个事件间距约150px，总高度至少需要：73 * 150 = 10950px
    const estimatedHeight = totalItemsHeight + 500; // 增加额外空间确保覆盖
    
    // 如果有footer，线条应该在footer上方结束，但要确保覆盖所有事件
    if (footer) {
      const footerRect = footer.getBoundingClientRect();
      const footerTop = footerRect.top - timelineRect.top;
      
      // 线条至少需要覆盖到最后一个item底部 + 300px
      const minLineEnd = lastItemRect.bottom - timelineRect.top + 300;
      
      // 线条应该在footer上方至少200px处结束，确保有足够间距，不会冲突
      // 如果footer位置允许，线条延伸到footer上方200px
      finalBottom = Math.max(minLineEnd, Math.min(finalBottom, footerTop - 200));
    } else {
      // 如果没有footer，确保线条延伸到容器底部
      finalBottom = Math.max(finalBottom, itemsContainerBottom + 300);
    }
    
    const lineHeight = finalBottom - lineTop;
    
    // 确保线条足够长，覆盖所有73个事件
    // 最小高度：总items高度 + 上下各300px
    const minHeight = Math.max(totalItemsHeight + 600, estimatedHeight); // 大幅增加最小高度保证
    
    this.setState({
      lineTop: lineTop,
      lineHeight: Math.max(lineHeight, minHeight) // 确保线条足够长，覆盖所有事件
    });
  }

  // 时间线数据 - 从独立配置文件导入
  // 修改数据请编辑 src/data/timelineData.js
  timelineEvents = timelineData;

  render() {
    const { birthdayCountdown, lineHeight, lineTop } = this.state;
    const backgroundStyle = {
      backgroundImage: `url(${process.env.PUBLIC_URL || ''}/love/background.jpg)`
    };

    return (
      <div className="timeline-container" style={backgroundStyle}>
        <div className="timeline-wrapper">
          {/* 返回按钮 */}
          <button className="back-button" onClick={this.props.onBack}>
            ← 返回
          </button>

          {/* 一键到底按钮 */}
          <button className="scroll-to-bottom-button" onClick={this.scrollToBottom} title="滚动到底部">
            ↓ 到底
          </button>

          {/* 生日倒计时 */}
          <div className="birthday-countdown">
            <h2 className="birthday-title">🎂 距离你的19岁生日还有</h2>
            <div className="countdown-container">
              <div className="countdown-item">
                <div className="countdown-value">{birthdayCountdown.day}</div>
                <div className="countdown-label">天</div>
              </div>
              <div className="countdown-separator">:</div>
              <div className="countdown-item">
                <div className="countdown-value">{birthdayCountdown.hour}</div>
                <div className="countdown-label">时</div>
              </div>
              <div className="countdown-separator">:</div>
              <div className="countdown-item">
                <div className="countdown-value">{birthdayCountdown.minute}</div>
                <div className="countdown-label">分</div>
              </div>
              <div className="countdown-separator">:</div>
              <div className="countdown-item">
                <div className="countdown-value">{birthdayCountdown.second}</div>
                <div className="countdown-label">秒</div>
              </div>
            </div>
          </div>

          {/* 时间线标题 */}
          <div className="timeline-header">
            <h1>我们的时光轴</h1>
            <p>记录我们一起经历的那些时刻</p>
          </div>

          {/* 时间线 */}
          <div className="timeline" ref={el => this.timelineRef = el}>
            {/* 简单的垂直直线 - 直接用div */}
            {lineHeight > 0 && (
              <div 
                className="timeline-line" 
                style={{ 
                  top: `${lineTop}px`,
                  height: `${lineHeight}px`
                }}
              />
            )}
            
            <div 
              className="timeline-items-container"
              ref={el => this.itemsContainerRef = el}
            >
              {this.timelineEvents.map((event, index) => (
                <div 
                  key={index} 
                  className={`timeline-item ${event.isSpecial ? 'special' : ''}`}
                  data-index={index}
                >
                  <div className="timeline-marker" style={{ backgroundColor: event.color }}>
                    <span className="timeline-icon">{event.icon}</span>
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-date">{event.date}</div>
                    <div className="timeline-title">{event.title}</div>
                    <div className="timeline-description">{event.description}</div>
                    {event.image && (
                      <div className="timeline-image-container">
                        <img 
                          src={event.image.startsWith('http') ? event.image : `${process.env.PUBLIC_URL || ''}${event.image}`} 
                          alt={event.title}
                          className="timeline-image"
                          loading="lazy"
                          onError={(e) => {
                            const imageSrc = event.image;
                            const isHeic = /\.(heic|heif)$/i.test(imageSrc);
                            
                            if (isHeic) {
                              console.warn(
                                `HEIC 格式图片无法在大多数浏览器中显示: ${imageSrc}\n` +
                                `请将图片转换为 JPG 或 PNG 格式。` +
                                `建议使用以下工具转换：\n` +
                                `- 在线转换：https://cloudconvert.com/heic-to-jpg\n` +
                                `- iOS 快捷指令：在 iPhone 上转换照片格式`
                              );
                            } else {
                              console.warn(`图片加载失败: ${imageSrc}`);
                            }
                            
                            // 显示错误提示（可选）
                            const container = e.target.closest('.timeline-image-container');
                            if (container && !container.querySelector('.image-error-message')) {
                              const errorMsg = document.createElement('div');
                              errorMsg.className = 'image-error-message';
                              errorMsg.textContent = isHeic 
                                ? '⚠️ HEIC 格式不支持，请转换为 JPG/PNG' 
                                : '图片加载失败';
                              container.appendChild(errorMsg);
                            }
                            
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 底部祝福 */}
          <div className="timeline-footer">
            <p>希望我们可以一直一直在一起，以上全部献给我最爱的杨怡萱 ❤️</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Timeline;
