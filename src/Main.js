import React, { Component } from 'react';
import $ from 'jquery';
import './Main.css';
// 注意：需要将音乐文件放到 src/audio/ 目录下
// import url from './audio/gbqq.mp3';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: {
        day: 0,
        hour: 0,
        minute: 0,
        second: 0
      },
      displayText: '',
      prevTime: {
        day: 0,
        hour: 0,
        minute: 0,
        second: 0
      }
    };
    // 完整的文本内容（HTML格式）
    this.fullText = '<h1 style="font-weight: 900;">Hi～亲爱的Zarina～</h1><p>真不敢相信，我们已经一起走过一年了在遇见你之前，我是一个对纪念日从来都不屑一顾的人。我那曾经的十几次生日也基本上没有什么值得我怀念的部分——除了和你一起度过的那一次。不过现在，我可以说我变得非常重视每一个有意义的日子了。可能是我最近文书写多了，总想要体现体现我和你在一起给我带来的成长哈哈。不过确实如此，你的出现让我的生活更美好了。</p><p>你在信里说感谢我的包容，我也十分感谢你对我的容忍。我总有着很多的坏毛病，有时候拖延、懒惰，有时候（比如复习csa）又会表现的没有耐心。可即便如此你依旧在我身边，这就是你对我最好的礼物。你的那封信或许我十年以后拿出来还可以品味，不过我这封就实效性强一点。</p><p>我曾经一直不明白，到底什么是爱。就像是那个终极的哲学问题，我是谁？如果按存在主义的说，我便就是过去一切行为的总和。那么或许爱，也就是一起经历过的总和吧。可这就有一个问题，人的出生是不带有目的性和意义性的，因此存在主义并不会关注我们出生的原因，而只关注我们活到足够岁数开始独立思考以后的解释部分。那么爱呢？我在一年前的这个晚上是如何向你鼓起勇气发起那一次表白的呢？真的就像是今天话剧里说的，那一次神经末梢的酥麻感吗？我想也不尽然。从第一次你和我坐在同一个懒人沙发上时，我或许就曾窥见那遥远的未来。爱总如同凭空诞生的一样，但又无法消失。暂且先不在因为原因而纠结，反正当下我可以认定——我爱你。我无法想象没有你的生活，就像那天晚上我抱着哭泣的你那时候说的，你已经是我生命中的一部分了。我们在最好的年纪遇到了最好的人，无论最后的结局我们都是彼此生命中最绚烂的那一抹色彩。我总能想起我摔到不能下床还发烧的那天，你忙里忙外帮我收拾起居；我总能想起一起出去旅行时你帮我收拾东西的样子；我总能想起你晚上躺在我怀中呼着暖暖的气息安然睡去的样子……这一切对我来说都是那么美好，我永远也不想失去。</p><p>这个世界那么大，我们能遇到彼此真是无比的幸运。我只能感叹命运的伟大，感谢上天。所以无论未来的路有多远，有多艰难我都不愿意放手，我想和你一起一直一直走下去。我们一起去非洲看犀牛吧！</p><p style="text-align: right; margin-top: 30px;"><strong>爱你的Jrd</strong><br/>2025.11.15</p>';
    this.printTimer = null;
  }

  componentDidMount() {
    // 延迟一下确保DOM已渲染
    setTimeout(() => {
      this.print();
    }, 300);
    
    // 立即计算一次时间
    this.time(2024, 11, 15);
    
    setInterval(() => {
      this.time(2024, 11, 15); // 修改为你们的纪念日（年, 月, 日）
    }, 1000);
    
    // 背景音乐延迟播放（单位：毫秒）
    // var audio = document.getElementById("audio");
    // setTimeout(() => audio.play(), 8500);
  }

  componentWillUnmount() {
    if (this.printTimer) {
      clearInterval(this.printTimer);
    }
  }

  time = (year, month, day) => {
    const now = new Date();
    const target = new Date(year, month - 1, day);
    const diff = now - target;
    
    const dayDiff = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hourDiff = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minuteDiff = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secondDiff = Math.floor((diff % (1000 * 60)) / 1000);
    
    const newTime = {
      day: dayDiff,
      hour: hourDiff,
      minute: minuteDiff,
      second: secondDiff
    };
    
    this.setState({
      prevTime: this.state.time,
      time: newTime
    });
  }

  print = () => {
    const autotypeElement = document.getElementById('autotype');
    if (autotypeElement) {
      autotypeElement.classList.add('typing');
    }
    
    // 使用正则表达式将HTML字符串分解为标签和文本
    const parts = [];
    let lastIndex = 0;
    const tagRegex = /<[^>]+>/g;
    let match;
    
    while ((match = tagRegex.exec(this.fullText)) !== null) {
      // 添加标签前的文本
      if (match.index > lastIndex) {
        const text = this.fullText.substring(lastIndex, match.index);
        for (let i = 0; i < text.length; i++) {
          parts.push({ type: 'text', content: text[i] });
        }
      }
      // 添加标签（完整添加）
      parts.push({ type: 'tag', content: match[0] });
      lastIndex = match.index + match[0].length;
    }
    
    // 添加剩余的文本
    if (lastIndex < this.fullText.length) {
      const text = this.fullText.substring(lastIndex);
      for (let i = 0; i < text.length; i++) {
        parts.push({ type: 'text', content: text[i] });
      }
    }
    
    let i = 0;
    let currentHTML = '';
    
    this.printTimer = setInterval(() => {
      if (i < parts.length) {
        const part = parts[i];
        currentHTML += part.content;
        
        // 在文字末尾添加光标
        const displayHTML = currentHTML + '<span class="cursor">|</span>';
        
        this.setState({
          displayText: displayHTML
        });
        i++;
      } else {
        clearInterval(this.printTimer);
        this.printTimer = null;
        if (autotypeElement) {
          autotypeElement.classList.remove('typing');
        }
        // 打字完成后移除光标
        this.setState({
          displayText: currentHTML
        });
      }
    }, 80); // 打字速度，可以调整
  }

  date = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}年${month}月${day}日`;
  }

  render() {
    const { time } = this.state;
    
    // 背景图片路径（使用 public 目录的绝对路径）
    const backgroundStyle = {
      backgroundImage: `url(${process.env.PUBLIC_URL || ''}/love/background.jpg)`
    };
    
    return (
      <div className="main-container" style={backgroundStyle}>
        {/* 跳转到 Love 项目的按钮 */}
        <a href="/love/index.html" className="love-link" target="_self" title="查看另一个版本">
          <span className="love-icon">💕</span>
        </a>

        {/* 背景遮罩层已在 CSS 中通过 ::before 实现 */}

        {/* 音频播放器（隐藏） */}
        {/* <audio id="audio" loop>
          <source src={url} type="audio/mpeg" />
        </audio> */}

        <div className="content">
          <div className="date">{this.date()}</div>
          
          <div id="autotype" dangerouslySetInnerHTML={{ __html: this.state.displayText }}>
          </div>

          <div className="time-container">
            <div className="time-item">
              <div className={`time-value ${time.day !== this.state.prevTime.day ? 'changing' : ''}`}>
                {time.day}
              </div>
              <div className="time-label">天</div>
            </div>
            <div className="time-item">
              <div className={`time-value ${time.hour !== this.state.prevTime.hour ? 'changing' : ''}`}>
                {time.hour}
              </div>
              <div className="time-label">时</div>
            </div>
            <div className="time-item">
              <div className={`time-value ${time.minute !== this.state.prevTime.minute ? 'changing' : ''}`}>
                {time.minute}
              </div>
              <div className="time-label">分</div>
            </div>
            <div className="time-item">
              <div className={`time-value ${time.second !== this.state.prevTime.second ? 'changing' : ''}`}>
                {time.second}
              </div>
              <div className="time-label">秒</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Main;

