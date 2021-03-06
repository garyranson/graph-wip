export const container = {
  name: "$container",
  parent: 'container',
  minumumSize: {width: 80, height: 120},
  maximumSize: {width: Number.MAX_SAFE_INTEGER, height: Number.MAX_SAFE_INTEGER},
  canContain: ['select', 'container', 'default'],
  layoutManager: null,
  returnType: null,
  isSelectable: true,
  hasFeedback: 'flow',
  template: (PxState) =>
    <g className="pw-container" data-translate data-class='mover'>
      <rect className="pw-container__canvas" data-canvas rx="9" ry="9"></rect>
      <text className="pw-container__text" x="-10" y="-10" dy='1em' dx='20px' data-text='${id}'></text>
    </g>
};


const b  = (PxState) => <svg id="main" xmlns="http://www.w3.org/2000/svg" xlinkHref="http://www.w3.org/1999/xlink">
  <widget id="$node-root">
    <svg data-class='canvas' data-fill-parent className="pw-canvas" xmlns="http://www.w3.org/2000/svg" xlinkHref="http://www.w3.org/1999/xlink">
      <defs>
        <marker id="dot" viewBox="0 0 6 6" refX="3" refY="3" markerWidth="3" markerHeight="3">
          <circle cx="3" cy="3" r="3" fill="red"></circle>
        </marker>

        <symbol id="twitter" viewBox="0 0 50 50" preserveAspectRatio="xMidYMid meet">
          <path d="M40.9,14.5c-1.2,0.5-2.4,0.9-3.7,1c1.3-0.8,2.4-2.1,2.9-3.6c-1.3,0.7-2.6,1.3-4.1,1.6 c-1.2-1.3-2.9-2.1-4.7-2.1c-3.6,0-6.5,2.9-6.5,6.5c0,0.5,0.1,1,0.2,1.5c-5.4-0.3-10.2-2.9-13.4-6.8c-0.6,1-0.9,2.1-0.9,3.3 c0,2.3,1.1,4.2,2.9,5.4c-1.1,0-2.1-0.3-2.9-0.8c0,0,0,0.1,0,0.1c0,3.2,2.2,5.8,5.2,6.4c-0.5,0.1-1.1,0.2-1.7,0.2
             c-0.4,0-0.8,0-1.2-0.1c0.8,2.6,3.2,4.5,6.1,4.5c-2.2,1.7-5,2.8-8.1,2.8c-0.5,0-1,0-1.6-0.1c2.9,1.8,6.3,2.9,10,2.9 c12,0,18.5-9.9,18.5-18.5c0-0.3,0-0.6,0-0.8C38.9,17,40,15.9,40.9,14.5z"/>
        </symbol>

        <path id="connector_mid" d="M-10,-10 h 20 v 20 h -20 Z"/>
        <polygon id='connector_start' points="0,0 20,-10 20,10"/>
        <polygon id='connector_end' points="0,0 -20,-10 -20,10"/>


        <polygon id="triangle-n" points="10,0 20,10 0,10"></polygon>
        <polygon id="triangle-s" points="0,0 20,0 10,10"></polygon>
        <polygon id="triangle-w" points="0,10 10,0 10,20"></polygon>
        <polygon id="triangle-e" points="0,0 10,10 0,20"></polygon>

        <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="black"/>
        </marker>
      </defs>
    </svg>
  </widget>

  <widget id="select">
    <g className="pw-select" data-class='mover' data-translate>
      <rect className="pw-select__canvas" x='0' y='0' data-size rx="9" ry="9"></rect>
      <text className="pw-select__text" x='5' y='5' dy='1em' dx='20px' data-text='${id}'></text>
    </g>
  </widget>

  <widget id="default">
    <g className="pw-default" data-class='mover' data-translate>
      <rect className='pw-default__canvas' x='0' y='0' rx="9" ry="9" data-size></rect>
      <rect className='pw-default__canvas_fill' x='5' y='30' rx="9" ry="9" data-size='-10,-35'></rect>
      <text className='pw-default__text' x='5' y='2' dy='1em' dx='20px' data-text='${id}'></text>
      <use className='pw-default__icon' xlinkHref='#twitter' x='5' y='5' width='20' height='20'></use>
    </g>
  </widget>

  <widget id="$container">
    <g className="pw-container" data-translate data-class='mover'>
      <rect className="pw-container__canvas" data-canvas rx="9" ry="9"></rect>
      <text className="pw-container__text" x="-10" y="-10" dy='1em' dx='20px' data-text='${id}'></text>
    </g>
  </widget>

  <widget id="container">
    <g className="pw-container" data-translate data-class='mover'>
      <rect className="pw-container__canvas" data-canvas rx="9" ry="9"></rect>
      <text className="pw-container__text" x="-10" y="-10" dy='1em' dx='20px' data-text='${id}'></text>
    </g>
  </widget>


  <widget id="$node-select">
    <g className='po-select' data-translate>
      <rect className='po-select__border' data-border='0' data-class='outline:1'/>
      <circle className='po-select__resize-handle' data-cxy-ratio='0,0,0,0' r='5' data-class='resizer:tl'/>
      <circle className='po-select__resize-handle' data-cxy-ratio='0,1,0,0' r='5' data-class='resizer:bl'/>
      <circle className='po-select__resize-handle' data-cxy-ratio='1,0,0,0' r='5' data-class='resizer:tr'/>
      <circle className='po-select__resize-handle' data-cxy-ratio='1,1,0,0' r='5' data-class='resizer:br'/>
      <use className='po-select__connector' href="#triangle-n" data-xy-ratio="0.5, 0.0, -10,-15"           data-class="connector:n"/>
      <use className='po-select__connector' href="#triangle-s" data-xy-ratio="0.5, 1.0, -10, +5"           data-class="connector:s"/>
      <use className='po-select__connector' href="#triangle-e" data-xy-ratio="1.0, 0.5,   5,-15"           data-class="connector:e"/>
      <use className='po-select__connector' href="#triangle-w" data-xy-ratio="0.0, 0.5, -15,-15"           data-class="connector:w"/>
    </g>
  </widget>


  <widget id="$shape-highlight">
    <g className='po-highlight' data-translate>
      <rect className="po-highlight__outline" data-border="5" rx="9" ry="9"></rect>
    </g>
  </widget>
  <widget id="$drag-highlight">
    <g className='po-drag-highlight' data-translate>
      <rect className="po-drag-highlight__outline" data-border="5" rx="9" ry="9"></rect>
    </g>
  </widget>


  <widget id="$shape-resize">
    <g className='po-resize' data-translate>
      <rect className="po-resize__outline" data-canvas></rect>
      <text className="po-resize__text" dy="1em" text-anchor="middle" data-xy-ratio='0.5 ,1 ,0 ,0'
            data-text-template='size'></text>
    </g>
  </widget>

  <widget id="$shape-drag-drop">
    <g className='po-drag-drop' data-translate>
      <rect className="po-drag-drop__outline" data-canvas></rect>
      <text className="po-drag-drop__text" dy="1em" text-anchor="start" data-xy-ratio='0, 0, -25, -25'
            data-text-template='point'></text>
    </g>
  </widget>

  <widget id="$lasso">
    <g className="po-lasso" data-translate>
      <rect className="po-lasso__canvas" data-canvas></rect>
      <text className="po-lasso__text" dy="1em" text-anchor="middle" data-xy-ratio='0.5, 1 ,0 ,0'
            data-text-template='size'></text>
    </g>
  </widget>


  <widget id="$connector">
    <g className='po-connector'>
      <path className="po-connector__stroke" data-connector-path/>
      <use className='po-connector__start' href="#connector_start" data-align="from"></use>
      <use className='po-connector__end' href="#connector_end" data-align="to"></use>
      <text className="po-connector__text" dy='1em' text-anchor='middle' data-connector-xy='50, 50, 50, 50'
            data-text-template='angle'></text>
    </g>
  </widget>

  <widget id="$edge-highlight">
    <g className='po-connector-highlight'>
      <path className="po-connector-highlight__stroke" data-connector-path/>
      <use className='po-connector-highlight__start' href="#connector_start" data-align="from"></use>
      <use className='po-connector-highlight__mid' href="#connector_mid" data-align="mid"></use>
      <use className='po-connector-highlight__end' href="#connector_end" data-align="to"></use>
      <text className="po-connector-highlight__text" dy='1em' text-anchor='middle' data-connector-xy='50, 50, 50, 50'
            data-text-template='angle'></text>
    </g>
  </widget>


  <widget id="$drag-cursor">
    <g className='po-drag-cursor' data-translate>
      <rect className="po-drag-cursor__outline" data-border="2" rx="9" ry="9"></rect>
    </g>
  </widget>

  <widget id="$insert-cursor-left">
    <g className='po-insert-cursor-left' data-translate>
      <g className="po-insert-cursor-left__animate">
        <rect className="po-insert-cursor-left__outline" x="0" y="0" width="5" data-height fill="red"></rect>
        <use className='po-insert-cursor-left__arrow' href="#triangle-w" data-xy-ratio="0,0.5,0,-5"></use>
      </g>
    </g>
  </widget>

  <widget id="$insert-cursor-right">
    <g className='po-insert-cursor-right' data-translate>
      <g className="po-insert-cursor-right__animate" transform="translate(0,0)">
        <rect className="po-insert-cursor-right__outline" data-xy-ratio="1,0,-5,0" width="5" data-height></rect>
        <use className='po-insert-cursor-right__arrow' href="#triangle-e" data-xy-ratio="1.0, 0.5,-10,0"></use>
      </g>
    </g>
  </widget>

</svg>;

console.log(b);
