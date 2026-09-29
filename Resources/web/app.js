var im=32,Ls=Math.PI/180,sm=(r,e)=>({x:r.x+e.x,y:r.y+e.y,z:r.z+e.z}),wd=(r,e)=>({x:r.x-e.x,y:r.y-e.y,z:r.z-e.z}),Td=(r,e)=>({x:r.x*e,y:r.y*e,z:r.z*e});function Ad(r){let e=Math.hypot(r.x,r.y,r.z);return e>0?Td(r,1/e):{x:0,y:0,z:1}}function rm(r){let e=Ad(r.forward),t=Math.atan2(e.x,e.z)+r.yaw*Ls,n=Math.asin(Math.max(-1,Math.min(1,e.y)))+r.pitch*Ls;return{x:Math.sin(t)*Math.cos(n),y:Math.sin(n),z:Math.cos(t)*Math.cos(n)}}function Ed(r){return sm(r.position,rm(r))}var Rd=19.5/9;function Cd(r,e,t){let n=Math.tan(r.fieldOfView*Ls/2)*Rd*(t/Math.max(e,1));return Math.min(im,Math.max(r.fieldOfView,2*Math.atan(n)/Ls))}function Id(r,e){let t=Ad(wd(r.originalOffset,r.defaultPositionOffset));return{position:wd(r.defaultPositionOffset,Td(t,r.orbitRatio)),forward:t,yaw:0,pitch:0,fov:e}}function Pd(r,e,t,n,i){let s=Math.max(0,(r.fov-n.fieldOfView)/2),o=(u,d)=>Math.atan(Math.tan(u*Ls/2)*d)/Ls,l=Math.max(0,o(r.fov,i)-o(n.fieldOfView,Rd)),a=(u,d)=>Math.max(0,u-d),c=e>=0?e*a(n.maxRightShift,l):e*a(n.maxLeftShift,l),h=t>=0?t*a(n.maxUpShift,s):t*a(n.maxDownShift,s);return{...r,yaw:c,pitch:h}}var kc=r=>({x:r.x,y:r.y,z:-r.z});var mf=0,Th=1,gf=2;var za=1,xf=2,or=3,On=0,ln=1,en=2,ri=0,En=1,Ha=2,Ah=3,Eh=4,Ga=5;var Yi=100,_f=101,yf=102,vf=103,bf=104,Mf=200,lr=201,Sf=202,Wa=203,zo=204,ds=205,wf=206,Tf=207,gl=208,Af=209,Ef=210,Rf=211,Cf=212,If=213,Pf=214,Ho=0,Go=1,Wo=2,fs=3,Xo=4,Yo=5,qo=6,$o=7,Rh=0,Lf=1,Nf=2,Vn=0,Ch=1,Ih=2,Ph=3,Lh=4,Nh=5,Fh=6,Dh=7,dh="attached",Ff="detached",Uh=300,Ji=301,bs=302,xl=303,_l=304,Xa=306,Jn=1e3,cn=1001,qi=1002,bt=1003,yl=1004,Oh=1004,Ms=1005,Bh=1005,Mt=1006,cr=1007,kh=1007,zn=1008,Vh=1008,pn=1009,zh=1010,Hh=1011,hr=1012,vl=1013,Hn=1014,bn=1015,ai=1016,bl=1017,Ml=1018,ur=1020,Gh=35902,Wh=35899,Xh=1021,Yh=1022,Mn=1023,jn=1026,ji=1027,Sl=1028,wl=1029,Qi=1030,Tl=1031;var Al=1033,Ya=33776,qa=33777,$a=33778,Ka=33779,El=35840,Rl=35841,Cl=35842,Il=35843,Pl=36196,Ll=37492,Nl=37496,Fl=37488,Dl=37489,Za=37490,Ul=37491,Ol=37808,Bl=37809,kl=37810,Vl=37811,zl=37812,Hl=37813,Gl=37814,Wl=37815,Xl=37816,Yl=37817,ql=37818,$l=37819,Kl=37820,Zl=37821,Jl=36492,jl=36494,Ql=36495,ec=36283,tc=36284,Ja=36285,nc=36286;var ps=2300,ms=2301,Vo=2302,fh=2303,ph=2400,mh=2401,gh=2402,Df=2500;var qh=0,ja=1,dr=2,Uf=3200;var ic=0,Of=1,Ii="",Tt="srgb",an="srgb-linear",ga="linear",at="srgb";var us=7680;var xh=519,Bf=512,kf=513,Vf=514,sc=515,zf=516,Hf=517,rc=518,Gf=519,Ko=35044;var $h="300 es",Dn=2e3,$s=2001;function am(r){for(let e=r.length-1;e>=0;--e)if(r[e]>=65535)return!0;return!1}function om(r){return ArrayBuffer.isView(r)&&!(r instanceof DataView)}function Ks(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function Wf(){let r=Ks("canvas");return r.style.display="block",r}var Ld={},Zs=null;function xa(...r){let e="THREE."+r.shift();Zs?Zs("log",e,...r):console.log(e,...r)}function Xf(r){let e=r[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=r[1];t&&t.isStackTrace?r[0]+=" "+t.getLocation():r[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return r}function Ie(...r){r=Xf(r);let e="THREE."+r.shift();if(Zs)Zs("warn",e,...r);else{let t=r[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...r)}}function Oe(...r){r=Xf(r);let e="THREE."+r.shift();if(Zs)Zs("error",e,...r);else{let t=r[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...r)}}function Zo(...r){let e=r.join(" ");e in Ld||(Ld[e]=!0,Ie(...r))}function Yf(r,e,t){return new Promise(function(n,i){function s(){switch(r.clientWaitSync(e,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:i();break;case r.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:n()}}setTimeout(s,t)})}var qf={[Ho]:Go,[Wo]:qo,[Xo]:$o,[fs]:Yo,[Go]:Ho,[qo]:Wo,[$o]:Xo,[Yo]:fs},Qn=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let i=n[e];if(i!==void 0){let s=i.indexOf(t);s!==-1&&i.splice(s,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let i=n.slice(0);for(let s=0,o=i.length;s<o;s++)i[s].call(this,e);e.target=null}}},Jt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Nd=1234567,pa=Math.PI/180,gs=180/Math.PI;function Un(){let r=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Jt[r&255]+Jt[r>>8&255]+Jt[r>>16&255]+Jt[r>>24&255]+"-"+Jt[e&255]+Jt[e>>8&255]+"-"+Jt[e>>16&15|64]+Jt[e>>24&255]+"-"+Jt[t&63|128]+Jt[t>>8&255]+"-"+Jt[t>>16&255]+Jt[t>>24&255]+Jt[n&255]+Jt[n>>8&255]+Jt[n>>16&255]+Jt[n>>24&255]).toLowerCase()}function Qe(r,e,t){return Math.max(e,Math.min(t,r))}function Kh(r,e){return(r%e+e)%e}function lm(r,e,t,n,i){return n+(r-e)*(i-n)/(t-e)}function cm(r,e,t){return r!==e?(t-r)/(e-r):0}function ma(r,e,t){return(1-t)*r+t*e}function hm(r,e,t,n){return ma(r,e,1-Math.exp(-t*n))}function um(r,e=1){return e-Math.abs(Kh(r,e*2)-e)}function dm(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*(3-2*r))}function fm(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*r*(r*(r*6-15)+10))}function pm(r,e){return r+Math.floor(Math.random()*(e-r+1))}function mm(r,e){return r+Math.random()*(e-r)}function gm(r){return r*(.5-Math.random())}function xm(r){r!==void 0&&(Nd=r);let e=Nd+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function _m(r){return r*pa}function ym(r){return r*gs}function vm(r){return(r&r-1)===0&&r!==0}function bm(r){return Math.pow(2,Math.ceil(Math.log(r)/Math.LN2))}function Mm(r){return Math.pow(2,Math.floor(Math.log(r)/Math.LN2))}function Sm(r,e,t,n,i){let s=Math.cos,o=Math.sin,l=s(t/2),a=o(t/2),c=s((e+n)/2),h=o((e+n)/2),u=s((e-n)/2),d=o((e-n)/2),f=s((n-e)/2),p=o((n-e)/2);switch(i){case"XYX":r.set(l*h,a*u,a*d,l*c);break;case"YZY":r.set(a*d,l*h,a*u,l*c);break;case"ZXZ":r.set(a*u,a*d,l*h,l*c);break;case"XZX":r.set(l*h,a*p,a*f,l*c);break;case"YXY":r.set(a*f,l*h,a*p,l*c);break;case"ZYZ":r.set(a*p,a*f,l*h,l*c);break;default:Ie("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function Fn(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function ht(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("Invalid component type.")}}var Zh={DEG2RAD:pa,RAD2DEG:gs,generateUUID:Un,clamp:Qe,euclideanModulo:Kh,mapLinear:lm,inverseLerp:cm,lerp:ma,damp:hm,pingpong:um,smoothstep:dm,smootherstep:fm,randInt:pm,randFloat:mm,randFloatSpread:gm,seededRandom:xm,degToRad:_m,radToDeg:ym,isPowerOfTwo:vm,ceilPowerOfTwo:bm,floorPowerOfTwo:Mm,setQuaternionFromProperEuler:Sm,normalize:ht,denormalize:Fn},tu=class tu{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Qe(this.x,e.x,t.x),this.y=Qe(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Qe(this.x,e,t),this.y=Qe(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Qe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),i=Math.sin(t),s=this.x-e.x,o=this.y-e.y;return this.x=s*n-o*i+e.x,this.y=s*i+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};tu.prototype.isVector2=!0;var et=tu,Qt=class{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,s,o,l){let a=n[i+0],c=n[i+1],h=n[i+2],u=n[i+3],d=s[o+0],f=s[o+1],p=s[o+2],x=s[o+3];if(u!==x||a!==d||c!==f||h!==p){let m=a*d+c*f+h*p+u*x;m<0&&(d=-d,f=-f,p=-p,x=-x,m=-m);let g=1-l;if(m<.9995){let y=Math.acos(m),_=Math.sin(y);g=Math.sin(g*y)/_,l=Math.sin(l*y)/_,a=a*g+d*l,c=c*g+f*l,h=h*g+p*l,u=u*g+x*l}else{a=a*g+d*l,c=c*g+f*l,h=h*g+p*l,u=u*g+x*l;let y=1/Math.sqrt(a*a+c*c+h*h+u*u);a*=y,c*=y,h*=y,u*=y}}e[t]=a,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,i,s,o){let l=n[i],a=n[i+1],c=n[i+2],h=n[i+3],u=s[o],d=s[o+1],f=s[o+2],p=s[o+3];return e[t]=l*p+h*u+a*f-c*d,e[t+1]=a*p+h*d+c*u-l*f,e[t+2]=c*p+h*f+l*d-a*u,e[t+3]=h*p-l*u-a*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,i=e._y,s=e._z,o=e._order,l=Math.cos,a=Math.sin,c=l(n/2),h=l(i/2),u=l(s/2),d=a(n/2),f=a(i/2),p=a(s/2);switch(o){case"XYZ":this._x=d*h*u+c*f*p,this._y=c*f*u-d*h*p,this._z=c*h*p+d*f*u,this._w=c*h*u-d*f*p;break;case"YXZ":this._x=d*h*u+c*f*p,this._y=c*f*u-d*h*p,this._z=c*h*p-d*f*u,this._w=c*h*u+d*f*p;break;case"ZXY":this._x=d*h*u-c*f*p,this._y=c*f*u+d*h*p,this._z=c*h*p+d*f*u,this._w=c*h*u-d*f*p;break;case"ZYX":this._x=d*h*u-c*f*p,this._y=c*f*u+d*h*p,this._z=c*h*p-d*f*u,this._w=c*h*u+d*f*p;break;case"YZX":this._x=d*h*u+c*f*p,this._y=c*f*u+d*h*p,this._z=c*h*p-d*f*u,this._w=c*h*u-d*f*p;break;case"XZY":this._x=d*h*u-c*f*p,this._y=c*f*u-d*h*p,this._z=c*h*p+d*f*u,this._w=c*h*u+d*f*p;break;default:Ie("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],i=t[4],s=t[8],o=t[1],l=t[5],a=t[9],c=t[2],h=t[6],u=t[10],d=n+l+u;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-a)*f,this._y=(s-c)*f,this._z=(o-i)*f}else if(n>l&&n>u){let f=2*Math.sqrt(1+n-l-u);this._w=(h-a)/f,this._x=.25*f,this._y=(i+o)/f,this._z=(s+c)/f}else if(l>u){let f=2*Math.sqrt(1+l-n-u);this._w=(s-c)/f,this._x=(i+o)/f,this._y=.25*f,this._z=(a+h)/f}else{let f=2*Math.sqrt(1+u-n-l);this._w=(o-i)/f,this._x=(s+c)/f,this._y=(a+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Qe(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,i=e._y,s=e._z,o=e._w,l=t._x,a=t._y,c=t._z,h=t._w;return this._x=n*h+o*l+i*c-s*a,this._y=i*h+o*a+s*l-n*c,this._z=s*h+o*c+n*a-i*l,this._w=o*h-n*l-i*a-s*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,i=e._y,s=e._z,o=e._w,l=this.dot(e);l<0&&(n=-n,i=-i,s=-s,o=-o,l=-l);let a=1-t;if(l<.9995){let c=Math.acos(l),h=Math.sin(c);a=Math.sin(a*c)/h,t=Math.sin(t*c)/h,this._x=this._x*a+n*t,this._y=this._y*a+i*t,this._z=this._z*a+s*t,this._w=this._w*a+o*t,this._onChangeCallback()}else this._x=this._x*a+n*t,this._y=this._y*a+i*t,this._z=this._z*a+s*t,this._w=this._w*a+o*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},nu=class nu{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Fd.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Fd.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*i,this.y=s[1]*t+s[4]*n+s[7]*i,this.z=s[2]*t+s[5]*n+s[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,s=e.elements,o=1/(s[3]*t+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*i+s[12])*o,this.y=(s[1]*t+s[5]*n+s[9]*i+s[13])*o,this.z=(s[2]*t+s[6]*n+s[10]*i+s[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,i=this.z,s=e.x,o=e.y,l=e.z,a=e.w,c=2*(o*i-l*n),h=2*(l*t-s*i),u=2*(s*n-o*t);return this.x=t+a*c+o*u-l*h,this.y=n+a*h+l*c-s*u,this.z=i+a*u+s*h-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*i,this.y=s[1]*t+s[5]*n+s[9]*i,this.z=s[2]*t+s[6]*n+s[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Qe(this.x,e.x,t.x),this.y=Qe(this.y,e.y,t.y),this.z=Qe(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Qe(this.x,e,t),this.y=Qe(this.y,e,t),this.z=Qe(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,i=e.y,s=e.z,o=t.x,l=t.y,a=t.z;return this.x=i*a-s*l,this.y=s*o-n*a,this.z=n*l-i*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Vc.copy(this).projectOnVector(e),this.sub(Vc)}reflect(e){return this.sub(Vc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Qe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};nu.prototype.isVector3=!0;var z=nu,Vc=new z,Fd=new Qt,iu=class iu{constructor(e,t,n,i,s,o,l,a,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,o,l,a,c)}set(e,t,n,i,s,o,l,a,c){let h=this.elements;return h[0]=e,h[1]=i,h[2]=l,h[3]=t,h[4]=s,h[5]=a,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,s=this.elements,o=n[0],l=n[3],a=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],p=n[8],x=i[0],m=i[3],g=i[6],y=i[1],_=i[4],v=i[7],S=i[2],b=i[5],w=i[8];return s[0]=o*x+l*y+a*S,s[3]=o*m+l*_+a*b,s[6]=o*g+l*v+a*w,s[1]=c*x+h*y+u*S,s[4]=c*m+h*_+u*b,s[7]=c*g+h*v+u*w,s[2]=d*x+f*y+p*S,s[5]=d*m+f*_+p*b,s[8]=d*g+f*v+p*w,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],o=e[4],l=e[5],a=e[6],c=e[7],h=e[8];return t*o*h-t*l*c-n*s*h+n*l*a+i*s*c-i*o*a}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],o=e[4],l=e[5],a=e[6],c=e[7],h=e[8],u=h*o-l*c,d=l*a-h*s,f=c*s-o*a,p=t*u+n*d+i*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/p;return e[0]=u*x,e[1]=(i*c-h*n)*x,e[2]=(l*n-i*o)*x,e[3]=d*x,e[4]=(h*t-i*a)*x,e[5]=(i*s-l*t)*x,e[6]=f*x,e[7]=(n*a-c*t)*x,e[8]=(o*t-n*s)*x,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,s,o,l){let a=Math.cos(s),c=Math.sin(s);return this.set(n*a,n*c,-n*(a*o+c*l)+o+e,-i*c,i*a,-i*(-c*o+a*l)+l+t,0,0,1),this}scale(e,t){return this.premultiply(zc.makeScale(e,t)),this}rotate(e){return this.premultiply(zc.makeRotation(-e)),this}translate(e,t){return this.premultiply(zc.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};iu.prototype.isMatrix3=!0;var ze=iu,zc=new ze,Dd=new ze().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ud=new ze().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function wm(){let r={enabled:!0,workingColorSpace:an,spaces:{},convert:function(i,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===at&&(i.r=Ti(i.r),i.g=Ti(i.g),i.b=Ti(i.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(i.applyMatrix3(this.spaces[s].toXYZ),i.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===at&&(i.r=qs(i.r),i.g=qs(i.g),i.b=qs(i.b))),i},workingToColorSpace:function(i,s){return this.convert(i,this.workingColorSpace,s)},colorSpaceToWorking:function(i,s){return this.convert(i,s,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Ii?ga:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,s=this.workingColorSpace){return i.fromArray(this.spaces[s].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,s,o){return i.copy(this.spaces[s].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,s){return Zo("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),r.workingToColorSpace(i,s)},toWorkingColorSpace:function(i,s){return Zo("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),r.colorSpaceToWorking(i,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return r.define({[an]:{primaries:e,whitePoint:n,transfer:ga,toXYZ:Dd,fromXYZ:Ud,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Tt},outputColorSpaceConfig:{drawingBufferColorSpace:Tt}},[Tt]:{primaries:e,whitePoint:n,transfer:at,toXYZ:Dd,fromXYZ:Ud,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Tt}}}),r}var Je=wm();function Ti(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function qs(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}var Ns,Jo=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Ns===void 0&&(Ns=Ks("canvas")),Ns.width=e.width,Ns.height=e.height;let i=Ns.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=Ns}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Ks("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let i=n.getImageData(0,0,e.width,e.height),s=i.data;for(let o=0;o<s.length;o++)s[o]=Ti(s[o]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Ti(t[n]/255)*255):t[n]=Ti(t[n]);return{data:t,width:e.width,height:e.height}}else return Ie("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Tm=0,Js=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Tm++}),this.uuid=Un(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let o=0,l=i.length;o<l;o++)i[o].isDataTexture?s.push(Hc(i[o].image)):s.push(Hc(i[o]))}else s=Hc(i);n.url=s}return t||(e.images[this.uuid]=n),n}};function Hc(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?Jo.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(Ie("Texture: Unable to serialize Texture."),{})}var Am=0,Gc=new z,Dt=class r extends Qn{constructor(e=r.DEFAULT_IMAGE,t=r.DEFAULT_MAPPING,n=cn,i=cn,s=Mt,o=zn,l=Mn,a=pn,c=r.DEFAULT_ANISOTROPY,h=Ii){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Am++}),this.uuid=Un(),this.name="",this.source=new Js(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=l,this.internalFormat=null,this.type=a,this.offset=new et(0,0),this.repeat=new et(1,1),this.center=new et(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ze,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Gc).x}get height(){return this.source.getSize(Gc).y}get depth(){return this.source.getSize(Gc).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){Ie(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let i=this[t];if(i===void 0){Ie(`Texture.setValues(): property '${t}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Uh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Jn:e.x=e.x-Math.floor(e.x);break;case cn:e.x=e.x<0?0:1;break;case qi:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Jn:e.y=e.y-Math.floor(e.y);break;case cn:e.y=e.y<0?0:1;break;case qi:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Dt.DEFAULT_IMAGE=null;Dt.DEFAULT_MAPPING=Uh;Dt.DEFAULT_ANISOTROPY=1;var su=class su{constructor(e=0,t=0,n=0,i=1){this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,s=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*i+o[12]*s,this.y=o[1]*t+o[5]*n+o[9]*i+o[13]*s,this.z=o[2]*t+o[6]*n+o[10]*i+o[14]*s,this.w=o[3]*t+o[7]*n+o[11]*i+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,s,a=e.elements,c=a[0],h=a[4],u=a[8],d=a[1],f=a[5],p=a[9],x=a[2],m=a[6],g=a[10];if(Math.abs(h-d)<.01&&Math.abs(u-x)<.01&&Math.abs(p-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+x)<.1&&Math.abs(p+m)<.1&&Math.abs(c+f+g-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let _=(c+1)/2,v=(f+1)/2,S=(g+1)/2,b=(h+d)/4,w=(u+x)/4,M=(p+m)/4;return _>v&&_>S?_<.01?(n=0,i=.707106781,s=.707106781):(n=Math.sqrt(_),i=b/n,s=w/n):v>S?v<.01?(n=.707106781,i=0,s=.707106781):(i=Math.sqrt(v),n=b/i,s=M/i):S<.01?(n=.707106781,i=.707106781,s=0):(s=Math.sqrt(S),n=w/s,i=M/s),this.set(n,i,s,t),this}let y=Math.sqrt((m-p)*(m-p)+(u-x)*(u-x)+(d-h)*(d-h));return Math.abs(y)<.001&&(y=1),this.x=(m-p)/y,this.y=(u-x)/y,this.z=(d-h)/y,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Qe(this.x,e.x,t.x),this.y=Qe(this.y,e.y,t.y),this.z=Qe(this.z,e.z,t.z),this.w=Qe(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Qe(this.x,e,t),this.y=Qe(this.y,e,t),this.z=Qe(this.z,e,t),this.w=Qe(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};su.prototype.isVector4=!0;var pt=su,jo=class extends Qn{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Mt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new pt(0,0,e,t),this.scissorTest=!1,this.viewport=new pt(0,0,e,t),this.textures=[];let i={width:e,height:t,depth:n.depth},s=new Dt(i),o=n.count;for(let l=0;l<o;l++)this.textures[l]=s.clone(),this.textures[l].isRenderTargetTexture=!0,this.textures[l].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){let t={minFilter:Mt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,s=this.textures.length;i<s;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0&&(this.textures[i].isArrayTexture=this.textures[i].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let i=Object.assign({},e.textures[t].image);this.textures[t].source=new Js(i)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this}dispose(){this.dispatchEvent({type:"dispose"})}},yn=class extends jo{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},_a=class extends Dt{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=bt,this.minFilter=bt,this.wrapR=cn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Qo=class extends Dt{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=bt,this.minFilter=bt,this.wrapR=cn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var ml=class ml{constructor(e,t,n,i,s,o,l,a,c,h,u,d,f,p,x,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,o,l,a,c,h,u,d,f,p,x,m)}set(e,t,n,i,s,o,l,a,c,h,u,d,f,p,x,m){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=i,g[1]=s,g[5]=o,g[9]=l,g[13]=a,g[2]=c,g[6]=h,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=x,g[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ml().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinant()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();let t=this.elements,n=e.elements,i=1/Fs.setFromMatrixColumn(e,0).length(),s=1/Fs.setFromMatrixColumn(e,1).length(),o=1/Fs.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,i=e.y,s=e.z,o=Math.cos(n),l=Math.sin(n),a=Math.cos(i),c=Math.sin(i),h=Math.cos(s),u=Math.sin(s);if(e.order==="XYZ"){let d=o*h,f=o*u,p=l*h,x=l*u;t[0]=a*h,t[4]=-a*u,t[8]=c,t[1]=f+p*c,t[5]=d-x*c,t[9]=-l*a,t[2]=x-d*c,t[6]=p+f*c,t[10]=o*a}else if(e.order==="YXZ"){let d=a*h,f=a*u,p=c*h,x=c*u;t[0]=d+x*l,t[4]=p*l-f,t[8]=o*c,t[1]=o*u,t[5]=o*h,t[9]=-l,t[2]=f*l-p,t[6]=x+d*l,t[10]=o*a}else if(e.order==="ZXY"){let d=a*h,f=a*u,p=c*h,x=c*u;t[0]=d-x*l,t[4]=-o*u,t[8]=p+f*l,t[1]=f+p*l,t[5]=o*h,t[9]=x-d*l,t[2]=-o*c,t[6]=l,t[10]=o*a}else if(e.order==="ZYX"){let d=o*h,f=o*u,p=l*h,x=l*u;t[0]=a*h,t[4]=p*c-f,t[8]=d*c+x,t[1]=a*u,t[5]=x*c+d,t[9]=f*c-p,t[2]=-c,t[6]=l*a,t[10]=o*a}else if(e.order==="YZX"){let d=o*a,f=o*c,p=l*a,x=l*c;t[0]=a*h,t[4]=x-d*u,t[8]=p*u+f,t[1]=u,t[5]=o*h,t[9]=-l*h,t[2]=-c*h,t[6]=f*u+p,t[10]=d-x*u}else if(e.order==="XZY"){let d=o*a,f=o*c,p=l*a,x=l*c;t[0]=a*h,t[4]=-u,t[8]=c*h,t[1]=d*u+x,t[5]=o*h,t[9]=f*u-p,t[2]=p*u-f,t[6]=l*h,t[10]=x*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Em,e,Rm)}lookAt(e,t,n){let i=this.elements;return xn.subVectors(e,t),xn.lengthSq()===0&&(xn.z=1),xn.normalize(),ki.crossVectors(n,xn),ki.lengthSq()===0&&(Math.abs(n.z)===1?xn.x+=1e-4:xn.z+=1e-4,xn.normalize(),ki.crossVectors(n,xn)),ki.normalize(),po.crossVectors(xn,ki),i[0]=ki.x,i[4]=po.x,i[8]=xn.x,i[1]=ki.y,i[5]=po.y,i[9]=xn.y,i[2]=ki.z,i[6]=po.z,i[10]=xn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,s=this.elements,o=n[0],l=n[4],a=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],p=n[2],x=n[6],m=n[10],g=n[14],y=n[3],_=n[7],v=n[11],S=n[15],b=i[0],w=i[4],M=i[8],A=i[12],C=i[1],E=i[5],N=i[9],F=i[13],L=i[2],I=i[6],D=i[10],U=i[14],Y=i[3],X=i[7],ee=i[11],ae=i[15];return s[0]=o*b+l*C+a*L+c*Y,s[4]=o*w+l*E+a*I+c*X,s[8]=o*M+l*N+a*D+c*ee,s[12]=o*A+l*F+a*U+c*ae,s[1]=h*b+u*C+d*L+f*Y,s[5]=h*w+u*E+d*I+f*X,s[9]=h*M+u*N+d*D+f*ee,s[13]=h*A+u*F+d*U+f*ae,s[2]=p*b+x*C+m*L+g*Y,s[6]=p*w+x*E+m*I+g*X,s[10]=p*M+x*N+m*D+g*ee,s[14]=p*A+x*F+m*U+g*ae,s[3]=y*b+_*C+v*L+S*Y,s[7]=y*w+_*E+v*I+S*X,s[11]=y*M+_*N+v*D+S*ee,s[15]=y*A+_*F+v*U+S*ae,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],i=e[8],s=e[12],o=e[1],l=e[5],a=e[9],c=e[13],h=e[2],u=e[6],d=e[10],f=e[14],p=e[3],x=e[7],m=e[11],g=e[15],y=a*f-c*d,_=l*f-c*u,v=l*d-a*u,S=o*f-c*h,b=o*d-a*h,w=o*u-l*h;return t*(x*y-m*_+g*v)-n*(p*y-m*S+g*b)+i*(p*_-x*S+g*w)-s*(p*v-x*b+m*w)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],o=e[4],l=e[5],a=e[6],c=e[7],h=e[8],u=e[9],d=e[10],f=e[11],p=e[12],x=e[13],m=e[14],g=e[15],y=t*l-n*o,_=t*a-i*o,v=t*c-s*o,S=n*a-i*l,b=n*c-s*l,w=i*c-s*a,M=h*x-u*p,A=h*m-d*p,C=h*g-f*p,E=u*m-d*x,N=u*g-f*x,F=d*g-f*m,L=y*F-_*N+v*E+S*C-b*A+w*M;if(L===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let I=1/L;return e[0]=(l*F-a*N+c*E)*I,e[1]=(i*N-n*F-s*E)*I,e[2]=(x*w-m*b+g*S)*I,e[3]=(d*b-u*w-f*S)*I,e[4]=(a*C-o*F-c*A)*I,e[5]=(t*F-i*C+s*A)*I,e[6]=(m*v-p*w-g*_)*I,e[7]=(h*w-d*v+f*_)*I,e[8]=(o*N-l*C+c*M)*I,e[9]=(n*C-t*N-s*M)*I,e[10]=(p*b-x*v+g*y)*I,e[11]=(u*v-h*b-f*y)*I,e[12]=(l*A-o*E-a*M)*I,e[13]=(t*E-n*A+i*M)*I,e[14]=(x*_-p*S-m*y)*I,e[15]=(h*S-u*_+d*y)*I,this}scale(e){let t=this.elements,n=e.x,i=e.y,s=e.z;return t[0]*=n,t[4]*=i,t[8]*=s,t[1]*=n,t[5]*=i,t[9]*=s,t[2]*=n,t[6]*=i,t[10]*=s,t[3]*=n,t[7]*=i,t[11]*=s,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),i=Math.sin(t),s=1-n,o=e.x,l=e.y,a=e.z,c=s*o,h=s*l;return this.set(c*o+n,c*l-i*a,c*a+i*l,0,c*l+i*a,h*l+n,h*a-i*o,0,c*a-i*l,h*a+i*o,s*a*a+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,s,o){return this.set(1,n,s,0,e,1,o,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){let i=this.elements,s=t._x,o=t._y,l=t._z,a=t._w,c=s+s,h=o+o,u=l+l,d=s*c,f=s*h,p=s*u,x=o*h,m=o*u,g=l*u,y=a*c,_=a*h,v=a*u,S=n.x,b=n.y,w=n.z;return i[0]=(1-(x+g))*S,i[1]=(f+v)*S,i[2]=(p-_)*S,i[3]=0,i[4]=(f-v)*b,i[5]=(1-(d+g))*b,i[6]=(m+y)*b,i[7]=0,i[8]=(p+_)*w,i[9]=(m-y)*w,i[10]=(1-(d+x))*w,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){let i=this.elements;e.x=i[12],e.y=i[13],e.z=i[14];let s=this.determinant();if(s===0)return n.set(1,1,1),t.identity(),this;let o=Fs.set(i[0],i[1],i[2]).length(),l=Fs.set(i[4],i[5],i[6]).length(),a=Fs.set(i[8],i[9],i[10]).length();s<0&&(o=-o),Pn.copy(this);let c=1/o,h=1/l,u=1/a;return Pn.elements[0]*=c,Pn.elements[1]*=c,Pn.elements[2]*=c,Pn.elements[4]*=h,Pn.elements[5]*=h,Pn.elements[6]*=h,Pn.elements[8]*=u,Pn.elements[9]*=u,Pn.elements[10]*=u,t.setFromRotationMatrix(Pn),n.x=o,n.y=l,n.z=a,this}makePerspective(e,t,n,i,s,o,l=Dn,a=!1){let c=this.elements,h=2*s/(t-e),u=2*s/(n-i),d=(t+e)/(t-e),f=(n+i)/(n-i),p,x;if(a)p=s/(o-s),x=o*s/(o-s);else if(l===Dn)p=-(o+s)/(o-s),x=-2*o*s/(o-s);else if(l===$s)p=-o/(o-s),x=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+l);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,i,s,o,l=Dn,a=!1){let c=this.elements,h=2/(t-e),u=2/(n-i),d=-(t+e)/(t-e),f=-(n+i)/(n-i),p,x;if(a)p=1/(o-s),x=o/(o-s);else if(l===Dn)p=-2/(o-s),x=-(o+s)/(o-s);else if(l===$s)p=-1/(o-s),x=-s/(o-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+l);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};ml.prototype.isMatrix4=!0;var ke=ml,Fs=new z,Pn=new ke,Em=new z(0,0,0),Rm=new z(1,1,1),ki=new z,po=new z,xn=new z,Od=new ke,Bd=new Qt,Bn=class r{constructor(e=0,t=0,n=0,i=r.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let i=e.elements,s=i[0],o=i[4],l=i[8],a=i[1],c=i[5],h=i[9],u=i[2],d=i[6],f=i[10];switch(t){case"XYZ":this._y=Math.asin(Qe(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Qe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(l,f),this._z=Math.atan2(a,c)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(Qe(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(a,s));break;case"ZYX":this._y=Math.asin(-Qe(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(a,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Qe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(l,f));break;case"XZY":this._z=Math.asin(-Qe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(l,s)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Ie("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Od.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Od,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Bd.setFromEuler(this),this.setFromQuaternion(Bd,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Bn.DEFAULT_ORDER="XYZ";var ya=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Cm=0,kd=new z,Ds=new Qt,yi=new ke,mo=new z,aa=new z,Im=new z,Pm=new Qt,Vd=new z(1,0,0),zd=new z(0,1,0),Hd=new z(0,0,1),Gd={type:"added"},Lm={type:"removed"},Us={type:"childadded",child:null},Wc={type:"childremoved",child:null},wt=class r extends Qn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Cm++}),this.uuid=Un(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=r.DEFAULT_UP.clone();let e=new z,t=new Bn,n=new Qt,i=new z(1,1,1);function s(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new ke},normalMatrix:{value:new ze}}),this.matrix=new ke,this.matrixWorld=new ke,this.matrixAutoUpdate=r.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=r.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ya,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ds.setFromAxisAngle(e,t),this.quaternion.multiply(Ds),this}rotateOnWorldAxis(e,t){return Ds.setFromAxisAngle(e,t),this.quaternion.premultiply(Ds),this}rotateX(e){return this.rotateOnAxis(Vd,e)}rotateY(e){return this.rotateOnAxis(zd,e)}rotateZ(e){return this.rotateOnAxis(Hd,e)}translateOnAxis(e,t){return kd.copy(e).applyQuaternion(this.quaternion),this.position.add(kd.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Vd,e)}translateY(e){return this.translateOnAxis(zd,e)}translateZ(e){return this.translateOnAxis(Hd,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(yi.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?mo.copy(e):mo.set(e,t,n);let i=this.parent;this.updateWorldMatrix(!0,!1),aa.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?yi.lookAt(aa,mo,this.up):yi.lookAt(mo,aa,this.up),this.quaternion.setFromRotationMatrix(yi),i&&(yi.extractRotation(i.matrixWorld),Ds.setFromRotationMatrix(yi),this.quaternion.premultiply(Ds.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Oe("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Gd),Us.child=e,this.dispatchEvent(Us),Us.child=null):Oe("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Lm),Wc.child=e,this.dispatchEvent(Wc),Wc.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),yi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),yi.multiply(e.parent.matrixWorld)),e.applyMatrix4(yi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Gd),Us.child=e,this.dispatchEvent(Us),Us.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let i=this.children;for(let s=0,o=i.length;s<o;s++)i[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(aa,e,Im),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(aa,Pm,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,i=e.z,s=this.matrix.elements;s[12]+=t-s[0]*t-s[4]*n-s[8]*i,s[13]+=n-s[1]*t-s[5]*n-s[9]*i,s[14]+=i-s[2]*t-s[6]*n-s[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let i=this.children;for(let s=0,o=i.length;s<o;s++)i[s].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),this.static!==!1&&(i.static=this.static),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(l=>({...l,boundingBox:l.boundingBox?l.boundingBox.toJSON():void 0,boundingSphere:l.boundingSphere?l.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(l=>({...l})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function s(l,a){return l[a.uuid]===void 0&&(l[a.uuid]=a.toJSON(e)),a.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(e.geometries,this.geometry);let l=this.geometry.parameters;if(l!==void 0&&l.shapes!==void 0){let a=l.shapes;if(Array.isArray(a))for(let c=0,h=a.length;c<h;c++){let u=a[c];s(e.shapes,u)}else s(e.shapes,a)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let l=[];for(let a=0,c=this.material.length;a<c;a++)l.push(s(e.materials,this.material[a]));i.material=l}else i.material=s(e.materials,this.material);if(this.children.length>0){i.children=[];for(let l=0;l<this.children.length;l++)i.children.push(this.children[l].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let l=0;l<this.animations.length;l++){let a=this.animations[l];i.animations.push(s(e.animations,a))}}if(t){let l=o(e.geometries),a=o(e.materials),c=o(e.textures),h=o(e.images),u=o(e.shapes),d=o(e.skeletons),f=o(e.animations),p=o(e.nodes);l.length>0&&(n.geometries=l),a.length>0&&(n.materials=a),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),p.length>0&&(n.nodes=p)}return n.object=i,n;function o(l){let a=[];for(let c in l){let h=l[c];delete h.metadata,a.push(h)}return a}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let i=e.children[n];this.add(i.clone())}return this}};wt.DEFAULT_UP=new z(0,1,0);wt.DEFAULT_MATRIX_AUTO_UPDATE=!0;wt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var hn=class extends wt{constructor(){super(),this.isGroup=!0,this.type="Group"}},Nm={type:"move"},js=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new hn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new hn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new z,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new z),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new hn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new z,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new z,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,s=null,o=null,l=this._targetRay,a=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let x of e.hand.values()){let m=t.getJointPose(x,n),g=this._getHandJoint(c,x);m!==null&&(g.matrix.fromArray(m.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=m.radius),g.visible=m!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,p=.005;c.inputState.pinching&&d>f+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else a!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,a.eventsEnabled&&a.dispatchEvent({type:"gripUpdated",data:e,target:this})));l!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&s!==null&&(i=s),i!==null&&(l.matrix.fromArray(i.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,i.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(i.linearVelocity)):l.hasLinearVelocity=!1,i.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(i.angularVelocity)):l.hasAngularVelocity=!1,this.dispatchEvent(Nm)))}return l!==null&&(l.visible=i!==null),a!==null&&(a.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new hn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},$f={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Vi={h:0,s:0,l:0},go={h:0,s:0,l:0};function Xc(r,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?r+(e-r)*6*t:t<1/2?e:t<2/3?r+(e-r)*6*(2/3-t):r}var Be=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Tt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Je.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=Je.workingColorSpace){return this.r=e,this.g=t,this.b=n,Je.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=Je.workingColorSpace){if(e=Kh(e,1),t=Qe(t,0,1),n=Qe(n,0,1),t===0)this.r=this.g=this.b=n;else{let s=n<=.5?n*(1+t):n+t-n*t,o=2*n-s;this.r=Xc(o,s,e+1/3),this.g=Xc(o,s,e),this.b=Xc(o,s,e-1/3)}return Je.colorSpaceToWorking(this,i),this}setStyle(e,t=Tt){function n(s){s!==void 0&&parseFloat(s)<1&&Ie("Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let s,o=i[1],l=i[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(l))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(l))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(l))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:Ie("Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){let s=i[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(s,16),t);Ie("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Tt){let n=$f[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Ie("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ti(e.r),this.g=Ti(e.g),this.b=Ti(e.b),this}copyLinearToSRGB(e){return this.r=qs(e.r),this.g=qs(e.g),this.b=qs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Tt){return Je.workingToColorSpace(jt.copy(this),e),Math.round(Qe(jt.r*255,0,255))*65536+Math.round(Qe(jt.g*255,0,255))*256+Math.round(Qe(jt.b*255,0,255))}getHexString(e=Tt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Je.workingColorSpace){Je.workingToColorSpace(jt.copy(this),t);let n=jt.r,i=jt.g,s=jt.b,o=Math.max(n,i,s),l=Math.min(n,i,s),a,c,h=(l+o)/2;if(l===o)a=0,c=0;else{let u=o-l;switch(c=h<=.5?u/(o+l):u/(2-o-l),o){case n:a=(i-s)/u+(i<s?6:0);break;case i:a=(s-n)/u+2;break;case s:a=(n-i)/u+4;break}a/=6}return e.h=a,e.s=c,e.l=h,e}getRGB(e,t=Je.workingColorSpace){return Je.workingToColorSpace(jt.copy(this),t),e.r=jt.r,e.g=jt.g,e.b=jt.b,e}getStyle(e=Tt){Je.workingToColorSpace(jt.copy(this),e);let t=jt.r,n=jt.g,i=jt.b;return e!==Tt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(Vi),this.setHSL(Vi.h+e,Vi.s+t,Vi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Vi),e.getHSL(go);let n=ma(Vi.h,go.h,t),i=ma(Vi.s,go.s,t),s=ma(Vi.l,go.l,t);return this.setHSL(n,i,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,i=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*i,this.g=s[1]*t+s[4]*n+s[7]*i,this.b=s[2]*t+s[5]*n+s[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},jt=new Be;Be.NAMES=$f;var va=class extends wt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Bn,this.environmentIntensity=1,this.environmentRotation=new Bn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},Ln=new z,vi=new z,Yc=new z,bi=new z,Os=new z,Bs=new z,Wd=new z,qc=new z,$c=new z,Kc=new z,Zc=new pt,Jc=new pt,jc=new pt,Xi=class r{constructor(e=new z,t=new z,n=new z){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),Ln.subVectors(e,t),i.cross(Ln);let s=i.lengthSq();return s>0?i.multiplyScalar(1/Math.sqrt(s)):i.set(0,0,0)}static getBarycoord(e,t,n,i,s){Ln.subVectors(i,t),vi.subVectors(n,t),Yc.subVectors(e,t);let o=Ln.dot(Ln),l=Ln.dot(vi),a=Ln.dot(Yc),c=vi.dot(vi),h=vi.dot(Yc),u=o*c-l*l;if(u===0)return s.set(0,0,0),null;let d=1/u,f=(c*a-l*h)*d,p=(o*h-l*a)*d;return s.set(1-f-p,p,f)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,bi)===null?!1:bi.x>=0&&bi.y>=0&&bi.x+bi.y<=1}static getInterpolation(e,t,n,i,s,o,l,a){return this.getBarycoord(e,t,n,i,bi)===null?(a.x=0,a.y=0,"z"in a&&(a.z=0),"w"in a&&(a.w=0),null):(a.setScalar(0),a.addScaledVector(s,bi.x),a.addScaledVector(o,bi.y),a.addScaledVector(l,bi.z),a)}static getInterpolatedAttribute(e,t,n,i,s,o){return Zc.setScalar(0),Jc.setScalar(0),jc.setScalar(0),Zc.fromBufferAttribute(e,t),Jc.fromBufferAttribute(e,n),jc.fromBufferAttribute(e,i),o.setScalar(0),o.addScaledVector(Zc,s.x),o.addScaledVector(Jc,s.y),o.addScaledVector(jc,s.z),o}static isFrontFacing(e,t,n,i){return Ln.subVectors(n,t),vi.subVectors(e,t),Ln.cross(vi).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Ln.subVectors(this.c,this.b),vi.subVectors(this.a,this.b),Ln.cross(vi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return r.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return r.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,s){return r.getInterpolation(e,this.a,this.b,this.c,t,n,i,s)}containsPoint(e){return r.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return r.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,i=this.b,s=this.c,o,l;Os.subVectors(i,n),Bs.subVectors(s,n),qc.subVectors(e,n);let a=Os.dot(qc),c=Bs.dot(qc);if(a<=0&&c<=0)return t.copy(n);$c.subVectors(e,i);let h=Os.dot($c),u=Bs.dot($c);if(h>=0&&u<=h)return t.copy(i);let d=a*u-h*c;if(d<=0&&a>=0&&h<=0)return o=a/(a-h),t.copy(n).addScaledVector(Os,o);Kc.subVectors(e,s);let f=Os.dot(Kc),p=Bs.dot(Kc);if(p>=0&&f<=p)return t.copy(s);let x=f*c-a*p;if(x<=0&&c>=0&&p<=0)return l=c/(c-p),t.copy(n).addScaledVector(Bs,l);let m=h*p-f*u;if(m<=0&&u-h>=0&&f-p>=0)return Wd.subVectors(s,i),l=(u-h)/(u-h+(f-p)),t.copy(i).addScaledVector(Wd,l);let g=1/(m+x+d);return o=x*g,l=d*g,t.copy(n).addScaledVector(Os,o).addScaledVector(Bs,l)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},vn=class{constructor(e=new z(1/0,1/0,1/0),t=new z(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Nn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Nn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Nn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,l=s.count;o<l;o++)e.isMesh===!0?e.getVertexPosition(o,Nn):Nn.fromBufferAttribute(s,o),Nn.applyMatrix4(e.matrixWorld),this.expandByPoint(Nn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),xo.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),xo.copy(n.boundingBox)),xo.applyMatrix4(e.matrixWorld),this.union(xo)}let i=e.children;for(let s=0,o=i.length;s<o;s++)this.expandByObject(i[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Nn),Nn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(oa),_o.subVectors(this.max,oa),ks.subVectors(e.a,oa),Vs.subVectors(e.b,oa),zs.subVectors(e.c,oa),zi.subVectors(Vs,ks),Hi.subVectors(zs,Vs),os.subVectors(ks,zs);let t=[0,-zi.z,zi.y,0,-Hi.z,Hi.y,0,-os.z,os.y,zi.z,0,-zi.x,Hi.z,0,-Hi.x,os.z,0,-os.x,-zi.y,zi.x,0,-Hi.y,Hi.x,0,-os.y,os.x,0];return!Qc(t,ks,Vs,zs,_o)||(t=[1,0,0,0,1,0,0,0,1],!Qc(t,ks,Vs,zs,_o))?!1:(yo.crossVectors(zi,Hi),t=[yo.x,yo.y,yo.z],Qc(t,ks,Vs,zs,_o))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Nn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Nn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Mi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Mi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Mi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Mi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Mi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Mi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Mi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Mi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Mi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Mi=[new z,new z,new z,new z,new z,new z,new z,new z],Nn=new z,xo=new vn,ks=new z,Vs=new z,zs=new z,zi=new z,Hi=new z,os=new z,oa=new z,_o=new z,yo=new z,ls=new z;function Qc(r,e,t,n,i){for(let s=0,o=r.length-3;s<=o;s+=3){ls.fromArray(r,s);let l=i.x*Math.abs(ls.x)+i.y*Math.abs(ls.y)+i.z*Math.abs(ls.z),a=e.dot(ls),c=t.dot(ls),h=n.dot(ls);if(Math.max(-Math.max(a,c,h),Math.min(a,c,h))>l)return!1}return!0}var Ot=new z,vo=new et,Fm=0,At=class extends Qn{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Fm++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Ko,this.updateRanges=[],this.gpuType=bn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)vo.fromBufferAttribute(this,t),vo.applyMatrix3(e),this.setXY(t,vo.x,vo.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Ot.fromBufferAttribute(this,t),Ot.applyMatrix3(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Ot.fromBufferAttribute(this,t),Ot.applyMatrix4(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ot.fromBufferAttribute(this,t),Ot.applyNormalMatrix(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ot.fromBufferAttribute(this,t),Ot.transformDirection(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Fn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ht(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Fn(t,this.array)),t}setX(e,t){return this.normalized&&(t=ht(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Fn(t,this.array)),t}setY(e,t){return this.normalized&&(t=ht(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Fn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=ht(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Fn(t,this.array)),t}setW(e,t){return this.normalized&&(t=ht(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=ht(t,this.array),n=ht(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=ht(t,this.array),n=ht(n,this.array),i=ht(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e*=this.itemSize,this.normalized&&(t=ht(t,this.array),n=ht(n,this.array),i=ht(i,this.array),s=ht(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Ko&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}};var ba=class extends At{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var Ma=class extends At{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var rn=class extends At{constructor(e,t,n){super(new Float32Array(e),t,n)}},Dm=new vn,la=new z,eh=new z,un=class{constructor(e=new z,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Dm.setFromPoints(e).getCenter(n);let i=0;for(let s=0,o=e.length;s<o;s++)i=Math.max(i,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;la.subVectors(e,this.center);let t=la.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(la,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(eh.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(la.copy(e.center).add(eh)),this.expandByPoint(la.copy(e.center).sub(eh))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Um=0,An=new ke,th=new wt,Hs=new z,_n=new vn,ca=new vn,Gt=new z,qt=class r extends Qn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Um++}),this.uuid=Un(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(am(e)?Ma:ba)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let s=new ze().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}let i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return An.makeRotationFromQuaternion(e),this.applyMatrix4(An),this}rotateX(e){return An.makeRotationX(e),this.applyMatrix4(An),this}rotateY(e){return An.makeRotationY(e),this.applyMatrix4(An),this}rotateZ(e){return An.makeRotationZ(e),this.applyMatrix4(An),this}translate(e,t,n){return An.makeTranslation(e,t,n),this.applyMatrix4(An),this}scale(e,t,n){return An.makeScale(e,t,n),this.applyMatrix4(An),this}lookAt(e){return th.lookAt(e),th.updateMatrix(),this.applyMatrix4(th.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Hs).negate(),this.translate(Hs.x,Hs.y,Hs.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let i=0,s=e.length;i<s;i++){let o=e[i];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new rn(n,3))}else{let n=Math.min(e.length,t.count);for(let i=0;i<n;i++){let s=e[i];t.setXYZ(i,s.x,s.y,s.z||0)}e.length>t.count&&Ie("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new vn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Oe("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new z(-1/0,-1/0,-1/0),new z(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){let s=t[n];_n.setFromBufferAttribute(s),this.morphTargetsRelative?(Gt.addVectors(this.boundingBox.min,_n.min),this.boundingBox.expandByPoint(Gt),Gt.addVectors(this.boundingBox.max,_n.max),this.boundingBox.expandByPoint(Gt)):(this.boundingBox.expandByPoint(_n.min),this.boundingBox.expandByPoint(_n.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Oe('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new un);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Oe("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new z,1/0);return}if(e){let n=this.boundingSphere.center;if(_n.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){let l=t[s];ca.setFromBufferAttribute(l),this.morphTargetsRelative?(Gt.addVectors(_n.min,ca.min),_n.expandByPoint(Gt),Gt.addVectors(_n.max,ca.max),_n.expandByPoint(Gt)):(_n.expandByPoint(ca.min),_n.expandByPoint(ca.max))}_n.getCenter(n);let i=0;for(let s=0,o=e.count;s<o;s++)Gt.fromBufferAttribute(e,s),i=Math.max(i,n.distanceToSquared(Gt));if(t)for(let s=0,o=t.length;s<o;s++){let l=t[s],a=this.morphTargetsRelative;for(let c=0,h=l.count;c<h;c++)Gt.fromBufferAttribute(l,c),a&&(Hs.fromBufferAttribute(e,c),Gt.add(Hs)),i=Math.max(i,n.distanceToSquared(Gt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&Oe('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Oe("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,i=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new At(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),l=[],a=[];for(let M=0;M<n.count;M++)l[M]=new z,a[M]=new z;let c=new z,h=new z,u=new z,d=new et,f=new et,p=new et,x=new z,m=new z;function g(M,A,C){c.fromBufferAttribute(n,M),h.fromBufferAttribute(n,A),u.fromBufferAttribute(n,C),d.fromBufferAttribute(s,M),f.fromBufferAttribute(s,A),p.fromBufferAttribute(s,C),h.sub(c),u.sub(c),f.sub(d),p.sub(d);let E=1/(f.x*p.y-p.x*f.y);isFinite(E)&&(x.copy(h).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(E),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-p.x).multiplyScalar(E),l[M].add(x),l[A].add(x),l[C].add(x),a[M].add(m),a[A].add(m),a[C].add(m))}let y=this.groups;y.length===0&&(y=[{start:0,count:e.count}]);for(let M=0,A=y.length;M<A;++M){let C=y[M],E=C.start,N=C.count;for(let F=E,L=E+N;F<L;F+=3)g(e.getX(F+0),e.getX(F+1),e.getX(F+2))}let _=new z,v=new z,S=new z,b=new z;function w(M){S.fromBufferAttribute(i,M),b.copy(S);let A=l[M];_.copy(A),_.sub(S.multiplyScalar(S.dot(A))).normalize(),v.crossVectors(b,A);let E=v.dot(a[M])<0?-1:1;o.setXYZW(M,_.x,_.y,_.z,E)}for(let M=0,A=y.length;M<A;++M){let C=y[M],E=C.start,N=C.count;for(let F=E,L=E+N;F<L;F+=3)w(e.getX(F+0)),w(e.getX(F+1)),w(e.getX(F+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new At(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);let i=new z,s=new z,o=new z,l=new z,a=new z,c=new z,h=new z,u=new z;if(e)for(let d=0,f=e.count;d<f;d+=3){let p=e.getX(d+0),x=e.getX(d+1),m=e.getX(d+2);i.fromBufferAttribute(t,p),s.fromBufferAttribute(t,x),o.fromBufferAttribute(t,m),h.subVectors(o,s),u.subVectors(i,s),h.cross(u),l.fromBufferAttribute(n,p),a.fromBufferAttribute(n,x),c.fromBufferAttribute(n,m),l.add(h),a.add(h),c.add(h),n.setXYZ(p,l.x,l.y,l.z),n.setXYZ(x,a.x,a.y,a.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)i.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),h.subVectors(o,s),u.subVectors(i,s),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Gt.fromBufferAttribute(e,t),Gt.normalize(),e.setXYZ(t,Gt.x,Gt.y,Gt.z)}toNonIndexed(){function e(l,a){let c=l.array,h=l.itemSize,u=l.normalized,d=new c.constructor(a.length*h),f=0,p=0;for(let x=0,m=a.length;x<m;x++){l.isInterleavedBufferAttribute?f=a[x]*l.data.stride+l.offset:f=a[x]*h;for(let g=0;g<h;g++)d[p++]=c[f++]}return new At(d,h,u)}if(this.index===null)return Ie("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new r,n=this.index.array,i=this.attributes;for(let l in i){let a=i[l],c=e(a,n);t.setAttribute(l,c)}let s=this.morphAttributes;for(let l in s){let a=[],c=s[l];for(let h=0,u=c.length;h<u;h++){let d=c[h],f=e(d,n);a.push(f)}t.morphAttributes[l]=a}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let l=0,a=o.length;l<a;l++){let c=o[l];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let a=this.parameters;for(let c in a)a[c]!==void 0&&(e[c]=a[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let a in n){let c=n[a];e.data.attributes[a]=c.toJSON(e.data)}let i={},s=!1;for(let a in this.morphAttributes){let c=this.morphAttributes[a],h=[];for(let u=0,d=c.length;u<d;u++){let f=c[u];h.push(f.toJSON(e.data))}h.length>0&&(i[a]=h,s=!0)}s&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let l=this.boundingSphere;return l!==null&&(e.data.boundingSphere=l.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let i=e.attributes;for(let c in i){let h=i[c];this.setAttribute(c,h.clone(t))}let s=e.morphAttributes;for(let c in s){let h=[],u=s[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,h=o.length;c<h;c++){let u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}let l=e.boundingBox;l!==null&&(this.boundingBox=l.clone());let a=e.boundingSphere;return a!==null&&(this.boundingSphere=a.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},$i=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Ko,this.updateRanges=[],this.version=0,this.uuid=Un()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,s=this.stride;i<s;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Un()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Un()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},sn=new z,kn=class r{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)sn.fromBufferAttribute(this,t),sn.applyMatrix4(e),this.setXYZ(t,sn.x,sn.y,sn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)sn.fromBufferAttribute(this,t),sn.applyNormalMatrix(e),this.setXYZ(t,sn.x,sn.y,sn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)sn.fromBufferAttribute(this,t),sn.transformDirection(e),this.setXYZ(t,sn.x,sn.y,sn.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Fn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ht(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=ht(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=ht(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=ht(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=ht(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Fn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Fn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Fn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Fn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=ht(t,this.array),n=ht(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=ht(t,this.array),n=ht(n,this.array),i=ht(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=ht(t,this.array),n=ht(n,this.array),i=ht(i,this.array),s=ht(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=s,this}clone(e){if(e===void 0){xa("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return new At(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new r(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){xa("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Om=0,Wt=class extends Qn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Om++}),this.uuid=Un(),this.name="",this.type="Material",this.blending=En,this.side=On,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=zo,this.blendDst=ds,this.blendEquation=Yi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Be(0,0,0),this.blendAlpha=0,this.depthFunc=fs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=xh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=us,this.stencilZFail=us,this.stencilZPass=us,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){Ie(`Material: parameter '${t}' has value of undefined.`);continue}let i=this[t];if(i===void 0){Ie(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==En&&(n.blending=this.blending),this.side!==On&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==zo&&(n.blendSrc=this.blendSrc),this.blendDst!==ds&&(n.blendDst=this.blendDst),this.blendEquation!==Yi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==fs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==xh&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==us&&(n.stencilFail=this.stencilFail),this.stencilZFail!==us&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==us&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(s){let o=[];for(let l in s){let a=s[l];delete a.metadata,o.push(a)}return o}if(t){let s=i(e.textures),o=i(e.images);s.length>0&&(n.textures=s),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let i=t.length;n=new Array(i);for(let s=0;s!==i;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}};var Si=new z,nh=new z,bo=new z,Gi=new z,ih=new z,Mo=new z,sh=new z,xs=class{constructor(e=new z,t=new z(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Si)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Si.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Si.copy(this.origin).addScaledVector(this.direction,t),Si.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){nh.copy(e).add(t).multiplyScalar(.5),bo.copy(t).sub(e).normalize(),Gi.copy(this.origin).sub(nh);let s=e.distanceTo(t)*.5,o=-this.direction.dot(bo),l=Gi.dot(this.direction),a=-Gi.dot(bo),c=Gi.lengthSq(),h=Math.abs(1-o*o),u,d,f,p;if(h>0)if(u=o*a-l,d=o*l-a,p=s*h,u>=0)if(d>=-p)if(d<=p){let x=1/h;u*=x,d*=x,f=u*(u+o*d+2*l)+d*(o*u+d+2*a)+c}else d=s,u=Math.max(0,-(o*d+l)),f=-u*u+d*(d+2*a)+c;else d=-s,u=Math.max(0,-(o*d+l)),f=-u*u+d*(d+2*a)+c;else d<=-p?(u=Math.max(0,-(-o*s+l)),d=u>0?-s:Math.min(Math.max(-s,-a),s),f=-u*u+d*(d+2*a)+c):d<=p?(u=0,d=Math.min(Math.max(-s,-a),s),f=d*(d+2*a)+c):(u=Math.max(0,-(o*s+l)),d=u>0?s:Math.min(Math.max(-s,-a),s),f=-u*u+d*(d+2*a)+c);else d=o>0?-s:s,u=Math.max(0,-(o*d+l)),f=-u*u+d*(d+2*a)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(nh).addScaledVector(bo,d),f}intersectSphere(e,t){Si.subVectors(e.center,this.origin);let n=Si.dot(this.direction),i=Si.dot(Si)-n*n,s=e.radius*e.radius;if(i>s)return null;let o=Math.sqrt(s-i),l=n-o,a=n+o;return a<0?null:l<0?this.at(a,t):this.at(l,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,s,o,l,a,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,i=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,i=(e.min.x-d.x)*c),h>=0?(s=(e.min.y-d.y)*h,o=(e.max.y-d.y)*h):(s=(e.max.y-d.y)*h,o=(e.min.y-d.y)*h),n>o||s>i||((s>n||isNaN(n))&&(n=s),(o<i||isNaN(i))&&(i=o),u>=0?(l=(e.min.z-d.z)*u,a=(e.max.z-d.z)*u):(l=(e.max.z-d.z)*u,a=(e.min.z-d.z)*u),n>a||l>i)||((l>n||n!==n)&&(n=l),(a<i||i!==i)&&(i=a),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,Si)!==null}intersectTriangle(e,t,n,i,s){ih.subVectors(t,e),Mo.subVectors(n,e),sh.crossVectors(ih,Mo);let o=this.direction.dot(sh),l;if(o>0){if(i)return null;l=1}else if(o<0)l=-1,o=-o;else return null;Gi.subVectors(this.origin,e);let a=l*this.direction.dot(Mo.crossVectors(Gi,Mo));if(a<0)return null;let c=l*this.direction.dot(ih.cross(Gi));if(c<0||a+c>o)return null;let h=-l*Gi.dot(sh);return h<0?null:this.at(h/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},$t=class extends Wt{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Be(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Bn,this.combine=Rh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Xd=new ke,cs=new xs,So=new un,Yd=new z,wo=new z,To=new z,Ao=new z,rh=new z,Eo=new z,qd=new z,Ro=new z,It=class extends wt{constructor(e=new qt,t=new $t){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=i.length;s<o;s++){let l=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[l]=s}}}}getVertexPosition(e,t){let n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(i,e);let l=this.morphTargetInfluences;if(s&&l){Eo.set(0,0,0);for(let a=0,c=s.length;a<c;a++){let h=l[a],u=s[a];h!==0&&(rh.fromBufferAttribute(u,e),o?Eo.addScaledVector(rh,h):Eo.addScaledVector(rh.sub(t),h))}t.add(Eo)}return t}raycast(e,t){let n=this.geometry,i=this.material,s=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),So.copy(n.boundingSphere),So.applyMatrix4(s),cs.copy(e.ray).recast(e.near),!(So.containsPoint(cs.origin)===!1&&(cs.intersectSphere(So,Yd)===null||cs.origin.distanceToSquared(Yd)>(e.far-e.near)**2))&&(Xd.copy(s).invert(),cs.copy(e.ray).applyMatrix4(Xd),!(n.boundingBox!==null&&cs.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,cs)))}_computeIntersections(e,t,n){let i,s=this.geometry,o=this.material,l=s.index,a=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,u=s.attributes.normal,d=s.groups,f=s.drawRange;if(l!==null)if(Array.isArray(o))for(let p=0,x=d.length;p<x;p++){let m=d[p],g=o[m.materialIndex],y=Math.max(m.start,f.start),_=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let v=y,S=_;v<S;v+=3){let b=l.getX(v),w=l.getX(v+1),M=l.getX(v+2);i=Co(this,g,e,n,c,h,u,b,w,M),i&&(i.faceIndex=Math.floor(v/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{let p=Math.max(0,f.start),x=Math.min(l.count,f.start+f.count);for(let m=p,g=x;m<g;m+=3){let y=l.getX(m),_=l.getX(m+1),v=l.getX(m+2);i=Co(this,o,e,n,c,h,u,y,_,v),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}else if(a!==void 0)if(Array.isArray(o))for(let p=0,x=d.length;p<x;p++){let m=d[p],g=o[m.materialIndex],y=Math.max(m.start,f.start),_=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let v=y,S=_;v<S;v+=3){let b=v,w=v+1,M=v+2;i=Co(this,g,e,n,c,h,u,b,w,M),i&&(i.faceIndex=Math.floor(v/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{let p=Math.max(0,f.start),x=Math.min(a.count,f.start+f.count);for(let m=p,g=x;m<g;m+=3){let y=m,_=m+1,v=m+2;i=Co(this,o,e,n,c,h,u,y,_,v),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}}};function Bm(r,e,t,n,i,s,o,l){let a;if(e.side===ln?a=n.intersectTriangle(o,s,i,!0,l):a=n.intersectTriangle(i,s,o,e.side===On,l),a===null)return null;Ro.copy(l),Ro.applyMatrix4(r.matrixWorld);let c=t.ray.origin.distanceTo(Ro);return c<t.near||c>t.far?null:{distance:c,point:Ro.clone(),object:r}}function Co(r,e,t,n,i,s,o,l,a,c){r.getVertexPosition(l,wo),r.getVertexPosition(a,To),r.getVertexPosition(c,Ao);let h=Bm(r,e,t,n,wo,To,Ao,qd);if(h){let u=new z;Xi.getBarycoord(qd,wo,To,Ao,u),i&&(h.uv=Xi.getInterpolatedAttribute(i,l,a,c,u,new et)),s&&(h.uv1=Xi.getInterpolatedAttribute(s,l,a,c,u,new et)),o&&(h.normal=Xi.getInterpolatedAttribute(o,l,a,c,u,new z),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a:l,b:a,c,normal:new z,materialIndex:0};Xi.getNormal(wo,To,Ao,d.normal),h.face=d,h.barycoord=u}return h}var ha=new pt,$d=new pt,Kd=new pt,km=new pt,Zd=new ke,Io=new z,ah=new un,Jd=new ke,oh=new xs,Sa=class extends It{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=dh,this.bindMatrix=new ke,this.bindMatrixInverse=new ke,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new vn),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Io),this.boundingBox.expandByPoint(Io)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new un),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Io),this.boundingSphere.expandByPoint(Io)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ah.copy(this.boundingSphere),ah.applyMatrix4(i),e.ray.intersectsSphere(ah)!==!1&&(Jd.copy(i).invert(),oh.copy(e.ray).applyMatrix4(Jd),!(this.boundingBox!==null&&oh.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,oh)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new pt,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);let s=1/e.manhattanLength();s!==1/0?e.multiplyScalar(s):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===dh?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Ff?this.bindMatrixInverse.copy(this.bindMatrix).invert():Ie("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,i=this.geometry;$d.fromBufferAttribute(i.attributes.skinIndex,e),Kd.fromBufferAttribute(i.attributes.skinWeight,e),t.isVector4?(ha.copy(t),t.set(0,0,0,0)):(ha.set(...t,1),t.set(0,0,0)),ha.applyMatrix4(this.bindMatrix);for(let s=0;s<4;s++){let o=Kd.getComponent(s);if(o!==0){let l=$d.getComponent(s);Zd.multiplyMatrices(n.bones[l].matrixWorld,n.boneInverses[l]),t.addScaledVector(km.copy(ha).applyMatrix4(Zd),o)}}return t.isVector4&&(t.w=ha.w),t.applyMatrix4(this.bindMatrixInverse)}},Qs=class extends wt{constructor(){super(),this.isBone=!0,this.type="Bone"}},er=class extends Dt{constructor(e=null,t=1,n=1,i,s,o,l,a,c=bt,h=bt,u,d){super(null,o,l,a,c,h,i,s,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},jd=new ke,Vm=new ke,wa=class r{constructor(e=[],t=[]){this.uuid=Un(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.previousBoneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){Ie("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new ke)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let n=new ke;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let s=0,o=e.length;s<o;s++){let l=e[s]?e[s].matrixWorld:Vm;jd.multiplyMatrices(l,t[s]),jd.toArray(n,s*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new r(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new er(t,e,e,Mn,bn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){let s=e.bones[n],o=t[s];o===void 0&&(Ie("Skeleton: No bone found with UUID:",s),o=new Qs),this.bones.push(o),this.boneInverses.push(new ke().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let i=0,s=t.length;i<s;i++){let o=t[i];e.bones.push(o.uuid);let l=n[i];e.boneInverses.push(l.toArray())}return e}},Ki=class extends At{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Gs=new ke,Qd=new ke,Po=[],ef=new vn,zm=new ke,ua=new It,da=new un,Ta=class extends It{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Ki(new Float32Array(n*16),16),this.previousInstanceMatrix=null,this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,zm)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new vn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Gs),ef.copy(e.boundingBox).applyMatrix4(Gs),this.boundingBox.union(ef)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new un),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Gs),da.copy(e.boundingSphere).applyMatrix4(Gs),this.boundingSphere.union(da)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.previousInstanceMatrix!==null&&(this.previousInstanceMatrix=e.previousInstanceMatrix.clone()),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,s=n.length+1,o=e*s+1;for(let l=0;l<n.length;l++)n[l]=i[o+l]}raycast(e,t){let n=this.matrixWorld,i=this.count;if(ua.geometry=this.geometry,ua.material=this.material,ua.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),da.copy(this.boundingSphere),da.applyMatrix4(n),e.ray.intersectsSphere(da)!==!1))for(let s=0;s<i;s++){this.getMatrixAt(s,Gs),Qd.multiplyMatrices(n,Gs),ua.matrixWorld=Qd,ua.raycast(e,Po);for(let o=0,l=Po.length;o<l;o++){let a=Po[o];a.instanceId=s,a.object=this,t.push(a)}Po.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Ki(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new er(new Float32Array(i*this.count),i,this.count,Sl,bn));let s=this.morphTexture.source.data.data,o=0;for(let c=0;c<n.length;c++)o+=n[c];let l=this.geometry.morphTargetsRelative?1:1-o,a=i*e;return s[a]=l,s.set(n,a+1),this}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},lh=new z,Hm=new z,Gm=new ze,Kn=class{constructor(e=new z(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let i=lh.subVectors(n,t).cross(Hm.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let i=e.delta(lh),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let o=-(e.start.dot(this.normal)+this.constant)/s;return n===!0&&(o<0||o>1)?null:t.copy(e.start).addScaledVector(i,o)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Gm.getNormalMatrix(e),i=this.coplanarPoint(lh).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},hs=new un,Wm=new et(.5,.5),Lo=new z,tr=class{constructor(e=new Kn,t=new Kn,n=new Kn,i=new Kn,s=new Kn,o=new Kn){this.planes=[e,t,n,i,s,o]}set(e,t,n,i,s,o){let l=this.planes;return l[0].copy(e),l[1].copy(t),l[2].copy(n),l[3].copy(i),l[4].copy(s),l[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Dn,n=!1){let i=this.planes,s=e.elements,o=s[0],l=s[1],a=s[2],c=s[3],h=s[4],u=s[5],d=s[6],f=s[7],p=s[8],x=s[9],m=s[10],g=s[11],y=s[12],_=s[13],v=s[14],S=s[15];if(i[0].setComponents(c-o,f-h,g-p,S-y).normalize(),i[1].setComponents(c+o,f+h,g+p,S+y).normalize(),i[2].setComponents(c+l,f+u,g+x,S+_).normalize(),i[3].setComponents(c-l,f-u,g-x,S-_).normalize(),n)i[4].setComponents(a,d,m,v).normalize(),i[5].setComponents(c-a,f-d,g-m,S-v).normalize();else if(i[4].setComponents(c-a,f-d,g-m,S-v).normalize(),t===Dn)i[5].setComponents(c+a,f+d,g+m,S+v).normalize();else if(t===$s)i[5].setComponents(a,d,m,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),hs.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),hs.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(hs)}intersectsSprite(e){hs.center.set(0,0,0);let t=Wm.distanceTo(e.center);return hs.radius=.7071067811865476+t,hs.applyMatrix4(e.matrixWorld),this.intersectsSphere(hs)}intersectsSphere(e){let t=this.planes,n=e.center,i=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let i=t[n];if(Lo.x=i.normal.x>0?e.max.x:e.min.x,Lo.y=i.normal.y>0?e.max.y:e.min.y,Lo.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Lo)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var nr=class extends Wt{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Be(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},el=new z,tl=new z,tf=new ke,fa=new xs,No=new un,ch=new z,nf=new z,_s=class extends wt{constructor(e=new qt,t=new nr){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let i=1,s=t.count;i<s;i++)el.fromBufferAttribute(t,i-1),tl.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=el.distanceTo(tl);e.setAttribute("lineDistance",new rn(n,1))}else Ie("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let n=this.geometry,i=this.matrixWorld,s=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),No.copy(n.boundingSphere),No.applyMatrix4(i),No.radius+=s,e.ray.intersectsSphere(No)===!1)return;tf.copy(i).invert(),fa.copy(e.ray).applyMatrix4(tf);let l=s/((this.scale.x+this.scale.y+this.scale.z)/3),a=l*l,c=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){let f=Math.max(0,o.start),p=Math.min(h.count,o.start+o.count);for(let x=f,m=p-1;x<m;x+=c){let g=h.getX(x),y=h.getX(x+1),_=Fo(this,e,fa,a,g,y,x);_&&t.push(_)}if(this.isLineLoop){let x=h.getX(p-1),m=h.getX(f),g=Fo(this,e,fa,a,x,m,p-1);g&&t.push(g)}}else{let f=Math.max(0,o.start),p=Math.min(d.count,o.start+o.count);for(let x=f,m=p-1;x<m;x+=c){let g=Fo(this,e,fa,a,x,x+1,x);g&&t.push(g)}if(this.isLineLoop){let x=Fo(this,e,fa,a,p-1,f,p-1);x&&t.push(x)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=i.length;s<o;s++){let l=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[l]=s}}}}};function Fo(r,e,t,n,i,s,o){let l=r.geometry.attributes.position;if(el.fromBufferAttribute(l,i),tl.fromBufferAttribute(l,s),t.distanceSqToSegment(el,tl,ch,nf)>n)return;ch.applyMatrix4(r.matrixWorld);let c=e.ray.origin.distanceTo(ch);if(!(c<e.near||c>e.far))return{distance:c,point:nf.clone().applyMatrix4(r.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:r}}var sf=new z,rf=new z,Aa=class extends _s{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let i=0,s=t.count;i<s;i+=2)sf.fromBufferAttribute(t,i),rf.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+sf.distanceTo(rf);e.setAttribute("lineDistance",new rn(n,1))}else Ie("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},Ea=class extends _s{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}},ir=class extends Wt{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Be(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},af=new ke,_h=new xs,Do=new un,Uo=new z,Ra=class extends wt{constructor(e=new qt,t=new ir){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let n=this.geometry,i=this.matrixWorld,s=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Do.copy(n.boundingSphere),Do.applyMatrix4(i),Do.radius+=s,e.ray.intersectsSphere(Do)===!1)return;af.copy(i).invert(),_h.copy(e.ray).applyMatrix4(af);let l=s/((this.scale.x+this.scale.y+this.scale.z)/3),a=l*l,c=n.index,u=n.attributes.position;if(c!==null){let d=Math.max(0,o.start),f=Math.min(c.count,o.start+o.count);for(let p=d,x=f;p<x;p++){let m=c.getX(p);Uo.fromBufferAttribute(u,m),of(Uo,m,a,i,e,t,this)}}else{let d=Math.max(0,o.start),f=Math.min(u.count,o.start+o.count);for(let p=d,x=f;p<x;p++)Uo.fromBufferAttribute(u,p),of(Uo,p,a,i,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=i.length;s<o;s++){let l=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[l]=s}}}}};function of(r,e,t,n,i,s,o){let l=_h.distanceSqToPoint(r);if(l<t){let a=new z;_h.closestPointToPoint(r,a),a.applyMatrix4(n);let c=i.ray.origin.distanceTo(a);if(c<i.near||c>i.far)return;s.push({distance:c,distanceToRay:Math.sqrt(l),point:a,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}var Ca=class extends Dt{constructor(e=[],t=Ji,n,i,s,o,l,a,c,h){super(e,t,n,i,s,o,l,a,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},ys=class extends Dt{constructor(e,t,n,i,s,o,l,a,c){super(e,t,n,i,s,o,l,a,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var Ai=class extends Dt{constructor(e,t,n=Hn,i,s,o,l=bt,a=bt,c,h=jn,u=1){if(h!==jn&&h!==ji)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:e,height:t,depth:u};super(d,i,s,o,l,a,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Js(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},nl=class extends Ai{constructor(e,t=Hn,n=Ji,i,s,o=bt,l=bt,a,c=jn){let h={width:e,height:e,depth:1},u=[h,h,h,h,h,h];super(e,e,t,n,i,s,o,l,a,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Ia=class extends Dt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},sr=class r extends qt{constructor(e=1,t=1,n=1,i=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:s,depthSegments:o};let l=this;i=Math.floor(i),s=Math.floor(s),o=Math.floor(o);let a=[],c=[],h=[],u=[],d=0,f=0;p("z","y","x",-1,-1,n,t,e,o,s,0),p("z","y","x",1,-1,n,t,-e,o,s,1),p("x","z","y",1,1,e,n,t,i,o,2),p("x","z","y",1,-1,e,n,-t,i,o,3),p("x","y","z",1,-1,e,t,n,i,s,4),p("x","y","z",-1,-1,e,t,-n,i,s,5),this.setIndex(a),this.setAttribute("position",new rn(c,3)),this.setAttribute("normal",new rn(h,3)),this.setAttribute("uv",new rn(u,2));function p(x,m,g,y,_,v,S,b,w,M,A){let C=v/w,E=S/M,N=v/2,F=S/2,L=b/2,I=w+1,D=M+1,U=0,Y=0,X=new z;for(let ee=0;ee<D;ee++){let ae=ee*E-F;for(let ce=0;ce<I;ce++){let oe=ce*C-N;X[x]=oe*y,X[m]=ae*_,X[g]=L,c.push(X.x,X.y,X.z),X[x]=0,X[m]=0,X[g]=b>0?1:-1,h.push(X.x,X.y,X.z),u.push(ce/w),u.push(1-ee/M),U+=1}}for(let ee=0;ee<M;ee++)for(let ae=0;ae<w;ae++){let ce=d+ae+I*ee,oe=d+ae+I*(ee+1),Me=d+(ae+1)+I*(ee+1),me=d+(ae+1)+I*ee;a.push(ce,oe,me),a.push(oe,Me,me),Y+=6}l.addGroup(f,Y,A),f+=Y,d+=U}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};var Pa=class r extends qt{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};let s=e/2,o=t/2,l=Math.floor(n),a=Math.floor(i),c=l+1,h=a+1,u=e/l,d=t/a,f=[],p=[],x=[],m=[];for(let g=0;g<h;g++){let y=g*d-o;for(let _=0;_<c;_++){let v=_*u-s;p.push(v,-y,0),x.push(0,0,1),m.push(_/l),m.push(1-g/a)}}for(let g=0;g<a;g++)for(let y=0;y<l;y++){let _=y+c*g,v=y+c*(g+1),S=y+1+c*(g+1),b=y+1+c*g;f.push(_,v,b),f.push(v,S,b)}this.setIndex(f),this.setAttribute("position",new rn(p,3)),this.setAttribute("normal",new rn(x,3)),this.setAttribute("uv",new rn(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.width,e.height,e.widthSegments,e.heightSegments)}};function Ss(r){let e={};for(let t in r){e[t]={};for(let n in r[t]){let i=r[t][n];if(lf(i))i.isRenderTargetTexture?(Ie("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone();else if(Array.isArray(i))if(lf(i[0])){let s=[];for(let o=0,l=i.length;o<l;o++)s[o]=i[o].clone();e[t][n]=s}else e[t][n]=i.slice();else e[t][n]=i}}return e}function tn(r){let e={};for(let t=0;t<r.length;t++){let n=Ss(r[t]);for(let i in n)e[i]=n[i]}return e}function lf(r){return r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)}function Xm(r){let e=[];for(let t=0;t<r.length;t++)e.push(r[t].clone());return e}function Jh(r){let e=r.getRenderTarget();return e===null?r.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Je.workingColorSpace}var Kf={clone:Ss,merge:tn},Ym=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,qm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,on=class extends Wt{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Ym,this.fragmentShader=qm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ss(e.uniforms),this.uniformsGroups=Xm(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let i in this.uniforms){let o=this.uniforms[i].value;o&&o.isTexture?t.uniforms[i]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[i]={type:"m4",value:o.toArray()}:t.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},il=class extends on{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},vs=class extends Wt{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Be(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Be(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ic,this.normalScale=new et(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Bn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},dn=class extends vs{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new et(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Qe(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Be(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Be(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Be(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var sl=class extends Wt{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Uf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},rl=class extends Wt{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Oo(r,e){return!r||r.constructor===e?r:typeof e.BYTES_PER_ELEMENT=="number"?new e(r):Array.prototype.slice.call(r)}function $m(r){function e(i,s){return r[i]-r[s]}let t=r.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function cf(r,e,t){let n=r.length,i=new r.constructor(n);for(let s=0,o=0;o!==n;++s){let l=t[s]*e;for(let a=0;a!==e;++a)i[o++]=r[l+a]}return i}function Zf(r,e,t,n){let i=1,s=r[0];for(;s!==void 0&&s[n]===void 0;)s=r[i++];if(s===void 0)return;let o=s[n];if(o!==void 0)if(Array.isArray(o))do o=s[n],o!==void 0&&(e.push(s.time),t.push(...o)),s=r[i++];while(s!==void 0);else if(o.toArray!==void 0)do o=s[n],o!==void 0&&(e.push(s.time),o.toArray(t,t.length)),s=r[i++];while(s!==void 0);else do o=s[n],o!==void 0&&(e.push(s.time),t.push(o)),s=r[i++];while(s!==void 0)}var ei=class{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,i=t[n],s=t[n-1];e:{t:{let o;n:{i:if(!(e<i)){for(let l=n+2;;){if(i===void 0){if(e<s)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===l)break;if(s=i,i=t[++n],e<i)break t}o=t.length;break n}if(!(e>=s)){let l=t[1];e<l&&(n=2,s=l);for(let a=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(i=s,s=t[--n-1],e>=s)break t}o=n,n=0;break n}break e}for(;n<o;){let l=n+o>>>1;e<t[l]?o=l:n=l+1}if(i=t[n],s=t[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,i)}return this.interpolate_(n,s,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i;for(let o=0;o!==i;++o)t[o]=n[s+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},al=class extends ei{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:ph,endingEnd:ph}}intervalChanged_(e,t,n){let i=this.parameterPositions,s=e-2,o=e+1,l=i[s],a=i[o];if(l===void 0)switch(this.getSettings_().endingStart){case mh:s=e,l=2*t-n;break;case gh:s=i.length-2,l=t+i[s]-i[s+1];break;default:s=e,l=n}if(a===void 0)switch(this.getSettings_().endingEnd){case mh:o=e,a=2*n-t;break;case gh:o=1,a=n+i[1]-i[0];break;default:o=e-1,a=t}let c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-l),this._weightNext=c/(a-n),this._offsetPrev=s*h,this._offsetNext=o*h}interpolate_(e,t,n,i){let s=this.resultBuffer,o=this.sampleValues,l=this.valueSize,a=e*l,c=a-l,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(i-t),x=p*p,m=x*p,g=-d*m+2*d*x-d*p,y=(1+d)*m+(-1.5-2*d)*x+(-.5+d)*p+1,_=(-1-f)*m+(1.5+f)*x+.5*p,v=f*m-f*x;for(let S=0;S!==l;++S)s[S]=g*o[h+S]+y*o[c+S]+_*o[a+S]+v*o[u+S];return s}},ol=class extends ei{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let s=this.resultBuffer,o=this.sampleValues,l=this.valueSize,a=e*l,c=a-l,h=(n-t)/(i-t),u=1-h;for(let d=0;d!==l;++d)s[d]=o[c+d]*u+o[a+d]*h;return s}},ll=class extends ei{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}},cl=class extends ei{interpolate_(e,t,n,i){let s=this.resultBuffer,o=this.sampleValues,l=this.valueSize,a=e*l,c=a-l,h=this.settings||this.DefaultSettings_,u=h.inTangents,d=h.outTangents;if(!u||!d){let x=(n-t)/(i-t),m=1-x;for(let g=0;g!==l;++g)s[g]=o[c+g]*m+o[a+g]*x;return s}let f=l*2,p=e-1;for(let x=0;x!==l;++x){let m=o[c+x],g=o[a+x],y=p*f+x*2,_=d[y],v=d[y+1],S=e*f+x*2,b=u[S],w=u[S+1],M=(n-t)/(i-t),A,C,E,N,F;for(let L=0;L<8;L++){A=M*M,C=A*M,E=1-M,N=E*E,F=N*E;let D=F*t+3*N*M*_+3*E*A*b+C*i-n;if(Math.abs(D)<1e-10)break;let U=3*N*(_-t)+6*E*M*(b-_)+3*A*(i-b);if(Math.abs(U)<1e-10)break;M=M-D/U,M=Math.max(0,Math.min(1,M))}s[x]=F*m+3*N*M*v+3*E*A*w+C*g}return s}},fn=class{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Oo(t,this.TimeBufferType),this.values=Oo(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Oo(e.times,Array),values:Oo(e.values,Array)};let i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new ll(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new ol(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new al(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new cl(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.settings=this.settings),t}setInterpolation(e){let t;switch(e){case ps:t=this.InterpolantFactoryMethodDiscrete;break;case ms:t=this.InterpolantFactoryMethodLinear;break;case Vo:t=this.InterpolantFactoryMethodSmooth;break;case fh:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Ie("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return ps;case this.InterpolantFactoryMethodLinear:return ms;case this.InterpolantFactoryMethodSmooth:return Vo;case this.InterpolantFactoryMethodBezier:return fh}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e}return this}trim(e,t){let n=this.times,i=n.length,s=0,o=i-1;for(;s!==i&&n[s]<e;)++s;for(;o!==-1&&n[o]>t;)--o;if(++o,s!==0||o!==i){s>=o&&(o=Math.max(o,1),s=o-1);let l=this.getValueSize();this.times=n.slice(s,o),this.values=this.values.slice(s*l,o*l)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(Oe("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,i=this.values,s=n.length;s===0&&(Oe("KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let l=0;l!==s;l++){let a=n[l];if(typeof a=="number"&&isNaN(a)){Oe("KeyframeTrack: Time is not a valid number.",this,l,a),e=!1;break}if(o!==null&&o>a){Oe("KeyframeTrack: Out of order keys.",this,l,a,o),e=!1;break}o=a}if(i!==void 0&&om(i))for(let l=0,a=i.length;l!==a;++l){let c=i[l];if(isNaN(c)){Oe("KeyframeTrack: Value is not a valid number.",this,l,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===Vo,s=e.length-1,o=1;for(let l=1;l<s;++l){let a=!1,c=e[l],h=e[l+1];if(c!==h&&(l!==1||c!==e[0]))if(i)a=!0;else{let u=l*n,d=u-n,f=u+n;for(let p=0;p!==n;++p){let x=t[u+p];if(x!==t[d+p]||x!==t[f+p]){a=!0;break}}}if(a){if(l!==o){e[o]=e[l];let u=l*n,d=o*n;for(let f=0;f!==n;++f)t[d+f]=t[u+f]}++o}}if(s>0){e[o]=e[s];for(let l=s*n,a=o*n,c=0;c!==n;++c)t[a+c]=t[l+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}};fn.prototype.ValueTypeName="";fn.prototype.TimeBufferType=Float32Array;fn.prototype.ValueBufferType=Float32Array;fn.prototype.DefaultInterpolation=ms;var Ei=class extends fn{constructor(e,t,n){super(e,t,n)}};Ei.prototype.ValueTypeName="bool";Ei.prototype.ValueBufferType=Array;Ei.prototype.DefaultInterpolation=ps;Ei.prototype.InterpolantFactoryMethodLinear=void 0;Ei.prototype.InterpolantFactoryMethodSmooth=void 0;var La=class extends fn{constructor(e,t,n,i){super(e,t,n,i)}};La.prototype.ValueTypeName="color";var ti=class extends fn{constructor(e,t,n,i){super(e,t,n,i)}};ti.prototype.ValueTypeName="number";var hl=class extends ei{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let s=this.resultBuffer,o=this.sampleValues,l=this.valueSize,a=(n-t)/(i-t),c=e*l;for(let h=c+l;c!==h;c+=4)Qt.slerpFlat(s,0,o,c-l,o,c,a);return s}},ni=class extends fn{constructor(e,t,n,i){super(e,t,n,i)}InterpolantFactoryMethodLinear(e){return new hl(this.times,this.values,this.getValueSize(),e)}};ni.prototype.ValueTypeName="quaternion";ni.prototype.InterpolantFactoryMethodSmooth=void 0;var Ri=class extends fn{constructor(e,t,n){super(e,t,n)}};Ri.prototype.ValueTypeName="string";Ri.prototype.ValueBufferType=Array;Ri.prototype.DefaultInterpolation=ps;Ri.prototype.InterpolantFactoryMethodLinear=void 0;Ri.prototype.InterpolantFactoryMethodSmooth=void 0;var ii=class extends fn{constructor(e,t,n,i){super(e,t,n,i)}};ii.prototype.ValueTypeName="vector";var Na=class{constructor(e="",t=-1,n=[],i=Df){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=Un(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,i=1/(e.fps||1);for(let o=0,l=n.length;o!==l;++o)t.push(Zm(n[o]).scale(i));let s=new this(e.name,e.duration,t,e.blendMode);return s.uuid=e.uuid,s.userData=JSON.parse(e.userData||"{}"),s}static toJSON(e){let t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let s=0,o=n.length;s!==o;++s)t.push(fn.toJSON(n[s]));return i}static CreateFromMorphTargetSequence(e,t,n,i){let s=t.length,o=[];for(let l=0;l<s;l++){let a=[],c=[];a.push((l+s-1)%s,l,(l+1)%s),c.push(0,1,0);let h=$m(a);a=cf(a,1,h),c=cf(c,1,h),!i&&a[0]===0&&(a.push(s),c.push(c[0])),o.push(new ti(".morphTargetInfluences["+t[l].name+"]",a,c).scale(1/n))}return new this(e,-1,o)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let i={},s=/^([\w-]*?)([\d]+)$/;for(let l=0,a=e.length;l<a;l++){let c=e[l],h=c.name.match(s);if(h&&h.length>1){let u=h[1],d=i[u];d||(i[u]=d=[]),d.push(c)}}let o=[];for(let l in i)o.push(this.CreateFromMorphTargetSequence(l,i[l],t,n));return o}static parseAnimation(e,t){if(Ie("AnimationClip: parseAnimation() is deprecated and will be removed with r185"),!e)return Oe("AnimationClip: No animation in JSONLoader data."),null;let n=function(u,d,f,p,x){if(f.length!==0){let m=[],g=[];Zf(f,m,g,p),m.length!==0&&x.push(new u(d,m,g))}},i=[],s=e.name||"default",o=e.fps||30,l=e.blendMode,a=e.length||-1,c=e.hierarchy||[];for(let u=0;u<c.length;u++){let d=c[u].keys;if(!(!d||d.length===0))if(d[0].morphTargets){let f={},p;for(p=0;p<d.length;p++)if(d[p].morphTargets)for(let x=0;x<d[p].morphTargets.length;x++)f[d[p].morphTargets[x]]=-1;for(let x in f){let m=[],g=[];for(let y=0;y!==d[p].morphTargets.length;++y){let _=d[p];m.push(_.time),g.push(_.morphTarget===x?1:0)}i.push(new ti(".morphTargetInfluence["+x+"]",m,g))}a=f.length*o}else{let f=".bones["+t[u].name+"]";n(ii,f+".position",d,"pos",i),n(ni,f+".quaternion",d,"rot",i),n(ii,f+".scale",d,"scl",i)}}return i.length===0?null:new this(s,a,i,l)}resetDuration(){let e=this.tracks,t=0;for(let n=0,i=e.length;n!==i;++n){let s=this.tracks[n];t=Math.max(t,s.times[s.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}};function Km(r){switch(r.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return ti;case"vector":case"vector2":case"vector3":case"vector4":return ii;case"color":return La;case"quaternion":return ni;case"bool":case"boolean":return Ei;case"string":return Ri}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+r)}function Zm(r){if(r.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let e=Km(r.type);if(r.times===void 0){let t=[],n=[];Zf(r.keys,t,n,"value"),r.times=t,r.values=n}return e.parse!==void 0?e.parse(r):new e(r.name,r.times,r.values,r.interpolation)}var Zn={enabled:!1,files:{},add:function(r,e){this.enabled!==!1&&(hf(r)||(this.files[r]=e))},get:function(r){if(this.enabled!==!1&&!hf(r))return this.files[r]},remove:function(r){delete this.files[r]},clear:function(){this.files={}}};function hf(r){try{let e=r.slice(r.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}var ul=class{constructor(e,t,n){let i=this,s=!1,o=0,l=0,a,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(h){l++,s===!1&&i.onStart!==void 0&&i.onStart(h,o,l),s=!0},this.itemEnd=function(h){o++,i.onProgress!==void 0&&i.onProgress(h,o,l),o===l&&(s=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return a?a(h):h},this.setURLModifier=function(h){return a=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){let f=c[u],p=c[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return p}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Jf=new ul,si=class{constructor(e){this.manager=e!==void 0?e:Jf,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(i,s){n.load(e,i,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};si.DEFAULT_MATERIAL_NAME="__DEFAULT";var wi={},yh=class extends Error{constructor(e,t){super(e),this.response=t}},rr=class extends si{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=Zn.get(`file:${e}`);if(s!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(s),this.manager.itemEnd(e)},0);return}if(wi[e]!==void 0){wi[e].push({onLoad:t,onProgress:n,onError:i});return}wi[e]=[],wi[e].push({onLoad:t,onProgress:n,onError:i});let o=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),l=this.mimeType,a=this.responseType;fetch(o).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&Ie("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;let h=wi[e],u=c.body.getReader(),d=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),f=d?parseInt(d):0,p=f!==0,x=0,m=new ReadableStream({start(g){y();function y(){u.read().then(({done:_,value:v})=>{if(_)g.close();else{x+=v.byteLength;let S=new ProgressEvent("progress",{lengthComputable:p,loaded:x,total:f});for(let b=0,w=h.length;b<w;b++){let M=h[b];M.onProgress&&M.onProgress(S)}g.enqueue(v),y()}},_=>{g.error(_)})}}});return new Response(m)}else throw new yh(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(a){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,l));case"json":return c.json();default:if(l==="")return c.text();{let u=/charset="?([^;"\s]*)"?/i.exec(l),d=u&&u[1]?u[1].toLowerCase():void 0,f=new TextDecoder(d);return c.arrayBuffer().then(p=>f.decode(p))}}}).then(c=>{Zn.add(`file:${e}`,c);let h=wi[e];delete wi[e];for(let u=0,d=h.length;u<d;u++){let f=h[u];f.onLoad&&f.onLoad(c)}}).catch(c=>{let h=wi[e];if(h===void 0)throw this.manager.itemError(e),c;delete wi[e];for(let u=0,d=h.length;u<d;u++){let f=h[u];f.onError&&f.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var Ws=new WeakMap,dl=class extends si{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=this,o=Zn.get(`image:${e}`);if(o!==void 0){if(o.complete===!0)s.manager.itemStart(e),setTimeout(function(){t&&t(o),s.manager.itemEnd(e)},0);else{let u=Ws.get(o);u===void 0&&(u=[],Ws.set(o,u)),u.push({onLoad:t,onError:i})}return o}let l=Ks("img");function a(){h(),t&&t(this);let u=Ws.get(this)||[];for(let d=0;d<u.length;d++){let f=u[d];f.onLoad&&f.onLoad(this)}Ws.delete(this),s.manager.itemEnd(e)}function c(u){h(),i&&i(u),Zn.remove(`image:${e}`);let d=Ws.get(this)||[];for(let f=0;f<d.length;f++){let p=d[f];p.onError&&p.onError(u)}Ws.delete(this),s.manager.itemError(e),s.manager.itemEnd(e)}function h(){l.removeEventListener("load",a,!1),l.removeEventListener("error",c,!1)}return l.addEventListener("load",a,!1),l.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(l.crossOrigin=this.crossOrigin),Zn.add(`image:${e}`,l),s.manager.itemStart(e),l.src=e,l}};var Fa=class extends si{constructor(e){super(e)}load(e,t,n,i){let s=new Dt,o=new dl(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(l){s.image=l,s.needsUpdate=!0,t!==void 0&&t(s)},n,i),s}},ar=class extends wt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Be(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}};var hh=new ke,uf=new z,df=new z,Da=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new et(512,512),this.mapType=pn,this.map=null,this.mapPass=null,this.matrix=new ke,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new tr,this._frameExtents=new et(1,1),this._viewportCount=1,this._viewports=[new pt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;uf.setFromMatrixPosition(e.matrixWorld),t.position.copy(uf),df.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(df),t.updateMatrixWorld(),hh.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(hh,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===$s||t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(hh)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Bo=new z,ko=new Qt,$n=new z,Ua=class extends wt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ke,this.projectionMatrix=new ke,this.projectionMatrixInverse=new ke,this.coordinateSystem=Dn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Bo,ko,$n),$n.x===1&&$n.y===1&&$n.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Bo,ko,$n.set(1,1,1)).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorld.decompose(Bo,ko,$n),$n.x===1&&$n.y===1&&$n.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Bo,ko,$n.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Wi=new z,ff=new et,pf=new et,Bt=class extends Ua{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=gs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(pa*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return gs*2*Math.atan(Math.tan(pa*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Wi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Wi.x,Wi.y).multiplyScalar(-e/Wi.z),Wi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Wi.x,Wi.y).multiplyScalar(-e/Wi.z)}getViewSize(e,t){return this.getViewBounds(e,ff,pf),t.subVectors(pf,ff)}setViewOffset(e,t,n,i,s,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(pa*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,s=-.5*i,o=this.view;if(this.view!==null&&this.view.enabled){let a=o.fullWidth,c=o.fullHeight;s+=o.offsetX*i/a,t-=o.offsetY*n/c,i*=o.width/a,n*=o.height/c}let l=this.filmOffset;l!==0&&(s+=e*l/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},vh=class extends Da{constructor(){super(new Bt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=gs*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,s=e.distance||t.far;(n!==t.fov||i!==t.aspect||s!==t.far)&&(t.fov=n,t.aspect=i,t.far=s,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}},Oa=class extends ar{constructor(e,t,n=0,i=Math.PI/3,s=0,o=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(wt.DEFAULT_UP),this.updateMatrix(),this.target=new wt,this.distance=n,this.angle=i,this.penumbra=s,this.decay=o,this.map=null,this.shadow=new vh}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}},bh=class extends Da{constructor(){super(new Bt(90,1,.5,500)),this.isPointLightShadow=!0}},Ba=class extends ar{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new bh}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},Zi=class extends Ua{constructor(e=-1,t=1,n=1,i=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,s=n-e,o=n+e,l=i+t,a=i-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,l-=h*this.view.offsetY,a=l-h*this.view.height}this.projectionMatrix.makeOrthographic(s,o,l,a,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Mh=class extends Da{constructor(){super(new Zi(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},ka=class extends ar{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(wt.DEFAULT_UP),this.updateMatrix(),this.target=new wt,this.shadow=new Mh}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}};var Ci=class{static extractUrlBase(e){let t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}};var uh=new WeakMap,Va=class extends si{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&Ie("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&Ie("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=this,o=Zn.get(`image-bitmap:${e}`);if(o!==void 0){if(s.manager.itemStart(e),o.then){o.then(c=>{uh.has(o)===!0?(i&&i(uh.get(o)),s.manager.itemError(e),s.manager.itemEnd(e)):(t&&t(c),s.manager.itemEnd(e))});return}setTimeout(function(){t&&t(o),s.manager.itemEnd(e)},0);return}let l={};l.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",l.headers=this.requestHeader,l.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let a=fetch(e,l).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign(s.options,{colorSpaceConversion:"none"}))}).then(function(c){Zn.add(`image-bitmap:${e}`,c),t&&t(c),s.manager.itemEnd(e)}).catch(function(c){i&&i(c),uh.set(a,c),Zn.remove(`image-bitmap:${e}`),s.manager.itemError(e),s.manager.itemEnd(e)});Zn.add(`image-bitmap:${e}`,a),s.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var Xs=-90,Ys=1,fl=class extends wt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let i=new Bt(Xs,Ys,e,t);i.layers=this.layers,this.add(i);let s=new Bt(Xs,Ys,e,t);s.layers=this.layers,this.add(s);let o=new Bt(Xs,Ys,e,t);o.layers=this.layers,this.add(o);let l=new Bt(Xs,Ys,e,t);l.layers=this.layers,this.add(l);let a=new Bt(Xs,Ys,e,t);a.layers=this.layers,this.add(a);let c=new Bt(Xs,Ys,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,i,s,o,l,a]=t;for(let c of t)this.remove(c);if(e===Dn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),l.up.set(0,1,0),l.lookAt(0,0,1),a.up.set(0,1,0),a.lookAt(0,0,-1);else if(e===$s)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),l.up.set(0,-1,0),l.lookAt(0,0,1),a.up.set(0,-1,0),a.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[s,o,l,a,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(n,0,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,1,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,2,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,3,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,4,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=x,e.setRenderTarget(n,5,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},pl=class extends Bt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var jh="\\[\\]\\.:\\/",Jm=new RegExp("["+jh+"]","g"),Qh="[^"+jh+"]",jm="[^"+jh.replace("\\.","")+"]",Qm=/((?:WC+[\/:])*)/.source.replace("WC",Qh),eg=/(WCOD+)?/.source.replace("WCOD",jm),tg=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Qh),ng=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Qh),ig=new RegExp("^"+Qm+eg+tg+ng+"$"),sg=["material","materials","bones","map"],Sh=class{constructor(e,t,n){let i=n||_t.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,s=n.length;i!==s;++i)n[i].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},_t=class r{constructor(e,t,n){this.path=t,this.parsedPath=n||r.parseTrackName(t),this.node=r.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new r.Composite(e,t,n):new r(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Jm,"")}static parseTrackName(e){let t=ig.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let s=n.nodeName.substring(i+1);sg.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(s){for(let o=0;o<s.length;o++){let l=s[o];if(l.name===t||l.uuid===t)return l;let a=n(l.children);if(a)return a}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,i=t.propertyName,s=t.propertyIndex;if(e||(e=r.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Ie("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){Oe("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Oe("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Oe("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Oe("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Oe("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){Oe("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){Oe("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[i];if(o===void 0){let c=t.nodeName;Oe("PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",e);return}let l=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?l=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(l=this.Versioning.MatrixWorldNeedsUpdate);let a=this.BindingType.Direct;if(s!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){Oe("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Oe("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}a=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=s}else o.fromArray!==void 0&&o.toArray!==void 0?(a=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(a=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[a],this.setValue=this.SetterByBindingTypeAndVersioning[a][l]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};_t.Composite=Sh;_t.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};_t.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};_t.prototype.GetterByBindingType=[_t.prototype._getValue_direct,_t.prototype._getValue_array,_t.prototype._getValue_arrayElement,_t.prototype._getValue_toArray];_t.prototype.SetterByBindingTypeAndVersioning=[[_t.prototype._setValue_direct,_t.prototype._setValue_direct_setNeedsUpdate,_t.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[_t.prototype._setValue_array,_t.prototype._setValue_array_setNeedsUpdate,_t.prototype._setValue_array_setMatrixWorldNeedsUpdate],[_t.prototype._setValue_arrayElement,_t.prototype._setValue_arrayElement_setNeedsUpdate,_t.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[_t.prototype._setValue_fromArray,_t.prototype._setValue_fromArray_setNeedsUpdate,_t.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var ob=new Float32Array(1);var ru=class ru{constructor(e,t,n,i){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,i){let s=this.elements;return s[0]=e,s[2]=t,s[1]=n,s[3]=i,this}};ru.prototype.isMatrix2=!0;var wh=ru;function eu(r,e,t,n){let i=rg(n);switch(t){case Xh:return r*e;case Sl:return r*e/i.components*i.byteLength;case wl:return r*e/i.components*i.byteLength;case Qi:return r*e*2/i.components*i.byteLength;case Tl:return r*e*2/i.components*i.byteLength;case Yh:return r*e*3/i.components*i.byteLength;case Mn:return r*e*4/i.components*i.byteLength;case Al:return r*e*4/i.components*i.byteLength;case Ya:case qa:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case $a:case Ka:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case Rl:case Il:return Math.max(r,16)*Math.max(e,8)/4;case El:case Cl:return Math.max(r,8)*Math.max(e,8)/2;case Pl:case Ll:case Fl:case Dl:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case Nl:case Za:case Ul:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case Ol:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case Bl:return Math.floor((r+4)/5)*Math.floor((e+3)/4)*16;case kl:return Math.floor((r+4)/5)*Math.floor((e+4)/5)*16;case Vl:return Math.floor((r+5)/6)*Math.floor((e+4)/5)*16;case zl:return Math.floor((r+5)/6)*Math.floor((e+5)/6)*16;case Hl:return Math.floor((r+7)/8)*Math.floor((e+4)/5)*16;case Gl:return Math.floor((r+7)/8)*Math.floor((e+5)/6)*16;case Wl:return Math.floor((r+7)/8)*Math.floor((e+7)/8)*16;case Xl:return Math.floor((r+9)/10)*Math.floor((e+4)/5)*16;case Yl:return Math.floor((r+9)/10)*Math.floor((e+5)/6)*16;case ql:return Math.floor((r+9)/10)*Math.floor((e+7)/8)*16;case $l:return Math.floor((r+9)/10)*Math.floor((e+9)/10)*16;case Kl:return Math.floor((r+11)/12)*Math.floor((e+9)/10)*16;case Zl:return Math.floor((r+11)/12)*Math.floor((e+11)/12)*16;case Jl:case jl:case Ql:return Math.ceil(r/4)*Math.ceil(e/4)*16;case ec:case tc:return Math.ceil(r/4)*Math.ceil(e/4)*8;case Ja:case nc:return Math.ceil(r/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function rg(r){switch(r){case pn:case zh:return{byteLength:1,components:1};case hr:case Hh:case ai:return{byteLength:2,components:1};case bl:case Ml:return{byteLength:2,components:4};case Hn:case vl:case bn:return{byteLength:4,components:1};case Gh:case Wh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${r}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"184"}}));typeof window<"u"&&(window.__THREE__?Ie("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="184");function vp(){let r=null,e=!1,t=null,n=null;function i(s,o){t(s,o),n=r.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&r!==null&&(n=r.requestAnimationFrame(i),e=!0)},stop:function(){r!==null&&r.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){r=s}}}function og(r){let e=new WeakMap;function t(l,a){let c=l.array,h=l.usage,u=c.byteLength,d=r.createBuffer();r.bindBuffer(a,d),r.bufferData(a,c,h),l.onUploadCallback();let f;if(c instanceof Float32Array)f=r.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=r.HALF_FLOAT;else if(c instanceof Uint16Array)l.isFloat16BufferAttribute?f=r.HALF_FLOAT:f=r.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=r.SHORT;else if(c instanceof Uint32Array)f=r.UNSIGNED_INT;else if(c instanceof Int32Array)f=r.INT;else if(c instanceof Int8Array)f=r.BYTE;else if(c instanceof Uint8Array)f=r.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:l.version,size:u}}function n(l,a,c){let h=a.array,u=a.updateRanges;if(r.bindBuffer(c,l),u.length===0)r.bufferSubData(c,0,h);else{u.sort((f,p)=>f.start-p.start);let d=0;for(let f=1;f<u.length;f++){let p=u[d],x=u[f];x.start<=p.start+p.count+1?p.count=Math.max(p.count,x.start+x.count-p.start):(++d,u[d]=x)}u.length=d+1;for(let f=0,p=u.length;f<p;f++){let x=u[f];r.bufferSubData(c,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}a.clearUpdateRanges()}a.onUploadCallback()}function i(l){return l.isInterleavedBufferAttribute&&(l=l.data),e.get(l)}function s(l){l.isInterleavedBufferAttribute&&(l=l.data);let a=e.get(l);a&&(r.deleteBuffer(a.buffer),e.delete(l))}function o(l,a){if(l.isInterleavedBufferAttribute&&(l=l.data),l.isGLBufferAttribute){let h=e.get(l);(!h||h.version<l.version)&&e.set(l,{buffer:l.buffer,type:l.type,bytesPerElement:l.elementSize,version:l.version});return}let c=e.get(l);if(c===void 0)e.set(l,t(l,a));else if(c.version<l.version){if(c.size!==l.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,l,a),c.version=l.version}}return{get:i,remove:s,update:o}}var lg=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,cg=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,hg=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,ug=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,dg=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,fg=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,pg=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,mg=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,gg=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,xg=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,_g=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,yg=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,vg=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,bg=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Mg=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Sg=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,wg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Tg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ag=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Eg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Rg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Cg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Ig=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Pg=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Lg=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Ng=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Fg=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Dg=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Ug=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Og=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Bg="gl_FragColor = linearToOutputTexel( gl_FragColor );",kg=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Vg=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,zg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Hg=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Gg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Wg=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Xg=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Yg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,qg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,$g=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Kg=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Zg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Jg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,jg=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Qg=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,e0=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,t0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,n0=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,i0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,s0=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,r0=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,a0=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,o0=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = inverseTransformDirection( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,l0=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,c0=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,h0=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,u0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,d0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,f0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,p0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,m0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,g0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,x0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,_0=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,y0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,v0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,b0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,M0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,S0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,w0=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,T0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,A0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,E0=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,R0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,C0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,I0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,P0=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,L0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,N0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,F0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,D0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,U0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,O0=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,B0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,k0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,V0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,z0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,H0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,G0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,W0=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,X0=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Y0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,q0=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,$0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,K0=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Z0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,J0=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,j0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Q0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,ex=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tx=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,nx=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,ix=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,sx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,rx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,ax=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,ox=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,lx=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,cx=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,hx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ux=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,dx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,fx=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,px=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,mx=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,gx=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,xx=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,_x=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,yx=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,vx=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,bx=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Mx=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Sx=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,wx=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Tx=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ax=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Ex=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Rx=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Cx=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Ix=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Px=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Lx=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Nx=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Fx=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Dx=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ux=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Ox=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Bx=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,kx=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Vx=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,zx=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,$e={alphahash_fragment:lg,alphahash_pars_fragment:cg,alphamap_fragment:hg,alphamap_pars_fragment:ug,alphatest_fragment:dg,alphatest_pars_fragment:fg,aomap_fragment:pg,aomap_pars_fragment:mg,batching_pars_vertex:gg,batching_vertex:xg,begin_vertex:_g,beginnormal_vertex:yg,bsdfs:vg,iridescence_fragment:bg,bumpmap_pars_fragment:Mg,clipping_planes_fragment:Sg,clipping_planes_pars_fragment:wg,clipping_planes_pars_vertex:Tg,clipping_planes_vertex:Ag,color_fragment:Eg,color_pars_fragment:Rg,color_pars_vertex:Cg,color_vertex:Ig,common:Pg,cube_uv_reflection_fragment:Lg,defaultnormal_vertex:Ng,displacementmap_pars_vertex:Fg,displacementmap_vertex:Dg,emissivemap_fragment:Ug,emissivemap_pars_fragment:Og,colorspace_fragment:Bg,colorspace_pars_fragment:kg,envmap_fragment:Vg,envmap_common_pars_fragment:zg,envmap_pars_fragment:Hg,envmap_pars_vertex:Gg,envmap_physical_pars_fragment:e0,envmap_vertex:Wg,fog_vertex:Xg,fog_pars_vertex:Yg,fog_fragment:qg,fog_pars_fragment:$g,gradientmap_pars_fragment:Kg,lightmap_pars_fragment:Zg,lights_lambert_fragment:Jg,lights_lambert_pars_fragment:jg,lights_pars_begin:Qg,lights_toon_fragment:t0,lights_toon_pars_fragment:n0,lights_phong_fragment:i0,lights_phong_pars_fragment:s0,lights_physical_fragment:r0,lights_physical_pars_fragment:a0,lights_fragment_begin:o0,lights_fragment_maps:l0,lights_fragment_end:c0,lightprobes_pars_fragment:h0,logdepthbuf_fragment:u0,logdepthbuf_pars_fragment:d0,logdepthbuf_pars_vertex:f0,logdepthbuf_vertex:p0,map_fragment:m0,map_pars_fragment:g0,map_particle_fragment:x0,map_particle_pars_fragment:_0,metalnessmap_fragment:y0,metalnessmap_pars_fragment:v0,morphinstance_vertex:b0,morphcolor_vertex:M0,morphnormal_vertex:S0,morphtarget_pars_vertex:w0,morphtarget_vertex:T0,normal_fragment_begin:A0,normal_fragment_maps:E0,normal_pars_fragment:R0,normal_pars_vertex:C0,normal_vertex:I0,normalmap_pars_fragment:P0,clearcoat_normal_fragment_begin:L0,clearcoat_normal_fragment_maps:N0,clearcoat_pars_fragment:F0,iridescence_pars_fragment:D0,opaque_fragment:U0,packing:O0,premultiplied_alpha_fragment:B0,project_vertex:k0,dithering_fragment:V0,dithering_pars_fragment:z0,roughnessmap_fragment:H0,roughnessmap_pars_fragment:G0,shadowmap_pars_fragment:W0,shadowmap_pars_vertex:X0,shadowmap_vertex:Y0,shadowmask_pars_fragment:q0,skinbase_vertex:$0,skinning_pars_vertex:K0,skinning_vertex:Z0,skinnormal_vertex:J0,specularmap_fragment:j0,specularmap_pars_fragment:Q0,tonemapping_fragment:ex,tonemapping_pars_fragment:tx,transmission_fragment:nx,transmission_pars_fragment:ix,uv_pars_fragment:sx,uv_pars_vertex:rx,uv_vertex:ax,worldpos_vertex:ox,background_vert:lx,background_frag:cx,backgroundCube_vert:hx,backgroundCube_frag:ux,cube_vert:dx,cube_frag:fx,depth_vert:px,depth_frag:mx,distance_vert:gx,distance_frag:xx,equirect_vert:_x,equirect_frag:yx,linedashed_vert:vx,linedashed_frag:bx,meshbasic_vert:Mx,meshbasic_frag:Sx,meshlambert_vert:wx,meshlambert_frag:Tx,meshmatcap_vert:Ax,meshmatcap_frag:Ex,meshnormal_vert:Rx,meshnormal_frag:Cx,meshphong_vert:Ix,meshphong_frag:Px,meshphysical_vert:Lx,meshphysical_frag:Nx,meshtoon_vert:Fx,meshtoon_frag:Dx,points_vert:Ux,points_frag:Ox,shadow_vert:Bx,shadow_frag:kx,sprite_vert:Vx,sprite_frag:zx},_e={common:{diffuse:{value:new Be(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ze},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ze}},envmap:{envMap:{value:null},envMapRotation:{value:new ze},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ze}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ze}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ze},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ze},normalScale:{value:new et(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ze},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ze}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ze}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ze}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Be(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new z},probesMax:{value:new z},probesResolution:{value:new z}},points:{diffuse:{value:new Be(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0},uvTransform:{value:new ze}},sprite:{diffuse:{value:new Be(16777215)},opacity:{value:1},center:{value:new et(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ze},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0}}},li={basic:{uniforms:tn([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.fog]),vertexShader:$e.meshbasic_vert,fragmentShader:$e.meshbasic_frag},lambert:{uniforms:tn([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,_e.lights,{emissive:{value:new Be(0)},envMapIntensity:{value:1}}]),vertexShader:$e.meshlambert_vert,fragmentShader:$e.meshlambert_frag},phong:{uniforms:tn([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,_e.lights,{emissive:{value:new Be(0)},specular:{value:new Be(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:$e.meshphong_vert,fragmentShader:$e.meshphong_frag},standard:{uniforms:tn([_e.common,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.roughnessmap,_e.metalnessmap,_e.fog,_e.lights,{emissive:{value:new Be(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:$e.meshphysical_vert,fragmentShader:$e.meshphysical_frag},toon:{uniforms:tn([_e.common,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.gradientmap,_e.fog,_e.lights,{emissive:{value:new Be(0)}}]),vertexShader:$e.meshtoon_vert,fragmentShader:$e.meshtoon_frag},matcap:{uniforms:tn([_e.common,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,{matcap:{value:null}}]),vertexShader:$e.meshmatcap_vert,fragmentShader:$e.meshmatcap_frag},points:{uniforms:tn([_e.points,_e.fog]),vertexShader:$e.points_vert,fragmentShader:$e.points_frag},dashed:{uniforms:tn([_e.common,_e.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:$e.linedashed_vert,fragmentShader:$e.linedashed_frag},depth:{uniforms:tn([_e.common,_e.displacementmap]),vertexShader:$e.depth_vert,fragmentShader:$e.depth_frag},normal:{uniforms:tn([_e.common,_e.bumpmap,_e.normalmap,_e.displacementmap,{opacity:{value:1}}]),vertexShader:$e.meshnormal_vert,fragmentShader:$e.meshnormal_frag},sprite:{uniforms:tn([_e.sprite,_e.fog]),vertexShader:$e.sprite_vert,fragmentShader:$e.sprite_frag},background:{uniforms:{uvTransform:{value:new ze},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:$e.background_vert,fragmentShader:$e.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ze}},vertexShader:$e.backgroundCube_vert,fragmentShader:$e.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:$e.cube_vert,fragmentShader:$e.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:$e.equirect_vert,fragmentShader:$e.equirect_frag},distance:{uniforms:tn([_e.common,_e.displacementmap,{referencePosition:{value:new z},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:$e.distance_vert,fragmentShader:$e.distance_frag},shadow:{uniforms:tn([_e.lights,_e.fog,{color:{value:new Be(0)},opacity:{value:1}}]),vertexShader:$e.shadow_vert,fragmentShader:$e.shadow_frag}};li.physical={uniforms:tn([li.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ze},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ze},clearcoatNormalScale:{value:new et(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ze},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ze},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ze},sheen:{value:0},sheenColor:{value:new Be(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ze},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ze},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ze},transmissionSamplerSize:{value:new et},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ze},attenuationDistance:{value:0},attenuationColor:{value:new Be(0)},specularColor:{value:new Be(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ze},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ze},anisotropyVector:{value:new et},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ze}}]),vertexShader:$e.meshphysical_vert,fragmentShader:$e.meshphysical_frag};var ac={r:0,b:0,g:0},Hx=new ke,bp=new ze;bp.set(-1,0,0,0,1,0,0,0,1);function Gx(r,e,t,n,i,s){let o=new Be(0),l=i===!0?0:1,a,c,h=null,u=0,d=null;function f(y){let _=y.isScene===!0?y.background:null;if(_&&_.isTexture){let v=y.backgroundBlurriness>0;_=e.get(_,v)}return _}function p(y){let _=!1,v=f(y);v===null?m(o,l):v&&v.isColor&&(m(v,1),_=!0);let S=r.xr.getEnvironmentBlendMode();S==="additive"?t.buffers.color.setClear(0,0,0,1,s):S==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,s),(r.autoClear||_)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function x(y,_){let v=f(_);v&&(v.isCubeTexture||v.mapping===Xa)?(c===void 0&&(c=new It(new sr(1,1,1),new on({name:"BackgroundCubeMaterial",uniforms:Ss(li.backgroundCube.uniforms),vertexShader:li.backgroundCube.vertexShader,fragmentShader:li.backgroundCube.fragmentShader,side:ln,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(S,b,w){this.matrixWorld.copyPosition(w.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=v,c.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(Hx.makeRotationFromEuler(_.backgroundRotation)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(bp),c.material.toneMapped=Je.getTransfer(v.colorSpace)!==at,(h!==v||u!==v.version||d!==r.toneMapping)&&(c.material.needsUpdate=!0,h=v,u=v.version,d=r.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null)):v&&v.isTexture&&(a===void 0&&(a=new It(new Pa(2,2),new on({name:"BackgroundMaterial",uniforms:Ss(li.background.uniforms),vertexShader:li.background.vertexShader,fragmentShader:li.background.fragmentShader,side:On,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),a.geometry.deleteAttribute("normal"),Object.defineProperty(a.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(a)),a.material.uniforms.t2D.value=v,a.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,a.material.toneMapped=Je.getTransfer(v.colorSpace)!==at,v.matrixAutoUpdate===!0&&v.updateMatrix(),a.material.uniforms.uvTransform.value.copy(v.matrix),(h!==v||u!==v.version||d!==r.toneMapping)&&(a.material.needsUpdate=!0,h=v,u=v.version,d=r.toneMapping),a.layers.enableAll(),y.unshift(a,a.geometry,a.material,0,0,null))}function m(y,_){y.getRGB(ac,Jh(r)),t.buffers.color.setClear(ac.r,ac.g,ac.b,_,s)}function g(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),a!==void 0&&(a.geometry.dispose(),a.material.dispose(),a=void 0)}return{getClearColor:function(){return o},setClearColor:function(y,_=1){o.set(y),l=_,m(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(y){l=y,m(o,l)},render:p,addToRenderList:x,dispose:g}}function Wx(r,e){let t=r.getParameter(r.MAX_VERTEX_ATTRIBS),n={},i=d(null),s=i,o=!1;function l(E,N,F,L,I){let D=!1,U=u(E,L,F,N);s!==U&&(s=U,c(s.object)),D=f(E,L,F,I),D&&p(E,L,F,I),I!==null&&e.update(I,r.ELEMENT_ARRAY_BUFFER),(D||o)&&(o=!1,v(E,N,F,L),I!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,e.get(I).buffer))}function a(){return r.createVertexArray()}function c(E){return r.bindVertexArray(E)}function h(E){return r.deleteVertexArray(E)}function u(E,N,F,L){let I=L.wireframe===!0,D=n[N.id];D===void 0&&(D={},n[N.id]=D);let U=E.isInstancedMesh===!0?E.id:0,Y=D[U];Y===void 0&&(Y={},D[U]=Y);let X=Y[F.id];X===void 0&&(X={},Y[F.id]=X);let ee=X[I];return ee===void 0&&(ee=d(a()),X[I]=ee),ee}function d(E){let N=[],F=[],L=[];for(let I=0;I<t;I++)N[I]=0,F[I]=0,L[I]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:N,enabledAttributes:F,attributeDivisors:L,object:E,attributes:{},index:null}}function f(E,N,F,L){let I=s.attributes,D=N.attributes,U=0,Y=F.getAttributes();for(let X in Y)if(Y[X].location>=0){let ae=I[X],ce=D[X];if(ce===void 0&&(X==="instanceMatrix"&&E.instanceMatrix&&(ce=E.instanceMatrix),X==="instanceColor"&&E.instanceColor&&(ce=E.instanceColor)),ae===void 0||ae.attribute!==ce||ce&&ae.data!==ce.data)return!0;U++}return s.attributesNum!==U||s.index!==L}function p(E,N,F,L){let I={},D=N.attributes,U=0,Y=F.getAttributes();for(let X in Y)if(Y[X].location>=0){let ae=D[X];ae===void 0&&(X==="instanceMatrix"&&E.instanceMatrix&&(ae=E.instanceMatrix),X==="instanceColor"&&E.instanceColor&&(ae=E.instanceColor));let ce={};ce.attribute=ae,ae&&ae.data&&(ce.data=ae.data),I[X]=ce,U++}s.attributes=I,s.attributesNum=U,s.index=L}function x(){let E=s.newAttributes;for(let N=0,F=E.length;N<F;N++)E[N]=0}function m(E){g(E,0)}function g(E,N){let F=s.newAttributes,L=s.enabledAttributes,I=s.attributeDivisors;F[E]=1,L[E]===0&&(r.enableVertexAttribArray(E),L[E]=1),I[E]!==N&&(r.vertexAttribDivisor(E,N),I[E]=N)}function y(){let E=s.newAttributes,N=s.enabledAttributes;for(let F=0,L=N.length;F<L;F++)N[F]!==E[F]&&(r.disableVertexAttribArray(F),N[F]=0)}function _(E,N,F,L,I,D,U){U===!0?r.vertexAttribIPointer(E,N,F,I,D):r.vertexAttribPointer(E,N,F,L,I,D)}function v(E,N,F,L){x();let I=L.attributes,D=F.getAttributes(),U=N.defaultAttributeValues;for(let Y in D){let X=D[Y];if(X.location>=0){let ee=I[Y];if(ee===void 0&&(Y==="instanceMatrix"&&E.instanceMatrix&&(ee=E.instanceMatrix),Y==="instanceColor"&&E.instanceColor&&(ee=E.instanceColor)),ee!==void 0){let ae=ee.normalized,ce=ee.itemSize,oe=e.get(ee);if(oe===void 0)continue;let Me=oe.buffer,me=oe.type,K=oe.bytesPerElement,le=me===r.INT||me===r.UNSIGNED_INT||ee.gpuType===vl;if(ee.isInterleavedBufferAttribute){let te=ee.data,Te=te.stride,Re=ee.offset;if(te.isInstancedInterleavedBuffer){for(let Ne=0;Ne<X.locationSize;Ne++)g(X.location+Ne,te.meshPerAttribute);E.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let Ne=0;Ne<X.locationSize;Ne++)m(X.location+Ne);r.bindBuffer(r.ARRAY_BUFFER,Me);for(let Ne=0;Ne<X.locationSize;Ne++)_(X.location+Ne,ce/X.locationSize,me,ae,Te*K,(Re+ce/X.locationSize*Ne)*K,le)}else{if(ee.isInstancedBufferAttribute){for(let te=0;te<X.locationSize;te++)g(X.location+te,ee.meshPerAttribute);E.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=ee.meshPerAttribute*ee.count)}else for(let te=0;te<X.locationSize;te++)m(X.location+te);r.bindBuffer(r.ARRAY_BUFFER,Me);for(let te=0;te<X.locationSize;te++)_(X.location+te,ce/X.locationSize,me,ae,ce*K,ce/X.locationSize*te*K,le)}}else if(U!==void 0){let ae=U[Y];if(ae!==void 0)switch(ae.length){case 2:r.vertexAttrib2fv(X.location,ae);break;case 3:r.vertexAttrib3fv(X.location,ae);break;case 4:r.vertexAttrib4fv(X.location,ae);break;default:r.vertexAttrib1fv(X.location,ae)}}}}y()}function S(){A();for(let E in n){let N=n[E];for(let F in N){let L=N[F];for(let I in L){let D=L[I];for(let U in D)h(D[U].object),delete D[U];delete L[I]}}delete n[E]}}function b(E){if(n[E.id]===void 0)return;let N=n[E.id];for(let F in N){let L=N[F];for(let I in L){let D=L[I];for(let U in D)h(D[U].object),delete D[U];delete L[I]}}delete n[E.id]}function w(E){for(let N in n){let F=n[N];for(let L in F){let I=F[L];if(I[E.id]===void 0)continue;let D=I[E.id];for(let U in D)h(D[U].object),delete D[U];delete I[E.id]}}}function M(E){for(let N in n){let F=n[N],L=E.isInstancedMesh===!0?E.id:0,I=F[L];if(I!==void 0){for(let D in I){let U=I[D];for(let Y in U)h(U[Y].object),delete U[Y];delete I[D]}delete F[L],Object.keys(F).length===0&&delete n[N]}}}function A(){C(),o=!0,s!==i&&(s=i,c(s.object))}function C(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:l,reset:A,resetDefaultState:C,dispose:S,releaseStatesOfGeometry:b,releaseStatesOfObject:M,releaseStatesOfProgram:w,initAttributes:x,enableAttribute:m,disableUnusedAttributes:y}}function Xx(r,e,t){let n;function i(a){n=a}function s(a,c){r.drawArrays(n,a,c),t.update(c,n,1)}function o(a,c,h){h!==0&&(r.drawArraysInstanced(n,a,c,h),t.update(c,n,h))}function l(a,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,a,0,c,0,h);let d=0;for(let f=0;f<h;f++)d+=c[f];t.update(d,n,1)}this.setMode=i,this.render=s,this.renderInstances=o,this.renderMultiDraw=l}function Yx(r,e,t,n){let i;function s(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){let w=e.get("EXT_texture_filter_anisotropic");i=r.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(w){return!(w!==Mn&&n.convert(w)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function l(w){let M=w===ai&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(w!==pn&&n.convert(w)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&w!==bn&&!M)}function a(w){if(w==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",h=a(c);h!==c&&(Ie("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let u=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&d===!1&&Ie("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let f=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),p=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=r.getParameter(r.MAX_TEXTURE_SIZE),m=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),g=r.getParameter(r.MAX_VERTEX_ATTRIBS),y=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),_=r.getParameter(r.MAX_VARYING_VECTORS),v=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),S=r.getParameter(r.MAX_SAMPLES),b=r.getParameter(r.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:a,textureFormatReadable:o,textureTypeReadable:l,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:p,maxTextureSize:x,maxCubemapSize:m,maxAttributes:g,maxVertexUniforms:y,maxVaryings:_,maxFragmentUniforms:v,maxSamples:S,samples:b}}function qx(r){let e=this,t=null,n=0,i=!1,s=!1,o=new Kn,l=new ze,a={value:null,needsUpdate:!1};this.uniform=a,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let f=u.length!==0||d||n!==0||i;return i=d,n=u.length,f},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,f){let p=u.clippingPlanes,x=u.clipIntersection,m=u.clipShadows,g=r.get(u);if(!i||p===null||p.length===0||s&&!m)s?h(null):c();else{let y=s?0:n,_=y*4,v=g.clippingState||null;a.value=v,v=h(p,d,_,f);for(let S=0;S!==_;++S)v[S]=t[S];g.clippingState=v,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=y}};function c(){a.value!==t&&(a.value=t,a.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,f,p){let x=u!==null?u.length:0,m=null;if(x!==0){if(m=a.value,p!==!0||m===null){let g=f+x*4,y=d.matrixWorldInverse;l.getNormalMatrix(y),(m===null||m.length<g)&&(m=new Float32Array(g));for(let _=0,v=f;_!==x;++_,v+=4)o.copy(u[_]).applyMatrix4(y,l),o.normal.toArray(m,v),m[v+3]=o.constant}a.value=m,a.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,m}}var es=4,jf=[.125,.215,.35,.446,.526,.582],ws=20,$x=256,Qa=new Zi,Qf=new Be,au=null,ou=0,lu=0,cu=!1,Kx=new z,lc=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,i=100,s={}){let{size:o=256,position:l=Kx}=s;au=this._renderer.getRenderTarget(),ou=this._renderer.getActiveCubeFace(),lu=this._renderer.getActiveMipmapLevel(),cu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let a=this._allocateTargets();return a.depthBuffer=!0,this._sceneToCubeUV(e,n,i,a,l),t>0&&this._blur(a,0,0,t),this._applyPMREM(a),this._cleanup(a),a}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=np(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=tp(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(au,ou,lu),this._renderer.xr.enabled=cu,e.scissorTest=!1,fr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ji||e.mapping===bs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),au=this._renderer.getRenderTarget(),ou=this._renderer.getActiveCubeFace(),lu=this._renderer.getActiveMipmapLevel(),cu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Mt,minFilter:Mt,generateMipmaps:!1,type:ai,format:Mn,colorSpace:an,depthBuffer:!1},i=ep(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ep(e,t,n);let{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=Zx(s)),this._blurMaterial=jx(s,e,t),this._ggxMaterial=Jx(s,e,t)}return i}_compileMaterial(e){let t=new It(new qt,e);this._renderer.compile(t,Qa)}_sceneToCubeUV(e,t,n,i,s){let a=new Bt(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(Qf),u.toneMapping=Vn,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(i),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new It(new sr,new $t({name:"PMREM.Background",side:ln,depthWrite:!1,depthTest:!1})));let x=this._backgroundBox,m=x.material,g=!1,y=e.background;y?y.isColor&&(m.color.copy(y),e.background=null,g=!0):(m.color.copy(Qf),g=!0);for(let _=0;_<6;_++){let v=_%3;v===0?(a.up.set(0,c[_],0),a.position.set(s.x,s.y,s.z),a.lookAt(s.x+h[_],s.y,s.z)):v===1?(a.up.set(0,0,c[_]),a.position.set(s.x,s.y,s.z),a.lookAt(s.x,s.y+h[_],s.z)):(a.up.set(0,c[_],0),a.position.set(s.x,s.y,s.z),a.lookAt(s.x,s.y,s.z+h[_]));let S=this._cubeSize;fr(i,v*S,_>2?S:0,S,S),u.setRenderTarget(i),g&&u.render(x,a),u.render(e,a)}u.toneMapping=f,u.autoClear=d,e.background=y}_textureToCubeUV(e,t){let n=this._renderer,i=e.mapping===Ji||e.mapping===bs;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=np()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=tp());let s=i?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=s;let l=s.uniforms;l.envMap.value=e;let a=this._cubeSize;fr(t,0,0,3*a,2*a),n.setRenderTarget(t),n.render(o,Qa)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let i=this._lodMeshes.length;for(let s=1;s<i;s++)this._applyGGXFilter(e,s-1,s);t.autoClear=n}_applyGGXFilter(e,t,n){let i=this._renderer,s=this._pingPongRenderTarget,o=this._ggxMaterial,l=this._lodMeshes[n];l.material=o;let a=o.uniforms,c=n/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-h*h),d=0+c*1.25,f=u*d,{_lodMax:p}=this,x=this._sizeLods[n],m=3*x*(n>p-es?n-p+es:0),g=4*(this._cubeSize-x);a.envMap.value=e.texture,a.roughness.value=f,a.mipInt.value=p-t,fr(s,m,g,3*x,2*x),i.setRenderTarget(s),i.render(l,Qa),a.envMap.value=s.texture,a.roughness.value=0,a.mipInt.value=p-n,fr(e,m,g,3*x,2*x),i.setRenderTarget(e),i.render(l,Qa)}_blur(e,t,n,i,s){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,i,"latitudinal",s),this._halfBlur(o,e,n,n,i,"longitudinal",s)}_halfBlur(e,t,n,i,s,o,l){let a=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&Oe("blur direction must be either latitudinal or longitudinal!");let h=3,u=this._lodMeshes[i];u.material=c;let d=c.uniforms,f=this._sizeLods[n]-1,p=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*ws-1),x=s/p,m=isFinite(s)?1+Math.floor(h*x):ws;m>ws&&Ie(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${ws}`);let g=[],y=0;for(let w=0;w<ws;++w){let M=w/x,A=Math.exp(-M*M/2);g.push(A),w===0?y+=A:w<m&&(y+=2*A)}for(let w=0;w<g.length;w++)g[w]=g[w]/y;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=g,d.latitudinal.value=o==="latitudinal",l&&(d.poleAxis.value=l);let{_lodMax:_}=this;d.dTheta.value=p,d.mipInt.value=_-n;let v=this._sizeLods[i],S=3*v*(i>_-es?i-_+es:0),b=4*(this._cubeSize-v);fr(t,S,b,3*v,2*v),a.setRenderTarget(t),a.render(u,Qa)}};function Zx(r){let e=[],t=[],n=[],i=r,s=r-es+1+jf.length;for(let o=0;o<s;o++){let l=Math.pow(2,i);e.push(l);let a=1/l;o>r-es?a=jf[o-r+es-1]:o===0&&(a=0),t.push(a);let c=1/(l-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,p=6,x=3,m=2,g=1,y=new Float32Array(x*p*f),_=new Float32Array(m*p*f),v=new Float32Array(g*p*f);for(let b=0;b<f;b++){let w=b%3*2/3-1,M=b>2?0:-1,A=[w,M,0,w+2/3,M,0,w+2/3,M+1,0,w,M,0,w+2/3,M+1,0,w,M+1,0];y.set(A,x*p*b),_.set(d,m*p*b);let C=[b,b,b,b,b,b];v.set(C,g*p*b)}let S=new qt;S.setAttribute("position",new At(y,x)),S.setAttribute("uv",new At(_,m)),S.setAttribute("faceIndex",new At(v,g)),n.push(new It(S,null)),i>es&&i--}return{lodMeshes:n,sizeLods:e,sigmas:t}}function ep(r,e,t){let n=new yn(r,e,t);return n.texture.mapping=Xa,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function fr(r,e,t,n,i){r.viewport.set(e,t,n,i),r.scissor.set(e,t,n,i)}function Jx(r,e,t){return new on({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:$x,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:uc(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:ri,depthTest:!1,depthWrite:!1})}function jx(r,e,t){let n=new Float32Array(ws),i=new z(0,1,0);return new on({name:"SphericalGaussianBlur",defines:{n:ws,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:uc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:ri,depthTest:!1,depthWrite:!1})}function tp(){return new on({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:uc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ri,depthTest:!1,depthWrite:!1})}function np(){return new on({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:uc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ri,depthTest:!1,depthWrite:!1})}function uc(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}var cc=class extends yn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new Ca(i),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new sr(5,5,5),s=new on({name:"CubemapFromEquirect",uniforms:Ss(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:ln,blending:ri});s.uniforms.tEquirect.value=t;let o=new It(i,s),l=t.minFilter;return t.minFilter===zn&&(t.minFilter=Mt),new fl(1,10,this).update(e,o),t.minFilter=l,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,n=!0,i=!0){let s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,i);e.setRenderTarget(s)}};function Qx(r){let e=new WeakMap,t=new WeakMap,n=null;function i(d,f=!1){return d==null?null:f?o(d):s(d)}function s(d){if(d&&d.isTexture){let f=d.mapping;if(f===xl||f===_l)if(e.has(d)){let p=e.get(d).texture;return l(p,d.mapping)}else{let p=d.image;if(p&&p.height>0){let x=new cc(p.height);return x.fromEquirectangularTexture(r,d),e.set(d,x),d.addEventListener("dispose",c),l(x.texture,d.mapping)}else return null}}return d}function o(d){if(d&&d.isTexture){let f=d.mapping,p=f===xl||f===_l,x=f===Ji||f===bs;if(p||x){let m=t.get(d),g=m!==void 0?m.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==g)return n===null&&(n=new lc(r)),m=p?n.fromEquirectangular(d,m):n.fromCubemap(d,m),m.texture.pmremVersion=d.pmremVersion,t.set(d,m),m.texture;if(m!==void 0)return m.texture;{let y=d.image;return p&&y&&y.height>0||x&&y&&a(y)?(n===null&&(n=new lc(r)),m=p?n.fromEquirectangular(d):n.fromCubemap(d),m.texture.pmremVersion=d.pmremVersion,t.set(d,m),d.addEventListener("dispose",h),m.texture):null}}}return d}function l(d,f){return f===xl?d.mapping=Ji:f===_l&&(d.mapping=bs),d}function a(d){let f=0,p=6;for(let x=0;x<p;x++)d[x]!==void 0&&f++;return f===p}function c(d){let f=d.target;f.removeEventListener("dispose",c);let p=e.get(f);p!==void 0&&(e.delete(f),p.dispose())}function h(d){let f=d.target;f.removeEventListener("dispose",h);let p=t.get(f);p!==void 0&&(t.delete(f),p.dispose())}function u(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:u}}function e_(r){let e={};function t(n){if(e[n]!==void 0)return e[n];let i=r.getExtension(n);return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let i=t(n);return i===null&&Zo("WebGLRenderer: "+n+" extension not supported."),i}}}function t_(r,e,t,n){let i={},s=new WeakMap;function o(u){let d=u.target;d.index!==null&&e.remove(d.index);for(let p in d.attributes)e.remove(d.attributes[p]);d.removeEventListener("dispose",o),delete i[d.id];let f=s.get(d);f&&(e.remove(f),s.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function l(u,d){return i[d.id]===!0||(d.addEventListener("dispose",o),i[d.id]=!0,t.memory.geometries++),d}function a(u){let d=u.attributes;for(let f in d)e.update(d[f],r.ARRAY_BUFFER)}function c(u){let d=[],f=u.index,p=u.attributes.position,x=0;if(p===void 0)return;if(f!==null){let y=f.array;x=f.version;for(let _=0,v=y.length;_<v;_+=3){let S=y[_+0],b=y[_+1],w=y[_+2];d.push(S,b,b,w,w,S)}}else{let y=p.array;x=p.version;for(let _=0,v=y.length/3-1;_<v;_+=3){let S=_+0,b=_+1,w=_+2;d.push(S,b,b,w,w,S)}}let m=new(p.count>=65535?Ma:ba)(d,1);m.version=x;let g=s.get(u);g&&e.remove(g),s.set(u,m)}function h(u){let d=s.get(u);if(d){let f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return s.get(u)}return{get:l,update:a,getWireframeAttribute:h}}function n_(r,e,t){let n;function i(u){n=u}let s,o;function l(u){s=u.type,o=u.bytesPerElement}function a(u,d){r.drawElements(n,d,s,u*o),t.update(d,n,1)}function c(u,d,f){f!==0&&(r.drawElementsInstanced(n,d,s,u*o,f),t.update(d,n,f))}function h(u,d,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,s,u,0,f);let x=0;for(let m=0;m<f;m++)x+=d[m];t.update(x,n,1)}this.setMode=i,this.setIndex=l,this.render=a,this.renderInstances=c,this.renderMultiDraw=h}function i_(r){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,o,l){switch(t.calls++,o){case r.TRIANGLES:t.triangles+=l*(s/3);break;case r.LINES:t.lines+=l*(s/2);break;case r.LINE_STRIP:t.lines+=l*(s-1);break;case r.LINE_LOOP:t.lines+=l*s;break;case r.POINTS:t.points+=l*s;break;default:Oe("WebGLInfo: Unknown draw mode:",o);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function s_(r,e,t){let n=new WeakMap,i=new pt;function s(o,l,a){let c=o.morphTargetInfluences,h=l.morphAttributes.position||l.morphAttributes.normal||l.morphAttributes.color,u=h!==void 0?h.length:0,d=n.get(l);if(d===void 0||d.count!==u){let A=function(){w.dispose(),n.delete(l),l.removeEventListener("dispose",A)};d!==void 0&&d.texture.dispose();let f=l.morphAttributes.position!==void 0,p=l.morphAttributes.normal!==void 0,x=l.morphAttributes.color!==void 0,m=l.morphAttributes.position||[],g=l.morphAttributes.normal||[],y=l.morphAttributes.color||[],_=0;f===!0&&(_=1),p===!0&&(_=2),x===!0&&(_=3);let v=l.attributes.position.count*_,S=1;v>e.maxTextureSize&&(S=Math.ceil(v/e.maxTextureSize),v=e.maxTextureSize);let b=new Float32Array(v*S*4*u),w=new _a(b,v,S,u);w.type=bn,w.needsUpdate=!0;let M=_*4;for(let C=0;C<u;C++){let E=m[C],N=g[C],F=y[C],L=v*S*4*C;for(let I=0;I<E.count;I++){let D=I*M;f===!0&&(i.fromBufferAttribute(E,I),b[L+D+0]=i.x,b[L+D+1]=i.y,b[L+D+2]=i.z,b[L+D+3]=0),p===!0&&(i.fromBufferAttribute(N,I),b[L+D+4]=i.x,b[L+D+5]=i.y,b[L+D+6]=i.z,b[L+D+7]=0),x===!0&&(i.fromBufferAttribute(F,I),b[L+D+8]=i.x,b[L+D+9]=i.y,b[L+D+10]=i.z,b[L+D+11]=F.itemSize===4?i.w:1)}}d={count:u,texture:w,size:new et(v,S)},n.set(l,d),l.addEventListener("dispose",A)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)a.getUniforms().setValue(r,"morphTexture",o.morphTexture,t);else{let f=0;for(let x=0;x<c.length;x++)f+=c[x];let p=l.morphTargetsRelative?1:1-f;a.getUniforms().setValue(r,"morphTargetBaseInfluence",p),a.getUniforms().setValue(r,"morphTargetInfluences",c)}a.getUniforms().setValue(r,"morphTargetsTexture",d.texture,t),a.getUniforms().setValue(r,"morphTargetsTextureSize",d.size)}return{update:s}}function r_(r,e,t,n,i){let s=new WeakMap;function o(c){let h=i.render.frame,u=c.geometry,d=e.get(c,u);if(s.get(d)!==h&&(e.update(d),s.set(d,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==h&&(t.update(c.instanceMatrix,r.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,r.ARRAY_BUFFER),s.set(c,h))),c.isSkinnedMesh){let f=c.skeleton;s.get(f)!==h&&(f.update(),s.set(f,h))}return d}function l(){s=new WeakMap}function a(c){let h=c.target;h.removeEventListener("dispose",a),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:o,dispose:l}}var a_={[Ch]:"LINEAR_TONE_MAPPING",[Ih]:"REINHARD_TONE_MAPPING",[Ph]:"CINEON_TONE_MAPPING",[Lh]:"ACES_FILMIC_TONE_MAPPING",[Fh]:"AGX_TONE_MAPPING",[Dh]:"NEUTRAL_TONE_MAPPING",[Nh]:"CUSTOM_TONE_MAPPING"};function o_(r,e,t,n,i){let s=new yn(e,t,{type:r,depthBuffer:n,stencilBuffer:i,depthTexture:n?new Ai(e,t):void 0}),o=new yn(e,t,{type:ai,depthBuffer:!1,stencilBuffer:!1}),l=new qt;l.setAttribute("position",new rn([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new rn([0,2,0,0,2,0],2));let a=new il({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),c=new It(l,a),h=new Zi(-1,1,1,-1,0,1),u=null,d=null,f=!1,p,x=null,m=[],g=!1;this.setSize=function(y,_){s.setSize(y,_),o.setSize(y,_);for(let v=0;v<m.length;v++){let S=m[v];S.setSize&&S.setSize(y,_)}},this.setEffects=function(y){m=y,g=m.length>0&&m[0].isRenderPass===!0;let _=s.width,v=s.height;for(let S=0;S<m.length;S++){let b=m[S];b.setSize&&b.setSize(_,v)}},this.begin=function(y,_){if(f||y.toneMapping===Vn&&m.length===0)return!1;if(x=_,_!==null){let v=_.width,S=_.height;(s.width!==v||s.height!==S)&&this.setSize(v,S)}return g===!1&&y.setRenderTarget(s),p=y.toneMapping,y.toneMapping=Vn,!0},this.hasRenderPass=function(){return g},this.end=function(y,_){y.toneMapping=p,f=!0;let v=s,S=o;for(let b=0;b<m.length;b++){let w=m[b];if(w.enabled!==!1&&(w.render(y,S,v,_),w.needsSwap!==!1)){let M=v;v=S,S=M}}if(u!==y.outputColorSpace||d!==y.toneMapping){u=y.outputColorSpace,d=y.toneMapping,a.defines={},Je.getTransfer(u)===at&&(a.defines.SRGB_TRANSFER="");let b=a_[d];b&&(a.defines[b]=""),a.needsUpdate=!0}a.uniforms.tDiffuse.value=v.texture,y.setRenderTarget(x),y.render(c,h),x=null,f=!1},this.isCompositing=function(){return f},this.dispose=function(){s.depthTexture&&s.depthTexture.dispose(),s.dispose(),o.dispose(),l.dispose(),a.dispose()}}var Mp=new Dt,du=new Ai(1,1),Sp=new _a,wp=new Qo,Tp=new Ca,ip=[],sp=[],rp=new Float32Array(16),ap=new Float32Array(9),op=new Float32Array(4);function mr(r,e,t){let n=r[0];if(n<=0||n>0)return r;let i=e*t,s=ip[i];if(s===void 0&&(s=new Float32Array(i),ip[i]=s),e!==0){n.toArray(s,0);for(let o=1,l=0;o!==e;++o)l+=t,r[o].toArray(s,l)}return s}function Vt(r,e){if(r.length!==e.length)return!1;for(let t=0,n=r.length;t<n;t++)if(r[t]!==e[t])return!1;return!0}function zt(r,e){for(let t=0,n=e.length;t<n;t++)r[t]=e[t]}function dc(r,e){let t=sp[e];t===void 0&&(t=new Int32Array(e),sp[e]=t);for(let n=0;n!==e;++n)t[n]=r.allocateTextureUnit();return t}function l_(r,e){let t=this.cache;t[0]!==e&&(r.uniform1f(this.addr,e),t[0]=e)}function c_(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Vt(t,e))return;r.uniform2fv(this.addr,e),zt(t,e)}}function h_(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(r.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Vt(t,e))return;r.uniform3fv(this.addr,e),zt(t,e)}}function u_(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Vt(t,e))return;r.uniform4fv(this.addr,e),zt(t,e)}}function d_(r,e){let t=this.cache,n=e.elements;if(n===void 0){if(Vt(t,e))return;r.uniformMatrix2fv(this.addr,!1,e),zt(t,e)}else{if(Vt(t,n))return;op.set(n),r.uniformMatrix2fv(this.addr,!1,op),zt(t,n)}}function f_(r,e){let t=this.cache,n=e.elements;if(n===void 0){if(Vt(t,e))return;r.uniformMatrix3fv(this.addr,!1,e),zt(t,e)}else{if(Vt(t,n))return;ap.set(n),r.uniformMatrix3fv(this.addr,!1,ap),zt(t,n)}}function p_(r,e){let t=this.cache,n=e.elements;if(n===void 0){if(Vt(t,e))return;r.uniformMatrix4fv(this.addr,!1,e),zt(t,e)}else{if(Vt(t,n))return;rp.set(n),r.uniformMatrix4fv(this.addr,!1,rp),zt(t,n)}}function m_(r,e){let t=this.cache;t[0]!==e&&(r.uniform1i(this.addr,e),t[0]=e)}function g_(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Vt(t,e))return;r.uniform2iv(this.addr,e),zt(t,e)}}function x_(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Vt(t,e))return;r.uniform3iv(this.addr,e),zt(t,e)}}function __(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Vt(t,e))return;r.uniform4iv(this.addr,e),zt(t,e)}}function y_(r,e){let t=this.cache;t[0]!==e&&(r.uniform1ui(this.addr,e),t[0]=e)}function v_(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Vt(t,e))return;r.uniform2uiv(this.addr,e),zt(t,e)}}function b_(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Vt(t,e))return;r.uniform3uiv(this.addr,e),zt(t,e)}}function M_(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Vt(t,e))return;r.uniform4uiv(this.addr,e),zt(t,e)}}function S_(r,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i);let s;this.type===r.SAMPLER_2D_SHADOW?(du.compareFunction=t.isReversedDepthBuffer()?rc:sc,s=du):s=Mp,t.setTexture2D(e||s,i)}function w_(r,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||wp,i)}function T_(r,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||Tp,i)}function A_(r,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||Sp,i)}function E_(r){switch(r){case 5126:return l_;case 35664:return c_;case 35665:return h_;case 35666:return u_;case 35674:return d_;case 35675:return f_;case 35676:return p_;case 5124:case 35670:return m_;case 35667:case 35671:return g_;case 35668:case 35672:return x_;case 35669:case 35673:return __;case 5125:return y_;case 36294:return v_;case 36295:return b_;case 36296:return M_;case 35678:case 36198:case 36298:case 36306:case 35682:return S_;case 35679:case 36299:case 36307:return w_;case 35680:case 36300:case 36308:case 36293:return T_;case 36289:case 36303:case 36311:case 36292:return A_}}function R_(r,e){r.uniform1fv(this.addr,e)}function C_(r,e){let t=mr(e,this.size,2);r.uniform2fv(this.addr,t)}function I_(r,e){let t=mr(e,this.size,3);r.uniform3fv(this.addr,t)}function P_(r,e){let t=mr(e,this.size,4);r.uniform4fv(this.addr,t)}function L_(r,e){let t=mr(e,this.size,4);r.uniformMatrix2fv(this.addr,!1,t)}function N_(r,e){let t=mr(e,this.size,9);r.uniformMatrix3fv(this.addr,!1,t)}function F_(r,e){let t=mr(e,this.size,16);r.uniformMatrix4fv(this.addr,!1,t)}function D_(r,e){r.uniform1iv(this.addr,e)}function U_(r,e){r.uniform2iv(this.addr,e)}function O_(r,e){r.uniform3iv(this.addr,e)}function B_(r,e){r.uniform4iv(this.addr,e)}function k_(r,e){r.uniform1uiv(this.addr,e)}function V_(r,e){r.uniform2uiv(this.addr,e)}function z_(r,e){r.uniform3uiv(this.addr,e)}function H_(r,e){r.uniform4uiv(this.addr,e)}function G_(r,e,t){let n=this.cache,i=e.length,s=dc(t,i);Vt(n,s)||(r.uniform1iv(this.addr,s),zt(n,s));let o;this.type===r.SAMPLER_2D_SHADOW?o=du:o=Mp;for(let l=0;l!==i;++l)t.setTexture2D(e[l]||o,s[l])}function W_(r,e,t){let n=this.cache,i=e.length,s=dc(t,i);Vt(n,s)||(r.uniform1iv(this.addr,s),zt(n,s));for(let o=0;o!==i;++o)t.setTexture3D(e[o]||wp,s[o])}function X_(r,e,t){let n=this.cache,i=e.length,s=dc(t,i);Vt(n,s)||(r.uniform1iv(this.addr,s),zt(n,s));for(let o=0;o!==i;++o)t.setTextureCube(e[o]||Tp,s[o])}function Y_(r,e,t){let n=this.cache,i=e.length,s=dc(t,i);Vt(n,s)||(r.uniform1iv(this.addr,s),zt(n,s));for(let o=0;o!==i;++o)t.setTexture2DArray(e[o]||Sp,s[o])}function q_(r){switch(r){case 5126:return R_;case 35664:return C_;case 35665:return I_;case 35666:return P_;case 35674:return L_;case 35675:return N_;case 35676:return F_;case 5124:case 35670:return D_;case 35667:case 35671:return U_;case 35668:case 35672:return O_;case 35669:case 35673:return B_;case 5125:return k_;case 36294:return V_;case 36295:return z_;case 36296:return H_;case 35678:case 36198:case 36298:case 36306:case 35682:return G_;case 35679:case 36299:case 36307:return W_;case 35680:case 36300:case 36308:case 36293:return X_;case 36289:case 36303:case 36311:case 36292:return Y_}}var fu=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=E_(t.type)}},pu=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=q_(t.type)}},mu=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let i=this.seq;for(let s=0,o=i.length;s!==o;++s){let l=i[s];l.setValue(e,t[l.id],n)}}},hu=/(\w+)(\])?(\[|\.)?/g;function lp(r,e){r.seq.push(e),r.map[e.id]=e}function $_(r,e,t){let n=r.name,i=n.length;for(hu.lastIndex=0;;){let s=hu.exec(n),o=hu.lastIndex,l=s[1],a=s[2]==="]",c=s[3];if(a&&(l=l|0),c===void 0||c==="["&&o+2===i){lp(t,c===void 0?new fu(l,r,e):new pu(l,r,e));break}else{let u=t.map[l];u===void 0&&(u=new mu(l),lp(t,u)),t=u}}}var pr=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let o=0;o<n;++o){let l=e.getActiveUniform(t,o),a=e.getUniformLocation(t,l.name);$_(l,a,this)}let i=[],s=[];for(let o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?i.push(o):s.push(o);i.length>0&&(this.seq=i.concat(s))}setValue(e,t,n,i){let s=this.map[t];s!==void 0&&s.setValue(e,n,i)}setOptional(e,t,n){let i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let s=0,o=t.length;s!==o;++s){let l=t[s],a=n[l.id];a.needsUpdate!==!1&&l.setValue(e,a.value,i)}}static seqWithValue(e,t){let n=[];for(let i=0,s=e.length;i!==s;++i){let o=e[i];o.id in t&&n.push(o)}return n}};function cp(r,e,t){let n=r.createShader(e);return r.shaderSource(n,t),r.compileShader(n),n}var K_=37297,Z_=0;function J_(r,e){let t=r.split(`
`),n=[],i=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let o=i;o<s;o++){let l=o+1;n.push(`${l===e?">":" "} ${l}: ${t[o]}`)}return n.join(`
`)}var hp=new ze;function j_(r){Je._getMatrix(hp,Je.workingColorSpace,r);let e=`mat3( ${hp.elements.map(t=>t.toFixed(4))} )`;switch(Je.getTransfer(r)){case ga:return[e,"LinearTransferOETF"];case at:return[e,"sRGBTransferOETF"];default:return Ie("WebGLProgram: Unsupported color space: ",r),[e,"LinearTransferOETF"]}}function up(r,e,t){let n=r.getShaderParameter(e,r.COMPILE_STATUS),s=(r.getShaderInfoLog(e)||"").trim();if(n&&s==="")return"";let o=/ERROR: 0:(\d+)/.exec(s);if(o){let l=parseInt(o[1]);return t.toUpperCase()+`

`+s+`

`+J_(r.getShaderSource(e),l)}else return s}function Q_(r,e){let t=j_(e);return[`vec4 ${r}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}var ey={[Ch]:"Linear",[Ih]:"Reinhard",[Ph]:"Cineon",[Lh]:"ACESFilmic",[Fh]:"AgX",[Dh]:"Neutral",[Nh]:"Custom"};function ty(r,e){let t=ey[e];return t===void 0?(Ie("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+r+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+r+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var oc=new z;function ny(){Je.getLuminanceCoefficients(oc);let r=oc.x.toFixed(4),e=oc.y.toFixed(4),t=oc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${r}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function iy(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(to).join(`
`)}function sy(r){let e=[];for(let t in r){let n=r[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function ry(r,e){let t={},n=r.getProgramParameter(e,r.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){let s=r.getActiveAttrib(e,i),o=s.name,l=1;s.type===r.FLOAT_MAT2&&(l=2),s.type===r.FLOAT_MAT3&&(l=3),s.type===r.FLOAT_MAT4&&(l=4),t[o]={type:s.type,location:r.getAttribLocation(e,o),locationSize:l}}return t}function to(r){return r!==""}function dp(r,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function fp(r,e){return r.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var ay=/^[ \t]*#include +<([\w\d./]+)>/gm;function gu(r){return r.replace(ay,ly)}var oy=new Map;function ly(r,e){let t=$e[e];if(t===void 0){let n=oy.get(e);if(n!==void 0)t=$e[n],Ie('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return gu(t)}var cy=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function pp(r){return r.replace(cy,hy)}function hy(r,e,t,n){let i="";for(let s=parseInt(e);s<parseInt(t);s++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return i}function mp(r){let e=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;return r.precision==="highp"?e+=`
#define HIGH_PRECISION`:r.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}var uy={[za]:"SHADOWMAP_TYPE_PCF",[or]:"SHADOWMAP_TYPE_VSM"};function dy(r){return uy[r.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var fy={[Ji]:"ENVMAP_TYPE_CUBE",[bs]:"ENVMAP_TYPE_CUBE",[Xa]:"ENVMAP_TYPE_CUBE_UV"};function py(r){return r.envMap===!1?"ENVMAP_TYPE_CUBE":fy[r.envMapMode]||"ENVMAP_TYPE_CUBE"}var my={[bs]:"ENVMAP_MODE_REFRACTION"};function gy(r){return r.envMap===!1?"ENVMAP_MODE_REFLECTION":my[r.envMapMode]||"ENVMAP_MODE_REFLECTION"}var xy={[Rh]:"ENVMAP_BLENDING_MULTIPLY",[Lf]:"ENVMAP_BLENDING_MIX",[Nf]:"ENVMAP_BLENDING_ADD"};function _y(r){return r.envMap===!1?"ENVMAP_BLENDING_NONE":xy[r.combine]||"ENVMAP_BLENDING_NONE"}function yy(r){let e=r.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function vy(r,e,t,n){let i=r.getContext(),s=t.defines,o=t.vertexShader,l=t.fragmentShader,a=dy(t),c=py(t),h=gy(t),u=_y(t),d=yy(t),f=iy(t),p=sy(s),x=i.createProgram(),m,g,y=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(to).join(`
`),m.length>0&&(m+=`
`),g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(to).join(`
`),g.length>0&&(g+=`
`)):(m=[mp(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+a:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(to).join(`
`),g=[mp(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+a:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Vn?"#define TONE_MAPPING":"",t.toneMapping!==Vn?$e.tonemapping_pars_fragment:"",t.toneMapping!==Vn?ty("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",$e.colorspace_pars_fragment,Q_("linearToOutputTexel",t.outputColorSpace),ny(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(to).join(`
`)),o=gu(o),o=dp(o,t),o=fp(o,t),l=gu(l),l=dp(l,t),l=fp(l,t),o=pp(o),l=pp(l),t.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,g=["#define varying in",t.glslVersion===$h?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===$h?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);let _=y+m+o,v=y+g+l,S=cp(i,i.VERTEX_SHADER,_),b=cp(i,i.FRAGMENT_SHADER,v);i.attachShader(x,S),i.attachShader(x,b),t.index0AttributeName!==void 0?i.bindAttribLocation(x,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(x,0,"position"),i.linkProgram(x);function w(E){if(r.debug.checkShaderErrors){let N=i.getProgramInfoLog(x)||"",F=i.getShaderInfoLog(S)||"",L=i.getShaderInfoLog(b)||"",I=N.trim(),D=F.trim(),U=L.trim(),Y=!0,X=!0;if(i.getProgramParameter(x,i.LINK_STATUS)===!1)if(Y=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(i,x,S,b);else{let ee=up(i,S,"vertex"),ae=up(i,b,"fragment");Oe("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(x,i.VALIDATE_STATUS)+`

Material Name: `+E.name+`
Material Type: `+E.type+`

Program Info Log: `+I+`
`+ee+`
`+ae)}else I!==""?Ie("WebGLProgram: Program Info Log:",I):(D===""||U==="")&&(X=!1);X&&(E.diagnostics={runnable:Y,programLog:I,vertexShader:{log:D,prefix:m},fragmentShader:{log:U,prefix:g}})}i.deleteShader(S),i.deleteShader(b),M=new pr(i,x),A=ry(i,x)}let M;this.getUniforms=function(){return M===void 0&&w(this),M};let A;this.getAttributes=function(){return A===void 0&&w(this),A};let C=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=i.getProgramParameter(x,K_)),C},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Z_++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=S,this.fragmentShader=b,this}var by=0,xu=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),s=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new _u(e),t.set(e,n)),n}},_u=class{constructor(e){this.id=by++,this.code=e,this.usedTimes=0}};function My(r){return r===Qi||r===Za||r===Ja}function Sy(r,e,t,n,i,s){let o=new ya,l=new xu,a=new Set,c=[],h=new Map,u=n.logarithmicDepthBuffer,d=n.precision,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(M){return a.add(M),M===0?"uv":`uv${M}`}function x(M,A,C,E,N,F){let L=E.fog,I=N.geometry,D=M.isMeshStandardMaterial||M.isMeshLambertMaterial||M.isMeshPhongMaterial?E.environment:null,U=M.isMeshStandardMaterial||M.isMeshLambertMaterial&&!M.envMap||M.isMeshPhongMaterial&&!M.envMap,Y=e.get(M.envMap||D,U),X=Y&&Y.mapping===Xa?Y.image.height:null,ee=f[M.type];M.precision!==null&&(d=n.getMaxPrecision(M.precision),d!==M.precision&&Ie("WebGLProgram.getParameters:",M.precision,"not supported, using",d,"instead."));let ae=I.morphAttributes.position||I.morphAttributes.normal||I.morphAttributes.color,ce=ae!==void 0?ae.length:0,oe=0;I.morphAttributes.position!==void 0&&(oe=1),I.morphAttributes.normal!==void 0&&(oe=2),I.morphAttributes.color!==void 0&&(oe=3);let Me,me,K,le;if(ee){let Ge=li[ee];Me=Ge.vertexShader,me=Ge.fragmentShader}else Me=M.vertexShader,me=M.fragmentShader,l.update(M),K=l.getVertexShaderID(M),le=l.getFragmentShaderID(M);let te=r.getRenderTarget(),Te=r.state.buffers.depth.getReversed(),Re=N.isInstancedMesh===!0,Ne=N.isBatchedMesh===!0,ot=!!M.map,Ke=!!M.matcap,it=!!Y,lt=!!M.aoMap,qe=!!M.lightMap,Et=!!M.bumpMap,ut=!!M.normalMap,Yt=!!M.displacementMap,B=!!M.emissiveMap,yt=!!M.metalnessMap,He=!!M.roughnessMap,ct=M.anisotropy>0,xe=M.clearcoat>0,Rt=M.dispersion>0,P=M.iridescence>0,T=M.sheen>0,H=M.transmission>0,J=ct&&!!M.anisotropyMap,re=xe&&!!M.clearcoatMap,he=xe&&!!M.clearcoatNormalMap,ge=xe&&!!M.clearcoatRoughnessMap,$=P&&!!M.iridescenceMap,j=P&&!!M.iridescenceThicknessMap,be=T&&!!M.sheenColorMap,Ae=T&&!!M.sheenRoughnessMap,fe=!!M.specularMap,ue=!!M.specularColorMap,Ve=!!M.specularIntensityMap,Xe=H&&!!M.transmissionMap,rt=H&&!!M.thicknessMap,O=!!M.gradientMap,de=!!M.alphaMap,Z=M.alphaTest>0,Se=!!M.alphaHash,pe=!!M.extensions,ie=Vn;M.toneMapped&&(te===null||te.isXRRenderTarget===!0)&&(ie=r.toneMapping);let Le={shaderID:ee,shaderType:M.type,shaderName:M.name,vertexShader:Me,fragmentShader:me,defines:M.defines,customVertexShaderID:K,customFragmentShaderID:le,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:d,batching:Ne,batchingColor:Ne&&N._colorsTexture!==null,instancing:Re,instancingColor:Re&&N.instanceColor!==null,instancingMorph:Re&&N.morphTexture!==null,outputColorSpace:te===null?r.outputColorSpace:te.isXRRenderTarget===!0?te.texture.colorSpace:Je.workingColorSpace,alphaToCoverage:!!M.alphaToCoverage,map:ot,matcap:Ke,envMap:it,envMapMode:it&&Y.mapping,envMapCubeUVHeight:X,aoMap:lt,lightMap:qe,bumpMap:Et,normalMap:ut,displacementMap:Yt,emissiveMap:B,normalMapObjectSpace:ut&&M.normalMapType===Of,normalMapTangentSpace:ut&&M.normalMapType===ic,packedNormalMap:ut&&M.normalMapType===ic&&My(M.normalMap.format),metalnessMap:yt,roughnessMap:He,anisotropy:ct,anisotropyMap:J,clearcoat:xe,clearcoatMap:re,clearcoatNormalMap:he,clearcoatRoughnessMap:ge,dispersion:Rt,iridescence:P,iridescenceMap:$,iridescenceThicknessMap:j,sheen:T,sheenColorMap:be,sheenRoughnessMap:Ae,specularMap:fe,specularColorMap:ue,specularIntensityMap:Ve,transmission:H,transmissionMap:Xe,thicknessMap:rt,gradientMap:O,opaque:M.transparent===!1&&M.blending===En&&M.alphaToCoverage===!1,alphaMap:de,alphaTest:Z,alphaHash:Se,combine:M.combine,mapUv:ot&&p(M.map.channel),aoMapUv:lt&&p(M.aoMap.channel),lightMapUv:qe&&p(M.lightMap.channel),bumpMapUv:Et&&p(M.bumpMap.channel),normalMapUv:ut&&p(M.normalMap.channel),displacementMapUv:Yt&&p(M.displacementMap.channel),emissiveMapUv:B&&p(M.emissiveMap.channel),metalnessMapUv:yt&&p(M.metalnessMap.channel),roughnessMapUv:He&&p(M.roughnessMap.channel),anisotropyMapUv:J&&p(M.anisotropyMap.channel),clearcoatMapUv:re&&p(M.clearcoatMap.channel),clearcoatNormalMapUv:he&&p(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ge&&p(M.clearcoatRoughnessMap.channel),iridescenceMapUv:$&&p(M.iridescenceMap.channel),iridescenceThicknessMapUv:j&&p(M.iridescenceThicknessMap.channel),sheenColorMapUv:be&&p(M.sheenColorMap.channel),sheenRoughnessMapUv:Ae&&p(M.sheenRoughnessMap.channel),specularMapUv:fe&&p(M.specularMap.channel),specularColorMapUv:ue&&p(M.specularColorMap.channel),specularIntensityMapUv:Ve&&p(M.specularIntensityMap.channel),transmissionMapUv:Xe&&p(M.transmissionMap.channel),thicknessMapUv:rt&&p(M.thicknessMap.channel),alphaMapUv:de&&p(M.alphaMap.channel),vertexTangents:!!I.attributes.tangent&&(ut||ct),vertexNormals:!!I.attributes.normal,vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!I.attributes.color&&I.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!I.attributes.uv&&(ot||de),fog:!!L,useFog:M.fog===!0,fogExp2:!!L&&L.isFogExp2,flatShading:M.wireframe===!1&&(M.flatShading===!0||I.attributes.normal===void 0&&ut===!1&&(M.isMeshLambertMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isMeshPhysicalMaterial)),sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:Te,skinning:N.isSkinnedMesh===!0,morphTargets:I.morphAttributes.position!==void 0,morphNormals:I.morphAttributes.normal!==void 0,morphColors:I.morphAttributes.color!==void 0,morphTargetsCount:ce,morphTextureStride:oe,numDirLights:A.directional.length,numPointLights:A.point.length,numSpotLights:A.spot.length,numSpotLightMaps:A.spotLightMap.length,numRectAreaLights:A.rectArea.length,numHemiLights:A.hemi.length,numDirLightShadows:A.directionalShadowMap.length,numPointLightShadows:A.pointShadowMap.length,numSpotLightShadows:A.spotShadowMap.length,numSpotLightShadowsWithMaps:A.numSpotLightShadowsWithMaps,numLightProbes:A.numLightProbes,numLightProbeGrids:F.length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:M.dithering,shadowMapEnabled:r.shadowMap.enabled&&C.length>0,shadowMapType:r.shadowMap.type,toneMapping:ie,decodeVideoTexture:ot&&M.map.isVideoTexture===!0&&Je.getTransfer(M.map.colorSpace)===at,decodeVideoTextureEmissive:B&&M.emissiveMap.isVideoTexture===!0&&Je.getTransfer(M.emissiveMap.colorSpace)===at,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===en,flipSided:M.side===ln,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:pe&&M.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(pe&&M.extensions.multiDraw===!0||Ne)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return Le.vertexUv1s=a.has(1),Le.vertexUv2s=a.has(2),Le.vertexUv3s=a.has(3),a.clear(),Le}function m(M){let A=[];if(M.shaderID?A.push(M.shaderID):(A.push(M.customVertexShaderID),A.push(M.customFragmentShaderID)),M.defines!==void 0)for(let C in M.defines)A.push(C),A.push(M.defines[C]);return M.isRawShaderMaterial===!1&&(g(A,M),y(A,M),A.push(r.outputColorSpace)),A.push(M.customProgramCacheKey),A.join()}function g(M,A){M.push(A.precision),M.push(A.outputColorSpace),M.push(A.envMapMode),M.push(A.envMapCubeUVHeight),M.push(A.mapUv),M.push(A.alphaMapUv),M.push(A.lightMapUv),M.push(A.aoMapUv),M.push(A.bumpMapUv),M.push(A.normalMapUv),M.push(A.displacementMapUv),M.push(A.emissiveMapUv),M.push(A.metalnessMapUv),M.push(A.roughnessMapUv),M.push(A.anisotropyMapUv),M.push(A.clearcoatMapUv),M.push(A.clearcoatNormalMapUv),M.push(A.clearcoatRoughnessMapUv),M.push(A.iridescenceMapUv),M.push(A.iridescenceThicknessMapUv),M.push(A.sheenColorMapUv),M.push(A.sheenRoughnessMapUv),M.push(A.specularMapUv),M.push(A.specularColorMapUv),M.push(A.specularIntensityMapUv),M.push(A.transmissionMapUv),M.push(A.thicknessMapUv),M.push(A.combine),M.push(A.fogExp2),M.push(A.sizeAttenuation),M.push(A.morphTargetsCount),M.push(A.morphAttributeCount),M.push(A.numDirLights),M.push(A.numPointLights),M.push(A.numSpotLights),M.push(A.numSpotLightMaps),M.push(A.numHemiLights),M.push(A.numRectAreaLights),M.push(A.numDirLightShadows),M.push(A.numPointLightShadows),M.push(A.numSpotLightShadows),M.push(A.numSpotLightShadowsWithMaps),M.push(A.numLightProbes),M.push(A.shadowMapType),M.push(A.toneMapping),M.push(A.numClippingPlanes),M.push(A.numClipIntersection),M.push(A.depthPacking)}function y(M,A){o.disableAll(),A.instancing&&o.enable(0),A.instancingColor&&o.enable(1),A.instancingMorph&&o.enable(2),A.matcap&&o.enable(3),A.envMap&&o.enable(4),A.normalMapObjectSpace&&o.enable(5),A.normalMapTangentSpace&&o.enable(6),A.clearcoat&&o.enable(7),A.iridescence&&o.enable(8),A.alphaTest&&o.enable(9),A.vertexColors&&o.enable(10),A.vertexAlphas&&o.enable(11),A.vertexUv1s&&o.enable(12),A.vertexUv2s&&o.enable(13),A.vertexUv3s&&o.enable(14),A.vertexTangents&&o.enable(15),A.anisotropy&&o.enable(16),A.alphaHash&&o.enable(17),A.batching&&o.enable(18),A.dispersion&&o.enable(19),A.batchingColor&&o.enable(20),A.gradientMap&&o.enable(21),A.packedNormalMap&&o.enable(22),A.vertexNormals&&o.enable(23),M.push(o.mask),o.disableAll(),A.fog&&o.enable(0),A.useFog&&o.enable(1),A.flatShading&&o.enable(2),A.logarithmicDepthBuffer&&o.enable(3),A.reversedDepthBuffer&&o.enable(4),A.skinning&&o.enable(5),A.morphTargets&&o.enable(6),A.morphNormals&&o.enable(7),A.morphColors&&o.enable(8),A.premultipliedAlpha&&o.enable(9),A.shadowMapEnabled&&o.enable(10),A.doubleSided&&o.enable(11),A.flipSided&&o.enable(12),A.useDepthPacking&&o.enable(13),A.dithering&&o.enable(14),A.transmission&&o.enable(15),A.sheen&&o.enable(16),A.opaque&&o.enable(17),A.pointsUvs&&o.enable(18),A.decodeVideoTexture&&o.enable(19),A.decodeVideoTextureEmissive&&o.enable(20),A.alphaToCoverage&&o.enable(21),A.numLightProbeGrids>0&&o.enable(22),M.push(o.mask)}function _(M){let A=f[M.type],C;if(A){let E=li[A];C=Kf.clone(E.uniforms)}else C=M.uniforms;return C}function v(M,A){let C=h.get(A);return C!==void 0?++C.usedTimes:(C=new vy(r,A,M,i),c.push(C),h.set(A,C)),C}function S(M){if(--M.usedTimes===0){let A=c.indexOf(M);c[A]=c[c.length-1],c.pop(),h.delete(M.cacheKey),M.destroy()}}function b(M){l.remove(M)}function w(){l.dispose()}return{getParameters:x,getProgramCacheKey:m,getUniforms:_,acquireProgram:v,releaseProgram:S,releaseShaderCache:b,programs:c,dispose:w}}function wy(){let r=new WeakMap;function e(o){return r.has(o)}function t(o){let l=r.get(o);return l===void 0&&(l={},r.set(o,l)),l}function n(o){r.delete(o)}function i(o,l,a){r.get(o)[l]=a}function s(){r=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:s}}function Ty(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.material.id!==e.material.id?r.material.id-e.material.id:r.materialVariant!==e.materialVariant?r.materialVariant-e.materialVariant:r.z!==e.z?r.z-e.z:r.id-e.id}function gp(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.z!==e.z?e.z-r.z:r.id-e.id}function xp(){let r=[],e=0,t=[],n=[],i=[];function s(){e=0,t.length=0,n.length=0,i.length=0}function o(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function l(d,f,p,x,m,g){let y=r[e];return y===void 0?(y={id:d.id,object:d,geometry:f,material:p,materialVariant:o(d),groupOrder:x,renderOrder:d.renderOrder,z:m,group:g},r[e]=y):(y.id=d.id,y.object=d,y.geometry=f,y.material=p,y.materialVariant=o(d),y.groupOrder=x,y.renderOrder=d.renderOrder,y.z=m,y.group=g),e++,y}function a(d,f,p,x,m,g){let y=l(d,f,p,x,m,g);p.transmission>0?n.push(y):p.transparent===!0?i.push(y):t.push(y)}function c(d,f,p,x,m,g){let y=l(d,f,p,x,m,g);p.transmission>0?n.unshift(y):p.transparent===!0?i.unshift(y):t.unshift(y)}function h(d,f){t.length>1&&t.sort(d||Ty),n.length>1&&n.sort(f||gp),i.length>1&&i.sort(f||gp)}function u(){for(let d=e,f=r.length;d<f;d++){let p=r[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:i,init:s,push:a,unshift:c,finish:u,sort:h}}function Ay(){let r=new WeakMap;function e(n,i){let s=r.get(n),o;return s===void 0?(o=new xp,r.set(n,[o])):i>=s.length?(o=new xp,s.push(o)):o=s[i],o}function t(){r=new WeakMap}return{get:e,dispose:t}}function Ey(){let r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new z,color:new Be};break;case"SpotLight":t={position:new z,direction:new z,color:new Be,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new z,color:new Be,distance:0,decay:0};break;case"HemisphereLight":t={direction:new z,skyColor:new Be,groundColor:new Be};break;case"RectAreaLight":t={color:new Be,position:new z,halfWidth:new z,halfHeight:new z};break}return r[e.id]=t,t}}}function Ry(){let r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new et};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new et};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new et,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[e.id]=t,t}}}var Cy=0;function Iy(r,e){return(e.castShadow?2:0)-(r.castShadow?2:0)+(e.map?1:0)-(r.map?1:0)}function Py(r){let e=new Ey,t=Ry(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new z);let i=new z,s=new ke,o=new ke;function l(c){let h=0,u=0,d=0;for(let A=0;A<9;A++)n.probe[A].set(0,0,0);let f=0,p=0,x=0,m=0,g=0,y=0,_=0,v=0,S=0,b=0,w=0;c.sort(Iy);for(let A=0,C=c.length;A<C;A++){let E=c[A],N=E.color,F=E.intensity,L=E.distance,I=null;if(E.shadow&&E.shadow.map&&(E.shadow.map.texture.format===Qi?I=E.shadow.map.texture:I=E.shadow.map.depthTexture||E.shadow.map.texture),E.isAmbientLight)h+=N.r*F,u+=N.g*F,d+=N.b*F;else if(E.isLightProbe){for(let D=0;D<9;D++)n.probe[D].addScaledVector(E.sh.coefficients[D],F);w++}else if(E.isDirectionalLight){let D=e.get(E);if(D.color.copy(E.color).multiplyScalar(E.intensity),E.castShadow){let U=E.shadow,Y=t.get(E);Y.shadowIntensity=U.intensity,Y.shadowBias=U.bias,Y.shadowNormalBias=U.normalBias,Y.shadowRadius=U.radius,Y.shadowMapSize=U.mapSize,n.directionalShadow[f]=Y,n.directionalShadowMap[f]=I,n.directionalShadowMatrix[f]=E.shadow.matrix,y++}n.directional[f]=D,f++}else if(E.isSpotLight){let D=e.get(E);D.position.setFromMatrixPosition(E.matrixWorld),D.color.copy(N).multiplyScalar(F),D.distance=L,D.coneCos=Math.cos(E.angle),D.penumbraCos=Math.cos(E.angle*(1-E.penumbra)),D.decay=E.decay,n.spot[x]=D;let U=E.shadow;if(E.map&&(n.spotLightMap[S]=E.map,S++,U.updateMatrices(E),E.castShadow&&b++),n.spotLightMatrix[x]=U.matrix,E.castShadow){let Y=t.get(E);Y.shadowIntensity=U.intensity,Y.shadowBias=U.bias,Y.shadowNormalBias=U.normalBias,Y.shadowRadius=U.radius,Y.shadowMapSize=U.mapSize,n.spotShadow[x]=Y,n.spotShadowMap[x]=I,v++}x++}else if(E.isRectAreaLight){let D=e.get(E);D.color.copy(N).multiplyScalar(F),D.halfWidth.set(E.width*.5,0,0),D.halfHeight.set(0,E.height*.5,0),n.rectArea[m]=D,m++}else if(E.isPointLight){let D=e.get(E);if(D.color.copy(E.color).multiplyScalar(E.intensity),D.distance=E.distance,D.decay=E.decay,E.castShadow){let U=E.shadow,Y=t.get(E);Y.shadowIntensity=U.intensity,Y.shadowBias=U.bias,Y.shadowNormalBias=U.normalBias,Y.shadowRadius=U.radius,Y.shadowMapSize=U.mapSize,Y.shadowCameraNear=U.camera.near,Y.shadowCameraFar=U.camera.far,n.pointShadow[p]=Y,n.pointShadowMap[p]=I,n.pointShadowMatrix[p]=E.shadow.matrix,_++}n.point[p]=D,p++}else if(E.isHemisphereLight){let D=e.get(E);D.skyColor.copy(E.color).multiplyScalar(F),D.groundColor.copy(E.groundColor).multiplyScalar(F),n.hemi[g]=D,g++}}m>0&&(r.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=_e.LTC_FLOAT_1,n.rectAreaLTC2=_e.LTC_FLOAT_2):(n.rectAreaLTC1=_e.LTC_HALF_1,n.rectAreaLTC2=_e.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;let M=n.hash;(M.directionalLength!==f||M.pointLength!==p||M.spotLength!==x||M.rectAreaLength!==m||M.hemiLength!==g||M.numDirectionalShadows!==y||M.numPointShadows!==_||M.numSpotShadows!==v||M.numSpotMaps!==S||M.numLightProbes!==w)&&(n.directional.length=f,n.spot.length=x,n.rectArea.length=m,n.point.length=p,n.hemi.length=g,n.directionalShadow.length=y,n.directionalShadowMap.length=y,n.pointShadow.length=_,n.pointShadowMap.length=_,n.spotShadow.length=v,n.spotShadowMap.length=v,n.directionalShadowMatrix.length=y,n.pointShadowMatrix.length=_,n.spotLightMatrix.length=v+S-b,n.spotLightMap.length=S,n.numSpotLightShadowsWithMaps=b,n.numLightProbes=w,M.directionalLength=f,M.pointLength=p,M.spotLength=x,M.rectAreaLength=m,M.hemiLength=g,M.numDirectionalShadows=y,M.numPointShadows=_,M.numSpotShadows=v,M.numSpotMaps=S,M.numLightProbes=w,n.version=Cy++)}function a(c,h){let u=0,d=0,f=0,p=0,x=0,m=h.matrixWorldInverse;for(let g=0,y=c.length;g<y;g++){let _=c[g];if(_.isDirectionalLight){let v=n.directional[u];v.direction.setFromMatrixPosition(_.matrixWorld),i.setFromMatrixPosition(_.target.matrixWorld),v.direction.sub(i),v.direction.transformDirection(m),u++}else if(_.isSpotLight){let v=n.spot[f];v.position.setFromMatrixPosition(_.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(_.matrixWorld),i.setFromMatrixPosition(_.target.matrixWorld),v.direction.sub(i),v.direction.transformDirection(m),f++}else if(_.isRectAreaLight){let v=n.rectArea[p];v.position.setFromMatrixPosition(_.matrixWorld),v.position.applyMatrix4(m),o.identity(),s.copy(_.matrixWorld),s.premultiply(m),o.extractRotation(s),v.halfWidth.set(_.width*.5,0,0),v.halfHeight.set(0,_.height*.5,0),v.halfWidth.applyMatrix4(o),v.halfHeight.applyMatrix4(o),p++}else if(_.isPointLight){let v=n.point[d];v.position.setFromMatrixPosition(_.matrixWorld),v.position.applyMatrix4(m),d++}else if(_.isHemisphereLight){let v=n.hemi[x];v.direction.setFromMatrixPosition(_.matrixWorld),v.direction.transformDirection(m),x++}}}return{setup:l,setupView:a,state:n}}function _p(r){let e=new Py(r),t=[],n=[],i=[];function s(d){u.camera=d,t.length=0,n.length=0,i.length=0}function o(d){t.push(d)}function l(d){n.push(d)}function a(d){i.push(d)}function c(){e.setup(t)}function h(d){e.setupView(t,d)}let u={lightsArray:t,shadowsArray:n,lightProbeGridArray:i,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:s,state:u,setupLights:c,setupLightsView:h,pushLight:o,pushShadow:l,pushLightProbeGrid:a}}function Ly(r){let e=new WeakMap;function t(i,s=0){let o=e.get(i),l;return o===void 0?(l=new _p(r),e.set(i,[l])):s>=o.length?(l=new _p(r),o.push(l)):l=o[s],l}function n(){e=new WeakMap}return{get:t,dispose:n}}var Ny=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Fy=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Dy=[new z(1,0,0),new z(-1,0,0),new z(0,1,0),new z(0,-1,0),new z(0,0,1),new z(0,0,-1)],Uy=[new z(0,-1,0),new z(0,-1,0),new z(0,0,1),new z(0,0,-1),new z(0,-1,0),new z(0,-1,0)],yp=new ke,eo=new z,uu=new z;function Oy(r,e,t){let n=new tr,i=new et,s=new et,o=new pt,l=new sl,a=new rl,c={},h=t.maxTextureSize,u={[On]:ln,[ln]:On,[en]:en},d=new on({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new et},radius:{value:4}},vertexShader:Ny,fragmentShader:Fy}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let p=new qt;p.setAttribute("position",new At(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new It(p,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=za;let g=this.type;this.render=function(b,w,M){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||b.length===0)return;this.type===xf&&(Ie("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=za);let A=r.getRenderTarget(),C=r.getActiveCubeFace(),E=r.getActiveMipmapLevel(),N=r.state;N.setBlending(ri),N.buffers.depth.getReversed()===!0?N.buffers.color.setClear(0,0,0,0):N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);let F=g!==this.type;F&&w.traverse(function(L){L.material&&(Array.isArray(L.material)?L.material.forEach(I=>I.needsUpdate=!0):L.material.needsUpdate=!0)});for(let L=0,I=b.length;L<I;L++){let D=b[L],U=D.shadow;if(U===void 0){Ie("WebGLShadowMap:",D,"has no shadow.");continue}if(U.autoUpdate===!1&&U.needsUpdate===!1)continue;i.copy(U.mapSize);let Y=U.getFrameExtents();i.multiply(Y),s.copy(U.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(s.x=Math.floor(h/Y.x),i.x=s.x*Y.x,U.mapSize.x=s.x),i.y>h&&(s.y=Math.floor(h/Y.y),i.y=s.y*Y.y,U.mapSize.y=s.y));let X=r.state.buffers.depth.getReversed();if(U.camera._reversedDepth=X,U.map===null||F===!0){if(U.map!==null&&(U.map.depthTexture!==null&&(U.map.depthTexture.dispose(),U.map.depthTexture=null),U.map.dispose()),this.type===or){if(D.isPointLight){Ie("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}U.map=new yn(i.x,i.y,{format:Qi,type:ai,minFilter:Mt,magFilter:Mt,generateMipmaps:!1}),U.map.texture.name=D.name+".shadowMap",U.map.depthTexture=new Ai(i.x,i.y,bn),U.map.depthTexture.name=D.name+".shadowMapDepth",U.map.depthTexture.format=jn,U.map.depthTexture.compareFunction=null,U.map.depthTexture.minFilter=bt,U.map.depthTexture.magFilter=bt}else D.isPointLight?(U.map=new cc(i.x),U.map.depthTexture=new nl(i.x,Hn)):(U.map=new yn(i.x,i.y),U.map.depthTexture=new Ai(i.x,i.y,Hn)),U.map.depthTexture.name=D.name+".shadowMap",U.map.depthTexture.format=jn,this.type===za?(U.map.depthTexture.compareFunction=X?rc:sc,U.map.depthTexture.minFilter=Mt,U.map.depthTexture.magFilter=Mt):(U.map.depthTexture.compareFunction=null,U.map.depthTexture.minFilter=bt,U.map.depthTexture.magFilter=bt);U.camera.updateProjectionMatrix()}let ee=U.map.isWebGLCubeRenderTarget?6:1;for(let ae=0;ae<ee;ae++){if(U.map.isWebGLCubeRenderTarget)r.setRenderTarget(U.map,ae),r.clear();else{ae===0&&(r.setRenderTarget(U.map),r.clear());let ce=U.getViewport(ae);o.set(s.x*ce.x,s.y*ce.y,s.x*ce.z,s.y*ce.w),N.viewport(o)}if(D.isPointLight){let ce=U.camera,oe=U.matrix,Me=D.distance||ce.far;Me!==ce.far&&(ce.far=Me,ce.updateProjectionMatrix()),eo.setFromMatrixPosition(D.matrixWorld),ce.position.copy(eo),uu.copy(ce.position),uu.add(Dy[ae]),ce.up.copy(Uy[ae]),ce.lookAt(uu),ce.updateMatrixWorld(),oe.makeTranslation(-eo.x,-eo.y,-eo.z),yp.multiplyMatrices(ce.projectionMatrix,ce.matrixWorldInverse),U._frustum.setFromProjectionMatrix(yp,ce.coordinateSystem,ce.reversedDepth)}else U.updateMatrices(D);n=U.getFrustum(),v(w,M,U.camera,D,this.type)}U.isPointLightShadow!==!0&&this.type===or&&y(U,M),U.needsUpdate=!1}g=this.type,m.needsUpdate=!1,r.setRenderTarget(A,C,E)};function y(b,w){let M=e.update(x);d.defines.VSM_SAMPLES!==b.blurSamples&&(d.defines.VSM_SAMPLES=b.blurSamples,f.defines.VSM_SAMPLES=b.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new yn(i.x,i.y,{format:Qi,type:ai})),d.uniforms.shadow_pass.value=b.map.depthTexture,d.uniforms.resolution.value=b.mapSize,d.uniforms.radius.value=b.radius,r.setRenderTarget(b.mapPass),r.clear(),r.renderBufferDirect(w,null,M,d,x,null),f.uniforms.shadow_pass.value=b.mapPass.texture,f.uniforms.resolution.value=b.mapSize,f.uniforms.radius.value=b.radius,r.setRenderTarget(b.map),r.clear(),r.renderBufferDirect(w,null,M,f,x,null)}function _(b,w,M,A){let C=null,E=M.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(E!==void 0)C=E;else if(C=M.isPointLight===!0?a:l,r.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0||w.alphaToCoverage===!0){let N=C.uuid,F=w.uuid,L=c[N];L===void 0&&(L={},c[N]=L);let I=L[F];I===void 0&&(I=C.clone(),L[F]=I,w.addEventListener("dispose",S)),C=I}if(C.visible=w.visible,C.wireframe=w.wireframe,A===or?C.side=w.shadowSide!==null?w.shadowSide:w.side:C.side=w.shadowSide!==null?w.shadowSide:u[w.side],C.alphaMap=w.alphaMap,C.alphaTest=w.alphaToCoverage===!0?.5:w.alphaTest,C.map=w.map,C.clipShadows=w.clipShadows,C.clippingPlanes=w.clippingPlanes,C.clipIntersection=w.clipIntersection,C.displacementMap=w.displacementMap,C.displacementScale=w.displacementScale,C.displacementBias=w.displacementBias,C.wireframeLinewidth=w.wireframeLinewidth,C.linewidth=w.linewidth,M.isPointLight===!0&&C.isMeshDistanceMaterial===!0){let N=r.properties.get(C);N.light=M}return C}function v(b,w,M,A,C){if(b.visible===!1)return;if(b.layers.test(w.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&C===or)&&(!b.frustumCulled||n.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(M.matrixWorldInverse,b.matrixWorld);let F=e.update(b),L=b.material;if(Array.isArray(L)){let I=F.groups;for(let D=0,U=I.length;D<U;D++){let Y=I[D],X=L[Y.materialIndex];if(X&&X.visible){let ee=_(b,X,A,C);b.onBeforeShadow(r,b,w,M,F,ee,Y),r.renderBufferDirect(M,null,F,ee,b,Y),b.onAfterShadow(r,b,w,M,F,ee,Y)}}}else if(L.visible){let I=_(b,L,A,C);b.onBeforeShadow(r,b,w,M,F,I,null),r.renderBufferDirect(M,null,F,I,b,null),b.onAfterShadow(r,b,w,M,F,I,null)}}let N=b.children;for(let F=0,L=N.length;F<L;F++)v(N[F],w,M,A,C)}function S(b){b.target.removeEventListener("dispose",S);for(let M in c){let A=c[M],C=b.target.uuid;C in A&&(A[C].dispose(),delete A[C])}}}function By(r,e){function t(){let O=!1,de=new pt,Z=null,Se=new pt(0,0,0,0);return{setMask:function(pe){Z!==pe&&!O&&(r.colorMask(pe,pe,pe,pe),Z=pe)},setLocked:function(pe){O=pe},setClear:function(pe,ie,Le,Ge,Lt){Lt===!0&&(pe*=Ge,ie*=Ge,Le*=Ge),de.set(pe,ie,Le,Ge),Se.equals(de)===!1&&(r.clearColor(pe,ie,Le,Ge),Se.copy(de))},reset:function(){O=!1,Z=null,Se.set(-1,0,0,0)}}}function n(){let O=!1,de=!1,Z=null,Se=null,pe=null;return{setReversed:function(ie){if(de!==ie){let Le=e.get("EXT_clip_control");ie?Le.clipControlEXT(Le.LOWER_LEFT_EXT,Le.ZERO_TO_ONE_EXT):Le.clipControlEXT(Le.LOWER_LEFT_EXT,Le.NEGATIVE_ONE_TO_ONE_EXT),de=ie;let Ge=pe;pe=null,this.setClear(Ge)}},getReversed:function(){return de},setTest:function(ie){ie?te(r.DEPTH_TEST):Te(r.DEPTH_TEST)},setMask:function(ie){Z!==ie&&!O&&(r.depthMask(ie),Z=ie)},setFunc:function(ie){if(de&&(ie=qf[ie]),Se!==ie){switch(ie){case Ho:r.depthFunc(r.NEVER);break;case Go:r.depthFunc(r.ALWAYS);break;case Wo:r.depthFunc(r.LESS);break;case fs:r.depthFunc(r.LEQUAL);break;case Xo:r.depthFunc(r.EQUAL);break;case Yo:r.depthFunc(r.GEQUAL);break;case qo:r.depthFunc(r.GREATER);break;case $o:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}Se=ie}},setLocked:function(ie){O=ie},setClear:function(ie){pe!==ie&&(pe=ie,de&&(ie=1-ie),r.clearDepth(ie))},reset:function(){O=!1,Z=null,Se=null,pe=null,de=!1}}}function i(){let O=!1,de=null,Z=null,Se=null,pe=null,ie=null,Le=null,Ge=null,Lt=null;return{setTest:function(dt){O||(dt?te(r.STENCIL_TEST):Te(r.STENCIL_TEST))},setMask:function(dt){de!==dt&&!O&&(r.stencilMask(dt),de=dt)},setFunc:function(dt,_i,Yn){(Z!==dt||Se!==_i||pe!==Yn)&&(r.stencilFunc(dt,_i,Yn),Z=dt,Se=_i,pe=Yn)},setOp:function(dt,_i,Yn){(ie!==dt||Le!==_i||Ge!==Yn)&&(r.stencilOp(dt,_i,Yn),ie=dt,Le=_i,Ge=Yn)},setLocked:function(dt){O=dt},setClear:function(dt){Lt!==dt&&(r.clearStencil(dt),Lt=dt)},reset:function(){O=!1,de=null,Z=null,Se=null,pe=null,ie=null,Le=null,Ge=null,Lt=null}}}let s=new t,o=new n,l=new i,a=new WeakMap,c=new WeakMap,h={},u={},d={},f=new WeakMap,p=[],x=null,m=!1,g=null,y=null,_=null,v=null,S=null,b=null,w=null,M=new Be(0,0,0),A=0,C=!1,E=null,N=null,F=null,L=null,I=null,D=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS),U=!1,Y=0,X=r.getParameter(r.VERSION);X.indexOf("WebGL")!==-1?(Y=parseFloat(/^WebGL (\d)/.exec(X)[1]),U=Y>=1):X.indexOf("OpenGL ES")!==-1&&(Y=parseFloat(/^OpenGL ES (\d)/.exec(X)[1]),U=Y>=2);let ee=null,ae={},ce=r.getParameter(r.SCISSOR_BOX),oe=r.getParameter(r.VIEWPORT),Me=new pt().fromArray(ce),me=new pt().fromArray(oe);function K(O,de,Z,Se){let pe=new Uint8Array(4),ie=r.createTexture();r.bindTexture(O,ie),r.texParameteri(O,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(O,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let Le=0;Le<Z;Le++)O===r.TEXTURE_3D||O===r.TEXTURE_2D_ARRAY?r.texImage3D(de,0,r.RGBA,1,1,Se,0,r.RGBA,r.UNSIGNED_BYTE,pe):r.texImage2D(de+Le,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,pe);return ie}let le={};le[r.TEXTURE_2D]=K(r.TEXTURE_2D,r.TEXTURE_2D,1),le[r.TEXTURE_CUBE_MAP]=K(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),le[r.TEXTURE_2D_ARRAY]=K(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),le[r.TEXTURE_3D]=K(r.TEXTURE_3D,r.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),l.setClear(0),te(r.DEPTH_TEST),o.setFunc(fs),Et(!1),ut(Th),te(r.CULL_FACE),lt(ri);function te(O){h[O]!==!0&&(r.enable(O),h[O]=!0)}function Te(O){h[O]!==!1&&(r.disable(O),h[O]=!1)}function Re(O,de){return d[O]!==de?(r.bindFramebuffer(O,de),d[O]=de,O===r.DRAW_FRAMEBUFFER&&(d[r.FRAMEBUFFER]=de),O===r.FRAMEBUFFER&&(d[r.DRAW_FRAMEBUFFER]=de),!0):!1}function Ne(O,de){let Z=p,Se=!1;if(O){Z=f.get(de),Z===void 0&&(Z=[],f.set(de,Z));let pe=O.textures;if(Z.length!==pe.length||Z[0]!==r.COLOR_ATTACHMENT0){for(let ie=0,Le=pe.length;ie<Le;ie++)Z[ie]=r.COLOR_ATTACHMENT0+ie;Z.length=pe.length,Se=!0}}else Z[0]!==r.BACK&&(Z[0]=r.BACK,Se=!0);Se&&r.drawBuffers(Z)}function ot(O){return x!==O?(r.useProgram(O),x=O,!0):!1}let Ke={[Yi]:r.FUNC_ADD,[_f]:r.FUNC_SUBTRACT,[yf]:r.FUNC_REVERSE_SUBTRACT};Ke[vf]=r.MIN,Ke[bf]=r.MAX;let it={[Mf]:r.ZERO,[lr]:r.ONE,[Sf]:r.SRC_COLOR,[zo]:r.SRC_ALPHA,[Ef]:r.SRC_ALPHA_SATURATE,[gl]:r.DST_COLOR,[wf]:r.DST_ALPHA,[Wa]:r.ONE_MINUS_SRC_COLOR,[ds]:r.ONE_MINUS_SRC_ALPHA,[Af]:r.ONE_MINUS_DST_COLOR,[Tf]:r.ONE_MINUS_DST_ALPHA,[Rf]:r.CONSTANT_COLOR,[Cf]:r.ONE_MINUS_CONSTANT_COLOR,[If]:r.CONSTANT_ALPHA,[Pf]:r.ONE_MINUS_CONSTANT_ALPHA};function lt(O,de,Z,Se,pe,ie,Le,Ge,Lt,dt){if(O===ri){m===!0&&(Te(r.BLEND),m=!1);return}if(m===!1&&(te(r.BLEND),m=!0),O!==Ga){if(O!==g||dt!==C){if((y!==Yi||S!==Yi)&&(r.blendEquation(r.FUNC_ADD),y=Yi,S=Yi),dt)switch(O){case En:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case Ha:r.blendFunc(r.ONE,r.ONE);break;case Ah:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case Eh:r.blendFuncSeparate(r.DST_COLOR,r.ONE_MINUS_SRC_ALPHA,r.ZERO,r.ONE);break;default:Oe("WebGLState: Invalid blending: ",O);break}else switch(O){case En:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case Ha:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE,r.ONE,r.ONE);break;case Ah:Oe("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Eh:Oe("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Oe("WebGLState: Invalid blending: ",O);break}_=null,v=null,b=null,w=null,M.set(0,0,0),A=0,g=O,C=dt}return}pe=pe||de,ie=ie||Z,Le=Le||Se,(de!==y||pe!==S)&&(r.blendEquationSeparate(Ke[de],Ke[pe]),y=de,S=pe),(Z!==_||Se!==v||ie!==b||Le!==w)&&(r.blendFuncSeparate(it[Z],it[Se],it[ie],it[Le]),_=Z,v=Se,b=ie,w=Le),(Ge.equals(M)===!1||Lt!==A)&&(r.blendColor(Ge.r,Ge.g,Ge.b,Lt),M.copy(Ge),A=Lt),g=O,C=!1}function qe(O,de){O.side===en?Te(r.CULL_FACE):te(r.CULL_FACE);let Z=O.side===ln;de&&(Z=!Z),Et(Z),O.blending===En&&O.transparent===!1?lt(ri):lt(O.blending,O.blendEquation,O.blendSrc,O.blendDst,O.blendEquationAlpha,O.blendSrcAlpha,O.blendDstAlpha,O.blendColor,O.blendAlpha,O.premultipliedAlpha),o.setFunc(O.depthFunc),o.setTest(O.depthTest),o.setMask(O.depthWrite),s.setMask(O.colorWrite);let Se=O.stencilWrite;l.setTest(Se),Se&&(l.setMask(O.stencilWriteMask),l.setFunc(O.stencilFunc,O.stencilRef,O.stencilFuncMask),l.setOp(O.stencilFail,O.stencilZFail,O.stencilZPass)),B(O.polygonOffset,O.polygonOffsetFactor,O.polygonOffsetUnits),O.alphaToCoverage===!0?te(r.SAMPLE_ALPHA_TO_COVERAGE):Te(r.SAMPLE_ALPHA_TO_COVERAGE)}function Et(O){E!==O&&(O?r.frontFace(r.CW):r.frontFace(r.CCW),E=O)}function ut(O){O!==mf?(te(r.CULL_FACE),O!==N&&(O===Th?r.cullFace(r.BACK):O===gf?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):Te(r.CULL_FACE),N=O}function Yt(O){O!==F&&(U&&r.lineWidth(O),F=O)}function B(O,de,Z){O?(te(r.POLYGON_OFFSET_FILL),(L!==de||I!==Z)&&(L=de,I=Z,o.getReversed()&&(de=-de),r.polygonOffset(de,Z))):Te(r.POLYGON_OFFSET_FILL)}function yt(O){O?te(r.SCISSOR_TEST):Te(r.SCISSOR_TEST)}function He(O){O===void 0&&(O=r.TEXTURE0+D-1),ee!==O&&(r.activeTexture(O),ee=O)}function ct(O,de,Z){Z===void 0&&(ee===null?Z=r.TEXTURE0+D-1:Z=ee);let Se=ae[Z];Se===void 0&&(Se={type:void 0,texture:void 0},ae[Z]=Se),(Se.type!==O||Se.texture!==de)&&(ee!==Z&&(r.activeTexture(Z),ee=Z),r.bindTexture(O,de||le[O]),Se.type=O,Se.texture=de)}function xe(){let O=ae[ee];O!==void 0&&O.type!==void 0&&(r.bindTexture(O.type,null),O.type=void 0,O.texture=void 0)}function Rt(){try{r.compressedTexImage2D(...arguments)}catch(O){Oe("WebGLState:",O)}}function P(){try{r.compressedTexImage3D(...arguments)}catch(O){Oe("WebGLState:",O)}}function T(){try{r.texSubImage2D(...arguments)}catch(O){Oe("WebGLState:",O)}}function H(){try{r.texSubImage3D(...arguments)}catch(O){Oe("WebGLState:",O)}}function J(){try{r.compressedTexSubImage2D(...arguments)}catch(O){Oe("WebGLState:",O)}}function re(){try{r.compressedTexSubImage3D(...arguments)}catch(O){Oe("WebGLState:",O)}}function he(){try{r.texStorage2D(...arguments)}catch(O){Oe("WebGLState:",O)}}function ge(){try{r.texStorage3D(...arguments)}catch(O){Oe("WebGLState:",O)}}function $(){try{r.texImage2D(...arguments)}catch(O){Oe("WebGLState:",O)}}function j(){try{r.texImage3D(...arguments)}catch(O){Oe("WebGLState:",O)}}function be(O){return u[O]!==void 0?u[O]:r.getParameter(O)}function Ae(O,de){u[O]!==de&&(r.pixelStorei(O,de),u[O]=de)}function fe(O){Me.equals(O)===!1&&(r.scissor(O.x,O.y,O.z,O.w),Me.copy(O))}function ue(O){me.equals(O)===!1&&(r.viewport(O.x,O.y,O.z,O.w),me.copy(O))}function Ve(O,de){let Z=c.get(de);Z===void 0&&(Z=new WeakMap,c.set(de,Z));let Se=Z.get(O);Se===void 0&&(Se=r.getUniformBlockIndex(de,O.name),Z.set(O,Se))}function Xe(O,de){let Se=c.get(de).get(O);a.get(de)!==Se&&(r.uniformBlockBinding(de,Se,O.__bindingPointIndex),a.set(de,Se))}function rt(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),o.setReversed(!1),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),r.pixelStorei(r.PACK_ALIGNMENT,4),r.pixelStorei(r.UNPACK_ALIGNMENT,4),r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,!1),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,r.BROWSER_DEFAULT_WEBGL),r.pixelStorei(r.PACK_ROW_LENGTH,0),r.pixelStorei(r.PACK_SKIP_PIXELS,0),r.pixelStorei(r.PACK_SKIP_ROWS,0),r.pixelStorei(r.UNPACK_ROW_LENGTH,0),r.pixelStorei(r.UNPACK_IMAGE_HEIGHT,0),r.pixelStorei(r.UNPACK_SKIP_PIXELS,0),r.pixelStorei(r.UNPACK_SKIP_ROWS,0),r.pixelStorei(r.UNPACK_SKIP_IMAGES,0),h={},u={},ee=null,ae={},d={},f=new WeakMap,p=[],x=null,m=!1,g=null,y=null,_=null,v=null,S=null,b=null,w=null,M=new Be(0,0,0),A=0,C=!1,E=null,N=null,F=null,L=null,I=null,Me.set(0,0,r.canvas.width,r.canvas.height),me.set(0,0,r.canvas.width,r.canvas.height),s.reset(),o.reset(),l.reset()}return{buffers:{color:s,depth:o,stencil:l},enable:te,disable:Te,bindFramebuffer:Re,drawBuffers:Ne,useProgram:ot,setBlending:lt,setMaterial:qe,setFlipSided:Et,setCullFace:ut,setLineWidth:Yt,setPolygonOffset:B,setScissorTest:yt,activeTexture:He,bindTexture:ct,unbindTexture:xe,compressedTexImage2D:Rt,compressedTexImage3D:P,texImage2D:$,texImage3D:j,pixelStorei:Ae,getParameter:be,updateUBOMapping:Ve,uniformBlockBinding:Xe,texStorage2D:he,texStorage3D:ge,texSubImage2D:T,texSubImage3D:H,compressedTexSubImage2D:J,compressedTexSubImage3D:re,scissor:fe,viewport:ue,reset:rt}}function ky(r,e,t,n,i,s,o){let l=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,a=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new et,h=new WeakMap,u=new Set,d,f=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(P,T){return p?new OffscreenCanvas(P,T):Ks("canvas")}function m(P,T,H){let J=1,re=Rt(P);if((re.width>H||re.height>H)&&(J=H/Math.max(re.width,re.height)),J<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){let he=Math.floor(J*re.width),ge=Math.floor(J*re.height);d===void 0&&(d=x(he,ge));let $=T?x(he,ge):d;return $.width=he,$.height=ge,$.getContext("2d").drawImage(P,0,0,he,ge),Ie("WebGLRenderer: Texture has been resized from ("+re.width+"x"+re.height+") to ("+he+"x"+ge+")."),$}else return"data"in P&&Ie("WebGLRenderer: Image in DataTexture is too big ("+re.width+"x"+re.height+")."),P;return P}function g(P){return P.generateMipmaps}function y(P){r.generateMipmap(P)}function _(P){return P.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?r.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?r.TEXTURE_2D_ARRAY:r.TEXTURE_2D}function v(P,T,H,J,re,he=!1){if(P!==null){if(r[P]!==void 0)return r[P];Ie("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let ge;J&&(ge=e.get("EXT_texture_norm16"),ge||Ie("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let $=T;if(T===r.RED&&(H===r.FLOAT&&($=r.R32F),H===r.HALF_FLOAT&&($=r.R16F),H===r.UNSIGNED_BYTE&&($=r.R8),H===r.UNSIGNED_SHORT&&ge&&($=ge.R16_EXT),H===r.SHORT&&ge&&($=ge.R16_SNORM_EXT)),T===r.RED_INTEGER&&(H===r.UNSIGNED_BYTE&&($=r.R8UI),H===r.UNSIGNED_SHORT&&($=r.R16UI),H===r.UNSIGNED_INT&&($=r.R32UI),H===r.BYTE&&($=r.R8I),H===r.SHORT&&($=r.R16I),H===r.INT&&($=r.R32I)),T===r.RG&&(H===r.FLOAT&&($=r.RG32F),H===r.HALF_FLOAT&&($=r.RG16F),H===r.UNSIGNED_BYTE&&($=r.RG8),H===r.UNSIGNED_SHORT&&ge&&($=ge.RG16_EXT),H===r.SHORT&&ge&&($=ge.RG16_SNORM_EXT)),T===r.RG_INTEGER&&(H===r.UNSIGNED_BYTE&&($=r.RG8UI),H===r.UNSIGNED_SHORT&&($=r.RG16UI),H===r.UNSIGNED_INT&&($=r.RG32UI),H===r.BYTE&&($=r.RG8I),H===r.SHORT&&($=r.RG16I),H===r.INT&&($=r.RG32I)),T===r.RGB_INTEGER&&(H===r.UNSIGNED_BYTE&&($=r.RGB8UI),H===r.UNSIGNED_SHORT&&($=r.RGB16UI),H===r.UNSIGNED_INT&&($=r.RGB32UI),H===r.BYTE&&($=r.RGB8I),H===r.SHORT&&($=r.RGB16I),H===r.INT&&($=r.RGB32I)),T===r.RGBA_INTEGER&&(H===r.UNSIGNED_BYTE&&($=r.RGBA8UI),H===r.UNSIGNED_SHORT&&($=r.RGBA16UI),H===r.UNSIGNED_INT&&($=r.RGBA32UI),H===r.BYTE&&($=r.RGBA8I),H===r.SHORT&&($=r.RGBA16I),H===r.INT&&($=r.RGBA32I)),T===r.RGB&&(H===r.UNSIGNED_SHORT&&ge&&($=ge.RGB16_EXT),H===r.SHORT&&ge&&($=ge.RGB16_SNORM_EXT),H===r.UNSIGNED_INT_5_9_9_9_REV&&($=r.RGB9_E5),H===r.UNSIGNED_INT_10F_11F_11F_REV&&($=r.R11F_G11F_B10F)),T===r.RGBA){let j=he?ga:Je.getTransfer(re);H===r.FLOAT&&($=r.RGBA32F),H===r.HALF_FLOAT&&($=r.RGBA16F),H===r.UNSIGNED_BYTE&&($=j===at?r.SRGB8_ALPHA8:r.RGBA8),H===r.UNSIGNED_SHORT&&ge&&($=ge.RGBA16_EXT),H===r.SHORT&&ge&&($=ge.RGBA16_SNORM_EXT),H===r.UNSIGNED_SHORT_4_4_4_4&&($=r.RGBA4),H===r.UNSIGNED_SHORT_5_5_5_1&&($=r.RGB5_A1)}return($===r.R16F||$===r.R32F||$===r.RG16F||$===r.RG32F||$===r.RGBA16F||$===r.RGBA32F)&&e.get("EXT_color_buffer_float"),$}function S(P,T){let H;return P?T===null||T===Hn||T===ur?H=r.DEPTH24_STENCIL8:T===bn?H=r.DEPTH32F_STENCIL8:T===hr&&(H=r.DEPTH24_STENCIL8,Ie("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):T===null||T===Hn||T===ur?H=r.DEPTH_COMPONENT24:T===bn?H=r.DEPTH_COMPONENT32F:T===hr&&(H=r.DEPTH_COMPONENT16),H}function b(P,T){return g(P)===!0||P.isFramebufferTexture&&P.minFilter!==bt&&P.minFilter!==Mt?Math.log2(Math.max(T.width,T.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?T.mipmaps.length:1}function w(P){let T=P.target;T.removeEventListener("dispose",w),A(T),T.isVideoTexture&&h.delete(T),T.isHTMLTexture&&u.delete(T)}function M(P){let T=P.target;T.removeEventListener("dispose",M),E(T)}function A(P){let T=n.get(P);if(T.__webglInit===void 0)return;let H=P.source,J=f.get(H);if(J){let re=J[T.__cacheKey];re.usedTimes--,re.usedTimes===0&&C(P),Object.keys(J).length===0&&f.delete(H)}n.remove(P)}function C(P){let T=n.get(P);r.deleteTexture(T.__webglTexture);let H=P.source,J=f.get(H);delete J[T.__cacheKey],o.memory.textures--}function E(P){let T=n.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),n.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let J=0;J<6;J++){if(Array.isArray(T.__webglFramebuffer[J]))for(let re=0;re<T.__webglFramebuffer[J].length;re++)r.deleteFramebuffer(T.__webglFramebuffer[J][re]);else r.deleteFramebuffer(T.__webglFramebuffer[J]);T.__webglDepthbuffer&&r.deleteRenderbuffer(T.__webglDepthbuffer[J])}else{if(Array.isArray(T.__webglFramebuffer))for(let J=0;J<T.__webglFramebuffer.length;J++)r.deleteFramebuffer(T.__webglFramebuffer[J]);else r.deleteFramebuffer(T.__webglFramebuffer);if(T.__webglDepthbuffer&&r.deleteRenderbuffer(T.__webglDepthbuffer),T.__webglMultisampledFramebuffer&&r.deleteFramebuffer(T.__webglMultisampledFramebuffer),T.__webglColorRenderbuffer)for(let J=0;J<T.__webglColorRenderbuffer.length;J++)T.__webglColorRenderbuffer[J]&&r.deleteRenderbuffer(T.__webglColorRenderbuffer[J]);T.__webglDepthRenderbuffer&&r.deleteRenderbuffer(T.__webglDepthRenderbuffer)}let H=P.textures;for(let J=0,re=H.length;J<re;J++){let he=n.get(H[J]);he.__webglTexture&&(r.deleteTexture(he.__webglTexture),o.memory.textures--),n.remove(H[J])}n.remove(P)}let N=0;function F(){N=0}function L(){return N}function I(P){N=P}function D(){let P=N;return P>=i.maxTextures&&Ie("WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+i.maxTextures),N+=1,P}function U(P){let T=[];return T.push(P.wrapS),T.push(P.wrapT),T.push(P.wrapR||0),T.push(P.magFilter),T.push(P.minFilter),T.push(P.anisotropy),T.push(P.internalFormat),T.push(P.format),T.push(P.type),T.push(P.generateMipmaps),T.push(P.premultiplyAlpha),T.push(P.flipY),T.push(P.unpackAlignment),T.push(P.colorSpace),T.join()}function Y(P,T){let H=n.get(P);if(P.isVideoTexture&&ct(P),P.isRenderTargetTexture===!1&&P.isExternalTexture!==!0&&P.version>0&&H.__version!==P.version){let J=P.image;if(J===null)Ie("WebGLRenderer: Texture marked for update but no image data found.");else if(J.complete===!1)Ie("WebGLRenderer: Texture marked for update but image is incomplete");else{Te(H,P,T);return}}else P.isExternalTexture&&(H.__webglTexture=P.sourceTexture?P.sourceTexture:null);t.bindTexture(r.TEXTURE_2D,H.__webglTexture,r.TEXTURE0+T)}function X(P,T){let H=n.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&H.__version!==P.version){Te(H,P,T);return}else P.isExternalTexture&&(H.__webglTexture=P.sourceTexture?P.sourceTexture:null);t.bindTexture(r.TEXTURE_2D_ARRAY,H.__webglTexture,r.TEXTURE0+T)}function ee(P,T){let H=n.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&H.__version!==P.version){Te(H,P,T);return}t.bindTexture(r.TEXTURE_3D,H.__webglTexture,r.TEXTURE0+T)}function ae(P,T){let H=n.get(P);if(P.isCubeDepthTexture!==!0&&P.version>0&&H.__version!==P.version){Re(H,P,T);return}t.bindTexture(r.TEXTURE_CUBE_MAP,H.__webglTexture,r.TEXTURE0+T)}let ce={[Jn]:r.REPEAT,[cn]:r.CLAMP_TO_EDGE,[qi]:r.MIRRORED_REPEAT},oe={[bt]:r.NEAREST,[yl]:r.NEAREST_MIPMAP_NEAREST,[Ms]:r.NEAREST_MIPMAP_LINEAR,[Mt]:r.LINEAR,[cr]:r.LINEAR_MIPMAP_NEAREST,[zn]:r.LINEAR_MIPMAP_LINEAR},Me={[Bf]:r.NEVER,[Gf]:r.ALWAYS,[kf]:r.LESS,[sc]:r.LEQUAL,[Vf]:r.EQUAL,[rc]:r.GEQUAL,[zf]:r.GREATER,[Hf]:r.NOTEQUAL};function me(P,T){if(T.type===bn&&e.has("OES_texture_float_linear")===!1&&(T.magFilter===Mt||T.magFilter===cr||T.magFilter===Ms||T.magFilter===zn||T.minFilter===Mt||T.minFilter===cr||T.minFilter===Ms||T.minFilter===zn)&&Ie("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(P,r.TEXTURE_WRAP_S,ce[T.wrapS]),r.texParameteri(P,r.TEXTURE_WRAP_T,ce[T.wrapT]),(P===r.TEXTURE_3D||P===r.TEXTURE_2D_ARRAY)&&r.texParameteri(P,r.TEXTURE_WRAP_R,ce[T.wrapR]),r.texParameteri(P,r.TEXTURE_MAG_FILTER,oe[T.magFilter]),r.texParameteri(P,r.TEXTURE_MIN_FILTER,oe[T.minFilter]),T.compareFunction&&(r.texParameteri(P,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(P,r.TEXTURE_COMPARE_FUNC,Me[T.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(T.magFilter===bt||T.minFilter!==Ms&&T.minFilter!==zn||T.type===bn&&e.has("OES_texture_float_linear")===!1)return;if(T.anisotropy>1||n.get(T).__currentAnisotropy){let H=e.get("EXT_texture_filter_anisotropic");r.texParameterf(P,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,i.getMaxAnisotropy())),n.get(T).__currentAnisotropy=T.anisotropy}}}function K(P,T){let H=!1;P.__webglInit===void 0&&(P.__webglInit=!0,T.addEventListener("dispose",w));let J=T.source,re=f.get(J);re===void 0&&(re={},f.set(J,re));let he=U(T);if(he!==P.__cacheKey){re[he]===void 0&&(re[he]={texture:r.createTexture(),usedTimes:0},o.memory.textures++,H=!0),re[he].usedTimes++;let ge=re[P.__cacheKey];ge!==void 0&&(re[P.__cacheKey].usedTimes--,ge.usedTimes===0&&C(T)),P.__cacheKey=he,P.__webglTexture=re[he].texture}return H}function le(P,T,H){return Math.floor(Math.floor(P/H)/T)}function te(P,T,H,J){let he=P.updateRanges;if(he.length===0)t.texSubImage2D(r.TEXTURE_2D,0,0,0,T.width,T.height,H,J,T.data);else{he.sort((Ae,fe)=>Ae.start-fe.start);let ge=0;for(let Ae=1;Ae<he.length;Ae++){let fe=he[ge],ue=he[Ae],Ve=fe.start+fe.count,Xe=le(ue.start,T.width,4),rt=le(fe.start,T.width,4);ue.start<=Ve+1&&Xe===rt&&le(ue.start+ue.count-1,T.width,4)===Xe?fe.count=Math.max(fe.count,ue.start+ue.count-fe.start):(++ge,he[ge]=ue)}he.length=ge+1;let $=t.getParameter(r.UNPACK_ROW_LENGTH),j=t.getParameter(r.UNPACK_SKIP_PIXELS),be=t.getParameter(r.UNPACK_SKIP_ROWS);t.pixelStorei(r.UNPACK_ROW_LENGTH,T.width);for(let Ae=0,fe=he.length;Ae<fe;Ae++){let ue=he[Ae],Ve=Math.floor(ue.start/4),Xe=Math.ceil(ue.count/4),rt=Ve%T.width,O=Math.floor(Ve/T.width),de=Xe,Z=1;t.pixelStorei(r.UNPACK_SKIP_PIXELS,rt),t.pixelStorei(r.UNPACK_SKIP_ROWS,O),t.texSubImage2D(r.TEXTURE_2D,0,rt,O,de,Z,H,J,T.data)}P.clearUpdateRanges(),t.pixelStorei(r.UNPACK_ROW_LENGTH,$),t.pixelStorei(r.UNPACK_SKIP_PIXELS,j),t.pixelStorei(r.UNPACK_SKIP_ROWS,be)}}function Te(P,T,H){let J=r.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(J=r.TEXTURE_2D_ARRAY),T.isData3DTexture&&(J=r.TEXTURE_3D);let re=K(P,T),he=T.source;t.bindTexture(J,P.__webglTexture,r.TEXTURE0+H);let ge=n.get(he);if(he.version!==ge.__version||re===!0){if(t.activeTexture(r.TEXTURE0+H),(typeof ImageBitmap<"u"&&T.image instanceof ImageBitmap)===!1){let Z=Je.getPrimaries(Je.workingColorSpace),Se=T.colorSpace===Ii?null:Je.getPrimaries(T.colorSpace),pe=T.colorSpace===Ii||Z===Se?r.NONE:r.BROWSER_DEFAULT_WEBGL;t.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,T.flipY),t.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),t.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,pe)}t.pixelStorei(r.UNPACK_ALIGNMENT,T.unpackAlignment);let j=m(T.image,!1,i.maxTextureSize);j=xe(T,j);let be=s.convert(T.format,T.colorSpace),Ae=s.convert(T.type),fe=v(T.internalFormat,be,Ae,T.normalized,T.colorSpace,T.isVideoTexture);me(J,T);let ue,Ve=T.mipmaps,Xe=T.isVideoTexture!==!0,rt=ge.__version===void 0||re===!0,O=he.dataReady,de=b(T,j);if(T.isDepthTexture)fe=S(T.format===ji,T.type),rt&&(Xe?t.texStorage2D(r.TEXTURE_2D,1,fe,j.width,j.height):t.texImage2D(r.TEXTURE_2D,0,fe,j.width,j.height,0,be,Ae,null));else if(T.isDataTexture)if(Ve.length>0){Xe&&rt&&t.texStorage2D(r.TEXTURE_2D,de,fe,Ve[0].width,Ve[0].height);for(let Z=0,Se=Ve.length;Z<Se;Z++)ue=Ve[Z],Xe?O&&t.texSubImage2D(r.TEXTURE_2D,Z,0,0,ue.width,ue.height,be,Ae,ue.data):t.texImage2D(r.TEXTURE_2D,Z,fe,ue.width,ue.height,0,be,Ae,ue.data);T.generateMipmaps=!1}else Xe?(rt&&t.texStorage2D(r.TEXTURE_2D,de,fe,j.width,j.height),O&&te(T,j,be,Ae)):t.texImage2D(r.TEXTURE_2D,0,fe,j.width,j.height,0,be,Ae,j.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){Xe&&rt&&t.texStorage3D(r.TEXTURE_2D_ARRAY,de,fe,Ve[0].width,Ve[0].height,j.depth);for(let Z=0,Se=Ve.length;Z<Se;Z++)if(ue=Ve[Z],T.format!==Mn)if(be!==null)if(Xe){if(O)if(T.layerUpdates.size>0){let pe=eu(ue.width,ue.height,T.format,T.type);for(let ie of T.layerUpdates){let Le=ue.data.subarray(ie*pe/ue.data.BYTES_PER_ELEMENT,(ie+1)*pe/ue.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,Z,0,0,ie,ue.width,ue.height,1,be,Le)}T.clearLayerUpdates()}else t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,Z,0,0,0,ue.width,ue.height,j.depth,be,ue.data)}else t.compressedTexImage3D(r.TEXTURE_2D_ARRAY,Z,fe,ue.width,ue.height,j.depth,0,ue.data,0,0);else Ie("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Xe?O&&t.texSubImage3D(r.TEXTURE_2D_ARRAY,Z,0,0,0,ue.width,ue.height,j.depth,be,Ae,ue.data):t.texImage3D(r.TEXTURE_2D_ARRAY,Z,fe,ue.width,ue.height,j.depth,0,be,Ae,ue.data)}else{Xe&&rt&&t.texStorage2D(r.TEXTURE_2D,de,fe,Ve[0].width,Ve[0].height);for(let Z=0,Se=Ve.length;Z<Se;Z++)ue=Ve[Z],T.format!==Mn?be!==null?Xe?O&&t.compressedTexSubImage2D(r.TEXTURE_2D,Z,0,0,ue.width,ue.height,be,ue.data):t.compressedTexImage2D(r.TEXTURE_2D,Z,fe,ue.width,ue.height,0,ue.data):Ie("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Xe?O&&t.texSubImage2D(r.TEXTURE_2D,Z,0,0,ue.width,ue.height,be,Ae,ue.data):t.texImage2D(r.TEXTURE_2D,Z,fe,ue.width,ue.height,0,be,Ae,ue.data)}else if(T.isDataArrayTexture)if(Xe){if(rt&&t.texStorage3D(r.TEXTURE_2D_ARRAY,de,fe,j.width,j.height,j.depth),O)if(T.layerUpdates.size>0){let Z=eu(j.width,j.height,T.format,T.type);for(let Se of T.layerUpdates){let pe=j.data.subarray(Se*Z/j.data.BYTES_PER_ELEMENT,(Se+1)*Z/j.data.BYTES_PER_ELEMENT);t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,Se,j.width,j.height,1,be,Ae,pe)}T.clearLayerUpdates()}else t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,j.width,j.height,j.depth,be,Ae,j.data)}else t.texImage3D(r.TEXTURE_2D_ARRAY,0,fe,j.width,j.height,j.depth,0,be,Ae,j.data);else if(T.isData3DTexture)Xe?(rt&&t.texStorage3D(r.TEXTURE_3D,de,fe,j.width,j.height,j.depth),O&&t.texSubImage3D(r.TEXTURE_3D,0,0,0,0,j.width,j.height,j.depth,be,Ae,j.data)):t.texImage3D(r.TEXTURE_3D,0,fe,j.width,j.height,j.depth,0,be,Ae,j.data);else if(T.isFramebufferTexture){if(rt)if(Xe)t.texStorage2D(r.TEXTURE_2D,de,fe,j.width,j.height);else{let Z=j.width,Se=j.height;for(let pe=0;pe<de;pe++)t.texImage2D(r.TEXTURE_2D,pe,fe,Z,Se,0,be,Ae,null),Z>>=1,Se>>=1}}else if(T.isHTMLTexture){if("texElementImage2D"in r){let Z=r.canvas;if(Z.hasAttribute("layoutsubtree")||Z.setAttribute("layoutsubtree","true"),j.parentNode!==Z){Z.appendChild(j),u.add(T),Z.onpaint=Ge=>{let Lt=Ge.changedElements;for(let dt of u)Lt.includes(dt.image)&&(dt.needsUpdate=!0)},Z.requestPaint();return}let Se=0,pe=r.RGBA,ie=r.RGBA,Le=r.UNSIGNED_BYTE;r.texElementImage2D(r.TEXTURE_2D,Se,pe,ie,Le,j),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE)}}else if(Ve.length>0){if(Xe&&rt){let Z=Rt(Ve[0]);t.texStorage2D(r.TEXTURE_2D,de,fe,Z.width,Z.height)}for(let Z=0,Se=Ve.length;Z<Se;Z++)ue=Ve[Z],Xe?O&&t.texSubImage2D(r.TEXTURE_2D,Z,0,0,be,Ae,ue):t.texImage2D(r.TEXTURE_2D,Z,fe,be,Ae,ue);T.generateMipmaps=!1}else if(Xe){if(rt){let Z=Rt(j);t.texStorage2D(r.TEXTURE_2D,de,fe,Z.width,Z.height)}O&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,be,Ae,j)}else t.texImage2D(r.TEXTURE_2D,0,fe,be,Ae,j);g(T)&&y(J),ge.__version=he.version,T.onUpdate&&T.onUpdate(T)}P.__version=T.version}function Re(P,T,H){if(T.image.length!==6)return;let J=K(P,T),re=T.source;t.bindTexture(r.TEXTURE_CUBE_MAP,P.__webglTexture,r.TEXTURE0+H);let he=n.get(re);if(re.version!==he.__version||J===!0){t.activeTexture(r.TEXTURE0+H);let ge=Je.getPrimaries(Je.workingColorSpace),$=T.colorSpace===Ii?null:Je.getPrimaries(T.colorSpace),j=T.colorSpace===Ii||ge===$?r.NONE:r.BROWSER_DEFAULT_WEBGL;t.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,T.flipY),t.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),t.pixelStorei(r.UNPACK_ALIGNMENT,T.unpackAlignment),t.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,j);let be=T.isCompressedTexture||T.image[0].isCompressedTexture,Ae=T.image[0]&&T.image[0].isDataTexture,fe=[];for(let ie=0;ie<6;ie++)!be&&!Ae?fe[ie]=m(T.image[ie],!0,i.maxCubemapSize):fe[ie]=Ae?T.image[ie].image:T.image[ie],fe[ie]=xe(T,fe[ie]);let ue=fe[0],Ve=s.convert(T.format,T.colorSpace),Xe=s.convert(T.type),rt=v(T.internalFormat,Ve,Xe,T.normalized,T.colorSpace),O=T.isVideoTexture!==!0,de=he.__version===void 0||J===!0,Z=re.dataReady,Se=b(T,ue);me(r.TEXTURE_CUBE_MAP,T);let pe;if(be){O&&de&&t.texStorage2D(r.TEXTURE_CUBE_MAP,Se,rt,ue.width,ue.height);for(let ie=0;ie<6;ie++){pe=fe[ie].mipmaps;for(let Le=0;Le<pe.length;Le++){let Ge=pe[Le];T.format!==Mn?Ve!==null?O?Z&&t.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Le,0,0,Ge.width,Ge.height,Ve,Ge.data):t.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Le,rt,Ge.width,Ge.height,0,Ge.data):Ie("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):O?Z&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Le,0,0,Ge.width,Ge.height,Ve,Xe,Ge.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Le,rt,Ge.width,Ge.height,0,Ve,Xe,Ge.data)}}}else{if(pe=T.mipmaps,O&&de){pe.length>0&&Se++;let ie=Rt(fe[0]);t.texStorage2D(r.TEXTURE_CUBE_MAP,Se,rt,ie.width,ie.height)}for(let ie=0;ie<6;ie++)if(Ae){O?Z&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,0,0,fe[ie].width,fe[ie].height,Ve,Xe,fe[ie].data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,rt,fe[ie].width,fe[ie].height,0,Ve,Xe,fe[ie].data);for(let Le=0;Le<pe.length;Le++){let Lt=pe[Le].image[ie].image;O?Z&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Le+1,0,0,Lt.width,Lt.height,Ve,Xe,Lt.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Le+1,rt,Lt.width,Lt.height,0,Ve,Xe,Lt.data)}}else{O?Z&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,0,0,Ve,Xe,fe[ie]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,rt,Ve,Xe,fe[ie]);for(let Le=0;Le<pe.length;Le++){let Ge=pe[Le];O?Z&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Le+1,0,0,Ve,Xe,Ge.image[ie]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Le+1,rt,Ve,Xe,Ge.image[ie])}}}g(T)&&y(r.TEXTURE_CUBE_MAP),he.__version=re.version,T.onUpdate&&T.onUpdate(T)}P.__version=T.version}function Ne(P,T,H,J,re,he){let ge=s.convert(H.format,H.colorSpace),$=s.convert(H.type),j=v(H.internalFormat,ge,$,H.normalized,H.colorSpace),be=n.get(T),Ae=n.get(H);if(Ae.__renderTarget=T,!be.__hasExternalTextures){let fe=Math.max(1,T.width>>he),ue=Math.max(1,T.height>>he);re===r.TEXTURE_3D||re===r.TEXTURE_2D_ARRAY?t.texImage3D(re,he,j,fe,ue,T.depth,0,ge,$,null):t.texImage2D(re,he,j,fe,ue,0,ge,$,null)}t.bindFramebuffer(r.FRAMEBUFFER,P),He(T)?l.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,J,re,Ae.__webglTexture,0,yt(T)):(re===r.TEXTURE_2D||re>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&re<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,J,re,Ae.__webglTexture,he),t.bindFramebuffer(r.FRAMEBUFFER,null)}function ot(P,T,H){if(r.bindRenderbuffer(r.RENDERBUFFER,P),T.depthBuffer){let J=T.depthTexture,re=J&&J.isDepthTexture?J.type:null,he=S(T.stencilBuffer,re),ge=T.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;He(T)?l.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,yt(T),he,T.width,T.height):H?r.renderbufferStorageMultisample(r.RENDERBUFFER,yt(T),he,T.width,T.height):r.renderbufferStorage(r.RENDERBUFFER,he,T.width,T.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,ge,r.RENDERBUFFER,P)}else{let J=T.textures;for(let re=0;re<J.length;re++){let he=J[re],ge=s.convert(he.format,he.colorSpace),$=s.convert(he.type),j=v(he.internalFormat,ge,$,he.normalized,he.colorSpace);He(T)?l.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,yt(T),j,T.width,T.height):H?r.renderbufferStorageMultisample(r.RENDERBUFFER,yt(T),j,T.width,T.height):r.renderbufferStorage(r.RENDERBUFFER,j,T.width,T.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function Ke(P,T,H){let J=T.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(r.FRAMEBUFFER,P),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let re=n.get(T.depthTexture);if(re.__renderTarget=T,(!re.__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),J){if(re.__webglInit===void 0&&(re.__webglInit=!0,T.depthTexture.addEventListener("dispose",w)),re.__webglTexture===void 0){re.__webglTexture=r.createTexture(),t.bindTexture(r.TEXTURE_CUBE_MAP,re.__webglTexture),me(r.TEXTURE_CUBE_MAP,T.depthTexture);let be=s.convert(T.depthTexture.format),Ae=s.convert(T.depthTexture.type),fe;T.depthTexture.format===jn?fe=r.DEPTH_COMPONENT24:T.depthTexture.format===ji&&(fe=r.DEPTH24_STENCIL8);for(let ue=0;ue<6;ue++)r.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0,fe,T.width,T.height,0,be,Ae,null)}}else Y(T.depthTexture,0);let he=re.__webglTexture,ge=yt(T),$=J?r.TEXTURE_CUBE_MAP_POSITIVE_X+H:r.TEXTURE_2D,j=T.depthTexture.format===ji?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;if(T.depthTexture.format===jn)He(T)?l.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,j,$,he,0,ge):r.framebufferTexture2D(r.FRAMEBUFFER,j,$,he,0);else if(T.depthTexture.format===ji)He(T)?l.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,j,$,he,0,ge):r.framebufferTexture2D(r.FRAMEBUFFER,j,$,he,0);else throw new Error("Unknown depthTexture format")}function it(P){let T=n.get(P),H=P.isWebGLCubeRenderTarget===!0;if(T.__boundDepthTexture!==P.depthTexture){let J=P.depthTexture;if(T.__depthDisposeCallback&&T.__depthDisposeCallback(),J){let re=()=>{delete T.__boundDepthTexture,delete T.__depthDisposeCallback,J.removeEventListener("dispose",re)};J.addEventListener("dispose",re),T.__depthDisposeCallback=re}T.__boundDepthTexture=J}if(P.depthTexture&&!T.__autoAllocateDepthBuffer)if(H)for(let J=0;J<6;J++)Ke(T.__webglFramebuffer[J],P,J);else{let J=P.texture.mipmaps;J&&J.length>0?Ke(T.__webglFramebuffer[0],P,0):Ke(T.__webglFramebuffer,P,0)}else if(H){T.__webglDepthbuffer=[];for(let J=0;J<6;J++)if(t.bindFramebuffer(r.FRAMEBUFFER,T.__webglFramebuffer[J]),T.__webglDepthbuffer[J]===void 0)T.__webglDepthbuffer[J]=r.createRenderbuffer(),ot(T.__webglDepthbuffer[J],P,!1);else{let re=P.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,he=T.__webglDepthbuffer[J];r.bindRenderbuffer(r.RENDERBUFFER,he),r.framebufferRenderbuffer(r.FRAMEBUFFER,re,r.RENDERBUFFER,he)}}else{let J=P.texture.mipmaps;if(J&&J.length>0?t.bindFramebuffer(r.FRAMEBUFFER,T.__webglFramebuffer[0]):t.bindFramebuffer(r.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer===void 0)T.__webglDepthbuffer=r.createRenderbuffer(),ot(T.__webglDepthbuffer,P,!1);else{let re=P.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,he=T.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,he),r.framebufferRenderbuffer(r.FRAMEBUFFER,re,r.RENDERBUFFER,he)}}t.bindFramebuffer(r.FRAMEBUFFER,null)}function lt(P,T,H){let J=n.get(P);T!==void 0&&Ne(J.__webglFramebuffer,P,P.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),H!==void 0&&it(P)}function qe(P){let T=P.texture,H=n.get(P),J=n.get(T);P.addEventListener("dispose",M);let re=P.textures,he=P.isWebGLCubeRenderTarget===!0,ge=re.length>1;if(ge||(J.__webglTexture===void 0&&(J.__webglTexture=r.createTexture()),J.__version=T.version,o.memory.textures++),he){H.__webglFramebuffer=[];for(let $=0;$<6;$++)if(T.mipmaps&&T.mipmaps.length>0){H.__webglFramebuffer[$]=[];for(let j=0;j<T.mipmaps.length;j++)H.__webglFramebuffer[$][j]=r.createFramebuffer()}else H.__webglFramebuffer[$]=r.createFramebuffer()}else{if(T.mipmaps&&T.mipmaps.length>0){H.__webglFramebuffer=[];for(let $=0;$<T.mipmaps.length;$++)H.__webglFramebuffer[$]=r.createFramebuffer()}else H.__webglFramebuffer=r.createFramebuffer();if(ge)for(let $=0,j=re.length;$<j;$++){let be=n.get(re[$]);be.__webglTexture===void 0&&(be.__webglTexture=r.createTexture(),o.memory.textures++)}if(P.samples>0&&He(P)===!1){H.__webglMultisampledFramebuffer=r.createFramebuffer(),H.__webglColorRenderbuffer=[],t.bindFramebuffer(r.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let $=0;$<re.length;$++){let j=re[$];H.__webglColorRenderbuffer[$]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,H.__webglColorRenderbuffer[$]);let be=s.convert(j.format,j.colorSpace),Ae=s.convert(j.type),fe=v(j.internalFormat,be,Ae,j.normalized,j.colorSpace,P.isXRRenderTarget===!0),ue=yt(P);r.renderbufferStorageMultisample(r.RENDERBUFFER,ue,fe,P.width,P.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+$,r.RENDERBUFFER,H.__webglColorRenderbuffer[$])}r.bindRenderbuffer(r.RENDERBUFFER,null),P.depthBuffer&&(H.__webglDepthRenderbuffer=r.createRenderbuffer(),ot(H.__webglDepthRenderbuffer,P,!0)),t.bindFramebuffer(r.FRAMEBUFFER,null)}}if(he){t.bindTexture(r.TEXTURE_CUBE_MAP,J.__webglTexture),me(r.TEXTURE_CUBE_MAP,T);for(let $=0;$<6;$++)if(T.mipmaps&&T.mipmaps.length>0)for(let j=0;j<T.mipmaps.length;j++)Ne(H.__webglFramebuffer[$][j],P,T,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+$,j);else Ne(H.__webglFramebuffer[$],P,T,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+$,0);g(T)&&y(r.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ge){for(let $=0,j=re.length;$<j;$++){let be=re[$],Ae=n.get(be),fe=r.TEXTURE_2D;(P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(fe=P.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(fe,Ae.__webglTexture),me(fe,be),Ne(H.__webglFramebuffer,P,be,r.COLOR_ATTACHMENT0+$,fe,0),g(be)&&y(fe)}t.unbindTexture()}else{let $=r.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&($=P.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture($,J.__webglTexture),me($,T),T.mipmaps&&T.mipmaps.length>0)for(let j=0;j<T.mipmaps.length;j++)Ne(H.__webglFramebuffer[j],P,T,r.COLOR_ATTACHMENT0,$,j);else Ne(H.__webglFramebuffer,P,T,r.COLOR_ATTACHMENT0,$,0);g(T)&&y($),t.unbindTexture()}P.depthBuffer&&it(P)}function Et(P){let T=P.textures;for(let H=0,J=T.length;H<J;H++){let re=T[H];if(g(re)){let he=_(P),ge=n.get(re).__webglTexture;t.bindTexture(he,ge),y(he),t.unbindTexture()}}}let ut=[],Yt=[];function B(P){if(P.samples>0){if(He(P)===!1){let T=P.textures,H=P.width,J=P.height,re=r.COLOR_BUFFER_BIT,he=P.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,ge=n.get(P),$=T.length>1;if($)for(let be=0;be<T.length;be++)t.bindFramebuffer(r.FRAMEBUFFER,ge.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+be,r.RENDERBUFFER,null),t.bindFramebuffer(r.FRAMEBUFFER,ge.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+be,r.TEXTURE_2D,null,0);t.bindFramebuffer(r.READ_FRAMEBUFFER,ge.__webglMultisampledFramebuffer);let j=P.texture.mipmaps;j&&j.length>0?t.bindFramebuffer(r.DRAW_FRAMEBUFFER,ge.__webglFramebuffer[0]):t.bindFramebuffer(r.DRAW_FRAMEBUFFER,ge.__webglFramebuffer);for(let be=0;be<T.length;be++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(re|=r.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(re|=r.STENCIL_BUFFER_BIT)),$){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,ge.__webglColorRenderbuffer[be]);let Ae=n.get(T[be]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,Ae,0)}r.blitFramebuffer(0,0,H,J,0,0,H,J,re,r.NEAREST),a===!0&&(ut.length=0,Yt.length=0,ut.push(r.COLOR_ATTACHMENT0+be),P.depthBuffer&&P.resolveDepthBuffer===!1&&(ut.push(he),Yt.push(he),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,Yt)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,ut))}if(t.bindFramebuffer(r.READ_FRAMEBUFFER,null),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),$)for(let be=0;be<T.length;be++){t.bindFramebuffer(r.FRAMEBUFFER,ge.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+be,r.RENDERBUFFER,ge.__webglColorRenderbuffer[be]);let Ae=n.get(T[be]).__webglTexture;t.bindFramebuffer(r.FRAMEBUFFER,ge.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+be,r.TEXTURE_2D,Ae,0)}t.bindFramebuffer(r.DRAW_FRAMEBUFFER,ge.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.resolveDepthBuffer===!1&&a){let T=P.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[T])}}}function yt(P){return Math.min(i.maxSamples,P.samples)}function He(P){let T=n.get(P);return P.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function ct(P){let T=o.render.frame;h.get(P)!==T&&(h.set(P,T),P.update())}function xe(P,T){let H=P.colorSpace,J=P.format,re=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||H!==an&&H!==Ii&&(Je.getTransfer(H)===at?(J!==Mn||re!==pn)&&Ie("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Oe("WebGLTextures: Unsupported texture color space:",H)),T}function Rt(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(c.width=P.naturalWidth||P.width,c.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(c.width=P.displayWidth,c.height=P.displayHeight):(c.width=P.width,c.height=P.height),c}this.allocateTextureUnit=D,this.resetTextureUnits=F,this.getTextureUnits=L,this.setTextureUnits=I,this.setTexture2D=Y,this.setTexture2DArray=X,this.setTexture3D=ee,this.setTextureCube=ae,this.rebindTextures=lt,this.setupRenderTarget=qe,this.updateRenderTargetMipmap=Et,this.updateMultisampleRenderTarget=B,this.setupDepthRenderbuffer=it,this.setupFrameBufferTexture=Ne,this.useMultisampledRTT=He,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function Vy(r,e){function t(n,i=Ii){let s,o=Je.getTransfer(i);if(n===pn)return r.UNSIGNED_BYTE;if(n===bl)return r.UNSIGNED_SHORT_4_4_4_4;if(n===Ml)return r.UNSIGNED_SHORT_5_5_5_1;if(n===Gh)return r.UNSIGNED_INT_5_9_9_9_REV;if(n===Wh)return r.UNSIGNED_INT_10F_11F_11F_REV;if(n===zh)return r.BYTE;if(n===Hh)return r.SHORT;if(n===hr)return r.UNSIGNED_SHORT;if(n===vl)return r.INT;if(n===Hn)return r.UNSIGNED_INT;if(n===bn)return r.FLOAT;if(n===ai)return r.HALF_FLOAT;if(n===Xh)return r.ALPHA;if(n===Yh)return r.RGB;if(n===Mn)return r.RGBA;if(n===jn)return r.DEPTH_COMPONENT;if(n===ji)return r.DEPTH_STENCIL;if(n===Sl)return r.RED;if(n===wl)return r.RED_INTEGER;if(n===Qi)return r.RG;if(n===Tl)return r.RG_INTEGER;if(n===Al)return r.RGBA_INTEGER;if(n===Ya||n===qa||n===$a||n===Ka)if(o===at)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===Ya)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===qa)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===$a)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Ka)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===Ya)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===qa)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===$a)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Ka)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===El||n===Rl||n===Cl||n===Il)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===El)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Rl)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Cl)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Il)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Pl||n===Ll||n===Nl||n===Fl||n===Dl||n===Za||n===Ul)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(n===Pl||n===Ll)return o===at?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===Nl)return o===at?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(n===Fl)return s.COMPRESSED_R11_EAC;if(n===Dl)return s.COMPRESSED_SIGNED_R11_EAC;if(n===Za)return s.COMPRESSED_RG11_EAC;if(n===Ul)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Ol||n===Bl||n===kl||n===Vl||n===zl||n===Hl||n===Gl||n===Wl||n===Xl||n===Yl||n===ql||n===$l||n===Kl||n===Zl)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(n===Ol)return o===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Bl)return o===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===kl)return o===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Vl)return o===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===zl)return o===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Hl)return o===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Gl)return o===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Wl)return o===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Xl)return o===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Yl)return o===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===ql)return o===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===$l)return o===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Kl)return o===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Zl)return o===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Jl||n===jl||n===Ql)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(n===Jl)return o===at?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===jl)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Ql)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===ec||n===tc||n===Ja||n===nc)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(n===ec)return s.COMPRESSED_RED_RGTC1_EXT;if(n===tc)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Ja)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===nc)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ur?r.UNSIGNED_INT_24_8:r[n]!==void 0?r[n]:null}return{convert:t}}var zy=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Hy=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,yu=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Ia(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new on({vertexShader:zy,fragmentShader:Hy,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new It(new Pa(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},vu=class extends Qn{constructor(e,t){super();let n=this,i=null,s=1,o=null,l="local-floor",a=1,c=null,h=null,u=null,d=null,f=null,p=null,x=typeof XRWebGLBinding<"u",m=new yu,g={},y=t.getContextAttributes(),_=null,v=null,S=[],b=[],w=new et,M=null,A=new Bt;A.viewport=new pt;let C=new Bt;C.viewport=new pt;let E=[A,C],N=new pl,F=null,L=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let le=S[K];return le===void 0&&(le=new js,S[K]=le),le.getTargetRaySpace()},this.getControllerGrip=function(K){let le=S[K];return le===void 0&&(le=new js,S[K]=le),le.getGripSpace()},this.getHand=function(K){let le=S[K];return le===void 0&&(le=new js,S[K]=le),le.getHandSpace()};function I(K){let le=b.indexOf(K.inputSource);if(le===-1)return;let te=S[le];te!==void 0&&(te.update(K.inputSource,K.frame,c||o),te.dispatchEvent({type:K.type,data:K.inputSource}))}function D(){i.removeEventListener("select",I),i.removeEventListener("selectstart",I),i.removeEventListener("selectend",I),i.removeEventListener("squeeze",I),i.removeEventListener("squeezestart",I),i.removeEventListener("squeezeend",I),i.removeEventListener("end",D),i.removeEventListener("inputsourceschange",U);for(let K=0;K<S.length;K++){let le=b[K];le!==null&&(b[K]=null,S[K].disconnect(le))}F=null,L=null,m.reset();for(let K in g)delete g[K];e.setRenderTarget(_),f=null,d=null,u=null,i=null,v=null,me.stop(),n.isPresenting=!1,e.setPixelRatio(M),e.setSize(w.width,w.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){s=K,n.isPresenting===!0&&Ie("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){l=K,n.isPresenting===!0&&Ie("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(K){c=K},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&x&&(u=new XRWebGLBinding(i,t)),u},this.getFrame=function(){return p},this.getSession=function(){return i},this.setSession=async function(K){if(i=K,i!==null){if(_=e.getRenderTarget(),i.addEventListener("select",I),i.addEventListener("selectstart",I),i.addEventListener("selectend",I),i.addEventListener("squeeze",I),i.addEventListener("squeezestart",I),i.addEventListener("squeezeend",I),i.addEventListener("end",D),i.addEventListener("inputsourceschange",U),y.xrCompatible!==!0&&await t.makeXRCompatible(),M=e.getPixelRatio(),e.getSize(w),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let te=null,Te=null,Re=null;y.depth&&(Re=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,te=y.stencil?ji:jn,Te=y.stencil?ur:Hn);let Ne={colorFormat:t.RGBA8,depthFormat:Re,scaleFactor:s};u=this.getBinding(),d=u.createProjectionLayer(Ne),i.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),v=new yn(d.textureWidth,d.textureHeight,{format:Mn,type:pn,depthTexture:new Ai(d.textureWidth,d.textureHeight,Te,void 0,void 0,void 0,void 0,void 0,void 0,te),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{let te={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(i,t,te),i.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),v=new yn(f.framebufferWidth,f.framebufferHeight,{format:Mn,type:pn,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(a),c=null,o=await i.requestReferenceSpace(l),me.setContext(i),me.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function U(K){for(let le=0;le<K.removed.length;le++){let te=K.removed[le],Te=b.indexOf(te);Te>=0&&(b[Te]=null,S[Te].disconnect(te))}for(let le=0;le<K.added.length;le++){let te=K.added[le],Te=b.indexOf(te);if(Te===-1){for(let Ne=0;Ne<S.length;Ne++)if(Ne>=b.length){b.push(te),Te=Ne;break}else if(b[Ne]===null){b[Ne]=te,Te=Ne;break}if(Te===-1)break}let Re=S[Te];Re&&Re.connect(te)}}let Y=new z,X=new z;function ee(K,le,te){Y.setFromMatrixPosition(le.matrixWorld),X.setFromMatrixPosition(te.matrixWorld);let Te=Y.distanceTo(X),Re=le.projectionMatrix.elements,Ne=te.projectionMatrix.elements,ot=Re[14]/(Re[10]-1),Ke=Re[14]/(Re[10]+1),it=(Re[9]+1)/Re[5],lt=(Re[9]-1)/Re[5],qe=(Re[8]-1)/Re[0],Et=(Ne[8]+1)/Ne[0],ut=ot*qe,Yt=ot*Et,B=Te/(-qe+Et),yt=B*-qe;if(le.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(yt),K.translateZ(B),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert(),Re[10]===-1)K.projectionMatrix.copy(le.projectionMatrix),K.projectionMatrixInverse.copy(le.projectionMatrixInverse);else{let He=ot+B,ct=Ke+B,xe=ut-yt,Rt=Yt+(Te-yt),P=it*Ke/ct*He,T=lt*Ke/ct*He;K.projectionMatrix.makePerspective(xe,Rt,P,T,He,ct),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}}function ae(K,le){le===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(le.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(i===null)return;let le=K.near,te=K.far;m.texture!==null&&(m.depthNear>0&&(le=m.depthNear),m.depthFar>0&&(te=m.depthFar)),N.near=C.near=A.near=le,N.far=C.far=A.far=te,(F!==N.near||L!==N.far)&&(i.updateRenderState({depthNear:N.near,depthFar:N.far}),F=N.near,L=N.far),N.layers.mask=K.layers.mask|6,A.layers.mask=N.layers.mask&-5,C.layers.mask=N.layers.mask&-3;let Te=K.parent,Re=N.cameras;ae(N,Te);for(let Ne=0;Ne<Re.length;Ne++)ae(Re[Ne],Te);Re.length===2?ee(N,A,C):N.projectionMatrix.copy(A.projectionMatrix),ce(K,N,Te)};function ce(K,le,te){te===null?K.matrix.copy(le.matrixWorld):(K.matrix.copy(te.matrixWorld),K.matrix.invert(),K.matrix.multiply(le.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(le.projectionMatrix),K.projectionMatrixInverse.copy(le.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=gs*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return N},this.getFoveation=function(){if(!(d===null&&f===null))return a},this.setFoveation=function(K){a=K,d!==null&&(d.fixedFoveation=K),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=K)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(N)},this.getCameraTexture=function(K){return g[K]};let oe=null;function Me(K,le){if(h=le.getViewerPose(c||o),p=le,h!==null){let te=h.views;f!==null&&(e.setRenderTargetFramebuffer(v,f.framebuffer),e.setRenderTarget(v));let Te=!1;te.length!==N.cameras.length&&(N.cameras.length=0,Te=!0);for(let Ke=0;Ke<te.length;Ke++){let it=te[Ke],lt=null;if(f!==null)lt=f.getViewport(it);else{let Et=u.getViewSubImage(d,it);lt=Et.viewport,Ke===0&&(e.setRenderTargetTextures(v,Et.colorTexture,Et.depthStencilTexture),e.setRenderTarget(v))}let qe=E[Ke];qe===void 0&&(qe=new Bt,qe.layers.enable(Ke),qe.viewport=new pt,E[Ke]=qe),qe.matrix.fromArray(it.transform.matrix),qe.matrix.decompose(qe.position,qe.quaternion,qe.scale),qe.projectionMatrix.fromArray(it.projectionMatrix),qe.projectionMatrixInverse.copy(qe.projectionMatrix).invert(),qe.viewport.set(lt.x,lt.y,lt.width,lt.height),Ke===0&&(N.matrix.copy(qe.matrix),N.matrix.decompose(N.position,N.quaternion,N.scale)),Te===!0&&N.cameras.push(qe)}let Re=i.enabledFeatures;if(Re&&Re.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&x){u=n.getBinding();let Ke=u.getDepthInformation(te[0]);Ke&&Ke.isValid&&Ke.texture&&m.init(Ke,i.renderState)}if(Re&&Re.includes("camera-access")&&x){e.state.unbindTexture(),u=n.getBinding();for(let Ke=0;Ke<te.length;Ke++){let it=te[Ke].camera;if(it){let lt=g[it];lt||(lt=new Ia,g[it]=lt);let qe=u.getCameraImage(it);lt.sourceTexture=qe}}}}for(let te=0;te<S.length;te++){let Te=b[te],Re=S[te];Te!==null&&Re!==void 0&&Re.update(Te,le,c||o)}oe&&oe(K,le),le.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:le}),p=null}let me=new vp;me.setAnimationLoop(Me),this.setAnimationLoop=function(K){oe=K},this.dispose=function(){}}},Gy=new ke,Ap=new ze;Ap.set(-1,0,0,0,1,0,0,0,1);function Wy(r,e){function t(m,g){m.matrixAutoUpdate===!0&&m.updateMatrix(),g.value.copy(m.matrix)}function n(m,g){g.color.getRGB(m.fogColor.value,Jh(r)),g.isFog?(m.fogNear.value=g.near,m.fogFar.value=g.far):g.isFogExp2&&(m.fogDensity.value=g.density)}function i(m,g,y,_,v){g.isNodeMaterial?g.uniformsNeedUpdate=!1:g.isMeshBasicMaterial?s(m,g):g.isMeshLambertMaterial?(s(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshToonMaterial?(s(m,g),u(m,g)):g.isMeshPhongMaterial?(s(m,g),h(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshStandardMaterial?(s(m,g),d(m,g),g.isMeshPhysicalMaterial&&f(m,g,v)):g.isMeshMatcapMaterial?(s(m,g),p(m,g)):g.isMeshDepthMaterial?s(m,g):g.isMeshDistanceMaterial?(s(m,g),x(m,g)):g.isMeshNormalMaterial?s(m,g):g.isLineBasicMaterial?(o(m,g),g.isLineDashedMaterial&&l(m,g)):g.isPointsMaterial?a(m,g,y,_):g.isSpriteMaterial?c(m,g):g.isShadowMaterial?(m.color.value.copy(g.color),m.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function s(m,g){m.opacity.value=g.opacity,g.color&&m.diffuse.value.copy(g.color),g.emissive&&m.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(m.map.value=g.map,t(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,t(g.alphaMap,m.alphaMapTransform)),g.bumpMap&&(m.bumpMap.value=g.bumpMap,t(g.bumpMap,m.bumpMapTransform),m.bumpScale.value=g.bumpScale,g.side===ln&&(m.bumpScale.value*=-1)),g.normalMap&&(m.normalMap.value=g.normalMap,t(g.normalMap,m.normalMapTransform),m.normalScale.value.copy(g.normalScale),g.side===ln&&m.normalScale.value.negate()),g.displacementMap&&(m.displacementMap.value=g.displacementMap,t(g.displacementMap,m.displacementMapTransform),m.displacementScale.value=g.displacementScale,m.displacementBias.value=g.displacementBias),g.emissiveMap&&(m.emissiveMap.value=g.emissiveMap,t(g.emissiveMap,m.emissiveMapTransform)),g.specularMap&&(m.specularMap.value=g.specularMap,t(g.specularMap,m.specularMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest);let y=e.get(g),_=y.envMap,v=y.envMapRotation;_&&(m.envMap.value=_,m.envMapRotation.value.setFromMatrix4(Gy.makeRotationFromEuler(v)).transpose(),_.isCubeTexture&&_.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(Ap),m.reflectivity.value=g.reflectivity,m.ior.value=g.ior,m.refractionRatio.value=g.refractionRatio),g.lightMap&&(m.lightMap.value=g.lightMap,m.lightMapIntensity.value=g.lightMapIntensity,t(g.lightMap,m.lightMapTransform)),g.aoMap&&(m.aoMap.value=g.aoMap,m.aoMapIntensity.value=g.aoMapIntensity,t(g.aoMap,m.aoMapTransform))}function o(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,g.map&&(m.map.value=g.map,t(g.map,m.mapTransform))}function l(m,g){m.dashSize.value=g.dashSize,m.totalSize.value=g.dashSize+g.gapSize,m.scale.value=g.scale}function a(m,g,y,_){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.size.value=g.size*y,m.scale.value=_*.5,g.map&&(m.map.value=g.map,t(g.map,m.uvTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,t(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function c(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.rotation.value=g.rotation,g.map&&(m.map.value=g.map,t(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,t(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function h(m,g){m.specular.value.copy(g.specular),m.shininess.value=Math.max(g.shininess,1e-4)}function u(m,g){g.gradientMap&&(m.gradientMap.value=g.gradientMap)}function d(m,g){m.metalness.value=g.metalness,g.metalnessMap&&(m.metalnessMap.value=g.metalnessMap,t(g.metalnessMap,m.metalnessMapTransform)),m.roughness.value=g.roughness,g.roughnessMap&&(m.roughnessMap.value=g.roughnessMap,t(g.roughnessMap,m.roughnessMapTransform)),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)}function f(m,g,y){m.ior.value=g.ior,g.sheen>0&&(m.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),m.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(m.sheenColorMap.value=g.sheenColorMap,t(g.sheenColorMap,m.sheenColorMapTransform)),g.sheenRoughnessMap&&(m.sheenRoughnessMap.value=g.sheenRoughnessMap,t(g.sheenRoughnessMap,m.sheenRoughnessMapTransform))),g.clearcoat>0&&(m.clearcoat.value=g.clearcoat,m.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(m.clearcoatMap.value=g.clearcoatMap,t(g.clearcoatMap,m.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,t(g.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(m.clearcoatNormalMap.value=g.clearcoatNormalMap,t(g.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===ln&&m.clearcoatNormalScale.value.negate())),g.dispersion>0&&(m.dispersion.value=g.dispersion),g.iridescence>0&&(m.iridescence.value=g.iridescence,m.iridescenceIOR.value=g.iridescenceIOR,m.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(m.iridescenceMap.value=g.iridescenceMap,t(g.iridescenceMap,m.iridescenceMapTransform)),g.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=g.iridescenceThicknessMap,t(g.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),g.transmission>0&&(m.transmission.value=g.transmission,m.transmissionSamplerMap.value=y.texture,m.transmissionSamplerSize.value.set(y.width,y.height),g.transmissionMap&&(m.transmissionMap.value=g.transmissionMap,t(g.transmissionMap,m.transmissionMapTransform)),m.thickness.value=g.thickness,g.thicknessMap&&(m.thicknessMap.value=g.thicknessMap,t(g.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=g.attenuationDistance,m.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(m.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(m.anisotropyMap.value=g.anisotropyMap,t(g.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=g.specularIntensity,m.specularColor.value.copy(g.specularColor),g.specularColorMap&&(m.specularColorMap.value=g.specularColorMap,t(g.specularColorMap,m.specularColorMapTransform)),g.specularIntensityMap&&(m.specularIntensityMap.value=g.specularIntensityMap,t(g.specularIntensityMap,m.specularIntensityMapTransform))}function p(m,g){g.matcap&&(m.matcap.value=g.matcap)}function x(m,g){let y=e.get(g).light;m.referencePosition.value.setFromMatrixPosition(y.matrixWorld),m.nearDistance.value=y.shadow.camera.near,m.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function Xy(r,e,t,n){let i={},s={},o=[],l=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function a(y,_){let v=_.program;n.uniformBlockBinding(y,v)}function c(y,_){let v=i[y.id];v===void 0&&(p(y),v=h(y),i[y.id]=v,y.addEventListener("dispose",m));let S=_.program;n.updateUBOMapping(y,S);let b=e.render.frame;s[y.id]!==b&&(d(y),s[y.id]=b)}function h(y){let _=u();y.__bindingPointIndex=_;let v=r.createBuffer(),S=y.__size,b=y.usage;return r.bindBuffer(r.UNIFORM_BUFFER,v),r.bufferData(r.UNIFORM_BUFFER,S,b),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,_,v),v}function u(){for(let y=0;y<l;y++)if(o.indexOf(y)===-1)return o.push(y),y;return Oe("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(y){let _=i[y.id],v=y.uniforms,S=y.__cache;r.bindBuffer(r.UNIFORM_BUFFER,_);for(let b=0,w=v.length;b<w;b++){let M=Array.isArray(v[b])?v[b]:[v[b]];for(let A=0,C=M.length;A<C;A++){let E=M[A];if(f(E,b,A,S)===!0){let N=E.__offset,F=Array.isArray(E.value)?E.value:[E.value],L=0;for(let I=0;I<F.length;I++){let D=F[I],U=x(D);typeof D=="number"||typeof D=="boolean"?(E.__data[0]=D,r.bufferSubData(r.UNIFORM_BUFFER,N+L,E.__data)):D.isMatrix3?(E.__data[0]=D.elements[0],E.__data[1]=D.elements[1],E.__data[2]=D.elements[2],E.__data[3]=0,E.__data[4]=D.elements[3],E.__data[5]=D.elements[4],E.__data[6]=D.elements[5],E.__data[7]=0,E.__data[8]=D.elements[6],E.__data[9]=D.elements[7],E.__data[10]=D.elements[8],E.__data[11]=0):ArrayBuffer.isView(D)?E.__data.set(new D.constructor(D.buffer,D.byteOffset,E.__data.length)):(D.toArray(E.__data,L),L+=U.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,N,E.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}function f(y,_,v,S){let b=y.value,w=_+"_"+v;if(S[w]===void 0)return typeof b=="number"||typeof b=="boolean"?S[w]=b:ArrayBuffer.isView(b)?S[w]=b.slice():S[w]=b.clone(),!0;{let M=S[w];if(typeof b=="number"||typeof b=="boolean"){if(M!==b)return S[w]=b,!0}else{if(ArrayBuffer.isView(b))return!0;if(M.equals(b)===!1)return M.copy(b),!0}}return!1}function p(y){let _=y.uniforms,v=0,S=16;for(let w=0,M=_.length;w<M;w++){let A=Array.isArray(_[w])?_[w]:[_[w]];for(let C=0,E=A.length;C<E;C++){let N=A[C],F=Array.isArray(N.value)?N.value:[N.value];for(let L=0,I=F.length;L<I;L++){let D=F[L],U=x(D),Y=v%S,X=Y%U.boundary,ee=Y+X;v+=X,ee!==0&&S-ee<U.storage&&(v+=S-ee),N.__data=new Float32Array(U.storage/Float32Array.BYTES_PER_ELEMENT),N.__offset=v,v+=U.storage}}}let b=v%S;return b>0&&(v+=S-b),y.__size=v,y.__cache={},this}function x(y){let _={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(_.boundary=4,_.storage=4):y.isVector2?(_.boundary=8,_.storage=8):y.isVector3||y.isColor?(_.boundary=16,_.storage=12):y.isVector4?(_.boundary=16,_.storage=16):y.isMatrix3?(_.boundary=48,_.storage=48):y.isMatrix4?(_.boundary=64,_.storage=64):y.isTexture?Ie("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(y)?(_.boundary=16,_.storage=y.byteLength):Ie("WebGLRenderer: Unsupported uniform value type.",y),_}function m(y){let _=y.target;_.removeEventListener("dispose",m);let v=o.indexOf(_.__bindingPointIndex);o.splice(v,1),r.deleteBuffer(i[_.id]),delete i[_.id],delete s[_.id]}function g(){for(let y in i)r.deleteBuffer(i[y]);o=[],i={},s={}}return{bind:a,update:c,dispose:g}}var Yy=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),oi=null;function qy(){return oi===null&&(oi=new er(Yy,16,16,Qi,ai),oi.name="DFG_LUT",oi.minFilter=Mt,oi.magFilter=Mt,oi.wrapS=cn,oi.wrapT=cn,oi.generateMipmaps=!1,oi.needsUpdate=!0),oi}var hc=class{constructor(e={}){let{canvas:t=Wf(),context:n=null,depth:i=!0,stencil:s=!1,alpha:o=!1,antialias:l=!1,premultipliedAlpha:a=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=pn}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=o;let x=f,m=new Set([Al,Tl,wl]),g=new Set([pn,Hn,hr,ur,bl,Ml]),y=new Uint32Array(4),_=new Int32Array(4),v=new z,S=null,b=null,w=[],M=[],A=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Vn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let C=this,E=!1,N=null;this._outputColorSpace=Tt;let F=0,L=0,I=null,D=-1,U=null,Y=new pt,X=new pt,ee=null,ae=new Be(0),ce=0,oe=t.width,Me=t.height,me=1,K=null,le=null,te=new pt(0,0,oe,Me),Te=new pt(0,0,oe,Me),Re=!1,Ne=new tr,ot=!1,Ke=!1,it=new ke,lt=new z,qe=new pt,Et={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},ut=!1;function Yt(){return I===null?me:1}let B=n;function yt(R,V){return t.getContext(R,V)}try{let R={alpha:!0,depth:i,stencil:s,antialias:l,premultipliedAlpha:a,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"184"}`),t.addEventListener("webglcontextlost",ie,!1),t.addEventListener("webglcontextrestored",Le,!1),t.addEventListener("webglcontextcreationerror",Ge,!1),B===null){let V="webgl2";if(B=yt(V,R),B===null)throw yt(V)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(R){throw Oe("WebGLRenderer: "+R.message),R}let He,ct,xe,Rt,P,T,H,J,re,he,ge,$,j,be,Ae,fe,ue,Ve,Xe,rt,O,de,Z;function Se(){He=new e_(B),He.init(),O=new Vy(B,He),ct=new Yx(B,He,e,O),xe=new By(B,He),ct.reversedDepthBuffer&&d&&xe.buffers.depth.setReversed(!0),Rt=new i_(B),P=new wy,T=new ky(B,He,xe,P,ct,O,Rt),H=new Qx(C),J=new og(B),de=new Wx(B,J),re=new t_(B,J,Rt,de),he=new r_(B,re,J,de,Rt),Ve=new s_(B,ct,T),Ae=new qx(P),ge=new Sy(C,H,He,ct,de,Ae),$=new Wy(C,P),j=new Ay,be=new Ly(He),ue=new Gx(C,H,xe,he,p,a),fe=new Oy(C,he,ct),Z=new Xy(B,Rt,ct,xe),Xe=new Xx(B,He,Rt),rt=new n_(B,He,Rt),Rt.programs=ge.programs,C.capabilities=ct,C.extensions=He,C.properties=P,C.renderLists=j,C.shadowMap=fe,C.state=xe,C.info=Rt}Se(),x!==pn&&(A=new o_(x,t.width,t.height,i,s));let pe=new vu(C,B);this.xr=pe,this.getContext=function(){return B},this.getContextAttributes=function(){return B.getContextAttributes()},this.forceContextLoss=function(){let R=He.get("WEBGL_lose_context");R&&R.loseContext()},this.forceContextRestore=function(){let R=He.get("WEBGL_lose_context");R&&R.restoreContext()},this.getPixelRatio=function(){return me},this.setPixelRatio=function(R){R!==void 0&&(me=R,this.setSize(oe,Me,!1))},this.getSize=function(R){return R.set(oe,Me)},this.setSize=function(R,V,q=!0){if(pe.isPresenting){Ie("WebGLRenderer: Can't change size while VR device is presenting.");return}oe=R,Me=V,t.width=Math.floor(R*me),t.height=Math.floor(V*me),q===!0&&(t.style.width=R+"px",t.style.height=V+"px"),A!==null&&A.setSize(t.width,t.height),this.setViewport(0,0,R,V)},this.getDrawingBufferSize=function(R){return R.set(oe*me,Me*me).floor()},this.setDrawingBufferSize=function(R,V,q){oe=R,Me=V,me=q,t.width=Math.floor(R*q),t.height=Math.floor(V*q),this.setViewport(0,0,R,V)},this.setEffects=function(R){if(x===pn){Oe("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(R){for(let V=0;V<R.length;V++)if(R[V].isOutputPass===!0){Ie("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}A.setEffects(R||[])},this.getCurrentViewport=function(R){return R.copy(Y)},this.getViewport=function(R){return R.copy(te)},this.setViewport=function(R,V,q,G){R.isVector4?te.set(R.x,R.y,R.z,R.w):te.set(R,V,q,G),xe.viewport(Y.copy(te).multiplyScalar(me).round())},this.getScissor=function(R){return R.copy(Te)},this.setScissor=function(R,V,q,G){R.isVector4?Te.set(R.x,R.y,R.z,R.w):Te.set(R,V,q,G),xe.scissor(X.copy(Te).multiplyScalar(me).round())},this.getScissorTest=function(){return Re},this.setScissorTest=function(R){xe.setScissorTest(Re=R)},this.setOpaqueSort=function(R){K=R},this.setTransparentSort=function(R){le=R},this.getClearColor=function(R){return R.copy(ue.getClearColor())},this.setClearColor=function(){ue.setClearColor(...arguments)},this.getClearAlpha=function(){return ue.getClearAlpha()},this.setClearAlpha=function(){ue.setClearAlpha(...arguments)},this.clear=function(R=!0,V=!0,q=!0){let G=0;if(R){let W=!1;if(I!==null){let ve=I.texture.format;W=m.has(ve)}if(W){let ve=I.texture.type,Ee=g.has(ve),ye=ue.getClearColor(),Ce=ue.getClearAlpha(),Fe=ye.r,We=ye.g,Ze=ye.b;Ee?(y[0]=Fe,y[1]=We,y[2]=Ze,y[3]=Ce,B.clearBufferuiv(B.COLOR,0,y)):(_[0]=Fe,_[1]=We,_[2]=Ze,_[3]=Ce,B.clearBufferiv(B.COLOR,0,_))}else G|=B.COLOR_BUFFER_BIT}V&&(G|=B.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),q&&(G|=B.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),G!==0&&B.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(R){R.setRenderer(this),N=R},this.dispose=function(){t.removeEventListener("webglcontextlost",ie,!1),t.removeEventListener("webglcontextrestored",Le,!1),t.removeEventListener("webglcontextcreationerror",Ge,!1),ue.dispose(),j.dispose(),be.dispose(),P.dispose(),H.dispose(),he.dispose(),de.dispose(),Z.dispose(),ge.dispose(),pe.dispose(),pe.removeEventListener("sessionstart",gd),pe.removeEventListener("sessionend",xd),as.stop()};function ie(R){R.preventDefault(),xa("WebGLRenderer: Context Lost."),E=!0}function Le(){xa("WebGLRenderer: Context Restored."),E=!1;let R=Rt.autoReset,V=fe.enabled,q=fe.autoUpdate,G=fe.needsUpdate,W=fe.type;Se(),Rt.autoReset=R,fe.enabled=V,fe.autoUpdate=q,fe.needsUpdate=G,fe.type=W}function Ge(R){Oe("WebGLRenderer: A WebGL context could not be created. Reason: ",R.statusMessage)}function Lt(R){let V=R.target;V.removeEventListener("dispose",Lt),dt(V)}function dt(R){_i(R),P.remove(R)}function _i(R){let V=P.get(R).programs;V!==void 0&&(V.forEach(function(q){ge.releaseProgram(q)}),R.isShaderMaterial&&ge.releaseShaderCache(R))}this.renderBufferDirect=function(R,V,q,G,W,ve){V===null&&(V=Et);let Ee=W.isMesh&&W.matrixWorld.determinant()<0,ye=Jp(R,V,q,G,W);xe.setMaterial(G,Ee);let Ce=q.index,Fe=1;if(G.wireframe===!0){if(Ce=re.getWireframeAttribute(q),Ce===void 0)return;Fe=2}let We=q.drawRange,Ze=q.attributes.position,De=We.start*Fe,ft=(We.start+We.count)*Fe;ve!==null&&(De=Math.max(De,ve.start*Fe),ft=Math.min(ft,(ve.start+ve.count)*Fe)),Ce!==null?(De=Math.max(De,0),ft=Math.min(ft,Ce.count)):Ze!=null&&(De=Math.max(De,0),ft=Math.min(ft,Ze.count));let Nt=ft-De;if(Nt<0||Nt===1/0)return;de.setup(W,G,ye,q,Ce);let Ct,gt=Xe;if(Ce!==null&&(Ct=J.get(Ce),gt=rt,gt.setIndex(Ct)),W.isMesh)G.wireframe===!0?(xe.setLineWidth(G.wireframeLinewidth*Yt()),gt.setMode(B.LINES)):gt.setMode(B.TRIANGLES);else if(W.isLine){let Zt=G.linewidth;Zt===void 0&&(Zt=1),xe.setLineWidth(Zt*Yt()),W.isLineSegments?gt.setMode(B.LINES):W.isLineLoop?gt.setMode(B.LINE_LOOP):gt.setMode(B.LINE_STRIP)}else W.isPoints?gt.setMode(B.POINTS):W.isSprite&&gt.setMode(B.TRIANGLES);if(W.isBatchedMesh)if(He.get("WEBGL_multi_draw"))gt.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else{let Zt=W._multiDrawStarts,we=W._multiDrawCounts,gn=W._multiDrawCount,st=Ce?J.get(Ce).bytesPerElement:1,Tn=P.get(G).currentProgram.getUniforms();for(let qn=0;qn<gn;qn++)Tn.setValue(B,"_gl_DrawID",qn),gt.render(Zt[qn]/st,we[qn])}else if(W.isInstancedMesh)gt.renderInstances(De,Nt,W.count);else if(q.isInstancedBufferGeometry){let Zt=q._maxInstanceCount!==void 0?q._maxInstanceCount:1/0,we=Math.min(q.instanceCount,Zt);gt.renderInstances(De,Nt,we)}else gt.render(De,Nt)};function Yn(R,V,q){R.transparent===!0&&R.side===en&&R.forceSinglePass===!1?(R.side=ln,R.needsUpdate=!0,fo(R,V,q),R.side=On,R.needsUpdate=!0,fo(R,V,q),R.side=en):fo(R,V,q)}this.compile=function(R,V,q=null){q===null&&(q=R),b=be.get(q),b.init(V),M.push(b),q.traverseVisible(function(W){W.isLight&&W.layers.test(V.layers)&&(b.pushLight(W),W.castShadow&&b.pushShadow(W))}),R!==q&&R.traverseVisible(function(W){W.isLight&&W.layers.test(V.layers)&&(b.pushLight(W),W.castShadow&&b.pushShadow(W))}),b.setupLights();let G=new Set;return R.traverse(function(W){if(!(W.isMesh||W.isPoints||W.isLine||W.isSprite))return;let ve=W.material;if(ve)if(Array.isArray(ve))for(let Ee=0;Ee<ve.length;Ee++){let ye=ve[Ee];Yn(ye,q,W),G.add(ye)}else Yn(ve,q,W),G.add(ve)}),b=M.pop(),G},this.compileAsync=function(R,V,q=null){let G=this.compile(R,V,q);return new Promise(W=>{function ve(){if(G.forEach(function(Ee){P.get(Ee).currentProgram.isReady()&&G.delete(Ee)}),G.size===0){W(R);return}setTimeout(ve,10)}He.get("KHR_parallel_shader_compile")!==null?ve():setTimeout(ve,10)})};let Oc=null;function Kp(R){Oc&&Oc(R)}function gd(){as.stop()}function xd(){as.start()}let as=new vp;as.setAnimationLoop(Kp),typeof self<"u"&&as.setContext(self),this.setAnimationLoop=function(R){Oc=R,pe.setAnimationLoop(R),R===null?as.stop():as.start()},pe.addEventListener("sessionstart",gd),pe.addEventListener("sessionend",xd),this.render=function(R,V){if(V!==void 0&&V.isCamera!==!0){Oe("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(E===!0)return;N!==null&&N.renderStart(R,V);let q=pe.enabled===!0&&pe.isPresenting===!0,G=A!==null&&(I===null||q)&&A.begin(C,I);if(R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),V.parent===null&&V.matrixWorldAutoUpdate===!0&&V.updateMatrixWorld(),pe.enabled===!0&&pe.isPresenting===!0&&(A===null||A.isCompositing()===!1)&&(pe.cameraAutoUpdate===!0&&pe.updateCamera(V),V=pe.getCamera()),R.isScene===!0&&R.onBeforeRender(C,R,V,I),b=be.get(R,M.length),b.init(V),b.state.textureUnits=T.getTextureUnits(),M.push(b),it.multiplyMatrices(V.projectionMatrix,V.matrixWorldInverse),Ne.setFromProjectionMatrix(it,Dn,V.reversedDepth),Ke=this.localClippingEnabled,ot=Ae.init(this.clippingPlanes,Ke),S=j.get(R,w.length),S.init(),w.push(S),pe.enabled===!0&&pe.isPresenting===!0){let Ee=C.xr.getDepthSensingMesh();Ee!==null&&Bc(Ee,V,-1/0,C.sortObjects)}Bc(R,V,0,C.sortObjects),S.finish(),C.sortObjects===!0&&S.sort(K,le),ut=pe.enabled===!1||pe.isPresenting===!1||pe.hasDepthSensing()===!1,ut&&ue.addToRenderList(S,R),this.info.render.frame++,ot===!0&&Ae.beginShadows();let W=b.state.shadowsArray;if(fe.render(W,R,V),ot===!0&&Ae.endShadows(),this.info.autoReset===!0&&this.info.reset(),(G&&A.hasRenderPass())===!1){let Ee=S.opaque,ye=S.transmissive;if(b.setupLights(),V.isArrayCamera){let Ce=V.cameras;if(ye.length>0)for(let Fe=0,We=Ce.length;Fe<We;Fe++){let Ze=Ce[Fe];yd(Ee,ye,R,Ze)}ut&&ue.render(R);for(let Fe=0,We=Ce.length;Fe<We;Fe++){let Ze=Ce[Fe];_d(S,R,Ze,Ze.viewport)}}else ye.length>0&&yd(Ee,ye,R,V),ut&&ue.render(R),_d(S,R,V)}I!==null&&L===0&&(T.updateMultisampleRenderTarget(I),T.updateRenderTargetMipmap(I)),G&&A.end(C),R.isScene===!0&&R.onAfterRender(C,R,V),de.resetDefaultState(),D=-1,U=null,M.pop(),M.length>0?(b=M[M.length-1],T.setTextureUnits(b.state.textureUnits),ot===!0&&Ae.setGlobalState(C.clippingPlanes,b.state.camera)):b=null,w.pop(),w.length>0?S=w[w.length-1]:S=null,N!==null&&N.renderEnd()};function Bc(R,V,q,G){if(R.visible===!1)return;if(R.layers.test(V.layers)){if(R.isGroup)q=R.renderOrder;else if(R.isLOD)R.autoUpdate===!0&&R.update(V);else if(R.isLightProbeGrid)b.pushLightProbeGrid(R);else if(R.isLight)b.pushLight(R),R.castShadow&&b.pushShadow(R);else if(R.isSprite){if(!R.frustumCulled||Ne.intersectsSprite(R)){G&&qe.setFromMatrixPosition(R.matrixWorld).applyMatrix4(it);let Ee=he.update(R),ye=R.material;ye.visible&&S.push(R,Ee,ye,q,qe.z,null)}}else if((R.isMesh||R.isLine||R.isPoints)&&(!R.frustumCulled||Ne.intersectsObject(R))){let Ee=he.update(R),ye=R.material;if(G&&(R.boundingSphere!==void 0?(R.boundingSphere===null&&R.computeBoundingSphere(),qe.copy(R.boundingSphere.center)):(Ee.boundingSphere===null&&Ee.computeBoundingSphere(),qe.copy(Ee.boundingSphere.center)),qe.applyMatrix4(R.matrixWorld).applyMatrix4(it)),Array.isArray(ye)){let Ce=Ee.groups;for(let Fe=0,We=Ce.length;Fe<We;Fe++){let Ze=Ce[Fe],De=ye[Ze.materialIndex];De&&De.visible&&S.push(R,Ee,De,q,qe.z,Ze)}}else ye.visible&&S.push(R,Ee,ye,q,qe.z,null)}}let ve=R.children;for(let Ee=0,ye=ve.length;Ee<ye;Ee++)Bc(ve[Ee],V,q,G)}function _d(R,V,q,G){let{opaque:W,transmissive:ve,transparent:Ee}=R;b.setupLightsView(q),ot===!0&&Ae.setGlobalState(C.clippingPlanes,q),G&&xe.viewport(Y.copy(G)),W.length>0&&uo(W,V,q),ve.length>0&&uo(ve,V,q),Ee.length>0&&uo(Ee,V,q),xe.buffers.depth.setTest(!0),xe.buffers.depth.setMask(!0),xe.buffers.color.setMask(!0),xe.setPolygonOffset(!1)}function yd(R,V,q,G){if((q.isScene===!0?q.overrideMaterial:null)!==null)return;if(b.state.transmissionRenderTarget[G.id]===void 0){let De=He.has("EXT_color_buffer_half_float")||He.has("EXT_color_buffer_float");b.state.transmissionRenderTarget[G.id]=new yn(1,1,{generateMipmaps:!0,type:De?ai:pn,minFilter:zn,samples:Math.max(4,ct.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Je.workingColorSpace})}let ve=b.state.transmissionRenderTarget[G.id],Ee=G.viewport||Y;ve.setSize(Ee.z*C.transmissionResolutionScale,Ee.w*C.transmissionResolutionScale);let ye=C.getRenderTarget(),Ce=C.getActiveCubeFace(),Fe=C.getActiveMipmapLevel();C.setRenderTarget(ve),C.getClearColor(ae),ce=C.getClearAlpha(),ce<1&&C.setClearColor(16777215,.5),C.clear(),ut&&ue.render(q);let We=C.toneMapping;C.toneMapping=Vn;let Ze=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),b.setupLightsView(G),ot===!0&&Ae.setGlobalState(C.clippingPlanes,G),uo(R,q,G),T.updateMultisampleRenderTarget(ve),T.updateRenderTargetMipmap(ve),He.has("WEBGL_multisampled_render_to_texture")===!1){let De=!1;for(let ft=0,Nt=V.length;ft<Nt;ft++){let Ct=V[ft],{object:gt,geometry:Zt,material:we,group:gn}=Ct;if(we.side===en&&gt.layers.test(G.layers)){let st=we.side;we.side=ln,we.needsUpdate=!0,vd(gt,q,G,Zt,we,gn),we.side=st,we.needsUpdate=!0,De=!0}}De===!0&&(T.updateMultisampleRenderTarget(ve),T.updateRenderTargetMipmap(ve))}C.setRenderTarget(ye,Ce,Fe),C.setClearColor(ae,ce),Ze!==void 0&&(G.viewport=Ze),C.toneMapping=We}function uo(R,V,q){let G=V.isScene===!0?V.overrideMaterial:null;for(let W=0,ve=R.length;W<ve;W++){let Ee=R[W],{object:ye,geometry:Ce,group:Fe}=Ee,We=Ee.material;We.allowOverride===!0&&G!==null&&(We=G),ye.layers.test(q.layers)&&vd(ye,V,q,Ce,We,Fe)}}function vd(R,V,q,G,W,ve){R.onBeforeRender(C,V,q,G,W,ve),R.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,R.matrixWorld),R.normalMatrix.getNormalMatrix(R.modelViewMatrix),W.onBeforeRender(C,V,q,G,R,ve),W.transparent===!0&&W.side===en&&W.forceSinglePass===!1?(W.side=ln,W.needsUpdate=!0,C.renderBufferDirect(q,V,G,W,R,ve),W.side=On,W.needsUpdate=!0,C.renderBufferDirect(q,V,G,W,R,ve),W.side=en):C.renderBufferDirect(q,V,G,W,R,ve),R.onAfterRender(C,V,q,G,W,ve)}function fo(R,V,q){V.isScene!==!0&&(V=Et);let G=P.get(R),W=b.state.lights,ve=b.state.shadowsArray,Ee=W.state.version,ye=ge.getParameters(R,W.state,ve,V,q,b.state.lightProbeGridArray),Ce=ge.getProgramCacheKey(ye),Fe=G.programs;G.environment=R.isMeshStandardMaterial||R.isMeshLambertMaterial||R.isMeshPhongMaterial?V.environment:null,G.fog=V.fog;let We=R.isMeshStandardMaterial||R.isMeshLambertMaterial&&!R.envMap||R.isMeshPhongMaterial&&!R.envMap;G.envMap=H.get(R.envMap||G.environment,We),G.envMapRotation=G.environment!==null&&R.envMap===null?V.environmentRotation:R.envMapRotation,Fe===void 0&&(R.addEventListener("dispose",Lt),Fe=new Map,G.programs=Fe);let Ze=Fe.get(Ce);if(Ze!==void 0){if(G.currentProgram===Ze&&G.lightsStateVersion===Ee)return Md(R,ye),Ze}else ye.uniforms=ge.getUniforms(R),N!==null&&R.isNodeMaterial&&N.build(R,q,ye),R.onBeforeCompile(ye,C),Ze=ge.acquireProgram(ye,Ce),Fe.set(Ce,Ze),G.uniforms=ye.uniforms;let De=G.uniforms;return(!R.isShaderMaterial&&!R.isRawShaderMaterial||R.clipping===!0)&&(De.clippingPlanes=Ae.uniform),Md(R,ye),G.needsLights=Qp(R),G.lightsStateVersion=Ee,G.needsLights&&(De.ambientLightColor.value=W.state.ambient,De.lightProbe.value=W.state.probe,De.directionalLights.value=W.state.directional,De.directionalLightShadows.value=W.state.directionalShadow,De.spotLights.value=W.state.spot,De.spotLightShadows.value=W.state.spotShadow,De.rectAreaLights.value=W.state.rectArea,De.ltc_1.value=W.state.rectAreaLTC1,De.ltc_2.value=W.state.rectAreaLTC2,De.pointLights.value=W.state.point,De.pointLightShadows.value=W.state.pointShadow,De.hemisphereLights.value=W.state.hemi,De.directionalShadowMatrix.value=W.state.directionalShadowMatrix,De.spotLightMatrix.value=W.state.spotLightMatrix,De.spotLightMap.value=W.state.spotLightMap,De.pointShadowMatrix.value=W.state.pointShadowMatrix),G.lightProbeGrid=b.state.lightProbeGridArray.length>0,G.currentProgram=Ze,G.uniformsList=null,Ze}function bd(R){if(R.uniformsList===null){let V=R.currentProgram.getUniforms();R.uniformsList=pr.seqWithValue(V.seq,R.uniforms)}return R.uniformsList}function Md(R,V){let q=P.get(R);q.outputColorSpace=V.outputColorSpace,q.batching=V.batching,q.batchingColor=V.batchingColor,q.instancing=V.instancing,q.instancingColor=V.instancingColor,q.instancingMorph=V.instancingMorph,q.skinning=V.skinning,q.morphTargets=V.morphTargets,q.morphNormals=V.morphNormals,q.morphColors=V.morphColors,q.morphTargetsCount=V.morphTargetsCount,q.numClippingPlanes=V.numClippingPlanes,q.numIntersection=V.numClipIntersection,q.vertexAlphas=V.vertexAlphas,q.vertexTangents=V.vertexTangents,q.toneMapping=V.toneMapping}function Zp(R,V){if(R.length===0)return null;if(R.length===1)return R[0].texture!==null?R[0]:null;v.setFromMatrixPosition(V.matrixWorld);for(let q=0,G=R.length;q<G;q++){let W=R[q];if(W.texture!==null&&W.boundingBox.containsPoint(v))return W}return null}function Jp(R,V,q,G,W){V.isScene!==!0&&(V=Et),T.resetTextureUnits();let ve=V.fog,Ee=G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial?V.environment:null,ye=I===null?C.outputColorSpace:I.isXRRenderTarget===!0?I.texture.colorSpace:Je.workingColorSpace,Ce=G.isMeshStandardMaterial||G.isMeshLambertMaterial&&!G.envMap||G.isMeshPhongMaterial&&!G.envMap,Fe=H.get(G.envMap||Ee,Ce),We=G.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,Ze=!!q.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),De=!!q.morphAttributes.position,ft=!!q.morphAttributes.normal,Nt=!!q.morphAttributes.color,Ct=Vn;G.toneMapped&&(I===null||I.isXRRenderTarget===!0)&&(Ct=C.toneMapping);let gt=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,Zt=gt!==void 0?gt.length:0,we=P.get(G),gn=b.state.lights;if(ot===!0&&(Ke===!0||R!==U)){let vt=R===U&&G.id===D;Ae.setState(G,R,vt)}let st=!1;G.version===we.__version?(we.needsLights&&we.lightsStateVersion!==gn.state.version||we.outputColorSpace!==ye||W.isBatchedMesh&&we.batching===!1||!W.isBatchedMesh&&we.batching===!0||W.isBatchedMesh&&we.batchingColor===!0&&W.colorTexture===null||W.isBatchedMesh&&we.batchingColor===!1&&W.colorTexture!==null||W.isInstancedMesh&&we.instancing===!1||!W.isInstancedMesh&&we.instancing===!0||W.isSkinnedMesh&&we.skinning===!1||!W.isSkinnedMesh&&we.skinning===!0||W.isInstancedMesh&&we.instancingColor===!0&&W.instanceColor===null||W.isInstancedMesh&&we.instancingColor===!1&&W.instanceColor!==null||W.isInstancedMesh&&we.instancingMorph===!0&&W.morphTexture===null||W.isInstancedMesh&&we.instancingMorph===!1&&W.morphTexture!==null||we.envMap!==Fe||G.fog===!0&&we.fog!==ve||we.numClippingPlanes!==void 0&&(we.numClippingPlanes!==Ae.numPlanes||we.numIntersection!==Ae.numIntersection)||we.vertexAlphas!==We||we.vertexTangents!==Ze||we.morphTargets!==De||we.morphNormals!==ft||we.morphColors!==Nt||we.toneMapping!==Ct||we.morphTargetsCount!==Zt||!!we.lightProbeGrid!=b.state.lightProbeGridArray.length>0)&&(st=!0):(st=!0,we.__version=G.version);let Tn=we.currentProgram;st===!0&&(Tn=fo(G,V,W),N&&G.isNodeMaterial&&N.onUpdateProgram(G,Tn,we));let qn=!1,Ui=!1,Is=!1,xt=Tn.getUniforms(),Ft=we.uniforms;if(xe.useProgram(Tn.program)&&(qn=!0,Ui=!0,Is=!0),G.id!==D&&(D=G.id,Ui=!0),we.needsLights){let vt=Zp(b.state.lightProbeGridArray,W);we.lightProbeGrid!==vt&&(we.lightProbeGrid=vt,Ui=!0)}if(qn||U!==R){xe.buffers.depth.getReversed()&&R.reversedDepth!==!0&&(R._reversedDepth=!0,R.updateProjectionMatrix()),xt.setValue(B,"projectionMatrix",R.projectionMatrix),xt.setValue(B,"viewMatrix",R.matrixWorldInverse);let Bi=xt.map.cameraPosition;Bi!==void 0&&Bi.setValue(B,lt.setFromMatrixPosition(R.matrixWorld)),ct.logarithmicDepthBuffer&&xt.setValue(B,"logDepthBufFC",2/(Math.log(R.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&xt.setValue(B,"isOrthographic",R.isOrthographicCamera===!0),U!==R&&(U=R,Ui=!0,Is=!0)}if(we.needsLights&&(gn.state.directionalShadowMap.length>0&&xt.setValue(B,"directionalShadowMap",gn.state.directionalShadowMap,T),gn.state.spotShadowMap.length>0&&xt.setValue(B,"spotShadowMap",gn.state.spotShadowMap,T),gn.state.pointShadowMap.length>0&&xt.setValue(B,"pointShadowMap",gn.state.pointShadowMap,T)),W.isSkinnedMesh){xt.setOptional(B,W,"bindMatrix"),xt.setOptional(B,W,"bindMatrixInverse");let vt=W.skeleton;vt&&(vt.boneTexture===null&&vt.computeBoneTexture(),xt.setValue(B,"boneTexture",vt.boneTexture,T))}W.isBatchedMesh&&(xt.setOptional(B,W,"batchingTexture"),xt.setValue(B,"batchingTexture",W._matricesTexture,T),xt.setOptional(B,W,"batchingIdTexture"),xt.setValue(B,"batchingIdTexture",W._indirectTexture,T),xt.setOptional(B,W,"batchingColorTexture"),W._colorsTexture!==null&&xt.setValue(B,"batchingColorTexture",W._colorsTexture,T));let Oi=q.morphAttributes;if((Oi.position!==void 0||Oi.normal!==void 0||Oi.color!==void 0)&&Ve.update(W,q,Tn),(Ui||we.receiveShadow!==W.receiveShadow)&&(we.receiveShadow=W.receiveShadow,xt.setValue(B,"receiveShadow",W.receiveShadow)),(G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial)&&G.envMap===null&&V.environment!==null&&(Ft.envMapIntensity.value=V.environmentIntensity),Ft.dfgLUT!==void 0&&(Ft.dfgLUT.value=qy()),Ui){if(xt.setValue(B,"toneMappingExposure",C.toneMappingExposure),we.needsLights&&jp(Ft,Is),ve&&G.fog===!0&&$.refreshFogUniforms(Ft,ve),$.refreshMaterialUniforms(Ft,G,me,Me,b.state.transmissionRenderTarget[R.id]),we.needsLights&&we.lightProbeGrid){let vt=we.lightProbeGrid;Ft.probesSH.value=vt.texture,Ft.probesMin.value.copy(vt.boundingBox.min),Ft.probesMax.value.copy(vt.boundingBox.max),Ft.probesResolution.value.copy(vt.resolution)}pr.upload(B,bd(we),Ft,T)}if(G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(pr.upload(B,bd(we),Ft,T),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&xt.setValue(B,"center",W.center),xt.setValue(B,"modelViewMatrix",W.modelViewMatrix),xt.setValue(B,"normalMatrix",W.normalMatrix),xt.setValue(B,"modelMatrix",W.matrixWorld),G.uniformsGroups!==void 0){let vt=G.uniformsGroups;for(let Bi=0,Ps=vt.length;Bi<Ps;Bi++){let Sd=vt[Bi];Z.update(Sd,Tn),Z.bind(Sd,Tn)}}return Tn}function jp(R,V){R.ambientLightColor.needsUpdate=V,R.lightProbe.needsUpdate=V,R.directionalLights.needsUpdate=V,R.directionalLightShadows.needsUpdate=V,R.pointLights.needsUpdate=V,R.pointLightShadows.needsUpdate=V,R.spotLights.needsUpdate=V,R.spotLightShadows.needsUpdate=V,R.rectAreaLights.needsUpdate=V,R.hemisphereLights.needsUpdate=V}function Qp(R){return R.isMeshLambertMaterial||R.isMeshToonMaterial||R.isMeshPhongMaterial||R.isMeshStandardMaterial||R.isShadowMaterial||R.isShaderMaterial&&R.lights===!0}this.getActiveCubeFace=function(){return F},this.getActiveMipmapLevel=function(){return L},this.getRenderTarget=function(){return I},this.setRenderTargetTextures=function(R,V,q){let G=P.get(R);G.__autoAllocateDepthBuffer=R.resolveDepthBuffer===!1,G.__autoAllocateDepthBuffer===!1&&(G.__useRenderToTexture=!1),P.get(R.texture).__webglTexture=V,P.get(R.depthTexture).__webglTexture=G.__autoAllocateDepthBuffer?void 0:q,G.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(R,V){let q=P.get(R);q.__webglFramebuffer=V,q.__useDefaultFramebuffer=V===void 0};let em=B.createFramebuffer();this.setRenderTarget=function(R,V=0,q=0){I=R,F=V,L=q;let G=null,W=!1,ve=!1;if(R){let ye=P.get(R);if(ye.__useDefaultFramebuffer!==void 0){xe.bindFramebuffer(B.FRAMEBUFFER,ye.__webglFramebuffer),Y.copy(R.viewport),X.copy(R.scissor),ee=R.scissorTest,xe.viewport(Y),xe.scissor(X),xe.setScissorTest(ee),D=-1;return}else if(ye.__webglFramebuffer===void 0)T.setupRenderTarget(R);else if(ye.__hasExternalTextures)T.rebindTextures(R,P.get(R.texture).__webglTexture,P.get(R.depthTexture).__webglTexture);else if(R.depthBuffer){let We=R.depthTexture;if(ye.__boundDepthTexture!==We){if(We!==null&&P.has(We)&&(R.width!==We.image.width||R.height!==We.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");T.setupDepthRenderbuffer(R)}}let Ce=R.texture;(Ce.isData3DTexture||Ce.isDataArrayTexture||Ce.isCompressedArrayTexture)&&(ve=!0);let Fe=P.get(R).__webglFramebuffer;R.isWebGLCubeRenderTarget?(Array.isArray(Fe[V])?G=Fe[V][q]:G=Fe[V],W=!0):R.samples>0&&T.useMultisampledRTT(R)===!1?G=P.get(R).__webglMultisampledFramebuffer:Array.isArray(Fe)?G=Fe[q]:G=Fe,Y.copy(R.viewport),X.copy(R.scissor),ee=R.scissorTest}else Y.copy(te).multiplyScalar(me).floor(),X.copy(Te).multiplyScalar(me).floor(),ee=Re;if(q!==0&&(G=em),xe.bindFramebuffer(B.FRAMEBUFFER,G)&&xe.drawBuffers(R,G),xe.viewport(Y),xe.scissor(X),xe.setScissorTest(ee),W){let ye=P.get(R.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_CUBE_MAP_POSITIVE_X+V,ye.__webglTexture,q)}else if(ve){let ye=V;for(let Ce=0;Ce<R.textures.length;Ce++){let Fe=P.get(R.textures[Ce]);B.framebufferTextureLayer(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0+Ce,Fe.__webglTexture,q,ye)}}else if(R!==null&&q!==0){let ye=P.get(R.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,ye.__webglTexture,q)}D=-1},this.readRenderTargetPixels=function(R,V,q,G,W,ve,Ee,ye=0){if(!(R&&R.isWebGLRenderTarget)){Oe("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ce=P.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Ee!==void 0&&(Ce=Ce[Ee]),Ce){xe.bindFramebuffer(B.FRAMEBUFFER,Ce);try{let Fe=R.textures[ye],We=Fe.format,Ze=Fe.type;if(R.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+ye),!ct.textureFormatReadable(We)){Oe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ct.textureTypeReadable(Ze)){Oe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}V>=0&&V<=R.width-G&&q>=0&&q<=R.height-W&&B.readPixels(V,q,G,W,O.convert(We),O.convert(Ze),ve)}finally{let Fe=I!==null?P.get(I).__webglFramebuffer:null;xe.bindFramebuffer(B.FRAMEBUFFER,Fe)}}},this.readRenderTargetPixelsAsync=async function(R,V,q,G,W,ve,Ee,ye=0){if(!(R&&R.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ce=P.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Ee!==void 0&&(Ce=Ce[Ee]),Ce)if(V>=0&&V<=R.width-G&&q>=0&&q<=R.height-W){xe.bindFramebuffer(B.FRAMEBUFFER,Ce);let Fe=R.textures[ye],We=Fe.format,Ze=Fe.type;if(R.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+ye),!ct.textureFormatReadable(We))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ct.textureTypeReadable(Ze))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let De=B.createBuffer();B.bindBuffer(B.PIXEL_PACK_BUFFER,De),B.bufferData(B.PIXEL_PACK_BUFFER,ve.byteLength,B.STREAM_READ),B.readPixels(V,q,G,W,O.convert(We),O.convert(Ze),0);let ft=I!==null?P.get(I).__webglFramebuffer:null;xe.bindFramebuffer(B.FRAMEBUFFER,ft);let Nt=B.fenceSync(B.SYNC_GPU_COMMANDS_COMPLETE,0);return B.flush(),await Yf(B,Nt,4),B.bindBuffer(B.PIXEL_PACK_BUFFER,De),B.getBufferSubData(B.PIXEL_PACK_BUFFER,0,ve),B.deleteBuffer(De),B.deleteSync(Nt),ve}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(R,V=null,q=0){let G=Math.pow(2,-q),W=Math.floor(R.image.width*G),ve=Math.floor(R.image.height*G),Ee=V!==null?V.x:0,ye=V!==null?V.y:0;T.setTexture2D(R,0),B.copyTexSubImage2D(B.TEXTURE_2D,q,0,0,Ee,ye,W,ve),xe.unbindTexture()};let tm=B.createFramebuffer(),nm=B.createFramebuffer();this.copyTextureToTexture=function(R,V,q=null,G=null,W=0,ve=0){let Ee,ye,Ce,Fe,We,Ze,De,ft,Nt,Ct=R.isCompressedTexture?R.mipmaps[ve]:R.image;if(q!==null)Ee=q.max.x-q.min.x,ye=q.max.y-q.min.y,Ce=q.isBox3?q.max.z-q.min.z:1,Fe=q.min.x,We=q.min.y,Ze=q.isBox3?q.min.z:0;else{let Ft=Math.pow(2,-W);Ee=Math.floor(Ct.width*Ft),ye=Math.floor(Ct.height*Ft),R.isDataArrayTexture?Ce=Ct.depth:R.isData3DTexture?Ce=Math.floor(Ct.depth*Ft):Ce=1,Fe=0,We=0,Ze=0}G!==null?(De=G.x,ft=G.y,Nt=G.z):(De=0,ft=0,Nt=0);let gt=O.convert(V.format),Zt=O.convert(V.type),we;V.isData3DTexture?(T.setTexture3D(V,0),we=B.TEXTURE_3D):V.isDataArrayTexture||V.isCompressedArrayTexture?(T.setTexture2DArray(V,0),we=B.TEXTURE_2D_ARRAY):(T.setTexture2D(V,0),we=B.TEXTURE_2D),xe.activeTexture(B.TEXTURE0),xe.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,V.flipY),xe.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,V.premultiplyAlpha),xe.pixelStorei(B.UNPACK_ALIGNMENT,V.unpackAlignment);let gn=xe.getParameter(B.UNPACK_ROW_LENGTH),st=xe.getParameter(B.UNPACK_IMAGE_HEIGHT),Tn=xe.getParameter(B.UNPACK_SKIP_PIXELS),qn=xe.getParameter(B.UNPACK_SKIP_ROWS),Ui=xe.getParameter(B.UNPACK_SKIP_IMAGES);xe.pixelStorei(B.UNPACK_ROW_LENGTH,Ct.width),xe.pixelStorei(B.UNPACK_IMAGE_HEIGHT,Ct.height),xe.pixelStorei(B.UNPACK_SKIP_PIXELS,Fe),xe.pixelStorei(B.UNPACK_SKIP_ROWS,We),xe.pixelStorei(B.UNPACK_SKIP_IMAGES,Ze);let Is=R.isDataArrayTexture||R.isData3DTexture,xt=V.isDataArrayTexture||V.isData3DTexture;if(R.isDepthTexture){let Ft=P.get(R),Oi=P.get(V),vt=P.get(Ft.__renderTarget),Bi=P.get(Oi.__renderTarget);xe.bindFramebuffer(B.READ_FRAMEBUFFER,vt.__webglFramebuffer),xe.bindFramebuffer(B.DRAW_FRAMEBUFFER,Bi.__webglFramebuffer);for(let Ps=0;Ps<Ce;Ps++)Is&&(B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,P.get(R).__webglTexture,W,Ze+Ps),B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,P.get(V).__webglTexture,ve,Nt+Ps)),B.blitFramebuffer(Fe,We,Ee,ye,De,ft,Ee,ye,B.DEPTH_BUFFER_BIT,B.NEAREST);xe.bindFramebuffer(B.READ_FRAMEBUFFER,null),xe.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else if(W!==0||R.isRenderTargetTexture||P.has(R)){let Ft=P.get(R),Oi=P.get(V);xe.bindFramebuffer(B.READ_FRAMEBUFFER,tm),xe.bindFramebuffer(B.DRAW_FRAMEBUFFER,nm);for(let vt=0;vt<Ce;vt++)Is?B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Ft.__webglTexture,W,Ze+vt):B.framebufferTexture2D(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,Ft.__webglTexture,W),xt?B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Oi.__webglTexture,ve,Nt+vt):B.framebufferTexture2D(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,Oi.__webglTexture,ve),W!==0?B.blitFramebuffer(Fe,We,Ee,ye,De,ft,Ee,ye,B.COLOR_BUFFER_BIT,B.NEAREST):xt?B.copyTexSubImage3D(we,ve,De,ft,Nt+vt,Fe,We,Ee,ye):B.copyTexSubImage2D(we,ve,De,ft,Fe,We,Ee,ye);xe.bindFramebuffer(B.READ_FRAMEBUFFER,null),xe.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else xt?R.isDataTexture||R.isData3DTexture?B.texSubImage3D(we,ve,De,ft,Nt,Ee,ye,Ce,gt,Zt,Ct.data):V.isCompressedArrayTexture?B.compressedTexSubImage3D(we,ve,De,ft,Nt,Ee,ye,Ce,gt,Ct.data):B.texSubImage3D(we,ve,De,ft,Nt,Ee,ye,Ce,gt,Zt,Ct):R.isDataTexture?B.texSubImage2D(B.TEXTURE_2D,ve,De,ft,Ee,ye,gt,Zt,Ct.data):R.isCompressedTexture?B.compressedTexSubImage2D(B.TEXTURE_2D,ve,De,ft,Ct.width,Ct.height,gt,Ct.data):B.texSubImage2D(B.TEXTURE_2D,ve,De,ft,Ee,ye,gt,Zt,Ct);xe.pixelStorei(B.UNPACK_ROW_LENGTH,gn),xe.pixelStorei(B.UNPACK_IMAGE_HEIGHT,st),xe.pixelStorei(B.UNPACK_SKIP_PIXELS,Tn),xe.pixelStorei(B.UNPACK_SKIP_ROWS,qn),xe.pixelStorei(B.UNPACK_SKIP_IMAGES,Ui),ve===0&&V.generateMipmaps&&B.generateMipmap(we),xe.unbindTexture()},this.initRenderTarget=function(R){P.get(R).__webglFramebuffer===void 0&&T.setupRenderTarget(R)},this.initTexture=function(R){R.isCubeTexture?T.setTextureCube(R,0):R.isData3DTexture?T.setTexture3D(R,0):R.isDataArrayTexture||R.isCompressedArrayTexture?T.setTexture2DArray(R,0):T.setTexture2D(R,0),xe.unbindTexture()},this.resetState=function(){F=0,L=0,I=null,xe.reset(),de.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Dn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Je._getDrawingBufferColorSpace(e),t.unpackColorSpace=Je._getUnpackColorSpace()}};function bu(r,e){if(e===qh)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),r;if(e===dr||e===ja){let t=r.getIndex();if(t===null){let o=[],l=r.getAttribute("position");if(l!==void 0){for(let a=0;a<l.count;a++)o.push(a);r.setIndex(o),t=r.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),r}let n=t.count-2,i=[];if(e===dr)for(let o=1;o<=n;o++)i.push(t.getX(0)),i.push(t.getX(o)),i.push(t.getX(o+1));else for(let o=0;o<n;o++)o%2===0?(i.push(t.getX(o)),i.push(t.getX(o+1)),i.push(t.getX(o+2))):(i.push(t.getX(o+2)),i.push(t.getX(o+1)),i.push(t.getX(o)));i.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");let s=r.clone();return s.setIndex(i),s.clearGroups(),s}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),r}function Ep(r){let e=new Map,t=new Map,n=r.clone();return Rp(r,n,function(i,s){e.set(s,i),t.set(i,s)}),n.traverse(function(i){if(!i.isSkinnedMesh)return;let s=i,o=e.get(i),l=o.skeleton.bones;s.skeleton=o.skeleton.clone(),s.bindMatrix.copy(o.bindMatrix),s.skeleton.bones=l.map(function(a){return t.get(a)}),s.bind(s.skeleton,s.bindMatrix)}),n}function Rp(r,e,t){t(r,e);for(let n=0;n<r.children.length;n++)Rp(r.children[n],e.children[n],t)}var pc=class extends si{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new Ru(t)}),this.register(function(t){return new Cu(t)}),this.register(function(t){return new Bu(t)}),this.register(function(t){return new ku(t)}),this.register(function(t){return new Vu(t)}),this.register(function(t){return new Pu(t)}),this.register(function(t){return new Lu(t)}),this.register(function(t){return new Nu(t)}),this.register(function(t){return new Fu(t)}),this.register(function(t){return new Eu(t)}),this.register(function(t){return new Du(t)}),this.register(function(t){return new Iu(t)}),this.register(function(t){return new Ou(t)}),this.register(function(t){return new Uu(t)}),this.register(function(t){return new Tu(t)}),this.register(function(t){return new mc(t,je.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new mc(t,je.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new zu(t)})}load(e,t,n,i){let s=this,o;if(this.resourcePath!=="")o=this.resourcePath;else if(this.path!==""){let c=Ci.extractUrlBase(e);o=Ci.resolveURL(c,this.path)}else o=Ci.extractUrlBase(e);this.manager.itemStart(e);let l=function(c){i?i(c):console.error(c),s.manager.itemError(e),s.manager.itemEnd(e)},a=new rr(this.manager);a.setPath(this.path),a.setResponseType("arraybuffer"),a.setRequestHeader(this.requestHeader),a.setWithCredentials(this.withCredentials),a.load(e,function(c){try{s.parse(c,o,function(h){t(h),s.manager.itemEnd(e)},l)}catch(h){l(h)}},n,l)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,i){let s,o={},l={},a=new TextDecoder;if(typeof e=="string")s=JSON.parse(e);else if(e instanceof ArrayBuffer)if(a.decode(new Uint8Array(e,0,4))===Np){try{o[je.KHR_BINARY_GLTF]=new Hu(e)}catch(u){i&&i(u);return}s=JSON.parse(o[je.KHR_BINARY_GLTF].content)}else s=JSON.parse(a.decode(e));else s=e;if(s.asset===void 0||s.asset.version[0]<2){i&&i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let c=new Ku(s,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){let u=this.pluginCallbacks[h](c);u.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),l[u.name]=u,o[u.name]=!0}if(s.extensionsUsed)for(let h=0;h<s.extensionsUsed.length;++h){let u=s.extensionsUsed[h],d=s.extensionsRequired||[];switch(u){case je.KHR_MATERIALS_UNLIT:o[u]=new Au;break;case je.KHR_DRACO_MESH_COMPRESSION:o[u]=new Gu(s,this.dracoLoader);break;case je.KHR_TEXTURE_TRANSFORM:o[u]=new Wu;break;case je.KHR_MESH_QUANTIZATION:o[u]=new Xu;break;default:d.indexOf(u)>=0&&l[u]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+u+'".')}}c.setExtensions(o),c.setPlugins(l),c.parse(n,i)}parseAsync(e,t){let n=this;return new Promise(function(i,s){n.parse(e,t,i,s)})}};function $y(){let r={};return{get:function(e){return r[e]},add:function(e,t){r[e]=t},remove:function(e){delete r[e]},removeAll:function(){r={}}}}function Ut(r,e,t){let n=r.json.materials[e];return n.extensions&&n.extensions[t]?n.extensions[t]:null}var je={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},Tu=class{constructor(e){this.parser=e,this.name=je.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,i=t.length;n<i;n++){let s=t[n];s.extensions&&s.extensions[this.name]&&s.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,s.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n="light:"+e,i=t.cache.get(n);if(i)return i;let s=t.json,a=((s.extensions&&s.extensions[this.name]||{}).lights||[])[e],c,h=new Be(16777215);a.color!==void 0&&h.setRGB(a.color[0],a.color[1],a.color[2],an);let u=a.range!==void 0?a.range:0;switch(a.type){case"directional":c=new ka(h),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new Ba(h),c.distance=u;break;case"spot":c=new Oa(h),c.distance=u,a.spot=a.spot||{},a.spot.innerConeAngle=a.spot.innerConeAngle!==void 0?a.spot.innerConeAngle:0,a.spot.outerConeAngle=a.spot.outerConeAngle!==void 0?a.spot.outerConeAngle:Math.PI/4,c.angle=a.spot.outerConeAngle,c.penumbra=1-a.spot.innerConeAngle/a.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+a.type)}return c.position.set(0,0,0),ci(c,a),a.intensity!==void 0&&(c.intensity=a.intensity),c.name=t.createUniqueName(a.name||"light_"+e),i=Promise.resolve(c),t.cache.add(n,i),i}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,s=n.json.nodes[e],l=(s.extensions&&s.extensions[this.name]||{}).light;return l===void 0?null:this._loadLight(l).then(function(a){return n._getNodeRef(t.cache,l,a)})}},Au=class{constructor(){this.name=je.KHR_MATERIALS_UNLIT}getMaterialType(){return $t}extendParams(e,t,n){let i=[];e.color=new Be(1,1,1),e.opacity=1;let s=t.pbrMetallicRoughness;if(s){if(Array.isArray(s.baseColorFactor)){let o=s.baseColorFactor;e.color.setRGB(o[0],o[1],o[2],an),e.opacity=o[3]}s.baseColorTexture!==void 0&&i.push(n.assignTexture(e,"map",s.baseColorTexture,Tt))}return Promise.all(i)}},Eu=class{constructor(e){this.parser=e,this.name=je.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let n=Ut(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}},Ru=class{constructor(e){this.parser=e,this.name=je.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return Ut(this.parser,e,this.name)!==null?dn:null}extendMaterialParams(e,t){let n=Ut(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&i.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(i.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){let s=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new et(s,s)}return Promise.all(i)}},Cu=class{constructor(e){this.parser=e,this.name=je.KHR_MATERIALS_DISPERSION}getMaterialType(e){return Ut(this.parser,e,this.name)!==null?dn:null}extendMaterialParams(e,t){let n=Ut(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion!==void 0?n.dispersion:0),Promise.resolve()}},Iu=class{constructor(e){this.parser=e,this.name=je.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return Ut(this.parser,e,this.name)!==null?dn:null}extendMaterialParams(e,t){let n=Ut(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&i.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&i.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture)),Promise.all(i)}},Pu=class{constructor(e){this.parser=e,this.name=je.KHR_MATERIALS_SHEEN}getMaterialType(e){return Ut(this.parser,e,this.name)!==null?dn:null}extendMaterialParams(e,t){let n=Ut(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];if(t.sheenColor=new Be(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){let s=n.sheenColorFactor;t.sheenColor.setRGB(s[0],s[1],s[2],an)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&i.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,Tt)),n.sheenRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture)),Promise.all(i)}},Lu=class{constructor(e){this.parser=e,this.name=je.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return Ut(this.parser,e,this.name)!==null?dn:null}extendMaterialParams(e,t){let n=Ut(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&i.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture)),Promise.all(i)}},Nu=class{constructor(e){this.parser=e,this.name=je.KHR_MATERIALS_VOLUME}getMaterialType(e){return Ut(this.parser,e,this.name)!==null?dn:null}extendMaterialParams(e,t){let n=Ut(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0&&i.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;let s=n.attenuationColor||[1,1,1];return t.attenuationColor=new Be().setRGB(s[0],s[1],s[2],an),Promise.all(i)}},Fu=class{constructor(e){this.parser=e,this.name=je.KHR_MATERIALS_IOR}getMaterialType(e){return Ut(this.parser,e,this.name)!==null?dn:null}extendMaterialParams(e,t){let n=Ut(this.parser,e,this.name);return n===null||(t.ior=n.ior!==void 0?n.ior:1.5,t.ior===0&&(t.ior=1e3)),Promise.resolve()}},Du=class{constructor(e){this.parser=e,this.name=je.KHR_MATERIALS_SPECULAR}getMaterialType(e){return Ut(this.parser,e,this.name)!==null?dn:null}extendMaterialParams(e,t){let n=Ut(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0&&i.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));let s=n.specularColorFactor||[1,1,1];return t.specularColor=new Be().setRGB(s[0],s[1],s[2],an),n.specularColorTexture!==void 0&&i.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,Tt)),Promise.all(i)}},Uu=class{constructor(e){this.parser=e,this.name=je.EXT_MATERIALS_BUMP}getMaterialType(e){return Ut(this.parser,e,this.name)!==null?dn:null}extendMaterialParams(e,t){let n=Ut(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];return t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0&&i.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture)),Promise.all(i)}},Ou=class{constructor(e){this.parser=e,this.name=je.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return Ut(this.parser,e,this.name)!==null?dn:null}extendMaterialParams(e,t){let n=Ut(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&i.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture)),Promise.all(i)}},Bu=class{constructor(e){this.parser=e,this.name=je.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,i=n.textures[e];if(!i.extensions||!i.extensions[this.name])return null;let s=i.extensions[this.name],o=t.options.ktx2Loader;if(!o){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,s.source,o)}},ku=class{constructor(e){this.parser=e,this.name=je.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[t])return null;let o=s.extensions[t],l=i.images[o.source],a=n.textureLoader;if(l.uri){let c=n.options.manager.getHandler(l.uri);c!==null&&(a=c)}return n.loadTextureImage(e,o.source,a)}},Vu=class{constructor(e){this.parser=e,this.name=je.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[t])return null;let o=s.extensions[t],l=i.images[o.source],a=n.textureLoader;if(l.uri){let c=n.options.manager.getHandler(l.uri);c!==null&&(a=c)}return n.loadTextureImage(e,o.source,a)}},mc=class{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let i=n.extensions[this.name],s=this.parser.getDependency("buffer",i.buffer),o=this.parser.options.meshoptDecoder;if(!o||!o.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return s.then(function(l){let a=i.byteOffset||0,c=i.byteLength||0,h=i.count,u=i.byteStride,d=new Uint8Array(l,a,c);return o.decodeGltfBufferAsync?o.decodeGltfBufferAsync(h,u,d,i.mode,i.filter).then(function(f){return f.buffer}):o.ready.then(function(){let f=new ArrayBuffer(h*u);return o.decodeGltfBuffer(new Uint8Array(f),h,u,d,i.mode,i.filter),f})})}else return null}},zu=class{constructor(e){this.name=je.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let i=t.meshes[n.mesh];for(let c of i.primitives)if(c.mode!==Rn.TRIANGLES&&c.mode!==Rn.TRIANGLE_STRIP&&c.mode!==Rn.TRIANGLE_FAN&&c.mode!==void 0)return null;let o=n.extensions[this.name].attributes,l=[],a={};for(let c in o)l.push(this.parser.getDependency("accessor",o[c]).then(h=>(a[c]=h,a[c])));return l.length<1?null:(l.push(this.parser.createNodeMesh(e)),Promise.all(l).then(c=>{let h=c.pop(),u=h.isGroup?h.children:[h],d=c[0].count,f=[];for(let p of u){let x=new ke,m=new z,g=new Qt,y=new z(1,1,1),_=new Ta(p.geometry,p.material,d);for(let v=0;v<d;v++)a.TRANSLATION&&m.fromBufferAttribute(a.TRANSLATION,v),a.ROTATION&&g.fromBufferAttribute(a.ROTATION,v),a.SCALE&&y.fromBufferAttribute(a.SCALE,v),_.setMatrixAt(v,x.compose(m,g,y));for(let v in a)if(v==="_COLOR_0"){let S=a[v];_.instanceColor=new Ki(S.array,S.itemSize,S.normalized)}else v!=="TRANSLATION"&&v!=="ROTATION"&&v!=="SCALE"&&p.geometry.setAttribute(v,a[v]);wt.prototype.copy.call(_,p),this.parser.assignFinalMaterial(_),f.push(_)}return h.isGroup?(h.clear(),h.add(...f),h):f[0]}))}},Np="glTF",no=12,Cp={JSON:1313821514,BIN:5130562},Hu=class{constructor(e){this.name=je.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,no),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Np)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let i=this.header.length-no,s=new DataView(e,no),o=0;for(;o<i;){let l=s.getUint32(o,!0);o+=4;let a=s.getUint32(o,!0);if(o+=4,a===Cp.JSON){let c=new Uint8Array(e,no+o,l);this.content=n.decode(c)}else if(a===Cp.BIN){let c=no+o;this.body=e.slice(c,c+l)}o+=l}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},Gu=class{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=je.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,i=this.dracoLoader,s=e.extensions[this.name].bufferView,o=e.extensions[this.name].attributes,l={},a={},c={};for(let h in o){let u=qu[h]||h.toLowerCase();l[u]=o[h]}for(let h in e.attributes){let u=qu[h]||h.toLowerCase();if(o[h]!==void 0){let d=n.accessors[e.attributes[h]],f=gr[d.componentType];c[u]=f.name,a[u]=d.normalized===!0}}return t.getDependency("bufferView",s).then(function(h){return new Promise(function(u,d){i.decodeDracoFile(h,function(f){for(let p in f.attributes){let x=f.attributes[p],m=a[p];m!==void 0&&(x.normalized=m)}u(f)},l,c,an,d)})})}},Wu=class{constructor(){this.name=je.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}},Xu=class{constructor(){this.name=je.KHR_MESH_QUANTIZATION}},gc=class extends ei{constructor(e,t,n,i){super(e,t,n,i)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i*3+i;for(let o=0;o!==i;o++)t[o]=n[s+o];return t}interpolate_(e,t,n,i){let s=this.resultBuffer,o=this.sampleValues,l=this.valueSize,a=l*2,c=l*3,h=i-t,u=(n-t)/h,d=u*u,f=d*u,p=e*c,x=p-c,m=-2*f+3*d,g=f-d,y=1-m,_=g-d+u;for(let v=0;v!==l;v++){let S=o[x+v+l],b=o[x+v+a]*h,w=o[p+v+l],M=o[p+v]*h;s[v]=y*S+_*b+m*w+g*M}return s}},Ky=new Qt,Yu=class extends gc{interpolate_(e,t,n,i){let s=super.interpolate_(e,t,n,i);return Ky.fromArray(s).normalize().toArray(s),s}},Rn={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},gr={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Ip={9728:bt,9729:Mt,9984:yl,9985:cr,9986:Ms,9987:zn},Pp={33071:cn,33648:qi,10497:Jn},Mu={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},qu={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},ts={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},Zy={CUBICSPLINE:void 0,LINEAR:ms,STEP:ps},Su={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function Jy(r){return r.DefaultMaterial===void 0&&(r.DefaultMaterial=new vs({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:On})),r.DefaultMaterial}function Ts(r,e,t){for(let n in t.extensions)r[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function ci(r,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(r.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function jy(r,e,t){let n=!1,i=!1,s=!1;for(let c=0,h=e.length;c<h;c++){let u=e[c];if(u.POSITION!==void 0&&(n=!0),u.NORMAL!==void 0&&(i=!0),u.COLOR_0!==void 0&&(s=!0),n&&i&&s)break}if(!n&&!i&&!s)return Promise.resolve(r);let o=[],l=[],a=[];for(let c=0,h=e.length;c<h;c++){let u=e[c];if(n){let d=u.POSITION!==void 0?t.getDependency("accessor",u.POSITION):r.attributes.position;o.push(d)}if(i){let d=u.NORMAL!==void 0?t.getDependency("accessor",u.NORMAL):r.attributes.normal;l.push(d)}if(s){let d=u.COLOR_0!==void 0?t.getDependency("accessor",u.COLOR_0):r.attributes.color;a.push(d)}}return Promise.all([Promise.all(o),Promise.all(l),Promise.all(a)]).then(function(c){let h=c[0],u=c[1],d=c[2];return n&&(r.morphAttributes.position=h),i&&(r.morphAttributes.normal=u),s&&(r.morphAttributes.color=d),r.morphTargetsRelative=!0,r})}function Qy(r,e){if(r.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)r.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){let t=e.extras.targetNames;if(r.morphTargetInfluences.length===t.length){r.morphTargetDictionary={};for(let n=0,i=t.length;n<i;n++)r.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function ev(r){let e,t=r.extensions&&r.extensions[je.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+wu(t.attributes):e=r.indices+":"+wu(r.attributes)+":"+r.mode,r.targets!==void 0)for(let n=0,i=r.targets.length;n<i;n++)e+=":"+wu(r.targets[n]);return e}function wu(r){let e="",t=Object.keys(r).sort();for(let n=0,i=t.length;n<i;n++)e+=t[n]+":"+r[t[n]]+";";return e}function $u(r){switch(r){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function tv(r){return r.search(/\.jpe?g($|\?)/i)>0||r.search(/^data\:image\/jpeg/)===0?"image/jpeg":r.search(/\.webp($|\?)/i)>0||r.search(/^data\:image\/webp/)===0?"image/webp":r.search(/\.ktx2($|\?)/i)>0||r.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}var nv=new ke,Ku=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new $y,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,i=-1,s=!1,o=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){let l=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(l)===!0;let a=l.match(/Version\/(\d+)/);i=n&&a?parseInt(a[1],10):-1,s=l.indexOf("Firefox")>-1,o=s?l.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&i<17||s&&o<98?this.textureLoader=new Fa(this.options.manager):this.textureLoader=new Va(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new rr(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,i=this.json,s=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(o){return o._markDefs&&o._markDefs()}),Promise.all(this._invokeAll(function(o){return o.beforeRoot&&o.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(o){let l={scene:o[0][i.scene||0],scenes:o[0],animations:o[1],cameras:o[2],asset:i.asset,parser:n,userData:{}};return Ts(s,l,i),ci(l,i),Promise.all(n._invokeAll(function(a){return a.afterRoot&&a.afterRoot(l)})).then(function(){for(let a of l.scenes)a.updateMatrixWorld();e(l)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let i=0,s=t.length;i<s;i++){let o=t[i].joints;for(let l=0,a=o.length;l<a;l++)e[o[l]].isBone=!0}for(let i=0,s=e.length;i<s;i++){let o=e[i];o.mesh!==void 0&&(this._addNodeRef(this.meshCache,o.mesh),o.skin!==void 0&&(n[o.mesh].isSkinnedMesh=!0)),o.camera!==void 0&&this._addNodeRef(this.cameraCache,o.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let i=n.clone(),s=(o,l)=>{let a=this.associations.get(o);a!=null&&this.associations.set(l,a);for(let[c,h]of o.children.entries())s(h,l.children[c])};return s(n,i),i.name+="_instance_"+e.uses[t]++,i}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let i=e(t[n]);if(i)return i}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let i=0;i<t.length;i++){let s=e(t[i]);s&&n.push(s)}return n}getDependency(e,t){let n=e+":"+t,i=this.cache.get(n);if(!i){switch(e){case"scene":i=this.loadScene(t);break;case"node":i=this._invokeOne(function(s){return s.loadNode&&s.loadNode(t)});break;case"mesh":i=this._invokeOne(function(s){return s.loadMesh&&s.loadMesh(t)});break;case"accessor":i=this.loadAccessor(t);break;case"bufferView":i=this._invokeOne(function(s){return s.loadBufferView&&s.loadBufferView(t)});break;case"buffer":i=this.loadBuffer(t);break;case"material":i=this._invokeOne(function(s){return s.loadMaterial&&s.loadMaterial(t)});break;case"texture":i=this._invokeOne(function(s){return s.loadTexture&&s.loadTexture(t)});break;case"skin":i=this.loadSkin(t);break;case"animation":i=this._invokeOne(function(s){return s.loadAnimation&&s.loadAnimation(t)});break;case"camera":i=this.loadCamera(t);break;default:if(i=this._invokeOne(function(s){return s!=this&&s.getDependency&&s.getDependency(e,t)}),!i)throw new Error("Unknown type: "+e);break}this.cache.add(n,i)}return i}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,i=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(i.map(function(s,o){return n.getDependency(e,o)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[je.KHR_BINARY_GLTF].body);let i=this.options;return new Promise(function(s,o){n.load(Ci.resolveURL(t.uri,i.path),s,void 0,function(){o(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){let i=t.byteLength||0,s=t.byteOffset||0;return n.slice(s,s+i)})}loadAccessor(e){let t=this,n=this.json,i=this.json.accessors[e];if(i.bufferView===void 0&&i.sparse===void 0){let o=Mu[i.type],l=gr[i.componentType],a=i.normalized===!0,c=new l(i.count*o);return Promise.resolve(new At(c,o,a))}let s=[];return i.bufferView!==void 0?s.push(this.getDependency("bufferView",i.bufferView)):s.push(null),i.sparse!==void 0&&(s.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),s.push(this.getDependency("bufferView",i.sparse.values.bufferView))),Promise.all(s).then(function(o){let l=o[0],a=Mu[i.type],c=gr[i.componentType],h=c.BYTES_PER_ELEMENT,u=h*a,d=i.byteOffset||0,f=i.bufferView!==void 0?n.bufferViews[i.bufferView].byteStride:void 0,p=i.normalized===!0,x,m;if(f&&f!==u){let g=Math.floor(d/f),y="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+g+":"+i.count,_=t.cache.get(y);_||(x=new c(l,g*f,i.count*f/h),_=new $i(x,f/h),t.cache.add(y,_)),m=new kn(_,a,d%f/h,p)}else l===null?x=new c(i.count*a):x=new c(l,d,i.count*a),m=new At(x,a,p);if(i.sparse!==void 0){let g=Mu.SCALAR,y=gr[i.sparse.indices.componentType],_=i.sparse.indices.byteOffset||0,v=i.sparse.values.byteOffset||0,S=new y(o[1],_,i.sparse.count*g),b=new c(o[2],v,i.sparse.count*a);l!==null&&(m=new At(m.array.slice(),m.itemSize,m.normalized)),m.normalized=!1;for(let w=0,M=S.length;w<M;w++){let A=S[w];if(m.setX(A,b[w*a]),a>=2&&m.setY(A,b[w*a+1]),a>=3&&m.setZ(A,b[w*a+2]),a>=4&&m.setW(A,b[w*a+3]),a>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}m.normalized=p}return m})}loadTexture(e){let t=this.json,n=this.options,s=t.textures[e].source,o=t.images[s],l=this.textureLoader;if(o.uri){let a=n.manager.getHandler(o.uri);a!==null&&(l=a)}return this.loadTextureImage(e,s,l)}loadTextureImage(e,t,n){let i=this,s=this.json,o=s.textures[e],l=s.images[t],a=(l.uri||l.bufferView)+":"+o.sampler;if(this.textureCache[a])return this.textureCache[a];let c=this.loadImageSource(t,n).then(function(h){h.flipY=!1,h.name=o.name||l.name||"",h.name===""&&typeof l.uri=="string"&&l.uri.startsWith("data:image/")===!1&&(h.name=l.uri);let d=(s.samplers||{})[o.sampler]||{};return h.magFilter=Ip[d.magFilter]||Mt,h.minFilter=Ip[d.minFilter]||zn,h.wrapS=Pp[d.wrapS]||Jn,h.wrapT=Pp[d.wrapT]||Jn,h.generateMipmaps=!h.isCompressedTexture&&h.minFilter!==bt&&h.minFilter!==Mt,i.associations.set(h,{textures:e}),h}).catch(function(){return null});return this.textureCache[a]=c,c}loadImageSource(e,t){let n=this,i=this.json,s=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(u=>u.clone());let o=i.images[e],l=self.URL||self.webkitURL,a=o.uri||"",c=!1;if(o.bufferView!==void 0)a=n.getDependency("bufferView",o.bufferView).then(function(u){c=!0;let d=new Blob([u],{type:o.mimeType});return a=l.createObjectURL(d),a});else if(o.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");let h=Promise.resolve(a).then(function(u){return new Promise(function(d,f){let p=d;t.isImageBitmapLoader===!0&&(p=function(x){let m=new Dt(x);m.needsUpdate=!0,d(m)}),t.load(Ci.resolveURL(u,s.path),p,void 0,f)})}).then(function(u){return c===!0&&l.revokeObjectURL(a),ci(u,o),u.userData.mimeType=o.mimeType||tv(o.uri),u}).catch(function(u){throw console.error("THREE.GLTFLoader: Couldn't load texture",a),u});return this.sourceCache[e]=h,h}assignTexture(e,t,n,i){let s=this;return this.getDependency("texture",n.index).then(function(o){if(!o)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(o=o.clone(),o.channel=n.texCoord),s.extensions[je.KHR_TEXTURE_TRANSFORM]){let l=n.extensions!==void 0?n.extensions[je.KHR_TEXTURE_TRANSFORM]:void 0;if(l){let a=s.associations.get(o);o=s.extensions[je.KHR_TEXTURE_TRANSFORM].extendTexture(o,l),s.associations.set(o,a)}}return i!==void 0&&(o.colorSpace=i),e[t]=o,o})}assignFinalMaterial(e){let t=e.geometry,n=e.material,i=t.attributes.tangent===void 0,s=t.attributes.color!==void 0,o=t.attributes.normal===void 0;if(e.isPoints){let l="PointsMaterial:"+n.uuid,a=this.cache.get(l);a||(a=new ir,Wt.prototype.copy.call(a,n),a.color.copy(n.color),a.map=n.map,a.sizeAttenuation=!1,this.cache.add(l,a)),n=a}else if(e.isLine){let l="LineBasicMaterial:"+n.uuid,a=this.cache.get(l);a||(a=new nr,Wt.prototype.copy.call(a,n),a.color.copy(n.color),a.map=n.map,this.cache.add(l,a)),n=a}if(i||s||o){let l="ClonedMaterial:"+n.uuid+":";i&&(l+="derivative-tangents:"),s&&(l+="vertex-colors:"),o&&(l+="flat-shading:");let a=this.cache.get(l);a||(a=n.clone(),s&&(a.vertexColors=!0),o&&(a.flatShading=!0),i&&(a.normalScale&&(a.normalScale.y*=-1),a.clearcoatNormalScale&&(a.clearcoatNormalScale.y*=-1)),this.cache.add(l,a),this.associations.set(a,this.associations.get(n))),n=a}e.material=n}getMaterialType(){return vs}loadMaterial(e){let t=this,n=this.json,i=this.extensions,s=n.materials[e],o,l={},a=s.extensions||{},c=[];if(a[je.KHR_MATERIALS_UNLIT]){let u=i[je.KHR_MATERIALS_UNLIT];o=u.getMaterialType(),c.push(u.extendParams(l,s,t))}else{let u=s.pbrMetallicRoughness||{};if(l.color=new Be(1,1,1),l.opacity=1,Array.isArray(u.baseColorFactor)){let d=u.baseColorFactor;l.color.setRGB(d[0],d[1],d[2],an),l.opacity=d[3]}u.baseColorTexture!==void 0&&c.push(t.assignTexture(l,"map",u.baseColorTexture,Tt)),l.metalness=u.metallicFactor!==void 0?u.metallicFactor:1,l.roughness=u.roughnessFactor!==void 0?u.roughnessFactor:1,u.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(l,"metalnessMap",u.metallicRoughnessTexture)),c.push(t.assignTexture(l,"roughnessMap",u.metallicRoughnessTexture))),o=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(e,l)})))}s.doubleSided===!0&&(l.side=en);let h=s.alphaMode||Su.OPAQUE;if(h===Su.BLEND?(l.transparent=!0,l.depthWrite=!1):(l.transparent=!1,h===Su.MASK&&(l.alphaTest=s.alphaCutoff!==void 0?s.alphaCutoff:.5)),s.normalTexture!==void 0&&o!==$t&&(c.push(t.assignTexture(l,"normalMap",s.normalTexture)),l.normalScale=new et(1,1),s.normalTexture.scale!==void 0)){let u=s.normalTexture.scale;l.normalScale.set(u,u)}if(s.occlusionTexture!==void 0&&o!==$t&&(c.push(t.assignTexture(l,"aoMap",s.occlusionTexture)),s.occlusionTexture.strength!==void 0&&(l.aoMapIntensity=s.occlusionTexture.strength)),s.emissiveFactor!==void 0&&o!==$t){let u=s.emissiveFactor;l.emissive=new Be().setRGB(u[0],u[1],u[2],an)}return s.emissiveTexture!==void 0&&o!==$t&&c.push(t.assignTexture(l,"emissiveMap",s.emissiveTexture,Tt)),Promise.all(c).then(function(){let u=new o(l);return s.name&&(u.name=s.name),ci(u,s),t.associations.set(u,{materials:e}),s.extensions&&Ts(i,u,s),u})}createUniqueName(e){let t=_t.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,n=this.extensions,i=this.primitiveCache;function s(l){return n[je.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(l,t).then(function(a){return Lp(a,l,t)})}let o=[];for(let l=0,a=e.length;l<a;l++){let c=e[l],h=ev(c),u=i[h];if(u)o.push(u.promise);else{let d;c.extensions&&c.extensions[je.KHR_DRACO_MESH_COMPRESSION]?d=s(c):d=Lp(new qt,c,t),i[h]={primitive:c,promise:d},o.push(d)}}return Promise.all(o)}loadMesh(e){let t=this,n=this.json,i=this.extensions,s=n.meshes[e],o=s.primitives,l=[];for(let a=0,c=o.length;a<c;a++){let h=o[a].material===void 0?Jy(this.cache):this.getDependency("material",o[a].material);l.push(h)}return l.push(t.loadGeometries(o)),Promise.all(l).then(function(a){let c=a.slice(0,a.length-1),h=a[a.length-1],u=[];for(let f=0,p=h.length;f<p;f++){let x=h[f],m=o[f],g,y=c[f];if(m.mode===Rn.TRIANGLES||m.mode===Rn.TRIANGLE_STRIP||m.mode===Rn.TRIANGLE_FAN||m.mode===void 0)g=s.isSkinnedMesh===!0?new Sa(x,y):new It(x,y),g.isSkinnedMesh===!0&&g.normalizeSkinWeights(),m.mode===Rn.TRIANGLE_STRIP?g.geometry=bu(g.geometry,ja):m.mode===Rn.TRIANGLE_FAN&&(g.geometry=bu(g.geometry,dr));else if(m.mode===Rn.LINES)g=new Aa(x,y);else if(m.mode===Rn.LINE_STRIP)g=new _s(x,y);else if(m.mode===Rn.LINE_LOOP)g=new Ea(x,y);else if(m.mode===Rn.POINTS)g=new Ra(x,y);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+m.mode);Object.keys(g.geometry.morphAttributes).length>0&&Qy(g,s),g.name=t.createUniqueName(s.name||"mesh_"+e),ci(g,s),m.extensions&&Ts(i,g,m),t.assignFinalMaterial(g),u.push(g)}for(let f=0,p=u.length;f<p;f++)t.associations.set(u[f],{meshes:e,primitives:f});if(u.length===1)return s.extensions&&Ts(i,u[0],s),u[0];let d=new hn;s.extensions&&Ts(i,d,s),t.associations.set(d,{meshes:e});for(let f=0,p=u.length;f<p;f++)d.add(u[f]);return d})}loadCamera(e){let t,n=this.json.cameras[e],i=n[n.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new Bt(Zh.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2e6):n.type==="orthographic"&&(t=new Zi(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),ci(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let i=0,s=t.joints.length;i<s;i++)n.push(this._loadNodeShallow(t.joints[i]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(i){let s=i.pop(),o=i,l=[],a=[];for(let c=0,h=o.length;c<h;c++){let u=o[c];if(u){l.push(u);let d=new ke;s!==null&&d.fromArray(s.array,c*16),a.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new wa(l,a)})}loadAnimation(e){let t=this.json,n=this,i=t.animations[e],s=i.name?i.name:"animation_"+e,o=[],l=[],a=[],c=[],h=[];for(let u=0,d=i.channels.length;u<d;u++){let f=i.channels[u],p=i.samplers[f.sampler],x=f.target,m=x.node,g=i.parameters!==void 0?i.parameters[p.input]:p.input,y=i.parameters!==void 0?i.parameters[p.output]:p.output;x.node!==void 0&&(o.push(this.getDependency("node",m)),l.push(this.getDependency("accessor",g)),a.push(this.getDependency("accessor",y)),c.push(p),h.push(x))}return Promise.all([Promise.all(o),Promise.all(l),Promise.all(a),Promise.all(c),Promise.all(h)]).then(function(u){let d=u[0],f=u[1],p=u[2],x=u[3],m=u[4],g=[];for(let _=0,v=d.length;_<v;_++){let S=d[_],b=f[_],w=p[_],M=x[_],A=m[_];if(S===void 0)continue;S.updateMatrix&&S.updateMatrix();let C=n._createAnimationTracks(S,b,w,M,A);if(C)for(let E=0;E<C.length;E++)g.push(C[E])}let y=new Na(s,void 0,g);return ci(y,i),y})}createNodeMesh(e){let t=this.json,n=this,i=t.nodes[e];return i.mesh===void 0?null:n.getDependency("mesh",i.mesh).then(function(s){let o=n._getNodeRef(n.meshCache,i.mesh,s);return i.weights!==void 0&&o.traverse(function(l){if(l.isMesh)for(let a=0,c=i.weights.length;a<c;a++)l.morphTargetInfluences[a]=i.weights[a]}),o})}loadNode(e){let t=this.json,n=this,i=t.nodes[e],s=n._loadNodeShallow(e),o=[],l=i.children||[];for(let c=0,h=l.length;c<h;c++)o.push(n.getDependency("node",l[c]));let a=i.skin===void 0?Promise.resolve(null):n.getDependency("skin",i.skin);return Promise.all([s,Promise.all(o),a]).then(function(c){let h=c[0],u=c[1],d=c[2];d!==null&&h.traverse(function(f){f.isSkinnedMesh&&f.bind(d,nv)});for(let f=0,p=u.length;f<p;f++)h.add(u[f]);if(h.userData.pivot!==void 0&&u.length>0){let f=h.userData.pivot,p=u[0];h.pivot=new z().fromArray(f),h.position.x-=f[0],h.position.y-=f[1],h.position.z-=f[2],p.position.set(0,0,0),delete h.userData.pivot}return h})}_loadNodeShallow(e){let t=this.json,n=this.extensions,i=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let s=t.nodes[e],o=s.name?i.createUniqueName(s.name):"",l=[],a=i._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return a&&l.push(a),s.camera!==void 0&&l.push(i.getDependency("camera",s.camera).then(function(c){return i._getNodeRef(i.cameraCache,s.camera,c)})),i._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){l.push(c)}),this.nodeCache[e]=Promise.all(l).then(function(c){let h;if(s.isBone===!0?h=new Qs:c.length>1?h=new hn:c.length===1?h=c[0]:h=new wt,h!==c[0])for(let u=0,d=c.length;u<d;u++)h.add(c[u]);if(s.name&&(h.userData.name=s.name,h.name=o),ci(h,s),s.extensions&&Ts(n,h,s),s.matrix!==void 0){let u=new ke;u.fromArray(s.matrix),h.applyMatrix4(u)}else s.translation!==void 0&&h.position.fromArray(s.translation),s.rotation!==void 0&&h.quaternion.fromArray(s.rotation),s.scale!==void 0&&h.scale.fromArray(s.scale);if(!i.associations.has(h))i.associations.set(h,{});else if(s.mesh!==void 0&&i.meshCache.refs[s.mesh]>1){let u=i.associations.get(h);i.associations.set(h,{...u})}return i.associations.get(h).nodes=e,h}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],i=this,s=new hn;n.name&&(s.name=i.createUniqueName(n.name)),ci(s,n),n.extensions&&Ts(t,s,n);let o=n.nodes||[],l=[];for(let a=0,c=o.length;a<c;a++)l.push(i.getDependency("node",o[a]));return Promise.all(l).then(function(a){for(let h=0,u=a.length;h<u;h++){let d=a[h];d.parent!==null?s.add(Ep(d)):s.add(d)}let c=h=>{let u=new Map;for(let[d,f]of i.associations)(d instanceof Wt||d instanceof Dt)&&u.set(d,f);return h.traverse(d=>{let f=i.associations.get(d);f!=null&&u.set(d,f)}),u};return i.associations=c(s),s})}_createAnimationTracks(e,t,n,i,s){let o=[],l=e.name?e.name:e.uuid,a=[];function c(f){f.morphTargetInfluences&&a.push(f.name?f.name:f.uuid)}ts[s.path]===ts.weights?(c(e),e.isGroup&&e.children.forEach(c)):a.push(l);let h;switch(ts[s.path]){case ts.weights:h=ti;break;case ts.rotation:h=ni;break;case ts.translation:case ts.scale:h=ii;break;default:n.itemSize===1?h=ti:h=ii;break}let u=i.interpolation!==void 0?Zy[i.interpolation]:ms,d=this._getArrayFromAccessor(n);for(let f=0,p=a.length;f<p;f++){let x=new h(a[f]+"."+ts[s.path],t.array,d,u);i.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(x),o.push(x)}return o}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let n=$u(t.constructor),i=new Float32Array(t.length);for(let s=0,o=t.length;s<o;s++)i[s]=t[s]*n;t=i}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){let i=this instanceof ni?Yu:gc;return new i(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function iv(r,e,t){let n=e.attributes,i=new vn;if(n.POSITION!==void 0){let l=t.json.accessors[n.POSITION],a=l.min,c=l.max;if(a!==void 0&&c!==void 0){if(i.set(new z(a[0],a[1],a[2]),new z(c[0],c[1],c[2])),l.normalized){let h=$u(gr[l.componentType]);i.min.multiplyScalar(h),i.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let s=e.targets;if(s!==void 0){let l=new z,a=new z;for(let c=0,h=s.length;c<h;c++){let u=s[c];if(u.POSITION!==void 0){let d=t.json.accessors[u.POSITION],f=d.min,p=d.max;if(f!==void 0&&p!==void 0){if(a.setX(Math.max(Math.abs(f[0]),Math.abs(p[0]))),a.setY(Math.max(Math.abs(f[1]),Math.abs(p[1]))),a.setZ(Math.max(Math.abs(f[2]),Math.abs(p[2]))),d.normalized){let x=$u(gr[d.componentType]);a.multiplyScalar(x)}l.max(a)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}i.expandByVector(l)}r.boundingBox=i;let o=new un;i.getCenter(o.center),o.radius=i.min.distanceTo(i.max)/2,r.boundingSphere=o}function Lp(r,e,t){let n=e.attributes,i=[];function s(o,l){return t.getDependency("accessor",o).then(function(a){r.setAttribute(l,a)})}for(let o in n){let l=qu[o]||o.toLowerCase();l in r.attributes||i.push(s(n[o],l))}if(e.indices!==void 0&&!r.index){let o=t.getDependency("accessor",e.indices).then(function(l){r.setIndex(l)});i.push(o)}return Je.workingColorSpace!==an&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Je.workingColorSpace}" not supported.`),ci(r,e),iv(r,e,t),Promise.all(i).then(function(){return e.targets!==void 0?jy(r,e.targets,t):r})}if(typeof window<"u"&&window.THREE){let r=window.require;window.require=e=>{if(r)return r(e);if(e==="three")return window.THREE}}var xr=class{entries={};size=0;add(e){let t=this.entries[e];return this.entries[e]=!0,t?!1:(this.size++,!0)}addAll(e){let t=this.size;for(var n=0,i=e.length;n<i;n++)this.add(e[n]);return t!=this.size}contains(e){return this.entries[e]}clear(){this.entries={},this.size=0}},Pe=class r{r;g;b;a;static WHITE=new r(1,1,1,1);static RED=new r(1,0,0,1);static GREEN=new r(0,1,0,1);static BLUE=new r(0,0,1,1);static MAGENTA=new r(1,0,1,1);constructor(e=0,t=0,n=0,i=0){this.r=e,this.g=t,this.b=n,this.a=i}set(e,t,n,i){return this.r=e,this.g=t,this.b=n,this.a=i,this.clamp()}setFromColor(e){return this.r=e.r,this.g=e.g,this.b=e.b,this.a=e.a,this}setFromString(e){return e=e.charAt(0)=="#"?e.substr(1):e,this.r=parseInt(e.substr(0,2),16)/255,this.g=parseInt(e.substr(2,2),16)/255,this.b=parseInt(e.substr(4,2),16)/255,this.a=e.length!=8?1:parseInt(e.substr(6,2),16)/255,this}add(e,t,n,i){return this.r+=e,this.g+=t,this.b+=n,this.a+=i,this.clamp()}clamp(){return this.r<0?this.r=0:this.r>1&&(this.r=1),this.g<0?this.g=0:this.g>1&&(this.g=1),this.b<0?this.b=0:this.b>1&&(this.b=1),this.a<0?this.a=0:this.a>1&&(this.a=1),this}static rgba8888ToColor(e,t){e.r=((t&4278190080)>>>24)/255,e.g=((t&16711680)>>>16)/255,e.b=((t&65280)>>>8)/255,e.a=(t&255)/255}static rgb888ToColor(e,t){e.r=((t&16711680)>>>16)/255,e.g=((t&65280)>>>8)/255,e.b=(t&255)/255}toRgb888(){let e=t=>("0"+(t*255).toString(16)).slice(-2);return+("0x"+e(this.r)+e(this.g)+e(this.b))}static fromString(e,t=new r){return t.setFromString(e)}},ne=class r{static PI=3.1415927;static PI2=r.PI*2;static invPI2=1/r.PI2;static radiansToDegrees=180/r.PI;static radDeg=r.radiansToDegrees;static degreesToRadians=r.PI/180;static degRad=r.degreesToRadians;static clamp(e,t,n){return e<t?t:e>n?n:e}static cosDeg(e){return Math.cos(e*r.degRad)}static sinDeg(e){return Math.sin(e*r.degRad)}static atan2Deg(e,t){return Math.atan2(e,t)*r.degRad}static signum(e){return e>0?1:e<0?-1:0}static toInt(e){return e>0?Math.floor(e):Math.ceil(e)}static cbrt(e){let t=Math.pow(Math.abs(e),.3333333333333333);return e<0?-t:t}static randomTriangular(e,t){return r.randomTriangularWith(e,t,(e+t)*.5)}static randomTriangularWith(e,t,n){let i=Math.random(),s=t-e;return i<=(n-e)/s?e+Math.sqrt(i*s*(n-e)):t-Math.sqrt((1-i)*s*(t-n))}static isPowerOfTwo(e){return e&&(e&e-1)===0}};var se=class r{static SUPPORTS_TYPED_ARRAYS=typeof Float32Array<"u";static arrayCopy(e,t,n,i,s){for(let o=t,l=i;o<t+s;o++,l++)n[l]=e[o]}static arrayFill(e,t,n,i){for(let s=t;s<n;s++)e[s]=i}static setArraySize(e,t,n=0){let i=e.length;if(i==t)return e;if(e.length=t,i<t)for(let s=i;s<t;s++)e[s]=n;return e}static ensureArrayCapacity(e,t,n=0){return e.length>=t?e:r.setArraySize(e,t,n)}static newArray(e,t){let n=new Array(e);for(let i=0;i<e;i++)n[i]=t;return n}static newFloatArray(e){if(r.SUPPORTS_TYPED_ARRAYS)return new Float32Array(e);{let t=new Array(e);for(let n=0;n<t.length;n++)t[n]=0;return t}}static newShortArray(e){if(r.SUPPORTS_TYPED_ARRAYS)return new Int16Array(e);{let t=new Array(e);for(let n=0;n<t.length;n++)t[n]=0;return t}}static toFloatArray(e){return r.SUPPORTS_TYPED_ARRAYS?new Float32Array(e):e}static toSinglePrecision(e){return r.SUPPORTS_TYPED_ARRAYS?Math.fround(e):e}static webkit602BugfixHelper(e,t){}static contains(e,t,n=!0){for(var i=0;i<e.length;i++)if(e[i]==t)return!0;return!1}static enumValue(e,t){return e[t[0].toUpperCase()+t.slice(1)]}};var ns=class{items=new Array;instantiator;constructor(e){this.instantiator=e}obtain(){return this.items.length>0?this.items.pop():this.instantiator()}free(e){e.reset&&e.reset(),this.items.push(e)}freeAll(e){for(let t=0;t<e.length;t++)this.free(e[t])}clear(){this.items.length=0}},hi=class{x;y;constructor(e=0,t=0){this.x=e,this.y=t}set(e,t){return this.x=e,this.y=t,this}length(){let e=this.x,t=this.y;return Math.sqrt(e*e+t*t)}normalize(){let e=this.length();return e!=0&&(this.x/=e,this.y/=e),this}};var io=class{name;constructor(e){if(!e)throw new Error("name cannot be null.");this.name=e}},Xt=class r extends io{static nextID=0;id=r.nextID++;bones=null;vertices=[];worldVerticesLength=0;timelineAttachment=this;constructor(e){super(e)}computeWorldVertices(e,t,n,i,s,o){n=s+(n>>1)*o;let l=e.bone.skeleton,a=e.deform,c=this.vertices,h=this.bones;if(!h){a.length>0&&(c=a);let p=e.bone,x=p.worldX,m=p.worldY,g=p.a,y=p.b,_=p.c,v=p.d;for(let S=t,b=s;b<n;S+=2,b+=o){let w=c[S],M=c[S+1];i[b]=w*g+M*y+x,i[b+1]=w*_+M*v+m}return}let u=0,d=0;for(let p=0;p<t;p+=2){let x=h[u];u+=x+1,d+=x}let f=l.bones;if(a.length==0)for(let p=s,x=d*3;p<n;p+=o){let m=0,g=0,y=h[u++];for(y+=u;u<y;u++,x+=3){let _=f[h[u]],v=c[x],S=c[x+1],b=c[x+2];m+=(v*_.a+S*_.b+_.worldX)*b,g+=(v*_.c+S*_.d+_.worldY)*b}i[p]=m,i[p+1]=g}else{let p=a;for(let x=s,m=d*3,g=d<<1;x<n;x+=o){let y=0,_=0,v=h[u++];for(v+=u;u<v;u++,m+=3,g+=2){let S=f[h[u]],b=c[m]+p[g],w=c[m+1]+p[g+1],M=c[m+2];y+=(b*S.a+w*S.b+S.worldX)*M,_+=(b*S.c+w*S.d+S.worldY)*M}i[x]=y,i[x+1]=_}}}copyTo(e){this.bones?(e.bones=new Array(this.bones.length),se.arrayCopy(this.bones,0,e.bones,0,this.bones.length)):e.bones=null,this.vertices&&(e.vertices=se.newFloatArray(this.vertices.length),se.arrayCopy(this.vertices,0,e.vertices,0,this.vertices.length)),e.worldVerticesLength=this.worldVerticesLength,e.timelineAttachment=this.timelineAttachment}};var _r=class r{static _nextID=0;id=r.nextID();regions;start=0;digits=0;setupIndex=0;constructor(e){this.regions=new Array(e)}copy(){let e=new r(this.regions.length);return se.arrayCopy(this.regions,0,e.regions,0,this.regions.length),e.start=this.start,e.digits=this.digits,e.setupIndex=this.setupIndex,e}apply(e,t){let n=e.sequenceIndex;n==-1&&(n=this.setupIndex),n>=this.regions.length&&(n=this.regions.length-1);let i=this.regions[n];t.region!=i&&(t.region=i,t.updateRegion())}getPath(e,t){let n=e,i=(this.start+t).toString();for(let s=this.digits-i.length;s>0;s--)n+="0";return n+=i,n}static nextID(){return r._nextID++}},Ht;(function(r){r[r.hold=0]="hold",r[r.once=1]="once",r[r.loop=2]="loop",r[r.pingpong=3]="pingpong",r[r.onceReverse=4]="onceReverse",r[r.loopReverse=5]="loopReverse",r[r.pingpongReverse=6]="pingpongReverse"})(Ht||(Ht={}));var xc=[Ht.hold,Ht.once,Ht.loop,Ht.pingpong,Ht.onceReverse,Ht.loopReverse,Ht.pingpongReverse];var is=class{name;timelines=[];timelineIds=new xr;duration;constructor(e,t,n){if(!e)throw new Error("name cannot be null.");this.name=e,this.setTimelines(t),this.duration=n}setTimelines(e){if(!e)throw new Error("timelines cannot be null.");this.timelines=e,this.timelineIds.clear();for(var t=0;t<e.length;t++)this.timelineIds.addAll(e[t].getPropertyIds())}hasTimeline(e){for(let t=0;t<e.length;t++)if(this.timelineIds.contains(e[t]))return!0;return!1}apply(e,t,n,i,s,o,l,a){if(!e)throw new Error("skeleton cannot be null.");i&&this.duration!=0&&(n%=this.duration,t>0&&(t%=this.duration));let c=this.timelines;for(let h=0,u=c.length;h<u;h++)c[h].apply(e,t,n,s,o,l,a)}},Q;(function(r){r[r.setup=0]="setup",r[r.first=1]="first",r[r.replace=2]="replace",r[r.add=3]="add"})(Q||(Q={}));var Kt;(function(r){r[r.mixIn=0]="mixIn",r[r.mixOut=1]="mixOut"})(Kt||(Kt={}));var Ye={rotate:0,x:1,y:2,scaleX:3,scaleY:4,shearX:5,shearY:6,inherit:7,rgb:8,alpha:9,rgb2:10,attachment:11,deform:12,event:13,drawOrder:14,ikConstraint:15,transformConstraint:16,pathConstraintPosition:17,pathConstraintSpacing:18,pathConstraintMix:19,physicsConstraintInertia:20,physicsConstraintStrength:21,physicsConstraintDamping:22,physicsConstraintMass:23,physicsConstraintWind:24,physicsConstraintGravity:25,physicsConstraintMix:26,physicsConstraintReset:27,sequence:28},mt=class{propertyIds;frames;constructor(e,t){this.propertyIds=t,this.frames=se.newFloatArray(e*this.getFrameEntries())}getPropertyIds(){return this.propertyIds}getFrameEntries(){return 1}getFrameCount(){return this.frames.length/this.getFrameEntries()}getDuration(){return this.frames[this.frames.length-this.getFrameEntries()]}static search1(e,t){let n=e.length;for(let i=1;i<n;i++)if(e[i]>t)return i-1;return n-1}static search(e,t,n){let i=e.length;for(let s=n;s<i;s+=n)if(e[s]>t)return s-n;return i-n}},Cn=class extends mt{curves;constructor(e,t,n){super(e,n),this.curves=se.newFloatArray(e+t*18),this.curves[e-1]=1}setLinear(e){this.curves[e]=0}setStepped(e){this.curves[e]=1}shrink(e){let t=this.getFrameCount()+e*18;if(this.curves.length>t){let n=se.newFloatArray(t);se.arrayCopy(this.curves,0,n,0,t),this.curves=n}}setBezier(e,t,n,i,s,o,l,a,c,h,u){let d=this.curves,f=this.getFrameCount()+e*18;n==0&&(d[t]=2+f);let p=(i-o*2+a)*.03,x=(s-l*2+c)*.03,m=((o-a)*3-i+h)*.006,g=((l-c)*3-s+u)*.006,y=p*2+m,_=x*2+g,v=(o-i)*.3+p+m*.16666667,S=(l-s)*.3+x+g*.16666667,b=i+v,w=s+S;for(let M=f+18;f<M;f+=2)d[f]=b,d[f+1]=w,v+=y,S+=_,y+=m,_+=g,b+=v,w+=S}getBezierValue(e,t,n,i){let s=this.curves;if(s[i]>e){let c=this.frames[t],h=this.frames[t+n];return h+(e-c)/(s[i]-c)*(s[i+1]-h)}let o=i+18;for(i+=2;i<o;i+=2)if(s[i]>=e){let c=s[i-2],h=s[i-1];return h+(e-c)/(s[i]-c)*(s[i+1]-h)}t+=this.getFrameEntries();let l=s[o-2],a=s[o-1];return a+(e-l)/(this.frames[t]-l)*(this.frames[t+n]-a)}},Sn=class extends Cn{constructor(e,t,n){super(e,t,[n])}getFrameEntries(){return 2}setFrame(e,t,n){e<<=1,this.frames[e]=t,this.frames[e+1]=n}getCurveValue(e){let t=this.frames,n=t.length-2;for(let s=2;s<=n;s+=2)if(t[s]>e){n=s-2;break}let i=this.curves[n>>1];switch(i){case 0:let s=t[n],o=t[n+1];return o+(e-s)/(t[n+2]-s)*(t[n+2+1]-o);case 1:return t[n+1]}return this.getBezierValue(e,n,1,i-2)}getRelativeValue(e,t,n,i,s){if(e<this.frames[0]){switch(n){case Q.setup:return s;case Q.first:return i+(s-i)*t}return i}let o=this.getCurveValue(e);switch(n){case Q.setup:return s+o*t;case Q.first:case Q.replace:o+=s-i}return i+o*t}getAbsoluteValue(e,t,n,i,s){if(e<this.frames[0]){switch(n){case Q.setup:return s;case Q.first:return i+(s-i)*t}return i}let o=this.getCurveValue(e);return n==Q.setup?s+(o-s)*t:i+(o-i)*t}getAbsoluteValue2(e,t,n,i,s,o){if(e<this.frames[0]){switch(n){case Q.setup:return s;case Q.first:return i+(s-i)*t}return i}return n==Q.setup?s+(o-s)*t:i+(o-i)*t}getScaleValue(e,t,n,i,s,o){let l=this.frames;if(e<l[0]){switch(n){case Q.setup:return o;case Q.first:return s+(o-s)*t}return s}let a=this.getCurveValue(e)*o;if(t==1)return n==Q.add?s+a-o:a;if(i==Kt.mixOut)switch(n){case Q.setup:return o+(Math.abs(a)*ne.signum(o)-o)*t;case Q.first:case Q.replace:return s+(Math.abs(a)*ne.signum(s)-s)*t}else{let c=0;switch(n){case Q.setup:return c=Math.abs(o)*ne.signum(a),c+(a-c)*t;case Q.first:case Q.replace:return c=Math.abs(s)*ne.signum(a),c+(a-c)*t}}return s+(a-o)*t}},so=class extends Cn{constructor(e,t,n,i){super(e,t,[n,i])}getFrameEntries(){return 3}setFrame(e,t,n,i){e*=3,this.frames[e]=t,this.frames[e+1]=n,this.frames[e+2]=i}},Pi=class extends Sn{boneIndex=0;constructor(e,t,n){super(e,t,Ye.rotate+"|"+n),this.boneIndex=n}apply(e,t,n,i,s,o,l){let a=e.bones[this.boneIndex];a.active&&(a.rotation=this.getRelativeValue(n,s,o,a.rotation,a.data.rotation))}},yr=class extends so{boneIndex=0;constructor(e,t,n){super(e,t,Ye.x+"|"+n,Ye.y+"|"+n),this.boneIndex=n}apply(e,t,n,i,s,o,l){let a=e.bones[this.boneIndex];if(!a.active)return;let c=this.frames;if(n<c[0]){switch(o){case Q.setup:a.x=a.data.x,a.y=a.data.y;return;case Q.first:a.x+=(a.data.x-a.x)*s,a.y+=(a.data.y-a.y)*s}return}let h=0,u=0,d=mt.search(c,n,3),f=this.curves[d/3];switch(f){case 0:let p=c[d];h=c[d+1],u=c[d+2];let x=(n-p)/(c[d+3]-p);h+=(c[d+3+1]-h)*x,u+=(c[d+3+2]-u)*x;break;case 1:h=c[d+1],u=c[d+2];break;default:h=this.getBezierValue(n,d,1,f-2),u=this.getBezierValue(n,d,2,f+18-2)}switch(o){case Q.setup:a.x=a.data.x+h*s,a.y=a.data.y+u*s;break;case Q.first:case Q.replace:a.x+=(a.data.x+h-a.x)*s,a.y+=(a.data.y+u-a.y)*s;break;case Q.add:a.x+=h*s,a.y+=u*s}}},vr=class extends Sn{boneIndex=0;constructor(e,t,n){super(e,t,Ye.x+"|"+n),this.boneIndex=n}apply(e,t,n,i,s,o,l){let a=e.bones[this.boneIndex];a.active&&(a.x=this.getRelativeValue(n,s,o,a.x,a.data.x))}},br=class extends Sn{boneIndex=0;constructor(e,t,n){super(e,t,Ye.y+"|"+n),this.boneIndex=n}apply(e,t,n,i,s,o,l){let a=e.bones[this.boneIndex];a.active&&(a.y=this.getRelativeValue(n,s,o,a.y,a.data.y))}},Mr=class extends so{boneIndex=0;constructor(e,t,n){super(e,t,Ye.scaleX+"|"+n,Ye.scaleY+"|"+n),this.boneIndex=n}apply(e,t,n,i,s,o,l){let a=e.bones[this.boneIndex];if(!a.active)return;let c=this.frames;if(n<c[0]){switch(o){case Q.setup:a.scaleX=a.data.scaleX,a.scaleY=a.data.scaleY;return;case Q.first:a.scaleX+=(a.data.scaleX-a.scaleX)*s,a.scaleY+=(a.data.scaleY-a.scaleY)*s}return}let h,u,d=mt.search(c,n,3),f=this.curves[d/3];switch(f){case 0:let p=c[d];h=c[d+1],u=c[d+2];let x=(n-p)/(c[d+3]-p);h+=(c[d+3+1]-h)*x,u+=(c[d+3+2]-u)*x;break;case 1:h=c[d+1],u=c[d+2];break;default:h=this.getBezierValue(n,d,1,f-2),u=this.getBezierValue(n,d,2,f+18-2)}if(h*=a.data.scaleX,u*=a.data.scaleY,s==1)o==Q.add?(a.scaleX+=h-a.data.scaleX,a.scaleY+=u-a.data.scaleY):(a.scaleX=h,a.scaleY=u);else{let p=0,x=0;if(l==Kt.mixOut)switch(o){case Q.setup:p=a.data.scaleX,x=a.data.scaleY,a.scaleX=p+(Math.abs(h)*ne.signum(p)-p)*s,a.scaleY=x+(Math.abs(u)*ne.signum(x)-x)*s;break;case Q.first:case Q.replace:p=a.scaleX,x=a.scaleY,a.scaleX=p+(Math.abs(h)*ne.signum(p)-p)*s,a.scaleY=x+(Math.abs(u)*ne.signum(x)-x)*s;break;case Q.add:a.scaleX+=(h-a.data.scaleX)*s,a.scaleY+=(u-a.data.scaleY)*s}else switch(o){case Q.setup:p=Math.abs(a.data.scaleX)*ne.signum(h),x=Math.abs(a.data.scaleY)*ne.signum(u),a.scaleX=p+(h-p)*s,a.scaleY=x+(u-x)*s;break;case Q.first:case Q.replace:p=Math.abs(a.scaleX)*ne.signum(h),x=Math.abs(a.scaleY)*ne.signum(u),a.scaleX=p+(h-p)*s,a.scaleY=x+(u-x)*s;break;case Q.add:a.scaleX+=(h-a.data.scaleX)*s,a.scaleY+=(u-a.data.scaleY)*s}}}},Sr=class extends Sn{boneIndex=0;constructor(e,t,n){super(e,t,Ye.scaleX+"|"+n),this.boneIndex=n}apply(e,t,n,i,s,o,l){let a=e.bones[this.boneIndex];a.active&&(a.scaleX=this.getScaleValue(n,s,o,l,a.scaleX,a.data.scaleX))}},wr=class extends Sn{boneIndex=0;constructor(e,t,n){super(e,t,Ye.scaleY+"|"+n),this.boneIndex=n}apply(e,t,n,i,s,o,l){let a=e.bones[this.boneIndex];a.active&&(a.scaleY=this.getScaleValue(n,s,o,l,a.scaleY,a.data.scaleY))}},Tr=class extends so{boneIndex=0;constructor(e,t,n){super(e,t,Ye.shearX+"|"+n,Ye.shearY+"|"+n),this.boneIndex=n}apply(e,t,n,i,s,o,l){let a=e.bones[this.boneIndex];if(!a.active)return;let c=this.frames;if(n<c[0]){switch(o){case Q.setup:a.shearX=a.data.shearX,a.shearY=a.data.shearY;return;case Q.first:a.shearX+=(a.data.shearX-a.shearX)*s,a.shearY+=(a.data.shearY-a.shearY)*s}return}let h=0,u=0,d=mt.search(c,n,3),f=this.curves[d/3];switch(f){case 0:let p=c[d];h=c[d+1],u=c[d+2];let x=(n-p)/(c[d+3]-p);h+=(c[d+3+1]-h)*x,u+=(c[d+3+2]-u)*x;break;case 1:h=c[d+1],u=c[d+2];break;default:h=this.getBezierValue(n,d,1,f-2),u=this.getBezierValue(n,d,2,f+18-2)}switch(o){case Q.setup:a.shearX=a.data.shearX+h*s,a.shearY=a.data.shearY+u*s;break;case Q.first:case Q.replace:a.shearX+=(a.data.shearX+h-a.shearX)*s,a.shearY+=(a.data.shearY+u-a.shearY)*s;break;case Q.add:a.shearX+=h*s,a.shearY+=u*s}}},Ar=class extends Sn{boneIndex=0;constructor(e,t,n){super(e,t,Ye.shearX+"|"+n),this.boneIndex=n}apply(e,t,n,i,s,o,l){let a=e.bones[this.boneIndex];a.active&&(a.shearX=this.getRelativeValue(n,s,o,a.shearX,a.data.shearX))}},Er=class extends Sn{boneIndex=0;constructor(e,t,n){super(e,t,Ye.shearY+"|"+n),this.boneIndex=n}apply(e,t,n,i,s,o,l){let a=e.bones[this.boneIndex];a.active&&(a.shearY=this.getRelativeValue(n,s,o,a.shearY,a.data.shearY))}},Rr=class extends mt{boneIndex=0;constructor(e,t){super(e,[Ye.inherit+"|"+t]),this.boneIndex=t}getFrameEntries(){return 2}setFrame(e,t,n){e*=2,this.frames[e]=t,this.frames[e+1]=n}apply(e,t,n,i,s,o,l){let a=e.bones[this.boneIndex];if(!a.active)return;if(l==Kt.mixOut){o==Q.setup&&(a.inherit=a.data.inherit);return}let c=this.frames;if(n<c[0]){(o==Q.setup||o==Q.first)&&(a.inherit=a.data.inherit);return}a.inherit=this.frames[mt.search(c,n,2)+1]}},Cr=class extends Cn{slotIndex=0;constructor(e,t,n){super(e,t,[Ye.rgb+"|"+n,Ye.alpha+"|"+n]),this.slotIndex=n}getFrameEntries(){return 5}setFrame(e,t,n,i,s,o){e*=5,this.frames[e]=t,this.frames[e+1]=n,this.frames[e+2]=i,this.frames[e+3]=s,this.frames[e+4]=o}apply(e,t,n,i,s,o,l){let a=e.slots[this.slotIndex];if(!a.bone.active)return;let c=this.frames,h=a.color;if(n<c[0]){let g=a.data.color;switch(o){case Q.setup:h.setFromColor(g);return;case Q.first:h.add((g.r-h.r)*s,(g.g-h.g)*s,(g.b-h.b)*s,(g.a-h.a)*s)}return}let u=0,d=0,f=0,p=0,x=mt.search(c,n,5),m=this.curves[x/5];switch(m){case 0:let g=c[x];u=c[x+1],d=c[x+2],f=c[x+3],p=c[x+4];let y=(n-g)/(c[x+5]-g);u+=(c[x+5+1]-u)*y,d+=(c[x+5+2]-d)*y,f+=(c[x+5+3]-f)*y,p+=(c[x+5+4]-p)*y;break;case 1:u=c[x+1],d=c[x+2],f=c[x+3],p=c[x+4];break;default:u=this.getBezierValue(n,x,1,m-2),d=this.getBezierValue(n,x,2,m+18-2),f=this.getBezierValue(n,x,3,m+36-2),p=this.getBezierValue(n,x,4,m+54-2)}s==1?h.set(u,d,f,p):(o==Q.setup&&h.setFromColor(a.data.color),h.add((u-h.r)*s,(d-h.g)*s,(f-h.b)*s,(p-h.a)*s))}},Ir=class extends Cn{slotIndex=0;constructor(e,t,n){super(e,t,[Ye.rgb+"|"+n]),this.slotIndex=n}getFrameEntries(){return 4}setFrame(e,t,n,i,s){e<<=2,this.frames[e]=t,this.frames[e+1]=n,this.frames[e+2]=i,this.frames[e+3]=s}apply(e,t,n,i,s,o,l){let a=e.slots[this.slotIndex];if(!a.bone.active)return;let c=this.frames,h=a.color;if(n<c[0]){let m=a.data.color;switch(o){case Q.setup:h.r=m.r,h.g=m.g,h.b=m.b;return;case Q.first:h.r+=(m.r-h.r)*s,h.g+=(m.g-h.g)*s,h.b+=(m.b-h.b)*s}return}let u=0,d=0,f=0,p=mt.search(c,n,4),x=this.curves[p>>2];switch(x){case 0:let m=c[p];u=c[p+1],d=c[p+2],f=c[p+3];let g=(n-m)/(c[p+4]-m);u+=(c[p+4+1]-u)*g,d+=(c[p+4+2]-d)*g,f+=(c[p+4+3]-f)*g;break;case 1:u=c[p+1],d=c[p+2],f=c[p+3];break;default:u=this.getBezierValue(n,p,1,x-2),d=this.getBezierValue(n,p,2,x+18-2),f=this.getBezierValue(n,p,3,x+36-2)}if(s==1)h.r=u,h.g=d,h.b=f;else{if(o==Q.setup){let m=a.data.color;h.r=m.r,h.g=m.g,h.b=m.b}h.r+=(u-h.r)*s,h.g+=(d-h.g)*s,h.b+=(f-h.b)*s}}},Pr=class extends Sn{slotIndex=0;constructor(e,t,n){super(e,t,Ye.alpha+"|"+n),this.slotIndex=n}apply(e,t,n,i,s,o,l){let a=e.slots[this.slotIndex];if(!a.bone.active)return;let c=a.color;if(n<this.frames[0]){let u=a.data.color;switch(o){case Q.setup:c.a=u.a;return;case Q.first:c.a+=(u.a-c.a)*s}return}let h=this.getCurveValue(n);s==1?c.a=h:(o==Q.setup&&(c.a=a.data.color.a),c.a+=(h-c.a)*s)}},Lr=class extends Cn{slotIndex=0;constructor(e,t,n){super(e,t,[Ye.rgb+"|"+n,Ye.alpha+"|"+n,Ye.rgb2+"|"+n]),this.slotIndex=n}getFrameEntries(){return 8}setFrame(e,t,n,i,s,o,l,a,c){e<<=3,this.frames[e]=t,this.frames[e+1]=n,this.frames[e+2]=i,this.frames[e+3]=s,this.frames[e+4]=o,this.frames[e+5]=l,this.frames[e+6]=a,this.frames[e+7]=c}apply(e,t,n,i,s,o,l){let a=e.slots[this.slotIndex];if(!a.bone.active)return;let c=this.frames,h=a.color,u=a.darkColor;if(n<c[0]){let S=a.data.color,b=a.data.darkColor;switch(o){case Q.setup:h.setFromColor(S),u.r=b.r,u.g=b.g,u.b=b.b;return;case Q.first:h.add((S.r-h.r)*s,(S.g-h.g)*s,(S.b-h.b)*s,(S.a-h.a)*s),u.r+=(b.r-u.r)*s,u.g+=(b.g-u.g)*s,u.b+=(b.b-u.b)*s}return}let d=0,f=0,p=0,x=0,m=0,g=0,y=0,_=mt.search(c,n,8),v=this.curves[_>>3];switch(v){case 0:let S=c[_];d=c[_+1],f=c[_+2],p=c[_+3],x=c[_+4],m=c[_+5],g=c[_+6],y=c[_+7];let b=(n-S)/(c[_+8]-S);d+=(c[_+8+1]-d)*b,f+=(c[_+8+2]-f)*b,p+=(c[_+8+3]-p)*b,x+=(c[_+8+4]-x)*b,m+=(c[_+8+5]-m)*b,g+=(c[_+8+6]-g)*b,y+=(c[_+8+7]-y)*b;break;case 1:d=c[_+1],f=c[_+2],p=c[_+3],x=c[_+4],m=c[_+5],g=c[_+6],y=c[_+7];break;default:d=this.getBezierValue(n,_,1,v-2),f=this.getBezierValue(n,_,2,v+18-2),p=this.getBezierValue(n,_,3,v+36-2),x=this.getBezierValue(n,_,4,v+54-2),m=this.getBezierValue(n,_,5,v+72-2),g=this.getBezierValue(n,_,6,v+90-2),y=this.getBezierValue(n,_,7,v+108-2)}if(s==1)h.set(d,f,p,x),u.r=m,u.g=g,u.b=y;else{if(o==Q.setup){h.setFromColor(a.data.color);let S=a.data.darkColor;u.r=S.r,u.g=S.g,u.b=S.b}h.add((d-h.r)*s,(f-h.g)*s,(p-h.b)*s,(x-h.a)*s),u.r+=(m-u.r)*s,u.g+=(g-u.g)*s,u.b+=(y-u.b)*s}}},Nr=class extends Cn{slotIndex=0;constructor(e,t,n){super(e,t,[Ye.rgb+"|"+n,Ye.rgb2+"|"+n]),this.slotIndex=n}getFrameEntries(){return 7}setFrame(e,t,n,i,s,o,l,a){e*=7,this.frames[e]=t,this.frames[e+1]=n,this.frames[e+2]=i,this.frames[e+3]=s,this.frames[e+4]=o,this.frames[e+5]=l,this.frames[e+6]=a}apply(e,t,n,i,s,o,l){let a=e.slots[this.slotIndex];if(!a.bone.active)return;let c=this.frames,h=a.color,u=a.darkColor;if(n<c[0]){let S=a.data.color,b=a.data.darkColor;switch(o){case Q.setup:h.r=S.r,h.g=S.g,h.b=S.b,u.r=b.r,u.g=b.g,u.b=b.b;return;case Q.first:h.r+=(S.r-h.r)*s,h.g+=(S.g-h.g)*s,h.b+=(S.b-h.b)*s,u.r+=(b.r-u.r)*s,u.g+=(b.g-u.g)*s,u.b+=(b.b-u.b)*s}return}let d=0,f=0,p=0,x=0,m=0,g=0,y=0,_=mt.search(c,n,7),v=this.curves[_/7];switch(v){case 0:let S=c[_];d=c[_+1],f=c[_+2],p=c[_+3],m=c[_+4],g=c[_+5],y=c[_+6];let b=(n-S)/(c[_+7]-S);d+=(c[_+7+1]-d)*b,f+=(c[_+7+2]-f)*b,p+=(c[_+7+3]-p)*b,m+=(c[_+7+4]-m)*b,g+=(c[_+7+5]-g)*b,y+=(c[_+7+6]-y)*b;break;case 1:d=c[_+1],f=c[_+2],p=c[_+3],m=c[_+4],g=c[_+5],y=c[_+6];break;default:d=this.getBezierValue(n,_,1,v-2),f=this.getBezierValue(n,_,2,v+18-2),p=this.getBezierValue(n,_,3,v+36-2),m=this.getBezierValue(n,_,4,v+54-2),g=this.getBezierValue(n,_,5,v+72-2),y=this.getBezierValue(n,_,6,v+90-2)}if(s==1)h.r=d,h.g=f,h.b=p,u.r=m,u.g=g,u.b=y;else{if(o==Q.setup){let S=a.data.color,b=a.data.darkColor;h.r=S.r,h.g=S.g,h.b=S.b,u.r=b.r,u.g=b.g,u.b=b.b}h.r+=(d-h.r)*s,h.g+=(f-h.g)*s,h.b+=(p-h.b)*s,u.r+=(m-u.r)*s,u.g+=(g-u.g)*s,u.b+=(y-u.b)*s}}},Gn=class extends mt{slotIndex=0;attachmentNames;constructor(e,t){super(e,[Ye.attachment+"|"+t]),this.slotIndex=t,this.attachmentNames=new Array(e)}getFrameCount(){return this.frames.length}setFrame(e,t,n){this.frames[e]=t,this.attachmentNames[e]=n}apply(e,t,n,i,s,o,l){let a=e.slots[this.slotIndex];if(a.bone.active){if(l==Kt.mixOut){o==Q.setup&&this.setAttachment(e,a,a.data.attachmentName);return}if(n<this.frames[0]){(o==Q.setup||o==Q.first)&&this.setAttachment(e,a,a.data.attachmentName);return}this.setAttachment(e,a,this.attachmentNames[mt.search1(this.frames,n)])}}setAttachment(e,t,n){t.setAttachment(n?e.getAttachment(this.slotIndex,n):null)}},Fr=class extends Cn{slotIndex=0;attachment;vertices;constructor(e,t,n,i){super(e,t,[Ye.deform+"|"+n+"|"+i.id]),this.slotIndex=n,this.attachment=i,this.vertices=new Array(e)}getFrameCount(){return this.frames.length}setFrame(e,t,n){this.frames[e]=t,this.vertices[e]=n}setBezier(e,t,n,i,s,o,l,a,c,h,u){let d=this.curves,f=this.getFrameCount()+e*18;n==0&&(d[t]=2+f);let p=(i-o*2+a)*.03,x=c*.03-l*.06,m=((o-a)*3-i+h)*.006,g=(l-c+.33333333)*.018,y=p*2+m,_=x*2+g,v=(o-i)*.3+p+m*.16666667,S=l*.3+x+g*.16666667,b=i+v,w=S;for(let M=f+18;f<M;f+=2)d[f]=b,d[f+1]=w,v+=y,S+=_,y+=m,_+=g,b+=v,w+=S}getCurvePercent(e,t){let n=this.curves,i=n[t];switch(i){case 0:let a=this.frames[t];return(e-a)/(this.frames[t+this.getFrameEntries()]-a);case 1:return 0}if(i-=2,n[i]>e){let a=this.frames[t];return n[i+1]*(e-a)/(n[i]-a)}let s=i+18;for(i+=2;i<s;i+=2)if(n[i]>=e){let a=n[i-2],c=n[i-1];return c+(e-a)/(n[i]-a)*(n[i+1]-c)}let o=n[s-2],l=n[s-1];return l+(1-l)*(e-o)/(this.frames[t+this.getFrameEntries()]-o)}apply(e,t,n,i,s,o,l){let a=e.slots[this.slotIndex];if(!a.bone.active)return;let c=a.getAttachment();if(!c||!(c instanceof Xt)||c.timelineAttachment!=this.attachment)return;let h=a.deform;h.length==0&&(o=Q.setup);let u=this.vertices,d=u[0].length,f=this.frames;if(n<f[0]){switch(o){case Q.setup:h.length=0;return;case Q.first:if(s==1){h.length=0;return}h.length=d;let _=c;if(_.bones){s=1-s;for(var p=0;p<d;p++)h[p]*=s}else{let v=_.vertices;for(var p=0;p<d;p++)h[p]+=(v[p]-h[p])*s}}return}if(h.length=d,n>=f[f.length-1]){let _=u[f.length-1];if(s==1)if(o==Q.add){let v=c;if(v.bones)for(let S=0;S<d;S++)h[S]+=_[S];else{let S=v.vertices;for(let b=0;b<d;b++)h[b]+=_[b]-S[b]}}else se.arrayCopy(_,0,h,0,d);else switch(o){case Q.setup:{let S=c;if(S.bones)for(let b=0;b<d;b++)h[b]=_[b]*s;else{let b=S.vertices;for(let w=0;w<d;w++){let M=b[w];h[w]=M+(_[w]-M)*s}}break}case Q.first:case Q.replace:for(let S=0;S<d;S++)h[S]+=(_[S]-h[S])*s;break;case Q.add:let v=c;if(v.bones)for(let S=0;S<d;S++)h[S]+=_[S]*s;else{let S=v.vertices;for(let b=0;b<d;b++)h[b]+=(_[b]-S[b])*s}}return}let x=mt.search1(f,n),m=this.getCurvePercent(n,x),g=u[x],y=u[x+1];if(s==1)if(o==Q.add){let _=c;if(_.bones)for(let v=0;v<d;v++){let S=g[v];h[v]+=S+(y[v]-S)*m}else{let v=_.vertices;for(let S=0;S<d;S++){let b=g[S];h[S]+=b+(y[S]-b)*m-v[S]}}}else for(let _=0;_<d;_++){let v=g[_];h[_]=v+(y[_]-v)*m}else switch(o){case Q.setup:{let v=c;if(v.bones)for(let S=0;S<d;S++){let b=g[S];h[S]=(b+(y[S]-b)*m)*s}else{let S=v.vertices;for(let b=0;b<d;b++){let w=g[b],M=S[b];h[b]=M+(w+(y[b]-w)*m-M)*s}}break}case Q.first:case Q.replace:for(let v=0;v<d;v++){let S=g[v];h[v]+=(S+(y[v]-S)*m-h[v])*s}break;case Q.add:let _=c;if(_.bones)for(let v=0;v<d;v++){let S=g[v];h[v]+=(S+(y[v]-S)*m)*s}else{let v=_.vertices;for(let S=0;S<d;S++){let b=g[S];h[S]+=(b+(y[S]-b)*m-v[S])*s}}}}},ss=class r extends mt{static propertyIds=[""+Ye.event];events;constructor(e){super(e,r.propertyIds),this.events=new Array(e)}getFrameCount(){return this.frames.length}setFrame(e,t){this.frames[e]=t.time,this.events[e]=t}apply(e,t,n,i,s,o,l){if(!i)return;let a=this.frames,c=this.frames.length;if(t>n)this.apply(e,t,Number.MAX_VALUE,i,s,o,l),t=-1;else if(t>=a[c-1])return;if(n<a[0])return;let h=0;if(t<a[0])h=0;else{h=mt.search1(a,t)+1;let u=a[h];for(;h>0&&a[h-1]==u;)h--}for(;h<c&&n>=a[h];h++)i.push(this.events[h])}},ui=class r extends mt{static propertyIds=[""+Ye.drawOrder];drawOrders;constructor(e){super(e,r.propertyIds),this.drawOrders=new Array(e)}getFrameCount(){return this.frames.length}setFrame(e,t,n){this.frames[e]=t,this.drawOrders[e]=n}apply(e,t,n,i,s,o,l){if(l==Kt.mixOut){o==Q.setup&&se.arrayCopy(e.slots,0,e.drawOrder,0,e.slots.length);return}if(n<this.frames[0]){(o==Q.setup||o==Q.first)&&se.arrayCopy(e.slots,0,e.drawOrder,0,e.slots.length);return}let a=mt.search1(this.frames,n),c=this.drawOrders[a];if(!c)se.arrayCopy(e.slots,0,e.drawOrder,0,e.slots.length);else{let h=e.drawOrder,u=e.slots;for(let d=0,f=c.length;d<f;d++)h[d]=u[c[d]]}}},Dr=class extends Cn{constraintIndex=0;constructor(e,t,n){super(e,t,[Ye.ikConstraint+"|"+n]),this.constraintIndex=n}getFrameEntries(){return 6}setFrame(e,t,n,i,s,o,l){e*=6,this.frames[e]=t,this.frames[e+1]=n,this.frames[e+2]=i,this.frames[e+3]=s,this.frames[e+4]=o?1:0,this.frames[e+5]=l?1:0}apply(e,t,n,i,s,o,l){let a=e.ikConstraints[this.constraintIndex];if(!a.active)return;let c=this.frames;if(n<c[0]){switch(o){case Q.setup:a.mix=a.data.mix,a.softness=a.data.softness,a.bendDirection=a.data.bendDirection,a.compress=a.data.compress,a.stretch=a.data.stretch;return;case Q.first:a.mix+=(a.data.mix-a.mix)*s,a.softness+=(a.data.softness-a.softness)*s,a.bendDirection=a.data.bendDirection,a.compress=a.data.compress,a.stretch=a.data.stretch}return}let h=0,u=0,d=mt.search(c,n,6),f=this.curves[d/6];switch(f){case 0:let p=c[d];h=c[d+1],u=c[d+2];let x=(n-p)/(c[d+6]-p);h+=(c[d+6+1]-h)*x,u+=(c[d+6+2]-u)*x;break;case 1:h=c[d+1],u=c[d+2];break;default:h=this.getBezierValue(n,d,1,f-2),u=this.getBezierValue(n,d,2,f+18-2)}o==Q.setup?(a.mix=a.data.mix+(h-a.data.mix)*s,a.softness=a.data.softness+(u-a.data.softness)*s,l==Kt.mixOut?(a.bendDirection=a.data.bendDirection,a.compress=a.data.compress,a.stretch=a.data.stretch):(a.bendDirection=c[d+3],a.compress=c[d+4]!=0,a.stretch=c[d+5]!=0)):(a.mix+=(h-a.mix)*s,a.softness+=(u-a.softness)*s,l==Kt.mixIn&&(a.bendDirection=c[d+3],a.compress=c[d+4]!=0,a.stretch=c[d+5]!=0))}},Ur=class extends Cn{constraintIndex=0;constructor(e,t,n){super(e,t,[Ye.transformConstraint+"|"+n]),this.constraintIndex=n}getFrameEntries(){return 7}setFrame(e,t,n,i,s,o,l,a){let c=this.frames;e*=7,c[e]=t,c[e+1]=n,c[e+2]=i,c[e+3]=s,c[e+4]=o,c[e+5]=l,c[e+6]=a}apply(e,t,n,i,s,o,l){let a=e.transformConstraints[this.constraintIndex];if(!a.active)return;let c=this.frames;if(n<c[0]){let y=a.data;switch(o){case Q.setup:a.mixRotate=y.mixRotate,a.mixX=y.mixX,a.mixY=y.mixY,a.mixScaleX=y.mixScaleX,a.mixScaleY=y.mixScaleY,a.mixShearY=y.mixShearY;return;case Q.first:a.mixRotate+=(y.mixRotate-a.mixRotate)*s,a.mixX+=(y.mixX-a.mixX)*s,a.mixY+=(y.mixY-a.mixY)*s,a.mixScaleX+=(y.mixScaleX-a.mixScaleX)*s,a.mixScaleY+=(y.mixScaleY-a.mixScaleY)*s,a.mixShearY+=(y.mixShearY-a.mixShearY)*s}return}let h,u,d,f,p,x,m=mt.search(c,n,7),g=this.curves[m/7];switch(g){case 0:let y=c[m];h=c[m+1],u=c[m+2],d=c[m+3],f=c[m+4],p=c[m+5],x=c[m+6];let _=(n-y)/(c[m+7]-y);h+=(c[m+7+1]-h)*_,u+=(c[m+7+2]-u)*_,d+=(c[m+7+3]-d)*_,f+=(c[m+7+4]-f)*_,p+=(c[m+7+5]-p)*_,x+=(c[m+7+6]-x)*_;break;case 1:h=c[m+1],u=c[m+2],d=c[m+3],f=c[m+4],p=c[m+5],x=c[m+6];break;default:h=this.getBezierValue(n,m,1,g-2),u=this.getBezierValue(n,m,2,g+18-2),d=this.getBezierValue(n,m,3,g+36-2),f=this.getBezierValue(n,m,4,g+54-2),p=this.getBezierValue(n,m,5,g+72-2),x=this.getBezierValue(n,m,6,g+90-2)}if(o==Q.setup){let y=a.data;a.mixRotate=y.mixRotate+(h-y.mixRotate)*s,a.mixX=y.mixX+(u-y.mixX)*s,a.mixY=y.mixY+(d-y.mixY)*s,a.mixScaleX=y.mixScaleX+(f-y.mixScaleX)*s,a.mixScaleY=y.mixScaleY+(p-y.mixScaleY)*s,a.mixShearY=y.mixShearY+(x-y.mixShearY)*s}else a.mixRotate+=(h-a.mixRotate)*s,a.mixX+=(u-a.mixX)*s,a.mixY+=(d-a.mixY)*s,a.mixScaleX+=(f-a.mixScaleX)*s,a.mixScaleY+=(p-a.mixScaleY)*s,a.mixShearY+=(x-a.mixShearY)*s}},Or=class extends Sn{constraintIndex=0;constructor(e,t,n){super(e,t,Ye.pathConstraintPosition+"|"+n),this.constraintIndex=n}apply(e,t,n,i,s,o,l){let a=e.pathConstraints[this.constraintIndex];a.active&&(a.position=this.getAbsoluteValue(n,s,o,a.position,a.data.position))}},Br=class extends Sn{constraintIndex=0;constructor(e,t,n){super(e,t,Ye.pathConstraintSpacing+"|"+n),this.constraintIndex=n}apply(e,t,n,i,s,o,l){let a=e.pathConstraints[this.constraintIndex];a.active&&(a.spacing=this.getAbsoluteValue(n,s,o,a.spacing,a.data.spacing))}},kr=class extends Cn{constraintIndex=0;constructor(e,t,n){super(e,t,[Ye.pathConstraintMix+"|"+n]),this.constraintIndex=n}getFrameEntries(){return 4}setFrame(e,t,n,i,s){let o=this.frames;e<<=2,o[e]=t,o[e+1]=n,o[e+2]=i,o[e+3]=s}apply(e,t,n,i,s,o,l){let a=e.pathConstraints[this.constraintIndex];if(!a.active)return;let c=this.frames;if(n<c[0]){switch(o){case Q.setup:a.mixRotate=a.data.mixRotate,a.mixX=a.data.mixX,a.mixY=a.data.mixY;return;case Q.first:a.mixRotate+=(a.data.mixRotate-a.mixRotate)*s,a.mixX+=(a.data.mixX-a.mixX)*s,a.mixY+=(a.data.mixY-a.mixY)*s}return}let h,u,d,f=mt.search(c,n,4),p=this.curves[f>>2];switch(p){case 0:let x=c[f];h=c[f+1],u=c[f+2],d=c[f+3];let m=(n-x)/(c[f+4]-x);h+=(c[f+4+1]-h)*m,u+=(c[f+4+2]-u)*m,d+=(c[f+4+3]-d)*m;break;case 1:h=c[f+1],u=c[f+2],d=c[f+3];break;default:h=this.getBezierValue(n,f,1,p-2),u=this.getBezierValue(n,f,2,p+18-2),d=this.getBezierValue(n,f,3,p+36-2)}if(o==Q.setup){let x=a.data;a.mixRotate=x.mixRotate+(h-x.mixRotate)*s,a.mixX=x.mixX+(u-x.mixX)*s,a.mixY=x.mixY+(d-x.mixY)*s}else a.mixRotate+=(h-a.mixRotate)*s,a.mixX+=(u-a.mixX)*s,a.mixY+=(d-a.mixY)*s}},Li=class extends Sn{constraintIndex=0;constructor(e,t,n,i){super(e,t,i+"|"+n),this.constraintIndex=n}apply(e,t,n,i,s,o,l){let a;if(this.constraintIndex==-1){let c=n>=this.frames[0]?this.getCurveValue(n):0;for(let h of e.physicsConstraints)h.active&&this.global(h.data)&&this.set(h,this.getAbsoluteValue2(n,s,o,this.get(h),this.setup(h),c))}else a=e.physicsConstraints[this.constraintIndex],a.active&&this.set(a,this.getAbsoluteValue(n,s,o,this.get(a),this.setup(a)))}},Vr=class extends Li{constructor(e,t,n){super(e,t,n,Ye.physicsConstraintInertia)}setup(e){return e.data.inertia}get(e){return e.inertia}set(e,t){e.inertia=t}global(e){return e.inertiaGlobal}},zr=class extends Li{constructor(e,t,n){super(e,t,n,Ye.physicsConstraintStrength)}setup(e){return e.data.strength}get(e){return e.strength}set(e,t){e.strength=t}global(e){return e.strengthGlobal}},Hr=class extends Li{constructor(e,t,n){super(e,t,n,Ye.physicsConstraintDamping)}setup(e){return e.data.damping}get(e){return e.damping}set(e,t){e.damping=t}global(e){return e.dampingGlobal}},Gr=class extends Li{constructor(e,t,n){super(e,t,n,Ye.physicsConstraintMass)}setup(e){return 1/e.data.massInverse}get(e){return 1/e.massInverse}set(e,t){e.massInverse=1/t}global(e){return e.massGlobal}},Wr=class extends Li{constructor(e,t,n){super(e,t,n,Ye.physicsConstraintWind)}setup(e){return e.data.wind}get(e){return e.wind}set(e,t){e.wind=t}global(e){return e.windGlobal}},Xr=class extends Li{constructor(e,t,n){super(e,t,n,Ye.physicsConstraintGravity)}setup(e){return e.data.gravity}get(e){return e.gravity}set(e,t){e.gravity=t}global(e){return e.gravityGlobal}},Yr=class extends Li{constructor(e,t,n){super(e,t,n,Ye.physicsConstraintMix)}setup(e){return e.data.mix}get(e){return e.mix}set(e,t){e.mix=t}global(e){return e.mixGlobal}},qr=class r extends mt{static propertyIds=[Ye.physicsConstraintReset.toString()];constraintIndex;constructor(e,t){super(e,r.propertyIds),this.constraintIndex=t}getFrameCount(){return this.frames.length}setFrame(e,t){this.frames[e]=t}apply(e,t,n,i,s,o,l){let a;if(this.constraintIndex!=-1&&(a=e.physicsConstraints[this.constraintIndex],!a.active))return;let c=this.frames;if(t>n)this.apply(e,t,Number.MAX_VALUE,[],s,o,l),t=-1;else if(t>=c[c.length-1])return;if(!(n<c[0])&&(t<c[0]||n>=c[mt.search1(c,t)+1]))if(a!=null)a.reset();else for(let h of e.physicsConstraints)h.active&&h.reset()}},$r=class r extends mt{static ENTRIES=3;static MODE=1;static DELAY=2;slotIndex;attachment;constructor(e,t,n){super(e,[Ye.sequence+"|"+t+"|"+n.sequence.id]),this.slotIndex=t,this.attachment=n}getFrameEntries(){return r.ENTRIES}getSlotIndex(){return this.slotIndex}getAttachment(){return this.attachment}setFrame(e,t,n,i,s){let o=this.frames;e*=r.ENTRIES,o[e]=t,o[e+r.MODE]=n|i<<4,o[e+r.DELAY]=s}apply(e,t,n,i,s,o,l){let a=e.slots[this.slotIndex];if(!a.bone.active)return;let c=a.attachment,h=this.attachment;if(c!=h&&(!(c instanceof Xt)||c.timelineAttachment!=h))return;if(l==Kt.mixOut){o==Q.setup&&(a.sequenceIndex=-1);return}let u=this.frames;if(n<u[0]){(o==Q.setup||o==Q.first)&&(a.sequenceIndex=-1);return}let d=mt.search(u,n,r.ENTRIES),f=u[d],p=u[d+r.MODE],x=u[d+r.DELAY];if(!this.attachment.sequence)return;let m=p>>4,g=this.attachment.sequence.regions.length,y=xc[p&15];if(y!=Ht.hold)switch(m+=(n-f)/x+1e-5|0,y){case Ht.once:m=Math.min(g-1,m);break;case Ht.loop:m%=g;break;case Ht.pingpong:{let _=(g<<1)-2;m=_==0?0:m%_,m>=g&&(m=_-m);break}case Ht.onceReverse:m=Math.max(g-1-m,0);break;case Ht.loopReverse:m=g-1-m%g;break;case Ht.pingpongReverse:{let _=(g<<1)-2;m=_==0?0:(m+g-1)%_,m>=g&&(m=_-m)}}a.sequenceIndex=m}};var _c=class r{static _emptyAnimation=new is("<empty>",[],0);static emptyAnimation(){return r._emptyAnimation}data;tracks=new Array;timeScale=1;unkeyedState=0;events=new Array;listeners=new Array;queue=new Qu(this);propertyIDs=new xr;animationsChanged=!1;trackEntryPool=new ns(()=>new ju);constructor(e){this.data=e}update(e){e*=this.timeScale;let t=this.tracks;for(let n=0,i=t.length;n<i;n++){let s=t[n];if(!s)continue;s.animationLast=s.nextAnimationLast,s.trackLast=s.nextTrackLast;let o=e*s.timeScale;if(s.delay>0){if(s.delay-=o,s.delay>0)continue;o=-s.delay,s.delay=0}let l=s.next;if(l){let a=s.trackLast-l.delay;if(a>=0){for(l.delay=0,l.trackTime+=s.timeScale==0?0:(a/s.timeScale+e)*l.timeScale,s.trackTime+=o,this.setCurrent(n,l,!0);l.mixingFrom;)l.mixTime+=e,l=l.mixingFrom;continue}}else if(s.trackLast>=s.trackEnd&&!s.mixingFrom){t[n]=null,this.queue.end(s),this.clearNext(s);continue}if(s.mixingFrom&&this.updateMixingFrom(s,e)){let a=s.mixingFrom;for(s.mixingFrom=null,a&&(a.mixingTo=null);a;)this.queue.end(a),a=a.mixingFrom}s.trackTime+=o}this.queue.drain()}updateMixingFrom(e,t){let n=e.mixingFrom;if(!n)return!0;let i=this.updateMixingFrom(n,t);return n.animationLast=n.nextAnimationLast,n.trackLast=n.nextTrackLast,e.nextTrackLast!=-1&&e.mixTime>=e.mixDuration?((n.totalAlpha==0||e.mixDuration==0)&&(e.mixingFrom=n.mixingFrom,n.mixingFrom!=null&&(n.mixingFrom.mixingTo=e),e.interruptAlpha=n.interruptAlpha,this.queue.end(n)),i):(n.trackTime+=t*n.timeScale,e.mixTime+=t,!1)}apply(e){if(!e)throw new Error("skeleton cannot be null.");this.animationsChanged&&this._animationsChanged();let t=this.events,n=this.tracks,i=!1;for(let d=0,f=n.length;d<f;d++){let p=n[d];if(!p||p.delay>0)continue;i=!0;let x=d==0?Q.first:p.mixBlend,m=p.alpha;p.mixingFrom?m*=this.applyMixingFrom(p,e,x):p.trackTime>=p.trackEnd&&!p.next&&(m=0);let g=m>=p.alphaAttachmentThreshold,y=p.animationLast,_=p.getAnimationTime(),v=_,S=t;p.reverse&&(v=p.animation.duration-v,S=null);let b=p.animation.timelines,w=b.length;if(d==0&&m==1||x==Q.add){d==0&&(g=!0);for(let M=0;M<w;M++){se.webkit602BugfixHelper(m,x);var s=b[M];s instanceof Gn?this.applyAttachmentTimeline(s,e,v,x,g):s.apply(e,y,v,S,m,x,Kt.mixIn)}}else{let M=p.timelineMode,A=p.shortestRotation,C=!A&&p.timelinesRotation.length!=w<<1;C&&(p.timelinesRotation.length=w<<1);for(let E=0;E<w;E++){let N=b[E],F=M[E]==Zu?x:Q.setup;!A&&N instanceof Pi?this.applyRotateTimeline(N,e,v,m,F,p.timelinesRotation,E<<1,C):N instanceof Gn?this.applyAttachmentTimeline(N,e,v,x,g):(se.webkit602BugfixHelper(m,x),N.apply(e,y,v,S,m,F,Kt.mixIn))}}this.queueEvents(p,_),t.length=0,p.nextAnimationLast=_,p.nextTrackLast=p.trackTime}for(var o=this.unkeyedState+Up,l=e.slots,a=0,c=e.slots.length;a<c;a++){var h=l[a];if(h.attachmentState==o){var u=h.data.attachmentName;h.setAttachment(u?e.getAttachment(h.data.index,u):null)}}return this.unkeyedState+=2,this.queue.drain(),i}applyMixingFrom(e,t,n){let i=e.mixingFrom;i.mixingFrom&&this.applyMixingFrom(i,t,n);let s=0;e.mixDuration==0?(s=1,n==Q.first&&(n=Q.setup)):(s=e.mixTime/e.mixDuration,s>1&&(s=1),n!=Q.first&&(n=i.mixBlend));let o=s<i.mixAttachmentThreshold,l=s<i.mixDrawOrderThreshold,a=i.animation.timelines,c=a.length,h=i.alpha*e.interruptAlpha,u=h*(1-s),d=i.animationLast,f=i.getAnimationTime(),p=f,x=null;if(i.reverse?p=i.animation.duration-p:s<i.eventThreshold&&(x=this.events),n==Q.add)for(let m=0;m<c;m++)a[m].apply(t,d,p,x,u,n,Kt.mixOut);else{let m=i.timelineMode,g=i.timelineHoldMix,y=i.shortestRotation,_=!y&&i.timelinesRotation.length!=c<<1;_&&(i.timelinesRotation.length=c<<1),i.totalAlpha=0;for(let v=0;v<c;v++){let S=a[v],b=Kt.mixOut,w,M=0;switch(m[v]){case Zu:if(!l&&S instanceof ui)continue;w=n,M=u;break;case Fp:w=Q.setup,M=u;break;case Dp:w=n,M=h;break;case Ju:w=Q.setup,M=h;break;default:w=Q.setup;let A=g[v];M=h*Math.max(0,1-A.mixTime/A.mixDuration);break}i.totalAlpha+=M,!y&&S instanceof Pi?this.applyRotateTimeline(S,t,p,M,w,i.timelinesRotation,v<<1,_):S instanceof Gn?this.applyAttachmentTimeline(S,t,p,w,o&&M>=i.alphaAttachmentThreshold):(se.webkit602BugfixHelper(M,n),l&&S instanceof ui&&w==Q.setup&&(b=Kt.mixIn),S.apply(t,d,p,x,M,w,b))}}return e.mixDuration>0&&this.queueEvents(i,f),this.events.length=0,i.nextAnimationLast=f,i.nextTrackLast=i.trackTime,s}applyAttachmentTimeline(e,t,n,i,s){var o=t.slots[e.slotIndex];o.bone.active&&(n<e.frames[0]?(i==Q.setup||i==Q.first)&&this.setAttachment(t,o,o.data.attachmentName,s):this.setAttachment(t,o,e.attachmentNames[mt.search1(e.frames,n)],s),o.attachmentState<=this.unkeyedState&&(o.attachmentState=this.unkeyedState+Up))}setAttachment(e,t,n,i){t.setAttachment(n?e.getAttachment(t.data.index,n):null),i&&(t.attachmentState=this.unkeyedState+rv)}applyRotateTimeline(e,t,n,i,s,o,l,a){if(a&&(o[l]=0),i==1){e.apply(t,0,n,null,1,s,Kt.mixIn);return}let c=t.bones[e.boneIndex];if(!c.active)return;let h=e.frames,u=0,d=0;if(n<h[0])switch(s){case Q.setup:c.rotation=c.data.rotation;default:return;case Q.first:u=c.rotation,d=c.data.rotation}else u=s==Q.setup?c.data.rotation:c.rotation,d=c.data.rotation+e.getCurveValue(n);let f=0,p=d-u;if(p-=Math.ceil(p/360-.5)*360,p==0)f=o[l];else{let x=0,m=0;a?(x=0,m=p):(x=o[l],m=o[l+1]);let g=x-x%360;f=p+g;let y=p>=0,_=x>=0;Math.abs(m)<=90&&ne.signum(m)!=ne.signum(p)&&(Math.abs(x-g)>180?(f+=360*ne.signum(x),_=y):g!=0?f-=360*ne.signum(x):_=y),_!=y&&(f+=360*ne.signum(x)),o[l]=f}o[l+1]=p,c.rotation=u+f*i}queueEvents(e,t){let n=e.animationStart,i=e.animationEnd,s=i-n,o=e.trackLast%s,l=this.events,a=0,c=l.length;for(;a<c;a++){let u=l[a];if(u.time<o)break;u.time>i||this.queue.event(e,u)}let h=!1;if(e.loop)if(s==0)h=!0;else{let u=Math.floor(e.trackTime/s);h=u>0&&u>Math.floor(e.trackLast/s)}else h=t>=i&&e.animationLast<i;for(h&&this.queue.complete(e);a<c;a++){let u=l[a];u.time<n||this.queue.event(e,u)}}clearTracks(){let e=this.queue.drainDisabled;this.queue.drainDisabled=!0;for(let t=0,n=this.tracks.length;t<n;t++)this.clearTrack(t);this.tracks.length=0,this.queue.drainDisabled=e,this.queue.drain()}clearTrack(e){if(e>=this.tracks.length)return;let t=this.tracks[e];if(!t)return;this.queue.end(t),this.clearNext(t);let n=t;for(;;){let i=n.mixingFrom;if(!i)break;this.queue.end(i),n.mixingFrom=null,n.mixingTo=null,n=i}this.tracks[t.trackIndex]=null,this.queue.drain()}setCurrent(e,t,n){let i=this.expandToIndex(e);this.tracks[e]=t,t.previous=null,i&&(n&&this.queue.interrupt(i),t.mixingFrom=i,i.mixingTo=t,t.mixTime=0,i.mixingFrom&&i.mixDuration>0&&(t.interruptAlpha*=Math.min(1,i.mixTime/i.mixDuration)),i.timelinesRotation.length=0),this.queue.start(t)}setAnimation(e,t,n=!1){let i=this.data.skeletonData.findAnimation(t);if(!i)throw new Error("Animation not found: "+t);return this.setAnimationWith(e,i,n)}setAnimationWith(e,t,n=!1){if(!t)throw new Error("animation cannot be null.");let i=!0,s=this.expandToIndex(e);s&&(s.nextTrackLast==-1?(this.tracks[e]=s.mixingFrom,this.queue.interrupt(s),this.queue.end(s),this.clearNext(s),s=s.mixingFrom,i=!1):this.clearNext(s));let o=this.trackEntry(e,t,n,s);return this.setCurrent(e,o,i),this.queue.drain(),o}addAnimation(e,t,n=!1,i=0){let s=this.data.skeletonData.findAnimation(t);if(!s)throw new Error("Animation not found: "+t);return this.addAnimationWith(e,s,n,i)}addAnimationWith(e,t,n=!1,i=0){if(!t)throw new Error("animation cannot be null.");let s=this.expandToIndex(e);if(s)for(;s.next;)s=s.next;let o=this.trackEntry(e,t,n,s);return s?(s.next=o,o.previous=s,i<=0&&(i=Math.max(i+s.getTrackComplete()-o.mixDuration,0))):(this.setCurrent(e,o,!0),this.queue.drain(),i<0&&(i=0)),o.delay=i,o}setEmptyAnimation(e,t=0){let n=this.setAnimationWith(e,r.emptyAnimation(),!1);return n.mixDuration=t,n.trackEnd=t,n}addEmptyAnimation(e,t=0,n=0){let i=this.addAnimationWith(e,r.emptyAnimation(),!1,n);return n<=0&&(i.delay=Math.max(i.delay+i.mixDuration-t,0)),i.mixDuration=t,i.trackEnd=t,i}setEmptyAnimations(e=0){let t=this.queue.drainDisabled;this.queue.drainDisabled=!0;for(let n=0,i=this.tracks.length;n<i;n++){let s=this.tracks[n];s&&this.setEmptyAnimation(s.trackIndex,e)}this.queue.drainDisabled=t,this.queue.drain()}expandToIndex(e){return e<this.tracks.length?this.tracks[e]:(se.ensureArrayCapacity(this.tracks,e+1,null),this.tracks.length=e+1,null)}trackEntry(e,t,n,i){let s=this.trackEntryPool.obtain();return s.reset(),s.trackIndex=e,s.animation=t,s.loop=n,s.holdPrevious=!1,s.reverse=!1,s.shortestRotation=!1,s.eventThreshold=0,s.alphaAttachmentThreshold=0,s.mixAttachmentThreshold=0,s.mixDrawOrderThreshold=0,s.animationStart=0,s.animationEnd=t.duration,s.animationLast=-1,s.nextAnimationLast=-1,s.delay=0,s.trackTime=0,s.trackLast=-1,s.nextTrackLast=-1,s.trackEnd=Number.MAX_VALUE,s.timeScale=1,s.alpha=1,s.mixTime=0,s.mixDuration=i?this.data.getMix(i.animation,t):0,s.interruptAlpha=1,s.totalAlpha=0,s.mixBlend=Q.replace,s}clearNext(e){let t=e.next;for(;t;)this.queue.dispose(t),t=t.next;e.next=null}_animationsChanged(){this.animationsChanged=!1,this.propertyIDs.clear();let e=this.tracks;for(let t=0,n=e.length;t<n;t++){let i=e[t];if(i){for(;i.mixingFrom;)i=i.mixingFrom;do(!i.mixingTo||i.mixBlend!=Q.add)&&this.computeHold(i),i=i.mixingTo;while(i)}}}computeHold(e){let t=e.mixingTo,n=e.animation.timelines,i=e.animation.timelines.length,s=e.timelineMode;s.length=i;let o=e.timelineHoldMix;o.length=0;let l=this.propertyIDs;if(t&&t.holdPrevious){for(let a=0;a<i;a++)s[a]=l.addAll(n[a].getPropertyIds())?Ju:Dp;return}e:for(let a=0;a<i;a++){let c=n[a],h=c.getPropertyIds();if(!l.addAll(h))s[a]=Zu;else if(!t||c instanceof Gn||c instanceof ui||c instanceof ss||!t.animation.hasTimeline(h))s[a]=Fp;else{for(let u=t.mixingTo;u;u=u.mixingTo)if(!u.animation.hasTimeline(h)){if(e.mixDuration>0){s[a]=sv,o[a]=u;continue e}break}s[a]=Ju}}}getCurrent(e){return e>=this.tracks.length?null:this.tracks[e]}addListener(e){if(!e)throw new Error("listener cannot be null.");this.listeners.push(e)}removeListener(e){let t=this.listeners.indexOf(e);t>=0&&this.listeners.splice(t,1)}clearListeners(){this.listeners.length=0}clearListenerNotifications(){this.queue.clear()}},ju=class{animation=null;previous=null;next=null;mixingFrom=null;mixingTo=null;listener=null;trackIndex=0;loop=!1;holdPrevious=!1;reverse=!1;shortestRotation=!1;eventThreshold=0;mixAttachmentThreshold=0;alphaAttachmentThreshold=0;mixDrawOrderThreshold=0;animationStart=0;animationEnd=0;animationLast=0;nextAnimationLast=0;delay=0;trackTime=0;trackLast=0;nextTrackLast=0;trackEnd=0;timeScale=0;alpha=0;mixTime=0;_mixDuration=0;interruptAlpha=0;totalAlpha=0;get mixDuration(){return this._mixDuration}set mixDuration(e){this._mixDuration=e}setMixDurationWithDelay(e,t){this._mixDuration=e,t<=0&&(this.previous!=null?t=Math.max(t+this.previous.getTrackComplete()-e,0):t=0),this.delay=t}mixBlend=Q.replace;timelineMode=new Array;timelineHoldMix=new Array;timelinesRotation=new Array;reset(){this.next=null,this.previous=null,this.mixingFrom=null,this.mixingTo=null,this.animation=null,this.listener=null,this.timelineMode.length=0,this.timelineHoldMix.length=0,this.timelinesRotation.length=0}getAnimationTime(){if(this.loop){let e=this.animationEnd-this.animationStart;return e==0?this.animationStart:this.trackTime%e+this.animationStart}return Math.min(this.trackTime+this.animationStart,this.animationEnd)}setAnimationLast(e){this.animationLast=e,this.nextAnimationLast=e}isComplete(){return this.trackTime>=this.animationEnd-this.animationStart}resetRotationDirections(){this.timelinesRotation.length=0}getTrackComplete(){let e=this.animationEnd-this.animationStart;if(e!=0){if(this.loop)return e*(1+(this.trackTime/e|0));if(this.trackTime<e)return e}return this.trackTime}wasApplied(){return this.nextTrackLast!=-1}isNextReady(){return this.next!=null&&this.nextTrackLast-this.next.delay>=0}},Qu=class{objects=[];drainDisabled=!1;animState;constructor(e){this.animState=e}start(e){this.objects.push(mn.start),this.objects.push(e),this.animState.animationsChanged=!0}interrupt(e){this.objects.push(mn.interrupt),this.objects.push(e)}end(e){this.objects.push(mn.end),this.objects.push(e),this.animState.animationsChanged=!0}dispose(e){this.objects.push(mn.dispose),this.objects.push(e)}complete(e){this.objects.push(mn.complete),this.objects.push(e)}event(e,t){this.objects.push(mn.event),this.objects.push(e),this.objects.push(t)}drain(){if(this.drainDisabled)return;this.drainDisabled=!0;let e=this.objects;for(let t=0;t<e.length;t+=2){let n=e[t],i=e[t+1],s=this.animState.listeners.slice();switch(n){case mn.start:i.listener&&i.listener.start&&i.listener.start(i);for(let l=0;l<s.length;l++){let a=s[l];a.start&&a.start(i)}break;case mn.interrupt:i.listener&&i.listener.interrupt&&i.listener.interrupt(i);for(let l=0;l<s.length;l++){let a=s[l];a.interrupt&&a.interrupt(i)}break;case mn.end:i.listener&&i.listener.end&&i.listener.end(i);for(let l=0;l<s.length;l++){let a=s[l];a.end&&a.end(i)}case mn.dispose:i.listener&&i.listener.dispose&&i.listener.dispose(i);for(let l=0;l<s.length;l++){let a=s[l];a.dispose&&a.dispose(i)}this.animState.trackEntryPool.free(i);break;case mn.complete:i.listener&&i.listener.complete&&i.listener.complete(i);for(let l=0;l<s.length;l++){let a=s[l];a.complete&&a.complete(i)}break;case mn.event:let o=e[t+++2];i.listener&&i.listener.event&&i.listener.event(i,o);for(let l=0;l<s.length;l++){let a=s[l];a.event&&a.event(i,o)}break}}this.clear(),this.drainDisabled=!1}clear(){this.objects.length=0}},mn;(function(r){r[r.start=0]="start",r[r.interrupt=1]="interrupt",r[r.end=2]="end",r[r.dispose=3]="dispose",r[r.complete=4]="complete",r[r.event=5]="event"})(mn||(mn={}));var Zu=0,Fp=1,Dp=2,Ju=3,sv=4,Up=1,rv=2;var yc=class{skeletonData;animationToMixTime={};defaultMix=0;constructor(e){if(!e)throw new Error("skeletonData cannot be null.");this.skeletonData=e}setMix(e,t,n){let i=this.skeletonData.findAnimation(e);if(!i)throw new Error("Animation not found: "+e);let s=this.skeletonData.findAnimation(t);if(!s)throw new Error("Animation not found: "+t);this.setMixWith(i,s,n)}setMixWith(e,t,n){if(!e)throw new Error("from cannot be null.");if(!t)throw new Error("to cannot be null.");let i=e.name+"."+t.name;this.animationToMixTime[i]=n}getMix(e,t){let n=e.name+"."+t.name,i=this.animationToMixTime[n];return i===void 0?this.defaultMix:i}};var ro=class r extends Xt{color=new Pe(1,1,1,1);constructor(e){super(e)}copy(){let e=new r(this.name);return this.copyTo(e),e.color.setFromColor(this.color),e}};var di=class r extends Xt{endSlot=null;color=new Pe(.2275,.2275,.8078,1);constructor(e){super(e)}copy(){let e=new r(this.name);return this.copyTo(e),e.endSlot=this.endSlot,e.color.setFromColor(this.color),e}};var vc=class{_image;constructor(e){this._image=e}getImage(){return this._image}},kt;(function(r){r[r.Nearest=9728]="Nearest",r[r.Linear=9729]="Linear",r[r.MipMap=9987]="MipMap",r[r.MipMapNearestNearest=9984]="MipMapNearestNearest",r[r.MipMapLinearNearest=9985]="MipMapLinearNearest",r[r.MipMapNearestLinear=9986]="MipMapNearestLinear",r[r.MipMapLinearLinear=9987]="MipMapLinearLinear"})(kt||(kt={}));var Wn;(function(r){r[r.MirroredRepeat=33648]="MirroredRepeat",r[r.ClampToEdge=33071]="ClampToEdge",r[r.Repeat=10497]="Repeat"})(Wn||(Wn={}));var bc=class{texture;u=0;v=0;u2=0;v2=0;width=0;height=0;degrees=0;offsetX=0;offsetY=0;originalWidth=0;originalHeight=0};var ao=class{pages=new Array;regions=new Array;constructor(e){let t=new ed(e),n=new Array(4),i={};i.size=h=>{h.width=parseInt(n[1]),h.height=parseInt(n[2])},i.format=()=>{},i.filter=h=>{h.minFilter=se.enumValue(kt,n[1]),h.magFilter=se.enumValue(kt,n[2])},i.repeat=h=>{n[1].indexOf("x")!=-1&&(h.uWrap=Wn.Repeat),n[1].indexOf("y")!=-1&&(h.vWrap=Wn.Repeat)},i.pma=h=>{h.pma=n[1]=="true"};var s={};s.xy=h=>{h.x=parseInt(n[1]),h.y=parseInt(n[2])},s.size=h=>{h.width=parseInt(n[1]),h.height=parseInt(n[2])},s.bounds=h=>{h.x=parseInt(n[1]),h.y=parseInt(n[2]),h.width=parseInt(n[3]),h.height=parseInt(n[4])},s.offset=h=>{h.offsetX=parseInt(n[1]),h.offsetY=parseInt(n[2])},s.orig=h=>{h.originalWidth=parseInt(n[1]),h.originalHeight=parseInt(n[2])},s.offsets=h=>{h.offsetX=parseInt(n[1]),h.offsetY=parseInt(n[2]),h.originalWidth=parseInt(n[3]),h.originalHeight=parseInt(n[4])},s.rotate=h=>{let u=n[1];u=="true"?h.degrees=90:u!="false"&&(h.degrees=parseInt(u))},s.index=h=>{h.index=parseInt(n[1])};let o=t.readLine();for(;o&&o.trim().length==0;)o=t.readLine();for(;!(!o||o.trim().length==0||t.readEntry(n,o)==0);)o=t.readLine();let l=null,a=null,c=null;for(;o!==null;)if(o.trim().length==0)l=null,o=t.readLine();else if(l){let h=new oo(l,o);for(;;){let u=t.readEntry(n,o=t.readLine());if(u==0)break;let d=s[n[0]];if(d)d(h);else{a||(a=[]),c||(c=[]),a.push(n[0]);let f=[];for(let p=0;p<u;p++)f.push(parseInt(n[p+1]));c.push(f)}}h.originalWidth==0&&h.originalHeight==0&&(h.originalWidth=h.width,h.originalHeight=h.height),a&&a.length>0&&c&&c.length>0&&(h.names=a,h.values=c,a=null,c=null),h.u=h.x/l.width,h.v=h.y/l.height,h.degrees==90?(h.u2=(h.x+h.height)/l.width,h.v2=(h.y+h.width)/l.height):(h.u2=(h.x+h.width)/l.width,h.v2=(h.y+h.height)/l.height),this.regions.push(h)}else{for(l=new td(o.trim());t.readEntry(n,o=t.readLine())!=0;){let h=i[n[0]];h&&h(l)}this.pages.push(l)}}findRegion(e){for(let t=0;t<this.regions.length;t++)if(this.regions[t].name==e)return this.regions[t];return null}setTextures(e,t=""){for(let n of this.pages)n.setTexture(e.get(t+n.name))}dispose(){for(let e=0;e<this.pages.length;e++)this.pages[e].texture?.dispose()}},ed=class{lines;index=0;constructor(e){this.lines=e.split(/\r\n|\r|\n/)}readLine(){return this.index>=this.lines.length?null:this.lines[this.index++]}readEntry(e,t){if(!t||(t=t.trim(),t.length==0))return 0;let n=t.indexOf(":");if(n==-1)return 0;e[0]=t.substr(0,n).trim();for(let i=1,s=n+1;;i++){let o=t.indexOf(",",s);if(o==-1)return e[i]=t.substr(s).trim(),i;if(e[i]=t.substr(s,o-s).trim(),s=o+1,i==4)return 4}}},td=class{name;minFilter=kt.Nearest;magFilter=kt.Nearest;uWrap=Wn.ClampToEdge;vWrap=Wn.ClampToEdge;texture=null;width=0;height=0;pma=!1;regions=new Array;constructor(e){this.name=e}setTexture(e){this.texture=e,e.setFilters(this.minFilter,this.magFilter),e.setWraps(this.uWrap,this.vWrap);for(let t of this.regions)t.texture=e}},oo=class extends bc{page;name;x=0;y=0;offsetX=0;offsetY=0;originalWidth=0;originalHeight=0;index=0;degrees=0;names=null;values=null;constructor(e,t){super(),this.page=e,this.name=t,e.regions.push(this)}};var fi=class r extends Xt{region=null;path;regionUVs=[];uvs=[];triangles=[];color=new Pe(1,1,1,1);width=0;height=0;hullLength=0;edges=[];parentMesh=null;sequence=null;tempColor=new Pe(0,0,0,0);constructor(e,t){super(e),this.path=t}updateRegion(){if(!this.region)throw new Error("Region not set.");let e=this.regionUVs;(!this.uvs||this.uvs.length!=e.length)&&(this.uvs=se.newFloatArray(e.length));let t=this.uvs,n=this.uvs.length,i=this.region.u,s=this.region.v,o=0,l=0;if(this.region instanceof oo){let a=this.region,c=a.page,h=c.width,u=c.height;switch(a.degrees){case 90:i-=(a.originalHeight-a.offsetY-a.height)/h,s-=(a.originalWidth-a.offsetX-a.width)/u,o=a.originalHeight/h,l=a.originalWidth/u;for(let d=0;d<n;d+=2)t[d]=i+e[d+1]*o,t[d+1]=s+(1-e[d])*l;return;case 180:i-=(a.originalWidth-a.offsetX-a.width)/h,s-=a.offsetY/u,o=a.originalWidth/h,l=a.originalHeight/u;for(let d=0;d<n;d+=2)t[d]=i+(1-e[d])*o,t[d+1]=s+(1-e[d+1])*l;return;case 270:i-=a.offsetY/h,s-=a.offsetX/u,o=a.originalHeight/h,l=a.originalWidth/u;for(let d=0;d<n;d+=2)t[d]=i+(1-e[d+1])*o,t[d+1]=s+e[d]*l;return}i-=a.offsetX/h,s-=(a.originalHeight-a.offsetY-a.height)/u,o=a.originalWidth/h,l=a.originalHeight/u}else this.region?(o=this.region.u2-i,l=this.region.v2-s):(i=s=0,o=l=1);for(let a=0;a<n;a+=2)t[a]=i+e[a]*o,t[a+1]=s+e[a+1]*l}getParentMesh(){return this.parentMesh}setParentMesh(e){this.parentMesh=e,e&&(this.bones=e.bones,this.vertices=e.vertices,this.worldVerticesLength=e.worldVerticesLength,this.regionUVs=e.regionUVs,this.triangles=e.triangles,this.hullLength=e.hullLength,this.worldVerticesLength=e.worldVerticesLength)}copy(){if(this.parentMesh)return this.newLinkedMesh();let e=new r(this.name,this.path);return e.region=this.region,e.color.setFromColor(this.color),this.copyTo(e),e.regionUVs=new Array(this.regionUVs.length),se.arrayCopy(this.regionUVs,0,e.regionUVs,0,this.regionUVs.length),e.uvs=this.uvs instanceof Float32Array?se.newFloatArray(this.uvs.length):new Array(this.uvs.length),se.arrayCopy(this.uvs,0,e.uvs,0,this.uvs.length),e.triangles=new Array(this.triangles.length),se.arrayCopy(this.triangles,0,e.triangles,0,this.triangles.length),e.hullLength=this.hullLength,e.sequence=this.sequence!=null?this.sequence.copy():null,this.edges&&(e.edges=new Array(this.edges.length),se.arrayCopy(this.edges,0,e.edges,0,this.edges.length)),e.width=this.width,e.height=this.height,e}computeWorldVertices(e,t,n,i,s,o){this.sequence!=null&&this.sequence.apply(e,this),super.computeWorldVertices(e,t,n,i,s,o)}newLinkedMesh(){let e=new r(this.name,this.path);return e.region=this.region,e.color.setFromColor(this.color),e.timelineAttachment=this.timelineAttachment,e.setParentMesh(this.parentMesh?this.parentMesh:this),e.region!=null&&e.updateRegion(),e}};var Ni=class r extends Xt{lengths=[];closed=!1;constantSpeed=!1;color=new Pe(1,1,1,1);constructor(e){super(e)}copy(){let e=new r(this.name);return this.copyTo(e),e.lengths=new Array(this.lengths.length),se.arrayCopy(this.lengths,0,e.lengths,0,this.lengths.length),e.closed=closed,e.constantSpeed=this.constantSpeed,e.color.setFromColor(this.color),e}};var Mc=class r extends Xt{x=0;y=0;rotation=0;color=new Pe(.38,.94,0,1);constructor(e){super(e)}computeWorldPosition(e,t){return t.x=this.x*e.a+this.y*e.b+e.worldX,t.y=this.x*e.c+this.y*e.d+e.worldY,t}computeWorldRotation(e){let t=this.rotation*ne.degRad,n=Math.cos(t),i=Math.sin(t),s=n*e.a+i*e.b,o=n*e.c+i*e.d;return ne.atan2Deg(o,s)}copy(){let e=new r(this.name);return e.x=this.x,e.y=this.y,e.rotation=this.rotation,e.color.setFromColor(this.color),e}};var rs=class r extends io{x=0;y=0;scaleX=1;scaleY=1;rotation=0;width=0;height=0;color=new Pe(1,1,1,1);path;region=null;sequence=null;offset=se.newFloatArray(8);uvs=se.newFloatArray(8);tempColor=new Pe(1,1,1,1);constructor(e,t){super(e),this.path=t}updateRegion(){if(!this.region)throw new Error("Region not set.");let e=this.region,t=this.uvs;if(e==null){t[0]=0,t[1]=0,t[2]=0,t[3]=1,t[4]=1,t[5]=1,t[6]=1,t[7]=0;return}let n=this.width/this.region.originalWidth*this.scaleX,i=this.height/this.region.originalHeight*this.scaleY,s=-this.width/2*this.scaleX+this.region.offsetX*n,o=-this.height/2*this.scaleY+this.region.offsetY*i,l=s+this.region.width*n,a=o+this.region.height*i,c=this.rotation*ne.degRad,h=Math.cos(c),u=Math.sin(c),d=this.x,f=this.y,p=s*h+d,x=s*u,m=o*h+f,g=o*u,y=l*h+d,_=l*u,v=a*h+f,S=a*u,b=this.offset;b[0]=p-g,b[1]=m+x,b[2]=p-S,b[3]=v+x,b[4]=y-S,b[5]=v+_,b[6]=y-g,b[7]=m+_,e.degrees==90?(t[0]=e.u2,t[1]=e.v2,t[2]=e.u,t[3]=e.v2,t[4]=e.u,t[5]=e.v,t[6]=e.u2,t[7]=e.v):(t[0]=e.u,t[1]=e.v2,t[2]=e.u,t[3]=e.v,t[4]=e.u2,t[5]=e.v,t[6]=e.u2,t[7]=e.v2)}computeWorldVertices(e,t,n,i){this.sequence!=null&&this.sequence.apply(e,this);let s=e.bone,o=this.offset,l=s.worldX,a=s.worldY,c=s.a,h=s.b,u=s.c,d=s.d,f=0,p=0;f=o[0],p=o[1],t[n]=f*c+p*h+l,t[n+1]=f*u+p*d+a,n+=i,f=o[2],p=o[3],t[n]=f*c+p*h+l,t[n+1]=f*u+p*d+a,n+=i,f=o[4],p=o[5],t[n]=f*c+p*h+l,t[n+1]=f*u+p*d+a,n+=i,f=o[6],p=o[7],t[n]=f*c+p*h+l,t[n+1]=f*u+p*d+a}copy(){let e=new r(this.name,this.path);return e.region=this.region,e.x=this.x,e.y=this.y,e.scaleX=this.scaleX,e.scaleY=this.scaleY,e.rotation=this.rotation,e.width=this.width,e.height=this.height,se.arrayCopy(this.uvs,0,e.uvs,0,8),se.arrayCopy(this.offset,0,e.offset,0,8),e.color.setFromColor(this.color),e.sequence=this.sequence!=null?this.sequence.copy():null,e}static X1=0;static Y1=1;static C1R=2;static C1G=3;static C1B=4;static C1A=5;static U1=6;static V1=7;static X2=8;static Y2=9;static C2R=10;static C2G=11;static C2B=12;static C2A=13;static U2=14;static V2=15;static X3=16;static Y3=17;static C3R=18;static C3G=19;static C3B=20;static C3A=21;static U3=22;static V3=23;static X4=24;static Y4=25;static C4R=26;static C4G=27;static C4B=28;static C4A=29;static U4=30;static V4=31};var Sc=class{atlas;constructor(e){this.atlas=e}loadSequence(e,t,n){let i=n.regions;for(let s=0,o=i.length;s<o;s++){let l=n.getPath(t,s),a=this.atlas.findRegion(l);if(a==null)throw new Error("Region not found in atlas: "+l+" (sequence: "+e+")");i[s]=a}}newRegionAttachment(e,t,n,i){let s=new rs(t,n);if(i!=null)this.loadSequence(t,n,i);else{let o=this.atlas.findRegion(n);if(!o)throw new Error("Region not found in atlas: "+n+" (region attachment: "+t+")");s.region=o}return s}newMeshAttachment(e,t,n,i){let s=new fi(t,n);if(i!=null)this.loadSequence(t,n,i);else{let o=this.atlas.findRegion(n);if(!o)throw new Error("Region not found in atlas: "+n+" (mesh attachment: "+t+")");s.region=o}return s}newBoundingBoxAttachment(e,t){return new ro(t)}newPathAttachment(e,t){return new Ni(t)}newPointAttachment(e,t){return new Mc(t)}newClippingAttachment(e,t){return new di(t)}};var Kr=class{index=0;name;parent=null;length=0;x=0;y=0;rotation=0;scaleX=1;scaleY=1;shearX=0;shearY=0;inherit=St.Normal;skinRequired=!1;color=new Pe;icon;visible=!1;constructor(e,t,n){if(e<0)throw new Error("index must be >= 0.");if(!t)throw new Error("name cannot be null.");this.index=e,this.name=t,this.parent=n}},St;(function(r){r[r.Normal=0]="Normal",r[r.OnlyTranslation=1]="OnlyTranslation",r[r.NoRotationOrReflection=2]="NoRotationOrReflection",r[r.NoScale=3]="NoScale",r[r.NoScaleOrReflection=4]="NoScaleOrReflection"})(St||(St={}));var lo=class{data;skeleton;parent=null;children=new Array;x=0;y=0;rotation=0;scaleX=0;scaleY=0;shearX=0;shearY=0;ax=0;ay=0;arotation=0;ascaleX=0;ascaleY=0;ashearX=0;ashearY=0;a=0;b=0;c=0;d=0;worldY=0;worldX=0;inherit=St.Normal;sorted=!1;active=!1;constructor(e,t,n){if(!e)throw new Error("data cannot be null.");if(!t)throw new Error("skeleton cannot be null.");this.data=e,this.skeleton=t,this.parent=n,this.setToSetupPose()}isActive(){return this.active}update(e){this.updateWorldTransformWith(this.ax,this.ay,this.arotation,this.ascaleX,this.ascaleY,this.ashearX,this.ashearY)}updateWorldTransform(){this.updateWorldTransformWith(this.x,this.y,this.rotation,this.scaleX,this.scaleY,this.shearX,this.shearY)}updateWorldTransformWith(e,t,n,i,s,o,l){this.ax=e,this.ay=t,this.arotation=n,this.ascaleX=i,this.ascaleY=s,this.ashearX=o,this.ashearY=l;let a=this.parent;if(!a){let f=this.skeleton,p=f.scaleX,x=f.scaleY,m=(n+o)*ne.degRad,g=(n+90+l)*ne.degRad;this.a=Math.cos(m)*i*p,this.b=Math.cos(g)*s*p,this.c=Math.sin(m)*i*x,this.d=Math.sin(g)*s*x,this.worldX=e*p+f.x,this.worldY=t*x+f.y;return}let c=a.a,h=a.b,u=a.c,d=a.d;switch(this.worldX=c*e+h*t+a.worldX,this.worldY=u*e+d*t+a.worldY,this.inherit){case St.Normal:{let f=(n+o)*ne.degRad,p=(n+90+l)*ne.degRad,x=Math.cos(f)*i,m=Math.cos(p)*s,g=Math.sin(f)*i,y=Math.sin(p)*s;this.a=c*x+h*g,this.b=c*m+h*y,this.c=u*x+d*g,this.d=u*m+d*y;return}case St.OnlyTranslation:{let f=(n+o)*ne.degRad,p=(n+90+l)*ne.degRad;this.a=Math.cos(f)*i,this.b=Math.cos(p)*s,this.c=Math.sin(f)*i,this.d=Math.sin(p)*s;break}case St.NoRotationOrReflection:{let f=1/this.skeleton.scaleX,p=1/this.skeleton.scaleY;c*=f,u*=p;let x=c*c+u*u,m=0;x>1e-4?(x=Math.abs(c*d*p-h*f*u)/x,h=u*x,d=c*x,m=Math.atan2(u,c)*ne.radDeg):(c=0,u=0,m=90-Math.atan2(d,h)*ne.radDeg);let g=(n+o-m)*ne.degRad,y=(n+l-m+90)*ne.degRad,_=Math.cos(g)*i,v=Math.cos(y)*s,S=Math.sin(g)*i,b=Math.sin(y)*s;this.a=c*_-h*S,this.b=c*v-h*b,this.c=u*_+d*S,this.d=u*v+d*b;break}case St.NoScale:case St.NoScaleOrReflection:{n*=ne.degRad;let f=Math.cos(n),p=Math.sin(n),x=(c*f+h*p)/this.skeleton.scaleX,m=(u*f+d*p)/this.skeleton.scaleY,g=Math.sqrt(x*x+m*m);g>1e-5&&(g=1/g),x*=g,m*=g,g=Math.sqrt(x*x+m*m),this.inherit==St.NoScale&&c*d-h*u<0!=(this.skeleton.scaleX<0!=this.skeleton.scaleY<0)&&(g=-g),n=Math.PI/2+Math.atan2(m,x);let y=Math.cos(n)*g,_=Math.sin(n)*g;o*=ne.degRad,l=(90+l)*ne.degRad;let v=Math.cos(o)*i,S=Math.cos(l)*s,b=Math.sin(o)*i,w=Math.sin(l)*s;this.a=x*v+y*b,this.b=x*S+y*w,this.c=m*v+_*b,this.d=m*S+_*w;break}}this.a*=this.skeleton.scaleX,this.b*=this.skeleton.scaleX,this.c*=this.skeleton.scaleY,this.d*=this.skeleton.scaleY}setToSetupPose(){let e=this.data;this.x=e.x,this.y=e.y,this.rotation=e.rotation,this.scaleX=e.scaleX,this.scaleY=e.scaleY,this.shearX=e.shearX,this.shearY=e.shearY,this.inherit=e.inherit}updateAppliedTransform(){let e=this.parent;if(!e){this.ax=this.worldX-this.skeleton.x,this.ay=this.worldY-this.skeleton.y,this.arotation=Math.atan2(this.c,this.a)*ne.radDeg,this.ascaleX=Math.sqrt(this.a*this.a+this.c*this.c),this.ascaleY=Math.sqrt(this.b*this.b+this.d*this.d),this.ashearX=0,this.ashearY=Math.atan2(this.a*this.b+this.c*this.d,this.a*this.d-this.b*this.c)*ne.radDeg;return}let t=e.a,n=e.b,i=e.c,s=e.d,o=1/(t*s-n*i),l=s*o,a=n*o,c=i*o,h=t*o,u=this.worldX-e.worldX,d=this.worldY-e.worldY;this.ax=u*l-d*a,this.ay=d*h-u*c;let f,p,x,m;if(this.inherit==St.OnlyTranslation)f=this.a,p=this.b,x=this.c,m=this.d;else{switch(this.inherit){case St.NoRotationOrReflection:{let S=Math.abs(t*s-n*i)/(t*t+i*i);n=-i*this.skeleton.scaleX*S/this.skeleton.scaleY,s=t*this.skeleton.scaleY*S/this.skeleton.scaleX,o=1/(t*s-n*i),l=s*o,a=n*o;break}case St.NoScale:case St.NoScaleOrReflection:let g=ne.cosDeg(this.rotation),y=ne.sinDeg(this.rotation);t=(t*g+n*y)/this.skeleton.scaleX,i=(i*g+s*y)/this.skeleton.scaleY;let _=Math.sqrt(t*t+i*i);_>1e-5&&(_=1/_),t*=_,i*=_,_=Math.sqrt(t*t+i*i),this.inherit==St.NoScale&&o<0!=(this.skeleton.scaleX<0!=this.skeleton.scaleY<0)&&(_=-_);let v=ne.PI/2+Math.atan2(i,t);n=Math.cos(v)*_,s=Math.sin(v)*_,o=1/(t*s-n*i),l=s*o,a=n*o,c=i*o,h=t*o}f=l*this.a-a*this.c,p=l*this.b-a*this.d,x=h*this.c-c*this.a,m=h*this.d-c*this.b}if(this.ashearX=0,this.ascaleX=Math.sqrt(f*f+x*x),this.ascaleX>1e-4){let g=f*m-p*x;this.ascaleY=g/this.ascaleX,this.ashearY=-Math.atan2(f*p+x*m,g)*ne.radDeg,this.arotation=Math.atan2(x,f)*ne.radDeg}else this.ascaleX=0,this.ascaleY=Math.sqrt(p*p+m*m),this.ashearY=0,this.arotation=90-Math.atan2(m,p)*ne.radDeg}getWorldRotationX(){return Math.atan2(this.c,this.a)*ne.radDeg}getWorldRotationY(){return Math.atan2(this.d,this.b)*ne.radDeg}getWorldScaleX(){return Math.sqrt(this.a*this.a+this.c*this.c)}getWorldScaleY(){return Math.sqrt(this.b*this.b+this.d*this.d)}worldToLocal(e){let t=1/(this.a*this.d-this.b*this.c),n=e.x-this.worldX,i=e.y-this.worldY;return e.x=n*this.d*t-i*this.b*t,e.y=i*this.a*t-n*this.c*t,e}localToWorld(e){let t=e.x,n=e.y;return e.x=t*this.a+n*this.b+this.worldX,e.y=t*this.c+n*this.d+this.worldY,e}worldToParent(e){if(e==null)throw new Error("world cannot be null.");return this.parent==null?e:this.parent.worldToLocal(e)}parentToWorld(e){if(e==null)throw new Error("world cannot be null.");return this.parent==null?e:this.parent.localToWorld(e)}worldToLocalRotation(e){let t=ne.sinDeg(e),n=ne.cosDeg(e);return Math.atan2(this.a*t-this.c*n,this.d*n-this.b*t)*ne.radDeg+this.rotation-this.shearX}localToWorldRotation(e){e-=this.rotation-this.shearX;let t=ne.sinDeg(e),n=ne.cosDeg(e);return Math.atan2(n*this.c+t*this.d,n*this.a+t*this.b)*ne.radDeg}rotateWorld(e){e*=ne.degRad;let t=Math.sin(e),n=Math.cos(e),i=this.a,s=this.b;this.a=n*i-t*this.c,this.b=n*s-t*this.d,this.c=t*i+n*this.c,this.d=t*s+n*this.d}};var pi=class{name;order;skinRequired;constructor(e,t,n){this.name=e,this.order=t,this.skinRequired=n}};var Zr=class{data;intValue=0;floatValue=0;stringValue=null;time=0;volume=0;balance=0;constructor(e,t){if(!t)throw new Error("data cannot be null.");this.time=e,this.data=t}};var Jr=class{name;intValue=0;floatValue=0;stringValue=null;audioPath=null;volume=0;balance=0;constructor(e){this.name=e}};var wc=class{data;bones;target;bendDirection=0;compress=!1;stretch=!1;mix=1;softness=0;active=!1;constructor(e,t){if(!e)throw new Error("data cannot be null.");if(!t)throw new Error("skeleton cannot be null.");this.data=e,this.bones=new Array;for(let i=0;i<e.bones.length;i++){let s=t.findBone(e.bones[i].name);if(!s)throw new Error(`Couldn't find bone ${e.bones[i].name}`);this.bones.push(s)}let n=t.findBone(e.target.name);if(!n)throw new Error(`Couldn't find bone ${e.target.name}`);this.target=n,this.mix=e.mix,this.softness=e.softness,this.bendDirection=e.bendDirection,this.compress=e.compress,this.stretch=e.stretch}isActive(){return this.active}setToSetupPose(){let e=this.data;this.mix=e.mix,this.softness=e.softness,this.bendDirection=e.bendDirection,this.compress=e.compress,this.stretch=e.stretch}update(e){if(this.mix==0)return;let t=this.target,n=this.bones;switch(n.length){case 1:this.apply1(n[0],t.worldX,t.worldY,this.compress,this.stretch,this.data.uniform,this.mix);break;case 2:this.apply2(n[0],n[1],t.worldX,t.worldY,this.bendDirection,this.stretch,this.data.uniform,this.softness,this.mix);break}}apply1(e,t,n,i,s,o,l){let a=e.parent;if(!a)throw new Error("IK bone must have parent.");let c=a.a,h=a.b,u=a.c,d=a.d,f=-e.ashearX-e.arotation,p=0,x=0;switch(e.inherit){case St.OnlyTranslation:p=(t-e.worldX)*ne.signum(e.skeleton.scaleX),x=(n-e.worldY)*ne.signum(e.skeleton.scaleY);break;case St.NoRotationOrReflection:let y=Math.abs(c*d-h*u)/Math.max(1e-4,c*c+u*u),_=c/e.skeleton.scaleX,v=u/e.skeleton.scaleY;h=-v*y*e.skeleton.scaleX,d=_*y*e.skeleton.scaleY,f+=Math.atan2(v,_)*ne.radDeg;default:let S=t-a.worldX,b=n-a.worldY,w=c*d-h*u;Math.abs(w)<=1e-4?(p=0,x=0):(p=(S*d-b*h)/w-e.ax,x=(b*c-S*u)/w-e.ay)}f+=Math.atan2(x,p)*ne.radDeg,e.ascaleX<0&&(f+=180),f>180?f-=360:f<-180&&(f+=360);let m=e.ascaleX,g=e.ascaleY;if(i||s){switch(e.inherit){case St.NoScale:case St.NoScaleOrReflection:p=t-e.worldX,x=n-e.worldY}let y=e.data.length*m;if(y>1e-4){let _=p*p+x*x;if(i&&_<y*y||s&&_>y*y){let v=(Math.sqrt(_)/y-1)*l+1;m*=v,o&&(g*=v)}}}e.updateWorldTransformWith(e.ax,e.ay,e.arotation+f*l,m,g,e.ashearX,e.ashearY)}apply2(e,t,n,i,s,o,l,a,c){if(e.inherit!=St.Normal||t.inherit!=St.Normal)return;let h=e.ax,u=e.ay,d=e.ascaleX,f=e.ascaleY,p=d,x=f,m=t.ascaleX,g=0,y=0,_=0;d<0?(d=-d,g=180,_=-1):(g=0,_=1),f<0&&(f=-f,_=-_),m<0?(m=-m,y=180):y=0;let v=t.ax,S=0,b=0,w=0,M=e.a,A=e.b,C=e.c,E=e.d,N=Math.abs(d-f)<=1e-4;!N||o?(S=0,b=M*v+e.worldX,w=C*v+e.worldY):(S=t.ay,b=M*v+A*S+e.worldX,w=C*v+E*S+e.worldY);let F=e.parent;if(!F)throw new Error("IK parent must itself have a parent.");M=F.a,A=F.b,C=F.c,E=F.d;let L=M*E-A*C,I=b-F.worldX,D=w-F.worldY;L=Math.abs(L)<=1e-4?0:1/L;let U=(I*E-D*A)*L-h,Y=(D*M-I*C)*L-u,X=Math.sqrt(U*U+Y*Y),ee=t.data.length*m,ae,ce;if(X<1e-4){this.apply1(e,n,i,!1,o,!1,c),t.updateWorldTransformWith(v,S,0,t.ascaleX,t.ascaleY,t.ashearX,t.ashearY);return}I=n-F.worldX,D=i-F.worldY;let oe=(I*E-D*A)*L-h,Me=(D*M-I*C)*L-u,me=oe*oe+Me*Me;if(a!=0){a*=d*(m+1)*.5;let te=Math.sqrt(me),Te=te-X-ee*d+a;if(Te>0){let Re=Math.min(1,Te/(a*2))-1;Re=(Te-a*(1-Re*Re))/te,oe-=Re*oe,Me-=Re*Me,me=oe*oe+Me*Me}}e:if(N){ee*=d;let te=(me-X*X-ee*ee)/(2*X*ee);te<-1?(te=-1,ce=Math.PI*s):te>1?(te=1,ce=0,o&&(M=(Math.sqrt(me)/(X+ee)-1)*c+1,p*=M,l&&(x*=M))):ce=Math.acos(te)*s,M=X+ee*te,A=ee*Math.sin(ce),ae=Math.atan2(Me*M-oe*A,oe*M+Me*A)}else{M=d*ee,A=f*ee;let te=M*M,Te=A*A,Re=Math.atan2(Me,oe);C=Te*X*X+te*me-te*Te;let Ne=-2*Te*X,ot=Te-te;if(E=Ne*Ne-4*ot*C,E>=0){let yt=Math.sqrt(E);Ne<0&&(yt=-yt),yt=-(Ne+yt)*.5;let He=yt/ot,ct=C/yt,xe=Math.abs(He)<Math.abs(ct)?He:ct;if(He=me-xe*xe,He>=0){D=Math.sqrt(He)*s,ae=Re-Math.atan2(D,xe),ce=Math.atan2(D/f,(xe-X)/d);break e}}let Ke=ne.PI,it=X-M,lt=it*it,qe=0,Et=0,ut=X+M,Yt=ut*ut,B=0;C=-M*X/(te-Te),C>=-1&&C<=1&&(C=Math.acos(C),I=M*Math.cos(C)+X,D=A*Math.sin(C),E=I*I+D*D,E<lt&&(Ke=C,lt=E,it=I,qe=D),E>Yt&&(Et=C,Yt=E,ut=I,B=D)),me<=(lt+Yt)*.5?(ae=Re-Math.atan2(qe*s,it),ce=Ke*s):(ae=Re-Math.atan2(B*s,ut),ce=Et*s)}let K=Math.atan2(S,v)*_,le=e.arotation;ae=(ae-K)*ne.radDeg+g-le,ae>180?ae-=360:ae<-180&&(ae+=360),e.updateWorldTransformWith(h,u,le+ae*c,p,x,0,0),le=t.arotation,ce=((ce+K)*ne.radDeg-t.ashearX)*_+y-le,ce>180?ce-=360:ce<-180&&(ce+=360),t.updateWorldTransformWith(v,S,le+ce*c,t.ascaleX,t.ascaleY,t.ashearX,t.ashearY)}};var jr=class extends pi{bones=new Array;_target=null;set target(e){this._target=e}get target(){if(this._target)return this._target;throw new Error("BoneData not set.")}bendDirection=0;compress=!1;stretch=!1;uniform=!1;mix=0;softness=0;constructor(e){super(e,0,!1)}};var Qr=class extends pi{bones=new Array;_target=null;set target(e){this._target=e}get target(){if(this._target)return this._target;throw new Error("SlotData not set.")}positionMode=wn.Fixed;spacingMode=Pt.Fixed;rotateMode=Fi.Chain;offsetRotation=0;position=0;spacing=0;mixRotate=0;mixX=0;mixY=0;constructor(e){super(e,0,!1)}},wn;(function(r){r[r.Fixed=0]="Fixed",r[r.Percent=1]="Percent"})(wn||(wn={}));var Pt;(function(r){r[r.Length=0]="Length",r[r.Fixed=1]="Fixed",r[r.Percent=2]="Percent",r[r.Proportional=3]="Proportional"})(Pt||(Pt={}));var Fi;(function(r){r[r.Tangent=0]="Tangent",r[r.Chain=1]="Chain",r[r.ChainScale=2]="ChainScale"})(Fi||(Fi={}));var Tc=class r{static NONE=-1;static BEFORE=-2;static AFTER=-3;static epsilon=1e-5;data;bones;target;position=0;spacing=0;mixRotate=0;mixX=0;mixY=0;spaces=new Array;positions=new Array;world=new Array;curves=new Array;lengths=new Array;segments=new Array;active=!1;constructor(e,t){if(!e)throw new Error("data cannot be null.");if(!t)throw new Error("skeleton cannot be null.");this.data=e,this.bones=new Array;for(let i=0,s=e.bones.length;i<s;i++){let o=t.findBone(e.bones[i].name);if(!o)throw new Error(`Couldn't find bone ${e.bones[i].name}.`);this.bones.push(o)}let n=t.findSlot(e.target.name);if(!n)throw new Error(`Couldn't find target bone ${e.target.name}`);this.target=n,this.position=e.position,this.spacing=e.spacing,this.mixRotate=e.mixRotate,this.mixX=e.mixX,this.mixY=e.mixY}isActive(){return this.active}setToSetupPose(){let e=this.data;this.position=e.position,this.spacing=e.spacing,this.mixRotate=e.mixRotate,this.mixX=e.mixX,this.mixY=e.mixY}update(e){let t=this.target.getAttachment();if(!(t instanceof Ni))return;let n=this.mixRotate,i=this.mixX,s=this.mixY;if(n==0&&i==0&&s==0)return;let o=this.data,l=o.rotateMode==Fi.Tangent,a=o.rotateMode==Fi.ChainScale,c=this.bones,h=c.length,u=l?h:h+1,d=se.setArraySize(this.spaces,u),f=a?this.lengths=se.setArraySize(this.lengths,h):[],p=this.spacing;switch(o.spacingMode){case Pt.Percent:if(a)for(let b=0,w=u-1;b<w;b++){let M=c[b],A=M.data.length,C=A*M.a,E=A*M.c;f[b]=Math.sqrt(C*C+E*E)}se.arrayFill(d,1,u,p);break;case Pt.Proportional:let v=0;for(let b=0,w=u-1;b<w;){let M=c[b],A=M.data.length;if(A<r.epsilon)a&&(f[b]=0),d[++b]=p;else{let C=A*M.a,E=A*M.c,N=Math.sqrt(C*C+E*E);a&&(f[b]=N),d[++b]=N,v+=N}}if(v>0){v=u/v*p;for(let b=1;b<u;b++)d[b]*=v}break;default:let S=o.spacingMode==Pt.Length;for(let b=0,w=u-1;b<w;){let M=c[b],A=M.data.length;if(A<r.epsilon)a&&(f[b]=0),d[++b]=p;else{let C=A*M.a,E=A*M.c,N=Math.sqrt(C*C+E*E);a&&(f[b]=N),d[++b]=(S?A+p:p)*N/A}}}let x=this.computeWorldPositions(t,u,l),m=x[0],g=x[1],y=o.offsetRotation,_=!1;if(y==0)_=o.rotateMode==Fi.Chain;else{_=!1;let v=this.target.bone;y*=v.a*v.d-v.b*v.c>0?ne.degRad:-ne.degRad}for(let v=0,S=3;v<h;v++,S+=3){let b=c[v];b.worldX+=(m-b.worldX)*i,b.worldY+=(g-b.worldY)*s;let w=x[S],M=x[S+1],A=w-m,C=M-g;if(a){let E=f[v];if(E!=0){let N=(Math.sqrt(A*A+C*C)/E-1)*n+1;b.a*=N,b.c*=N}}if(m=w,g=M,n>0){let E=b.a,N=b.b,F=b.c,L=b.d,I=0,D=0,U=0;if(l?I=x[S-1]:d[v+1]==0?I=x[S+2]:I=Math.atan2(C,A),I-=Math.atan2(F,E),_){D=Math.cos(I),U=Math.sin(I);let Y=b.data.length;m+=(Y*(D*E-U*F)-A)*n,g+=(Y*(U*E+D*F)-C)*n}else I+=y;I>ne.PI?I-=ne.PI2:I<-ne.PI&&(I+=ne.PI2),I*=n,D=Math.cos(I),U=Math.sin(I),b.a=D*E-U*F,b.b=D*N-U*L,b.c=U*E+D*F,b.d=U*N+D*L}b.updateAppliedTransform()}}computeWorldPositions(e,t,n){let i=this.target,s=this.position,o=this.spaces,l=se.setArraySize(this.positions,t*3+2),a=this.world,c=e.closed,h=e.worldVerticesLength,u=h/6,d=r.NONE;if(!e.constantSpeed){let Y=e.lengths;u-=c?1:2;let X=Y[u];this.data.positionMode==wn.Percent&&(s*=X);let ee;switch(this.data.spacingMode){case Pt.Percent:ee=X;break;case Pt.Proportional:ee=X/t;break;default:ee=1}a=se.setArraySize(this.world,8);for(let ae=0,ce=0,oe=0;ae<t;ae++,ce+=3){let Me=o[ae]*ee;s+=Me;let me=s;if(c)me%=X,me<0&&(me+=X),oe=0;else if(me<0){d!=r.BEFORE&&(d=r.BEFORE,e.computeWorldVertices(i,2,4,a,0,2)),this.addBeforePosition(me,a,0,l,ce);continue}else if(me>X){d!=r.AFTER&&(d=r.AFTER,e.computeWorldVertices(i,h-6,4,a,0,2)),this.addAfterPosition(me-X,a,0,l,ce);continue}for(;;oe++){let K=Y[oe];if(!(me>K)){if(oe==0)me/=K;else{let le=Y[oe-1];me=(me-le)/(K-le)}break}}oe!=d&&(d=oe,c&&oe==u?(e.computeWorldVertices(i,h-4,4,a,0,2),e.computeWorldVertices(i,0,4,a,4,2)):e.computeWorldVertices(i,oe*6+2,8,a,0,2)),this.addCurvePosition(me,a[0],a[1],a[2],a[3],a[4],a[5],a[6],a[7],l,ce,n||ae>0&&Me==0)}return l}c?(h+=2,a=se.setArraySize(this.world,h),e.computeWorldVertices(i,2,h-4,a,0,2),e.computeWorldVertices(i,0,2,a,h-4,2),a[h-2]=a[0],a[h-1]=a[1]):(u--,h-=4,a=se.setArraySize(this.world,h),e.computeWorldVertices(i,2,h,a,0,2));let f=se.setArraySize(this.curves,u),p=0,x=a[0],m=a[1],g=0,y=0,_=0,v=0,S=0,b=0,w=0,M=0,A=0,C=0,E=0,N=0,F=0,L=0;for(let Y=0,X=2;Y<u;Y++,X+=6)g=a[X],y=a[X+1],_=a[X+2],v=a[X+3],S=a[X+4],b=a[X+5],w=(x-g*2+_)*.1875,M=(m-y*2+v)*.1875,A=((g-_)*3-x+S)*.09375,C=((y-v)*3-m+b)*.09375,E=w*2+A,N=M*2+C,F=(g-x)*.75+w+A*.16666667,L=(y-m)*.75+M+C*.16666667,p+=Math.sqrt(F*F+L*L),F+=E,L+=N,E+=A,N+=C,p+=Math.sqrt(F*F+L*L),F+=E,L+=N,p+=Math.sqrt(F*F+L*L),F+=E+A,L+=N+C,p+=Math.sqrt(F*F+L*L),f[Y]=p,x=S,m=b;this.data.positionMode==wn.Percent&&(s*=p);let I;switch(this.data.spacingMode){case Pt.Percent:I=p;break;case Pt.Proportional:I=p/t;break;default:I=1}let D=this.segments,U=0;for(let Y=0,X=0,ee=0,ae=0;Y<t;Y++,X+=3){let ce=o[Y]*I;s+=ce;let oe=s;if(c)oe%=p,oe<0&&(oe+=p),ee=0;else if(oe<0){this.addBeforePosition(oe,a,0,l,X);continue}else if(oe>p){this.addAfterPosition(oe-p,a,h-4,l,X);continue}for(;;ee++){let Me=f[ee];if(!(oe>Me)){if(ee==0)oe/=Me;else{let me=f[ee-1];oe=(oe-me)/(Me-me)}break}}if(ee!=d){d=ee;let Me=ee*6;for(x=a[Me],m=a[Me+1],g=a[Me+2],y=a[Me+3],_=a[Me+4],v=a[Me+5],S=a[Me+6],b=a[Me+7],w=(x-g*2+_)*.03,M=(m-y*2+v)*.03,A=((g-_)*3-x+S)*.006,C=((y-v)*3-m+b)*.006,E=w*2+A,N=M*2+C,F=(g-x)*.3+w+A*.16666667,L=(y-m)*.3+M+C*.16666667,U=Math.sqrt(F*F+L*L),D[0]=U,Me=1;Me<8;Me++)F+=E,L+=N,E+=A,N+=C,U+=Math.sqrt(F*F+L*L),D[Me]=U;F+=E,L+=N,U+=Math.sqrt(F*F+L*L),D[8]=U,F+=E+A,L+=N+C,U+=Math.sqrt(F*F+L*L),D[9]=U,ae=0}for(oe*=U;;ae++){let Me=D[ae];if(!(oe>Me)){if(ae==0)oe/=Me;else{let me=D[ae-1];oe=ae+(oe-me)/(Me-me)}break}}this.addCurvePosition(oe*.1,x,m,g,y,_,v,S,b,l,X,n||Y>0&&ce==0)}return l}addBeforePosition(e,t,n,i,s){let o=t[n],l=t[n+1],a=t[n+2]-o,c=t[n+3]-l,h=Math.atan2(c,a);i[s]=o+e*Math.cos(h),i[s+1]=l+e*Math.sin(h),i[s+2]=h}addAfterPosition(e,t,n,i,s){let o=t[n+2],l=t[n+3],a=o-t[n],c=l-t[n+1],h=Math.atan2(c,a);i[s]=o+e*Math.cos(h),i[s+1]=l+e*Math.sin(h),i[s+2]=h}addCurvePosition(e,t,n,i,s,o,l,a,c,h,u,d){if(e==0||isNaN(e)){h[u]=t,h[u+1]=n,h[u+2]=Math.atan2(s-n,i-t);return}let f=e*e,p=f*e,x=1-e,m=x*x,g=m*x,y=x*e,_=y*3,v=x*_,S=_*e,b=t*g+i*v+o*S+a*p,w=n*g+s*v+l*S+c*p;h[u]=b,h[u+1]=w,d&&(e<.001?h[u+2]=Math.atan2(s-n,i-t):h[u+2]=Math.atan2(w-(n*m+s*y*2+l*f),b-(t*m+i*y*2+o*f)))}};var Ac=class{data;_bone=null;set bone(e){this._bone=e}get bone(){if(this._bone)return this._bone;throw new Error("Bone not set.")}inertia=0;strength=0;damping=0;massInverse=0;wind=0;gravity=0;mix=0;_reset=!0;ux=0;uy=0;cx=0;cy=0;tx=0;ty=0;xOffset=0;xVelocity=0;yOffset=0;yVelocity=0;rotateOffset=0;rotateVelocity=0;scaleOffset=0;scaleVelocity=0;active=!1;skeleton;remaining=0;lastTime=0;constructor(e,t){this.data=e,this.skeleton=t,this.bone=t.bones[e.bone.index],this.inertia=e.inertia,this.strength=e.strength,this.damping=e.damping,this.massInverse=e.massInverse,this.wind=e.wind,this.gravity=e.gravity,this.mix=e.mix}reset(){this.remaining=0,this.lastTime=this.skeleton.time,this._reset=!0,this.xOffset=0,this.xVelocity=0,this.yOffset=0,this.yVelocity=0,this.rotateOffset=0,this.rotateVelocity=0,this.scaleOffset=0,this.scaleVelocity=0}setToSetupPose(){let e=this.data;this.inertia=e.inertia,this.strength=e.strength,this.damping=e.damping,this.massInverse=e.massInverse,this.wind=e.wind,this.gravity=e.gravity,this.mix=e.mix}isActive(){return this.active}update(e){let t=this.mix;if(t==0)return;let n=this.data.x>0,i=this.data.y>0,s=this.data.rotate>0||this.data.shearX>0,o=this.data.scaleX>0,l=this.bone,a=l.data.length;switch(e){case In.none:return;case In.reset:this.reset();case In.update:let c=this.skeleton,h=Math.max(this.skeleton.time-this.lastTime,0);this.remaining+=h,this.lastTime=c.time;let u=l.worldX,d=l.worldY;if(this._reset)this._reset=!1,this.ux=u,this.uy=d;else{let f=this.remaining,p=this.inertia,x=this.data.step,m=this.skeleton.data.referenceScale,g=-1,y=this.data.limit*h,_=y*Math.abs(c.scaleY);if(y*=Math.abs(c.scaleX),n||i){if(n){let v=(this.ux-u)*p;this.xOffset+=v>y?y:v<-y?-y:v,this.ux=u}if(i){let v=(this.uy-d)*p;this.yOffset+=v>_?_:v<-_?-_:v,this.uy=d}if(f>=x){g=Math.pow(this.damping,60*x);let v=this.massInverse*x,S=this.strength,b=this.wind*m*c.scaleX,w=this.gravity*m*c.scaleY;do n&&(this.xVelocity+=(b-this.xOffset*S)*v,this.xOffset+=this.xVelocity*x,this.xVelocity*=g),i&&(this.yVelocity-=(w+this.yOffset*S)*v,this.yOffset+=this.yVelocity*x,this.yVelocity*=g),f-=x;while(f>=x)}n&&(l.worldX+=this.xOffset*t*this.data.x),i&&(l.worldY+=this.yOffset*t*this.data.y)}if(s||o){let v=Math.atan2(l.c,l.a),S=0,b=0,w=0,M=this.cx-l.worldX,A=this.cy-l.worldY;if(M>y?M=y:M<-y&&(M=-y),A>_?A=_:A<-_&&(A=-_),s){w=(this.data.rotate+this.data.shearX)*t;let C=Math.atan2(A+this.ty,M+this.tx)-v-this.rotateOffset*w;this.rotateOffset+=(C-Math.ceil(C*ne.invPI2-.5)*ne.PI2)*p,C=this.rotateOffset*w+v,S=Math.cos(C),b=Math.sin(C),o&&(C=a*l.getWorldScaleX(),C>0&&(this.scaleOffset+=(M*S+A*b)*p/C))}else{S=Math.cos(v),b=Math.sin(v);let C=a*l.getWorldScaleX();C>0&&(this.scaleOffset+=(M*S+A*b)*p/C)}if(f=this.remaining,f>=x){g==-1&&(g=Math.pow(this.damping,60*x));let C=this.massInverse*x,E=this.strength,N=this.wind,F=ea.yDown?-this.gravity:this.gravity,L=a/m;for(;;)if(f-=x,o&&(this.scaleVelocity+=(N*S-F*b-this.scaleOffset*E)*C,this.scaleOffset+=this.scaleVelocity*x,this.scaleVelocity*=g),s){if(this.rotateVelocity-=((N*b+F*S)*L+this.rotateOffset*E)*C,this.rotateOffset+=this.rotateVelocity*x,this.rotateVelocity*=g,f<x)break;let I=this.rotateOffset*w+v;S=Math.cos(I),b=Math.sin(I)}else if(f<x)break}}this.remaining=f}this.cx=l.worldX,this.cy=l.worldY;break;case In.pose:n&&(l.worldX+=this.xOffset*t*this.data.x),i&&(l.worldY+=this.yOffset*t*this.data.y)}if(s){let c=this.rotateOffset*t,h=0,u=0,d=0;if(this.data.shearX>0){let f=0;this.data.rotate>0&&(f=c*this.data.rotate,h=Math.sin(f),u=Math.cos(f),d=l.b,l.b=u*d-h*l.d,l.d=h*d+u*l.d),f+=c*this.data.shearX,h=Math.sin(f),u=Math.cos(f),d=l.a,l.a=u*d-h*l.c,l.c=h*d+u*l.c}else c*=this.data.rotate,h=Math.sin(c),u=Math.cos(c),d=l.a,l.a=u*d-h*l.c,l.c=h*d+u*l.c,d=l.b,l.b=u*d-h*l.d,l.d=h*d+u*l.d}if(o){let c=1+this.scaleOffset*t*this.data.scaleX;l.a*=c,l.c*=c}e!=In.pose&&(this.tx=a*l.a,this.ty=a*l.c),l.updateAppliedTransform()}translate(e,t){this.ux-=e,this.uy-=t,this.cx-=e,this.cy-=t}rotate(e,t,n){let i=n*ne.degRad,s=Math.cos(i),o=Math.sin(i),l=this.cx-e,a=this.cy-t;this.translate(l*s-a*o-l,l*o+a*s-a)}};var Ec=class{data;bone;color;darkColor=null;attachment=null;attachmentState=0;sequenceIndex=-1;deform=new Array;constructor(e,t){if(!e)throw new Error("data cannot be null.");if(!t)throw new Error("bone cannot be null.");this.data=e,this.bone=t,this.color=new Pe,this.darkColor=e.darkColor?new Pe:null,this.setToSetupPose()}getSkeleton(){return this.bone.skeleton}getAttachment(){return this.attachment}setAttachment(e){this.attachment!=e&&((!(e instanceof Xt)||!(this.attachment instanceof Xt)||e.timelineAttachment!=this.attachment.timelineAttachment)&&(this.deform.length=0),this.attachment=e,this.sequenceIndex=-1)}setToSetupPose(){this.color.setFromColor(this.data.color),this.darkColor&&this.darkColor.setFromColor(this.data.darkColor),this.data.attachmentName?(this.attachment=null,this.setAttachment(this.bone.skeleton.getAttachment(this.data.index,this.data.attachmentName))):this.attachment=null}};var Rc=class{data;bones;target;mixRotate=0;mixX=0;mixY=0;mixScaleX=0;mixScaleY=0;mixShearY=0;temp=new hi;active=!1;constructor(e,t){if(!e)throw new Error("data cannot be null.");if(!t)throw new Error("skeleton cannot be null.");this.data=e,this.bones=new Array;for(let i=0;i<e.bones.length;i++){let s=t.findBone(e.bones[i].name);if(!s)throw new Error(`Couldn't find bone ${e.bones[i].name}.`);this.bones.push(s)}let n=t.findBone(e.target.name);if(!n)throw new Error(`Couldn't find target bone ${e.target.name}.`);this.target=n,this.mixRotate=e.mixRotate,this.mixX=e.mixX,this.mixY=e.mixY,this.mixScaleX=e.mixScaleX,this.mixScaleY=e.mixScaleY,this.mixShearY=e.mixShearY}isActive(){return this.active}setToSetupPose(){let e=this.data;this.mixRotate=e.mixRotate,this.mixX=e.mixX,this.mixY=e.mixY,this.mixScaleX=e.mixScaleX,this.mixScaleY=e.mixScaleY,this.mixShearY=e.mixShearY}update(e){this.mixRotate==0&&this.mixX==0&&this.mixY==0&&this.mixScaleX==0&&this.mixScaleY==0&&this.mixShearY==0||(this.data.local?this.data.relative?this.applyRelativeLocal():this.applyAbsoluteLocal():this.data.relative?this.applyRelativeWorld():this.applyAbsoluteWorld())}applyAbsoluteWorld(){let e=this.mixRotate,t=this.mixX,n=this.mixY,i=this.mixScaleX,s=this.mixScaleY,o=this.mixShearY,l=t!=0||n!=0,a=this.target,c=a.a,h=a.b,u=a.c,d=a.d,f=c*d-h*u>0?ne.degRad:-ne.degRad,p=this.data.offsetRotation*f,x=this.data.offsetShearY*f,m=this.bones;for(let g=0,y=m.length;g<y;g++){let _=m[g];if(e!=0){let v=_.a,S=_.b,b=_.c,w=_.d,M=Math.atan2(u,c)-Math.atan2(b,v)+p;M>ne.PI?M-=ne.PI2:M<-ne.PI&&(M+=ne.PI2),M*=e;let A=Math.cos(M),C=Math.sin(M);_.a=A*v-C*b,_.b=A*S-C*w,_.c=C*v+A*b,_.d=C*S+A*w}if(l){let v=this.temp;a.localToWorld(v.set(this.data.offsetX,this.data.offsetY)),_.worldX+=(v.x-_.worldX)*t,_.worldY+=(v.y-_.worldY)*n}if(i!=0){let v=Math.sqrt(_.a*_.a+_.c*_.c);v!=0&&(v=(v+(Math.sqrt(c*c+u*u)-v+this.data.offsetScaleX)*i)/v),_.a*=v,_.c*=v}if(s!=0){let v=Math.sqrt(_.b*_.b+_.d*_.d);v!=0&&(v=(v+(Math.sqrt(h*h+d*d)-v+this.data.offsetScaleY)*s)/v),_.b*=v,_.d*=v}if(o>0){let v=_.b,S=_.d,b=Math.atan2(S,v),w=Math.atan2(d,h)-Math.atan2(u,c)-(b-Math.atan2(_.c,_.a));w>ne.PI?w-=ne.PI2:w<-ne.PI&&(w+=ne.PI2),w=b+(w+x)*o;let M=Math.sqrt(v*v+S*S);_.b=Math.cos(w)*M,_.d=Math.sin(w)*M}_.updateAppliedTransform()}}applyRelativeWorld(){let e=this.mixRotate,t=this.mixX,n=this.mixY,i=this.mixScaleX,s=this.mixScaleY,o=this.mixShearY,l=t!=0||n!=0,a=this.target,c=a.a,h=a.b,u=a.c,d=a.d,f=c*d-h*u>0?ne.degRad:-ne.degRad,p=this.data.offsetRotation*f,x=this.data.offsetShearY*f,m=this.bones;for(let g=0,y=m.length;g<y;g++){let _=m[g];if(e!=0){let v=_.a,S=_.b,b=_.c,w=_.d,M=Math.atan2(u,c)+p;M>ne.PI?M-=ne.PI2:M<-ne.PI&&(M+=ne.PI2),M*=e;let A=Math.cos(M),C=Math.sin(M);_.a=A*v-C*b,_.b=A*S-C*w,_.c=C*v+A*b,_.d=C*S+A*w}if(l){let v=this.temp;a.localToWorld(v.set(this.data.offsetX,this.data.offsetY)),_.worldX+=v.x*t,_.worldY+=v.y*n}if(i!=0){let v=(Math.sqrt(c*c+u*u)-1+this.data.offsetScaleX)*i+1;_.a*=v,_.c*=v}if(s!=0){let v=(Math.sqrt(h*h+d*d)-1+this.data.offsetScaleY)*s+1;_.b*=v,_.d*=v}if(o>0){let v=Math.atan2(d,h)-Math.atan2(u,c);v>ne.PI?v-=ne.PI2:v<-ne.PI&&(v+=ne.PI2);let S=_.b,b=_.d;v=Math.atan2(b,S)+(v-ne.PI/2+x)*o;let w=Math.sqrt(S*S+b*b);_.b=Math.cos(v)*w,_.d=Math.sin(v)*w}_.updateAppliedTransform()}}applyAbsoluteLocal(){let e=this.mixRotate,t=this.mixX,n=this.mixY,i=this.mixScaleX,s=this.mixScaleY,o=this.mixShearY,l=this.target,a=this.bones;for(let c=0,h=a.length;c<h;c++){let u=a[c],d=u.arotation;e!=0&&(d+=(l.arotation-d+this.data.offsetRotation)*e);let f=u.ax,p=u.ay;f+=(l.ax-f+this.data.offsetX)*t,p+=(l.ay-p+this.data.offsetY)*n;let x=u.ascaleX,m=u.ascaleY;i!=0&&x!=0&&(x=(x+(l.ascaleX-x+this.data.offsetScaleX)*i)/x),s!=0&&m!=0&&(m=(m+(l.ascaleY-m+this.data.offsetScaleY)*s)/m);let g=u.ashearY;o!=0&&(g+=(l.ashearY-g+this.data.offsetShearY)*o),u.updateWorldTransformWith(f,p,d,x,m,u.ashearX,g)}}applyRelativeLocal(){let e=this.mixRotate,t=this.mixX,n=this.mixY,i=this.mixScaleX,s=this.mixScaleY,o=this.mixShearY,l=this.target,a=this.bones;for(let c=0,h=a.length;c<h;c++){let u=a[c],d=u.arotation+(l.arotation+this.data.offsetRotation)*e,f=u.ax+(l.ax+this.data.offsetX)*t,p=u.ay+(l.ay+this.data.offsetY)*n,x=u.ascaleX*((l.ascaleX-1+this.data.offsetScaleX)*i+1),m=u.ascaleY*((l.ascaleY-1+this.data.offsetScaleY)*s+1),g=u.ashearY+(l.ashearY+this.data.offsetShearY)*o;u.updateWorldTransformWith(f,p,d,x,m,u.ashearX,g)}}};var ea=class r{static quadTriangles=[0,1,2,2,3,0];static yDown=!1;data;bones;slots;drawOrder;ikConstraints;transformConstraints;pathConstraints;physicsConstraints;_updateCache=new Array;skin=null;color;scaleX=1;_scaleY=1;get scaleY(){return r.yDown?-this._scaleY:this._scaleY}set scaleY(e){this._scaleY=e}x=0;y=0;time=0;constructor(e){if(!e)throw new Error("data cannot be null.");this.data=e,this.bones=new Array;for(let t=0;t<e.bones.length;t++){let n=e.bones[t],i;if(!n.parent)i=new lo(n,this,null);else{let s=this.bones[n.parent.index];i=new lo(n,this,s),s.children.push(i)}this.bones.push(i)}this.slots=new Array,this.drawOrder=new Array;for(let t=0;t<e.slots.length;t++){let n=e.slots[t],i=this.bones[n.boneData.index],s=new Ec(n,i);this.slots.push(s),this.drawOrder.push(s)}this.ikConstraints=new Array;for(let t=0;t<e.ikConstraints.length;t++){let n=e.ikConstraints[t];this.ikConstraints.push(new wc(n,this))}this.transformConstraints=new Array;for(let t=0;t<e.transformConstraints.length;t++){let n=e.transformConstraints[t];this.transformConstraints.push(new Rc(n,this))}this.pathConstraints=new Array;for(let t=0;t<e.pathConstraints.length;t++){let n=e.pathConstraints[t];this.pathConstraints.push(new Tc(n,this))}this.physicsConstraints=new Array;for(let t=0;t<e.physicsConstraints.length;t++){let n=e.physicsConstraints[t];this.physicsConstraints.push(new Ac(n,this))}this.color=new Pe(1,1,1,1),this.updateCache()}updateCache(){let e=this._updateCache;e.length=0;let t=this.bones;for(let d=0,f=t.length;d<f;d++){let p=t[d];p.sorted=p.data.skinRequired,p.active=!p.sorted}if(this.skin){let d=this.skin.bones;for(let f=0,p=this.skin.bones.length;f<p;f++){let x=this.bones[d[f].index];do x.sorted=!1,x.active=!0,x=x.parent;while(x)}}let n=this.ikConstraints,i=this.transformConstraints,s=this.pathConstraints,o=this.physicsConstraints,l=n.length,a=i.length,c=s.length,h=this.physicsConstraints.length,u=l+a+c+h;e:for(let d=0;d<u;d++){for(let f=0;f<l;f++){let p=n[f];if(p.data.order==d){this.sortIkConstraint(p);continue e}}for(let f=0;f<a;f++){let p=i[f];if(p.data.order==d){this.sortTransformConstraint(p);continue e}}for(let f=0;f<c;f++){let p=s[f];if(p.data.order==d){this.sortPathConstraint(p);continue e}}for(let f=0;f<h;f++){let p=o[f];if(p.data.order==d){this.sortPhysicsConstraint(p);continue e}}}for(let d=0,f=t.length;d<f;d++)this.sortBone(t[d])}sortIkConstraint(e){if(e.active=e.target.isActive()&&(!e.data.skinRequired||this.skin&&se.contains(this.skin.constraints,e.data,!0)),!e.active)return;let t=e.target;this.sortBone(t);let n=e.bones,i=n[0];if(this.sortBone(i),n.length==1)this._updateCache.push(e),this.sortReset(i.children);else{let s=n[n.length-1];this.sortBone(s),this._updateCache.push(e),this.sortReset(i.children),s.sorted=!0}}sortPathConstraint(e){if(e.active=e.target.bone.isActive()&&(!e.data.skinRequired||this.skin&&se.contains(this.skin.constraints,e.data,!0)),!e.active)return;let t=e.target,n=t.data.index,i=t.bone;this.skin&&this.sortPathConstraintAttachment(this.skin,n,i),this.data.defaultSkin&&this.data.defaultSkin!=this.skin&&this.sortPathConstraintAttachment(this.data.defaultSkin,n,i);for(let a=0,c=this.data.skins.length;a<c;a++)this.sortPathConstraintAttachment(this.data.skins[a],n,i);let s=t.getAttachment();s instanceof Ni&&this.sortPathConstraintAttachmentWith(s,i);let o=e.bones,l=o.length;for(let a=0;a<l;a++)this.sortBone(o[a]);this._updateCache.push(e);for(let a=0;a<l;a++)this.sortReset(o[a].children);for(let a=0;a<l;a++)o[a].sorted=!0}sortTransformConstraint(e){if(e.active=e.target.isActive()&&(!e.data.skinRequired||this.skin&&se.contains(this.skin.constraints,e.data,!0)),!e.active)return;this.sortBone(e.target);let t=e.bones,n=t.length;if(e.data.local)for(let i=0;i<n;i++){let s=t[i];this.sortBone(s.parent),this.sortBone(s)}else for(let i=0;i<n;i++)this.sortBone(t[i]);this._updateCache.push(e);for(let i=0;i<n;i++)this.sortReset(t[i].children);for(let i=0;i<n;i++)t[i].sorted=!0}sortPathConstraintAttachment(e,t,n){let i=e.attachments[t];if(i)for(let s in i)this.sortPathConstraintAttachmentWith(i[s],n)}sortPathConstraintAttachmentWith(e,t){if(!(e instanceof Ni))return;let n=e.bones;if(!n)this.sortBone(t);else{let i=this.bones;for(let s=0,o=n.length;s<o;){let l=n[s++];for(l+=s;s<l;)this.sortBone(i[n[s++]])}}}sortPhysicsConstraint(e){let t=e.bone;e.active=t.active&&(!e.data.skinRequired||this.skin!=null&&se.contains(this.skin.constraints,e.data,!0)),e.active&&(this.sortBone(t),this._updateCache.push(e),this.sortReset(t.children),t.sorted=!0)}sortBone(e){if(!e||e.sorted)return;let t=e.parent;t&&this.sortBone(t),e.sorted=!0,this._updateCache.push(e)}sortReset(e){for(let t=0,n=e.length;t<n;t++){let i=e[t];i.active&&(i.sorted&&this.sortReset(i.children),i.sorted=!1)}}updateWorldTransform(e){if(e==null)throw new Error("physics is undefined");let t=this.bones;for(let i=0,s=t.length;i<s;i++){let o=t[i];o.ax=o.x,o.ay=o.y,o.arotation=o.rotation,o.ascaleX=o.scaleX,o.ascaleY=o.scaleY,o.ashearX=o.shearX,o.ashearY=o.shearY}let n=this._updateCache;for(let i=0,s=n.length;i<s;i++)n[i].update(e)}updateWorldTransformWith(e,t){if(!t)throw new Error("parent cannot be null.");let n=this.bones;for(let m=1,g=n.length;m<g;m++){let y=n[m];y.ax=y.x,y.ay=y.y,y.arotation=y.rotation,y.ascaleX=y.scaleX,y.ascaleY=y.scaleY,y.ashearX=y.shearX,y.ashearY=y.shearY}let i=this.getRootBone();if(!i)throw new Error("Root bone must not be null.");let s=t.a,o=t.b,l=t.c,a=t.d;i.worldX=s*this.x+o*this.y+t.worldX,i.worldY=l*this.x+a*this.y+t.worldY;let c=(i.rotation+i.shearX)*ne.degRad,h=(i.rotation+90+i.shearY)*ne.degRad,u=Math.cos(c)*i.scaleX,d=Math.cos(h)*i.scaleY,f=Math.sin(c)*i.scaleX,p=Math.sin(h)*i.scaleY;i.a=(s*u+o*f)*this.scaleX,i.b=(s*d+o*p)*this.scaleX,i.c=(l*u+a*f)*this.scaleY,i.d=(l*d+a*p)*this.scaleY;let x=this._updateCache;for(let m=0,g=x.length;m<g;m++){let y=x[m];y!=i&&y.update(e)}}setToSetupPose(){this.setBonesToSetupPose(),this.setSlotsToSetupPose()}setBonesToSetupPose(){for(let e of this.bones)e.setToSetupPose();for(let e of this.ikConstraints)e.setToSetupPose();for(let e of this.transformConstraints)e.setToSetupPose();for(let e of this.pathConstraints)e.setToSetupPose();for(let e of this.physicsConstraints)e.setToSetupPose()}setSlotsToSetupPose(){let e=this.slots;se.arrayCopy(e,0,this.drawOrder,0,e.length);for(let t=0,n=e.length;t<n;t++)e[t].setToSetupPose()}getRootBone(){return this.bones.length==0?null:this.bones[0]}findBone(e){if(!e)throw new Error("boneName cannot be null.");let t=this.bones;for(let n=0,i=t.length;n<i;n++){let s=t[n];if(s.data.name==e)return s}return null}findSlot(e){if(!e)throw new Error("slotName cannot be null.");let t=this.slots;for(let n=0,i=t.length;n<i;n++){let s=t[n];if(s.data.name==e)return s}return null}setSkinByName(e){let t=this.data.findSkin(e);if(!t)throw new Error("Skin not found: "+e);this.setSkin(t)}setSkin(e){if(e!=this.skin){if(e)if(this.skin)e.attachAll(this,this.skin);else{let t=this.slots;for(let n=0,i=t.length;n<i;n++){let s=t[n],o=s.data.attachmentName;if(o){let l=e.getAttachment(n,o);l&&s.setAttachment(l)}}}this.skin=e,this.updateCache()}}getAttachmentByName(e,t){let n=this.data.findSlot(e);if(!n)throw new Error(`Can't find slot with name ${e}`);return this.getAttachment(n.index,t)}getAttachment(e,t){if(!t)throw new Error("attachmentName cannot be null.");if(this.skin){let n=this.skin.getAttachment(e,t);if(n)return n}return this.data.defaultSkin?this.data.defaultSkin.getAttachment(e,t):null}setAttachment(e,t){if(!e)throw new Error("slotName cannot be null.");let n=this.slots;for(let i=0,s=n.length;i<s;i++){let o=n[i];if(o.data.name==e){let l=null;if(t&&(l=this.getAttachment(i,t),!l))throw new Error("Attachment not found: "+t+", for slot: "+e);o.setAttachment(l);return}}throw new Error("Slot not found: "+e)}findIkConstraint(e){if(!e)throw new Error("constraintName cannot be null.");return this.ikConstraints.find(t=>t.data.name==e)??null}findTransformConstraint(e){if(!e)throw new Error("constraintName cannot be null.");return this.transformConstraints.find(t=>t.data.name==e)??null}findPathConstraint(e){if(!e)throw new Error("constraintName cannot be null.");return this.pathConstraints.find(t=>t.data.name==e)??null}findPhysicsConstraint(e){if(e==null)throw new Error("constraintName cannot be null.");return this.physicsConstraints.find(t=>t.data.name==e)??null}getBoundsRect(e){let t=new hi,n=new hi;return this.getBounds(t,n,void 0,e),{x:t.x,y:t.y,width:n.x,height:n.y}}getBounds(e,t,n=new Array(2),i=null){if(!e)throw new Error("offset cannot be null.");if(!t)throw new Error("size cannot be null.");let s=this.drawOrder,o=Number.POSITIVE_INFINITY,l=Number.POSITIVE_INFINITY,a=Number.NEGATIVE_INFINITY,c=Number.NEGATIVE_INFINITY;for(let h=0,u=s.length;h<u;h++){let d=s[h];if(!d.bone.active)continue;let f=0,p=null,x=null,m=d.getAttachment();if(m instanceof rs)f=8,p=se.setArraySize(n,f,0),m.computeWorldVertices(d,p,0,2),x=r.quadTriangles;else if(m instanceof fi){let g=m;f=g.worldVerticesLength,p=se.setArraySize(n,f,0),g.computeWorldVertices(d,0,f,p,0,2),x=g.triangles}else if(m instanceof di&&i!=null){i.clipStart(d,m);continue}if(p&&x){i!=null&&i.isClipping()&&(i.clipTriangles(p,x,x.length),p=i.clippedVertices,f=i.clippedVertices.length);for(let g=0,y=p.length;g<y;g+=2){let _=p[g],v=p[g+1];o=Math.min(o,_),l=Math.min(l,v),a=Math.max(a,_),c=Math.max(c,v)}}i?.clipEndWithSlot(d)}i?.clipEnd(),e.set(o,l),t.set(a-o,c-l)}update(e){this.time+=e}physicsTranslate(e,t){let n=this.physicsConstraints;for(let i=0,s=n.length;i<s;i++)n[i].translate(e,t)}physicsRotate(e,t,n){let i=this.physicsConstraints;for(let s=0,o=i.length;s<o;s++)i[s].rotate(e,t,n)}},In;(function(r){r[r.none=0]="none",r[r.reset=1]="reset",r[r.update=2]="update",r[r.pose=3]="pose"})(In||(In={}));var ta=class extends pi{_bone=null;set bone(e){this._bone=e}get bone(){if(this._bone)return this._bone;throw new Error("BoneData not set.")}x=0;y=0;rotate=0;scaleX=0;shearX=0;limit=0;step=0;inertia=0;strength=0;damping=0;massInverse=0;wind=0;gravity=0;mix=0;inertiaGlobal=!1;strengthGlobal=!1;dampingGlobal=!1;massGlobal=!1;windGlobal=!1;gravityGlobal=!1;mixGlobal=!1;constructor(e){super(e,0,!1)}};var na=class{name=null;bones=new Array;slots=new Array;skins=new Array;defaultSkin=null;events=new Array;animations=new Array;ikConstraints=new Array;transformConstraints=new Array;pathConstraints=new Array;physicsConstraints=new Array;x=0;y=0;width=0;height=0;referenceScale=100;version=null;hash=null;fps=0;imagesPath=null;audioPath=null;findBone(e){if(!e)throw new Error("boneName cannot be null.");let t=this.bones;for(let n=0,i=t.length;n<i;n++){let s=t[n];if(s.name==e)return s}return null}findSlot(e){if(!e)throw new Error("slotName cannot be null.");let t=this.slots;for(let n=0,i=t.length;n<i;n++){let s=t[n];if(s.name==e)return s}return null}findSkin(e){if(!e)throw new Error("skinName cannot be null.");let t=this.skins;for(let n=0,i=t.length;n<i;n++){let s=t[n];if(s.name==e)return s}return null}findEvent(e){if(!e)throw new Error("eventDataName cannot be null.");let t=this.events;for(let n=0,i=t.length;n<i;n++){let s=t[n];if(s.name==e)return s}return null}findAnimation(e){if(!e)throw new Error("animationName cannot be null.");let t=this.animations;for(let n=0,i=t.length;n<i;n++){let s=t[n];if(s.name==e)return s}return null}findIkConstraint(e){if(!e)throw new Error("constraintName cannot be null.");let t=this.ikConstraints;for(let n=0,i=t.length;n<i;n++){let s=t[n];if(s.name==e)return s}return null}findTransformConstraint(e){if(!e)throw new Error("constraintName cannot be null.");let t=this.transformConstraints;for(let n=0,i=t.length;n<i;n++){let s=t[n];if(s.name==e)return s}return null}findPathConstraint(e){if(!e)throw new Error("constraintName cannot be null.");let t=this.pathConstraints;for(let n=0,i=t.length;n<i;n++){let s=t[n];if(s.name==e)return s}return null}findPhysicsConstraint(e){if(!e)throw new Error("constraintName cannot be null.");let t=this.physicsConstraints;for(let n=0,i=t.length;n<i;n++){let s=t[n];if(s.name==e)return s}return null}};var Cc=class{slotIndex;name;attachment;constructor(e=0,t,n){this.slotIndex=e,this.name=t,this.attachment=n}},As=class{name;attachments=new Array;bones=Array();constraints=new Array;color=new Pe(.99607843,.61960787,.30980393,1);constructor(e){if(!e)throw new Error("name cannot be null.");this.name=e}setAttachment(e,t,n){if(!n)throw new Error("attachment cannot be null.");let i=this.attachments;e>=i.length&&(i.length=e+1),i[e]||(i[e]={}),i[e][t]=n}addSkin(e){for(let i=0;i<e.bones.length;i++){let s=e.bones[i],o=!1;for(let l=0;l<this.bones.length;l++)if(this.bones[l]==s){o=!0;break}o||this.bones.push(s)}for(let i=0;i<e.constraints.length;i++){let s=e.constraints[i],o=!1;for(let l=0;l<this.constraints.length;l++)if(this.constraints[l]==s){o=!0;break}o||this.constraints.push(s)}let t=e.getAttachments();for(let i=0;i<t.length;i++){var n=t[i];this.setAttachment(n.slotIndex,n.name,n.attachment)}}copySkin(e){for(let i=0;i<e.bones.length;i++){let s=e.bones[i],o=!1;for(let l=0;l<this.bones.length;l++)if(this.bones[l]==s){o=!0;break}o||this.bones.push(s)}for(let i=0;i<e.constraints.length;i++){let s=e.constraints[i],o=!1;for(let l=0;l<this.constraints.length;l++)if(this.constraints[l]==s){o=!0;break}o||this.constraints.push(s)}let t=e.getAttachments();for(let i=0;i<t.length;i++){var n=t[i];n.attachment&&(n.attachment instanceof fi?(n.attachment=n.attachment.newLinkedMesh(),this.setAttachment(n.slotIndex,n.name,n.attachment)):(n.attachment=n.attachment.copy(),this.setAttachment(n.slotIndex,n.name,n.attachment)))}}getAttachment(e,t){let n=this.attachments[e];return n?n[t]:null}removeAttachment(e,t){let n=this.attachments[e];n&&delete n[t]}getAttachments(){let e=new Array;for(var t=0;t<this.attachments.length;t++){let n=this.attachments[t];if(n)for(let i in n){let s=n[i];s&&e.push(new Cc(t,i,s))}}return e}getAttachmentsForSlot(e,t){let n=this.attachments[e];if(n)for(let i in n){let s=n[i];s&&t.push(new Cc(e,i,s))}}clear(){this.attachments.length=0,this.bones.length=0,this.constraints.length=0}attachAll(e,t){let n=0;for(let i=0;i<e.slots.length;i++){let s=e.slots[i],o=s.getAttachment();if(o&&n<t.attachments.length){let l=t.attachments[n];for(let a in l){let c=l[a];if(o==c){let h=this.getAttachment(n,a);h&&s.setAttachment(h);break}}}n++}}};var ia=class{index=0;name;boneData;color=new Pe(1,1,1,1);darkColor=null;attachmentName=null;blendMode=mi.Normal;visible=!0;constructor(e,t,n){if(e<0)throw new Error("index must be >= 0.");if(!t)throw new Error("name cannot be null.");if(!n)throw new Error("boneData cannot be null.");this.index=e,this.name=t,this.boneData=n}},mi;(function(r){r[r.Normal=0]="Normal",r[r.Additive=1]="Additive",r[r.Multiply=2]="Multiply",r[r.Screen=3]="Screen"})(mi||(mi={}));var sa=class extends pi{bones=new Array;_target=null;set target(e){this._target=e}get target(){if(this._target)return this._target;throw new Error("BoneData not set.")}mixRotate=0;mixX=0;mixY=0;mixScaleX=0;mixScaleY=0;mixShearY=0;offsetRotation=0;offsetX=0;offsetY=0;offsetScaleX=0;offsetScaleY=0;offsetShearY=0;relative=!1;local=!1;constructor(e){super(e,0,!1)}};var Ic=class{scale=1;attachmentLoader;linkedMeshes=new Array;constructor(e){this.attachmentLoader=e}readSkeletonData(e){let t=this.scale,n=new na;n.name="";let i=new id(e),s=i.readInt32(),o=i.readInt32();n.hash=o==0&&s==0?null:o.toString(16)+s.toString(16),n.version=i.readString(),n.x=i.readFloat(),n.y=i.readFloat(),n.width=i.readFloat(),n.height=i.readFloat(),n.referenceScale=i.readFloat()*t;let l=i.readBoolean();l&&(n.fps=i.readFloat(),n.imagesPath=i.readString(),n.audioPath=i.readString());let a=0;a=i.readInt(!0);for(let h=0;h<a;h++){let u=i.readString();if(!u)throw new Error("String in string table must not be null.");i.strings.push(u)}a=i.readInt(!0);for(let h=0;h<a;h++){let u=i.readString();if(!u)throw new Error("Bone name must not be null.");let d=h==0?null:n.bones[i.readInt(!0)],f=new Kr(h,u,d);f.rotation=i.readFloat(),f.x=i.readFloat()*t,f.y=i.readFloat()*t,f.scaleX=i.readFloat(),f.scaleY=i.readFloat(),f.shearX=i.readFloat(),f.shearY=i.readFloat(),f.length=i.readFloat()*t,f.inherit=i.readByte(),f.skinRequired=i.readBoolean(),l&&(Pe.rgba8888ToColor(f.color,i.readInt32()),f.icon=i.readString()??void 0,f.visible=i.readBoolean()),n.bones.push(f)}a=i.readInt(!0);for(let h=0;h<a;h++){let u=i.readString();if(!u)throw new Error("Slot name must not be null.");let d=n.bones[i.readInt(!0)],f=new ia(h,u,d);Pe.rgba8888ToColor(f.color,i.readInt32());let p=i.readInt32();p!=-1&&Pe.rgb888ToColor(f.darkColor=new Pe,p),f.attachmentName=i.readStringRef(),f.blendMode=i.readInt(!0),l&&(f.visible=i.readBoolean()),n.slots.push(f)}a=i.readInt(!0);for(let h=0,u;h<a;h++){let d=i.readString();if(!d)throw new Error("IK constraint data name must not be null.");let f=new jr(d);f.order=i.readInt(!0),u=i.readInt(!0);for(let x=0;x<u;x++)f.bones.push(n.bones[i.readInt(!0)]);f.target=n.bones[i.readInt(!0)];let p=i.readByte();f.skinRequired=(p&1)!=0,f.bendDirection=(p&2)!=0?1:-1,f.compress=(p&4)!=0,f.stretch=(p&8)!=0,f.uniform=(p&16)!=0,(p&32)!=0&&(f.mix=(p&64)!=0?i.readFloat():1),(p&128)!=0&&(f.softness=i.readFloat()*t),n.ikConstraints.push(f)}a=i.readInt(!0);for(let h=0,u;h<a;h++){let d=i.readString();if(!d)throw new Error("Transform constraint data name must not be null.");let f=new sa(d);f.order=i.readInt(!0),u=i.readInt(!0);for(let x=0;x<u;x++)f.bones.push(n.bones[i.readInt(!0)]);f.target=n.bones[i.readInt(!0)];let p=i.readByte();f.skinRequired=(p&1)!=0,f.local=(p&2)!=0,f.relative=(p&4)!=0,(p&8)!=0&&(f.offsetRotation=i.readFloat()),(p&16)!=0&&(f.offsetX=i.readFloat()*t),(p&32)!=0&&(f.offsetY=i.readFloat()*t),(p&64)!=0&&(f.offsetScaleX=i.readFloat()),(p&128)!=0&&(f.offsetScaleY=i.readFloat()),p=i.readByte(),(p&1)!=0&&(f.offsetShearY=i.readFloat()),(p&2)!=0&&(f.mixRotate=i.readFloat()),(p&4)!=0&&(f.mixX=i.readFloat()),(p&8)!=0&&(f.mixY=i.readFloat()),(p&16)!=0&&(f.mixScaleX=i.readFloat()),(p&32)!=0&&(f.mixScaleY=i.readFloat()),(p&64)!=0&&(f.mixShearY=i.readFloat()),n.transformConstraints.push(f)}a=i.readInt(!0);for(let h=0,u;h<a;h++){let d=i.readString();if(!d)throw new Error("Path constraint data name must not be null.");let f=new Qr(d);f.order=i.readInt(!0),f.skinRequired=i.readBoolean(),u=i.readInt(!0);for(let x=0;x<u;x++)f.bones.push(n.bones[i.readInt(!0)]);f.target=n.slots[i.readInt(!0)];let p=i.readByte();f.positionMode=p&1,f.spacingMode=p>>1&3,f.rotateMode=p>>3&3,(p&128)!=0&&(f.offsetRotation=i.readFloat()),f.position=i.readFloat(),f.positionMode==wn.Fixed&&(f.position*=t),f.spacing=i.readFloat(),(f.spacingMode==Pt.Length||f.spacingMode==Pt.Fixed)&&(f.spacing*=t),f.mixRotate=i.readFloat(),f.mixX=i.readFloat(),f.mixY=i.readFloat(),n.pathConstraints.push(f)}a=i.readInt(!0);for(let h=0,u;h<a;h++){let d=i.readString();if(!d)throw new Error("Physics constraint data name must not be null.");let f=new ta(d);f.order=i.readInt(!0),f.bone=n.bones[i.readInt(!0)];let p=i.readByte();f.skinRequired=(p&1)!=0,(p&2)!=0&&(f.x=i.readFloat()),(p&4)!=0&&(f.y=i.readFloat()),(p&8)!=0&&(f.rotate=i.readFloat()),(p&16)!=0&&(f.scaleX=i.readFloat()),(p&32)!=0&&(f.shearX=i.readFloat()),f.limit=((p&64)!=0?i.readFloat():5e3)*t,f.step=1/i.readUnsignedByte(),f.inertia=i.readFloat(),f.strength=i.readFloat(),f.damping=i.readFloat(),f.massInverse=(p&128)!=0?i.readFloat():1,f.wind=i.readFloat(),f.gravity=i.readFloat(),p=i.readByte(),(p&1)!=0&&(f.inertiaGlobal=!0),(p&2)!=0&&(f.strengthGlobal=!0),(p&4)!=0&&(f.dampingGlobal=!0),(p&8)!=0&&(f.massGlobal=!0),(p&16)!=0&&(f.windGlobal=!0),(p&32)!=0&&(f.gravityGlobal=!0),(p&64)!=0&&(f.mixGlobal=!0),f.mix=(p&128)!=0?i.readFloat():1,n.physicsConstraints.push(f)}let c=this.readSkin(i,n,!0,l);c&&(n.defaultSkin=c,n.skins.push(c));{let h=n.skins.length;for(se.setArraySize(n.skins,a=h+i.readInt(!0));h<a;h++){let u=this.readSkin(i,n,!1,l);if(!u)throw new Error("readSkin() should not have returned null.");n.skins[h]=u}}a=this.linkedMeshes.length;for(let h=0;h<a;h++){let u=this.linkedMeshes[h],d=n.skins[u.skinIndex];if(!u.parent)throw new Error("Linked mesh parent must not be null");let f=d.getAttachment(u.slotIndex,u.parent);if(!f)throw new Error(`Parent mesh not found: ${u.parent}`);u.mesh.timelineAttachment=u.inheritTimeline?f:u.mesh,u.mesh.setParentMesh(f),u.mesh.region!=null&&u.mesh.updateRegion()}this.linkedMeshes.length=0,a=i.readInt(!0);for(let h=0;h<a;h++){let u=i.readString();if(!u)throw new Error("Event data name must not be null");let d=new Jr(u);d.intValue=i.readInt(!1),d.floatValue=i.readFloat(),d.stringValue=i.readString(),d.audioPath=i.readString(),d.audioPath&&(d.volume=i.readFloat(),d.balance=i.readFloat()),n.events.push(d)}a=i.readInt(!0);for(let h=0;h<a;h++){let u=i.readString();if(!u)throw new Error("Animatio name must not be null.");n.animations.push(this.readAnimation(i,u,n))}return n}readSkin(e,t,n,i){let s=null,o=0;if(n){if(o=e.readInt(!0),o==0)return null;s=new As("default")}else{let l=e.readString();if(!l)throw new Error("Skin name must not be null.");s=new As(l),i&&Pe.rgba8888ToColor(s.color,e.readInt32()),s.bones.length=e.readInt(!0);for(let a=0,c=s.bones.length;a<c;a++)s.bones[a]=t.bones[e.readInt(!0)];for(let a=0,c=e.readInt(!0);a<c;a++)s.constraints.push(t.ikConstraints[e.readInt(!0)]);for(let a=0,c=e.readInt(!0);a<c;a++)s.constraints.push(t.transformConstraints[e.readInt(!0)]);for(let a=0,c=e.readInt(!0);a<c;a++)s.constraints.push(t.pathConstraints[e.readInt(!0)]);for(let a=0,c=e.readInt(!0);a<c;a++)s.constraints.push(t.physicsConstraints[e.readInt(!0)]);o=e.readInt(!0)}for(let l=0;l<o;l++){let a=e.readInt(!0);for(let c=0,h=e.readInt(!0);c<h;c++){let u=e.readStringRef();if(!u)throw new Error("Attachment name must not be null");let d=this.readAttachment(e,t,s,a,u,i);d&&s.setAttachment(a,u,d)}}return s}readAttachment(e,t,n,i,s,o){let l=this.scale,a=e.readByte(),c=(a&8)!=0?e.readStringRef():s;if(!c)throw new Error("Attachment name must not be null");switch(a&7){case Di.Region:{let h=(a&16)!=0?e.readStringRef():null,u=(a&32)!=0?e.readInt32():4294967295,d=(a&64)!=0?this.readSequence(e):null,f=(a&128)!=0?e.readFloat():0,p=e.readFloat(),x=e.readFloat(),m=e.readFloat(),g=e.readFloat(),y=e.readFloat(),_=e.readFloat();h||(h=c);let v=this.attachmentLoader.newRegionAttachment(n,c,h,d);return v?(v.path=h,v.x=p*l,v.y=x*l,v.scaleX=m,v.scaleY=g,v.rotation=f,v.width=y*l,v.height=_*l,Pe.rgba8888ToColor(v.color,u),v.sequence=d,d==null&&v.updateRegion(),v):null}case Di.BoundingBox:{let h=this.readVertices(e,(a&16)!=0),u=o?e.readInt32():0,d=this.attachmentLoader.newBoundingBoxAttachment(n,c);return d?(d.worldVerticesLength=h.length,d.vertices=h.vertices,d.bones=h.bones,o&&Pe.rgba8888ToColor(d.color,u),d):null}case Di.Mesh:{let h=(a&16)!=0?e.readStringRef():c,u=(a&32)!=0?e.readInt32():4294967295,d=(a&64)!=0?this.readSequence(e):null,f=e.readInt(!0),p=this.readVertices(e,(a&128)!=0),x=this.readFloatArray(e,p.length,1),m=this.readShortArray(e,(p.length-f-2)*3),g=[],y=0,_=0;o&&(g=this.readShortArray(e,e.readInt(!0)),y=e.readFloat(),_=e.readFloat()),h||(h=c);let v=this.attachmentLoader.newMeshAttachment(n,c,h,d);return v?(v.path=h,Pe.rgba8888ToColor(v.color,u),v.bones=p.bones,v.vertices=p.vertices,v.worldVerticesLength=p.length,v.triangles=m,v.regionUVs=x,d==null&&v.updateRegion(),v.hullLength=f<<1,v.sequence=d,o&&(v.edges=g,v.width=y*l,v.height=_*l),v):null}case Di.LinkedMesh:{let h=(a&16)!=0?e.readStringRef():c;if(h==null)throw new Error("Path of linked mesh must not be null");let u=(a&32)!=0?e.readInt32():4294967295,d=(a&64)!=0?this.readSequence(e):null,f=(a&128)!=0,p=e.readInt(!0),x=e.readStringRef(),m=0,g=0;o&&(m=e.readFloat(),g=e.readFloat());let y=this.attachmentLoader.newMeshAttachment(n,c,h,d);return y?(y.path=h,Pe.rgba8888ToColor(y.color,u),y.sequence=d,o&&(y.width=m*l,y.height=g*l),this.linkedMeshes.push(new sd(y,p,i,x,f)),y):null}case Di.Path:{let h=(a&16)!=0,u=(a&32)!=0,d=this.readVertices(e,(a&64)!=0),f=se.newArray(d.length/6,0);for(let m=0,g=f.length;m<g;m++)f[m]=e.readFloat()*l;let p=o?e.readInt32():0,x=this.attachmentLoader.newPathAttachment(n,c);return x?(x.closed=h,x.constantSpeed=u,x.worldVerticesLength=d.length,x.vertices=d.vertices,x.bones=d.bones,x.lengths=f,o&&Pe.rgba8888ToColor(x.color,p),x):null}case Di.Point:{let h=e.readFloat(),u=e.readFloat(),d=e.readFloat(),f=o?e.readInt32():0,p=this.attachmentLoader.newPointAttachment(n,c);return p?(p.x=u*l,p.y=d*l,p.rotation=h,o&&Pe.rgba8888ToColor(p.color,f),p):null}case Di.Clipping:{let h=e.readInt(!0),u=this.readVertices(e,(a&16)!=0),d=o?e.readInt32():0,f=this.attachmentLoader.newClippingAttachment(n,c);return f?(f.endSlot=t.slots[h],f.worldVerticesLength=u.length,f.vertices=u.vertices,f.bones=u.bones,o&&Pe.rgba8888ToColor(f.color,d),f):null}}return null}readSequence(e){let t=new _r(e.readInt(!0));return t.start=e.readInt(!0),t.digits=e.readInt(!0),t.setupIndex=e.readInt(!0),t}readVertices(e,t){let n=this.scale,i=e.readInt(!0),s=new rd;if(s.length=i<<1,!t)return s.vertices=this.readFloatArray(e,s.length,n),s;let o=new Array,l=new Array;for(let a=0;a<i;a++){let c=e.readInt(!0);l.push(c);for(let h=0;h<c;h++)l.push(e.readInt(!0)),o.push(e.readFloat()*n),o.push(e.readFloat()*n),o.push(e.readFloat())}return s.vertices=se.toFloatArray(o),s.bones=l,s}readFloatArray(e,t,n){let i=new Array(t);if(n==1)for(let s=0;s<t;s++)i[s]=e.readFloat();else for(let s=0;s<t;s++)i[s]=e.readFloat()*n;return i}readShortArray(e,t){let n=new Array(t);for(let i=0;i<t;i++)n[i]=e.readInt(!0);return n}readAnimation(e,t,n){e.readInt(!0);let i=new Array,s=this.scale;for(let c=0,h=e.readInt(!0);c<h;c++){let u=e.readInt(!0);for(let d=0,f=e.readInt(!0);d<f;d++){let p=e.readByte(),x=e.readInt(!0),m=x-1;switch(p){case xv:{let g=new Gn(x,u);for(let y=0;y<x;y++)g.setFrame(y,e.readFloat(),e.readStringRef());i.push(g);break}case _v:{let g=e.readInt(!0),y=new Cr(x,g,u),_=e.readFloat(),v=e.readUnsignedByte()/255,S=e.readUnsignedByte()/255,b=e.readUnsignedByte()/255,w=e.readUnsignedByte()/255;for(let M=0,A=0;y.setFrame(M,_,v,S,b,w),M!=m;M++){let C=e.readFloat(),E=e.readUnsignedByte()/255,N=e.readUnsignedByte()/255,F=e.readUnsignedByte()/255,L=e.readUnsignedByte()/255;switch(e.readByte()){case gi:y.setStepped(M);break;case xi:tt(e,y,A++,M,0,_,C,v,E,1),tt(e,y,A++,M,1,_,C,S,N,1),tt(e,y,A++,M,2,_,C,b,F,1),tt(e,y,A++,M,3,_,C,w,L,1)}_=C,v=E,S=N,b=F,w=L}i.push(y);break}case yv:{let g=e.readInt(!0),y=new Ir(x,g,u),_=e.readFloat(),v=e.readUnsignedByte()/255,S=e.readUnsignedByte()/255,b=e.readUnsignedByte()/255;for(let w=0,M=0;y.setFrame(w,_,v,S,b),w!=m;w++){let A=e.readFloat(),C=e.readUnsignedByte()/255,E=e.readUnsignedByte()/255,N=e.readUnsignedByte()/255;switch(e.readByte()){case gi:y.setStepped(w);break;case xi:tt(e,y,M++,w,0,_,A,v,C,1),tt(e,y,M++,w,1,_,A,S,E,1),tt(e,y,M++,w,2,_,A,b,N,1)}_=A,v=C,S=E,b=N}i.push(y);break}case vv:{let g=e.readInt(!0),y=new Lr(x,g,u),_=e.readFloat(),v=e.readUnsignedByte()/255,S=e.readUnsignedByte()/255,b=e.readUnsignedByte()/255,w=e.readUnsignedByte()/255,M=e.readUnsignedByte()/255,A=e.readUnsignedByte()/255,C=e.readUnsignedByte()/255;for(let E=0,N=0;y.setFrame(E,_,v,S,b,w,M,A,C),E!=m;E++){let F=e.readFloat(),L=e.readUnsignedByte()/255,I=e.readUnsignedByte()/255,D=e.readUnsignedByte()/255,U=e.readUnsignedByte()/255,Y=e.readUnsignedByte()/255,X=e.readUnsignedByte()/255,ee=e.readUnsignedByte()/255;switch(e.readByte()){case gi:y.setStepped(E);break;case xi:tt(e,y,N++,E,0,_,F,v,L,1),tt(e,y,N++,E,1,_,F,S,I,1),tt(e,y,N++,E,2,_,F,b,D,1),tt(e,y,N++,E,3,_,F,w,U,1),tt(e,y,N++,E,4,_,F,M,Y,1),tt(e,y,N++,E,5,_,F,A,X,1),tt(e,y,N++,E,6,_,F,C,ee,1)}_=F,v=L,S=I,b=D,w=U,M=Y,A=X,C=ee}i.push(y);break}case bv:{let g=e.readInt(!0),y=new Nr(x,g,u),_=e.readFloat(),v=e.readUnsignedByte()/255,S=e.readUnsignedByte()/255,b=e.readUnsignedByte()/255,w=e.readUnsignedByte()/255,M=e.readUnsignedByte()/255,A=e.readUnsignedByte()/255;for(let C=0,E=0;y.setFrame(C,_,v,S,b,w,M,A),C!=m;C++){let N=e.readFloat(),F=e.readUnsignedByte()/255,L=e.readUnsignedByte()/255,I=e.readUnsignedByte()/255,D=e.readUnsignedByte()/255,U=e.readUnsignedByte()/255,Y=e.readUnsignedByte()/255;switch(e.readByte()){case gi:y.setStepped(C);break;case xi:tt(e,y,E++,C,0,_,N,v,F,1),tt(e,y,E++,C,1,_,N,S,L,1),tt(e,y,E++,C,2,_,N,b,I,1),tt(e,y,E++,C,3,_,N,w,D,1),tt(e,y,E++,C,4,_,N,M,U,1),tt(e,y,E++,C,5,_,N,A,Y,1)}_=N,v=F,S=L,b=I,w=D,M=U,A=Y}i.push(y);break}case Mv:{let g=new Pr(x,e.readInt(!0),u),y=e.readFloat(),_=e.readUnsignedByte()/255;for(let v=0,S=0;g.setFrame(v,y,_),v!=m;v++){let b=e.readFloat(),w=e.readUnsignedByte()/255;switch(e.readByte()){case gi:g.setStepped(v);break;case xi:tt(e,g,S++,v,0,y,b,_,w,1)}y=b,_=w}i.push(g)}}}}for(let c=0,h=e.readInt(!0);c<h;c++){let u=e.readInt(!0);for(let d=0,f=e.readInt(!0);d<f;d++){let p=e.readByte(),x=e.readInt(!0);if(p==gv){let g=new Rr(x,u);for(let y=0;y<x;y++)g.setFrame(y,e.readFloat(),e.readByte());i.push(g);continue}let m=e.readInt(!0);switch(p){case av:i.push(nn(e,new Pi(x,m,u),1));break;case ov:i.push(nd(e,new yr(x,m,u),s));break;case lv:i.push(nn(e,new vr(x,m,u),s));break;case cv:i.push(nn(e,new br(x,m,u),s));break;case hv:i.push(nd(e,new Mr(x,m,u),1));break;case uv:i.push(nn(e,new Sr(x,m,u),1));break;case dv:i.push(nn(e,new wr(x,m,u),1));break;case fv:i.push(nd(e,new Tr(x,m,u),1));break;case pv:i.push(nn(e,new Ar(x,m,u),1));break;case mv:i.push(nn(e,new Er(x,m,u),1))}}}for(let c=0,h=e.readInt(!0);c<h;c++){let u=e.readInt(!0),d=e.readInt(!0),f=d-1,p=new Dr(d,e.readInt(!0),u),x=e.readByte(),m=e.readFloat(),g=(x&1)!=0?(x&2)!=0?e.readFloat():1:0,y=(x&4)!=0?e.readFloat()*s:0;for(let _=0,v=0;p.setFrame(_,m,g,y,(x&8)!=0?1:-1,(x&16)!=0,(x&32)!=0),_!=f;_++){x=e.readByte();let S=e.readFloat(),b=(x&1)!=0?(x&2)!=0?e.readFloat():1:0,w=(x&4)!=0?e.readFloat()*s:0;(x&64)!=0?p.setStepped(_):(x&128)!=0&&(tt(e,p,v++,_,0,m,S,g,b,1),tt(e,p,v++,_,1,m,S,y,w,s)),m=S,g=b,y=w}i.push(p)}for(let c=0,h=e.readInt(!0);c<h;c++){let u=e.readInt(!0),d=e.readInt(!0),f=d-1,p=new Ur(d,e.readInt(!0),u),x=e.readFloat(),m=e.readFloat(),g=e.readFloat(),y=e.readFloat(),_=e.readFloat(),v=e.readFloat(),S=e.readFloat();for(let b=0,w=0;p.setFrame(b,x,m,g,y,_,v,S),b!=f;b++){let M=e.readFloat(),A=e.readFloat(),C=e.readFloat(),E=e.readFloat(),N=e.readFloat(),F=e.readFloat(),L=e.readFloat();switch(e.readByte()){case gi:p.setStepped(b);break;case xi:tt(e,p,w++,b,0,x,M,m,A,1),tt(e,p,w++,b,1,x,M,g,C,1),tt(e,p,w++,b,2,x,M,y,E,1),tt(e,p,w++,b,3,x,M,_,N,1),tt(e,p,w++,b,4,x,M,v,F,1),tt(e,p,w++,b,5,x,M,S,L,1)}x=M,m=A,g=C,y=E,_=N,v=F,S=L}i.push(p)}for(let c=0,h=e.readInt(!0);c<h;c++){let u=e.readInt(!0),d=n.pathConstraints[u];for(let f=0,p=e.readInt(!0);f<p;f++){let x=e.readByte(),m=e.readInt(!0),g=e.readInt(!0);switch(x){case Tv:i.push(nn(e,new Or(m,g,u),d.positionMode==wn.Fixed?s:1));break;case Av:i.push(nn(e,new Br(m,g,u),d.spacingMode==Pt.Length||d.spacingMode==Pt.Fixed?s:1));break;case Ev:let y=new kr(m,g,u),_=e.readFloat(),v=e.readFloat(),S=e.readFloat(),b=e.readFloat();for(let w=0,M=0,A=y.getFrameCount()-1;y.setFrame(w,_,v,S,b),w!=A;w++){let C=e.readFloat(),E=e.readFloat(),N=e.readFloat(),F=e.readFloat();switch(e.readByte()){case gi:y.setStepped(w);break;case xi:tt(e,y,M++,w,0,_,C,v,E,1),tt(e,y,M++,w,1,_,C,S,N,1),tt(e,y,M++,w,2,_,C,b,F,1)}_=C,v=E,S=N,b=F}i.push(y)}}}for(let c=0,h=e.readInt(!0);c<h;c++){let u=e.readInt(!0)-1;for(let d=0,f=e.readInt(!0);d<f;d++){let p=e.readByte(),x=e.readInt(!0);if(p==Dv){let g=new qr(x,u);for(let y=0;y<x;y++)g.setFrame(y,e.readFloat());i.push(g);continue}let m=e.readInt(!0);switch(p){case Rv:i.push(nn(e,new Vr(x,m,u),1));break;case Cv:i.push(nn(e,new zr(x,m,u),1));break;case Iv:i.push(nn(e,new Hr(x,m,u),1));break;case Pv:i.push(nn(e,new Gr(x,m,u),1));break;case Lv:i.push(nn(e,new Wr(x,m,u),1));break;case Nv:i.push(nn(e,new Xr(x,m,u),1));break;case Fv:i.push(nn(e,new Yr(x,m,u),1))}}}for(let c=0,h=e.readInt(!0);c<h;c++){let u=n.skins[e.readInt(!0)];for(let d=0,f=e.readInt(!0);d<f;d++){let p=e.readInt(!0);for(let x=0,m=e.readInt(!0);x<m;x++){let g=e.readStringRef();if(!g)throw new Error("attachmentName must not be null.");let y=u.getAttachment(p,g),_=e.readByte(),v=e.readInt(!0),S=v-1;switch(_){case Sv:{let b=y,w=b.bones,M=b.vertices,A=w?M.length/3*2:M.length,C=e.readInt(!0),E=new Fr(v,C,p,b),N=e.readFloat();for(let F=0,L=0;;F++){let I,D=e.readInt(!0);if(D==0)I=w?se.newFloatArray(A):M;else{I=se.newFloatArray(A);let Y=e.readInt(!0);if(D+=Y,s==1)for(let X=Y;X<D;X++)I[X]=e.readFloat();else for(let X=Y;X<D;X++)I[X]=e.readFloat()*s;if(!w)for(let X=0,ee=I.length;X<ee;X++)I[X]+=M[X]}if(E.setFrame(F,N,I),F==S)break;let U=e.readFloat();switch(e.readByte()){case gi:E.setStepped(F);break;case xi:tt(e,E,L++,F,0,N,U,0,1,1)}N=U}i.push(E);break}case wv:{let b=new $r(v,p,y);for(let w=0;w<v;w++){let M=e.readFloat(),A=e.readInt32();b.setFrame(w,M,xc[A&15],A>>4,e.readFloat())}i.push(b);break}}}}}let o=e.readInt(!0);if(o>0){let c=new ui(o),h=n.slots.length;for(let u=0;u<o;u++){let d=e.readFloat(),f=e.readInt(!0),p=se.newArray(h,0);for(let y=h-1;y>=0;y--)p[y]=-1;let x=se.newArray(h-f,0),m=0,g=0;for(let y=0;y<f;y++){let _=e.readInt(!0);for(;m!=_;)x[g++]=m++;p[m+e.readInt(!0)]=m++}for(;m<h;)x[g++]=m++;for(let y=h-1;y>=0;y--)p[y]==-1&&(p[y]=x[--g]);c.setFrame(u,d,p)}i.push(c)}let l=e.readInt(!0);if(l>0){let c=new ss(l);for(let h=0;h<l;h++){let u=e.readFloat(),d=n.events[e.readInt(!0)],f=new Zr(u,d);f.intValue=e.readInt(!1),f.floatValue=e.readFloat(),f.stringValue=e.readString(),f.stringValue==null&&(f.stringValue=d.stringValue),f.data.audioPath&&(f.volume=e.readFloat(),f.balance=e.readFloat()),c.setFrame(h,f)}i.push(c)}let a=0;for(let c=0,h=i.length;c<h;c++)a=Math.max(a,i[c].getDuration());return new is(t,i,a)}},id=class{strings;index;buffer;constructor(e,t=new Array,n=0,i=new DataView(e instanceof ArrayBuffer?e:e.buffer)){this.strings=t,this.index=n,this.buffer=i}readByte(){return this.buffer.getInt8(this.index++)}readUnsignedByte(){return this.buffer.getUint8(this.index++)}readShort(){let e=this.buffer.getInt16(this.index);return this.index+=2,e}readInt32(){let e=this.buffer.getInt32(this.index);return this.index+=4,e}readInt(e){let t=this.readByte(),n=t&127;return(t&128)!=0&&(t=this.readByte(),n|=(t&127)<<7,(t&128)!=0&&(t=this.readByte(),n|=(t&127)<<14,(t&128)!=0&&(t=this.readByte(),n|=(t&127)<<21,(t&128)!=0&&(t=this.readByte(),n|=(t&127)<<28)))),e?n:n>>>1^-(n&1)}readStringRef(){let e=this.readInt(!0);return e==0?null:this.strings[e-1]}readString(){let e=this.readInt(!0);switch(e){case 0:return null;case 1:return""}e--;let t="",n=0;for(let i=0;i<e;){let s=this.readUnsignedByte();switch(s>>4){case 12:case 13:t+=String.fromCharCode((s&31)<<6|this.readByte()&63),i+=2;break;case 14:t+=String.fromCharCode((s&15)<<12|(this.readByte()&63)<<6|this.readByte()&63),i+=3;break;default:t+=String.fromCharCode(s),i++}}return t}readFloat(){let e=this.buffer.getFloat32(this.index);return this.index+=4,e}readBoolean(){return this.readByte()!=0}},sd=class{parent;skinIndex;slotIndex;mesh;inheritTimeline;constructor(e,t,n,i,s){this.mesh=e,this.skinIndex=t,this.slotIndex=n,this.parent=i,this.inheritTimeline=s}},rd=class{bones;vertices;length;constructor(e=null,t=null,n=0){this.bones=e,this.vertices=t,this.length=n}},Di;(function(r){r[r.Region=0]="Region",r[r.BoundingBox=1]="BoundingBox",r[r.Mesh=2]="Mesh",r[r.LinkedMesh=3]="LinkedMesh",r[r.Path=4]="Path",r[r.Point=5]="Point",r[r.Clipping=6]="Clipping"})(Di||(Di={}));function nn(r,e,t){let n=r.readFloat(),i=r.readFloat()*t;for(let s=0,o=0,l=e.getFrameCount()-1;e.setFrame(s,n,i),s!=l;s++){let a=r.readFloat(),c=r.readFloat()*t;switch(r.readByte()){case gi:e.setStepped(s);break;case xi:tt(r,e,o++,s,0,n,a,i,c,t)}n=a,i=c}return e}function nd(r,e,t){let n=r.readFloat(),i=r.readFloat()*t,s=r.readFloat()*t;for(let o=0,l=0,a=e.getFrameCount()-1;e.setFrame(o,n,i,s),o!=a;o++){let c=r.readFloat(),h=r.readFloat()*t,u=r.readFloat()*t;switch(r.readByte()){case gi:e.setStepped(o);break;case xi:tt(r,e,l++,o,0,n,c,i,h,t),tt(r,e,l++,o,1,n,c,s,u,t)}n=c,i=h,s=u}return e}function tt(r,e,t,n,i,s,o,l,a,c){e.setBezier(t,n,i,s,l,r.readFloat(),r.readFloat()*c,r.readFloat(),r.readFloat()*c,o,a)}var av=0,ov=1,lv=2,cv=3,hv=4,uv=5,dv=6,fv=7,pv=8,mv=9,gv=10,xv=0,_v=1,yv=2,vv=3,bv=4,Mv=5,Sv=0,wv=1,Tv=0,Av=1,Ev=2,Rv=0,Cv=1,Iv=2,Pv=4,Lv=5,Nv=6,Fv=7,Dv=8;var gi=1,xi=2;var Pc=class r{convexPolygons=new Array;convexPolygonsIndices=new Array;indicesArray=new Array;isConcaveArray=new Array;triangles=new Array;polygonPool=new ns(()=>new Array);polygonIndicesPool=new ns(()=>new Array);triangulate(e){let t=e,n=e.length>>1,i=this.indicesArray;i.length=0;for(let l=0;l<n;l++)i[l]=l;let s=this.isConcaveArray;s.length=0;for(let l=0,a=n;l<a;++l)s[l]=r.isConcave(l,n,t,i);let o=this.triangles;for(o.length=0;n>3;){let l=n-1,a=0,c=1;for(;;){e:if(!s[a]){let d=i[l]<<1,f=i[a]<<1,p=i[c]<<1,x=t[d],m=t[d+1],g=t[f],y=t[f+1],_=t[p],v=t[p+1];for(let S=(c+1)%n;S!=l;S=(S+1)%n){if(!s[S])continue;let b=i[S]<<1,w=t[b],M=t[b+1];if(r.positiveArea(_,v,x,m,w,M)&&r.positiveArea(x,m,g,y,w,M)&&r.positiveArea(g,y,_,v,w,M))break e}break}if(c==0){do{if(!s[a])break;a--}while(a>0);break}l=a,a=c,c=(c+1)%n}o.push(i[(n+a-1)%n]),o.push(i[a]),o.push(i[(a+1)%n]),i.splice(a,1),s.splice(a,1),n--;let h=(n+a-1)%n,u=a==n?0:a;s[h]=r.isConcave(h,n,t,i),s[u]=r.isConcave(u,n,t,i)}return n==3&&(o.push(i[2]),o.push(i[0]),o.push(i[1])),o}decompose(e,t){let n=e,i=this.convexPolygons;this.polygonPool.freeAll(i),i.length=0;let s=this.convexPolygonsIndices;this.polygonIndicesPool.freeAll(s),s.length=0;let o=this.polygonIndicesPool.obtain();o.length=0;let l=this.polygonPool.obtain();l.length=0;let a=-1,c=0;for(let h=0,u=t.length;h<u;h+=3){let d=t[h]<<1,f=t[h+1]<<1,p=t[h+2]<<1,x=n[d],m=n[d+1],g=n[f],y=n[f+1],_=n[p],v=n[p+1],S=!1;if(a==d){let b=l.length-4,w=r.winding(l[b],l[b+1],l[b+2],l[b+3],_,v),M=r.winding(_,v,l[0],l[1],l[2],l[3]);w==c&&M==c&&(l.push(_),l.push(v),o.push(p),S=!0)}S||(l.length>0?(i.push(l),s.push(o)):(this.polygonPool.free(l),this.polygonIndicesPool.free(o)),l=this.polygonPool.obtain(),l.length=0,l.push(x),l.push(m),l.push(g),l.push(y),l.push(_),l.push(v),o=this.polygonIndicesPool.obtain(),o.length=0,o.push(d),o.push(f),o.push(p),c=r.winding(x,m,g,y,_,v),a=d)}l.length>0&&(i.push(l),s.push(o));for(let h=0,u=i.length;h<u;h++){if(o=s[h],o.length==0)continue;let d=o[0],f=o[o.length-1];l=i[h];let p=l.length-4,x=l[p],m=l[p+1],g=l[p+2],y=l[p+3],_=l[0],v=l[1],S=l[2],b=l[3],w=r.winding(x,m,g,y,_,v);for(let M=0;M<u;M++){if(M==h)continue;let A=s[M];if(A.length!=3)continue;let C=A[0],E=A[1],N=A[2],F=i[M],L=F[F.length-2],I=F[F.length-1];if(C!=d||E!=f)continue;let D=r.winding(x,m,g,y,L,I),U=r.winding(L,I,_,v,S,b);D==w&&U==w&&(F.length=0,A.length=0,l.push(L),l.push(I),o.push(N),x=g,m=y,g=L,y=I,M=0)}}for(let h=i.length-1;h>=0;h--)l=i[h],l.length==0&&(i.splice(h,1),this.polygonPool.free(l),o=s[h],s.splice(h,1),this.polygonIndicesPool.free(o));return i}static isConcave(e,t,n,i){let s=i[(t+e-1)%t]<<1,o=i[e]<<1,l=i[(e+1)%t]<<1;return!this.positiveArea(n[s],n[s+1],n[o],n[o+1],n[l],n[l+1])}static positiveArea(e,t,n,i,s,o){return e*(o-i)+n*(t-o)+s*(i-t)>=0}static winding(e,t,n,i,s,o){let l=n-e,a=i-t;return s*a-o*l+l*t-e*a>=0?1:-1}};var Lc=class r{triangulator=new Pc;clippingPolygon=new Array;clipOutput=new Array;clippedVertices=new Array;clippedUVs=new Array;clippedTriangles=new Array;scratch=new Array;clipAttachment=null;clippingPolygons=null;clipStart(e,t){if(this.clipAttachment)return 0;this.clipAttachment=t;let n=t.worldVerticesLength,i=se.setArraySize(this.clippingPolygon,n);t.computeWorldVertices(e,0,n,i,0,2);let s=this.clippingPolygon;r.makeClockwise(s);let o=this.clippingPolygons=this.triangulator.decompose(s,this.triangulator.triangulate(s));for(let l=0,a=o.length;l<a;l++){let c=o[l];r.makeClockwise(c),c.push(c[0]),c.push(c[1])}return o.length}clipEndWithSlot(e){this.clipAttachment&&this.clipAttachment.endSlot==e.data&&this.clipEnd()}clipEnd(){this.clipAttachment&&(this.clipAttachment=null,this.clippingPolygons=null,this.clippedVertices.length=0,this.clippedTriangles.length=0,this.clippingPolygon.length=0)}isClipping(){return this.clipAttachment!=null}clipTriangles(e,t,n,i,s,o,l,a){let c,h,u,d,f,p;typeof t=="number"?(c=n,h=i,u=s,d=o,f=l,p=a):(c=t,h=n,u=i,d=s,f=o,p=l),u&&d&&f&&typeof p=="boolean"?this.clipTrianglesRender(e,c,h,u,d,f,p):this.clipTrianglesNoRender(e,c,h)}clipTrianglesNoRender(e,t,n){let i=this.clipOutput,s=this.clippedVertices,o=this.clippedTriangles,l=this.clippingPolygons,a=l.length,c=0;s.length=0,o.length=0;for(let h=0;h<n;h+=3){let u=t[h]<<1,d=e[u],f=e[u+1];u=t[h+1]<<1;let p=e[u],x=e[u+1];u=t[h+2]<<1;let m=e[u],g=e[u+1];for(let y=0;y<a;y++){let _=s.length;if(this.clip(d,f,p,x,m,g,l[y],i)){let v=i.length;if(v==0)continue;let S=v>>1,b=this.clipOutput,w=se.setArraySize(s,_+S*2);for(let A=0;A<v;A+=2,_+=2){let C=b[A],E=b[A+1];w[_]=C,w[_+1]=E}_=o.length;let M=se.setArraySize(o,_+3*(S-2));S--;for(let A=1;A<S;A++,_+=3)M[_]=c,M[_+1]=c+A,M[_+2]=c+A+1;c+=S+1}else{let v=se.setArraySize(s,_+6);v[_]=d,v[_+1]=f,v[_+2]=p,v[_+3]=x,v[_+4]=m,v[_+5]=g,_=o.length;let S=se.setArraySize(o,_+3);S[_]=c,S[_+1]=c+1,S[_+2]=c+2,c+=3;break}}}}clipTrianglesRender(e,t,n,i,s,o,l){let a=this.clipOutput,c=this.clippedVertices,h=this.clippedTriangles,u=this.clippingPolygons,d=u.length,f=l?12:8,p=0;c.length=0,h.length=0;for(let x=0;x<n;x+=3){let m=t[x]<<1,g=e[m],y=e[m+1],_=i[m],v=i[m+1];m=t[x+1]<<1;let S=e[m],b=e[m+1],w=i[m],M=i[m+1];m=t[x+2]<<1;let A=e[m],C=e[m+1],E=i[m],N=i[m+1];for(let F=0;F<d;F++){let L=c.length;if(this.clip(g,y,S,b,A,C,u[F],a)){let I=a.length;if(I==0)continue;let D=b-C,U=A-S,Y=g-A,X=C-y,ee=1/(D*Y+U*(y-C)),ae=I>>1,ce=this.clipOutput,oe=se.setArraySize(c,L+ae*f);for(let me=0;me<I;me+=2,L+=f){let K=ce[me],le=ce[me+1];oe[L]=K,oe[L+1]=le,oe[L+2]=s.r,oe[L+3]=s.g,oe[L+4]=s.b,oe[L+5]=s.a;let te=K-A,Te=le-C,Re=(D*te+U*Te)*ee,Ne=(X*te+Y*Te)*ee,ot=1-Re-Ne;oe[L+6]=_*Re+w*Ne+E*ot,oe[L+7]=v*Re+M*Ne+N*ot,l&&(oe[L+8]=o.r,oe[L+9]=o.g,oe[L+10]=o.b,oe[L+11]=o.a)}L=h.length;let Me=se.setArraySize(h,L+3*(ae-2));ae--;for(let me=1;me<ae;me++,L+=3)Me[L]=p,Me[L+1]=p+me,Me[L+2]=p+me+1;p+=ae+1}else{let I=se.setArraySize(c,L+3*f);I[L]=g,I[L+1]=y,I[L+2]=s.r,I[L+3]=s.g,I[L+4]=s.b,I[L+5]=s.a,l?(I[L+6]=_,I[L+7]=v,I[L+8]=o.r,I[L+9]=o.g,I[L+10]=o.b,I[L+11]=o.a,I[L+12]=S,I[L+13]=b,I[L+14]=s.r,I[L+15]=s.g,I[L+16]=s.b,I[L+17]=s.a,I[L+18]=w,I[L+19]=M,I[L+20]=o.r,I[L+21]=o.g,I[L+22]=o.b,I[L+23]=o.a,I[L+24]=A,I[L+25]=C,I[L+26]=s.r,I[L+27]=s.g,I[L+28]=s.b,I[L+29]=s.a,I[L+30]=E,I[L+31]=N,I[L+32]=o.r,I[L+33]=o.g,I[L+34]=o.b,I[L+35]=o.a):(I[L+6]=_,I[L+7]=v,I[L+8]=S,I[L+9]=b,I[L+10]=s.r,I[L+11]=s.g,I[L+12]=s.b,I[L+13]=s.a,I[L+14]=w,I[L+15]=M,I[L+16]=A,I[L+17]=C,I[L+18]=s.r,I[L+19]=s.g,I[L+20]=s.b,I[L+21]=s.a,I[L+22]=E,I[L+23]=N),L=h.length;let D=se.setArraySize(h,L+3);D[L]=p,D[L+1]=p+1,D[L+2]=p+2,p+=3;break}}}}clipTrianglesUnpacked(e,t,n,i){let s=this.clipOutput,o=this.clippedVertices,l=this.clippedUVs,a=this.clippedTriangles,c=this.clippingPolygons,h=c.length,u=0;o.length=0,l.length=0,a.length=0;for(let d=0;d<n;d+=3){let f=t[d]<<1,p=e[f],x=e[f+1],m=i[f],g=i[f+1];f=t[d+1]<<1;let y=e[f],_=e[f+1],v=i[f],S=i[f+1];f=t[d+2]<<1;let b=e[f],w=e[f+1],M=i[f],A=i[f+1];for(let C=0;C<h;C++){let E=o.length;if(this.clip(p,x,y,_,b,w,c[C],s)){let N=s.length;if(N==0)continue;let F=_-w,L=b-y,I=p-b,D=w-x,U=1/(F*I+L*(x-w)),Y=N>>1,X=this.clipOutput,ee=se.setArraySize(o,E+Y*2),ae=se.setArraySize(l,E+Y*2);for(let oe=0;oe<N;oe+=2,E+=2){let Me=X[oe],me=X[oe+1];ee[E]=Me,ee[E+1]=me;let K=Me-b,le=me-w,te=(F*K+L*le)*U,Te=(D*K+I*le)*U,Re=1-te-Te;ae[E]=m*te+v*Te+M*Re,ae[E+1]=g*te+S*Te+A*Re}E=a.length;let ce=se.setArraySize(a,E+3*(Y-2));Y--;for(let oe=1;oe<Y;oe++,E+=3)ce[E]=u,ce[E+1]=u+oe,ce[E+2]=u+oe+1;u+=Y+1}else{let N=se.setArraySize(o,E+6);N[E]=p,N[E+1]=x,N[E+2]=y,N[E+3]=_,N[E+4]=b,N[E+5]=w;let F=se.setArraySize(l,E+6);F[E]=m,F[E+1]=g,F[E+2]=v,F[E+3]=S,F[E+4]=M,F[E+5]=A,E=a.length;let L=se.setArraySize(a,E+3);L[E]=u,L[E+1]=u+1,L[E+2]=u+2,u+=3;break}}}}clip(e,t,n,i,s,o,l,a){let c=a,h=!1,u;l.length%4>=2?(u=a,a=this.scratch):u=this.scratch,u.length=0,u.push(e),u.push(t),u.push(n),u.push(i),u.push(s),u.push(o),u.push(e),u.push(t),a.length=0;let d=l.length-4,f=l;for(let p=0;;p+=2){let x=f[p],m=f[p+1],g=x-f[p+2],y=m-f[p+3],_=a.length,v=u;for(let b=0,w=u.length-2;b<w;){let M=v[b],A=v[b+1];b+=2;let C=v[b],E=v[b+1],N=y*(x-C)>g*(m-E),F=y*(x-M)-g*(m-A);if(F>0){if(N){a.push(C),a.push(E);continue}let L=C-M,I=E-A,D=F/(L*y-I*g);if(D>=0&&D<=1)a.push(M+L*D),a.push(A+I*D);else{a.push(C),a.push(E);continue}}else if(N){let L=C-M,I=E-A,D=F/(L*y-I*g);if(D>=0&&D<=1)a.push(M+L*D),a.push(A+I*D),a.push(C),a.push(E);else{a.push(C),a.push(E);continue}}h=!0}if(_==a.length)return c.length=0,!0;if(a.push(a[0]),a.push(a[1]),p==d)break;let S=a;a=u,a.length=0,u=S}if(c!=a){c.length=0;for(let p=0,x=a.length-2;p<x;p++)c[p]=a[p]}else c.length=c.length-2;return h}static makeClockwise(e){let t=e,n=e.length,i=t[n-2]*t[1]-t[0]*t[n-1],s=0,o=0,l=0,a=0;for(let c=0,h=n-3;c<h;c+=2)s=t[c],o=t[c+1],l=t[c+2],a=t[c+3],i+=s*a-l*o;if(!(i<0))for(let c=0,h=n-2,u=n>>1;c<u;c+=2){let d=t[c],f=t[c+1],p=h-c;t[c]=t[p],t[c+1]=t[p+1],t[p]=d,t[p+1]=f}}};var Nc=class{attachmentLoader;scale=1;linkedMeshes=new Array;constructor(e){this.attachmentLoader=e}readSkeletonData(e){let t=this.scale,n=new na,i=typeof e=="string"?JSON.parse(e):e,s=i.skeleton;if(s&&(n.hash=s.hash,n.version=s.spine,n.x=s.x,n.y=s.y,n.width=s.width,n.height=s.height,n.referenceScale=k(s,"referenceScale",100)*t,n.fps=s.fps,n.imagesPath=s.images??null,n.audioPath=s.audio??null),i.bones)for(let o=0;o<i.bones.length;o++){let l=i.bones[o],a=null,c=k(l,"parent",null);c&&(a=n.findBone(c));let h=new Kr(n.bones.length,l.name,a);h.length=k(l,"length",0)*t,h.x=k(l,"x",0)*t,h.y=k(l,"y",0)*t,h.rotation=k(l,"rotation",0),h.scaleX=k(l,"scaleX",1),h.scaleY=k(l,"scaleY",1),h.shearX=k(l,"shearX",0),h.shearY=k(l,"shearY",0),h.inherit=se.enumValue(St,k(l,"inherit","Normal")),h.skinRequired=k(l,"skin",!1);let u=k(l,"color",null);u&&h.color.setFromString(u),n.bones.push(h)}if(i.slots)for(let o=0;o<i.slots.length;o++){let l=i.slots[o],a=l.name,c=n.findBone(l.bone);if(!c)throw new Error(`Couldn't find bone ${l.bone} for slot ${a}`);let h=new ia(n.slots.length,a,c),u=k(l,"color",null);u&&h.color.setFromString(u);let d=k(l,"dark",null);d&&(h.darkColor=Pe.fromString(d)),h.attachmentName=k(l,"attachment",null),h.blendMode=se.enumValue(mi,k(l,"blend","normal")),h.visible=k(l,"visible",!0),n.slots.push(h)}if(i.ik)for(let o=0;o<i.ik.length;o++){let l=i.ik[o],a=new jr(l.name);a.order=k(l,"order",0),a.skinRequired=k(l,"skin",!1);for(let h=0;h<l.bones.length;h++){let u=n.findBone(l.bones[h]);if(!u)throw new Error(`Couldn't find bone ${l.bones[h]} for IK constraint ${l.name}.`);a.bones.push(u)}let c=n.findBone(l.target);if(!c)throw new Error(`Couldn't find target bone ${l.target} for IK constraint ${l.name}.`);a.target=c,a.mix=k(l,"mix",1),a.softness=k(l,"softness",0)*t,a.bendDirection=k(l,"bendPositive",!0)?1:-1,a.compress=k(l,"compress",!1),a.stretch=k(l,"stretch",!1),a.uniform=k(l,"uniform",!1),n.ikConstraints.push(a)}if(i.transform)for(let o=0;o<i.transform.length;o++){let l=i.transform[o],a=new sa(l.name);a.order=k(l,"order",0),a.skinRequired=k(l,"skin",!1);for(let u=0;u<l.bones.length;u++){let d=l.bones[u],f=n.findBone(d);if(!f)throw new Error(`Couldn't find bone ${d} for transform constraint ${l.name}.`);a.bones.push(f)}let c=l.target,h=n.findBone(c);if(!h)throw new Error(`Couldn't find target bone ${c} for transform constraint ${l.name}.`);a.target=h,a.local=k(l,"local",!1),a.relative=k(l,"relative",!1),a.offsetRotation=k(l,"rotation",0),a.offsetX=k(l,"x",0)*t,a.offsetY=k(l,"y",0)*t,a.offsetScaleX=k(l,"scaleX",0),a.offsetScaleY=k(l,"scaleY",0),a.offsetShearY=k(l,"shearY",0),a.mixRotate=k(l,"mixRotate",1),a.mixX=k(l,"mixX",1),a.mixY=k(l,"mixY",a.mixX),a.mixScaleX=k(l,"mixScaleX",1),a.mixScaleY=k(l,"mixScaleY",a.mixScaleX),a.mixShearY=k(l,"mixShearY",1),n.transformConstraints.push(a)}if(i.path)for(let o=0;o<i.path.length;o++){let l=i.path[o],a=new Qr(l.name);a.order=k(l,"order",0),a.skinRequired=k(l,"skin",!1);for(let u=0;u<l.bones.length;u++){let d=l.bones[u],f=n.findBone(d);if(!f)throw new Error(`Couldn't find bone ${d} for path constraint ${l.name}.`);a.bones.push(f)}let c=l.target,h=n.findSlot(c);if(!h)throw new Error(`Couldn't find target slot ${c} for path constraint ${l.name}.`);a.target=h,a.positionMode=se.enumValue(wn,k(l,"positionMode","Percent")),a.spacingMode=se.enumValue(Pt,k(l,"spacingMode","Length")),a.rotateMode=se.enumValue(Fi,k(l,"rotateMode","Tangent")),a.offsetRotation=k(l,"rotation",0),a.position=k(l,"position",0),a.positionMode==wn.Fixed&&(a.position*=t),a.spacing=k(l,"spacing",0),(a.spacingMode==Pt.Length||a.spacingMode==Pt.Fixed)&&(a.spacing*=t),a.mixRotate=k(l,"mixRotate",1),a.mixX=k(l,"mixX",1),a.mixY=k(l,"mixY",a.mixX),n.pathConstraints.push(a)}if(i.physics)for(let o=0;o<i.physics.length;o++){let l=i.physics[o],a=new ta(l.name);a.order=k(l,"order",0),a.skinRequired=k(l,"skin",!1);let c=l.bone,h=n.findBone(c);if(h==null)throw new Error("Physics bone not found: "+c);a.bone=h,a.x=k(l,"x",0),a.y=k(l,"y",0),a.rotate=k(l,"rotate",0),a.scaleX=k(l,"scaleX",0),a.shearX=k(l,"shearX",0),a.limit=k(l,"limit",5e3)*t,a.step=1/k(l,"fps",60),a.inertia=k(l,"inertia",1),a.strength=k(l,"strength",100),a.damping=k(l,"damping",1),a.massInverse=1/k(l,"mass",1),a.wind=k(l,"wind",0),a.gravity=k(l,"gravity",0),a.mix=k(l,"mix",1),a.inertiaGlobal=k(l,"inertiaGlobal",!1),a.strengthGlobal=k(l,"strengthGlobal",!1),a.dampingGlobal=k(l,"dampingGlobal",!1),a.massGlobal=k(l,"massGlobal",!1),a.windGlobal=k(l,"windGlobal",!1),a.gravityGlobal=k(l,"gravityGlobal",!1),a.mixGlobal=k(l,"mixGlobal",!1),n.physicsConstraints.push(a)}if(i.skins)for(let o=0;o<i.skins.length;o++){let l=i.skins[o],a=new As(l.name);if(l.bones)for(let c=0;c<l.bones.length;c++){let h=l.bones[c],u=n.findBone(h);if(!u)throw new Error(`Couldn't find bone ${h} for skin ${l.name}.`);a.bones.push(u)}if(l.ik)for(let c=0;c<l.ik.length;c++){let h=l.ik[c],u=n.findIkConstraint(h);if(!u)throw new Error(`Couldn't find IK constraint ${h} for skin ${l.name}.`);a.constraints.push(u)}if(l.transform)for(let c=0;c<l.transform.length;c++){let h=l.transform[c],u=n.findTransformConstraint(h);if(!u)throw new Error(`Couldn't find transform constraint ${h} for skin ${l.name}.`);a.constraints.push(u)}if(l.path)for(let c=0;c<l.path.length;c++){let h=l.path[c],u=n.findPathConstraint(h);if(!u)throw new Error(`Couldn't find path constraint ${h} for skin ${l.name}.`);a.constraints.push(u)}if(l.physics)for(let c=0;c<l.physics.length;c++){let h=l.physics[c],u=n.findPhysicsConstraint(h);if(!u)throw new Error(`Couldn't find physics constraint ${h} for skin ${l.name}.`);a.constraints.push(u)}for(let c in l.attachments){let h=n.findSlot(c);if(!h)throw new Error(`Couldn't find slot ${c} for skin ${l.name}.`);let u=l.attachments[c];for(let d in u){let f=this.readAttachment(u[d],a,h.index,d,n);f&&a.setAttachment(h.index,d,f)}}n.skins.push(a),a.name=="default"&&(n.defaultSkin=a)}for(let o=0,l=this.linkedMeshes.length;o<l;o++){let a=this.linkedMeshes[o],c=a.skin?n.findSkin(a.skin):n.defaultSkin;if(!c)throw new Error(`Skin not found: ${a.skin}`);let h=c.getAttachment(a.slotIndex,a.parent);if(!h)throw new Error(`Parent mesh not found: ${a.parent}`);a.mesh.timelineAttachment=a.inheritTimeline?h:a.mesh,a.mesh.setParentMesh(h),a.mesh.region!=null&&a.mesh.updateRegion()}if(this.linkedMeshes.length=0,i.events)for(let o in i.events){let l=i.events[o],a=new Jr(o);a.intValue=k(l,"int",0),a.floatValue=k(l,"float",0),a.stringValue=k(l,"string",""),a.audioPath=k(l,"audio",null),a.audioPath&&(a.volume=k(l,"volume",1),a.balance=k(l,"balance",0)),n.events.push(a)}if(i.animations)for(let o in i.animations){let l=i.animations[o];this.readAnimation(l,o,n)}return n}readAttachment(e,t,n,i,s){let o=this.scale;switch(i=k(e,"name",i),k(e,"type","region")){case"region":{let l=k(e,"path",i),a=this.readSequence(k(e,"sequence",null)),c=this.attachmentLoader.newRegionAttachment(t,i,l,a);if(!c)return null;c.path=l,c.x=k(e,"x",0)*o,c.y=k(e,"y",0)*o,c.scaleX=k(e,"scaleX",1),c.scaleY=k(e,"scaleY",1),c.rotation=k(e,"rotation",0),c.width=e.width*o,c.height=e.height*o,c.sequence=a;let h=k(e,"color",null);return h&&c.color.setFromString(h),c.region!=null&&c.updateRegion(),c}case"boundingbox":{let l=this.attachmentLoader.newBoundingBoxAttachment(t,i);if(!l)return null;this.readVertices(e,l,e.vertexCount<<1);let a=k(e,"color",null);return a&&l.color.setFromString(a),l}case"mesh":case"linkedmesh":{let l=k(e,"path",i),a=this.readSequence(k(e,"sequence",null)),c=this.attachmentLoader.newMeshAttachment(t,i,l,a);if(!c)return null;c.path=l;let h=k(e,"color",null);h&&c.color.setFromString(h),c.width=k(e,"width",0)*o,c.height=k(e,"height",0)*o,c.sequence=a;let u=k(e,"parent",null);if(u)return this.linkedMeshes.push(new od(c,k(e,"skin",null),n,u,k(e,"timelines",!0))),c;let d=e.uvs;return this.readVertices(e,c,d.length),c.triangles=e.triangles,c.regionUVs=d,c.region!=null&&c.updateRegion(),c.edges=k(e,"edges",null),c.hullLength=k(e,"hull",0)*2,c}case"path":{let l=this.attachmentLoader.newPathAttachment(t,i);if(!l)return null;l.closed=k(e,"closed",!1),l.constantSpeed=k(e,"constantSpeed",!0);let a=e.vertexCount;this.readVertices(e,l,a<<1);let c=se.newArray(a/3,0);for(let u=0;u<e.lengths.length;u++)c[u]=e.lengths[u]*o;l.lengths=c;let h=k(e,"color",null);return h&&l.color.setFromString(h),l}case"point":{let l=this.attachmentLoader.newPointAttachment(t,i);if(!l)return null;l.x=k(e,"x",0)*o,l.y=k(e,"y",0)*o,l.rotation=k(e,"rotation",0);let a=k(e,"color",null);return a&&l.color.setFromString(a),l}case"clipping":{let l=this.attachmentLoader.newClippingAttachment(t,i);if(!l)return null;let a=k(e,"end",null);a&&(l.endSlot=s.findSlot(a));let c=e.vertexCount;this.readVertices(e,l,c<<1);let h=k(e,"color",null);return h&&l.color.setFromString(h),l}}return null}readSequence(e){if(e==null)return null;let t=new _r(k(e,"count",0));return t.start=k(e,"start",1),t.digits=k(e,"digits",0),t.setupIndex=k(e,"setup",0),t}readVertices(e,t,n){let i=this.scale;t.worldVerticesLength=n;let s=e.vertices;if(n==s.length){let a=se.toFloatArray(s);if(i!=1)for(let c=0,h=s.length;c<h;c++)a[c]*=i;t.vertices=a;return}let o=new Array,l=new Array;for(let a=0,c=s.length;a<c;){let h=s[a++];l.push(h);for(let u=a+h*4;a<u;a+=4)l.push(s[a]),o.push(s[a+1]*i),o.push(s[a+2]*i),o.push(s[a+3])}t.bones=l,t.vertices=se.toFloatArray(o)}readAnimation(e,t,n){let i=this.scale,s=new Array;if(e.slots)for(let l in e.slots){let a=e.slots[l],c=n.findSlot(l);if(!c)throw new Error("Slot not found: "+l);let h=c.index;for(let u in a){let d=a[u];if(!d)continue;let f=d.length;if(u=="attachment"){let p=new Gn(f,h);for(let x=0;x<f;x++){let m=d[x];p.setFrame(x,k(m,"time",0),k(m,"name",null))}s.push(p)}else if(u=="rgba"){let p=new Cr(f,f<<2,h),x=d[0],m=k(x,"time",0),g=Pe.fromString(x.color);for(let y=0,_=0;;y++){p.setFrame(y,m,g.r,g.g,g.b,g.a);let v=d[y+1];if(!v){p.shrink(_);break}let S=k(v,"time",0),b=Pe.fromString(v.color),w=x.curve;w&&(_=nt(w,p,_,y,0,m,S,g.r,b.r,1),_=nt(w,p,_,y,1,m,S,g.g,b.g,1),_=nt(w,p,_,y,2,m,S,g.b,b.b,1),_=nt(w,p,_,y,3,m,S,g.a,b.a,1)),m=S,g=b,x=v}s.push(p)}else if(u=="rgb"){let p=new Ir(f,f*3,h),x=d[0],m=k(x,"time",0),g=Pe.fromString(x.color);for(let y=0,_=0;;y++){p.setFrame(y,m,g.r,g.g,g.b);let v=d[y+1];if(!v){p.shrink(_);break}let S=k(v,"time",0),b=Pe.fromString(v.color),w=x.curve;w&&(_=nt(w,p,_,y,0,m,S,g.r,b.r,1),_=nt(w,p,_,y,1,m,S,g.g,b.g,1),_=nt(w,p,_,y,2,m,S,g.b,b.b,1)),m=S,g=b,x=v}s.push(p)}else if(u=="alpha")s.push(Xn(d,new Pr(f,f,h),0,1));else if(u=="rgba2"){let p=new Lr(f,f*7,h),x=d[0],m=k(x,"time",0),g=Pe.fromString(x.light),y=Pe.fromString(x.dark);for(let _=0,v=0;;_++){p.setFrame(_,m,g.r,g.g,g.b,g.a,y.r,y.g,y.b);let S=d[_+1];if(!S){p.shrink(v);break}let b=k(S,"time",0),w=Pe.fromString(S.light),M=Pe.fromString(S.dark),A=x.curve;A&&(v=nt(A,p,v,_,0,m,b,g.r,w.r,1),v=nt(A,p,v,_,1,m,b,g.g,w.g,1),v=nt(A,p,v,_,2,m,b,g.b,w.b,1),v=nt(A,p,v,_,3,m,b,g.a,w.a,1),v=nt(A,p,v,_,4,m,b,y.r,M.r,1),v=nt(A,p,v,_,5,m,b,y.g,M.g,1),v=nt(A,p,v,_,6,m,b,y.b,M.b,1)),m=b,g=w,y=M,x=S}s.push(p)}else if(u=="rgb2"){let p=new Nr(f,f*6,h),x=d[0],m=k(x,"time",0),g=Pe.fromString(x.light),y=Pe.fromString(x.dark);for(let _=0,v=0;;_++){p.setFrame(_,m,g.r,g.g,g.b,y.r,y.g,y.b);let S=d[_+1];if(!S){p.shrink(v);break}let b=k(S,"time",0),w=Pe.fromString(S.light),M=Pe.fromString(S.dark),A=x.curve;A&&(v=nt(A,p,v,_,0,m,b,g.r,w.r,1),v=nt(A,p,v,_,1,m,b,g.g,w.g,1),v=nt(A,p,v,_,2,m,b,g.b,w.b,1),v=nt(A,p,v,_,3,m,b,y.r,M.r,1),v=nt(A,p,v,_,4,m,b,y.g,M.g,1),v=nt(A,p,v,_,5,m,b,y.b,M.b,1)),m=b,g=w,y=M,x=S}s.push(p)}}}if(e.bones)for(let l in e.bones){let a=e.bones[l],c=n.findBone(l);if(!c)throw new Error("Bone not found: "+l);let h=c.index;for(let u in a){let d=a[u],f=d.length;if(f!=0){if(u==="rotate")s.push(Xn(d,new Pi(f,f,h),0,1));else if(u==="translate"){let p=new yr(f,f<<1,h);s.push(ad(d,p,"x","y",0,i))}else if(u==="translatex"){let p=new vr(f,f,h);s.push(Xn(d,p,0,i))}else if(u==="translatey"){let p=new br(f,f,h);s.push(Xn(d,p,0,i))}else if(u==="scale"){let p=new Mr(f,f<<1,h);s.push(ad(d,p,"x","y",1,1))}else if(u==="scalex"){let p=new Sr(f,f,h);s.push(Xn(d,p,1,1))}else if(u==="scaley"){let p=new wr(f,f,h);s.push(Xn(d,p,1,1))}else if(u==="shear"){let p=new Tr(f,f<<1,h);s.push(ad(d,p,"x","y",0,1))}else if(u==="shearx"){let p=new Ar(f,f,h);s.push(Xn(d,p,0,1))}else if(u==="sheary"){let p=new Er(f,f,h);s.push(Xn(d,p,0,1))}else if(u==="inherit"){let p=new Rr(f,c.index);for(let x=0;x<d.length;x++){let m=d[x];p.setFrame(x,k(m,"time",0),se.enumValue(St,k(m,"inherit","Normal")))}s.push(p)}}}}if(e.ik)for(let l in e.ik){let a=e.ik[l],c=a[0];if(!c)continue;let h=n.findIkConstraint(l);if(!h)throw new Error("IK Constraint not found: "+l);let u=n.ikConstraints.indexOf(h),d=new Dr(a.length,a.length<<1,u),f=k(c,"time",0),p=k(c,"mix",1),x=k(c,"softness",0)*i;for(let m=0,g=0;;m++){d.setFrame(m,f,p,x,k(c,"bendPositive",!0)?1:-1,k(c,"compress",!1),k(c,"stretch",!1));let y=a[m+1];if(!y){d.shrink(g);break}let _=k(y,"time",0),v=k(y,"mix",1),S=k(y,"softness",0)*i,b=c.curve;b&&(g=nt(b,d,g,m,0,f,_,p,v,1),g=nt(b,d,g,m,1,f,_,x,S,i)),f=_,p=v,x=S,c=y}s.push(d)}if(e.transform)for(let l in e.transform){let a=e.transform[l],c=a[0];if(!c)continue;let h=n.findTransformConstraint(l);if(!h)throw new Error("Transform constraint not found: "+l);let u=n.transformConstraints.indexOf(h),d=new Ur(a.length,a.length*6,u),f=k(c,"time",0),p=k(c,"mixRotate",1),x=k(c,"mixX",1),m=k(c,"mixY",x),g=k(c,"mixScaleX",1),y=k(c,"mixScaleY",g),_=k(c,"mixShearY",1);for(let v=0,S=0;;v++){d.setFrame(v,f,p,x,m,g,y,_);let b=a[v+1];if(!b){d.shrink(S);break}let w=k(b,"time",0),M=k(b,"mixRotate",1),A=k(b,"mixX",1),C=k(b,"mixY",A),E=k(b,"mixScaleX",1),N=k(b,"mixScaleY",E),F=k(b,"mixShearY",1),L=c.curve;L&&(S=nt(L,d,S,v,0,f,w,p,M,1),S=nt(L,d,S,v,1,f,w,x,A,1),S=nt(L,d,S,v,2,f,w,m,C,1),S=nt(L,d,S,v,3,f,w,g,E,1),S=nt(L,d,S,v,4,f,w,y,N,1),S=nt(L,d,S,v,5,f,w,_,F,1)),f=w,p=M,x=A,m=C,g=E,y=N,_=F,c=b}s.push(d)}if(e.path)for(let l in e.path){let a=e.path[l],c=n.findPathConstraint(l);if(!c)throw new Error("Path constraint not found: "+l);let h=n.pathConstraints.indexOf(c);for(let u in a){let d=a[u],f=d[0];if(!f)continue;let p=d.length;if(u==="position"){let x=new Or(p,p,h);s.push(Xn(d,x,0,c.positionMode==wn.Fixed?i:1))}else if(u==="spacing"){let x=new Br(p,p,h);s.push(Xn(d,x,0,c.spacingMode==Pt.Length||c.spacingMode==Pt.Fixed?i:1))}else if(u==="mix"){let x=new kr(p,p*3,h),m=k(f,"time",0),g=k(f,"mixRotate",1),y=k(f,"mixX",1),_=k(f,"mixY",y);for(let v=0,S=0;;v++){x.setFrame(v,m,g,y,_);let b=d[v+1];if(!b){x.shrink(S);break}let w=k(b,"time",0),M=k(b,"mixRotate",1),A=k(b,"mixX",1),C=k(b,"mixY",A),E=f.curve;E&&(S=nt(E,x,S,v,0,m,w,g,M,1),S=nt(E,x,S,v,1,m,w,y,A,1),S=nt(E,x,S,v,2,m,w,_,C,1)),m=w,g=M,y=A,_=C,f=b}s.push(x)}}}if(e.physics)for(let l in e.physics){let a=e.physics[l],c=-1;if(l.length>0){let h=n.findPhysicsConstraint(l);if(!h)throw new Error("Physics constraint not found: "+l);c=n.physicsConstraints.indexOf(h)}for(let h in a){let u=a[h],d=u[0];if(!d)continue;let f=u.length;if(h=="reset"){let x=new qr(f,c);for(let m=0;d!=null;d=u[m+1],m++)x.setFrame(m,k(d,"time",0));s.push(x);continue}let p;if(h=="inertia")p=new Vr(f,f,c);else if(h=="strength")p=new zr(f,f,c);else if(h=="damping")p=new Hr(f,f,c);else if(h=="mass")p=new Gr(f,f,c);else if(h=="wind")p=new Wr(f,f,c);else if(h=="gravity")p=new Xr(f,f,c);else if(h=="mix")p=new Yr(f,f,c);else continue;s.push(Xn(u,p,0,1))}}if(e.attachments)for(let l in e.attachments){let a=e.attachments[l],c=n.findSkin(l);if(!c)throw new Error("Skin not found: "+l);for(let h in a){let u=a[h],d=n.findSlot(h);if(!d)throw new Error("Slot not found: "+h);let f=d.index;for(let p in u){let x=u[p],m=c.getAttachment(f,p);for(let g in x){let y=x[g],_=y[0];if(_){if(g=="deform"){let v=m.bones,S=m.vertices,b=v?S.length/3*2:S.length,w=new Fr(y.length,y.length,f,m),M=k(_,"time",0);for(let A=0,C=0;;A++){let E,N=k(_,"vertices",null);if(!N)E=v?se.newFloatArray(b):S;else{E=se.newFloatArray(b);let D=k(_,"offset",0);if(se.arrayCopy(N,0,E,D,N.length),i!=1)for(let U=D,Y=U+N.length;U<Y;U++)E[U]*=i;if(!v)for(let U=0;U<b;U++)E[U]+=S[U]}w.setFrame(A,M,E);let F=y[A+1];if(!F){w.shrink(C);break}let L=k(F,"time",0),I=_.curve;I&&(C=nt(I,w,C,A,0,M,L,0,1,1)),M=L,_=F}s.push(w)}else if(g=="sequence"){let v=new $r(y.length,f,m),S=0;for(let b=0;b<y.length;b++){let w=k(_,"delay",S),M=k(_,"time",0),A=Ht[k(_,"mode","hold")],C=k(_,"index",0);v.setFrame(b,M,A,C,w),S=w,_=y[b+1]}s.push(v)}}}}}}if(e.drawOrder){let l=new ui(e.drawOrder.length),a=n.slots.length,c=0;for(let h=0;h<e.drawOrder.length;h++,c++){let u=e.drawOrder[h],d=null,f=k(u,"offsets",null);if(f){d=se.newArray(a,-1);let p=se.newArray(a-f.length,0),x=0,m=0;for(let g=0;g<f.length;g++){let y=f[g],_=n.findSlot(y.slot);if(!_)throw new Error("Slot not found: "+_);let v=_.index;for(;x!=v;)p[m++]=x++;d[x+y.offset]=x++}for(;x<a;)p[m++]=x++;for(let g=a-1;g>=0;g--)d[g]==-1&&(d[g]=p[--m])}l.setFrame(c,k(u,"time",0),d)}s.push(l)}if(e.events){let l=new ss(e.events.length),a=0;for(let c=0;c<e.events.length;c++,a++){let h=e.events[c],u=n.findEvent(h.name);if(!u)throw new Error("Event not found: "+h.name);let d=new Zr(se.toSinglePrecision(k(h,"time",0)),u);d.intValue=k(h,"int",u.intValue),d.floatValue=k(h,"float",u.floatValue),d.stringValue=k(h,"string",u.stringValue),d.data.audioPath&&(d.volume=k(h,"volume",1),d.balance=k(h,"balance",0)),l.setFrame(a,d)}s.push(l)}let o=0;for(let l=0,a=s.length;l<a;l++)o=Math.max(o,s[l].getDuration());n.animations.push(new is(t,s,o))}},od=class{parent;skin;slotIndex;mesh;inheritTimeline;constructor(e,t,n,i,s){this.mesh=e,this.skin=t,this.slotIndex=n,this.parent=i,this.inheritTimeline=s}};function Xn(r,e,t,n){let i=r[0],s=k(i,"time",0),o=k(i,"value",t)*n,l=0;for(let a=0;;a++){e.setFrame(a,s,o);let c=r[a+1];if(!c)return e.shrink(l),e;let h=k(c,"time",0),u=k(c,"value",t)*n;i.curve&&(l=nt(i.curve,e,l,a,0,s,h,o,u,n)),s=h,o=u,i=c}}function ad(r,e,t,n,i,s){let o=r[0],l=k(o,"time",0),a=k(o,t,i)*s,c=k(o,n,i)*s,h=0;for(let u=0;;u++){e.setFrame(u,l,a,c);let d=r[u+1];if(!d)return e.shrink(h),e;let f=k(d,"time",0),p=k(d,t,i)*s,x=k(d,n,i)*s,m=o.curve;m&&(h=nt(m,e,h,u,0,l,f,a,p,s),h=nt(m,e,h,u,1,l,f,c,x,s)),l=f,a=p,c=x,o=d}}function nt(r,e,t,n,i,s,o,l,a,c){if(r=="stepped")return e.setStepped(n),t;let h=i<<2,u=r[h],d=r[h+1]*c,f=r[h+2],p=r[h+3]*c;return e.setBezier(t,n,i,s,l,u,d,f,p,o,a),t+1}function k(r,e,t){return r[e]!==void 0?r[e]:t}typeof Math.fround>"u"&&(Math.fround=(function(r){return function(e){return r[0]=e,r[0]}})(new Float32Array(1)));var Es=class r extends vc{texture;constructor(e,t=!1){super(e),e instanceof ImageBitmap?this.texture=new ys(e):this.texture=new Dt(e),this.texture.premultiplyAlpha=!t,this.texture.flipY=!1,this.texture.needsUpdate=!0}setFilters(e,t){this.texture.minFilter=r.toThreeJsMinificationTextureFilter(e),this.texture.magFilter=r.toThreeJsMagnificationTextureFilter(t)}setWraps(e,t){this.texture.wrapS=r.toThreeJsTextureWrap(e),this.texture.wrapT=r.toThreeJsTextureWrap(t)}dispose(){this.texture.dispose()}static toThreeJsMinificationTextureFilter(e){if(e===kt.Linear)return Mt;if(e===kt.MipMap)return Vh;if(e===kt.MipMapLinearNearest)return kh;if(e===kt.MipMapNearestLinear)return Bh;if(e===kt.MipMapNearestNearest)return Oh;if(e===kt.Nearest)return bt;throw new Error("Unknown texture filter: "+e)}static toThreeJsMagnificationTextureFilter(e){if(e===kt.Linear)return Mt;if(e===kt.MipMap)return Mt;if(e===kt.MipMapLinearNearest)return bt;if(e===kt.MipMapNearestLinear)return Mt;if(e===kt.MipMapNearestNearest)return bt;if(e===kt.Nearest)return bt;throw new Error("Unknown texture filter: "+e)}static toThreeJsTextureWrap(e){if(e===Wn.ClampToEdge)return cn;if(e===Wn.MirroredRepeat)return qi;if(e===Wn.Repeat)return Jn;throw new Error("Unknown texture wrap: "+e)}static fist=!0;static toThreeJsBlending(e){if(e===mi.Normal)return{blending:En};if(e===mi.Additive)return{blending:Ha};if(e===mi.Multiply)return{blending:Ga,blendSrc:gl,blendDst:ds,blendSrcAlpha:lr,blendDstAlpha:ds};if(e===mi.Screen)return{blending:Ga,blendSrc:lr,blendDst:Wa,blendSrcAlpha:lr,blendDstAlpha:Wa};throw new Error("Unknown blendMode: "+e)}};var Cs=class r extends wt{static DEFAULT_MATERIAL_PARAMETERS={side:en,depthWrite:!0,depthTest:!0,transparent:!0,alphaTest:.001,vertexColors:!0,premultipliedAlpha:!0};tempPos=new hi;tempUv=new hi;tempLight=new Pe;tempDark=new Pe;skeleton;state;zOffset=.1;batches=new Array;materialFactory;nextBatchIndex=0;clipper=new Lc;static QUAD_TRIANGLES=[0,1,2,2,3,0];static VERTEX_SIZE=8;vertexSize=8;twoColorTint;vertices=se.newFloatArray(1024);tempColor=new Pe;tempDarkColor=new Pe;_castShadow=!1;_receiveShadow=!1;constructor(e,t=()=>{}){super(),"skeletonData"in e||(e={skeletonData:e,materialFactory:()=>{let s={...r.DEFAULT_MATERIAL_PARAMETERS};return t(s),new $t(s)}}),this.twoColorTint=e.twoColorTint??!0,this.twoColorTint&&(this.vertexSize+=4),this.materialFactory=e.materialFactory??(()=>new $t(r.DEFAULT_MATERIAL_PARAMETERS)),this.skeleton=new ea(e.skeletonData);let n=new yc(e.skeletonData);this.state=new _c(n),Object.defineProperty(this,"castShadow",{get:()=>this._castShadow,set:i=>{this._castShadow=i,this.traverse(s=>{s instanceof Rs&&(s.castShadow=i)})}}),Object.defineProperty(this,"receiveShadow",{get:()=>this._receiveShadow,set:i=>{this._receiveShadow=i,this.traverse(s=>{s instanceof Rs&&(s.receiveShadow=i)})}})}update(e){let t=this.state,n=this.skeleton;t.update(e),t.apply(n),n.update(e),n.updateWorldTransform(In.update),this.updateGeometry()}dispose(){for(var e=0;e<this.batches.length;e++)this.batches[e].dispose()}clearBatches(){for(var e=0;e<this.batches.length;e++)this.batches[e].clear(),this.batches[e].visible=!1;this.nextBatchIndex=0}nextBatch(){if(this.batches.length==this.nextBatchIndex){let t=new Rs(Rs.MAX_VERTICES,this.materialFactory,this.twoColorTint);t.castShadow=this._castShadow,t.receiveShadow=this._receiveShadow,this.add(t),this.batches.push(t)}let e=this.batches[this.nextBatchIndex++];return e.visible=!0,e}updateGeometry(){this.clearBatches();let e=this.tempLight,t=this.tempDark,n=this.clipper,i=this.vertices,s=null,o=null,l=this.skeleton.drawOrder,a=this.nextBatch();a.begin();let c=0,h=this.zOffset;for(let u=0,d=l.length;u<d;u++){let f=n.isClipping()?2:this.vertexSize,p=l[u];if(!p.bone.active){n.clipEndWithSlot(p);continue}let x=p.getAttachment(),m,g,y=0;if(x instanceof rs){let _=x;m=_.color,i=this.vertices,y=f*4,_.computeWorldVertices(p,i,0,f),s=r.QUAD_TRIANGLES,o=_.uvs,g=_.region.texture}else if(x instanceof fi){let _=x;m=_.color,i=this.vertices,y=(_.worldVerticesLength>>1)*f,y>i.length&&(i=this.vertices=se.newFloatArray(y)),_.computeWorldVertices(p,0,_.worldVerticesLength,i,0,f),s=_.triangles,o=_.uvs,g=_.region.texture}else if(x instanceof di){let _=x;n.clipStart(p,_);continue}else{n.clipEndWithSlot(p);continue}if(g!=null){let v=p.bone.skeleton.color,S=p.color,b=v.a*S.a*m.a,w=this.tempColor;w.set(v.r*S.r*m.r*b,v.g*S.g*m.g*b,v.b*S.b*m.b*b,b);let M=this.tempDarkColor;p.darkColor?(M.r=p.darkColor.r*b,M.g=p.darkColor.g*b,M.b=p.darkColor.b*b,M.a=1):M.set(0,0,0,1);let A,C,E,N;if(n.isClipping()){n.clipTriangles(i,s,s.length,o,w,e,this.twoColorTint);let D=n.clippedVertices,U=n.clippedTriangles;A=D,C=D.length,E=U,N=U.length}else{let D=i;if(this.twoColorTint)for(let U=2,Y=0,X=y;U<X;U+=f,Y+=2)D[U]=w.r,D[U+1]=w.g,D[U+2]=w.b,D[U+3]=w.a,D[U+4]=o[Y],D[U+5]=o[Y+1],D[U+6]=M.r,D[U+7]=M.g,D[U+8]=M.b,D[U+9]=M.a;else for(let U=2,Y=0,X=y;U<X;U+=f,Y+=2)D[U]=w.r,D[U+1]=w.g,D[U+2]=w.b,D[U+3]=w.a,D[U+4]=o[Y],D[U+5]=o[Y+1];A=i,C=y,E=s,N=s.length}if(C==0||N==0){n.clipEndWithSlot(p);continue}a.canBatch(C/this.vertexSize,N)||(a.end(),a=this.nextBatch(),a.begin());let F=p.data.blendMode,L=g.texture,I=a.findMaterialGroup(L,F);a.addMaterialGroup(N,I),a.batch(A,C,E,N,c),c+=h}n.clipEndWithSlot(p)}n.clipEnd(),a.end()}};var Rs=class r extends It{materialFactory;twoColorTint;static MAX_VERTICES=10920;vertexSize=9;vertexBuffer;vertices;verticesLength=0;indices;indicesLength=0;materialGroups=[];constructor(e=r.MAX_VERTICES,t,n=!0){if(super(),this.materialFactory=t,this.twoColorTint=n,e>r.MAX_VERTICES)throw new Error("Can't have more than 10920 triangles per batch: "+e);n&&(this.vertexSize+=3),this.vertices=new Float32Array(e*this.vertexSize),this.indices=new Uint16Array(e*3);let i=new Float32Array(e*3);for(let c=0;c<e*3;c+=3)i[c]=0,i[c+1]=0,i[c+2]=-1;let s=new $i(this.vertices,this.vertexSize);this.vertexBuffer=s,this.vertexBuffer.usage=WebGLRenderingContext.DYNAMIC_DRAW;let o=new qt;o.setAttribute("position",new kn(s,3,0,!1)),o.setAttribute("color",new kn(s,4,3,!1)),o.setAttribute("uv",new kn(s,2,7,!1)),n&&o.setAttribute("darkcolor",new kn(s,3,9,!1));let l=new At(i,3);l.usage=WebGLRenderingContext.STATIC_DRAW,o.setAttribute("normal",l);let a=new At(this.indices,1);a.usage=WebGLRenderingContext.DYNAMIC_DRAW,o.setIndex(a),o.drawRange.start=0,o.drawRange.count=0,this.geometry=o,this.material=[]}dispose(){if(this.geometry.dispose(),this.material instanceof Wt)this.material.dispose();else if(this.material)for(let e=0;e<this.material.length;e++){let t=this.material[e];t instanceof Wt&&t.dispose()}}clear(){let e=this.geometry;if(e.drawRange.start=0,e.drawRange.count=0,e.clearGroups(),this.materialGroups=[],this.material instanceof Wt){let t=this.material;t.map=null,t.blending=En}else if(Array.isArray(this.material))for(let t=0;t<this.material.length;t++){let n=this.material[t];n.map=null,n.blending=En}return this}begin(){this.verticesLength=0,this.indicesLength=0}canBatch(e,t){return!(this.indicesLength+t>=this.indices.byteLength/2||this.verticesLength/this.vertexSize+e>=this.vertices.byteLength/4/this.vertexSize)}batch(e,t,n,i,s=0){let o=this.verticesLength/this.vertexSize,l=this.vertices,a=this.verticesLength,c=0;if(this.twoColorTint)for(;c<t;)l[a++]=e[c++],l[a++]=e[c++],l[a++]=s,l[a++]=e[c++],l[a++]=e[c++],l[a++]=e[c++],l[a++]=e[c++],l[a++]=e[c++],l[a++]=e[c++],l[a++]=e[c++],l[a++]=e[c++],l[a++]=e[c++],c++;else for(;c<t;)l[a++]=e[c++],l[a++]=e[c++],l[a++]=s,l[a++]=e[c++],l[a++]=e[c++],l[a++]=e[c++],l[a++]=e[c++],l[a++]=e[c++],l[a++]=e[c++];this.verticesLength=a;let h=this.indices;for(a=this.indicesLength,c=0;c<i;a++,c++)h[a]=n[c]+o;this.indicesLength+=i}end(){this.vertexBuffer.needsUpdate=this.verticesLength>0,this.vertexBuffer.addUpdateRange(0,this.verticesLength);let e=this.geometry;this.closeMaterialGroups();let t=e.getIndex();if(!t)throw new Error("BufferAttribute must not be null.");t.needsUpdate=this.indicesLength>0,t.addUpdateRange(0,this.indicesLength),e.drawRange.start=0,e.drawRange.count=this.indicesLength}addMaterialGroup(e,t){let n=this.materialGroups[this.materialGroups.length-1];n===void 0||n[2]!==t?this.materialGroups.push([this.indicesLength,e,t]):n[1]+=e}closeMaterialGroups(){let e=this.geometry;for(let t=0;t<this.materialGroups.length;t++){let[n,i,s]=this.materialGroups[t];e.addGroup(n,i,s)}}findMaterialGroup(e,t){let n=Es.toThreeJsBlending(t),i=-1;if(Array.isArray(this.material)){for(let o=0;o<this.material.length;o++){let l=this.material[o];if(!l.map)return Op(l,e,n),o;if(l.map===e&&n.blending===l.blending&&(n.blendSrc===void 0||n.blendSrc===l.blendSrc)&&(n.blendDst===void 0||n.blendDst===l.blendDst)&&(n.blendSrcAlpha===void 0||n.blendSrcAlpha===l.blendSrcAlpha)&&(n.blendDstAlpha===void 0||n.blendDstAlpha===l.blendDstAlpha))return o}let s=this.newMaterial();Op(s,e,n),this.material.push(s),i=this.material.length-1}else throw new Error("MeshBatcher.material needs to be an array for geometry groups to work");return i}newMaterial(){let e=this.materialFactory(Cs.DEFAULT_MATERIAL_PARAMETERS);if(!("map"in e))throw new Error("The material factory must return a material having the map property for the texture.");return e instanceof cd||(this.twoColorTint&&(e.defines={...e.defines,USE_SPINE_DARK_TINT:1}),e.onBeforeCompile=Uv),e}},Uv=r=>{let e;r.vertexShader=`
		#if defined( USE_SPINE_DARK_TINT )
			attribute vec3 darkcolor;
		#endif
	`+r.vertexShader,e=`
		#if defined( USE_SPINE_DARK_TINT )
			varying vec3 v_dark;
		#endif
	`,r.vertexShader=ld(r.vertexShader,"#include <color_pars_vertex>",e),e=`
		#if defined( USE_SPINE_DARK_TINT )
			v_dark = vec3( 1.0 );
			v_dark *= darkcolor;
		#endif
	`,r.vertexShader=ld(r.vertexShader,"#include <color_vertex>",e),e=`
		#ifdef USE_SPINE_DARK_TINT
			varying vec3 v_dark;
		#endif
	`,r.fragmentShader=ld(r.fragmentShader,"#include <color_pars_fragment>",e),r.fragmentShader=r.fragmentShader.replace("#include <color_fragment>",`
			#ifdef USE_SPINE_DARK_TINT
				#ifdef USE_COLOR_ALPHA
						diffuseColor.a *= vColor.a;
						diffuseColor.rgb = (diffuseColor.a - diffuseColor.rgb) * v_dark.rgb + diffuseColor.rgb * vColor.rgb;
				#endif
			#else
				#ifdef USE_COLOR_ALPHA
						diffuseColor *= vColor;
				#endif
			#endif
		`),r.fragmentShader=r.fragmentShader.replace("#include <premultiplied_alpha_fragment>",""),r.fragmentShader=r.fragmentShader.replace("#include <colorspace_fragment>","")};function ld(r,e,t){let n=r.indexOf(e),i=r.slice(0,n+e.length),s=r.slice(n+e.length);return i+t+s}function Op(r,e,t){r.map=e,Object.assign(r,t),r.needsUpdate=!0}var cd=class extends on{get map(){return this.uniforms.map.value}set map(e){this.uniforms.map.value=e}constructor(e){let t=`
			varying vec2 vUv;
			varying vec4 vColor;
			void main() {
				vUv = uv;
				vColor = color;
				gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
			}
		`,n=`
			uniform sampler2D map;
			#ifdef USE_SPINE_ALPHATEST
			uniform float alphaTest;
			#endif
			varying vec2 vUv;
			varying vec4 vColor;
			void main(void) {
				gl_FragColor = texture2D(map, vUv)*vColor;
				#ifdef USE_SPINE_ALPHATEST
					if (gl_FragColor.a < alphaTest) discard;
				#endif
			}
		`,i={map:{value:null}};e.uniforms&&(i={...e.uniforms,...i}),e.alphaTest&&e.alphaTest>0&&(e.defines={USE_SPINE_ALPHATEST:1}),super({vertexShader:t,fragmentShader:n,...e,uniforms:i})}};var Fc=new ke().makeScale(1,1,-1),hd=Math.PI/180,Bp=18,Ov=40,kp=3;function Bv(r){let e=new ke().fromArray(r);return Fc.clone().multiply(e).multiply(Fc)}function kv(r,e,t){let n=new Qt().setFromEuler(new Bn(e.x*hd,e.y*hd,e.z*hd,"YXZ"));return new ke().compose(new z(r.x,r.y,r.z),n,new z(t.x,t.y,t.z))}function Vv(r){let e=r.situation,t=kv(e.backgroundPosition,e.backgroundRotation,e.backgroundScale),n=r.roomRoot,i=new ke().compose(new z(n.localPosition.x,n.localPosition.y,n.localPosition.z),new Qt(n.localRotation.x,n.localRotation.y,n.localRotation.z,n.localRotation.w),new z(n.localScale.x,n.localScale.y,n.localScale.z)),s=t.multiply(i.invert());return Fc.clone().multiply(s).multiply(Fc)}function zv(r){let e=r.map??null;e&&(e.colorSpace=Tt);let t=r.name.endsWith("_transparent");return new $t({map:e,side:en,transparent:t,alphaTest:t?0:.5,depthWrite:!t})}async function Hv(r){let e=new Image;return e.src=r,await e.decode(),e}async function co(r){let e=await fetch(r);if(!e.ok)throw new Error(`${r}: HTTP ${e.status}`);return e}var Gv=[[0,"#f6b9dd"],[.45,"#f3c6e6"],[1,"#bfeaf4"]],ho=null;function Wv(){if(ho)return ho;let r=document.createElement("canvas");r.width=2,r.height=256;let e=r.getContext("2d"),t=e.createLinearGradient(0,0,0,r.height);for(let[n,i]of Gv)t.addColorStop(n,i);return e.fillStyle=t,e.fillRect(0,0,r.width,r.height),ho=new ys(r),ho.colorSpace=Tt,ho}function Gp(r){let e=new hc({canvas:r,antialias:!0,alpha:!1,powerPreference:"low-power"});return e.outputColorSpace=Tt,e.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),e}var Vp={tomori:["tomori","\u71C8"],taki:["taki","\u7ACB\u5E0C"],anon:["anon","\u611B\u97F3"],soyo:["soyo","\u305D\u3088"],rana:["rana","\u697D\u5948"]};function zp(r){let e=r.toLowerCase();return Object.keys(Vp).filter(t=>Vp[t].some(n=>e.includes(n)))}var Xv=["tomori","taki","anon","soyo","rana","\u71C8","\u7ACB\u5E0C","\u611B\u97F3","\u305D\u3088","\u697D\u5948","sakiko","uika","mutsumi","umiri","nyamu","\u7965\u5B50","\u521D\u83EF","\u7766","\u6D77\u9234","\u306B\u3083\u3080","nonoka","arare","miyako","yuno","ritsu","manager","marukun","houka","hotaru","mahoro","natsume","nagi","kanata","raika","chieri","yomogi","miku","shizuku"],Yv=/chair|armrest|sofa|door|handrail|menu|coaster|teaset|komono|bucket|balcony|_item|(^|_)pc(_|$)/,qv=/shadow|syadow|wipe/,$v=/table(?!t)|stall|bench|stage|dish|(^|_)bg(\d|_|$)|(^|_)ef_\d|smoke/;function Hp(r){let e=r.toLowerCase();return Xv.some(t=>e.includes(t))}function Kv(r){let e=r.toLowerCase();return Yv.test(e)||!qv.test(e)&&$v.test(e)}var Dc=class r{constructor(e,t){this.renderer=e;this.data=t;this.scene.background=Wv(),this.camera=new Bt(t.camera.fieldOfView,16/9,t.camera.near,t.camera.far)}renderer;data;scene=new va;camera;residents=[];atlases=new Map;clock=0;replayAt=1/0;charactersVisible=!0;hiddenResidents=new Set;hiddenSlots=new Map;static async create(e,t,n){let i=await(await co(`${t}/${n}/spot.json`)).json(),s=new r(e,i),o=await(await co(`${t}/${n.split("/")[0]}/room.glb`)).arrayBuffer();return await s.buildRoom(o),await s.buildResidents(`${t}/${n}`),s}setCharactersVisible(e){this.charactersVisible=e,this.applyVisibility()}setHiddenMembers(e){let t=new Set(e);this.hiddenResidents.clear(),this.hiddenSlots.clear();for(let n of this.residents){let i=zp(n.character.name);if(!i.some(o=>t.has(o)))continue;if(i.every(o=>t.has(o))){this.hiddenResidents.add(n);continue}let s=n.mesh.skeleton.slots.map((o,l)=>({index:l,members:zp(o.data.name)})).filter(o=>o.members.length>0&&o.members.every(l=>t.has(l))).map(o=>o.index);this.hiddenSlots.set(n,s)}this.applyVisibility()}applyVisibility(){this.invalidate();for(let e of this.residents){e.mesh.skeleton.setSlotsToSetupPose();let t=e.personSlots.length>0&&!e.hasProps,n=!this.charactersVisible&&t;e.mesh.parent.visible=!n&&!this.hiddenResidents.has(e)}}blankSlots(e){let t=this.hiddenSlots.get(e)??[];return this.charactersVisible?t:[...t,...e.personSlots]}updateResident(e,t){let n=this.blankSlots(e);if(!n.length){e.mesh.update(t);return}let{state:i,skeleton:s}=e.mesh;i.update(t),i.apply(s);for(let o of n){let l=s.slots[o];l.getAttachment()instanceof di||l.setAttachment(null)}s.update(t),s.updateWorldTransform(In.update),e.mesh.updateGeometry()}async buildRoom(e){let t=await new pc().parseAsync(e,""),n=new hn;n.matrixAutoUpdate=!1,n.matrix.copy(Vv(this.data)),n.add(t.scene),t.scene.traverse(i=>{let s=t.parser.associations.get(i),o=s&&"nodes"in s?s.nodes:void 0;o!==void 0&&this.data.roomNodes[o]===!1&&(i.visible=!1),i instanceof It&&(i.material=zv(i.material))}),this.scene.add(n)}async buildResidents(e){let t=this.atlases;for(let n of this.data.characters){let i=t.get(n.atlas);if(!i){i=new ao(await(await co(`${e}/${n.atlas}`)).text());for(let m of i.pages)m.setTexture(new Es(await Hv(`${e}/${m.name}`)));t.set(n.atlas,i)}let s=`${e}/${n.skeleton}`,o=new Sc(i),l=n.skeleton.endsWith(".skel")?Object.assign(new Ic(o),{scale:n.scale}).readSkeletonData(new Uint8Array(await(await co(s)).arrayBuffer())):Object.assign(new Nc(o),{scale:n.scale}).readSkeletonData(await(await co(s)).json()),a=new Cs({skeletonData:l,materialFactory:m=>new $t({...m,depthWrite:!1})});a.zOffset=0;let c=n.animation&&l.findAnimation(n.animation)?n.animation:null;c&&a.state.setAnimation(0,c,n.loop);let h=new hn;h.matrixAutoUpdate=!1,h.matrix.copy(Bv(n.world)),h.add(a),h.renderOrder=n.order,this.scene.add(h);let u=l.slots.map(m=>m.name),f=Hp(n.name)||u.some(Hp)?u.flatMap((m,g)=>Kv(m)?[]:[g]):[],p=f.length<u.length,x={mesh:a,character:n,animation:c,personSlots:f,hasProps:p};c&&a.state.addListener({complete:()=>this.scheduleReplay()}),this.residents.push(x)}}scheduleReplay(){this.replayAt!==1/0||this.residents.some(e=>e.character.loop)||(this.replayAt=this.clock+Bp+Math.random()*(Ov-Bp))}setSize(e,t){this.invalidate(),this.renderer.setSize(e,t,!1),this.camera.aspect=e/t,this.camera.updateProjectionMatrix()}setPose(e){let t=kc(e.position),n=kc(Ed(e));this.camera.position.set(t.x,t.y,t.z),this.camera.up.set(0,1,0),this.camera.lookAt(n.x,n.y,n.z),this.camera.fov=e.fov,this.camera.updateProjectionMatrix()}render(e,t=!1){this.clock+=e;let n=this.clock>=this.replayAt;if(n&&(this.replayAt=1/0,this.invalidate()),this.animating()&&this.invalidate(),!(!t&&this.clock>this.settleUntil)){for(let i of this.residents)n&&i.animation&&i.mesh.state.setAnimation(0,i.animation,!1),this.updateResident(i,e);this.renderer.render(this.scene,this.camera),this.drawn++}}drawn=0;settleUntil=kp;invalidate(){this.settleUntil=this.clock+kp}animating(){return this.residents.some(e=>{let t=e.mesh.state.tracks[0];return t!=null&&(t.loop||!t.isComplete())})}dispose(){for(let e of this.residents)e.mesh.dispose();for(let e of this.atlases.values()){for(let t of e.pages){let n=t.texture?.texture.image;n instanceof HTMLImageElement&&(n.src="")}e.dispose()}this.scene.traverse(e=>{if(e instanceof It&&!(e.parent instanceof Cs)){e.geometry.dispose();let t=Array.isArray(e.material)?e.material:[e.material];for(let n of t){let i=n.map?.image;typeof ImageBitmap<"u"&&i instanceof ImageBitmap&&i.close(),n.map?.dispose(),n.dispose()}}})}};var Zv="spots",Wp="home_003_yumemita_01_vrfloor_03/30001",Xp=.06,Jv=.25,jv=1e-4,ra=new URLSearchParams(location.search),Qv=Number(ra.get("fps")??30),eb=1e3/Qv-1,tb=ra.get("driver")==="native",Ue={stage:null,base:null,pointer:{x:0,y:0},smooth:{x:0,y:0},characters:ra.get("chars")!=="0",hidden:(ra.get("hide")??"").split(",").filter(Boolean),paused:!1,last:0,frame:null,loadToken:0,dir:""},fd=document.getElementById("spot"),ud=Gp(fd);window.__gpu=()=>({...ud.info.memory,programs:ud.info.programs?.length??0});function Yp(){let r=Ue.stage;if(!r)return;let e=window.innerWidth,t=window.innerHeight;r.setSize(e,t),Ue.base=Id(r.data.situation,Cd(r.data.situation,e,t))}function nb(r){(!Ue.last||r-Ue.last>=eb)&&md(r),pd()}function pd(){Ue.frame=Ue.paused||tb?null:requestAnimationFrame(nb)}function md(r){let e=Ue.stage,t=Ue.last?Math.min(Jv,(r-Ue.last)/1e3):0;if(Ue.last=r,!e||!Ue.base)return;let n={...Ue.smooth};Ue.smooth.x+=(Ue.pointer.x-Ue.smooth.x)*Xp,Ue.smooth.y+=(Ue.pointer.y-Ue.smooth.y)*Xp;let i=Math.abs(Ue.smooth.x-n.x)+Math.abs(Ue.smooth.y-n.y)>jv;e.setPose(Pd(Ue.base,Ue.smooth.x,Ue.smooth.y,e.data.situation,window.innerWidth/Math.max(window.innerHeight,1))),e.render(t,i),window.__frames=(window.__frames??0)+1,window.__drawn=e.drawn}async function qp(r){let e=++Ue.loadToken;Ue.dir=r,window.__wallpaperReady=void 0;let t=await Dc.create(ud,Zv,r);if(e!==Ue.loadToken){t.dispose();return}Ue.stage?.dispose(),Ue.stage=t,t.setCharactersVisible(Ue.characters),t.setHiddenMembers(Ue.hidden),Yp(),Ue.last=0,md(performance.now()),Ue.frame===null&&pd(),window.__wallpaperReady="ok"}function ib(r){window.__wallpaperReady=`error: ${r instanceof Error?`${r.message} @ ${r.stack?.split(`
`).slice(0,3).join(" < ")}`:String(r)}`,document.body.dataset.error=window.__wallpaperReady}function $p(r){return e=>{Ue.dir===r&&(Ue.dir=""),ib(e),Uc({event:"loadError",dir:r,message:window.__wallpaperReady??""})}}function Uc(r){window.webkit?.messageHandlers?.wallpaper?.postMessage(r)}var sb=1e4,dd;fd.addEventListener("webglcontextlost",()=>{Uc({event:"contextLost",dir:Ue.dir}),window.clearTimeout(dd),dd=window.setTimeout(()=>Uc({event:"reload",dir:Ue.dir}),sb)});fd.addEventListener("webglcontextrestored",()=>{window.clearTimeout(dd),Ue.stage?.invalidate(),Uc({event:"contextRestored",dir:Ue.dir})});var rb={setPointer(r,e){Ue.pointer={x:Math.max(-1,Math.min(1,r)),y:Math.max(-1,Math.min(1,e))}},setPaused(r){Ue.paused=r,!r&&Ue.frame===null&&(Ue.last=0,pd())},setCharacters(r){Ue.characters=r,Ue.stage?.setCharactersVisible(r)},setHidden(r){Ue.hidden=r,Ue.stage?.setHiddenMembers(r)},step(){if(Ue.paused)return 0;let r=Ue.stage?.drawn??0;return md(performance.now()),(Ue.stage?.drawn??0)!==r||!Ue.stage?1:0},setSituation(r){r!==Ue.dir&&qp(r).catch($p(r))}};window.wallpaper=rb;window.addEventListener("resize",Yp);qp(ra.get("situation")??Wp).catch($p(ra.get("situation")??Wp));
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
