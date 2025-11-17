// 添加更丰富的交互效果

document.addEventListener('DOMContentLoaded', function() {
    // 创建飘落的心形装饰
    function createFallingHeart() {
        const heart = document.createElement('div');
        heart.innerHTML = '💕';
        heart.style.position = 'fixed';
        heart.style.fontSize = Math.random() * 20 + 15 + 'px';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.top = '-50px';
        heart.style.opacity = Math.random() * 0.5 + 0.3;
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '1000';
        heart.style.transition = 'all 8s linear';
        document.body.appendChild(heart);
        
        setTimeout(() => {
            heart.style.top = '100vh';
            heart.style.opacity = '0';
        }, 100);
        
        setTimeout(() => {
            heart.remove();
        }, 8000);
    }
    
    // 延迟后开始创建飘落的心形
    setTimeout(() => {
        setInterval(createFallingHeart, 3000);
    }, 9000);
    
    // 添加鼠标移动时的视差效果
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
        
        const letter = document.querySelector('.letter');
        if (letter) {
            letter.style.transform = `translate(${mouseX * 0.1}px, ${mouseY * 0.1}px)`;
        }
        
        const greeting = document.querySelector('.greeting');
        if (greeting) {
            greeting.style.transform = `translate(${-mouseX * 0.05}px, ${-mouseY * 0.05}px)`;
        }
    });
    
    // 添加点击时的爱心特效
    document.addEventListener('click', function(e) {
        const x = e.clientX;
        const y = e.clientY;
        
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.position = 'fixed';
        heart.style.left = x - 20 + 'px';
        heart.style.top = y - 20 + 'px';
        heart.style.fontSize = '40px';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '9999';
        heart.style.opacity = '1';
        heart.style.transition = 'all 0.8s ease-out';
        document.body.appendChild(heart);
        
        setTimeout(() => {
            heart.style.transform = 'translateY(-50px) scale(1.5)';
            heart.style.opacity = '0';
        }, 10);
        
        setTimeout(() => {
            heart.remove();
        }, 800);
    });
    
    // 添加滚动时的淡入效果增强
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
            }
        });
    }, observerOptions);
    
    // 观察所有段落
    document.querySelectorAll('.paragraph').forEach(p => {
        observer.observe(p);
    });
});

