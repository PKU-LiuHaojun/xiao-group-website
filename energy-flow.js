(()=>{
  const canvas=document.getElementById('energyAnimation');
  if(!canvas)return;

  const ctx=canvas.getContext('2d');
  const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TAU=Math.PI*2;
  const OCTAHEDRON_RADIUS=1;
  let width=0,height=0,dpr=1,frame=0;
  const animationStart=performance.now();
  const photonEpoch=performance.now();

  const palette={
    edge:'rgba(145,103,27,.7)',
    face1:'rgba(226,184,73,.82)',
    face2:'rgba(246,220,143,.78)',
    face3:'rgba(207,153,43,.84)',
    back:'rgba(232,198,113,.62)',
    a:'#71859a',
    b:'#f4a62a',
    x:'#a6313b'
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

  function layout(time){
    const compact=width<760;
    // Hold a deliberate tilted opening pose, then rotate at a restrained pace.
    const motion=reduceMotion?0:Math.max(0,time-animationStart-1400)*.60;
    return{
      unit:Math.min(height/(compact?9.8:9.15),width/(compact?9.6:10.8)),
      origin:{x:width*(compact?.64:.77),y:height*(compact?.56:.55)},
      yaw:.34+Math.sin(motion*.0002)*.18,
      pitch:.29+Math.sin(motion*.00016)*.08,
      roll:-.035+Math.sin(motion*.00013)*.02,
      camera:24
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

  function cellWorld(col,row,layer){
    return{x:(col-1)*2,y:(row-1)*2,z:(layer-1)*2};
  }

  function buildCell(col,row,layer,L,options={}){
    const base=cellWorld(col,row,layer);
    const translation=options.translation||{x:0,y:0,z:0};
    const rotationY=options.rotationY||0;
    const rotationZ=options.rotationZ||0;
    const scale=options.scale||1;
    const alpha=options.alpha??1;
    // Six equal B-X bonds along ±x, ±y and ±z define a regular BX6 octahedron.
    const local=[
      {x:OCTAHEDRON_RADIUS,y:0,z:0},{x:-OCTAHEDRON_RADIUS,y:0,z:0},
      {x:0,y:OCTAHEDRON_RADIUS,z:0},{x:0,y:-OCTAHEDRON_RADIUS,z:0},
      {x:0,y:0,z:OCTAHEDRON_RADIUS},{x:0,y:0,z:-OCTAHEDRON_RADIUS}
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
      commands.push({type:'face',points,depth,fill,edge:palette.edge,alpha:alpha*(front?.96:.76)});
    });

    projected.forEach(point=>commands.push({
      type:'sphere',point,depth:point.depth,
      radius:L.unit*.062*scale*point.perspective,
      color:palette.x,endColor:'#711b25',alpha:alpha*.98
    }));
    commands.push({
      type:'sphere',point:center,depth:center.depth-.02,
      radius:L.unit*.108*scale*center.perspective,
      color:palette.b,endColor:'#b85d08',alpha
    });
    return commands;
  }

  function buildASites(L){
    const commands=[];
    for(let layer=0;layer<2;layer++){
      for(let row=0;row<2;row++){
        for(let col=0;col<2;col++){
          const point=project({x:-1+col*2,y:-1+row*2,z:-1+layer*2},L);
          commands.push({
            type:'sphere',point,depth:point.depth,
            radius:L.unit*.155*point.perspective,
            color:palette.a,endColor:'#40556b',alpha:.98
          });
        }
      }
    }
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
    const {point,radius,color,endColor,alpha}=command;
    ctx.save();
    ctx.globalAlpha=alpha;
    ctx.shadowColor='rgba(105,74,31,.2)';
    ctx.shadowBlur=radius*1.7;
    ctx.shadowOffsetY=radius*.5;
    const gradient=ctx.createRadialGradient(point.x-radius*.34,point.y-radius*.4,radius*.08,point.x,point.y,radius);
    gradient.addColorStop(0,'rgba(255,255,255,.98)');
    gradient.addColorStop(.2,color);
    gradient.addColorStop(1,endColor||'rgba(75,55,45,.9)');
    ctx.fillStyle=gradient;
    ctx.beginPath();
    ctx.arc(point.x,point.y,radius,0,TAU);
    ctx.fill();
    ctx.restore();
  }

  function drawBackground(){
    const gradient=ctx.createRadialGradient(width*.73,height*.5,0,width*.73,height*.5,width*.64);
    gradient.addColorStop(0,'rgba(229,184,81,.17)');
    gradient.addColorStop(.52,'rgba(235,207,142,.095)');
    gradient.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=gradient;
    ctx.fillRect(0,0,width,height);
  }

  function drawPhotons(time){
    if(reduceMotion)return;
    const elapsed=Math.max(0,time-animationStart-1400);
    if(!elapsed)return;
    const phase=elapsed%3600;
    const streaks=[
      {delay:0,rgb:'225,116,28',start:{x:-.04,y:-.08},end:{x:.38,y:.56}},
      {delay:100,rgb:'238,139,34',start:{x:.015,y:-.1},end:{x:.44,y:.63}},
      {delay:200,rgb:'214,91,24',start:{x:.075,y:-.07},end:{x:.49,y:.57}},
      {delay:300,rgb:'244,160,45',start:{x:.13,y:-.1},end:{x:.54,y:.66}}
    ];
    streaks.forEach(streak=>{
      const t=(phase-streak.delay)/3300;
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
      ctx.lineWidth=7;
      ctx.shadowColor=`rgba(${streak.rgb},.98)`;
      ctx.shadowBlur=24;
      ctx.beginPath();
      ctx.moveTo(from.x,from.y);
      ctx.lineTo(to.x,to.y);
      ctx.stroke();
      ctx.shadowBlur=10;
      ctx.strokeStyle=`rgba(255,232,164,${.95*fade})`;
      ctx.lineWidth=2.4;
      ctx.beginPath();
      ctx.moveTo(from.x,from.y);
      ctx.lineTo(to.x,to.y);
      ctx.stroke();
      ctx.fillStyle=`rgba(${streak.rgb},${fade})`;
      ctx.beginPath();
      ctx.arc(to.x,to.y,6,0,TAU);
      ctx.fill();
      ctx.fillStyle=`rgba(255,244,205,${fade})`;
      ctx.beginPath();
      ctx.arc(to.x,to.y,2.5,0,TAU);
      ctx.fill();
      ctx.restore();
    });
  }

  function draw(time){
    ctx.clearRect(0,0,width,height);
    drawBackground();
    const L=layout(time);
    const commands=[];

    for(let layer=0;layer<3;layer++){
      for(let row=0;row<3;row++){
        for(let col=0;col<3;col++){
          commands.push(...buildCell(col,row,layer,L));
        }
      }
    }
    commands.push(...buildASites(L));

    commands.sort((a,b)=>b.depth-a.depth);
    commands.forEach(command=>command.type==='face'?drawFace(command):drawSphere(command));

    const veil=ctx.createLinearGradient(0,0,width,0);
    veil.addColorStop(0,'rgba(255,255,255,.78)');
    veil.addColorStop(.31,'rgba(248,253,252,.32)');
    veil.addColorStop(.61,'rgba(255,255,255,0)');
    ctx.fillStyle=veil;
    ctx.fillRect(0,0,width,height);
    if(!reduceMotion)frame=requestAnimationFrame(draw);
  }

  addEventListener('resize',resize,{passive:true});
  addEventListener('pagehide',()=>cancelAnimationFrame(frame),{once:true});
  resize();
  draw(reduceMotion?6624:performance.now());
})();
