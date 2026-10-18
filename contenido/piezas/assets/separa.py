"""Separa el boceto en dos capas (Elena detrás, Aitana delante) y rellena lo que Aitana tapa de Elena.
Uso: python3 piezas/assets/separa.py  (desde contenido/)"""
import numpy as np, base64, os
from PIL import Image, ImageFilter
im=Image.open('piezas/assets/elena-aitana.png'); a=np.asarray(im).astype(float); H,W=a.shape[:2]
# borde izquierdo de Aitana, de arriba abajo (px de la imagen)
B=[(760,0),(720,230),(700,267),(633,400),(620,453),(617,533),(607,600),(600,640),(598,690),(583,705),(586,750),(593,800),(607,900),(620,950),(640,1000),(655,1050),(670,1100),(683,1150),(697,1200),(712,1295)]
bx=np.interp(np.arange(H),[p[1] for p in B],[p[0] for p in B])
X=np.arange(W)[None,:].repeat(H,0); Y=np.arange(H)[:,None].repeat(W,1)
d=X-bx[:,None]
R,G,Bc=a[...,0],a[...,1],a[...,2]; lum=.3*R+.59*G+.11*Bc
aitLike=((lum>120)&(R>G)&(G>Bc))|(Bc>R+3)
eleLike=((lum<100)&(R>=Bc))
mA=(d>0).astype(float); band=np.abs(d)<14
mA[band&aitLike]=1; mA[band&eleLike&~aitLike]=0
mA=np.asarray(Image.fromarray((mA*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(.8))).astype(float)/255
alpha=a[...,3]/255
ait=a.copy(); ait[...,3]=alpha*mA*255
ele=a.copy(); ele[...,3]=alpha*(1-mA)*255
yy=Y[:,0]
reach=np.interp(yy,[400,460,640,700,900,1100,1160,1175],[0,18,30,95,110,90,40,0])
inF=(d>-2)&(d<reach[:,None])
col=np.zeros((H,W,3)); jac=Y>=690; col[jac]=[46,37,34]; col[~jac]=[70,44,30]
fill=inF.astype(float)
fm=np.asarray(Image.fromarray((fill*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(3))).astype(float)/255
fm=np.minimum(fm,fill)
ea=ele[...,3]/255; na=ea+fm*(1-ea)
for c in range(3): ele[...,c]=np.where(na>0,(ele[...,c]*ea+col[...,c]*fm*(1-ea))/np.maximum(na,1e-6),ele[...,c])
ele[...,3]=na*255
Image.fromarray(ele.astype(np.uint8),'RGBA').save('piezas/assets/elena.png')
Image.fromarray(ait.astype(np.uint8),'RGBA').save('piezas/assets/aitana.png')
for n in ['elena','aitana']:
    b=base64.b64encode(open(f'piezas/assets/{n}.png','rb').read()).decode()
    open(f'piezas/assets/{n}.js','w').write(f'window.IMG_{n.upper()}="data:image/png;base64,{b}";\n')
if os.environ.get('S'):
    E=Image.open('piezas/assets/elena.png'); A=Image.open('piezas/assets/aitana.png')
    v=Image.new('RGBA',(W+200,H),(0,200,0,255)); v.alpha_composite(E,(0,0)); v.alpha_composite(A,(160,-30))
    v.convert('RGB').resize(((W+200)//2,H//2)).save(os.environ['S']+'/separadas.png')
