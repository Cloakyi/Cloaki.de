/**
 * Grainient Background – Cloaki.de
 * Pure WebGL implementation of a grainy gradient shader background.
 * Based on react-bits/Grainient, adapted for vanilla HTML/CSS/JS.
 * Supports dark/light mode with smooth color transitions.
 * Include with: <script src="/grainient-bg.js" defer></script>
 */
(function () {
  'use strict';

  /* ───── color presets ───── */
  var DARK = {
    c1: [7 / 255, 10 / 255, 19 / 255],        // #070A13
    c2: [30 / 255, 38 / 255, 64 / 255],        // #1E2640
    c3: [147 / 255, 197 / 255, 253 / 255]       // #93C5FD
  };

  var LIGHT = {
    c1: [220 / 255, 233 / 255, 255 / 255],      // #DCE9FF
    c2: [155 / 255, 195 / 255, 250 / 255],      // #9BC3FA
    c3: [80 / 255, 130 / 255, 210 / 255]         // #5082D2
  };

  /* ───── shader params (matching your config) ───── */
  var PARAMS = {
    timeSpeed: 1.0,
    colorBalance: 0.0,
    warpStrength: 1.0,
    warpFrequency: 5.0,
    warpSpeed: 2.0,
    warpAmplitude: 50.0,
    blendAngle: 0.0,
    blendSoftness: 0.05,
    rotationAmount: 500.0,
    noiseScale: 2.0,
    grainAmount: 0.03,
    grainScale: 2.0,
    grainAnimated: 0.0,
    contrast: 1.5,
    gamma: 1.0,
    saturation: 1.55,
    centerX: 0.0,
    centerY: 0.0,
    zoom: 0.9
  };

  /* ───── GLSL shaders ───── */
  var VERT = [
    'attribute vec2 position;',
    'void main(){gl_Position=vec4(position,0.0,1.0);}'
  ].join('\n');

  var FRAG = [
    'precision highp float;',
    'uniform vec2 iResolution;',
    'uniform float iTime;',
    'uniform float uTimeSpeed;',
    'uniform float uColorBalance;',
    'uniform float uWarpStrength;',
    'uniform float uWarpFrequency;',
    'uniform float uWarpSpeed;',
    'uniform float uWarpAmplitude;',
    'uniform float uBlendAngle;',
    'uniform float uBlendSoftness;',
    'uniform float uRotationAmount;',
    'uniform float uNoiseScale;',
    'uniform float uGrainAmount;',
    'uniform float uGrainScale;',
    'uniform float uGrainAnimated;',
    'uniform float uContrast;',
    'uniform float uGamma;',
    'uniform float uSaturation;',
    'uniform vec2 uCenterOffset;',
    'uniform float uZoom;',
    'uniform vec3 uColor1;',
    'uniform vec3 uColor2;',
    'uniform vec3 uColor3;',
    '',
    '#define S(a,b,t) smoothstep(a,b,t)',
    'mat2 Rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}',
    'vec2 hash(vec2 p){p=vec2(dot(p,vec2(2127.1,81.17)),dot(p,vec2(1269.5,283.37)));return fract(sin(p)*43758.5453);}',
    'float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);float n=mix(mix(dot(-1.0+2.0*hash(i+vec2(0,0)),f-vec2(0,0)),dot(-1.0+2.0*hash(i+vec2(1,0)),f-vec2(1,0)),u.x),mix(dot(-1.0+2.0*hash(i+vec2(0,1)),f-vec2(0,1)),dot(-1.0+2.0*hash(i+vec2(1,1)),f-vec2(1,1)),u.x),u.y);return 0.5+0.5*n;}',
    '',
    'void main(){',
    '  float t=iTime*uTimeSpeed;',
    '  vec2 uv=gl_FragCoord.xy/iResolution.xy;',
    '  float ratio=iResolution.x/iResolution.y;',
    '  vec2 tuv=uv-0.5+uCenterOffset;',
    '  tuv/=max(uZoom,0.001);',
    '',
    '  float degree=noise(vec2(t*0.1,tuv.x*tuv.y)*uNoiseScale);',
    '  tuv.y*=1.0/ratio;',
    '  tuv*=Rot(radians((degree-0.5)*uRotationAmount+180.0));',
    '  tuv.y*=ratio;',
    '',
    '  float frequency=uWarpFrequency;',
    '  float ws=max(uWarpStrength,0.001);',
    '  float amplitude=uWarpAmplitude/ws;',
    '  float warpTime=t*uWarpSpeed;',
    '  tuv.x+=sin(tuv.y*frequency+warpTime)/amplitude;',
    '  tuv.y+=sin(tuv.x*(frequency*1.5)+warpTime)/(amplitude*0.5);',
    '',
    '  vec3 colLav=uColor1;',
    '  vec3 colOrg=uColor2;',
    '  vec3 colDark=uColor3;',
    '  float b=uColorBalance;',
    '  float s=max(uBlendSoftness,0.0);',
    '  mat2 blendRot=Rot(radians(uBlendAngle));',
    '  float blendX=(tuv*blendRot).x;',
    '  float edge0=-0.3-b-s;',
    '  float edge1=0.2-b+s;',
    '  float v0=0.5-b+s;',
    '  float v1=-0.3-b-s;',
    '  vec3 layer1=mix(colDark,colOrg,S(edge0,edge1,blendX));',
    '  vec3 layer2=mix(colOrg,colLav,S(edge0,edge1,blendX));',
    '  vec3 col=mix(layer1,layer2,S(v0,v1,tuv.y));',
    '',
    '  vec2 grainUv=uv*max(uGrainScale,0.001);',
    '  if(uGrainAnimated>0.5){grainUv+=vec2(iTime*0.05);}',
    '  float grain=fract(sin(dot(grainUv,vec2(12.9898,78.233)))*43758.5453);',
    '  col+=(grain-0.5)*uGrainAmount;',
    '',
    '  col=(col-0.5)*uContrast+0.5;',
    '  float luma=dot(col,vec3(0.2126,0.7152,0.0722));',
    '  col=mix(vec3(luma),col,uSaturation);',
    '  col=pow(max(col,vec3(0.0)),vec3(1.0/uGamma));',
    '  col=clamp(col,0.0,1.0);',
    '',
    '  gl_FragColor=vec4(col,1.0);',
    '}'
  ].join('\n');

  /* ───── state ───── */
  var canvas, gl, program;
  var uniforms = {};
  var startTime = 0;
  var animId = null;
  var currentC1, currentC2, currentC3;
  var targetC1, targetC2, targetC3;
  var DPR_SCALE = 0.75; // render at 75% resolution for quality/perf balance

  /* ───── WebGL helpers ───── */
  function compileShader(gl, type, src) {
    var sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.warn('Grainient shader error:', gl.getShaderInfoLog(sh));
      gl.deleteShader(sh);
      return null;
    }
    return sh;
  }

  function createProgram(gl, vs, fs) {
    var prg = gl.createProgram();
    gl.attachShader(prg, vs);
    gl.attachShader(prg, fs);
    gl.linkProgram(prg);
    if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
      console.warn('Grainient link error:', gl.getProgramInfoLog(prg));
      return null;
    }
    return prg;
  }

  /* ───── lerp colors ───── */
  function lerpArr(a, b, t) {
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  }

  /* ───── resize ───── */
  function resize() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    var dpr = Math.min(window.devicePixelRatio || 1, 2) * DPR_SCALE;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    if (gl) gl.viewport(0, 0, canvas.width, canvas.height);
  }

  /* ───── animation ───── */
  function render(now) {
    animId = requestAnimationFrame(render);

    if (!now) return;
    var elapsed = (now - startTime) / 1000;

    // smooth color transition
    var speed = 0.035;
    currentC1 = lerpArr(currentC1, targetC1, speed);
    currentC2 = lerpArr(currentC2, targetC2, speed);
    currentC3 = lerpArr(currentC3, targetC3, speed);

    gl.useProgram(program);

    gl.uniform2f(uniforms.iResolution, canvas.width, canvas.height);
    gl.uniform1f(uniforms.iTime, elapsed);
    gl.uniform1f(uniforms.uTimeSpeed, PARAMS.timeSpeed);
    gl.uniform1f(uniforms.uColorBalance, PARAMS.colorBalance);
    gl.uniform1f(uniforms.uWarpStrength, PARAMS.warpStrength);
    gl.uniform1f(uniforms.uWarpFrequency, PARAMS.warpFrequency);
    gl.uniform1f(uniforms.uWarpSpeed, PARAMS.warpSpeed);
    gl.uniform1f(uniforms.uWarpAmplitude, PARAMS.warpAmplitude);
    gl.uniform1f(uniforms.uBlendAngle, PARAMS.blendAngle);
    gl.uniform1f(uniforms.uBlendSoftness, PARAMS.blendSoftness);
    gl.uniform1f(uniforms.uRotationAmount, PARAMS.rotationAmount);
    gl.uniform1f(uniforms.uNoiseScale, PARAMS.noiseScale);
    gl.uniform1f(uniforms.uGrainAmount, PARAMS.grainAmount);
    gl.uniform1f(uniforms.uGrainScale, PARAMS.grainScale);
    gl.uniform1f(uniforms.uGrainAnimated, PARAMS.grainAnimated);
    gl.uniform1f(uniforms.uContrast, PARAMS.contrast);
    gl.uniform1f(uniforms.uGamma, PARAMS.gamma);
    gl.uniform1f(uniforms.uSaturation, PARAMS.saturation);
    gl.uniform2f(uniforms.uCenterOffset, PARAMS.centerX, PARAMS.centerY);
    gl.uniform1f(uniforms.uZoom, PARAMS.zoom);
    gl.uniform3fv(uniforms.uColor1, currentC1);
    gl.uniform3fv(uniforms.uColor2, currentC2);
    gl.uniform3fv(uniforms.uColor3, currentC3);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  /* ───── theme observer ───── */
  function isLightMode() {
    return document.body && document.body.classList.contains('light-mode');
  }

  function setTarget(light) {
    var colors = light ? LIGHT : DARK;
    targetC1 = colors.c1;
    targetC2 = colors.c2;
    targetC3 = colors.c3;
  }

  function watchTheme() {
    if (!document.body) return;
    var observer = new MutationObserver(function () {
      setTarget(isLightMode());
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  /* ───── pause when hidden ───── */
  function handleVisibility() {
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        if (animId) { cancelAnimationFrame(animId); animId = null; }
      } else {
        startTime = performance.now() - 0; // reset to avoid time jumps
        if (!animId) render();
      }
    });
  }

  /* ───── init ───── */
  function init() {
    // create canvas
    canvas = document.createElement('canvas');
    canvas.id = 'grainientBg';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;image-rendering:auto;';

    // try WebGL
    gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false });
    if (!gl) return; // fallback to CSS gradient

    // compile shaders
    var vs = compileShader(gl, gl.VERTEX_SHADER, VERT);
    var fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    program = createProgram(gl, vs, fs);
    if (!program) return;

    // fullscreen triangle (covers viewport with 1 triangle instead of 2)
    var posAttr = gl.getAttribLocation(program, 'position');
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    // cache uniform locations
    var uNames = [
      'iResolution', 'iTime', 'uTimeSpeed', 'uColorBalance',
      'uWarpStrength', 'uWarpFrequency', 'uWarpSpeed', 'uWarpAmplitude',
      'uBlendAngle', 'uBlendSoftness', 'uRotationAmount', 'uNoiseScale',
      'uGrainAmount', 'uGrainScale', 'uGrainAnimated',
      'uContrast', 'uGamma', 'uSaturation',
      'uCenterOffset', 'uZoom',
      'uColor1', 'uColor2', 'uColor3'
    ];
    uNames.forEach(function (n) { uniforms[n] = gl.getUniformLocation(program, n); });

    // set initial colors
    var light = isLightMode();
    var initial = light ? LIGHT : DARK;
    currentC1 = initial.c1.slice();
    currentC2 = initial.c2.slice();
    currentC3 = initial.c3.slice();
    setTarget(light);

    // insert canvas & override body background
    document.body.insertBefore(canvas, document.body.firstChild);
    var styleEl = document.createElement('style');
    styleEl.id = 'grainient-override';
    styleEl.textContent = 'body{background:transparent!important;}';
    document.head.appendChild(styleEl);

    // go
    resize();
    window.addEventListener('resize', resize);
    startTime = performance.now();
    render();
    watchTheme();
    handleVisibility();
  }

  /* ───── boot ───── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
