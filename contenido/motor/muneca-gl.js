// Rig de muñecas sobre ilustraciones planas (WebGL). Cada personaje es una capa con su propia imagen.
// Deforma una malla fina: parpadeo (comprime el párpado hacia la línea inferior), cejas, cabeza
// (gira sobre el cuello), respiración y ancho de boca; la boca se abre por píxel en la juntura de los labios.
// Uso:
//   const esc = await Muneca.escena(canvas);
//   const capa = await esc.capa(dataURL, P);           // P: medidas del personaje en px de su imagen
//   esc.limpia(); esc.dibuja(capa, estado, afin, recorte?);
//   afin = [a, b, c, d, tx, ty]: pantalla = (a*x + c*y + tx, b*x + d*y + ty) con x,y en px de la imagen.
(function () {
  const VS = `#version 300 es
  precision highp float;
  in vec2 a;
  uniform vec2 uImg, uView; uniform mat2 uA; uniform vec2 uT;
  uniform vec4 uH0, uH1, uM0, uM1; uniform vec4 uE0[2]; uniform vec4 uE1[2]; uniform float uBr;
  out vec2 vUv;
  mat2 rot(float r){ float c=cos(r), s=sin(r); return mat2(c,s,-s,c); }
  void main(){
    vec2 v=a, p=a;
    { vec2 m=uM0.xy; float ang=uM0.z, W=uM1.x, ws=uM1.z;
      vec2 u=rot(-ang)*(p-m);
      float rr=length(u/vec2(W*1.5,W*1.2)); float fw=1.-smoothstep(.45,1.,rr);
      u.x+=(ws-1.)*u.x*fw; p=m+rot(ang)*u; }
    for(int j=0;j<2;j++){
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
    { vec2 pv=uH0.xy; float ang=uH0.z, bob=uH0.w;
      float wx=1.-smoothstep(uH1.y,uH1.z,abs(v.x-uH1.x));
      float wy=smoothstep(pv.y+uH1.w,pv.y-uH1.w,v.y);
      float w=wx*wy;
      p=pv+rot(ang*w)*(p-pv)+vec2(0.,-bob*w);
      p.y=uImg.y-(uImg.y-p.y)*(1.+uBr); }
    vec2 s=uA*p+uT;
    gl_Position=vec4(s.x/uView.x*2.-1., 1.-s.y/uView.y*2., 0., 1.);
    vUv=a/uImg;
  }`;
  const FS = `#version 300 es
  precision highp float; in vec2 vUv; uniform sampler2D uT0; uniform vec2 uImg;
  uniform vec4 uM0, uM1; uniform vec3 uMc; uniform float uK[7];
  out vec4 o;
  mat2 rot(float r){ float c=cos(r), s=sin(r); return mat2(c,s,-s,c); }
  float fyf(float d){ return 1.-smoothstep(28.,95.,d); }
  float seam(float xl){ float f=(xl+1.)*3.; int k=int(clamp(floor(f),0.,5.)); return mix(uK[k],uK[k+1],clamp(f-float(k),0.,1.)); }
  void main(){
    vec2 q=vUv*uImg, s=q; float gm=0.; vec3 gc=vec3(0.);
    vec2 m=uM0.xy; float ang=uM0.z, op=uM0.w; float W=uM1.x;
    vec2 u=rot(-ang)*(q-m);
    float xl=clamp(u.x/W,-1.,1.); float yl=seam(xl);
    float fx=1.-smoothstep(.2*W,1.02*W,abs(u.x)); fx=sqrt(fx);
    if(op>.01 && fx>0. && abs(u.y-yl)<130.){
      float O=op*fx*fyf(0.), L=op*.22*fx; float y=u.y;
      if(u.y>=yl+O){ y=u.y-O; for(int k=0;k<4;k++) y=u.y-op*fx*fyf(y-yl); }
      else if(u.y<=yl-L){ y=u.y+L; for(int k=0;k<4;k++) y=u.y+L*(1.-smoothstep(0.,26.,yl-y)); }
      else {
        float tt=(u.y-(yl-L))/max(.001,L+O); float d=min(u.y-(yl-L),(yl+O)-u.y);
        gm=smoothstep(0.,.9,d);
        float teeth=(1.-smoothstep(.3,.45,tt))*(1.-smoothstep(.42*W,.7*W,abs(u.x)))*smoothstep(2.5,5.,O);
        float tongue=smoothstep(.6,.92,tt)*(1.-smoothstep(.15*W,.5*W,abs(u.x)))*smoothstep(4.,7.,O);
        gc=mix(uMc, uMc*1.9+vec3(.12,.02,.02), tongue*.75); gc=mix(gc, vec3(.95,.92,.89), teeth);
        y=yl;
      }
      u.y=y; s=m+rot(ang)*u;
    }
    vec4 c=texture(uT0,s/uImg);
    o=mix(c, vec4(gc,1.)*c.a, gm*c.a);
  }`;
  function sh(gl, t, s) { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; }

  async function escena(canvas) {
    const gl = canvas.getContext('webgl2', { premultipliedAlpha: true, preserveDrawingBuffer: true, antialias: true });
    const pr = gl.createProgram(); gl.attachShader(pr, sh(gl, gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl, gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(pr));
    gl.useProgram(pr); gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    const U = n => gl.getUniformLocation(pr, n); const la = gl.getAttribLocation(pr, 'a');
    return {
      async capa(src, P, paso = 3) {
        const img = new Image(); img.src = src; await img.decode();
        const W = img.width, H = img.height;
        const nx = Math.ceil(W / paso) + 1, ny = Math.ceil(H / paso) + 1;
        const vb = new Float32Array(nx * ny * 2); let k = 0;
        for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { vb[k++] = Math.min(W, i * paso); vb[k++] = Math.min(H, j * paso); }
        const ib = new Uint32Array((nx - 1) * (ny - 1) * 6); k = 0;
        for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) { const q = j * nx + i; ib.set([q, q + 1, q + nx, q + 1, q + nx + 1, q + nx], k); k += 6; }
        const vao = gl.createVertexArray(); gl.bindVertexArray(vao);
        const b1 = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b1); gl.bufferData(gl.ARRAY_BUFFER, vb, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(la); gl.vertexAttribPointer(la, 2, gl.FLOAT, false, 0, 0);
        const b2 = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, b2); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, ib, gl.STATIC_DRAW);
        gl.bindVertexArray(null);
        const tx = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tx);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        return { W, H, P, vao, tx, n: ib.length };
      },
      limpia() { gl.disable(gl.SCISSOR_TEST); gl.viewport(0, 0, canvas.width, canvas.height); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); },
      // recorte: [x, y, w, h] en px de pantalla (y desde arriba) para pantallas partidas
      dibuja(c, s, af, recorte) {
        const p = c.P;
        if (recorte) { gl.enable(gl.SCISSOR_TEST); gl.scissor(recorte[0], canvas.height - recorte[1] - recorte[3], recorte[2], recorte[3]); } else gl.disable(gl.SCISSOR_TEST);
        gl.bindVertexArray(c.vao); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, c.tx); gl.uniform1i(U('uT0'), 0);
        gl.uniform2f(U('uImg'), c.W, c.H); gl.uniform2f(U('uView'), canvas.width, canvas.height);
        gl.uniformMatrix2fv(U('uA'), false, [af[0], af[1], af[2], af[3]]); gl.uniform2f(U('uT'), af[4], af[5]);
        gl.uniform4f(U('uH0'), p.cabeza.px, p.cabeza.py, s.giro * Math.PI / 180, s.salto);
        gl.uniform4f(U('uH1'), p.cabeza.cx, p.cabeza.xin, p.cabeza.xout, p.cabeza.fy);
        gl.uniform4f(U('uM0'), p.boca.x, p.boca.y, p.boca.ang, s.abre); gl.uniform4f(U('uM1'), p.boca.W, 0, s.ancho, 0);
        gl.uniform3fv(U('uMc'), p.boca.interior); gl.uniform1fv(U('uK'), p.boca.juntura);
        const e0 = [], e1 = []; p.ojos.forEach(o => { e0.push(o.x, o.y, o.ang, s.parpadeo); e1.push(o.W, o.H, s.cejas, 0); });
        gl.uniform4fv(U('uE0'), e0); gl.uniform4fv(U('uE1'), e1); gl.uniform1f(U('uBr'), s.resp);
        gl.drawElements(gl.TRIANGLES, c.n, gl.UNSIGNED_INT, 0);
      }
    };
  }
  window.Muneca = { escena };
})();
