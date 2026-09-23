(()=>{
  const canvas=document.getElementById('energyAnimation');
  if(!canvas)return;

  const ctx=canvas.getContext('2d');
  const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TAU=Math.PI*2;
  const OCTAHEDRON_RADIUS=1;
  // CsPbBr3-inspired A:B ionic-radius ratio (Cs+: 1.88 Å; Pb2+: 1.19 Å).
  // Display spheres are scaled for legibility, not a space-filling model.
  const B_SITE_RADIUS=.16;
  const A_SITE_RADIUS=B_SITE_RADIUS*(1.88/1.19);
  let width=0,height=0,dpr=1,frame=0;
  const animationStart=performance.now();
  const photonEpoch=performance.now();

  const palette={
    edge:'rgba(108,115,122,.85)',
    face1:'rgba(179,185,191,.95)',
    face2:'rgba(222,226,230,.93)',
    face3:'rgba(151,159,167,.96)',
    back:'rgba(198,204,209,.82)',
    a:'#71859a',
    b:'#a5adb5',
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
    // Fixed lattice pose; only incident light and photoexcited electrons move.
    return{
      unit:Math.min(height/(compact?9.8:9.15),width/(compact?9.6:10.8)),
      origin:{x:width*(compact?.61:.70),y:height*(compact?.50:.53)},
      yaw:.34,
      pitch:.29,
      roll:-.035,
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
      radius:L.unit*B_SITE_RADIUS*scale*center.perspective,
      color:palette.b,endColor:'#626c76',alpha
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
            radius:L.unit*A_SITE_RADIUS*point.perspective,
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
    ctx.shadowColor='rgba(63,71,80,.2)';
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

  function drawPhotoexcitation(time,L){
    if(reduceMotion)return;
    const phase=((time-animationStart)%6200)/1000;
    const sharedFade=1-smooth((phase-4.4)/1.6);
    const hit=project({x:-1.5,y:-1.2,z:-2.7},L);
    const start={x:-width*.22,y:Math.max(80,hit.y-height*.38)};
    if(phase<6){
      // One continuous spectral fill avoids seams between separate color strips.
      const dx=hit.x-start.x,dy=hit.y-start.y,length=Math.hypot(dx,dy)||1;
      const nx=-dy/length,ny=dx/length;
      const tailWidth=width<760?7:12,wide=width<760?65:110;
      const progress=smooth(phase/1.5);
      const head={x:mix(start.x,hit.x,progress),y:mix(start.y,hit.y,progress)};
      const headWidth=mix(tailWidth,wide,progress);
      ctx.save();
      ctx.globalAlpha=sharedFade;
      ctx.filter=`blur(${width<760?10:16}px)`;
      const glow=ctx.createLinearGradient(hit.x-nx*wide,hit.y-ny*wide,hit.x+nx*wide,hit.y+ny*wide);
      glow.addColorStop(0,'rgba(234,167,181,0)');
      glow.addColorStop(.15,'rgba(242,189,170,.25)');
      glow.addColorStop(.35,'rgba(249,229,179,.36)');
      glow.addColorStop(.52,'rgba(214,230,198,.38)');
      glow.addColorStop(.7,'rgba(182,213,233,.33)');
      glow.addColorStop(.85,'rgba(202,190,228,.23)');
      glow.addColorStop(1,'rgba(216,185,223,0)');
      ctx.fillStyle=glow;ctx.beginPath();
      ctx.moveTo(start.x-nx*tailWidth,start.y-ny*tailWidth);
      ctx.lineTo(head.x-nx*headWidth,head.y-ny*headWidth);
      ctx.lineTo(head.x+nx*headWidth,head.y+ny*headWidth);
      ctx.lineTo(start.x+nx*tailWidth,start.y+ny*tailWidth);
      ctx.closePath();ctx.fill();
      ctx.restore();
    }
    // Schematic photoexcited carriers; upward drift is a visual illustration.
    for(let i=0;i<2;i++){
      const age=phase-2.0-i*.22;
      if(age<=0||phase>=6)continue;
      const p=age/4,fade=smooth(age/.18)*sharedFade;
      const x=hit.x+(i===0?-.55:1.15)*L.unit+Math.sin(p*2+i)*L.unit*.08;
      const y=hit.y+(i===0?-.15:.48)*L.unit-p*Math.min(height*.38,L.unit*4.8);
      const r=width<760?6:8;
      ctx.save();ctx.globalAlpha=fade;
      const halo=ctx.createRadialGradient(x,y,r*.4,x,y,r*3);
      halo.addColorStop(0,'rgba(109,172,213,.3)');halo.addColorStop(1,'rgba(109,172,213,0)');
      ctx.fillStyle=halo;ctx.beginPath();ctx.arc(x,y,r*3,0,TAU);ctx.fill();
      const sphere=ctx.createRadialGradient(x-r*.3,y-r*.35,0,x,y,r);
      sphere.addColorStop(0,'#edf8ff');sphere.addColorStop(.35,'#88bddf');sphere.addColorStop(1,'#3c789f');
      ctx.fillStyle=sphere;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
      ctx.strokeStyle='rgba(255,255,255,.95)';ctx.lineWidth=1.5;ctx.lineCap='round';
      ctx.beginPath();ctx.moveTo(x-r*.45,y);ctx.lineTo(x+r*.45,y);ctx.stroke();ctx.restore();
    }
  }

  function draw(time){
    ctx.clearRect(0,0,width,height);

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


    drawPhotoexcitation(time,L);
    if(!reduceMotion)frame=requestAnimationFrame(draw);
  }

  addEventListener('resize',resize,{passive:true});
  addEventListener('pagehide',()=>cancelAnimationFrame(frame),{once:true});
  resize();
  draw(reduceMotion?6624:performance.now());
})();
