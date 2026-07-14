(()=>{
  const canvas=document.getElementById('energyAnimation');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width=0,height=0,dpr=1,frame=0;

  const electronOffsets=[0,.14,.28,.42,.56,.7,.84];
  const photonOffsets=[0,.27,.54,.81];
  const clamp01=value=>Math.max(0,Math.min(1,value));
  const cubic=(a,b,c,d,t)=>{
    const mt=1-t;
    return mt*mt*mt*a+3*mt*mt*t*b+3*mt*t*t*c+t*t*t*d;
  };

  function resize(){
    const rect=canvas.getBoundingClientRect();
    width=rect.width;height=rect.height;dpr=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }

  function glowDot(x,y,r,color,alpha){
    ctx.save();ctx.globalAlpha=alpha;ctx.shadowColor=color;ctx.shadowBlur=r*4;
    ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.restore();
  }

  function electronPoint(t){
    return {
      x:cubic(-.04*width,.18*width,.47*width,.655*width,t),
      y:cubic(.86*height,.83*height,.67*height,.58*height,t)
    };
  }

  function photonPoint(t){
    return {
      x:cubic(.655*width,.76*width,.91*width,1.05*width,t),
      y:cubic(.58*height,.56*height,.45*height,.38*height,t)
    };
  }

  function draw(time){
    ctx.clearRect(0,0,width,height);ctx.globalCompositeOperation='screen';
    const seconds=time/1000;

    electronOffsets.forEach((offset,index)=>{
      const t=(seconds/7.2+offset)%1;
      const point=electronPoint(t);
      const fade=Math.sin(Math.PI*clamp01(t));
      glowDot(point.x,point.y,2.5+(index%3),index%2?'#80ffe4':'#4de7cd',.3+.62*fade);
    });

    const core=electronPoint(1);
    const pulse=.5+.5*Math.sin(seconds*Math.PI*1.15);
    glowDot(core.x,core.y,7+4*pulse,'#fff0b3',.72+.2*pulse);
    ctx.save();ctx.strokeStyle=`rgba(196,255,236,${.42-.18*pulse})`;ctx.lineWidth=1.5;
    ctx.beginPath();ctx.arc(core.x,core.y,18+16*pulse,0,Math.PI*2);ctx.stroke();ctx.restore();

    [0,.5].forEach(offset=>{
      const t=(seconds/4.8+offset)%1;
      ctx.save();ctx.globalAlpha=(1-t)*.42;ctx.strokeStyle='#d6fff5';ctx.lineWidth=1.4;
      ctx.beginPath();ctx.ellipse(core.x,core.y,18+210*t,32+145*t,0,0,Math.PI*2);ctx.stroke();ctx.restore();
    });

    photonOffsets.forEach((offset,index)=>{
      const t=(seconds/4.2+offset)%1;
      const point=photonPoint(t);
      glowDot(point.x,point.y,2.7+(index%2)*1.6,'#ffe7a3',.32+.65*Math.sin(Math.PI*t));
    });

    if(!reduceMotion)frame=requestAnimationFrame(draw);
  }

  addEventListener('resize',resize,{passive:true});
  resize();
  draw(reduceMotion?1450:performance.now());
})();
