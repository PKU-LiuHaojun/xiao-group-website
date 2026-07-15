(()=>{
  const canvas=document.getElementById('energyAnimation');
  if(!canvas)return;

  const ctx=canvas.getContext('2d');
  const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TAU=Math.PI*2;
  let width=0,height=0,dpr=1,frame=0;
  const photonEpoch=performance.now();

  const palette={
    edge:'rgba(222,250,241,.72)',
    face1:'rgba(72,190,164,.62)',
    face2:'rgba(137,225,204,.46)',
    face3:'rgba(27,126,111,.7)',
    back:'rgba(41,138,119,.3)',
    a:'#f08b5d',
    x:'#d9f5ef'
  };

  const clamp=value=>Math.max(0,Math.min(1,value));
  const smooth=value=>{const t=clamp(value);return t*t*(3-2*t)};
  const mix=(a,b,t)=>a+(b-a)*t;

  function resize(){
    const rect=canvas.getBoundingClientRect();
    width=rect.width;
    height=rect.height;
    dpr=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.round(width*dpr);
    canvas.height=Math.round(height*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }

  function layout(){
    const compact=width<760;
    return{
      unit:Math.min(height/(compact?8.9:7.75),width/(compact?8.25:10.3)),
      origin:{x:width*(compact?.58:.72),y:height*(compact?.58:.54)},
      yaw:.48,
      pitch:-.28,
      roll:-.055,
      camera:18
    };
  }

  function rotateLocal(point,ry,rz){
    const cy=Math.cos(ry),sy=Math.sin(ry);
    const x1=point.x*cy+point.z*sy;
    const z1=-point.x*sy+point.z*cy;
    const cz=Math.cos(rz),sz=Math.sin(rz);
    return{x:x1*cz-point.y*sz,y:x1*sz+point.y*cz,z:z1};
  }

  function project(point,L){
    const cy=Math.cos(L.yaw),sy=Math.sin(L.yaw);
    const x1=point.x*cy+point.z*sy;
    const z1=-point.x*sy+point.z*cy;
    const cp=Math.cos(L.pitch),sp=Math.sin(L.pitch);
    const y2=point.y*cp-z1*sp;
    const z2=point.y*sp+z1*cp;
    const cr=Math.cos(L.roll),sr=Math.sin(L.roll);
    const x3=x1*cr-y2*sr;
    const y3=x1*sr+y2*cr;
    const perspective=L.camera/(L.camera+z2);
    return{x:L.origin.x+x3*L.unit*perspective,y:L.origin.y+y3*L.unit*perspective,depth:z2,perspective};
  }

  function cellWorld(col,row){
    return{x:(col-1.5)*2,y:(row-1.5)*2,z:0};
  }

  function buildCell(col,row,L,options={}){
    const base=cellWorld(col,row);
    const translation=options.translation||{x:0,y:0,z:0};
    const rotationY=options.rotationY||0;
    const rotationZ=options.rotationZ||0;
    const scale=options.scale||1;
    const alpha=options.alpha??1;
    const local=[
      {x:1,y:0,z:0},{x:-1,y:0,z:0},
      {x:0,y:1,z:0},{x:0,y:-1,z:0},
      {x:0,y:0,z:1},{x:0,y:0,z:-1}
    ];
    const world=local.map(point=>{
      const rotated=rotateLocal(point,rotationY,rotationZ);
      return{
        x:base.x+translation.x+rotated.x*scale,
        y:base.y+translation.y+rotated.y*scale,
        z:base.z+translation.z+rotated.z*scale
      };
    });
    const centerWorld={x:base.x+translation.x,y:base.y+translation.y,z:base.z+translation.z};
    const projected=world.map(point=>project(point,L));
    const center=project(centerWorld,L);
    const faces=[
      [0,2,4],[0,3,4],[1,2,4],[1,3,4],
      [0,2,5],[0,3,5],[1,2,5],[1,3,5]
    ];
    const commands=[];

    faces.forEach((indices,index)=>{
      const points=indices.map(i=>projected[i]);
      const depth=points.reduce((sum,p)=>sum+p.depth,0)/3;
      const front=indices.includes(5);
      const fill=front?[palette.face2,palette.face1,palette.face3,palette.face1][index%4]:palette.back;
      commands.push({type:'face',points,depth,fill,edge:palette.edge,alpha:alpha*(front?.9:.48)});
    });

    projected.forEach(point=>commands.push({
      type:'sphere',point,depth:point.depth,
      radius:L.unit*.085*scale*point.perspective,
      color:palette.x,alpha:alpha*.98
    }));
    commands.push({
      type:'sphere',point:center,depth:center.depth-.02,
      radius:L.unit*.115*scale*center.perspective,
      color:palette.a,alpha
    });
    return commands;
  }

  function drawFace(command){
    ctx.save();
    ctx.globalAlpha=command.alpha;
    ctx.fillStyle=command.fill;
    ctx.strokeStyle=command.edge;
    ctx.lineWidth=1;
    ctx.beginPath();
    command.points.forEach((point,index)=>index?ctx.lineTo(point.x,point.y):ctx.moveTo(point.x,point.y));
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function drawSphere(command){
    const {point,radius,color,alpha}=command;
    ctx.save();
    ctx.globalAlpha=alpha;
    ctx.shadowColor='rgba(0,11,9,.52)';
    ctx.shadowBlur=radius*1.7;
    ctx.shadowOffsetY=radius*.5;
    const gradient=ctx.createRadialGradient(point.x-radius*.34,point.y-radius*.4,radius*.08,point.x,point.y,radius);
    gradient.addColorStop(0,'rgba(255,255,255,.98)');
    gradient.addColorStop(.2,color);
    gradient.addColorStop(1,'rgba(22,36,31,.98)');
    ctx.fillStyle=gradient;
    ctx.beginPath();
    ctx.arc(point.x,point.y,radius,0,TAU);
    ctx.fill();
    ctx.restore();
  }

  function drawBackground(){
    const gradient=ctx.createRadialGradient(width*.73,height*.5,0,width*.73,height*.5,width*.64);
    gradient.addColorStop(0,'rgba(45,124,103,.2)');
    gradient.addColorStop(.52,'rgba(10,55,46,.09)');
    gradient.addColorStop(1,'rgba(2,20,17,0)');
    ctx.fillStyle=gradient;
    ctx.fillRect(0,0,width,height);
  }

  function drawPhotons(time){
    if(reduceMotion)return;
    const phase=(time-photonEpoch+6000)%9000;
    const streaks=[
      {delay:0,rgb:'255,222,120',start:{x:.015,y:-.035},end:{x:.29,y:.32}},
      {delay:320,rgb:'255,222,120',start:{x:.075,y:-.05},end:{x:.37,y:.39}},
      {delay:680,rgb:'255,222,120',start:{x:.135,y:-.025},end:{x:.43,y:.31}}
    ];
    streaks.forEach(streak=>{
      const t=(phase-streak.delay)/1350;
      if(t<=0||t>=1)return;
      const head=smooth(t);
      const tail=Math.max(0,head-.28);
      const from={
        x:mix(streak.start.x,streak.end.x,tail)*width,
        y:mix(streak.start.y,streak.end.y,tail)*height
      };
      const to={
        x:mix(streak.start.x,streak.end.x,head)*width,
        y:mix(streak.start.y,streak.end.y,head)*height
      };
      const fade=Math.sin(Math.PI*t);
      const gradient=ctx.createLinearGradient(from.x,from.y,to.x,to.y);
      gradient.addColorStop(0,`rgba(${streak.rgb},0)`);
      gradient.addColorStop(1,`rgba(${streak.rgb},${.96*fade})`);
      ctx.save();
      ctx.strokeStyle=gradient;
      ctx.lineWidth=2.25;
      ctx.shadowColor=`rgba(${streak.rgb},.98)`;
      ctx.shadowBlur=18;
      ctx.beginPath();
      ctx.moveTo(from.x,from.y);
      ctx.lineTo(to.x,to.y);
      ctx.stroke();
      ctx.fillStyle=`rgba(${streak.rgb},${fade})`;
      ctx.beginPath();
      ctx.arc(to.x,to.y,3.1,0,TAU);
      ctx.fill();
      ctx.restore();
    });
  }

  function draw(time){
    ctx.clearRect(0,0,width,height);
    drawBackground();
    drawPhotons(time);
    const L=layout();
    const cycle=reduceMotion?.72:(time%9200)/9200;
    const missing={col:2,row:1};
    const arrival=smooth((cycle-.06)/.4);
    const reset=1-smooth((cycle-.91)/.07);
    const commands=[];

    for(let row=0;row<4;row++){
      for(let col=0;col<4;col++){
        if(col===missing.col&&row===missing.row)continue;
        commands.push(...buildCell(col,row,L));
      }
    }

    const start={x:4.5,y:-3.8,z:-2.8};
    const control={x:1.8,y:-2.7,z:-1.5};
    const translation={
      x:mix(mix(start.x,control.x,arrival),mix(control.x,0,arrival),arrival),
      y:mix(mix(start.y,control.y,arrival),mix(control.y,0,arrival),arrival),
      z:mix(mix(start.z,control.z,arrival),mix(control.z,0,arrival),arrival)
    };
    commands.push(...buildCell(missing.col,missing.row,L,{
      translation,
      rotationY:(1-arrival)*.38,
      rotationZ:(1-arrival)*-.2,
      scale:.86+.14*arrival,
      alpha:(.32+.68*arrival)*reset
    }));

    commands.sort((a,b)=>b.depth-a.depth);
    commands.forEach(command=>command.type==='face'?drawFace(command):drawSphere(command));

    const veil=ctx.createLinearGradient(0,0,width,0);
    veil.addColorStop(0,'rgba(2,18,15,.56)');
    veil.addColorStop(.31,'rgba(2,18,15,.2)');
    veil.addColorStop(.61,'rgba(2,18,15,0)');
    ctx.fillStyle=veil;
    ctx.fillRect(0,0,width,height);

    if(!reduceMotion)frame=requestAnimationFrame(draw);
  }

  addEventListener('resize',resize,{passive:true});
  addEventListener('pagehide',()=>cancelAnimationFrame(frame),{once:true});
  resize();
  draw(reduceMotion?6624:performance.now());
})();
