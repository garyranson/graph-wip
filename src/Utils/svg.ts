
interface SVGElementTagNameMap  {
  "a": SVGAElement;
  "circle": SVGCircleElement;
  "clippath": SVGClipPathElement;
  "defs": SVGDefsElement;
  "desc": SVGDescElement;
  "ellipse": SVGEllipseElement;
  "feblend": SVGFEBlendElement;
  "fecolormatrix": SVGFEColorMatrixElement;
  "fecomponenttransfer": SVGFEComponentTransferElement;
  "fecomposite": SVGFECompositeElement;
  "feconvolvematrix": SVGFEConvolveMatrixElement;
  "fediffuselighting": SVGFEDiffuseLightingElement;
  "fedisplacementmap": SVGFEDisplacementMapElement;
  "fedistantlight": SVGFEDistantLightElement;
  "feflood": SVGFEFloodElement;
  "fefunca": SVGFEFuncAElement;
  "fefuncb": SVGFEFuncBElement;
  "fefuncg": SVGFEFuncGElement;
  "fefuncr": SVGFEFuncRElement;
  "fegaussianblur": SVGFEGaussianBlurElement;
  "feimage": SVGFEImageElement;
  "femerge": SVGFEMergeElement;
  "femergenode": SVGFEMergeNodeElement;
  "femorphology": SVGFEMorphologyElement;
  "feoffset": SVGFEOffsetElement;
  "fepointlight": SVGFEPointLightElement;
  "fespecularlighting": SVGFESpecularLightingElement;
  "fespotlight": SVGFESpotLightElement;
  "fetile": SVGFETileElement;
  "feturbulence": SVGFETurbulenceElement;
  "filter": SVGFilterElement;
  "foreignobject": SVGForeignObjectElement;
  "g": SVGGElement;
  "image": SVGImageElement;
  "line": SVGLineElement;
  "lineargradient": SVGLinearGradientElement;
  "marker": SVGMarkerElement;
  "mask": SVGMaskElement;
  "metadata": SVGMetadataElement;
  "path": SVGPathElement;
  "pattern": SVGPatternElement;
  "polygon": SVGPolygonElement;
  "polyline": SVGPolylineElement;
  "radialgradient": SVGRadialGradientElement;
  "rect": SVGRectElement;
  "stop": SVGStopElement;
  "svg": SVGSVGElement;
  "switch": SVGSwitchElement;
  "style": SVGStyleElement;
  "symbol": SVGSymbolElement;
  "text": SVGTextElement;
  "textpath": SVGTextPathElement;
  "tspan": SVGTSpanElement;
  "use": SVGUseElement;
  "view": SVGViewElement;
}

export function createSvgElement<K extends keyof SVGElementTagNameMap>(tagName: K,attrs?:{[name:string]:string|number}) : SVGElementTagNameMap[K] {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tagName);
  if (attrs) {
    for (const key in attrs) {
      if (key == 'href') {
        el.setAttributeNS("http://www.w3.org/1999/xlink", key, <string>attrs[key]);
      } else {
        el.setAttribute(key, <string>attrs[key]);
      }
    }
  }
  return el;
}
