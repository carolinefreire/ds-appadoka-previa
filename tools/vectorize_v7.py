#!/usr/bin/env python3
"""Experimental multi-color vectorization of selected v7 regions.
Creates actual SVG paths, never embeds raster images. NOT approval-ready.
Requires: pillow, numpy, opencv-python-headless.
"""
from pathlib import Path
import argparse, cv2, numpy as np
from PIL import Image

SOURCE="design-system-appadoka-v7-detalhes-corrigidos(2)-1.png"
# Normalized boxes are preliminary and must be verified against the source
REGIONS={
 "bread-symbol":(0.025,0.022,0.30,0.205),
 "motion-and-heart":(0.025,0.465,0.30,0.69),
 "monogram":(0.47,0.22,0.58,0.38),
}
def vectorize(img, target, colors=9, min_area=7, epsilon=.45):
    h,w=img.shape[:2]
    rgb=cv2.cvtColor(img,cv2.COLOR_BGR2RGB)
    # Smooth JPEG compression noise before clustering colors
    rgb=cv2.bilateralFilter(rgb,7,35,35)
    pixels=rgb.reshape(-1,3).astype(np.float32)
    _,labels,centers=cv2.kmeans(pixels,colors,None,
        (cv2.TERM_CRITERIA_EPS+cv2.TERM_CRITERIA_MAX_ITER,40,.18),
        5,cv2.KMEANS_PP_CENTERS)
    centers=np.clip(centers,0,255).astype(np.uint8)
    labels=labels.reshape(h,w)
    # Draw broadest masks first; exclude near-white paper/background
    order=sorted(range(colors),key=lambda i:int(np.count_nonzero(labels==i)),reverse=True)
    paths=[]
    for i in order:
        r,g,b=map(int,centers[i])
        if min(r,g,b)>238 and max(r,g,b)-min(r,g,b)<18:continue
        mask=(labels==i).astype(np.uint8)*255
        mask=cv2.morphologyEx(mask,cv2.MORPH_OPEN,np.ones((2,2),np.uint8))
        contours,hierarchy=cv2.findContours(mask,cv2.RETR_CCOMP,cv2.CHAIN_APPROX_SIMPLE)
        if hierarchy is None:continue
        children={}
        for j,hier in enumerate(hierarchy[0]):
            parent=int(hier[3])
            if parent>=0:children.setdefault(parent,[]).append(j)
        for j,contour in enumerate(contours):
            if hierarchy[0][j][3]>=0 or abs(cv2.contourArea(contour))<min_area:continue
            parts=[]
            for idx in [j]+children.get(j,[]):
                pts=cv2.approxPolyDP(contours[idx],epsilon,True).reshape(-1,2)
                if len(pts)<3:continue
                parts.append('M'+' L'.join(f'{int(x)} {int(y)}' for x,y in pts)+' Z')
            if parts:paths.append(f'<path fill="#{r:02X}{g:02X}{b:02X}" fill-rule="evenodd" d="{" ".join(parts)}"/>')
    target.write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}">\n'+'\n'.join(paths)+'\n</svg>\n',encoding="utf-8")
    return len(paths)

def main():
    p=argparse.ArgumentParser()
    p.add_argument('--source',default=SOURCE)
    p.add_argument('--out',default='vectorization-output')
    args=p.parse_args()
    im=cv2.imread(args.source)
    if im is None:raise SystemExit(f'Missing reference: {args.source}')
    h,w=im.shape[:2]
    out=Path(args.out);out.mkdir(parents=True,exist_ok=True)
    for name,(x1,y1,x2,y2) in REGIONS.items():
        crop=im[round(y1*h):round(y2*h),round(x1*w):round(x2*w)]
        n=vectorize(crop,out/f'{name}.svg')
        print(name, f'{crop.shape[1]}x{crop.shape[0]}',n,'paths')
    (out/'STATUS.txt').write_text('AUTOMATED VECTOR STUDIES ONLY. NOT VALIDATED, NOT APPROVED, NOT 99.999% FIDELITY.\n')
if __name__=='__main__':main()
