/*! For license information please see main.68196d93.js.LICENSE.txt */
  0% {
    transform: scale(0);
    opacity: 0.1;
  }

  100% {
    transform: scale(1);
    opacity: 0.3;
  }
`,Fc=ko`
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`,Mc=ko`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.92);
  }

  100% {
    transform: scale(1);
  }
`,Wc=ho("span",{name:"MuiTouchRipple",slot:"Root"})({overflow:"hidden",pointerEvents:"none",position:"absolute",zIndex:0,top:0,right:0,bottom:0,left:0,borderRadius:"inherit"}),qc=ho(Pc,{name:"MuiTouchRipple",slot:"Ripple"})`
  opacity: 0;
  position: absolute;

  &.${Lc.rippleVisible} {
    opacity: 0.3;
    transform: scale(1);
    animation-name: ${Bc};
    animation-duration: ${550}ms;
    animation-timing-function: ${e=>{let{theme:t}=e;return t.transitions.easing.easeInOut}};
  }

  &.${Lc.ripplePulsate} {
    animation-duration: ${e=>{let{theme:t}=e;return t.transitions.duration.shorter}}ms;
  }

  & .${Lc.child} {
    opacity: 1;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: currentColor;
  }

  & .${Lc.childLeaving} {
    opacity: 0;
    animation-name: ${Fc};
    animation-duration: ${550}ms;
    animation-timing-function: ${e=>{let{theme:t}=e;return t.transitions.easing.easeInOut}};
  }

  & .${Lc.childPulsate} {
    position: absolute;
    /* @noflip */
    left: 0px;
    top: 0;
    animation-name: ${Mc};
    animation-duration: 2500ms;
    animation-timing-function: ${e=>{let{theme:t}=e;return t.transitions.easing.easeInOut}};
    animation-iteration-count: infinite;
    animation-delay: 200ms;
  }
//# sourceMappingURL=main.68196d93.js.map