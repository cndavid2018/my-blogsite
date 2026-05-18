/* =========================
   SCROLL STORY ENGINE
========================= */

const scenes = document.querySelectorAll('.scene');
const progress = document.querySelector('.progress');

function updateScenes(){

  const scroll = window.scrollY;
  const height = window.innerHeight;

  scenes.forEach((scene, i)=>{

    const top = i * height;

    const diff = scroll - top;

    if(diff > -height/2 && diff < height/2){
      scene.classList.add('active');
    }else{
      scene.classList.remove('active');
    }

  });

  /* progress bar */
  const max = (scenes.length - 1) * height;
  const percent = (scroll / max) * 100;

  progress.style.width = percent + "%";

}

window.addEventListener('scroll', updateScenes);
updateScenes();

/* =========================
   WEBGL ATMOSPHERE
========================= */

const canvas = document.getElementById('bg');
const gl = canvas.getContext('webgl');

canvas.width = innerWidth;
canvas.height = innerHeight;

gl.viewport(0,0,canvas.width,canvas.height);

const v = `
attribute vec2 p;
void main(){
  gl_Position = vec4(p,0,1);
}
`;

const f = `
precision highp float;

uniform float t;
uniform vec2 r;

void main(){

  vec2 uv = gl_FragCoord.xy / r;

  float noise =
    sin(uv.x*3.0 + t)*0.5 +
    cos(uv.y*3.0 - t)*0.5;

  vec3 col = vec3(0.02,0.02,0.03);

  col += vec3(0.2,0.4,0.8) * noise * 0.2;
  col += vec3(0.8,0.2,0.6) * (1.0 - uv.y) * 0.15;

  gl_FragColor = vec4(col,1.0);
}
`;

function s(t,x){
  const sh = gl.createShader(t);
  gl.shaderSource(sh,x);
  gl.compileShader(sh);
  return sh;
}

const p = gl.createProgram();
gl.attachShader(p,s(gl.VERTEX_SHADER,v));
gl.attachShader(p,s(gl.FRAGMENT_SHADER,f));
gl.linkProgram(p);
gl.useProgram(p);

const b = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER,b);

gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([
-1,-1,1,-1,-1,1,1,1
]),gl.STATIC_DRAW);

const loc = gl.getAttribLocation(p,'p');
gl.enableVertexAttribArray(loc);
gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);

const tL = gl.getUniformLocation(p,'t');
const rL = gl.getUniformLocation(p,'r');

function loop(t){
  gl.uniform1f(tL,t*0.001);
  gl.uniform2f(rL,canvas.width,canvas.height);
  gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);