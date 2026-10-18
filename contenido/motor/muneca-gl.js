// Rig de muñecas sobre una ilustración plana (WebGL). Deforma una malla fina sobre la imagen:
// boca (abre por la línea de los labios, calculada por píxel), parpadeo (comprime el párpado hacia la línea inferior),
// cejas, cabeza (gira sobre el cuello) y respiración. Todo en píxeles de la imagen original.
// Uso: const rig = await Muneca.crear(canvas, dataURL, personajes); rig.dibuja(estado, camara);
(function () {
  const MAXE = 4; // ojos en total (2 por personaje)
  const VS = `#version 300 es
  precision highp float;
  in vec2 a;
  uniform vec2 uImg, uView; uniform vec3 uCam; // cam: escala, offset x, offset y (px de pantalla)
  uniform vec4 uH0[2]; uniform vec4 uH1[2]; uniform vec4 uSep[2];
  uniform vec4 uM0[2]; uniform vec4 uM1[2];
  uniform vec4 uE0[${MAXE}]; uniform vec4 uE1[${MAXE}];
  uniform float uBr[2];
  out vec2 vUv;
  mat2 rot(float r){ float c=cos(r), s=sin(r); return mat2(c,s,-s,c); }
  float sepw(int i, vec2 v){ vec4 s=uSep[i]; float w=smoothstep(s.x,s.y,v.x); return s.z>0.? w : 1.-w; }
  void main(){
    vec2 v=a, p=a;
    for(int i=0;i<2;i++){
      // boca
      vec2 m=uM0[i].xy; float ang=uM0[i].z, op=uM0[i].w;
      float W=uM1[i].x, c0=uM1[i].y, ws=uM1[i].z;
      vec2 u=rot(-ang)*(p-m);
            float rr=length(u/vec2(W*1.5,W*1.2)); float fw=1.-smoothstep(.45,1.,rr);
      u.x+=(ws-1.)*u.x*fw;
      p=m+rot(ang)*u;
    }
    for(int j=0;j<${MAXE};j++){
      vec2 e=uE0[j].xy; float ang=uE0[j].z, bl=uE0[j].w;
      float Wx=uE1[j].x, H=uE1[j].y, br=uE1[j].z;
      vec2 u=rot(-ang)*(p-e);
      float fx=1.-smoothstep(.8*Wx,1.3*Wx,abs(u.x));
      if(u.y<0.){
        float g=1.-smoothstep(H,H+30.,-u.y);
        u.y*=1.-bl*.97*fx*g;
        float wb=fx*smoothstep(H*.3,H+5.,-u.y)*(1.-smoothstep(H+30.,H+75.,-u.y));
        u.y-=br*wb;
      }
      p=e+rot(ang)*u;
    }
    for(int i=0;i<2;i++){
      vec2 pv=uH0[i].xy; float ang=uH0[i].z, bob=uH0[i].w;
      float wx=1.-smoothstep(uH1[i].y,uH1[i].z,abs(v.x-uH1[i].x));
      float wy=smoothstep(pv.y+uH1[i].w,pv.y-uH1[i].w,v.y);
      float w=wx*wy*sepw(i,v);
      p=pv+rot(ang*w)*(p-pv)+vec2(0.,-bob*w);
      float wb=sepw(i,v);
      p.y=uImg.y-(uImg.y-p.y)*(1.+uBr[i]*wb);
    }
    vec2 s=p*uCam.x+uCam.yz;
    gl_Position=vec4(s.x/uView.x*2.-1., 1.-s.y/uView.y*2., 0., 1.);
    vUv=a/uImg;
  }`;
  const FS = `#version 300 es
  precision highp float; in vec2 vUv; uniform sampler2D uT; uniform vec2 uImg;
  uniform vec4 uM0[2]; uniform vec4 uM1[2]; uniform vec3 uMc[2]; uniform float uK[14];
  out vec4 o;
  float seam(int i, float xl){ float f=(xl+1.)*3.; int k=int(clamp(floor(f),0.,5.)); return mix(uK[i*7+k],uK[i*7+k+1],clamp(f-float(k),0.,1.)); }
  mat2 rot(float r){ float c=cos(r), s=sin(r); return mat2(c,s,-s,c); }
  float fyf(float d){ return 1.-smoothstep(28.,95.,d); }
  void main(){
    vec2 q=vUv*uImg, s=q; float gm=0.; vec3 gc=vec3(0.);
    for(int i=0;i<2;i++){
      vec2 m=uM0[i].xy; float ang=uM0[i].z, op=uM0[i].w; float W=uM1[i].x, c0=uM1[i].y;
      vec2 u=rot(-ang)*(q-m);
      float xl=clamp(u.x/W,-1.,1.); float yl=seam(i,xl);
      float fx=1.-smoothstep(.2*W,1.02*W,abs(u.x)); fx=sqrt(fx);
      if(op<.01 || fx<=0. || abs(u.y-yl)>130.) continue;
      float O=op*fx*fyf(0.), L=op*.22*fx;
      float y=u.y;
      if(u.y>=yl+O){ y=u.y-O; for(int k=0;k<4;k++) y=u.y-op*fx*fyf(y-yl); }
      else if(u.y<=yl-L){ y=u.y+L; for(int k=0;k<4;k++) y=u.y+L*(1.-smoothstep(0.,26.,yl-y)); }
      else {
        float tt=(u.y-(yl-L))/max(.001,L+O);
        float d=min(u.y-(yl-L),(yl+O)-u.y);
        gm=smoothstep(0.,.9,d);
        float teeth=(1.-smoothstep(.3,.45,tt))*(1.-smoothstep(.42*W,.7*W,abs(u.x)))*smoothstep(2.5,5.,O);
        float tongue=smoothstep(.6,.92,tt)*(1.-smoothstep(.15*W,.5*W,abs(u.x)))*smoothstep(4.,7.,O);
        gc=mix(uMc[i], uMc[i]*1.9+vec3(.12,.02,.02), tongue*.75);
        gc=mix(gc, vec3(.95,.92,.89), teeth);
        y=yl;
      }
      u.y=y; s=m+rot(ang)*u;
    }
    vec4 c=texture(uT,s/uImg);
    o=mix(c, vec4(gc,1.), gm*c.a);
  }`;

  function sh(gl, t, s) { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; }

  async function crear(canvas, src, P, paso = 3) {
    const img = new Image(); img.src = src; await img.decode();
    const W = img.width, H = img.height;
    // textura: la ilustración + una línea oscura y un filo de dientes en la juntura de los labios
    const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
    x.drawImage(img, 0, 0);
    const gl = canvas.getContext('webgl2', { premultipliedAlpha: true, preserveDrawingBuffer: true, antialias: true });
    const pr = gl.createProgram(); gl.attachShader(pr, sh(gl, gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl, gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(pr));
    gl.useProgram(pr);
    const nx = Math.ceil(W / paso) + 1, ny = Math.ceil(H / paso) + 1;
    const vb = new Float32Array(nx * ny * 2); let k = 0;
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { vb[k++] = Math.min(W, i * paso); vb[k++] = Math.min(H, j * paso); }
    const ib = new Uint32Array((nx - 1) * (ny - 1) * 6); k = 0;
    for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) { const q = j * nx + i; ib.set([q, q + 1, q + nx, q + 1, q + nx + 1, q + nx], k); k += 6; }
    const b1 = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b1); gl.bufferData(gl.ARRAY_BUFFER, vb, gl.STATIC_DRAW);
    const la = gl.getAttribLocation(pr, 'a'); gl.enableVertexAttribArray(la); gl.vertexAttribPointer(la, 2, gl.FLOAT, false, 0, 0);
    const b2 = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, b2); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, ib, gl.STATIC_DRAW);
    const tx = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tx);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    const U = n => gl.getUniformLocation(pr, n);
    const n = ib.length;
    return {
      W, H,
      // est[i] = {abre, ancho, giro, salto, cejas, resp, parpadeo:[o1,o2]}; cam = {s, x, y}
      dibuja(est, cam) {
        gl.viewport(0, 0, canvas.width, canvas.height); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform2f(U('uImg'), W, H); gl.uniform2f(U('uView'), canvas.width, canvas.height); gl.uniform3f(U('uCam'), cam.s, cam.x, cam.y);
        const h0 = [], h1 = [], sp = [], m0 = [], m1 = [], e0 = [], e1 = [], br = [], mc = [], kk = [];
        P.forEach((p, i) => {
          const s = est[i];
          h0.push(p.cabeza.px, p.cabeza.py, s.giro * Math.PI / 180, s.salto);
          h1.push(p.cabeza.cx, p.cabeza.xin, p.cabeza.xout, p.cabeza.fy);
          sp.push(p.sep[0], p.sep[1], p.sep[2], 0);
          m0.push(p.boca.x, p.boca.y, p.boca.ang, s.abre); mc.push(...p.boca.interior); kk.push(...p.boca.juntura); m1.push(p.boca.W, p.boca.c0, s.ancho, 0);
          p.ojos.forEach((o, j) => { e0.push(o.x, o.y, o.ang, s.parpadeo); e1.push(o.W, o.H, s.cejas, 0); });
          br.push(s.resp);
        });
        gl.uniform4fv(U('uH0'), h0); gl.uniform4fv(U('uH1'), h1); gl.uniform4fv(U('uSep'), sp);
        gl.uniform4fv(U('uM0'), m0); gl.uniform4fv(U('uM1'), m1); gl.uniform4fv(U('uE0'), e0); gl.uniform4fv(U('uE1'), e1);
        gl.uniform1fv(U('uBr'), br);
        gl.uniform3fv(U('uMc'), mc); gl.uniform1fv(U('uK'), kk);
        gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_INT, 0);
      }
    };
  }
  window.Muneca = { crear };
})();
