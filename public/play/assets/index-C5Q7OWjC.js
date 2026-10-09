(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`attached`,t=1e3,n=1001,r=1002,i=1003,a=1004,o=1005,s=1006,c=1007,l=1008,u=1009,d=1010,f=1011,p=1012,m=1013,h=1014,g=1015,_=1016,v=1017,y=1018,b=1020,x=35902,S=35899,C=1021,w=1022,T=1023,E=1026,D=1027,O=1028,ee=1029,k=1030,te=1031,ne=1033,A=33776,j=33777,re=33778,M=33779,ie=35840,ae=35841,oe=35842,se=35843,ce=36196,le=37492,ue=37496,N=37488,de=37489,fe=37490,pe=37491,me=37808,he=37809,ge=37810,_e=37811,ve=37812,ye=37813,be=37814,xe=37815,Se=37816,Ce=37817,we=37818,Te=37819,Ee=37820,De=37821,Oe=36492,ke=36494,Ae=36495,je=36283,Me=36284,Ne=36285,Pe=36286,P=2300,Fe=2301,Ie=2302,Le=2303,F=2400,Re=2401,ze=2402,Be=2500,Ve=3200,He=`srgb`,Ue=`srgb-linear`,We=`linear`,Ge=`srgb`,Ke=7680,qe=35044,Je=2e3;function Ye(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function Xe(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function Ze(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function Qe(){let e=Ze(`canvas`);return e.style.display=`block`,e}var $e={};function et(...e){let t=`THREE.`+e.shift();console.log(t,...e)}function tt(e){let t=e[0];if(typeof t==`string`&&t.startsWith(`TSL:`)){let t=e[1];t&&t.isStackTrace?e[0]+=` `+t.getLocation():e[1]=`Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`}return e}function I(...e){e=tt(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function L(...e){e=tt(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function nt(...e){let t=e.join(` `);t in $e||($e[t]=!0,I(...e))}function rt(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var it={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3},at=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n!==void 0&&n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},ot=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),st=1234567,ct=Math.PI/180,lt=180/Math.PI;function ut(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(ot[e&255]+ot[e>>8&255]+ot[e>>16&255]+ot[e>>24&255]+`-`+ot[t&255]+ot[t>>8&255]+`-`+ot[t>>16&15|64]+ot[t>>24&255]+`-`+ot[n&63|128]+ot[n>>8&255]+`-`+ot[n>>16&255]+ot[n>>24&255]+ot[r&255]+ot[r>>8&255]+ot[r>>16&255]+ot[r>>24&255]).toLowerCase()}function dt(e,t,n){return Math.max(t,Math.min(n,e))}function ft(e,t){return(e%t+t)%t}function pt(e,t,n,r,i){return r+(e-t)*(i-r)/(n-t)}function mt(e,t,n){return e===t?0:(n-e)/(t-e)}function ht(e,t,n){return(1-n)*e+n*t}function gt(e,t,n,r){return ht(e,t,1-Math.exp(-n*r))}function _t(e,t=1){return t-Math.abs(ft(e,t*2)-t)}function vt(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*(3-2*e))}function yt(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*e*(e*(e*6-15)+10))}function bt(e,t){return e+Math.floor(Math.random()*(t-e+1))}function xt(e,t){return e+Math.random()*(t-e)}function St(e){return e*(.5-Math.random())}function Ct(e){e!==void 0&&(st=e);let t=st+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function wt(e){return e*ct}function Tt(e){return e*lt}function Et(e){return e>0&&Number.isInteger(e)&&2**Math.round(Math.log2(e))===e}function Dt(e){return 2**Math.ceil(Math.log(e)/Math.LN2)}function Ot(e){return 2**Math.floor(Math.log(e)/Math.LN2)}function kt(e,t,n,r,i){let a=Math.cos,o=Math.sin,s=a(n/2),c=o(n/2),l=a((t+r)/2),u=o((t+r)/2),d=a((t-r)/2),f=o((t-r)/2),p=a((r-t)/2),m=o((r-t)/2);switch(i){case`XYX`:e.set(s*u,c*d,c*f,s*l);break;case`YZY`:e.set(c*f,s*u,c*d,s*l);break;case`ZXZ`:e.set(c*d,c*f,s*u,s*l);break;case`XZX`:e.set(s*u,c*m,c*p,s*l);break;case`YXY`:e.set(c*p,s*u,c*m,s*l);break;case`ZYZ`:e.set(c*m,c*p,s*u,s*l);break;default:I(`MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: `+i)}}function At(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:case Uint8ClampedArray:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}function jt(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}var Mt={DEG2RAD:ct,RAD2DEG:lt,generateUUID:ut,clamp:dt,euclideanModulo:ft,mapLinear:pt,inverseLerp:mt,lerp:ht,damp:gt,pingpong:_t,smoothstep:vt,smootherstep:yt,randInt:bt,randFloat:xt,randFloatSpread:St,seededRandom:Ct,degToRad:wt,radToDeg:Tt,isPowerOfTwo:Et,ceilPowerOfTwo:Dt,floorPowerOfTwo:Ot,setQuaternionFromProperEuler:kt,normalize:jt,denormalize:At},R=class e{static{e.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`THREE.Vector2: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`THREE.Vector2: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=dt(this.x,e.x,t.x),this.y=dt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=dt(this.x,e,t),this.y=dt(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(dt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(dt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Nt=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(u!==m||s!==d||c!==f||l!==p){let e=s*d+c*f+l*p+u*m;e<0&&(d=-d,f=-f,p=-p,m=-m,e=-e);let t=1-o;if(e<.9995){let n=Math.acos(e),r=Math.sin(n);t=Math.sin(t*n)/r,o=Math.sin(o*n)/r,s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o}else{s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o;let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:I(`Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(dt(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,i=-i,a=-a,o=-o);let s=1-t;if(o<.9995){let e=Math.acos(o),c=Math.sin(e);s=Math.sin(s*e)/c,t=Math.sin(t*e)/c,this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this._onChangeCallback()}else this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},z=class e{static{e.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`THREE.Vector3: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`THREE.Vector3: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Ft.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Ft.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=dt(this.x,e.x,t.x),this.y=dt(this.y,e.y,t.y),this.z=dt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=dt(this.x,e,t),this.y=dt(this.y,e,t),this.z=dt(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(dt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Pt.copy(this).projectOnVector(e),this.sub(Pt)}reflect(e){return this.sub(Pt.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(dt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Pt=new z,Ft=new Nt,It=class e{static{e.prototype.isMatrix3=!0}constructor(e,t,n,r,i,a,o,s,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return nt(`Matrix3: .scale() is deprecated. Use .makeScale() instead.`),this.premultiply(Lt.makeScale(e,t)),this}rotate(e){return nt(`Matrix3: .rotate() is deprecated. Use .makeRotation() instead.`),this.premultiply(Lt.makeRotation(-e)),this}translate(e,t){return nt(`Matrix3: .translate() is deprecated. Use .makeTranslation() instead.`),this.premultiply(Lt.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Lt=new It,Rt=new It().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),zt=new It().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Bt(){let e={enabled:!0,workingColorSpace:Ue,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n||(this.spaces[t].transfer===`srgb`&&(e.r=Ht(e.r),e.g=Ht(e.g),e.b=Ht(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=Ut(e.r),e.g=Ut(e.g),e.b=Ut(e.b))),e},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?We:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[t].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(t,n){return nt(`ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace().`),e.workingToColorSpace(t,n)},toWorkingColorSpace:function(t,n){return nt(`ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking().`),e.colorSpaceToWorking(t,n)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[Ue]:{primaries:t,whitePoint:r,transfer:We,toXYZ:Rt,fromXYZ:zt,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:He},outputColorSpaceConfig:{drawingBufferColorSpace:He}},[He]:{primaries:t,whitePoint:r,transfer:Ge,toXYZ:Rt,fromXYZ:zt,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:He}}}),e}var Vt=Bt();function Ht(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function Ut(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var Wt,Gt=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Wt===void 0&&(Wt=Ze(`canvas`)),Wt.width=e.width,Wt.height=e.height;let t=Wt.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=Wt}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=Ze(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=Ht(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(Ht(t[e]/255)*255):t[e]=Ht(t[e]);return{data:t,width:e.width,height:e.height}}return I(`ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},Kt=0,qt=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Kt++}),this.uuid=ut(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<`u`&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t===null?e.set(0,0,0):e.set(t.width,t.height,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(Jt(r[t].image)):e.push(Jt(r[t]))}else e=Jt(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function Jt(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?Gt.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(I(`Texture: Unable to serialize Texture.`),{})}var Yt=0,Xt=new z,Zt=class e extends at{constructor(t=e.DEFAULT_IMAGE,r=e.DEFAULT_MAPPING,i=n,a=n,o=s,c=l,d=T,f=u,p=e.DEFAULT_ANISOTROPY,m=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Yt++}),this.uuid=ut(),this.name=``,this.source=new qt(t),this.mipmaps=[],this.mapping=r,this.channel=0,this.wrapS=i,this.wrapT=a,this.magFilter=o,this.minFilter=c,this.anisotropy=p,this.format=d,this.internalFormat=null,this.type=f,this.offset=new R(0,0),this.repeat=new R(1,1),this.center=new R(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new It,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=m,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Xt).x}get height(){return this.source.getSize(Xt).y}get depth(){return this.source.getSize(Xt).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){I(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?I(`Texture.setValues(): property '${t}' does not exist.`):r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case t:e.x-=Math.floor(e.x);break;case n:e.x=e.x<0?0:1;break;case r:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x-=Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case t:e.y-=Math.floor(e.y);break;case n:e.y=e.y<0?0:1;break;case r:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y-=Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Zt.DEFAULT_IMAGE=null,Zt.DEFAULT_MAPPING=300,Zt.DEFAULT_ANISOTROPY=1;var Qt=class e{static{e.prototype.isVector4=!0}constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`THREE.Vector4: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`THREE.Vector4: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=dt(this.x,e.x,t.x),this.y=dt(this.y,e.y,t.y),this.z=dt(this.z,e.z,t.z),this.w=dt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=dt(this.x,e,t),this.y=dt(this.y,e,t),this.z=dt(this.z,e,t),this.w=dt(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(dt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},$t=class extends at{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:s,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Qt(0,0,e,t),this.scissorTest=!1,this.viewport=new Qt(0,0,e,t),this.textures=[];let r=new Zt({width:e,height:t,depth:n.depth}),i=n.count;for(let e=0;e<i;e++)this.textures[e]=r.clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:s,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new qt(n)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null){if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture}return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:`dispose`})}},en=class extends $t{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},tn=class extends Zt{constructor(e=null,t=1,r=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:r,depth:a},this.magFilter=i,this.minFilter=i,this.wrapR=n,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},nn=class extends Zt{constructor(e=null,t=1,r=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:r,depth:a},this.magFilter=i,this.minFilter=i,this.wrapR=n,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}},B=class e{static{e.prototype.isMatrix4=!0}constructor(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/rn.setFromMatrixColumn(e,0).length(),i=1/rn.setFromMatrixColumn(e,1).length(),a=1/rn.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(on,e,sn)}lookAt(e,t,n){let r=this.elements;return un.subVectors(e,t),un.lengthSq()===0&&(un.z=1),un.normalize(),cn.crossVectors(n,un),cn.lengthSq()===0&&(Math.abs(n.z)===1?un.x+=1e-4:un.z+=1e-4,un.normalize(),cn.crossVectors(n,un)),cn.normalize(),ln.crossVectors(un,cn),r[0]=cn.x,r[4]=ln.x,r[8]=un.x,r[1]=cn.y,r[5]=ln.y,r[9]=un.y,r[2]=cn.z,r[6]=ln.z,r[10]=un.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],O=r[13],ee=r[2],k=r[6],te=r[10],ne=r[14],A=r[3],j=r[7],re=r[11],M=r[15];return i[0]=a*x+o*T+s*ee+c*A,i[4]=a*S+o*E+s*k+c*j,i[8]=a*C+o*D+s*te+c*re,i[12]=a*w+o*O+s*ne+c*M,i[1]=l*x+u*T+d*ee+f*A,i[5]=l*S+u*E+d*k+f*j,i[9]=l*C+u*D+d*te+f*re,i[13]=l*w+u*O+d*ne+f*M,i[2]=p*x+m*T+h*ee+g*A,i[6]=p*S+m*E+h*k+g*j,i[10]=p*C+m*D+h*te+g*re,i[14]=p*w+m*O+h*ne+g*M,i[3]=_*x+v*T+y*ee+b*A,i[7]=_*S+v*E+y*k+b*j,i[11]=_*C+v*D+y*te+b*re,i[15]=_*w+v*O+y*ne+b*M,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15],_=s*f-c*d,v=o*f-c*u,y=o*d-s*u,b=a*f-c*l,x=a*d-s*l,S=a*u-o*l;return t*(m*_-h*v+g*y)-n*(p*_-h*b+g*x)+r*(p*v-m*b+g*S)-i*(p*y-m*x+h*S)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[1],a=e[5],o=e[9],s=e[2],c=e[6],l=e[10];return t*(a*l-o*c)-n*(i*l-o*s)+r*(i*c-a*s)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=t*o-n*a,v=t*s-r*a,y=t*c-i*a,b=n*s-r*o,x=n*c-i*o,S=r*c-i*s,C=l*m-u*p,w=l*h-d*p,T=l*g-f*p,E=u*h-d*m,D=u*g-f*m,O=d*g-f*h,ee=_*O-v*D+y*E+b*T-x*w+S*C;if(ee===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let k=1/ee;return e[0]=(o*O-s*D+c*E)*k,e[1]=(r*D-n*O-i*E)*k,e[2]=(m*S-h*x+g*b)*k,e[3]=(d*x-u*S-f*b)*k,e[4]=(s*T-a*O-c*w)*k,e[5]=(t*O-r*T+i*w)*k,e[6]=(h*y-p*S-g*v)*k,e[7]=(l*S-d*y+f*v)*k,e[8]=(a*D-o*T+c*C)*k,e[9]=(n*T-t*D-i*C)*k,e[10]=(p*x-m*y+g*_)*k,e[11]=(u*y-l*x-f*_)*k,e[12]=(o*w-a*E-s*C)*k,e[13]=(t*E-n*w+r*C)*k,e[14]=(m*v-p*b-h*_)*k,e[15]=(l*b-u*v+d*_)*k,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let i=this.determinantAffine();if(i===0)return n.set(1,1,1),t.identity(),this;let a=rn.set(r[0],r[1],r[2]).length(),o=rn.set(r[4],r[5],r[6]).length(),s=rn.set(r[8],r[9],r[10]).length();i<0&&(a=-a),an.copy(this);let c=1/a,l=1/o,u=1/s;return an.elements[0]*=c,an.elements[1]*=c,an.elements[2]*=c,an.elements[4]*=l,an.elements[5]*=l,an.elements[6]*=l,an.elements[8]*=u,an.elements[9]*=u,an.elements[10]*=u,t.setFromRotationMatrix(an),n.x=a,n.y=o,n.z=s,this}makePerspective(e,t,n,r,i,a,o=Je,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=Je,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},rn=new z,an=new B,on=new z(0,0,0),sn=new z(1,1,1),cn=new z,ln=new z,un=new z,dn=new B,fn=new Nt,pn=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(dt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-dt(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(dt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-dt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(dt(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-dt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:I(`Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return dn.makeRotationFromQuaternion(e),this.setFromRotationMatrix(dn,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return fn.setFromEuler(this),this.setFromQuaternion(fn,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};pn.DEFAULT_ORDER=`XYZ`;var mn=class{constructor(){this.mask=1}set(e){this.mask=1<<e>>>0}enable(e){this.mask|=1<<e}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e}disable(e){this.mask&=~(1<<e)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&1<<e)}},hn=0,gn=new z,_n=new Nt,vn=new B,yn=new z,bn=new z,xn=new z,Sn=new Nt,Cn=new z(1,0,0),wn=new z(0,1,0),Tn=new z(0,0,1),En={type:`added`},Dn={type:`removed`},On={type:`childadded`,child:null},kn={type:`childremoved`,child:null},An=class e extends at{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:hn++}),this.uuid=ut(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new z,n=new pn,r=new Nt,i=new z(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new B},normalMatrix:{value:new It}}),this.matrix=new B,this.matrixWorld=new B,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new mn,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return _n.setFromAxisAngle(e,t),this.quaternion.multiply(_n),this}rotateOnWorldAxis(e,t){return _n.setFromAxisAngle(e,t),this.quaternion.premultiply(_n),this}rotateX(e){return this.rotateOnAxis(Cn,e)}rotateY(e){return this.rotateOnAxis(wn,e)}rotateZ(e){return this.rotateOnAxis(Tn,e)}translateOnAxis(e,t){return gn.copy(e).applyQuaternion(this.quaternion),this.position.add(gn.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Cn,e)}translateY(e){return this.translateOnAxis(wn,e)}translateZ(e){return this.translateOnAxis(Tn,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(vn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?yn.copy(e):yn.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),bn.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?vn.lookAt(bn,yn,this.up):vn.lookAt(yn,bn,this.up),this.quaternion.setFromRotationMatrix(vn),r&&(vn.extractRotation(r.matrixWorld),_n.setFromRotationMatrix(vn),this.quaternion.premultiply(_n.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(L(`Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(En),On.child=e,this.dispatchEvent(On),On.child=null):L(`Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Dn),kn.child=e,this.dispatchEvent(kn),kn.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),vn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),vn.multiply(e.parent.matrixWorld)),e.applyMatrix4(vn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(En),On.child=e,this.dispatchEvent(On),On.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(bn,e,xn),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(bn,Sn,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,i=this.matrix.elements;i[12]+=t-i[0]*t-i[4]*n-i[8]*r,i[13]+=n-i[1]*t-i[5]*n-i[9]*r,i[14]+=r-i[2]*t-i[6]*n-i[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let e=this.children;for(let t=0,r=e.length;t<r;t++)e[t].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot===null?null:e.pivot.clone(),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}dispose(){this.dispatchEvent({type:`dispose`})}};An.DEFAULT_UP=new z(0,1,0),An.DEFAULT_MATRIX_AUTO_UPDATE=!0,An.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var jn=class extends An{constructor(){super(),this.isGroup=!0,this.type=`Group`}},Mn={type:`move`},Nn=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new jn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new jn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new z,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new z),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new jn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new z,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new z,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.rotation,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,s.eventsEnabled&&s.dispatchEvent({type:`gripUpdated`,data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Mn)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new jn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Pn={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Fn={h:0,s:0,l:0},In={h:0,s:0,l:0};function Ln(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var V=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=He){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Vt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=Vt.workingColorSpace){return this.r=e,this.g=t,this.b=n,Vt.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=Vt.workingColorSpace){if(e=ft(e,1),t=dt(t,0,1),n=dt(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=Ln(i,r,e+1/3),this.g=Ln(i,r,e),this.b=Ln(i,r,e-1/3)}return Vt.colorSpaceToWorking(this,r),this}setStyle(e,t=He){function n(t){t!==void 0&&parseFloat(t)<1&&I(`Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseInt(i[1],10))/100,Math.min(100,parseInt(i[2],10))/100,Math.min(100,parseInt(i[3],10))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:I(`Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);I(`Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=He){let n=Pn[e.toLowerCase()];return n===void 0?I(`Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ht(e.r),this.g=Ht(e.g),this.b=Ht(e.b),this}copyLinearToSRGB(e){return this.r=Ut(e.r),this.g=Ut(e.g),this.b=Ut(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=He){return Vt.workingToColorSpace(Rn.copy(this),e),Math.round(dt(Rn.r*255,0,255))*65536+Math.round(dt(Rn.g*255,0,255))*256+Math.round(dt(Rn.b*255,0,255))}getHexString(e=He){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Vt.workingColorSpace){Vt.workingToColorSpace(Rn.copy(this),t);let n=Rn.r,r=Rn.g,i=Rn.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=Vt.workingColorSpace){return Vt.workingToColorSpace(Rn.copy(this),t),e.r=Rn.r,e.g=Rn.g,e.b=Rn.b,e}getStyle(e=He){Vt.workingToColorSpace(Rn.copy(this),e);let t=Rn.r,n=Rn.g,r=Rn.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(Fn),this.setHSL(Fn.h+e,Fn.s+t,Fn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Fn),e.getHSL(In);let n=ht(Fn.h,In.h,t),r=ht(Fn.s,In.s,t),i=ht(Fn.l,In.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Rn=new V;V.NAMES=Pn;var zn=class e{constructor(e,t=1,n=1e3){this.isFog=!0,this.name=``,this.color=new V(e),this.near=t,this.far=n}clone(){return new e(this.color,this.near,this.far)}toJSON(){return{type:`Fog`,name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},Bn=class extends An{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new pn,this.environmentIntensity=1,this.environmentRotation=new pn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},Vn=new z,Hn=new z,Un=new z,Wn=new z,Gn=new z,Kn=new z,qn=new z,Jn=new z,Yn=new z,Xn=new z,Zn=new Qt,Qn=new Qt,$n=new Qt,er=class e{constructor(e=new z,t=new z,n=new z){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),Vn.subVectors(e,t),r.cross(Vn);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){Vn.subVectors(r,t),Hn.subVectors(n,t),Un.subVectors(e,t);let a=Vn.dot(Vn),o=Vn.dot(Hn),s=Vn.dot(Un),c=Hn.dot(Hn),l=Hn.dot(Un),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,Wn)!==null&&Wn.x>=0&&Wn.y>=0&&Wn.x+Wn.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,Wn)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,Wn.x),s.addScaledVector(a,Wn.y),s.addScaledVector(o,Wn.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return Zn.setScalar(0),Qn.setScalar(0),$n.setScalar(0),Zn.fromBufferAttribute(e,t),Qn.fromBufferAttribute(e,n),$n.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(Zn,i.x),a.addScaledVector(Qn,i.y),a.addScaledVector($n,i.z),a}static isFrontFacing(e,t,n,r){return Vn.subVectors(n,t),Hn.subVectors(e,t),Vn.cross(Hn).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Vn.subVectors(this.c,this.b),Hn.subVectors(this.a,this.b),Vn.cross(Hn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;Gn.subVectors(r,n),Kn.subVectors(i,n),Jn.subVectors(e,n);let s=Gn.dot(Jn),c=Kn.dot(Jn);if(s<=0&&c<=0)return t.copy(n);Yn.subVectors(e,r);let l=Gn.dot(Yn),u=Kn.dot(Yn);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0)return a=s/(s-l),t.copy(n).addScaledVector(Gn,a);Xn.subVectors(e,i);let f=Gn.dot(Xn),p=Kn.dot(Xn);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(Kn,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return qn.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(qn,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(Gn,a).addScaledVector(Kn,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},tr=class{constructor(e=new z(1/0,1/0,1/0),t=new z(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(rr.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(rr.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=rr.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,rr):rr.fromBufferAttribute(r,t),rr.applyMatrix4(e.matrixWorld),this.expandByPoint(rr);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),ir.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),ir.copy(e.boundingBox)),ir.applyMatrix4(e.matrixWorld),this.union(ir)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,rr),rr.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(dr),fr.subVectors(this.max,dr),ar.subVectors(e.a,dr),or.subVectors(e.b,dr),sr.subVectors(e.c,dr),cr.subVectors(or,ar),lr.subVectors(sr,or),ur.subVectors(ar,sr);let t=[0,-cr.z,cr.y,0,-lr.z,lr.y,0,-ur.z,ur.y,cr.z,0,-cr.x,lr.z,0,-lr.x,ur.z,0,-ur.x,-cr.y,cr.x,0,-lr.y,lr.x,0,-ur.y,ur.x,0];return!hr(t,ar,or,sr,fr)||(t=[1,0,0,0,1,0,0,0,1],!hr(t,ar,or,sr,fr))?!1:(pr.crossVectors(cr,lr),t=[pr.x,pr.y,pr.z],hr(t,ar,or,sr,fr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,rr).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(rr).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||(nr[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),nr[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),nr[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),nr[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),nr[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),nr[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),nr[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),nr[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(nr)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},nr=[new z,new z,new z,new z,new z,new z,new z,new z],rr=new z,ir=new tr,ar=new z,or=new z,sr=new z,cr=new z,lr=new z,ur=new z,dr=new z,fr=new z,pr=new z,mr=new z;function hr(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){mr.fromArray(e,a);let o=i.x*Math.abs(mr.x)+i.y*Math.abs(mr.y)+i.z*Math.abs(mr.z),s=t.dot(mr),c=n.dot(mr),l=r.dot(mr);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var gr=new z,_r=new R,vr=0,yr=class extends at{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:vr++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=qe,this.updateRanges=[],this.gpuType=g,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)_r.fromBufferAttribute(this,t),_r.applyMatrix3(e),this.setXY(t,_r.x,_r.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)gr.fromBufferAttribute(this,t),gr.applyMatrix3(e),this.setXYZ(t,gr.x,gr.y,gr.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)gr.fromBufferAttribute(this,t),gr.applyMatrix4(e),this.setXYZ(t,gr.x,gr.y,gr.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)gr.fromBufferAttribute(this,t),gr.applyNormalMatrix(e),this.setXYZ(t,gr.x,gr.y,gr.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)gr.fromBufferAttribute(this,t),gr.transformDirection(e),this.setXYZ(t,gr.x,gr.y,gr.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=At(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=jt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=At(t,this.array)),t}setX(e,t){return this.normalized&&(t=jt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=At(t,this.array)),t}setY(e,t){return this.normalized&&(t=jt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=At(t,this.array)),t}setZ(e,t){return this.normalized&&(t=jt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=At(t,this.array)),t}setW(e,t){return this.normalized&&(t=jt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=jt(t,this.array),n=jt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=jt(t,this.array),n=jt(n,this.array),r=jt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=jt(t,this.array),n=jt(n,this.array),r=jt(r,this.array),i=jt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:`dispose`})}},br=class extends yr{constructor(e,t,n){super(new Uint16Array(e),t,n)}},xr=class extends yr{constructor(e,t,n){super(new Uint32Array(e),t,n)}},Sr=class extends yr{constructor(e,t,n){super(new Float32Array(e),t,n)}},Cr=new tr,wr=new z,Tr=new z,Er=class{constructor(e=new z,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?Cr.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;wr.subVectors(e,this.center);let t=wr.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(wr,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Tr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(wr.copy(e.center).add(Tr)),this.expandByPoint(wr.copy(e.center).sub(Tr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Dr=0,Or=new B,kr=new An,Ar=new z,jr=new tr,Mr=new tr,Nr=new z,Pr=class e extends at{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Dr++}),this.uuid=ut(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(Ye(e)?xr:br)(e,1):e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new It().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Or.makeRotationFromQuaternion(e),this.applyMatrix4(Or),this}rotateX(e){return Or.makeRotationX(e),this.applyMatrix4(Or),this}rotateY(e){return Or.makeRotationY(e),this.applyMatrix4(Or),this}rotateZ(e){return Or.makeRotationZ(e),this.applyMatrix4(Or),this}translate(e,t,n){return Or.makeTranslation(e,t,n),this.applyMatrix4(Or),this}scale(e,t,n){return Or.makeScale(e,t,n),this.applyMatrix4(Or),this}lookAt(e){return kr.lookAt(e),kr.updateMatrix(),this.applyMatrix4(kr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ar).negate(),this.translate(Ar.x,Ar.y,Ar.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new Sr(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&I(`BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new tr);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)L(`BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new z(-1/0,-1/0,-1/0),new z(1/0,1/0,1/0));else{if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];jr.setFromBufferAttribute(n),this.morphTargetsRelative?(Nr.addVectors(this.boundingBox.min,jr.min),this.boundingBox.expandByPoint(Nr),Nr.addVectors(this.boundingBox.max,jr.max),this.boundingBox.expandByPoint(Nr)):(this.boundingBox.expandByPoint(jr.min),this.boundingBox.expandByPoint(jr.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&L(`BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Er);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)L(`BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new z,1/0);else if(e){let n=this.boundingSphere.center;if(jr.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Mr.setFromBufferAttribute(n),this.morphTargetsRelative?(Nr.addVectors(jr.min,Mr.min),jr.expandByPoint(Nr),Nr.addVectors(jr.max,Mr.max),jr.expandByPoint(Nr)):(jr.expandByPoint(Mr.min),jr.expandByPoint(Mr.max))}jr.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)Nr.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(Nr));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)Nr.fromBufferAttribute(a,t),o&&(Ar.fromBufferAttribute(e,t),Nr.add(Ar)),r=Math.max(r,n.distanceToSquared(Nr))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&L(`BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){L(`BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv,a=this.getAttribute(`tangent`);(a===void 0||a.count!==n.count)&&(a=new yr(new Float32Array(4*n.count),4),this.setAttribute(`tangent`,a));let o=[],s=[];for(let e=0;e<n.count;e++)o[e]=new z,s[e]=new z;let c=new z,l=new z,u=new z,d=new R,f=new R,p=new R,m=new z,h=new z;function g(e,t,r){c.fromBufferAttribute(n,e),l.fromBufferAttribute(n,t),u.fromBufferAttribute(n,r),d.fromBufferAttribute(i,e),f.fromBufferAttribute(i,t),p.fromBufferAttribute(i,r),l.sub(c),u.sub(c),f.sub(d),p.sub(d);let a=1/(f.x*p.y-p.x*f.y);isFinite(a)&&(m.copy(l).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(a),h.copy(u).multiplyScalar(f.x).addScaledVector(l,-p.x).multiplyScalar(a),o[e].add(m),o[t].add(m),o[r].add(m),s[e].add(h),s[t].add(h),s[r].add(h))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)g(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let v=new z,y=new z,b=new z,x=new z;function S(e){b.fromBufferAttribute(r,e),x.copy(b);let t=o[e];v.copy(t),v.sub(b.multiplyScalar(b.dot(t))).normalize(),y.crossVectors(x,t);let n=y.dot(s[e])<0?-1:1;a.setXYZW(e,v.x,v.y,v.z,n)}for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)S(e.getX(t+0)),S(e.getX(t+1)),S(e.getX(t+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0||n.count!==t.count)n=new yr(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new z,i=new z,a=new z,o=new z,s=new z,c=new z,l=new z,u=new z;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Nr.fromBufferAttribute(e,t),Nr.normalize(),e.setXYZ(t,Nr.x,Nr.y,Nr.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new yr(a,r,i)}if(this.index===null)return I(`BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?`BufferGeometry`:this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:`dispose`})}},Fr=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e===void 0?0:e.length/t,this.usage=qe,this.updateRanges=[],this.version=0,this.uuid=ut()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let r=0,i=this.stride;r<i;r++)this.array[e+r]=t.array[n+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ut()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ut()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}},Ir=new z,Lr=class e{constructor(e,t,n,r=!1){this.isInterleavedBufferAttribute=!0,this.name=``,this.data=e,this.itemSize=t,this.offset=n,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Ir.fromBufferAttribute(this,t),Ir.applyMatrix4(e),this.setXYZ(t,Ir.x,Ir.y,Ir.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ir.fromBufferAttribute(this,t),Ir.applyNormalMatrix(e),this.setXYZ(t,Ir.x,Ir.y,Ir.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ir.fromBufferAttribute(this,t),Ir.transformDirection(e),this.setXYZ(t,Ir.x,Ir.y,Ir.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=At(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=jt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=jt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=jt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=jt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=jt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=At(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=At(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=At(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=At(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=jt(t,this.array),n=jt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=jt(t,this.array),n=jt(n,this.array),r=jt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=jt(t,this.array),n=jt(n,this.array),r=jt(r,this.array),i=jt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this.data.array[e+3]=i,this}clone(t){if(t===void 0){et(`InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.`);let e=[];for(let t=0;t<this.count;t++){let n=t*this.data.stride+this.offset;for(let t=0;t<this.itemSize;t++)e.push(this.data.array[n+t])}return new yr(new this.array.constructor(e),this.itemSize,this.normalized)}return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new e(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){et(`InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.`);let e=[];for(let t=0;t<this.count;t++){let n=t*this.data.stride+this.offset;for(let t=0;t<this.itemSize;t++)e.push(this.data.array[n+t])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Rr=new z,zr=new z,Br=new It,Vr=class{constructor(e=new z(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=Rr.subVectors(n,t).cross(zr.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(Rr),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Br.getNormalMatrix(e),r=this.coplanarPoint(Rr).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},Hr=0,Ur=class extends at{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Hr++}),this.uuid=ut(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new V(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ke,this.stencilZFail=Ke,this.stencilZPass=Ke,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){I(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?I(`Material: '${t}' is not a property of THREE.${this.type}.`):r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(e=>e.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new V().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(e=>new Vr().fromJSON(e))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(this.vertexColors=typeof e.vertexColors==`number`?e.vertexColors>0:e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let t=e.normalScale;Array.isArray(t)===!1&&(t=[t,t]),this.normalScale=new R().fromArray(t)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new R().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},Wr=class extends Ur{constructor(e){super(),this.isSpriteMaterial=!0,this.type=`SpriteMaterial`,this.color=new V(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Gr,Kr=new z,qr=new z,Jr=new z,Yr=new R,Xr=new R,Zr=new B,Qr=new z,$r=new z,ei=new z,ti=new R,ni=new R,ri=new R,ii=class extends An{constructor(e=new Wr){if(super(),this.isSprite=!0,this.type=`Sprite`,Gr===void 0){Gr=new Pr;let e=new Fr(new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),5);Gr.setIndex([0,1,2,0,2,3]),Gr.setAttribute(`position`,new Lr(e,3,0,!1)),Gr.setAttribute(`uv`,new Lr(e,2,3,!1))}this.geometry=Gr,this.material=e,this.center=new R(.5,.5),this.count=1}intersectsFrustum(e){return e.intersectsSprite(this)}raycast(e,t){e.camera===null&&L(`Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.`),qr.setFromMatrixScale(this.matrixWorld),Zr.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Jr.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&qr.multiplyScalar(-Jr.z);let n=this.material.rotation,r,i;n!==0&&(i=Math.cos(n),r=Math.sin(n));let a=this.center;ai(Qr.set(-.5,-.5,0),Jr,a,qr,r,i),ai($r.set(.5,-.5,0),Jr,a,qr,r,i),ai(ei.set(.5,.5,0),Jr,a,qr,r,i),ti.set(0,0),ni.set(1,0),ri.set(1,1);let o=e.ray.intersectTriangle(Qr,$r,ei,!1,Kr);if(o===null&&(ai($r.set(-.5,.5,0),Jr,a,qr,r,i),ni.set(0,1),o=e.ray.intersectTriangle(Qr,ei,$r,!1,Kr),o===null))return;let s=e.ray.origin.distanceTo(Kr);s<e.near||s>e.far||t.push({distance:s,point:Kr.clone(),uv:er.getInterpolation(Kr,Qr,$r,ei,ti,ni,ri,new R),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};function ai(e,t,n,r,i,a){Yr.subVectors(e,n).addScalar(.5).multiply(r),i===void 0?Xr.copy(Yr):(Xr.x=a*Yr.x-i*Yr.y,Xr.y=i*Yr.x+a*Yr.y),e.copy(t),e.x+=Xr.x,e.y+=Xr.y,e.applyMatrix4(Zr)}var oi=new z,si=new z,ci=new z,li=new z,ui=class{constructor(e=new z,t=new z(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,oi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=oi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(oi.copy(this.origin).addScaledVector(this.direction,t),oi.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){si.copy(e).add(t).multiplyScalar(.5),ci.copy(t).sub(e).normalize(),li.copy(this.origin).sub(si);let i=e.distanceTo(t)*.5,a=-this.direction.dot(ci),o=li.dot(this.direction),s=-li.dot(ci),c=li.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(si).addScaledVector(ci,d),f}intersectSphere(e,t){if(e.radius<0)return null;oi.subVectors(e.center,this.origin);let n=oi.dot(this.direction),r=oi.dot(oi)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,oi)!==null}intersectTriangle(e,t,n,r,i){let a=this.origin,o=this.direction,s=o.x,c=o.y,l=o.z,u=e.x-a.x,d=e.y-a.y,f=e.z-a.z,p=t.x-a.x,m=t.y-a.y,h=t.z-a.z,g=n.x-a.x,_=n.y-a.y,v=n.z-a.z,y=Math.abs(s),b=Math.abs(c),x=Math.abs(l),S,C,w,T,E,D,O,ee,k,te,ne,A;if(y>=b&&y>=x?(w=s,D=u,k=p,A=g,s>=0?(S=c,C=l,T=d,E=f,O=m,ee=h,te=_,ne=v):(S=l,C=c,T=f,E=d,O=h,ee=m,te=v,ne=_)):b>=x?(w=c,D=d,k=m,A=_,c>=0?(S=l,C=s,T=f,E=u,O=h,ee=p,te=v,ne=g):(S=s,C=l,T=u,E=f,O=p,ee=h,te=g,ne=v)):(w=l,D=f,k=h,A=v,l>=0?(S=s,C=c,T=u,E=d,O=p,ee=m,te=g,ne=_):(S=c,C=s,T=d,E=u,O=m,ee=p,te=_,ne=g)),w===0)return null;let j=S/w,re=C/w,M=1/w,ie=T-j*D,ae=E-re*D,oe=O-j*k,se=ee-re*k,ce=te-j*A,le=ne-re*A,ue=ce*se-le*oe,N=ie*le-ae*ce,de=oe*ae-se*ie;if(r){if(ue<0||N<0||de<0)return null}else if((ue<0||N<0||de<0)&&(ue>0||N>0||de>0))return null;let fe=ue+N+de;if(fe===0)return null;let pe=M*(ue*D+N*k+de*A);return(fe>0?pe<0:pe>0)?null:this.at(pe/fe,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},di=class extends Ur{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new V(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new pn,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},fi=new B,pi=new ui,mi=new Er,hi=new z,gi=new z,_i=new z,vi=new z,yi=new z,bi=new z,xi=new z,Si=new z,H=class extends An{constructor(e=new Pr,t=new di){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){bi.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(yi.fromBufferAttribute(s,e),a?bi.addScaledVector(yi,r):bi.addScaledVector(yi.sub(t),r))}t.add(bi)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),mi.copy(n.boundingSphere),mi.applyMatrix4(i),pi.copy(e.ray).recast(e.near),!(mi.containsPoint(pi.origin)===!1&&(pi.intersectSphere(mi,hi)===null||pi.origin.distanceToSquared(hi)>(e.far-e.near)**2))&&(fi.copy(i).invert(),pi.copy(e.ray).applyMatrix4(fi),(n.boundingBox===null||pi.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,pi)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null){if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=wi(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=wi(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}else if(s!==void 0){if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=wi(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=wi(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}}};function Ci(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;Si.copy(s),Si.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(Si);return l<n.near||l>n.far?null:{distance:l,point:Si.clone(),object:e}}function wi(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,gi),e.getVertexPosition(c,_i),e.getVertexPosition(l,vi);let u=Ci(e,t,n,r,gi,_i,vi,xi);if(u){let e=new z;er.getBarycoord(xi,gi,_i,vi,e),i&&(u.uv=er.getInterpolatedAttribute(i,s,c,l,e,new R)),a&&(u.uv1=er.getInterpolatedAttribute(a,s,c,l,e,new R)),o&&(u.normal=er.getInterpolatedAttribute(o,s,c,l,e,new z),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new z,materialIndex:0};er.getNormal(gi,_i,vi,t.normal),u.face=t,u.barycoord=e}return u}var Ti=new Qt,Ei=new Qt,Di=new Qt,Oi=new Qt,ki=new B,Ai=new z,ji=new Er,Mi=new B,Ni=new ui,Pi=class extends H{constructor(t,n){super(t,n),this.isSkinnedMesh=!0,this.type=`SkinnedMesh`,this.bindMode=e,this.bindMatrix=new B,this.bindMatrixInverse=new B,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new tr),this.boundingBox.makeEmpty();let t=e.getAttribute(`position`);for(let e=0;e<t.count;e++)this.getVertexPosition(e,Ai),this.boundingBox.expandByPoint(Ai)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Er),this.boundingSphere.makeEmpty();let t=e.getAttribute(`position`);for(let e=0;e<t.count;e++)this.getVertexPosition(e,Ai),this.boundingSphere.expandByPoint(Ai)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let n=this.material,r=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ji.copy(this.boundingSphere),ji.applyMatrix4(r),e.ray.intersectsSphere(ji)!==!1&&(Mi.copy(r).invert(),Ni.copy(e.ray).applyMatrix4(Mi),(this.boundingBox===null||Ni.intersectsBox(this.boundingBox)!==!1)&&this._computeIntersections(e,t,Ni)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new Qt,t=this.geometry.attributes.skinWeight;for(let n=0,r=t.count;n<r;n++){e.fromBufferAttribute(t,n);let r=1/e.manhattanLength();r===1/0?e.set(1,0,0,0):e.multiplyScalar(r),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===`attached`?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===`detached`?this.bindMatrixInverse.copy(this.bindMatrix).invert():I(`SkinnedMesh: Unrecognized bindMode: `+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,r=this.geometry;Ei.fromBufferAttribute(r.attributes.skinIndex,e),Di.fromBufferAttribute(r.attributes.skinWeight,e),t.isVector4?(Ti.copy(t),t.set(0,0,0,0)):(Ti.set(...t,1),t.set(0,0,0)),Ti.applyMatrix4(this.bindMatrix);for(let e=0;e<4;e++){let r=Di.getComponent(e);if(r!==0){let i=Ei.getComponent(e);ki.multiplyMatrices(n.bones[i].matrixWorld,n.boneInverses[i]),t.addScaledVector(Oi.copy(Ti).applyMatrix4(ki),r)}}return t.isVector4&&(t.w=Ti.w),t.applyMatrix4(this.bindMatrixInverse)}},Fi=class extends An{constructor(){super(),this.isBone=!0,this.type=`Bone`}},Ii=class extends Zt{constructor(e=null,t=1,n=1,r,a,o,s,c,l=i,u=i,d,f){super(null,o,s,c,l,u,r,a,d,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Li=new B,Ri=new B,zi=class e{constructor(e=[],t=[]){this.uuid=ut(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){I(`Skeleton: Number of inverse bone matrices does not match amount of bones.`),this.boneInverses=[];for(let e=0,t=this.bones.length;e<t;e++)this.boneInverses.push(new B)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let t=new B;this.bones[e]&&t.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(t)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let t=this.bones[e];t&&t.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let t=this.bones[e];t&&(t.parent&&t.parent.isBone?(t.matrix.copy(t.parent.matrixWorld).invert(),t.matrix.multiply(t.matrixWorld)):t.matrix.copy(t.matrixWorld),t.matrix.decompose(t.position,t.quaternion,t.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,r=this.boneTexture;for(let r=0,i=e.length;r<i;r++){let i=e[r]?e[r].matrixWorld:Ri;Li.multiplyMatrices(i,t[r]),Li.toArray(n,r*16)}r!==null&&(r.needsUpdate=!0)}clone(){return new e(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new Ii(t,e,e,T,g);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let n=this.bones[t];if(n.name===e)return n}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,r=e.bones.length;n<r;n++){let r=e.bones[n],i=t[r];i===void 0&&(I(`Skeleton: No bone found with UUID:`,r),i=new Fi),this.bones.push(i),this.boneInverses.push(new B().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:`Skeleton`,generator:`Skeleton.toJSON`},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let r=0,i=t.length;r<i;r++){let i=t[r];e.bones.push(i.uuid);let a=n[r];e.boneInverses.push(a.toArray())}return e}},Bi=class extends yr{constructor(e,t,n,r=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Vi=new B,Hi=new B,Ui=[],Wi=new tr,Gi=new B,Ki=new H,qi=new Er,Ji=class extends H{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Bi(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let e=0;e<n;e++)this.setMatrixAt(e,Gi)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new tr),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Vi),Wi.copy(e.boundingBox).applyMatrix4(Vi),this.boundingBox.union(Wi)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Er),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Vi),qi.copy(e.boundingSphere).applyMatrix4(Vi),this.boundingSphere.union(qi)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,r=this.morphTexture.source.data.data,i=e*(n.length+1)+1;for(let e=0;e<n.length;e++)n[e]=r[i+e]}raycast(e,t){let n=this.matrixWorld,r=this.count;if(Ki.geometry=this.geometry,Ki.material=this.material,Ki.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),qi.copy(this.boundingSphere),qi.applyMatrix4(n),e.ray.intersectsSphere(qi)!==!1))for(let i=0;i<r;i++){this.getMatrixAt(i,Vi),Hi.multiplyMatrices(n,Vi),Ki.matrixWorld=Hi,Ki.raycast(e,Ui);for(let e=0,n=Ui.length;e<n;e++){let n=Ui[e];n.instanceId=i,n.object=this,t.push(n)}Ui.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Bi(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new Ii(new Float32Array(r*this.count),r,this.count,O,g));let i=this.morphTexture.source.data.data,a=0;for(let e=0;e<n.length;e++)a+=n[e];let o=this.geometry.morphTargetsRelative?1:1-a,s=r*e;return i[s]=o,i.set(n,s+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Yi=new Er,Xi=new R(.5,.5),Zi=new z,Qi=class{constructor(e=new Vr,t=new Vr,n=new Vr,r=new Vr,i=new Vr,a=new Vr){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Je,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Yi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Yi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Yi)}intersectsSprite(e){return Yi.center.set(0,0,0),Yi.radius=.7071067811865476+Xi.distanceTo(e.center),Yi.applyMatrix4(e.matrixWorld),this.intersectsSphere(Yi)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(Zi.x=r.normal.x>0?e.max.x:e.min.x,Zi.y=r.normal.y>0?e.max.y:e.min.y,Zi.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Zi)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},$i=class extends Ur{constructor(e){super(),this.isLineBasicMaterial=!0,this.type=`LineBasicMaterial`,this.color=new V(16777215),this.map=null,this.linewidth=1,this.linecap=`round`,this.linejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},ea=new z,ta=new z,na=new B,ra=new ui,ia=new Er,aa=new z,oa=new z,sa=class extends An{constructor(e=new Pr,t=new $i){super(),this.isLine=!0,this.type=`Line`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let e=1,r=t.count;e<r;e++)ea.fromBufferAttribute(t,e-1),ta.fromBufferAttribute(t,e),n[e]=n[e-1],n[e]+=ea.distanceTo(ta);e.setAttribute(`lineDistance`,new Sr(n,1))}else I(`Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.`);return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ia.copy(n.boundingSphere),ia.applyMatrix4(r),ia.radius+=i,e.ray.intersectsSphere(ia)===!1)return;na.copy(r).invert(),ra.copy(e.ray).applyMatrix4(na);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=this.isLineSegments?2:1,l=n.index,u=n.attributes.position;if(l!==null){let n=Math.max(0,a.start),r=Math.min(l.count,a.start+a.count);for(let i=n,a=r-1;i<a;i+=c){let n=l.getX(i),r=l.getX(i+1),a=ca(this,e,ra,s,n,r,i);a&&t.push(a)}if(this.isLineLoop){let i=l.getX(r-1),a=l.getX(n),o=ca(this,e,ra,s,i,a,r-1);o&&t.push(o)}}else{let n=Math.max(0,a.start),r=Math.min(u.count,a.start+a.count);for(let i=n,a=r-1;i<a;i+=c){let n=ca(this,e,ra,s,i,i+1,i);n&&t.push(n)}if(this.isLineLoop){let i=ca(this,e,ra,s,r-1,n,r-1);i&&t.push(i)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}};function ca(e,t,n,r,i,a,o){let s=e.geometry.attributes.position;if(ea.fromBufferAttribute(s,i),ta.fromBufferAttribute(s,a),n.distanceSqToSegment(ea,ta,aa,oa)>r)return;aa.applyMatrix4(e.matrixWorld);let c=t.ray.origin.distanceTo(aa);if(!(c<t.near||c>t.far))return{distance:c,point:oa.clone().applyMatrix4(e.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:e}}var la=new z,ua=new z,da=class extends sa{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type=`LineSegments`}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let e=0,r=t.count;e<r;e+=2)la.fromBufferAttribute(t,e),ua.fromBufferAttribute(t,e+1),n[e]=e===0?0:n[e-1],n[e+1]=n[e]+la.distanceTo(ua);e.setAttribute(`lineDistance`,new Sr(n,1))}else I(`LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.`);return this}},fa=class extends sa{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type=`LineLoop`}},pa=class extends Ur{constructor(e){super(),this.isPointsMaterial=!0,this.type=`PointsMaterial`,this.color=new V(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},ma=new B,ha=new ui,ga=new Er,_a=new z,va=class extends An{constructor(e=new Pr,t=new pa){super(),this.isPoints=!0,this.type=`Points`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ga.copy(n.boundingSphere),ga.applyMatrix4(r),ga.radius+=i,e.ray.intersectsSphere(ga)===!1)return;ma.copy(r).invert(),ha.copy(e.ray).applyMatrix4(ma);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=n.index,l=n.attributes.position;if(c!==null){let n=Math.max(0,a.start),i=Math.min(c.count,a.start+a.count);for(let a=n,o=i;a<o;a++){let n=c.getX(a);_a.fromBufferAttribute(l,n),ya(_a,n,s,r,e,t,this)}}else{let n=Math.max(0,a.start),i=Math.min(l.count,a.start+a.count);for(let a=n,o=i;a<o;a++)_a.fromBufferAttribute(l,a),ya(_a,a,s,r,e,t,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}};function ya(e,t,n,r,i,a,o){let s=ha.distanceSqToPoint(e);if(s<n){let n=new z;ha.closestPointToPoint(e,n),n.applyMatrix4(r);let c=i.ray.origin.distanceTo(n);if(c<i.near||c>i.far)return;a.push({distance:c,distanceToRay:Math.sqrt(s),point:n,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var ba=class extends Zt{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},xa=class extends Zt{constructor(e,t,n,r,i,a,o,s,c){super(e,t,n,r,i,a,o,s,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},Sa=class extends Zt{constructor(e,t,n=h,r,a,o,s=i,c=i,l,u=E,d=1){if(u!==1026&&u!==1027)throw Error(`THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:d},r,a,o,s,c,u,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new qt(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},Ca=class extends Sa{constructor(e,t=h,n=301,r,a,o=i,s=i,c,l=E){let u={width:e,height:e,depth:1},d=[u,u,u,u,u,u];super(e,e,t,n,r,a,o,s,c,l),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},wa=class extends Zt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Ta=class e extends Pr{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new Sr(c,3)),this.setAttribute(`normal`,new Sr(l,3)),this.setAttribute(`uv`,new Sr(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new z;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},Ea=class e extends Pr{constructor(e=1,t=1,n=1,r=32,i=1,a=!1,o=0,s=Math.PI*2){super(),this.type=`CylinderGeometry`,this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:i,openEnded:a,thetaStart:o,thetaLength:s};let c=this;r=Math.floor(r),i=Math.floor(i);let l=[],u=[],d=[],f=[],p=0,m=[],h=n/2,g=0;_(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute(`position`,new Sr(u,3)),this.setAttribute(`normal`,new Sr(d,3)),this.setAttribute(`uv`,new Sr(f,2));function _(){let a=new z,_=new z,v=0,y=(t-e)/n;for(let c=0;c<=i;c++){let l=[],g=c/i,v=g*(t-e)+e;for(let e=0;e<=r;e++){let t=e/r,i=t*s+o,c=Math.sin(i),m=Math.cos(i);_.x=v*c,_.y=-g*n+h,_.z=v*m,u.push(_.x,_.y,_.z),a.set(c,y,m).normalize(),d.push(a.x,a.y,a.z),f.push(t,1-g),l.push(p++)}m.push(l)}for(let n=0;n<r;n++)for(let r=0;r<i;r++){let a=m[r][n],o=m[r+1][n],s=m[r+1][n+1],c=m[r][n+1];(e>0||r!==0)&&(l.push(a,o,c),v+=3),(t>0||r!==i-1)&&(l.push(o,s,c),v+=3)}c.addGroup(g,v,0),g+=v}function v(n){let i=p,a=new R,m=new z,_=0,v=n===!0?e:t,y=n===!0?1:-1;for(let e=1;e<=r;e++)u.push(0,h*y,0),d.push(0,y,0),f.push(.5,.5),p++;let b=p;for(let e=0;e<=r;e++){let t=e/r*s+o,n=Math.cos(t),i=Math.sin(t);m.x=v*i,m.y=h*y,m.z=v*n,u.push(m.x,m.y,m.z),d.push(0,y,0),a.x=n*.5+.5,a.y=i*.5*y+.5,f.push(a.x,a.y),p++}for(let e=0;e<r;e++){let t=i+e,r=b+e;n===!0?l.push(r,r+1,t):l.push(r+1,r,t),_+=3}c.addGroup(g,_,n===!0?1:2),g+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Da=class e extends Ea{constructor(e=1,t=1,n=32,r=1,i=!1,a=0,o=Math.PI*2){super(0,e,t,n,r,i,a,o),this.type=`ConeGeometry`,this.parameters={radius:e,height:t,radialSegments:n,heightSegments:r,openEnded:i,thetaStart:a,thetaLength:o}}static fromJSON(t){return new e(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Oa=class e extends Pr{constructor(e=[],t=[],n=1,r=0){super(),this.type=`PolyhedronGeometry`,this.parameters={vertices:e,indices:t,radius:n,detail:r};let i=[],a=[];o(r),c(n),l(),this.setAttribute(`position`,new Sr(i,3)),this.setAttribute(`normal`,new Sr(i.slice(),3)),this.setAttribute(`uv`,new Sr(a,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function o(e){let n=new z,r=new z,i=new z;for(let a=0;a<t.length;a+=3)f(t[a+0],n),f(t[a+1],r),f(t[a+2],i),s(n,r,i,e)}function s(e,t,n,r){let i=r+1,a=[];for(let r=0;r<=i;r++){a[r]=[];let o=e.clone().lerp(n,r/i),s=t.clone().lerp(n,r/i),c=i-r;for(let e=0;e<=c;e++)e===0&&r===i?a[r][e]=o:a[r][e]=o.clone().lerp(s,e/c)}for(let e=0;e<i;e++)for(let t=0;t<2*(i-e)-1;t++){let n=Math.floor(t/2);t%2==0?(d(a[e][n+1]),d(a[e+1][n]),d(a[e][n])):(d(a[e][n+1]),d(a[e+1][n+1]),d(a[e+1][n]))}}function c(e){let t=new z;for(let n=0;n<i.length;n+=3)t.x=i[n+0],t.y=i[n+1],t.z=i[n+2],t.normalize().multiplyScalar(e),i[n+0]=t.x,i[n+1]=t.y,i[n+2]=t.z}function l(){let e=new z;for(let t=0;t<i.length;t+=3){e.x=i[t+0],e.y=i[t+1],e.z=i[t+2];let n=h(e)/2/Math.PI+.5,r=g(e)/Math.PI+.5;a.push(n,1-r)}p(),u()}function u(){for(let e=0;e<a.length;e+=6){let t=a[e+0],n=a[e+2],r=a[e+4];Math.max(t,n,r)>.9&&Math.min(t,n,r)<.1&&(t<.2&&(a[e+0]+=1),n<.2&&(a[e+2]+=1),r<.2&&(a[e+4]+=1))}}function d(e){i.push(e.x,e.y,e.z)}function f(t,n){let r=t*3;n.x=e[r+0],n.y=e[r+1],n.z=e[r+2]}function p(){let e=new z,t=new z,n=new z,r=new z,o=new R,s=new R,c=new R;for(let l=0,u=0;l<i.length;l+=9,u+=6){e.set(i[l+0],i[l+1],i[l+2]),t.set(i[l+3],i[l+4],i[l+5]),n.set(i[l+6],i[l+7],i[l+8]),o.set(a[u+0],a[u+1]),s.set(a[u+2],a[u+3]),c.set(a[u+4],a[u+5]),r.copy(e).add(t).add(n).divideScalar(3);let d=h(r);m(o,u+0,e,d),m(s,u+2,t,d),m(c,u+4,n,d)}}function m(e,t,n,r){r<0&&e.x===1&&(a[t]=e.x-1),n.x===0&&n.z===0&&(a[t]=r/2/Math.PI+.5)}function h(e){return Math.atan2(e.z,-e.x)}function g(e){return Math.atan2(-e.y,Math.sqrt(e.x*e.x+e.z*e.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.vertices,t.indices,t.radius,t.detail)}},ka=class{constructor(){this.type=`Curve`,this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){I(`Curve: .getPoint() not implemented.`)}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,r=this.getPoint(0),i=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),i+=n.distanceTo(r),t.push(i),r=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),r=0,i=n.length,a;a=t||e*n[i-1];let o=0,s=i-1,c;for(;o<=s;)if(r=Math.floor(o+(s-o)/2),c=n[r]-a,c<0)o=r+1;else if(c>0)s=r-1;else{s=r;break}if(r=s,n[r]===a)return r/(i-1);let l=n[r],u=n[r+1]-l,d=(a-l)/u;return(r+d)/(i-1)}getTangent(e,t){let n=1e-4,r=e-n,i=e+n;r<0&&(r=0),i>1&&(i=1);let a=this.getPoint(r),o=this.getPoint(i),s=t||(a.isVector2?new R:new z);return s.copy(o).sub(a).normalize(),s}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new z,r=[],i=[],a=[],o=new z,s=new B;for(let t=0;t<=e;t++){let n=t/e;r[t]=this.getTangentAt(n,new z)}i[0]=new z,a[0]=new z;let c=Number.MAX_VALUE,l=Math.abs(r[0].x),u=Math.abs(r[0].y),d=Math.abs(r[0].z);l<=c&&(c=l,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(r[0],n).normalize(),i[0].crossVectors(r[0],o),a[0].crossVectors(r[0],i[0]);for(let t=1;t<=e;t++){if(i[t]=i[t-1].clone(),a[t]=a[t-1].clone(),o.crossVectors(r[t-1],r[t]),o.length()>2**-52){o.normalize();let e=Math.acos(dt(r[t-1].dot(r[t]),-1,1));i[t].applyMatrix4(s.makeRotationAxis(o,e))}a[t].crossVectors(r[t],i[t])}if(t===!0){let t=Math.acos(dt(i[0].dot(i[e]),-1,1));t/=e,r[0].dot(o.crossVectors(i[0],i[e]))>0&&(t=-t);for(let n=1;n<=e;n++)i[n].applyMatrix4(s.makeRotationAxis(r[n],t*n)),a[n].crossVectors(r[n],i[n])}return{tangents:r,normals:i,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:`Curve`,generator:`Curve.toJSON`}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Aa=class extends ka{constructor(e=0,t=0,n=1,r=1,i=0,a=Math.PI*2,o=!1,s=0){super(),this.isEllipseCurve=!0,this.type=`EllipseCurve`,this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=r,this.aStartAngle=i,this.aEndAngle=a,this.aClockwise=o,this.aRotation=s}getPoint(e,t=new R){let n=t,r=Math.PI*2,i=this.aEndAngle-this.aStartAngle,a=Math.abs(i)<2**-52;for(;i<0;)i+=r;for(;i>r;)i-=r;i<2**-52&&(i=a?0:r),this.aClockwise===!0&&!a&&(i===r?i=-r:i-=r);let o=this.aStartAngle+e*i,s=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let e=Math.cos(this.aRotation),t=Math.sin(this.aRotation),n=s-this.aX,r=c-this.aY;s=n*e-r*t+this.aX,c=n*t+r*e+this.aY}return n.set(s,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},ja=class extends Aa{constructor(e,t,n,r,i,a){super(e,t,n,n,r,i,a),this.isArcCurve=!0,this.type=`ArcCurve`}};function Ma(){let e=0,t=0,n=0,r=0;function i(i,a,o,s){e=i,t=o,n=-3*i+3*a-2*o-s,r=2*i-2*a+o+s}return{initCatmullRom:function(e,t,n,r,a){i(t,n,a*(n-e),a*(r-t))},initNonuniformCatmullRom:function(e,t,n,r,a,o,s){let c=(t-e)/a-(n-e)/(a+o)+(n-t)/o,l=(n-t)/o-(r-t)/(o+s)+(r-n)/s;c*=o,l*=o,i(t,n,c,l)},calc:function(i){let a=i*i,o=a*i;return e+t*i+n*a+r*o}}}var Na=new z,Pa=new z,Fa=new Ma,Ia=new Ma,La=new Ma,Ra=class extends ka{constructor(e=[],t=!1,n=`centripetal`,r=.5){super(),this.isCatmullRomCurve3=!0,this.type=`CatmullRomCurve3`,this.points=e,this.closed=t,this.curveType=n,this.tension=r}getPoint(e,t=new z){let n=t,r=this.points,i=r.length,a=(i-+!this.closed)*e,o=Math.floor(a),s=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/i)+1)*i:s===0&&o===i-1&&(o=i-2,s=1);let c,l;this.closed||o>0?c=r[(o-1)%i]:(Pa.subVectors(r[0],r[1]).add(r[0]),c=Pa);let u=r[o%i],d=r[(o+1)%i];if(this.closed||o+2<i?l=r[(o+2)%i]:(Na.subVectors(r[i-1],r[i-2]).add(r[i-1]),l=Na),this.curveType===`centripetal`||this.curveType===`chordal`){let e=this.curveType===`chordal`?.5:.25,t=c.distanceToSquared(u)**+e,n=u.distanceToSquared(d)**+e,r=d.distanceToSquared(l)**+e;n<1e-4&&(n=1),t<1e-4&&(t=n),r<1e-4&&(r=n),Fa.initNonuniformCatmullRom(c.x,u.x,d.x,l.x,t,n,r),Ia.initNonuniformCatmullRom(c.y,u.y,d.y,l.y,t,n,r),La.initNonuniformCatmullRom(c.z,u.z,d.z,l.z,t,n,r)}else this.curveType===`catmullrom`&&(Fa.initCatmullRom(c.x,u.x,d.x,l.x,this.tension),Ia.initCatmullRom(c.y,u.y,d.y,l.y,this.tension),La.initCatmullRom(c.z,u.z,d.z,l.z,this.tension));return n.set(Fa.calc(s),Ia.calc(s),La.calc(s)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new z().fromArray(n))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function za(e,t,n,r,i){let a=(r-t)*.5,o=(i-n)*.5,s=e*e,c=e*s;return(2*n-2*r+a+o)*c+(-3*n+3*r-2*a-o)*s+a*e+n}function Ba(e,t){let n=1-e;return n*n*t}function Va(e,t){return 2*(1-e)*e*t}function Ha(e,t){return e*e*t}function Ua(e,t,n,r){return Ba(e,t)+Va(e,n)+Ha(e,r)}function Wa(e,t){let n=1-e;return n*n*n*t}function Ga(e,t){let n=1-e;return 3*n*n*e*t}function Ka(e,t){return 3*(1-e)*e*e*t}function qa(e,t){return e*e*e*t}function Ja(e,t,n,r,i){return Wa(e,t)+Ga(e,n)+Ka(e,r)+qa(e,i)}var Ya=class extends ka{constructor(e=new R,t=new R,n=new R,r=new R){super(),this.isCubicBezierCurve=!0,this.type=`CubicBezierCurve`,this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new R){let n=t,r=this.v0,i=this.v1,a=this.v2,o=this.v3;return n.set(Ja(e,r.x,i.x,a.x,o.x),Ja(e,r.y,i.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Xa=class extends ka{constructor(e=new z,t=new z,n=new z,r=new z){super(),this.isCubicBezierCurve3=!0,this.type=`CubicBezierCurve3`,this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new z){let n=t,r=this.v0,i=this.v1,a=this.v2,o=this.v3;return n.set(Ja(e,r.x,i.x,a.x,o.x),Ja(e,r.y,i.y,a.y,o.y),Ja(e,r.z,i.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Za=class extends ka{constructor(e=new R,t=new R){super(),this.isLineCurve=!0,this.type=`LineCurve`,this.v1=e,this.v2=t}getPoint(e,t=new R){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new R){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Qa=class extends ka{constructor(e=new z,t=new z){super(),this.isLineCurve3=!0,this.type=`LineCurve3`,this.v1=e,this.v2=t}getPoint(e,t=new z){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new z){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},$a=class extends ka{constructor(e=new R,t=new R,n=new R){super(),this.isQuadraticBezierCurve=!0,this.type=`QuadraticBezierCurve`,this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new R){let n=t,r=this.v0,i=this.v1,a=this.v2;return n.set(Ua(e,r.x,i.x,a.x),Ua(e,r.y,i.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},eo=class extends ka{constructor(e=new z,t=new z,n=new z){super(),this.isQuadraticBezierCurve3=!0,this.type=`QuadraticBezierCurve3`,this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new z){let n=t,r=this.v0,i=this.v1,a=this.v2;return n.set(Ua(e,r.x,i.x,a.x),Ua(e,r.y,i.y,a.y),Ua(e,r.z,i.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},to=class extends ka{constructor(e=[]){super(),this.isSplineCurve=!0,this.type=`SplineCurve`,this.points=e}getPoint(e,t=new R){let n=t,r=this.points,i=(r.length-1)*e,a=Math.floor(i),o=i-a,s=r[a===0?a:a-1],c=r[a],l=r[a>r.length-2?r.length-1:a+1],u=r[a>r.length-3?r.length-1:a+2];return n.set(za(o,s.x,c.x,l.x,u.x),za(o,s.y,c.y,l.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new R().fromArray(n))}return this}},no=Object.freeze({__proto__:null,ArcCurve:ja,CatmullRomCurve3:Ra,CubicBezierCurve:Ya,CubicBezierCurve3:Xa,EllipseCurve:Aa,LineCurve:Za,LineCurve3:Qa,QuadraticBezierCurve:$a,QuadraticBezierCurve3:eo,SplineCurve:to}),ro=class extends ka{constructor(){super(),this.type=`CurvePath`,this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?`LineCurve`:`LineCurve3`;this.curves.push(new no[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),r=this.getCurveLengths(),i=0;for(;i<r.length;){if(r[i]>=n){let e=r[i]-n,a=this.curves[i],o=a.getLength(),s=o===0?0:1-e/o;return a.getPointAt(s,t)}i++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,r=this.curves.length;n<r;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let r=0,i=this.curves;r<i.length;r++){let a=i[r],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,s=a.getPoints(o);for(let e=0;e<s.length;e++){let r=s[e];n&&n.equals(r)||(t.push(r),n=r)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let n=e.curves[t];this.curves.push(n.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let n=this.curves[t];e.curves.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let n=e.curves[t];this.curves.push(new no[n.type]().fromJSON(n))}return this}},io=class extends ro{constructor(e){super(),this.type=`Path`,this.currentPoint=new R,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new Za(this.currentPoint.clone(),new R(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,r){let i=new $a(this.currentPoint.clone(),new R(e,t),new R(n,r));return this.curves.push(i),this.currentPoint.set(n,r),this}bezierCurveTo(e,t,n,r,i,a){let o=new Ya(this.currentPoint.clone(),new R(e,t),new R(n,r),new R(i,a));return this.curves.push(o),this.currentPoint.set(i,a),this}splineThru(e){let t=new to([this.currentPoint.clone()].concat(e));return this.curves.push(t),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,r,i,a){let o=this.currentPoint.x,s=this.currentPoint.y;return this.absarc(e+o,t+s,n,r,i,a),this}absarc(e,t,n,r,i,a){return this.absellipse(e,t,n,n,r,i,a),this}ellipse(e,t,n,r,i,a,o,s){let c=this.currentPoint.x,l=this.currentPoint.y;return this.absellipse(e+c,t+l,n,r,i,a,o,s),this}absellipse(e,t,n,r,i,a,o,s){let c=new Aa(e,t,n,r,i,a,o,s);if(this.curves.length>0){let e=c.getPoint(0);e.equals(this.currentPoint)||this.lineTo(e.x,e.y)}this.curves.push(c);let l=c.getPoint(1);return this.currentPoint.copy(l),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},ao=class extends io{constructor(e){super(e),this.uuid=ut(),this.type=`Shape`,this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,r=this.holes.length;n<r;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let n=e.holes[t];this.holes.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let n=this.holes[t];e.holes.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let n=e.holes[t];this.holes.push(new io().fromJSON(n))}return this}};function oo(e,t,n=2){let r=t&&t.length,i=r?t[0]*n:e.length,a=so(e,0,i,n,!0),o=[];if(!a||a.next===a.prev)return o;let s,c,l;if(r&&(a=ho(e,t,a,n)),e.length>80*n){s=e[0],c=e[1];let t=s,r=c;for(let a=n;a<i;a+=n){let n=e[a],i=e[a+1];n<s&&(s=n),i<c&&(c=i),n>t&&(t=n),i>r&&(r=i)}l=Math.max(t-s,r-c),l=l===0?0:32767/l}return lo(a,o,n,s,c,l,0),o}function so(e,t,n,r,i){let a;if(i===zo(e,t,n,r)>0)for(let i=t;i<n;i+=r)a=Io(i/r|0,e[i],e[i+1],a);else for(let i=n-r;i>=t;i-=r)a=Io(i/r|0,e[i],e[i+1],a);return a&&Oo(a,a.next)&&(Lo(a),a=a.next),a}function co(e,t){if(!e)return e;t||=e;let n=e,r;do if(r=!1,!n.steiner&&(Oo(n,n.next)||Do(n.prev,n,n.next)===0)){if(Lo(n),n=t=n.prev,n===n.next)break;r=!0}else n=n.next;while(r||n!==t);return t}function lo(e,t,n,r,i,a,o){if(!e)return;!o&&a&&bo(e,r,i,a);let s=e;for(;e.prev!==e.next;){let c=e.prev,l=e.next;if(a?fo(e,r,i,a):uo(e))t.push(c.i,e.i,l.i),Lo(e),e=l.next,s=l.next;else if(e=l,e===s){o?o===1?(e=po(co(e),t),lo(e,t,n,r,i,a,2)):o===2&&mo(e,t,n,r,i,a):lo(co(e),t,n,r,i,a,1);break}}}function uo(e){let t=e.prev,n=e,r=e.next;if(Do(t,n,r)>=0)return!1;let i=t.x,a=n.x,o=r.x,s=t.y,c=n.y,l=r.y,u=Math.min(i,a,o),d=Math.min(s,c,l),f=Math.max(i,a,o),p=Math.max(s,c,l),m=r.next;for(;m!==t;){if(m.x>=u&&m.x<=f&&m.y>=d&&m.y<=p&&To(i,s,a,c,o,l,m.x,m.y)&&Do(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function fo(e,t,n,r){let i=e.prev,a=e,o=e.next;if(Do(i,a,o)>=0)return!1;let s=i.x,c=a.x,l=o.x,u=i.y,d=a.y,f=o.y,p=Math.min(s,c,l),m=Math.min(u,d,f),h=Math.max(s,c,l),g=Math.max(u,d,f),_=So(p,m,t,n,r),v=So(h,g,t,n,r),y=e.prevZ,b=e.nextZ;for(;y&&y.z>=_&&b&&b.z<=v;){if(y.x>=p&&y.x<=h&&y.y>=m&&y.y<=g&&y!==i&&y!==o&&To(s,u,c,d,l,f,y.x,y.y)&&Do(y.prev,y,y.next)>=0||(y=y.prevZ,b.x>=p&&b.x<=h&&b.y>=m&&b.y<=g&&b!==i&&b!==o&&To(s,u,c,d,l,f,b.x,b.y)&&Do(b.prev,b,b.next)>=0))return!1;b=b.nextZ}for(;y&&y.z>=_;){if(y.x>=p&&y.x<=h&&y.y>=m&&y.y<=g&&y!==i&&y!==o&&To(s,u,c,d,l,f,y.x,y.y)&&Do(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;b&&b.z<=v;){if(b.x>=p&&b.x<=h&&b.y>=m&&b.y<=g&&b!==i&&b!==o&&To(s,u,c,d,l,f,b.x,b.y)&&Do(b.prev,b,b.next)>=0)return!1;b=b.nextZ}return!0}function po(e,t){let n=e;do{let r=n.prev,i=n.next.next;!Oo(r,i)&&ko(r,n,n.next,i)&&No(r,i)&&No(i,r)&&(t.push(r.i,n.i,i.i),Lo(n),Lo(n.next),n=e=i),n=n.next}while(n!==e);return co(n)}function mo(e,t,n,r,i,a){let o=e;do{let e=o.next.next;for(;e!==o.prev;){if(o.i!==e.i&&Eo(o,e)){let s=Fo(o,e);o=co(o,o.next),s=co(s,s.next),lo(o,t,n,r,i,a,0),lo(s,t,n,r,i,a,0);return}e=e.next}o=o.next}while(o!==e)}function ho(e,t,n,r){let i=[];for(let n=0,a=t.length;n<a;n++){let o=so(e,t[n]*r,n<a-1?t[n+1]*r:e.length,r,!1);o===o.next&&(o.steiner=!0),i.push(Co(o))}i.sort(go);for(let e=0;e<i.length;e++)n=_o(i[e],n);return n}function go(e,t){let n=e.x-t.x;return n===0&&(n=e.y-t.y,n===0&&(n=(e.next.y-e.y)/(e.next.x-e.x)-(t.next.y-t.y)/(t.next.x-t.x))),n}function _o(e,t){let n=vo(e,t);if(!n)return t;let r=Fo(n,e);return co(r,r.next),co(n,n.next)}function vo(e,t){let n=t,r=e.x,i=e.y,a=-1/0,o;if(Oo(e,n))return n;do{if(Oo(e,n.next))return n.next;if(i<=n.y&&i>=n.next.y&&n.next.y!==n.y){let e=n.x+(i-n.y)*(n.next.x-n.x)/(n.next.y-n.y);if(e<=r&&e>a&&(a=e,o=n.x<n.next.x?n:n.next,e===r))return o}n=n.next}while(n!==t);if(!o)return null;let s=o,c=o.x,l=o.y,u=1/0;n=o;do{if(r>=n.x&&n.x>=c&&r!==n.x&&wo(i<l?r:a,i,c,l,i<l?a:r,i,n.x,n.y)){let t=Math.abs(i-n.y)/(r-n.x);No(n,e)&&(t<u||t===u&&(n.x>o.x||n.x===o.x&&yo(o,n)))&&(o=n,u=t)}n=n.next}while(n!==s);return o}function yo(e,t){return Do(e.prev,e,t.prev)<0&&Do(t.next,e,e.next)<0}function bo(e,t,n,r){let i=e;do i.z===0&&(i.z=So(i.x,i.y,t,n,r)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==e);i.prevZ.nextZ=null,i.prevZ=null,xo(i)}function xo(e){let t,n=1;do{let r=e,i;e=null;let a=null;for(t=0;r;){t++;let o=r,s=0;for(let e=0;e<n&&(s++,o=o.nextZ,o);e++);let c=n;for(;s>0||c>0&&o;)s!==0&&(c===0||!o||r.z<=o.z)?(i=r,r=r.nextZ,s--):(i=o,o=o.nextZ,c--),a?a.nextZ=i:e=i,i.prevZ=a,a=i;r=o}a.nextZ=null,n*=2}while(t>1);return e}function So(e,t,n,r,i){return e=(e-n)*i|0,t=(t-r)*i|0,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,e|t<<1}function Co(e){let t=e,n=e;do(t.x<n.x||t.x===n.x&&t.y<n.y)&&(n=t),t=t.next;while(t!==e);return n}function wo(e,t,n,r,i,a,o,s){return(i-o)*(t-s)>=(e-o)*(a-s)&&(e-o)*(r-s)>=(n-o)*(t-s)&&(n-o)*(a-s)>=(i-o)*(r-s)}function To(e,t,n,r,i,a,o,s){return(e!==o||t!==s)&&wo(e,t,n,r,i,a,o,s)}function Eo(e,t){return e.next.i!==t.i&&e.prev.i!==t.i&&!Mo(e,t)&&(No(e,t)&&No(t,e)&&Po(e,t)&&(Do(e.prev,e,t.prev)||Do(e,t.prev,t))||Oo(e,t)&&Do(e.prev,e,e.next)>0&&Do(t.prev,t,t.next)>0)}function Do(e,t,n){return(t.y-e.y)*(n.x-t.x)-(t.x-e.x)*(n.y-t.y)}function Oo(e,t){return e.x===t.x&&e.y===t.y}function ko(e,t,n,r){let i=jo(Do(e,t,n)),a=jo(Do(e,t,r)),o=jo(Do(n,r,e)),s=jo(Do(n,r,t));return!!(i!==a&&o!==s||i===0&&Ao(e,n,t)||a===0&&Ao(e,r,t)||o===0&&Ao(n,e,r)||s===0&&Ao(n,t,r))}function Ao(e,t,n){return t.x<=Math.max(e.x,n.x)&&t.x>=Math.min(e.x,n.x)&&t.y<=Math.max(e.y,n.y)&&t.y>=Math.min(e.y,n.y)}function jo(e){return e>0?1:e<0?-1:0}function Mo(e,t){let n=e;do{if(n.i!==e.i&&n.next.i!==e.i&&n.i!==t.i&&n.next.i!==t.i&&ko(n,n.next,e,t))return!0;n=n.next}while(n!==e);return!1}function No(e,t){return Do(e.prev,e,e.next)<0?Do(e,t,e.next)>=0&&Do(e,e.prev,t)>=0:Do(e,t,e.prev)<0||Do(e,e.next,t)<0}function Po(e,t){let n=e,r=!1,i=(e.x+t.x)/2,a=(e.y+t.y)/2;do n.y>a!=n.next.y>a&&n.next.y!==n.y&&i<(n.next.x-n.x)*(a-n.y)/(n.next.y-n.y)+n.x&&(r=!r),n=n.next;while(n!==e);return r}function Fo(e,t){let n=Ro(e.i,e.x,e.y),r=Ro(t.i,t.x,t.y),i=e.next,a=t.prev;return e.next=t,t.prev=e,n.next=i,i.prev=n,r.next=n,n.prev=r,a.next=r,r.prev=a,r}function Io(e,t,n,r){let i=Ro(e,t,n);return r?(i.next=r.next,i.prev=r,r.next.prev=i,r.next=i):(i.prev=i,i.next=i),i}function Lo(e){e.next.prev=e.prev,e.prev.next=e.next,e.prevZ&&(e.prevZ.nextZ=e.nextZ),e.nextZ&&(e.nextZ.prevZ=e.prevZ)}function Ro(e,t,n){return{i:e,x:t,y:n,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function zo(e,t,n,r){let i=0;for(let a=t,o=n-r;a<n;a+=r)i+=(e[o]-e[a])*(e[a+1]+e[o+1]),o=a;return i}var Bo=class{static triangulate(e,t,n=2){return oo(e,t,n)}},Vo=class e{static area(e){let t=e.length,n=0;for(let r=t-1,i=0;i<t;r=i++)n+=e[r].x*e[i].y-e[i].x*e[r].y;return n*.5}static isClockWise(t){return e.area(t)<0}static triangulateShape(e,t){let n=[],r=[],i=[];Ho(e),Uo(n,e);let a=e.length;t.forEach(Ho);for(let e=0;e<t.length;e++)r.push(a),a+=t[e].length,Uo(n,t[e]);let o=Bo.triangulate(n,r);for(let e=0;e<o.length;e+=3)i.push(o.slice(e,e+3));return i}};function Ho(e){let t=e.length;t>2&&e[t-1].equals(e[0])&&e.pop()}function Uo(e,t){for(let n=0;n<t.length;n++)e.push(t[n].x),e.push(t[n].y)}var Wo=class e extends Pr{constructor(e=new ao([new R(.5,.5),new R(-.5,.5),new R(-.5,-.5),new R(.5,-.5)]),t={}){super(),this.type=`ExtrudeGeometry`,this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,r=[],i=[];for(let t=0,n=e.length;t<n;t++){let n=e[t];a(n)}this.setAttribute(`position`,new Sr(r,3)),this.setAttribute(`uv`,new Sr(i,2)),this.computeVertexNormals();function a(e){let a=[],o=t.curveSegments===void 0?12:t.curveSegments,s=t.steps===void 0?1:t.steps,c=t.depth===void 0?1:t.depth,l=t.bevelEnabled===void 0||t.bevelEnabled,u=t.bevelThickness===void 0?.2:t.bevelThickness,d=t.bevelSize===void 0?u-.1:t.bevelSize,f=t.bevelOffset===void 0?0:t.bevelOffset,p=t.bevelSegments===void 0?3:t.bevelSegments,m=t.extrudePath,h=t.UVGenerator===void 0?Go:t.UVGenerator,g,_=!1,v,y,b,x;if(m){g=m.getSpacedPoints(s),_=!0,l=!1;let e=m.isCatmullRomCurve3?m.closed:!1;v=m.computeFrenetFrames(s,e),y=new z,b=new z,x=new z}l||(p=0,u=0,d=0,f=0);let S=e.extractPoints(o),C=S.shape,w=S.holes;if(!Vo.isClockWise(C)){C=C.reverse();for(let e=0,t=w.length;e<t;e++){let t=w[e];Vo.isClockWise(t)&&(w[e]=t.reverse())}}function T(e){let t=e[0];for(let n=1;n<=e.length;n++){let r=n%e.length,i=e[r],a=i.x-t.x,o=i.y-t.y,s=a*a+o*o,c=Math.max(Math.abs(i.x),Math.abs(i.y),Math.abs(t.x),Math.abs(t.y));s<=10000000000000001e-36*c*c?(e.splice(r,1),n--):t=i}}T(C),w.forEach(T);let E=w.length,D=C;for(let e=0;e<E;e++){let t=w[e];C=C.concat(t)}function O(e,t,n){return t||L(`ExtrudeGeometry: vec does not exist`),e.clone().addScaledVector(t,n)}let ee=C.length;function k(e,t,n){let r,i,a,o=e.x-t.x,s=e.y-t.y,c=n.x-e.x,l=n.y-e.y,u=o*o+s*s,d=o*l-s*c;if(Math.abs(d)>2**-52){let d=Math.sqrt(u),f=Math.sqrt(c*c+l*l),p=t.x-s/d,m=t.y+o/d,h=n.x-l/f,g=n.y+c/f,_=((h-p)*l-(g-m)*c)/(o*l-s*c);r=p+o*_-e.x,i=m+s*_-e.y;let v=r*r+i*i;if(v<=2)return new R(r,i);a=Math.sqrt(v/2)}else{let e=!1;o>2**-52?c>2**-52&&(e=!0):o<-(2**-52)?c<-(2**-52)&&(e=!0):Math.sign(s)===Math.sign(l)&&(e=!0),e?(r=-s,i=o,a=Math.sqrt(u)):(r=o,i=s,a=Math.sqrt(u/2))}return new R(r/a,i/a)}let te=[];for(let e=0,t=D.length,n=t-1,r=e+1;e<t;e++,n++,r++)n===t&&(n=0),r===t&&(r=0),te[e]=k(D[e],D[n],D[r]);let ne=[],A,j=te.concat();for(let e=0,t=E;e<t;e++){let t=w[e];A=[];for(let e=0,n=t.length,r=n-1,i=e+1;e<n;e++,r++,i++)r===n&&(r=0),i===n&&(i=0),A[e]=k(t[e],t[r],t[i]);ne.push(A),j=j.concat(A)}let re;if(p===0)re=Vo.triangulateShape(D,w);else{let e=[],t=[];for(let n=0;n<p;n++){let r=n/p,i=u*Math.cos(r*Math.PI/2),a=d*Math.sin(r*Math.PI/2)+f;for(let t=0,n=D.length;t<n;t++){let n=O(D[t],te[t],a);ce(n.x,n.y,-i),r===0&&e.push(n)}for(let e=0,n=E;e<n;e++){let n=w[e];A=ne[e];let o=[];for(let e=0,t=n.length;e<t;e++){let t=O(n[e],A[e],a);ce(t.x,t.y,-i),r===0&&o.push(t)}r===0&&t.push(o)}}re=Vo.triangulateShape(e,t)}let M=re.length,ie=d+f;for(let e=0;e<ee;e++){let t=l?O(C[e],j[e],ie):C[e];_?(b.copy(v.normals[0]).multiplyScalar(t.x),y.copy(v.binormals[0]).multiplyScalar(t.y),x.copy(g[0]).add(b).add(y),ce(x.x,x.y,x.z)):ce(t.x,t.y,0)}for(let e=1;e<=s;e++)for(let t=0;t<ee;t++){let n=l?O(C[t],j[t],ie):C[t];_?(b.copy(v.normals[e]).multiplyScalar(n.x),y.copy(v.binormals[e]).multiplyScalar(n.y),x.copy(g[e]).add(b).add(y),ce(x.x,x.y,x.z)):ce(n.x,n.y,c/s*e)}for(let e=p-1;e>=0;e--){let t=e/p,n=u*Math.cos(t*Math.PI/2),r=d*Math.sin(t*Math.PI/2)+f;for(let e=0,t=D.length;e<t;e++){let t=O(D[e],te[e],r);ce(t.x,t.y,c+n)}for(let e=0,t=w.length;e<t;e++){let t=w[e];A=ne[e];for(let e=0,i=t.length;e<i;e++){let i=O(t[e],A[e],r);_?ce(i.x,i.y+g[s-1].y,g[s-1].x+n):ce(i.x,i.y,c+n)}}}ae(),oe();function ae(){let e=r.length/3;if(l){let e=0,t=ee*e;for(let e=0;e<M;e++){let n=re[e];le(n[2]+t,n[1]+t,n[0]+t)}e=s+p*2,t=ee*e;for(let e=0;e<M;e++){let n=re[e];le(n[0]+t,n[1]+t,n[2]+t)}}else{for(let e=0;e<M;e++){let t=re[e];le(t[2],t[1],t[0])}for(let e=0;e<M;e++){let t=re[e];le(t[0]+ee*s,t[1]+ee*s,t[2]+ee*s)}}n.addGroup(e,r.length/3-e,0)}function oe(){let e=r.length/3,t=0;se(D,t),t+=D.length;for(let e=0,n=w.length;e<n;e++){let n=w[e];se(n,t),t+=n.length}n.addGroup(e,r.length/3-e,1)}function se(e,t){let n=e.length;for(;--n>=0;){let r=n,i=n-1;i<0&&(i=e.length-1);for(let e=0,n=s+p*2;e<n;e++){let n=ee*e,a=ee*(e+1);ue(t+r+n,t+i+n,t+i+a,t+r+a)}}}function ce(e,t,n){a.push(e),a.push(t),a.push(n)}function le(e,t,i){N(e),N(t),N(i);let a=r.length/3,o=h.generateTopUV(n,r,a-3,a-2,a-1);de(o[0]),de(o[1]),de(o[2])}function ue(e,t,i,a){N(e),N(t),N(a),N(t),N(i),N(a);let o=r.length/3,s=h.generateSideWallUV(n,r,o-6,o-3,o-2,o-1);de(s[0]),de(s[1]),de(s[3]),de(s[1]),de(s[2]),de(s[3])}function N(e){r.push(a[e*3+0]),r.push(a[e*3+1]),r.push(a[e*3+2])}function de(e){i.push(e.x),i.push(e.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return Ko(t,n,e)}static fromJSON(t,n){let r=[];for(let e=0,i=t.shapes.length;e<i;e++){let i=n[t.shapes[e]];r.push(i)}let i=t.options.extrudePath;return i!==void 0&&(t.options.extrudePath=new no[i.type]().fromJSON(i)),new e(r,t.options)}},Go={generateTopUV:function(e,t,n,r,i){let a=t[n*3],o=t[n*3+1],s=t[r*3],c=t[r*3+1],l=t[i*3],u=t[i*3+1];return[new R(a,o),new R(s,c),new R(l,u)]},generateSideWallUV:function(e,t,n,r,i,a){let o=t[n*3],s=t[n*3+1],c=t[n*3+2],l=t[r*3],u=t[r*3+1],d=t[r*3+2],f=t[i*3],p=t[i*3+1],m=t[i*3+2],h=t[a*3],g=t[a*3+1],_=t[a*3+2];return Math.abs(s-u)<Math.abs(o-l)?[new R(o,1-c),new R(l,1-d),new R(f,1-m),new R(h,1-_)]:[new R(s,1-c),new R(u,1-d),new R(p,1-m),new R(g,1-_)]}};function Ko(e,t,n){if(n.shapes=[],Array.isArray(e))for(let t=0,r=e.length;t<r;t++){let r=e[t];n.shapes.push(r.uuid)}else n.shapes.push(e.uuid);return n.options=Object.assign({},t),t.extrudePath!==void 0&&(n.options.extrudePath=t.extrudePath.toJSON()),n}var qo=class e extends Oa{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,r=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1];super(r,[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],e,t),this.type=`IcosahedronGeometry`,this.parameters={radius:e,detail:t}}static fromJSON(t){return new e(t.radius,t.detail)}},Jo=class e extends Pr{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new Sr(p,3)),this.setAttribute(`normal`,new Sr(m,3)),this.setAttribute(`uv`,new Sr(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},Yo=class e extends Pr{constructor(e=1,t=32,n=16,r=0,i=Math.PI*2,a=0,o=Math.PI){super(),this.type=`SphereGeometry`,this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:i,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let s=Math.min(a+o,Math.PI),c=0,l=[],u=new z,d=new z,f=[],p=[],m=[],h=[];for(let f=0;f<=n;f++){let g=[],_=f/n,v=a+_*o,y=e*Math.cos(v),b=Math.sqrt(e*e-y*y),x=0;f===0&&a===0?x=.5/t:f===n&&s===Math.PI&&(x=-.5/t);for(let e=0;e<=t;e++){let n=e/t,a=r+n*i;u.x=-b*Math.cos(a),u.y=y,u.z=b*Math.sin(a),p.push(u.x,u.y,u.z),d.copy(u).normalize(),m.push(d.x,d.y,d.z),h.push(n+x,1-_),g.push(c++)}l.push(g)}for(let e=0;e<n;e++)for(let r=0;r<t;r++){let t=l[e][r+1],i=l[e][r],o=l[e+1][r],c=l[e+1][r+1];(e!==0||a>0)&&f.push(t,i,c),(e!==n-1||s<Math.PI)&&f.push(i,o,c)}this.setIndex(f),this.setAttribute(`position`,new Sr(p,3)),this.setAttribute(`normal`,new Sr(m,3)),this.setAttribute(`uv`,new Sr(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}},Xo=class e extends Pr{constructor(e=1,t=.4,n=12,r=48,i=Math.PI*2,a=0,o=Math.PI*2){super(),this.type=`TorusGeometry`,this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:r,arc:i,thetaStart:a,thetaLength:o},n=Math.floor(n),r=Math.floor(r);let s=[],c=[],l=[],u=[],d=new z,f=new z,p=new z;for(let s=0;s<=n;s++){let m=a+s/n*o;for(let a=0;a<=r;a++){let o=a/r*i;f.x=(e+t*Math.cos(m))*Math.cos(o),f.y=(e+t*Math.cos(m))*Math.sin(o),f.z=t*Math.sin(m),c.push(f.x,f.y,f.z),d.x=e*Math.cos(o),d.y=e*Math.sin(o),p.subVectors(f,d).normalize(),l.push(p.x,p.y,p.z),u.push(a/r),u.push(s/n)}}for(let e=1;e<=n;e++)for(let t=1;t<=r;t++){let n=(r+1)*e+t-1,i=(r+1)*(e-1)+t-1,a=(r+1)*(e-1)+t,o=(r+1)*e+t;s.push(n,i,o),s.push(i,a,o)}this.setIndex(s),this.setAttribute(`position`,new Sr(c,3)),this.setAttribute(`normal`,new Sr(l,3)),this.setAttribute(`uv`,new Sr(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}};function Zo(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];if($o(i))i.isRenderTargetTexture?(I(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone();else if(Array.isArray(i)){if($o(i[0])){let e=[];for(let t=0,n=i.length;t<n;t++)e[t]=i[t].clone();t[n][r]=e}else t[n][r]=i.slice()}else t[n][r]=i}}return t}function Qo(e){let t={};for(let n=0;n<e.length;n++){let r=Zo(e[n]);for(let e in r)t[e]=r[e]}return t}function $o(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function es(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function ts(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Vt.workingColorSpace}var ns={clone:Zo,merge:Qo},rs=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,is=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,as=class extends Ur{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=rs,this.fragmentShader=is,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Zo(e.uniforms),this.uniformsGroups=es(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case`t`:this.uniforms[n].value=t[r.value]||null;break;case`c`:this.uniforms[n].value=new V().setHex(r.value);break;case`v2`:this.uniforms[n].value=new R().fromArray(r.value);break;case`v3`:this.uniforms[n].value=new z().fromArray(r.value);break;case`v4`:this.uniforms[n].value=new Qt().fromArray(r.value);break;case`m3`:this.uniforms[n].value=new It().fromArray(r.value);break;case`m4`:this.uniforms[n].value=new B().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let t in e.extensions)this.extensions[t]=e.extensions[t];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},os=class extends as{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},ss=class extends Ur{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type=`MeshStandardMaterial`,this.defines={STANDARD:``},this.color=new V(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new V(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new R(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new pn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:``},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},cs=class extends ss{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:``,PHYSICAL:``},this.type=`MeshPhysicalMaterial`,this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new R(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return dt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new V(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new V(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new V(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:``,PHYSICAL:``},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}},ls=class extends Ur{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=Ve,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},us=class extends Ur{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function ds(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}function fs(e){return e!==void 0&&e.inTangents!==void 0&&e.outTangents!==void 0}function ps(e){function t(t,n){return e[t]-e[n]}let n=e.length,r=Array(n);for(let e=0;e!==n;++e)r[e]=e;return r.sort(t),r}function ms(e,t,n){let r=e.length,i=new e.constructor(r);for(let a=0,o=0;o!==r;++a){let r=n[a]*t;for(let n=0;n!==t;++n)i[o++]=e[r+n]}return i}function hs(e,t,n,r){let i=1,a=e[0];for(;a!==void 0&&a[r]===void 0;)a=e[i++];if(a===void 0)return;let o=a[r];if(o!==void 0){if(Array.isArray(o))do o=a[r],o!==void 0&&(t.push(a.time),n.push(...o)),a=e[i++];while(a!==void 0);else if(o.toArray!==void 0)do o=a[r],o!==void 0&&(t.push(a.time),o.toArray(n,n.length)),a=e[i++];while(a!==void 0);else do o=a[r],o!==void 0&&(t.push(a.time),n.push(o)),a=e[i++];while(a!==void 0)}}var gs=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`THREE.Interpolant: Call to abstract method.`)}intervalChanged_(){}},_s=class extends gs{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:F,endingEnd:F}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case Re:i=e,o=2*t-n;break;case ze:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case Re:a=e,s=2*n-t;break;case ze:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},vs=class extends gs{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},ys=class extends gs{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},bs=class extends gs{interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this.inTangents,u=this.outTangents;if(!l||!u){let e=(n-t)/(r-t),l=1-e;for(let t=0;t!==o;++t)i[t]=a[c+t]*l+a[s+t]*e;return i}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let o=a[c+p],m=a[s+p],h=f*d+p*2,g=u[h],_=u[h+1],v=e*d+p*2,y=l[v],b=l[v+1],x=Cs(n,t,g,y,r);i[p]=xs(x,o,_,b,m)}return i}};function xs(e,t,n,r,i){let a=1-e;return a*a*a*t+3*a*a*e*n+3*a*e*e*r+e*e*e*i}function Ss(e,t,n,r,i){let a=1-e;return 3*a*a*(n-t)+6*a*e*(r-n)+3*e*e*(i-r)}function Cs(e,t,n,r,i){let a=(e-t)/(i-t);for(let o=0;o<8;o++){let o=xs(a,t,n,r,i)-e;if(Math.abs(o)<1e-10)break;let s=Ss(a,t,n,r,i);if(Math.abs(s)<1e-10)break;a=Math.max(0,Math.min(1,a-o/s))}return a}var ws=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=ds(t,this.TimeBufferType),this.values=ds(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:ds(e.times,Array),values:ds(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t),fs(e.settings)&&(n.settings={inTangents:ds(e.settings.inTangents,Array),outTangents:ds(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new ys(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new vs(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new _s(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new bs(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case P:t=this.InterpolantFactoryMethodDiscrete;break;case Fe:t=this.InterpolantFactoryMethodLinear;break;case Ie:t=this.InterpolantFactoryMethodSmooth;break;case Le:t=this.InterpolantFactoryMethodBezier}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return I(`KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return P;case this.InterpolantFactoryMethodLinear:return Fe;case this.InterpolantFactoryMethodSmooth:return Ie;case this.InterpolantFactoryMethodBezier:return Le}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e;fs(this.settings)&&(Ts(this.settings.inTangents,e),Ts(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(L(`KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(L(`KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){L(`KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){L(`KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&Xe(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){L(`KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===Ie,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,fs(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function Ts(e,t){for(let n=0,r=e.length;n!==r;n+=2)e[n]*=t}ws.prototype.ValueTypeName=``,ws.prototype.TimeBufferType=Float32Array,ws.prototype.ValueBufferType=Float32Array,ws.prototype.DefaultInterpolation=Fe;var Es=class extends ws{constructor(e,t,n){super(e,t,n)}};Es.prototype.ValueTypeName=`bool`,Es.prototype.ValueBufferType=Array,Es.prototype.DefaultInterpolation=P,Es.prototype.InterpolantFactoryMethodLinear=void 0,Es.prototype.InterpolantFactoryMethodSmooth=void 0;var Ds=class extends ws{constructor(e,t,n,r){super(e,t,n,r)}};Ds.prototype.ValueTypeName=`color`;var Os=class extends ws{constructor(e,t,n,r){super(e,t,n,r)}};Os.prototype.ValueTypeName=`number`;var ks=class extends gs{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)Nt.slerpFlat(i,0,a,c-o,a,c,s);return i}},As=class extends ws{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new ks(this.times,this.values,this.getValueSize(),e)}};As.prototype.ValueTypeName=`quaternion`,As.prototype.InterpolantFactoryMethodSmooth=void 0;var js=class extends ws{constructor(e,t,n){super(e,t,n)}};js.prototype.ValueTypeName=`string`,js.prototype.ValueBufferType=Array,js.prototype.DefaultInterpolation=P,js.prototype.InterpolantFactoryMethodLinear=void 0,js.prototype.InterpolantFactoryMethodSmooth=void 0;var Ms=class extends ws{constructor(e,t,n,r){super(e,t,n,r)}};Ms.prototype.ValueTypeName=`vector`;var Ns=class{constructor(e=``,t=-1,n=[],r=Be){this.name=e,this.tracks=n,this.duration=t,this.blendMode=r,this.uuid=ut(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,r=1/(e.fps||1);for(let e=0,i=n.length;e!==i;++e)t.push(Fs(n[e]).scale(r));let i=new this(e.name,e.duration,t,e.blendMode);return i.uuid=e.uuid,i.userData=JSON.parse(e.userData||`{}`),i}static toJSON(e){let t=[],n=e.tracks,r={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let e=0,r=n.length;e!==r;++e)t.push(ws.toJSON(n[e]));return r}static CreateFromMorphTargetSequence(e,t,n,r){let i=t.length,a=[];for(let e=0;e<i;e++){let o=[],s=[];o.push((e+i-1)%i,e,(e+1)%i),s.push(0,1,0);let c=ps(o);o=ms(o,1,c),s=ms(s,1,c),!r&&o[0]===0&&(o.push(i),s.push(s[0])),a.push(new Os(`.morphTargetInfluences[`+t[e].name+`]`,o,s).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let t=e;n=t.geometry&&t.geometry.animations||t.animations}for(let e=0;e<n.length;e++)if(n[e].name===t)return n[e];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let r={},i=/^([\w-]*?)([\d]+)$/;for(let t=0,n=e.length;t<n;t++){let n=e[t],a=n.name.match(i);if(a&&a.length>1){let e=a[1],t=r[e];t||(r[e]=t=[]),t.push(n)}}let a=[];for(let e in r)a.push(this.CreateFromMorphTargetSequence(e,r[e],t,n));return a}resetDuration(){let e=this.tracks,t=0;for(let n=0,r=e.length;n!==r;++n){let e=this.tracks[n];t=Math.max(t,e.times[e.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e&&=this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let t=0;t<this.tracks.length;t++)e.push(this.tracks[t].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}};function Ps(e){switch(e.toLowerCase()){case`scalar`:case`double`:case`float`:case`number`:case`integer`:return Os;case`vector`:case`vector2`:case`vector3`:case`vector4`:return Ms;case`color`:return Ds;case`quaternion`:return As;case`bool`:case`boolean`:return Es;case`string`:return js}throw Error(`THREE.KeyframeTrack: Unsupported typeName: `+e)}function Fs(e){if(e.type===void 0)throw Error(`THREE.KeyframeTrack: track type undefined, can not parse`);let t=Ps(e.type);if(e.times===void 0){let t=[],n=[];hs(e.keys,t,n,`value`),e.times=t,e.values=n}let n;return n=t.parse===void 0?new t(e.name,e.times,e.values,e.interpolation):t.parse(e),fs(e.settings)&&(n.settings={inTangents:ds(e.settings.inTangents,Float32Array),outTangents:ds(e.settings.outTangents,Float32Array)}),n}var Is={enabled:!1,files:{},add:function(e,t){this.enabled!==!1&&(Ls(e)||(this.files[e]=t))},get:function(e){if(this.enabled!==!1&&!Ls(e))return this.files[e]},remove:function(e){delete this.files[e]},clear:function(){this.files={}}};function Ls(e){try{let t=e.slice(e.indexOf(`:`)+1);return new URL(t).protocol===`blob:`}catch{return!1}}var Rs=new class{constructor(e,t,n){let r=this,i=!1,a=0,o=0,s,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(e){o++,i===!1&&r.onStart!==void 0&&r.onStart(e,a,o),i=!0},this.itemEnd=function(e){a++,r.onProgress!==void 0&&r.onProgress(e,a,o),a===o&&(i=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(e){r.onError!==void 0&&r.onError(e)},this.resolveURL=function(e){return e=e.normalize(`NFC`),s?s(e):e},this.setURLModifier=function(e){return s=e,this},this.addHandler=function(e,t){return c.push(e,t),this},this.removeHandler=function(e){let t=c.indexOf(e);return t!==-1&&c.splice(t,2),this},this.getHandler=function(e){for(let t=0,n=c.length;t<n;t+=2){let n=c[t],r=c[t+1];if(n.global&&(n.lastIndex=0),n.test(e))return r}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||=new AbortController,this._abortController}},zs=class{constructor(e){this.manager=e===void 0?Rs:e,this.crossOrigin=`anonymous`,this.withCredentials=!1,this.path=``,this.resourcePath=``,this.requestHeader={},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(r,i){n.load(e,r,t,i)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};zs.DEFAULT_MATERIAL_NAME=`__DEFAULT`;var Bs={},Vs=class extends Error{constructor(e,t){super(e),this.response=t}},Hs=class extends zs{constructor(e){super(e),this.mimeType=``,this.responseType=``,this._abortController=new AbortController}load(e,t,n,r){e===void 0&&(e=``),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let i=Is.get(`file:${e}`);if(i!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(i),this.manager.itemEnd(e)},0);return}if(Bs[e]!==void 0){Bs[e].push({onLoad:t,onProgress:n,onError:r});return}Bs[e]=[],Bs[e].push({onLoad:t,onProgress:n,onError:r});let a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?`include`:`same-origin`,signal:typeof AbortSignal.any==`function`?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,s=this.responseType;fetch(a).then(t=>{if(t.status===200||t.status===0){if(t.status===0&&I(`FileLoader: HTTP Status 0 received.`),typeof ReadableStream>`u`||t.body===void 0||t.body.getReader===void 0)return t;let n=Bs[e],r=t.body.getReader(),i=t.headers.get(`X-File-Size`)||t.headers.get(`Content-Length`),a=i?parseInt(i):0,o=a!==0,s=0,c=new ReadableStream({start(e){t();function t(){r.read().then(({done:r,value:i})=>{if(r)e.close();else{s+=i.byteLength;let r=new ProgressEvent(`progress`,{lengthComputable:o,loaded:s,total:a});for(let e=0,t=n.length;e<t;e++){let t=n[e];t.onProgress&&t.onProgress(r)}e.enqueue(i),t()}},t=>{e.error(t)})}}});return new Response(c)}throw new Vs(`fetch for "${t.url}" responded with ${t.status}: ${t.statusText}`,t)}).then(e=>{switch(s){case`arraybuffer`:return e.arrayBuffer();case`blob`:return e.blob();case`document`:return e.text().then(e=>new DOMParser().parseFromString(e,o));case`json`:return e.json();default:if(o===``)return e.text();{let t=/charset="?([^;"\s]*)"?/i.exec(o),n=t&&t[1]?t[1].toLowerCase():void 0,r=new TextDecoder(n);return e.arrayBuffer().then(e=>r.decode(e))}}}).then(t=>{Is.add(`file:${e}`,t);let n=Bs[e];delete Bs[e];for(let e=0,r=n.length;e<r;e++){let r=n[e];r.onLoad&&r.onLoad(t)}}).catch(t=>{let n=Bs[e];if(n===void 0)throw this.manager.itemError(e),t;delete Bs[e];for(let e=0,r=n.length;e<r;e++){let r=n[e];r.onError&&r.onError(t)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}},Us=new WeakMap,Ws=class extends zs{constructor(e){super(e)}load(e,t,n,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let i=this,a=Is.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)i.manager.itemStart(e),setTimeout(function(){t&&t(a),i.manager.itemEnd(e)},0);else{let e=Us.get(a);e===void 0&&(e=[],Us.set(a,e)),e.push({onLoad:t,onError:r})}return a}let o=Ze(`img`);function s(){l(),t&&t(this);let n=Us.get(this)||[];for(let e=0;e<n.length;e++){let t=n[e];t.onLoad&&t.onLoad(this)}Us.delete(this),i.manager.itemEnd(e)}function c(t){l(),r&&r(t),Is.remove(`image:${e}`);let n=Us.get(this)||[];for(let e=0;e<n.length;e++){let r=n[e];r.onError&&r.onError(t)}Us.delete(this),i.manager.itemError(e),i.manager.itemEnd(e)}function l(){o.removeEventListener(`load`,s,!1),o.removeEventListener(`error`,c,!1)}return o.addEventListener(`load`,s,!1),o.addEventListener(`error`,c,!1),e.slice(0,5)!==`data:`&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),Is.add(`image:${e}`,o),i.manager.itemStart(e),o.src=e,o}},Gs=class extends zs{constructor(e){super(e)}load(e,t,n,r){let i=new Zt,a=new Ws(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(e){i.image=e,i.needsUpdate=!0,t!==void 0&&t(i)},n,r),i}},Ks=class extends An{constructor(e,t=1){super(),this.isLight=!0,this.type=`Light`,this.color=new V(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},qs=class extends Ks{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type=`HemisphereLight`,this.position.copy(An.DEFAULT_UP),this.updateMatrix(),this.groundColor=new V(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},Js=new B,Ys=new z,Xs=new z,Zs=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new R(512,512),this.mapType=u,this.map=null,this.mapPass=null,this.matrix=new B,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Qi,this._frameExtents=new R(1,1),this._viewportCount=1,this._viewports=[new Qt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Ys.setFromMatrixPosition(e.matrixWorld),t.position.copy(Ys),Xs.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Xs),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,r){Js.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(Js,e.coordinateSystem,e.reversedDepth);let i=this._frameExtents,a=r?r.z/i.x:1,o=r?r.w/i.y:1,s=r?r.x/i.x:0,c=r?r.y/i.y:0;e.coordinateSystem===2001||e.reversedDepth?t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(Js)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Qs=new z,$s=new Nt,ec=new z,tc=class extends An{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new B,this.projectionMatrix=new B,this.projectionMatrixInverse=new B,this.coordinateSystem=Je,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Qs,$s,ec),ec.x===1&&ec.y===1&&ec.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Qs,$s,ec.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Qs,$s,ec),ec.x===1&&ec.y===1&&ec.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Qs,$s,ec.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},nc=new z,rc=new R,ic=new R,ac=class extends tc{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=lt*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(ct*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return lt*2*Math.atan(Math.tan(ct*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){nc.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(nc.x,nc.y).multiplyScalar(-e/nc.z),nc.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(nc.x,nc.y).multiplyScalar(-e/nc.z)}getViewSize(e,t){return this.getViewBounds(e,rc,ic),t.subVectors(ic,rc)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(ct*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},oc=class extends Zs{constructor(){super(new ac(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=lt*2*e.angle*this.focus,r=this.mapSize.width/this.mapSize.height*this.aspect,i=e.distance||t.far;(n!==t.fov||r!==t.aspect||i!==t.far)&&(t.fov=n,t.aspect=r,t.far=i,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){let e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}},sc=class extends Ks{constructor(e,t,n=0,r=Math.PI/3,i=0,a=2){super(e,t),this.isSpotLight=!0,this.type=`SpotLight`,this.position.copy(An.DEFAULT_UP),this.updateMatrix(),this.target=new An,this.distance=n,this.angle=r,this.penumbra=i,this.decay=a,this.map=null,this.shadow=new oc}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}},cc=class extends Zs{constructor(){super(new ac(90,1,.5,500)),this.isPointLightShadow=!0}},lc=class extends Ks{constructor(e,t,n=0,r=2){super(e,t),this.isPointLight=!0,this.type=`PointLight`,this.distance=n,this.decay=r,this.shadow=new cc}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},uc=class extends tc{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},dc=class extends Zs{constructor(){super(new uc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},fc=class extends Ks{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type=`DirectionalLight`,this.position.copy(An.DEFAULT_UP),this.updateMatrix(),this.target=new An,this.shadow=new dc}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},pc=class{static extractUrlBase(e){let t=e.lastIndexOf(`/`);return t===-1?`./`:e.slice(0,t+1)}static resolveURL(e,t){return typeof e!=`string`||e===``?``:(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,`$1`)),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}},mc=new WeakMap,hc=class extends zs{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>`u`&&I(`ImageBitmapLoader: createImageBitmap() not supported.`),typeof fetch>`u`&&I(`ImageBitmapLoader: fetch() not supported.`),this.options={premultiplyAlpha:`none`},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,r){e===void 0&&(e=``),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let i=this,a=Is.get(`image-bitmap:${e}`);if(a!==void 0){if(i.manager.itemStart(e),a.then){a.then(n=>{mc.has(a)===!0?(r&&r(mc.get(a)),i.manager.itemError(e),i.manager.itemEnd(e)):(t&&t(n),i.manager.itemEnd(e))});return}setTimeout(function(){t&&t(a),i.manager.itemEnd(e)},0);return}let o={};o.credentials=this.crossOrigin===`anonymous`?`same-origin`:`include`,o.headers=this.requestHeader,o.signal=typeof AbortSignal.any==`function`?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let s=fetch(e,o).then(function(e){return e.blob()}).then(function(e){return createImageBitmap(e,Object.assign({},i.options,{colorSpaceConversion:`none`}))}).then(function(n){return Is.add(`image-bitmap:${e}`,n),t&&t(n),i.manager.itemEnd(e),n}).catch(function(t){r&&r(t),mc.set(s,t),Is.remove(`image-bitmap:${e}`),i.manager.itemError(e),i.manager.itemEnd(e)});Is.add(`image-bitmap:${e}`,s),i.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}},gc=-90,_c=1,vc=class extends An{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new ac(gc,_c,e,t);r.layers=this.layers,this.add(r);let i=new ac(gc,_c,e,t);i.layers=this.layers,this.add(i);let a=new ac(gc,_c,e,t);a.layers=this.layers,this.add(a);let o=new ac(gc,_c,e,t);o.layers=this.layers,this.add(o);let s=new ac(gc,_c,e,t);s.layers=this.layers,this.add(s);let c=new ac(gc,_c,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let h=!1;h=e.isWebGLRenderer===!0?e.state.buffers.depth.getReversed():e.reversedDepthBuffer,e.setRenderTarget(n,0,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,i),e.setRenderTarget(n,1,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,4,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=m,e.setRenderTarget(n,5,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},yc=class extends ac{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},bc=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=xc.bind(this),e.addEventListener(`visibilitychange`,this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener(`visibilitychange`,this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e===void 0?performance.now():e)-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function xc(){this._document.hidden===!1&&this.reset()}var Sc=`\\[\\]\\.:\\/`,Cc=RegExp(`[\\[\\]\\.:\\/]`,`g`),wc=`[^\\[\\]\\.:\\/]`,Tc=`[^`+Sc.replace(`\\.`,``)+`]`,Ec=`((?:WC+[\\/:])*)`.replace(`WC`,wc),Dc=`(WCOD+)?`.replace(`WCOD`,Tc),Oc=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,wc),kc=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,wc),Ac=RegExp(`^`+Ec+Dc+Oc+kc+`$`),jc=[`material`,`materials`,`bones`,`map`],Mc=class{constructor(e,t,n){let r=n||Nc.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Nc=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(Cc,``)}static parseTrackName(e){let t=Ac.exec(e);if(t===null)throw Error(`THREE.PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);jc.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`THREE.PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){I(`PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){L(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){L(`PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){L(`PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){L(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){L(`PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){L(`PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){L(`PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;L(`PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){L(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){L(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Nc.Composite=Mc,Nc.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},Nc.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},Nc.prototype.GetterByBindingType=[Nc.prototype._getValue_direct,Nc.prototype._getValue_array,Nc.prototype._getValue_arrayElement,Nc.prototype._getValue_toArray],Nc.prototype.SetterByBindingTypeAndVersioning=[[Nc.prototype._setValue_direct,Nc.prototype._setValue_direct_setNeedsUpdate,Nc.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Nc.prototype._setValue_array,Nc.prototype._setValue_array_setNeedsUpdate,Nc.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Nc.prototype._setValue_arrayElement,Nc.prototype._setValue_arrayElement_setNeedsUpdate,Nc.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Nc.prototype._setValue_fromArray,Nc.prototype._setValue_fromArray_setNeedsUpdate,Nc.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]],class e{static{e.prototype.isMatrix2=!0}constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let i=this.elements;return i[0]=e,i[2]=t,i[1]=n,i[3]=r,this}};function Pc(e,t,n,r){let i=Fc(r);switch(n){case C:return e*t;case O:return e*t/i.components*i.byteLength;case ee:return e*t/i.components*i.byteLength;case k:return e*t*2/i.components*i.byteLength;case te:return e*t*2/i.components*i.byteLength;case w:return e*t*3/i.components*i.byteLength;case T:return e*t*4/i.components*i.byteLength;case ne:return e*t*4/i.components*i.byteLength;case A:case j:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case re:case M:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case ae:case se:return Math.max(e,16)*Math.max(t,8)/4;case ie:case oe:return Math.max(e,8)*Math.max(t,8)/2;case ce:case le:case N:case de:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case ue:case fe:case pe:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case me:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case he:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case ge:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case _e:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case ve:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case ye:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case be:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case xe:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case Se:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case Ce:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case we:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case Te:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case Ee:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case De:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case Oe:case ke:case Ae:return Math.ceil(e/4)*Math.ceil(t/4)*16;case je:case Me:return Math.ceil(e/4)*Math.ceil(t/4)*8;case Ne:case Pe:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function Fc(e){switch(e){case u:case d:return{byteLength:1,components:1};case p:case f:case _:return{byteLength:2,components:1};case v:case y:return{byteLength:2,components:4};case h:case m:case g:return{byteLength:4,components:1};case x:case S:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`186`}})),typeof window<`u`&&(window.__THREE__?I(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`186`);function Ic(){let e=null,t=!1,n=null,r=null;function i(t,a){r=e.requestAnimationFrame(i),n(t,a)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function Lc(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var Rc={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
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
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
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
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
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
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
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
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
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
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
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
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
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
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,common:`#define PI 3.141592653589793
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
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
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
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
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
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
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
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
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
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
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
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
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
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
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
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
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
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
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
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
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
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
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
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
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
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
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
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
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
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
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
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
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
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
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
}`,lights_fragment_begin:`
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
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
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
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
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
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
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
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
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
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
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
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
	#ifdef DOUBLE_SIDED
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
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
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
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
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
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
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
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
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
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
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
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
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
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
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
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
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
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
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
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
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
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
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
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
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
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
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
}`,depth_frag:`#if DEPTH_PACKING == 3200
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
}`,distance_vert:`#define DISTANCE
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
}`,distance_frag:`#define DISTANCE
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
void main() {
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
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
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
}`,linedashed_frag:`uniform vec3 diffuse;
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
}`,meshbasic_vert:`#include <common>
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
}`,meshbasic_frag:`uniform vec3 diffuse;
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
}`,meshlambert_vert:`#define LAMBERT
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
}`,meshlambert_frag:`#define LAMBERT
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
}`,meshmatcap_vert:`#define MATCAP
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
}`,meshmatcap_frag:`#define MATCAP
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
}`,meshnormal_vert:`#define NORMAL
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
}`,meshnormal_frag:`#define NORMAL
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
}`,meshphong_vert:`#define PHONG
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
}`,meshphong_frag:`#define PHONG
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
}`,meshphysical_vert:`#define STANDARD
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
}`,meshphysical_frag:`#define STANDARD
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
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
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
}`,meshtoon_vert:`#define TOON
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
}`,meshtoon_frag:`#define TOON
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
}`,points_vert:`uniform float size;
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
}`,points_frag:`uniform vec3 diffuse;
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
}`,shadow_vert:`#include <common>
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
}`,shadow_frag:`uniform vec3 color;
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
}`,sprite_vert:`uniform float rotation;
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
}`,sprite_frag:`uniform vec3 diffuse;
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
}`},U={common:{diffuse:{value:new V(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new It},alphaMap:{value:null},alphaMapTransform:{value:new It},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new It}},envmap:{envMap:{value:null},envMapRotation:{value:new It},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new It}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new It}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new It},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new It},normalScale:{value:new R(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new It},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new It}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new It}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new It}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new V(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new z},probesMax:{value:new z},probesResolution:{value:new z}},points:{diffuse:{value:new V(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new It},alphaTest:{value:0},uvTransform:{value:new It}},sprite:{diffuse:{value:new V(16777215)},opacity:{value:1},center:{value:new R(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new It},alphaMap:{value:null},alphaMapTransform:{value:new It},alphaTest:{value:0}}},zc={basic:{uniforms:Qo([U.common,U.specularmap,U.envmap,U.aomap,U.lightmap,U.fog]),vertexShader:Rc.meshbasic_vert,fragmentShader:Rc.meshbasic_frag},lambert:{uniforms:Qo([U.common,U.specularmap,U.envmap,U.aomap,U.lightmap,U.emissivemap,U.bumpmap,U.normalmap,U.displacementmap,U.fog,U.lights,{emissive:{value:new V(0)},envMapIntensity:{value:1}}]),vertexShader:Rc.meshlambert_vert,fragmentShader:Rc.meshlambert_frag},phong:{uniforms:Qo([U.common,U.specularmap,U.envmap,U.aomap,U.lightmap,U.emissivemap,U.bumpmap,U.normalmap,U.displacementmap,U.fog,U.lights,{emissive:{value:new V(0)},specular:{value:new V(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Rc.meshphong_vert,fragmentShader:Rc.meshphong_frag},standard:{uniforms:Qo([U.common,U.envmap,U.aomap,U.lightmap,U.emissivemap,U.bumpmap,U.normalmap,U.displacementmap,U.roughnessmap,U.metalnessmap,U.fog,U.lights,{emissive:{value:new V(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Rc.meshphysical_vert,fragmentShader:Rc.meshphysical_frag},toon:{uniforms:Qo([U.common,U.aomap,U.lightmap,U.emissivemap,U.bumpmap,U.normalmap,U.displacementmap,U.gradientmap,U.fog,U.lights,{emissive:{value:new V(0)}}]),vertexShader:Rc.meshtoon_vert,fragmentShader:Rc.meshtoon_frag},matcap:{uniforms:Qo([U.common,U.bumpmap,U.normalmap,U.displacementmap,U.fog,{matcap:{value:null}}]),vertexShader:Rc.meshmatcap_vert,fragmentShader:Rc.meshmatcap_frag},points:{uniforms:Qo([U.points,U.fog]),vertexShader:Rc.points_vert,fragmentShader:Rc.points_frag},dashed:{uniforms:Qo([U.common,U.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Rc.linedashed_vert,fragmentShader:Rc.linedashed_frag},depth:{uniforms:Qo([U.common,U.displacementmap]),vertexShader:Rc.depth_vert,fragmentShader:Rc.depth_frag},normal:{uniforms:Qo([U.common,U.bumpmap,U.normalmap,U.displacementmap,{opacity:{value:1}}]),vertexShader:Rc.meshnormal_vert,fragmentShader:Rc.meshnormal_frag},sprite:{uniforms:Qo([U.sprite,U.fog]),vertexShader:Rc.sprite_vert,fragmentShader:Rc.sprite_frag},background:{uniforms:{uvTransform:{value:new It},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Rc.background_vert,fragmentShader:Rc.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new It}},vertexShader:Rc.backgroundCube_vert,fragmentShader:Rc.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Rc.cube_vert,fragmentShader:Rc.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Rc.equirect_vert,fragmentShader:Rc.equirect_frag},distance:{uniforms:Qo([U.common,U.displacementmap,{referencePosition:{value:new z},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Rc.distance_vert,fragmentShader:Rc.distance_frag},shadow:{uniforms:Qo([U.lights,U.fog,{color:{value:new V(0)},opacity:{value:1}}]),vertexShader:Rc.shadow_vert,fragmentShader:Rc.shadow_frag}};zc.physical={uniforms:Qo([zc.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new It},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new It},clearcoatNormalScale:{value:new R(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new It},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new It},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new It},sheen:{value:0},sheenColor:{value:new V(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new It},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new It},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new It},transmissionSamplerSize:{value:new R},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new It},attenuationDistance:{value:0},attenuationColor:{value:new V(0)},specularColor:{value:new V(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new It},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new It},anisotropyVector:{value:new R},anisotropyMap:{value:null},anisotropyMapTransform:{value:new It}}]),vertexShader:Rc.meshphysical_vert,fragmentShader:Rc.meshphysical_frag};var Bc={r:0,b:0,g:0},Vc=new B,Hc=new It;Hc.set(-1,0,0,0,1,0,0,0,1);function Uc(e,t,n,r,i,a){let o=new V(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function p(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function m(t){let r=!1,i=p(t);i===null?g(o,s):i&&i.isColor&&(g(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function h(t,n){let i=p(n);i&&(i.isCubeTexture||i.mapping===306)?(l===void 0&&(l=new H(new Ta(1,1,1),new as({name:`BackgroundCubeMaterial`,uniforms:Zo(zc.backgroundCube.uniforms),vertexShader:zc.backgroundCube.vertexShader,fragmentShader:zc.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(Vc.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isCubeTexture&&i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(Hc),l.material.toneMapped=Vt.getTransfer(i.colorSpace)!==Ge,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new H(new Jo(2,2),new as({name:`BackgroundMaterial`,uniforms:Zo(zc.background.uniforms),vertexShader:zc.background.vertexShader,fragmentShader:zc.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=Vt.getTransfer(i.colorSpace)!==Ge,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function g(t,r){t.getRGB(Bc,ts(e)),n.buffers.color.setClear(Bc.r,Bc.g,Bc.b,r,a)}function _(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,g(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,g(o,s)},render:m,addToRenderList:h,dispose:_}}function Wc(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function Gc(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function Kc(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&n!==1015&&!i&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(I(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`);n.reversedDepthBuffer===!0&&f===!1&&I(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function qc(e){let t=this,n=null,r=0,i=!1,a=!1,o=new Vr,s=new It,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var Jc=4,Yc=6,Xc=20,Zc=256,Qc=new uc,$c=new V,el=null,tl=0,nl=0,rl=!1,il=new z,al=new z,ol=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=il}=i;el=this._renderer.getRenderTarget(),tl=this._renderer.getActiveCubeFace(),nl=this._renderer.getActiveMipmapLevel(),rl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=pl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=fl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(el,tl,nl),this._renderer.xr.enabled=rl,e.scissorTest=!1,ll(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),el=this._renderer.getRenderTarget(),tl=this._renderer.getActiveCubeFace(),nl=this._renderer.getActiveMipmapLevel(),rl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:s,minFilter:s,generateMipmaps:!1,type:_,format:T,colorSpace:Ue,depthBuffer:!1},r=cl(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=cl(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=sl(r)),this._blurMaterial=dl(r,e,t),this._ggxMaterial=ul(r,e,t)}return r}_compileMaterial(e){let t=new H(new Pr,e);this._renderer.compile(t,Qc)}_sceneToCubeUV(e,t,n,r,i){let a=new ac(90,1,t,n),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,l=c.autoClear,u=c.toneMapping;c.getClearColor($c),c.toneMapping=0,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(r),c.clearDepth(),c.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new H(new Ta,new di({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1})));let d=this._backgroundBox,f=d.material,p=!1,m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,p=!0):(f.color.copy($c),p=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x+s[t],i.y,i.z)):n===1?(a.up.set(0,0,o[t]),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y+s[t],i.z)):(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y,i.z+s[t]));let l=this._cubeSize;ll(r,n*l,t>2?l:0,l,l),c.setRenderTarget(r),p&&c.render(d,a),c.render(e,a)}c.toneMapping=u,c.autoClear=l,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=pl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=fl());let i=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=i;let o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;ll(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,Qc)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let t=1;t<r;t++)this._applyGGXFilter(e,t-1,t);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,i=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let s=a.uniforms,c=n/(this._lodMeshes.length-1),l=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-l*l)*(c*1.25),{_lodMax:d}=this,f=this._sizeLods[n],p=3*f*(n>d-Jc?n-d+Jc:0),m=4*(this._cubeSize-f);s.envMap.value=e.texture,s.roughness.value=u,s.mipInt.value=d-t,ll(i,p,m,3*f,2*f),r.setRenderTarget(i),r.render(o,Qc),s.envMap.value=i.texture,s.roughness.value=0,s.mipInt.value=d-n,ll(e,p,m,3*f,2*f),r.setRenderTarget(e),r.render(o,Qc)}_blur(e,t,n,r){let i=this._pingPongRenderTarget,a=Math.min(r,Math.PI)/Math.SQRT2;this._blurPass(e,i,t,n,a),this._blurPass(i,e,n,n,a)}_blurPass(e,t,n,r,i){let a=this._renderer,o=this._blurMaterial,s=this._lodMeshes[r];s.material=o;let c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=i,c.mipInt.value=this._lodMax-n;let l=this._sizeLods[r];ll(t,3*l*(r>this._lodMax-Jc?r-this._lodMax+Jc:0),4*(this._cubeSize-l),3*l,2*l),a.setRenderTarget(t),a.render(s,Qc)}};function sl(e){let t=[],n=[],r=e,i=e-Jc+1+Yc;for(let e=0;e<i;e++){let e=2**r;t.push(e);let i=1/(e-2),a=-i,o=1+i,s=[a,a,o,a,o,o,a,a,o,o,a,o],c=new Float32Array(108),l=new Float32Array(108);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];c.set(r,18*e);for(let t=0;t<6;t++){let n=s[t*2]*2-1,r=s[t*2+1]*2-1;e===0?al.set(1,r,n):e===1?al.set(-n,1,-r):e===2?al.set(-n,r,1):e===3?al.set(-1,r,-n):e===4?al.set(-n,-1,r):al.set(n,r,-1),al.toArray(l,(e*6+t)*3)}}let u=new Pr;u.setAttribute(`position`,new yr(c,3)),u.setAttribute(`outputDirection`,new yr(l,3)),n.push(new H(u,null)),r>Jc&&r--}return{lodMeshes:n,sizeLods:t}}function cl(e,t,n){let r=new en(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function ll(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function ul(e,t,n){return new as({name:`PMREMGGXConvolution`,defines:{GGX_SAMPLES:Zc,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:ml(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})}function dl(e,t,n){return new as({name:`SphericalGaussianBlur`,defines:{SAMPLES:Xc,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:ml(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function fl(){return new as({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:ml(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})}function pl(){return new as({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ml(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function ml(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var hl=class extends en{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new ba(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new Ta(5,5,5),i=new as({name:`CubemapFromEquirect`,uniforms:Zo(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new H(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=s),new vc(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}};function gl(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new hl(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new ol(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new ol(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function _l(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&nt(`WebGLRenderer: `+e+` extension not supported.`),t}}}function vl(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0||(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++),t}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(i===void 0)return;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else{let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}let s=new(i.count>=65535?xr:br)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function yl(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function bl(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:L(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function xl(e,t,n){let r=new WeakMap,i=new Qt;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),_=new tn(h,p,m,u);_.type=g,_.needsUpdate=!0;let v=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*v;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:_,size:new R(p,m)},r.set(o,d);function y(){_.dispose(),r.delete(o),o.removeEventListener(`dispose`,y)}o.addEventListener(`dispose`,y)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function Sl(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var Cl={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function wl(e,t,n,r,i,a){let o=new en(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),s=null,c=null,l=new Pr;l.setAttribute(`position`,new Sr([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute(`uv`,new Sr([0,2,0,0,2,0],2));let u=new os({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),d=new H(l,u),f=new uc(-1,1,1,-1,0,1),p=null,m=null,h=!1,g,v=null,y=[],b=!1;this.setSize=function(e,t){o.setSize(e,t),s!==null&&s.setSize(e,t),c!==null&&c.setSize(e,t);for(let n=0;n<y.length;n++){let r=y[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){y=e,b=y.length>0&&y[0].isRenderPass===!0;let t=o.width,n=o.height;y.length>0&&s===null&&(s=new en(t,n,{type:_,depthBuffer:!1,stencilBuffer:!1}),c=new en(t,n,{type:_,depthBuffer:!1,stencilBuffer:!1}));for(let e=0;e<y.length;e++){let r=y[e];r.setSize&&r.setSize(t,n)}},this.begin=function(e,t){if(h||e.toneMapping===0&&y.length===0)return!1;if(v=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return b===!1&&e.setRenderTarget(o),g=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return b},this.end=function(e,t){e.toneMapping=g,h=!0;let n=o,r=s;for(let i=0;i<y.length;i++){let a=y[i];a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1&&(n=r,r=r===s?c:s))}if(p!==e.outputColorSpace||m!==e.toneMapping){p=e.outputColorSpace,m=e.toneMapping,u.defines={},Vt.getTransfer(p)===`srgb`&&(u.defines.SRGB_TRANSFER=``);let t=Cl[m];t&&(u.defines[t]=``),u.needsUpdate=!0}u.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(v),e.render(d,f),v=null,h=!1},this.isCompositing=function(){return h},this.dispose=function(){o.dispose(),s!==null&&s.dispose(),c!==null&&c.dispose(),l.dispose(),u.dispose()}}var Tl=new Zt,El=new Sa(1,1),Dl=new tn,Ol=new nn,kl=new ba,Al=[],jl=[],Ml=new Float32Array(16),Nl=new Float32Array(9),Pl=new Float32Array(4);function Fl(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=Al[i];if(a===void 0&&(a=new Float32Array(i),Al[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function Il(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function Ll(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function Rl(e,t){let n=jl[t];n===void 0&&(n=new Int32Array(t),jl[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function zl(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function Bl(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Il(n,t))return;e.uniform2fv(this.addr,t),Ll(n,t)}}function Vl(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(Il(n,t))return;e.uniform3fv(this.addr,t),Ll(n,t)}}function Hl(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Il(n,t))return;e.uniform4fv(this.addr,t),Ll(n,t)}}function Ul(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Il(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),Ll(n,t)}else{if(Il(n,r))return;Pl.set(r),e.uniformMatrix2fv(this.addr,!1,Pl),Ll(n,r)}}function Wl(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Il(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),Ll(n,t)}else{if(Il(n,r))return;Nl.set(r),e.uniformMatrix3fv(this.addr,!1,Nl),Ll(n,r)}}function Gl(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Il(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),Ll(n,t)}else{if(Il(n,r))return;Ml.set(r),e.uniformMatrix4fv(this.addr,!1,Ml),Ll(n,r)}}function Kl(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function ql(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Il(n,t))return;e.uniform2iv(this.addr,t),Ll(n,t)}}function Jl(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Il(n,t))return;e.uniform3iv(this.addr,t),Ll(n,t)}}function Yl(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Il(n,t))return;e.uniform4iv(this.addr,t),Ll(n,t)}}function Xl(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function Zl(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Il(n,t))return;e.uniform2uiv(this.addr,t),Ll(n,t)}}function Ql(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Il(n,t))return;e.uniform3uiv(this.addr,t),Ll(n,t)}}function $l(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Il(n,t))return;e.uniform4uiv(this.addr,t),Ll(n,t)}}function eu(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(El.compareFunction=n.isReversedDepthBuffer()?518:515,a=El):a=Tl,n.setTexture2D(t||a,i)}function tu(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||Ol,i)}function nu(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||kl,i)}function ru(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||Dl,i)}function iu(e){switch(e){case 5126:return zl;case 35664:return Bl;case 35665:return Vl;case 35666:return Hl;case 35674:return Ul;case 35675:return Wl;case 35676:return Gl;case 5124:case 35670:return Kl;case 35667:case 35671:return ql;case 35668:case 35672:return Jl;case 35669:case 35673:return Yl;case 5125:return Xl;case 36294:return Zl;case 36295:return Ql;case 36296:return $l;case 35678:case 36198:case 36298:case 36306:case 35682:return eu;case 35679:case 36299:case 36307:return tu;case 35680:case 36300:case 36308:case 36293:return nu;case 36289:case 36303:case 36311:case 36292:return ru}}function au(e,t){e.uniform1fv(this.addr,t)}function ou(e,t){let n=Fl(t,this.size,2);e.uniform2fv(this.addr,n)}function su(e,t){let n=Fl(t,this.size,3);e.uniform3fv(this.addr,n)}function cu(e,t){let n=Fl(t,this.size,4);e.uniform4fv(this.addr,n)}function lu(e,t){let n=Fl(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function uu(e,t){let n=Fl(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function du(e,t){let n=Fl(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function fu(e,t){e.uniform1iv(this.addr,t)}function pu(e,t){e.uniform2iv(this.addr,t)}function mu(e,t){e.uniform3iv(this.addr,t)}function hu(e,t){e.uniform4iv(this.addr,t)}function gu(e,t){e.uniform1uiv(this.addr,t)}function _u(e,t){e.uniform2uiv(this.addr,t)}function vu(e,t){e.uniform3uiv(this.addr,t)}function yu(e,t){e.uniform4uiv(this.addr,t)}function bu(e,t,n){let r=this.cache,i=t.length,a=Rl(n,i);Il(r,a)||(e.uniform1iv(this.addr,a),Ll(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?El:Tl;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function xu(e,t,n){let r=this.cache,i=t.length,a=Rl(n,i);Il(r,a)||(e.uniform1iv(this.addr,a),Ll(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||Ol,a[e])}function Su(e,t,n){let r=this.cache,i=t.length,a=Rl(n,i);Il(r,a)||(e.uniform1iv(this.addr,a),Ll(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||kl,a[e])}function Cu(e,t,n){let r=this.cache,i=t.length,a=Rl(n,i);Il(r,a)||(e.uniform1iv(this.addr,a),Ll(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||Dl,a[e])}function wu(e){switch(e){case 5126:return au;case 35664:return ou;case 35665:return su;case 35666:return cu;case 35674:return lu;case 35675:return uu;case 35676:return du;case 5124:case 35670:return fu;case 35667:case 35671:return pu;case 35668:case 35672:return mu;case 35669:case 35673:return hu;case 5125:return gu;case 36294:return _u;case 36295:return vu;case 36296:return yu;case 35678:case 36198:case 36298:case 36306:case 35682:return bu;case 35679:case 36299:case 36307:return xu;case 35680:case 36300:case 36308:case 36293:return Su;case 36289:case 36303:case 36311:case 36292:return Cu}}var Tu=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=iu(t.type)}},Eu=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=wu(t.type)}},Du=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},Ou=/(\w+)(\])?(\[|\.)?/g;function ku(e,t){e.seq.push(t),e.map[t.id]=t}function Au(e,t,n){let r=e.name,i=r.length;for(Ou.lastIndex=0;;){let a=Ou.exec(r),o=Ou.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){ku(n,l===void 0?new Tu(s,e,t):new Eu(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new Du(s),ku(n,e)),n=e}}}var ju=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);Au(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function Mu(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var Nu=37297,Pu=0;function Fu(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var Iu=new It;function Lu(e){Vt._getMatrix(Iu,Vt.workingColorSpace,e);let t=`mat3( ${Iu.elements.map(e=>e.toFixed(4))} )`;switch(Vt.getTransfer(e)){case We:return[t,`LinearTransferOETF`];case Ge:return[t,`sRGBTransferOETF`];default:return I(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function Ru(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+Fu(e.getShaderSource(t),r)}return i}function zu(e,t){let n=Lu(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}var Bu={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function Vu(e,t){let n=Bu[t];return n===void 0?(I(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var Hu=new z;function Uu(){return Vt.getLuminanceCoefficients(Hu),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${Hu.x.toFixed(4)}, ${Hu.y.toFixed(4)}, ${Hu.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function Wu(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(qu).join(`
`)}function Gu(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function Ku(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function qu(e){return e!==``}function Ju(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Yu(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Xu=/^[ \t]*#include +<([\w\d./]+)>/gm;function Zu(e){return e.replace(Xu,$u)}var Qu=new Map;function $u(e,t){let n=Rc[t];if(n===void 0){let e=Qu.get(t);if(e!==void 0)n=Rc[e],I(`WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`)}return Zu(n)}var ed=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function td(e){return e.replace(ed,nd)}function nd(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function rd(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var id={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function ad(e){return id[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var od={301:`ENVMAP_TYPE_CUBE`,302:`ENVMAP_TYPE_CUBE`,306:`ENVMAP_TYPE_CUBE_UV`};function sd(e){return e.envMap===!1?`ENVMAP_TYPE_CUBE`:od[e.envMapMode]||`ENVMAP_TYPE_CUBE`}var cd={302:`ENVMAP_MODE_REFRACTION`};function ld(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:cd[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var ud={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function dd(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:ud[e.combine]||`ENVMAP_BLENDING_NONE`}function fd(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function pd(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=ad(n),l=sd(n),u=ld(n),d=dd(n),f=fd(n),p=Wu(n),m=Gu(a),h=i.createProgram(),g,_,v=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(qu).join(`
`),g.length>0&&(g+=`
`),_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(qu).join(`
`),_.length>0&&(_+=`
`)):(g=[rd(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(qu).join(`
`),_=[rd(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.retroreflection?`#define USE_RETROREFLECTION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.numLightProbeGrids>0?`#define USE_LIGHT_PROBES_GRID`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:Rc.tonemapping_pars_fragment,n.toneMapping===0?``:Vu(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,Rc.colorspace_pars_fragment,zu(`linearToOutputTexel`,n.outputColorSpace),Uu(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(qu).join(`
`)),o=Zu(o),o=Ju(o,n),o=Yu(o,n),s=Zu(s),s=Ju(s,n),s=Yu(s,n),o=td(o),s=td(s),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let y=v+g+o,b=v+_+s,x=Mu(i,i.VERTEX_SHADER,y),S=Mu(i,i.FRAGMENT_SHADER,b);i.attachShader(h,x),i.attachShader(h,S),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h);function C(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(h)||``,r=i.getShaderInfoLog(x)||``,a=i.getShaderInfoLog(S)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(h,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,h,x,S);else{let e=Ru(i,x,`vertex`),n=Ru(i,S,`fragment`);L(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(h,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):I(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:g},fragmentShader:{log:c,prefix:_}})}i.deleteShader(x),i.deleteShader(S),w=new ju(i,h),T=Ku(i,h)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let E=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(h,Nu)),E},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=Pu++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=x,this.fragmentShader=S,this}var md=0,hd=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new gd(e),t.set(e,n)),n}},gd=class{constructor(e){this.id=md++,this.code=e,this.usedTimes=0}};function _d(e){return e===1030||e===37490||e===36285}function vd(e,t,n,r,i,a){let o=new mn,s=new hd,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f=r.precision,p={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function m(e){return c.add(e),e===0?`uv`:`uv${e}`}function h(i,o,l,u,h,g){let _=u.fog,v=h.geometry,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,b=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,x=t.get(i.envMap||y,b),S=x&&x.mapping===306?x.image.height:null,C=p[i.type];i.precision!==null&&(f=r.getMaxPrecision(i.precision),f!==i.precision&&I(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,f,`instead.`));let w=v.morphAttributes.position||v.morphAttributes.normal||v.morphAttributes.color,T=w===void 0?0:w.length,E=0;v.morphAttributes.position!==void 0&&(E=1),v.morphAttributes.normal!==void 0&&(E=2),v.morphAttributes.color!==void 0&&(E=3);let D,O,ee,k;if(C){let e=zc[C];D=e.vertexShader,O=e.fragmentShader}else{D=i.vertexShader,O=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),ee=e.id,k=t.id}let te=e.getRenderTarget(),ne=e.state.buffers.depth.getReversed(),A=h.isInstancedMesh===!0,j=h.isBatchedMesh===!0,re=!!i.map,M=!!i.matcap,ie=!!x,ae=!!i.aoMap,oe=!!i.lightMap,se=!!i.bumpMap&&i.wireframe===!1,ce=!!i.normalMap,le=!!i.displacementMap,ue=!!i.emissiveMap,N=!!i.metalnessMap,de=!!i.roughnessMap,fe=i.anisotropy>0,pe=i.clearcoat>0,me=i.dispersion>0,he=i.retroreflectivity>0,ge=i.iridescence>0,_e=i.sheen>0,ve=i.transmission>0,ye=fe&&!!i.anisotropyMap,be=pe&&!!i.clearcoatMap,xe=pe&&!!i.clearcoatNormalMap,Se=pe&&!!i.clearcoatRoughnessMap,Ce=ge&&!!i.iridescenceMap,we=ge&&!!i.iridescenceThicknessMap,Te=_e&&!!i.sheenColorMap,Ee=_e&&!!i.sheenRoughnessMap,De=!!i.specularMap,Oe=!!i.specularColorMap,ke=!!i.specularIntensityMap,Ae=ve&&!!i.transmissionMap,je=ve&&!!i.thicknessMap,Me=!!i.gradientMap,Ne=!!i.alphaMap,Pe=i.alphaTest>0,P=!!i.alphaHash,Fe=!!i.extensions,Ie=0;i.toneMapped&&(te===null||te.isXRRenderTarget===!0)&&(Ie=e.toneMapping);let Le={shaderID:C,shaderType:i.type,shaderName:i.name,vertexShader:D,fragmentShader:O,defines:i.defines,customVertexShaderID:ee,customFragmentShaderID:k,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:f,batching:j,batchingColor:j&&h._colorsTexture!==null,instancing:A,instancingColor:A&&h.instanceColor!==null,instancingMorph:A&&h.morphTexture!==null,outputColorSpace:te===null?e.outputColorSpace:te.isXRRenderTarget===!0?te.texture.colorSpace:Vt.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:re,matcap:M,envMap:ie,envMapMode:ie&&x.mapping,envMapCubeUVHeight:S,aoMap:ae,lightMap:oe,bumpMap:se,normalMap:ce,displacementMap:le,emissiveMap:ue,normalMapObjectSpace:ce&&i.normalMapType===1,normalMapTangentSpace:ce&&i.normalMapType===0,packedNormalMap:ce&&i.normalMapType===0&&_d(i.normalMap.format),metalnessMap:N,roughnessMap:de,anisotropy:fe,anisotropyMap:ye,clearcoat:pe,clearcoatMap:be,clearcoatNormalMap:xe,clearcoatRoughnessMap:Se,dispersion:me,retroreflection:he,iridescence:ge,iridescenceMap:Ce,iridescenceThicknessMap:we,sheen:_e,sheenColorMap:Te,sheenRoughnessMap:Ee,specularMap:De,specularColorMap:Oe,specularIntensityMap:ke,transmission:ve,transmissionMap:Ae,thicknessMap:je,gradientMap:Me,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:Ne,alphaTest:Pe,alphaHash:P,combine:i.combine,mapUv:re&&m(i.map.channel),aoMapUv:ae&&m(i.aoMap.channel),lightMapUv:oe&&m(i.lightMap.channel),bumpMapUv:se&&m(i.bumpMap.channel),normalMapUv:ce&&m(i.normalMap.channel),displacementMapUv:le&&m(i.displacementMap.channel),emissiveMapUv:ue&&m(i.emissiveMap.channel),metalnessMapUv:N&&m(i.metalnessMap.channel),roughnessMapUv:de&&m(i.roughnessMap.channel),anisotropyMapUv:ye&&m(i.anisotropyMap.channel),clearcoatMapUv:be&&m(i.clearcoatMap.channel),clearcoatNormalMapUv:xe&&m(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Se&&m(i.clearcoatRoughnessMap.channel),iridescenceMapUv:Ce&&m(i.iridescenceMap.channel),iridescenceThicknessMapUv:we&&m(i.iridescenceThicknessMap.channel),sheenColorMapUv:Te&&m(i.sheenColorMap.channel),sheenRoughnessMapUv:Ee&&m(i.sheenRoughnessMap.channel),specularMapUv:De&&m(i.specularMap.channel),specularColorMapUv:Oe&&m(i.specularColorMap.channel),specularIntensityMapUv:ke&&m(i.specularIntensityMap.channel),transmissionMapUv:Ae&&m(i.transmissionMap.channel),thicknessMapUv:je&&m(i.thicknessMap.channel),alphaMapUv:Ne&&m(i.alphaMap.channel),vertexTangents:!!v.attributes.tangent&&(ce||fe),vertexNormals:!!v.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!v.attributes.color&&v.attributes.color.itemSize===4,pointsUvs:h.isPoints===!0&&!!v.attributes.uv&&(re||Ne),fog:!!_,useFog:i.fog===!0,fogExp2:!!_&&_.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||v.attributes.normal===void 0&&ce===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:ne,skinning:h.isSkinnedMesh===!0,hasPositionAttribute:v.attributes.position!==void 0,morphTargets:v.morphAttributes.position!==void 0,morphNormals:v.morphAttributes.normal!==void 0,morphColors:v.morphAttributes.color!==void 0,morphTargetsCount:T,morphTextureStride:E,numSunLights:o.sun.length,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numSunLightShadows:o.sunShadowMap.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:g.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:Ie,decodeVideoTexture:re&&i.map.isVideoTexture===!0&&Vt.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:ue&&i.emissiveMap.isVideoTexture===!0&&Vt.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:Fe&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(Fe&&i.extensions.multiDraw===!0||j)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return Le.vertexUv1s=c.has(1),Le.vertexUv2s=c.has(2),Le.vertexUv3s=c.has(3),c.clear(),Le}function g(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(_(n,t),v(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function _(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numSunLights),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numSunLightShadows),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function v(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.retroreflection&&o.enable(24),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function y(e){let t=p[e.type],n;if(t){let e=zc[t];n=ns.clone(e.uniforms)}else n=e.uniforms;return n}function b(t,n){let r=u.get(n);return r===void 0?(r=new pd(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function x(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function S(e){s.remove(e)}function C(){s.dispose()}return{getParameters:h,getProgramCacheKey:g,getUniforms:y,acquireProgram:b,releaseProgram:x,releaseShaderCache:S,programs:l,dispose:C}}function yd(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function bd(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function xd(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function Sd(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l,u){u.reversedDepth===!0&&(c=-c);let d=s(e,t,a,o,c,l);a.transmission>0?r.push(d):a.transparent===!0?i.push(d):n.push(d)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t){n.length>1&&n.sort(e||bd),r.length>1&&r.sort(t||xd),i.length>1&&i.sort(t||xd)}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function Cd(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new Sd,e.set(t,[i])):n>=r.length?(i=new Sd,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function wd(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={direction:new z,color:new V};break;case`SpotLight`:n={position:new z,direction:new z,color:new V,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new z,color:new V,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new z,skyColor:new V,groundColor:new V};break;case`RectAreaLight`:n={color:new V,position:new z,halfWidth:new z,halfHeight:new z}}return e[t.id]=n,n}}}function Td(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new R};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new R};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new R,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var Ed=0;function Dd(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function Od(e){let t=new wd,n=Td(),r={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new z);let i=new z,a=new B,o=new B;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0,y=0,b=0,x=0;i.sort(Dd);for(let e=0,S=i.length;e<S;e++){let S=i[e],C=S.color,w=S.intensity,T=S.distance,E=null;if(S.shadow&&S.shadow.map&&(E=S.shadow.map.texture.format===1030?S.shadow.map.texture:S.shadow.map.depthTexture||S.shadow.map.texture),S.isAmbientLight)a+=C.r*w,o+=C.g*w,s+=C.b*w;else if(S.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(S.sh.coefficients[e],w);x++}else if(S.isSunLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize.copy(e.mapSize).multiply(e.getFrameExtents()),r.sunShadow[l]=t,r.sunShadowMap[l]=E;let i=e.getViewportCount();for(let t=0;t<i;t++)r.sunShadowMatrix[u+t]=e.getMatrix(t),r.sunShadowCascade[u+t]=e._cascadeData[t];u+=i,l++}r.sun[c]=e,c++}else if(S.isDirectionalLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[d]=t,r.directionalShadowMap[d]=E,r.directionalShadowMatrix[d]=S.shadow.matrix,g++}r.directional[d]=e,d++}else if(S.isSpotLight){let e=t.get(S);e.position.setFromMatrixPosition(S.matrixWorld),e.color.copy(C).multiplyScalar(w),e.distance=T,e.coneCos=Math.cos(S.angle),e.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),e.decay=S.decay,r.spot[p]=e;let i=S.shadow;if(S.map&&(r.spotLightMap[y]=S.map,y++,i.updateMatrices(S),S.castShadow&&b++),r.spotLightMatrix[p]=i.matrix,S.castShadow){let e=n.get(S);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[p]=e,r.spotShadowMap[p]=E,v++}p++}else if(S.isRectAreaLight){let e=t.get(S);e.color.copy(C).multiplyScalar(w),e.halfWidth.set(S.width*.5,0,0),e.halfHeight.set(0,S.height*.5,0),r.rectArea[m]=e,m++}else if(S.isPointLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),e.distance=S.distance,e.decay=S.decay,S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[f]=t,r.pointShadowMap[f]=E,r.pointShadowMatrix[f]=S.shadow.matrix,_++}r.point[f]=e,f++}else if(S.isHemisphereLight){let e=t.get(S);e.skyColor.copy(S.color).multiplyScalar(w),e.groundColor.copy(S.groundColor).multiplyScalar(w),r.hemi[h]=e,h++}}m>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=U.LTC_FLOAT_1,r.rectAreaLTC2=U.LTC_FLOAT_2):(r.rectAreaLTC1=U.LTC_HALF_1,r.rectAreaLTC2=U.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let S=r.hash;(S.sunLength!==c||S.directionalLength!==d||S.pointLength!==f||S.spotLength!==p||S.rectAreaLength!==m||S.hemiLength!==h||S.numSunShadows!==l||S.numDirectionalShadows!==g||S.numPointShadows!==_||S.numSpotShadows!==v||S.numSpotMaps!==y||S.numLightProbes!==x)&&(r.sun.length=c,r.directional.length=d,r.spot.length=p,r.rectArea.length=m,r.point.length=f,r.hemi.length=h,r.sunShadow.length=l,r.sunShadowMap.length=l,r.sunShadowMatrix.length=u,r.sunShadowCascade.length=u,r.directionalShadow.length=g,r.directionalShadowMap.length=g,r.directionalShadowMatrix.length=g,r.pointShadow.length=_,r.pointShadowMap.length=_,r.pointShadowMatrix.length=_,r.spotShadow.length=v,r.spotShadowMap.length=v,r.spotLightMatrix.length=v+y-b,r.spotLightMap.length=y,r.numSpotLightShadowsWithMaps=b,r.numLightProbes=x,S.sunLength=c,S.directionalLength=d,S.pointLength=f,S.spotLength=p,S.rectAreaLength=m,S.hemiLength=h,S.numSunShadows=l,S.numDirectionalShadows=g,S.numPointShadows=_,S.numSpotShadows=v,S.numSpotMaps=y,S.numLightProbes=x,r.version=Ed++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=0,f=t.matrixWorldInverse;for(let t=0,p=e.length;t<p;t++){let p=e[t];if(p.isSunLight){let e=r.sun[n];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),n++}else if(p.isDirectionalLight){let e=r.directional[s];e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),s++}else if(p.isSpotLight){let e=r.spot[l];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),l++}else if(p.isRectAreaLight){let e=r.rectArea[u];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),o.identity(),a.copy(p.matrixWorld),a.premultiply(f),o.extractRotation(a),e.halfWidth.set(p.width*.5,0,0),e.halfHeight.set(0,p.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),u++}else if(p.isPointLight){let e=r.point[c];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),c++}else if(p.isHemisphereLight){let e=r.hemi[d];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),d++}}}return{setup:s,setupView:c,state:r}}function kd(e){let t=new Od(e),n=[],r=[],i=[];function a(e){d.camera=e,n.length=0,r.length=0,i.length=0}function o(e){n.push(e)}function s(e){r.push(e)}function c(e){i.push(e)}function l(){t.setup(n)}function u(e){t.setupView(n,e)}let d={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:d,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:s,pushLightProbeGrid:c}}function Ad(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new kd(e),t.set(n,[a])):r>=i.length?(a=new kd(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var jd=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Md=`uniform sampler2D shadow_pass;
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
}`,Nd=[new z(1,0,0),new z(-1,0,0),new z(0,1,0),new z(0,-1,0),new z(0,0,1),new z(0,0,-1)],Pd=[new z(0,-1,0),new z(0,-1,0),new z(0,0,1),new z(0,0,-1),new z(0,-1,0),new z(0,-1,0)],Fd=new B,Id=new z,Ld=new z;function Rd(e,t,n){let r=new Qi,a=new R,o=new R,c=new Qt,l=new ls,u=new us,d={},f=n.maxTextureSize,p={0:1,1:0,2:2},m=new as({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new R},radius:{value:4}},vertexShader:jd,fragmentShader:Md}),v=m.clone();v.defines.HORIZONTAL_PASS=1;let y=new Pr;y.setAttribute(`position`,new yr(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let b=new H(y,m),x=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let S=this.type;this.render=function(t,n,l){if(x.enabled===!1||x.autoUpdate===!1&&x.needsUpdate===!1||t.length===0)return;this.type===2&&(I(`WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead.`),this.type=1);let u=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),m=e.state;m.setBlending(0),m.buffers.depth.getReversed()===!0?m.buffers.color.setClear(0,0,0,0):m.buffers.color.setClear(1,1,1,1),m.buffers.depth.setTest(!0),m.setScissorTest(!1);let v=S!==this.type;v&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let u=0,d=t.length;u<d;u++){let d=t[u],p=d.shadow;if(p===void 0){I(`WebGLShadowMap:`,d,`has no shadow.`);continue}if(p.autoUpdate===!1&&p.needsUpdate===!1)continue;a.copy(p.mapSize);let y=p.getFrameExtents();a.multiply(y),o.copy(p.mapSize),(a.x>f||a.y>f)&&(a.x>f&&(o.x=Math.floor(f/y.x),a.x=o.x*y.x,p.mapSize.x=o.x),a.y>f&&(o.y=Math.floor(f/y.y),a.y=o.y*y.y,p.mapSize.y=o.y));let b=e.state.buffers.depth.getReversed();if(p.camera._reversedDepth=b,p.map===null||v===!0){if(p.map!==null&&(p.map.depthTexture!==null&&(p.map.depthTexture.dispose(),p.map.depthTexture=null),p.map.dispose()),this.type===3){if(d.isPointLight){I(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}p.map=new en(a.x,a.y,{format:k,type:_,minFilter:s,magFilter:s,generateMipmaps:!1}),p.map.texture.name=d.name+`.shadowMap`,p.map.depthTexture=new Sa(a.x,a.y,g),p.map.depthTexture.name=d.name+`.shadowMapDepth`,p.map.depthTexture.format=E,p.map.depthTexture.compareFunction=null,p.map.depthTexture.minFilter=i,p.map.depthTexture.magFilter=i}else d.isPointLight?(p.map=new hl(a.x),p.map.depthTexture=new Ca(a.x,h)):(p.map=new en(a.x,a.y),p.map.depthTexture=new Sa(a.x,a.y,h)),p.map.depthTexture.name=d.name+`.shadowMap`,p.map.depthTexture.format=E,this.type===1?(p.map.depthTexture.compareFunction=b?518:515,p.map.depthTexture.minFilter=s,p.map.depthTexture.magFilter=s):(p.map.depthTexture.compareFunction=null,p.map.depthTexture.minFilter=i,p.map.depthTexture.magFilter=i);p.camera.updateProjectionMatrix()}p.map.isWebGLCubeRenderTarget!==!0&&(p.map.width!==a.x||p.map.height!==a.y)&&p.map.setSize(a.x,a.y);let x=p.map.isWebGLCubeRenderTarget?6:p.getViewportCount();d.isPointLight!==!0&&p.updateMatrices(d,l);for(let t=0;t<x;t++){let i=p.getCamera(t);if(d.isPointLight){let e=p.camera,n=p.matrix,r=d.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),Id.setFromMatrixPosition(d.matrixWorld),e.position.copy(Id),Ld.copy(e.position),Ld.add(Nd[t]),e.up.copy(Pd[t]),e.lookAt(Ld),e.updateMatrixWorld(),n.makeTranslation(-Id.x,-Id.y,-Id.z),Fd.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),p._frustum.setFromProjectionMatrix(Fd,e.coordinateSystem,e.reversedDepth)}if(p.map.isWebGLCubeRenderTarget)e.setRenderTarget(p.map,t),e.clear();else{t===0&&(e.setRenderTarget(p.map),e.clear());let n=p.getViewport(t);c.set(o.x*n.x,o.y*n.y,o.x*n.z,o.y*n.w),m.viewport(c)}r=p.getFrustum(t),T(n,l,i,d,this.type)}p.isPointLightShadow!==!0&&this.type===3&&C(p,l),p.needsUpdate=!1}S=this.type,x.needsUpdate=!1,e.setRenderTarget(u,d,p)};function C(n,r){let i=t.update(b);m.defines.VSM_SAMPLES!==n.blurSamples&&(m.defines.VSM_SAMPLES=n.blurSamples,v.defines.VSM_SAMPLES=n.blurSamples,m.needsUpdate=!0,v.needsUpdate=!0),n.mapPass===null?n.mapPass=new en(a.x,a.y,{format:k,type:_}):(n.mapPass.width!==n.map.width||n.mapPass.height!==n.map.height)&&n.mapPass.setSize(n.map.width,n.map.height),m.uniforms.shadow_pass.value=n.map.depthTexture,m.uniforms.resolution.value.set(n.map.width,n.map.height),m.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,i,m,b,null),v.uniforms.shadow_pass.value=n.mapPass.texture,v.uniforms.resolution.value.set(n.map.width,n.map.height),v.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,i,v,b,null)}function w(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?u:l,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=d[e];r===void 0&&(r={},d[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,D)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?p[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function T(n,i,a,o,s){if(n.visible===!1)return;if(n.layers.test(i.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||n.intersectsFrustum(r))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),c=n.material;if(Array.isArray(c)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=w(n,d,o,s);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(c.visible){let t=w(n,c,o,s);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)T(c[e],i,a,o,s)}function D(e){e.target.removeEventListener(`dispose`,D);for(let t in d){let n=d[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function zd(e,t){function n(){let t=!1,n=new Qt,r=null,i=new Qt(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?N(e.DEPTH_TEST):de(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=it[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?N(e.STENCIL_TEST):de(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c=new WeakMap,l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new V(0,0,0),T=0,E=!1,D=null,O=null,ee=null,k=null,te=null,ne=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),A=!1,j=0,re=e.getParameter(e.VERSION);re.indexOf(`WebGL`)===-1?re.indexOf(`OpenGL ES`)!==-1&&(j=parseFloat(/^OpenGL ES (\d)/.exec(re)[1]),A=j>=2):(j=parseFloat(/^WebGL (\d)/.exec(re)[1]),A=j>=1);let M=null,ie={},ae=e.getParameter(e.SCISSOR_BOX),oe=e.getParameter(e.VIEWPORT),se=new Qt().fromArray(ae),ce=new Qt().fromArray(oe);function le(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let ue={};ue[e.TEXTURE_2D]=le(e.TEXTURE_2D,e.TEXTURE_2D,1),ue[e.TEXTURE_CUBE_MAP]=le(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),ue[e.TEXTURE_2D_ARRAY]=le(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),ue[e.TEXTURE_3D]=le(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),N(e.DEPTH_TEST),o.setFunc(3),ye(!1),be(1),N(e.CULL_FACE),_e(0);function N(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function de(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function fe(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function pe(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function me(t){return h!==t&&(e.useProgram(t),h=t,!0)}let he={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};he[103]=e.MIN,he[104]=e.MAX;let ge={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function _e(t,n,r,i,a,o,s,c,l,u){if(t===0)g===!0&&(de(e.BLEND),g=!1);else if(g===!1&&(N(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:L(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:L(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:L(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:L(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}}else a||=n,o||=r,s||=i,(n!==v||a!==x)&&(e.blendEquationSeparate(he[n],he[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(ge[r],ge[i],ge[o],ge[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function ve(t,n){t.side===2?de(e.CULL_FACE):N(e.CULL_FACE);let r=t.side===1;n&&(r=!r),ye(r),t.blending===1&&t.transparent===!1?_e(0):_e(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),Se(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?N(e.SAMPLE_ALPHA_TO_COVERAGE):de(e.SAMPLE_ALPHA_TO_COVERAGE)}function ye(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function be(t){t===0?de(e.CULL_FACE):(N(e.CULL_FACE),t!==O&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),O=t}function xe(t){t!==ee&&(A&&e.lineWidth(t),ee=t)}function Se(t,n,r){t?(N(e.POLYGON_OFFSET_FILL),(k!==n||te!==r)&&(k=n,te=r,o.getReversed()&&(n=-n),e.polygonOffset(n,r))):de(e.POLYGON_OFFSET_FILL)}function Ce(t){t?N(e.SCISSOR_TEST):de(e.SCISSOR_TEST)}function we(t){t===void 0&&(t=e.TEXTURE0+ne-1),M!==t&&(e.activeTexture(t),M=t)}function Te(t,n,r){r===void 0&&(r=M===null?e.TEXTURE0+ne-1:M);let i=ie[r];i===void 0&&(i={type:void 0,texture:void 0},ie[r]=i),(i.type!==t||i.texture!==n)&&(M!==r&&(e.activeTexture(r),M=r),e.bindTexture(t,n||ue[t]),i.type=t,i.texture=n)}function Ee(){let t=ie[M];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function De(){try{e.compressedTexImage2D(...arguments)}catch(e){L(`WebGLState:`,e)}}function Oe(){try{e.compressedTexImage3D(...arguments)}catch(e){L(`WebGLState:`,e)}}function ke(){try{e.texSubImage2D(...arguments)}catch(e){L(`WebGLState:`,e)}}function Ae(){try{e.texSubImage3D(...arguments)}catch(e){L(`WebGLState:`,e)}}function je(){try{e.compressedTexSubImage2D(...arguments)}catch(e){L(`WebGLState:`,e)}}function Me(){try{e.compressedTexSubImage3D(...arguments)}catch(e){L(`WebGLState:`,e)}}function Ne(){try{e.texStorage2D(...arguments)}catch(e){L(`WebGLState:`,e)}}function Pe(){try{e.texStorage3D(...arguments)}catch(e){L(`WebGLState:`,e)}}function P(){try{e.texImage2D(...arguments)}catch(e){L(`WebGLState:`,e)}}function Fe(){try{e.texImage3D(...arguments)}catch(e){L(`WebGLState:`,e)}}function Ie(t){return d[t]===void 0?e.getParameter(t):d[t]}function Le(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function F(t){se.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),se.copy(t))}function Re(t){ce.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),ce.copy(t))}function ze(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function Be(t,n){let r=l.get(n).get(t);c.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),c.set(n,r))}function Ve(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},M=null,ie={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new V(0,0,0),T=0,E=!1,D=null,O=null,ee=null,k=null,te=null,se.set(0,0,e.canvas.width,e.canvas.height),ce.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:N,disable:de,bindFramebuffer:fe,drawBuffers:pe,useProgram:me,setBlending:_e,setMaterial:ve,setFlipSided:ye,setCullFace:be,setLineWidth:xe,setPolygonOffset:Se,setScissorTest:Ce,activeTexture:we,bindTexture:Te,unbindTexture:Ee,compressedTexImage2D:De,compressedTexImage3D:Oe,texImage2D:P,texImage3D:Fe,pixelStorei:Le,getParameter:Ie,updateUBOMapping:ze,uniformBlockBinding:Be,texStorage2D:Ne,texStorage3D:Pe,texSubImage2D:ke,texSubImage3D:Ae,compressedTexSubImage2D:je,compressedTexSubImage3D:Me,scissor:F,viewport:Re,reset:Ve}}function Bd(e,u,d,f,p,m,h){let g=u.has(`WEBGL_multisampled_render_to_texture`)?u.get(`WEBGL_multisampled_render_to_texture`):null,_=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),v=new R,y=new WeakMap,b=new Set,x,S=new WeakMap,C=!1;try{C=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function w(e,t){return C?new OffscreenCanvas(e,t):Ze(`canvas`)}function T(e,t,n){let r=1,i=Ie(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);x===void 0&&(x=w(n,a));let o=t?w(n,a):x;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),I(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&I(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function E(e){return e.generateMipmaps}function O(t){e.generateMipmap(t)}function ee(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function k(t,n,r,i,a,o=!1){if(t!==null){if(e[t]!==void 0)return e[t];I(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+t+`'`)}let s;i&&(s=u.get(`EXT_texture_norm16`),s||I(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let c=n;if(n===e.RED&&(r===e.FLOAT&&(c=e.R32F),r===e.HALF_FLOAT&&(c=e.R16F),r===e.UNSIGNED_BYTE&&(c=e.R8),r===e.UNSIGNED_SHORT&&s&&(c=s.R16_EXT),r===e.SHORT&&s&&(c=s.R16_SNORM_EXT)),n===e.RED_INTEGER&&(r===e.UNSIGNED_BYTE&&(c=e.R8UI),r===e.UNSIGNED_SHORT&&(c=e.R16UI),r===e.UNSIGNED_INT&&(c=e.R32UI),r===e.BYTE&&(c=e.R8I),r===e.SHORT&&(c=e.R16I),r===e.INT&&(c=e.R32I)),n===e.RG&&(r===e.FLOAT&&(c=e.RG32F),r===e.HALF_FLOAT&&(c=e.RG16F),r===e.UNSIGNED_BYTE&&(c=e.RG8),r===e.UNSIGNED_SHORT&&s&&(c=s.RG16_EXT),r===e.SHORT&&s&&(c=s.RG16_SNORM_EXT)),n===e.RG_INTEGER&&(r===e.UNSIGNED_BYTE&&(c=e.RG8UI),r===e.UNSIGNED_SHORT&&(c=e.RG16UI),r===e.UNSIGNED_INT&&(c=e.RG32UI),r===e.BYTE&&(c=e.RG8I),r===e.SHORT&&(c=e.RG16I),r===e.INT&&(c=e.RG32I)),n===e.RGB_INTEGER&&(r===e.UNSIGNED_BYTE&&(c=e.RGB8UI),r===e.UNSIGNED_SHORT&&(c=e.RGB16UI),r===e.UNSIGNED_INT&&(c=e.RGB32UI),r===e.BYTE&&(c=e.RGB8I),r===e.SHORT&&(c=e.RGB16I),r===e.INT&&(c=e.RGB32I)),n===e.RGBA_INTEGER&&(r===e.UNSIGNED_BYTE&&(c=e.RGBA8UI),r===e.UNSIGNED_SHORT&&(c=e.RGBA16UI),r===e.UNSIGNED_INT&&(c=e.RGBA32UI),r===e.BYTE&&(c=e.RGBA8I),r===e.SHORT&&(c=e.RGBA16I),r===e.INT&&(c=e.RGBA32I)),n===e.RGB&&(r===e.UNSIGNED_SHORT&&s&&(c=s.RGB16_EXT),r===e.SHORT&&s&&(c=s.RGB16_SNORM_EXT),r===e.UNSIGNED_INT_5_9_9_9_REV&&(c=e.RGB9_E5),r===e.UNSIGNED_INT_10F_11F_11F_REV&&(c=e.R11F_G11F_B10F)),n===e.RGBA){let t=o?We:Vt.getTransfer(a);r===e.FLOAT&&(c=e.RGBA32F),r===e.HALF_FLOAT&&(c=e.RGBA16F),r===e.UNSIGNED_BYTE&&(c=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),r===e.UNSIGNED_SHORT&&s&&(c=s.RGBA16_EXT),r===e.SHORT&&s&&(c=s.RGBA16_SNORM_EXT),r===e.UNSIGNED_SHORT_4_4_4_4&&(c=e.RGBA4),r===e.UNSIGNED_SHORT_5_5_5_1&&(c=e.RGB5_A1)}return(c===e.R16F||c===e.R32F||c===e.RG16F||c===e.RG32F||c===e.RGBA16F||c===e.RGBA32F)&&u.get(`EXT_color_buffer_float`),c}function te(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,I(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function ne(e,t){return E(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function A(e){let t=e.target;t.removeEventListener(`dispose`,A),re(t),t.isVideoTexture&&y.delete(t),t.isHTMLTexture&&b.delete(t)}function j(e){let t=e.target;t.removeEventListener(`dispose`,j),ie(t)}function re(e){let t=f.get(e);if(t.__webglInit===void 0)return;let n=e.source,r=S.get(n);if(r){let i=r[t.__cacheKey];i.usedTimes--,i.usedTimes===0&&M(e),Object.keys(r).length===0&&S.delete(n)}f.remove(e)}function M(t){let n=f.get(t);e.deleteTexture(n.__webglTexture);let r=t.source,i=S.get(r);delete i[n.__cacheKey],h.memory.textures--}function ie(t){let n=f.get(t);if(t.depthTexture&&(t.depthTexture.dispose(),f.remove(t.depthTexture)),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let r=t.textures;for(let t=0,n=r.length;t<n;t++){let n=f.get(r[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),h.memory.textures--),f.remove(r[t])}f.remove(t)}let ae=0;function oe(){ae=0}function se(){return ae}function ce(e){ae=e}function le(){let e=ae;return e>=p.maxTextures&&I(`WebGLTextures: Trying to use `+(e+1)+` texture units while this GPU supports only `+p.maxTextures),ae+=1,e}function ue(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function N(t,n){let r=f.get(t);if(t.isVideoTexture&&P(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&r.__version!==t.version){let e=t.image;if(e===null)I(`WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)I(`WebGLRenderer: Texture marked for update but image is incomplete`);else{xe(r,t,n);return}}else t.isExternalTexture&&(r.__webglTexture=t.sourceTexture?t.sourceTexture:null);d.bindTexture(e.TEXTURE_2D,r.__webglTexture,e.TEXTURE0+n)}function de(t,n){let r=f.get(t);t.isRenderTargetTexture===!1&&t.version>0&&r.__version!==t.version?xe(r,t,n):(t.isExternalTexture&&(r.__webglTexture=t.sourceTexture?t.sourceTexture:null),d.bindTexture(e.TEXTURE_2D_ARRAY,r.__webglTexture,e.TEXTURE0+n))}function fe(t,n){let r=f.get(t);t.isRenderTargetTexture===!1&&t.version>0&&r.__version!==t.version?xe(r,t,n):d.bindTexture(e.TEXTURE_3D,r.__webglTexture,e.TEXTURE0+n)}function pe(t,n){let r=f.get(t);t.isCubeDepthTexture!==!0&&t.version>0&&r.__version!==t.version?Se(r,t,n):d.bindTexture(e.TEXTURE_CUBE_MAP,r.__webglTexture,e.TEXTURE0+n)}let me={[t]:e.REPEAT,[n]:e.CLAMP_TO_EDGE,[r]:e.MIRRORED_REPEAT},he={[i]:e.NEAREST,[a]:e.NEAREST_MIPMAP_NEAREST,[o]:e.NEAREST_MIPMAP_LINEAR,[s]:e.LINEAR,[c]:e.LINEAR_MIPMAP_NEAREST,[l]:e.LINEAR_MIPMAP_LINEAR},ge={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function _e(t,n){if(n.type===1015&&u.has(`OES_texture_float_linear`)===!1&&(n.magFilter===1006||n.magFilter===1007||n.magFilter===1005||n.magFilter===1008||n.minFilter===1006||n.minFilter===1007||n.minFilter===1005||n.minFilter===1008)&&I(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(t,e.TEXTURE_WRAP_S,me[n.wrapS]),e.texParameteri(t,e.TEXTURE_WRAP_T,me[n.wrapT]),(t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY)&&e.texParameteri(t,e.TEXTURE_WRAP_R,me[n.wrapR]),e.texParameteri(t,e.TEXTURE_MAG_FILTER,he[n.magFilter]),e.texParameteri(t,e.TEXTURE_MIN_FILTER,he[n.minFilter]),n.compareFunction&&(e.texParameteri(t,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(t,e.TEXTURE_COMPARE_FUNC,ge[n.compareFunction])),u.has(`EXT_texture_filter_anisotropic`)===!0){if(n.magFilter===1003||n.minFilter!==1005&&n.minFilter!==1008||n.type===1015&&u.has(`OES_texture_float_linear`)===!1)return;if(n.anisotropy>1||f.get(n).__currentAnisotropy){let r=u.get(`EXT_texture_filter_anisotropic`);e.texParameterf(t,r.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(n.anisotropy,p.getMaxAnisotropy())),f.get(n).__currentAnisotropy=n.anisotropy}}}function ve(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,A));let i=n.source,a=S.get(i);a===void 0&&(a={},S.set(i,a));let o=ue(n);if(o!==t.__cacheKey){a[o]===void 0&&(a[o]={texture:e.createTexture(),usedTimes:0},h.memory.textures++,r=!0),a[o].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&M(n)),t.__cacheKey=o,t.__webglTexture=a[o].texture}return r}function ye(e,t,n){return Math.floor(Math.floor(e/n)/t)}function be(t,n,r,i){let a=t.updateRanges;if(a.length===0)d.texSubImage2D(e.TEXTURE_2D,0,0,0,n.width,n.height,r,i,n.data);else{a.sort((e,t)=>e.start-t.start);let o=0;for(let e=1;e<a.length;e++){let t=a[o],r=a[e],i=t.start+t.count,s=ye(r.start,n.width,4),c=ye(t.start,n.width,4);r.start<=i+1&&s===c&&ye(r.start+r.count-1,n.width,4)===s?t.count=Math.max(t.count,r.start+r.count-t.start):(++o,a[o]=r)}a.length=o+1;let s=d.getParameter(e.UNPACK_ROW_LENGTH),c=d.getParameter(e.UNPACK_SKIP_PIXELS),l=d.getParameter(e.UNPACK_SKIP_ROWS);d.pixelStorei(e.UNPACK_ROW_LENGTH,n.width);for(let t=0,o=a.length;t<o;t++){let o=a[t],s=Math.floor(o.start/4),c=Math.ceil(o.count/4),l=s%n.width,u=Math.floor(s/n.width),f=c;d.pixelStorei(e.UNPACK_SKIP_PIXELS,l),d.pixelStorei(e.UNPACK_SKIP_ROWS,u),d.texSubImage2D(e.TEXTURE_2D,0,l,u,f,1,r,i,n.data)}t.clearUpdateRanges(),d.pixelStorei(e.UNPACK_ROW_LENGTH,s),d.pixelStorei(e.UNPACK_SKIP_PIXELS,c),d.pixelStorei(e.UNPACK_SKIP_ROWS,l)}}function xe(t,n,r){let i=e.TEXTURE_2D;(n.isDataArrayTexture||n.isCompressedArrayTexture)&&(i=e.TEXTURE_2D_ARRAY),n.isData3DTexture&&(i=e.TEXTURE_3D);let a=ve(t,n),o=n.source;d.bindTexture(i,t.__webglTexture,e.TEXTURE0+r);let s=f.get(o);if(o.version!==s.__version||a===!0){if(d.activeTexture(e.TEXTURE0+r),!(typeof ImageBitmap<`u`&&n.image instanceof ImageBitmap)){let t=Vt.getPrimaries(Vt.workingColorSpace),r=n.colorSpace===``?null:Vt.getPrimaries(n.colorSpace),i=n.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;d.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,n.flipY),d.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,n.premultiplyAlpha),d.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,i)}d.pixelStorei(e.UNPACK_ALIGNMENT,n.unpackAlignment);let t=T(n.image,!1,p.maxTextureSize);t=Fe(n,t);let c=m.convert(n.format,n.colorSpace),l=m.convert(n.type),u=k(n.internalFormat,c,l,n.normalized,n.colorSpace,n.isVideoTexture);_e(i,n);let f,h=n.mipmaps,g=n.isVideoTexture!==!0,_=s.__version===void 0||a===!0,v=o.dataReady,y=ne(n,t);if(n.isDepthTexture)u=te(n.format===D,n.type),_&&(g?d.texStorage2D(e.TEXTURE_2D,1,u,t.width,t.height):d.texImage2D(e.TEXTURE_2D,0,u,t.width,t.height,0,c,l,null));else if(n.isDataTexture){if(h.length>0){g&&_&&d.texStorage2D(e.TEXTURE_2D,y,u,h[0].width,h[0].height);for(let t=0,n=h.length;t<n;t++)f=h[t],g?v&&d.texSubImage2D(e.TEXTURE_2D,t,0,0,f.width,f.height,c,l,f.data):d.texImage2D(e.TEXTURE_2D,t,u,f.width,f.height,0,c,l,f.data);n.generateMipmaps=!1}else g?(_&&d.texStorage2D(e.TEXTURE_2D,y,u,t.width,t.height),v&&be(n,t,c,l)):d.texImage2D(e.TEXTURE_2D,0,u,t.width,t.height,0,c,l,t.data)}else if(n.isCompressedTexture){if(n.isCompressedArrayTexture){g&&_&&d.texStorage3D(e.TEXTURE_2D_ARRAY,y,u,h[0].width,h[0].height,t.depth);for(let r=0,i=h.length;r<i;r++)if(f=h[r],n.format!==1023){if(c!==null){if(g){if(v){if(n.layerUpdates.size>0){let t=Pc(f.width,f.height,n.format,n.type);for(let i of n.layerUpdates){let n=f.data.subarray(i*t/f.data.BYTES_PER_ELEMENT,(i+1)*t/f.data.BYTES_PER_ELEMENT);d.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,r,0,0,i,f.width,f.height,1,c,n)}}else d.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,r,0,0,0,f.width,f.height,t.depth,c,f.data)}}else d.compressedTexImage3D(e.TEXTURE_2D_ARRAY,r,u,f.width,f.height,t.depth,0,f.data,0,0)}else I(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else g?v&&d.texSubImage3D(e.TEXTURE_2D_ARRAY,r,0,0,0,f.width,f.height,t.depth,c,l,f.data):d.texImage3D(e.TEXTURE_2D_ARRAY,r,u,f.width,f.height,t.depth,0,c,l,f.data);n.layerUpdates.size>0&&n.clearLayerUpdates()}else{g&&_&&d.texStorage2D(e.TEXTURE_2D,y,u,h[0].width,h[0].height);for(let t=0,r=h.length;t<r;t++)f=h[t],n.format===1023?g?v&&d.texSubImage2D(e.TEXTURE_2D,t,0,0,f.width,f.height,c,l,f.data):d.texImage2D(e.TEXTURE_2D,t,u,f.width,f.height,0,c,l,f.data):c===null?I(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):g?v&&d.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,f.width,f.height,c,f.data):d.compressedTexImage2D(e.TEXTURE_2D,t,u,f.width,f.height,0,f.data)}}else if(n.isDataArrayTexture){if(g){if(_&&d.texStorage3D(e.TEXTURE_2D_ARRAY,y,u,t.width,t.height,t.depth),v){if(n.layerUpdates.size>0){let r=Pc(t.width,t.height,n.format,n.type);for(let i of n.layerUpdates){let n=t.data.subarray(i*r/t.data.BYTES_PER_ELEMENT,(i+1)*r/t.data.BYTES_PER_ELEMENT);d.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,i,t.width,t.height,1,c,l,n)}n.clearLayerUpdates()}else d.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,t.width,t.height,t.depth,c,l,t.data)}}else d.texImage3D(e.TEXTURE_2D_ARRAY,0,u,t.width,t.height,t.depth,0,c,l,t.data)}else if(n.isData3DTexture)g?(_&&d.texStorage3D(e.TEXTURE_3D,y,u,t.width,t.height,t.depth),v&&d.texSubImage3D(e.TEXTURE_3D,0,0,0,0,t.width,t.height,t.depth,c,l,t.data)):d.texImage3D(e.TEXTURE_3D,0,u,t.width,t.height,t.depth,0,c,l,t.data);else if(n.isFramebufferTexture){if(_){if(g)d.texStorage2D(e.TEXTURE_2D,y,u,t.width,t.height);else{let n=t.width,r=t.height;for(let t=0;t<y;t++)d.texImage2D(e.TEXTURE_2D,t,u,n,r,0,c,l,null),n>>=1,r>>=1}}}else if(n.isHTMLTexture){if(`texElementImage2D`in e){let r=e.canvas;if(r.hasAttribute(`layoutsubtree`)||r.setAttribute(`layoutsubtree`,`true`),t.parentNode!==r){r.appendChild(t),b.add(n),r.onpaint=e=>{let t=e.changedElements;for(let e of b)t.includes(e.image)&&(e.needsUpdate=!0)},r.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,t);else{let n=e.RGBA,r=e.RGBA,i=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,n,r,i,t)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(h.length>0){if(g&&_){let t=Ie(h[0]);d.texStorage2D(e.TEXTURE_2D,y,u,t.width,t.height)}for(let t=0,n=h.length;t<n;t++)f=h[t],g?v&&d.texSubImage2D(e.TEXTURE_2D,t,0,0,c,l,f):d.texImage2D(e.TEXTURE_2D,t,u,c,l,f);n.generateMipmaps=!1}else if(g){if(_){let n=Ie(t);d.texStorage2D(e.TEXTURE_2D,y,u,n.width,n.height)}v&&d.texSubImage2D(e.TEXTURE_2D,0,0,0,c,l,t)}else d.texImage2D(e.TEXTURE_2D,0,u,c,l,t);E(n)&&O(i),s.__version=o.version,n.onUpdate&&n.onUpdate(n)}t.__version=n.version}function Se(t,n,r){if(n.image.length!==6)return;let i=ve(t,n),a=n.source;d.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+r);let o=f.get(a);if(a.version!==o.__version||i===!0){d.activeTexture(e.TEXTURE0+r);let t=Vt.getPrimaries(Vt.workingColorSpace),s=n.colorSpace===``?null:Vt.getPrimaries(n.colorSpace),c=n.colorSpace===``||t===s?e.NONE:e.BROWSER_DEFAULT_WEBGL;d.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,n.flipY),d.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,n.premultiplyAlpha),d.pixelStorei(e.UNPACK_ALIGNMENT,n.unpackAlignment),d.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,c);let l=n.isCompressedTexture||n.image[0].isCompressedTexture,u=n.image[0]&&n.image[0].isDataTexture,f=[];for(let e=0;e<6;e++)!l&&!u?f[e]=T(n.image[e],!0,p.maxCubemapSize):f[e]=u?n.image[e].image:n.image[e],f[e]=Fe(n,f[e]);let h=f[0],g=m.convert(n.format,n.colorSpace),_=m.convert(n.type),v=k(n.internalFormat,g,_,n.normalized,n.colorSpace),y=n.isVideoTexture!==!0,b=o.__version===void 0||i===!0,x=a.dataReady,S=ne(n,h);_e(e.TEXTURE_CUBE_MAP,n);let C;if(l){y&&b&&d.texStorage2D(e.TEXTURE_CUBE_MAP,S,v,h.width,h.height);for(let t=0;t<6;t++){C=f[t].mipmaps;for(let r=0;r<C.length;r++){let i=C[r];n.format===1023?y?x&&d.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,g,_,i.data):d.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,v,i.width,i.height,0,g,_,i.data):g===null?I(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):y?x&&d.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,g,i.data):d.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,v,i.width,i.height,0,i.data)}}}else{if(C=n.mipmaps,y&&b){C.length>0&&S++;let t=Ie(f[0]);d.texStorage2D(e.TEXTURE_CUBE_MAP,S,v,t.width,t.height)}for(let t=0;t<6;t++)if(u){y?x&&d.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,f[t].width,f[t].height,g,_,f[t].data):d.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,v,f[t].width,f[t].height,0,g,_,f[t].data);for(let n=0;n<C.length;n++){let r=C[n].image[t].image;y?x&&d.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,n+1,0,0,r.width,r.height,g,_,r.data):d.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,n+1,v,r.width,r.height,0,g,_,r.data)}}else{y?x&&d.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,g,_,f[t]):d.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,v,g,_,f[t]);for(let n=0;n<C.length;n++){let r=C[n];y?x&&d.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,n+1,0,0,g,_,r.image[t]):d.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,n+1,v,g,_,r.image[t])}}}E(n)&&O(e.TEXTURE_CUBE_MAP),o.__version=a.version,n.onUpdate&&n.onUpdate(n)}t.__version=n.version}function Ce(t,n,r,i,a,o){let s=m.convert(r.format,r.colorSpace),c=m.convert(r.type),l=k(r.internalFormat,s,c,r.normalized,r.colorSpace),u=f.get(n),p=f.get(r);if(p.__renderTarget=n,!u.__hasExternalTextures){let t=Math.max(1,n.width>>o),r=Math.max(1,n.height>>o);a===e.TEXTURE_3D||a===e.TEXTURE_2D_ARRAY?d.texImage3D(a,o,l,t,r,n.depth,0,s,c,null):d.texImage2D(a,o,l,t,r,0,s,c,null)}d.bindFramebuffer(e.FRAMEBUFFER,t),Pe(n)?g.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,i,a,p.__webglTexture,0,Ne(n)):(a===e.TEXTURE_2D||a>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&a<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,i,a,p.__webglTexture,o),d.bindFramebuffer(e.FRAMEBUFFER,null)}function we(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=te(n.stencilBuffer,a),s=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;Pe(n)?g.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Ne(n),o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,Ne(n),o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,s,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let a=t[i],o=m.convert(a.format,a.colorSpace),s=m.convert(a.type),c=k(a.internalFormat,o,s,a.normalized,a.colorSpace);Pe(n)?g.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Ne(n),c,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,Ne(n),c,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,c,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function Te(t,n,r){let i=n.isWebGLCubeRenderTarget===!0;if(d.bindFramebuffer(e.FRAMEBUFFER,t),!(n.depthTexture&&n.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let a=f.get(n.depthTexture);if(a.__renderTarget=n,(!a.__webglTexture||n.depthTexture.image.width!==n.width||n.depthTexture.image.height!==n.height)&&(n.depthTexture.image.width=n.width,n.depthTexture.image.height=n.height,n.depthTexture.needsUpdate=!0),i){if(a.__webglInit===void 0&&(a.__webglInit=!0,n.depthTexture.addEventListener(`dispose`,A)),a.__webglTexture===void 0){a.__webglTexture=e.createTexture(),d.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture),_e(e.TEXTURE_CUBE_MAP,n.depthTexture);let t=m.convert(n.depthTexture.format),r=m.convert(n.depthTexture.type),i;n.depthTexture.format===1026?i=e.DEPTH_COMPONENT24:n.depthTexture.format===1027&&(i=e.DEPTH24_STENCIL8);for(let a=0;a<6;a++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+a,0,i,n.width,n.height,0,t,r,null)}}else N(n.depthTexture,0);let o=a.__webglTexture,s=Ne(n),c=i?e.TEXTURE_CUBE_MAP_POSITIVE_X+r:e.TEXTURE_2D,l=n.depthTexture.format===1027?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(n.depthTexture.format===1026)Pe(n)?g.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,l,c,o,0,s):e.framebufferTexture2D(e.FRAMEBUFFER,l,c,o,0);else if(n.depthTexture.format===1027)Pe(n)?g.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,l,c,o,0,s):e.framebufferTexture2D(e.FRAMEBUFFER,l,c,o,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function Ee(t){let n=f.get(t),r=t.isWebGLCubeRenderTarget===!0;if(n.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(n.__depthDisposeCallback&&n.__depthDisposeCallback(),e){let t=()=>{delete n.__boundDepthTexture,delete n.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),n.__depthDisposeCallback=t}n.__boundDepthTexture=e}if(t.depthTexture&&!n.__autoAllocateDepthBuffer){if(r)for(let e=0;e<6;e++)Te(n.__webglFramebuffer[e],t,e);else{let e=t.texture.mipmaps;e&&e.length>0?Te(n.__webglFramebuffer[0],t,0):Te(n.__webglFramebuffer,t,0)}}else if(r){n.__webglDepthbuffer=[];for(let r=0;r<6;r++)if(d.bindFramebuffer(e.FRAMEBUFFER,n.__webglFramebuffer[r]),n.__webglDepthbuffer[r]===void 0)n.__webglDepthbuffer[r]=e.createRenderbuffer(),we(n.__webglDepthbuffer[r],t,!1);else{let i=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=n.__webglDepthbuffer[r];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,i,e.RENDERBUFFER,a)}}else{let r=t.texture.mipmaps;if(r&&r.length>0?d.bindFramebuffer(e.FRAMEBUFFER,n.__webglFramebuffer[0]):d.bindFramebuffer(e.FRAMEBUFFER,n.__webglFramebuffer),n.__webglDepthbuffer===void 0)n.__webglDepthbuffer=e.createRenderbuffer(),we(n.__webglDepthbuffer,t,!1);else{let r=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,i=n.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,i),e.framebufferRenderbuffer(e.FRAMEBUFFER,r,e.RENDERBUFFER,i)}}d.bindFramebuffer(e.FRAMEBUFFER,null)}function De(t,n,r){let i=f.get(t);n!==void 0&&Ce(i.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),r!==void 0&&Ee(t)}function Oe(t){let n=t.texture,r=f.get(t),i=f.get(n);t.addEventListener(`dispose`,j);let a=t.textures,o=t.isWebGLCubeRenderTarget===!0,s=a.length>1;if(s||(i.__webglTexture===void 0&&(i.__webglTexture=e.createTexture()),i.__version=n.version,h.memory.textures++),o){r.__webglFramebuffer=[];for(let t=0;t<6;t++)if(n.mipmaps&&n.mipmaps.length>0){r.__webglFramebuffer[t]=[];for(let i=0;i<n.mipmaps.length;i++)r.__webglFramebuffer[t][i]=e.createFramebuffer()}else r.__webglFramebuffer[t]=e.createFramebuffer()}else{if(n.mipmaps&&n.mipmaps.length>0){r.__webglFramebuffer=[];for(let t=0;t<n.mipmaps.length;t++)r.__webglFramebuffer[t]=e.createFramebuffer()}else r.__webglFramebuffer=e.createFramebuffer();if(s)for(let t=0,n=a.length;t<n;t++){let n=f.get(a[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),h.memory.textures++)}if(t.samples>0&&Pe(t)===!1){r.__webglMultisampledFramebuffer=e.createFramebuffer(),r.__webglColorRenderbuffer=[],d.bindFramebuffer(e.FRAMEBUFFER,r.__webglMultisampledFramebuffer);for(let n=0;n<a.length;n++){let i=a[n];r.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,r.__webglColorRenderbuffer[n]);let o=m.convert(i.format,i.colorSpace),s=m.convert(i.type),c=k(i.internalFormat,o,s,i.normalized,i.colorSpace,t.isXRRenderTarget===!0),l=Ne(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,l,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,r.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(r.__webglDepthRenderbuffer=e.createRenderbuffer(),we(r.__webglDepthRenderbuffer,t,!0)),d.bindFramebuffer(e.FRAMEBUFFER,null)}}if(o){d.bindTexture(e.TEXTURE_CUBE_MAP,i.__webglTexture),_e(e.TEXTURE_CUBE_MAP,n);for(let i=0;i<6;i++)if(n.mipmaps&&n.mipmaps.length>0)for(let a=0;a<n.mipmaps.length;a++)Ce(r.__webglFramebuffer[i][a],t,n,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+i,a);else Ce(r.__webglFramebuffer[i],t,n,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+i,0);E(n)&&O(e.TEXTURE_CUBE_MAP),d.unbindTexture()}else if(s){for(let n=0,i=a.length;n<i;n++){let i=a[n],o=f.get(i),s=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(s=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),d.bindTexture(s,o.__webglTexture),_e(s,i),Ce(r.__webglFramebuffer,t,i,e.COLOR_ATTACHMENT0+n,s,0),E(i)&&O(s)}d.unbindTexture()}else{let a=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(a=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),d.bindTexture(a,i.__webglTexture),_e(a,n),n.mipmaps&&n.mipmaps.length>0)for(let i=0;i<n.mipmaps.length;i++)Ce(r.__webglFramebuffer[i],t,n,e.COLOR_ATTACHMENT0,a,i);else Ce(r.__webglFramebuffer,t,n,e.COLOR_ATTACHMENT0,a,0);E(n)&&O(a),d.unbindTexture()}t.depthBuffer&&Ee(t)}function ke(e){let t=e.textures;for(let n=0,r=t.length;n<r;n++){let r=t[n];if(E(r)){let t=ee(e),n=f.get(r).__webglTexture;d.bindTexture(t,n),O(t),d.unbindTexture()}}}let Ae=[],je=[];function Me(t){if(t.samples>0){if(Pe(t)===!1){let n=t.textures,r=t.width,i=t.height,a=e.COLOR_BUFFER_BIT,o=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,s=f.get(t),c=n.length>1;if(c)for(let t=0;t<n.length;t++)d.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),d.bindFramebuffer(e.FRAMEBUFFER,s.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);d.bindFramebuffer(e.READ_FRAMEBUFFER,s.__webglMultisampledFramebuffer);let l=t.texture.mipmaps;l&&l.length>0?d.bindFramebuffer(e.DRAW_FRAMEBUFFER,s.__webglFramebuffer[0]):d.bindFramebuffer(e.DRAW_FRAMEBUFFER,s.__webglFramebuffer);for(let l=0;l<n.length;l++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(a|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(a|=e.STENCIL_BUFFER_BIT)),c){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,s.__webglColorRenderbuffer[l]);let t=f.get(n[l]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,r,i,0,0,r,i,a,e.NEAREST),_===!0&&(Ae.length=0,je.length=0,Ae.push(e.COLOR_ATTACHMENT0+l),t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&(Ae.push(o),je.push(o),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,je)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,Ae))}if(d.bindFramebuffer(e.READ_FRAMEBUFFER,null),d.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),c)for(let t=0;t<n.length;t++){d.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,s.__webglColorRenderbuffer[t]);let r=f.get(n[t]).__webglTexture;d.bindFramebuffer(e.FRAMEBUFFER,s.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,r,0)}d.bindFramebuffer(e.DRAW_FRAMEBUFFER,s.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&_){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function Ne(e){return Math.min(p.maxSamples,e.samples)}function Pe(e){let t=f.get(e);return e.samples>0&&u.has(`WEBGL_multisampled_render_to_texture`)===!0&&t.__useRenderToTexture!==!1}function P(e){let t=h.render.frame;y.get(e)!==t&&(y.set(e,t),e.update())}function Fe(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(Vt.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&I(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):L(`WebGLTextures: Unsupported texture color space:`,n)),t}function Ie(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(v.width=e.naturalWidth||e.width,v.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(v.width=e.displayWidth,v.height=e.displayHeight):(v.width=e.width,v.height=e.height),v}this.allocateTextureUnit=le,this.resetTextureUnits=oe,this.getTextureUnits=se,this.setTextureUnits=ce,this.setTexture2D=N,this.setTexture2DArray=de,this.setTexture3D=fe,this.setTextureCube=pe,this.rebindTextures=De,this.setupRenderTarget=Oe,this.updateRenderTargetMipmap=ke,this.updateMultisampleRenderTarget=Me,this.setupDepthRenderbuffer=Ee,this.setupFrameBufferTexture=Ce,this.useMultisampledRTT=Pe,this.isReversedDepthBuffer=function(){return d.buffers.depth.getReversed()}}function Vd(e,t){function n(n,r=``){let i,a=Vt.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var Hd=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Ud=`
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

}`,Wd=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new wa(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new as({vertexShader:Hd,fragmentShader:Ud,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new H(new Jo(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Gd=class extends at{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,l=null,d=null,f=null,p=null,m=null,g=typeof XRWebGLBinding<`u`,_=new Wd,v={},y=t.getContextAttributes(),x=null,S=null,C=[],w=[],O=new R,ee=null,k=null,te=new ac;te.viewport=new Qt;let ne=new ac;ne.viewport=new Qt;let A=[te,ne],j=new yc,re=null,M=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=C[e];return t===void 0&&(t=new Nn,C[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=C[e];return t===void 0&&(t=new Nn,C[e]=t),t.getGripSpace()},this.getHand=function(e){let t=C[e];return t===void 0&&(t=new Nn,C[e]=t),t.getHandSpace()};function ie(e){let t=w.indexOf(e.inputSource);if(t===-1)return;let n=C[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function ae(){r.removeEventListener(`select`,ie),r.removeEventListener(`selectstart`,ie),r.removeEventListener(`selectend`,ie),r.removeEventListener(`squeeze`,ie),r.removeEventListener(`squeezestart`,ie),r.removeEventListener(`squeezeend`,ie),r.removeEventListener(`end`,ae),r.removeEventListener(`inputsourceschange`,oe);for(let e=0;e<C.length;e++){let t=w[e];t!==null&&(w[e]=null,C[e].disconnect(t))}re=null,M=null,_.reset();for(let e in v)delete v[e];if(e.setRenderTarget(x),p=null,f=null,d=null,r=null,S=null,pe.stop(),n.isPresenting=!1,e.setPixelRatio(ee),e.setSize(O.width,O.height,!1),k!==null){let e=k.camera;e.fov=k.fov,e.zoom=k.zoom,e.updateProjectionMatrix(),k=null}n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&I(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&I(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return f===null?p:f},this.getBinding=function(){return d===null&&g&&(d=new XRWebGLBinding(r,t)),d},this.getFrame=function(){return m},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(x=e.getRenderTarget(),r.addEventListener(`select`,ie),r.addEventListener(`selectstart`,ie),r.addEventListener(`selectend`,ie),r.addEventListener(`squeeze`,ie),r.addEventListener(`squeezestart`,ie),r.addEventListener(`squeezeend`,ie),r.addEventListener(`end`,ae),r.addEventListener(`inputsourceschange`,oe),y.xrCompatible!==!0&&await t.makeXRCompatible(),ee=e.getPixelRatio(),e.getSize(O),g&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;y.depth&&(o=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=y.stencil?D:E,a=y.stencil?b:h);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};d=this.getBinding(),f=d.createProjectionLayer(s),r.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),S=new en(f.textureWidth,f.textureHeight,{format:T,type:u,depthTexture:new Sa(f.textureWidth,f.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}else{let n={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:i};p=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),S=new en(p.framebufferWidth,p.framebufferHeight,{format:T,type:u,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1,storeMultisampledDepthBuffer:p.ignoreDepthValues===!1,storeMultisampledStencilBuffer:p.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),pe.setContext(r),pe.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function oe(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=w.indexOf(n);r>=0&&(w[r]=null,C[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=w.indexOf(n);if(r===-1){for(let e=0;e<C.length;e++)if(e>=w.length){w.push(n),r=e;break}else if(w[e]===null){w[e]=n,r=e;break}if(r===-1)break}let i=C[r];i&&i.connect(n)}}let se=new z,ce=new z;function le(e,t,n){se.setFromMatrixPosition(t.matrixWorld),ce.setFromMatrixPosition(n.matrixWorld);let r=se.distanceTo(ce),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function ue(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;_.texture!==null&&(_.depthNear>0&&(t=_.depthNear),_.depthFar>0&&(n=_.depthFar)),j.near=ne.near=te.near=t,j.far=ne.far=te.far=n,(re!==j.near||M!==j.far)&&(r.updateRenderState({depthNear:j.near,depthFar:j.far}),re=j.near,M=j.far),j.layers.mask=e.layers.mask|6,te.layers.mask=j.layers.mask&-5,ne.layers.mask=j.layers.mask&-3;let i=e.parent,a=j.cameras;ue(j,i);for(let e=0;e<a.length;e++)ue(a[e],i);a.length===2?le(j,te,ne):j.projectionMatrix.copy(te.projectionMatrix),k===null&&e.isPerspectiveCamera&&(k={camera:e,fov:e.fov,zoom:e.zoom}),N(e,j,i)};function N(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=lt*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return j},this.getFoveation=function(){if(f!==null||p!==null)return s},this.setFoveation=function(e){s=e,f!==null&&(f.fixedFoveation=e),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=e)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(j)},this.getCameraTexture=function(e){return v[e]};let de=null;function fe(t,i){if(l=i.getViewerPose(c||a),m=i,l!==null){let t=l.views;p!==null&&(e.setRenderTargetFramebuffer(S,p.framebuffer),e.setRenderTarget(S));let i=!1;t.length!==j.cameras.length&&(j.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(p!==null)a=p.getViewport(r);else{let t=d.getViewSubImage(f,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(S,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(S))}let o=A[n];o===void 0&&(o=new ac,o.layers.enable(n),o.viewport=new Qt,A[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(j.matrix.copy(o.matrix),j.matrix.decompose(j.position,j.quaternion,j.scale)),i===!0&&j.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&g){d=n.getBinding();let e=d.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&_.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&g){e.state.unbindTexture(),d=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=v[n];e||(e=new wa,v[n]=e);let t=d.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<C.length;e++){let t=w[e],n=C[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}de&&de(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),m=null}let pe=new Ic;pe.setAnimationLoop(fe),this.setAnimationLoop=function(e){de=e},this.dispose=function(){}}},Kd=new B,qd=new It;qd.set(-1,0,0,0,1,0,0,0,1);function Jd(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,ts(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(Kd.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(qd),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.retroreflectivity>0&&(e.retroreflectivity.value=t.retroreflectivity),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function Yd(e,t,n,r){let i={},a={},o=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(g(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,v));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return L(`WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)p(t[n],e,n,a);else p(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(t,n,r,i){if(h(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=_(i);m(i,t.__data,e),typeof i!=`number`&&typeof i!=`boolean`&&!i.isMatrix3&&!ArrayBuffer.isView(i)&&(e+=a.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function m(e,t,n){typeof e==`number`||typeof e==`boolean`?t[0]=e:e.isMatrix3?(t[0]=e.elements[0],t[1]=e.elements[1],t[2]=e.elements[2],t[3]=0,t[4]=e.elements[3],t[5]=e.elements[4],t[6]=e.elements[5],t[7]=0,t[8]=e.elements[6],t[9]=e.elements[7],t[10]=e.elements[8],t[11]=0):ArrayBuffer.isView(e)?t.set(new e.constructor(e.buffer,e.byteOffset,t.length)):e.toArray(t,n)}function h(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return r[a]=typeof i==`number`||typeof i==`boolean`?i:ArrayBuffer.isView(i)?i.slice():i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(ArrayBuffer.isView(i))return!0;else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function g(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=_(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function _(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?I(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(t.boundary=16,t.storage=e.byteLength):I(`WebGLRenderer: Unsupported uniform value type.`,e),t}function v(t){let n=t.target;n.removeEventListener(`dispose`,v);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function y(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:y}}var Xd=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Zd=null;function Qd(){return Zd===null&&(Zd=new Ii(Xd,16,16,k,_),Zd.name=`DFG_LUT`,Zd.minFilter=s,Zd.magFilter=s,Zd.wrapS=n,Zd.wrapT=n,Zd.generateMipmaps=!1,Zd.needsUpdate=!0),Zd}var $d=class{constructor(e={}){let{canvas:t=Qe(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:c=!1,powerPreference:d=`default`,failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:m=!1,outputBufferType:g=u}=e;this.isWebGLRenderer=!0;let x;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);x=n.getContextAttributes().alpha}else x=a;let S=g,C=new Set([ne,te,ee]),w=new Set([u,h,p,b,v,y]),T=new Uint32Array(4),E=new Int32Array(4),D=new z,O=null,k=null,A=[],j=[],re=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let M=this,ie=!1,ae=null,oe=null,se=null,ce=null;this._outputColorSpace=He;let le=0,ue=0,N=null,de=-1,fe=null,pe=new Qt,me=new Qt,he=null,ge=new V(0),_e=0,ve=t.width,ye=t.height,be=1,xe=null,Se=null,Ce=new Qt(0,0,ve,ye),we=new Qt(0,0,ve,ye),Te=!1,Ee=new Qi,De=!1,Oe=!1,ke=new B,Ae=new z,je=new Qt,Me={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Ne=!1;function Pe(){return N===null?be:1}let P=n;function Fe(e,n){return t.getContext(e,n)}let Ie,Le,F,Re,ze,Be,Ve,Ue,We,Ge,Ke,qe,Ye,Xe,Ze,$e,tt,nt,it,at,ot,st,ct;try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:c,powerPreference:d,failIfMajorPerformanceCaveat:f};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r186`),t.addEventListener(`webglcontextlost`,dt,!1),t.addEventListener(`webglcontextrestored`,ft,!1),t.addEventListener(`webglcontextcreationerror`,pt,!1),P===null){let t=`webgl2`;if(P=Fe(t,e),P===null)throw Fe(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}lt()}catch(e){throw t.removeEventListener(`webglcontextlost`,dt,!1),t.removeEventListener(`webglcontextrestored`,ft,!1),t.removeEventListener(`webglcontextcreationerror`,pt,!1),L(`WebGLRenderer: `+e.message),e}function lt(){Ie=new _l(P),Ie.init(),ot=new Vd(P,Ie),Le=new Kc(P,Ie,e,ot),F=new zd(P,Ie),Le.reversedDepthBuffer&&m&&F.buffers.depth.setReversed(!0),oe=P.createFramebuffer(),se=P.createFramebuffer(),ce=P.createFramebuffer(),Re=new bl(P),ze=new yd,Be=new Bd(P,Ie,F,ze,Le,ot,Re),Ve=new gl(M),Ue=new Lc(P),st=new Wc(P,Ue),We=new vl(P,Ue,Re,st),Ge=new Sl(P,We,Ue,st,Re),nt=new xl(P,Le,Be),Ze=new qc(ze),Ke=new vd(M,Ve,Ie,Le,st,Ze),qe=new Jd(M,ze),Ye=new Cd,Xe=new Ad(Ie),tt=new Uc(M,Ve,F,Ge,x,s),$e=new Rd(M,Ge,Le),ct=new Yd(P,Re,Le,F),it=new Gc(P,Ie,Re),at=new yl(P,Ie,Re),Re.programs=Ke.programs,M.capabilities=Le,M.extensions=Ie,M.properties=ze,M.renderLists=Ye,M.shadowMap=$e,M.state=F,M.info=Re}S!==1009&&(re=new wl(S,t.width,t.height,o,r,i));let ut=new Gd(M,P);this.xr=ut,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){let e=Ie.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=Ie.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return be},this.setPixelRatio=function(e){e!==void 0&&(be=e,this.setSize(ve,ye,!1))},this.getSize=function(e){return e.set(ve,ye)},this.setSize=function(e,n,r=!0){ut.isPresenting?I(`WebGLRenderer: Can't change size while VR device is presenting.`):(ve=e,ye=n,t.width=Math.floor(e*be),t.height=Math.floor(n*be),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),re!==null&&re.setSize(t.width,t.height),this.setViewport(0,0,e,n))},this.getDrawingBufferSize=function(e){return e.set(ve*be,ye*be).floor()},this.setDrawingBufferSize=function(e,n,r){ve=e,ye=n,be=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(S===1009)L(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);else{if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){I(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}re.setEffects(e||[])}},this.getCurrentViewport=function(e){return e.copy(pe)},this.getViewport=function(e){return e.copy(Ce)},this.setViewport=function(e,t,n,r){e.isVector4?Ce.set(e.x,e.y,e.z,e.w):Ce.set(e,t,n,r),F.viewport(pe.copy(Ce).multiplyScalar(be).round())},this.getScissor=function(e){return e.copy(we)},this.setScissor=function(e,t,n,r){e.isVector4?we.set(e.x,e.y,e.z,e.w):we.set(e,t,n,r),F.scissor(me.copy(we).multiplyScalar(be).round())},this.getScissorTest=function(){return Te},this.setScissorTest=function(e){F.setScissorTest(Te=e)},this.setOpaqueSort=function(e){xe=e},this.setTransparentSort=function(e){Se=e},this.getClearColor=function(e){return e.copy(tt.getClearColor())},this.setClearColor=function(){tt.setClearColor(...arguments)},this.getClearAlpha=function(){return tt.getClearAlpha()},this.setClearAlpha=function(){tt.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(N!==null){let t=N.texture.format;e=C.has(t)}if(e){let e=N.texture.type,t=w.has(e),n=tt.getClearColor(),r=tt.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(T[0]=i,T[1]=a,T[2]=o,T[3]=r,P.clearBufferuiv(P.COLOR,0,T)):(E[0]=i,E[1]=a,E[2]=o,E[3]=r,P.clearBufferiv(P.COLOR,0,E))}else r|=P.COLOR_BUFFER_BIT}t&&(r|=P.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&P.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),ae=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,dt,!1),t.removeEventListener(`webglcontextrestored`,ft,!1),t.removeEventListener(`webglcontextcreationerror`,pt,!1),tt.dispose(),Ye.dispose(),Xe.dispose(),ze.dispose(),Ve.dispose(),Ge.dispose(),st.dispose(),ct.dispose(),Ke.dispose(),ut.dispose(),ut.removeEventListener(`sessionstart`,bt),ut.removeEventListener(`sessionend`,xt),St.stop()};function dt(e){e.preventDefault(),et(`WebGLRenderer: Context Lost.`),ie=!0}function ft(){et(`WebGLRenderer: Context Restored.`),ie=!1;let e=Re.autoReset,t=$e.enabled,n=$e.autoUpdate,r=$e.needsUpdate,i=$e.type;lt(),Re.autoReset=e,$e.enabled=t,$e.autoUpdate=n,$e.needsUpdate=r,$e.type=i}function pt(e){L(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function mt(e){let t=e.target;t.removeEventListener(`dispose`,mt),ht(t)}function ht(e){gt(e),ze.remove(e)}function gt(e){let t=ze.get(e).programs;t!==void 0&&(t.forEach(function(e){Ke.releaseProgram(e)}),e.isShaderMaterial&&Ke.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=Me);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=Mt(e,t,n,r,i);F.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=We.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;st.setup(i,r,s,n,c);let h,g=it;if(c!==null&&(h=Ue.get(c),g=at,g.setIndex(h)),i.isMesh)r.wireframe===!0?(F.setLineWidth(r.wireframeLinewidth*Pe()),g.setMode(P.LINES)):g.setMode(P.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),F.setLineWidth(e*Pe()),i.isLineSegments?g.setMode(P.LINES):i.isLineLoop?g.setMode(P.LINE_LOOP):g.setMode(P.LINE_STRIP)}else i.isPoints?g.setMode(P.POINTS):i.isSprite&&g.setMode(P.TRIANGLES);if(i.isBatchedMesh){if(Ie.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?Ue.get(c).bytesPerElement:1,o=ze.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(P,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function _t(e,t,n,r){ae!==null&&e.isNodeMaterial&&ae.setObject(r,e),De===!0&&Ze.setState(e,n,!1),e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,Ot(e,t,r),e.side=0,e.needsUpdate=!0,Ot(e,t,r),e.side=2):Ot(e,t,r)}this.compile=function(e,t,n=null){n===null&&(n=e),ae!==null&&ae.renderStart(e,t,n),k=Xe.get(n),k.init(t),j.push(k),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(k.pushLight(e),e.castShadow&&k.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(k.pushLight(e),e.castShadow&&k.pushShadow(e))}),k.setupLights(),ae!==null&&ae.updateLights(k.state.lightsArray),Oe=this.localClippingEnabled,De=Ze.init(this.clippingPlanes,Oe),De===!0&&Ze.setGlobalState(this.clippingPlanes,t),ae!==null&&$e.render(k.state.shadowsArray,n,t);let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let i=e.material;if(i){if(Array.isArray(i))for(let a=0;a<i.length;a++){let o=i[a];_t(o,n,t,e),r.add(o)}else _t(i,n,t,e),r.add(i)}}),k=j.pop(),ae!==null&&ae.renderEnd(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){r.forEach(function(e){let t=ze.get(e).currentProgram;(t===void 0||t.isReady())&&r.delete(e)}),r.size===0?t(e):setTimeout(n,10)}Ie.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let vt=null;function yt(e){vt&&vt(e)}function bt(){St.stop()}function xt(){St.start()}let St=new Ic;St.setAnimationLoop(yt),typeof self<`u`&&St.setContext(self),this.setAnimationLoop=function(e){vt=e,ut.setAnimationLoop(e),e===null?St.stop():St.start()},ut.addEventListener(`sessionstart`,bt),ut.addEventListener(`sessionend`,xt),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){L(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(ie===!0)return;ae!==null&&ae.renderStart(e,t);let n=ut.enabled===!0&&ut.isPresenting===!0,r=re!==null&&(N===null||n)&&re.begin(M,N);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),ut.enabled===!0&&ut.isPresenting===!0&&(re===null||re.isCompositing()===!1)&&(ut.cameraAutoUpdate===!0&&ut.updateCamera(t),t=ut.getCamera()),e.isScene===!0&&e.onBeforeRender(M,e,t,N),k=Xe.get(e,j.length),k.init(t),k.state.textureUnits=Be.getTextureUnits(),j.push(k),ke.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),Ee.setFromProjectionMatrix(ke,Je,t.reversedDepth),Oe=this.localClippingEnabled,De=Ze.init(this.clippingPlanes,Oe),O=Ye.get(e,A.length),O.init(),A.push(O),ut.enabled===!0&&ut.isPresenting===!0){let e=M.xr.getDepthSensingMesh();e!==null&&Ct(e,t,-1/0,M.sortObjects)}Ct(e,t,0,M.sortObjects),O.finish(),ae!==null&&ae.updateLights(k.state.lightsArray),M.sortObjects===!0&&O.sort(xe,Se),Ne=ut.enabled===!1||ut.isPresenting===!1||ut.hasDepthSensing()===!1,Ne&&tt.addToRenderList(O,e),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),De===!0&&Ze.beginShadows();let i=k.state.shadowsArray;if($e.render(i,e,t),De===!0&&Ze.endShadows(),(r&&re.hasRenderPass())===!1){let n=O.opaque,r=O.transmissive;if(k.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];Tt(n,r,e,a)}Ne&&tt.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];wt(O,e,n,n.viewport)}}else r.length>0&&Tt(n,r,e,t),Ne&&tt.render(e),wt(O,e,t)}N!==null&&ue===0&&(Be.updateMultisampleRenderTarget(N),Be.updateRenderTargetMipmap(N)),r&&re.end(M),e.isScene===!0&&e.onAfterRender(M,e,t),st.resetDefaultState(),de=-1,fe=null,j.pop(),j.length>0?(k=j[j.length-1],Be.setTextureUnits(k.state.textureUnits),De===!0&&Ze.setGlobalState(M.clippingPlanes,k.state.camera)):k=null,A.pop(),O=A.length>0?A[A.length-1]:null,ae!==null&&ae.renderEnd()};function Ct(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLightProbeGrid)k.pushLightProbeGrid(e);else if(e.isLight)k.pushLight(e),e.castShadow&&k.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||e.intersectsFrustum(Ee)){r&&je.setFromMatrixPosition(e.matrixWorld).applyMatrix4(ke);let i=Ge.update(e),a=e.material;a.visible&&O.push(e,i,a,n,je.z,null,t)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||e.intersectsFrustum(Ee))){let i=Ge.update(e),a=e.material;if(r&&(e.boundingSphere===void 0?(i.boundingSphere===null&&i.computeBoundingSphere(),je.copy(i.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),je.copy(e.boundingSphere.center)),je.applyMatrix4(e.matrixWorld).applyMatrix4(ke)),Array.isArray(a)){let r=i.groups;for(let o=0,s=r.length;o<s;o++){let s=r[o],c=a[s.materialIndex];c&&c.visible&&O.push(e,i,c,n,je.z,s,t)}}else a.visible&&O.push(e,i,a,n,je.z,null,t)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)Ct(i[e],t,n,r)}function wt(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;k.setupLightsView(n),De===!0&&Ze.setGlobalState(M.clippingPlanes,n),r&&F.viewport(pe.copy(r)),i.length>0&&Et(i,t,n),a.length>0&&Et(a,t,n),o.length>0&&Et(o,t,n),F.buffers.depth.setTest(!0),F.buffers.depth.setMask(!0),F.buffers.color.setMask(!0),F.setPolygonOffset(!1)}function Tt(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(k.state.transmissionRenderTarget[r.id]===void 0){let e=Ie.has(`EXT_color_buffer_half_float`)||Ie.has(`EXT_color_buffer_float`);k.state.transmissionRenderTarget[r.id]=new en(1,1,{generateMipmaps:!0,type:e?_:u,minFilter:l,samples:Math.max(4,Le.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Vt.workingColorSpace})}let a=k.state.transmissionRenderTarget[r.id],o=r.viewport||pe;a.setSize(o.z*M.transmissionResolutionScale,o.w*M.transmissionResolutionScale);let s=M.getRenderTarget(),c=M.getActiveCubeFace(),d=M.getActiveMipmapLevel();M.setRenderTarget(a),M.getClearColor(ge),_e=M.getClearAlpha(),_e<1&&M.setClearColor(16777215,.5),M.clear(),Ne&&tt.render(n);let f=M.toneMapping;M.toneMapping=0;let p=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),k.setupLightsView(r),De===!0&&Ze.setGlobalState(M.clippingPlanes,r),Et(e,n,r),Be.updateMultisampleRenderTarget(a),Be.updateRenderTargetMipmap(a),Ie.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,Dt(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(Be.updateMultisampleRenderTarget(a),Be.updateRenderTargetMipmap(a))}M.setRenderTarget(s,c,d),M.setClearColor(ge,_e),p!==void 0&&(r.viewport=p),M.toneMapping=f}function Et(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&Dt(o,t,n,s,l,c)}}function Dt(e,t,n,r,i,a){ae!==null&&i.isNodeMaterial&&ae.setObject(e,i),e.onBeforeRender(M,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(M,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,M.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,M.renderBufferDirect(n,t,r,i,e,a),i.side=2):M.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(M,t,n,r,i,a)}function Ot(e,t,n){t.isScene!==!0&&(t=Me);let r=ze.get(e),i=k.state.lights,a=k.state.shadowsArray,o=i.state.version,s=Ke.getParameters(e,i.state,a,t,n,k.state.lightProbeGridArray),c=Ke.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=Ve.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,mt),l=new Map,r.programs=l);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return At(e,s),d}else s.uniforms=Ke.getUniforms(e),ae!==null&&e.isNodeMaterial&&ae.build(e,n,s),e.onBeforeCompile(s,M),d=Ke.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=Ze.uniform),At(e,s),r.needsLights=Nt(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.sunLights.value=i.state.sun,f.sunLightShadows.value=i.state.sunShadow,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.sunShadowMatrix.value=i.state.sunShadowMatrix,f.sunShadowCascade.value=i.state.sunShadowCascade,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.lightProbeGrid=k.state.lightProbeGridArray.length>0,r.currentProgram=d,r.uniformsList=null,d}function kt(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=ju.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function At(e,t){let n=ze.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function jt(e,t){if(e.length===0)return null;if(e.length===1)return e[0].texture===null?null:e[0];D.setFromMatrixPosition(t.matrixWorld);for(let t=0,n=e.length;t<n;t++){let n=e[t];if(n.texture!==null&&n.boundingBox.containsPoint(D))return n}return null}function Mt(e,t,n,r,i){t.isScene!==!0&&(t=Me),Be.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=N===null?M.outputColorSpace:N.isXRRenderTarget===!0?N.texture.colorSpace:Vt.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=Ve.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(N===null||N.isXRRenderTarget===!0)&&(h=M.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=ze.get(r),y=k.state.lights;if(De===!0&&(Oe===!0||e!==fe)){let t=e===fe&&r.id===de;Ze.setState(r,e,t)}let b=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==y.state.version?b=!0:v.outputColorSpace===s?i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i._colorsTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i._colorsTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?b=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==Ze.numPlanes||v.numIntersection!==Ze.numIntersection)?b=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.toneMapping===h&&v.morphTargetsCount===_?!!v.lightProbeGrid!=k.state.lightProbeGridArray.length>0&&(b=!0):b=!0:b=!0:b=!0:(b=!0,v.__version=r.version);let x=v.currentProgram;b===!0&&(x=Ot(r,t,i),ae&&r.isNodeMaterial&&ae.onUpdateProgram(r,x,v));let S=!1,C=!1,w=!1,T=x.getUniforms(),E=v.uniforms;if(F.useProgram(x.program)&&(S=!0,C=!0,w=!0),r.id!==de&&(de=r.id,C=!0),v.needsLights){let e=jt(k.state.lightProbeGridArray,i);v.lightProbeGrid!==e&&(v.lightProbeGrid=e,C=!0)}if(S||fe!==e){F.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),T.setValue(P,`projectionMatrix`,e.projectionMatrix),T.setValue(P,`viewMatrix`,e.matrixWorldInverse);let t=T.map.cameraPosition;t!==void 0&&t.setValue(P,Ae.setFromMatrixPosition(e.matrixWorld)),Le.logarithmicDepthBuffer&&T.setValue(P,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&T.setValue(P,`isOrthographic`,e.isOrthographicCamera===!0),fe!==e&&(fe=e,C=!0,w=!0)}if(v.needsLights&&(y.state.sunShadowMap.length>0&&T.setValue(P,`sunShadowMap`,y.state.sunShadowMap,Be),y.state.directionalShadowMap.length>0&&T.setValue(P,`directionalShadowMap`,y.state.directionalShadowMap,Be),y.state.spotShadowMap.length>0&&T.setValue(P,`spotShadowMap`,y.state.spotShadowMap,Be),y.state.pointShadowMap.length>0&&T.setValue(P,`pointShadowMap`,y.state.pointShadowMap,Be)),i.isSkinnedMesh){T.setOptional(P,i,`bindMatrix`),T.setOptional(P,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),T.setValue(P,`boneTexture`,e.boneTexture,Be))}i.isBatchedMesh&&(T.setOptional(P,i,`batchingTexture`),T.setValue(P,`batchingTexture`,i._matricesTexture,Be),T.setOptional(P,i,`batchingIdTexture`),T.setValue(P,`batchingIdTexture`,i._indirectTexture,Be),T.setOptional(P,i,`batchingColorTexture`),i._colorsTexture!==null&&T.setValue(P,`batchingColorTexture`,i._colorsTexture,Be));let D=n.morphAttributes;if((D.position!==void 0||D.normal!==void 0||D.color!==void 0)&&nt.update(i,n,x),(C||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,T.setValue(P,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(E.envMapIntensity.value=t.environmentIntensity),E.dfgLUT!==void 0&&(E.dfgLUT.value=Qd()),C){if(T.setValue(P,`toneMappingExposure`,M.toneMappingExposure),v.needsLights&&R(E,w),a&&r.fog===!0&&qe.refreshFogUniforms(E,a),qe.refreshMaterialUniforms(E,r,be,ye,k.state.transmissionRenderTarget[e.id]),v.needsLights&&v.lightProbeGrid){let e=v.lightProbeGrid;E.probesSH.value=e.texture,E.probesMin.value.copy(e.boundingBox.min),E.probesMax.value.copy(e.boundingBox.max),E.probesResolution.value.copy(e.resolution)}ju.upload(P,kt(v),E,Be)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(ju.upload(P,kt(v),E,Be),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&T.setValue(P,`center`,i.center),T.setValue(P,`modelViewMatrix`,i.modelViewMatrix),T.setValue(P,`normalMatrix`,i.normalMatrix),T.setValue(P,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];ct.update(n,x),ct.bind(n,x)}}return x}function R(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.sunLights.needsUpdate=t,e.sunLightShadows.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function Nt(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return le},this.getActiveMipmapLevel=function(){return ue},this.getRenderTarget=function(){return N},this.setRenderTargetTextures=function(e,t,n){let r=ze.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),ze.get(e.texture).__webglTexture=t,ze.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=ze.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){N=e,le=t,ue=n;let r=null,i=!1,a=!1;if(e){let o=ze.get(e);if(o.__useDefaultFramebuffer!==void 0){F.bindFramebuffer(P.FRAMEBUFFER,o.__webglFramebuffer),pe.copy(e.viewport),me.copy(e.scissor),he=e.scissorTest,F.viewport(pe),F.scissor(me),F.setScissorTest(he),de=-1;return}if(o.__webglFramebuffer===void 0)Be.setupRenderTarget(e);else if(o.__hasExternalTextures)Be.rebindTextures(e,ze.get(e.texture).__webglTexture,ze.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&ze.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);Be.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=ze.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&Be.useMultisampledRTT(e)===!1?ze.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,pe.copy(e.viewport),me.copy(e.scissor),he=e.scissorTest}else pe.copy(Ce).multiplyScalar(be).floor(),me.copy(we).multiplyScalar(be).floor(),he=Te;if(n!==0&&(r=oe),F.bindFramebuffer(P.FRAMEBUFFER,r)&&F.drawBuffers(e,r),F.viewport(pe),F.scissor(me),F.setScissorTest(he),i){let r=ze.get(e.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=ze.get(e.textures[t]);P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=ze.get(e.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,t.__webglTexture,n)}de=-1};function Pt(e){let t=ze.get(e);return(t.__readFormat!==e.format||t.__readType!==e.type)&&(t.__readFormat=e.format,t.__readType=e.type,t.__formatReadable=Le.textureFormatReadable(e.format),t.__typeReadable=Le.textureTypeReadable(e.type)),t}this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){L(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=ze.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){F.bindFramebuffer(P.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;e.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+s);let u=Pt(o);if(u.__formatReadable===!1){L(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(u.__typeReadable===!1){L(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&P.readPixels(t,n,r,i,ot.convert(c),ot.convert(l),a)}finally{let e=N===null?null:ze.get(N).__webglFramebuffer;F.bindFramebuffer(P.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=ze.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){F.bindFramebuffer(P.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;e.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+s);let d=Pt(o);if(d.__formatReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(d.__typeReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let f=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,f),P.bufferData(P.PIXEL_PACK_BUFFER,a.byteLength,P.STREAM_READ),P.readPixels(t,n,r,i,ot.convert(l),ot.convert(u),0),P.bindBuffer(P.PIXEL_PACK_BUFFER,null);let p=N===null?null:ze.get(N).__webglFramebuffer;F.bindFramebuffer(P.FRAMEBUFFER,p);let m=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await rt(P,m,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,f),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,a),P.bindBuffer(P.PIXEL_PACK_BUFFER,null),P.deleteBuffer(f),P.deleteSync(m),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;Be.setTexture2D(e,0),P.copyTexSubImage2D(P.TEXTURE_2D,n,0,0,o,s,i,a),F.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=ot.convert(t.format),_=ot.convert(t.type),v;t.isData3DTexture?(Be.setTexture3D(t,0),v=P.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(Be.setTexture2DArray(t,0),v=P.TEXTURE_2D_ARRAY):(Be.setTexture2D(t,0),v=P.TEXTURE_2D),F.activeTexture(P.TEXTURE0),F.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,t.flipY),F.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),F.pixelStorei(P.UNPACK_ALIGNMENT,t.unpackAlignment);let y=F.getParameter(P.UNPACK_ROW_LENGTH),b=F.getParameter(P.UNPACK_IMAGE_HEIGHT),x=F.getParameter(P.UNPACK_SKIP_PIXELS),S=F.getParameter(P.UNPACK_SKIP_ROWS),C=F.getParameter(P.UNPACK_SKIP_IMAGES);F.pixelStorei(P.UNPACK_ROW_LENGTH,h.width),F.pixelStorei(P.UNPACK_IMAGE_HEIGHT,h.height),F.pixelStorei(P.UNPACK_SKIP_PIXELS,l),F.pixelStorei(P.UNPACK_SKIP_ROWS,u),F.pixelStorei(P.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=ze.get(e),r=ze.get(t),h=ze.get(n.__renderTarget),g=ze.get(r.__renderTarget);F.bindFramebuffer(P.READ_FRAMEBUFFER,h.__webglFramebuffer),F.bindFramebuffer(P.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,ze.get(e).__webglTexture,i,d+n),P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,ze.get(t).__webglTexture,a,m+n)),P.blitFramebuffer(l,u,o,s,f,p,o,s,P.DEPTH_BUFFER_BIT,P.NEAREST);F.bindFramebuffer(P.READ_FRAMEBUFFER,null),F.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||ze.has(e)){let n=ze.get(e),r=ze.get(t);F.bindFramebuffer(P.READ_FRAMEBUFFER,se),F.bindFramebuffer(P.DRAW_FRAMEBUFFER,ce);for(let e=0;e<c;e++)w?P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):P.framebufferTexture2D(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,n.__webglTexture,i),T?P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):P.framebufferTexture2D(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,r.__webglTexture,a),i===0?T?P.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):P.copyTexSubImage2D(v,a,f,p,l,u,o,s):P.blitFramebuffer(l,u,o,s,f,p,o,s,P.COLOR_BUFFER_BIT,P.NEAREST);F.bindFramebuffer(P.READ_FRAMEBUFFER,null),F.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?P.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?P.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):P.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):P.texSubImage2D(P.TEXTURE_2D,a,f,p,o,s,g,_,h);F.pixelStorei(P.UNPACK_ROW_LENGTH,y),F.pixelStorei(P.UNPACK_IMAGE_HEIGHT,b),F.pixelStorei(P.UNPACK_SKIP_PIXELS,x),F.pixelStorei(P.UNPACK_SKIP_ROWS,S),F.pixelStorei(P.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&P.generateMipmap(v),F.unbindTexture()},this.initRenderTarget=function(e){ze.get(e).__webglFramebuffer===void 0&&Be.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?Be.setTextureCube(e,0):e.isData3DTexture?Be.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?Be.setTexture2DArray(e,0):Be.setTexture2D(e,0),F.unbindTexture()},this.resetState=function(){le=0,ue=0,N=null,F.reset(),st.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return Je}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Vt._getDrawingBufferColorSpace(e),t.unpackColorSpace=Vt._getUnpackColorSpace()}},ef=(e,t)=>({x:e,y:t}),W=(e,t)=>({x:e.x+t.x,y:e.y+t.y}),tf=(e,t)=>({x:e.x-t.x,y:e.y-t.y}),G=(e,t)=>({x:e.x*t,y:e.y*t}),nf=(e,t)=>e.x*t.x+e.y*t.y,rf=e=>Math.hypot(e.x,e.y),af=(e,t)=>(e.x-t.x)**2+(e.y-t.y)**2,of=(e,t,n)=>e+(t-e)*n,sf=(e,t,n)=>Math.min(n,Math.max(t,e)),cf=e=>({x:Math.cos(e),y:Math.sin(e)}),lf=e=>({x:-Math.sin(e),y:Math.cos(e)}),uf=e=>{for(;e>Math.PI;)e-=2*Math.PI;for(;e<-Math.PI;)e+=2*Math.PI;return e},df=(e,t,n,r)=>{let i=t-e,a=r*n;return Math.abs(i)<=a?t:e+Math.sign(i)*a},K=function(e){return e[e.Cone=0]=`Cone`,e[e.Pole=1]=`Pole`,e[e.Sign=2]=`Sign`,e[e.ParkedCar=3]=`ParkedCar`,e[e.Traffic=4]=`Traffic`,e[e.Building=5]=`Building`,e[e.Barrier=6]=`Barrier`,e[e.Pillar=7]=`Pillar`,e[e.Bollard=8]=`Bollard`,e[e.Bin=9]=`Bin`,e[e.Stall=10]=`Stall`,e[e.Board=11]=`Board`,e[e.Wall=12]=`Wall`,e[e.Rock=13]=`Rock`,e[e.Container=14]=`Container`,e}({}),ff=function(e){return e[e.Road=0]=`Road`,e[e.Rail=1]=`Rail`,e[e.Foot=2]=`Foot`,e[e.Arch=3]=`Arch`,e[e.Shed=4]=`Shed`,e[e.Line=5]=`Line`,e[e.Gantry=6]=`Gantry`,e[e.Tree=7]=`Tree`,e[e.Conveyor=8]=`Conveyor`,e}({}),pf=1.1,mf=(e,t)=>{if(e.period<=0)return .8+.2*Math.sin(2.1*t+e.fromS);let n=(t+e.late)%e.period;return n<1.1?Math.sin(Math.PI*n/pf):0},hf=(e,t)=>(t+e.phase)%e.period*e.speed-320,gf=(e,t)=>{let n=hf(e,t);return n>-10&&n-e.length<10},_f=(e,t)=>{let n=hf(e,t);return n>-e.warn*e.speed&&n-e.length<10},vf=e=>e.s+14,yf=e=>e.s+42,bf=e=>e.lateral<0?-1:1,xf=(e,t,n)=>t>e.s-26&&t<e.s+e.length+26&&n*bf(e)>7&&n*bf(e)<Math.abs(e.lateral)+5.5,Sf=(e,t,n)=>t>vf(e)-2&&t<yf(e)+2&&Math.abs(n-e.lateral)<3.8,Cf=(e,t)=>nf(tf(t,e.hillOrigin),e.hillDir);function wf(e,t){if(e.hillGrade<=0)return 0;let n=Cf(e,t);return e.hillGrade*Math.max(0,Math.min(n-e.hillFoot,e.hillFar-n))}function Tf(e,t){let n=Cf(e,t);return e.hillGrade<=0||n<=e.hillFoot||n>=e.hillFar?0:n<(e.hillFoot+e.hillFar)*.5?1:-1}function Ef(e,t,n){return e.hillGrade*Tf(e,t)*nf(cf(n),e.hillDir)}function Df(e,t,n,r){let i=0;for(let a of e.winds)if(t>a.fromS&&t<a.toS&&a.shortcut===r){let e=a.period>0?1:Math.min(1,Math.min(t-a.fromS,a.toS-t)/14);i+=a.push*e*mf(a,n)}return i}function Of(e,t,n){return e.scales.some(e=>xf(e,t,n))}var kf=class{constructor(e){this.s=e*2654435761+12345>>>0||1}frand(){return this.s=Math.imul(this.s,1664525)+1013904223>>>0,this.s/4294967296}range(e,t){return e+(t-e)*this.frand()}int(e,t){return e+Math.floor(this.frand()*(t-e+1))}};function Af(e,t,n){let r=tf(n,t),i=nf(r,r);return af(e,W(t,G(r,i>0?sf(nf(tf(e,t),r)/i,0,1):0)))}var jf=2.2;function Mf(e,t,n=0){let r=t/2,i=e.points;if(r<=0){let e=i[0];return W(W(e.pos,G(cf(e.yaw),t)),G(lf(e.yaw),n))}if(r>=i.length-1){let e=i[i.length-1];return W(W(e.pos,G(cf(e.yaw),t-(i.length-1)*2)),G(lf(e.yaw),n))}let a=Math.floor(r),o=r-a,s=of(i[a].yaw,i[a+1].yaw,o);return W({x:of(i[a].pos.x,i[a+1].pos.x,o),y:of(i[a].pos.y,i[a+1].pos.y,o)},G(lf(s),n))}function Nf(e,t){let n=e.points,r=sf(t/2,0,n.length-1),i=Math.min(Math.floor(r),n.length-2);return of(n[i].yaw,n[i+1].yaw,r-i)}function Pf(e,t){return e.points[sf(Math.ceil(t/2),0,e.points.length-1)].curvature}var Ff=[1,.35,.02],If=[.9,.9,.88],Lf=[.25,.16,.08],Rf=[.55,.55,.52],zf=[[.5,.05,.05],[.05,.12,.4],[.6,.6,.62],[.03,.03,.03],[.45,.4,.1],[.05,.3,.15]],Bf=[[.42,.2,.14],[.5,.47,.4],[.2,.23,.28],[.55,.36,.2]],Vf=[[.55,.08,.05],[.05,.2,.5],[.08,.35,.15],[.6,.4,.05],[.35,.35,.38],[.5,.2,.05]],Hf=class{constructor(e,t={x:0,y:0}){this.c=e,this.pos={x:0,y:0},this.yaw=0,this.pos=t,e.points.length===0&&e.points.push({pos:{...t},yaw:0,curvature:0})}s(){return(this.c.points.length-1)*2}step(e){this.pos=W(this.pos,G(cf(this.yaw+e*2*.5),2)),this.yaw+=e*2,this.c.points.push({pos:{...this.pos},yaw:this.yaw,curvature:e})}straight(e){let t=Math.round(e/2);for(let e=0;e<t;e++)this.step(0)}turn(e,t){let n=e*Math.PI/180,r=Math.max(1,Math.ceil(Math.abs(n)*t/2));for(let e=0;e<r;e++)this.step(n/(r*2))}},Uf=class{constructor(e){this.c=e,this.paint=0}bollard(e,t){this.round(8,e,t,.3,1.1,[.85,.7,.05])}tank(e,t,n,r){this.round(7,e,t,n,r,[.75,.75,.72],!0)}lamp(e,t){this.round(1,e,t,.2,8,[.16,.16,.18])}containers(e,t,n,r,i){this.box(14,e,t,6.1*n,1.3*r,2.6*i,Vf[this.paint++%Vf.length],!0)}forklift(e,t,n,r){let i=this.blank(4);i.half=ef(1.6,.9),i.height=1.3,i.swayWidth=t,i.swayRate=n,i.swayPhase=r,i.color=[.9,.6,.02],this.place(i,e,0)}boulder(e,t,n){for(let t of this.c.points)if(af(t.pos,e)<(11+n)**2)return;let r=this.blank(7);r.radius=n,r.height=n*1.3,r.solid=!0,r.color=[.32,.3,.28],r.s=t,r.lateral=100,r.pos=e,this.c.obstacles.push(r)}shortcut(e,t,n){this.c.shortcuts.push({fromS:e,toS:t,from:Mf(this.c,e),to:Mf(this.c,t),halfWidth:n})}leap(e,t,n,r,i,a){let o=tf(e.to,e.from),s=rf(o),c=(e.toS-e.fromS)/s;this.c.jumps.push({s:e.fromS+t*c,gap:n*c,pos:W(e.from,G(o,t/s)),yaw:Math.atan2(o.y,o.x),depth:40,left:r,right:i,shortcut:!0,squeeze:c,gorge:!0,putBackS:a})}wind(e,t,n){this.c.winds.push({fromS:e,toS:t,push:n,period:0,late:0,shortcut:!1})}wave(e,t,n,r,i=!1){this.c.winds.push({fromS:e,toS:t,push:n,period:4.4,late:r,shortcut:i})}place(e,t,n){e.s=t,e.lateral=n,e.pos=Mf(this.c,t,n),e.yaw=Nf(this.c,t),this.c.obstacles.push(e)}blank(e){return{kind:e,s:0,lateral:0,pos:ef(0,0),yaw:0,half:ef(0,0),radius:0,height:1,solid:!1,trafficSpeed:0,color:[1,1,1]}}round(e,t,n,r,i,a,o=!1){let s=this.blank(e);s.radius=r,s.height=i,s.color=a,s.solid=o,this.place(s,t,n)}box(e,t,n,r,i,a,o,s){let c=this.blank(e);c.half=ef(r,i),c.height=a,c.color=o,c.solid=s,this.place(c,t,n)}cone(e,t){this.round(0,e,t,.3,.7,Ff)}pole(e,t){this.round(1,e,t,.22,9,Lf)}sign(e,t){this.round(2,e,t,.15,3,[.85,.75,.1])}car(e,t,n=0){let r=this.blank(n===0?3:4);r.half=ef(2.2,.95),r.height=1.5,r.trafficSpeed=n,r.color=zf[this.paint++%zf.length],this.place(r,e,t)}building(e,t,n,r,i){this.box(5,e,t,n,r,i,Bf[this.paint++%Bf.length],!0)}barrier(e,t){this.box(6,e,t,3,.4,1,Rf,!0)}bridge(e,t,n=0){this.c.bridges.push({s:e,clearance:t,pos:Mf(this.c,e),yaw:Nf(this.c,e),kind:n});for(let r of[-1,1])n===5?this.round(7,e,r*10.6,.3,8.2,Lf,!0):n===7?this.round(7,e,r*10.6,1.1,7,[.14,.09,.05],!0):this.round(7,e,r*10.6,.9,t+1.2,n===3?[.4,.19,.1]:n===6?[.85,.62,.04]:Rf,!0)}boxAt(e,t,n,r,i,a,o,s,c){let l=this.blank(e);l.half=ef(i,a),l.height=o,l.color=s,l.solid=c,l.s=r,l.lateral=100,l.pos=t,l.yaw=n,this.c.obstacles.push(l)}narrow(e,t){for(let t=48;t>=12;t-=12){let n=of(7.4,5.4,(48-t)/36);this.round(0,e-t,n,.3,.7,If),this.round(0,e-t,-n,.3,.7,If)}for(let n=0;n<t-1;n+=6)this.barrier(e+n,5),this.barrier(e+n,-5);this.c.narrows.push({s:e-3,length:t,halfWidth:5});let n=e-3+t*.5;this.c.waters.push({from:Mf(this.c,n,-240),to:Mf(this.c,n,240),half:4.5,clearHalf:5.4,deep:!1})}jump(e,t,n=130,r=130){this.c.jumps.push({s:e,gap:t,pos:Mf(this.c,e),yaw:Nf(this.c,e),depth:1.7,left:n,right:r,shortcut:!1,squeeze:1,gorge:!1,putBackS:-1})}note(e,t){this.c.notes.push({s:e,text:t})}finish(){let e=this.c;for(let t=e.stopS-70;t<=e.stopS-10;t+=12)this.cone(t,7.5),this.cone(t,-7.5);for(let t of[46,e.stopS])for(let e of[-1,1])this.round(7,t,e*9.4,.35,9,[.03,.03,.035],!0)}};function Wf(){return{name:``,blurb:``,parSeconds:130,stormSpeed:19.3,payScale:1,reputation:0,town:`DES MOINES`,port:!1,city:!1,night:!1,desert:!1,coast:!1,finale:!1,endless:!1,points:[],obstacles:[],bridges:[],narrows:[],jumps:[],shortcuts:[],winds:[],crossings:[],scales:[],gifts:[],waters:[],notes:[],length:0,stopS:0,stopLength:45,hillOrigin:{x:0,y:0},hillDir:{x:1,y:0},hillFoot:0,hillFar:0,hillGrade:0}}function Gf(e){let t=new Uf(e),n=(t,n,r=1/220)=>{for(let i=t;i<=n;i+=6)if(Math.abs(Pf(e,i))>r||Tf(e,Mf(e,i))!==0||Tf(e,Mf(e,i,20))!==0)return!1;return!0},r=(t,n,r,i)=>{let a=!0;for(let o of e.obstacles){let e=Math.abs(o.lateral)-Math.max(o.half.y,o.radius);o.trafficSpeed!==0||o.lateral*i<0||e>19||(a&&=o.s+Math.max(o.half.x,o.radius)<t-r||o.s-Math.max(o.half.x,o.radius)>n+r)}for(let r of e.bridges)a&&=r.s<t-15||r.s>n+15;for(let r of e.narrows)a&&=r.s+r.length<t-30||r.s>n+30;for(let r of e.jumps)a&&=r.s+r.gap<t-70||r.s>n+70;for(let r of e.waters)for(let i=t-30;i<=n+30&&a;i+=10)a&&=Af(Mf(e,i,12),r.from,r.to)>(r.half+12)**2&&Af(Mf(e,i,-12),r.from,r.to)>(r.half+12)**2;for(let r of e.shortcuts)a&&=r.toS<t-50||r.fromS>n+50;for(let r of e.crossings)a&&=r.s<t-120||r.s>n+120;for(let r of e.scales)a&&=r.s+r.length<t-60||r.s>n+60;return a};if(!e.city&&!e.port){let i=420,a=640;for(let o=300;o<e.stopS-380;o+=30)!e.coast&&o>=i&&n(o-40,o+40)&&r(o-20,o+20,12,0)?(e.crossings.push({s:o,skew:(Math.round(o/30)%2==0?1:-1)*.28,period:44,phase:o*.37%44,length:84,speed:22,warn:6,pos:Mf(e,o),yaw:Nf(e,o)}),t.note(o,`RAIL CROSSING  /  lights going: stop, or gun it`),i=e.endless?o+1600:e.stopS,a=Math.max(a,o+260)):o>=a&&n(o-15,o+72,1/120)&&r(o-28,o+86,6,1)&&(e.scales.push({s:o,length:58,lateral:15.5,pos:Mf(e,o),yaw:Nf(e,o)}),t.note(o,`WEIGH STATION  /  pull in right, stop on the plate`),a=e.endless?o+1800:e.stopS,i=Math.max(i,o+260))}for(let t=330;t<e.stopS-200;t+=470){let n=Math.round(t/470),i=n%2==0?1:-1;r(t-10,t+10,6,i)&&!Of(e,t,i*6.4)&&e.gifts.push({s:t,lateral:i*6.4,repair:Math.floor(n/2)%2==1,pos:Mf(e,t,i*6.4)})}for(let n of e.bridges)for(let e of[-1,1])t.box(12,n.s,e*48.8,3,40,9,[0,0,0],!0);for(let n=250;n<e.stopS-170;n+=430){let r=Math.round(n/430)%2==0?1:-1,i=Mf(e,n,r*18),a=Tf(e,i)===0;for(let t of e.shortcuts)a&&=Af(i,t.from,t.to)>256;for(let t of e.crossings)a&&=Math.abs(n-t.s)>60;for(let t of e.scales)a&&=n<t.s-40||n>t.s+t.length+40;for(let t=0;t<e.points.length&&a;t+=3)a=af(e.points[t].pos,i)>169;for(let t of e.obstacles)a&&=af(t.pos,i)>(rf(t.half)+t.radius+8)**2;for(let t of e.jumps)a&&=t.shortcut?af(t.pos,i)>36100:n<t.s-30||n>t.s+t.gap+30;for(let t of e.bridges)a&&=Math.abs(n-t.s)>70;for(let t of e.narrows)a&&=n<t.s-60||n>t.s+t.length+60;a&&t.boxAt(11,i,Nf(e,n)+Math.PI-r*.3,n,9.2,.5,13.5,[.012,.012,.015],!1)}return e.notes.sort((e,t)=>e.s-t.s),e}function Kf(){let e=Wf();e.name=`FARM ROAD`,e.blurb=`Open country and a small town, out to the wind farm. Fast, with two tight corners.`,e.parSeconds=143,e.stormSpeed=16.6,e.town=`DES MOINES`;let t=new Hf(e);t.straight(260);let n=t.s();t.turn(45,140);let r=t.s();t.straight(170);let i=t.s();t.turn(-90,32);let a=t.s();t.straight(130);let o=t.s();t.turn(90,32);let s=t.s();t.straight(220);let c=t.s();t.turn(-120,110);let l=t.s();t.straight(190);let u=t.s();t.turn(60,60);let d=t.s();t.turn(-60,60);let f=t.s();t.straight(320);let p=t.s();t.turn(90,40);let m=t.s();t.straight(400),e.stopS=t.s(),t.straight(e.stopLength+70),e.length=t.s();let h=new Uf(e),g=9.5;h.note(150,`TRAFFIC  /  go round it`),h.car(170,4,9),h.car(n+60,4,10),h.sign(n-10,g),h.note(r+90,`LOW BRIDGE  /  hold SPACE to duck the load`),h.bridge(r+90,4.4),h.car(r+30,4,10);let _=i+25;h.note(i,`TIGHT LEFT  /  brake, hold E to swing the tail wide`),h.building(_,-18,7,7,9),h.pole(i+8,g),h.pole(i+25,g),h.pole(i+42,g),h.building(i-40,20,14,7,7),h.building(i-44,-19,12,6,11),h.note(a+20,`PARKED CARS  /  keep to the middle`),h.car(a+22,5.7),h.car(a+34,5.7),h.car(a+52,-5.7),h.car(a+74,5.7),h.car(a+96,-5.7),h.building(a+40,19,22,6,10),h.building(a+95,19,18,6,7),h.building(a+60,-19,30,6,8);let v=o+25;h.note(o,`TIGHT RIGHT  /  brake, hold Q to swing the tail wide`),h.building(v,18,7,7,12),h.pole(o+8,-9.5),h.pole(o+25,-9.5),h.pole(o+42,-9.5),h.car(s+40,4,10),h.note(s+120,`RAIL BRIDGE  /  hold SPACE`),h.bridge(s+120,4.4,1),h.car(s+420,-4,-11),h.note(c,`LONG LEFT  /  poles on the outside`);for(let e=c+20;e<l-10;e+=34)h.pole(e,g);h.car(c+70,4,11),h.car(l+360,-4,-11);let y=l+100;h.note(y,`NARROW BRIDGE  /  straight through the middle`),h.narrow(y,18),h.note(u,`ESS BEND  /  right, then left`),h.pole(u+32,g),h.sign(u+6,-11.5),h.pole(d+32,-9.5),h.sign(d+6,11.5),h.car(f+50,4,12),h.note(f+120,`LOW BRANCHES  /  duck, then again for the grain conveyor`),h.bridge(f+120,4.4,7),h.bridge(f+215,4.4,8),h.car(f+490,-4,-10);let b=p+31;return h.note(p,`RIGHT  /  brake, hold Q`),h.building(b,19.5,8,8,8),h.pole(p+12,-9.5),h.pole(p+31,-9.5),h.pole(p+50,-9.5),h.note(m+150,`JUMP THE RIVER  /  45 mph or more, and keep it straight`),h.jump(m+150,26),h.note(e.stopS,`SITE  /  brake and stop in the green box`),h.finish(),Gf(e)}function qf(){let e=Wf();e.name=`THE PORT`,e.reputation=5,e.blurb=`Tight and technical: a container yard, forklifts crossing, three gantries and a hairpin round the tanks.`,e.port=!0,e.payScale=1.15,e.parSeconds=116,e.stormSpeed=15.9,e.town=`HOUSTON`;let t=new Hf(e,{x:0,y:9e3});t.straight(300);let n=t.s();t.turn(90,40);let r=t.s();t.straight(80);let i=t.s();t.turn(-90,40);let a=t.s();t.straight(70);let o=t.s();t.turn(-90,40);let s=t.s();t.straight(80);let c=t.s();t.turn(90,40);let l=t.s();t.straight(290);let u=t.s();t.turn(-180,46);let d=t.s();t.straight(210);let f=t.s();t.turn(40,55);let p=t.s();t.turn(-40,55);let m=t.s();t.straight(300),e.stopS=t.s(),t.straight(e.stopLength+70),e.length=t.s();let h=new Uf(e),g=9.5,_=14.6;for(let e=60;e<n-20;e+=26)h.bollard(e,g),h.bollard(e,-9.5);h.note(150,`BROKEN-DOWN TRUCK  /  go round it`),h.car(170,4),h.note(n,`TIGHT RIGHT  /  brake, hold Q to swing the tail wide`),h.containers(n+31,21,1,5,3),h.bollard(n+12,-9.5),h.bollard(n+40,-9.5),h.containers(r+48,_,4,2,3),h.containers(r+46,-14.6,4,2,2),h.note(i,`TIGHT LEFT  /  hold E`),h.containers(i+31,-21,1,5,2),h.bollard(i+27,g),h.note(a+35,`FORKLIFT CROSSING  /  time it, or wait`),h.forklift(a+35,7.5,.85,0),h.note(o,`TIGHT LEFT  /  hold E`),h.containers(o+31,-21,1,5,3),h.bollard(o+27,g),h.containers(s+46,_,4,2,3),h.containers(s+48,-14.6,4,2,3),h.car(s+36,-5.7),h.note(c,`TIGHT RIGHT  /  hold Q`),h.containers(c+31,21,1,5,2),h.bollard(c+27,-9.5),h.car(l+262,-4,-9),h.note(l+75,`THREE GANTRIES  /  duck each one, mind the forklifts`),h.bridge(l+75,4.4,ff.Gantry),h.forklift(l+115,7.5,.7,1),h.bridge(l+155,4.4,ff.Gantry),h.forklift(l+195,7.5,1,2.5),h.bridge(l+235,4.4,ff.Gantry),h.containers(l+150,22,9,3,3),h.containers(l+150,-22,9,3,2),h.note(u,`HAIRPIN LEFT  /  brake hard, hold E all the way round`),h.tank(u+72,-46,17,14),h.tank(u+22,-20,5,9),h.tank(u+122,-20,5,9);for(let e=u+18;e<d-10;e+=27)h.bollard(e,-10);return h.car(d+30,5.7),h.car(d+62,-5.7),h.note(d+120,`GAP IN THE QUAY  /  jump it: 45 mph or more`),h.jump(d+120,26,40,130),h.note(f,`CHICANE  /  right, then left`),h.bollard(f+19,g),h.bollard(p+19,-9.5),h.containers(f+19,20,1,3,2),h.containers(p+19,-20,1,3,2),h.car(m+80,4,10),h.note(e.stopS,`SITE  /  brake and stop in the green box`),h.finish(),Gf(e)}function Jf(){let e=Wf();e.name=`MOUNTAIN PASS`,e.blurb=`Up one side and down the other. The climb is slow and the storm is not; the way down wants to run away with you.`,e.reputation=12,e.payScale=1.3,e.parSeconds=138,e.stormSpeed=15.5,e.town=`DENVER`;let t={x:0,y:18e3};e.hillOrigin=t,e.hillDir={x:1,y:0},e.hillGrade=.14;let n=new Hf(e,t);n.straight(240);let r=n.s();n.turn(60,60);let i=n.s();n.straight(150);let a=n.s();n.turn(-120,36);let o=n.s();n.straight(150);let s=n.s();n.turn(120,36);let c=n.s();n.straight(150),n.turn(-60,60);let l=n.s();n.straight(140);let u=n.s();n.turn(60,60);let d=n.s();n.straight(150);let f=n.s();n.turn(-120,36);let p=n.s();n.straight(150);let m=n.s();n.turn(120,36);let h=n.s();n.straight(150),n.turn(-60,60);let g=n.s();n.straight(420),e.stopS=n.s(),n.straight(e.stopLength+70),e.length=n.s();let _=Cf(e,Mf(e,l+70));e.hillFoot=Cf(e,Mf(e,r+12)),e.hillFar=2*_-e.hillFoot;let v=new Uf(e);v.car(80,4,8),v.note(170,`SNOW SHED  /  hold SPACE to duck`),v.bridge(170,4.4,ff.Shed),v.note(r,`THE CLIMB  /  it gets slow, and the storm does not. Boost helps`);let y=(t,n,r)=>{v.note(t,r);for(let e of[8,31,54])v.bollard(t+e,-n*10.1);v.boulder(Mf(e,t+31,n*21),t+31,3)};y(a,-1,`HAIRPIN LEFT  /  brake, hold E to swing the tail wide`),y(s,1,`HAIRPIN RIGHT  /  brake, hold Q`),y(f,-1,`HAIRPIN LEFT  /  downhill: brake EARLY`),y(m,1,`HAIRPIN RIGHT  /  downhill: brake EARLY`);let b=(t,n,r)=>{let i=t+82.5,a=n+67.5;v.note(i-6,r),v.shortcut(i,a,4.5);let o=e.shortcuts[e.shortcuts.length-1],s=tf(o.to,o.from),c=rf(s),l=G(s,1/c),u={x:-l.y,y:l.x};for(let e of[.22,.5,.78]){let t=e===.5?6.2:7.6;for(let n of[-1,1])v.boulder(W(W(o.from,G(l,c*e)),G(u,n*t)),of(i,a,e),1.6)}};return b(i,o,`SHORTCUT RIGHT  /  dirt track straight up: steep and narrow`),b(d,p,`SHORTCUT RIGHT  /  dirt track straight down: fast, and hard to stop`),v.car(o+112,4),v.note(c+80,`ROCKFALL  /  keep left`),v.round(K.Pillar,c+80,3.2,1.5,1.9,[.32,.3,.28],!0),v.round(K.Pillar,c+86,5.4,1.2,1.5,[.32,.3,.28],!0),v.note(l,`OVER THE TOP  /  it runs away downhill: brake early`),v.sign(l+70,9.5),v.sign(l+70,-9.5),v.car(u+220,-4,-9),v.car(h+60,4),v.note(g+150,`LOW LINE  /  hold SPACE`),v.bridge(g+150,4.4,ff.Line),v.car(g+230,4,11),v.note(e.stopS,`SITE  /  brake and stop in the green box`),v.finish(),Gf(e)}function Yf(){let e=Wf();e.name=`DOWNTOWN`,e.blurb=`The city at night. The avenue goes the long way round each block; the alley and the market are the short ways through.`,e.city=!0,e.night=!0,e.reputation=20,e.payScale=1.45,e.parSeconds=133,e.stormSpeed=14.5,e.town=`NEW YORK`;let t=new Hf(e,{x:0,y:27e3}),n=Math.PI/2*240+60+100,r=e=>{t.turn(90*e,60),t.straight(30),t.turn(-90*e,60),t.straight(100),t.turn(-90*e,60),t.straight(30),t.turn(90*e,60)};t.straight(200);let i=t.s();r(1);let a=t.s();t.straight(230);let o=t.s();t.turn(-90,40);let s=t.s();t.straight(110);let c=t.s();r(-1);let l=t.s();t.straight(200);let u=t.s();t.turn(90,60);let d=t.s();t.straight(200),e.stopS=t.s(),t.straight(e.stopLength+70),e.length=t.s();let f=new Uf(e),p=new kf(41),m=41/1.45,h=32.27586206896552,g=5.7,_=(e,t,n)=>{let r=Math.max(1,Math.ceil((t-e)/46)),i=(t-e)/r;for(let t=0;t<r;t++)f.building(e+(t+.5)*i,n*23,i*.5-.6,10,p.range(11,38))},v=(e,t)=>{let n=1;for(let r=e;r<=t;r+=42)f.lamp(r,n*9.4),n=-n},y=(t,r,i)=>{let a=Math.PI/2*60,o=t+n,s=i?11:5.5;f.shortcut(t,o,i?9.5:4.5);let c=e.shortcuts[e.shortcuts.length-1],l=tf(c.to,c.from),u=rf(l),d=G(l,1/u),h=G({x:-d.y,y:d.x},r),_=Math.atan2(d.y,d.x),v=(e,t)=>W(W(c.from,G(d,e)),G(h,t)),y=e=>of(t,o,e/u),b=t+a,x=b+30+a,S=x+100+a,C=(e,t,n,r,i,a,o)=>{let s=t-e>=r-n,c=s?t-e:r-n,l=Math.max(1,Math.ceil(c/46));for(let u=0;u<l;u++){let d=u*c/l,m=(u+1)*c/l-.8,h=s?e+d:e,g=s?e+m:t,y=s?n:n+d,b=s?r:n+m,x=(h+g)*.5,S=(y+b)*.5;f.boxAt(K.Building,v(x,S),_,o(x,S),(g-h)*.5,(b-y)*.5,p.range(i,a),Bf[f.paint++%Bf.length],!0)}},w=e=>y(e),T=(e,t)=>b+(t-60),E=e=>x+(e-120),D=(e,t)=>S+(90-t);C(26,u-28,-s-20,-s,12,24,w),C(73,267,s,s+14,10,20,w);let O=s+17,ee=57.72413793103448;C(73,89,O,ee,12,30,T),C(251,267,O,ee,12,30,D),C(152.27586206896552,187.72413793103448,111,137,16,40,E);for(let e of[120,220])C(e-m,e+m,61.72413793103448,118.27586206896552,20,44,e=>e<u*.5?x-a*.5:S-a*.5);C(27,47,92.27586206896552,183,12,34,T),C(54,286,163,183,12,34,E),C(293,313,92.27586206896552,183,12,34,D),C(-28.27586206896552,m,31.72413793103448,88.27586206896552,16,36,()=>t+a*.5),C(u-m,u+m,31.72413793103448,88.27586206896552,16,36,()=>o-a*.5);let k=[t,b+30,x+100,S+30];for(let e=0;e<4;e++){let t=r*(e===0||e===3?16.5:9.4);f.lamp(k[e]+a*.3,t),f.lamp(k[e]+a*.72,t)}for(let e of[8,50,92])f.lamp(x+e,r*9.4);if(f.car(x+34,r*g),f.car(x+82,-r*g),i){let t=u*.5;for(let e=54;e<u-60+2;e+=15)if(!(Math.abs(e-t)<34))for(let t of[-1,1])f.boxAt(K.Stall,v(e+(t>0?0:7),t*5.4),_,y(e),1.5,1.2,2.6,zf[f.paint++%zf.length],!1);let n=f.blank(K.Pillar);n.radius=2.2,n.height=1.2,n.solid=!0,n.color=Rf,n.s=y(t),n.lateral=100,n.pos=v(t,0),e.obstacles.push(n)}else{let e=1;for(let t=66;t<u-40;t+=44)f.boxAt(K.Bin,v(t,e*2.95),_,y(t),1.5,1.3,1.4,[.05,.22,.12],!1),e=-e}};return _(-50,i-h,1),_(-50,i+16,-1),v(30,i-20),f.car(70,g),f.car(120,-5.7),f.note(150,`RAIL BRIDGE  /  hold SPACE to duck`),f.bridge(150,4.4,ff.Rail),f.car(188,-4,-10),f.note(i-4,`ALLEY: STRAIGHT ON  /  short, tight`),y(i,1,!1),_(a+h,a+58,1),_(a-20,a+58,-1),_(a+84,o+4,1),_(a+84,o-24,-1),v(a+20,a+50),v(a+96,o-10),f.car(a+205,-4,-10),f.note(a+71,`CROSS STREET  /  taxis crossing: time it, or wait`),f.forklift(a+71,7.5,.85,0),f.note(a+150,`FOOTBRIDGE  /  hold SPACE`),f.bridge(a+150,4.4,ff.Foot),f.note(o,`TIGHT LEFT  /  brake, hold E to swing the tail wide`),f.building(o+31,-25,9,9,30),f.lamp(o+20,9.4),f.lamp(o+46,9.4),_(s+22,c-h,-1),_(s+4,c+16,1),v(s+14,c-12),f.car(s+30,g),f.car(s+78,-5.7),f.note(s+55,`FOOTBRIDGE  /  hold SPACE`),f.bridge(s+55,4.4,ff.Foot),f.note(c-4,`MARKET: STRAIGHT ON  /  short, mind the stalls`),y(c,-1,!0),_(l+h,l+78,-1),_(l-20,l+78,1),v(l+16,l+80),f.note(l+118,`CANAL BRIDGE IS UP  /  jump it: 45 mph or more`),f.jump(l+118,26),f.note(u,`RIGHT  /  then the yard`),f.lamp(u+30,-9.4),f.lamp(u+66,-9.4),v(d+20,e.stopS-80),f.car(d+70,4,11),f.note(e.stopS,`SITE  /  brake and stop in the green box`),f.finish(),Gf(e)}function Xf(){let e=Wf();e.name=`THE CANYON`,e.blurb=`Desert, late in the day. The wind comes through every gap in the rock, and the short way is a leap across the gorge.`,e.desert=!0,e.reputation=30,e.payScale=1.6,e.parSeconds=123,e.stormSpeed=15.5,e.town=`SANTA FE`;let t=new Hf(e,{x:0,y:36e3}),n=Math.PI/2*280+60+120;t.straight(280);let r=t.s();t.turn(-50,110);let i=t.s();t.straight(180);let a=t.s();t.turn(50,110),t.straight(70);let o=t.s();t.turn(90,70),t.straight(30),t.turn(-90,70);let s=t.s();t.straight(120),t.turn(-90,70),t.straight(30),t.turn(90,70);let c=t.s();t.straight(260);let l=t.s();t.turn(-70,60);let u=t.s();t.straight(200);let d=t.s();t.turn(70,80);let f=t.s();t.straight(240),e.stopS=t.s(),t.straight(e.stopLength+70),e.length=t.s();let p=new Uf(e),m=new kf(53),h=[.42,.2,.1],g=(e,t,n)=>{let r=Math.max(1,Math.ceil((t-e)/30)),i=(t-e)/r;for(let t=0;t<r;t++){let r=m.range(.8,1.15);p.box(K.Rock,e+(t+.5)*i,n*22,i*.5+.5,9,m.range(13,30),[h[0]*r,h[1]*r,h[2]*r],!0)}},_=(e,t)=>p.round(K.Pillar,e,t,m.range(1.4,2.4),2.6,[h[0]*.9,h[1]*.9,h[2]*.9],!0);p.note(116,`CROSSWIND  /  steer into it`),p.wind(120,240,2.3),_(150,14),_(206,14.5),_(60,-14),g(r+40,a+40,-1),g(r+40,i+84,1),g(i+156,a+40,1),p.note(i+40,`ROCK ARCH  /  hold SPACE to duck`),p.bridge(i+40,4.4,ff.Arch),p.note(i+84,`WIND FROM THE RIGHT  /  keep right`),p.wind(i+84,i+156,-3),p.note(i+170,`ROCK ARCH  /  hold SPACE`),p.bridge(i+170,4.4,ff.Arch),p.note(o-4,`THE LEAP: STRAIGHT ON  /  hold SHIFT up the ramp`),p.shortcut(o,o+n,5);let v=e.shortcuts[e.shortcuts.length-1],y=rf(tf(v.to,v.from));p.leap(v,176,42,150,134,o-90);let b=G(tf(v.to,v.from),1/y),x={x:-b.y,y:b.x};e.gifts.push({s:of(v.fromS,v.toS,128/y),lateral:100,repair:!1,pos:W(v.from,G(b,128))});for(let e of[50,95,140,262,318])for(let t of[-1,1])p.boulder(W(W(v.from,G(b,e)),G(x,t*9.5)),of(v.fromS,v.toS,e/y),1.7);let S=Math.PI/2*70;return p.box(K.Rock,o+S*.5,37,12,12,26,h,!0),p.box(K.Rock,c-S*.5,37,12,12,22,h,!0),g(s+4,s+120-4,1),p.note(s+6,`WIND FROM THE LEFT  /  keep left`),p.wind(s+10,s+120-10,2.8),p.note(c+22,`ROCK ARCH  /  hold SPACE`),p.bridge(c+22,4.4,ff.Arch),p.note(c+50,`WIND FROM THE RIGHT  /  then from the left`),g(c+44,c+128,-1),p.wind(c+50,c+126,-3.2),g(c+132,c+216,1),p.wind(c+134,c+210,3.2),p.car(c+250,-4,-10),p.note(l,`LEFT  /  brake`),p.box(K.Rock,l+36,-35,11,11,24,h,!0),p.note(u+50,`BROKEN-DOWN TRUCK  /  wind from the right`),p.wind(u+50,u+150,-2.6),p.car(u+110,4),_(u+128,-14),_(u+70,14),p.note(d,`RIGHT  /  then the site, and one more gust`),p.wind(f+30,f+110,-2.4),_(f+70,-14),p.note(e.stopS,`SITE  /  brake and stop in the green box`),p.finish(),Gf(e)}function Zf(){let e=Wf();e.name=`THE COAST`,e.blurb=`The last job, with the weather already in. The sea comes over the road, and the load goes up from the cape.`,e.coast=!0,e.finale=!0,e.reputation=42,e.payScale=1e6/38e4,e.parSeconds=128,e.stormSpeed=15.5,e.town=`PORTLAND`;let t=new Hf(e,{x:0,y:45e3}),n=Math.PI/2*280+80+120;t.straight(220),t.turn(40,120);let r=t.s();t.straight(300),t.turn(-40,120),t.straight(40);let i=t.s();t.turn(90,70),t.straight(40),t.turn(-90,70);let a=t.s();t.straight(120),t.turn(-90,70),t.straight(40),t.turn(90,70);let o=t.s();t.straight(200);let s=t.s();t.turn(-180,50);let c=t.s();t.straight(190);let l=t.s();t.turn(90,60);let u=t.s();t.straight(250),e.stopS=t.s(),t.straight(e.stopLength+70),e.length=t.s();let d=new Uf(e),f=(e,t,n)=>{let r=Math.max(1,Math.ceil((t-e)/44)),i=(t-e)/r;for(let t=0;t<r;t++)d.box(K.Barrier,e+(t+.5)*i,n*9.3,i*.5,.4,1,Rf,!0)};d.note(86,`WIND OFF THE SEA  /  steer into it`),d.wind(90,200,2.5),d.car(205,-4,-10),d.note(r+20,`WAVES  /  go between them, or keep left`),f(r+30,r+290,1),d.wave(r+50,r+92,5,0),d.wave(r+140,r+182,5,1.6),d.wave(r+230,r+272,5,3.1),d.note(i-4,`SANDBAR: STRAIGHT ON  /  short, narrow, waves`),d.shortcut(i,i+n,6);let p=e.shortcuts[e.shortcuts.length-1],m=rf(tf(p.to,p.from));for(let e of[120,250])d.wave(of(p.fromS,p.toS,e/m),of(p.fromS,p.toS,(e+44)/m),5,e*.01,!0);d.car(a+40,5.7),d.note(a+100,`FOOTBRIDGE  /  hold SPACE to duck`),d.bridge(a+100,4.4,ff.Foot),d.wind(o+30,o+130,2.8),d.note(o+150,`GANTRY  /  hold SPACE`),d.bridge(o+150,4.4,ff.Gantry),d.note(s,`HAIRPIN LEFT  /  brake hard, hold E all the way round`),d.tank(s+78,-50,5,34);for(let e=s+14;e<c-8;e+=26)d.bollard(e,-10);return d.note(c+100,`RIVER BRIDGE IS UP  /  jump it: 45 mph or more`),d.jump(c+100,26,34,130),d.note(l,`RIGHT  /  out along the cape`),d.note(u+46,`WAVE FROM THE RIGHT  /  keep right`),f(u+40,u+110,-1),d.wave(u+50,u+92,-5,2),d.wind(u+120,u+205,-2.6),d.note(e.stopS,`SITE  /  brake and stop in the green box`),d.finish(),Gf(e)}function Qf(){let e=Wf();e.name=`MIDNIGHT RIDGE`,e.blurb=`After dark, by headlights. A long straight, a long climb over the ridge, and a long run home: the place to race.`,e.night=!0,e.reputation=50,e.payScale=1.8,e.parSeconds=136,e.stormSpeed=16.2,e.town=`KANSAS CITY`;let t={x:0,y:54e3};e.hillOrigin=t,e.hillDir={x:1,y:0},e.hillGrade=.09;let n=new Hf(e,t);n.straight(380);let r=n.s();n.turn(-40,90),n.straight(60),n.turn(40,90);let i=n.s();n.straight(230);let a=n.s();n.straight(120);let o=n.s();n.straight(230);let s=n.s();n.turn(90,60);let c=n.s();n.straight(140),n.turn(-50,80),n.straight(100),n.turn(50,80);let l=n.s();n.straight(210),n.turn(-90,55);let u=n.s();n.straight(340),e.stopS=n.s(),n.straight(e.stopLength+70),e.length=n.s();let d=Cf(e,Mf(e,a+60));e.hillFoot=Cf(e,Mf(e,i+12)),e.hillFar=2*d-e.hillFoot;let f=new Uf(e),p=9.3;f.note(70,`SLOW LORRY  /  go round it`),f.car(150,4,9);for(let e=60;e<r-20;e+=64)f.pole(e,p);f.car(r-60,-4,-11),f.note(r-10,`JINK  /  left, then right`),f.note(i,`THE RIDGE  /  a long climb: keep the boost for it`),f.car(i+150,4,6),f.note(a+60,`BRIDGE OVER THE CREST  /  hold SPACE`),f.bridge(a+60,4.6,ff.Road),f.note(o,`DOWNHILL  /  brakes are weak, and a right at the bottom`),f.car(o+120,-4,-10);for(let e=i+30;e<s-30;e+=70)f.pole(e,-9.3);f.note(s-50,`TIGHT RIGHT  /  brake, hold Q to swing the tail wide`),f.car(c+50,-4),f.note(c+100,`ESS BEND  /  left, then right`),f.car(c+160,4),f.note(l+30,`LOW WIRES  /  hold SPACE to duck`),f.bridge(l+30,4.4,ff.Line),f.note(l+110,`NARROW BRIDGE  /  straight through the middle`),f.narrow(l+110,22),f.note(u-50,`TIGHT LEFT  /  brake, hold E to swing the tail wide`),f.car(u+60,4),f.car(u+120,-4,-12),f.car(u+200,4);for(let t=u+20;t<e.stopS-40;t+=64)f.pole(t,p);return f.note(e.stopS-120,`THE SITE  /  into the box`),f.finish(),Gf(e)}function $f(e,t,n){let r=new kf(e),i=Wf();i.name=n?`ENDLESS`:`OPEN ROAD ${e%1e3}`,i.blurb=n?`No site. The road goes on, the storm gets faster, and the run ends when it has you. Pay is by the mile.`:`A road no one has driven: new every day. Everything the other places have, in whatever order it comes.`,i.endless=n,i.payScale=1.25,i.stormSpeed=n?15:16.6;let a=r.int(0,2);i.desert=a===1,i.night=a===2,i.town=i.desert?`PHOENIX`:i.night?`DETROIT`:`OMAHA`;let o=new Hf(i,{x:r.range(-2e4,2e4),y:n?102e3:72e3}),s=new Uf(i),c=9.5,l=(e,t,n)=>{for(let r=0;r<i.points.length;r+=2)if(Math.abs(r*2-e)>60&&af(i.points[r].pos,t)<n*n)return!0;return!1};o.straight(260),s.note(150,`TRAFFIC  /  go round it`),s.car(170,4,9);let u=-1,d=()=>({points:i.points.length,obstacles:i.obstacles.length,notes:i.notes.length,bridges:i.bridges.length,narrows:i.narrows.length,jumps:i.jumps.length,winds:i.winds.length,waters:i.waters.length}),f=e=>{i.points.length=e.points,i.obstacles.length=e.obstacles,i.notes.length=e.notes,i.bridges.length=e.bridges,i.narrows.length=e.narrows,i.jumps.length=e.jumps,i.winds.length=e.winds,i.waters.length=e.waters,o.pos={...i.points[i.points.length-1].pos},o.yaw=i.points[i.points.length-1].yaw},p=e=>{let t=0xde0b6b3a7640000,n=tf(i.points[0].pos,G(cf(i.points[0].yaw),20));for(let r=e;r<i.points.length;r+=2){for(let e=0;e<r-125;e+=2)t=Math.min(t,af(i.points[r].pos,i.points[e].pos));t=Math.min(t,af(i.points[r].pos,n)-400)}return Math.sqrt(Math.max(t,0))},m=e=>p(e)<120;for(let e=0;e<t;e++){let t=e===0?0:r.int(0,10);t===u&&(t=(t+1)%11);let n=d(),a=i.points.length,h=uf(o.yaw-i.points[0].yaw),g=Math.abs(h)>1.2?-Math.sign(h):r.frand()>.5?1:-1;for(let e=0;e<12;e++){let h=o.s();switch(t){case 0:{o.straight(230);let e=[[ff.Road,`LOW BRIDGE  /  hold SPACE to duck the load`],[ff.Rail,`RAIL BRIDGE  /  hold SPACE`],[ff.Foot,`FOOTBRIDGE  /  hold SPACE`],[ff.Line,`LOW LINE  /  hold SPACE`],[ff.Tree,`LOW BRANCHES  /  hold SPACE`],[ff.Conveyor,`GRAIN CONVEYOR  /  hold SPACE`],[ff.Gantry,`GANTRY  /  hold SPACE`],[ff.Shed,`SNOW SHED  /  hold SPACE to duck`],[ff.Arch,`ROCK ARCH  /  hold SPACE to duck`]],[t,n]=e[r.int(0,e.length-1)];s.note(h+120,n),s.bridge(h+120,4.4,t),s.car(h+40,4,10);break}case 1:o.turn(g*90,r.range(30,40)),s.note(h,g>0?`TIGHT RIGHT  /  brake, hold Q to swing the tail wide`:`TIGHT LEFT  /  brake, hold E to swing the tail wide`),s.building(h+25,g*18,7,7,r.range(7,12));for(let e of[8,25,42])s.pole(h+e,-g*c);o.straight(60);break;case 2:{let e=r.range(70,120);o.turn(g*e,r.range(100,140)),s.note(h,g>0?`LONG RIGHT  /  poles on the outside`:`LONG LEFT  /  poles on the outside`);for(let e=h+20;e<o.s()-10;e+=34)s.pole(e,-g*c);s.car(h+70,4,11);break}case 3:o.straight(40),s.note(h+40,g>0?`HAIRPIN RIGHT  /  brake hard, hold Q all the way round`:`HAIRPIN LEFT  /  brake hard, hold E all the way round`),o.turn(g*160,34);for(let e of[20,45,70])s.pole(h+40+e,-g*c);o.straight(60);break;case 4:o.straight(50),s.note(h+50,g>0?`CHICANE  /  right, then left`:`CHICANE  /  left, then right`),o.turn(g*55,60),o.turn(-g*55,60),s.pole(h+60,-g*c),s.pole(o.s()-20,g*c),o.straight(40);break;case 5:o.straight(240),s.note(h+140,`NARROW BRIDGE  /  straight through the middle`),s.narrow(h+140,18);break;case 6:{o.straight(300);let e=h+200;l(e,Mf(i,e+13),110)?(s.note(h+150,`TRAFFIC  /  go round it`),s.car(h+160,4,10)):(s.note(e,`JUMP THE RIVER  /  45 mph or more, and keep it straight`),s.jump(e,26,60,60));break}case 7:o.straight(170),s.note(h+20,`PARKED CARS  /  keep to the middle`);for(let e=h+22;e<h+150;e+=r.range(14,26))s.car(e,(r.frand()>.5?1:-1)*5.7);s.building(h+50,19,22,6,r.range(7,11)),s.building(h+110,-19,24,6,r.range(7,11));break;case 8:o.straight(280),s.note(h+40,g>0?`WIND FROM THE RIGHT  /  keep right`:`WIND FROM THE LEFT  /  keep left`),s.wind(h+60,h+240,g*r.range(2.2,3.2)),s.pole(h+100,-g*c),s.pole(h+190,-g*c);break;case 9:o.straight(220),s.note(h+80,g>0?`ROCKFALL  /  keep left`:`ROCKFALL  /  keep right`);for(let e=0;e<4;e++)s.round(K.Pillar,h+110+e*22,g*r.range(4.4,6.2),r.range(1,1.6),1.8,[.32,.3,.28],!0);break;case 10:{o.straight(180);let e=h+110;s.note(e,`NARROW GATE  /  straight through the middle`);for(let t=e-48;t<=e-12;t+=12){let n=of(7.4,5.2,(t-(e-48))/36);s.cone(t,n),s.cone(t,-n)}s.barrier(e,5),s.barrier(e,-5),s.barrier(e+6,5),s.barrier(e+6,-5);break}}if(!m(a))break;if(f(n),g=-g,e%2==1&&(t=(t+1+r.int(0,9))%11,t=t===u?(t+1)%11:t),e===11){let e=0,n=240,r=-1;for(let t of[0,30,-30,60,-60,90,-90,120,-120,150,-150,180])for(let i of[240,420,640]){let s=d();t!==0&&o.turn(t,70),o.straight(i);let c=p(a);c>r&&(r=c,e=t,n=i),f(s)}e!==0&&o.turn(e,70),o.straight(n),s.note(o.s()-140,`TRAFFIC  /  go round it`),s.car(o.s()-120,4,10),t=7}}u=t,r.frand()<.4&&t!==6&&t!==5&&t!==10&&s.car(o.s()+150,-4,-11)}let h=d(),g=i.points.length,_=i.stopLength+70;{let e=0,t=-1;for(let n of[0,40,-40,80,-80,120,-120,160,-160]){n!==0&&o.turn(n,110),o.straight(380+_);let r=p(g);r>t&&(t=r,e=n),f(h)}e!==0&&o.turn(e,110),o.straight(380+_)}i.stopS=o.s()-_;let v=i.stopS-380;if(s.note(v+120,`SITE  /  brake and stop in the green box`),i.length=o.s(),i.parSeconds=i.length/17,!n)s.finish();else for(let e of[46])for(let t of[-1,1])s.round(K.Pillar,e,t*9.4,.35,9,[.03,.03,.035],!0);return i.notes.sort((e,t)=>e.s-t.s),Gf(i)}function ep(){return Math.floor(Date.now()/864e5)%1e5}var tp=new Map;function np(e){let t=Math.max(0,Math.min(8,e)),n=tp.get(t);return n||(n=[Kf,qf,Jf,Yf,Xf,Zf,Qf,()=>$f(ep(),11,!1),()=>$f(ep()+1,40,!0)][t](),tp.set(t,n)),n}var rp=[`FARM ROAD`,`THE PORT`,`MOUNTAIN PASS`,`DOWNTOWN`,`THE CANYON`,`THE COAST`,`MIDNIGHT RIDGE`,`OPEN ROAD`,`ENDLESS`],ip=1.3,ap=1.5,op=1.4,sp=.56,cp=.42,lp=1.25,up=.276,dp=9.81,fp=3.2,pp=1.7,mp=.22,hp=.4,gp=.3,_p=.25,vp=.07,yp=.06,bp=8,xp=60,Sp=4e4,Cp=.5,wp=3,Tp=2.6,Ep=.9,Dp=6,Op=8,kp=16,Ap=2.2,jp=1.6,Mp=4.5,Np=2.5,Pp=3,Fp=1.2,Ip=10,Lp=1500,Rp=1e3,zp=2500,Bp=.3,Vp=6,Hp=230,Up=420,Wp=20,Gp=600,Kp=6,qp=1.2,Jp=125,Yp=.34,Xp=.2,Zp=12,Qp=1.2,$p=.6,em=90,tm=35,nm=8e3,rm=2e4,im=25e3,am=2.5,om=30,sm=6,cm=7,lm=5.5,um=2.4,dm=1.2,fm=2.2,pm=.92,mm=1.6,hm=.9,gm=12,_m=.012,vm=2,ym=6e4,bm=30,xm=6,Sm=.09,Cm=110,wm=10,Tm=-7,Em=-6,Dm=5,Om=1.5,km=7,Am=.25,jm=1.8,Mm=.12,Nm=.03,Pm=.8,Fm=.4,Im=2.6,Lm=.12,Rm=.7,zm=.6,Bm=5,Vm=1.6,Hm=4,Um=3,Wm=.45,Gm=1.5,Km=1.5,qm=1.2,Jm=5,Ym=1.5,Xm=6e3,Zm=e=>.9+.03*e,Qm=e=>.8+.03*e,$m=e=>.5+.012*e,eh=e=>.9+.02*e,th=e=>e===`blade`||e===`rocket`,nh=e=>e===`transformer`||e===`house`,rh=[{name:`TURBINE BLADE`,blurb:`100 ft long and light. The one to learn on.`,dollyDist:20,loadEnd:30,rootRadius:1.5,tipRadius:.35,rootThickness:3.5,tipThickness:.8,boxy:!1,maxSpeed:26,boostSpeed:40,accel:5,brake:11,grip:7,damageScale:1,basePay:25e4,parFactor:1,stormPace:1,weight:.6,underside:1.7,color:[.88,.88,.86],sail:1,shape:`blade`},{name:`TRANSFORMER`,blurb:`Short, wide and very heavy. Slow to get going, slower to stop, and tall all the way along.`,dollyDist:9,loadEnd:12,rootRadius:2,tipRadius:1.9,rootThickness:3.9,tipThickness:3.7,boxy:!0,maxSpeed:25,boostSpeed:36,accel:3.6,brake:8.5,grip:6,damageScale:.7,basePay:3e5,parFactor:1.03,stormPace:.97,weight:1.4,underside:1.7,color:[.16,.3,.36],sail:.5,shape:`transformer`},{name:`ROCKET STAGE`,blurb:`150 ft long and fragile. The tail is a long way back, and every knock costs more.`,dollyDist:29,loadEnd:46,rootRadius:1.6,tipRadius:1.3,rootThickness:3.2,tipThickness:2.5,boxy:!1,maxSpeed:26,boostSpeed:38,accel:4.6,brake:10,grip:6.5,damageScale:1.6,basePay:38e4,parFactor:1.03,stormPace:1,weight:.9,underside:1.7,color:[.92,.92,.95],sail:.9,shape:`rocket`},{name:`HOUSE`,blurb:`As wide as a lane and a half, and low. Nothing goes under it: what is in the way has to be got round.`,dollyDist:11,loadEnd:15,rootRadius:3,tipRadius:3,rootThickness:3.8,tipThickness:3.8,boxy:!0,maxSpeed:24,boostSpeed:35,accel:4.2,brake:9,grip:6.2,damageScale:1.1,basePay:34e4,parFactor:1.08,stormPace:.94,weight:1.1,underside:1.4,color:[.86,.8,.66],sail:1.1,shape:`house`},{name:`EXCAVATOR`,blurb:`Wide, tall and very heavy, on a low bed. Slow to get going; nothing goes under it.`,dollyDist:12,loadEnd:16,rootRadius:2.3,tipRadius:2.3,rootThickness:3.6,tipThickness:3.6,boxy:!0,maxSpeed:23,boostSpeed:33,accel:3.6,brake:8.5,grip:5.8,damageScale:.8,basePay:33e4,parFactor:1.07,stormPace:.95,weight:1.7,underside:1.2,color:[.85,.58,.05],sail:.5,shape:`excavator`},{name:`YACHT`,blurb:`Tall, light and fragile. The wind takes it, every bridge is a duck, and every knock costs.`,dollyDist:14,loadEnd:20,rootRadius:2.2,tipRadius:.9,rootThickness:3.4,tipThickness:2.4,boxy:!1,maxSpeed:25,boostSpeed:36,accel:4.4,brake:9.5,grip:5.4,damageScale:1.5,basePay:36e4,parFactor:1.04,stormPace:.98,weight:.8,underside:1.3,color:[.95,.95,.97],sail:1.7,shape:`yacht`},{name:`TILT DECK`,blurb:`The recovery deck: low and quick empty, and whatever it carries once it is loaded.`,dollyDist:12,loadEnd:17,rootRadius:1.5,tipRadius:1.5,rootThickness:.5,tipThickness:.5,boxy:!0,maxSpeed:27,boostSpeed:40,accel:4.8,brake:10,grip:6.4,damageScale:1,basePay:0,parFactor:1,stormPace:1,weight:.7,underside:1.4,color:[.2,.2,.22],sail:.4,shape:`deck`}],ih=[{name:`COACH`,blurb:`A 45-foot coach, full height. Long and heavy on the deck.`,halfLength:6.2,height:3.6,weight:1.6,fee:24e4,color:[.75,.76,.8]},{name:`CAMPER`,blurb:`A motorhome: light, tall and wide. It rocks.`,halfLength:4.3,height:3.3,weight:1.1,fee:16e4,color:[.92,.9,.84]},{name:`SCHOOL BUS`,blurb:`The yellow one. Middling in every way.`,halfLength:5.6,height:3.2,weight:1.4,fee:19e4,color:[.95,.72,.05]},{name:`PICKUP`,blurb:`Dead on the shoulder. Short, light, quick up the deck.`,halfLength:2.9,height:1.9,weight:.5,fee:9e4,color:[.62,.1,.08]}],ah=.0015,oh=.55,sh=2500,ch=[{name:`MAMMOTH`,strengths:`the all-rounder`,speed:1,pull:1,brakes:1,grip:1,knocks:1,color:[.8,.42,.02]},{name:`BULL`,strengths:`stops, grips, tough. Slower`,speed:.93,pull:.95,brakes:1.2,grip:1.12,knocks:.75,color:[.05,.25,.12]},{name:`HORNET`,strengths:`fast. Fragile, poor brakes`,speed:1.1,pull:1.2,brakes:.88,grip:.93,knocks:1.25,color:[.85,.75,.02]}],lh=[{name:`SAFE`,headStartSeconds:8,mostLeadSeconds:12,payScale:1.2},{name:`TIGHT`,headStartSeconds:5,mostLeadSeconds:8,payScale:1.5},{name:`DARING`,headStartSeconds:3,mostLeadSeconds:5,payScale:2}];function uh(e,t,n){let r=sf((t-1)/(e.loadEnd-1),0,1);return e.underside+of(e.rootThickness,e.tipThickness,r)-n*ip}function dh(e,t){return of(e.rootRadius,e.tipRadius,sf((t-1)/(e.loadEnd-1),0,1))}var fh=()=>({throttle:0,brake:0,steer:0,tail:0,duck:!1,boost:!1,rescue:!1,fix:!1}),q=function(e){return e[e.Ready=0]=`Ready`,e[e.Countdown=1]=`Countdown`,e[e.Driving=2]=`Driving`,e[e.Lifting=3]=`Lifting`,e[e.Finished=4]=`Finished`,e}({}),J=function(e){return e[e.None=0]=`None`,e[e.CloseCall=1]=`CloseCall`,e[e.Threaded=2]=`Threaded`,e[e.Hit=3]=`Hit`,e[e.BridgeStrike=4]=`BridgeStrike`,e[e.Jackknife=5]=`Jackknife`,e[e.Overshot=6]=`Overshot`,e[e.StormHere=7]=`StormHere`,e[e.Air=8]=`Air`,e[e.Splash=9]=`Splash`,e[e.Rescue=10]=`Rescue`,e[e.BrokeDown=11]=`BrokeDown`,e[e.Patched=12]=`Patched`,e[e.Delivered=13]=`Delivered`,e[e.Train=14]=`Train`,e[e.BeatTrain=15]=`BeatTrain`,e[e.Weighed=16]=`Weighed`,e[e.BlewScale=17]=`BlewScale`,e[e.GotBoost=18]=`GotBoost`,e[e.GotRepair=19]=`GotRepair`,e[e.Fell=20]=`Fell`,e[e.Leapt=21]=`Leapt`,e[e.Wave=22]=`Wave`,e[e.Caught=23]=`Caught`,e[e.Sea=24]=`Sea`,e[e.Miss=25]=`Miss`,e[e.Bolt=26]=`Bolt`,e[e.Found=27]=`Found`,e[e.LinedUp=28]=`LinedUp`,e[e.Scrape=29]=`Scrape`,e[e.Loaded=30]=`Loaded`,e[e.Recovered=31]=`Recovered`,e}({}),ph=class{constructor(){this.phase=0,this.contract=0,this.truck=0,this.risk=0,this.time=0,this.countdown=0,this.hitch={x:0,y:0},this.yaw=0,this.speed=0,this.steer=0,this.trailerYaw=0,this.rearSteer=0,this.duck=0,this.s=0,this.lateral=0,this.offroad=!1,this.airborne=!1,this.airJump=0,this.airClock=0,this.airVz=0,this.height=0,this.inWater=!1,this.waterClock=0,this.waterJump=-1,this.offroadSeconds=0,this.stuckSeconds=0,this.lastKnockTime=-100,this.damage=0,this.hurt=[0,0,0],this.pull=0,this.breakdownLeft=0,this.breakdowns=0,this.boost=0,this.boosting=!1,this.stormS=0,this.inStorm=!1,this.beatStorm=!1,this.closeCalls=0,this.hits=0,this.chain=0,this.bestChain=0,this.bonusDollars=0,this.overshot=!1,this.lastCall=0,this.lastCallTime=-100,this.lastCallDollars=0,this.jumpFalls=[],this.lastTrainTime=-100,this.weighClock=0,this.weighed=!1,this.blewScale=!1,this.wading=!1,this.giftsTaken=[],this.ground=0,this.pitch=0,this.onShortcut=!1,this.blow=0,this.lastWaveTime=-100,this.caughtSeconds=0,this.caught=!1,this.falling=!1,this.fallClock=0,this.liftClock=0,this.craneX=0,this.craneV=0,this.loadX=0,this.loadVX=0,this.loadY=0,this.loadVY=0,this.liftHold=0,this.clangCool=0,this.setDown=!1,this.clangs=0,this.liftGust=0,this.breakdownS=0,this.breakdownLateral=0,this.foundBreakdown=!1,this.linedUp=!1,this.winch=0,this.winchSkew=0,this.loaded=!1,this.busDamage=0,this.towBill=0,this.lastScrapeTime=-100,this.scaleDollars=0,this.fallDollars=0}},mh=class{constructor(e){this.course=e,this.state=new ph,this.obstacles=[],this.tuned={...rh[0]},this.boostLasts=Pp,this.bridgeDone=[],this.jumpDone=[],this.nearestPoint=0,this.rescueHeld=!1,this.noStorm=!1,this.recovery=!1,this.broken=0,this.reset()}get rig(){return this.tuned}reset(){let e=this.course,t=this.state,n=new ph;n.contract=t.contract,n.truck=t.truck,n.risk=t.risk,this.state=n;let r=ch[n.truck];if(this.recovery){n.contract=6;let t=new kf(e.points.length*31+this.broken*7+5),r=-1e9;n.breakdownS=e.stopS*.55;for(let i=0;i<160;i++){let i=t.range(520,e.stopS-380),a=1e9,o=0,s=!1;for(let t=i-40;t<=i+40;t+=8)o=Math.max(o,Math.abs(Pf(e,t))*180),s||=Tf(e,Mf(e,t))!==0;for(let t of e.bridges)a=Math.min(a,Math.abs(t.s-i)-110);for(let t of e.narrows)a=Math.min(a,Math.max(t.s-60-i,i-(t.s+t.length+60)));for(let t of e.crossings)a=Math.min(a,Math.abs(t.s-i)-70);for(let t of e.scales)a=Math.min(a,Math.max(t.s-60-i,i-(t.s+t.length+60)));for(let t of e.jumps)t.shortcut||(a=Math.min(a,Math.max(t.s-330-i,i-(t.s+t.gap+60))));for(let t of e.shortcuts)a=Math.min(a,Math.max(t.fromS-60-i,i-(t.toS+60)));for(let t of e.obstacles)t.trafficSpeed===0&&t.lateral>=0&&t.lateral<60&&(a=Math.min(a,Math.abs(t.s-i)-Math.max(t.half.x,t.radius)-30));a-=o*60+(s?60:0),a>r&&(r=a,n.breakdownS=i)}n.breakdownLateral=10.2}this.tuned={...rh[n.contract]},this.tuned.basePay=Math.round(this.tuned.basePay*e.payScale/1e3)*1e3,this.tuned.maxSpeed*=r.speed,this.tuned.boostSpeed*=r.speed,this.tuned.accel*=r.pull,this.tuned.brake*=r.brakes,this.tuned.grip*=r.grip,this.tuned.damageScale*=r.knocks,this.boostLasts=Pp,n.s=34,n.lateral=4,n.hitch=Mf(e,34,4),n.yaw=Nf(e,34),n.trailerYaw=n.yaw,n.stormS=n.s-lh[n.risk].headStartSeconds*this.stormSpeed(),n.ground=wf(e,n.hitch),this.nearestPoint=17,this.obstacles=e.obstacles.map(e=>({s:e.s,lateral:e.lateral,pos:{...e.pos},yaw:e.yaw+(e.trafficSpeed<0?Math.PI:0),broken:!1,scored:!1,way:1,minGap:1e3,speedAtMinGap:0,lastHitTime:-100})),this.bridgeDone=e.bridges.map(()=>!1),this.jumpDone=e.jumps.map(()=>!1),n.jumpFalls=e.jumps.map(()=>0),n.giftsTaken=e.gifts.map(()=>!1)}start(){this.state.phase===0&&(this.state.phase=1,this.state.countdown=3)}stormSpeed(){return this.course.stormSpeed*this.rig.stormPace+(this.course.endless?this.state.time*Sm:0)}distancePay(){return this.course.endless?Math.round(Math.max(0,this.state.s-34)*Cm/100)*100:0}stormLeadSeconds(){return(this.state.s-this.state.stormS)/this.stormSpeed()}chainScale(){return Math.min(1+Cp*this.state.chain,wp)}parSeconds(){return this.course.parSeconds*this.rig.parFactor}timeBonus(){return this.state.phase===4?Math.max(0,Math.round((this.parSeconds()-this.state.time)*1500)):0}damageCost(){return Math.round(this.state.damage*1500)+this.state.breakdowns*Sp}stormBonus(){return Math.round(this.rig.basePay*(lh[this.state.risk].payScale-1))}recoveryFee(){return ih[this.broken].fee}pay(){let e=this.state;if(this.course.endless)return Math.max(0,this.distancePay()+e.bonusDollars-this.damageCost());if(this.recovery){let t=e.phase===4&&e.loaded?this.recoveryFee():0;return Math.max(0,t+e.bonusDollars-Math.round(e.towBill)-Math.round(e.busDamage)*sh-this.damageCost())}return Math.max(0,this.rig.basePay+e.bonusDollars+this.timeBonus()+(e.beatStorm?this.stormBonus():0)-this.damageCost()-(e.overshot?1e4:0))}grade(){if(this.course.endless){let e=(this.state.s-34)/1609;return e>=5?`S`:e>=3.5?`A`:e>=2.5?`B`:e>=1.5?`C`:`D`}let e=this.recovery?this.pay()/(this.recoveryFee()*.8):this.pay()/(this.rig.basePay+this.stormBonus()+25e3);return e>=1?`S`:e>=.9?`A`:e>=.75?`B`:e>=.55?`C`:`D`}breakdownPos(){return Mf(this.course,this.state.breakdownS,this.state.breakdownLateral)}breakdownYaw(){return Nf(this.course,this.state.breakdownS)}deckTail(){return tf(this.state.hitch,G(cf(this.state.trailerYaw),this.rig.loadEnd))}atTheBreakdown(){let e=this.state;return this.recovery&&!e.loaded&&Math.abs(e.s-e.breakdownS)<80}nextNote(){let e=this.state,t=null;for(let n of this.course.notes)if(n.s>e.s-14){if(n.s-e.s>230)break;let r=n.text;r.includes(`hold SPACE`)&&!this.mustDuckNear(n.s)&&(r=r.slice(0,r.indexOf(`/`))+`/  clear it, no need to duck`),t={text:r,distance:Math.max(0,n.s-e.s)};break}return this.recovery&&!e.loaded&&e.breakdownS-e.s>-14&&e.breakdownS-e.s<300&&(!t||e.breakdownS-e.s<t.distance+40)&&(t={text:`${ih[this.broken].name} BROKEN DOWN  /  right shoulder: pass her, back up`,distance:Math.max(0,e.breakdownS-e.s)}),t}mustDuckNear(e){for(let t of this.course.bridges)if(!(Math.abs(t.s-e)>30)){for(let e=1;e<=this.rig.loadEnd;e+=1)if(uh(this.rig,e,0)>t.clearance)return!0}return!1}shout(e,t=0){this.state.lastCall=e,this.state.lastCallTime=this.state.time,this.state.lastCallDollars=t}dent(e,t,n,r){let i=this.state;i.chain=0;let a=e*this.rig.damageScale;i.damage=Math.min(100,i.damage+a),i.hurt[t]+=a,t===0&&r!==0&&(i.pull=sf(i.pull+r*a*.04,-1,1)),i.damage>=100&&i.breakdownLeft<=0&&i.phase===2&&(i.breakdownLeft=bp,i.breakdowns++,this.shout(11))}step(e,t){let n=this.state;switch(n.phase){case 1:n.countdown-=t,n.countdown<=0&&(n.phase=2);break;case 2:n.time+=t,this.stepDriving(e,t);break;case 3:n.time+=t,this.stepLift(e,t)}this.rescueHeld=e.rescue}rescue(){let e=this.state,t=this.course;if(e.phase!==2||e.airborne)return;let n=sf(e.s,10,t.stopS-10);for(let r of t.jumps)r.shortcut?e.onShortcut&&n>r.s-Jp&&n<r.s+r.gap+6&&(n=r.putBackS):n>r.s-Jp&&n<r.s+r.gap+6&&(n=Math.max(10,r.s-Jp));this.putBack(n),this.shout(10)}putBack(e){let t=this.state,n=this.course;t.s=e,t.lateral=0,t.hitch=Mf(n,e),t.yaw=Nf(n,e),t.trailerYaw=t.yaw,t.speed=0,t.steer=0,t.rearSteer=0,t.height=0,t.offroad=!1,t.inWater=!1,t.offroadSeconds=0,t.stuckSeconds=0,t.onShortcut=!1,t.falling=!1,t.fallClock=0,t.airborne=!1,t.ground=wf(n,t.hitch),t.pitch=0,this.nearestPoint=Math.round(e/2)}project(){let e=this.course,t=this.state,n=this.nearestPoint,r=1/0;for(let i=Math.max(0,this.nearestPoint-12);i<=Math.min(e.points.length-1,this.nearestPoint+40);i++){let a=af(e.points[i].pos,t.hitch);a<r&&(r=a,n=i)}this.nearestPoint=n;let i=e.points[n],a=tf(t.hitch,i.pos);t.s=n*2+nf(a,cf(i.yaw)),t.lateral=nf(a,lf(i.yaw)),t.offroad=Math.abs(t.lateral)>11&&!Of(e,t.s,t.lateral)&&!(this.atTheBreakdown()&&t.lateral>0&&t.lateral<15),t.onShortcut=!1;for(let n of e.shortcuts){let r=tf(n.to,n.from),i=rf(r),a=G(r,1/i),o=tf(t.hitch,n.from),s=nf(o,a),c=nf(o,{x:-a.y,y:a.x});s<2||s>i-2||Math.abs(c)>n.halfWidth+12||Math.abs(c)>=Math.abs(t.lateral)||(t.onShortcut=!0,t.s=of(n.fromS,n.toS,s/i),t.lateral=c,t.offroad=Math.abs(c)>n.halfWidth+mm,this.nearestPoint=sf(Math.round(t.s/2),0,e.points.length-1))}}wayYaw(){let e=this.state;if(e.onShortcut){for(let t of this.course.shortcuts)if(e.s>=t.fromS&&e.s<=t.toS){let e=tf(t.to,t.from);return Math.atan2(e.y,e.x)}}return Nf(this.course,e.s)}stepDriving(e,t){let n=this.course,r=this.rig,i=this.state,a=i.s;i.rearSteer=df(i.rearSteer,sf(e.tail,-1,1)*cp,t,jp),i.duck=df(i.duck,+!!e.duck,t,e.duck?Mp:Np),i.boosting=e.boost&&i.boost>0&&e.throttle>.5,i.boosting&&(i.boost=Math.max(0,i.boost-t/this.boostLasts)),i.stormS=this.noStorm?-1e4:Math.max(i.stormS+this.stormSpeed()*t,i.s-lh[i.risk].mostLeadSeconds*this.stormSpeed());let o=i.stormS>i.s;o&&!i.inStorm&&this.shout(7),i.inStorm=o;let s=i.inStorm?Math.sin(i.time*1.7)+.6*Math.sin(i.time*4.3+1):0;if(n.endless&&(i.caughtSeconds=o?i.caughtSeconds+t:Math.max(0,i.caughtSeconds-t*.5),i.caughtSeconds>=xm)){i.phase=4,i.caught=!0,i.speed=0,i.boosting=!1,i.beatStorm=!1,this.shout(23);return}if(i.waterClock>0){let e=i.waterJump>=0?n.jumps[i.waterJump]:null;i.waterClock-=t,i.speed=0,i.boosting=!1;let a=i.falling?5.800000000000001-i.waterClock:fp-i.waterClock;if(i.height=-Math.min(e?e.depth:pp,pp+.5*dp*a**2),i.waterClock<=0){let t=e&&e.gorge?n.shortcuts.find(t=>e.s>t.fromS&&e.s<t.toS):void 0,a=e?e.gorge?i.jumpFalls[i.waterJump]<2||!t?e.putBackS:t.fromS+60:i.jumpFalls[i.waterJump]<2?Math.max(10,e.s-Jp):e.s+e.gap+r.loadEnd+12:i.s;if(t)for(let e=0;e<n.gifts.length;e++)n.gifts[e].s>t.fromS&&n.gifts[e].s<t.toS&&(i.giftsTaken[e]=!1);this.putBack(a),i.boost=Math.max(i.boost,.5),this.shout(10)}return}i.ground=wf(n,i.hitch);let c=i.airborne?0:Ef(n,i.hitch,i.yaw);i.pitch+=(Math.atan(c)-i.pitch)*Math.min(1,t*6);let l=i.boosting?r.boostSpeed:r.maxSpeed;if(i.duck>.3&&(l=Math.min(l,20)),i.inStorm&&(l=Math.min(l,21)),i.offroad&&(l=Math.min(l,15)),i.onShortcut&&(l*=pm),c>0&&(l*=Math.max(.35,1-um*c)),c<0&&(l*=1-dm*c),i.wading=!1,!i.airborne)for(let e of n.waters)Af(i.hitch,e.from,e.to)<e.half*e.half&&Math.abs(i.lateral)>e.clearHalf&&(i.wading=!0);i.wading&&(l=Math.min(l,sm),i.speed-=Math.sign(i.speed)*Math.min(Math.abs(i.speed),cm*t));for(let e=0;e<n.gifts.length;e++){let t=n.gifts[e];if(!i.giftsTaken[e]&&af(W(i.hitch,G(cf(i.yaw),4.3)),t.pos)<9){if(i.giftsTaken[e]=!0,t.repair){let e=i.damage;i.damage=Math.max(0,i.damage-om);for(let t=0;t<3;t++)i.hurt[t]*=e>0?i.damage/e:0;this.shout(19)}else i.boost=1,this.shout(18)}}let u=i.damage/100;l*=1-mp*u;let d=r.brake*(1-gp*u)*(c<0?Math.max(.5,1+fm*c):1),f=r.accel*(1-hp*u),p=r.grip*(1-_p*u),m=i.breakdownLeft>0;if(m&&(i.breakdownLeft-=t,i.boosting=!1,i.breakdownLeft<=0)){i.damage=xp;for(let e=0;e<3;e++)i.hurt[e]*=xp/100;i.pull*=.5,this.shout(12)}let h=m?0:sf(e.throttle,0,1)-sf(e.brake,0,1);i.airborne||(m?i.speed=Math.max(0,i.speed-d*.6*t):h>0?i.speed=i.speed<0?Math.min(0,i.speed+d*t):i.speed+f*(i.boosting?Tp:1)*h*Math.max(0,1-(i.speed/l)**2)*t:h<0?i.speed=i.speed>.3?Math.max(0,i.speed+d*h*t):Math.max(-5,i.speed+3*h*t):i.speed-=Math.sign(i.speed)*Math.min(Math.abs(i.speed),Ep*t)),!i.airborne&&!m&&i.speed>0&&(i.speed=Math.max(0,i.speed-c*lm*r.weight*t)),i.speed>l&&!i.airborne&&(i.speed=Math.max(l,i.speed-(i.offroad?Op:Dp)*t));let g=Math.max(Math.abs(i.speed),1),_=Math.min(sp,Math.atan(5*p/(g*g)));i.steer=sf(df(i.steer,i.airborne?0:sf(e.steer,-1,1)*_,t,Ap),-_,_);let v=G(cf(i.yaw),i.speed),y=Math.abs(i.speed)/r.maxSpeed,b=nf(v,lf(i.trailerYaw+i.rearSteer))/(r.dollyDist*Math.cos(i.rearSteer)),x=uf(i.yaw-i.trailerYaw),S=i.speed<0&&!i.airborne?b-2.5*Math.abs(i.speed)*Math.sin(x)/r.dollyDist:0,C=this.wayYaw();i.blow=i.airborne?0:Df(n,i.s,i.time,i.onShortcut);let w=.45+.55*Math.min(1,Math.abs(i.speed)/gm),T=i.blow*hm*r.sail*w;Math.abs(i.blow)>2.5&&i.time-i.lastWaveTime>3&&n.winds.some(e=>e.period>0&&i.s>e.fromS&&i.s<e.toS)&&(i.lastWaveTime=i.time,this.dent(vm,1,r.loadEnd*.5,Math.sign(i.blow)),this.shout(22));let E=i.airborne?0:i.speed*Math.tan(i.steer)/5+S+s*.03*y+i.pull*vp*y,D=b+s*.05+i.hurt[2]/100*yp*y*Math.sin(i.time*3.1)+T*_m*Math.cos(i.trailerYaw-C);i.yaw+=E*t,i.trailerYaw+=D*t,i.hitch=W(i.hitch,G(v,t)),T!==0&&(i.hitch=W(i.hitch,G(lf(C),T*t)));let O=uf(i.yaw-i.trailerYaw);Math.abs(O)>1.25&&(i.trailerYaw=i.yaw-Math.sign(O)*lp,i.speed>3&&(i.lastCall!==5||i.time-i.lastCallTime>1.5)&&(this.dent(4,0,.5,-Math.sign(O)),i.speed*=.5,i.hits++,this.shout(5))),this.project(),i.inWater=!1;for(let e=0;e<n.jumps.length;e++){let t=n.jumps[e];t.shortcut===i.onShortcut&&(!i.airborne&&a<t.s&&i.s>=t.s&&i.speed>Vp&&(i.airborne=!0,i.airJump=e,i.airClock=0,i.airVz=i.speed*up),!i.airborne&&i.s>t.s&&i.s<t.s+t.gap&&(this.jumpDone[e]=!0,i.jumpFalls[e]++,i.inWater=!0,i.waterJump=e,i.speed=0,i.boost=0,t.gorge?(i.falling=!0,i.fallClock=0,i.waterClock=5.800000000000001,i.height=-.5,this.dent(bm,0,-3,0),i.bonusDollars-=ym,i.fallDollars-=ym,i.hits++,this.shout(20,-6e4)):(i.waterClock=fp,i.height=-1.7,this.dent(20,0,-3,0),i.hits++,this.shout(9))))}if(i.airborne){if(i.airClock+=t,i.height=jf+i.airVz*i.airClock-.5*dp*i.airClock*i.airClock,i.height<=0){i.airborne=!1,i.height=0;let e=n.jumps[i.airJump];if(i.s>=e.s+e.gap&&!this.jumpDone[i.airJump]){this.jumpDone[i.airJump]=!0;let t=e.gorge?zp*3:zp;i.bonusDollars+=t,i.boost=Math.min(1,i.boost+Bp),this.shout(e.gorge?21:8,t)}}}else{i.height=0;for(let e of n.jumps){if(e.shortcut!==i.onShortcut)continue;let t=16*e.squeeze;i.s>e.s-t&&i.s<=e.s&&(i.height=jf*(i.s-(e.s-t))/t)}}n.coast&&!i.airborne&&!i.inWater&&Math.abs(i.lateral)>23&&i.s>60&&i.s<n.stopS-20&&(i.inWater=!0,i.waterJump=-1,i.waterClock=fp,i.speed=0,i.height=-1.7,this.dent(wm,0,-3,0),i.hits++,this.shout(24));for(let e=0;e<this.obstacles.length;e++){let r=n.obstacles[e],a=this.obstacles[e];if(r.swayWidth){let e=a.lateral;a.lateral=r.swayWidth*Math.sin(i.time*(r.swayRate??1)+(r.swayPhase??0)),a.pos=Mf(n,a.s,a.lateral),a.yaw=Nf(n,a.s)+(a.lateral>=e?Math.PI/2:-Math.PI/2)}else if(r.kind===K.Traffic&&!a.broken&&a.s>-60&&a.s<n.length){if(a.s-i.s<(r.trafficSpeed<0?Up:Hp)){let e=r.trafficSpeed*a.way;for(let t of n.jumps)(e>0&&a.s>t.s-14&&a.s<t.s||e<0&&a.s<t.s+t.gap+14&&a.s>t.s+t.gap)&&(a.way=-a.way);let o=Math.max(ap,this.rig.rootRadius)+r.half.y+.4,s=Math.abs(a.lateral-i.lateral)<o,c=e<0?a.s-r.half.x-(i.s+6):i.s-this.rig.loadEnd-1-(a.s+r.half.x);s&&c>-3&&c<7||(a.s+=r.trafficSpeed*a.way*t),a.yaw=Nf(n,a.s)+(r.trafficSpeed*a.way<0?Math.PI:0)}a.pos=Mf(n,a.s,a.lateral)}}if(i.airborne||this.collide(t),i.offroadSeconds=i.offroad&&!i.airborne?i.offroadSeconds+t:0,i.stuckSeconds=Math.abs(i.speed)<1.5&&i.s<n.stopS-5&&!this.atTheBreakdown()?i.stuckSeconds+t:0,e.rescue&&!this.rescueHeld||i.offroad&&i.stuckSeconds>Wp||Math.abs(i.lateral)>Gp)this.rescue();else{if(this.recovery){i.towBill+=this.recoveryFee()*ah*t;let n=ih[this.broken];if(!i.foundBreakdown&&af(i.hitch,this.breakdownPos())<3600&&(i.foundBreakdown=!0,this.shout(27)),!i.loaded){let r=this.breakdownYaw(),a=W(this.breakdownPos(),G(cf(r),n.halfLength)),o=Math.abs(i.speed)<.4,s=Math.abs(uf(i.trailerYaw-r))<.5&&Math.abs(uf(i.yaw-r))<.8,c=o&&s&&af(this.deckTail(),a)<121;c&&!i.linedUp&&this.shout(28),i.linedUp=c,c&&e.fix?(i.winchSkew+=(oh*(Math.sin(i.time*1.7)+.6*Math.sin(i.time*2.9+1))-1.5*e.steer)*t,i.winchSkew=sf(i.winchSkew,-1.4,1.4),Math.abs(i.winchSkew)>1?(i.busDamage+=3*t,i.time-i.lastScrapeTime>2&&(i.lastScrapeTime=i.time,this.shout(29))):i.winch=Math.min(1,i.winch+t/9),i.winch>=1&&(i.loaded=!0,i.winchSkew=0,this.tuned.rootThickness=n.height,this.tuned.tipThickness=n.height,this.tuned.weight=n.weight,this.tuned.maxSpeed*=.9,this.tuned.boostSpeed*=.9,this.tuned.accel*=.7,this.tuned.brake*=.85,this.tuned.grip*=.9,this.shout(30))):c||(i.winch=Math.max(0,i.winch-t*.5),i.winchSkew=df(i.winchSkew,0,t,1))}}for(let e of n.crossings){let n=i.s-e.s,a=Math.abs(i.lateral)<10;if(a&&n>-4&&n<r.loadEnd+4&&gf(e,i.time)&&i.time-i.lastTrainTime>2){i.lastTrainTime=i.time;let t=sf(n,0,r.loadEnd);this.dent(tm,n<5?0:t>r.dollyDist-2?2:1,t,1);let a=lf(e.yaw+e.skew);i.hitch=W(i.hitch,G(a,n<5?7:4));let o=nf(a,lf(i.trailerYaw))>0?.45:-.45;i.trailerYaw+=n<5?o*.4:o,i.speed*=.2,i.hits++,this.shout(14)}else if(a&&n>r.loadEnd+4&&n<r.loadEnd+4+Math.max(Math.abs(i.speed),1)*t*1.5&&_f(e,i.time)&&i.time-i.lastTrainTime>2){let e=Math.round(nm*this.chainScale());i.bonusDollars+=e,i.bestChain=Math.max(i.bestChain,++i.chain),this.shout(15,e)}}for(let e of n.scales){if(i.weighed||i.blewScale)break;Sf(e,i.s,i.lateral)&&Math.abs(i.speed)<.3?(i.weighClock+=t,i.weighClock>=am&&(i.weighed=!0,i.bonusDollars+=rm,i.scaleDollars+=rm,this.shout(16,rm))):i.weighClock=0,i.s>e.s+e.length+12&&!i.weighed&&(i.blewScale=!0,i.bonusDollars-=im,i.scaleDollars-=im,this.shout(17,-25e3))}n.endless?i.s>=n.stopS&&(i.phase=4,i.speed=0,i.boosting=!1,i.beatStorm=!i.inStorm,this.shout(13)):(i.s>n.stopS+n.stopLength&&(i.overshot||(i.overshot=!0,this.shout(6,-1e4)),i.speed=Math.max(0,i.speed-kp*t)),this.recovery?i.s>=n.stopS&&Math.abs(i.speed)<.6&&i.loaded&&(i.phase=4,i.speed=0,i.boosting=!1,i.beatStorm=!1,this.shout(31,this.recoveryFee())):i.s>=n.stopS&&Math.abs(i.speed)<.6&&(i.phase=3,i.speed=0,i.boosting=!1,i.beatStorm=!i.inStorm&&!this.noStorm,i.liftClock=0,i.craneX=Tm,i.craneV=0,i.loadX=Tm,i.loadVX=i.inStorm?3:1.5,i.loadY=th(r.shape)?Em:Dm,i.loadVY=0,i.liftHold=0,i.clangCool=0,i.setDown=!1,i.clangs=0,this.shout(13)))}}stepLift(e,t){let n=this.state,r=this.rig,i=this.course;n.stormS=this.noStorm?-1e4:n.stormS+this.stormSpeed()*t,n.stormS>n.s&&!n.inStorm&&(n.inStorm=!0,this.shout(7));let a=r.accel/5,o=!th(r.shape),s=nh(r.shape);n.liftClock+=t;let c=Math.min(1,Math.max(Math.abs(n.craneX),Math.abs(n.loadX))/Um),l=(1.2+.28*r.accel)*of(Wm,1,c);n.craneV=df(n.craneV,sf(e.steer,-1,1)*l,t,Bm),n.craneX=Math.min(n.craneX+n.craneV*t,2);let u=i.coast||i.desert?1.6:1,d=(n.inStorm?Rm:Lm*u)*a*Math.sin(2.3*n.liftClock+.5);if(n.liftGust=(n.inStorm?Im:Fm*u)*a*(Math.sin(1.3*n.liftClock)+.6*Math.sin(3.1*n.liftClock+1)),n.setDown=o&&n.setDown&&e.throttle<=0,n.setDown)n.loadVX=0,n.loadVY=0;else{let r=o?of(Wm,1,sf(n.loadY/Gm,0,1)):1;n.loadVY=df(n.loadVY,(sf(e.throttle,0,1)-sf(e.brake,0,1))*Vm*r+d,t,Hm),n.loadY=Math.min(n.loadY+n.loadVY*t,o?km:Om);let i=Math.min(Pm,Mm+Nm*n.liftClock);n.loadVX+=(-1.8*jm*(n.loadX-n.craneX)-2*i*jm*n.loadVX+n.liftGust)*t,n.loadX+=n.loadVX*t}n.clangCool=Math.max(0,n.clangCool-t),s&&n.loadX>Am&&(n.loadVX>Zm(n.liftClock)?(++n.clangs<=Jm&&this.dent(3,1,1.5,0),n.loadVX*=-.6,o||(n.loadY-=Km,n.loadVY=-1),n.clangCool=.8,n.liftHold=0,this.shout(25)):n.loadVX=Math.min(n.loadVX,0),n.loadX=Am),o&&!n.setDown&&n.loadY<=0&&(n.loadY=0,n.loadVY<-Qm(n.liftClock)?(++n.clangs<=Jm&&this.dent(3,1,3,0),n.loadVY=qm,n.clangCool=.8,n.liftHold=0,this.shout(25)):(n.loadVX=0,n.loadVY=0,n.setDown=!0));let f=$m(n.liftClock);if(n.liftHold=(o?n.setDown&&(s?n.loadX>-f:Math.abs(n.loadX)<f):Math.abs(n.loadX)<f&&Math.abs(n.loadY)<f&&Math.abs(n.loadVX)<eh(n.liftClock))?n.liftHold+t:Math.max(0,n.liftHold-zm*t),n.liftHold>=1.5){n.phase=4,n.loadX=0,n.loadY=0,n.loadVX=0,n.loadVY=0;let e=n.clangs===0?Xm:0;n.bonusDollars+=e,this.shout(26,e)}}gapTo(e,t,n){if(e.radius>0){let r=tf(n,t.pos),i=rf(r);return{gap:i-e.radius,away:i>.001?G(r,1/i):{x:1,y:0}}}let r=cf(t.yaw),i=lf(t.yaw),a=tf(n,t.pos),o={x:nf(a,r),y:nf(a,i)},s=tf(o,{x:sf(o.x,-e.half.x,e.half.x),y:sf(o.y,-e.half.y,e.half.y)}),c=rf(s);if(c>.001)return{gap:c,away:W(G(r,s.x/c),G(i,s.y/c))};let l=e.half.x-Math.abs(o.x),u=e.half.y-Math.abs(o.y);return{gap:-Math.min(l,u),away:l<u?G(r,Math.sign(o.x)):G(i,Math.sign(o.y))}}collide(e){let t=this.course,n=this.rig,r=this.state,i=cf(r.yaw),a=G(cf(r.trailerYaw),-1),o=[W(r.hitch,G(i,1.2)),W(r.hitch,G(i,4.3))],s=W(r.hitch,G(a,n.dollyDist)),c=n.underside-r.duck*ip,l=Math.abs(r.speed);for(let i=0;i<this.obstacles.length;i++){let u=t.obstacles[i],d=this.obstacles[i];if(d.broken||Math.abs(d.s-r.s)>em&&af(d.pos,r.hitch)>8100)continue;let f=1e3,p={x:0,y:0};for(let e of o){let{gap:t,away:n}=this.gapTo(u,d,e),r=t-ap;f=Math.min(f,r),r<0&&(p=tf(p,G(n,r)))}let m=0,h=n.dollyDist,g={x:0,y:0};{let{gap:e,away:t}=this.gapTo(u,d,s),n=e-op;f=Math.min(f,n),n<0&&(m=-n,g=t)}if(u.height>c)for(let e=1;e<=n.loadEnd;e+=2){let{gap:t,away:i}=this.gapTo(u,d,W(r.hitch,G(a,e))),o=t-dh(n,e);f=Math.min(f,o),-o>m&&(m=-o,h=e,g=i)}f<d.minGap&&(d.minGap=f,d.speedAtMinGap=l);let _=Math.abs(p.x)>1e-6||Math.abs(p.y)>1e-6,v=m>0;if(_||v){let t=r.time-d.lastHitTime>$p&&(!u.solid||r.time-r.lastKnockTime>qp);d.lastHitTime=r.time;let i=_?0:h>n.dollyDist-2?2:1,a=_?nf(tf(d.pos,r.hitch),cf(r.yaw)):h,o=Math.sign(nf(tf(d.pos,r.hitch),lf(_?r.yaw:r.trailerYaw)));if(u.solid){if(_&&(r.hitch=W(r.hitch,p),t?(this.dent(sf(l*.35,1,9),i,a,o),r.speed*=.35):(r.speed-=Math.sign(r.speed)*sf(l-Kp,0,9*e),this.dent(.25*l*e,i,a,o))),v){let n=-nf(g,lf(r.trailerYaw))*m/h;r.trailerYaw+=sf(n,-.05,.05),r.speed-=Math.sign(r.speed)*Math.min(l,6*e),this.dent(.3*l*e+(t?3:0),_?1:i,_?h:a,o)}t&&(r.hits++,this.shout(3)),r.lastKnockTime=r.time}else{d.broken=!0;let e=0,t=1;switch(u.kind){case K.Sign:e=1,t=.97;break;case K.Bollard:e=2,t=.92;break;case K.Pole:e=4,t=.88;break;case K.Board:e=5,t=.85;break;case K.Bin:e=2,t=.9;break;case K.Stall:e=3,t=.86;break;case K.ParkedCar:e=6,t=.7;break;case K.Traffic:e=8,t=.6}this.dent(e,i,a,o),r.speed*=t,e>0&&(r.hits++,this.shout(3))}}let y=r.s-n.loadEnd-4-u.half.x;if(!d.scored&&!d.broken&&d.s<y&&(d.scored=!0,u.kind!==K.Cone&&u.kind!==K.Sign&&u.kind!==K.Bollard&&u.kind!==K.Wall&&d.lastHitTime<0&&d.minGap<Fp&&d.speedAtMinGap>Ip)){r.closeCalls++;let e=Math.round(Lp*this.chainScale());r.bonusDollars+=e,r.boost=Math.min(1,r.boost+Yp),r.bestChain=Math.max(r.bestChain,++r.chain),this.shout(1,e)}}let u=Math.abs(r.lateral)<14;for(let e=0;e<t.bridges.length;e++){if(this.bridgeDone[e])continue;let i=t.bridges[e],a=!1,o=1;for(let e=1;e<=n.loadEnd&&!a;e+=1)a=u&&Math.abs(r.s-e-i.s)<Qp&&uh(n,e,r.duck)>i.clearance,o=e;if(a)this.bridgeDone[e]=!0,this.dent(12,1,o,0),r.speed*=.55,r.hits++,this.shout(4);else if(r.s-n.loadEnd>i.s+2&&(this.bridgeDone[e]=!0,l>Zp&&u)){let e=Math.round(Rp*this.chainScale());r.bonusDollars+=e,r.boost=Math.min(1,r.boost+Xp),r.bestChain=Math.max(r.bestChain,++r.chain),this.shout(2,e)}}}},hh=(e,t,n)=>Math.max(t,Math.min(n,e)),gh=e=>hh(e,-1,1),_h=5.5,vh=2.2;function yh(e,t){if(e.radius>0)return e.radius;let n=e.yaw-t;return Math.abs(Math.cos(n))*e.half.y+Math.abs(Math.sin(n))*e.half.x}function bh(e,t={}){let n=fh(),r=e.state,i=e.course,a=e.rig;if(r.phase===q.Lifting){let e=th(a.shape),t=nh(a.shape)?-.2:0;n.steer=gh((t-r.loadX)*1.2-r.loadVX*1.6-r.craneV*.2);let i=(e?0:Math.abs(r.loadX-t)<.6&&Math.abs(r.loadVX)<.5?-1:2)-r.loadY;return n.throttle=i>.15?Math.min(1,i):0,n.brake=i<-.15?Math.min(1,-i*(e?1:.5)):0,n}if(r.phase!==q.Driving)return n;let o=null;if(t.shortcuts)for(let e of i.shortcuts){let t=i.jumps.findIndex(t=>t.gorge&&t.s>e.fromS&&t.s<e.toS),n=t>=0&&(r.jumpFalls[t]>=2||r.inStorm&&!r.onShortcut);r.s>e.fromS-40&&r.s<e.toS-10&&!n&&(o=e)}let s=o?Math.atan2(o.to.y-o.from.y,o.to.x-o.from.x):Nf(i,r.s),c=o?G(tf(o.to,o.from),1/rf(tf(o.to,o.from))):null,l=c?{x:-c.y,y:c.x}:null,u=o?nf(tf(W(r.hitch,G(cf(r.yaw),5)),o.from),c):0,d=o?0:4;for(let e=0;e<=70&&!o;e+=6){let t=Pf(i,r.s+e);if(Math.abs(t)>1/50){d=-Math.sign(t)*4;break}}for(let e=0;e<=60&&!o;e+=10){let t=0;for(let n of i.winds)!n.shortcut&&r.s+e>n.fromS&&r.s+e<n.toS&&Math.abs(n.push)>Math.abs(t)&&(t=n.push);if(Math.abs(t)>1){d=-Math.sign(t)*4;break}}let f=a.rootRadius>ap+.6,p=o?[0,o.halfWidth*.45,-o.halfWidth*.45,o.halfWidth*.25,-o.halfWidth*.25,o.halfWidth*.65,-o.halfWidth*.65]:[4,0,-4,2.64,1.32,-1.32,-2.64,6.5,-6.5],m=d,h=1/0,g=1e3,_=!1,v=!1,y=1e3,b=t=>{m=d,h=1/0;for(let n=0;n<(f||o?p.length:3);n++){let b=p[n],x=Math.abs(b-d)*.3+Math.abs(b-r.lateral)*.05,S=1e3;for(let n=0;n<e.obstacles.length;n++){let d=i.obstacles[n],p=e.obstacles[n];if(p.broken||d.kind===0)continue;let m=p.s-r.s,h=p.lateral;if(o){let e=tf(p.pos,o.from);if(h=nf(e,l),m=nf(e,c)-u,Math.abs(h)>o.halfWidth+3)continue}else if(Math.abs(p.lateral)>9)continue;if(t&&d.trafficSpeed>0&&!d.swayWidth&&m>0||m<-a.loadEnd-6||m>(d.trafficSpeed<0?130:60))continue;let g=f&&d.height>a.underside?a.rootRadius+.8:ap+.7;d.trafficSpeed<0&&m>0&&(v=!0),d.trafficSpeed>0&&!d.swayWidth&&m>0&&m<45&&(y=Math.min(y,d.trafficSpeed-(m<16?2:0)));let C=Math.abs(h-b)-yh(d,s)-g;if(d.swayWidth){let e=Math.max(Math.abs(r.speed),4);C=1e3;for(let t of[-7,-3,0,4,10]){let n=r.time+Math.max(m+t,0)/e,i=d.swayWidth*Math.sin(n*(d.swayRate??1)+(d.swayPhase??0));C=Math.min(C,Math.abs(i-b)-d.half.x-(ap+.9))}m>6&&m<60&&(_=!0)}C<0&&(x+=100-C*10,S=Math.min(S,Math.max(m,0)))}x<h&&(h=x,m=b,g=S)}};b(!1);let x=f&&v&&h>=100,S=f&&!x&&h>=100&&y<999;S&&b(!0);let C=1/0;if(e.recovery&&!r.loaded){let t=ih[e.broken],o=r.breakdownS+t.halfLength+a.loadEnd+2.5;if(r.linedUp)return n.fix=!0,n.steer=gh(r.winchSkew*2),n;if(r.s>r.breakdownS-150){if(r.s>r.breakdownS+t.halfLength+4&&(m=r.breakdownLateral),C=o+22,(r.speed<-.05||Math.abs(r.speed)<.5&&r.s>o+4)&&r.s>o+.6){let t=uf(r.trailerYaw-Nf(i,r.s));n.steer=gh(-(r.breakdownLateral-xh(e))*.3-t*2);let a=Math.min(4,Math.max(.6,(r.s-o)*.5));return r.speed>-a?n.brake=1:n.throttle=.4,n}if(r.s>o-4&&r.s<=o+4&&Math.abs(r.speed)<1.5)return r.speed<-.05?n.throttle=1:r.speed>.05&&(n.brake=1),n}}let w=!1,T=0;for(let n of i.scales){let i=r.s<vf(n)||Math.abs(r.lateral-n.lateral)<2.4;(t.weigh??!0)&&!r.weighed&&!r.blewScale&&r.s>n.s-110&&r.s<vf(n)+30&&i&&(e.stormLeadSeconds()>11||xf(n,r.s,r.lateral))&&(w=!0,r.s>n.s-24&&(m=n.lateral),T=vf(n)+12)}let E=10+.7*Math.abs(r.speed),D;if(o){let e=tf(o.to,o.from),t=rf(e),n=G(e,1/t),i=hh(nf(tf(W(r.hitch,G(cf(r.yaw),5)),o.from),n)+E,0,t+30);D=W(W(o.from,G(n,i)),G(l,m))}else D=Mf(i,r.s+E,m);let O=tf(D,W(r.hitch,G(cf(r.yaw),5))),ee=Df(i,r.s,r.time,r.onShortcut),k=Math.atan2(ee*.9*a.sail,Math.max(Math.abs(r.speed),12));n.steer=gh(uf(Math.atan2(O.y,O.x)-r.yaw-k)/.2);let te=0;for(let e=0;e<=150;e+=10)te=Math.max(te,-Ef(i,Mf(i,r.s+e),Nf(i,r.s+e)));let ne=Math.max(1.5,a.brake*Math.max(.5,1-vh*te)-_h*te*a.weight),A=a.maxSpeed,j=!0;for(let e=0;e<=150&&!o;e+=4){let t=Math.abs(Pf(i,r.s+e));t>1e-4&&(j=!1,A=Math.min(A,Math.sqrt(a.grip*.72/t+2*ne*.62*e)))}_&&h>=100&&(A=Math.min(A,5)),x?A=Math.min(A,g<18?0:5):S&&(A=Math.min(A,y));for(let e of i.narrows)r.s>e.s-60&&r.s<e.s+e.length&&(A=Math.min(A,14));let re=w;for(let e of i.crossings){let t=e.s-r.s;if(t>-2&&t<120&&_f(e,r.time)){let n=hf(e,r.time);(n<-10?(-n-10)/e.speed:0)<(t+a.loadEnd+8)/Math.max(Math.abs(r.speed),1)+1.5&&(A=Math.min(A,Math.max(0,(t-9)*.5)),re=!0)}}w&&(A=Math.min(A,hh(Math.sqrt(Math.max(T-r.s,0)*4),0,9))),C<1/0&&(re=!0,A=Math.min(A,hh(Math.sqrt(Math.max(C-r.s,0)*3),0,12)));let M=!1;for(let e=0;e<=60+2*a.loadEnd&&!M;e+=6)M=Math.abs(Pf(i,r.s+e))>1/50;for(let t=0;M&&t<e.obstacles.length;t++){let n=e.obstacles[t].s-r.s-9,a=i.obstacles[t];a.trafficSpeed>0&&!a.swayWidth&&!e.obstacles[t].broken&&n>-6&&n<45&&(A=Math.min(A,a.trafficSpeed+Math.max(0,n)*.25))}let ie=i.stopS+16-r.s;i.endless||(A=Math.min(A,Math.sqrt(Math.max(0,2*ne*.5*ie))));let ae=!1;for(let e of i.jumps){if(e.shortcut!==!!(o||r.onShortcut))continue;let t=e.s-r.s;if(t<-2||t>220)continue;let n=!0;for(let e=0;e<=t&&!o;e+=4)Math.abs(Pf(i,r.s+e))>1e-4&&(n=!1);n&&(ae=!0,A=Math.max(A,a.maxSpeed))}let oe=!1;for(let e of i.bridges){let t=-1;for(let n=1;n<=a.loadEnd;n+=1)uh(a,n,0)>e.clearance&&(t=n);if(t<0)continue;let i=r.s-e.s;i>-(8+Math.abs(r.speed)*.5)&&i<t+3&&(n.duck=!0),i>-120&&i<t+3&&(oe=!0),i>-90&&i<10&&(A=Math.min(A,20))}let se=1/0;for(let e of i.jumps)e.gorge&&r.onShortcut&&(se=Math.min(se,(e.s-r.s)/e.squeeze));let ce=se>75&&se<400;n.boost=r.boost>.25&&(j||ae)&&!oe&&(i.endless||ie>250)&&!re&&!ce,n.boost&&(A=a.boostSpeed),r.speed<A-.4?n.throttle=1:r.speed>A+.8&&(n.brake=hh((r.speed-A)/3,.25,1)),A<.5&&Math.abs(r.speed)>.05&&(n.throttle=0,n.brake=1),n.rescue=r.breakdownLeft<=0&&A>=.5&&!(e.recovery&&e.atTheBreakdown())&&(r.stuckSeconds>6&&r.time-r.lastKnockTime<2||r.stuckSeconds>15);let le=uf(r.yaw-r.trailerYaw),ue=3*hh(20/a.dollyDist,.3,1)**2;return n.tail=Math.abs(le)>.05?gh(-le*ue):0,n}function xh(e){let t=e.deckTail(),n=e.state.s-e.rig.loadEnd;return nf(tf(t,Mf(e.course,n)),lf(Nf(e.course,n)))}var Sh={name:`CopyShader`,uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`},Ch=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error(`THREE.Pass: .render() must be implemented in derived pass.`)}dispose(){}},wh=new uc(-1,1,1,-1,0,1),Th=new class extends Pr{constructor(){super(),this.setAttribute(`position`,new Sr([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute(`uv`,new Sr([0,2,0,0,2,0],2))}},Eh=class{constructor(e){this._mesh=new H(Th,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,wh)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}},Dh=class extends Ch{constructor(e,t=`tDiffuse`){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof as?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=ns.clone(e.uniforms),this.material=new as({name:e.name===void 0?`unspecified`:e.name,defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new Eh(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},Oh=class extends Ch{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let r=e.getContext(),i=e.state;i.buffers.color.setMask(!1),i.buffers.depth.setMask(!1),i.buffers.color.setLocked(!0),i.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),i.buffers.stencil.setTest(!0),i.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),i.buffers.stencil.setFunc(r.ALWAYS,a,4294967295),i.buffers.stencil.setClear(o),i.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),i.buffers.color.setLocked(!1),i.buffers.depth.setLocked(!1),i.buffers.color.setMask(!0),i.buffers.depth.setMask(!0),i.buffers.stencil.setLocked(!1),i.buffers.stencil.setFunc(r.EQUAL,1,4294967295),i.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),i.buffers.stencil.setLocked(!0)}},kh=class extends Ch{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}},Ah=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new R);this._width=n.width,this._height=n.height,t=new en(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:_}),t.texture.name=`EffectComposer.rt1`}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name=`EffectComposer.rt2`,this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Dh(Sh),this.copyPass.material.blending=0,this.timer=new bc}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let t=0,r=this.passes.length;t<r;t++){let r=this.passes[t];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(t),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),r.needsSwap){if(n){let t=this.renderer.getContext(),n=this.renderer.state.buffers.stencil;n.setFunc(t.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),n.setFunc(t.EQUAL,1,4294967295)}this.swapBuffers()}Oh!==void 0&&(r instanceof Oh?n=!0:r instanceof kh&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new R);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(n,r),this.renderTarget2.setSize(n,r);for(let e=0;e<this.passes.length;e++)this.passes[e].setSize(n,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}},jh=class extends Ch{constructor(e,t,n=null,r=null,i=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=r,this.clearAlpha=i,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new V}render(e,t,n){let r=e.autoClear;e.autoClear=!1;let i,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(i=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==1&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(i),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=r}},Mh={name:`LuminosityHighPassShader`,uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new V(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`},Nh=class e extends Ch{constructor(e,t=1,n,r){super(),this.strength=t,this.radius=n,this.threshold=r,this.resolution=e===void 0?new R(256,256):new R(e.x,e.y),this.clearColor=new V(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new en(i,a,{type:_,depthBuffer:!1}),this.renderTargetBright.texture.name=`UnrealBloomPass.bright`,this.renderTargetBright.texture.generateMipmaps=!1;for(let e=0;e<this.nMips;e++){let t=new en(i,a,{type:_,depthBuffer:!1});t.texture.name=`UnrealBloomPass.h`+e,t.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(t);let n=new en(i,a,{type:_,depthBuffer:!1});n.texture.name=`UnrealBloomPass.v`+e,n.texture.generateMipmaps=!1,this.renderTargetsVertical.push(n),i=Math.round(i/2),a=Math.round(a/2)}let o=Mh;this.highPassUniforms=ns.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new as({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];let s=[6,10,14,18,22];i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let e=0;e<this.nMips;e++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(s[e])),this.separableBlurMaterials[e].uniforms.invSize.value=new R(1/i,1/a),i=Math.round(i/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new z(1,1,1),new z(1,1,1),new z(1,1,1),new z(1,1,1),new z(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=ns.clone(Sh.uniforms),this.blendMaterial=new as({uniforms:this.copyUniforms,vertexShader:Sh.vertexShader,fragmentShader:Sh.fragmentShader,premultipliedAlpha:!0,blending:2,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new V,this._oldClearAlpha=1,this._basic=new di,this._fsQuad=new Eh(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),r=Math.round(t/2);this.renderTargetBright.setSize(n,r);for(let e=0;e<this.nMips;e++)this.renderTargetsHorizontal[e].setSize(n,r),this.renderTargetsVertical[e].setSize(n,r),this.separableBlurMaterials[e].uniforms.invSize.value=new R(1/n,1/r),n=Math.round(n/2),r=Math.round(r/2)}render(t,n,r,i,a){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();let o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),a&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=r.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=r.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let s=this.renderTargetBright;for(let n=0;n<this.nMips;n++)this._fsQuad.material=this.separableBlurMaterials[n],this.separableBlurMaterials[n].uniforms.colorTexture.value=s.texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[n]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[n].uniforms.colorTexture.value=this.renderTargetsHorizontal[n].texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[n]),t.clear(),this._fsQuad.render(t),s=this.renderTargetsVertical[n];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(r),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=o}_getSeparableBlurMaterial(e){let t=[],n=e/3;for(let r=0;r<e;r++)t.push(.39894*Math.exp(-.5*r*r/(n*n))/n);let r=[],i=[];for(let n=1;n<e;n+=2){let a=t[n],o=n+1<e?t[n+1]:0,s=a+o;r.push((n*a+(n+1)*o)/s),i.push(s)}return new as({defines:{KERNEL_PAIRS:r.length},uniforms:{colorTexture:{value:null},invSize:{value:new R(.5,.5)},direction:{value:new R(.5,.5)},centerWeight:{value:t[0]},gaussianOffsets:{value:r},gaussianWeights:{value:i}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float centerWeight;
				uniform float gaussianOffsets[KERNEL_PAIRS];
				uniform float gaussianWeights[KERNEL_PAIRS];

				void main() {

					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * centerWeight;

					for ( int i = 0; i < KERNEL_PAIRS; i ++ ) {

						vec2 uvOffset = direction * invSize * gaussianOffsets[ i ];
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * gaussianWeights[ i ];

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new as({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}};Nh.BlurDirectionX=new R(1,0),Nh.BlurDirectionY=new R(0,1);var Ph={name:`OutputShader`,uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

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

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`},Fh=class extends Ch{constructor(){super(),this.isOutputPass=!0,this.uniforms=ns.clone(Ph.uniforms),this.material=new os({name:Ph.name,uniforms:this.uniforms,vertexShader:Ph.vertexShader,fragmentShader:Ph.fragmentShader}),this._fsQuad=new Eh(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Vt.getTransfer(this._outputColorSpace)===`srgb`&&(this.material.defines.SRGB_TRANSFER=``),this._toneMapping===1?this.material.defines.LINEAR_TONE_MAPPING=``:this._toneMapping===2?this.material.defines.REINHARD_TONE_MAPPING=``:this._toneMapping===3?this.material.defines.CINEON_TONE_MAPPING=``:this._toneMapping===4?this.material.defines.ACES_FILMIC_TONE_MAPPING=``:this._toneMapping===6?this.material.defines.AGX_TONE_MAPPING=``:this._toneMapping===7?this.material.defines.NEUTRAL_TONE_MAPPING=``:this._toneMapping===5&&(this.material.defines.CUSTOM_TONE_MAPPING=``),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},Ih=new Ta(1,1,1),Lh=new Ea(.5,.5,1,18),Rh=new Da(.5,1,12),zh=new Yo(.5,12,8),Bh=new Map;function Vh(e,t=!1,n=0){let r=`${e.join(`,`)}|${t}|${n}`,i=Bh.get(r);return i||(i=new ss({color:new V(e[0],e[1],e[2]),roughness:t?.35:.85,metalness:t?.3:0}),n>0&&(i.emissive=new V(e[0],e[1],e[2]),i.emissiveIntensity=n),Bh.set(r,i)),i}function Hh(e,t,n,r,i){e.position.set(t,r,n),e.rotation.set(0,-i,0)}function Y(e,t,n,r,i,a,o,s,c=!1,l=!0){let u=new H(Ih,Vh(s,c));return u.position.set(t,r,n),u.scale.set(i,o,a),u.castShadow=l,u.receiveShadow=!0,e.add(u),u}function X(e,t,n,r,i,a,o,s,c=!1){let l=new H(Lh,Vh(s,c));return l.position.set(t,r,n),l.scale.set(i,a,i),o===`x`&&(l.rotation.z=Math.PI/2),o===`y`&&(l.rotation.x=Math.PI/2),l.castShadow=!0,l.receiveShadow=!0,e.add(l),l}function Uh(e,t,n,r,i,a,o,s,c=!1){let l=new H(new Ea(a*.5,i*.5,o,18),Vh(s,c));return l.position.set(t,r,n),l.rotation.z=Math.PI/2,l.castShadow=!0,l.receiveShadow=!0,e.add(l),l}function Wh(e,t,n,r,i,a,o){let s=new H(Rh,Vh(o));return s.position.set(t,r+a*.5,n),s.scale.set(i,a,i),s.castShadow=!0,e.add(s),s}function Gh(e,t,n,r,i,a){let o=new H(zh,Vh(a));return o.position.set(t,r,n),o.scale.set(i,i,i),o.castShadow=!0,e.add(o),o}function Kh(e,t,n,r,i,a,o,s,c=2){let l=new H(Ih,Vh(s,!1,c));return l.position.set(t,r,n),l.scale.set(i,o,a),e.add(l),l}var qh=new Map,Jh=new Map;function Yh(e,t,n,r,i,a,o,s,c,l=[1,1,1],u=!0){let d=`${i.toFixed(2)}|${a.toFixed(2)}|${o.toFixed(2)}|${c}`,f=Jh.get(d);if(!f){f=new Ta(i,o,a);let e=f.getAttribute(`uv`),t=[[a,o],[a,o],[i,a],[i,a],[i,o],[i,o]];for(let n=0;n<6;n++)for(let r=0;r<4;r++){let i=n*4+r;e.setXY(i,e.getX(i)*t[n][0]/c,e.getY(i)*t[n][1]/c)}e.needsUpdate=!0,Jh.set(d,f)}let p=`${s.name}|${l.join(`,`)}`,m=qh.get(p);m||(m=new ss({map:s.map,normalMap:s.normalMap,color:new V(l[0],l[1],l[2]),roughness:.9}),qh.set(p,m));let h=new H(f,m);return h.position.set(t,r,n),h.castShadow=u,h.receiveShadow=!0,e.add(h),h}function Xh(e,t){let n=document.createElement(`canvas`);n.width=e,n.height=e;let r=n.getContext(`2d`),i=12345;return t(r,()=>(i=i*1103515245+12345&2147483647,i/2147483647)),n}function Zh(e,n,r){let i=new xa(e);return i.wrapS=i.wrapT=t,i.repeat.set(n,r),i.anisotropy=8,i.colorSpace=He,i}function Qh(){return Zh(Xh(512,(e,t)=>{e.fillStyle=`#36363a`,e.fillRect(0,0,512,512);for(let n=0;n<26e3;n++){let n=40+Math.floor(t()*45);e.fillStyle=`rgb(${n},${n},${n+2})`,e.fillRect(t()*512,t()*512,1+t()*2,1+t()*2)}for(let n=0;n<40;n++)e.fillStyle=`rgba(0,0,0,${.05+t()*.1})`,e.beginPath(),e.ellipse(t()*512,t()*512,20+t()*60,8+t()*20,t()*3,0,Math.PI*2),e.fill()}),1,1)}function $h(){return Zh(Xh(256,(e,t)=>{e.fillStyle=`#6b6252`,e.fillRect(0,0,256,256);for(let n=0;n<9e3;n++){let n=80+Math.floor(t()*60);e.fillStyle=`rgb(${n+10},${n},${n-15})`,e.fillRect(t()*256,t()*256,1+t()*2,1+t()*2)}}),1,1)}function eg(){let e=new xa(Xh(256,(e,t)=>{e.clearRect(0,0,256,256);for(let n=0;n<28;n++){let n=60+t()*136,r=90+t()*76,i=28+t()*40,a=e.createRadialGradient(n,r,0,n,r,i);a.addColorStop(0,`rgba(255,255,255,0.55)`),a.addColorStop(1,`rgba(255,255,255,0)`),e.fillStyle=a,e.fillRect(0,0,256,256)}}));return e.colorSpace=He,e}function tg(e,t=`#f5b400`,n=`#0a0a0c`,r=64){let i=document.createElement(`canvas`),a=i.getContext(`2d`);a.font=`900 ${r}px "Archivo Black", Impact, sans-serif`;let o=Math.ceil(a.measureText(e).width)+r;i.width=Math.min(2048,o),i.height=r*1.6;let s=i.getContext(`2d`);s.fillStyle=n,s.fillRect(0,0,i.width,i.height),s.fillStyle=t,s.font=`900 ${r}px "Archivo Black", Impact, sans-serif`,s.textAlign=`center`,s.textBaseline=`middle`,s.fillText(e,i.width/2,i.height/2+r*.05);let c=new xa(i);return c.colorSpace=He,c.aspect=i.width/i.height,c}function ng(e){let t=new Gs().load(e);return t.colorSpace=He,t}function rg(e,t=`#f5b400`){let n=document.createElement(`canvas`);n.width=256,n.height=128;let r=n.getContext(`2d`);r.fillStyle=`#0a0a0c`,r.fillRect(0,0,256,128),r.fillStyle=t,r.font=`900 64px "Archivo Black", Impact, sans-serif`,r.textAlign=`center`,r.textBaseline=`middle`,r.fillText(e,128,68);let i=new xa(n);return i.colorSpace=He,i}var ig=new Map;function ag(e){let n=ig.get(e);if(!n){let r=new Gs,i=`/play/`,a=r.load(`${i}tex/${e}_diff.jpg`);a.colorSpace=He;let o=r.load(`${i}tex/${e}_nor.jpg`);for(let e of[a,o])e.wrapS=e.wrapT=t,e.anisotropy=8;n={name:e,map:a,normalMap:o},ig.set(e,n)}return n}function og(e){e.onBeforeCompile=e=>{e.fragmentShader=e.fragmentShader.replace(`#include <map_fragment>`,`
      #ifdef USE_MAP
        vec4 tileA = texture2D( map, vMapUv );
        vec4 tileB = texture2D( map, vMapUv * 0.27 + vec2( 0.37, 0.71 ) );
        float landShade = texture2D( map, vMapUv * 0.021 + vec2( 0.13, 0.29 ) ).g;
        vec4 sampledDiffuseColor = mix( tileA, tileB, 0.45 ) * ( 0.78 + 0.44 * landShade );
        diffuseColor *= sampledDiffuseColor;
      #endif`)},e.customProgramCacheKey=()=>`anti-tile`}function sg(e,t=!1){let n=e[0].index!==null,r=new Set(Object.keys(e[0].attributes)),i=new Set(Object.keys(e[0].morphAttributes)),a={},o={},s=e[0].morphTargetsRelative,c=new Pr,l=0;for(let u=0;u<e.length;++u){let d=e[u],f=0;if(n!==(d.index!==null))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.`),null;for(let e in d.attributes){if(!r.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure "`+e+`" attribute exists among all geometries, or in none of them.`),null;a[e]===void 0&&(a[e]=[]),a[e].push(d.attributes[e]),f++}if(f!==r.size)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. Make sure all geometries have the same number of attributes.`),null;if(s!==d.morphTargetsRelative)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. .morphTargetsRelative must be consistent throughout all geometries.`),null;for(let e in d.morphAttributes){if(!i.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`.  .morphAttributes must be consistent throughout all geometries.`),null;o[e]===void 0&&(o[e]=[]),o[e].push(d.morphAttributes[e])}if(t){let e;if(n)e=d.index.count;else if(d.attributes.position!==void 0)e=d.attributes.position.count;else return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. The geometry must have either an index or a position attribute`),null;c.addGroup(l,e,u),l+=e}}if(n){let t=0,n=[];for(let r=0;r<e.length;++r){let i=e[r].index;for(let e=0;e<i.count;++e)n.push(i.getX(e)+t);t+=e[r].attributes.position.count}c.setIndex(n)}for(let e in a){let t=cg(a[e]);if(!t)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` attribute.`),null;c.setAttribute(e,t)}for(let e in o){let t=o[e][0].length;if(t!==0){c.morphAttributes=c.morphAttributes||{},c.morphAttributes[e]=[];for(let n=0;n<t;++n){let t=[];for(let r=0;r<o[e].length;++r)t.push(o[e][r][n]);let r=cg(t);if(!r)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` morphAttribute.`),null;c.morphAttributes[e].push(r)}}}return c}function cg(e){let t,n,r,i=-1,a=0;for(let o=0;o<e.length;++o){let s=e[o];if(t===void 0&&(t=s.array.constructor),t!==s.array.constructor)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.`),null;if(n===void 0&&(n=s.itemSize),n!==s.itemSize)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.`),null;if(r===void 0&&(r=s.normalized),r!==s.normalized)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.`),null;if(i===-1&&(i=s.gpuType),i!==s.gpuType)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes.`),null;a+=s.count*n}let o=new t(a),s=new yr(o,n,r),c=0;for(let t=0;t<e.length;++t){let r=e[t];if(r.isInterleavedBufferAttribute){let e=c/n;for(let t=0,i=r.count;t<i;t++)for(let i=0;i<n;i++){let n=r.getComponent(t,i);s.setComponent(t+e,i,n)}}else o.set(r.array,c);c+=r.count*n}return i!==void 0&&(s.gpuType=i),s}function lg(e,t){if(t===0)return console.warn(`THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles.`),e;if(t===2||t===1){let n=e.getIndex();if(n===null){let t=[],r=e.getAttribute(`position`);if(r!==void 0){for(let e=0;e<r.count;e++)t.push(e);e.setIndex(t),n=e.getIndex()}else return console.error(`THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible.`),e}let r=n.count-2,i=[];if(t===2)for(let e=1;e<=r;e++)i.push(n.getX(0)),i.push(n.getX(e)),i.push(n.getX(e+1));else for(let e=0;e<r;e++)e%2==0?(i.push(n.getX(e)),i.push(n.getX(e+1)),i.push(n.getX(e+2))):(i.push(n.getX(e+2)),i.push(n.getX(e+1)),i.push(n.getX(e)));return i.length/3!==r&&console.error(`THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.`),e.setIndex(i),e.clearGroups(),e}return console.error(`THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:`,t),e}function ug(e){let t=new Map,n=new Map,r=e.clone();return dg(e,r,function(e,r){t.set(r,e),n.set(e,r)}),r.traverse(function(e){if(!e.isSkinnedMesh)return;let r=e,i=t.get(e),a=i.skeleton.bones;r.skeleton=i.skeleton.clone(),r.bindMatrix.copy(i.bindMatrix),r.skeleton.bones=a.map(function(e){return n.get(e)}),r.bind(r.skeleton,r.bindMatrix)}),r}function dg(e,t,n){n(e,t);for(let r=0;r<e.children.length;r++)dg(e.children[r],t.children[r],n)}var fg=class extends zs{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(e){return new yg(e)}),this.register(function(e){return new bg(e)}),this.register(function(e){return new kg(e)}),this.register(function(e){return new Ag(e)}),this.register(function(e){return new jg(e)}),this.register(function(e){return new Sg(e)}),this.register(function(e){return new Cg(e)}),this.register(function(e){return new wg(e)}),this.register(function(e){return new Tg(e)}),this.register(function(e){return new vg(e)}),this.register(function(e){return new Eg(e)}),this.register(function(e){return new xg(e)}),this.register(function(e){return new Og(e)}),this.register(function(e){return new Dg(e)}),this.register(function(e){return new gg(e)}),this.register(function(e){return new Mg(e,hg.EXT_MESHOPT_COMPRESSION)}),this.register(function(e){return new Mg(e,hg.KHR_MESHOPT_COMPRESSION)}),this.register(function(e){return new Ng(e)})}load(e,t,n,r){let i=this,a;if(this.resourcePath!==``)a=this.resourcePath;else if(this.path!==``){let t=pc.extractUrlBase(e);a=pc.resolveURL(t,this.path)}else a=pc.extractUrlBase(e);this.manager.itemStart(e);let o=function(t){r?r(t):console.error(t),i.manager.itemError(e),i.manager.itemEnd(e)},s=new Hs(this.manager);s.setPath(this.path),s.setResponseType(`arraybuffer`),s.setRequestHeader(this.requestHeader),s.setWithCredentials(this.withCredentials),s.load(e,function(n){try{i.parse(n,a,function(n){t(n),i.manager.itemEnd(e)},o)}catch(e){o(e)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,r){let i,a={},o={},s=new TextDecoder;if(typeof e==`string`)i=JSON.parse(e);else if(e instanceof ArrayBuffer){if(s.decode(new Uint8Array(e,0,4))===Pg){try{a[hg.KHR_BINARY_GLTF]=new Lg(e)}catch(e){r&&r(e);return}i=JSON.parse(a[hg.KHR_BINARY_GLTF].content)}else i=JSON.parse(s.decode(e))}else i=e;if(i.asset===void 0||i.asset.version[0]<2){r&&r(Error(`THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported.`));return}let c=new l_(i,{path:t||this.resourcePath||``,crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let e=0;e<this.pluginCallbacks.length;e++){let t=this.pluginCallbacks[e](c);t.name||console.error(`THREE.GLTFLoader: Invalid plugin found: missing name`),o[t.name]=t,a[t.name]=!0}if(i.extensionsUsed)for(let e=0;e<i.extensionsUsed.length;++e){let t=i.extensionsUsed[e],n=i.extensionsRequired||[];switch(t){case hg.KHR_MATERIALS_UNLIT:a[t]=new _g;break;case hg.KHR_DRACO_MESH_COMPRESSION:a[t]=new Rg(i,this.dracoLoader);break;case hg.KHR_TEXTURE_TRANSFORM:a[t]=new zg;break;case hg.KHR_MESH_QUANTIZATION:a[t]=new Bg;break;default:n.indexOf(t)>=0&&o[t]===void 0&&console.warn(`THREE.GLTFLoader: Unknown extension "`+t+`".`)}}c.setExtensions(a),c.setPlugins(o),c.parse(n,r)}parseAsync(e,t){let n=this;return new Promise(function(r,i){n.parse(e,t,r,i)})}};function pg(){let e={};return{get:function(t){return e[t]},add:function(t,n){e[t]=n},remove:function(t){delete e[t]},removeAll:function(){e={}}}}function mg(e,t,n){let r=e.json.materials[t];return r.extensions&&r.extensions[n]?r.extensions[n]:null}var hg={KHR_BINARY_GLTF:`KHR_binary_glTF`,KHR_DRACO_MESH_COMPRESSION:`KHR_draco_mesh_compression`,KHR_LIGHTS_PUNCTUAL:`KHR_lights_punctual`,KHR_MATERIALS_CLEARCOAT:`KHR_materials_clearcoat`,KHR_MATERIALS_DISPERSION:`KHR_materials_dispersion`,KHR_MATERIALS_IOR:`KHR_materials_ior`,KHR_MATERIALS_SHEEN:`KHR_materials_sheen`,KHR_MATERIALS_SPECULAR:`KHR_materials_specular`,KHR_MATERIALS_TRANSMISSION:`KHR_materials_transmission`,KHR_MATERIALS_IRIDESCENCE:`KHR_materials_iridescence`,KHR_MATERIALS_ANISOTROPY:`KHR_materials_anisotropy`,KHR_MATERIALS_UNLIT:`KHR_materials_unlit`,KHR_MATERIALS_VOLUME:`KHR_materials_volume`,KHR_TEXTURE_BASISU:`KHR_texture_basisu`,KHR_TEXTURE_TRANSFORM:`KHR_texture_transform`,KHR_MESH_QUANTIZATION:`KHR_mesh_quantization`,KHR_MATERIALS_EMISSIVE_STRENGTH:`KHR_materials_emissive_strength`,EXT_MATERIALS_BUMP:`EXT_materials_bump`,EXT_TEXTURE_WEBP:`EXT_texture_webp`,EXT_TEXTURE_AVIF:`EXT_texture_avif`,EXT_MESHOPT_COMPRESSION:`EXT_meshopt_compression`,KHR_MESHOPT_COMPRESSION:`KHR_meshopt_compression`,EXT_MESH_GPU_INSTANCING:`EXT_mesh_gpu_instancing`},gg=class{constructor(e){this.parser=e,this.name=hg.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,r=t.length;n<r;n++){let r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n=`light:`+e,r=t.cache.get(n);if(r)return r;let i=t.json,a=((i.extensions&&i.extensions[this.name]||{}).lights||[])[e],o,s=new V(16777215);a.color!==void 0&&s.setRGB(a.color[0],a.color[1],a.color[2],Ue);let c=a.range===void 0?0:a.range;switch(a.type){case`directional`:o=new fc(s),o.target.position.set(0,0,-1),o.add(o.target);break;case`point`:o=new lc(s),o.distance=c;break;case`spot`:o=new sc(s),o.distance=c,a.spot=a.spot||{},a.spot.innerConeAngle=a.spot.innerConeAngle===void 0?0:a.spot.innerConeAngle,a.spot.outerConeAngle=a.spot.outerConeAngle===void 0?Math.PI/4:a.spot.outerConeAngle,o.angle=a.spot.outerConeAngle,o.penumbra=1-a.spot.innerConeAngle/a.spot.outerConeAngle,o.target.position.set(0,0,-1),o.add(o.target);break;default:throw Error(`THREE.GLTFLoader: Unexpected light type: `+a.type)}return o.position.set(0,0,0),t_(o,a),a.intensity!==void 0&&(o.intensity=a.intensity),o.name=t.createUniqueName(a.name||`light_`+e),r=Promise.resolve(o),t.cache.add(n,r),r}getDependency(e,t){if(e===`light`)return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,r=n.json.nodes[e],i=(r.extensions&&r.extensions[this.name]||{}).light;return i===void 0?null:this._loadLight(i).then(function(e){return n._getNodeRef(t.cache,i,e)})}},_g=class{constructor(){this.name=hg.KHR_MATERIALS_UNLIT}getMaterialType(){return di}extendParams(e,t,n){let r=[];e.color=new V(1,1,1),e.opacity=1;let i=t.pbrMetallicRoughness;if(i){if(Array.isArray(i.baseColorFactor)){let t=i.baseColorFactor;e.color.setRGB(t[0],t[1],t[2],Ue),e.opacity=t[3]}i.baseColorTexture!==void 0&&r.push(n.assignTexture(e,`map`,i.baseColorTexture,He))}return Promise.all(r)}},vg=class{constructor(e){this.parser=e,this.name=hg.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let n=mg(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}},yg=class{constructor(e){this.parser=e,this.name=hg.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return mg(this.parser,e,this.name)===null?null:cs}extendMaterialParams(e,t){let n=mg(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&r.push(this.parser.assignTexture(t,`clearcoatMap`,n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&r.push(this.parser.assignTexture(t,`clearcoatRoughnessMap`,n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(r.push(this.parser.assignTexture(t,`clearcoatNormalMap`,n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){let e=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new R(e,e)}return Promise.all(r)}},bg=class{constructor(e){this.parser=e,this.name=hg.KHR_MATERIALS_DISPERSION}getMaterialType(e){return mg(this.parser,e,this.name)===null?null:cs}extendMaterialParams(e,t){let n=mg(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion===void 0?0:n.dispersion),Promise.resolve()}},xg=class{constructor(e){this.parser=e,this.name=hg.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return mg(this.parser,e,this.name)===null?null:cs}extendMaterialParams(e,t){let n=mg(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&r.push(this.parser.assignTexture(t,`iridescenceMap`,n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&r.push(this.parser.assignTexture(t,`iridescenceThicknessMap`,n.iridescenceThicknessTexture)),Promise.all(r)}},Sg=class{constructor(e){this.parser=e,this.name=hg.KHR_MATERIALS_SHEEN}getMaterialType(e){return mg(this.parser,e,this.name)===null?null:cs}extendMaterialParams(e,t){let n=mg(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];if(t.sheenColor=new V(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){let e=n.sheenColorFactor;t.sheenColor.setRGB(e[0],e[1],e[2],Ue)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&r.push(this.parser.assignTexture(t,`sheenColorMap`,n.sheenColorTexture,He)),n.sheenRoughnessTexture!==void 0&&r.push(this.parser.assignTexture(t,`sheenRoughnessMap`,n.sheenRoughnessTexture)),Promise.all(r)}},Cg=class{constructor(e){this.parser=e,this.name=hg.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return mg(this.parser,e,this.name)===null?null:cs}extendMaterialParams(e,t){let n=mg(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&r.push(this.parser.assignTexture(t,`transmissionMap`,n.transmissionTexture)),Promise.all(r)}},wg=class{constructor(e){this.parser=e,this.name=hg.KHR_MATERIALS_VOLUME}getMaterialType(e){return mg(this.parser,e,this.name)===null?null:cs}extendMaterialParams(e,t){let n=mg(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];t.thickness=n.thicknessFactor===void 0?0:n.thicknessFactor,n.thicknessTexture!==void 0&&r.push(this.parser.assignTexture(t,`thicknessMap`,n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;let i=n.attenuationColor||[1,1,1];return t.attenuationColor=new V().setRGB(i[0],i[1],i[2],Ue),Promise.all(r)}},Tg=class{constructor(e){this.parser=e,this.name=hg.KHR_MATERIALS_IOR}getMaterialType(e){return mg(this.parser,e,this.name)===null?null:cs}extendMaterialParams(e,t){let n=mg(this.parser,e,this.name);return n===null||(t.ior=n.ior===void 0?1.5:n.ior,t.ior===0&&(t.ior=1e3)),Promise.resolve()}},Eg=class{constructor(e){this.parser=e,this.name=hg.KHR_MATERIALS_SPECULAR}getMaterialType(e){return mg(this.parser,e,this.name)===null?null:cs}extendMaterialParams(e,t){let n=mg(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];t.specularIntensity=n.specularFactor===void 0?1:n.specularFactor,n.specularTexture!==void 0&&r.push(this.parser.assignTexture(t,`specularIntensityMap`,n.specularTexture));let i=n.specularColorFactor||[1,1,1];return t.specularColor=new V().setRGB(i[0],i[1],i[2],Ue),n.specularColorTexture!==void 0&&r.push(this.parser.assignTexture(t,`specularColorMap`,n.specularColorTexture,He)),Promise.all(r)}},Dg=class{constructor(e){this.parser=e,this.name=hg.EXT_MATERIALS_BUMP}getMaterialType(e){return mg(this.parser,e,this.name)===null?null:cs}extendMaterialParams(e,t){let n=mg(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];return t.bumpScale=n.bumpFactor===void 0?1:n.bumpFactor,n.bumpTexture!==void 0&&r.push(this.parser.assignTexture(t,`bumpMap`,n.bumpTexture)),Promise.all(r)}},Og=class{constructor(e){this.parser=e,this.name=hg.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return mg(this.parser,e,this.name)===null?null:cs}extendMaterialParams(e,t){let n=mg(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&r.push(this.parser.assignTexture(t,`anisotropyMap`,n.anisotropyTexture)),Promise.all(r)}},kg=class{constructor(e){this.parser=e,this.name=hg.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,r=n.textures[e];if(!r.extensions||!r.extensions[this.name])return null;let i=r.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw Error(`THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures`);return null}return t.loadTextureImage(e,i.source,a)}},Ag=class{constructor(e){this.parser=e,this.name=hg.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,n=this.parser,r=n.json,i=r.textures[e];if(!i.extensions||!i.extensions[t])return null;let a=i.extensions[t],o=r.images[a.source],s=n.textureLoader;if(o.uri){let e=n.options.manager.getHandler(o.uri);e!==null&&(s=e)}return n.loadTextureImage(e,a.source,s)}},jg=class{constructor(e){this.parser=e,this.name=hg.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,n=this.parser,r=n.json,i=r.textures[e];if(!i.extensions||!i.extensions[t])return null;let a=i.extensions[t],o=r.images[a.source],s=n.textureLoader;if(o.uri){let e=n.options.manager.getHandler(o.uri);e!==null&&(s=e)}return n.loadTextureImage(e,a.source,s)}},Mg=class{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let e=n.extensions[this.name],r=this.parser.getDependency(`buffer`,e.buffer),i=this.parser.options.meshoptDecoder;if(!i||!i.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw Error(`THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files`);return null}return r.then(function(t){let n=e.byteOffset||0,r=e.byteLength||0,a=e.count,o=e.byteStride,s=new Uint8Array(t,n,r);return i.decodeGltfBufferAsync?i.decodeGltfBufferAsync(a,o,s,e.mode,e.filter).then(function(e){return e.buffer}):i.ready.then(function(){let t=new ArrayBuffer(a*o);return i.decodeGltfBuffer(new Uint8Array(t),a,o,s,e.mode,e.filter),t})})}return null}},Ng=class{constructor(e){this.name=hg.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let r=t.meshes[n.mesh];for(let e of r.primitives)if(e.mode!==Wg.TRIANGLES&&e.mode!==Wg.TRIANGLE_STRIP&&e.mode!==Wg.TRIANGLE_FAN&&e.mode!==void 0)return null;let i=n.extensions[this.name].attributes,a=[],o={};for(let e in i)a.push(this.parser.getDependency(`accessor`,i[e]).then(t=>(o[e]=t,o[e])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(e=>{let t=e.pop(),n=t.isGroup?t.children:[t],r=e[0].count,i=[];for(let e of n){let t=new B,n=new z,a=new Nt,s=new z(1,1,1),c=new Ji(e.geometry,e.material,r);for(let e=0;e<r;e++)o.TRANSLATION&&n.fromBufferAttribute(o.TRANSLATION,e),o.ROTATION&&a.fromBufferAttribute(o.ROTATION,e),o.SCALE&&s.fromBufferAttribute(o.SCALE,e),c.setMatrixAt(e,t.compose(n,a,s));let l=null;for(let e in o)if(e===`_COLOR_0`){let t=o[e];c.instanceColor=new Bi(t.array,t.itemSize,t.normalized)}else if(e!==`TRANSLATION`&&e!==`ROTATION`&&e!==`SCALE`){if(l===null){let e=c.geometry;l=new Pr,l.name=e.name;for(let t in e.attributes)l.setAttribute(t,e.attributes[t]);for(let t in e.morphAttributes)l.morphAttributes[t]=e.morphAttributes[t];e.index!==null&&l.setIndex(e.index),l.morphTargetsRelative=e.morphTargetsRelative;for(let t of e.groups)l.addGroup(t.start,t.count,t.materialIndex);e.boundingBox!==null&&(l.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(l.boundingSphere=e.boundingSphere.clone()),l.drawRange.start=e.drawRange.start,l.drawRange.count=e.drawRange.count,l.userData=Object.assign({},e.userData),c.geometry=l}let t=o[e];l.setAttribute(e,new Bi(t.array,t.itemSize,t.normalized))}An.prototype.copy.call(c,e),this.parser.assignFinalMaterial(c),i.push(c)}return t.isGroup?(t.clear(),t.add(...i),t):i[0]}))}},Pg=`glTF`,Fg=12,Ig={JSON:1313821514,BIN:5130562},Lg=class{constructor(e){this.name=hg.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,Fg),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Pg)throw Error(`THREE.GLTFLoader: Unsupported glTF-Binary header.`);if(this.header.version<2)throw Error(`THREE.GLTFLoader: Legacy binary file detected.`);let r=this.header.length-Fg,i=new DataView(e,Fg),a=0;for(;a<r;){let t=i.getUint32(a,!0);a+=4;let r=i.getUint32(a,!0);if(a+=4,r===Ig.JSON){let r=new Uint8Array(e,Fg+a,t);this.content=n.decode(r)}else if(r===Ig.BIN){let n=Fg+a;this.body=e.slice(n,n+t)}a+=t}if(this.content===null)throw Error(`THREE.GLTFLoader: JSON content not found.`)}},Rg=class{constructor(e,t){if(!t)throw Error(`THREE.GLTFLoader: No DRACOLoader instance provided.`);this.name=hg.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,r=this.dracoLoader,i=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},s={},c={};for(let e in a){let t=Yg[e]||e.toLowerCase();o[t]=a[e]}for(let t in e.attributes){let r=Yg[t]||t.toLowerCase();if(a[t]!==void 0){let i=n.accessors[e.attributes[t]];c[r]=Gg[i.componentType].name,s[r]=i.normalized===!0}}return t.getDependency(`bufferView`,i).then(function(e){return new Promise(function(t,n){r.decodeDracoFile(e,function(e){for(let t in e.attributes){let n=e.attributes[t],r=s[t];r!==void 0&&(n.normalized=r)}t(e)},o,c,Ue,n)})})}},zg=class{constructor(){this.name=hg.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){if((t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0)return e;if(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),t.rotation!==void 0){let t=Math.cos(e.rotation),n=Math.sin(e.rotation);e.matrix.set(e.repeat.x*t,e.repeat.y*n,e.offset.x,-e.repeat.x*n,e.repeat.y*t,e.offset.y,0,0,1),e.matrixAutoUpdate=!1}return e.needsUpdate=!0,e}},Bg=class{constructor(){this.name=hg.KHR_MESH_QUANTIZATION}},Vg=class extends gs{constructor(e,t,n,r){super(e,t,n,r)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r*3+r;for(let e=0;e!==r;e++)t[e]=n[i+e];return t}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=o*2,c=o*3,l=r-t,u=(n-t)/l,d=u*u,f=d*u,p=e*c,m=p-c,h=-2*f+3*d,g=f-d,_=1-h,v=g-d+u;for(let e=0;e!==o;e++){let t=a[m+e+o],n=a[m+e+s]*l,r=a[p+e+o],c=a[p+e]*l;i[e]=_*t+v*n+h*r+g*c}return i}},Hg=new Nt,Ug=class extends Vg{interpolate_(e,t,n,r){let i=super.interpolate_(e,t,n,r);return Hg.fromArray(i).normalize().toArray(i),i}},Wg={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},Gg={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Kg={9728:i,9729:s,9984:a,9985:c,9986:o,9987:l},qg={33071:n,33648:r,10497:t},Jg={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Yg={POSITION:`position`,NORMAL:`normal`,TANGENT:`tangent`,TEXCOORD_0:`uv`,TEXCOORD_1:`uv1`,TEXCOORD_2:`uv2`,TEXCOORD_3:`uv3`,COLOR_0:`color`,WEIGHTS_0:`skinWeight`,JOINTS_0:`skinIndex`},Xg={scale:`scale`,translation:`position`,rotation:`quaternion`,weights:`morphTargetInfluences`},Zg={CUBICSPLINE:void 0,LINEAR:Fe,STEP:P},Qg={OPAQUE:`OPAQUE`,MASK:`MASK`,BLEND:`BLEND`};function $g(e){return e.DefaultMaterial===void 0&&(e.DefaultMaterial=new ss({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:0})),e.DefaultMaterial}function e_(e,t,n){for(let r in n.extensions)e[r]===void 0&&(t.userData.gltfExtensions=t.userData.gltfExtensions||{},t.userData.gltfExtensions[r]=n.extensions[r])}function t_(e,t){t.extras!==void 0&&(typeof t.extras==`object`?Object.assign(e.userData,t.extras):console.warn(`THREE.GLTFLoader: Ignoring primitive type .extras, `+t.extras))}function n_(e,t,n){let r=!1,i=!1,a=!1;for(let e=0,n=t.length;e<n;e++){let n=t[e];if(n.POSITION!==void 0&&(r=!0),n.NORMAL!==void 0&&(i=!0),n.COLOR_0!==void 0&&(a=!0),r&&i&&a)break}if(!r&&!i&&!a)return Promise.resolve(e);let o=[],s=[],c=[];for(let l=0,u=t.length;l<u;l++){let u=t[l];if(r){let t=u.POSITION===void 0?e.attributes.position:n.getDependency(`accessor`,u.POSITION);o.push(t)}if(i){let t=u.NORMAL===void 0?e.attributes.normal:n.getDependency(`accessor`,u.NORMAL);s.push(t)}if(a){let t=u.COLOR_0===void 0?e.attributes.color:n.getDependency(`accessor`,u.COLOR_0);c.push(t)}}return Promise.all([Promise.all(o),Promise.all(s),Promise.all(c)]).then(function(t){let n=t[0],o=t[1],s=t[2];return r&&(e.morphAttributes.position=n),i&&(e.morphAttributes.normal=o),a&&(e.morphAttributes.color=s),e.morphTargetsRelative=!0,e})}function r_(e,t){if(e.updateMorphTargets(),t.weights!==void 0)for(let n=0,r=t.weights.length;n<r;n++)e.morphTargetInfluences[n]=t.weights[n];if(t.extras&&Array.isArray(t.extras.targetNames)){let n=t.extras.targetNames;if(e.morphTargetInfluences.length===n.length){e.morphTargetDictionary={};for(let t=0,r=n.length;t<r;t++)e.morphTargetDictionary[n[t]]=t}else console.warn(`THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.`)}}function i_(e){let t,n=e.extensions&&e.extensions[hg.KHR_DRACO_MESH_COMPRESSION];if(t=n?`draco:`+n.bufferView+`:`+n.indices+`:`+a_(n.attributes):e.indices+`:`+a_(e.attributes)+`:`+e.mode,e.targets!==void 0)for(let n=0,r=e.targets.length;n<r;n++)t+=`:`+a_(e.targets[n]);return t}function a_(e){let t=``,n=Object.keys(e).sort();for(let r=0,i=n.length;r<i;r++)t+=n[r]+`:`+e[n[r]]+`;`;return t}function o_(e){switch(e){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw Error(`THREE.GLTFLoader: Unsupported normalized accessor component type.`)}}function s_(e){return e.search(/\.jpe?g($|\?)/i)>0||e.search(/^data\:image\/jpeg/)===0?`image/jpeg`:e.search(/\.webp($|\?)/i)>0||e.search(/^data\:image\/webp/)===0?`image/webp`:e.search(/\.ktx2($|\?)/i)>0||e.search(/^data\:image\/ktx2/)===0?`image/ktx2`:`image/png`}var c_=new B,l_=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new pg,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,r=-1,i=!1,a=-1;if(typeof navigator<`u`&&navigator.userAgent!==void 0){let e=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(e)===!0;let t=e.match(/Version\/(\d+)/);r=n&&t?parseInt(t[1],10):-1,i=e.indexOf(`Firefox`)>-1,a=i?e.match(/Firefox\/([0-9]+)\./)[1]:-1}this.textureLoader=typeof createImageBitmap>`u`||n&&r<17||i&&a<98?new Gs(this.options.manager):new hc(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Hs(this.options.manager),this.fileLoader.setResponseType(`arraybuffer`),this.options.crossOrigin===`use-credentials`&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,r=this.json,i=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(e){return e._markDefs&&e._markDefs()}),Promise.all(this._invokeAll(function(e){return e.beforeRoot&&e.beforeRoot()})).then(function(){return Promise.all([n.getDependencies(`scene`),n.getDependencies(`animation`),n.getDependencies(`camera`)])}).then(function(t){let a={scene:t[0][r.scene||0],scenes:t[0],animations:t[1],cameras:t[2],asset:r.asset,parser:n,userData:{}};return e_(i,a,r),t_(a,r),Promise.all(n._invokeAll(function(e){return e.afterRoot&&e.afterRoot(a)})).then(function(){for(let e of a.scenes)e.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let n=0,r=t.length;n<r;n++){let r=t[n].joints;for(let t=0,n=r.length;t<n;t++)e[r[t]].isBone=!0}for(let t=0,r=e.length;t<r;t++){let r=e[t];r.mesh!==void 0&&(this._addNodeRef(this.meshCache,r.mesh),r.skin!==void 0&&(n[r.mesh].isSkinnedMesh=!0)),r.camera!==void 0&&this._addNodeRef(this.cameraCache,r.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let r=n.clone(),i=(e,t)=>{let n=this.associations.get(e);n!=null&&this.associations.set(t,n);for(let[n,r]of e.children.entries())i(r,t.children[n])};return i(n,r),r.name+=`_instance_`+e.uses[t]++,r}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let r=e(t[n]);if(r)return r}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let r=0;r<t.length;r++){let i=e(t[r]);i&&n.push(i)}return n}getDependency(e,t){let n=e+`:`+t,r=this.cache.get(n);if(!r){switch(e){case`scene`:r=this.loadScene(t);break;case`node`:r=this._invokeOne(function(e){return e.loadNode&&e.loadNode(t)});break;case`mesh`:r=this._invokeOne(function(e){return e.loadMesh&&e.loadMesh(t)});break;case`accessor`:r=this.loadAccessor(t);break;case`bufferView`:r=this._invokeOne(function(e){return e.loadBufferView&&e.loadBufferView(t)});break;case`buffer`:r=this.loadBuffer(t);break;case`material`:r=this._invokeOne(function(e){return e.loadMaterial&&e.loadMaterial(t)});break;case`texture`:r=this._invokeOne(function(e){return e.loadTexture&&e.loadTexture(t)});break;case`skin`:r=this.loadSkin(t);break;case`animation`:r=this._invokeOne(function(e){return e.loadAnimation&&e.loadAnimation(t)});break;case`camera`:r=this.loadCamera(t);break;default:if(r=this._invokeOne(function(n){return n!=this&&n.getDependency&&n.getDependency(e,t)}),!r)throw Error(`Unknown type: `+e)}this.cache.add(n,r)}return r}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,r=this.json[e+(e===`mesh`?`es`:`s`)]||[];t=Promise.all(r.map(function(t,r){return n.getDependency(e,r)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!==`arraybuffer`)throw Error(`THREE.GLTFLoader: `+t.type+` buffer type is not supported.`);if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[hg.KHR_BINARY_GLTF].body);let r=this.options;return new Promise(function(e,i){n.load(pc.resolveURL(t.uri,r.path),e,void 0,function(){i(Error(`THREE.GLTFLoader: Failed to load buffer "`+t.uri+`".`))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency(`buffer`,t.buffer).then(function(e){let n=t.byteLength||0,r=t.byteOffset||0;return e.slice(r,r+n)})}loadAccessor(e){let t=this,n=this.json,r=this.json.accessors[e];if(r.bufferView===void 0&&r.sparse===void 0){let e=Jg[r.type],t=Gg[r.componentType],n=r.normalized===!0,i=new t(r.count*e);return Promise.resolve(new yr(i,e,n))}let i=[];return r.bufferView===void 0?i.push(null):i.push(this.getDependency(`bufferView`,r.bufferView)),r.sparse!==void 0&&(i.push(this.getDependency(`bufferView`,r.sparse.indices.bufferView)),i.push(this.getDependency(`bufferView`,r.sparse.values.bufferView))),Promise.all(i).then(function(e){let i=e[0],a=Jg[r.type],o=Gg[r.componentType],s=o.BYTES_PER_ELEMENT,c=s*a,l=r.byteOffset||0,u=r.bufferView===void 0?void 0:n.bufferViews[r.bufferView].byteStride,d=r.normalized===!0,f,p;if(u&&u!==c){let e=Math.floor(l/u),n=`InterleavedBuffer:`+r.bufferView+`:`+r.componentType+`:`+e+`:`+r.count,c=t.cache.get(n);c||(f=new o(i,e*u,r.count*u/s),c=new Fr(f,u/s),t.cache.add(n,c)),p=new Lr(c,a,l%u/s,d)}else f=i===null?new o(r.count*a):new o(i,l,r.count*a),p=new yr(f,a,d);if(r.sparse!==void 0){let t=Jg.SCALAR,n=Gg[r.sparse.indices.componentType],s=r.sparse.indices.byteOffset||0,c=r.sparse.values.byteOffset||0,l=new n(e[1],s,r.sparse.count*t),u=new o(e[2],c,r.sparse.count*a);i!==null&&(p=new yr(p.array.slice(),p.itemSize,p.normalized)),p.normalized=!1;for(let e=0,t=l.length;e<t;e++){let t=l[e];if(p.setX(t,u[e*a]),a>=2&&p.setY(t,u[e*a+1]),a>=3&&p.setZ(t,u[e*a+2]),a>=4&&p.setW(t,u[e*a+3]),a>=5)throw Error(`THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.`)}p.normalized=d}return p})}loadTexture(e){let t=this.json,n=this.options,r=t.textures[e].source,i=t.images[r],a=this.textureLoader;if(i.uri){let e=n.manager.getHandler(i.uri);e!==null&&(a=e)}return this.loadTextureImage(e,r,a)}loadTextureImage(e,t,n){let r=this,i=this.json,a=i.textures[e],o=i.images[t],s=(o.uri||o.bufferView)+`:`+a.sampler;if(this.textureCache[s])return this.textureCache[s];let c=this.loadImageSource(t,n).then(function(t){t.flipY=!1,t.name=a.name||o.name||``,t.name===``&&typeof o.uri==`string`&&o.uri.startsWith(`data:image/`)===!1&&(t.name=o.uri);let n=(i.samplers||{})[a.sampler]||{};return t.magFilter=Kg[n.magFilter]||1006,t.minFilter=Kg[n.minFilter]||1008,t.wrapS=qg[n.wrapS]||1e3,t.wrapT=qg[n.wrapT]||1e3,t.generateMipmaps=!t.isCompressedTexture&&t.minFilter!==1003&&t.minFilter!==1006,r.associations.set(t,{textures:e}),t}).catch(function(){return null});return this.textureCache[s]=c,c}loadImageSource(e,t){let n=this,r=this.json,i=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(e=>e.clone());let a=r.images[e],o=self.URL||self.webkitURL,s=a.uri||``,c=!1;if(a.bufferView!==void 0)s=n.getDependency(`bufferView`,a.bufferView).then(function(e){c=!0;let t=new Blob([e],{type:a.mimeType});return s=o.createObjectURL(t),s});else if(a.uri===void 0)throw Error(`THREE.GLTFLoader: Image `+e+` is missing URI and bufferView`);let l=Promise.resolve(s).then(function(e){return new Promise(function(n,r){let a=n;t.isImageBitmapLoader===!0&&(a=function(e){let t=new Zt(e);t.needsUpdate=!0,n(t)}),t.load(pc.resolveURL(e,i.path),a,void 0,r)})}).then(function(e){return c===!0&&o.revokeObjectURL(s),t_(e,a),e.userData.mimeType=a.mimeType||s_(a.uri),e}).catch(function(e){throw console.error(`THREE.GLTFLoader: Couldn't load texture`,s),e});return this.sourceCache[e]=l,l}assignTexture(e,t,n,r){let i=this;return this.getDependency(`texture`,n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),i.extensions[hg.KHR_TEXTURE_TRANSFORM]){let e=n.extensions===void 0?void 0:n.extensions[hg.KHR_TEXTURE_TRANSFORM];if(e){let t=i.associations.get(a);a=i.extensions[hg.KHR_TEXTURE_TRANSFORM].extendTexture(a,e),i.associations.set(a,t)}}return r!==void 0&&(a.colorSpace=r),e[t]=a,a})}assignFinalMaterial(e){let t=e.geometry,n=e.material,r=t.attributes.tangent===void 0,i=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){let e=`PointsMaterial:`+n.uuid,t=this.cache.get(e);t||(t=new pa,Ur.prototype.copy.call(t,n),t.color.copy(n.color),t.map=n.map,t.sizeAttenuation=!1,this.cache.add(e,t)),n=t}else if(e.isLine){let e=`LineBasicMaterial:`+n.uuid,t=this.cache.get(e);t||(t=new $i,Ur.prototype.copy.call(t,n),t.color.copy(n.color),t.map=n.map,this.cache.add(e,t)),n=t}if(r||i||a){let e=`ClonedMaterial:`+n.uuid+`:`;r&&(e+=`derivative-tangents:`),i&&(e+=`vertex-colors:`),a&&(e+=`flat-shading:`);let t=this.cache.get(e);t||(t=n.clone(),i&&(t.vertexColors=!0),a&&(t.flatShading=!0),r&&(t.normalScale&&(t.normalScale.y*=-1),t.clearcoatNormalScale&&(t.clearcoatNormalScale.y*=-1)),this.cache.add(e,t),this.associations.set(t,this.associations.get(n))),n=t}e.material=n}getMaterialType(){return ss}loadMaterial(e){let t=this,n=this.json,r=this.extensions,i=n.materials[e],a,o={},s=i.extensions||{},c=[];if(s[hg.KHR_MATERIALS_UNLIT]){let e=r[hg.KHR_MATERIALS_UNLIT];a=e.getMaterialType(),c.push(e.extendParams(o,i,t))}else{let n=i.pbrMetallicRoughness||{};if(o.color=new V(1,1,1),o.opacity=1,Array.isArray(n.baseColorFactor)){let e=n.baseColorFactor;o.color.setRGB(e[0],e[1],e[2],Ue),o.opacity=e[3]}n.baseColorTexture!==void 0&&c.push(t.assignTexture(o,`map`,n.baseColorTexture,He)),o.metalness=n.metallicFactor===void 0?1:n.metallicFactor,o.roughness=n.roughnessFactor===void 0?1:n.roughnessFactor,n.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(o,`metalnessMap`,n.metallicRoughnessTexture)),c.push(t.assignTexture(o,`roughnessMap`,n.metallicRoughnessTexture))),a=this._invokeOne(function(t){return t.getMaterialType&&t.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(t){return t.extendMaterialParams&&t.extendMaterialParams(e,o)})))}i.doubleSided===!0&&(o.side=2);let l=i.alphaMode||Qg.OPAQUE;if(l===Qg.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,l===Qg.MASK&&(o.alphaTest=i.alphaCutoff===void 0?.5:i.alphaCutoff)),i.normalTexture!==void 0&&a!==di&&(c.push(t.assignTexture(o,`normalMap`,i.normalTexture)),o.normalScale=new R(1,1),i.normalTexture.scale!==void 0)){let e=i.normalTexture.scale;o.normalScale.set(e,e)}if(i.occlusionTexture!==void 0&&a!==di&&(c.push(t.assignTexture(o,`aoMap`,i.occlusionTexture)),i.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=i.occlusionTexture.strength)),i.emissiveFactor!==void 0&&a!==di){let e=i.emissiveFactor;o.emissive=new V().setRGB(e[0],e[1],e[2],Ue)}return i.emissiveTexture!==void 0&&a!==di&&c.push(t.assignTexture(o,`emissiveMap`,i.emissiveTexture,He)),Promise.all(c).then(function(){let n=new a(o);return i.name&&(n.name=i.name),t_(n,i),t.associations.set(n,{materials:e}),i.extensions&&e_(r,n,i),n})}createUniqueName(e){let t=Nc.sanitizeNodeName(e||``);return t in this.nodeNamesUsed?t+`_`+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,n=this.extensions,r=this.primitiveCache;function i(e){return n[hg.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(e,t).then(function(n){return d_(n,e,t)})}let a=[];for(let n=0,o=e.length;n<o;n++){let o=e[n],s=i_(o),c=r[s];if(c)a.push(c.promise);else{let e;e=o.extensions&&o.extensions[hg.KHR_DRACO_MESH_COMPRESSION]?i(o):d_(new Pr,o,t),o.mode===Wg.TRIANGLE_STRIP?e=e.then(e=>lg(e,1)):o.mode===Wg.TRIANGLE_FAN&&(e=e.then(e=>lg(e,2))),r[s]={primitive:o,promise:e},a.push(e)}}return Promise.all(a)}loadMesh(e){let t=this,n=this.json,r=this.extensions,i=n.meshes[e],a=i.primitives,o=[];for(let e=0,t=a.length;e<t;e++){let t=a[e].material===void 0?$g(this.cache):this.getDependency(`material`,a[e].material);o.push(t)}return o.push(t.loadGeometries(a)),Promise.all(o).then(async function(n){let o=n.slice(0,n.length-1),s=n[n.length-1],c=[];for(let n=0,l=s.length;n<l;n++){let l=s[n],u=a[n],d,f=o[n];if(u.mode===Wg.TRIANGLES||u.mode===Wg.TRIANGLE_STRIP||u.mode===Wg.TRIANGLE_FAN||u.mode===void 0){let e=i.isSkinnedMesh===!0,t=l.hasAttribute(`skinIndex`)&&l.hasAttribute(`skinWeight`);e&&t===!1&&console.warn(`THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled.`),d=e&&t?new Pi(l,f):new H(l,f),d.isSkinnedMesh===!0&&d.normalizeSkinWeights()}else if(u.mode===Wg.LINES)d=new da(l,f);else if(u.mode===Wg.LINE_STRIP)d=new sa(l,f);else if(u.mode===Wg.LINE_LOOP)d=new fa(l,f);else if(u.mode===Wg.POINTS)d=new va(l,f);else throw Error(`THREE.GLTFLoader: Primitive mode unsupported: `+u.mode);Object.keys(d.geometry.morphAttributes).length>0&&r_(d,i),d.name=t.createUniqueName(i.name||`mesh_`+e),t_(d,i),u.extensions&&e_(r,d,u),t.assignFinalMaterial(d),c.push(d)}for(let n=0,r=c.length;n<r;n++)t.associations.set(c[n],{meshes:e,primitives:n});if(c.length===1)return i.extensions&&e_(r,c[0],i),c[0];let l=new jn;i.extensions&&e_(r,l,i),t.associations.set(l,{meshes:e});for(let e=0,t=c.length;e<t;e++)l.add(c[e]);return l})}loadCamera(e){let t,n=this.json.cameras[e],r=n[n.type];if(!r)console.warn(`THREE.GLTFLoader: Missing camera parameters.`);else return n.type===`perspective`?t=new ac(Mt.radToDeg(r.yfov),r.aspectRatio||1,r.znear||1,r.zfar||2e6):n.type===`orthographic`&&(t=new uc(-r.xmag,r.xmag,r.ymag,-r.ymag,r.znear,r.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),t_(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let e=0,r=t.joints.length;e<r;e++)n.push(this._loadNodeShallow(t.joints[e]));return t.inverseBindMatrices===void 0?n.push(null):n.push(this.getDependency(`accessor`,t.inverseBindMatrices)),Promise.all(n).then(function(e){let n=e.pop(),r=e,i=[],a=[];for(let e=0,o=r.length;e<o;e++){let o=r[e];if(o){i.push(o);let t=new B;n!==null&&t.fromArray(n.array,e*16),a.push(t)}else console.warn(`THREE.GLTFLoader: Joint "%s" could not be found.`,t.joints[e])}return new zi(i,a)})}loadAnimation(e){let t=this.json,n=this,r=t.animations[e],i=r.name?r.name:`animation_`+e,a=[],o=[],s=[],c=[],l=[];for(let e=0,t=r.channels.length;e<t;e++){let t=r.channels[e],n=r.samplers[t.sampler],i=t.target,u=i.node,d=r.parameters===void 0?n.input:r.parameters[n.input],f=r.parameters===void 0?n.output:r.parameters[n.output];i.node!==void 0&&(a.push(this.getDependency(`node`,u)),o.push(this.getDependency(`accessor`,d)),s.push(this.getDependency(`accessor`,f)),c.push(n),l.push(i))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(s),Promise.all(c),Promise.all(l)]).then(function(e){let t=e[0],a=e[1],o=e[2],s=e[3],c=e[4],l=[];for(let e=0,r=t.length;e<r;e++){let r=t[e],i=a[e],u=o[e],d=s[e],f=c[e];if(r===void 0)continue;r.updateMatrix&&r.updateMatrix();let p=n._createAnimationTracks(r,i,u,d,f);if(p)for(let e=0;e<p.length;e++)l.push(p[e])}let u=new Ns(i,void 0,l);return t_(u,r),u})}createNodeMesh(e){let t=this.json,n=this,r=t.nodes[e];return r.mesh===void 0?null:n.getDependency(`mesh`,r.mesh).then(function(e){let t=n._getNodeRef(n.meshCache,r.mesh,e);return r.weights!==void 0&&t.traverse(function(e){if(e.isMesh)for(let t=0,n=r.weights.length;t<n;t++)e.morphTargetInfluences[t]=r.weights[t]}),t})}loadNode(e){let t=this.json,n=this,r=t.nodes[e],i=n._loadNodeShallow(e),a=[],o=r.children||[];for(let e=0,t=o.length;e<t;e++)a.push(n.getDependency(`node`,o[e]));let s=r.skin===void 0?Promise.resolve(null):n.getDependency(`skin`,r.skin);return Promise.all([i,Promise.all(a),s]).then(function(e){let t=e[0],n=e[1],r=e[2];r!==null&&t.traverse(function(e){e.isSkinnedMesh&&e.bind(r,c_)});for(let e=0,r=n.length;e<r;e++)t.add(n[e]);if(t.userData.pivot!==void 0&&n.length>0){let e=t.userData.pivot,r=n[0];t.pivot=new z().fromArray(e),t.position.x-=e[0],t.position.y-=e[1],t.position.z-=e[2],r.position.set(0,0,0),delete t.userData.pivot}return t})}_loadNodeShallow(e){let t=this.json,n=this.extensions,r=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let i=t.nodes[e],a=i.name?r.createUniqueName(i.name):``,o=[],s=r._invokeOne(function(t){return t.createNodeMesh&&t.createNodeMesh(e)});return s&&o.push(s),i.camera!==void 0&&o.push(r.getDependency(`camera`,i.camera).then(function(e){return r._getNodeRef(r.cameraCache,i.camera,e)})),r._invokeAll(function(t){return t.createNodeAttachment&&t.createNodeAttachment(e)}).forEach(function(e){o.push(e)}),this.nodeCache[e]=Promise.all(o).then(function(t){let o;if(o=i.isBone===!0?new Fi:t.length>1?new jn:t.length===1?t[0]:new An,o!==t[0])for(let e=0,n=t.length;e<n;e++)o.add(t[e]);if(i.name&&(o.userData.name=i.name,o.name=a),t_(o,i),i.extensions&&e_(n,o,i),i.matrix!==void 0){let e=new B;e.fromArray(i.matrix),o.applyMatrix4(e)}else i.translation!==void 0&&o.position.fromArray(i.translation),i.rotation!==void 0&&o.quaternion.fromArray(i.rotation),i.scale!==void 0&&o.scale.fromArray(i.scale);if(!r.associations.has(o))r.associations.set(o,{});else if(i.mesh!==void 0&&r.meshCache.refs[i.mesh]>1){let e=r.associations.get(o);r.associations.set(o,{...e})}return r.associations.get(o).nodes=e,o}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],r=this,i=new jn;n.name&&(i.name=r.createUniqueName(n.name)),t_(i,n),n.extensions&&e_(t,i,n);let a=n.nodes||[],o=[];for(let e=0,t=a.length;e<t;e++)o.push(r.getDependency(`node`,a[e]));return Promise.all(o).then(function(e){for(let t=0,n=e.length;t<n;t++){let n=e[t];n.parent===null?i.add(n):i.add(ug(n))}return r.associations=(e=>{let t=new Map;for(let[e,n]of r.associations)(e instanceof Ur||e instanceof Zt)&&t.set(e,n);return e.traverse(e=>{let n=r.associations.get(e);n!=null&&t.set(e,n)}),t})(i),i})}_createAnimationTracks(e,t,n,r,i){let a=[],o=e.name?e.name:e.uuid,s=[];function c(e){e.morphTargetInfluences&&s.push(e.name?e.name:e.uuid)}Xg[i.path]===Xg.weights?(c(e),e.isGroup&&e.children.forEach(c)):s.push(o);let l;switch(Xg[i.path]){case Xg.weights:l=Os;break;case Xg.rotation:l=As;break;case Xg.translation:case Xg.scale:l=Ms;break;default:switch(n.itemSize){case 1:l=Os;break;default:l=Ms}}let u=r.interpolation===void 0?Fe:Zg[r.interpolation],d=this._getArrayFromAccessor(n);for(let e=0,n=s.length;e<n;e++){let n=new l(s[e]+`.`+Xg[i.path],t.array,d,u);r.interpolation===`CUBICSPLINE`&&this._createCubicSplineTrackInterpolant(n),a.push(n)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let e=o_(t.constructor),n=new Float32Array(t.length);for(let r=0,i=t.length;r<i;r++)n[r]=t[r]*e;t=n}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(e){return new(this instanceof As?Ug:Vg)(this.times,this.values,this.getValueSize()/3,e)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function u_(e,t,n){let r=t.attributes,i=new tr;if(r.POSITION!==void 0){let e=n.json.accessors[r.POSITION],t=e.min,a=e.max;if(t!==void 0&&a!==void 0){if(i.set(new z(t[0],t[1],t[2]),new z(a[0],a[1],a[2])),e.normalized){let t=o_(Gg[e.componentType]);i.min.multiplyScalar(t),i.max.multiplyScalar(t)}}else{console.warn(`THREE.GLTFLoader: Missing min/max properties for accessor POSITION.`);return}}else return;let a=t.targets;if(a!==void 0){let e=new z,t=new z;for(let r=0,i=a.length;r<i;r++){let i=a[r];if(i.POSITION!==void 0){let r=n.json.accessors[i.POSITION],a=r.min,o=r.max;if(a!==void 0&&o!==void 0){if(t.setX(Math.max(Math.abs(a[0]),Math.abs(o[0]))),t.setY(Math.max(Math.abs(a[1]),Math.abs(o[1]))),t.setZ(Math.max(Math.abs(a[2]),Math.abs(o[2]))),r.normalized){let e=o_(Gg[r.componentType]);t.multiplyScalar(e)}e.max(t)}else console.warn(`THREE.GLTFLoader: Missing min/max properties for accessor POSITION.`)}}i.expandByVector(e)}e.boundingBox=i;let o=new Er;i.getCenter(o.center),o.radius=i.min.distanceTo(i.max)/2,e.boundingSphere=o}function d_(e,t,n){let r=t.attributes,i=[];function a(t,r){return n.getDependency(`accessor`,t).then(function(t){e.setAttribute(r,t)})}for(let t in r){let n=Yg[t]||t.toLowerCase();n in e.attributes||i.push(a(r[t],n))}if(t.indices!==void 0&&!e.index){let r=n.getDependency(`accessor`,t.indices).then(function(t){e.setIndex(t)});i.push(r)}return Vt.workingColorSpace!==`srgb-linear`&&`COLOR_0`in r&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Vt.workingColorSpace}" not supported.`),t_(e,t),u_(e,t,n),Promise.all(i).then(function(){return t.targets===void 0?e:n_(e,t.targets,n)})}var f_={peterbilt:{file:`peterbilt389`,tyre:e=>[`fronttires`,`backtires`,`backtires2`].includes(e),steers:e=>e===`fronttires`,toRig:new B().makeTranslation(2.55,0,0).multiply(new B().makeRotationY(-Math.PI/2)),repaint:!0,door:{x:3.83,up:1.45,half:1.13}},cabover:{file:`cabover-hornet`,tyre:e=>/tire|wheel_set/.test(e),steers:e=>e.startsWith(`front`),toRig:new B().makeTranslation(2,0,0).multiply(new B().makeRotationY(Math.PI/2)).multiply(new B().makeScale(.62,.62,.62)),repaint:!1,door:{x:3.2,up:1.65,half:1.42}}},p_=new Map;function m_(e){let t=p_.get(e);return t||(t=new fg().loadAsync(`/play/models/${e}.glb`).then(e=>e.scene).catch(()=>null),p_.set(e,t)),t}function h_(e,t){let n=e.index?e.toNonIndexed():e.clone(),r=new Pr;for(let e of[`position`,`normal`,`uv`]){let t=n.getAttribute(e);if(!t)continue;let i=new Float32Array(t.count*t.itemSize);for(let e=0;e<t.count;e++)for(let n=0;n<t.itemSize;n++)i[e*t.itemSize+n]=t.getComponent(e,n);r.setAttribute(e,new yr(i,t.itemSize))}return r.getAttribute(`uv`)||r.setAttribute(`uv`,new yr(new Float32Array(r.getAttribute(`position`).count*2),2)),r.applyMatrix4(t),r.getAttribute(`normal`)||r.computeVertexNormals(),r}function g_(e,t,n,r){let i=new Map;for(let n of e){let e=Array.isArray(n.material)?n.material[0]:n.material,a=r.clone().multiply(n.matrixWorld);a.premultiply(new B().makeTranslation(-t.x,-t.y,-t.z)),i.has(e)||i.set(e,[]),i.get(e).push(h_(n.geometry,a))}let a=new jn;for(let[e,t]of i){let r=sg(t,!1);if(!r)continue;let i=new H(r,n(e));i.castShadow=!0,i.receiveShadow=!0,a.add(i)}return a.position.copy(t),a}var __=new Map;function v_(e,t){let n=`${e.uuid}|${t.join(`,`)}`,r=__.get(n);if(r)return r;let i=e.image,a=document.createElement(`canvas`);a.width=i.width,a.height=i.height;let o=a.getContext(`2d`,{willReadFrequently:!0});o.drawImage(i,0,0);let s=o.getImageData(0,0,a.width,a.height),c=s.data;for(let e=0;e<c.length;e+=4){let n=c[e],r=c[e+1],i=c[e+2];if(n>90&&n>r*1.6&&n>i*1.6){let r=n/205;c[e]=Math.min(255,t[0]*255*r),c[e+1]=Math.min(255,t[1]*255*r),c[e+2]=Math.min(255,t[2]*255*r)}}return o.putImageData(s,0,0),r=new xa(a),r.flipY=e.flipY,r.colorSpace=He,r.wrapS=e.wrapS,r.wrapT=e.wrapT,r.anisotropy=8,__.set(n,r),r}async function y_(e,t){let n=f_[e===`HORNET`?`cabover`:`peterbilt`],r=n.toRig,i=await m_(n.file);if(!i)return null;i.updateMatrixWorld(!0);let a=[];i.traverse(e=>{!e.isMesh&&n.tyre(e.name)&&!a.some(t=>b_(e,t))&&a.push(e)});let o=e=>a.find(t=>b_(e,t))??null,s=[],c=new Map;i.traverse(e=>{if(!e.isMesh)return;let t=o(e);t?(c.has(t)||c.set(t,[]),c.get(t).push(e)):s.push(e)});let l=new Map,u=e=>{let r=l.get(e);if(!r){let i=e.clone();n.repaint&&i.map&&i.map.image&&i.map.image.width>64&&(i.map=v_(i.map,t),i.metalness=.35,i.roughness=.32),r=i,l.set(e,r)}return r},d=g_(s,new z,u,r),f=[],p=[],m=new tr,h=new tr;for(let[e,t]of c)for(let i of[-1,1]){let a=t.filter(e=>(h.setFromObject(e),Math.sign((h.min.x+h.max.x)/2)===-i));if(!a.length)continue;m.makeEmpty();for(let e of a)h.setFromObject(e),m.union(h);let o=g_(a,m.getCenter(new z).applyMatrix4(r),u,r);f.push(o),n.steers(e.name)&&p.push(o)}let g=[],_=new tr;for(let e of s){_.setFromObject(e).applyMatrix4(r);let t=_.getSize(new z);if(_.max.y>3.4&&t.x<.5&&t.z<.5){let e=new z((_.min.x+_.max.x)/2,_.max.y,(_.min.z+_.max.z)/2);g.some(t=>Math.abs(t.z-e.z)<.3)||g.push(e)}}if(!g.length){let e=[new z(0,-1e9,0),new z(0,-1e9,0)],t=new z;for(let n of s){let i=n.geometry.getAttribute(`position`),a=r.clone().multiply(n.matrixWorld);for(let n=0;n<i.count;n++){t.fromBufferAttribute(i,n).applyMatrix4(a);let r=t.z<0?0:1;Math.abs(t.z)>.6&&t.y>e[r].y&&e[r].copy(t)}}for(let t of e)t.y>0&&g.push(t)}return{body:d,wheels:f,front:p,stackTops:g,noseX:new tr().setFromObject(i).applyMatrix4(r).max.x,door:n.door}}function b_(e,t){for(let n=e;n;n=n.parent)if(n===t)return!0;return!1}var x_=e=>{for(;e>Math.PI;)e-=2*Math.PI;for(;e<-Math.PI;)e+=2*Math.PI;return e},S_=[.12,.12,.13],C_=[.8,.82,.85],w_=[.05,.05,.05],T_=[.3,.45,.55],E_=[.95,.75,.05],D_=[.1,.1,.11],O_=class{wheel(e,t,n,r,i,a,o){let s=new jn;s.position.set(t,i,n);let c=i*.27,l=new Xo(i-c,c,10,28),u=new ss({color:new V(.06,.06,.06),roughness:.95}),d=new ss({color:new V(.1,.1,.1),roughness:.9}),f=new ss({color:new V(.85,.86,.88),roughness:.25,metalness:.8}),p=new ss({color:new V(.2,.2,.22),roughness:.6,metalness:.4}),m=(e,t)=>{let n=new H(l,u);n.scale.set(1,1,a*.5/c),n.position.z=e,n.castShadow=!0,s.add(n);for(let t=0;t<2;t++){let n=new H(new Xo(i-.02,.012,4,36),d);n.position.z=e+(t===0?-1:1)*a*.16,s.add(n)}let o=new H(new Ea(i-c+.02,i-c+.02,a*.86,24),d);if(o.rotation.x=Math.PI/2,o.position.z=e,s.add(o),t){let t=r*(e+a*.44),n=new H(new Ea(i*.58,i*.62,.06,24),f);n.rotation.x=Math.PI/2,n.position.z=r*(Math.abs(e)+a*.4),s.add(n);let o=new H(new Ea(i*.4,i*.5,.08,20),p);o.rotation.x=Math.PI/2,o.position.z=r*(Math.abs(e)+a*.46),s.add(o);let c=new H(new Ea(i*.17,i*.17,.1,16),f);c.rotation.x=Math.PI/2,c.position.z=t+r*.03,s.add(c);for(let e=0;e<8;e++){let n=e/8*Math.PI*2,a=new H(new Ea(.035,.035,.05,6),f);a.rotation.x=Math.PI/2,a.position.set(Math.cos(n)*i*.3,Math.sin(n)*i*.3,t+r*.02),s.add(a)}}};return o?(m(-a*.52*r,!1),m(a*.52*r,!0)):m(0,!0),e.add(s),s}constructor(e,t,n){this.scene=e,this.truck=new jn,this.trailer=new jn,this.load=new jn,this.cradle=new jn,this.wheels=[],this.frontWheels=[],this.brakeLamps=[],this.flames=[],this.removed=!1,this.lamps=[],this.noseX=6.7,this.deckPivot=null,this.deckLength=16,this.deckTilt=0,this.winchCable=null,this.vehicle=null,this.vehicleKind=null,this.flashers=[],this.loadFree=!1,this.buildTruck(t),this.buildTrailer(n),this.buildLoad(n),e.add(this.truck,this.trailer,this.load),y_(t.name,t.color).then(e=>{e&&!this.removed&&this.useModel(e,t)})}useModel(e,t){let n=this.lamps;for(let e of[...this.truck.children])n.includes(e)||this.truck.remove(e);this.wheels=this.wheels.filter(e=>e.parent&&e.parent!==this.truck),this.truck.add(e.body);for(let t of e.wheels)this.truck.add(t),this.wheels.push(t);this.frontWheels=e.front,this.flames=[];for(let t of e.stackTops){let e=Kh(this.truck,t.x,t.z,t.y+.6,.45,.45,1.3,[1,.55,.1],4);e.visible=!1,this.flames.push(e)}for(let t of[-1,1]){let n=new H(new Jo(.9,.5),new ss({map:rg(`AXLON`),roughness:.5}));n.position.set(e.door.x,e.door.up,t*(e.door.half+.01)),n.rotation.y=t>0?0:Math.PI,this.truck.add(n)}if(t.name===`BULL`){let t=e.noseX+.2;for(let e of[.5,1.2])X(this.truck,t,0,e,.14,2.7,`y`,C_,!0);for(let e of[-1.1,-.4,.4,1.1])Y(this.truck,t,e,.85,.12,.12,1.2,S_)}this.noseX=e.noseX;for(let t of n)t.isSpotLight&&(t.position.x=e.noseX+.05)}remove(){this.removed=!0,this.scene.remove(this.truck,this.trailer,this.load),this.vehicle&&this.vehicle.parent?.remove(this.vehicle)}buildTruck(e){let t=e.color,n=e.name===`BULL`,r=e.name===`HORNET`,i=n?2.4:r?1.9:2.2,a=this.truck;if(Y(a,2.6,0,1,7.4,2.8,.8,t,!0),Y(a,4.4,0,1.4+i*.5,2.6,2.8,i,t,!0),!r)Y(a,2.2,0,1.4+i*.45,1.8,2.8,i*.9,t,!0),Y(a,2.2,0,1.4+i*.9+.05,1.9,2.4,.1,t,!0);else{Y(a,2.9,0,1.4+i+.5,.9,2.6,.12,t,!0);for(let e of[-1,1])Y(a,2.9,e*1.2,1.4+i+.25,.5,.1,.5,t,!0)}Y(a,.2,0,1.45,1.4,1.6,.12,S_),X(a,.2,0,1.5,1.2,.08,`up`,[.3,.3,.32]),Y(a,5.76,0,1.4+i*.3,.06,2,.9,C_,!0);for(let e=0;e<5;e++)Y(a,5.8,0,1.4+i*.3-.36+e*.18,.04,1.9,.06,[.06,.06,.07]);if(Y(a,5.76,0,1.4+i*.3+.55,.06,2.1,.12,C_,!0),Y(a,6.6,0,.62,.3,3,.5,C_,!0),n){for(let e of[.5,1.2,1.9])X(a,6.95,0,e,.14,3.1,`y`,C_,!0);for(let e of[-1.3,-.45,.45,1.3])Y(a,6.95,e,1.2,.12,.12,1.8,S_);Y(a,6.7,0,1,.4,1,.5,S_)}Y(a,5.95,0,1.4+i-.02,.6,2.9,.08,t,!0);for(let e of[-.9,-.45,0,.45,.9])Kh(a,5.6,e,1.4+i+.04,.12,.18,.08,[1,.6,.1],1.6);for(let e of[-.5,.5])X(a,4.6,e,1.4+i+.2,.18,.9,`x`,C_,!0);Y(a,4.1,0,1.4+i*.27,.03,2.84,.04,C_,!0);for(let e of[-1,1]){let r=n?.38:.3;X(a,2.9,e*1.2,2.4+i*.5,r,i+.2,`up`,C_,!0);let o=Kh(a,2.9,e*1.2,2.4+i+.6,.5,.5,1.4,[1,.55,.1],4);o.visible=!1,this.flames.push(o);for(let t of[-.7,.7])this.wheels.push(this.wheel(a,t,e*1.18,e,.65,.42,!0));let s=this.wheel(a,5,e*1.3,e,.65,.42,!1);this.wheels.push(s),this.frontWheels.push(s),Y(a,5,e*1.3,1.36,1.7,.9,.14,t,!0),Y(a,0,e*1.3,1.38,3,.9,.14,t,!0),Y(a,4.9,e*1.41,1.4+i*.66,1.1,.05,i*.34,T_,!0),Y(a,2.2,e*1.41,1.4+i*.6,.6,.05,.5,T_,!0),Y(a,5.4,e*1.75,1.4+i*.75,.05,.7,.05,S_),Y(a,5.4,e*1.75,1.4+i*.35,.05,.7,.05,S_),Y(a,5.4,e*2.05,1.4+i*.55,.12,.08,1,S_),Y(a,5.46,e*2.05,1.4+i*.55,.02,.06,.9,C_,!0),Y(a,3.65,e*1.42,1.4+i*.45,.2,.03,.05,C_,!0),Y(a,3.1,e*1.44,1.4+i*.4,.04,.04,.9,C_,!0),X(a,1.5,e*1.12,.92,.72,1.7,`x`,C_,!0),Kh(a,6.52,e*1.05,.98,.1,.5,.26,[1,.95,.8],2),Kh(a,5.72,e*1.25,1.4+i-.08,.06,.2,.1,[1,.6,.1],2),Y(a,3.6,e*1.35,.45,.9,.5,.06,S_),Y(a,3.6,e*1.35,.85,.9,.5,.06,S_),Y(a,-1.45,e*1.25,.5,.05,.7,.8,[.012,.012,.015]);let c=new H(new Jo(.9,.5),new ss({map:rg(`AXLON`),roughness:.5}));c.position.set(4.05,1.4+i*.27,e*1.42),c.rotation.y=e>0?0:Math.PI,a.add(c)}Y(a,5.72,0,1.4+i*.66,.05,2.5,i*.38,T_,!0),Y(a,6.45,0,1,.1,2.6,.5,C_,!0)}buildTrailer(e){let t=this.trailer;Y(t,-e.dollyDist*.5,0,1.1,e.dollyDist,1.2,.5,S_),Y(t,-e.dollyDist,0,.85,5.4,3,.5,D_,!0);for(let n of[-1.6,0,1.6])for(let r of[-1,1])this.wheels.push(this.wheel(t,-e.dollyDist+n,r*1.15,r,.5,.36,!0));for(let n of[-1,1]){Y(t,-e.dollyDist,n*1.3,1.08,5.2,.9,.12,[.08,.08,.09]);for(let r=-2;r>-e.dollyDist+1;r-=1.2)Y(t,r,n*.63,1,.6,.04,.12,Math.round(-r/1.2)%2==0?[.9,.05,.03]:[.92,.92,.9],!1,!1)}let n=-e.dollyDist-2.78;for(let e=0;e<8;e++)Y(t,n,-1.4+.4*e,1.05,.1,.4,.5,e%2==0?E_:S_,!1,!1);for(let e of[-1,1])this.brakeLamps.push(Kh(t,n-.04,e*.85,.62,.1,.5,.26,[1,.1,.05],1));Y(t,-1.2,0,1.25,2.6,2.6,.3,D_,!0),Y(t,-.6,0,.95,1,1.4,.4,S_);for(let n=-3;n>-e.dollyDist+2;n-=2.2)Y(t,n,0,1.37,2,1.4,.04,[.25,.25,.27],!1,!1);Y(t,-e.dollyDist+3.4,.9,.8,1,.6,.6,S_),Y(t,n+.3,0,.45,.1,2.6,.12,S_);for(let n of[-1,1]){for(let r=-3;r>-e.dollyDist+2;r-=2.2)Kh(t,r,n*.63,1.34,.18,.04,.06,[1,.6,.1],1.2);Y(t,-e.dollyDist-2.3,n*1.2,.45,.04,.6,.6,[.012,.012,.015])}t.add(this.cradle)}buildLoad(e){let t=this.load,n=e.loadEnd-1,r=-(1+e.loadEnd)*.5,i=e.underside,a=e.rootRadius*2,o=[.22,.22,.2],s=(e,t)=>(e.rotation.z=t*Math.PI/180,e),c=(e,t)=>(e.rotation.x=t*Math.PI/180,e);switch(e.shape){case`transformer`:{Y(this.trailer,r,0,i-.25,n+1,a-.4,.4,S_);let o=e.rootThickness-.9;Y(t,r,0,i+o*.5,n*.8,a*.75,o,e.color,!0);for(let s of[-1,1])for(let c=-n*.38;c<=n*.38;c+=.45)Y(t,r+c,s*(a*.375+.35),i+o*.5,.12,.7,o-.4,[e.color[0]*.8,e.color[1]*.8,e.color[2]*.8]);Y(t,r,0,i+o+.12,n*.82,a*.78,.24,[.12,.2,.24]),X(t,r-n*.15,0,i+o+.9,1.2,n*.5,`x`,[.5,.52,.52],!0);for(let e of[-a*.25,0,a*.25]){X(t,r+n*.25,e,i+o+.6,.4,.9,`up`,[.6,.45,.3]);for(let a=.2;a<.9;a+=.2)X(t,r+n*.25,e,i+o+.25+a,.55,.06,`up`,[.6,.45,.3])}for(let e of[-1,1])for(let s of[-1,1])Y(t,r+e*n*.38,s*a*.3,i+o+.4,.4,.12,.5,S_);for(let e of[-n*.4,0,n*.4])Y(t,r+e,0,i+.2,.35,a+.1,.4,E_);break}case`rocket`:{for(let e of[-n*.35,0,n*.35]){for(let t of[-1,1])Y(this.trailer,r+e,t*1.3,i+.4,.6,.4,.8,S_);Y(this.trailer,r+e,0,i-.1,.6,3.2,.3,S_)}let a=e.rootRadius*2,o=i+a*.5;X(t,r+n*.05,0,o,a,n*.74,`x`,e.color,!0);for(let e=-n*.3;e<=n*.35;e+=n*.16)X(t,r+e,0,o,a+.08,.3,`x`,[.75,.75,.78],!0);X(t,r-n*.2,0,o,a+.06,n*.12,`x`,[.1,.35,.8],!0);let s=Uh(t,r+n*.5-n*.08,0,o,a*.3,a,n*.16,e.color,!0);s.rotation.z=Math.PI/2;let c=Uh(t,r-n*.42,0,o,a,a*.92,n*.2,e.color,!0);c.rotation.z=Math.PI/2;let l=Uh(t,r-n*.5+.8,0,o,a*.55,a*.85,2,[.3,.3,.32],!0);l.rotation.z=Math.PI/2;for(let i of[-1,1])Y(t,r-n*.46,i*(a*.5+.7),o,2.4,1.4,.12,e.color,!0);for(let e of[-1,1])Y(t,r-n*.1,e*(a*.5-.5),o+a*.5-.6,.8,.2,.5,S_);break}case`house`:{let o=2.5;Y(this.trailer,r,0,i-.25,n+1,a-.6,.4,S_),Y(t,r,0,i+o*.5,n,a,o,e.color);for(let e of[-1,1]){c(Y(t,r,e*a*.26,i+o+.62,n+.7,a*.58,.22,[.33,.12,.08]),e*22);for(let o=-n*.5+2.2;o<n*.5-1;o+=3.2)Y(t,r+o,e*(a*.5+.03),i+1.45,1.3,.08,1,[.1,.16,.22],!0,!1),Y(t,r+o,e*(a*.5+.05),i+1.45,1.4,.04,.06,[.95,.95,.92],!1,!1),Y(t,r+o,e*(a*.5+.05),i+1.45,.06,.04,1.1,[.95,.95,.92],!1,!1)}for(let s of[-1,1])Y(t,r+s*(n*.5-.15),0,i+o+.3,.3,a*.66,.6,e.color),Y(t,r+s*(n*.5-.15),0,i+o+.85,.3,a*.3,.5,e.color);Y(t,r-n*.5-.03,.9,i+1.05,.08,1,2,[.3,.08,.05]),Y(t,r+2.5,-1.1,i+o+1.2,.8,.8,1.2,[.4,.16,.1]);for(let e of[-n*.5,0,n*.5])Y(t,r+e,0,i+.2,.35,a+.1,.4,E_);break}case`excavator`:{let c=e.color,l=[c[0]*.75,c[1]*.75,c[2]*.75];Y(this.trailer,r,0,i-.25,n+1,a-.4,.4,S_);for(let e of[-1,1]){Y(t,r,e*1.55,i+.55,n*.62,.9,1.1,o),Y(t,r,e*1.55,i+1.15,n*.66,1,.2,S_),Y(t,r,e*1.55,i+.1,n*.66,1,.2,S_);for(let a=-n*.28;a<=n*.28;a+=n*.14)X(t,r+a,e*1.55,i+.55,.7,1.02,`y`,[.18,.18,.2])}Y(t,r,0,i+.9,n*.4,2.4,.6,o),X(t,r,0,i+1.35,2.6,.3,`up`,S_),Y(t,r-.6,0,i+2.3,n*.5,a-.2,1.8,c,!0),Y(t,r-n*.5+1.2,0,i+2.3,1.4,a,1.9,l,!0),Y(t,r-n*.5+.48,0,i+2.3,.06,e.rootRadius*1.6,.5,S_);for(let a of[-1,1])Kh(t,r-n*.5+.48,a*(e.rootRadius-.4),i+3,.06,.3,.2,[1,.1,.05],2);Y(t,r+n*.12,1.2,i+2.9,2.2,1.6,2,c,!0),Y(t,r+n*.12,1.2,i+3.1,2.24,1.64,1.1,T_,!0),Y(t,r-.6,0,i+3.3,n*.3,1.6,.3,l),s(Y(t,r+n*.18,-.6,i+2.6,n*.42,.7,.8,c,!0),-14),s(Y(t,r+n*.44,-.6,i+1.9,n*.28,.5,.6,c,!0),50),Y(t,r+n*.5-.4,-.6,i+.7,1.5,1.6,1.1,o);for(let e of[-n*.5,0,n*.5])Y(t,r+e,0,i+.2,.35,a+.1,.4,E_);break}case`yacht`:{let o=e.color,l=[.04,.09,.22];Y(this.trailer,r,0,i-.25,n+1,3.2,.4,S_);for(let e of[-n*.3,n*.25])for(let t of[-1,1])c(Y(this.trailer,r+e,t*1.5,i+.55,.3,.3,1.1,[.2,.2,.21]),t*-18);let u=t=>e.rootRadius*2+(e.tipRadius*1.2-e.rootRadius*2)*t*t;for(let e=0;e<6;e++){let a=(e+.5)/6,s=r-n*.5+a*n,c=u(a);Y(t,s,0,i+1.2,n/6*1.05,c,1.6,o,!0),Y(t,s,0,i+.35,n/6*1.05,c*.8,.5,l,!0)}let d=X(t,r-n*.1,0,i+.95,e.rootRadius*1.9,n*.78,`x`,o,!0);d.scale.x=1.9,s(Y(t,r+n*.5-1.6,0,i+1.9,3.2,e.tipRadius*2.2,.9,o,!0),-16),Y(t,r-n*.1,0,i+.62,n*.8,a+.04,.16,l,!0),Y(t,r-n*.05,0,i+.1,n*.3,.3,.9,l,!0),Y(t,r-n*.5+.1,0,i+1.3,.2,a+.05,1.5,[o[0]*.9,o[1]*.9,o[2]*.9],!0);let f=new H(new Jo(1.8,.4),new ss({map:rg(`AXLEYARD`),roughness:.5,transparent:!0}));f.position.set(r-n*.5-.02,i+1.4,0),f.rotation.y=-Math.PI/2,t.add(f);for(let a of[-1,1]){for(let e=-n*.45;e<n*.3;e+=n*.12){let o=u((e+n*.5)/n);X(t,r+e,a*(o*.5-.1),i+2.35,.06,.7,`up`,C_,!0)}Y(t,r-n*.08,a*(e.rootRadius*.75+.02),i+2.6,n*.3,.06,.5,T_,!0)}Y(t,r-n*.08,0,i+2.5,n*.36,e.rootRadius*1.5,1.1,o,!0),Y(t,r-n*.08,0,i+3.1,n*.3,e.rootRadius*1.2,.14,[o[0]*.85,o[1]*.85,o[2]*.85],!0),X(t,r+n*.05,.6,i+2.2,.18,n*.85,`x`,C_,!0),Y(t,r+n*.3,-.4,i+2.15,n*.18,.5,.3,l);break}case`deck`:{this.deckLength=n,this.deckPivot=new jn,this.deckPivot.position.set(-e.dollyDist,i-.15,0),t.add(this.deckPivot);let r=this.deckPivot,a=e.dollyDist-1,o=a-n*.5;Y(r,o,0,0,n,3,.3,e.color,!0),Y(r,o,0,.17,n-.3,2.7,.04,[.14,.14,.15],!1,!1);for(let e=a-1;e>a-n+1;e-=1.5)Y(r,e,0,.2,.08,2.7,.02,[.3,.3,.32],!1,!1);for(let e of[-1,1])Y(r,o,e*1.45,.25,n,.1,.2,E_);Y(r,a-n+.2,0,-.02,.5,3,.26,E_),Y(r,a-.6,0,.55,1,2.4,.8,S_),X(r,a-.6,0,.6,.7,2,`y`,[.55,.56,.58],!0),X(r,a-1.25,0,.3,.18,1.2,`y`,C_,!0),this.winchCable=Y(r,a-1.2,0,.35,1,.05,.05,[.1,.1,.1],!1,!1),this.winchCable.visible=!1;let s=X(this.trailer,-4,0,i-.5,.3,2.4,`x`,C_,!0);s.rotation.z=Math.PI/2-.3;break}default:{let n=(e.loadEnd-1)/16;for(let r=0;r<16;r++){let i=1+(r+.5)*n,a=uh(e,i,0)-e.underside,o=r%5==4?E_:e.color,s=dh(e,i-n*.5)*2,c=dh(e,i+n*.5)*2;if(e.boxy)Y(t,-i,0,e.underside+a*.5,n*1.03,s,a,o,!0);else{let r=Uh(t,-i,0,e.underside+a*.5,s,c,n*1.03,o,!0);r.scale.y=a/Math.max(s,.01)}}}}e.shape!==`deck`&&Y(t,-e.loadEnd-.4,0,e.underside+.4,.9,.9,.9,[.9,.05,.03])}setBroken(e,t){this.vehicle&&this.vehicle.parent?.remove(this.vehicle),this.vehicleKind=e,this.flashers=[];let n=new jn;this.vehicle=n,this.scene.add(n);let r=e.halfLength*2,i=e.height,a=t===1?2.5:2.6,o=e.halfLength,s=-e.halfLength,c=[.92,.92,.9],l=(e,t)=>{X(n,e,t,.55,1.1,.4,`y`,w_),X(n,e,t+Math.sign(t)*.21,.55,.6,.04,`y`,C_,!0)},u=(e,t,r,i)=>this.flashers.push(Kh(n,e,t,r,.06,.28,.2,i,3)),d=(e,t,r,i,a)=>Kh(n,e,t,r,.05,i,a,[1,.95,.8],2),f=(e,t,r,i,a)=>Kh(n,e,t,r,.05,i,a,[1,.08,.04],1.5),p=[1,.6,.05];if(t===0){Y(n,0,0,.5+(i-.5)*.5,r,a,i-.5,e.color,!0),Y(n,0,0,.75,r+.02,a+.02,.5,S_);for(let t of[-1,1]){Y(n,.3,t*(a*.5+.02),i-1.05,r-2.4,.05,1.3,T_,!0);for(let e=-r*.5+1.9;e<r*.5-1.4;e+=1.55)Y(n,e,t*(a*.5+.04),i-1.05,.07,.03,1.3,S_);Y(n,0,t*(a*.5+.02),1.3,r,.03,.22,[e.color[0]*.5,e.color[1]*.5,e.color[2]*.5]),Y(n,0,t*(a*.5+.03),1.48,r-.6,.02,.05,C_,!0),Y(n,o+.7,t*(a*.5+.5),i-1.1,.14,.22,.45,S_),d(o+.03,t*(a*.5-.4),1,.4,.22),f(s-.03,t*(a*.5-.35),1.15,.3,.45),u(o+.04,t*(a*.5-.95),1,p),u(s-.04,t*(a*.5-.8),1.15,p);for(let e of[o-2.2,s+2.6,s+3.9])l(e,t*(a*.5-.2))}Y(n,o+.03,0,i-1.15,.05,a-.3,1.7,T_,!0),Kh(n,o+.04,0,i-.25,.05,a-.9,.28,[1,.5,.05],2),Y(n,s-.03,0,i-.65,.05,a-.7,.8,T_,!0);for(let e of[-2.6,2.4])Y(n,e,0,i+.14,1.6,1.4,.28,[.8,.8,.78])}else if(t===1){let t=[.45,.08,.1],m=[.8,.6,.2];Y(n,-1,0,.5+(i-.5)*.5,r-2,a,i-.5,e.color,!0),Y(n,o-1,0,i-.55,2,a,1.1,e.color,!0),Y(n,o-1,0,1.3,2,a-.2,1.5,e.color,!0),Y(n,o+.02,0,1.75,.05,a-.5,.9,T_,!0),Y(n,o+.03,0,1.05,.05,a-.8,.4,S_),Y(n,o+.05,0,.72,.14,a-.1,.26,[.55,.56,.58]);for(let e of[-1,1])Y(n,-1,e*(a*.5+.02),1.55,r-2.4,.03,.14,t),Y(n,-1,e*(a*.5+.02),1.72,r-2.4,.03,.05,m),Y(n,-2.6,e*(a*.5+.02),i-1.1,1.3,.05,.8,T_,!0),Y(n,-.6,e*(a*.5+.02),i-1.1,1.1,.05,.8,T_,!0),Y(n,o-1,e*(a*.5-.08),1.6,1.2,.05,.6,T_,!0),d(o+.03,e*(a*.5-.4),1.3,.3,.2),f(s-.03,e*(a*.5-.3),1.2,.25,.35),u(o+.04,e*(a*.5-.85),1.3,p),u(s-.04,e*(a*.5-.75),1.2,p),l(o-1.3,e*(a*.5-.2)),l(s+2.2,e*(a*.5-.2)),l(s+2.2,e*(a*.5-.62));Y(n,-1.55,a*.5+.02,1.9,.75,.03,2.1,[.75,.73,.68]),X(n,-1,a*.5+.12,i-.25,.2,r-3.2,`x`,[.5,.5,.52]);for(let e=1.2;e<3.1;e+=.4)Y(n,s-.1,.7,e,.05,.45,.05,C_,!0);X(n,s-.2,-.5,1.4,.85,.26,`x`,w_),Y(n,-1.6,0,i+.14,1,.9,.28,c)}else if(t===3){let t=o-3.3;Y(n,0,0,.75,r-.2,a-.4,.45,S_),Y(n,o-.9,0,1.1,1.8,a,.5,e.color,!0),Y(n,o-2.45,0,1+(i-1)*.5,1.9,a,i-1,e.color,!0);let c=r*.5+t-.2;Y(n,t-c*.5-.1,0,1.2,c,a,.7,e.color,!0),Y(n,t-c*.5-.1,0,1.5,c-.3,a-.2,.08,S_),Y(n,t-.6,0,1.6,.5,a-.3,.45,[.5,.5,.52],!0),Y(n,o-1.6,0,i-.45,.05,a-.5,.7,T_,!0),Y(n,o+.02,0,1.05,.05,a-.6,.45,S_),Y(n,o+.08,0,.7,.14,a,.22,[.55,.56,.58]),Y(n,s-.08,0,.7,.14,a,.22,[.55,.56,.58]),Y(n,o-2.2,0,i+.1,.25,1.4,.18,S_);for(let e of[-1,1])Y(n,o-2.45,e*(a*.5+.02),i-.55,1.7,.05,.6,T_,!0),d(o+.03,e*(a*.5-.35),1.1,.35,.25),f(s-.03,e*(a*.5-.25),1.2,.2,.5),u(o-2.2,e*.4,i+.1,p),u(s-.04,e*(a*.5-.6),1.2,p),l(o-1.2,e*(a*.5-.15)),l(s+1.4,e*(a*.5-.15))}else{Y(n,-.65,0,.5+(i-.5)*.5,r-1.3,a,i-.5,e.color,!0),Y(n,-.65,0,i-.05,r-1.7,a-.2,.1,c),Y(n,o-.65,0,1.35,1.3,a-.3,1.3,e.color,!0),Y(n,o+.02,0,1.3,.04,a-.8,.8,S_);for(let e of[1.1,1.3,1.5])Y(n,o+.04,0,e,.02,a-.9,.04,C_,!0);Y(n,o+.05,0,.75,.14,a,.28,S_),Y(n,s-.05,0,.75,.14,a,.28,S_),Y(n,o-1.28,0,i-1,.05,a-.4,1.1,T_,!0),Y(n,s-.03,0,i-1,.05,a-.8,.9,T_,!0);for(let e of[-1,1]){for(let t=s+1.4;t<o-2.6;t+=1.25)Y(n,t,e*(a*.5+.01),i-1,1.1,.03,1,S_),Y(n,t,e*(a*.5+.03),i-1,.95,.05,.85,T_,!0);for(let t of[.95,1.55,2.25])Y(n,-.65,e*(a*.5+.02),t,r-1.5,.04,.1,S_);d(o+.03,e*(a*.5-.45),1.5,.3,.25),f(s-.03,e*(a*.5-.35),1.3,.25,.4),u(o-1.27,e*(a*.5-.25),i-.2,[1,.08,.04]),u(s-.04,e*(a*.5-.25),i-.2,[1,.08,.04]),u(o+.04,e*(a*.5-.9),1.5,p),l(o-1.6,e*(a*.5-.2)),l(s+2.6,e*(a*.5-.2))}Y(n,o-2.2,-(a*.5+.35),1.6,.05,.5,.5,[.85,.05,.03])}}updateRecovery(e,t,n,r,i){let a=this.vehicle,o=this.vehicleKind,s=this.deckPivot;if(!a||!o||!s)return;let c=Math.floor(i*2)%2==0;for(let t=0;t<this.flashers.length;t++)this.flashers[t].visible=!e.loaded&&t%2==0===c;let l=this.deckLength-(t.dollyDist-1),u=Math.asin(Math.min(.5,(t.underside-.15)/l)),d=!e.loaded&&(e.linedUp||e.winch>0)?u:0;this.deckTilt+=Math.sign(d-this.deckTilt)*Math.min(Math.abs(d-this.deckTilt),r*.25),s.rotation.z=this.deckTilt;let f=t.dollyDist-1;if(!e.loaded&&e.winch<=0){a.parent!==this.scene&&(a.parent?.remove(a),this.scene.add(a)),Hh(a,n.x,n.y,n.ground,n.yaw),a.rotation.set(0,-n.yaw,0,`YXZ`),this.winchCable&&(this.winchCable.visible=e.linedUp),this.winchCable&&e.linedUp&&this.cable(f-1.2,t.dollyDist-t.loadEnd-1);return}a.parent!==s&&(a.parent?.remove(a),s.add(a)),this.load.updateMatrixWorld(!0);let p=s.worldToLocal(new z(n.x,n.ground,n.y)),m=p.x,h=p.z,g=f-1.6-o.halfLength,_=e.loaded?1:e.winch,v=m+(g-m)*_,y=h*(1-_),b=f-this.deckLength,x=Math.max(0,Math.min(1,(v+o.halfLength-b)/(o.halfLength*2))),S=(-(t.underside-.15)-v*Math.sin(this.deckTilt))/Math.cos(this.deckTilt);a.position.set(v,.15*x+S*(1-x),y),a.rotation.set(0,e.winchSkew*.12*!e.loaded+(1-_)*-x_(n.yaw-e.trailerYaw),-this.deckTilt*(1-x),`YXZ`),this.winchCable&&(this.winchCable.visible=!e.loaded,e.loaded||this.cable(f-1.2,v+o.halfLength))}cable(e,t){let n=this.winchCable;n.scale.x=Math.max(.1,e-t),n.position.x=(e+t)*.5}resetRecovery(){this.deckTilt=0,this.deckPivot&&(this.deckPivot.rotation.z=0)}headlights(){for(let e of[-1,1]){let t=new sc(new V(1,.95,.85),260,110,.42,.5,1.4);t.position.set(this.noseX+.05,1,e*1),t.target.position.set(60,-1.5,e*2.5),t.castShadow=!1,this.truck.add(t,t.target),this.lamps.push(t,t.target)}}placeLoad(e,t,n,r,i){this.loadFree=!0,this.load.position.set(e,n,t),this.load.rotation.set(0,-r,i?Math.PI/2:0,`YXZ`)}update(e,t,n=0){let r=e.height+e.ground;Hh(this.truck,e.hitch.x,e.hitch.y,r,e.yaw),Hh(this.trailer,e.hitch.x,e.hitch.y,r,e.trailerYaw);let i=e.duck*ip;this.cradle.position.y=-i,this.truck.rotation.set(0,-e.yaw,e.pitch,`YXZ`),this.trailer.rotation.set(0,-e.trailerYaw,e.pitch,`YXZ`),this.loadFree||(Hh(this.load,e.hitch.x,e.hitch.y,r-i+n,e.trailerYaw),this.load.rotation.set(0,-e.trailerYaw,e.pitch,`YXZ`));for(let t of this.wheels)t.rotation.z-=e.speed*.016/.55;for(let t of this.frontWheels)t.rotation.y=-e.steer;for(let t of this.brakeLamps)t.material.emissiveIntensity=e.speed>.5&&e.boosting?.2:1;for(let t of this.flames)t.visible=e.boosting,e.boosting&&t.scale.set(.4+Math.random()*.3,1+Math.random()*1.2,.4+Math.random()*.3)}loadCentre(e,t){let n=G(cf(e.trailerYaw),-(1+t.loadEnd)*.5),r=W(e.hitch,n);return{x:r.x,y:r.y,up:e.height+e.ground+t.underside+t.rootThickness*.5}}bogie(e,t){return W(e.hitch,G(cf(e.trailerYaw),-t.dollyDist))}},k_=[`sedan-fairheaven`,`sedan-negotiator`,`sedan-kiri86`,`sedan-kiri10`,`sedan-carter`,`pickup-conquer`],A_=`taxi-canyon`,j_=4.6;function M_(e){e.updateMatrixWorld(!0);let t=new tr().setFromObject(e),n=t.getSize(new z),r=j_/n.x,i=new B().makeScale(r,r,r).multiply(new B().makeTranslation(-(t.min.x+t.max.x)/2,-t.min.y,-(t.min.z+t.max.z)/2)),a=new Map;e.traverse(e=>{let t=e;if(!t.isMesh)return;let n=Array.isArray(t.material)?t.material[0]:t.material;a.has(n)||a.set(n,[]),a.get(n).push(h_(t.geometry,i.clone().multiply(t.matrixWorld)))});let o=new jn;for(let[e,t]of a){let n=sg(t,!1);if(!n)continue;let r=new H(n,e);r.castShadow=!0,o.add(r)}return{group:o,length:j_,width:n.z*r,height:n.y*r}}var N_=null;function P_(){return N_??=(async()=>{let e=new fg,t=t=>e.loadAsync(`/play/models/${t}.glb`).then(e=>M_(e.scene)).catch(()=>null);return{cars:(await Promise.all(k_.map(t))).filter(e=>e!==null),taxi:await t(A_)}})()}var F_=[.55,.55,.52],I_=[.62,.6,.56],Z=[.12,.12,.13],L_=[.8,.82,.85],R_=[.05,.05,.05],z_=[.3,.45,.55],B_=[.95,.75,.05],V_=[.96,.7,.04],H_=[.1,.35,.8],U_=[.92,.92,.9],W_=[.3,.24,.15],G_=[.42,.4,.38],K_=[.45,.14,.08],q_=[.35,.24,.12],J_=[.9,.9,.86],Y_=[.05,.2,.4],X_=`/play/axlon-face.png`,Z_=new Map;function Q_(e,t,n){let r=e.join(`,`)+(t?`|`+t.uuid:``)+(n?`|`+n.uuid:``),i=Z_.get(r);return i||(i=new ss({color:new V(e[0],e[1],e[2]),roughness:.95,side:2,map:t??null,normalMap:n??null}),Z_.set(r,i)),i}function $_(e,t,n,r,i,a,o,s=!0,c,l=8){let u=[],d=[],f=[],p=0;for(let o=t;o<=n;o+=2){let t=Mf(e,o,-r),n=Mf(e,o,i);u.push(t.x,a+wf(e,t),t.y,n.x,a+wf(e,n),n.y),d.push(0,o/l,(r+i)/l,o/l),p>0&&f.push(p-2,p,p-1,p-1,p,p+1),p+=2}let m=new Pr;m.setAttribute(`position`,new Sr(u,3)),m.setAttribute(`uv`,new Sr(d,2)),m.setIndex(f),m.computeVertexNormals();let h=c&&`normalMap`in c?c:null,g=new H(m,h?Q_(o,h.map,h.normalMap):Q_(o,c));return g.receiveShadow=s,g.frustumCulled=!1,g}function ev(e,t,n,r,i,a,o,s=8){let c=tf(n,t),l=rf(c),u=G(c,1/l),d={x:-u.y,y:u.x},f=[],p=[],m=[],h=0;for(let n=0;n<=l+.01;n+=Math.min(4,l)){let a=W(t,G(u,Math.min(n,l))),o=W(a,G(d,-r*.5)),c=W(a,G(d,r*.5));f.push(o.x,i+wf(e,o),o.y,c.x,i+wf(e,c),c.y),p.push(0,n/s,r/s,n/s),h>0&&m.push(h-2,h,h-1,h-1,h,h+1),h+=2}let g=new Pr;g.setAttribute(`position`,new Sr(f,3)),g.setAttribute(`uv`,new Sr(p,2)),g.setIndex(m),g.computeVertexNormals();let _=o&&`normalMap`in o?o:null,v=new H(g,_?Q_(a,_.map,_.normalMap):Q_(a,o));return v.receiveShadow=!0,v.frustumCulled=!1,v}function tv(e,t,n,r,i,a,o,s=`#0a0a0c`,c=!1){let l=tg(t,o,s),u=l.aspect,d=new H(new Jo(a*u,a),new ss({map:l,roughness:.6}));return d.position.set(n,i,r),d.rotation.y=c?Math.PI/2:-Math.PI/2,e.add(d),d}function nv(e,t,n,r,i,a=!1,o=!1){let s=new H(new Jo(i,i*640/549),new ss({map:ng(X_),roughness:.7,transparent:!0}));return s.position.set(t,r,n),s.rotation.y=o?a?Math.PI:0:a?Math.PI/2:-Math.PI/2,e.add(s),s}function rv(e,t){for(let n=e;n;n=n.parent)if(n===t)return!0;return!1}var iv=class{constructor(e,n){this.c=n,this.group=new jn,this.obstacleMeshes=[],this.rotors=[],this.movers=[],this.crossingShows=[],this.giftPivots=[],this.waterMats=[],this.readouts=[],this.boards=[],this.siteLamps=[],this.hook=null,this.boomTip=new z,this.carSlots=[],this.siteGroup=null,this.siteExtras=[],this.mark={x:0,y:0,up:0,yaw:0,hanging:!1},this.markGlows=[],this.gloom=0;let r=this.group,i=1/0,a=-1/0,o=1/0,s=-1/0;for(let e of n.points)i=Math.min(i,e.pos.x),a=Math.max(a,e.pos.x),o=Math.min(o,e.pos.y),s=Math.max(s,e.pos.y);let c={x:(i+a)*.5,y:(o+s)*.5},l=n.hillGrade>0,u=n.coast?null:ag(n.desert?`sand`:n.port||n.city?`concrete`:`grass`),d=n.desert?7:(n.port||n.city,5),f=u?u.map.clone():$h(),p=u?u.normalMap.clone():null;for(let e of[f,p])e&&(e.wrapS=e.wrapT=t,e.repeat.set(12e3/d,12e3/d),e.needsUpdate=!0);let m=n.coast?[.1,.32,.5]:n.desert?[1,.9,.8]:n.port?[.95,.95,.95]:n.city?[.7,.7,.72]:[.62,.95,.42],h=new Jo(12e3,12e3,l?400:96,l?400:96);if(l){let e=h.attributes.position;for(let t=0;t<e.count;t++)e.setZ(t,wf(n,{x:e.getX(t)+c.x,y:-e.getY(t)+c.y}));h.computeVertexNormals()}let g=new ss({color:new V(...m),map:f,normalMap:p,roughness:n.coast?.55:1,metalness:n.coast?.1:0});u&&og(g);let _=new H(h,g);if(_.rotation.x=-Math.PI/2,_.position.set(c.x,n.coast?-.6:-.12,c.y),_.receiveShadow=!0,r.add(_),this.ground=_,n.coast){_.material.map=null,this.waterMats.push(_.material);let e=ag(`beach`);r.add($_(n,-120,n.length+40,23,23,-.1,[1,1,1],!0,e,6));for(let t of n.shortcuts)r.add(ev(n,t.from,t.to,t.halfWidth*2+10,-.1,[1,1,1],e,6))}r.add($_(n,-80,n.length,11,11,0,[.78,.75,.7],!0,ag(`gravel`),3)),r.add($_(n,-80,n.length,8,8,.02,[.82,.82,.84],!0,ag(`road`),4)),r.add($_(n,0,n.length,7.7,-7.5,.03,J_,!1)),r.add($_(n,0,n.length,-7.5,7.7,.03,J_,!1));for(let e=0;e<n.length;e+=9)r.add($_(n,e,e+3,.12,.12,.03,[.9,.75,.1],!1));n.endless||r.add($_(n,n.stopS,n.stopS+n.stopLength,7.4,7.4,.035,[.1,.7,.2],!1)),this.buildShortcuts(),this.buildDepot();for(let e of n.obstacles)this.obstacleMeshes.push(this.buildObstacle(e));for(let e of n.bridges)this.buildBridge(e);for(let e of n.narrows)this.buildNarrow(e.s+e.length*.5,e.length,e.halfWidth);for(let e of n.crossings)this.buildCrossing(e);for(let e of n.scales)this.buildScale(e);this.buildGifts(),this.buildJumps(),n.endless||this.buildSite(),!n.city&&!n.port&&this.plantTrees(),this.storm=new H(new Jo(1,1),new di({visible:!1}));let v=this.cloudTex??=eg();for(let e=0;e<26;e++){let t=new ii(new Wr({map:v,color:new V(.1,.1,.13),transparent:!0,opacity:.92,depthWrite:!1,fog:!1})),n=120+Math.random()*120;t.scale.set(n,n*.55,1),t.position.set((e-12.5)*40+(Math.random()-.5)*30,25+Math.random()*60,(Math.random()-.5)*30),this.storm.add(t)}let y=new H(new Jo(1e3,70),new di({color:new V(.25,.27,.32),transparent:!0,opacity:.55,side:2,depthWrite:!1,fog:!1}));y.position.set(0,35,10),this.storm.add(y),r.add(this.storm),e.add(r)}pivotAt(e,t,n=0){let r=new jn;return Hh(r,e.x,e.y,n+wf(this.c,e),t),this.group.add(r),r}buildShortcuts(){let e=this.c;for(let t of e.shortcuts){let n=ag(e.city?`road`:e.coast?`beach`:e.desert?`sand`:`gravel`),r=e.city?[.8,.8,.82]:e.coast?[1,1,1]:e.desert?[.95,.85,.75]:[.85,.75,.6];this.group.add(ev(e,t.from,t.to,t.halfWidth*2+1.2,.015,r,n,4));let i=tf(t.to,t.from),a=Math.atan2(i.y,i.x),o=W(t.from,G(i,10/rf(i))),s=this.pivotAt(o,a);for(let e of[-1,1])Y(s,0,e*(t.halfWidth+1.2),1.6,.14,.14,3.2,Z),Y(s,0,e*(t.halfWidth+1.2),2.9,.1,1.6,.6,B_)}}mover(e,t,n,r=0,i=!1,a=!0){this.movers.push({part:e,path:t,speed:n,at:r,thereAndBack:i,spin:!1,facesAhead:a})}buildDepot(){let e=this.c,n=this.pivotAt(Mf(e,0),Nf(e,0)),r=ag(`gravel`),i=r.map.clone(),a=r.normalMap.clone();for(let e of[i,a])e.wrapS=e.wrapT=t,e.repeat.set(116/3,32),e.needsUpdate=!0;let o=new H(new Jo(116,96),new ss({map:i,normalMap:a,color:new V(.95,.92,.88),roughness:1}));o.rotation.x=-Math.PI/2,o.position.set(-12,.01,0),o.receiveShadow=!0,n.add(o);let s=(e,t,r,i)=>{let a=Math.max(1,Math.round(Math.hypot(r-e,i-t)/6));for(let o=0;o<=a;o++)Y(n,e+(r-e)*o/a,t+(i-t)*o/a,1.1,.12,.12,2.2,Z);for(let a of[.7,1.4,2.1]){let o=Y(n,(e+r)*.5,(t+i)*.5,a,Math.hypot(r-e,i-t),.05,.05,Z,!1,!1);o.rotation.y=-Math.atan2(i-t,r-e)}};s(-70,-48,-70,48),s(-70,-48,46,-48),s(-70,48,46,48),s(46,-48,46,-11.1),s(46,11.1,46,48);for(let e of[-1,1])Y(n,46,e*10.4,4.2,1.5,1.5,8.4,[.5,.42,.34]);Y(n,46,0,9.4,.5,22.3,3.2,[.012,.012,.015]),Y(n,46,0,11.1,.54,22.3,.22,V_),Y(n,46,0,7.7,.54,22.3,.22,H_);for(let t of[-1,1])tv(n,`AXLEYARD   ${e.town}`,46+t*.3,1.6*t,10,1.5,`#f5b400`,`rgba(0,0,0,0)`,t>0),tv(n,`TRAILERS  &  TRUCKS`,46+t*.3,1.6*t,8.5,.7,`#eeeeee`,`rgba(0,0,0,0)`,t>0),nv(n,46+t*.3,-8.6*t,9.4,2.4,t>0);for(let[e,t]of[[-64,-42],[-64,42],[34,-42],[34,42]])X(n,e,t,6.5,.3,13,`up`,Z),Y(n,e,t+Math.sign(-t)*1.2,13,.4,2.4,.3,Z),Kh(n,e,t+Math.sign(-t)*2.2,12.85,.6,.9,.14,[.6,.6,.55],.6);for(let e of[-1,1])for(let t=-62;t<26;t+=4.5)Y(n,t,e*32,.06,.15,12,.02,[.75,.75,.72],!1,!1);X(n,40,-15.4,7,.2,14,`up`,L_,!0),Y(n,40,-17,12.6,.06,3,2,[.05,.17,.4]),nv(n,40.05,-17,12.6,1.5);for(let e of[-1,1])for(let t of[-2,0,2])X(n,46+t,e*11.6,.5,.3,1,`up`,V_);for(let e=0;e<3;e++)for(let t=0;t<3+e%2;t++)X(n,-64+e*2.4,34,.3+t*.6,1.6,.55,`up`,R_),X(n,-64+e*2.4,34,.3+t*.6,.9,.57,`up`,[.24,.24,.26]);for(let e=0;e<2;e++)for(let t=0;t<5;t++)Y(n,-56+e*2,34+e*1.6,.08+t*.16,1.2,1,.14,q_);for(let e of[-1,1])X(n,-66,e*44,6,.3,12,`up`,Z),Kh(n,-66,e*44,12.2,1.2,1.2,.4,[.3,.3,.3],.5);let c=(e,t,r,i,a,o,s)=>{if(Y(n,e,t,a*.5,r,i,a,o),Y(n,e,t,a+.4,r+.8,i+.8,.8,[.33,.33,.35]),s){let o=t<0?1:-1;Y(n,e,t+o*(i*.5+.1),a-.9,r*.7,.1,1.2,[.012,.012,.015]);let c=tv(n,s,e,t+o*(i*.5+.22),a-.9,.7,`#f5b400`,`rgba(0,0,0,0)`);c.rotation.y=o>0?0:Math.PI}};c(-56,-38,14,9,4,U_,`AXLEYARD`),nv(n,-56,-33.3,2,1.4,!1,!0),c(-30,-36,20,13,7,[.55,.57,.58],`SERVICE`),Y(n,-30,-29.4,3,8,.1,5.6,[.1,.1,.11]);let l=[[.8,.42,.02],[.85,.85,.83],[.05,.08,.3],[.6,.06,.04],[.05,.25,.1]],u=(e,t,r,i)=>{let a=new jn;a.position.set(e,0,t),a.rotation.y=-r,Y(a,-2,0,1.1,12,3,.5,i,!0),Y(a,5,0,1.45,3,1.4,.45,i,!0),Y(a,5.5,0,.7,.3,1,1,Z);for(let e of[-6,-7.6])for(let t of[-1,1])X(a,e,t*1.25,.5,1,.6,`y`,R_);for(let e=0;e<6;e++)Y(a,-8.05,-1.25+.5*e,1.1,.1,.5,.5,e%2==0?B_:Z,!1,!1);n.add(a)},d=(e,t,r,i)=>{let a=new jn;a.position.set(e,0,t),a.rotation.y=-r,Y(a,0,0,1,7.4,2.8,.8,i,!0),Y(a,1.8,0,2.5,2.6,2.8,2.2,i,!0),Y(a,3.12,0,2.9,.05,2.5,.9,z_,!0),Y(a,-.4,0,1.9,1.8,2.6,1,Z);for(let e of[-2.4,-1,2.4])for(let t of[-1,1])X(a,e,t*1.25,.55,1.1,.6,`y`,R_);n.add(a)};for(let e=0;e<2;e++)for(let t=0;t<4;t++)u(-58+t*15,24-e*10,Math.PI/2+.1,l[(t+e)%l.length]);for(let e=0;e<3;e++)d(-50+e*10,-18,Math.PI/2,l[(e+2)%l.length]);for(let e=0;e<2;e++)d(18-e*10,18,-Math.PI/2,l[e%l.length])}buildObstacle(e){let t=new jn;switch(e.kind){case K.Cone:Wh(t,0,0,0,e.radius*2,e.height,e.color),Y(t,0,0,.03,.7,.7,.06,e.color);break;case K.Pole:if(e.radius<=.2){let n=-Math.sign(e.lateral||1)*2.4;X(t,0,0,e.height*.5,e.radius*2,e.height,`up`,e.color),Y(t,0,n*.5,e.height-.1,.16,Math.abs(n),.16,e.color),Kh(t,0,n,e.height-.3,.6,1.2,.3,[1,.9,.7],2.5),this.siteLamps.push(t.children[t.children.length-1]);break}X(t,0,0,e.height*.5,e.radius*2,e.height,`up`,e.color),Y(t,0,0,e.height-.6,.2,2.2,.16,e.color);for(let n of[-.9,.9])X(t,0,n,e.height-.3,.16,.3,`up`,[.85,.85,.8]);break;case K.Bin:Y(t,0,0,e.height*.5,e.half.x*2,e.half.y*2,e.height,e.color),Y(t,0,0,e.height+.08,e.half.x*2+.1,e.half.y*2+.1,.16,[.04,.16,.09]);for(let n of[-1,1])Y(t,n*(e.half.x+.1),0,e.height*.6,.2,.6,.3,Z);break;case K.Stall:Y(t,0,0,.9,e.half.x*2,e.half.y*2,.08,q_);for(let n of[-1,1])for(let r of[-1,1])Y(t,n*(e.half.x-.1),r*(e.half.y-.1),1.3,.08,.08,2.6,Z);Y(t,0,0,2.65,e.half.x*2+.6,e.half.y*2+.6,.1,e.color);for(let n=-e.half.x+.3;n<e.half.x;n+=.75)Y(t,n,0,1.15,.55,.9,.42,n%1.5<.75?[.7,.2,.1]:[.2,.5,.15]);Y(t,0,0,.4,e.half.x*1.6,e.half.y*1.6,.8,[.5,.36,.2]);break;case K.Sign:X(t,0,0,e.height*.5,e.radius*2,e.height,`up`,[.5,.5,.5]),Y(t,0,0,e.height-.5,.08,1,1,e.color);break;case K.Pillar:if(e.radius>=1&&e.height<=e.radius*1.4&&e.height>e.radius){let n=e.radius*2.1,r=Gh(t,0,0,e.height*.45,n,e.color);r.scale.set(n,e.height*1.1,n*.85),r.rotation.y=e.s*.37,Gh(t,e.radius*.4,e.radius*.3,e.height*.3,e.radius*1.2,e.color);break}if(e.radius>=4){X(t,0,0,e.height*.5,e.radius*2,e.height,`up`,e.color);for(let n=1;n<e.height;n+=3)X(t,0,0,n,e.radius*2+.2,.2,`up`,[.5,.5,.48]);let n=Gh(t,0,0,e.height,e.radius*2,e.color);n.scale.y*=.15,Y(t,-e.radius-.3,0,e.height*.5,.1,.6,e.height,Z,!1,!1),Kh(t,0,0,e.height+.6,.3,.3,.3,[1,.1,.05],2);break}X(t,0,0,e.height*.5,e.radius*2,e.height,`up`,e.color);break;case K.Wall:return null;case K.Board:{for(let e of[-6.5,6.5])Y(t,-.3,e,3,.6,.6,6,Z);Y(t,-.25,0,9.5,.3,18.4,7.4,e.color),Y(t,-.2,0,13.3,.34,18.4,.3,V_),Y(t,-.2,0,5.7,.34,18.4,.3,H_);for(let e of[-6,0,6])Y(t,.6,e,5.4,1.4,.12,.12,Z),Kh(t,1.2,e,5.3,.4,.5,.14,[1,.95,.8],.8);let n=new jn;nv(n,0,5.6,9.5,5.6,!0),tv(n,`AXLEYARD.COM`,0,-3,10.6,1.7,`#f5b400`,`rgba(0,0,0,0)`,!0),tv(n,`TRUCKS   TRAILERS   EQUIPMENT`,0,-3,8.3,.7,`#e6e6e6`,`rgba(0,0,0,0)`,!0),t.add(n);let r=new jn;r.visible=!1;let i=new H(new Jo(8.6,6.4),new ss({color:16777215,roughness:.6}));i.position.set(0,9.5,4.6),i.rotation.y=Math.PI/2,r.add(i),t.add(r),this.boards.push({group:t,plain:n,ad:r,photo:i,s:e.s});break}case K.ParkedCar:case K.Traffic:{if(e.swayWidth){if(this.c.city){this.carSlots.push({grp:t,taxi:!0,pick:0}),Y(t,0,0,.7,3.4,1.8,.6,[.95,.75,.05],!0),Y(t,-.2,0,1.3,1.9,1.6,.6,[.95,.75,.05],!0),Y(t,.78,0,1.3,.05,1.4,.45,z_,!0),Y(t,-.2,0,1.7,.6,.4,.18,[.1,.1,.1]);for(let e of[-1,1])for(let n of[-1.1,1.1])X(t,n,e*.85,.32,.64,.25,`y`,R_);for(let e of[-1,1])Kh(t,1.72,e*.55,.8,.05,.25,.15,[1,.95,.8],2)}else{Y(t,-.3,0,.9,2.4,1.6,.9,e.color,!0),Y(t,-1.3,0,1.2,.5,1.4,.6,Z);for(let e of[-1,1])for(let n of[-.9,.7])X(t,n,e*.8,.35,.7,.3,`y`,R_);for(let e of[-1,1])Y(t,.9,e*.5,1.4,.12,.12,2.6,Z);Y(t,.9,0,2.7,.12,1.2,.12,Z);for(let e of[-1,1])Y(t,1.6,e*.4,.12,1.2,.14,.06,[.3,.3,.32]);for(let e of[-1,1])Y(t,-.3,e*.7,1.9,1.6,.06,.06,Z);Y(t,-.3,0,2.3,1.6,1.5,.06,Z),Y(t,-.8,0,1.5,.5,.5,.5,[.1,.1,.1]),Kh(t,-.3,0,2.45,.2,.2,.2,[1,.5,.05],3)}break}this.carSlots.push({grp:t,taxi:!1,pick:Math.abs(Math.round(e.s*3.7+e.lateral*11))});let n=Math.round(e.s/7)%3==0,r=e.half.x*2,i=e.half.y*2;if(Y(t,0,0,.72,r,i,.62,e.color,!0),n){Y(t,.4,0,1.3,r*.42,i*.92,.55,e.color,!0),Y(t,-1.2,0,1.15,r*.44,i*.95,.25,e.color,!0),Y(t,-1.2,0,1,r*.4,i*.8,.04,[.15,.15,.16],!1,!1),Y(t,1,0,1.4,.05,i*.8,.45,z_,!0),Y(t,-.2,0,1.4,.05,i*.8,.4,z_,!0);for(let e of[-1,1])Y(t,.4,e*(i*.46+.01),1.4,r*.34,.04,.4,z_,!0)}else{Y(t,-.2,0,1.3,r*.56,i*.9,.5,e.color,!0),Y(t,.95,0,1.3,.05,i*.78,.42,z_,!0),Y(t,-1.35,0,1.3,.05,i*.78,.38,z_,!0);for(let e of[-1,1])Y(t,-.2,e*(i*.45+.01),1.32,r*.48,.04,.36,z_,!0)}for(let n of[-1,1])Y(t,n*(e.half.x+.08),0,.55,.16,i+.05,.22,[.2,.2,.22]);for(let n of[-1,1])X(t,1.4,n*(e.half.y-.1),.35,.7,.25,`y`,R_),X(t,-1.4,n*(e.half.y-.1),.35,.7,.25,`y`,R_),X(t,1.4,n*(e.half.y+.03),.35,.4,.02,`y`,L_,!0),X(t,-1.4,n*(e.half.y+.03),.35,.4,.02,`y`,L_,!0),Kh(t,e.half.x+.02,n*.6,.85,.05,.3,.18,[1,.95,.8],2),Kh(t,-e.half.x-.02,n*.6,.85,.05,.3,.18,[1,.1,.05],1.5),Y(t,.9,n*(i*.5+.12),1.2,.1,.2,.12,[.1,.1,.1]);break}case K.Building:{let n=Math.round(e.s*7+e.lateral*3),r=()=>(n=n*1103515245+12345&2147483647,this.c.night&&n/2147483647<.4),[i,a,o]=e.color,s=i>a*1.5,c=i+a+o<.85,l=ag(s?`brick`:c?`concretewall`:`plaster`),u=s?[1,.92,.88]:c?[.75,.78,.85]:[Math.min(1,i*1.9),Math.min(1,a*1.9),Math.min(1,o*1.9)];Yh(t,0,0,e.height*.5,e.half.x*2,e.half.y*2,e.height,l,s?2.5:4,u),Y(t,0,0,e.height+.15,e.half.x*2+.6,e.half.y*2+.6,.3,[.25,.1,.08]);for(let n of[-1,1])for(let i=1;i<e.height-1.5;i+=3)for(let a=-e.half.x+2;a<e.half.x-1;a+=3)r()?Kh(t,a,n*(e.half.y+.02),i+1.2,1.2,.04,1.4,[1,.85,.55],1.2):Y(t,a,n*(e.half.y+.02),i+1.2,1.2,.04,1.4,[.1,.14,.2],!0,!1);Y(t,e.half.x+.02,0,1.2,.04,1.6,2.4,[.15,.1,.06]);break}case K.Rock:{let n=Math.round(e.s*3+e.lateral),r=()=>(n=n*1103515245+12345&2147483647,n/2147483647),i=t=>[e.color[0]*t,e.color[1]*t,e.color[2]*t],a=Math.max(2,Math.round(e.height/9)),o=e.height/a;for(let n=0;n<a;n++){let i=(r()-.5)*1.2-n*.15,a=n%2==0?.92+r()*.1:1.05+r()*.1;Yh(t,(r()-.5)*.8,(r()-.5)*.8,n*o+o*.5,e.half.x*2+i,e.half.y*2+i,o*1.02,ag(`cliff`),16,[Math.min(1,.95*a),Math.min(1,.85*a),Math.min(1,.8*a)])}let s=Math.max(2,Math.round(e.half.x/4));for(let n=0;n<s;n++){let i=e.half.x*2/s,a=1+r()*4;Yh(t,-e.half.x+(n+.5)*i,(r()-.5)*e.half.y,e.height+a*.5,i*(.6+r()*.4),e.half.y*(.8+r()*.8),a,ag(`cliff`),16,[.9,.82,.78])}for(let n=0;n<4;n++){let n=r()<.5?-1:1;Y(t,(r()-.5)*e.half.x*1.6,n*(e.half.y+.8+r()),.6+r()*.6,1.5+r()*2.5,1+r()*1.5,1+r(),i(.8+r()*.15)).rotation.set(r()*.4,r()*3,r()*.4)}break}case K.Container:{let n=6.1,r=2.6,i=2.6,a=Math.max(1,Math.round(e.half.x*2/n)),o=Math.max(1,Math.round(e.half.y*2/r)),s=Math.max(1,Math.round(e.height/i)),c=Math.round(e.s),l=()=>(c=c*1103515245+12345&2147483647,c/2147483647),u=[[.55,.08,.05],[.05,.2,.5],[.08,.35,.15],[.6,.4,.05],[.35,.35,.38],[.5,.2,.05]];for(let c=0;c<a;c++)for(let a=0;a<o;a++)for(let o=0;o<s;o++){let s=-e.half.x+(c+.5)*n,d=-e.half.y+(a+.5)*r,f=(o+.5)*i,p=u[Math.floor(l()*u.length)];Yh(t,s,d,f,6.02,2.52,2.52,ag(`metal`),1.2,[Math.min(1,p[0]*1.7+.05),Math.min(1,p[1]*1.7+.05),Math.min(1,p[2]*1.7+.05)]),Y(t,s+n*.5-.02,d,f,.08,2.2,2.3000000000000003,[p[0]*.7,p[1]*.7,p[2]*.7],!1,!1);for(let e of[-.5,.5])Y(t,s+n*.5+.03,d+e,f,.05,.08,2.1,[.75,.75,.72],!1,!1)}break}case K.Barrier:Y(t,0,0,e.height*.5,e.half.x*2,e.half.y*2,e.height,e.color);break;default:Y(t,0,0,e.height*.5,Math.max(e.half.x*2,e.radius*2,.5),Math.max(e.half.y*2,e.radius*2,.5),e.height,e.color)}return Hh(t,e.pos.x,e.pos.y,wf(this.c,e.pos),e.yaw),this.group.add(t),t}buildBridge(e){this.c;let t=this.pivotAt(e.pos,e.yaw),n=e.clearance+.16,r=10.6;switch(e.kind){case ff.Road:{let r=n+1;Y(t,0,0,n+.5,9,26,1,I_),Y(t,0,0,n+.08,7.8,25.6,.16,[.42,.41,.38]),Y(t,0,0,r+.03,7,26,.08,[.2,.2,.21]);for(let e of[-4.3,4.3]){Y(t,e,0,r+.45,.3,26,.9,[.7,.68,.64]),Y(t,e*.92,0,r+1.05,.08,26,.1,[.5,.5,.52],!0);for(let n=-12;n<13;n+=2.5)Y(t,e*.92,n,r+.85,.06,.06,.4,[.5,.5,.52])}for(let e of[-6.5,6.5])X(t,-3.9,e,r+4.5,.18,8,`up`,Z),Y(t,-3.3,e,r+8.4,1.4,.2,.2,Z),Kh(t,-2.7,e,r+8.3,.6,.4,.14,[1,.9,.7],.8);for(let e=-10;e<13;e+=6)Y(t,0,e,r+.08,.25,2.4,.02,J_,!1,!1);Y(t,-4.53,0,n+.5,.06,3.6,.7,[.95,.75,.05]),tv(t,`${(e.clearance*3.28084).toFixed(0)} FT  ${(e.clearance*3.28084%1*12).toFixed(0)} IN`,-4.57,0,n+.5,.5,`#111111`,`rgba(0,0,0,0)`);let i=[];for(let e of[-1,1]){Y(t,0,e*14,r*.5,10,2,r,[.52,.5,.46]);for(let n of[-1,1]){let i=Y(t,n*6.7,e*15.2,r*.42,4.6,.6,r*.84,[.5,.48,.44]);i.rotation.y=n*e*.5}for(let n=0;n<10;n++){let i=r*(1-(n+.5)/10)-.15,a=13+n*1.2;Y(t,0,e*(15+80*(n+.5)/10),i*.5,a,8.1,Math.max(i,.1),[.32,.42,.18]),Y(t,0,e*(15+80*(n+.5)/10),Math.max(i,.1)*.5,a-.5,8.12,Math.max(i,.1)*.55,W_)}let n=(e,n,r,i,a,o,s)=>{let c=Y(t,0,(e+r)*.5,(n+i)*.5,a,Math.hypot(r-e,i-n),o,s);c.rotation.x=Math.atan2(i-n,r-e)};n(e*14.7,r-.02,e*95,.02,7,.14,[.2,.2,.21]),n(e*95,.05,e*160,.05,7,.06,[.2,.2,.21]),n(e*95,.02,e*160,.02,10,.04,[.45,.4,.34]);for(let n of[-3.9,3.9]){let i=Y(t,n,e*55,r*.5+.7,.08,Math.hypot(80,r),.1,[.5,.5,.52],!0);i.rotation.x=e*Math.atan2(r,80)}let a=new z(0,.1,e*160),o=new z(0,.1,e*95),s=new z(0,r+.07,e*15);e<0?i.push(a,o,s):i.push(s,o,a)}for(let e=0;e<3;e++){let n=e%2==1,r=[.1+.6*(e*7%3)/2,.1+.4*(e*5%2),.1+.5*(e*3%3)/2],a=this.littleCar(r);t.add(a);let o=(n?[...i].reverse():i).map(e=>e.clone().add(new z(n?1.7:-1.7,0,0)));this.mover(a,o,11+2.5*e,e*40,!1,!0)}break}case ff.Rail:{let e=12.2,r=n+.7;Y(t,0,0,n+.35,4.4,e*2,.7,G_);for(let r of[-2.4,2.4]){Y(t,r,0,n+.85,.4,e*2,1.7,K_);for(let i=-11.2;i<e;i+=3)Y(t,r*1.1,i,n+.85,.1,.25,1.6,[.32,.1,.06]);Y(t,r,0,n+1.72,.6,e*2,.08,[.4,.12,.07]),Y(t,r,0,n+.02,.6,e*2,.08,[.4,.12,.07]);for(let i=-11.7;i<e;i+=.6)for(let e of[n+.3,n+1.4])Y(t,r*1.09,i,e,.05,.08,.08,[.25,.08,.05],!1,!1)}X(t,1.6,13.7,r+2.5,.16,5,`up`,Z),Y(t,1.6,13.7,r+4.6,.3,.5,1.2,Z),Kh(t,1.5,13.7,r+4.85,.1,.3,.3,[.2,1,.3],2.5),Kh(t,1.5,13.7,r+4.35,.1,.3,.3,[1,.1,.05],.3),Y(t,-2.64,0,n+.85,.04,3.2,.7,[.05,.1,.25]),tv(t,`MILL ROAD`,-2.68,0,n+.85,.45,`#eeeeee`,`rgba(0,0,0,0)`);for(let n=-11.6;n<e;n+=1.5)Y(t,0,n,r+.02,2.6,.3,.12,[.21,.14,.07]);let i=(e,n)=>{for(let i of[-.75,.75])Y(t,i,(e+n)*.5,r+.1,.14,Math.abs(n-e),.16,[.56,.57,.6],!0)};i(-12.2,e);for(let n of[-1,1]){let a=147.8,o=n*86.10000000000001;Y(t,0,o,r*.3,15,a,r*.6,W_),Y(t,0,o,r*.5-.05,8,a,r-.1,[.34,.28,.17]),Y(t,0,o,r-.04,4.4,a,.1,G_),Y(t,0,n*12.7,r*.5,15.5,1,r,[.52,.5,.46]);for(let e=0;e<4;e++){let i=r*(.8-.2*e)+.1;Y(t,0,n*(163+6*e),i*.5,13-2*e,6,i,W_)}i(n*e,n*160)}let a=this.train(6);t.add(a),this.mover(a,[new z(0,r+.18,-114),new z(0,r+.18,114)],15,60,!0,!1);break}case ff.Tree:{for(let e of[-1,1]){X(t,0,e*r,3.5,2.2,7,`up`,[.2,.13,.07]);for(let n=0;n<5;n++)Gh(t,n%2*2-1,e*(11.6+n%3*2.5),8.5+n*1.2,6+n%3*2,[.16+n%2*.04,.38+n%3*.05,.1])}let e=X(t,0,0,n+.6,1.1,23.2,`y`,[.2,.13,.07]);e.rotation.z=.04;for(let e=-2;e<=2;e++)Gh(t,e%2*1.5,e*4,n+2.4+Math.abs(e)*.6,4.5+e%2,[.18,.4,.11]);break}case ff.Conveyor:{let e=13.6;Y(t,0,0,n+1,2.6,e*2,1.8,[.85,.62,.04]),Y(t,0,0,n+.1,2.8,e*2,.2,Z);for(let r=-11.6;r<e;r+=4)Y(t,0,r,n+1,2.7,.15,1.9,[.6,.42,.02]);for(let e of[-1,1]){for(let n=0;n<3;n++)X(t,-2+n*7,e*(17.6+n*1.5),11,6,22,`up`,[.82,.8,.76]);Y(t,5,e*18.6,12,4,4,24,[.6,.58,.54]),Y(t,5,e*18.6,24.5,5,5,1,[.5,.48,.44])}break}case ff.Foot:Y(t,0,0,n+.3,2.6,22.2,.5,[.35,.37,.4]);for(let e of[-1,1]){Y(t,e*1.2,0,n+1.4,.08,22.2,.08,Z);for(let i=-10.6;i<=r;i+=2)Y(t,e*1.2,i,n+1,.06,.06,1.2,Z);for(let i=-9.6;i<r;i+=2){let r=Y(t,e*1.2,i,n+1,.05,2.2,.05,Z,!1,!1);r.rotation.x=.5*(i%4==0?1:-1)}}for(let e of[-1,1])for(let r=0;r<14;r++)Y(t,0,e*(12.1+r*.9),(n+.1)*(1-r/14),2.4,.9,.3,[.35,.37,.4]);break;case ff.Arch:{let e=ag(`cliff`),i=[.95,.85,.8];for(let r of[-1,1])Yh(t,0,r*13.6,(n+3)*.5,9,7,n+3,e,16,i),Yh(t,0,r*10.1,n*.5+1.4,7,2.2,n-1,e,16,i),Yh(t,0,r*17.6,2.5,7,4,5,e,16,[.85,.76,.72]);Yh(t,0,0,n+1.8,8,23.2,3.6,e,16,i),Yh(t,0,0,n+4.2,6,r*1.4,1.6,e,16,[1,.9,.85]),Yh(t,-2,3,n+5.4,3,4,1.2,e,16,i);break}case ff.Shed:{let e=n,r=n+3.5,i=25.2,a=Math.atan2(r-e,i);for(let n=-12;n<=12;n+=4)Y(t,n,11.6,e*.5,.5,.5,e,q_),Y(t,n,11.6,e-.5,.4,1.6,.3,q_);Y(t,0,-12.8,r*.5,24,1.2,r,[.42,.4,.36]);let o=Y(t,0,-.5,(e+r)*.5+.1,25,Math.hypot(i,r-e)+1.5,.35,[.3,.22,.12]);o.rotation.x=-a;let s=Y(t,0,-.5,(e+r)*.5+.55,24.6,Math.hypot(i,r-e)+.8,.5,[.92,.94,.97],!1);s.rotation.x=-a;for(let n=-11;n<12;n+=2){let o=Y(t,n,-.5,(e+r)*.5-.15,.3,Math.hypot(i,r-e),.3,q_,!1,!1);o.rotation.x=-a}let c=5,l=()=>(c=c*1103515245+12345&2147483647,c/2147483647);for(let e=-20;e<=20;e+=5){let n=8+l()*6;Gh(t,e,-14.6-l()*3,0,n,[.92,.94,.97]).scale.set(n,n*(.45+l()*.2),n*.8)}break}case ff.Line:for(let e of[n+.1,n+.6,n+1.1]){let n=Y(t,0,0,e-.3,.05,21.599999999999998,.05,[.08,.08,.08],!1,!1);n.scale.y=1,Y(t,0,0,e+.3,.06,r*1.2,.06,[.08,.08,.08],!1,!1)}for(let e of[-1,1])Y(t,0,e*r,n+1.4,.2,2.2,.16,q_);X(t,.5,r,n-.2,.7,1.2,`up`,[.4,.4,.42]);break;case ff.Gantry:{let e=25.2;Y(t,0,0,n+1.4,2.2,e,1.6,[.85,.62,.04],!0),Y(t,0,0,n+2.8,2.6,e,.4,[.75,.55,.04]);for(let e of[-1,1])Y(t,0,e*r,n+1.4,2.6,2.6,1.8,[.85,.62,.04]);Y(t,0,3,n+.3,2.2,3,.6,Z),Y(t,0,3,n-.1,1.6,6.1,.3,[.3,.3,.32]),Y(t,1.6,-4,n+.5,1.6,2,1.6,[.3,.33,.38]),Kh(t,0,0,n+3.2,.3,.3,.3,[1,.1,.05],2);break}default:Y(t,0,0,n+.6,2.4,24,1.2,F_)}}littleCar(e){let t=new jn;Y(t,0,0,.6,4.2,1.8,.6,e,!0),Y(t,-.3,0,1.15,2.2,1.6,.55,e,!0);for(let e of[-1,1])X(t,1.3,e*.85,.32,.64,.25,`y`,R_),X(t,-1.3,e*.85,.32,.64,.25,`y`,R_);return t}train(e){let t=new jn;for(let n=0;n<e;n++){let r=(n-(e-1)*.5)*14,i=n===0,a=i?[.75,.12,.05]:n%2==0?[.45,.3,.15]:[.3,.33,.38];if(Y(t,0,r,1.9,2.8,13,i?3.4:3,a,!0),i)Y(t,0,r+4,3.9,2.4,3.5,.9,[.12,.12,.13]),Kh(t,0,r+7-.45,1.6,.6,.1,.4,[1,.95,.8],2.5);else if(n%2==0)for(let e of[-1,1]){let n=nv(t,e*1.42,r+3.6,2,1.9,e>0);n.rotation.y=e>0?Math.PI/2:-Math.PI/2;let i=tv(t,`AXLON`,e*1.42,r-1.6,2,1.1,`#f5b400`,`rgba(0,0,0,0)`);i.rotation.y=e>0?Math.PI/2:-Math.PI/2}else for(let e of[-1,1]){let n=tv(t,`AXLEYARD.COM`,e*1.42,r,2,.8,`#58b8ff`,`rgba(0,0,0,0)`);n.rotation.y=e>0?Math.PI/2:-Math.PI/2}for(let e of[-4.5,4.5])for(let n of[-1,1])X(t,n*.8,r+e,.5,1,.3,`x`,[.2,.2,.22])}return t}buildNarrow(e,t,n){let r=this.c,i=this.pivotAt(Mf(r,e),Nf(r,e));Y(i,0,0,.05,t-4,480,.1,[.11,.09,.05],!1,!1);let a=Y(i,0,0,.065,t-9,480,.13,Y_,!0,!1);this.waterMats.push(a.material);for(let e of[-1,1])Y(i,e*(t-9)*.5,0,.135,.5,480,.02,[.55,.62,.62],!1,!1);let o=5,s=()=>(o=o*1103515245+12345&2147483647,o/2147483647);for(let e=0;e<40;e++){let r=e%2==0?-1:1,a=(s()-.5)*480*.96;Math.abs(a)<n+4||X(i,r*((t-9)*.5+.3+s()*1.3),a,.5,.5*(.7+s()*.6),1,`up`,[.08,.2,.06])}for(let e=0;e<14;e++){let t=e%2==0?-1:1,r=.6+s()*.7;Y(i,(s()-.5)*11,t*(n+3+s()*20),.3,1.4*r,1.9*r,.8*r,[.2,.2,.19])}Y(i,0,0,.14,t,n*2+.8,.1,[.24,.16,.09]);for(let e=-t*.5+.75;e<t*.5;e+=1.5)Y(i,e,0,.195,.1,n*2-.8,.02,[.14,.1,.05],!1,!1);let c=Math.round(t/3);for(let e of[-1,1]){let r=e*n;Y(i,0,r,1.2,t,.4,.4,K_),Y(i,0,r,4.4,t-6,.4,.4,K_);for(let e of[-1,1]){let n=Y(i,e*(t*.5-1.5),r,2.8000000000000003,Math.hypot(3,3.2),.34,.34,K_);n.rotation.z=-e*Math.atan2(3.2,3)}for(let e=1;e<c;e++){let n=-t*.5+e*3;if(Y(i,n,r,2.8000000000000003,.25,.25,3.2,K_),e<c-1){let t=e>=c/2,a=Y(i,n+1.5,r,2.8000000000000003,Math.hypot(3,3.2),.16,.16,[.36,.11,.06]);a.rotation.z=(t?1:-1)*Math.atan2(3.2,3)}}}}buildCrossing(e){let t=this.c,n=this.pivotAt(e.pos,e.yaw+e.skew);for(let e of[-1,1])Y(n,0,e*165,.05,4.4,310,.1,G_,!1,!1);for(let e=-319.25;e<320;e+=1.5)Math.abs(e)>9&&Y(n,0,e,.12,2.6,.3,.12,[.21,.14,.07],!1,!1);Y(n,0,0,.08,3.2,20,.16,[.18,.12,.06],!1,!1);for(let e of[-.75,.75])Y(n,e,0,.16,.14,640,.16,[.56,.57,.6],!0,!1);let r={lights:[],arms:[],armSides:[],train:this.train(6),crossing:e};for(let n of[1,-1]){let i=n*10.2,a=this.pivotAt(Mf(t,e.s-n*9,i),e.yaw);X(a,0,0,1.7,.26,3.4,`up`,[.83,.83,.81]);for(let e of[40,-40]){let t=Y(a,0,0,3.1,.08,1.7,.26,U_);t.rotation.x=e*Math.PI/180}Y(a,0,0,2.3,.2,1.3,.46,Z);for(let e of[-.42,.42]){let t=Kh(a,-.12,e,2.3,.06,.34,.34,[1,.08,.04],3);t.visible=!1,r.lights.push(t)}let o=new jn;o.position.set(.3,1.15,0);for(let e=0;e<6;e++)Y(o,0,-n*(9/6)*(e+.5),0,.12,9/6,.28,e%2==0?[.9,.05,.03]:U_);Y(o,0,0,0,.3,.5,.5,Z),o.rotation.x=n*85*Math.PI/180,a.add(o),r.arms.push(o),r.armSides.push(n)}n.add(r.train),r.train.position.set(0,.18,hf(e,0)-e.length*.5),this.crossingShows.push(r)}buildScale(e){let t=this.pivotAt(e.pos,e.yaw),n=e.lateral,r=e.length,i=bf(e),a=i*7,o=Qh();o.repeat.set(1.2,r/8);let s=new ss({map:o,roughness:.95}),c=new H(new Ta(1,1,1),s);c.position.set(r*.5,.03,n),c.scale.set(r,.06,9.5),c.receiveShadow=!0,t.add(c);let l=[.2,.2,.21],u=Math.atan2(n-a,26),d=Math.hypot(26,n-a),f=Y(t,-13,(n+a)*.5,.03,d,9.5,.06,l,!1,!1);f.rotation.y=-u;let p=Y(t,r+13,(n+a)*.5,.03,d,9.5,.06,l,!1,!1);p.rotation.y=u;for(let e=0;e<5;e++)Wh(t,-26+e*5,a+(n-a)*(e/5)-5.5,0,.6,.7,[1,.35,.02]);for(let e of[-18,-10,-2]){Y(t,e,n-2,.09,3,.4,.02,J_,!1,!1);let r=Y(t,e+1.8,n-2,.09,1.4,.4,.02,J_,!1,!1);r.rotation.y=.6;let i=Y(t,e+1.8,n-2,.09,1.4,.4,.02,J_,!1,!1);i.rotation.y=-.6}let m=(vf(e)+yf(e))*.5-e.s,h=yf(e)-vf(e);Y(t,m,n,.06,h+.6,7,.12,[.3,.3,.32]),Y(t,m,n,.1,h,6.4,.06,[.17,.17,.19],!0);for(let e=-h*.5+2;e<h*.5;e+=4)Y(t,m+e,n,.135,.12,6.2,.01,[.4,.4,.42],!1,!1);for(let e of[-1,1])Y(t,m,n+e*3.3,.14,h,.35,.02,V_,!1,!1);for(let e of[-1,1])Y(t,m+e*h*.5,n,.14,.35,6.6,.02,V_,!1,!1);Y(t,m,n,.14,1.5,6.4,.02,V_,!1,!1);let g=7.8,_=m-h*.5-1;for(let e of[-1,1])X(t,_,n+e*6.2,g*.5,.4,g,`up`,Z);Y(t,_,n,8.1,.5,13,.6,Z),Y(t,_,n,6.8999999999999995,.14,11.6,1.7,[.012,.012,.015]);for(let e of[-1,1])X(t,m,n+e*5.8,3.5,.18,7,`up`,Z),Y(t,m,n+e*5.2,6.9,.4,1.4,.2,Z),Kh(t,m,n+e*4.7,6.8,.5,.5,.12,[1,.95,.8],1.2);tv(t,`STOP ON THE SCALE`,_-.1,n,6.8999999999999995,.78,`#f5b400`,`rgba(0,0,0,0)`);for(let e of[-1,1])Kh(t,_-.12,n+e*5.4,6.8999999999999995,.1,.5,.5,[1,.7,.1],3);X(t,m+h*.5+2,n+i*4.5,1.6,.2,3.2,`up`,Z),Y(t,m+h*.5+2,n+i*4.5,3.6,.3,3.4,1.4,[.05,.05,.06]);let v=tv(t,`000000 LB`,m+h*.5+1.83,n+i*4.5,3.6,.7,`#4ee07a`,`rgba(0,0,0,0)`);this.readouts.push({mesh:v,scale:e});let y=m,b=n+i*10;Y(t,y,b,2,9,6,4,[.55,.52,.46]),Y(t,y,b,4.15,9.8,6.8,.3,Z),Y(t,y,b-i*3.02,2.2,5.6,.06,1.4,z_,!0);for(let e of[-3,3])Y(t,y+e,b-i*3.02,2.2,1.2,.06,1.4,z_,!0);Y(t,y+4.52,b,1.1,.06,1.2,2.2,[.15,.1,.06]),Y(t,y,b-i*3.06,3.7,8.2,.08,.9,V_);let x=tv(t,`WEIGH STATION`,y,b-i*3.12,3.7,.58,`#111111`,`rgba(0,0,0,0)`);x.rotation.y=i>0?Math.PI:0,X(t,y+6,b,4.5,.15,9,`up`,L_,!0),Y(t,y+6,b+1.2,8.2,.05,2.2,1.4,H_);let S=i*10.6;X(t,-80,S,1.9,.2,3.8,`up`,Z),Y(t,-80,S,3.3,.1,4.2,1.1,[.04,.22,.1]),tv(t,`WEIGH STATION`,-80.06,S,3.5,.36,`#eeeeee`,`rgba(0,0,0,0)`),tv(t,i>0?`>>>`:`<<<`,-80.06,S,3.05,.36,`#f5b400`,`rgba(0,0,0,0)`)}buildGifts(){let e=this.c;for(let t=0;t<e.gifts.length;t++){let n=e.gifts[t],r=n.repair?[.3,1,.4]:[.3,.6,1],i=this.pivotAt(n.pos,0,1.5);Kh(i,0,0,0,1.3,1.3,1.3,r,2.5),Y(i,0,0,0,1.36,1.36,.3,Z),Y(i,0,0,0,1.36,.3,1.36,Z),Kh(this.group,0,0,0,3.2,3.2,.04,r,.6).position.set(n.pos.x,wf(e,n.pos)+.03,n.pos.y),i.userData.baseY=wf(e,n.pos)+1.5,this.movers.push({part:i,path:[],speed:1.2,at:t*.7,thereAndBack:!1,spin:!0,facesAhead:!1}),this.giftPivots.push(i)}}buildJumps(){for(let e of this.c.jumps){let t=this.pivotAt(e.pos,e.yaw);if(e.gorge){this.buildGorge(t,e.gap/e.squeeze,e.left,e.right);continue}let n=new ao;n.moveTo(-16,0),n.lineTo(0,jf),n.lineTo(0,0),n.lineTo(-16,0);let r=new Wo(n,{depth:16,bevelEnabled:!1}),i=Qh();i.repeat.set(2,1);let a=new H(r,new ss({map:i,roughness:.9}));a.position.set(0,0,-8),a.castShadow=!0,a.receiveShadow=!0,t.add(a);for(let e of[-1,1]){let n=Y(t,-8,e*8.15,jf*.5+.1,Math.hypot(16,jf)+.4,.3,.5,[.85,.62,.04],!0);n.rotation.z=Math.atan2(jf,16);for(let n=-14;n<0;n+=3.5)Y(t,n,e*8.15,jf*(n+16)/16*.5,.3,.3,Math.max(.2,jf*(n+16)/16),Z)}for(let e=0;e<10;e++)Y(t,-.3,-7.2+e*1.6,jf+.02,.6,1.6,.04,e%2==0?B_:Z,!1,!1);Y(t,-.2,0,jf*.5-.1,.4,16,jf-.2,Z);for(let e of[-1,1])Y(t,-22,e*10.2,1.8,.12,.12,3.6,Z),Y(t,-22,e*10.2,3,.08,1.8,1.2,B_);Y(t,-56,11,2.2,.12,.12,4.4,Z),Y(t,-56,11,3.9,.1,4.6,1.4,[.012,.012,.015]),tv(t,`BRIDGE OUT  /  RAMP AHEAD`,-56.07,11,3.9,.5,`#f5b400`,`rgba(0,0,0,0)`),Y(t,e.gap*.5,(e.right-e.left)*.5,-.9,e.gap+6,e.left+e.right,1.2,[.11,.09,.05],!1,!1);for(let n of[-3,e.gap+3])Y(t,n,(e.right-e.left)*.5,-.2,.6,e.left+e.right,.8,[.26,.2,.11],!1,!1);let o=Y(t,e.gap*.5,(e.right-e.left)*.5,.1,e.gap,e.left+e.right,.14,this.c.coast?[.1,.32,.5]:Y_,!0,!1);o.material=o.material.clone(),this.c.coast&&(o.material.userData.sea=!0),this.waterMats.push(o.material);for(let n of[.3,e.gap-.3])Y(t,n,(e.right-e.left)*.5,.18,.6,e.left+e.right,.02,[.55,.62,.62],!1,!1);let s=3,c=()=>(s=s*1103515245+12345&2147483647,s/2147483647);for(let n=0;n<60;n++){let n=(c()-.5)*(e.left+e.right)*.95+(e.right-e.left)*.5;Math.abs(n)<10||X(t,c()<.5?-.6-c()*1.6:e.gap+.6+c()*1.6,n,.6,.4+c()*.4,1.2,`up`,[.08,.2,.06])}for(let n of[-1,1])Y(t,e.gap+1.5,n*7.6,.6,3,.5,1.2,[.1,.7,.2]);for(let n of[-3.5,e.gap+3.5]){Y(t,n,0,1,5,18,.5,I_);for(let e of[-1,1])Y(t,n,e*8.6,1.75,5,.3,1,[.7,.68,.64]);for(let e=0;e<6;e++){let r=Y(t,n+(n<0?2.8:-2.8),-6+e*2.6,1.3,1.4,.05,.05,[.4,.2,.1]);r.rotation.z=(n<0?-.5:.5)+e*.2}}}}buildGorge(e,t,n,r){let i=[.42,.2,.1],a=new ao;a.moveTo(-16,0),a.lineTo(0,jf),a.lineTo(0,0),a.lineTo(-16,0);let o=new Wo(a,{depth:10,bevelEnabled:!1}),s=$h();s.repeat.set(2,1);let c=new H(o,new ss({map:s,color:new V(.72,.6,.42),roughness:1}));c.position.set(0,0,-5),c.castShadow=!0,c.receiveShadow=!0,e.add(c);for(let t of[-1,1]){let n=Y(e,-8,t*5.15,jf*.5+.1,Math.hypot(16,jf)+.4,.3,.4,q_,!1);n.rotation.z=Math.atan2(jf,16)}Y(e,-.2,0,jf*.5-.1,.4,10,jf-.2,Z);for(let t=0;t<6;t++)Y(e,-.3,-4.2+t*1.6,jf+.02,.6,1.6,.04,t%2==0?B_:Z,!1,!1);let l=n+r,u=(r-n)*.5;Y(e,t*.5,u,-20,t+.4,l,40,[.06,.04,.03],!1,!1);let d=Y(e,t*.5,u,-39.7,t*.4,l,.2,Y_,!0,!1);this.waterMats.push(d.material);for(let n of[0,t])for(let t=0;t<5;t++){let r=(t+1)*8;Y(e,n+t*.5*(n===0?1:-1),u,-r+4,1.2,l,8,[i[0]*(1-t*.12),i[1]*(1-t*.12),i[2]*(1-t*.12)],!1,!1)}let f=11,p=()=>(f=f*1103515245+12345&2147483647,f/2147483647);for(let n=0;n<40;n++){let n=(p()-.5)*l*.95+u;if(Math.abs(n)<7)continue;let r=p()<.5?-1-p()*6:t+1+p()*6,a=.5+p()*1.4;Gh(e,r,n,a*.4,a*2,[i[0]*.9,i[1]*.9,i[2]*.9])}for(let n of[-1,1])Y(e,t+1.5,n*4.4,.6,3,.5,1.2,[.1,.7,.2]);Y(e,-46,8,2.2,.12,.12,4.4,Z),Y(e,-46,8,3.9,.1,4.6,1.4,[.012,.012,.015]),tv(e,`THE LEAP  /  FLAT OUT`,-46.07,8,3.9,.5,`#f5b400`,`rgba(0,0,0,0)`)}turbine(e,t,n,r=null,i=90,a=57){let o=this.pivotAt({x:e,y:t},n);r&&this.siteExtras.push(o);let s=Vh([.94,.94,.93],!0);for(let[e,t,n,r]of[[0,.36,2.3,2.1],[.36,.7,2.1,1.75],[.7,1,1.75,1.35]]){let a=(t-e)*i,c=new H(new Ea(r,n,a,28),s);c.position.y=e*i+a*.5,c.castShadow=!0,o.add(c),t<1&&X(o,0,0,t*i,r*2+.25,.35,`up`,[.8,.8,.78])}X(o,0,0,.5,9,1,`up`,F_),Y(o,2.25,0,1.5,.12,1.2,2.4,[.3,.3,.32]);let c=new jn;c.position.y=i+1.6,Y(c,-1.6,0,0,11,3.8,3.6,[.93,.93,.92],!0),Y(c,-1.6,0,1.75,10.4,3.4,.3,[.88,.88,.86],!0),Y(c,-6.8,0,0,.7,3.2,3,[.84,.84,.82]),Y(c,-2,0,2.1,1,.8,.5,[.7,.7,.68]),Kh(c,-5,0,2.3,.3,.3,.3,[1,.1,.05],2);let l=new H(new Ea(2.2,2.2,2.6,20),s);l.rotation.z=Math.PI/2,l.position.set(4.6,0,0),c.add(l);let u=new H(new Yo(2.2,20,14,0,Math.PI*2,0,Math.PI/2),s);u.rotation.z=-Math.PI/2,u.position.set(5.9,0,0),c.add(u);let d=new jn;d.position.set(4.9,0,0);let f=[[0,.12,1.6,2.4],[.12,.55,2.4,1.3],[.55,1,1.3,.2]];for(let e=0;e<3;e++){let t=new jn;t.rotation.x=e*2*Math.PI/3;for(let[e,n,r,i]of f){let o=(n-e)*a,c=new H(new Ea(i,r,o,10),s);c.position.y=e*a+o*.5+2,c.scale.set(1,1,e===0?.8:.26),c.rotation.y=.25+e*.3,c.castShadow=!0,t.add(c)}d.add(t)}c.add(d),o.add(c),this.rotors.push(d)}useCarModels(e,t){if(e.length)for(let n of this.carSlots){let r=n.taxi?t:e[n.pick%e.length];if(!r)continue;let i=n.grp.rotation.z,a=n.grp.position.y;n.grp.clear(),n.grp.add(r.group.clone());let o=r.length/2,s=Math.min(.75,r.height*.5);for(let e of[-1,1])Kh(n.grp,o-.04,e*r.width*.33,s,.05,.28,.14,[1,.95,.8],2),Kh(n.grp,-o+.04,e*r.width*.36,s+.05,.05,.24,.14,[1,.1,.05],1.5);n.grp.rotation.z=i,n.grp.position.y=a}}setSite(e){let t=this.c;if(t.endless)return;this.siteGroup&&=(this.group.remove(this.siteGroup),null);for(let e of this.siteExtras)this.group.remove(e),this.rotors=this.rotors.filter(t=>!rv(t,e));this.siteExtras=[];let n=Nf(t,t.stopS),r=this.pivotAt(Mf(t,t.stopS+t.stopLength*.5,0),n);this.siteGroup=r;let i=Vh([.94,.94,.93],!0);switch(e){case`transformer`:{let e=[.16,.3,.36],t=[.45,.2,.12];Y(r,-8,-34,.04,62,46,.08,[.3,.29,.27],!1),Y(r,-12,-22,.3,24.5,7,.6,F_);for(let e of[-2.6,2.6])Y(r,-5.4,-22+e,.62,11,.35,.04,B_,!1,!1);Y(r,.65,-22,4.6,.8,10,9.2,[.34,.34,.32]),Y(r,6.8,-22,.3,11,7,.6,F_),Y(r,6.8,-22,2.55,9.6,4,3.9,e,!0);for(let e of[-2.5,2.5])Y(r,6.8,-22+e,2.5,7.6,.9,2.8,Z);X(r,6.8,-21,5.3,1.3,6,`x`,[.2,.38,.45],!0);for(let e of[-30,-44]){for(let t of[-17,10])Y(r,t,-22+e,7,.9,.9,14,[.7,.7,.68]);Y(r,-3.5,-22+e,14,28,1,1,[.7,.7,.68]);for(let n=0;n<3;n++)X(r,-12.5+9*n,-22+e,12.7,.45,1.6,`up`,t)}Y(r,-3.5,-118,15,2.2,2.2,30,[.56,.56,.55]),Y(r,-3.5,-118,3,5,5,6,[.56,.56,.55]);for(let e of[20,26])Y(r,-3.5,-118,e,16,1,.8,[.56,.56,.55]);for(let e=0;e<3;e++){let n=3.8+3*e;X(r,n,-21.4,6,.55,3,`up`,t);let i=-12.5+9*e,a=Y(r,i,-59,12,.1,14,.1,R_,!1,!1);a.visible=!0,Y(r,i,-59,1.6,1.6,1.6,3.2,[.52,.52,.5]),Y(r,(n+i)*.5,-37,9.95,.1,Math.hypot(30,n-i,4.9),.1,R_,!1,!1).rotation.set(0,Math.atan2(n-i,30),-Math.atan2(4.9,30),`YXZ`)}break}case`rocket`:Y(r,-10,-32,.04,70,60,.08,[.48,.48,.46],!1),Y(r,-14,-22,.6,30,12,1.2,F_),Y(r,-14,-22,.2,26,5,1,[.05,.05,.05],!1,!1),Y(r,0,-30,29,5,5,58,[.5,.07,.04]);for(let e=8;e<58;e+=8)Y(r,0,-30,e,5.3,5.3,.7,U_);for(let e=4;e<58;e+=6)Y(r,-4,-30,e,3.4,1.2,.3,[.5,.5,.48]);X(r,0,-30,65,.5,14,`up`,U_),Kh(r,0,-30,72.2,.4,.4,.4,[1,.1,.05],3);for(let[e,t]of[[-38,-30],[-34,16]])X(r,e,-22+t,32,.9,64,`up`,[.75,.75,.74]);for(let e of[-30,-42])X(r,-37,-22+e,6,7,12,`up`,U_),Gh(r,-37,-22+e,12,7,U_).scale.y*=.4;X(r,-25,-27,1,.6,17,`x`,[.6,.6,.58]);for(let e=-30;e<=-18;e+=6)Y(r,e,-27,.5,.3,.3,1,Z);Y(r,-14,-14,1.2,4,3,2.4,[.85,.62,.04]);break;case`house`:{let e=[.12,.24,.08],t=[.42,.2,.14],n=[.33,.12,.08];Y(r,-8,-36,.04,52,42,.08,e,!1),Y(r,-8.5,-22,.3,17.5,7.2,.6,F_);for(let e of[-1,1])Y(r,-7,-22+e*3.1,.62,14,.3,.04,B_,!1,!1);Y(r,3.4,-22,1.7,6.3,6.8,3.4,t),Y(r,3.4,-22,3.55,7,7.6,.3,n),Y(r,3.4,-18.58,1.3,4.6,.1,2.6,U_);for(let[e,t]of[[-11,-24],[8,-26]]){Y(r,e,-22+t,1.6,14,6,2.6,[.77,.72,.6]);for(let i of[-1,1]){let a=Y(r,e,-22+t+i*6*.26,3.5,14.7,6*.58,.22,n);a.rotation.x=i*22*Math.PI/180}for(let n=e-5;n<e+5;n+=3)Y(r,n,-22+t+3+.03,1.5,1.2,.06,1,[.1,.16,.22],!0,!1)}for(let e=-30;e<=10;e+=2)(e<-18||e>7.5)&&Y(r,e,-14,.55,.12,.12,1,U_);for(let[e,t]of[[-26,-6],[-22,-30],[11,-12]])X(r,e,-22+t,1.5,.5,3,`up`,[.16,.1,.05]),Gh(r,e,-22+t,4.6,5.5,[.06,.2,.06]);break}case`excavator`:{Y(r,-6,-32,.04,60,44,.08,[.42,.33,.2],!1),Y(r,-10,-36,-2,30,6,4,[.1,.07,.04],!1,!1);for(let e=-22;e<=2;e+=6){let t=Gh(r,e,-44,.8,7,[.36,.26,.14]);t.scale.y*=.45}for(let e of[-14,-4])Y(r,e,-36,-.6,5,.3,2.6,[.85,.62,.04]),Y(r,e,-36,-.6,5,5.4,.3,Z,!1,!1);for(let e=-26;e<=10;e+=2.4)Y(r,e,-15,.6,.08,.08,1.2,Z),Y(r,e+1.2,-15,.7,2.4,.03,.9,[1,.4,.05],!1,!1);let e=new jn;e.position.set(8,0,-44),Y(e,0,0,1,6,3,1.2,[.85,.62,.04],!0),Y(e,-1,0,2.3,3.6,2.8,1.4,[.7,.5,.04],!0),Y(e,2.4,0,2.2,1.4,2.6,1.2,[.85,.62,.04],!0);for(let t of[-1,1])for(let n of[-1.8,1.8])X(e,n,t*1.5,.7,1.4,.6,`y`,R_);r.add(e),Y(r,-16,-19,.5,2,1,1,F_),Y(r,-16,-19,1.4,.1,1.8,.8,[.012,.012,.015]);break}case`yacht`:{let e=Y(r,-14,-46,-.08,70,50,.3,Y_,!0,!1);this.waterMats.push(e.material),Y(r,-14,-20.5,.3,70,1.2,1.2,[.5,.5,.48]),Y(r,-8,-34,.5,4,26,.3,q_);for(let e=-2;e>-24;e-=4)for(let t of[-1,1])X(r,-8+t*1.7,-22+e,-.5,.4,2.2,`up`,[.25,.17,.1]);for(let[e,t,n]of[[-20,-8,[.9,.9,.92]],[4,-10,[.1,.2,.45]],[-22,-18,[.85,.85,.88]]])Y(r,e,-22+t,.4,7,2.4,1,n,!0),Y(r,e-.5,-22+t,1.2,3,1.8,.8,n,!0),X(r,e+.5,-22+t,5,.12,9,`up`,L_,!0);for(let e of[-1,1]){for(let t of[-14,-6])Y(r,t,-22+e*3.4,3.2,.5,.5,6.4,[.1,.35,.8]),X(r,t,-22+e*3.4,.45,.9,.5,`y`,R_);Y(r,-10,-22+e*3.4,6.2,9,.6,.6,[.1,.35,.8])}for(let e of[-14,-6])Y(r,e,-22,6.5,.6,7.4,.6,[.1,.35,.8]);Y(r,6,-17,1.5,4,3,3,[.9,.9,.86]),Y(r,6,-17,3.2,4.6,3.6,.3,[.3,.3,.32]),X(r,6,-14,4,.1,8,`up`,L_),Y(r,6,-13.4,7.4,.04,1.2,.8,H_);break}case`deck`:{Y(r,-10,-30,.04,70,46,.08,[.36,.34,.31],!1);for(let e=-44;e<=24;e+=2.4)Y(r,e,-8,1.1,.08,.08,2.2,Z);Y(r,-10,-8,2.15,68,.04,.05,Z,!1,!1),Y(r,-10,-8,1.1,68,.02,2,[.25,.27,.28],!1,!1).material=new ss({color:3356216,transparent:!0,opacity:.35});let e=[[.6,.06,.04],[.85,.85,.83],[.05,.1,.35],[.1,.1,.1],[.45,.42,.1],[.05,.3,.15]];for(let t=0;t<2;t++)for(let n=0;n<6;n++){let i=this.littleCar(e[(n+t*2)%e.length]);i.position.set(-40+n*7,0,-28-t*9),i.rotation.y=Math.PI/2,r.add(i)}Y(r,14,-40,1.8,12,7,3.6,U_),Y(r,14,-40,3.75,12.6,7.6,.3,[.3,.3,.32]),Y(r,14,-22-14.48,3.1,7,.06,1,[.012,.012,.015]);let t=tv(r,`AXLEYARD  RECOVERY`,14,-36.4,3.1,.6,`#f5b400`,`rgba(0,0,0,0)`);t.rotation.y=0,nv(r,18.5,-36.42,1.8,1.4,!1,!0);let n=new jn;n.position.set(-2,0,-40),Y(n,0,0,1,8,2.6,.8,[.85,.08,.05],!0),Y(n,2.6,0,2.3,2.4,2.6,2,[.85,.08,.05],!0),Y(n,3.82,0,2.6,.05,2.2,.9,z_,!0);let i=Y(n,-1.8,0,2.6,5,.6,.6,[.9,.9,.88]);i.rotation.z=.35,Kh(n,2.6,0,3.4,.3,1.8,.15,[1,.6,.05],3);for(let e of[-1,1])for(let t of[-2.6,-1.2,2.6])X(n,t,e*1.2,.55,1.1,.6,`y`,R_);r.add(n);for(let[e,t,n,i]of[[-8.5,-16,17,.25],[-8.5,-22.5,17,.25]])Y(r,e,t,.1,n,i,.04,B_,!1,!1);break}default:{let e=n+Math.PI*.75,a=Mf(t,t.stopS+t.stopLength*.5,-22);this.turbine(a.x,a.y,e,r);for(let[n,i]of[[t.stopS-260,-140],[t.stopS+60,-220],[t.stopS-120,160],[t.stopS-420,190],[t.stopS+30,300]]){let a=Mf(t,n,i);this.turbine(a.x,a.y,e,r)}Y(r,0,-22,.05,44,30,.1,[.5,.5,.48],!1),Y(r,8,-24,.4,7,7,.8,F_);let o=new H(new Ea(1.5,2.6,52,24),i);o.position.set(8,26,-24),o.castShadow=!0,r.add(o),Y(r,8,-24,52.8,7.5,3.4,3.4,[.93,.93,.92],!0);let s=new H(new Yo(1.9,16,12),i);s.position.set(8,52.8,-28.4),r.add(s);for(let e of[-2,2])Y(r,-6+e,-16,.5,.6,2.4,1,Z);let c=new H(new Ea(1.6,1.6,2.6,18),Vh([.9,.9,.88],!0));c.rotation.z=Math.PI/2,c.position.set(-6,2.2,-16),r.add(c);let l=new H(new Da(1.5,2.2,16),Vh([.9,.9,.88],!0));l.rotation.z=-Math.PI/2,l.position.set(-3.6,2.2,-16),r.add(l);for(let e of[60,-60]){let t=new jn;t.position.set(8,52.8,-28.4),t.rotation.z=(e-90)*Math.PI/180;for(let[e,n,r,a]of[[0,.12,2.6,3.2],[.12,.55,3.2,1.6],[.55,1,1.6,.3]]){let o=(n-e)*29,s=new H(new Ea(a*.5,r*.5,o,10),i);s.position.y=e*29+o*.5+1.9,s.scale.set(1,1,.3),s.castShadow=!0,t.add(s)}r.add(t)}}}e===`deck`?this.hook&&=(this.group.remove(this.hook),this.group.remove(this.cable),null):this.buildMarkAndCrane(r,e,-22)}buildMarkAndCrane(e,t,n){let r=this.c,i=t===`blade`||t===`rocket`,[a,o,s,c,l,u]=t===`blade`?[8,n-6.4,50.9,58.5,3,0]:t===`rocket`?[-14,n,1.2,56,3.4,0]:t===`transformer`?[.25,n,.6,15,4,12]:t===`house`?[.25,n,.6,15,6,15]:t===`excavator`?[-4,n-6,.04,14,4.6,16]:[0,n,0,14,4.4,20],d=Nf(r,r.stopS),f=Mf(r,r.stopS+r.stopLength*.5,0),p=W(W(f,G(cf(d),a)),G(lf(d),o));if(this.mark={x:p.x,y:p.y,up:s+wf(r,f),yaw:d,hanging:i},this.markGlows=[],i){let t=new H(new Xo(l*.5+.8,.12,8,40),new ss({color:0,emissive:new V(1,.7,.05),emissiveIntensity:2.5}));t.position.set(a,s,o),e.add(t),this.markGlows.push(t)}else for(let[t,n,r,i]of[[a-u*.5,o-l*.5-.3,u+.6,.25],[a-u*.5,o+l*.5+.3,u+.6,.25],[a+.3,o,.25,l+.6],[a-u-.3,o,.25,l+.6]])this.markGlows.push(Kh(e,t,n,s+.08,r,i,.06,[1,.7,.05],2.5));let m=i?26:24,h=new jn;h.position.set(a-m,0,o+(i?0:l*.5+4));for(let e of[-1,1]){Y(h,0,e*3.6,.8,11,1.6,1.6,Z);for(let t=-4.5;t<=4.5;t+=1.5)Y(h,t,e*3.6,.8,.5,1.8,1.8,[.2,.2,.22])}Y(h,0,0,2.3,9,6,2.6,[.85,.62,.04],!0),Y(h,4,-2.3,3.8,2.6,1.6,2.2,Z),Y(h,5.3,-2.3,4,.05,1.4,1.2,z_,!0),Y(h,-4.5,0,3.2,2,5.8,3.8,[.2,.2,.22]),nv(h,-5.52,0,3.4,1.8,!0);let g=m-1.5-(i?0:u*.5),_=c-3.6,v=Math.hypot(g,_),y=new jn;y.position.set(1.5,3.6,0),y.rotation.z=Math.atan2(_,g);for(let e of[-.5,.5])for(let t of[-.5,.5])Y(y,v*.5,t,e,v,.14,.14,[.85,.62,.04],!0);for(let e=1;e<v;e+=2)Y(y,e,0,.5,.1,1,.1,[.85,.62,.04]),Y(y,e,0,-.5,.1,1,.1,[.85,.62,.04]),Y(y,e,.5,0,.1,.1,1,[.85,.62,.04]),Y(y,e,-.5,0,.1,.1,1,[.85,.62,.04]);i||(h.rotation.y=-Math.atan2(l*.5+4,g)),h.add(y),e.add(h),e.updateMatrixWorld(!0),y.updateMatrixWorld(!0),this.boomTip=y.localToWorld(new z(v,0,0)),this.hook&&(this.group.remove(this.hook),this.group.remove(this.cable)),this.hook=new jn,Y(this.hook,0,0,.3,.6,.3,.6,Z),Y(this.hook,0,0,-.5,.25,.25,1,[.85,.62,.04]),Y(this.hook,.3,0,-1,.8,.25,.25,[.85,.62,.04]),this.hook.position.copy(this.boomTip).setY(this.boomTip.y-10),this.group.add(this.hook),this.cable=new H(new Ea(.06,.06,1,6),Vh([.1,.1,.1])),this.group.add(this.cable),this.setHook(this.boomTip.x,this.boomTip.z,this.boomTip.y-10)}setMark(e){let t=e===`on`?new V(.2,1,.4):e===`clang`?new V(1,.15,.1):new V(1,.7,.05);for(let e of this.markGlows)e.material.emissive.copy(t)}buildSite(){let e=this.c,t=Nf(e,e.stopS),n=this.pivotAt(Mf(e,e.stopS+e.stopLength*.5,0),t);for(let e=0;e<2;e++){Y(n,-34+e*8,-16,1.4,7,3,2.8,[.9,.9,.86]),Y(n,-34+e*8,-16,2.9,7.4,3.4,.2,[.3,.3,.32]);for(let t of[-2,0,2])Y(n,-34+e*8+t,-14.48,1.7,1,.05,.9,z_,!0)}Y(n,-40,-20,.9,3,1.6,1.8,[.85,.62,.04]),X(n,-39,-20,2.2,.2,1,`up`,Z);for(let e=0;e<3;e++){let t=this.littleCar([.9,.9,.88]);t.position.set(-24+e*6,0,-12),t.rotation.y=Math.PI/2,n.add(t)}for(let[e,t]of[[-20,-8],[20,-8],[20,-36]])X(n,e,t,8,.25,16,`up`,Z),Y(n,e,t,16.2,1.2,1.2,.4,Z),this.siteLamps.push(Kh(n,e,t+.8,16,.6,.3,.4,[1,.95,.8],.4));Y(n,-e.stopLength*.5+2,0,9.4,.5,18.8,1.6,[.012,.012,.015]),Y(n,-e.stopLength*.5+2,0,10.3,.54,18.8,.16,V_),tv(n,`AXLEYARD   DELIVERS`,-e.stopLength*.5+1.7,0,9.4,.9,`#f5b400`,`rgba(0,0,0,0)`);for(let t of[-1,1]){Y(n,-e.stopLength*.5+2,t*10.6,2.4,.12,.12,4.8,Z);let r=Y(n,-e.stopLength*.5+2,t*10.6+t*.8,4.4,.06,1.6,1,H_);r.rotation.y=.2}}setListings(e){for(let t=0;t<this.boards.length&&t<e.length;t++){let n=this.boards[t],r=e[t];if(!r.photo)continue;let i=ng(r.photo);n.photo.material.map=i,n.photo.material.needsUpdate=!0;let a=r.title.length>26?r.title.slice(0,25)+`…`:r.title,o=r.price&&r.price>0?`$${Math.round(r.price).toLocaleString(`en-US`)}`:`CALL FOR PRICE`,s=[r.city,r.state].filter(Boolean).join(`, `);tv(n.ad,`FOR SALE`,0,-4.2,12.2,.7,`#f5b400`,`rgba(0,0,0,0)`,!0),tv(n.ad,a,0,-4.2,10.7,.8,`#ffffff`,`rgba(0,0,0,0)`,!0),tv(n.ad,o,0,-4.2,9.2,1,`#4ee07a`,`rgba(0,0,0,0)`,!0),s&&tv(n.ad,s,0,-4.2,8.1,.55,`#dddddd`,`rgba(0,0,0,0)`,!0),tv(n.ad,`AXLEYARD.COM`,0,-4.2,6.8,.9,`#58b8ff`,`rgba(0,0,0,0)`,!0),n.plain.visible=!1,n.ad.visible=!0}}setHook(e,t,n){if(!this.hook)return;this.hook.position.set(e,n,t);let r=this.boomTip,i=new z().addVectors(r,this.hook.position).multiplyScalar(.5);this.cable.position.copy(i);let a=new z().subVectors(this.hook.position,r);this.cable.scale.set(1,a.length(),1),this.cable.quaternion.setFromUnitVectors(new z(0,1,0),a.clone().normalize())}plantTrees(){let e=this.c,t=new Ea(.25,.45,3.5,7),n=new qo(1,1),r=new Ji(t,Vh([.3,.2,.1]),700),i=new Ji(n,new ss({color:16777215,roughness:.9,flatShading:!0}),2100);r.castShadow=!0,i.castShadow=!0,i.receiveShadow=!0;let a=7,o=()=>(a=a*1103515245+12345&2147483647,a/2147483647),s=new B,c=new V,l=0,u=0,d=Mf(e,0);for(;l<700&&u++<4200;){let t=o()*e.length,n=(o()<.5?-1:1)*(18+o()*170),a=Mf(e,t,n),u=(a.x-d.x)**2+(a.y-d.y)**2>8100;if((e.coast||e.desert)&&o()<.8)continue;for(let t of e.shortcuts){let e=tf(t.to,t.from),n=rf(e),r=((a.x-t.from.x)*e.x+(a.y-t.from.y)*e.y)/n,i=Math.abs((-(a.x-t.from.x)*e.y+(a.y-t.from.y)*e.x)/n);r>-10&&r<n+10&&i<t.halfWidth+14&&(u=!1)}for(let t of e.jumps)t.gorge&&(a.x-t.pos.x)**2+(a.y-t.pos.y)**2<28900&&(u=!1);for(let t=0;t<e.points.length&&u;t+=6){let n=e.points[t].pos;(n.x-a.x)**2+(n.y-a.y)**2<256&&(u=!1)}for(let t of e.obstacles)(t.kind===K.Building||t.kind===K.Rock||t.kind===K.Container||t.kind===K.Board)&&(t.pos.x-a.x)**2+(t.pos.y-a.y)**2<900&&(u=!1);for(let n of e.crossings)(Math.abs(t-n.s)<40||Math.abs(n.pos.x-a.x)<320&&Math.abs(n.pos.y-a.y)<320&&Math.abs(cf(n.yaw+n.skew).x*(a.x-n.pos.x)+cf(n.yaw+n.skew).y*(a.y-n.pos.y))<8)&&(u=!1);for(let r of e.scales)t>r.s-40&&t<r.s+r.length+40&&n>0&&n<30&&(u=!1);for(let n of e.bridges)Math.abs(t-n.s)<14&&(u=!1);for(let n of e.jumps)t>n.s-10&&t<n.s+n.gap+10&&(u=!1);if(t>e.stopS-40&&(u=!1),!u)continue;let f=.8+o()*1.2,p=wf(e,a);s.makeScale(f,f,f),s.setPosition(a.x,p+1.75*f,a.y),r.setMatrixAt(l,s);let m=2.2+o()*2,h=.24+o()*.1;for(let e=0;e<3;e++){let t=e/3*Math.PI*2+o(),n=e===0?0:m*.55,r=m*(e===0?1:.7+o()*.25);s.makeScale(r,r*(.85+o()*.4),r),s.setPosition(a.x+Math.cos(t)*n,p+3.5*f+m*.55+(e===0?m*.25:0),a.y+Math.sin(t)*n),i.setMatrixAt(l*3+e,s),c.setHSL(h,.45+o()*.2,.2+o()*.1),i.setColorAt(l*3+e,c)}l++}r.count=l,i.count=l*3,i.instanceColor&&(i.instanceColor.needsUpdate=!0),this.group.add(r,i)}lampsOn(e){if(e!==this.gloom){this.gloom=e;for(let t of this.siteLamps)t.material.emissiveIntensity=.4+2.5*e}}update(e,t,n,r){let i=this.c;for(let t=0;t<e.length;t++){let n=this.obstacleMeshes[t];if(!n)continue;let r=e[t],a=i.obstacles[t];r.broken?(n.rotation.z=a.kind===K.Traffic||a.kind===K.ParkedCar?.5:1.4,n.position.y=.2):a.kind===K.Traffic&&Hh(n,r.pos.x,r.pos.y,wf(i,r.pos),r.yaw)}let a=Mf(i,t.stormS-30);Hh(this.storm,a.x,a.y,wf(i,a),Nf(i,t.stormS)+Math.PI/2);for(let e of this.rotors)e.rotation.x+=n*.42;for(let e of this.movers){if(e.spin){e.part.rotation.y+=n*e.speed,e.part.position.y=(e.part.userData.baseY??1.5)+Math.sin(r*2+e.at)*.25;continue}e.at+=n*e.speed;let t=e.path.reduce((t,n,r)=>r>0?t+n.distanceTo(e.path[r-1]):0,0),i=e.thereAndBack?e.at%(t*2):e.at%t,a=!1;e.thereAndBack&&i>t&&(i=t*2-i,a=!0);for(let t=1;t<e.path.length;t++){let n=e.path[t].distanceTo(e.path[t-1]);if(i<=n||t===e.path.length-1){let r=Math.min(1,i/n);if(e.part.position.lerpVectors(e.path[t-1],e.path[t],r),e.facesAhead){let n=new z().subVectors(e.path[t],e.path[t-1]);a&&n.negate(),e.part.rotation.y=Math.atan2(-n.z,n.x)}break}i-=n}}for(let e of this.crossingShows){let i=e.crossing,a=_f(i,t.time),o=Math.floor(r*2.5)%2==0;for(let t=0;t<e.lights.length;t++)e.lights[t].visible=a&&t%2==0===o;for(let t=0;t<e.arms.length;t++){let r=a?0:e.armSides[t]*85*Math.PI/180;e.arms[t].rotation.x+=(r-e.arms[t].rotation.x)*Math.min(1,n*2.5)}e.train.position.z=hf(i,t.time)-i.length*.5}for(let e=0;e<this.giftPivots.length;e++)this.giftPivots[e].visible=!t.giftsTaken[e];for(let e of this.readouts){let n=Math.abs(t.s-(vf(e.scale)+yf(e.scale))*.5)<20&&Math.abs(t.lateral-e.scale.lateral)<5,i=n?Math.round(68e3+Math.abs(t.speed)*90+Math.sin(r*7)*40):0,a=n?`${i.toLocaleString(`en-US`)} LB`:t.weighed?`WEIGHED  OK`:`------ LB`,o=e.mesh.material;o.shown!==a&&(o.shown=a,o.map=tg(a,n||t.weighed?`#4ee07a`:`#2a6a3a`,`rgba(0,0,0,0)`),o.needsUpdate=!0)}this.lampsOn(Math.max(this.gloom,+!!t.inStorm));for(let e of this.waterMats){let t=e===this.ground.material||e.userData.sea===!0,n=t?[.1,.32,.5]:Y_;e.color.setRGB(n[0]+.02*Math.sin(r*1.3),n[1]+.03*Math.sin(r*.9),n[2]+.04*Math.sin(r*.7)),e.roughness=t?.95:.3,e.metalness=t?0:.25}}},av=class{constructor(e){this.sunDir=new z,this.clouds=[],this.rainCount=900,this.uniforms={zenith:{value:new V(.25,.48,.9)},horizon:{value:new V(.72,.82,.95)},sunDir:{value:new z(0,1,0)},sunGlow:{value:1},photo:{value:null},usePhoto:{value:0},photoGain:{value:1},dark:{value:0},stormColor:{value:new V(.09,.1,.12)}},this.photoSky=null,this.night=0,this.warm=0;let t=new as({uniforms:this.uniforms,side:1,depthWrite:!1,fog:!1,vertexShader:`
        varying vec3 vDir;
        void main() {
          vDir = normalize(position);
          vec4 p = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * p;
        }`,fragmentShader:`
        uniform vec3 zenith; uniform vec3 horizon; uniform vec3 sunDir; uniform float sunGlow;
        uniform sampler2D photo; uniform float usePhoto; uniform float photoGain; uniform float dark; uniform vec3 stormColor;
        varying vec3 vDir;
        void main() {
          vec3 d = normalize(vDir);
          float up = clamp(d.y, 0.0, 1.0);
          vec3 c = mix(horizon, zenith, pow(up, 0.32));
          float s = max(dot(d, normalize(sunDir)), 0.0);
          c += vec3(1.0, 0.95, 0.85) * (pow(s, 600.0) * 1.2 + pow(s, 12.0) * 0.12) * sunGlow;
          if (d.y < 0.0) c = mix(horizon, vec3(0.3, 0.32, 0.3), clamp(-d.y * 6.0, 0.0, 1.0));
          if (usePhoto > 0.5) {
            // The photographed sky, wrapped round: the storm draws a grey lid over it.
            vec2 uv = vec2(atan(d.z, d.x) / 6.2831853 + 0.5, asin(clamp(max(d.y, 0.002), -1.0, 1.0)) / 3.1415927 + 0.5);
            vec3 sky = texture2D(photo, uv).rgb * photoGain;
            c = mix(sky, stormColor * (0.6 + 0.4 * up), dark * 0.82);
          }
          gl_FragColor = vec4(c, 1.0);
        }`});this.dome=new H(new Yo(5e3,32,16),t),this.dome.frustumCulled=!1,e.add(this.dome),this.setSun(34,228);let n=eg(),r=99,i=()=>(r=r*1103515245+12345&2147483647,r/2147483647);for(let t=0;t<60;t++){let t=new ii(new Wr({map:n,transparent:!0,opacity:.8+i()*.2,depthWrite:!1,fog:!1})),r=220+i()*420;t.scale.set(r,r*.45,1),t.position.set(-1500+i()*5e3,520+i()*260,-2500+i()*5e3),e.add(t),this.clouds.push(t)}this.rainPositions=new Float32Array(this.rainCount*6);let a=new Pr;a.setAttribute(`position`,new yr(this.rainPositions,3)),this.rain=new da(a,new $i({color:new V(.7,.75,.85),transparent:!0,opacity:.45,fog:!1})),this.rain.frustumCulled=!1,this.rain.visible=!1,e.add(this.rain);for(let e=0;e<this.rainCount;e++)this.seedDrop(e,0,0,0,!0)}seedDrop(e,t,n,r,i){let a=this.rainPositions,o=t+(Math.random()-.5)*70,s=r+(Math.random()-.5)*70,c=n+(i?Math.random()*40:30+Math.random()*10);a[e*6]=o,a[e*6+1]=c,a[e*6+2]=s,a[e*6+3]=o-.3,a[e*6+4]=c-1.6,a[e*6+5]=s}setPhoto(e,t,n=1){this.uniforms.photoGain.value=n,new Gs().load(e,e=>{e.colorSpace=He,this.uniforms.photo.value=e,this.uniforms.usePhoto.value=1;for(let e of this.clouds)e.visible=!1;this.photoSky=e;let n=e.image,r=document.createElement(`canvas`);r.width=256,r.height=128;let i=r.getContext(`2d`,{willReadFrequently:!0});i.drawImage(n,0,0,256,128);let a=i.getImageData(0,0,256,128).data,o=(e,t)=>{let n=0,r=0,i=0,o=0;for(let s=e;s<t;s++)for(let e=0;e<256;e++){let t=(s*256+e)*4;n+=a[t],r+=a[t+1],i+=a[t+2],o++}return new V().setRGB(n/o/255,r/o/255,i/o/255,He)},s=-1,c=0,l=0;for(let e=0;e<64;e++)for(let t=0;t<256;t++){let n=(e*256+t)*4,r=a[n]*.3+a[n+1]*.59+a[n+2]*.11;r>s&&(s=r,c=t,l=e)}let u=s>235;if(u){let e=((c+.5)/256-.5)*Math.PI*2,t=(.5-(l+.5)/128)*Math.PI;this.sunDir.set(Math.cos(e)*Math.cos(t),Math.sin(t),Math.sin(e)*Math.cos(t)).normalize(),this.sunDir.y<.25&&(this.sunDir.y=.25),this.sunDir.normalize(),this.uniforms.sunDir.value.copy(this.sunDir)}t(o(56,64),o(12,38),u)})}setSun(e,t){let n=Mt.degToRad(90-e),r=Mt.degToRad(t);this.sunDir.setFromSphericalCoords(1,n,r),this.uniforms.sunDir.value.copy(this.sunDir)}update(e,t,n){this.dome.position.copy(t.position);let r=this.night,i=this.warm,a=this.uniforms.zenith.value,o=this.uniforms.horizon.value;a.setRGB(.2-.1*n,.45-.3*n,.92-.72*n),o.setRGB(.62-.4*n,.78-.54*n,.96-.68*n),i>0&&(a.lerp(new V(.25,.4,.75),i*.6),o.lerp(new V(.98,.62,.3),i*.8)),r>0&&(a.lerp(new V(.01,.015,.05),r),o.lerp(new V(.05,.06,.12),r)),this.uniforms.sunGlow.value=(1-n)*(1-r),this.uniforms.dark.value=n;for(let t of this.clouds)t.position.x+=e*6,t.position.x>4e3&&(t.position.x-=5500),t.material.color.setScalar((1-.7*n)*(1-.9*r));if(this.rain.visible=n>.5,this.rain.visible){let n=this.rainPositions,r=32*e;for(let e=0;e<this.rainCount;e++)n[e*6+1]-=r,n[e*6+4]-=r,n[e*6]-=r*.2,n[e*6+3]-=r*.2,n[e*6+4]<t.position.y-12&&this.seedDrop(e,t.position.x,t.position.y-10,t.position.z,!1);this.rain.geometry.getAttribute(`position`).needsUpdate=!0}}},ov=[{file:`closing-time`,name:`Closing Time`,artist:`Neil Fernandes`},{file:`bama-country`,name:`Bama Country`,artist:`Kevin MacLeod`},{file:`guts-and-bourbon`,name:`Guts and Bourbon`,artist:`Kevin MacLeod`},{file:`dry-the-hells-are`,name:`Dry the hells are`,artist:`Wired Ant`},{file:`admiral-bob-strikes-the-root`,name:`Admiral Bob Strikes The Root`,artist:`copperhead`}],sv=Object.fromEntries(ov.map(e=>[e.file,`${e.name}  ·  ${e.artist}`]));function cv(e){let t=[...e];for(let e=t.length-1;e>0;e--){let n=Math.floor(Math.random()*(e+1));[t[e],t[n]]=[t[n],t[e]]}return t}var lv=.9,uv=.4,dv=class{constructor(){this.ctx=null,this.engineOscs=[],this.radio=null,this.radioTracks=[ov[0].file,...cv(ov.slice(1).map(e=>e.file))],this.radioAt=0,this.radioOn=!0,this.speaking=null,this.speakingPriority=0,this.speakingUntil=0,this.saidAt=new Map,this.lastCall=J.None,this.lastCallTime=-1,this.spokeNote=``,this.wasStorm=!1,this.stormCloseSaid=!1,this.lastThunder=0,this.bellClock=0,this.paused=!1,this.volume=1,this.mix={music:.8,effects:.6,voice:1},this.ownTracks=[],this.onSong=null}start(){if(this.ctx){this.ctx.state===`suspended`&&this.ctx.resume();return}let e=new AudioContext;this.ctx=e,this.master=e.createGain(),this.master.gain.value=this.volume,this.master.connect(e.destination);let t=t=>{let n=e.createGain();return n.gain.value=t,n.connect(this.master),n};this.musicBus=t(this.mix.music),this.effectsBus=t(this.mix.effects),this.voiceBus=t(this.mix.voice),this.engineGain=e.createGain(),this.engineGain.gain.value=0,this.engineFilter=e.createBiquadFilter(),this.engineFilter.type=`lowpass`,this.engineFilter.frequency.value=700,this.engineFilter.Q.value=1.2,this.engineFilter.connect(this.engineGain).connect(this.effectsBus);for(let[t,n,r]of[[`sawtooth`,1,.35],[`sawtooth`,1.007,.35],[`sine`,.5,.6]]){let i=e.createOscillator();i.type=t,i.frequency.value=60*n,i.scale=n;let a=e.createGain();a.gain.value=r,i.connect(a).connect(this.engineFilter),i.start(),this.engineOscs.push(i)}this.chug=e.createOscillator(),this.chug.frequency.value=12,this.chugDepth=e.createGain(),this.chugDepth.gain.value=0,this.chug.connect(this.chugDepth).connect(this.engineGain.gain),this.chug.start(),this.whine=e.createOscillator(),this.whine.type=`sine`,this.whine.frequency.value=900,this.whineGain=e.createGain(),this.whineGain.gain.value=0,this.whine.connect(this.whineGain).connect(this.effectsBus),this.whine.start(),this.noiseBuffer=e.createBuffer(1,e.sampleRate*2,e.sampleRate);let n=this.noiseBuffer.getChannelData(0);for(let e=0;e<n.length;e++)n[e]=Math.random()*2-1;this.wind=e.createBufferSource(),this.wind.buffer=this.noiseBuffer,this.wind.loop=!0,this.windFilter=e.createBiquadFilter(),this.windFilter.type=`bandpass`,this.windFilter.frequency.value=700,this.windFilter.Q.value=1.4,this.windGain=e.createGain(),this.windGain.gain.value=0,this.wind.connect(this.windFilter).connect(this.windGain).connect(this.effectsBus);let r=e.createBiquadFilter();r.type=`highpass`,r.frequency.value=2800,this.rainGain=e.createGain(),this.rainGain.gain.value=0,this.wind.connect(r).connect(this.rainGain).connect(this.effectsBus),this.wind.start(),this.voiceGain=e.createGain(),this.voiceGain.gain.value=1,this.voiceGain.connect(this.voiceBus),this.radioGain=e.createGain(),this.radioGain.gain.value=lv,this.radioGain.connect(this.musicBus)}setMix(e){if(this.mix={...this.mix,...e},!this.ctx)return;let t=this.ctx.currentTime;this.musicBus.gain.setTargetAtTime(this.mix.music,t,.05),this.effectsBus.gain.setTargetAtTime(this.mix.effects,t,.05),this.voiceBus.gain.setTargetAtTime(this.mix.voice,t,.05)}get ready(){return this.ctx!==null}setVolume(e){this.volume=e,this.ctx&&this.master.gain.setTargetAtTime(e,this.ctx.currentTime,.05)}setPaused(e){this.paused=e,this.ctx&&this.effectsBus.gain.setTargetAtTime(e?0:this.mix.effects,this.ctx.currentTime,.1)}file(e,t){return`/play/${e}/${t}.m4a`}say(e,t=1,n=0){if(!this.ctx)return!1;let r=this.ctx.currentTime,i=this.saidAt.get(e);if(n>0&&i!==void 0&&r-i<n||this.speaking&&!this.speaking.ended&&r<this.speakingUntil&&t<=this.speakingPriority)return!1;this.speaking&&!this.speaking.ended&&this.speaking.pause();let a=new Audio(this.file(`voice`,e));return a.volume=1,this.ctx.createMediaElementSource(a).connect(this.voiceGain),a.play().catch(()=>void 0),this.speaking=a,this.speakingPriority=t,this.speakingUntil=r+4,a.addEventListener(`loadedmetadata`,()=>{this.speakingUntil=r+a.duration}),this.saidAt.set(e,r),this.radioGain.gain.setTargetAtTime(lv*uv,r,.08),a.addEventListener(`ended`,()=>this.radioGain.gain.setTargetAtTime(lv,this.ctx.currentTime,.5)),!0}oneOf(e,t){return`${e}${1+Math.floor(Math.random()*t)}`}useOwnMusic(e,t=!0){for(let e of this.ownTracks)URL.revokeObjectURL(e.url);this.ownTracks=e.filter(e=>e.type.startsWith(`audio/`)||/\.(mp3|m4a|aac|wav|ogg|flac)$/i.test(e.name)).map(e=>({name:e.name.replace(/\.[^.]+$/,``),url:URL.createObjectURL(e)}));for(let e=this.ownTracks.length-1;e>0;e--){let t=Math.floor(Math.random()*(e+1));[this.ownTracks[e],this.ownTracks[t]]=[this.ownTracks[t],this.ownTracks[e]]}return this.radioAt=0,t&&(this.radioOn=!0,this.radio&&=(this.radio.pause(),null),this.playRadio()),this.ownTracks.length}useOurRadio(){for(let e of this.ownTracks)URL.revokeObjectURL(e.url);this.ownTracks=[],this.radioAt=0,this.radio&&=(this.radio.pause(),null),this.playRadio()}get ownMusic(){return this.ownTracks.length>0}playRadio(){if(!this.ctx||!this.radioOn)return;let e=this.ownTracks.length>0?this.ownTracks[this.radioAt%this.ownTracks.length]:null,t=e?e.name:this.radioTracks[this.radioAt%this.radioTracks.length],n=new Audio(e?e.url:this.file(`radio`,t));this.ctx.createMediaElementSource(n).connect(this.radioGain),n.addEventListener(`ended`,()=>{this.radioAt++,this.playRadio()}),n.addEventListener(`error`,()=>{this.radioAt++,this.radio===n&&this.playRadio()}),n.play().catch(()=>void 0),this.radio=n,this.onSong?.(e?t:sv[t]??t)}skipRadio(){this.radio&&=(this.radio.pause(),null),this.radioAt++,this.playRadio()}toggleRadio(){this.radioOn=!this.radioOn,!this.radioOn&&this.radio&&(this.radio.pause(),this.radio=null),this.radioOn&&!this.radio&&this.playRadio()}thump(e){if(!this.ctx)return;let t=this.ctx,n=t.createBufferSource();n.buffer=this.noiseBuffer;let r=t.createBiquadFilter();r.type=`lowpass`,r.frequency.value=180;let i=t.createGain();i.gain.setValueAtTime(e,t.currentTime),i.gain.exponentialRampToValueAtTime(.001,t.currentTime+.5),n.connect(r).connect(i).connect(this.effectsBus),n.start(),n.stop(t.currentTime+.5);let a=t.createOscillator();a.frequency.setValueAtTime(70,t.currentTime),a.frequency.exponentialRampToValueAtTime(30,t.currentTime+.4);let o=t.createGain();o.gain.setValueAtTime(e*.8,t.currentTime),o.gain.exponentialRampToValueAtTime(.001,t.currentTime+.4),a.connect(o).connect(this.effectsBus),a.start(),a.stop(t.currentTime+.4)}thunder(){if(!this.ctx)return;let e=this.ctx,t=e.createBufferSource();t.buffer=this.noiseBuffer,t.loop=!0;let n=e.createBiquadFilter();n.type=`lowpass`,n.frequency.setValueAtTime(1400,e.currentTime),n.frequency.exponentialRampToValueAtTime(160,e.currentTime+1.2);let r=e.createGain();r.gain.setValueAtTime(.001,e.currentTime),r.gain.exponentialRampToValueAtTime(.35,e.currentTime+.08),r.gain.exponentialRampToValueAtTime(.001,e.currentTime+2.6),t.connect(n).connect(r).connect(this.effectsBus),t.start(),t.stop(e.currentTime+2.6)}bell(){if(!this.ctx)return;let e=this.ctx,t=e.createOscillator();t.frequency.value=1900;let n=e.createGain();n.gain.setValueAtTime(.12,e.currentTime),n.gain.exponentialRampToValueAtTime(.001,e.currentTime+.25),t.connect(n).connect(this.effectsBus),t.start(),t.stop(e.currentTime+.25)}update(e,t,n,r,i,a){if(!this.ctx)return;let o=this.ctx.currentTime,s=e.rig,c=t.phase===q.Driving,l=Math.max(s.maxSpeed,1),u=Math.abs(t.speed),d=Math.min(4,Math.floor(u/l*5)),f=Math.min(1,u/l*5-d),p=t.phase===q.Ready||!c&&t.phase!==q.Lifting?.1:.15+.85*f,m=c&&r>.1?t.boosting?1:.7:.15,h=48+62*p+5*d;for(let e of this.engineOscs)e.frequency.setTargetAtTime(h*e.scale,o,.06);this.engineFilter.frequency.setTargetAtTime(500+1600*m*(.5+.5*p),o,.08);let g=t.phase===q.Ready?.025:t.phase===q.Finished?.03:.05+.06*m;this.engineGain.gain.setTargetAtTime(g,o,.15),this.chug.frequency.setTargetAtTime(h/4,o,.1),this.chugDepth.gain.setTargetAtTime(g*.35,o,.1),this.whineGain.gain.setTargetAtTime(t.boosting?.035:0,o,.1),this.whine.frequency.setTargetAtTime(900+1400*Math.min(1,u/Math.max(s.boostSpeed,1)),o,.2);let _=c?Math.min(1,Math.abs(t.blow)/3):0;if(this.windGain.gain.setTargetAtTime(_*.12*(.7+.3*Math.sin(o*1.7)),o,.25),this.windFilter.frequency.setTargetAtTime(500+600*_,o,.3),this.rainGain.gain.setTargetAtTime(t.inStorm&&(c||t.phase===q.Lifting)?.05:0,o,.6),t.inStorm&&o-this.lastThunder>11+Math.random()*9&&(this.lastThunder=o,this.thunder()),a&&i&&(this.bellClock+=n,this.bellClock>.5&&(this.bellClock=0,this.bell())),t.lastCall!==this.lastCall||t.lastCallTime!==this.lastCallTime)switch(this.lastCall=t.lastCall,this.lastCallTime=t.lastCallTime,t.lastCall){case J.CloseCall:this.say(this.oneOf(`close`,4),1,3);break;case J.Hit:this.thump(.5),this.say(this.oneOf(`hit`,3),2,5);break;case J.BridgeStrike:this.thump(.8),this.say(`strike`,2);break;case J.Jackknife:this.thump(.6),this.say(`jackknife`,2,14);break;case J.StormHere:this.say(`storm_here`,2,15);break;case J.Air:this.say(`air`,1,6);break;case J.Splash:this.thump(.7),this.say(`splash`,2);break;case J.Rescue:this.say(`rescue`,2);break;case J.BrokeDown:this.say(`broke`,3);break;case J.Patched:this.say(`patched`,3);break;case J.Train:this.thump(1),this.say(`train`,3);break;case J.BeatTrain:this.say(`beattrain`,2);break;case J.Weighed:this.say(`weighed`,2);break;case J.BlewScale:this.say(`blewscale`,2);break;case J.GotBoost:this.say(`gotboost`,1,6);break;case J.GotRepair:this.say(`gotrepair`,1,6);break;case J.Delivered:this.say(e.course.endless?`grade_${e.grade().toLowerCase()}`:e.rig.shape===`blade`?`lift_hub`:e.rig.shape===`transformer`?`lift_pad`:e.rig.shape===`rocket`?`lift_mount`:`lift_plot`,3);break;case J.Miss:this.thump(.6),this.say(`clang`,2,4);break;case J.Found:this.say(`found`,2);break;case J.LinedUp:this.say(`linedup`,2,8);break;case J.Scrape:this.thump(.3),this.say(`scrape`,2,6);break;case J.Loaded:this.thump(.4),this.say(`loaded`,3);break;case J.Recovered:this.say(`recovered`,3),setTimeout(()=>this.say(`grade_${e.grade().toLowerCase()}`,3),2400);break;case J.Bolt:this.thump(.3),this.say(`bolted`,3),setTimeout(()=>this.say(`grade_${e.grade().toLowerCase()}`,3),2600);break;case J.Fell:this.thump(1),this.say(`fell`,3);break;case J.Leapt:this.say(`leap`,2);break;case J.Wave:this.thump(.4),this.say(`waves`,1,12);break;case J.Sea:this.thump(.7),this.say(`splash`,2);break;case J.Caught:this.say(`caught`,3)}if(c){!this.stormCloseSaid&&!t.inStorm&&e.stormLeadSeconds()<3.5&&t.time>6&&(this.stormCloseSaid=!0,this.say(`storm_close`,2,20)),e.stormLeadSeconds()>7&&(this.stormCloseSaid=!1);let n=e.nextNote();if(n){let e=`${n.text}@${Math.round(t.s+n.distance)}`;if(e!==this.spokeNote&&n.distance>20){this.spokeNote=e;let t=this.noteLine(n.text);t&&this.say(t,1,2.5)}}}this.wasStorm=t.inStorm}noteLine(e){let t=e.includes(`/`)?e.slice(0,e.indexOf(`/`)):e,n=e=>t.includes(e);return n(`NARROW`)?`narrow`:n(`THE LEAP`)?`leap`:n(`SHORTCUT`)||n(`ALLEY`)||n(`SANDBAR`)?`shortcut`:n(`MARKET`)?`market`:n(`THE CLIMB`)||n(`THE RIDGE`)?`climb`:n(`OVER THE TOP`)||n(`DOWNHILL`)?`downhill`:n(`ROCKFALL`)?`rocks`:n(`WAVE`)?`waves`:e.toLowerCase().includes(`jump`)?`jump`:t.startsWith(`SITE`)?`site`:n(`HAIRPIN`)?`hairpin`:n(`WIND`)?this.oneOf(`wind`,2):n(`RAIL CROSSING`)||n(`WEIGH`)?``:n(`CROSSING`)||n(`CROSS STREET`)?`crossing`:n(`PARKED`)?`parked`:n(`TRAFFIC`)?this.oneOf(`traffic`,2):n(`ESS BEND`)?`bends`:n(`BRIDGE`)||n(`BRANCH`)||n(`CONVEYOR`)||n(`GANTR`)?e.includes(`clear it`)?``:this.oneOf(`duck`,3):n(`LEFT`)?n(`TIGHT`)?`left1`:`left2`:n(`RIGHT`)?n(`TIGHT`)?`right1`:`right2`:``}hello(){this.ctx&&(this.say(`hello`,2),this.radio||this.playRadio())}go(){this.say(`go`,3)}},fv=`hh-music`,pv=`songs`;function mv(){return new Promise((e,t)=>{let n=indexedDB.open(fv,1);n.onupgradeneeded=()=>n.result.createObjectStore(pv,{autoIncrement:!0}),n.onsuccess=()=>e(n.result),n.onerror=()=>t(n.error)})}async function hv(e){try{let t=await mv();await new Promise((n,r)=>{let i=t.transaction(pv,`readwrite`),a=i.objectStore(pv);a.clear();for(let t of e)a.add({name:t.name,type:t.type,blob:t});i.oncomplete=()=>n(),i.onerror=()=>r(i.error)}),t.close()}catch{}}async function gv(){try{let e=await mv(),t=await new Promise((t,n)=>{let r=e.transaction(pv,`readonly`).objectStore(pv).getAll();r.onsuccess=()=>t(r.result),r.onerror=()=>n(r.error)});return e.close(),t.map(e=>new File([e.blob],e.name,{type:e.type}))}catch{return[]}}async function _v(){await hv([])}var vv=class e{constructor(t){this.scene=t,this.sparks=[],this.debris=[],this.puffs=[],this.sparkGeo=new Ta(.12,.12,.5),this.sparkMat=new di({color:new V(1,.75,.3)}),this.bitGeo=new Ta(.4,.4,.4),this.dustClock=0,this.smokeClock=0;let n=e.soft();this.puffMat=new Wr({map:n,color:new V(.75,.68,.55),transparent:!0,opacity:.5,depthWrite:!1}),this.smokeMat=new Wr({map:n,color:new V(.2,.2,.2),transparent:!0,opacity:.55,depthWrite:!1});for(let e=0;e<60;e++){let e=new H(this.sparkGeo,this.sparkMat);e.visible=!1,t.add(e),this.sparks.push({mesh:e,vel:new z,life:0,spin:new z,grow:0})}for(let e=0;e<30;e++){let e=new H(this.bitGeo,Vh([.35,.33,.3]));e.visible=!1,e.castShadow=!0,t.add(e),this.debris.push({mesh:e,vel:new z,life:0,spin:new z,grow:0})}for(let e=0;e<70;e++){let e=new ii(this.puffMat.clone());e.visible=!1,t.add(e),this.puffs.push({mesh:e,vel:new z,life:0,spin:new z,grow:0})}}static soft(){let e=document.createElement(`canvas`);e.width=e.height=64;let t=e.getContext(`2d`),n=t.createRadialGradient(32,32,0,32,32,32);return n.addColorStop(0,`rgba(255,255,255,0.8)`),n.addColorStop(.6,`rgba(255,255,255,0.25)`),n.addColorStop(1,`rgba(255,255,255,0)`),t.fillStyle=n,t.fillRect(0,0,64,64),new xa(e)}take(e){let t=null;for(let n of e){if(n.life<=0)return n;(!t||n.life<t.life)&&(t=n)}return t}knock(e,t,n,r,i){for(let i=0;i<14*r;i++){let r=this.take(this.sparks);if(!r)break;r.mesh.position.set(e,t+Math.random()*.8,n),r.vel.set((Math.random()-.5)*14,2+Math.random()*8,(Math.random()-.5)*14),r.life=.3+Math.random()*.4,r.mesh.visible=!0}for(let a=0;a<4*r;a++){let r=this.take(this.debris);if(!r)break;r.mesh.position.set(e,t+.5,n),r.vel.set((Math.random()-.5)*9,4+Math.random()*6,(Math.random()-.5)*9),r.spin.set(Math.random()*8,Math.random()*8,Math.random()*8),r.life=1.2+Math.random()*1.2;let a=.4+Math.random()*.9;r.mesh.scale.set(a,a,a),i&&(r.mesh.material=new ss({color:i,roughness:.8})),r.mesh.visible=!0}}puff(e,t,n,r,i,a,o){let s=this.take(this.puffs);if(!s)return;let c=s.mesh;c.material=r.clone(),c.position.set(e,t,n),c.scale.set(i,i,1),s.vel.set((Math.random()-.5)*1.5,a,(Math.random()-.5)*1.5),s.life=o,s.grow=i*1.6,c.visible=!0}update(e,t,n,r,i,a,o,s,c,l=0){this.dustClock+=e,o&&Math.abs(s)>3&&this.dustClock>.06&&(this.dustClock=0,this.puff(t+(Math.random()-.5)*2,l+.6,n+(Math.random()-.5)*2,this.puffMat,1.5+Math.random(),1.2,1.1)),this.smokeClock+=e,c>55&&this.smokeClock>Math.max(.08,.5-c/200)&&(this.smokeClock=0,this.puff(r,a,i,this.smokeMat,.8+Math.random()*.6,2.2+Math.random(),1.6));for(let t of this.sparks)t.life<=0||(t.life-=e,t.vel.y-=25*e,t.mesh.position.addScaledVector(t.vel,e),t.mesh.lookAt(t.mesh.position.clone().add(t.vel)),(t.life<=0||t.mesh.position.y<0)&&(t.life=0,t.mesh.visible=!1));for(let t of this.debris)t.life<=0||(t.life-=e,t.vel.y-=14*e,t.mesh.position.addScaledVector(t.vel,e),t.mesh.position.y<.2&&(t.mesh.position.y=.2,t.vel.set(t.vel.x*.5,-t.vel.y*.3,t.vel.z*.5),t.spin.multiplyScalar(.5)),t.mesh.rotation.x+=t.spin.x*e,t.mesh.rotation.y+=t.spin.y*e,t.mesh.rotation.z+=t.spin.z*e,t.life<=0&&(t.mesh.visible=!1));for(let t of this.puffs){if(t.life<=0)continue;t.life-=e,t.mesh.position.addScaledVector(t.vel,e);let n=t.mesh;n.scale.x+=t.grow*e*.6,n.scale.y+=t.grow*e*.6,n.material.opacity=Math.max(0,Math.min(.55,t.life*.6)),t.life<=0&&(n.visible=!1)}}},yv=`modulepreload`,bv=function(e){return`/play/`+e},xv={},Sv=function(e){return e.pathname.endsWith(`.css`)},Cv=function(e,t,n){if(t in e)return e[t];let r=n();if(!r){e[t]=void 0;return}let i=r.then(()=>{e[t]=void 0},n=>{throw e[t]=void 0,n});return e[t]=i,i},wv=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e,i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function s(e){return import.meta.resolve?new URL(import.meta.resolve(e)):new URL(e,import.meta.url)}r=o(t.map(t=>{t=bv(t,n);let r=s(t),i=Sv(r);return Cv(xv,r.href,()=>{if(e===void 0){e={all:new Set,styles:new Set};let t=document.getElementsByTagName(`link`);for(let n=t.length-1;n>=0;n--){let r=t[n];e.all.add(r.href),r.rel===`stylesheet`&&e.styles.add(r.href)}}if((i?e.styles:e.all).has(r.href))return;let t=document.createElement(`link`);if(t.rel=i?`stylesheet`:yv,i||(t.as=`script`),t.crossOrigin=``,t.href=r.href,a&&t.setAttribute(`nonce`,a),document.head.appendChild(t),i)return new Promise((e,n)=>{t.addEventListener(`load`,e),t.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${r}`)))})})}).filter(e=>e!==void 0))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})},Tv=`https://mpchkzqkvkizxeokjhnp.supabase.co`,Ev=`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wY2hrenFrdmtpenhlb2tqaG5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MDkzODEsImV4cCI6MjA4MzI4NTM4MX0.1pl9TsdSNEyFZDhpXgIydrRK0Ky1Ucxz1MgvNxzIpmo`,Dv=!!Ev,Ov=`https://axleyard.com`,kv=()=>({apikey:Ev,Authorization:`Bearer ${Ev}`,"Content-Type":`application/json`}),Av=async e=>{if(!Dv)return null;try{let t=await fetch(`${Tv}/rest/v1/${e}`,{headers:kv()});return t.ok?await t.json():null}catch{return null}},jv=(e,t)=>{try{localStorage.setItem(e,t)}catch{}},Mv=e=>{try{return localStorage.getItem(e)??``}catch{return``}},Nv=()=>Mv(`hh-driver`),Pv=e=>jv(`hh-driver`,e),Fv=()=>Mv(`hh-company`),Iv=e=>jv(`hh-company`,e),Lv=()=>Mv(`hh-event`),Rv=e=>jv(`hh-event`,e);function zv(){let e=Mv(`hh-client`);return e||(e=Math.random().toString(36).slice(2,10)+Date.now().toString(36),jv(`hh-client`,e)),e}var Bv=null;function Vv(){return Dv?Bv??=wv(()=>import(`./module-BirHTz-o.js`).then(e=>e.createBrowserClient(Tv,Ev)),[]).catch(()=>null):Promise.resolve(null)}async function Hv(){let e=await Vv();if(!e)return null;try{let{data:t}=await e.auth.getSession(),n=t.session;if(!n)return null;let{data:r}=await e.from(`game_drivers`).select(`handle,company`).eq(`user_id`,n.user.id).limit(1),i=r&&r.length?r[0]:null;return{userId:n.user.id,token:n.access_token,handle:i?.handle??null,company:i?.company??null}}catch{return null}}async function Uv(e,t,n){let r=await Vv();if(!r)return`error`;let{error:i}=await r.from(`game_drivers`).upsert({user_id:e.userId,handle:t,company:n},{onConflict:`user_id`});return i?i.code===`23505`?`taken`:`error`:(e.handle=t,e.company=n,`ok`)}var Wv=()=>`/login?redirect=${encodeURIComponent(location.pathname+location.search)}`;async function Gv(e,t=null){if(!Dv)return`error`;try{let n=t&&t.handle?{...e,user_id:t.userId}:e,r=t&&t.handle?{Authorization:`Bearer ${await Kv()??t.token}`}:{},i=await fetch(`${Tv}/rest/v1/game_runs`,{method:`POST`,headers:{...kv(),...r,Prefer:`return=minimal`},body:JSON.stringify(n)});return i.ok?`ok`:(await i.text()).includes(`claimed`)?`claimed`:`error`}catch{return`error`}}async function Kv(){let e=await Vv();if(!e)return null;let{data:t}=await e.auth.getSession();return t.session?.access_token??null}async function qv(e,t,n=10){return await Av(`game_board?${new URLSearchParams({select:`driver,company,time_seconds,pay,grade,beat_storm,created_at,verified`,course:`eq.${e}`,load:`eq.${t}`,order:`pay.desc,time_seconds.asc`,limit:String(n)})}`)??[]}async function Jv(e,t=10){return await Av(`game_runs?${new URLSearchParams({select:`driver,company,time_seconds,pay,grade,beat_storm,created_at`,event_code:`eq.${e}`,order:`pay.desc,time_seconds.asc`,limit:String(t)})}`)??[]}async function Yv(e){let t=await Av(`game_driver_totals?${new URLSearchParams({select:`driver,company,runs,pay,hours,clean_runs,best_grade`,key:`eq.${e.toLowerCase()}`})}`);return t&&t.length?t[0]:null}async function Xv(e=10){return await Av(`game_company_totals?${new URLSearchParams({select:`company,drivers,runs,pay,hours`,order:`pay.desc`,limit:String(e)})}`)??[]}async function Zv(e){let t=await Av(`game_events?${new URLSearchParams({select:`code,name,starts_at,ends_at,prize`,code:`eq.${e}`})}`);return t&&t.length?t[0]:null}async function Qv(e=6){let t=Math.floor(Math.random()*900),n=await Av(`listings?${new URLSearchParams({select:`id,title,price,city,state,year,make,listing_images(url,sort_order,is_primary)`,status:`eq.active`,deleted_at:`is.null`,order:`published_at.desc`,limit:String(e*3),offset:String(t)})}`);return n?n.filter(e=>e.listing_images&&e.listing_images.length>=3).slice(0,e).map(e=>{let t=[...e.listing_images].sort((e,t)=>Number(t.is_primary)-Number(e.is_primary)||e.sort_order-t.sort_order);return{id:e.id,title:e.title,price:e.price,city:e.city,state:e.state,year:e.year,make:e.make,photo:t[0]?.url??null}}):[]}var $v=e=>`${Ov}/listing/${e}?utm_source=heavyhaul&utm_medium=game`,ey=new URLSearchParams(location.search),ty=(()=>{let e=ey.get(`level`);if(e!==null)return Math.max(0,Math.min(8,Number(e)||0));try{return Math.max(0,Math.min(8,Number(localStorage.getItem(`hh-level`)??0)||0))}catch{return 0}})(),ny=np(ty),Q=new mh(ny);function ry(e){if(e===ty||Q.state.phase!==q.Ready)return;try{localStorage.setItem(`hh-level`,String(e))}catch{}let t=new URL(location.href);t.searchParams.set(`level`,String(e)),location.href=t.toString()}{let e=document.getElementById(`levels`);for(let t=0;t<9;t++){let n=document.createElement(`button`),r=t===7?`new every day`:t===8?`how far can you get`:t===0?`start here`:np(t).town.toLowerCase();n.innerHTML=`<b>${t+1}</b>${rp[t]}<small>${r}</small>`,n.classList.toggle(`on`,t===ty),n.addEventListener(`click`,()=>ry(t)),e.appendChild(n)}document.getElementById(`level-blurb`).textContent=ny.blurb,document.getElementById(`logo`).src=`/play/axlon-face.png`}var iy=new $d({canvas:document.getElementById(`game`),antialias:!0,powerPreference:`high-performance`});iy.setPixelRatio(Math.min(window.devicePixelRatio,2)),iy.shadowMap.enabled=!0,iy.shadowMap.type=1,iy.toneMapping=4,iy.toneMappingExposure=1;var ay=new Bn;ay.fog=new zn(new V(.72,.8,.9),320,2200);var oy=new fc(new V(1,.93,.82),2.8);oy.castShadow=!0,oy.shadow.mapSize.set(4096,4096),oy.shadow.camera.near=1,oy.shadow.camera.far=500,oy.shadow.camera.left=-110,oy.shadow.camera.right=110,oy.shadow.camera.top=110,oy.shadow.camera.bottom=-110,oy.shadow.bias=-4e-4,oy.shadow.normalBias=.02,ay.add(oy,oy.target);var sy=new qs(new V(.55,.7,1),new V(.35,.4,.25),.9);ay.add(sy);var cy=new ac(70,1,.5,6e3),ly=new av(ay),uy=new iv(ay,ny),dy=0,fy=(e,t,n)=>{try{return Math.max(0,Math.min(n,Number(ey.get(e)??localStorage.getItem(`hh-${e}`)??t)||0))}catch{return t}};Q.recovery=(ey.get(`mode`)??(()=>{try{return localStorage.getItem(`hh-mode`)}catch{return null}})())===`recovery`,dy=fy(`load`,0,5),Q.broken=fy(`job`,0,ih.length-1),Q.state.truck=fy(`truck`,0,ch.length-1),Q.state.contract=dy,Q.reset();var py=new O_(ay,ch[Q.state.truck],Q.rig);Q.recovery&&py.setBroken(ih[Q.broken],Q.broken),uy.setSite(Q.rig.shape);var my=()=>Q.recovery?`RECOVERY  ${ih[Q.broken].name}`:Q.rig.name;function hy(){Q.state.contract=dy,Q.reset(),py.remove(),py=new O_(ay,ch[Q.state.truck],Q.rig),ny.night&&py.headlights(),Q.recovery&&py.setBroken(ih[Q.broken],Q.broken),uy.setSite(Q.rig.shape);try{localStorage.setItem(`hh-mode`,Q.recovery?`recovery`:`haul`),localStorage.setItem(`hh-load`,String(dy)),localStorage.setItem(`hh-job`,String(Q.broken)),localStorage.setItem(`hh-truck`,String(Q.state.truck))}catch{}yy();for(let e of document.querySelectorAll(`#trucks button`))e.classList.toggle(`on`,Number(e.dataset.i)===Q.state.truck);for(let e of document.querySelectorAll(`#modes button`))e.classList.toggle(`on`,e.dataset.mode===(Q.recovery?`recovery`:`haul`));document.body.classList.toggle(`recovery`,Q.recovery),by()}var gy=()=>{document.getElementById(`tagline`).textContent=Q.recovery?`Tow the breakdown home before the clock eats the fee.`:`Get the load there before the storm does.`};function _y(e,t){Q.state.phase===q.Ready&&(Q.recovery?Q.broken=e:dy=e,Q.state.truck=t,hy())}function vy(e){Q.state.phase===q.Ready&&e!==Q.recovery&&(Q.recovery=e,hy())}function yy(){let e=document.getElementById(`loads`);e.innerHTML=``,document.getElementById(`loads-head`).textContent=Q.recovery?`JOB`:`LOAD`,(Q.recovery?ih.map(e=>({name:e.name,pay:e.fee})):rh.slice(0,6).map(e=>({name:e.name,pay:e.basePay}))).forEach((t,n)=>{let r=document.createElement(`button`);r.dataset.i=String(n),r.innerHTML=`${t.name}<small>${Q.recovery?`fee `:``}$${t.pay.toLocaleString(`en-US`)}</small>`,r.classList.toggle(`on`,n===(Q.recovery?Q.broken:dy)),r.addEventListener(`click`,()=>_y(n,Q.state.truck)),e.appendChild(r)})}function by(){let e=ch[Q.state.truck];if(Q.recovery){let t=ih[Q.broken];document.getElementById(`cap-name`).textContent=`RECOVERY  ·  ${t.name}`,document.getElementById(`cap-sub`).textContent=`${e.name}  ·  FEE $${t.fee.toLocaleString(`en-US`)}  ·  the clock is on the customer`,document.getElementById(`load-blurb`).textContent=`${t.blurb} Find her, back the deck up to her nose, hold F to winch her on, bring her in.`}else document.getElementById(`cap-name`).textContent=Q.rig.name,document.getElementById(`cap-sub`).textContent=`${e.name}  ·  PAYS $${Q.rig.basePay.toLocaleString(`en-US`)}`,document.getElementById(`load-blurb`).textContent=Q.rig.blurb;document.getElementById(`truck-blurb`).textContent=`${e.name}: ${e.strengths}.`,gy()}{let e=document.getElementById(`modes`);for(let[t,n]of[[`haul`,`HAUL`],[`recovery`,`RECOVERY`]]){let r=document.createElement(`button`);r.dataset.mode=t,r.textContent=n,r.classList.toggle(`on`,t===`recovery`===Q.recovery),r.addEventListener(`click`,()=>vy(t===`recovery`)),e.appendChild(r)}document.body.classList.toggle(`recovery`,Q.recovery),yy(),by();let t=document.getElementById(`trucks`);ch.forEach((e,n)=>{let r=document.createElement(`button`);r.dataset.i=String(n),r.innerHTML=`${e.name}<small>${e.strengths}</small>`,r.classList.toggle(`on`,n===Q.state.truck),r.addEventListener(`click`,()=>_y(Q.recovery?Q.broken:dy,n)),t.appendChild(r)})}var xy=new vv(ay);setTimeout(()=>void P_().then(({cars:e,taxi:t})=>uy.useCarModels(e,t)),400);var Sy=+!!ny.night;ny.night&&sy.color.setRGB(.32,.4,.62),ly.night=Sy,ly.warm=+!!ny.desert,ny.night&&py.headlights(),ny.desert&&(oy.color.setRGB(1,.8,.6),ly.setSun(18,250));var Cy=ny.night?[.03,.035,.07]:ny.desert?[.9,.75,.58]:[.72,.8,.9];{let e=ny.night?`night`:ny.desert?`evening`:ny.coast?`overcast`:`day`;ly.setPhoto(`/play/sky/${e}.jpg`,(e,t)=>{ny.night||(Cy[0]=e.r,Cy[1]=e.g,Cy[2]=e.b),ny.night?sy.color.setRGB(.32,.4,.62):sy.color.copy(t).lerp(new V(1,1,1),.35);let n=new ol(iy),r=ly.photoSky.clone();r.mapping=303,r.needsUpdate=!0,ay.environment=n.fromEquirectangular(r).texture,ay.environmentIntensity=ny.night?.04:.55,n.dispose()},ny.night?.22:1)}var wy=-1,Ty=0,Ey=0,Dy=new Ah(iy);Dy.addPass(new jh(ay,cy));var Oy=new Nh(new R(1,1),.3,.4,1.5);Dy.addPass(Oy),Dy.addPass(new Fh);var ky=new dv,Ay=!1;function jy(){ky.start(),Ay||(Ay=!0,setTimeout(()=>ky.hello(),300))}window.addEventListener(`keydown`,jy,{once:!1}),window.addEventListener(`pointerdown`,jy,{once:!1});var My=new Set;window.addEventListener(`keydown`,e=>{if(My.add(e.code),[`Space`,`ArrowUp`,`ArrowDown`,`ArrowLeft`,`ArrowRight`].includes(e.code)&&e.preventDefault(),e.code===`KeyN`&&!e.repeat&&document.activeElement?.tagName!==`INPUT`&&(Q.state.phase===q.Ready?ky.toggleRadio():ky.skipRadio(),document.getElementById(`radio-on`).checked=ky.radioOn),(e.code===`KeyP`||e.code===`Escape`)&&!e.repeat&&Iy(),(e.code===`Enter`||e.code===`NumpadEnter`)&&!e.repeat&&document.activeElement?.tagName!==`INPUT`){if(Ny){Iy(),Q.reset(),py.resetRecovery(),bb=!1;return}Py=!0}Q.state.phase===q.Ready&&/^Digit[1-9]$/.test(e.code)&&document.activeElement?.tagName!==`INPUT`&&ry(Number(e.code.slice(5))-1)});var Ny=!1,Py=!1;document.getElementById(`r-go`).addEventListener(`click`,()=>{Py=!0,Fy=!0});var Fy=!1;function Iy(){Q.state.phase!==q.Ready&&(Ny=!Ny,document.getElementById(`pause`).style.display=Ny?`flex`:`none`,ky.setPaused(Ny))}document.getElementById(`t-pause`).addEventListener(`click`,Iy);for(let e of[`music`,`effects`,`voice`]){let t=document.getElementById(`mix-${e}`);try{let n=localStorage.getItem(`hh-mix-${e}`);n!==null&&(t.value=String(Math.round(Number(n)*100)))}catch{}ky.setMix({[e]:Number(t.value)/100}),t.addEventListener(`input`,()=>ky.setMix({[e]:Number(t.value)/100})),t.addEventListener(`change`,()=>{try{localStorage.setItem(`hh-mix-${e}`,String(Number(t.value)/100))}catch{}})}document.getElementById(`radio-on`).addEventListener(`change`,()=>ky.toggleRadio());var Ly=document.getElementById(`music-files`);for(let e of document.querySelectorAll(`.my-music`))e.addEventListener(`click`,e=>{e.stopPropagation(),jy(),Ly.click()});function Ry(e){for(let t of document.querySelectorAll(`.my-music`))t.textContent=e?`♪ my ${e} song${e===1?``:`s`} on the radio  ·  change`:`♪ play my own music`;for(let t of document.querySelectorAll(`.our-radio`))t.style.display=e?``:`none`;document.getElementById(`radio-on`).checked=ky.radioOn}Ly.addEventListener(`change`,()=>{let e=[...Ly.files??[]],t=ky.useOwnMusic(e);t&&hv(e),Ry(t),Ly.value=``});for(let e of document.querySelectorAll(`.our-radio`))e.addEventListener(`click`,e=>{e.stopPropagation(),jy(),ky.useOurRadio(),_v(),Ry(0)});gv().then(e=>{e.length&&Ry(ky.useOwnMusic(e,!1))});var zy=0,By=``;ky.onSong=e=>{By=e;let t=document.getElementById(`song`);t.textContent=`♪  ${e}`,t.classList.add(`on`),clearTimeout(zy),zy=window.setTimeout(()=>t.classList.remove(`on`),4500)},window.addEventListener(`keyup`,e=>My.delete(e.code));var Vy=(...e)=>e.some(e=>My.has(e));function Hy(){let e=fh();return e.throttle=+!!Vy(`KeyW`,`ArrowUp`),e.brake=+!!Vy(`KeyS`,`ArrowDown`),e.steer=+!!Vy(`KeyD`,`ArrowRight`)-!!Vy(`KeyA`,`ArrowLeft`),e.tail=+!!Vy(`KeyE`)-!!Vy(`KeyQ`),e.duck=Vy(`Space`),e.boost=Vy(`ShiftLeft`,`ShiftRight`),e.rescue=Vy(`KeyR`),e.fix=Vy(`KeyF`),e}var Uy={steer:0,throttle:0,brake:0,duck:!1,boost:!1,fix:!1};function Wy(e,t){let n=document.getElementById(e);if(!n)return;let r=e=>{e.preventDefault(),t(!0),n.classList.add(`held`)},i=e=>{e.preventDefault(),t(!1),n.classList.remove(`held`)};n.addEventListener(`pointerdown`,r),n.addEventListener(`pointerup`,i),n.addEventListener(`pointercancel`,i),n.addEventListener(`pointerleave`,i)}Wy(`t-left`,e=>Uy.steer=e?-1:Uy.steer<0?0:Uy.steer),Wy(`t-right`,e=>Uy.steer=e?1:Uy.steer>0?0:Uy.steer),Wy(`t-go`,e=>Uy.throttle=+!!e),Wy(`t-brake`,e=>Uy.brake=+!!e),Wy(`t-duck`,e=>Uy.duck=e),Wy(`t-boost`,e=>Uy.boost=e),Wy(`t-fix`,e=>Uy.fix=e);var Gy=matchMedia(`(pointer: coarse)`).matches;document.body.classList.toggle(`touch`,Gy),Gy&&(document.querySelector(`#title .go`).textContent=`TAP GO TO DRIVE`,document.getElementById(`r-go`).textContent=`TAP HERE TO GO AGAIN`);var $=e=>document.getElementById(e),Ky={speed:$(`speed`),time:$(`time`),storm:$(`storm`),note:$(`note`),noteDist:$(`note-dist`),call:$(`call`),damage:$(`damage`),boost:$(`boost-fill`),title:$(`title`),result:$(`result`),countdown:$(`countdown`)},qy=e=>Math.round(Math.abs(e)*2.23694),Jy=e=>(e<0?`-`:``)+`$`+Math.abs(e).toLocaleString(`en-US`),Yy=e=>`${Math.floor(e/60)}:${(e%60).toFixed(1).padStart(4,`0`)}`;function Xy(e,t){let n=t>0?`   +${Jy(t)}`:t<0?`   ${Jy(t)}`:``;switch(e){case J.CloseCall:return`CLOSE CALL`+n;case J.Threaded:return`THREADED IT`+n;case J.Hit:return`HIT`;case J.BridgeStrike:return`BRIDGE STRIKE`;case J.Jackknife:return`JACKKNIFE`;case J.Overshot:return`OVERSHOT THE BOX`+n;case J.StormHere:return`THE STORM HAS YOU`;case J.Air:return`BIG AIR`+n;case J.Splash:return`IN THE WATER`;case J.Rescue:return`BACK ON THE ROAD`;case J.BrokeDown:return`BROKEN DOWN`;case J.Patched:return`PATCHED UP`;case J.Train:return`THE TRAIN`;case J.BeatTrain:return`BEAT THE TRAIN`+n;case J.Weighed:return`WEIGHED  /  all in order`+n;case J.BlewScale:return`BLEW THE SCALE  /  fined`+n;case J.GotBoost:return`BOOST`;case J.GotRepair:return`REPAIR KIT`;case J.Delivered:return ny.endless?`END OF THE ROAD`:`IN THE BOX  /  now the lift`;case J.Fell:return`INTO THE GORGE`+n;case J.Leapt:return`MADE THE LEAP`+n;case J.Wave:return`WAVE`;case J.Sea:return`IN THE SEA`;case J.Caught:return`THE STORM HAS YOU`;case J.Miss:return`CLANG`;case J.Found:return`THERE SHE IS`;case J.LinedUp:return Gy?`LINED UP  /  hold WINCH`:`LINED UP  /  hold F to winch`;case J.Scrape:return`SCRAPING HER  /  keep her straight`;case J.Loaded:return`ON THE DECK  /  bring her in`;case J.Recovered:return`RECOVERED`+n;case J.Bolt:return(th(Q.rig.shape)?`BOLTED ON`:`SET DOWN`)+(t>0?`  /  soft touch`+n:``);default:return``}}var Zy=J.None,Qy=-1,$y=!1,eb=$(`r-post`),tb=$(`r-name`),nb=$(`r-company`),rb=!1,ib=!1,ab=`job`,ob=null;tb.value=Nv(),nb.value=Fv(),eb.style.display=Dv?`flex`:`none`;var sb=null,cb=()=>sb&&sb.handle?sb.handle:tb.value.trim();function lb(){let e=eb.querySelector(`button`),t=$(`r-claim`),n=$(`signin`);sb&&sb.handle?(tb.style.display=`none`,!nb.value&&sb.company&&(nb.value=sb.company),rb||(e.textContent=`POST TO THE BOARD`),t.innerHTML=`posting as <b>${ub(sb.handle)}</b> <span class="tick">✓</span>`,n.innerHTML=`driving as <b>${ub(sb.handle)}</b> <span class="tick">✓</span>`):sb?(tb.style.display=``,rb||(e.textContent=`CLAIM NAME & POST`),t.innerHTML=`signed in: the name you post now is yours for good`,n.innerHTML=`signed in: claim your driver name on your first run`):(tb.style.display=``,t.innerHTML=`<a href="${Wv()}" target="_top">make the name yours: sign in with AXLEYARD</a>`,n.innerHTML=`<a href="${Wv()}" target="_top">sign in</a> to claim your driver name`)}Dv&&Hv().then(e=>{sb=e,lb()});var ub=e=>e.replace(/[<>&]/g,``);{let e=(ey.get(`event`)??``).toUpperCase().replace(/[^A-Z0-9]/g,``);e&&Rv(e);let t=Lv();t&&Zv(t).then(e=>{let t=Date.now();e&&t>=Date.parse(e.starts_at)&&t<=Date.parse(e.ends_at)?(ob=e,$(`r-event`).textContent=`AT ${e.name.toUpperCase()}  /  this run goes on the show's board${e.prize?`  /  `+e.prize:``}`,$(`r-tabs`).querySelector(`[data-tab="event"]`).style.display=``):Rv(``)})}var db=[];Qv(6).then(e=>{db=e,uy.setListings(e)});async function fb(e){let t=$(`r-board`);if(ab===`companies`){let e=await Xv(10);t.innerHTML=`<h4>COMPANIES  /  all jobs</h4>`+(e.length?e.map((e,t)=>`<div><span>${t+1}</span><span>${ub(e.company)}</span><span>${e.drivers} driver${e.drivers===1?``:`s`}</span><span>${Jy(Number(e.pay))}</span></div>`).join(``):`<div><span></span><span>no company on the board yet: put yours on a run</span></div>`);return}if(ab===`event`&&ob){let e=await Jv(ob.code,10);t.innerHTML=`<h4>${ub(ob.name.toUpperCase())}</h4>`+(e.length?e.map((e,t)=>`<div><span>${t+1}</span><span>${ub(e.driver)}${e.company?`  ·  `+ub(e.company):``}</span><span>${e.grade}  ${Yy(Number(e.time_seconds))}</span><span>${Jy(e.pay)}</span></div>`).join(``):`<div><span></span><span>nobody has posted at the show yet</span></div>`);return}let n=await qv(ny.name,my(),10);t.innerHTML=n.length===0?Dv?`<h4>THE BOARD</h4><div><span></span><span>nobody has posted a run on this job yet</span></div>`:``:`<h4>THE BOARD  /  `+ny.name+`</h4>`+n.map((t,n)=>`<div class="${e&&t.pay===e.pay&&Math.abs(t.time_seconds-e.time)<.15&&t.driver.toLowerCase()===cb().toLowerCase()?`me`:``}"><span>${n+1}</span><span>${ub(t.driver)}${t.verified?` <i class="tick">✓</i>`:``}${t.company?`  ·  `+ub(t.company):``}</span><span>${t.grade}  ${Yy(Number(t.time_seconds))}</span><span>${Jy(t.pay)}</span></div>`).join(``)}async function pb(){let e=cb(),t=$(`r-career`);if(!e||!Dv){t.innerHTML=``;return}let n=await Yv(e);t.innerHTML=n?[[`CAREER PAY`,Jy(Number(n.pay))],[`RUNS`,String(n.runs)],[`SEAT HOURS`,Number(n.hours).toFixed(1)],[`CLEAN RUNS`,String(n.clean_runs)],[`BEST`,n.best_grade]].map(([e,t])=>`<div>${e}<b>${t}</b></div>`).join(``):``}function mb(){let e=$(`r-trailers`),t=db.filter((e,t)=>t<uy.boards.length&&uy.boards[t].s<Q.state.s);e.innerHTML=t.length?`<h4>TRAILERS YOU PASSED TODAY  /  for sale on AXLEYARD</h4>`+t.map(e=>`<a href="${$v(e.id)}" target="_blank" rel="noopener">${e.photo?`<img src="${e.photo}" alt="" />`:``}<span>${ub(e.title)}</span><span class="price">${e.price&&e.price>0?Jy(Math.round(e.price)):`call`}</span></a>`).join(``):``}$(`r-tabs`).addEventListener(`click`,e=>{let t=e.target.closest(`button`);if(t){ab=t.dataset.tab??`job`;for(let e of $(`r-tabs`).querySelectorAll(`button`))e.classList.toggle(`on`,e===t);fb()}}),eb.addEventListener(`submit`,async e=>{e.preventDefault();let t=Q.state,n=cb().slice(0,24),r=nb.value.trim().slice(0,40),i=eb.querySelector(`button`);if(!n||rb||t.phase!==q.Finished)return;if(n.length<2||/[<>&]/.test(n)){$(`r-claim`).textContent=`a name of 2 to 24 letters, please`;return}if(Pv(n),Iv(r),sb&&!sb.handle){i.textContent=`CLAIMING…`;let e=await Uv(sb,n,r||null);if(e!==`ok`){i.textContent=`CLAIM NAME & POST`,$(`r-claim`).textContent=e===`taken`?`that name is taken: try another`:`could not claim it just now: try again`;return}lb()}rb=!0,eb.classList.add(`posted`),i.textContent=`POSTING…`;let a=await Gv({driver:n,company:r||null,event_code:ob?ob.code:null,course:ny.name,load:my(),time_seconds:Math.round(t.time*10)/10,pay:Q.pay(),grade:Q.grade(),damage:Math.round(t.damage),hits:t.hits,close_calls:t.closeCalls,beat_storm:t.beatStorm,client:zv()},sb);a===`claimed`?(rb=!1,eb.classList.remove(`posted`),i.textContent=`POST TO THE BOARD`,$(`r-claim`).innerHTML=`that name belongs to a signed-in driver: <a href="${Wv()}" target="_top">sign in</a> if it's you, or pick another`):(i.textContent=a===`ok`?`ON THE BOARD`:`COULD NOT POST`,a===`ok`&&(await fb({pay:Q.pay(),time:Math.round(t.time*10)/10}),pb()))}),tb.addEventListener(`keydown`,e=>e.stopPropagation()),nb.addEventListener(`keydown`,e=>e.stopPropagation());function hb(){let e=Q.state;Ky.speed.textContent=String(qy(e.speed)),Ky.time.textContent=Yy(e.time);let t=Q.stormLeadSeconds(),n=e.phase===q.Driving||e.phase===q.Lifting||e.phase===q.Finished;ny.endless?(Ky.time.textContent=`${(Math.max(0,e.s-34)/1609).toFixed(2)} mi`,Ky.storm.textContent=n?t>0?`STORM  ${t.toFixed(1)} s BEHIND`:`IN THE STORM  ${Math.max(0,6-e.caughtSeconds).toFixed(0)}`:``):Ky.storm.textContent=n?t>0?`STORM  ${t.toFixed(1)} s BEHIND`:`IN THE STORM`:``,Ky.storm.className=t>8?`green`:t>3?`amber`:`red`,Ky.damage.textContent=`DAMAGE  ${Math.round(e.damage)}%`,Ky.boost.style.width=`${Math.round(e.boost*100)}%`,$(`boost-hint`).textContent=e.phase===q.Driving?e.boosting?`BOOST`:e.boost<.05?`BOOST  empty: close calls and bridges fill it`:e.boost>.6?`BOOST  hold SHIFT`:`BOOST`:``,$(`boost-hint`).className=e.boosting?`on`:``;let r=Q.recovery&&e.foundBreakdown&&!e.loaded&&Math.abs(e.s-e.breakdownS)<80,i=e.phase===q.Driving&&!r?Q.nextNote():null;Ky.note.textContent=i?i.text:``,Ky.noteDist.textContent=i?`${Math.round(i.distance*3.28084/10)*10} ft`:e.phase===q.Driving&&Math.abs(e.blow)>.6?e.blow>0?`WIND  →  pushing you right`:`WIND  ←  pushing you left`:``,$(`top`).style.visibility=i||Ky.noteDist.textContent?`visible`:`hidden`,(e.lastCall!==Zy||e.lastCallTime!==Qy)&&(Zy=e.lastCall,Qy=e.lastCallTime,Ky.call.textContent=Xy(e.lastCall,e.lastCallDollars),Ky.call.classList.remove(`pop`),Ky.call.offsetWidth,Ky.call.classList.add(`pop`)),e.time-e.lastCallTime>2.2&&e.phase===q.Driving&&(Ky.call.textContent=``);{let t=$(`prompt`),n=e.phase===q.Driving?ny.scales.find(t=>e.s>t.s-60&&e.s<t.s+t.length+12):void 0;if(n&&!e.weighed&&!e.blewScale){let r=xf(n,e.s,e.lateral),i=Sf(n,e.s,e.lateral),a=Math.abs(e.speed)<.3,o=``,s=``,c=!1,l=-1;i&&a?(o=`WEIGHING  /  hold still`,s=`the scale needs the rig stood still`,c=!0,l=Math.min(1,e.weighClock/2.5)):i?(o=`STOP ON THE PLATE`,s=`brake to a stop between the yellow lines`):r&&e.s<vf(n)?(o=`ONTO THE PLATE AHEAD`,s=`the steel deck between the yellow lines, then stop`):r?(o=`YOU DROVE OFF THE PLATE`,s=`back up onto it, or carry on and take the fine`):(o=`WEIGH STATION  /  pull in on the right`,s=`stop on the plate for ${Jy(2e4)}, or blow past it for a ${Jy(25e3)} fine`),$(`prompt-title`).textContent=o,$(`prompt-title`).className=c?`green`:``,$(`prompt-sub`).textContent=s,$(`prompt-bar`).style.display=l>=0?`block`:`none`,l>=0&&($(`prompt-fill`).style.width=`${Math.round(l*100)}%`),t.style.display=`block`}else n&&e.weighed&&e.s<n.s+n.length+12?($(`prompt-title`).textContent=`WEIGHED  /  all in order`,$(`prompt-title`).className=`green`,$(`prompt-sub`).textContent=`on you go`,$(`prompt-bar`).style.display=`none`,t.style.display=`block`):e.phase!==q.Lifting&&!(Q.recovery&&e.foundBreakdown&&!e.loaded&&e.phase===q.Driving)&&(t.style.display=`none`)}if(Q.recovery&&e.phase===q.Driving&&e.foundBreakdown&&!e.loaded){let t=ih[Q.broken],n=cf(Q.breakdownYaw()),r=Q.breakdownPos(),i={x:r.x+n.x*t.halfLength,y:r.y+n.y*t.halfLength},a=Q.deckTail(),o={x:a.x-i.x,y:a.y-i.y},s=o.x*n.x+o.y*n.y,c=Math.abs(o.x*n.y-o.y*n.x),l=e.trailerYaw-Q.breakdownYaw();for(;l>Math.PI;)l-=2*Math.PI;for(;l<-Math.PI;)l+=2*Math.PI;let u=e=>`${Math.round(e*3.28084/5)*5} ft`,d=Gy?`hold WINCH`:`hold F`,f=Gy?`LEFT / RIGHT`:`A / D`,p=``,m=``,h=!1,g=-1;e.linedUp&&e.winch>0?(p=Math.abs(e.winchSkew)>1?`SCRAPING  /  straighten her`:`WINCHING  /  keep her straight`,m=`${d} and steer ${f} against the drift  ·  ${e.winchSkew>.15?`◀ steer left`:e.winchSkew<-.15?`steer right ▶`:`dead straight`}`,h=Math.abs(e.winchSkew)<=1,g=e.winch):e.linedUp?(p=`LINED UP  /  ${d} to winch`,m=`the deck is down at her nose`,h=!0):s>6.6?(p=`BACK UP  ${u(s)}`,m=Gy?`BRAKE to back up, until the deck's tail is at her nose`:`S or down arrow, until the deck's tail is at her nose`):s<-6.6?(p=`DRIVE PAST HER  ${u(-s)}`,m=`pull onto the shoulder ahead of her, then back the deck up to her nose`):c>3?(p=`GET ONTO THE SHOULDER`,m=`the deck's tail has to be right in front of her`):Math.abs(l)>.5?(p=`STRAIGHTEN THE TRAILER`,m=`${f} while backing, until it points at her`):(p=`STOP THERE`,m=`stopped and in line, the winch is yours`),$(`prompt-title`).textContent=p,$(`prompt-title`).className=h?`green`:Math.abs(e.winchSkew)>1?`red`:``,$(`prompt-sub`).textContent=m,$(`prompt-bar`).style.display=g>=0?`block`:`none`,g>=0&&($(`prompt-fill`).style.width=`${Math.round(g*100)}%`),$(`prompt`).style.display=`block`,$(`prompt`).classList.add(`lift`)}if(e.phase===q.Lifting){let t=$(`prompt`),n=Q.rig.shape,r=e.liftHold>0,i=n===`blade`?`EASE THE ROOT INTO THE RING AND HOLD IT`:n===`rocket`?`STAND IT ON THE RING`:n===`transformer`?`SET IT DOWN AGAINST THE WALL`:n===`house`?`SET IT DOWN AGAINST THE GARAGE`:`SET IT DOWN IN THE BOX`,a=r?th(n)?`BOLTING IT ON  /  hold it there`:`BOLTING IT DOWN`:e.clangCool>0?`CLANG  /  too hard`:e.setDown?`NOT IN THE BOX  /  pick it up (W) and try again`:i;$(`prompt-title`).textContent=a,$(`prompt-title`).className=r?`green`:e.clangCool>0?`red`:``,$(`prompt-sub`).textContent=(Gy?`LEFT / RIGHT swing the crane  ·  GO / BRAKE raise and lower`:`A / D swing the crane  ·  W / S raise and lower`)+(nh(n)?`  ·  the wall stops it: come in slow`:``),$(`prompt-bar`).style.display=`block`,$(`prompt-fill`).style.width=`${Math.round(Math.min(1,e.liftHold/Ym)*100)}%`,t.style.display=`block`,t.classList.add(`lift`)}else Q.recovery&&e.phase===q.Driving&&e.foundBreakdown&&!e.loaded||$(`prompt`).classList.remove(`lift`);if(e.phase===q.Finished&&gb<=3&&(Ky.call.textContent=Xy(e.lastCall,e.lastCallDollars)),Ky.title.style.display=e.phase===q.Ready?`flex`:`none`,document.body.classList.toggle(`ready`,e.phase===q.Ready),Ky.countdown.textContent=e.phase===q.Countdown?String(Math.ceil(e.countdown)):``,e.phase===q.Finished&&(gb>3||$y)){Ky.result.style.display=`flex`,$(`r-head`).textContent=`${ny.name}  /  ${my()}`,$(`r-sub`).textContent=ny.endless?e.caught?`THE STORM HAS YOU`:`THE END OF THE ROAD`:Q.recovery?`RECOVERED`:`DELIVERED`,$(`r-grade`).textContent=Q.grade();let t=e.bonusDollars-e.scaleDollars-e.fallDollars,n=[];e.scaleDollars&&n.push([e.scaleDollars>0?`WEIGHED AT THE SCALE`:`BLEW THE SCALE`,e.scaleDollars]),e.fallDollars&&n.push([`INTO THE GORGE`,e.fallDollars]);let r=Q.recovery?[[`RECOVERY FEE`,Q.recoveryFee()],[`THE CUSTOMER'S CLOCK`,-Math.round(e.towBill)],[`SCRAPES ON HER`,-Math.round(e.busDamage)*2500],[`BONUSES  close calls, jumps, trains`,t],...n,[`DAMAGE TO THE RIG`,-Q.damageCost()]]:ny.endless?[[`${(Math.max(0,e.s-34)/1609).toFixed(2)} MILES AHEAD OF THE STORM`,Q.distancePay()],[`BONUSES  close calls, jumps, trains`,t],...n,[`DAMAGE`,-Q.damageCost()]]:[[`DELIVERY`,Q.rig.basePay],[`BONUSES  close calls, jumps, trains`,t],...n,[`TIME BONUS`,Q.timeBonus()],[e.beatStorm?`BEAT THE STORM   pay x ${lh[e.risk].payScale.toFixed(1)}`:`CAUGHT BY THE STORM`,e.beatStorm?Q.stormBonus():0],[`DAMAGE`,-Q.damageCost()]];e.overshot&&!Q.recovery&&!ny.endless&&(r=[...r,[`OVERSHOT THE BOX`,-1e4]]),$(`r-lines`).innerHTML=r.map(([e,t])=>`<div><span>${e}</span><b>${Jy(t)}</b></div>`).join(``)+`<div class="pay"><span>PAY</span><b>${Jy(Q.pay())}</b></div>`,$(`r-stats`).textContent=`TIME ${Yy(e.time)}      DAMAGE ${Math.round(e.damage)}%      CLOSE CALLS ${e.closeCalls}      HITS ${e.hits}`,document.body.classList.add(`result-up`),ib||(ib=!0,fb(),pb(),mb())}else Ky.result.style.display=`none`,document.body.classList.remove(`result-up`),ib&&(ib=!1,rb=!1,eb.classList.remove(`posted`),eb.querySelector(`button`).textContent=`POST TO THE BOARD`,lb(),$(`r-board`).innerHTML=``)}var gb=0;function _b(){let e=Q.state,t=uy.mark,n=cf(t.yaw),r=Q.rig,i=r.shape===`rocket`?e.loadY+r.loadEnd:e.loadY;return{x:t.x+n.x*e.loadX,y:t.y+n.y*e.loadX,up:t.up+i}}function vb(e){let t=Q.state,n=Q.rig;if(t.phase!==q.Lifting&&t.phase!==q.Finished){gb=0,py.loadFree=!1;return}if(ny.endless||Q.recovery){t.phase===q.Finished&&(gb+=e);return}t.phase===q.Finished&&(gb+=e);let r=uy.mark,i=_b(),a=r.hanging;py.placeLoad(i.x,i.y,a?i.up:i.up-n.underside,r.yaw,a);let o=cf(r.yaw),s=a?0:-(n.loadEnd+1)*.5,c=a?1.4:n.rootThickness+.6,l=t.setDown||t.phase===q.Finished?2.5:0;uy.setHook(i.x+o.x*s,i.y+o.y*s,i.up+c+l),uy.setMark(t.phase===q.Finished||t.liftHold>0?`on`:t.clangCool>0?`clang`:`wait`)}var yb=Q.state.yaw,bb=!1,xb=1,Sb=ny.obstacles.filter(e=>e.solid&&e.height>6&&(e.radius===0||e.radius>3));function Cb(e,t){for(let n of Sb){let r=e.x-n.pos.x,i=e.y-n.pos.y;if(r*r+i*i>3600||n.height+wf(ny,n.pos)<t)continue;if(n.radius>0){if(r*r+i*i<(n.radius+1)**2)return!0;continue}let a=Math.cos(n.yaw),o=Math.sin(n.yaw);if(Math.abs(r*a+i*o)<n.half.x+1&&Math.abs(-r*o+i*a)<n.half.y+1)return!0}return!1}var wb=0,Tb=new z,Eb=new z,Db=!1;function Ob(e){let t=Q.state,n=Q.rig;if((t.phase===q.Lifting||t.phase===q.Finished)&&!t.overshot){let r,i;if(ny.endless||Q.recovery){let e=py.loadCentre(t,Q.rig),n=lf(t.trailerYaw);r=new z(e.x+n.x*26-Math.cos(t.trailerYaw)*8,t.ground+7+gb*.3,e.y+n.y*26-Math.sin(t.trailerYaw)*8),i=new z(e.x,e.up+2,e.y)}else{let e=uy.mark,a=lf(e.yaw),o=cf(e.yaw),s=16+n.loadEnd*(e.hanging?.75:.95)+(n.shape===`blade`?24:0),c=n.shape===`rocket`?n.loadEnd*.3+2:e.hanging?-n.loadEnd*.3:2.5,l=e.hanging?-1:-n.loadEnd*.4;i=new z(e.x+o.x*l,e.up+c,e.y+o.y*l),r=new z(i.x+a.x*s,i.y+(e.hanging?2:11)+gb*.4,i.z+a.y*s);let u=t.lastCall===J.Miss?Math.max(0,1-(t.time-t.lastCallTime)/.45):0,d=Math.max(u*.7,t.inStorm&&t.phase===q.Lifting?.1:0);r.x+=(Math.random()*2-1)*d,r.y+=(Math.random()*2-1)*d,r.z+=(Math.random()*2-1)*d}Db||=(Tb.copy(r),Eb.copy(i),!0),Tb.lerp(r,Math.min(1,e*1.6)),Eb.lerp(i,Math.min(1,e*1.6)),cy.position.copy(Tb),cy.lookAt(Eb),cy.fov=56,cy.updateProjectionMatrix(),oy.position.set(t.hitch.x+ly.sunDir.x*160,t.ground+ly.sunDir.y*160,t.hitch.y+ly.sunDir.z*160),oy.target.position.set(t.hitch.x,t.ground,t.hitch.y),ly.update(e,cy,+!!t.inStorm);return}if(t.phase===q.Ready&&!Ab){wb+=e;let r=Math.PI/2+.7*Math.sin(wb*.12),i=cf(t.yaw),a=lf(t.yaw),o=W(t.hitch,G(i,-(n.loadEnd*.5-3))),s=W(W(o,G(i,Math.cos(r)*(n.loadEnd*.7+16))),G(a,-Math.sin(r)*(n.loadEnd*.8+17)));cy.position.set(s.x,t.ground+6+2*Math.sin(wb*.08),s.y),cy.lookAt(o.x,t.ground+2.2,o.y),cy.fov=46;let c=window.innerWidth,l=window.innerHeight;cy.setViewOffset(Math.round(c*1.36),l,0,0,c,l),cy.updateProjectionMatrix(),oy.position.set(t.hitch.x+ly.sunDir.x*160,t.ground+ly.sunDir.y*160,t.hitch.y+ly.sunDir.z*160),oy.target.position.set(t.hitch.x,t.ground,t.hitch.y),oy.intensity=Sy?.45:2.8,sy.intensity=Sy?.4:.9,uy.lampsOn(Sy),uy.storm.visible=!1,ly.update(e,cy,0);return}if(ey.has(`nostorm`)||(uy.storm.visible=!0),cy.view?.enabled&&cy.clearViewOffset(),Q.recovery&&t.phase===q.Driving&&t.foundBreakdown&&!t.loaded){let r=ih[Q.broken];if(t.s>t.breakdownS+r.halfLength-2&&t.s<t.breakdownS+r.halfLength+n.loadEnd+60){let n=Q.breakdownYaw(),i=cf(n),a=lf(n),o=Q.breakdownPos(),s={x:o.x+i.x*r.halfLength,y:o.y+i.y*r.halfLength},c=Q.deckTail(),l={x:(s.x+c.x)*.5+i.x*4,y:(s.y+c.y)*.5+i.y*4},u=wf(ny,l),d=new z(l.x,u+1,l.y),f=new z(l.x+i.x*6-a.x*18,u+20,l.y+i.y*6-a.y*18);Db||=(Tb.copy(f),Eb.copy(d),!0),Tb.lerp(f,Math.min(1,e*2)),Eb.lerp(d,Math.min(1,e*2)),cy.position.copy(Tb),cy.lookAt(Eb),cy.fov=60,cy.updateProjectionMatrix(),oy.position.set(t.hitch.x+ly.sunDir.x*160,t.ground+ly.sunDir.y*160,t.hitch.y+ly.sunDir.z*160),oy.target.position.set(t.hitch.x,t.ground,t.hitch.y),ly.update(e,cy,+!!t.inStorm);return}}Db=!1;let r=t.yaw;bb||=(yb=r,!0);let i=r-yb;for(;i>Math.PI;)i-=2*Math.PI;for(;i<-Math.PI;)i+=2*Math.PI;yb+=i*Math.min(1,e*3.5);let a=cf(yb),o=9+n.loadEnd*.4,s=15+n.loadEnd,c=1;for(let e=1;e<=12&&c===1;e++){let n=e/12;Cb(tf(t.hitch,G(a,s*n)),t.ground+o*n+1)&&(c=Math.max(.3,(e-1.5)/12))}xb+=(c-xb)*Math.min(1,e*(c<xb?8:1.5));let l=tf(t.hitch,G(a,s*xb)),u=W(t.hitch,G(a,6)),d=0,f=[J.Hit,J.BridgeStrike,J.Jackknife,J.Splash,J.Air].includes(t.lastCall);d=Math.max(f?1.1*Math.max(0,1-(t.time-t.lastCallTime)/.45):0,t.inStorm?.12:0);let p=()=>(Math.random()*2-1)*d,m=Math.max(wf(ny,l),t.ground-4);if(cy.position.set(l.x+p(),m+o*(.55+.45*xb)+p(),l.y+p()),cy.lookAt(u.x,t.ground+1+t.height,u.y),ey.has(`close`)){let e=lf(t.yaw),n=cf(t.yaw);cy.position.set(t.hitch.x+n.x*9+e.x*9,t.ground+2.2,t.hitch.y+n.y*9+e.y*9),cy.lookAt(t.hitch.x+n.x*2.5,t.ground+1.2,t.hitch.y+n.y*2.5)}let h=88+12*Math.min(1,Math.abs(t.speed)/n.boostSpeed)**2;cy.fov=2*Math.atan(Math.tan(h*Math.PI/360)/cy.aspect)*180/Math.PI,cy.updateProjectionMatrix(),oy.position.set(t.hitch.x+ly.sunDir.x*160,t.ground+ly.sunDir.y*160,t.hitch.y+ly.sunDir.z*160),oy.target.position.set(t.hitch.x,t.ground,t.hitch.y);let g=t.phase===q.Driving||t.phase===q.Finished?t.inStorm?1:Math.max(0,1-Q.stormLeadSeconds()/4):0,_=Math.max(g,Sy);ay.fog.color.setRGB(Cy[0]*(1-g)+.22*g,Cy[1]*(1-g)+.22*g,Cy[2]*(1-g)+.28*g),ay.fog.near=(Sy?120:320)-(Sy?60:240)*g,ay.fog.far=(Sy?900:2200)-(Sy?500:1700)*g,g>.6&&(Ey-=e,Ey<=0&&(Ty=1,Ey=4+Math.random()*8)),Ty=Math.max(0,Ty-e*6),oy.intensity=(Sy?.45-.2*g:2.8-2.3*g)+Ty*3,sy.intensity=(Sy?.4-.15*g:.9-.5*g)+Ty*2.5,uy.lampsOn(_),ly.update(e,cy,Math.max(0,g-Ty*.8))}function kb(){let e=window.innerWidth,t=window.innerHeight;iy.setSize(e,t,!1),Dy.setSize(e,t),Oy.resolution.set(e,t),cy.aspect=e/t,cy.updateProjectionMatrix()}window.addEventListener(`resize`,kb),kb();var Ab=ey.has(`auto`);function jb(){return bh(Q)}if(ey.has(`nostorm`)&&(uy.storm.visible=!1,Q.noStorm=!0),ey.has(`debug`)&&(window.hh={run:Q,drive:bh,Phase:q}),ey.has(`noground`)&&(uy.ground.visible=!1),ey.has(`gy`)&&(uy.ground.position.y=Number(ey.get(`gy`))),Ab){Q.start();let e=Number(ey.get(`t`)??0);for(let t=0;t<e;t+=1/120)Q.step(jb(),1/120);let t=Number(ey.get(`s`)??-1);for(let e=0;t>0&&Q.state.s<t&&e<900;e+=1/120)Q.step(jb(),1/120);let n=Number(ey.get(`lift`)??-1);for(let e=0;n>=0&&Q.state.phase!==q.Finished&&Q.state.liftClock<n&&e<900;e+=1/120)Q.step(jb(),1/120)}var Mb=1/120,Nb=performance.now(),Pb=0;function Fb(e){let t=Math.min(.1,(e-Nb)/1e3);Nb=e;let n=Ab?jb():Hy();Gy&&(n.steer=n.steer||Uy.steer,n.throttle=Math.max(n.throttle,Uy.throttle),n.brake=Math.max(n.brake,Uy.brake),n.duck=n.duck||Uy.duck,n.boost=n.boost||Uy.boost,n.fix=n.fix||Uy.fix);let r=Q.state;for(r.phase===q.Ready&&(n.throttle>0||Py)&&(Q.start(),jy(),ky.go(),By&&ky.onSong?.(By),Q.recovery&&setTimeout(()=>ky.say(`dispatch`,3),1800)),r.phase===q.Finished&&Py&&(gb>3||$y||Fy?(Q.reset(),py.resetRecovery(),bb=!1,$y=!1):$y=!0),r.phase!==q.Finished&&($y=!1),Py=!1,Fy=!1,Pb+=t;Pb>=Mb;)!ey.has(`freeze`)&&!Ny&&Q.step(n,Mb),Pb-=Mb;if(vb(t),py.update(Q.state,Q.rig),Q.recovery){let n=Q.breakdownPos();py.updateRecovery(Q.state,Q.rig,{x:n.x,y:n.y,yaw:Q.breakdownYaw(),ground:wf(ny,n)},t,e/1e3)}uy.update(Q.obstacles,Q.state,t,e/1e3);{let e=Q.state;if([J.Hit,J.BridgeStrike,J.Jackknife,J.Train].includes(e.lastCall)&&e.lastCallTime!==wy){wy=e.lastCallTime;let t=W(e.hitch,G(cf(e.yaw),3)),n;for(let r=0;r<Q.obstacles.length;r++)if(Math.abs(Q.obstacles[r].lastHitTime-e.time)<.05){t=Q.obstacles[r].pos;let e=ny.obstacles[r].color;n=new V(e[0],e[1],e[2]);break}e.lastCall===J.BridgeStrike&&(t=W(e.hitch,G(cf(e.trailerYaw),-6))),xy.knock(t.x,e.lastCall===J.BridgeStrike?4:1,t.y,e.lastCall===J.Hit?1:1.6,n)}let n=W(e.hitch,G(cf(e.trailerYaw),-Q.rig.dollyDist)),r=W(e.hitch,G(cf(e.yaw),4.2));xy.update(t,n.x,n.y,r.x,r.y,e.ground+e.height+3.2,e.offroad,e.speed,e.damage,e.ground)}{let e=ny.crossings.find(e=>Math.abs(e.s-Q.state.s)<140);ky.update(Q,Q.state,t,n.throttle,!!e,e?_f(e,Q.state.time):!1)}Ob(t),hb(),Dy.render(),requestAnimationFrame(Fb)}requestAnimationFrame(Fb);