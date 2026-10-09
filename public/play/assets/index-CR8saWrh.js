(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=1e3,t=1001,n=1002,r=1003,i=1004,a=1005,o=1006,s=1007,c=1008,l=1009,u=1010,d=1011,f=1012,p=1013,m=1014,h=1015,g=1016,_=1017,v=1018,y=1020,b=35902,x=35899,S=1021,C=1022,w=1023,T=1026,E=1027,D=1028,ee=1029,O=1030,k=1031,te=1033,A=33776,j=33777,M=33778,ne=33779,N=35840,re=35841,ie=35842,ae=35843,oe=36196,se=37492,ce=37496,le=37488,P=37489,ue=37490,de=37491,fe=37808,pe=37809,me=37810,he=37811,ge=37812,_e=37813,ve=37814,ye=37815,be=37816,xe=37817,Se=37818,Ce=37819,we=37820,Te=37821,Ee=36492,De=36494,Oe=36495,ke=36283,Ae=36284,je=36285,Me=36286,Ne=2300,F=2301,Pe=2302,Fe=2303,Ie=2400,I=2401,Le=2402,Re=3200,ze=`srgb`,Be=`srgb-linear`,Ve=`linear`,He=`srgb`,Ue=7680,We=35044,Ge=2e3;function Ke(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function qe(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function Je(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function Ye(){let e=Je(`canvas`);return e.style.display=`block`,e}var Xe={};function Ze(...e){let t=`THREE.`+e.shift();console.log(t,...e)}function Qe(e){let t=e[0];if(typeof t==`string`&&t.startsWith(`TSL:`)){let t=e[1];t&&t.isStackTrace?e[0]+=` `+t.getLocation():e[1]=`Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`}return e}function L(...e){e=Qe(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function R(...e){e=Qe(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function $e(...e){let t=e.join(` `);t in Xe||(Xe[t]=!0,L(...e))}function et(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var tt={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3},nt=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n!==void 0&&n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},rt=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),it=1234567,at=Math.PI/180,ot=180/Math.PI;function st(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(rt[e&255]+rt[e>>8&255]+rt[e>>16&255]+rt[e>>24&255]+`-`+rt[t&255]+rt[t>>8&255]+`-`+rt[t>>16&15|64]+rt[t>>24&255]+`-`+rt[n&63|128]+rt[n>>8&255]+`-`+rt[n>>16&255]+rt[n>>24&255]+rt[r&255]+rt[r>>8&255]+rt[r>>16&255]+rt[r>>24&255]).toLowerCase()}function ct(e,t,n){return Math.max(t,Math.min(n,e))}function lt(e,t){return(e%t+t)%t}function ut(e,t,n,r,i){return r+(e-t)*(i-r)/(n-t)}function dt(e,t,n){return e===t?0:(n-e)/(t-e)}function ft(e,t,n){return(1-n)*e+n*t}function pt(e,t,n,r){return ft(e,t,1-Math.exp(-n*r))}function mt(e,t=1){return t-Math.abs(lt(e,t*2)-t)}function ht(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*(3-2*e))}function gt(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*e*(e*(e*6-15)+10))}function _t(e,t){return e+Math.floor(Math.random()*(t-e+1))}function vt(e,t){return e+Math.random()*(t-e)}function yt(e){return e*(.5-Math.random())}function bt(e){e!==void 0&&(it=e);let t=it+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function xt(e){return e*at}function St(e){return e*ot}function Ct(e){return e>0&&Number.isInteger(e)&&2**Math.round(Math.log2(e))===e}function wt(e){return 2**Math.ceil(Math.log(e)/Math.LN2)}function Tt(e){return 2**Math.floor(Math.log(e)/Math.LN2)}function Et(e,t,n,r,i){let a=Math.cos,o=Math.sin,s=a(n/2),c=o(n/2),l=a((t+r)/2),u=o((t+r)/2),d=a((t-r)/2),f=o((t-r)/2),p=a((r-t)/2),m=o((r-t)/2);switch(i){case`XYX`:e.set(s*u,c*d,c*f,s*l);break;case`YZY`:e.set(c*f,s*u,c*d,s*l);break;case`ZXZ`:e.set(c*d,c*f,s*u,s*l);break;case`XZX`:e.set(s*u,c*m,c*p,s*l);break;case`YXY`:e.set(c*p,s*u,c*m,s*l);break;case`ZYZ`:e.set(c*m,c*p,s*u,s*l);break;default:L(`MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: `+i)}}function Dt(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:case Uint8ClampedArray:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}function Ot(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}var kt={DEG2RAD:at,RAD2DEG:ot,generateUUID:st,clamp:ct,euclideanModulo:lt,mapLinear:ut,inverseLerp:dt,lerp:ft,damp:pt,pingpong:mt,smoothstep:ht,smootherstep:gt,randInt:_t,randFloat:vt,randFloatSpread:yt,seededRandom:bt,degToRad:xt,radToDeg:St,isPowerOfTwo:Ct,ceilPowerOfTwo:wt,floorPowerOfTwo:Tt,setQuaternionFromProperEuler:Et,normalize:Ot,denormalize:Dt},z=class e{static{e.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`THREE.Vector2: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`THREE.Vector2: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=ct(this.x,e.x,t.x),this.y=ct(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=ct(this.x,e,t),this.y=ct(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ct(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(ct(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},At=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(u!==m||s!==d||c!==f||l!==p){let e=s*d+c*f+l*p+u*m;e<0&&(d=-d,f=-f,p=-p,m=-m,e=-e);let t=1-o;if(e<.9995){let n=Math.acos(e),r=Math.sin(n);t=Math.sin(t*n)/r,o=Math.sin(o*n)/r,s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o}else{s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o;let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:L(`Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ct(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,i=-i,a=-a,o=-o);let s=1-t;if(o<.9995){let e=Math.acos(o),c=Math.sin(e);s=Math.sin(s*e)/c,t=Math.sin(t*e)/c,this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this._onChangeCallback()}else this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},B=class e{static{e.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`THREE.Vector3: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`THREE.Vector3: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Mt.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Mt.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=ct(this.x,e.x,t.x),this.y=ct(this.y,e.y,t.y),this.z=ct(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=ct(this.x,e,t),this.y=ct(this.y,e,t),this.z=ct(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ct(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return jt.copy(this).projectOnVector(e),this.sub(jt)}reflect(e){return this.sub(jt.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(ct(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},jt=new B,Mt=new At,Nt=class e{static{e.prototype.isMatrix3=!0}constructor(e,t,n,r,i,a,o,s,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return $e(`Matrix3: .scale() is deprecated. Use .makeScale() instead.`),this.premultiply(Pt.makeScale(e,t)),this}rotate(e){return $e(`Matrix3: .rotate() is deprecated. Use .makeRotation() instead.`),this.premultiply(Pt.makeRotation(-e)),this}translate(e,t){return $e(`Matrix3: .translate() is deprecated. Use .makeTranslation() instead.`),this.premultiply(Pt.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Pt=new Nt,Ft=new Nt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),It=new Nt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Lt(){let e={enabled:!0,workingColorSpace:Be,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n||(this.spaces[t].transfer===`srgb`&&(e.r=zt(e.r),e.g=zt(e.g),e.b=zt(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=Bt(e.r),e.g=Bt(e.g),e.b=Bt(e.b))),e},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?Ve:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[t].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(t,n){return $e(`ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace().`),e.workingToColorSpace(t,n)},toWorkingColorSpace:function(t,n){return $e(`ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking().`),e.colorSpaceToWorking(t,n)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[Be]:{primaries:t,whitePoint:r,transfer:Ve,toXYZ:Ft,fromXYZ:It,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:ze},outputColorSpaceConfig:{drawingBufferColorSpace:ze}},[ze]:{primaries:t,whitePoint:r,transfer:He,toXYZ:Ft,fromXYZ:It,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:ze}}}),e}var Rt=Lt();function zt(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function Bt(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var Vt,Ht=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Vt===void 0&&(Vt=Je(`canvas`)),Vt.width=e.width,Vt.height=e.height;let t=Vt.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=Vt}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=Je(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=zt(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(zt(t[e]/255)*255):t[e]=zt(t[e]);return{data:t,width:e.width,height:e.height}}return L(`ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},Ut=0,Wt=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Ut++}),this.uuid=st(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<`u`&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t===null?e.set(0,0,0):e.set(t.width,t.height,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(Gt(r[t].image)):e.push(Gt(r[t]))}else e=Gt(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function Gt(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?Ht.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(L(`Texture: Unable to serialize Texture.`),{})}var Kt=0,qt=new B,Jt=class r extends nt{constructor(e=r.DEFAULT_IMAGE,n=r.DEFAULT_MAPPING,i=t,a=t,s=o,u=c,d=w,f=l,p=r.DEFAULT_ANISOTROPY,m=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Kt++}),this.uuid=st(),this.name=``,this.source=new Wt(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=a,this.magFilter=s,this.minFilter=u,this.anisotropy=p,this.format=d,this.internalFormat=null,this.type=f,this.offset=new z(0,0),this.repeat=new z(1,1),this.center=new z(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Nt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=m,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(qt).x}get height(){return this.source.getSize(qt).y}get depth(){return this.source.getSize(qt).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){L(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?L(`Texture.setValues(): property '${t}' does not exist.`):r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(r){if(this.mapping!==300)return r;if(r.applyMatrix3(this.matrix),r.x<0||r.x>1)switch(this.wrapS){case e:r.x-=Math.floor(r.x);break;case t:r.x=r.x<0?0:1;break;case n:Math.abs(Math.floor(r.x)%2)===1?r.x=Math.ceil(r.x)-r.x:r.x-=Math.floor(r.x)}if(r.y<0||r.y>1)switch(this.wrapT){case e:r.y-=Math.floor(r.y);break;case t:r.y=r.y<0?0:1;break;case n:Math.abs(Math.floor(r.y)%2)===1?r.y=Math.ceil(r.y)-r.y:r.y-=Math.floor(r.y)}return this.flipY&&(r.y=1-r.y),r}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Jt.DEFAULT_IMAGE=null,Jt.DEFAULT_MAPPING=300,Jt.DEFAULT_ANISOTROPY=1;var Yt=class e{static{e.prototype.isVector4=!0}constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`THREE.Vector4: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`THREE.Vector4: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=ct(this.x,e.x,t.x),this.y=ct(this.y,e.y,t.y),this.z=ct(this.z,e.z,t.z),this.w=ct(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=ct(this.x,e,t),this.y=ct(this.y,e,t),this.z=ct(this.z,e,t),this.w=ct(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ct(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Xt=class extends nt{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:o,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Yt(0,0,e,t),this.scissorTest=!1,this.viewport=new Yt(0,0,e,t),this.textures=[];let r=new Jt({width:e,height:t,depth:n.depth}),i=n.count;for(let e=0;e<i;e++)this.textures[e]=r.clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:o,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new Wt(n)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null){if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture}return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:`dispose`})}},Zt=class extends Xt{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Qt=class extends Jt{constructor(e=null,n=1,i=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:a},this.magFilter=r,this.minFilter=r,this.wrapR=t,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},$t=class extends Jt{constructor(e=null,n=1,i=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:a},this.magFilter=r,this.minFilter=r,this.wrapR=t,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}},en=class e{static{e.prototype.isMatrix4=!0}constructor(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/tn.setFromMatrixColumn(e,0).length(),i=1/tn.setFromMatrixColumn(e,1).length(),a=1/tn.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(rn,e,an)}lookAt(e,t,n){let r=this.elements;return cn.subVectors(e,t),cn.lengthSq()===0&&(cn.z=1),cn.normalize(),on.crossVectors(n,cn),on.lengthSq()===0&&(Math.abs(n.z)===1?cn.x+=1e-4:cn.z+=1e-4,cn.normalize(),on.crossVectors(n,cn)),on.normalize(),sn.crossVectors(cn,on),r[0]=on.x,r[4]=sn.x,r[8]=cn.x,r[1]=on.y,r[5]=sn.y,r[9]=cn.y,r[2]=on.z,r[6]=sn.z,r[10]=cn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],ee=r[13],O=r[2],k=r[6],te=r[10],A=r[14],j=r[3],M=r[7],ne=r[11],N=r[15];return i[0]=a*x+o*T+s*O+c*j,i[4]=a*S+o*E+s*k+c*M,i[8]=a*C+o*D+s*te+c*ne,i[12]=a*w+o*ee+s*A+c*N,i[1]=l*x+u*T+d*O+f*j,i[5]=l*S+u*E+d*k+f*M,i[9]=l*C+u*D+d*te+f*ne,i[13]=l*w+u*ee+d*A+f*N,i[2]=p*x+m*T+h*O+g*j,i[6]=p*S+m*E+h*k+g*M,i[10]=p*C+m*D+h*te+g*ne,i[14]=p*w+m*ee+h*A+g*N,i[3]=_*x+v*T+y*O+b*j,i[7]=_*S+v*E+y*k+b*M,i[11]=_*C+v*D+y*te+b*ne,i[15]=_*w+v*ee+y*A+b*N,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15],_=s*f-c*d,v=o*f-c*u,y=o*d-s*u,b=a*f-c*l,x=a*d-s*l,S=a*u-o*l;return t*(m*_-h*v+g*y)-n*(p*_-h*b+g*x)+r*(p*v-m*b+g*S)-i*(p*y-m*x+h*S)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[1],a=e[5],o=e[9],s=e[2],c=e[6],l=e[10];return t*(a*l-o*c)-n*(i*l-o*s)+r*(i*c-a*s)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=t*o-n*a,v=t*s-r*a,y=t*c-i*a,b=n*s-r*o,x=n*c-i*o,S=r*c-i*s,C=l*m-u*p,w=l*h-d*p,T=l*g-f*p,E=u*h-d*m,D=u*g-f*m,ee=d*g-f*h,O=_*ee-v*D+y*E+b*T-x*w+S*C;if(O===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let k=1/O;return e[0]=(o*ee-s*D+c*E)*k,e[1]=(r*D-n*ee-i*E)*k,e[2]=(m*S-h*x+g*b)*k,e[3]=(d*x-u*S-f*b)*k,e[4]=(s*T-a*ee-c*w)*k,e[5]=(t*ee-r*T+i*w)*k,e[6]=(h*y-p*S-g*v)*k,e[7]=(l*S-d*y+f*v)*k,e[8]=(a*D-o*T+c*C)*k,e[9]=(n*T-t*D-i*C)*k,e[10]=(p*x-m*y+g*_)*k,e[11]=(u*y-l*x-f*_)*k,e[12]=(o*w-a*E-s*C)*k,e[13]=(t*E-n*w+r*C)*k,e[14]=(m*v-p*b-h*_)*k,e[15]=(l*b-u*v+d*_)*k,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let i=this.determinantAffine();if(i===0)return n.set(1,1,1),t.identity(),this;let a=tn.set(r[0],r[1],r[2]).length(),o=tn.set(r[4],r[5],r[6]).length(),s=tn.set(r[8],r[9],r[10]).length();i<0&&(a=-a),nn.copy(this);let c=1/a,l=1/o,u=1/s;return nn.elements[0]*=c,nn.elements[1]*=c,nn.elements[2]*=c,nn.elements[4]*=l,nn.elements[5]*=l,nn.elements[6]*=l,nn.elements[8]*=u,nn.elements[9]*=u,nn.elements[10]*=u,t.setFromRotationMatrix(nn),n.x=a,n.y=o,n.z=s,this}makePerspective(e,t,n,r,i,a,o=Ge,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=Ge,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},tn=new B,nn=new en,rn=new B(0,0,0),an=new B(1,1,1),on=new B,sn=new B,cn=new B,ln=new en,un=new At,dn=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(ct(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-ct(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(ct(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-ct(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(ct(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-ct(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:L(`Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return ln.makeRotationFromQuaternion(e),this.setFromRotationMatrix(ln,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return un.setFromEuler(this),this.setFromQuaternion(un,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};dn.DEFAULT_ORDER=`XYZ`;var fn=class{constructor(){this.mask=1}set(e){this.mask=1<<e>>>0}enable(e){this.mask|=1<<e}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e}disable(e){this.mask&=~(1<<e)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&1<<e)}},pn=0,mn=new B,hn=new At,gn=new en,_n=new B,vn=new B,yn=new B,bn=new At,xn=new B(1,0,0),Sn=new B(0,1,0),Cn=new B(0,0,1),wn={type:`added`},Tn={type:`removed`},En={type:`childadded`,child:null},Dn={type:`childremoved`,child:null},On=class e extends nt{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:pn++}),this.uuid=st(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new B,n=new dn,r=new At,i=new B(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new en},normalMatrix:{value:new Nt}}),this.matrix=new en,this.matrixWorld=new en,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new fn,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return hn.setFromAxisAngle(e,t),this.quaternion.multiply(hn),this}rotateOnWorldAxis(e,t){return hn.setFromAxisAngle(e,t),this.quaternion.premultiply(hn),this}rotateX(e){return this.rotateOnAxis(xn,e)}rotateY(e){return this.rotateOnAxis(Sn,e)}rotateZ(e){return this.rotateOnAxis(Cn,e)}translateOnAxis(e,t){return mn.copy(e).applyQuaternion(this.quaternion),this.position.add(mn.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(xn,e)}translateY(e){return this.translateOnAxis(Sn,e)}translateZ(e){return this.translateOnAxis(Cn,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(gn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?_n.copy(e):_n.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),vn.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?gn.lookAt(vn,_n,this.up):gn.lookAt(_n,vn,this.up),this.quaternion.setFromRotationMatrix(gn),r&&(gn.extractRotation(r.matrixWorld),hn.setFromRotationMatrix(gn),this.quaternion.premultiply(hn.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(R(`Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(wn),En.child=e,this.dispatchEvent(En),En.child=null):R(`Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Tn),Dn.child=e,this.dispatchEvent(Dn),Dn.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),gn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),gn.multiply(e.parent.matrixWorld)),e.applyMatrix4(gn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(wn),En.child=e,this.dispatchEvent(En),En.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(vn,e,yn),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(vn,bn,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,i=this.matrix.elements;i[12]+=t-i[0]*t-i[4]*n-i[8]*r,i[13]+=n-i[1]*t-i[5]*n-i[9]*r,i[14]+=r-i[2]*t-i[6]*n-i[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let e=this.children;for(let t=0,r=e.length;t<r;t++)e[t].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot===null?null:e.pivot.clone(),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}dispose(){this.dispatchEvent({type:`dispose`})}};On.DEFAULT_UP=new B(0,1,0),On.DEFAULT_MATRIX_AUTO_UPDATE=!0,On.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var kn=class extends On{constructor(){super(),this.isGroup=!0,this.type=`Group`}},An={type:`move`},jn=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new kn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new kn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new B,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new B),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new kn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new B,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new B,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.rotation,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,s.eventsEnabled&&s.dispatchEvent({type:`gripUpdated`,data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(An)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new kn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Mn={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Nn={h:0,s:0,l:0},Pn={h:0,s:0,l:0};function Fn(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var V=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=ze){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Rt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=Rt.workingColorSpace){return this.r=e,this.g=t,this.b=n,Rt.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=Rt.workingColorSpace){if(e=lt(e,1),t=ct(t,0,1),n=ct(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=Fn(i,r,e+1/3),this.g=Fn(i,r,e),this.b=Fn(i,r,e-1/3)}return Rt.colorSpaceToWorking(this,r),this}setStyle(e,t=ze){function n(t){t!==void 0&&parseFloat(t)<1&&L(`Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseInt(i[1],10))/100,Math.min(100,parseInt(i[2],10))/100,Math.min(100,parseInt(i[3],10))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:L(`Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);L(`Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=ze){let n=Mn[e.toLowerCase()];return n===void 0?L(`Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=zt(e.r),this.g=zt(e.g),this.b=zt(e.b),this}copyLinearToSRGB(e){return this.r=Bt(e.r),this.g=Bt(e.g),this.b=Bt(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=ze){return Rt.workingToColorSpace(In.copy(this),e),Math.round(ct(In.r*255,0,255))*65536+Math.round(ct(In.g*255,0,255))*256+Math.round(ct(In.b*255,0,255))}getHexString(e=ze){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Rt.workingColorSpace){Rt.workingToColorSpace(In.copy(this),t);let n=In.r,r=In.g,i=In.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=Rt.workingColorSpace){return Rt.workingToColorSpace(In.copy(this),t),e.r=In.r,e.g=In.g,e.b=In.b,e}getStyle(e=ze){Rt.workingToColorSpace(In.copy(this),e);let t=In.r,n=In.g,r=In.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(Nn),this.setHSL(Nn.h+e,Nn.s+t,Nn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Nn),e.getHSL(Pn);let n=ft(Nn.h,Pn.h,t),r=ft(Nn.s,Pn.s,t),i=ft(Nn.l,Pn.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},In=new V;V.NAMES=Mn;var Ln=class e{constructor(e,t=1,n=1e3){this.isFog=!0,this.name=``,this.color=new V(e),this.near=t,this.far=n}clone(){return new e(this.color,this.near,this.far)}toJSON(){return{type:`Fog`,name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},Rn=class extends On{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new dn,this.environmentIntensity=1,this.environmentRotation=new dn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},zn=new B,Bn=new B,Vn=new B,Hn=new B,Un=new B,Wn=new B,Gn=new B,Kn=new B,qn=new B,Jn=new B,Yn=new Yt,Xn=new Yt,Zn=new Yt,Qn=class e{constructor(e=new B,t=new B,n=new B){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),zn.subVectors(e,t),r.cross(zn);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){zn.subVectors(r,t),Bn.subVectors(n,t),Vn.subVectors(e,t);let a=zn.dot(zn),o=zn.dot(Bn),s=zn.dot(Vn),c=Bn.dot(Bn),l=Bn.dot(Vn),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,Hn)!==null&&Hn.x>=0&&Hn.y>=0&&Hn.x+Hn.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,Hn)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,Hn.x),s.addScaledVector(a,Hn.y),s.addScaledVector(o,Hn.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return Yn.setScalar(0),Xn.setScalar(0),Zn.setScalar(0),Yn.fromBufferAttribute(e,t),Xn.fromBufferAttribute(e,n),Zn.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(Yn,i.x),a.addScaledVector(Xn,i.y),a.addScaledVector(Zn,i.z),a}static isFrontFacing(e,t,n,r){return zn.subVectors(n,t),Bn.subVectors(e,t),zn.cross(Bn).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return zn.subVectors(this.c,this.b),Bn.subVectors(this.a,this.b),zn.cross(Bn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;Un.subVectors(r,n),Wn.subVectors(i,n),Kn.subVectors(e,n);let s=Un.dot(Kn),c=Wn.dot(Kn);if(s<=0&&c<=0)return t.copy(n);qn.subVectors(e,r);let l=Un.dot(qn),u=Wn.dot(qn);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0)return a=s/(s-l),t.copy(n).addScaledVector(Un,a);Jn.subVectors(e,i);let f=Un.dot(Jn),p=Wn.dot(Jn);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(Wn,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return Gn.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(Gn,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(Un,a).addScaledVector(Wn,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},$n=class{constructor(e=new B(1/0,1/0,1/0),t=new B(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(tr.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(tr.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=tr.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,tr):tr.fromBufferAttribute(r,t),tr.applyMatrix4(e.matrixWorld),this.expandByPoint(tr);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),nr.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),nr.copy(e.boundingBox)),nr.applyMatrix4(e.matrixWorld),this.union(nr)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,tr),tr.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(lr),ur.subVectors(this.max,lr),rr.subVectors(e.a,lr),ir.subVectors(e.b,lr),ar.subVectors(e.c,lr),or.subVectors(ir,rr),sr.subVectors(ar,ir),cr.subVectors(rr,ar);let t=[0,-or.z,or.y,0,-sr.z,sr.y,0,-cr.z,cr.y,or.z,0,-or.x,sr.z,0,-sr.x,cr.z,0,-cr.x,-or.y,or.x,0,-sr.y,sr.x,0,-cr.y,cr.x,0];return!pr(t,rr,ir,ar,ur)||(t=[1,0,0,0,1,0,0,0,1],!pr(t,rr,ir,ar,ur))?!1:(dr.crossVectors(or,sr),t=[dr.x,dr.y,dr.z],pr(t,rr,ir,ar,ur))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,tr).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(tr).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||(er[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),er[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),er[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),er[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),er[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),er[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),er[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),er[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(er)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},er=[new B,new B,new B,new B,new B,new B,new B,new B],tr=new B,nr=new $n,rr=new B,ir=new B,ar=new B,or=new B,sr=new B,cr=new B,lr=new B,ur=new B,dr=new B,fr=new B;function pr(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){fr.fromArray(e,a);let o=i.x*Math.abs(fr.x)+i.y*Math.abs(fr.y)+i.z*Math.abs(fr.z),s=t.dot(fr),c=n.dot(fr),l=r.dot(fr);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var mr=new B,hr=new z,gr=0,_r=class extends nt{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:gr++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=We,this.updateRanges=[],this.gpuType=h,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)hr.fromBufferAttribute(this,t),hr.applyMatrix3(e),this.setXY(t,hr.x,hr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)mr.fromBufferAttribute(this,t),mr.applyMatrix3(e),this.setXYZ(t,mr.x,mr.y,mr.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)mr.fromBufferAttribute(this,t),mr.applyMatrix4(e),this.setXYZ(t,mr.x,mr.y,mr.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)mr.fromBufferAttribute(this,t),mr.applyNormalMatrix(e),this.setXYZ(t,mr.x,mr.y,mr.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)mr.fromBufferAttribute(this,t),mr.transformDirection(e),this.setXYZ(t,mr.x,mr.y,mr.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Dt(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Ot(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Dt(t,this.array)),t}setX(e,t){return this.normalized&&(t=Ot(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Dt(t,this.array)),t}setY(e,t){return this.normalized&&(t=Ot(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Dt(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Ot(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Dt(t,this.array)),t}setW(e,t){return this.normalized&&(t=Ot(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Ot(t,this.array),n=Ot(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=Ot(t,this.array),n=Ot(n,this.array),r=Ot(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=Ot(t,this.array),n=Ot(n,this.array),r=Ot(r,this.array),i=Ot(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:`dispose`})}},vr=class extends _r{constructor(e,t,n){super(new Uint16Array(e),t,n)}},yr=class extends _r{constructor(e,t,n){super(new Uint32Array(e),t,n)}},br=class extends _r{constructor(e,t,n){super(new Float32Array(e),t,n)}},xr=new $n,Sr=new B,Cr=new B,wr=class{constructor(e=new B,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?xr.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Sr.subVectors(e,this.center);let t=Sr.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(Sr,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Cr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Sr.copy(e.center).add(Cr)),this.expandByPoint(Sr.copy(e.center).sub(Cr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Tr=0,Er=new en,Dr=new On,Or=new B,kr=new $n,Ar=new $n,jr=new B,Mr=class e extends nt{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Tr++}),this.uuid=st(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(Ke(e)?yr:vr)(e,1):e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new Nt().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Er.makeRotationFromQuaternion(e),this.applyMatrix4(Er),this}rotateX(e){return Er.makeRotationX(e),this.applyMatrix4(Er),this}rotateY(e){return Er.makeRotationY(e),this.applyMatrix4(Er),this}rotateZ(e){return Er.makeRotationZ(e),this.applyMatrix4(Er),this}translate(e,t,n){return Er.makeTranslation(e,t,n),this.applyMatrix4(Er),this}scale(e,t,n){return Er.makeScale(e,t,n),this.applyMatrix4(Er),this}lookAt(e){return Dr.lookAt(e),Dr.updateMatrix(),this.applyMatrix4(Dr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Or).negate(),this.translate(Or.x,Or.y,Or.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new br(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&L(`BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new $n);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)R(`BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new B(-1/0,-1/0,-1/0),new B(1/0,1/0,1/0));else{if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];kr.setFromBufferAttribute(n),this.morphTargetsRelative?(jr.addVectors(this.boundingBox.min,kr.min),this.boundingBox.expandByPoint(jr),jr.addVectors(this.boundingBox.max,kr.max),this.boundingBox.expandByPoint(jr)):(this.boundingBox.expandByPoint(kr.min),this.boundingBox.expandByPoint(kr.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&R(`BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new wr);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)R(`BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new B,1/0);else if(e){let n=this.boundingSphere.center;if(kr.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Ar.setFromBufferAttribute(n),this.morphTargetsRelative?(jr.addVectors(kr.min,Ar.min),kr.expandByPoint(jr),jr.addVectors(kr.max,Ar.max),kr.expandByPoint(jr)):(kr.expandByPoint(Ar.min),kr.expandByPoint(Ar.max))}kr.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)jr.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(jr));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)jr.fromBufferAttribute(a,t),o&&(Or.fromBufferAttribute(e,t),jr.add(Or)),r=Math.max(r,n.distanceToSquared(jr))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&R(`BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){R(`BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv,a=this.getAttribute(`tangent`);(a===void 0||a.count!==n.count)&&(a=new _r(new Float32Array(4*n.count),4),this.setAttribute(`tangent`,a));let o=[],s=[];for(let e=0;e<n.count;e++)o[e]=new B,s[e]=new B;let c=new B,l=new B,u=new B,d=new z,f=new z,p=new z,m=new B,h=new B;function g(e,t,r){c.fromBufferAttribute(n,e),l.fromBufferAttribute(n,t),u.fromBufferAttribute(n,r),d.fromBufferAttribute(i,e),f.fromBufferAttribute(i,t),p.fromBufferAttribute(i,r),l.sub(c),u.sub(c),f.sub(d),p.sub(d);let a=1/(f.x*p.y-p.x*f.y);isFinite(a)&&(m.copy(l).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(a),h.copy(u).multiplyScalar(f.x).addScaledVector(l,-p.x).multiplyScalar(a),o[e].add(m),o[t].add(m),o[r].add(m),s[e].add(h),s[t].add(h),s[r].add(h))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)g(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let v=new B,y=new B,b=new B,x=new B;function S(e){b.fromBufferAttribute(r,e),x.copy(b);let t=o[e];v.copy(t),v.sub(b.multiplyScalar(b.dot(t))).normalize(),y.crossVectors(x,t);let n=y.dot(s[e])<0?-1:1;a.setXYZW(e,v.x,v.y,v.z,n)}for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)S(e.getX(t+0)),S(e.getX(t+1)),S(e.getX(t+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0||n.count!==t.count)n=new _r(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new B,i=new B,a=new B,o=new B,s=new B,c=new B,l=new B,u=new B;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)jr.fromBufferAttribute(e,t),jr.normalize(),e.setXYZ(t,jr.x,jr.y,jr.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new _r(a,r,i)}if(this.index===null)return L(`BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?`BufferGeometry`:this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:`dispose`})}},Nr=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e===void 0?0:e.length/t,this.usage=We,this.updateRanges=[],this.version=0,this.uuid=st()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let r=0,i=this.stride;r<i;r++)this.array[e+r]=t.array[n+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=st()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=st()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}},Pr=new B,Fr=class e{constructor(e,t,n,r=!1){this.isInterleavedBufferAttribute=!0,this.name=``,this.data=e,this.itemSize=t,this.offset=n,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Pr.fromBufferAttribute(this,t),Pr.applyMatrix4(e),this.setXYZ(t,Pr.x,Pr.y,Pr.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Pr.fromBufferAttribute(this,t),Pr.applyNormalMatrix(e),this.setXYZ(t,Pr.x,Pr.y,Pr.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Pr.fromBufferAttribute(this,t),Pr.transformDirection(e),this.setXYZ(t,Pr.x,Pr.y,Pr.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Dt(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Ot(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=Ot(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Ot(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Ot(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Ot(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Dt(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Dt(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Dt(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Dt(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ot(t,this.array),n=Ot(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ot(t,this.array),n=Ot(n,this.array),r=Ot(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ot(t,this.array),n=Ot(n,this.array),r=Ot(r,this.array),i=Ot(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this.data.array[e+3]=i,this}clone(t){if(t===void 0){Ze(`InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.`);let e=[];for(let t=0;t<this.count;t++){let n=t*this.data.stride+this.offset;for(let t=0;t<this.itemSize;t++)e.push(this.data.array[n+t])}return new _r(new this.array.constructor(e),this.itemSize,this.normalized)}return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new e(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Ze(`InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.`);let e=[];for(let t=0;t<this.count;t++){let n=t*this.data.stride+this.offset;for(let t=0;t<this.itemSize;t++)e.push(this.data.array[n+t])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Ir=new B,Lr=new B,Rr=new Nt,zr=class{constructor(e=new B(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=Ir.subVectors(n,t).cross(Lr.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(Ir),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Rr.getNormalMatrix(e),r=this.coplanarPoint(Ir).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},Br=0,Vr=class extends nt{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Br++}),this.uuid=st(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new V(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ue,this.stencilZFail=Ue,this.stencilZPass=Ue,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){L(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?L(`Material: '${t}' is not a property of THREE.${this.type}.`):r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(e=>e.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new V().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(e=>new zr().fromJSON(e))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(this.vertexColors=typeof e.vertexColors==`number`?e.vertexColors>0:e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let t=e.normalScale;Array.isArray(t)===!1&&(t=[t,t]),this.normalScale=new z().fromArray(t)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new z().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},Hr=class extends Vr{constructor(e){super(),this.isSpriteMaterial=!0,this.type=`SpriteMaterial`,this.color=new V(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Ur,Wr=new B,Gr=new B,Kr=new B,qr=new z,Jr=new z,Yr=new en,Xr=new B,Zr=new B,Qr=new B,$r=new z,ei=new z,ti=new z,ni=class extends On{constructor(e=new Hr){if(super(),this.isSprite=!0,this.type=`Sprite`,Ur===void 0){Ur=new Mr;let e=new Nr(new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),5);Ur.setIndex([0,1,2,0,2,3]),Ur.setAttribute(`position`,new Fr(e,3,0,!1)),Ur.setAttribute(`uv`,new Fr(e,2,3,!1))}this.geometry=Ur,this.material=e,this.center=new z(.5,.5),this.count=1}intersectsFrustum(e){return e.intersectsSprite(this)}raycast(e,t){e.camera===null&&R(`Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.`),Gr.setFromMatrixScale(this.matrixWorld),Yr.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Kr.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Gr.multiplyScalar(-Kr.z);let n=this.material.rotation,r,i;n!==0&&(i=Math.cos(n),r=Math.sin(n));let a=this.center;ri(Xr.set(-.5,-.5,0),Kr,a,Gr,r,i),ri(Zr.set(.5,-.5,0),Kr,a,Gr,r,i),ri(Qr.set(.5,.5,0),Kr,a,Gr,r,i),$r.set(0,0),ei.set(1,0),ti.set(1,1);let o=e.ray.intersectTriangle(Xr,Zr,Qr,!1,Wr);if(o===null&&(ri(Zr.set(-.5,.5,0),Kr,a,Gr,r,i),ei.set(0,1),o=e.ray.intersectTriangle(Xr,Qr,Zr,!1,Wr),o===null))return;let s=e.ray.origin.distanceTo(Wr);s<e.near||s>e.far||t.push({distance:s,point:Wr.clone(),uv:Qn.getInterpolation(Wr,Xr,Zr,Qr,$r,ei,ti,new z),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};function ri(e,t,n,r,i,a){qr.subVectors(e,n).addScalar(.5).multiply(r),i===void 0?Jr.copy(qr):(Jr.x=a*qr.x-i*qr.y,Jr.y=i*qr.x+a*qr.y),e.copy(t),e.x+=Jr.x,e.y+=Jr.y,e.applyMatrix4(Yr)}var ii=new B,ai=new B,oi=new B,si=new B,ci=class{constructor(e=new B,t=new B(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ii)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=ii.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ii.copy(this.origin).addScaledVector(this.direction,t),ii.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){ai.copy(e).add(t).multiplyScalar(.5),oi.copy(t).sub(e).normalize(),si.copy(this.origin).sub(ai);let i=e.distanceTo(t)*.5,a=-this.direction.dot(oi),o=si.dot(this.direction),s=-si.dot(oi),c=si.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(ai).addScaledVector(oi,d),f}intersectSphere(e,t){if(e.radius<0)return null;ii.subVectors(e.center,this.origin);let n=ii.dot(this.direction),r=ii.dot(ii)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,ii)!==null}intersectTriangle(e,t,n,r,i){let a=this.origin,o=this.direction,s=o.x,c=o.y,l=o.z,u=e.x-a.x,d=e.y-a.y,f=e.z-a.z,p=t.x-a.x,m=t.y-a.y,h=t.z-a.z,g=n.x-a.x,_=n.y-a.y,v=n.z-a.z,y=Math.abs(s),b=Math.abs(c),x=Math.abs(l),S,C,w,T,E,D,ee,O,k,te,A,j;if(y>=b&&y>=x?(w=s,D=u,k=p,j=g,s>=0?(S=c,C=l,T=d,E=f,ee=m,O=h,te=_,A=v):(S=l,C=c,T=f,E=d,ee=h,O=m,te=v,A=_)):b>=x?(w=c,D=d,k=m,j=_,c>=0?(S=l,C=s,T=f,E=u,ee=h,O=p,te=v,A=g):(S=s,C=l,T=u,E=f,ee=p,O=h,te=g,A=v)):(w=l,D=f,k=h,j=v,l>=0?(S=s,C=c,T=u,E=d,ee=p,O=m,te=g,A=_):(S=c,C=s,T=d,E=u,ee=m,O=p,te=_,A=g)),w===0)return null;let M=S/w,ne=C/w,N=1/w,re=T-M*D,ie=E-ne*D,ae=ee-M*k,oe=O-ne*k,se=te-M*j,ce=A-ne*j,le=se*oe-ce*ae,P=re*ce-ie*se,ue=ae*ie-oe*re;if(r){if(le<0||P<0||ue<0)return null}else if((le<0||P<0||ue<0)&&(le>0||P>0||ue>0))return null;let de=le+P+ue;if(de===0)return null;let fe=N*(le*D+P*k+ue*j);return(de>0?fe<0:fe>0)?null:this.at(fe/de,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},li=class extends Vr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new V(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new dn,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},ui=new en,di=new ci,fi=new wr,pi=new B,mi=new B,hi=new B,gi=new B,_i=new B,vi=new B,yi=new B,bi=new B,H=class extends On{constructor(e=new Mr,t=new li){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){vi.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(_i.fromBufferAttribute(s,e),a?vi.addScaledVector(_i,r):vi.addScaledVector(_i.sub(t),r))}t.add(vi)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),fi.copy(n.boundingSphere),fi.applyMatrix4(i),di.copy(e.ray).recast(e.near),!(fi.containsPoint(di.origin)===!1&&(di.intersectSphere(fi,pi)===null||di.origin.distanceToSquared(pi)>(e.far-e.near)**2))&&(ui.copy(i).invert(),di.copy(e.ray).applyMatrix4(ui),(n.boundingBox===null||di.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,di)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null){if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=Si(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=Si(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}else if(s!==void 0){if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=Si(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=Si(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}}};function xi(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;bi.copy(s),bi.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(bi);return l<n.near||l>n.far?null:{distance:l,point:bi.clone(),object:e}}function Si(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,mi),e.getVertexPosition(c,hi),e.getVertexPosition(l,gi);let u=xi(e,t,n,r,mi,hi,gi,yi);if(u){let e=new B;Qn.getBarycoord(yi,mi,hi,gi,e),i&&(u.uv=Qn.getInterpolatedAttribute(i,s,c,l,e,new z)),a&&(u.uv1=Qn.getInterpolatedAttribute(a,s,c,l,e,new z)),o&&(u.normal=Qn.getInterpolatedAttribute(o,s,c,l,e,new B),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new B,materialIndex:0};Qn.getNormal(mi,hi,gi,t.normal),u.face=t,u.barycoord=e}return u}var Ci=class extends Jt{constructor(e=null,t=1,n=1,i,a,o,s,c,l=r,u=r,d,f){super(null,o,s,c,l,u,i,a,d,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},wi=class extends _r{constructor(e,t,n,r=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Ti=new en,Ei=new en,Di=[],Oi=new $n,ki=new en,Ai=new H,ji=new wr,Mi=class extends H{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new wi(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let e=0;e<n;e++)this.setMatrixAt(e,ki)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new $n),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ti),Oi.copy(e.boundingBox).applyMatrix4(Ti),this.boundingBox.union(Oi)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new wr),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ti),ji.copy(e.boundingSphere).applyMatrix4(Ti),this.boundingSphere.union(ji)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,r=this.morphTexture.source.data.data,i=e*(n.length+1)+1;for(let e=0;e<n.length;e++)n[e]=r[i+e]}raycast(e,t){let n=this.matrixWorld,r=this.count;if(Ai.geometry=this.geometry,Ai.material=this.material,Ai.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ji.copy(this.boundingSphere),ji.applyMatrix4(n),e.ray.intersectsSphere(ji)!==!1))for(let i=0;i<r;i++){this.getMatrixAt(i,Ti),Ei.multiplyMatrices(n,Ti),Ai.matrixWorld=Ei,Ai.raycast(e,Di);for(let e=0,n=Di.length;e<n;e++){let n=Di[e];n.instanceId=i,n.object=this,t.push(n)}Di.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new wi(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new Ci(new Float32Array(r*this.count),r,this.count,D,h));let i=this.morphTexture.source.data.data,a=0;for(let e=0;e<n.length;e++)a+=n[e];let o=this.geometry.morphTargetsRelative?1:1-a,s=r*e;return i[s]=o,i.set(n,s+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Ni=new wr,Pi=new z(.5,.5),Fi=new B,Ii=class{constructor(e=new zr,t=new zr,n=new zr,r=new zr,i=new zr,a=new zr){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Ge,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Ni.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Ni.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Ni)}intersectsSprite(e){return Ni.center.set(0,0,0),Ni.radius=.7071067811865476+Pi.distanceTo(e.center),Ni.applyMatrix4(e.matrixWorld),this.intersectsSphere(Ni)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(Fi.x=r.normal.x>0?e.max.x:e.min.x,Fi.y=r.normal.y>0?e.max.y:e.min.y,Fi.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Fi)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},Li=class extends Vr{constructor(e){super(),this.isLineBasicMaterial=!0,this.type=`LineBasicMaterial`,this.color=new V(16777215),this.map=null,this.linewidth=1,this.linecap=`round`,this.linejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Ri=new B,zi=new B,Bi=new en,Vi=new ci,Hi=new wr,Ui=new B,Wi=new B,Gi=class extends On{constructor(e=new Mr,t=new Li){super(),this.isLine=!0,this.type=`Line`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let e=1,r=t.count;e<r;e++)Ri.fromBufferAttribute(t,e-1),zi.fromBufferAttribute(t,e),n[e]=n[e-1],n[e]+=Ri.distanceTo(zi);e.setAttribute(`lineDistance`,new br(n,1))}else L(`Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.`);return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Hi.copy(n.boundingSphere),Hi.applyMatrix4(r),Hi.radius+=i,e.ray.intersectsSphere(Hi)===!1)return;Bi.copy(r).invert(),Vi.copy(e.ray).applyMatrix4(Bi);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=this.isLineSegments?2:1,l=n.index,u=n.attributes.position;if(l!==null){let n=Math.max(0,a.start),r=Math.min(l.count,a.start+a.count);for(let i=n,a=r-1;i<a;i+=c){let n=l.getX(i),r=l.getX(i+1),a=Ki(this,e,Vi,s,n,r,i);a&&t.push(a)}if(this.isLineLoop){let i=l.getX(r-1),a=l.getX(n),o=Ki(this,e,Vi,s,i,a,r-1);o&&t.push(o)}}else{let n=Math.max(0,a.start),r=Math.min(u.count,a.start+a.count);for(let i=n,a=r-1;i<a;i+=c){let n=Ki(this,e,Vi,s,i,i+1,i);n&&t.push(n)}if(this.isLineLoop){let i=Ki(this,e,Vi,s,r-1,n,r-1);i&&t.push(i)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}};function Ki(e,t,n,r,i,a,o){let s=e.geometry.attributes.position;if(Ri.fromBufferAttribute(s,i),zi.fromBufferAttribute(s,a),n.distanceSqToSegment(Ri,zi,Ui,Wi)>r)return;Ui.applyMatrix4(e.matrixWorld);let c=t.ray.origin.distanceTo(Ui);if(!(c<t.near||c>t.far))return{distance:c,point:Wi.clone().applyMatrix4(e.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:e}}var qi=new B,Ji=new B,Yi=class extends Gi{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type=`LineSegments`}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let e=0,r=t.count;e<r;e+=2)qi.fromBufferAttribute(t,e),Ji.fromBufferAttribute(t,e+1),n[e]=e===0?0:n[e-1],n[e+1]=n[e]+qi.distanceTo(Ji);e.setAttribute(`lineDistance`,new br(n,1))}else L(`LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.`);return this}},Xi=class extends Jt{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Zi=class extends Jt{constructor(e,t,n,r,i,a,o,s,c){super(e,t,n,r,i,a,o,s,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},Qi=class extends Jt{constructor(e,t,n=m,i,a,o,s=r,c=r,l,u=T,d=1){if(u!==1026&&u!==1027)throw Error(`THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:d},i,a,o,s,c,u,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Wt(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},$i=class extends Qi{constructor(e,t=m,n=301,i,a,o=r,s=r,c,l=T){let u={width:e,height:e,depth:1},d=[u,u,u,u,u,u];super(e,e,t,n,i,a,o,s,c,l),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},ea=class extends Jt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},ta=class e extends Mr{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new br(c,3)),this.setAttribute(`normal`,new br(l,3)),this.setAttribute(`uv`,new br(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new B;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},na=class e extends Mr{constructor(e=1,t=1,n=1,r=32,i=1,a=!1,o=0,s=Math.PI*2){super(),this.type=`CylinderGeometry`,this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:i,openEnded:a,thetaStart:o,thetaLength:s};let c=this;r=Math.floor(r),i=Math.floor(i);let l=[],u=[],d=[],f=[],p=0,m=[],h=n/2,g=0;_(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute(`position`,new br(u,3)),this.setAttribute(`normal`,new br(d,3)),this.setAttribute(`uv`,new br(f,2));function _(){let a=new B,_=new B,v=0,y=(t-e)/n;for(let c=0;c<=i;c++){let l=[],g=c/i,v=g*(t-e)+e;for(let e=0;e<=r;e++){let t=e/r,i=t*s+o,c=Math.sin(i),m=Math.cos(i);_.x=v*c,_.y=-g*n+h,_.z=v*m,u.push(_.x,_.y,_.z),a.set(c,y,m).normalize(),d.push(a.x,a.y,a.z),f.push(t,1-g),l.push(p++)}m.push(l)}for(let n=0;n<r;n++)for(let r=0;r<i;r++){let a=m[r][n],o=m[r+1][n],s=m[r+1][n+1],c=m[r][n+1];(e>0||r!==0)&&(l.push(a,o,c),v+=3),(t>0||r!==i-1)&&(l.push(o,s,c),v+=3)}c.addGroup(g,v,0),g+=v}function v(n){let i=p,a=new z,m=new B,_=0,v=n===!0?e:t,y=n===!0?1:-1;for(let e=1;e<=r;e++)u.push(0,h*y,0),d.push(0,y,0),f.push(.5,.5),p++;let b=p;for(let e=0;e<=r;e++){let t=e/r*s+o,n=Math.cos(t),i=Math.sin(t);m.x=v*i,m.y=h*y,m.z=v*n,u.push(m.x,m.y,m.z),d.push(0,y,0),a.x=n*.5+.5,a.y=i*.5*y+.5,f.push(a.x,a.y),p++}for(let e=0;e<r;e++){let t=i+e,r=b+e;n===!0?l.push(r,r+1,t):l.push(r+1,r,t),_+=3}c.addGroup(g,_,n===!0?1:2),g+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},ra=class e extends na{constructor(e=1,t=1,n=32,r=1,i=!1,a=0,o=Math.PI*2){super(0,e,t,n,r,i,a,o),this.type=`ConeGeometry`,this.parameters={radius:e,height:t,radialSegments:n,heightSegments:r,openEnded:i,thetaStart:a,thetaLength:o}}static fromJSON(t){return new e(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},ia=class e extends Mr{constructor(e=[],t=[],n=1,r=0){super(),this.type=`PolyhedronGeometry`,this.parameters={vertices:e,indices:t,radius:n,detail:r};let i=[],a=[];o(r),c(n),l(),this.setAttribute(`position`,new br(i,3)),this.setAttribute(`normal`,new br(i.slice(),3)),this.setAttribute(`uv`,new br(a,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function o(e){let n=new B,r=new B,i=new B;for(let a=0;a<t.length;a+=3)f(t[a+0],n),f(t[a+1],r),f(t[a+2],i),s(n,r,i,e)}function s(e,t,n,r){let i=r+1,a=[];for(let r=0;r<=i;r++){a[r]=[];let o=e.clone().lerp(n,r/i),s=t.clone().lerp(n,r/i),c=i-r;for(let e=0;e<=c;e++)e===0&&r===i?a[r][e]=o:a[r][e]=o.clone().lerp(s,e/c)}for(let e=0;e<i;e++)for(let t=0;t<2*(i-e)-1;t++){let n=Math.floor(t/2);t%2==0?(d(a[e][n+1]),d(a[e+1][n]),d(a[e][n])):(d(a[e][n+1]),d(a[e+1][n+1]),d(a[e+1][n]))}}function c(e){let t=new B;for(let n=0;n<i.length;n+=3)t.x=i[n+0],t.y=i[n+1],t.z=i[n+2],t.normalize().multiplyScalar(e),i[n+0]=t.x,i[n+1]=t.y,i[n+2]=t.z}function l(){let e=new B;for(let t=0;t<i.length;t+=3){e.x=i[t+0],e.y=i[t+1],e.z=i[t+2];let n=h(e)/2/Math.PI+.5,r=g(e)/Math.PI+.5;a.push(n,1-r)}p(),u()}function u(){for(let e=0;e<a.length;e+=6){let t=a[e+0],n=a[e+2],r=a[e+4];Math.max(t,n,r)>.9&&Math.min(t,n,r)<.1&&(t<.2&&(a[e+0]+=1),n<.2&&(a[e+2]+=1),r<.2&&(a[e+4]+=1))}}function d(e){i.push(e.x,e.y,e.z)}function f(t,n){let r=t*3;n.x=e[r+0],n.y=e[r+1],n.z=e[r+2]}function p(){let e=new B,t=new B,n=new B,r=new B,o=new z,s=new z,c=new z;for(let l=0,u=0;l<i.length;l+=9,u+=6){e.set(i[l+0],i[l+1],i[l+2]),t.set(i[l+3],i[l+4],i[l+5]),n.set(i[l+6],i[l+7],i[l+8]),o.set(a[u+0],a[u+1]),s.set(a[u+2],a[u+3]),c.set(a[u+4],a[u+5]),r.copy(e).add(t).add(n).divideScalar(3);let d=h(r);m(o,u+0,e,d),m(s,u+2,t,d),m(c,u+4,n,d)}}function m(e,t,n,r){r<0&&e.x===1&&(a[t]=e.x-1),n.x===0&&n.z===0&&(a[t]=r/2/Math.PI+.5)}function h(e){return Math.atan2(e.z,-e.x)}function g(e){return Math.atan2(-e.y,Math.sqrt(e.x*e.x+e.z*e.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.vertices,t.indices,t.radius,t.detail)}},aa=class{constructor(){this.type=`Curve`,this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){L(`Curve: .getPoint() not implemented.`)}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,r=this.getPoint(0),i=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),i+=n.distanceTo(r),t.push(i),r=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),r=0,i=n.length,a;a=t||e*n[i-1];let o=0,s=i-1,c;for(;o<=s;)if(r=Math.floor(o+(s-o)/2),c=n[r]-a,c<0)o=r+1;else if(c>0)s=r-1;else{s=r;break}if(r=s,n[r]===a)return r/(i-1);let l=n[r],u=n[r+1]-l,d=(a-l)/u;return(r+d)/(i-1)}getTangent(e,t){let n=1e-4,r=e-n,i=e+n;r<0&&(r=0),i>1&&(i=1);let a=this.getPoint(r),o=this.getPoint(i),s=t||(a.isVector2?new z:new B);return s.copy(o).sub(a).normalize(),s}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new B,r=[],i=[],a=[],o=new B,s=new en;for(let t=0;t<=e;t++){let n=t/e;r[t]=this.getTangentAt(n,new B)}i[0]=new B,a[0]=new B;let c=Number.MAX_VALUE,l=Math.abs(r[0].x),u=Math.abs(r[0].y),d=Math.abs(r[0].z);l<=c&&(c=l,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(r[0],n).normalize(),i[0].crossVectors(r[0],o),a[0].crossVectors(r[0],i[0]);for(let t=1;t<=e;t++){if(i[t]=i[t-1].clone(),a[t]=a[t-1].clone(),o.crossVectors(r[t-1],r[t]),o.length()>2**-52){o.normalize();let e=Math.acos(ct(r[t-1].dot(r[t]),-1,1));i[t].applyMatrix4(s.makeRotationAxis(o,e))}a[t].crossVectors(r[t],i[t])}if(t===!0){let t=Math.acos(ct(i[0].dot(i[e]),-1,1));t/=e,r[0].dot(o.crossVectors(i[0],i[e]))>0&&(t=-t);for(let n=1;n<=e;n++)i[n].applyMatrix4(s.makeRotationAxis(r[n],t*n)),a[n].crossVectors(r[n],i[n])}return{tangents:r,normals:i,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:`Curve`,generator:`Curve.toJSON`}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},oa=class extends aa{constructor(e=0,t=0,n=1,r=1,i=0,a=Math.PI*2,o=!1,s=0){super(),this.isEllipseCurve=!0,this.type=`EllipseCurve`,this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=r,this.aStartAngle=i,this.aEndAngle=a,this.aClockwise=o,this.aRotation=s}getPoint(e,t=new z){let n=t,r=Math.PI*2,i=this.aEndAngle-this.aStartAngle,a=Math.abs(i)<2**-52;for(;i<0;)i+=r;for(;i>r;)i-=r;i<2**-52&&(i=a?0:r),this.aClockwise===!0&&!a&&(i===r?i=-r:i-=r);let o=this.aStartAngle+e*i,s=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let e=Math.cos(this.aRotation),t=Math.sin(this.aRotation),n=s-this.aX,r=c-this.aY;s=n*e-r*t+this.aX,c=n*t+r*e+this.aY}return n.set(s,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},sa=class extends oa{constructor(e,t,n,r,i,a){super(e,t,n,n,r,i,a),this.isArcCurve=!0,this.type=`ArcCurve`}};function ca(){let e=0,t=0,n=0,r=0;function i(i,a,o,s){e=i,t=o,n=-3*i+3*a-2*o-s,r=2*i-2*a+o+s}return{initCatmullRom:function(e,t,n,r,a){i(t,n,a*(n-e),a*(r-t))},initNonuniformCatmullRom:function(e,t,n,r,a,o,s){let c=(t-e)/a-(n-e)/(a+o)+(n-t)/o,l=(n-t)/o-(r-t)/(o+s)+(r-n)/s;c*=o,l*=o,i(t,n,c,l)},calc:function(i){let a=i*i,o=a*i;return e+t*i+n*a+r*o}}}var la=new B,ua=new B,da=new ca,fa=new ca,pa=new ca,ma=class extends aa{constructor(e=[],t=!1,n=`centripetal`,r=.5){super(),this.isCatmullRomCurve3=!0,this.type=`CatmullRomCurve3`,this.points=e,this.closed=t,this.curveType=n,this.tension=r}getPoint(e,t=new B){let n=t,r=this.points,i=r.length,a=(i-+!this.closed)*e,o=Math.floor(a),s=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/i)+1)*i:s===0&&o===i-1&&(o=i-2,s=1);let c,l;this.closed||o>0?c=r[(o-1)%i]:(ua.subVectors(r[0],r[1]).add(r[0]),c=ua);let u=r[o%i],d=r[(o+1)%i];if(this.closed||o+2<i?l=r[(o+2)%i]:(la.subVectors(r[i-1],r[i-2]).add(r[i-1]),l=la),this.curveType===`centripetal`||this.curveType===`chordal`){let e=this.curveType===`chordal`?.5:.25,t=c.distanceToSquared(u)**+e,n=u.distanceToSquared(d)**+e,r=d.distanceToSquared(l)**+e;n<1e-4&&(n=1),t<1e-4&&(t=n),r<1e-4&&(r=n),da.initNonuniformCatmullRom(c.x,u.x,d.x,l.x,t,n,r),fa.initNonuniformCatmullRom(c.y,u.y,d.y,l.y,t,n,r),pa.initNonuniformCatmullRom(c.z,u.z,d.z,l.z,t,n,r)}else this.curveType===`catmullrom`&&(da.initCatmullRom(c.x,u.x,d.x,l.x,this.tension),fa.initCatmullRom(c.y,u.y,d.y,l.y,this.tension),pa.initCatmullRom(c.z,u.z,d.z,l.z,this.tension));return n.set(da.calc(s),fa.calc(s),pa.calc(s)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new B().fromArray(n))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function ha(e,t,n,r,i){let a=(r-t)*.5,o=(i-n)*.5,s=e*e,c=e*s;return(2*n-2*r+a+o)*c+(-3*n+3*r-2*a-o)*s+a*e+n}function ga(e,t){let n=1-e;return n*n*t}function _a(e,t){return 2*(1-e)*e*t}function va(e,t){return e*e*t}function ya(e,t,n,r){return ga(e,t)+_a(e,n)+va(e,r)}function ba(e,t){let n=1-e;return n*n*n*t}function xa(e,t){let n=1-e;return 3*n*n*e*t}function Sa(e,t){return 3*(1-e)*e*e*t}function Ca(e,t){return e*e*e*t}function wa(e,t,n,r,i){return ba(e,t)+xa(e,n)+Sa(e,r)+Ca(e,i)}var Ta=class extends aa{constructor(e=new z,t=new z,n=new z,r=new z){super(),this.isCubicBezierCurve=!0,this.type=`CubicBezierCurve`,this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new z){let n=t,r=this.v0,i=this.v1,a=this.v2,o=this.v3;return n.set(wa(e,r.x,i.x,a.x,o.x),wa(e,r.y,i.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Ea=class extends aa{constructor(e=new B,t=new B,n=new B,r=new B){super(),this.isCubicBezierCurve3=!0,this.type=`CubicBezierCurve3`,this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new B){let n=t,r=this.v0,i=this.v1,a=this.v2,o=this.v3;return n.set(wa(e,r.x,i.x,a.x,o.x),wa(e,r.y,i.y,a.y,o.y),wa(e,r.z,i.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Da=class extends aa{constructor(e=new z,t=new z){super(),this.isLineCurve=!0,this.type=`LineCurve`,this.v1=e,this.v2=t}getPoint(e,t=new z){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new z){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Oa=class extends aa{constructor(e=new B,t=new B){super(),this.isLineCurve3=!0,this.type=`LineCurve3`,this.v1=e,this.v2=t}getPoint(e,t=new B){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new B){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ka=class extends aa{constructor(e=new z,t=new z,n=new z){super(),this.isQuadraticBezierCurve=!0,this.type=`QuadraticBezierCurve`,this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new z){let n=t,r=this.v0,i=this.v1,a=this.v2;return n.set(ya(e,r.x,i.x,a.x),ya(e,r.y,i.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Aa=class extends aa{constructor(e=new B,t=new B,n=new B){super(),this.isQuadraticBezierCurve3=!0,this.type=`QuadraticBezierCurve3`,this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new B){let n=t,r=this.v0,i=this.v1,a=this.v2;return n.set(ya(e,r.x,i.x,a.x),ya(e,r.y,i.y,a.y),ya(e,r.z,i.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ja=class extends aa{constructor(e=[]){super(),this.isSplineCurve=!0,this.type=`SplineCurve`,this.points=e}getPoint(e,t=new z){let n=t,r=this.points,i=(r.length-1)*e,a=Math.floor(i),o=i-a,s=r[a===0?a:a-1],c=r[a],l=r[a>r.length-2?r.length-1:a+1],u=r[a>r.length-3?r.length-1:a+2];return n.set(ha(o,s.x,c.x,l.x,u.x),ha(o,s.y,c.y,l.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new z().fromArray(n))}return this}},Ma=Object.freeze({__proto__:null,ArcCurve:sa,CatmullRomCurve3:ma,CubicBezierCurve:Ta,CubicBezierCurve3:Ea,EllipseCurve:oa,LineCurve:Da,LineCurve3:Oa,QuadraticBezierCurve:ka,QuadraticBezierCurve3:Aa,SplineCurve:ja}),Na=class extends aa{constructor(){super(),this.type=`CurvePath`,this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?`LineCurve`:`LineCurve3`;this.curves.push(new Ma[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),r=this.getCurveLengths(),i=0;for(;i<r.length;){if(r[i]>=n){let e=r[i]-n,a=this.curves[i],o=a.getLength(),s=o===0?0:1-e/o;return a.getPointAt(s,t)}i++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,r=this.curves.length;n<r;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let r=0,i=this.curves;r<i.length;r++){let a=i[r],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,s=a.getPoints(o);for(let e=0;e<s.length;e++){let r=s[e];n&&n.equals(r)||(t.push(r),n=r)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let n=e.curves[t];this.curves.push(n.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let n=this.curves[t];e.curves.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let n=e.curves[t];this.curves.push(new Ma[n.type]().fromJSON(n))}return this}},Pa=class extends Na{constructor(e){super(),this.type=`Path`,this.currentPoint=new z,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new Da(this.currentPoint.clone(),new z(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,r){let i=new ka(this.currentPoint.clone(),new z(e,t),new z(n,r));return this.curves.push(i),this.currentPoint.set(n,r),this}bezierCurveTo(e,t,n,r,i,a){let o=new Ta(this.currentPoint.clone(),new z(e,t),new z(n,r),new z(i,a));return this.curves.push(o),this.currentPoint.set(i,a),this}splineThru(e){let t=new ja([this.currentPoint.clone()].concat(e));return this.curves.push(t),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,r,i,a){let o=this.currentPoint.x,s=this.currentPoint.y;return this.absarc(e+o,t+s,n,r,i,a),this}absarc(e,t,n,r,i,a){return this.absellipse(e,t,n,n,r,i,a),this}ellipse(e,t,n,r,i,a,o,s){let c=this.currentPoint.x,l=this.currentPoint.y;return this.absellipse(e+c,t+l,n,r,i,a,o,s),this}absellipse(e,t,n,r,i,a,o,s){let c=new oa(e,t,n,r,i,a,o,s);if(this.curves.length>0){let e=c.getPoint(0);e.equals(this.currentPoint)||this.lineTo(e.x,e.y)}this.curves.push(c);let l=c.getPoint(1);return this.currentPoint.copy(l),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},Fa=class extends Pa{constructor(e){super(e),this.uuid=st(),this.type=`Shape`,this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,r=this.holes.length;n<r;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let n=e.holes[t];this.holes.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let n=this.holes[t];e.holes.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let n=e.holes[t];this.holes.push(new Pa().fromJSON(n))}return this}};function Ia(e,t,n=2){let r=t&&t.length,i=r?t[0]*n:e.length,a=La(e,0,i,n,!0),o=[];if(!a||a.next===a.prev)return o;let s,c,l;if(r&&(a=Wa(e,t,a,n)),e.length>80*n){s=e[0],c=e[1];let t=s,r=c;for(let a=n;a<i;a+=n){let n=e[a],i=e[a+1];n<s&&(s=n),i<c&&(c=i),n>t&&(t=n),i>r&&(r=i)}l=Math.max(t-s,r-c),l=l===0?0:32767/l}return za(a,o,n,s,c,l,0),o}function La(e,t,n,r,i){let a;if(i===ho(e,t,n,r)>0)for(let i=t;i<n;i+=r)a=fo(i/r|0,e[i],e[i+1],a);else for(let i=n-r;i>=t;i-=r)a=fo(i/r|0,e[i],e[i+1],a);return a&&ro(a,a.next)&&(po(a),a=a.next),a}function Ra(e,t){if(!e)return e;t||=e;let n=e,r;do if(r=!1,!n.steiner&&(ro(n,n.next)||no(n.prev,n,n.next)===0)){if(po(n),n=t=n.prev,n===n.next)break;r=!0}else n=n.next;while(r||n!==t);return t}function za(e,t,n,r,i,a,o){if(!e)return;!o&&a&&Ya(e,r,i,a);let s=e;for(;e.prev!==e.next;){let c=e.prev,l=e.next;if(a?Va(e,r,i,a):Ba(e))t.push(c.i,e.i,l.i),po(e),e=l.next,s=l.next;else if(e=l,e===s){o?o===1?(e=Ha(Ra(e),t),za(e,t,n,r,i,a,2)):o===2&&Ua(e,t,n,r,i,a):za(Ra(e),t,n,r,i,a,1);break}}}function Ba(e){let t=e.prev,n=e,r=e.next;if(no(t,n,r)>=0)return!1;let i=t.x,a=n.x,o=r.x,s=t.y,c=n.y,l=r.y,u=Math.min(i,a,o),d=Math.min(s,c,l),f=Math.max(i,a,o),p=Math.max(s,c,l),m=r.next;for(;m!==t;){if(m.x>=u&&m.x<=f&&m.y>=d&&m.y<=p&&eo(i,s,a,c,o,l,m.x,m.y)&&no(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function Va(e,t,n,r){let i=e.prev,a=e,o=e.next;if(no(i,a,o)>=0)return!1;let s=i.x,c=a.x,l=o.x,u=i.y,d=a.y,f=o.y,p=Math.min(s,c,l),m=Math.min(u,d,f),h=Math.max(s,c,l),g=Math.max(u,d,f),_=Za(p,m,t,n,r),v=Za(h,g,t,n,r),y=e.prevZ,b=e.nextZ;for(;y&&y.z>=_&&b&&b.z<=v;){if(y.x>=p&&y.x<=h&&y.y>=m&&y.y<=g&&y!==i&&y!==o&&eo(s,u,c,d,l,f,y.x,y.y)&&no(y.prev,y,y.next)>=0||(y=y.prevZ,b.x>=p&&b.x<=h&&b.y>=m&&b.y<=g&&b!==i&&b!==o&&eo(s,u,c,d,l,f,b.x,b.y)&&no(b.prev,b,b.next)>=0))return!1;b=b.nextZ}for(;y&&y.z>=_;){if(y.x>=p&&y.x<=h&&y.y>=m&&y.y<=g&&y!==i&&y!==o&&eo(s,u,c,d,l,f,y.x,y.y)&&no(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;b&&b.z<=v;){if(b.x>=p&&b.x<=h&&b.y>=m&&b.y<=g&&b!==i&&b!==o&&eo(s,u,c,d,l,f,b.x,b.y)&&no(b.prev,b,b.next)>=0)return!1;b=b.nextZ}return!0}function Ha(e,t){let n=e;do{let r=n.prev,i=n.next.next;!ro(r,i)&&io(r,n,n.next,i)&&co(r,i)&&co(i,r)&&(t.push(r.i,n.i,i.i),po(n),po(n.next),n=e=i),n=n.next}while(n!==e);return Ra(n)}function Ua(e,t,n,r,i,a){let o=e;do{let e=o.next.next;for(;e!==o.prev;){if(o.i!==e.i&&to(o,e)){let s=uo(o,e);o=Ra(o,o.next),s=Ra(s,s.next),za(o,t,n,r,i,a,0),za(s,t,n,r,i,a,0);return}e=e.next}o=o.next}while(o!==e)}function Wa(e,t,n,r){let i=[];for(let n=0,a=t.length;n<a;n++){let o=La(e,t[n]*r,n<a-1?t[n+1]*r:e.length,r,!1);o===o.next&&(o.steiner=!0),i.push(Qa(o))}i.sort(Ga);for(let e=0;e<i.length;e++)n=Ka(i[e],n);return n}function Ga(e,t){let n=e.x-t.x;return n===0&&(n=e.y-t.y,n===0&&(n=(e.next.y-e.y)/(e.next.x-e.x)-(t.next.y-t.y)/(t.next.x-t.x))),n}function Ka(e,t){let n=qa(e,t);if(!n)return t;let r=uo(n,e);return Ra(r,r.next),Ra(n,n.next)}function qa(e,t){let n=t,r=e.x,i=e.y,a=-1/0,o;if(ro(e,n))return n;do{if(ro(e,n.next))return n.next;if(i<=n.y&&i>=n.next.y&&n.next.y!==n.y){let e=n.x+(i-n.y)*(n.next.x-n.x)/(n.next.y-n.y);if(e<=r&&e>a&&(a=e,o=n.x<n.next.x?n:n.next,e===r))return o}n=n.next}while(n!==t);if(!o)return null;let s=o,c=o.x,l=o.y,u=1/0;n=o;do{if(r>=n.x&&n.x>=c&&r!==n.x&&$a(i<l?r:a,i,c,l,i<l?a:r,i,n.x,n.y)){let t=Math.abs(i-n.y)/(r-n.x);co(n,e)&&(t<u||t===u&&(n.x>o.x||n.x===o.x&&Ja(o,n)))&&(o=n,u=t)}n=n.next}while(n!==s);return o}function Ja(e,t){return no(e.prev,e,t.prev)<0&&no(t.next,e,e.next)<0}function Ya(e,t,n,r){let i=e;do i.z===0&&(i.z=Za(i.x,i.y,t,n,r)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==e);i.prevZ.nextZ=null,i.prevZ=null,Xa(i)}function Xa(e){let t,n=1;do{let r=e,i;e=null;let a=null;for(t=0;r;){t++;let o=r,s=0;for(let e=0;e<n&&(s++,o=o.nextZ,o);e++);let c=n;for(;s>0||c>0&&o;)s!==0&&(c===0||!o||r.z<=o.z)?(i=r,r=r.nextZ,s--):(i=o,o=o.nextZ,c--),a?a.nextZ=i:e=i,i.prevZ=a,a=i;r=o}a.nextZ=null,n*=2}while(t>1);return e}function Za(e,t,n,r,i){return e=(e-n)*i|0,t=(t-r)*i|0,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,e|t<<1}function Qa(e){let t=e,n=e;do(t.x<n.x||t.x===n.x&&t.y<n.y)&&(n=t),t=t.next;while(t!==e);return n}function $a(e,t,n,r,i,a,o,s){return(i-o)*(t-s)>=(e-o)*(a-s)&&(e-o)*(r-s)>=(n-o)*(t-s)&&(n-o)*(a-s)>=(i-o)*(r-s)}function eo(e,t,n,r,i,a,o,s){return(e!==o||t!==s)&&$a(e,t,n,r,i,a,o,s)}function to(e,t){return e.next.i!==t.i&&e.prev.i!==t.i&&!so(e,t)&&(co(e,t)&&co(t,e)&&lo(e,t)&&(no(e.prev,e,t.prev)||no(e,t.prev,t))||ro(e,t)&&no(e.prev,e,e.next)>0&&no(t.prev,t,t.next)>0)}function no(e,t,n){return(t.y-e.y)*(n.x-t.x)-(t.x-e.x)*(n.y-t.y)}function ro(e,t){return e.x===t.x&&e.y===t.y}function io(e,t,n,r){let i=oo(no(e,t,n)),a=oo(no(e,t,r)),o=oo(no(n,r,e)),s=oo(no(n,r,t));return!!(i!==a&&o!==s||i===0&&ao(e,n,t)||a===0&&ao(e,r,t)||o===0&&ao(n,e,r)||s===0&&ao(n,t,r))}function ao(e,t,n){return t.x<=Math.max(e.x,n.x)&&t.x>=Math.min(e.x,n.x)&&t.y<=Math.max(e.y,n.y)&&t.y>=Math.min(e.y,n.y)}function oo(e){return e>0?1:e<0?-1:0}function so(e,t){let n=e;do{if(n.i!==e.i&&n.next.i!==e.i&&n.i!==t.i&&n.next.i!==t.i&&io(n,n.next,e,t))return!0;n=n.next}while(n!==e);return!1}function co(e,t){return no(e.prev,e,e.next)<0?no(e,t,e.next)>=0&&no(e,e.prev,t)>=0:no(e,t,e.prev)<0||no(e,e.next,t)<0}function lo(e,t){let n=e,r=!1,i=(e.x+t.x)/2,a=(e.y+t.y)/2;do n.y>a!=n.next.y>a&&n.next.y!==n.y&&i<(n.next.x-n.x)*(a-n.y)/(n.next.y-n.y)+n.x&&(r=!r),n=n.next;while(n!==e);return r}function uo(e,t){let n=mo(e.i,e.x,e.y),r=mo(t.i,t.x,t.y),i=e.next,a=t.prev;return e.next=t,t.prev=e,n.next=i,i.prev=n,r.next=n,n.prev=r,a.next=r,r.prev=a,r}function fo(e,t,n,r){let i=mo(e,t,n);return r?(i.next=r.next,i.prev=r,r.next.prev=i,r.next=i):(i.prev=i,i.next=i),i}function po(e){e.next.prev=e.prev,e.prev.next=e.next,e.prevZ&&(e.prevZ.nextZ=e.nextZ),e.nextZ&&(e.nextZ.prevZ=e.prevZ)}function mo(e,t,n){return{i:e,x:t,y:n,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function ho(e,t,n,r){let i=0;for(let a=t,o=n-r;a<n;a+=r)i+=(e[o]-e[a])*(e[a+1]+e[o+1]),o=a;return i}var go=class{static triangulate(e,t,n=2){return Ia(e,t,n)}},_o=class e{static area(e){let t=e.length,n=0;for(let r=t-1,i=0;i<t;r=i++)n+=e[r].x*e[i].y-e[i].x*e[r].y;return n*.5}static isClockWise(t){return e.area(t)<0}static triangulateShape(e,t){let n=[],r=[],i=[];vo(e),yo(n,e);let a=e.length;t.forEach(vo);for(let e=0;e<t.length;e++)r.push(a),a+=t[e].length,yo(n,t[e]);let o=go.triangulate(n,r);for(let e=0;e<o.length;e+=3)i.push(o.slice(e,e+3));return i}};function vo(e){let t=e.length;t>2&&e[t-1].equals(e[0])&&e.pop()}function yo(e,t){for(let n=0;n<t.length;n++)e.push(t[n].x),e.push(t[n].y)}var bo=class e extends Mr{constructor(e=new Fa([new z(.5,.5),new z(-.5,.5),new z(-.5,-.5),new z(.5,-.5)]),t={}){super(),this.type=`ExtrudeGeometry`,this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,r=[],i=[];for(let t=0,n=e.length;t<n;t++){let n=e[t];a(n)}this.setAttribute(`position`,new br(r,3)),this.setAttribute(`uv`,new br(i,2)),this.computeVertexNormals();function a(e){let a=[],o=t.curveSegments===void 0?12:t.curveSegments,s=t.steps===void 0?1:t.steps,c=t.depth===void 0?1:t.depth,l=t.bevelEnabled===void 0||t.bevelEnabled,u=t.bevelThickness===void 0?.2:t.bevelThickness,d=t.bevelSize===void 0?u-.1:t.bevelSize,f=t.bevelOffset===void 0?0:t.bevelOffset,p=t.bevelSegments===void 0?3:t.bevelSegments,m=t.extrudePath,h=t.UVGenerator===void 0?xo:t.UVGenerator,g,_=!1,v,y,b,x;if(m){g=m.getSpacedPoints(s),_=!0,l=!1;let e=m.isCatmullRomCurve3?m.closed:!1;v=m.computeFrenetFrames(s,e),y=new B,b=new B,x=new B}l||(p=0,u=0,d=0,f=0);let S=e.extractPoints(o),C=S.shape,w=S.holes;if(!_o.isClockWise(C)){C=C.reverse();for(let e=0,t=w.length;e<t;e++){let t=w[e];_o.isClockWise(t)&&(w[e]=t.reverse())}}function T(e){let t=e[0];for(let n=1;n<=e.length;n++){let r=n%e.length,i=e[r],a=i.x-t.x,o=i.y-t.y,s=a*a+o*o,c=Math.max(Math.abs(i.x),Math.abs(i.y),Math.abs(t.x),Math.abs(t.y));s<=10000000000000001e-36*c*c?(e.splice(r,1),n--):t=i}}T(C),w.forEach(T);let E=w.length,D=C;for(let e=0;e<E;e++){let t=w[e];C=C.concat(t)}function ee(e,t,n){return t||R(`ExtrudeGeometry: vec does not exist`),e.clone().addScaledVector(t,n)}let O=C.length;function k(e,t,n){let r,i,a,o=e.x-t.x,s=e.y-t.y,c=n.x-e.x,l=n.y-e.y,u=o*o+s*s,d=o*l-s*c;if(Math.abs(d)>2**-52){let d=Math.sqrt(u),f=Math.sqrt(c*c+l*l),p=t.x-s/d,m=t.y+o/d,h=n.x-l/f,g=n.y+c/f,_=((h-p)*l-(g-m)*c)/(o*l-s*c);r=p+o*_-e.x,i=m+s*_-e.y;let v=r*r+i*i;if(v<=2)return new z(r,i);a=Math.sqrt(v/2)}else{let e=!1;o>2**-52?c>2**-52&&(e=!0):o<-(2**-52)?c<-(2**-52)&&(e=!0):Math.sign(s)===Math.sign(l)&&(e=!0),e?(r=-s,i=o,a=Math.sqrt(u)):(r=o,i=s,a=Math.sqrt(u/2))}return new z(r/a,i/a)}let te=[];for(let e=0,t=D.length,n=t-1,r=e+1;e<t;e++,n++,r++)n===t&&(n=0),r===t&&(r=0),te[e]=k(D[e],D[n],D[r]);let A=[],j,M=te.concat();for(let e=0,t=E;e<t;e++){let t=w[e];j=[];for(let e=0,n=t.length,r=n-1,i=e+1;e<n;e++,r++,i++)r===n&&(r=0),i===n&&(i=0),j[e]=k(t[e],t[r],t[i]);A.push(j),M=M.concat(j)}let ne;if(p===0)ne=_o.triangulateShape(D,w);else{let e=[],t=[];for(let n=0;n<p;n++){let r=n/p,i=u*Math.cos(r*Math.PI/2),a=d*Math.sin(r*Math.PI/2)+f;for(let t=0,n=D.length;t<n;t++){let n=ee(D[t],te[t],a);se(n.x,n.y,-i),r===0&&e.push(n)}for(let e=0,n=E;e<n;e++){let n=w[e];j=A[e];let o=[];for(let e=0,t=n.length;e<t;e++){let t=ee(n[e],j[e],a);se(t.x,t.y,-i),r===0&&o.push(t)}r===0&&t.push(o)}}ne=_o.triangulateShape(e,t)}let N=ne.length,re=d+f;for(let e=0;e<O;e++){let t=l?ee(C[e],M[e],re):C[e];_?(b.copy(v.normals[0]).multiplyScalar(t.x),y.copy(v.binormals[0]).multiplyScalar(t.y),x.copy(g[0]).add(b).add(y),se(x.x,x.y,x.z)):se(t.x,t.y,0)}for(let e=1;e<=s;e++)for(let t=0;t<O;t++){let n=l?ee(C[t],M[t],re):C[t];_?(b.copy(v.normals[e]).multiplyScalar(n.x),y.copy(v.binormals[e]).multiplyScalar(n.y),x.copy(g[e]).add(b).add(y),se(x.x,x.y,x.z)):se(n.x,n.y,c/s*e)}for(let e=p-1;e>=0;e--){let t=e/p,n=u*Math.cos(t*Math.PI/2),r=d*Math.sin(t*Math.PI/2)+f;for(let e=0,t=D.length;e<t;e++){let t=ee(D[e],te[e],r);se(t.x,t.y,c+n)}for(let e=0,t=w.length;e<t;e++){let t=w[e];j=A[e];for(let e=0,i=t.length;e<i;e++){let i=ee(t[e],j[e],r);_?se(i.x,i.y+g[s-1].y,g[s-1].x+n):se(i.x,i.y,c+n)}}}ie(),ae();function ie(){let e=r.length/3;if(l){let e=0,t=O*e;for(let e=0;e<N;e++){let n=ne[e];ce(n[2]+t,n[1]+t,n[0]+t)}e=s+p*2,t=O*e;for(let e=0;e<N;e++){let n=ne[e];ce(n[0]+t,n[1]+t,n[2]+t)}}else{for(let e=0;e<N;e++){let t=ne[e];ce(t[2],t[1],t[0])}for(let e=0;e<N;e++){let t=ne[e];ce(t[0]+O*s,t[1]+O*s,t[2]+O*s)}}n.addGroup(e,r.length/3-e,0)}function ae(){let e=r.length/3,t=0;oe(D,t),t+=D.length;for(let e=0,n=w.length;e<n;e++){let n=w[e];oe(n,t),t+=n.length}n.addGroup(e,r.length/3-e,1)}function oe(e,t){let n=e.length;for(;--n>=0;){let r=n,i=n-1;i<0&&(i=e.length-1);for(let e=0,n=s+p*2;e<n;e++){let n=O*e,a=O*(e+1);le(t+r+n,t+i+n,t+i+a,t+r+a)}}}function se(e,t,n){a.push(e),a.push(t),a.push(n)}function ce(e,t,i){P(e),P(t),P(i);let a=r.length/3,o=h.generateTopUV(n,r,a-3,a-2,a-1);ue(o[0]),ue(o[1]),ue(o[2])}function le(e,t,i,a){P(e),P(t),P(a),P(t),P(i),P(a);let o=r.length/3,s=h.generateSideWallUV(n,r,o-6,o-3,o-2,o-1);ue(s[0]),ue(s[1]),ue(s[3]),ue(s[1]),ue(s[2]),ue(s[3])}function P(e){r.push(a[e*3+0]),r.push(a[e*3+1]),r.push(a[e*3+2])}function ue(e){i.push(e.x),i.push(e.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return So(t,n,e)}static fromJSON(t,n){let r=[];for(let e=0,i=t.shapes.length;e<i;e++){let i=n[t.shapes[e]];r.push(i)}let i=t.options.extrudePath;return i!==void 0&&(t.options.extrudePath=new Ma[i.type]().fromJSON(i)),new e(r,t.options)}},xo={generateTopUV:function(e,t,n,r,i){let a=t[n*3],o=t[n*3+1],s=t[r*3],c=t[r*3+1],l=t[i*3],u=t[i*3+1];return[new z(a,o),new z(s,c),new z(l,u)]},generateSideWallUV:function(e,t,n,r,i,a){let o=t[n*3],s=t[n*3+1],c=t[n*3+2],l=t[r*3],u=t[r*3+1],d=t[r*3+2],f=t[i*3],p=t[i*3+1],m=t[i*3+2],h=t[a*3],g=t[a*3+1],_=t[a*3+2];return Math.abs(s-u)<Math.abs(o-l)?[new z(o,1-c),new z(l,1-d),new z(f,1-m),new z(h,1-_)]:[new z(s,1-c),new z(u,1-d),new z(p,1-m),new z(g,1-_)]}};function So(e,t,n){if(n.shapes=[],Array.isArray(e))for(let t=0,r=e.length;t<r;t++){let r=e[t];n.shapes.push(r.uuid)}else n.shapes.push(e.uuid);return n.options=Object.assign({},t),t.extrudePath!==void 0&&(n.options.extrudePath=t.extrudePath.toJSON()),n}var Co=class e extends ia{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,r=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1];super(r,[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],e,t),this.type=`IcosahedronGeometry`,this.parameters={radius:e,detail:t}}static fromJSON(t){return new e(t.radius,t.detail)}},wo=class e extends Mr{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new br(p,3)),this.setAttribute(`normal`,new br(m,3)),this.setAttribute(`uv`,new br(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},To=class e extends Mr{constructor(e=1,t=32,n=16,r=0,i=Math.PI*2,a=0,o=Math.PI){super(),this.type=`SphereGeometry`,this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:i,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let s=Math.min(a+o,Math.PI),c=0,l=[],u=new B,d=new B,f=[],p=[],m=[],h=[];for(let f=0;f<=n;f++){let g=[],_=f/n,v=a+_*o,y=e*Math.cos(v),b=Math.sqrt(e*e-y*y),x=0;f===0&&a===0?x=.5/t:f===n&&s===Math.PI&&(x=-.5/t);for(let e=0;e<=t;e++){let n=e/t,a=r+n*i;u.x=-b*Math.cos(a),u.y=y,u.z=b*Math.sin(a),p.push(u.x,u.y,u.z),d.copy(u).normalize(),m.push(d.x,d.y,d.z),h.push(n+x,1-_),g.push(c++)}l.push(g)}for(let e=0;e<n;e++)for(let r=0;r<t;r++){let t=l[e][r+1],i=l[e][r],o=l[e+1][r],c=l[e+1][r+1];(e!==0||a>0)&&f.push(t,i,c),(e!==n-1||s<Math.PI)&&f.push(i,o,c)}this.setIndex(f),this.setAttribute(`position`,new br(p,3)),this.setAttribute(`normal`,new br(m,3)),this.setAttribute(`uv`,new br(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}},Eo=class e extends Mr{constructor(e=1,t=.4,n=12,r=48,i=Math.PI*2,a=0,o=Math.PI*2){super(),this.type=`TorusGeometry`,this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:r,arc:i,thetaStart:a,thetaLength:o},n=Math.floor(n),r=Math.floor(r);let s=[],c=[],l=[],u=[],d=new B,f=new B,p=new B;for(let s=0;s<=n;s++){let m=a+s/n*o;for(let a=0;a<=r;a++){let o=a/r*i;f.x=(e+t*Math.cos(m))*Math.cos(o),f.y=(e+t*Math.cos(m))*Math.sin(o),f.z=t*Math.sin(m),c.push(f.x,f.y,f.z),d.x=e*Math.cos(o),d.y=e*Math.sin(o),p.subVectors(f,d).normalize(),l.push(p.x,p.y,p.z),u.push(a/r),u.push(s/n)}}for(let e=1;e<=n;e++)for(let t=1;t<=r;t++){let n=(r+1)*e+t-1,i=(r+1)*(e-1)+t-1,a=(r+1)*(e-1)+t,o=(r+1)*e+t;s.push(n,i,o),s.push(i,a,o)}this.setIndex(s),this.setAttribute(`position`,new br(c,3)),this.setAttribute(`normal`,new br(l,3)),this.setAttribute(`uv`,new br(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}};function Do(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];if(ko(i))i.isRenderTargetTexture?(L(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone();else if(Array.isArray(i)){if(ko(i[0])){let e=[];for(let t=0,n=i.length;t<n;t++)e[t]=i[t].clone();t[n][r]=e}else t[n][r]=i.slice()}else t[n][r]=i}}return t}function Oo(e){let t={};for(let n=0;n<e.length;n++){let r=Do(e[n]);for(let e in r)t[e]=r[e]}return t}function ko(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function Ao(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function jo(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Rt.workingColorSpace}var Mo={clone:Do,merge:Oo},No=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Po=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Fo=class extends Vr{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=No,this.fragmentShader=Po,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Do(e.uniforms),this.uniformsGroups=Ao(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case`t`:this.uniforms[n].value=t[r.value]||null;break;case`c`:this.uniforms[n].value=new V().setHex(r.value);break;case`v2`:this.uniforms[n].value=new z().fromArray(r.value);break;case`v3`:this.uniforms[n].value=new B().fromArray(r.value);break;case`v4`:this.uniforms[n].value=new Yt().fromArray(r.value);break;case`m3`:this.uniforms[n].value=new Nt().fromArray(r.value);break;case`m4`:this.uniforms[n].value=new en().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let t in e.extensions)this.extensions[t]=e.extensions[t];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},Io=class extends Fo{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},Lo=class extends Vr{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type=`MeshStandardMaterial`,this.defines={STANDARD:``},this.color=new V(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new V(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new z(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new dn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:``},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Ro=class extends Vr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=Re,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},zo=class extends Vr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Bo(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}function Vo(e){return e!==void 0&&e.inTangents!==void 0&&e.outTangents!==void 0}var Ho=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`THREE.Interpolant: Call to abstract method.`)}intervalChanged_(){}},Uo=class extends Ho{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Ie,endingEnd:Ie}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case I:i=e,o=2*t-n;break;case Le:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case I:a=e,s=2*n-t;break;case Le:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},Wo=class extends Ho{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},Go=class extends Ho{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},Ko=class extends Ho{interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this.inTangents,u=this.outTangents;if(!l||!u){let e=(n-t)/(r-t),l=1-e;for(let t=0;t!==o;++t)i[t]=a[c+t]*l+a[s+t]*e;return i}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let o=a[c+p],m=a[s+p],h=f*d+p*2,g=u[h],_=u[h+1],v=e*d+p*2,y=l[v],b=l[v+1],x=Yo(n,t,g,y,r);i[p]=qo(x,o,_,b,m)}return i}};function qo(e,t,n,r,i){let a=1-e;return a*a*a*t+3*a*a*e*n+3*a*e*e*r+e*e*e*i}function Jo(e,t,n,r,i){let a=1-e;return 3*a*a*(n-t)+6*a*e*(r-n)+3*e*e*(i-r)}function Yo(e,t,n,r,i){let a=(e-t)/(i-t);for(let o=0;o<8;o++){let o=qo(a,t,n,r,i)-e;if(Math.abs(o)<1e-10)break;let s=Jo(a,t,n,r,i);if(Math.abs(s)<1e-10)break;a=Math.max(0,Math.min(1,a-o/s))}return a}var Xo=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=Bo(t,this.TimeBufferType),this.values=Bo(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Bo(e.times,Array),values:Bo(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t),Vo(e.settings)&&(n.settings={inTangents:Bo(e.settings.inTangents,Array),outTangents:Bo(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Go(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Wo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Uo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Ko(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Ne:t=this.InterpolantFactoryMethodDiscrete;break;case F:t=this.InterpolantFactoryMethodLinear;break;case Pe:t=this.InterpolantFactoryMethodSmooth;break;case Fe:t=this.InterpolantFactoryMethodBezier}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return L(`KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ne;case this.InterpolantFactoryMethodLinear:return F;case this.InterpolantFactoryMethodSmooth:return Pe;case this.InterpolantFactoryMethodBezier:return Fe}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e;Vo(this.settings)&&(Zo(this.settings.inTangents,e),Zo(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(R(`KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(R(`KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){R(`KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){R(`KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&qe(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){R(`KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===Pe,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,Vo(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function Zo(e,t){for(let n=0,r=e.length;n!==r;n+=2)e[n]*=t}Xo.prototype.ValueTypeName=``,Xo.prototype.TimeBufferType=Float32Array,Xo.prototype.ValueBufferType=Float32Array,Xo.prototype.DefaultInterpolation=F;var Qo=class extends Xo{constructor(e,t,n){super(e,t,n)}};Qo.prototype.ValueTypeName=`bool`,Qo.prototype.ValueBufferType=Array,Qo.prototype.DefaultInterpolation=Ne,Qo.prototype.InterpolantFactoryMethodLinear=void 0,Qo.prototype.InterpolantFactoryMethodSmooth=void 0;var $o=class extends Xo{constructor(e,t,n,r){super(e,t,n,r)}};$o.prototype.ValueTypeName=`color`;var es=class extends Xo{constructor(e,t,n,r){super(e,t,n,r)}};es.prototype.ValueTypeName=`number`;var ts=class extends Ho{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)At.slerpFlat(i,0,a,c-o,a,c,s);return i}},ns=class extends Xo{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new ts(this.times,this.values,this.getValueSize(),e)}};ns.prototype.ValueTypeName=`quaternion`,ns.prototype.InterpolantFactoryMethodSmooth=void 0;var rs=class extends Xo{constructor(e,t,n){super(e,t,n)}};rs.prototype.ValueTypeName=`string`,rs.prototype.ValueBufferType=Array,rs.prototype.DefaultInterpolation=Ne,rs.prototype.InterpolantFactoryMethodLinear=void 0,rs.prototype.InterpolantFactoryMethodSmooth=void 0;var is=class extends Xo{constructor(e,t,n,r){super(e,t,n,r)}};is.prototype.ValueTypeName=`vector`;var as={enabled:!1,files:{},add:function(e,t){this.enabled!==!1&&(os(e)||(this.files[e]=t))},get:function(e){if(this.enabled!==!1&&!os(e))return this.files[e]},remove:function(e){delete this.files[e]},clear:function(){this.files={}}};function os(e){try{let t=e.slice(e.indexOf(`:`)+1);return new URL(t).protocol===`blob:`}catch{return!1}}var ss=new class{constructor(e,t,n){let r=this,i=!1,a=0,o=0,s,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(e){o++,i===!1&&r.onStart!==void 0&&r.onStart(e,a,o),i=!0},this.itemEnd=function(e){a++,r.onProgress!==void 0&&r.onProgress(e,a,o),a===o&&(i=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(e){r.onError!==void 0&&r.onError(e)},this.resolveURL=function(e){return e=e.normalize(`NFC`),s?s(e):e},this.setURLModifier=function(e){return s=e,this},this.addHandler=function(e,t){return c.push(e,t),this},this.removeHandler=function(e){let t=c.indexOf(e);return t!==-1&&c.splice(t,2),this},this.getHandler=function(e){for(let t=0,n=c.length;t<n;t+=2){let n=c[t],r=c[t+1];if(n.global&&(n.lastIndex=0),n.test(e))return r}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||=new AbortController,this._abortController}},cs=class{constructor(e){this.manager=e===void 0?ss:e,this.crossOrigin=`anonymous`,this.withCredentials=!1,this.path=``,this.resourcePath=``,this.requestHeader={},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(r,i){n.load(e,r,t,i)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};cs.DEFAULT_MATERIAL_NAME=`__DEFAULT`;var ls=new WeakMap,us=class extends cs{constructor(e){super(e)}load(e,t,n,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let i=this,a=as.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)i.manager.itemStart(e),setTimeout(function(){t&&t(a),i.manager.itemEnd(e)},0);else{let e=ls.get(a);e===void 0&&(e=[],ls.set(a,e)),e.push({onLoad:t,onError:r})}return a}let o=Je(`img`);function s(){l(),t&&t(this);let n=ls.get(this)||[];for(let e=0;e<n.length;e++){let t=n[e];t.onLoad&&t.onLoad(this)}ls.delete(this),i.manager.itemEnd(e)}function c(t){l(),r&&r(t),as.remove(`image:${e}`);let n=ls.get(this)||[];for(let e=0;e<n.length;e++){let r=n[e];r.onError&&r.onError(t)}ls.delete(this),i.manager.itemError(e),i.manager.itemEnd(e)}function l(){o.removeEventListener(`load`,s,!1),o.removeEventListener(`error`,c,!1)}return o.addEventListener(`load`,s,!1),o.addEventListener(`error`,c,!1),e.slice(0,5)!==`data:`&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),as.add(`image:${e}`,o),i.manager.itemStart(e),o.src=e,o}},ds=class extends cs{constructor(e){super(e)}load(e,t,n,r){let i=new Jt,a=new us(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(e){i.image=e,i.needsUpdate=!0,t!==void 0&&t(i)},n,r),i}},fs=class extends On{constructor(e,t=1){super(),this.isLight=!0,this.type=`Light`,this.color=new V(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},ps=class extends fs{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type=`HemisphereLight`,this.position.copy(On.DEFAULT_UP),this.updateMatrix(),this.groundColor=new V(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},ms=new en,hs=new B,gs=new B,_s=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new z(512,512),this.mapType=l,this.map=null,this.mapPass=null,this.matrix=new en,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ii,this._frameExtents=new z(1,1),this._viewportCount=1,this._viewports=[new Yt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;hs.setFromMatrixPosition(e.matrixWorld),t.position.copy(hs),gs.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(gs),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,r){ms.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(ms,e.coordinateSystem,e.reversedDepth);let i=this._frameExtents,a=r?r.z/i.x:1,o=r?r.w/i.y:1,s=r?r.x/i.x:0,c=r?r.y/i.y:0;e.coordinateSystem===2001||e.reversedDepth?t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(ms)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},vs=new B,ys=new At,bs=new B,xs=class extends On{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new en,this.projectionMatrix=new en,this.projectionMatrixInverse=new en,this.coordinateSystem=Ge,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(vs,ys,bs),bs.x===1&&bs.y===1&&bs.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(vs,ys,bs.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(vs,ys,bs),bs.x===1&&bs.y===1&&bs.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(vs,ys,bs.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Ss=new B,Cs=new z,ws=new z,Ts=class extends xs{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=ot*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(at*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ot*2*Math.atan(Math.tan(at*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Ss.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Ss.x,Ss.y).multiplyScalar(-e/Ss.z),Ss.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ss.x,Ss.y).multiplyScalar(-e/Ss.z)}getViewSize(e,t){return this.getViewBounds(e,Cs,ws),t.subVectors(ws,Cs)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(at*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Es=class extends _s{constructor(){super(new Ts(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=ot*2*e.angle*this.focus,r=this.mapSize.width/this.mapSize.height*this.aspect,i=e.distance||t.far;(n!==t.fov||r!==t.aspect||i!==t.far)&&(t.fov=n,t.aspect=r,t.far=i,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){let e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}},Ds=class extends fs{constructor(e,t,n=0,r=Math.PI/3,i=0,a=2){super(e,t),this.isSpotLight=!0,this.type=`SpotLight`,this.position.copy(On.DEFAULT_UP),this.updateMatrix(),this.target=new On,this.distance=n,this.angle=r,this.penumbra=i,this.decay=a,this.map=null,this.shadow=new Es}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}},Os=class extends xs{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},ks=class extends _s{constructor(){super(new Os(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},As=class extends fs{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type=`DirectionalLight`,this.position.copy(On.DEFAULT_UP),this.updateMatrix(),this.target=new On,this.shadow=new ks}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},js=-90,Ms=1,Ns=class extends On{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new Ts(js,Ms,e,t);r.layers=this.layers,this.add(r);let i=new Ts(js,Ms,e,t);i.layers=this.layers,this.add(i);let a=new Ts(js,Ms,e,t);a.layers=this.layers,this.add(a);let o=new Ts(js,Ms,e,t);o.layers=this.layers,this.add(o);let s=new Ts(js,Ms,e,t);s.layers=this.layers,this.add(s);let c=new Ts(js,Ms,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let h=!1;h=e.isWebGLRenderer===!0?e.state.buffers.depth.getReversed():e.reversedDepthBuffer,e.setRenderTarget(n,0,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,i),e.setRenderTarget(n,1,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,4,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=m,e.setRenderTarget(n,5,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},Ps=class extends Ts{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},Fs=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=Is.bind(this),e.addEventListener(`visibilitychange`,this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener(`visibilitychange`,this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e===void 0?performance.now():e)-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function Is(){this._document.hidden===!1&&this.reset()}var Ls=`\\[\\]\\.:\\/`,Rs=RegExp(`[\\[\\]\\.:\\/]`,`g`),zs=`[^\\[\\]\\.:\\/]`,Bs=`[^`+Ls.replace(`\\.`,``)+`]`,Vs=`((?:WC+[\\/:])*)`.replace(`WC`,zs),Hs=`(WCOD+)?`.replace(`WCOD`,Bs),Us=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,zs),Ws=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,zs),Gs=RegExp(`^`+Vs+Hs+Us+Ws+`$`),Ks=[`material`,`materials`,`bones`,`map`],qs=class{constructor(e,t,n){let r=n||Js.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Js=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(Rs,``)}static parseTrackName(e){let t=Gs.exec(e);if(t===null)throw Error(`THREE.PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);Ks.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`THREE.PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){L(`PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){R(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){R(`PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){R(`PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){R(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){R(`PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){R(`PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){R(`PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;R(`PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){R(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){R(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Js.Composite=qs,Js.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},Js.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},Js.prototype.GetterByBindingType=[Js.prototype._getValue_direct,Js.prototype._getValue_array,Js.prototype._getValue_arrayElement,Js.prototype._getValue_toArray],Js.prototype.SetterByBindingTypeAndVersioning=[[Js.prototype._setValue_direct,Js.prototype._setValue_direct_setNeedsUpdate,Js.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Js.prototype._setValue_array,Js.prototype._setValue_array_setNeedsUpdate,Js.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Js.prototype._setValue_arrayElement,Js.prototype._setValue_arrayElement_setNeedsUpdate,Js.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Js.prototype._setValue_fromArray,Js.prototype._setValue_fromArray_setNeedsUpdate,Js.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]],class e{static{e.prototype.isMatrix2=!0}constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let i=this.elements;return i[0]=e,i[2]=t,i[1]=n,i[3]=r,this}};function Ys(e,t,n,r){let i=Xs(r);switch(n){case S:return e*t;case D:return e*t/i.components*i.byteLength;case ee:return e*t/i.components*i.byteLength;case O:return e*t*2/i.components*i.byteLength;case k:return e*t*2/i.components*i.byteLength;case C:return e*t*3/i.components*i.byteLength;case w:return e*t*4/i.components*i.byteLength;case te:return e*t*4/i.components*i.byteLength;case A:case j:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case M:case ne:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case re:case ae:return Math.max(e,16)*Math.max(t,8)/4;case N:case ie:return Math.max(e,8)*Math.max(t,8)/2;case oe:case se:case le:case P:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case ce:case ue:case de:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case fe:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case pe:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case me:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case he:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case ge:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case _e:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case ve:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case ye:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case be:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case xe:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case Se:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case Ce:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case we:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case Te:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case Ee:case De:case Oe:return Math.ceil(e/4)*Math.ceil(t/4)*16;case ke:case Ae:return Math.ceil(e/4)*Math.ceil(t/4)*8;case je:case Me:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function Xs(e){switch(e){case l:case u:return{byteLength:1,components:1};case f:case d:case g:return{byteLength:2,components:1};case _:case v:return{byteLength:2,components:4};case m:case p:case h:return{byteLength:4,components:1};case b:case x:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`186`}})),typeof window<`u`&&(window.__THREE__?L(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`186`);function Zs(){let e=null,t=!1,n=null,r=null;function i(t,a){r=e.requestAnimationFrame(i),n(t,a)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function Qs(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var $s={alphahash_fragment:`#ifdef USE_ALPHAHASH
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
}`},U={common:{diffuse:{value:new V(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Nt},alphaMap:{value:null},alphaMapTransform:{value:new Nt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Nt}},envmap:{envMap:{value:null},envMapRotation:{value:new Nt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Nt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Nt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Nt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Nt},normalScale:{value:new z(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Nt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Nt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Nt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Nt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new V(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new B},probesMax:{value:new B},probesResolution:{value:new B}},points:{diffuse:{value:new V(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Nt},alphaTest:{value:0},uvTransform:{value:new Nt}},sprite:{diffuse:{value:new V(16777215)},opacity:{value:1},center:{value:new z(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Nt},alphaMap:{value:null},alphaMapTransform:{value:new Nt},alphaTest:{value:0}}},ec={basic:{uniforms:Oo([U.common,U.specularmap,U.envmap,U.aomap,U.lightmap,U.fog]),vertexShader:$s.meshbasic_vert,fragmentShader:$s.meshbasic_frag},lambert:{uniforms:Oo([U.common,U.specularmap,U.envmap,U.aomap,U.lightmap,U.emissivemap,U.bumpmap,U.normalmap,U.displacementmap,U.fog,U.lights,{emissive:{value:new V(0)},envMapIntensity:{value:1}}]),vertexShader:$s.meshlambert_vert,fragmentShader:$s.meshlambert_frag},phong:{uniforms:Oo([U.common,U.specularmap,U.envmap,U.aomap,U.lightmap,U.emissivemap,U.bumpmap,U.normalmap,U.displacementmap,U.fog,U.lights,{emissive:{value:new V(0)},specular:{value:new V(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:$s.meshphong_vert,fragmentShader:$s.meshphong_frag},standard:{uniforms:Oo([U.common,U.envmap,U.aomap,U.lightmap,U.emissivemap,U.bumpmap,U.normalmap,U.displacementmap,U.roughnessmap,U.metalnessmap,U.fog,U.lights,{emissive:{value:new V(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:$s.meshphysical_vert,fragmentShader:$s.meshphysical_frag},toon:{uniforms:Oo([U.common,U.aomap,U.lightmap,U.emissivemap,U.bumpmap,U.normalmap,U.displacementmap,U.gradientmap,U.fog,U.lights,{emissive:{value:new V(0)}}]),vertexShader:$s.meshtoon_vert,fragmentShader:$s.meshtoon_frag},matcap:{uniforms:Oo([U.common,U.bumpmap,U.normalmap,U.displacementmap,U.fog,{matcap:{value:null}}]),vertexShader:$s.meshmatcap_vert,fragmentShader:$s.meshmatcap_frag},points:{uniforms:Oo([U.points,U.fog]),vertexShader:$s.points_vert,fragmentShader:$s.points_frag},dashed:{uniforms:Oo([U.common,U.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:$s.linedashed_vert,fragmentShader:$s.linedashed_frag},depth:{uniforms:Oo([U.common,U.displacementmap]),vertexShader:$s.depth_vert,fragmentShader:$s.depth_frag},normal:{uniforms:Oo([U.common,U.bumpmap,U.normalmap,U.displacementmap,{opacity:{value:1}}]),vertexShader:$s.meshnormal_vert,fragmentShader:$s.meshnormal_frag},sprite:{uniforms:Oo([U.sprite,U.fog]),vertexShader:$s.sprite_vert,fragmentShader:$s.sprite_frag},background:{uniforms:{uvTransform:{value:new Nt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:$s.background_vert,fragmentShader:$s.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Nt}},vertexShader:$s.backgroundCube_vert,fragmentShader:$s.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:$s.cube_vert,fragmentShader:$s.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:$s.equirect_vert,fragmentShader:$s.equirect_frag},distance:{uniforms:Oo([U.common,U.displacementmap,{referencePosition:{value:new B},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:$s.distance_vert,fragmentShader:$s.distance_frag},shadow:{uniforms:Oo([U.lights,U.fog,{color:{value:new V(0)},opacity:{value:1}}]),vertexShader:$s.shadow_vert,fragmentShader:$s.shadow_frag}};ec.physical={uniforms:Oo([ec.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Nt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Nt},clearcoatNormalScale:{value:new z(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Nt},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Nt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Nt},sheen:{value:0},sheenColor:{value:new V(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Nt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Nt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Nt},transmissionSamplerSize:{value:new z},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Nt},attenuationDistance:{value:0},attenuationColor:{value:new V(0)},specularColor:{value:new V(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Nt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Nt},anisotropyVector:{value:new z},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Nt}}]),vertexShader:$s.meshphysical_vert,fragmentShader:$s.meshphysical_frag};var tc={r:0,b:0,g:0},nc=new en,rc=new Nt;rc.set(-1,0,0,0,1,0,0,0,1);function ic(e,t,n,r,i,a){let o=new V(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function p(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function m(t){let r=!1,i=p(t);i===null?g(o,s):i&&i.isColor&&(g(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function h(t,n){let i=p(n);i&&(i.isCubeTexture||i.mapping===306)?(l===void 0&&(l=new H(new ta(1,1,1),new Fo({name:`BackgroundCubeMaterial`,uniforms:Do(ec.backgroundCube.uniforms),vertexShader:ec.backgroundCube.vertexShader,fragmentShader:ec.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(nc.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isCubeTexture&&i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(rc),l.material.toneMapped=Rt.getTransfer(i.colorSpace)!==He,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new H(new wo(2,2),new Fo({name:`BackgroundMaterial`,uniforms:Do(ec.background.uniforms),vertexShader:ec.background.vertexShader,fragmentShader:ec.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=Rt.getTransfer(i.colorSpace)!==He,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function g(t,r){t.getRGB(tc,jo(e)),n.buffers.color.setClear(tc.r,tc.g,tc.b,r,a)}function _(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,g(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,g(o,s)},render:m,addToRenderList:h,dispose:_}}function ac(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function oc(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function sc(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&n!==1015&&!i&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(L(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`);n.reversedDepthBuffer===!0&&f===!1&&L(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function cc(e){let t=this,n=null,r=0,i=!1,a=!1,o=new zr,s=new Nt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var lc=4,uc=6,dc=20,fc=256,pc=new Os,mc=new V,hc=null,gc=0,_c=0,vc=!1,yc=new B,bc=new B,xc=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=yc}=i;hc=this._renderer.getRenderTarget(),gc=this._renderer.getActiveCubeFace(),_c=this._renderer.getActiveMipmapLevel(),vc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Oc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Dc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(hc,gc,_c),this._renderer.xr.enabled=vc,e.scissorTest=!1,wc(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),hc=this._renderer.getRenderTarget(),gc=this._renderer.getActiveCubeFace(),_c=this._renderer.getActiveMipmapLevel(),vc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:o,minFilter:o,generateMipmaps:!1,type:g,format:w,colorSpace:Be,depthBuffer:!1},r=Cc(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Cc(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=Sc(r)),this._blurMaterial=Ec(r,e,t),this._ggxMaterial=Tc(r,e,t)}return r}_compileMaterial(e){let t=new H(new Mr,e);this._renderer.compile(t,pc)}_sceneToCubeUV(e,t,n,r,i){let a=new Ts(90,1,t,n),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,l=c.autoClear,u=c.toneMapping;c.getClearColor(mc),c.toneMapping=0,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(r),c.clearDepth(),c.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new H(new ta,new li({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1})));let d=this._backgroundBox,f=d.material,p=!1,m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,p=!0):(f.color.copy(mc),p=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x+s[t],i.y,i.z)):n===1?(a.up.set(0,0,o[t]),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y+s[t],i.z)):(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y,i.z+s[t]));let l=this._cubeSize;wc(r,n*l,t>2?l:0,l,l),c.setRenderTarget(r),p&&c.render(d,a),c.render(e,a)}c.toneMapping=u,c.autoClear=l,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Oc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Dc());let i=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=i;let o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;wc(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,pc)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let t=1;t<r;t++)this._applyGGXFilter(e,t-1,t);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,i=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let s=a.uniforms,c=n/(this._lodMeshes.length-1),l=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-l*l)*(c*1.25),{_lodMax:d}=this,f=this._sizeLods[n],p=3*f*(n>d-lc?n-d+lc:0),m=4*(this._cubeSize-f);s.envMap.value=e.texture,s.roughness.value=u,s.mipInt.value=d-t,wc(i,p,m,3*f,2*f),r.setRenderTarget(i),r.render(o,pc),s.envMap.value=i.texture,s.roughness.value=0,s.mipInt.value=d-n,wc(e,p,m,3*f,2*f),r.setRenderTarget(e),r.render(o,pc)}_blur(e,t,n,r){let i=this._pingPongRenderTarget,a=Math.min(r,Math.PI)/Math.SQRT2;this._blurPass(e,i,t,n,a),this._blurPass(i,e,n,n,a)}_blurPass(e,t,n,r,i){let a=this._renderer,o=this._blurMaterial,s=this._lodMeshes[r];s.material=o;let c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=i,c.mipInt.value=this._lodMax-n;let l=this._sizeLods[r];wc(t,3*l*(r>this._lodMax-lc?r-this._lodMax+lc:0),4*(this._cubeSize-l),3*l,2*l),a.setRenderTarget(t),a.render(s,pc)}};function Sc(e){let t=[],n=[],r=e,i=e-lc+1+uc;for(let e=0;e<i;e++){let e=2**r;t.push(e);let i=1/(e-2),a=-i,o=1+i,s=[a,a,o,a,o,o,a,a,o,o,a,o],c=new Float32Array(108),l=new Float32Array(108);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];c.set(r,18*e);for(let t=0;t<6;t++){let n=s[t*2]*2-1,r=s[t*2+1]*2-1;e===0?bc.set(1,r,n):e===1?bc.set(-n,1,-r):e===2?bc.set(-n,r,1):e===3?bc.set(-1,r,-n):e===4?bc.set(-n,-1,r):bc.set(n,r,-1),bc.toArray(l,(e*6+t)*3)}}let u=new Mr;u.setAttribute(`position`,new _r(c,3)),u.setAttribute(`outputDirection`,new _r(l,3)),n.push(new H(u,null)),r>lc&&r--}return{lodMeshes:n,sizeLods:t}}function Cc(e,t,n){let r=new Zt(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function wc(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function Tc(e,t,n){return new Fo({name:`PMREMGGXConvolution`,defines:{GGX_SAMPLES:fc,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:kc(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})}function Ec(e,t,n){return new Fo({name:`SphericalGaussianBlur`,defines:{SAMPLES:dc,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:kc(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})}function Dc(){return new Fo({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:kc(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})}function Oc(){return new Fo({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:kc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function kc(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var Ac=class extends Zt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new Xi(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new ta(5,5,5),i=new Fo({name:`CubemapFromEquirect`,uniforms:Do(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new H(r,i),s=t.minFilter;return t.minFilter===1008&&(t.minFilter=o),new Ns(1,10,this).update(e,a),t.minFilter=s,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}};function jc(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new Ac(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new xc(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new xc(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function Mc(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&$e(`WebGLRenderer: `+e+` extension not supported.`),t}}}function Nc(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0||(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++),t}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(i===void 0)return;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else{let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}let s=new(i.count>=65535?yr:vr)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function Pc(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function Fc(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:R(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function Ic(e,t,n){let r=new WeakMap,i=new Yt;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let g=new Float32Array(p*m*4*u),_=new Qt(g,p,m,u);_.type=h,_.needsUpdate=!0;let v=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*v;e===!0&&(i.fromBufferAttribute(r,t),g[d+s+0]=i.x,g[d+s+1]=i.y,g[d+s+2]=i.z,g[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),g[d+s+4]=i.x,g[d+s+5]=i.y,g[d+s+6]=i.z,g[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),g[d+s+8]=i.x,g[d+s+9]=i.y,g[d+s+10]=i.z,g[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:_,size:new z(p,m)},r.set(o,d);function y(){_.dispose(),r.delete(o),o.removeEventListener(`dispose`,y)}o.addEventListener(`dispose`,y)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function Lc(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var Rc={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function zc(e,t,n,r,i,a){let o=new Zt(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),s=null,c=null,l=new Mr;l.setAttribute(`position`,new br([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute(`uv`,new br([0,2,0,0,2,0],2));let u=new Io({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),d=new H(l,u),f=new Os(-1,1,1,-1,0,1),p=null,m=null,h=!1,_,v=null,y=[],b=!1;this.setSize=function(e,t){o.setSize(e,t),s!==null&&s.setSize(e,t),c!==null&&c.setSize(e,t);for(let n=0;n<y.length;n++){let r=y[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){y=e,b=y.length>0&&y[0].isRenderPass===!0;let t=o.width,n=o.height;y.length>0&&s===null&&(s=new Zt(t,n,{type:g,depthBuffer:!1,stencilBuffer:!1}),c=new Zt(t,n,{type:g,depthBuffer:!1,stencilBuffer:!1}));for(let e=0;e<y.length;e++){let r=y[e];r.setSize&&r.setSize(t,n)}},this.begin=function(e,t){if(h||e.toneMapping===0&&y.length===0)return!1;if(v=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return b===!1&&e.setRenderTarget(o),_=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return b},this.end=function(e,t){e.toneMapping=_,h=!0;let n=o,r=s;for(let i=0;i<y.length;i++){let a=y[i];a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1&&(n=r,r=r===s?c:s))}if(p!==e.outputColorSpace||m!==e.toneMapping){p=e.outputColorSpace,m=e.toneMapping,u.defines={},Rt.getTransfer(p)===`srgb`&&(u.defines.SRGB_TRANSFER=``);let t=Rc[m];t&&(u.defines[t]=``),u.needsUpdate=!0}u.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(v),e.render(d,f),v=null,h=!1},this.isCompositing=function(){return h},this.dispose=function(){o.dispose(),s!==null&&s.dispose(),c!==null&&c.dispose(),l.dispose(),u.dispose()}}var Bc=new Jt,Vc=new Qi(1,1),Hc=new Qt,Uc=new $t,Wc=new Xi,Gc=[],Kc=[],qc=new Float32Array(16),Jc=new Float32Array(9),Yc=new Float32Array(4);function Xc(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=Gc[i];if(a===void 0&&(a=new Float32Array(i),Gc[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function Zc(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function Qc(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function $c(e,t){let n=Kc[t];n===void 0&&(n=new Int32Array(t),Kc[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function el(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function tl(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Zc(n,t))return;e.uniform2fv(this.addr,t),Qc(n,t)}}function nl(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(Zc(n,t))return;e.uniform3fv(this.addr,t),Qc(n,t)}}function rl(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Zc(n,t))return;e.uniform4fv(this.addr,t),Qc(n,t)}}function il(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Zc(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),Qc(n,t)}else{if(Zc(n,r))return;Yc.set(r),e.uniformMatrix2fv(this.addr,!1,Yc),Qc(n,r)}}function al(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Zc(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),Qc(n,t)}else{if(Zc(n,r))return;Jc.set(r),e.uniformMatrix3fv(this.addr,!1,Jc),Qc(n,r)}}function ol(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Zc(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),Qc(n,t)}else{if(Zc(n,r))return;qc.set(r),e.uniformMatrix4fv(this.addr,!1,qc),Qc(n,r)}}function sl(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function cl(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Zc(n,t))return;e.uniform2iv(this.addr,t),Qc(n,t)}}function ll(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Zc(n,t))return;e.uniform3iv(this.addr,t),Qc(n,t)}}function ul(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Zc(n,t))return;e.uniform4iv(this.addr,t),Qc(n,t)}}function dl(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function fl(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Zc(n,t))return;e.uniform2uiv(this.addr,t),Qc(n,t)}}function pl(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Zc(n,t))return;e.uniform3uiv(this.addr,t),Qc(n,t)}}function ml(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Zc(n,t))return;e.uniform4uiv(this.addr,t),Qc(n,t)}}function hl(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(Vc.compareFunction=n.isReversedDepthBuffer()?518:515,a=Vc):a=Bc,n.setTexture2D(t||a,i)}function gl(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||Uc,i)}function _l(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||Wc,i)}function vl(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||Hc,i)}function yl(e){switch(e){case 5126:return el;case 35664:return tl;case 35665:return nl;case 35666:return rl;case 35674:return il;case 35675:return al;case 35676:return ol;case 5124:case 35670:return sl;case 35667:case 35671:return cl;case 35668:case 35672:return ll;case 35669:case 35673:return ul;case 5125:return dl;case 36294:return fl;case 36295:return pl;case 36296:return ml;case 35678:case 36198:case 36298:case 36306:case 35682:return hl;case 35679:case 36299:case 36307:return gl;case 35680:case 36300:case 36308:case 36293:return _l;case 36289:case 36303:case 36311:case 36292:return vl}}function bl(e,t){e.uniform1fv(this.addr,t)}function xl(e,t){let n=Xc(t,this.size,2);e.uniform2fv(this.addr,n)}function Sl(e,t){let n=Xc(t,this.size,3);e.uniform3fv(this.addr,n)}function Cl(e,t){let n=Xc(t,this.size,4);e.uniform4fv(this.addr,n)}function wl(e,t){let n=Xc(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function Tl(e,t){let n=Xc(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function El(e,t){let n=Xc(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function Dl(e,t){e.uniform1iv(this.addr,t)}function Ol(e,t){e.uniform2iv(this.addr,t)}function kl(e,t){e.uniform3iv(this.addr,t)}function Al(e,t){e.uniform4iv(this.addr,t)}function jl(e,t){e.uniform1uiv(this.addr,t)}function Ml(e,t){e.uniform2uiv(this.addr,t)}function Nl(e,t){e.uniform3uiv(this.addr,t)}function Pl(e,t){e.uniform4uiv(this.addr,t)}function Fl(e,t,n){let r=this.cache,i=t.length,a=$c(n,i);Zc(r,a)||(e.uniform1iv(this.addr,a),Qc(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?Vc:Bc;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function Il(e,t,n){let r=this.cache,i=t.length,a=$c(n,i);Zc(r,a)||(e.uniform1iv(this.addr,a),Qc(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||Uc,a[e])}function Ll(e,t,n){let r=this.cache,i=t.length,a=$c(n,i);Zc(r,a)||(e.uniform1iv(this.addr,a),Qc(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||Wc,a[e])}function Rl(e,t,n){let r=this.cache,i=t.length,a=$c(n,i);Zc(r,a)||(e.uniform1iv(this.addr,a),Qc(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||Hc,a[e])}function zl(e){switch(e){case 5126:return bl;case 35664:return xl;case 35665:return Sl;case 35666:return Cl;case 35674:return wl;case 35675:return Tl;case 35676:return El;case 5124:case 35670:return Dl;case 35667:case 35671:return Ol;case 35668:case 35672:return kl;case 35669:case 35673:return Al;case 5125:return jl;case 36294:return Ml;case 36295:return Nl;case 36296:return Pl;case 35678:case 36198:case 36298:case 36306:case 35682:return Fl;case 35679:case 36299:case 36307:return Il;case 35680:case 36300:case 36308:case 36293:return Ll;case 36289:case 36303:case 36311:case 36292:return Rl}}var Bl=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=yl(t.type)}},Vl=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=zl(t.type)}},Hl=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},Ul=/(\w+)(\])?(\[|\.)?/g;function Wl(e,t){e.seq.push(t),e.map[t.id]=t}function Gl(e,t,n){let r=e.name,i=r.length;for(Ul.lastIndex=0;;){let a=Ul.exec(r),o=Ul.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){Wl(n,l===void 0?new Bl(s,e,t):new Vl(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new Hl(s),Wl(n,e)),n=e}}}var Kl=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);Gl(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function ql(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var Jl=37297,Yl=0;function Xl(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var Zl=new Nt;function Ql(e){Rt._getMatrix(Zl,Rt.workingColorSpace,e);let t=`mat3( ${Zl.elements.map(e=>e.toFixed(4))} )`;switch(Rt.getTransfer(e)){case Ve:return[t,`LinearTransferOETF`];case He:return[t,`sRGBTransferOETF`];default:return L(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function $l(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+Xl(e.getShaderSource(t),r)}return i}function eu(e,t){let n=Ql(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}var tu={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function nu(e,t){let n=tu[t];return n===void 0?(L(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var ru=new B;function iu(){return Rt.getLuminanceCoefficients(ru),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${ru.x.toFixed(4)}, ${ru.y.toFixed(4)}, ${ru.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function au(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(cu).join(`
`)}function ou(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function su(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function cu(e){return e!==``}function lu(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function uu(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var du=/^[ \t]*#include +<([\w\d./]+)>/gm;function fu(e){return e.replace(du,mu)}var pu=new Map;function mu(e,t){let n=$s[t];if(n===void 0){let e=pu.get(t);if(e!==void 0)n=$s[e],L(`WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`)}return fu(n)}var hu=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function gu(e){return e.replace(hu,_u)}function _u(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function vu(e){let t=`precision ${e.precision} float;
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
#define LOW_PRECISION`),t}var yu={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function bu(e){return yu[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var xu={301:`ENVMAP_TYPE_CUBE`,302:`ENVMAP_TYPE_CUBE`,306:`ENVMAP_TYPE_CUBE_UV`};function Su(e){return e.envMap===!1?`ENVMAP_TYPE_CUBE`:xu[e.envMapMode]||`ENVMAP_TYPE_CUBE`}var Cu={302:`ENVMAP_MODE_REFRACTION`};function wu(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:Cu[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var Tu={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function Eu(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:Tu[e.combine]||`ENVMAP_BLENDING_NONE`}function Du(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function Ou(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=bu(n),l=Su(n),u=wu(n),d=Eu(n),f=Du(n),p=au(n),m=ou(a),h=i.createProgram(),g,_,v=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(cu).join(`
`),g.length>0&&(g+=`
`),_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(cu).join(`
`),_.length>0&&(_+=`
`)):(g=[vu(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(cu).join(`
`),_=[vu(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.retroreflection?`#define USE_RETROREFLECTION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.numLightProbeGrids>0?`#define USE_LIGHT_PROBES_GRID`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:$s.tonemapping_pars_fragment,n.toneMapping===0?``:nu(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,$s.colorspace_pars_fragment,eu(`linearToOutputTexel`,n.outputColorSpace),iu(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(cu).join(`
`)),o=fu(o),o=lu(o,n),o=uu(o,n),s=fu(s),s=lu(s,n),s=uu(s,n),o=gu(o),s=gu(s),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let y=v+g+o,b=v+_+s,x=ql(i,i.VERTEX_SHADER,y),S=ql(i,i.FRAGMENT_SHADER,b);i.attachShader(h,x),i.attachShader(h,S),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h);function C(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(h)||``,r=i.getShaderInfoLog(x)||``,a=i.getShaderInfoLog(S)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(h,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,h,x,S);else{let e=$l(i,x,`vertex`),n=$l(i,S,`fragment`);R(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(h,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):L(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:g},fragmentShader:{log:c,prefix:_}})}i.deleteShader(x),i.deleteShader(S),w=new Kl(i,h),T=su(i,h)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let E=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(h,Jl)),E},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=Yl++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=x,this.fragmentShader=S,this}var ku=0,Au=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new ju(e),t.set(e,n)),n}},ju=class{constructor(e){this.id=ku++,this.code=e,this.usedTimes=0}};function Mu(e){return e===1030||e===37490||e===36285}function Nu(e,t,n,r,i,a){let o=new fn,s=new Au,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f=r.precision,p={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function m(e){return c.add(e),e===0?`uv`:`uv${e}`}function h(i,o,l,u,h,g){let _=u.fog,v=h.geometry,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,b=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,x=t.get(i.envMap||y,b),S=x&&x.mapping===306?x.image.height:null,C=p[i.type];i.precision!==null&&(f=r.getMaxPrecision(i.precision),f!==i.precision&&L(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,f,`instead.`));let w=v.morphAttributes.position||v.morphAttributes.normal||v.morphAttributes.color,T=w===void 0?0:w.length,E=0;v.morphAttributes.position!==void 0&&(E=1),v.morphAttributes.normal!==void 0&&(E=2),v.morphAttributes.color!==void 0&&(E=3);let D,ee,O,k;if(C){let e=ec[C];D=e.vertexShader,ee=e.fragmentShader}else{D=i.vertexShader,ee=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),O=e.id,k=t.id}let te=e.getRenderTarget(),A=e.state.buffers.depth.getReversed(),j=h.isInstancedMesh===!0,M=h.isBatchedMesh===!0,ne=!!i.map,N=!!i.matcap,re=!!x,ie=!!i.aoMap,ae=!!i.lightMap,oe=!!i.bumpMap&&i.wireframe===!1,se=!!i.normalMap,ce=!!i.displacementMap,le=!!i.emissiveMap,P=!!i.metalnessMap,ue=!!i.roughnessMap,de=i.anisotropy>0,fe=i.clearcoat>0,pe=i.dispersion>0,me=i.retroreflectivity>0,he=i.iridescence>0,ge=i.sheen>0,_e=i.transmission>0,ve=de&&!!i.anisotropyMap,ye=fe&&!!i.clearcoatMap,be=fe&&!!i.clearcoatNormalMap,xe=fe&&!!i.clearcoatRoughnessMap,Se=he&&!!i.iridescenceMap,Ce=he&&!!i.iridescenceThicknessMap,we=ge&&!!i.sheenColorMap,Te=ge&&!!i.sheenRoughnessMap,Ee=!!i.specularMap,De=!!i.specularColorMap,Oe=!!i.specularIntensityMap,ke=_e&&!!i.transmissionMap,Ae=_e&&!!i.thicknessMap,je=!!i.gradientMap,Me=!!i.alphaMap,Ne=i.alphaTest>0,F=!!i.alphaHash,Pe=!!i.extensions,Fe=0;i.toneMapped&&(te===null||te.isXRRenderTarget===!0)&&(Fe=e.toneMapping);let Ie={shaderID:C,shaderType:i.type,shaderName:i.name,vertexShader:D,fragmentShader:ee,defines:i.defines,customVertexShaderID:O,customFragmentShaderID:k,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:f,batching:M,batchingColor:M&&h._colorsTexture!==null,instancing:j,instancingColor:j&&h.instanceColor!==null,instancingMorph:j&&h.morphTexture!==null,outputColorSpace:te===null?e.outputColorSpace:te.isXRRenderTarget===!0?te.texture.colorSpace:Rt.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:ne,matcap:N,envMap:re,envMapMode:re&&x.mapping,envMapCubeUVHeight:S,aoMap:ie,lightMap:ae,bumpMap:oe,normalMap:se,displacementMap:ce,emissiveMap:le,normalMapObjectSpace:se&&i.normalMapType===1,normalMapTangentSpace:se&&i.normalMapType===0,packedNormalMap:se&&i.normalMapType===0&&Mu(i.normalMap.format),metalnessMap:P,roughnessMap:ue,anisotropy:de,anisotropyMap:ve,clearcoat:fe,clearcoatMap:ye,clearcoatNormalMap:be,clearcoatRoughnessMap:xe,dispersion:pe,retroreflection:me,iridescence:he,iridescenceMap:Se,iridescenceThicknessMap:Ce,sheen:ge,sheenColorMap:we,sheenRoughnessMap:Te,specularMap:Ee,specularColorMap:De,specularIntensityMap:Oe,transmission:_e,transmissionMap:ke,thicknessMap:Ae,gradientMap:je,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:Me,alphaTest:Ne,alphaHash:F,combine:i.combine,mapUv:ne&&m(i.map.channel),aoMapUv:ie&&m(i.aoMap.channel),lightMapUv:ae&&m(i.lightMap.channel),bumpMapUv:oe&&m(i.bumpMap.channel),normalMapUv:se&&m(i.normalMap.channel),displacementMapUv:ce&&m(i.displacementMap.channel),emissiveMapUv:le&&m(i.emissiveMap.channel),metalnessMapUv:P&&m(i.metalnessMap.channel),roughnessMapUv:ue&&m(i.roughnessMap.channel),anisotropyMapUv:ve&&m(i.anisotropyMap.channel),clearcoatMapUv:ye&&m(i.clearcoatMap.channel),clearcoatNormalMapUv:be&&m(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:xe&&m(i.clearcoatRoughnessMap.channel),iridescenceMapUv:Se&&m(i.iridescenceMap.channel),iridescenceThicknessMapUv:Ce&&m(i.iridescenceThicknessMap.channel),sheenColorMapUv:we&&m(i.sheenColorMap.channel),sheenRoughnessMapUv:Te&&m(i.sheenRoughnessMap.channel),specularMapUv:Ee&&m(i.specularMap.channel),specularColorMapUv:De&&m(i.specularColorMap.channel),specularIntensityMapUv:Oe&&m(i.specularIntensityMap.channel),transmissionMapUv:ke&&m(i.transmissionMap.channel),thicknessMapUv:Ae&&m(i.thicknessMap.channel),alphaMapUv:Me&&m(i.alphaMap.channel),vertexTangents:!!v.attributes.tangent&&(se||de),vertexNormals:!!v.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!v.attributes.color&&v.attributes.color.itemSize===4,pointsUvs:h.isPoints===!0&&!!v.attributes.uv&&(ne||Me),fog:!!_,useFog:i.fog===!0,fogExp2:!!_&&_.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||v.attributes.normal===void 0&&se===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:A,skinning:h.isSkinnedMesh===!0,hasPositionAttribute:v.attributes.position!==void 0,morphTargets:v.morphAttributes.position!==void 0,morphNormals:v.morphAttributes.normal!==void 0,morphColors:v.morphAttributes.color!==void 0,morphTargetsCount:T,morphTextureStride:E,numSunLights:o.sun.length,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numSunLightShadows:o.sunShadowMap.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:g.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:Fe,decodeVideoTexture:ne&&i.map.isVideoTexture===!0&&Rt.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:le&&i.emissiveMap.isVideoTexture===!0&&Rt.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:Pe&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(Pe&&i.extensions.multiDraw===!0||M)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return Ie.vertexUv1s=c.has(1),Ie.vertexUv2s=c.has(2),Ie.vertexUv3s=c.has(3),c.clear(),Ie}function g(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(_(n,t),v(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function _(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numSunLights),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numSunLightShadows),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function v(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.retroreflection&&o.enable(24),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function y(e){let t=p[e.type],n;if(t){let e=ec[t];n=Mo.clone(e.uniforms)}else n=e.uniforms;return n}function b(t,n){let r=u.get(n);return r===void 0?(r=new Ou(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function x(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function S(e){s.remove(e)}function C(){s.dispose()}return{getParameters:h,getProgramCacheKey:g,getUniforms:y,acquireProgram:b,releaseProgram:x,releaseShaderCache:S,programs:l,dispose:C}}function Pu(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function Fu(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function Iu(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function Lu(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l,u){u.reversedDepth===!0&&(c=-c);let d=s(e,t,a,o,c,l);a.transmission>0?r.push(d):a.transparent===!0?i.push(d):n.push(d)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t){n.length>1&&n.sort(e||Fu),r.length>1&&r.sort(t||Iu),i.length>1&&i.sort(t||Iu)}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function Ru(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new Lu,e.set(t,[i])):n>=r.length?(i=new Lu,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function zu(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={direction:new B,color:new V};break;case`SpotLight`:n={position:new B,direction:new B,color:new V,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new B,color:new V,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new B,skyColor:new V,groundColor:new V};break;case`RectAreaLight`:n={color:new V,position:new B,halfWidth:new B,halfHeight:new B}}return e[t.id]=n,n}}}function Bu(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new z};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new z};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new z,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var Vu=0;function Hu(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function Uu(e){let t=new zu,n=Bu(),r={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new B);let i=new B,a=new en,o=new en;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0,y=0,b=0,x=0;i.sort(Hu);for(let e=0,S=i.length;e<S;e++){let S=i[e],C=S.color,w=S.intensity,T=S.distance,E=null;if(S.shadow&&S.shadow.map&&(E=S.shadow.map.texture.format===1030?S.shadow.map.texture:S.shadow.map.depthTexture||S.shadow.map.texture),S.isAmbientLight)a+=C.r*w,o+=C.g*w,s+=C.b*w;else if(S.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(S.sh.coefficients[e],w);x++}else if(S.isSunLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize.copy(e.mapSize).multiply(e.getFrameExtents()),r.sunShadow[l]=t,r.sunShadowMap[l]=E;let i=e.getViewportCount();for(let t=0;t<i;t++)r.sunShadowMatrix[u+t]=e.getMatrix(t),r.sunShadowCascade[u+t]=e._cascadeData[t];u+=i,l++}r.sun[c]=e,c++}else if(S.isDirectionalLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[d]=t,r.directionalShadowMap[d]=E,r.directionalShadowMatrix[d]=S.shadow.matrix,g++}r.directional[d]=e,d++}else if(S.isSpotLight){let e=t.get(S);e.position.setFromMatrixPosition(S.matrixWorld),e.color.copy(C).multiplyScalar(w),e.distance=T,e.coneCos=Math.cos(S.angle),e.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),e.decay=S.decay,r.spot[p]=e;let i=S.shadow;if(S.map&&(r.spotLightMap[y]=S.map,y++,i.updateMatrices(S),S.castShadow&&b++),r.spotLightMatrix[p]=i.matrix,S.castShadow){let e=n.get(S);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[p]=e,r.spotShadowMap[p]=E,v++}p++}else if(S.isRectAreaLight){let e=t.get(S);e.color.copy(C).multiplyScalar(w),e.halfWidth.set(S.width*.5,0,0),e.halfHeight.set(0,S.height*.5,0),r.rectArea[m]=e,m++}else if(S.isPointLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),e.distance=S.distance,e.decay=S.decay,S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[f]=t,r.pointShadowMap[f]=E,r.pointShadowMatrix[f]=S.shadow.matrix,_++}r.point[f]=e,f++}else if(S.isHemisphereLight){let e=t.get(S);e.skyColor.copy(S.color).multiplyScalar(w),e.groundColor.copy(S.groundColor).multiplyScalar(w),r.hemi[h]=e,h++}}m>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=U.LTC_FLOAT_1,r.rectAreaLTC2=U.LTC_FLOAT_2):(r.rectAreaLTC1=U.LTC_HALF_1,r.rectAreaLTC2=U.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let S=r.hash;(S.sunLength!==c||S.directionalLength!==d||S.pointLength!==f||S.spotLength!==p||S.rectAreaLength!==m||S.hemiLength!==h||S.numSunShadows!==l||S.numDirectionalShadows!==g||S.numPointShadows!==_||S.numSpotShadows!==v||S.numSpotMaps!==y||S.numLightProbes!==x)&&(r.sun.length=c,r.directional.length=d,r.spot.length=p,r.rectArea.length=m,r.point.length=f,r.hemi.length=h,r.sunShadow.length=l,r.sunShadowMap.length=l,r.sunShadowMatrix.length=u,r.sunShadowCascade.length=u,r.directionalShadow.length=g,r.directionalShadowMap.length=g,r.directionalShadowMatrix.length=g,r.pointShadow.length=_,r.pointShadowMap.length=_,r.pointShadowMatrix.length=_,r.spotShadow.length=v,r.spotShadowMap.length=v,r.spotLightMatrix.length=v+y-b,r.spotLightMap.length=y,r.numSpotLightShadowsWithMaps=b,r.numLightProbes=x,S.sunLength=c,S.directionalLength=d,S.pointLength=f,S.spotLength=p,S.rectAreaLength=m,S.hemiLength=h,S.numSunShadows=l,S.numDirectionalShadows=g,S.numPointShadows=_,S.numSpotShadows=v,S.numSpotMaps=y,S.numLightProbes=x,r.version=Vu++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=0,f=t.matrixWorldInverse;for(let t=0,p=e.length;t<p;t++){let p=e[t];if(p.isSunLight){let e=r.sun[n];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),n++}else if(p.isDirectionalLight){let e=r.directional[s];e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),s++}else if(p.isSpotLight){let e=r.spot[l];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),l++}else if(p.isRectAreaLight){let e=r.rectArea[u];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),o.identity(),a.copy(p.matrixWorld),a.premultiply(f),o.extractRotation(a),e.halfWidth.set(p.width*.5,0,0),e.halfHeight.set(0,p.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),u++}else if(p.isPointLight){let e=r.point[c];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),c++}else if(p.isHemisphereLight){let e=r.hemi[d];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),d++}}}return{setup:s,setupView:c,state:r}}function Wu(e){let t=new Uu(e),n=[],r=[],i=[];function a(e){d.camera=e,n.length=0,r.length=0,i.length=0}function o(e){n.push(e)}function s(e){r.push(e)}function c(e){i.push(e)}function l(){t.setup(n)}function u(e){t.setupView(n,e)}let d={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:d,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:s,pushLightProbeGrid:c}}function Gu(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new Wu(e),t.set(n,[a])):r>=i.length?(a=new Wu(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var Ku=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,qu=`uniform sampler2D shadow_pass;
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
}`,Ju=[new B(1,0,0),new B(-1,0,0),new B(0,1,0),new B(0,-1,0),new B(0,0,1),new B(0,0,-1)],Yu=[new B(0,-1,0),new B(0,-1,0),new B(0,0,1),new B(0,0,-1),new B(0,-1,0),new B(0,-1,0)],Xu=new en,Zu=new B,Qu=new B;function $u(e,t,n){let i=new Ii,a=new z,s=new z,c=new Yt,l=new Ro,u=new zo,d={},f=n.maxTextureSize,p={0:1,1:0,2:2},_=new Fo({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new z},radius:{value:4}},vertexShader:Ku,fragmentShader:qu}),v=_.clone();v.defines.HORIZONTAL_PASS=1;let y=new Mr;y.setAttribute(`position`,new _r(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let b=new H(y,_),x=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let S=this.type;this.render=function(t,n,l){if(x.enabled===!1||x.autoUpdate===!1&&x.needsUpdate===!1||t.length===0)return;this.type===2&&(L(`WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead.`),this.type=1);let u=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),_=e.state;_.setBlending(0),_.buffers.depth.getReversed()===!0?_.buffers.color.setClear(0,0,0,0):_.buffers.color.setClear(1,1,1,1),_.buffers.depth.setTest(!0),_.setScissorTest(!1);let v=S!==this.type;v&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let u=0,d=t.length;u<d;u++){let d=t[u],p=d.shadow;if(p===void 0){L(`WebGLShadowMap:`,d,`has no shadow.`);continue}if(p.autoUpdate===!1&&p.needsUpdate===!1)continue;a.copy(p.mapSize);let y=p.getFrameExtents();a.multiply(y),s.copy(p.mapSize),(a.x>f||a.y>f)&&(a.x>f&&(s.x=Math.floor(f/y.x),a.x=s.x*y.x,p.mapSize.x=s.x),a.y>f&&(s.y=Math.floor(f/y.y),a.y=s.y*y.y,p.mapSize.y=s.y));let b=e.state.buffers.depth.getReversed();if(p.camera._reversedDepth=b,p.map===null||v===!0){if(p.map!==null&&(p.map.depthTexture!==null&&(p.map.depthTexture.dispose(),p.map.depthTexture=null),p.map.dispose()),this.type===3){if(d.isPointLight){L(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}p.map=new Zt(a.x,a.y,{format:O,type:g,minFilter:o,magFilter:o,generateMipmaps:!1}),p.map.texture.name=d.name+`.shadowMap`,p.map.depthTexture=new Qi(a.x,a.y,h),p.map.depthTexture.name=d.name+`.shadowMapDepth`,p.map.depthTexture.format=T,p.map.depthTexture.compareFunction=null,p.map.depthTexture.minFilter=r,p.map.depthTexture.magFilter=r}else d.isPointLight?(p.map=new Ac(a.x),p.map.depthTexture=new $i(a.x,m)):(p.map=new Zt(a.x,a.y),p.map.depthTexture=new Qi(a.x,a.y,m)),p.map.depthTexture.name=d.name+`.shadowMap`,p.map.depthTexture.format=T,this.type===1?(p.map.depthTexture.compareFunction=b?518:515,p.map.depthTexture.minFilter=o,p.map.depthTexture.magFilter=o):(p.map.depthTexture.compareFunction=null,p.map.depthTexture.minFilter=r,p.map.depthTexture.magFilter=r);p.camera.updateProjectionMatrix()}p.map.isWebGLCubeRenderTarget!==!0&&(p.map.width!==a.x||p.map.height!==a.y)&&p.map.setSize(a.x,a.y);let x=p.map.isWebGLCubeRenderTarget?6:p.getViewportCount();d.isPointLight!==!0&&p.updateMatrices(d,l);for(let t=0;t<x;t++){let r=p.getCamera(t);if(d.isPointLight){let e=p.camera,n=p.matrix,r=d.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),Zu.setFromMatrixPosition(d.matrixWorld),e.position.copy(Zu),Qu.copy(e.position),Qu.add(Ju[t]),e.up.copy(Yu[t]),e.lookAt(Qu),e.updateMatrixWorld(),n.makeTranslation(-Zu.x,-Zu.y,-Zu.z),Xu.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),p._frustum.setFromProjectionMatrix(Xu,e.coordinateSystem,e.reversedDepth)}if(p.map.isWebGLCubeRenderTarget)e.setRenderTarget(p.map,t),e.clear();else{t===0&&(e.setRenderTarget(p.map),e.clear());let n=p.getViewport(t);c.set(s.x*n.x,s.y*n.y,s.x*n.z,s.y*n.w),_.viewport(c)}i=p.getFrustum(t),E(n,l,r,d,this.type)}p.isPointLightShadow!==!0&&this.type===3&&C(p,l),p.needsUpdate=!1}S=this.type,x.needsUpdate=!1,e.setRenderTarget(u,d,p)};function C(n,r){let i=t.update(b);_.defines.VSM_SAMPLES!==n.blurSamples&&(_.defines.VSM_SAMPLES=n.blurSamples,v.defines.VSM_SAMPLES=n.blurSamples,_.needsUpdate=!0,v.needsUpdate=!0),n.mapPass===null?n.mapPass=new Zt(a.x,a.y,{format:O,type:g}):(n.mapPass.width!==n.map.width||n.mapPass.height!==n.map.height)&&n.mapPass.setSize(n.map.width,n.map.height),_.uniforms.shadow_pass.value=n.map.depthTexture,_.uniforms.resolution.value.set(n.map.width,n.map.height),_.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,i,_,b,null),v.uniforms.shadow_pass.value=n.mapPass.texture,v.uniforms.resolution.value.set(n.map.width,n.map.height),v.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,i,v,b,null)}function w(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?u:l,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=d[e];r===void 0&&(r={},d[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,D)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?p[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function E(n,r,a,o,s){if(n.visible===!1)return;if(n.layers.test(r.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||n.intersectsFrustum(i))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let i=t.update(n),c=n.material;if(Array.isArray(c)){let t=i.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=w(n,d,o,s);n.onBeforeShadow(e,n,r,a,i,t,u),e.renderBufferDirect(a,null,i,t,n,u),n.onAfterShadow(e,n,r,a,i,t,u)}}}else if(c.visible){let t=w(n,c,o,s);n.onBeforeShadow(e,n,r,a,i,t,null),e.renderBufferDirect(a,null,i,t,n,null),n.onAfterShadow(e,n,r,a,i,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)E(c[e],r,a,o,s)}function D(e){e.target.removeEventListener(`dispose`,D);for(let t in d){let n=d[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function ed(e,t){function n(){let t=!1,n=new Yt,r=null,i=new Yt(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?P(e.DEPTH_TEST):ue(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=tt[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?P(e.STENCIL_TEST):ue(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c=new WeakMap,l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new V(0,0,0),T=0,E=!1,D=null,ee=null,O=null,k=null,te=null,A=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),j=!1,M=0,ne=e.getParameter(e.VERSION);ne.indexOf(`WebGL`)===-1?ne.indexOf(`OpenGL ES`)!==-1&&(M=parseFloat(/^OpenGL ES (\d)/.exec(ne)[1]),j=M>=2):(M=parseFloat(/^WebGL (\d)/.exec(ne)[1]),j=M>=1);let N=null,re={},ie=e.getParameter(e.SCISSOR_BOX),ae=e.getParameter(e.VIEWPORT),oe=new Yt().fromArray(ie),se=new Yt().fromArray(ae);function ce(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let le={};le[e.TEXTURE_2D]=ce(e.TEXTURE_2D,e.TEXTURE_2D,1),le[e.TEXTURE_CUBE_MAP]=ce(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),le[e.TEXTURE_2D_ARRAY]=ce(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),le[e.TEXTURE_3D]=ce(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),P(e.DEPTH_TEST),o.setFunc(3),ve(!1),ye(1),P(e.CULL_FACE),ge(0);function P(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function ue(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function de(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function fe(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function pe(t){return h!==t&&(e.useProgram(t),h=t,!0)}let me={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};me[103]=e.MIN,me[104]=e.MAX;let he={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function ge(t,n,r,i,a,o,s,c,l,u){if(t===0)g===!0&&(ue(e.BLEND),g=!1);else if(g===!1&&(P(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:R(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:R(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:R(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:R(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}}else a||=n,o||=r,s||=i,(n!==v||a!==x)&&(e.blendEquationSeparate(me[n],me[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(he[r],he[i],he[o],he[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function _e(t,n){t.side===2?ue(e.CULL_FACE):P(e.CULL_FACE);let r=t.side===1;n&&(r=!r),ve(r),t.blending===1&&t.transparent===!1?ge(0):ge(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),xe(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?P(e.SAMPLE_ALPHA_TO_COVERAGE):ue(e.SAMPLE_ALPHA_TO_COVERAGE)}function ve(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function ye(t){t===0?ue(e.CULL_FACE):(P(e.CULL_FACE),t!==ee&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),ee=t}function be(t){t!==O&&(j&&e.lineWidth(t),O=t)}function xe(t,n,r){t?(P(e.POLYGON_OFFSET_FILL),(k!==n||te!==r)&&(k=n,te=r,o.getReversed()&&(n=-n),e.polygonOffset(n,r))):ue(e.POLYGON_OFFSET_FILL)}function Se(t){t?P(e.SCISSOR_TEST):ue(e.SCISSOR_TEST)}function Ce(t){t===void 0&&(t=e.TEXTURE0+A-1),N!==t&&(e.activeTexture(t),N=t)}function we(t,n,r){r===void 0&&(r=N===null?e.TEXTURE0+A-1:N);let i=re[r];i===void 0&&(i={type:void 0,texture:void 0},re[r]=i),(i.type!==t||i.texture!==n)&&(N!==r&&(e.activeTexture(r),N=r),e.bindTexture(t,n||le[t]),i.type=t,i.texture=n)}function Te(){let t=re[N];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function Ee(){try{e.compressedTexImage2D(...arguments)}catch(e){R(`WebGLState:`,e)}}function De(){try{e.compressedTexImage3D(...arguments)}catch(e){R(`WebGLState:`,e)}}function Oe(){try{e.texSubImage2D(...arguments)}catch(e){R(`WebGLState:`,e)}}function ke(){try{e.texSubImage3D(...arguments)}catch(e){R(`WebGLState:`,e)}}function Ae(){try{e.compressedTexSubImage2D(...arguments)}catch(e){R(`WebGLState:`,e)}}function je(){try{e.compressedTexSubImage3D(...arguments)}catch(e){R(`WebGLState:`,e)}}function Me(){try{e.texStorage2D(...arguments)}catch(e){R(`WebGLState:`,e)}}function Ne(){try{e.texStorage3D(...arguments)}catch(e){R(`WebGLState:`,e)}}function F(){try{e.texImage2D(...arguments)}catch(e){R(`WebGLState:`,e)}}function Pe(){try{e.texImage3D(...arguments)}catch(e){R(`WebGLState:`,e)}}function Fe(t){return d[t]===void 0?e.getParameter(t):d[t]}function Ie(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function I(t){oe.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),oe.copy(t))}function Le(t){se.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),se.copy(t))}function Re(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function ze(t,n){let r=l.get(n).get(t);c.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),c.set(n,r))}function Be(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},N=null,re={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new V(0,0,0),T=0,E=!1,D=null,ee=null,O=null,k=null,te=null,oe.set(0,0,e.canvas.width,e.canvas.height),se.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:P,disable:ue,bindFramebuffer:de,drawBuffers:fe,useProgram:pe,setBlending:ge,setMaterial:_e,setFlipSided:ve,setCullFace:ye,setLineWidth:be,setPolygonOffset:xe,setScissorTest:Se,activeTexture:Ce,bindTexture:we,unbindTexture:Te,compressedTexImage2D:Ee,compressedTexImage3D:De,texImage2D:F,texImage3D:Pe,pixelStorei:Ie,getParameter:Fe,updateUBOMapping:Re,uniformBlockBinding:ze,texStorage2D:Me,texStorage3D:Ne,texSubImage2D:Oe,texSubImage3D:ke,compressedTexSubImage2D:Ae,compressedTexSubImage3D:je,scissor:I,viewport:Le,reset:Be}}function td(l,u,d,f,p,m,h){let g=u.has(`WEBGL_multisampled_render_to_texture`)?u.get(`WEBGL_multisampled_render_to_texture`):null,_=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),v=new z,y=new WeakMap,b=new Set,x,S=new WeakMap,C=!1;try{C=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function w(e,t){return C?new OffscreenCanvas(e,t):Je(`canvas`)}function T(e,t,n){let r=1,i=Fe(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);x===void 0&&(x=w(n,a));let o=t?w(n,a):x;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),L(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&L(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function D(e){return e.generateMipmaps}function ee(e){l.generateMipmap(e)}function O(e){return e.isWebGLCubeRenderTarget?l.TEXTURE_CUBE_MAP:e.isWebGL3DRenderTarget?l.TEXTURE_3D:e.isWebGLArrayRenderTarget||e.isCompressedArrayTexture?l.TEXTURE_2D_ARRAY:l.TEXTURE_2D}function k(e,t,n,r,i,a=!1){if(e!==null){if(l[e]!==void 0)return l[e];L(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+e+`'`)}let o;r&&(o=u.get(`EXT_texture_norm16`),o||L(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let s=t;if(t===l.RED&&(n===l.FLOAT&&(s=l.R32F),n===l.HALF_FLOAT&&(s=l.R16F),n===l.UNSIGNED_BYTE&&(s=l.R8),n===l.UNSIGNED_SHORT&&o&&(s=o.R16_EXT),n===l.SHORT&&o&&(s=o.R16_SNORM_EXT)),t===l.RED_INTEGER&&(n===l.UNSIGNED_BYTE&&(s=l.R8UI),n===l.UNSIGNED_SHORT&&(s=l.R16UI),n===l.UNSIGNED_INT&&(s=l.R32UI),n===l.BYTE&&(s=l.R8I),n===l.SHORT&&(s=l.R16I),n===l.INT&&(s=l.R32I)),t===l.RG&&(n===l.FLOAT&&(s=l.RG32F),n===l.HALF_FLOAT&&(s=l.RG16F),n===l.UNSIGNED_BYTE&&(s=l.RG8),n===l.UNSIGNED_SHORT&&o&&(s=o.RG16_EXT),n===l.SHORT&&o&&(s=o.RG16_SNORM_EXT)),t===l.RG_INTEGER&&(n===l.UNSIGNED_BYTE&&(s=l.RG8UI),n===l.UNSIGNED_SHORT&&(s=l.RG16UI),n===l.UNSIGNED_INT&&(s=l.RG32UI),n===l.BYTE&&(s=l.RG8I),n===l.SHORT&&(s=l.RG16I),n===l.INT&&(s=l.RG32I)),t===l.RGB_INTEGER&&(n===l.UNSIGNED_BYTE&&(s=l.RGB8UI),n===l.UNSIGNED_SHORT&&(s=l.RGB16UI),n===l.UNSIGNED_INT&&(s=l.RGB32UI),n===l.BYTE&&(s=l.RGB8I),n===l.SHORT&&(s=l.RGB16I),n===l.INT&&(s=l.RGB32I)),t===l.RGBA_INTEGER&&(n===l.UNSIGNED_BYTE&&(s=l.RGBA8UI),n===l.UNSIGNED_SHORT&&(s=l.RGBA16UI),n===l.UNSIGNED_INT&&(s=l.RGBA32UI),n===l.BYTE&&(s=l.RGBA8I),n===l.SHORT&&(s=l.RGBA16I),n===l.INT&&(s=l.RGBA32I)),t===l.RGB&&(n===l.UNSIGNED_SHORT&&o&&(s=o.RGB16_EXT),n===l.SHORT&&o&&(s=o.RGB16_SNORM_EXT),n===l.UNSIGNED_INT_5_9_9_9_REV&&(s=l.RGB9_E5),n===l.UNSIGNED_INT_10F_11F_11F_REV&&(s=l.R11F_G11F_B10F)),t===l.RGBA){let e=a?Ve:Rt.getTransfer(i);n===l.FLOAT&&(s=l.RGBA32F),n===l.HALF_FLOAT&&(s=l.RGBA16F),n===l.UNSIGNED_BYTE&&(s=e===`srgb`?l.SRGB8_ALPHA8:l.RGBA8),n===l.UNSIGNED_SHORT&&o&&(s=o.RGBA16_EXT),n===l.SHORT&&o&&(s=o.RGBA16_SNORM_EXT),n===l.UNSIGNED_SHORT_4_4_4_4&&(s=l.RGBA4),n===l.UNSIGNED_SHORT_5_5_5_1&&(s=l.RGB5_A1)}return(s===l.R16F||s===l.R32F||s===l.RG16F||s===l.RG32F||s===l.RGBA16F||s===l.RGBA32F)&&u.get(`EXT_color_buffer_float`),s}function te(e,t){let n;return e?t===null||t===1014||t===1020?n=l.DEPTH24_STENCIL8:t===1015?n=l.DEPTH32F_STENCIL8:t===1012&&(n=l.DEPTH24_STENCIL8,L(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):t===null||t===1014||t===1020?n=l.DEPTH_COMPONENT24:t===1015?n=l.DEPTH_COMPONENT32F:t===1012&&(n=l.DEPTH_COMPONENT16),n}function A(e,t){return D(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function j(e){let t=e.target;t.removeEventListener(`dispose`,j),ne(t),t.isVideoTexture&&y.delete(t),t.isHTMLTexture&&b.delete(t)}function M(e){let t=e.target;t.removeEventListener(`dispose`,M),re(t)}function ne(e){let t=f.get(e);if(t.__webglInit===void 0)return;let n=e.source,r=S.get(n);if(r){let i=r[t.__cacheKey];i.usedTimes--,i.usedTimes===0&&N(e),Object.keys(r).length===0&&S.delete(n)}f.remove(e)}function N(e){let t=f.get(e);l.deleteTexture(t.__webglTexture);let n=e.source,r=S.get(n);delete r[t.__cacheKey],h.memory.textures--}function re(e){let t=f.get(e);if(e.depthTexture&&(e.depthTexture.dispose(),f.remove(e.depthTexture)),e.isWebGLCubeRenderTarget)for(let e=0;e<6;e++){if(Array.isArray(t.__webglFramebuffer[e]))for(let n=0;n<t.__webglFramebuffer[e].length;n++)l.deleteFramebuffer(t.__webglFramebuffer[e][n]);else l.deleteFramebuffer(t.__webglFramebuffer[e]);t.__webglDepthbuffer&&l.deleteRenderbuffer(t.__webglDepthbuffer[e])}else{if(Array.isArray(t.__webglFramebuffer))for(let e=0;e<t.__webglFramebuffer.length;e++)l.deleteFramebuffer(t.__webglFramebuffer[e]);else l.deleteFramebuffer(t.__webglFramebuffer);if(t.__webglDepthbuffer&&l.deleteRenderbuffer(t.__webglDepthbuffer),t.__webglMultisampledFramebuffer&&l.deleteFramebuffer(t.__webglMultisampledFramebuffer),t.__webglColorRenderbuffer)for(let e=0;e<t.__webglColorRenderbuffer.length;e++)t.__webglColorRenderbuffer[e]&&l.deleteRenderbuffer(t.__webglColorRenderbuffer[e]);t.__webglDepthRenderbuffer&&l.deleteRenderbuffer(t.__webglDepthRenderbuffer)}let n=e.textures;for(let e=0,t=n.length;e<t;e++){let t=f.get(n[e]);t.__webglTexture&&(l.deleteTexture(t.__webglTexture),h.memory.textures--),f.remove(n[e])}f.remove(e)}let ie=0;function ae(){ie=0}function oe(){return ie}function se(e){ie=e}function ce(){let e=ie;return e>=p.maxTextures&&L(`WebGLTextures: Trying to use `+(e+1)+` texture units while this GPU supports only `+p.maxTextures),ie+=1,e}function le(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function P(e,t){let n=f.get(e);if(e.isVideoTexture&&F(e),e.isRenderTargetTexture===!1&&e.isExternalTexture!==!0&&e.version>0&&n.__version!==e.version){let r=e.image;if(r===null)L(`WebGLRenderer: Texture marked for update but no image data found.`);else if(r.complete===!1)L(`WebGLRenderer: Texture marked for update but image is incomplete`);else{be(n,e,t);return}}else e.isExternalTexture&&(n.__webglTexture=e.sourceTexture?e.sourceTexture:null);d.bindTexture(l.TEXTURE_2D,n.__webglTexture,l.TEXTURE0+t)}function ue(e,t){let n=f.get(e);e.isRenderTargetTexture===!1&&e.version>0&&n.__version!==e.version?be(n,e,t):(e.isExternalTexture&&(n.__webglTexture=e.sourceTexture?e.sourceTexture:null),d.bindTexture(l.TEXTURE_2D_ARRAY,n.__webglTexture,l.TEXTURE0+t))}function de(e,t){let n=f.get(e);e.isRenderTargetTexture===!1&&e.version>0&&n.__version!==e.version?be(n,e,t):d.bindTexture(l.TEXTURE_3D,n.__webglTexture,l.TEXTURE0+t)}function fe(e,t){let n=f.get(e);e.isCubeDepthTexture!==!0&&e.version>0&&n.__version!==e.version?xe(n,e,t):d.bindTexture(l.TEXTURE_CUBE_MAP,n.__webglTexture,l.TEXTURE0+t)}let pe={[e]:l.REPEAT,[t]:l.CLAMP_TO_EDGE,[n]:l.MIRRORED_REPEAT},me={[r]:l.NEAREST,[i]:l.NEAREST_MIPMAP_NEAREST,[a]:l.NEAREST_MIPMAP_LINEAR,[o]:l.LINEAR,[s]:l.LINEAR_MIPMAP_NEAREST,[c]:l.LINEAR_MIPMAP_LINEAR},he={512:l.NEVER,519:l.ALWAYS,513:l.LESS,515:l.LEQUAL,514:l.EQUAL,518:l.GEQUAL,516:l.GREATER,517:l.NOTEQUAL};function ge(e,t){if(t.type===1015&&u.has(`OES_texture_float_linear`)===!1&&(t.magFilter===1006||t.magFilter===1007||t.magFilter===1005||t.magFilter===1008||t.minFilter===1006||t.minFilter===1007||t.minFilter===1005||t.minFilter===1008)&&L(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),l.texParameteri(e,l.TEXTURE_WRAP_S,pe[t.wrapS]),l.texParameteri(e,l.TEXTURE_WRAP_T,pe[t.wrapT]),(e===l.TEXTURE_3D||e===l.TEXTURE_2D_ARRAY)&&l.texParameteri(e,l.TEXTURE_WRAP_R,pe[t.wrapR]),l.texParameteri(e,l.TEXTURE_MAG_FILTER,me[t.magFilter]),l.texParameteri(e,l.TEXTURE_MIN_FILTER,me[t.minFilter]),t.compareFunction&&(l.texParameteri(e,l.TEXTURE_COMPARE_MODE,l.COMPARE_REF_TO_TEXTURE),l.texParameteri(e,l.TEXTURE_COMPARE_FUNC,he[t.compareFunction])),u.has(`EXT_texture_filter_anisotropic`)===!0){if(t.magFilter===1003||t.minFilter!==1005&&t.minFilter!==1008||t.type===1015&&u.has(`OES_texture_float_linear`)===!1)return;if(t.anisotropy>1||f.get(t).__currentAnisotropy){let n=u.get(`EXT_texture_filter_anisotropic`);l.texParameterf(e,n.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(t.anisotropy,p.getMaxAnisotropy())),f.get(t).__currentAnisotropy=t.anisotropy}}}function _e(e,t){let n=!1;e.__webglInit===void 0&&(e.__webglInit=!0,t.addEventListener(`dispose`,j));let r=t.source,i=S.get(r);i===void 0&&(i={},S.set(r,i));let a=le(t);if(a!==e.__cacheKey){i[a]===void 0&&(i[a]={texture:l.createTexture(),usedTimes:0},h.memory.textures++,n=!0),i[a].usedTimes++;let r=i[e.__cacheKey];r!==void 0&&(i[e.__cacheKey].usedTimes--,r.usedTimes===0&&N(t)),e.__cacheKey=a,e.__webglTexture=i[a].texture}return n}function ve(e,t,n){return Math.floor(Math.floor(e/n)/t)}function ye(e,t,n,r){let i=e.updateRanges;if(i.length===0)d.texSubImage2D(l.TEXTURE_2D,0,0,0,t.width,t.height,n,r,t.data);else{i.sort((e,t)=>e.start-t.start);let a=0;for(let e=1;e<i.length;e++){let n=i[a],r=i[e],o=n.start+n.count,s=ve(r.start,t.width,4),c=ve(n.start,t.width,4);r.start<=o+1&&s===c&&ve(r.start+r.count-1,t.width,4)===s?n.count=Math.max(n.count,r.start+r.count-n.start):(++a,i[a]=r)}i.length=a+1;let o=d.getParameter(l.UNPACK_ROW_LENGTH),s=d.getParameter(l.UNPACK_SKIP_PIXELS),c=d.getParameter(l.UNPACK_SKIP_ROWS);d.pixelStorei(l.UNPACK_ROW_LENGTH,t.width);for(let e=0,a=i.length;e<a;e++){let a=i[e],o=Math.floor(a.start/4),s=Math.ceil(a.count/4),c=o%t.width,u=Math.floor(o/t.width),f=s;d.pixelStorei(l.UNPACK_SKIP_PIXELS,c),d.pixelStorei(l.UNPACK_SKIP_ROWS,u),d.texSubImage2D(l.TEXTURE_2D,0,c,u,f,1,n,r,t.data)}e.clearUpdateRanges(),d.pixelStorei(l.UNPACK_ROW_LENGTH,o),d.pixelStorei(l.UNPACK_SKIP_PIXELS,s),d.pixelStorei(l.UNPACK_SKIP_ROWS,c)}}function be(e,t,n){let r=l.TEXTURE_2D;(t.isDataArrayTexture||t.isCompressedArrayTexture)&&(r=l.TEXTURE_2D_ARRAY),t.isData3DTexture&&(r=l.TEXTURE_3D);let i=_e(e,t),a=t.source;d.bindTexture(r,e.__webglTexture,l.TEXTURE0+n);let o=f.get(a);if(a.version!==o.__version||i===!0){if(d.activeTexture(l.TEXTURE0+n),!(typeof ImageBitmap<`u`&&t.image instanceof ImageBitmap)){let e=Rt.getPrimaries(Rt.workingColorSpace),n=t.colorSpace===``?null:Rt.getPrimaries(t.colorSpace),r=t.colorSpace===``||e===n?l.NONE:l.BROWSER_DEFAULT_WEBGL;d.pixelStorei(l.UNPACK_FLIP_Y_WEBGL,t.flipY),d.pixelStorei(l.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),d.pixelStorei(l.UNPACK_COLORSPACE_CONVERSION_WEBGL,r)}d.pixelStorei(l.UNPACK_ALIGNMENT,t.unpackAlignment);let e=T(t.image,!1,p.maxTextureSize);e=Pe(t,e);let s=m.convert(t.format,t.colorSpace),c=m.convert(t.type),u=k(t.internalFormat,s,c,t.normalized,t.colorSpace,t.isVideoTexture);ge(r,t);let f,h=t.mipmaps,g=t.isVideoTexture!==!0,_=o.__version===void 0||i===!0,v=a.dataReady,y=A(t,e);if(t.isDepthTexture)u=te(t.format===E,t.type),_&&(g?d.texStorage2D(l.TEXTURE_2D,1,u,e.width,e.height):d.texImage2D(l.TEXTURE_2D,0,u,e.width,e.height,0,s,c,null));else if(t.isDataTexture){if(h.length>0){g&&_&&d.texStorage2D(l.TEXTURE_2D,y,u,h[0].width,h[0].height);for(let e=0,t=h.length;e<t;e++)f=h[e],g?v&&d.texSubImage2D(l.TEXTURE_2D,e,0,0,f.width,f.height,s,c,f.data):d.texImage2D(l.TEXTURE_2D,e,u,f.width,f.height,0,s,c,f.data);t.generateMipmaps=!1}else g?(_&&d.texStorage2D(l.TEXTURE_2D,y,u,e.width,e.height),v&&ye(t,e,s,c)):d.texImage2D(l.TEXTURE_2D,0,u,e.width,e.height,0,s,c,e.data)}else if(t.isCompressedTexture){if(t.isCompressedArrayTexture){g&&_&&d.texStorage3D(l.TEXTURE_2D_ARRAY,y,u,h[0].width,h[0].height,e.depth);for(let n=0,r=h.length;n<r;n++)if(f=h[n],t.format!==1023){if(s!==null){if(g){if(v){if(t.layerUpdates.size>0){let e=Ys(f.width,f.height,t.format,t.type);for(let r of t.layerUpdates){let t=f.data.subarray(r*e/f.data.BYTES_PER_ELEMENT,(r+1)*e/f.data.BYTES_PER_ELEMENT);d.compressedTexSubImage3D(l.TEXTURE_2D_ARRAY,n,0,0,r,f.width,f.height,1,s,t)}}else d.compressedTexSubImage3D(l.TEXTURE_2D_ARRAY,n,0,0,0,f.width,f.height,e.depth,s,f.data)}}else d.compressedTexImage3D(l.TEXTURE_2D_ARRAY,n,u,f.width,f.height,e.depth,0,f.data,0,0)}else L(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else g?v&&d.texSubImage3D(l.TEXTURE_2D_ARRAY,n,0,0,0,f.width,f.height,e.depth,s,c,f.data):d.texImage3D(l.TEXTURE_2D_ARRAY,n,u,f.width,f.height,e.depth,0,s,c,f.data);t.layerUpdates.size>0&&t.clearLayerUpdates()}else{g&&_&&d.texStorage2D(l.TEXTURE_2D,y,u,h[0].width,h[0].height);for(let e=0,n=h.length;e<n;e++)f=h[e],t.format===1023?g?v&&d.texSubImage2D(l.TEXTURE_2D,e,0,0,f.width,f.height,s,c,f.data):d.texImage2D(l.TEXTURE_2D,e,u,f.width,f.height,0,s,c,f.data):s===null?L(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):g?v&&d.compressedTexSubImage2D(l.TEXTURE_2D,e,0,0,f.width,f.height,s,f.data):d.compressedTexImage2D(l.TEXTURE_2D,e,u,f.width,f.height,0,f.data)}}else if(t.isDataArrayTexture){if(g){if(_&&d.texStorage3D(l.TEXTURE_2D_ARRAY,y,u,e.width,e.height,e.depth),v){if(t.layerUpdates.size>0){let n=Ys(e.width,e.height,t.format,t.type);for(let r of t.layerUpdates){let t=e.data.subarray(r*n/e.data.BYTES_PER_ELEMENT,(r+1)*n/e.data.BYTES_PER_ELEMENT);d.texSubImage3D(l.TEXTURE_2D_ARRAY,0,0,0,r,e.width,e.height,1,s,c,t)}t.clearLayerUpdates()}else d.texSubImage3D(l.TEXTURE_2D_ARRAY,0,0,0,0,e.width,e.height,e.depth,s,c,e.data)}}else d.texImage3D(l.TEXTURE_2D_ARRAY,0,u,e.width,e.height,e.depth,0,s,c,e.data)}else if(t.isData3DTexture)g?(_&&d.texStorage3D(l.TEXTURE_3D,y,u,e.width,e.height,e.depth),v&&d.texSubImage3D(l.TEXTURE_3D,0,0,0,0,e.width,e.height,e.depth,s,c,e.data)):d.texImage3D(l.TEXTURE_3D,0,u,e.width,e.height,e.depth,0,s,c,e.data);else if(t.isFramebufferTexture){if(_){if(g)d.texStorage2D(l.TEXTURE_2D,y,u,e.width,e.height);else{let t=e.width,n=e.height;for(let e=0;e<y;e++)d.texImage2D(l.TEXTURE_2D,e,u,t,n,0,s,c,null),t>>=1,n>>=1}}}else if(t.isHTMLTexture){if(`texElementImage2D`in l){let n=l.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),e.parentNode!==n){n.appendChild(e),b.add(t),n.onpaint=e=>{let t=e.changedElements;for(let e of b)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(l.texElementImage2D.length===3)l.texElementImage2D(l.TEXTURE_2D,l.RGBA8,e);else{let t=l.RGBA,n=l.RGBA,r=l.UNSIGNED_BYTE;l.texElementImage2D(l.TEXTURE_2D,0,t,n,r,e)}l.texParameteri(l.TEXTURE_2D,l.TEXTURE_MIN_FILTER,l.LINEAR),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_WRAP_S,l.CLAMP_TO_EDGE),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_WRAP_T,l.CLAMP_TO_EDGE)}}else if(h.length>0){if(g&&_){let e=Fe(h[0]);d.texStorage2D(l.TEXTURE_2D,y,u,e.width,e.height)}for(let e=0,t=h.length;e<t;e++)f=h[e],g?v&&d.texSubImage2D(l.TEXTURE_2D,e,0,0,s,c,f):d.texImage2D(l.TEXTURE_2D,e,u,s,c,f);t.generateMipmaps=!1}else if(g){if(_){let t=Fe(e);d.texStorage2D(l.TEXTURE_2D,y,u,t.width,t.height)}v&&d.texSubImage2D(l.TEXTURE_2D,0,0,0,s,c,e)}else d.texImage2D(l.TEXTURE_2D,0,u,s,c,e);D(t)&&ee(r),o.__version=a.version,t.onUpdate&&t.onUpdate(t)}e.__version=t.version}function xe(e,t,n){if(t.image.length!==6)return;let r=_e(e,t),i=t.source;d.bindTexture(l.TEXTURE_CUBE_MAP,e.__webglTexture,l.TEXTURE0+n);let a=f.get(i);if(i.version!==a.__version||r===!0){d.activeTexture(l.TEXTURE0+n);let e=Rt.getPrimaries(Rt.workingColorSpace),o=t.colorSpace===``?null:Rt.getPrimaries(t.colorSpace),s=t.colorSpace===``||e===o?l.NONE:l.BROWSER_DEFAULT_WEBGL;d.pixelStorei(l.UNPACK_FLIP_Y_WEBGL,t.flipY),d.pixelStorei(l.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),d.pixelStorei(l.UNPACK_ALIGNMENT,t.unpackAlignment),d.pixelStorei(l.UNPACK_COLORSPACE_CONVERSION_WEBGL,s);let c=t.isCompressedTexture||t.image[0].isCompressedTexture,u=t.image[0]&&t.image[0].isDataTexture,f=[];for(let e=0;e<6;e++)!c&&!u?f[e]=T(t.image[e],!0,p.maxCubemapSize):f[e]=u?t.image[e].image:t.image[e],f[e]=Pe(t,f[e]);let h=f[0],g=m.convert(t.format,t.colorSpace),_=m.convert(t.type),v=k(t.internalFormat,g,_,t.normalized,t.colorSpace),y=t.isVideoTexture!==!0,b=a.__version===void 0||r===!0,x=i.dataReady,S=A(t,h);ge(l.TEXTURE_CUBE_MAP,t);let C;if(c){y&&b&&d.texStorage2D(l.TEXTURE_CUBE_MAP,S,v,h.width,h.height);for(let e=0;e<6;e++){C=f[e].mipmaps;for(let n=0;n<C.length;n++){let r=C[n];t.format===1023?y?x&&d.texSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,n,0,0,r.width,r.height,g,_,r.data):d.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,n,v,r.width,r.height,0,g,_,r.data):g===null?L(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):y?x&&d.compressedTexSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,n,0,0,r.width,r.height,g,r.data):d.compressedTexImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,n,v,r.width,r.height,0,r.data)}}}else{if(C=t.mipmaps,y&&b){C.length>0&&S++;let e=Fe(f[0]);d.texStorage2D(l.TEXTURE_CUBE_MAP,S,v,e.width,e.height)}for(let e=0;e<6;e++)if(u){y?x&&d.texSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,0,0,0,f[e].width,f[e].height,g,_,f[e].data):d.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,0,v,f[e].width,f[e].height,0,g,_,f[e].data);for(let t=0;t<C.length;t++){let n=C[t].image[e].image;y?x&&d.texSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,t+1,0,0,n.width,n.height,g,_,n.data):d.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,t+1,v,n.width,n.height,0,g,_,n.data)}}else{y?x&&d.texSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,0,0,0,g,_,f[e]):d.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,0,v,g,_,f[e]);for(let t=0;t<C.length;t++){let n=C[t];y?x&&d.texSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,t+1,0,0,g,_,n.image[e]):d.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,t+1,v,g,_,n.image[e])}}}D(t)&&ee(l.TEXTURE_CUBE_MAP),a.__version=i.version,t.onUpdate&&t.onUpdate(t)}e.__version=t.version}function Se(e,t,n,r,i,a){let o=m.convert(n.format,n.colorSpace),s=m.convert(n.type),c=k(n.internalFormat,o,s,n.normalized,n.colorSpace),u=f.get(t),p=f.get(n);if(p.__renderTarget=t,!u.__hasExternalTextures){let e=Math.max(1,t.width>>a),n=Math.max(1,t.height>>a);i===l.TEXTURE_3D||i===l.TEXTURE_2D_ARRAY?d.texImage3D(i,a,c,e,n,t.depth,0,o,s,null):d.texImage2D(i,a,c,e,n,0,o,s,null)}d.bindFramebuffer(l.FRAMEBUFFER,e),Ne(t)?g.framebufferTexture2DMultisampleEXT(l.FRAMEBUFFER,r,i,p.__webglTexture,0,Me(t)):(i===l.TEXTURE_2D||i>=l.TEXTURE_CUBE_MAP_POSITIVE_X&&i<=l.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&l.framebufferTexture2D(l.FRAMEBUFFER,r,i,p.__webglTexture,a),d.bindFramebuffer(l.FRAMEBUFFER,null)}function Ce(e,t,n){if(l.bindRenderbuffer(l.RENDERBUFFER,e),t.depthBuffer){let r=t.depthTexture,i=r&&r.isDepthTexture?r.type:null,a=te(t.stencilBuffer,i),o=t.stencilBuffer?l.DEPTH_STENCIL_ATTACHMENT:l.DEPTH_ATTACHMENT;Ne(t)?g.renderbufferStorageMultisampleEXT(l.RENDERBUFFER,Me(t),a,t.width,t.height):n?l.renderbufferStorageMultisample(l.RENDERBUFFER,Me(t),a,t.width,t.height):l.renderbufferStorage(l.RENDERBUFFER,a,t.width,t.height),l.framebufferRenderbuffer(l.FRAMEBUFFER,o,l.RENDERBUFFER,e)}else{let e=t.textures;for(let r=0;r<e.length;r++){let i=e[r],a=m.convert(i.format,i.colorSpace),o=m.convert(i.type),s=k(i.internalFormat,a,o,i.normalized,i.colorSpace);Ne(t)?g.renderbufferStorageMultisampleEXT(l.RENDERBUFFER,Me(t),s,t.width,t.height):n?l.renderbufferStorageMultisample(l.RENDERBUFFER,Me(t),s,t.width,t.height):l.renderbufferStorage(l.RENDERBUFFER,s,t.width,t.height)}}l.bindRenderbuffer(l.RENDERBUFFER,null)}function we(e,t,n){let r=t.isWebGLCubeRenderTarget===!0;if(d.bindFramebuffer(l.FRAMEBUFFER,e),!(t.depthTexture&&t.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let i=f.get(t.depthTexture);if(i.__renderTarget=t,(!i.__webglTexture||t.depthTexture.image.width!==t.width||t.depthTexture.image.height!==t.height)&&(t.depthTexture.image.width=t.width,t.depthTexture.image.height=t.height,t.depthTexture.needsUpdate=!0),r){if(i.__webglInit===void 0&&(i.__webglInit=!0,t.depthTexture.addEventListener(`dispose`,j)),i.__webglTexture===void 0){i.__webglTexture=l.createTexture(),d.bindTexture(l.TEXTURE_CUBE_MAP,i.__webglTexture),ge(l.TEXTURE_CUBE_MAP,t.depthTexture);let e=m.convert(t.depthTexture.format),n=m.convert(t.depthTexture.type),r;t.depthTexture.format===1026?r=l.DEPTH_COMPONENT24:t.depthTexture.format===1027&&(r=l.DEPTH24_STENCIL8);for(let i=0;i<6;i++)l.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+i,0,r,t.width,t.height,0,e,n,null)}}else P(t.depthTexture,0);let a=i.__webglTexture,o=Me(t),s=r?l.TEXTURE_CUBE_MAP_POSITIVE_X+n:l.TEXTURE_2D,c=t.depthTexture.format===1027?l.DEPTH_STENCIL_ATTACHMENT:l.DEPTH_ATTACHMENT;if(t.depthTexture.format===1026)Ne(t)?g.framebufferTexture2DMultisampleEXT(l.FRAMEBUFFER,c,s,a,0,o):l.framebufferTexture2D(l.FRAMEBUFFER,c,s,a,0);else if(t.depthTexture.format===1027)Ne(t)?g.framebufferTexture2DMultisampleEXT(l.FRAMEBUFFER,c,s,a,0,o):l.framebufferTexture2D(l.FRAMEBUFFER,c,s,a,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function Te(e){let t=f.get(e),n=e.isWebGLCubeRenderTarget===!0;if(t.__boundDepthTexture!==e.depthTexture){let n=e.depthTexture;if(t.__depthDisposeCallback&&t.__depthDisposeCallback(),n){let e=()=>{delete t.__boundDepthTexture,delete t.__depthDisposeCallback,n.removeEventListener(`dispose`,e)};n.addEventListener(`dispose`,e),t.__depthDisposeCallback=e}t.__boundDepthTexture=n}if(e.depthTexture&&!t.__autoAllocateDepthBuffer){if(n)for(let n=0;n<6;n++)we(t.__webglFramebuffer[n],e,n);else{let n=e.texture.mipmaps;n&&n.length>0?we(t.__webglFramebuffer[0],e,0):we(t.__webglFramebuffer,e,0)}}else if(n){t.__webglDepthbuffer=[];for(let n=0;n<6;n++)if(d.bindFramebuffer(l.FRAMEBUFFER,t.__webglFramebuffer[n]),t.__webglDepthbuffer[n]===void 0)t.__webglDepthbuffer[n]=l.createRenderbuffer(),Ce(t.__webglDepthbuffer[n],e,!1);else{let r=e.stencilBuffer?l.DEPTH_STENCIL_ATTACHMENT:l.DEPTH_ATTACHMENT,i=t.__webglDepthbuffer[n];l.bindRenderbuffer(l.RENDERBUFFER,i),l.framebufferRenderbuffer(l.FRAMEBUFFER,r,l.RENDERBUFFER,i)}}else{let n=e.texture.mipmaps;if(n&&n.length>0?d.bindFramebuffer(l.FRAMEBUFFER,t.__webglFramebuffer[0]):d.bindFramebuffer(l.FRAMEBUFFER,t.__webglFramebuffer),t.__webglDepthbuffer===void 0)t.__webglDepthbuffer=l.createRenderbuffer(),Ce(t.__webglDepthbuffer,e,!1);else{let n=e.stencilBuffer?l.DEPTH_STENCIL_ATTACHMENT:l.DEPTH_ATTACHMENT,r=t.__webglDepthbuffer;l.bindRenderbuffer(l.RENDERBUFFER,r),l.framebufferRenderbuffer(l.FRAMEBUFFER,n,l.RENDERBUFFER,r)}}d.bindFramebuffer(l.FRAMEBUFFER,null)}function Ee(e,t,n){let r=f.get(e);t!==void 0&&Se(r.__webglFramebuffer,e,e.texture,l.COLOR_ATTACHMENT0,l.TEXTURE_2D,0),n!==void 0&&Te(e)}function De(e){let t=e.texture,n=f.get(e),r=f.get(t);e.addEventListener(`dispose`,M);let i=e.textures,a=e.isWebGLCubeRenderTarget===!0,o=i.length>1;if(o||(r.__webglTexture===void 0&&(r.__webglTexture=l.createTexture()),r.__version=t.version,h.memory.textures++),a){n.__webglFramebuffer=[];for(let e=0;e<6;e++)if(t.mipmaps&&t.mipmaps.length>0){n.__webglFramebuffer[e]=[];for(let r=0;r<t.mipmaps.length;r++)n.__webglFramebuffer[e][r]=l.createFramebuffer()}else n.__webglFramebuffer[e]=l.createFramebuffer()}else{if(t.mipmaps&&t.mipmaps.length>0){n.__webglFramebuffer=[];for(let e=0;e<t.mipmaps.length;e++)n.__webglFramebuffer[e]=l.createFramebuffer()}else n.__webglFramebuffer=l.createFramebuffer();if(o)for(let e=0,t=i.length;e<t;e++){let t=f.get(i[e]);t.__webglTexture===void 0&&(t.__webglTexture=l.createTexture(),h.memory.textures++)}if(e.samples>0&&Ne(e)===!1){n.__webglMultisampledFramebuffer=l.createFramebuffer(),n.__webglColorRenderbuffer=[],d.bindFramebuffer(l.FRAMEBUFFER,n.__webglMultisampledFramebuffer);for(let t=0;t<i.length;t++){let r=i[t];n.__webglColorRenderbuffer[t]=l.createRenderbuffer(),l.bindRenderbuffer(l.RENDERBUFFER,n.__webglColorRenderbuffer[t]);let a=m.convert(r.format,r.colorSpace),o=m.convert(r.type),s=k(r.internalFormat,a,o,r.normalized,r.colorSpace,e.isXRRenderTarget===!0),c=Me(e);l.renderbufferStorageMultisample(l.RENDERBUFFER,c,s,e.width,e.height),l.framebufferRenderbuffer(l.FRAMEBUFFER,l.COLOR_ATTACHMENT0+t,l.RENDERBUFFER,n.__webglColorRenderbuffer[t])}l.bindRenderbuffer(l.RENDERBUFFER,null),e.depthBuffer&&(n.__webglDepthRenderbuffer=l.createRenderbuffer(),Ce(n.__webglDepthRenderbuffer,e,!0)),d.bindFramebuffer(l.FRAMEBUFFER,null)}}if(a){d.bindTexture(l.TEXTURE_CUBE_MAP,r.__webglTexture),ge(l.TEXTURE_CUBE_MAP,t);for(let r=0;r<6;r++)if(t.mipmaps&&t.mipmaps.length>0)for(let i=0;i<t.mipmaps.length;i++)Se(n.__webglFramebuffer[r][i],e,t,l.COLOR_ATTACHMENT0,l.TEXTURE_CUBE_MAP_POSITIVE_X+r,i);else Se(n.__webglFramebuffer[r],e,t,l.COLOR_ATTACHMENT0,l.TEXTURE_CUBE_MAP_POSITIVE_X+r,0);D(t)&&ee(l.TEXTURE_CUBE_MAP),d.unbindTexture()}else if(o){for(let t=0,r=i.length;t<r;t++){let r=i[t],a=f.get(r),o=l.TEXTURE_2D;(e.isWebGL3DRenderTarget||e.isWebGLArrayRenderTarget)&&(o=e.isWebGL3DRenderTarget?l.TEXTURE_3D:l.TEXTURE_2D_ARRAY),d.bindTexture(o,a.__webglTexture),ge(o,r),Se(n.__webglFramebuffer,e,r,l.COLOR_ATTACHMENT0+t,o,0),D(r)&&ee(o)}d.unbindTexture()}else{let i=l.TEXTURE_2D;if((e.isWebGL3DRenderTarget||e.isWebGLArrayRenderTarget)&&(i=e.isWebGL3DRenderTarget?l.TEXTURE_3D:l.TEXTURE_2D_ARRAY),d.bindTexture(i,r.__webglTexture),ge(i,t),t.mipmaps&&t.mipmaps.length>0)for(let r=0;r<t.mipmaps.length;r++)Se(n.__webglFramebuffer[r],e,t,l.COLOR_ATTACHMENT0,i,r);else Se(n.__webglFramebuffer,e,t,l.COLOR_ATTACHMENT0,i,0);D(t)&&ee(i),d.unbindTexture()}e.depthBuffer&&Te(e)}function Oe(e){let t=e.textures;for(let n=0,r=t.length;n<r;n++){let r=t[n];if(D(r)){let t=O(e),n=f.get(r).__webglTexture;d.bindTexture(t,n),ee(t),d.unbindTexture()}}}let ke=[],Ae=[];function je(e){if(e.samples>0){if(Ne(e)===!1){let t=e.textures,n=e.width,r=e.height,i=l.COLOR_BUFFER_BIT,a=e.stencilBuffer?l.DEPTH_STENCIL_ATTACHMENT:l.DEPTH_ATTACHMENT,o=f.get(e),s=t.length>1;if(s)for(let e=0;e<t.length;e++)d.bindFramebuffer(l.FRAMEBUFFER,o.__webglMultisampledFramebuffer),l.framebufferRenderbuffer(l.FRAMEBUFFER,l.COLOR_ATTACHMENT0+e,l.RENDERBUFFER,null),d.bindFramebuffer(l.FRAMEBUFFER,o.__webglFramebuffer),l.framebufferTexture2D(l.DRAW_FRAMEBUFFER,l.COLOR_ATTACHMENT0+e,l.TEXTURE_2D,null,0);d.bindFramebuffer(l.READ_FRAMEBUFFER,o.__webglMultisampledFramebuffer);let c=e.texture.mipmaps;c&&c.length>0?d.bindFramebuffer(l.DRAW_FRAMEBUFFER,o.__webglFramebuffer[0]):d.bindFramebuffer(l.DRAW_FRAMEBUFFER,o.__webglFramebuffer);for(let c=0;c<t.length;c++){if(e.resolveDepthBuffer&&(e.depthBuffer&&(i|=l.DEPTH_BUFFER_BIT),e.stencilBuffer&&e.resolveStencilBuffer&&(i|=l.STENCIL_BUFFER_BIT)),s){l.framebufferRenderbuffer(l.READ_FRAMEBUFFER,l.COLOR_ATTACHMENT0,l.RENDERBUFFER,o.__webglColorRenderbuffer[c]);let e=f.get(t[c]).__webglTexture;l.framebufferTexture2D(l.DRAW_FRAMEBUFFER,l.COLOR_ATTACHMENT0,l.TEXTURE_2D,e,0)}l.blitFramebuffer(0,0,n,r,0,0,n,r,i,l.NEAREST),_===!0&&(ke.length=0,Ae.length=0,ke.push(l.COLOR_ATTACHMENT0+c),e.depthBuffer&&e.storeMultisampledDepthBuffer===!1&&(ke.push(a),Ae.push(a),l.invalidateFramebuffer(l.DRAW_FRAMEBUFFER,Ae)),l.invalidateFramebuffer(l.READ_FRAMEBUFFER,ke))}if(d.bindFramebuffer(l.READ_FRAMEBUFFER,null),d.bindFramebuffer(l.DRAW_FRAMEBUFFER,null),s)for(let e=0;e<t.length;e++){d.bindFramebuffer(l.FRAMEBUFFER,o.__webglMultisampledFramebuffer),l.framebufferRenderbuffer(l.FRAMEBUFFER,l.COLOR_ATTACHMENT0+e,l.RENDERBUFFER,o.__webglColorRenderbuffer[e]);let n=f.get(t[e]).__webglTexture;d.bindFramebuffer(l.FRAMEBUFFER,o.__webglFramebuffer),l.framebufferTexture2D(l.DRAW_FRAMEBUFFER,l.COLOR_ATTACHMENT0+e,l.TEXTURE_2D,n,0)}d.bindFramebuffer(l.DRAW_FRAMEBUFFER,o.__webglMultisampledFramebuffer)}else if(e.depthBuffer&&e.storeMultisampledDepthBuffer===!1&&_){let t=e.stencilBuffer?l.DEPTH_STENCIL_ATTACHMENT:l.DEPTH_ATTACHMENT;l.invalidateFramebuffer(l.DRAW_FRAMEBUFFER,[t])}}}function Me(e){return Math.min(p.maxSamples,e.samples)}function Ne(e){let t=f.get(e);return e.samples>0&&u.has(`WEBGL_multisampled_render_to_texture`)===!0&&t.__useRenderToTexture!==!1}function F(e){let t=h.render.frame;y.get(e)!==t&&(y.set(e,t),e.update())}function Pe(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(Rt.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&L(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):R(`WebGLTextures: Unsupported texture color space:`,n)),t}function Fe(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(v.width=e.naturalWidth||e.width,v.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(v.width=e.displayWidth,v.height=e.displayHeight):(v.width=e.width,v.height=e.height),v}this.allocateTextureUnit=ce,this.resetTextureUnits=ae,this.getTextureUnits=oe,this.setTextureUnits=se,this.setTexture2D=P,this.setTexture2DArray=ue,this.setTexture3D=de,this.setTextureCube=fe,this.rebindTextures=Ee,this.setupRenderTarget=De,this.updateRenderTargetMipmap=Oe,this.updateMultisampleRenderTarget=je,this.setupDepthRenderbuffer=Te,this.setupFrameBufferTexture=Se,this.useMultisampledRTT=Ne,this.isReversedDepthBuffer=function(){return d.buffers.depth.getReversed()}}function nd(e,t){function n(n,r=``){let i,a=Rt.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var rd=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,id=`
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

}`,ad=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new ea(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Fo({vertexShader:rd,fragmentShader:id,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new H(new wo(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},od=class extends nt{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,u=null,d=null,f=null,p=null,h=null,g=typeof XRWebGLBinding<`u`,_=new ad,v={},b=t.getContextAttributes(),x=null,S=null,C=[],D=[],ee=new z,O=null,k=null,te=new Ts;te.viewport=new Yt;let A=new Ts;A.viewport=new Yt;let j=[te,A],M=new Ps,ne=null,N=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=C[e];return t===void 0&&(t=new jn,C[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=C[e];return t===void 0&&(t=new jn,C[e]=t),t.getGripSpace()},this.getHand=function(e){let t=C[e];return t===void 0&&(t=new jn,C[e]=t),t.getHandSpace()};function re(e){let t=D.indexOf(e.inputSource);if(t===-1)return;let n=C[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function ie(){r.removeEventListener(`select`,re),r.removeEventListener(`selectstart`,re),r.removeEventListener(`selectend`,re),r.removeEventListener(`squeeze`,re),r.removeEventListener(`squeezestart`,re),r.removeEventListener(`squeezeend`,re),r.removeEventListener(`end`,ie),r.removeEventListener(`inputsourceschange`,ae);for(let e=0;e<C.length;e++){let t=D[e];t!==null&&(D[e]=null,C[e].disconnect(t))}ne=null,N=null,_.reset();for(let e in v)delete v[e];if(e.setRenderTarget(x),p=null,f=null,d=null,r=null,S=null,fe.stop(),n.isPresenting=!1,e.setPixelRatio(O),e.setSize(ee.width,ee.height,!1),k!==null){let e=k.camera;e.fov=k.fov,e.zoom=k.zoom,e.updateProjectionMatrix(),k=null}n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&L(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&L(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return f===null?p:f},this.getBinding=function(){return d===null&&g&&(d=new XRWebGLBinding(r,t)),d},this.getFrame=function(){return h},this.getSession=function(){return r},this.setSession=async function(u){if(r=u,r!==null){if(x=e.getRenderTarget(),r.addEventListener(`select`,re),r.addEventListener(`selectstart`,re),r.addEventListener(`selectend`,re),r.addEventListener(`squeeze`,re),r.addEventListener(`squeezestart`,re),r.addEventListener(`squeezeend`,re),r.addEventListener(`end`,ie),r.addEventListener(`inputsourceschange`,ae),b.xrCompatible!==!0&&await t.makeXRCompatible(),O=e.getPixelRatio(),e.getSize(ee),g&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;b.depth&&(o=b.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=b.stencil?E:T,a=b.stencil?y:m);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};d=this.getBinding(),f=d.createProjectionLayer(s),r.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),S=new Zt(f.textureWidth,f.textureHeight,{format:w,type:l,depthTexture:new Qi(f.textureWidth,f.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:b.stencil,colorSpace:e.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}else{let n={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:i};p=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),S=new Zt(p.framebufferWidth,p.framebufferHeight,{format:w,type:l,colorSpace:e.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1,storeMultisampledDepthBuffer:p.ignoreDepthValues===!1,storeMultisampledStencilBuffer:p.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),fe.setContext(r),fe.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function ae(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=D.indexOf(n);r>=0&&(D[r]=null,C[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=D.indexOf(n);if(r===-1){for(let e=0;e<C.length;e++)if(e>=D.length){D.push(n),r=e;break}else if(D[e]===null){D[e]=n,r=e;break}if(r===-1)break}let i=C[r];i&&i.connect(n)}}let oe=new B,se=new B;function ce(e,t,n){oe.setFromMatrixPosition(t.matrixWorld),se.setFromMatrixPosition(n.matrixWorld);let r=oe.distanceTo(se),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function le(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;_.texture!==null&&(_.depthNear>0&&(t=_.depthNear),_.depthFar>0&&(n=_.depthFar)),M.near=A.near=te.near=t,M.far=A.far=te.far=n,(ne!==M.near||N!==M.far)&&(r.updateRenderState({depthNear:M.near,depthFar:M.far}),ne=M.near,N=M.far),M.layers.mask=e.layers.mask|6,te.layers.mask=M.layers.mask&-5,A.layers.mask=M.layers.mask&-3;let i=e.parent,a=M.cameras;le(M,i);for(let e=0;e<a.length;e++)le(a[e],i);a.length===2?ce(M,te,A):M.projectionMatrix.copy(te.projectionMatrix),k===null&&e.isPerspectiveCamera&&(k={camera:e,fov:e.fov,zoom:e.zoom}),P(e,M,i)};function P(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=ot*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(f!==null||p!==null)return s},this.setFoveation=function(e){s=e,f!==null&&(f.fixedFoveation=e),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=e)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(M)},this.getCameraTexture=function(e){return v[e]};let ue=null;function de(t,i){if(u=i.getViewerPose(c||a),h=i,u!==null){let t=u.views;p!==null&&(e.setRenderTargetFramebuffer(S,p.framebuffer),e.setRenderTarget(S));let i=!1;t.length!==M.cameras.length&&(M.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(p!==null)a=p.getViewport(r);else{let t=d.getViewSubImage(f,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(S,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(S))}let o=j[n];o===void 0&&(o=new Ts,o.layers.enable(n),o.viewport=new Yt,j[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(M.matrix.copy(o.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),i===!0&&M.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&g){d=n.getBinding();let e=d.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&_.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&g){e.state.unbindTexture(),d=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=v[n];e||(e=new ea,v[n]=e);let t=d.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<C.length;e++){let t=D[e],n=C[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}ue&&ue(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),h=null}let fe=new Zs;fe.setAnimationLoop(de),this.setAnimationLoop=function(e){ue=e},this.dispose=function(){}}},sd=new en,cd=new Nt;cd.set(-1,0,0,0,1,0,0,0,1);function ld(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,jo(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(sd.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(cd),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.retroreflectivity>0&&(e.retroreflectivity.value=t.retroreflectivity),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function ud(e,t,n,r){let i={},a={},o=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(g(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,v));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return R(`WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)p(t[n],e,n,a);else p(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(t,n,r,i){if(h(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=_(i);m(i,t.__data,e),typeof i!=`number`&&typeof i!=`boolean`&&!i.isMatrix3&&!ArrayBuffer.isView(i)&&(e+=a.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function m(e,t,n){typeof e==`number`||typeof e==`boolean`?t[0]=e:e.isMatrix3?(t[0]=e.elements[0],t[1]=e.elements[1],t[2]=e.elements[2],t[3]=0,t[4]=e.elements[3],t[5]=e.elements[4],t[6]=e.elements[5],t[7]=0,t[8]=e.elements[6],t[9]=e.elements[7],t[10]=e.elements[8],t[11]=0):ArrayBuffer.isView(e)?t.set(new e.constructor(e.buffer,e.byteOffset,t.length)):e.toArray(t,n)}function h(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return r[a]=typeof i==`number`||typeof i==`boolean`?i:ArrayBuffer.isView(i)?i.slice():i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(ArrayBuffer.isView(i))return!0;else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function g(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=_(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function _(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?L(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(t.boundary=16,t.storage=e.byteLength):L(`WebGLRenderer: Unsupported uniform value type.`,e),t}function v(t){let n=t.target;n.removeEventListener(`dispose`,v);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function y(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:y}}var dd=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),fd=null;function pd(){return fd===null&&(fd=new Ci(dd,16,16,O,g),fd.name=`DFG_LUT`,fd.minFilter=o,fd.magFilter=o,fd.wrapS=t,fd.wrapT=t,fd.generateMipmaps=!1,fd.needsUpdate=!0),fd}var md=class{constructor(e={}){let{canvas:t=Ye(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:u=!1,powerPreference:d=`default`,failIfMajorPerformanceCaveat:p=!1,reversedDepthBuffer:h=!1,outputBufferType:b=l}=e;this.isWebGLRenderer=!0;let x;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);x=n.getContextAttributes().alpha}else x=a;let S=b,C=new Set([te,k,ee]),w=new Set([l,m,f,y,_,v]),T=new Uint32Array(4),E=new Int32Array(4),D=new B,O=null,A=null,j=[],M=[],ne=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let N=this,re=!1,ie=null,ae=null,oe=null,se=null;this._outputColorSpace=ze;let ce=0,le=0,P=null,ue=-1,de=null,fe=new Yt,pe=new Yt,me=null,he=new V(0),ge=0,_e=t.width,ve=t.height,ye=1,be=null,xe=null,Se=new Yt(0,0,_e,ve),Ce=new Yt(0,0,_e,ve),we=!1,Te=new Ii,Ee=!1,De=!1,Oe=new en,ke=new B,Ae=new Yt,je={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Me=!1;function Ne(){return P===null?ye:1}let F=n;function Pe(e,n){return t.getContext(e,n)}let Fe,Ie,I,Le,Re,Be,Ve,He,Ue,We,Ke,qe,Je,Xe,Qe,$e,tt,nt,rt,it,at,ot,st;try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:u,powerPreference:d,failIfMajorPerformanceCaveat:p};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r186`),t.addEventListener(`webglcontextlost`,ut,!1),t.addEventListener(`webglcontextrestored`,dt,!1),t.addEventListener(`webglcontextcreationerror`,ft,!1),F===null){let t=`webgl2`;if(F=Pe(t,e),F===null)throw Pe(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}ct()}catch(e){throw t.removeEventListener(`webglcontextlost`,ut,!1),t.removeEventListener(`webglcontextrestored`,dt,!1),t.removeEventListener(`webglcontextcreationerror`,ft,!1),R(`WebGLRenderer: `+e.message),e}function ct(){Fe=new Mc(F),Fe.init(),at=new nd(F,Fe),Ie=new sc(F,Fe,e,at),I=new ed(F,Fe),Ie.reversedDepthBuffer&&h&&I.buffers.depth.setReversed(!0),ae=F.createFramebuffer(),oe=F.createFramebuffer(),se=F.createFramebuffer(),Le=new Fc(F),Re=new Pu,Be=new td(F,Fe,I,Re,Ie,at,Le),Ve=new jc(N),He=new Qs(F),ot=new ac(F,He),Ue=new Nc(F,He,Le,ot),We=new Lc(F,Ue,He,ot,Le),nt=new Ic(F,Ie,Be),Qe=new cc(Re),Ke=new Nu(N,Ve,Fe,Ie,ot,Qe),qe=new ld(N,Re),Je=new Ru,Xe=new Gu(Fe),tt=new ic(N,Ve,I,We,x,s),$e=new $u(N,We,Ie),st=new ud(F,Le,Ie,I),rt=new oc(F,Fe,Le),it=new Pc(F,Fe,Le),Le.programs=Ke.programs,N.capabilities=Ie,N.extensions=Fe,N.properties=Re,N.renderLists=Je,N.shadowMap=$e,N.state=I,N.info=Le}S!==1009&&(ne=new zc(S,t.width,t.height,o,r,i));let lt=new od(N,F);this.xr=lt,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){let e=Fe.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=Fe.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return ye},this.setPixelRatio=function(e){e!==void 0&&(ye=e,this.setSize(_e,ve,!1))},this.getSize=function(e){return e.set(_e,ve)},this.setSize=function(e,n,r=!0){lt.isPresenting?L(`WebGLRenderer: Can't change size while VR device is presenting.`):(_e=e,ve=n,t.width=Math.floor(e*ye),t.height=Math.floor(n*ye),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),ne!==null&&ne.setSize(t.width,t.height),this.setViewport(0,0,e,n))},this.getDrawingBufferSize=function(e){return e.set(_e*ye,ve*ye).floor()},this.setDrawingBufferSize=function(e,n,r){_e=e,ve=n,ye=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(S===1009)R(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);else{if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){L(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}ne.setEffects(e||[])}},this.getCurrentViewport=function(e){return e.copy(fe)},this.getViewport=function(e){return e.copy(Se)},this.setViewport=function(e,t,n,r){e.isVector4?Se.set(e.x,e.y,e.z,e.w):Se.set(e,t,n,r),I.viewport(fe.copy(Se).multiplyScalar(ye).round())},this.getScissor=function(e){return e.copy(Ce)},this.setScissor=function(e,t,n,r){e.isVector4?Ce.set(e.x,e.y,e.z,e.w):Ce.set(e,t,n,r),I.scissor(pe.copy(Ce).multiplyScalar(ye).round())},this.getScissorTest=function(){return we},this.setScissorTest=function(e){I.setScissorTest(we=e)},this.setOpaqueSort=function(e){be=e},this.setTransparentSort=function(e){xe=e},this.getClearColor=function(e){return e.copy(tt.getClearColor())},this.setClearColor=function(){tt.setClearColor(...arguments)},this.getClearAlpha=function(){return tt.getClearAlpha()},this.setClearAlpha=function(){tt.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(P!==null){let t=P.texture.format;e=C.has(t)}if(e){let e=P.texture.type,t=w.has(e),n=tt.getClearColor(),r=tt.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(T[0]=i,T[1]=a,T[2]=o,T[3]=r,F.clearBufferuiv(F.COLOR,0,T)):(E[0]=i,E[1]=a,E[2]=o,E[3]=r,F.clearBufferiv(F.COLOR,0,E))}else r|=F.COLOR_BUFFER_BIT}t&&(r|=F.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&F.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),ie=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,ut,!1),t.removeEventListener(`webglcontextrestored`,dt,!1),t.removeEventListener(`webglcontextcreationerror`,ft,!1),tt.dispose(),Je.dispose(),Xe.dispose(),Re.dispose(),Ve.dispose(),We.dispose(),ot.dispose(),st.dispose(),Ke.dispose(),lt.dispose(),lt.removeEventListener(`sessionstart`,yt),lt.removeEventListener(`sessionend`,bt),xt.stop()};function ut(e){e.preventDefault(),Ze(`WebGLRenderer: Context Lost.`),re=!0}function dt(){Ze(`WebGLRenderer: Context Restored.`),re=!1;let e=Le.autoReset,t=$e.enabled,n=$e.autoUpdate,r=$e.needsUpdate,i=$e.type;ct(),Le.autoReset=e,$e.enabled=t,$e.autoUpdate=n,$e.needsUpdate=r,$e.type=i}function ft(e){R(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function pt(e){let t=e.target;t.removeEventListener(`dispose`,pt),mt(t)}function mt(e){ht(e),Re.remove(e)}function ht(e){let t=Re.get(e).programs;t!==void 0&&(t.forEach(function(e){Ke.releaseProgram(e)}),e.isShaderMaterial&&Ke.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=je);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=At(e,t,n,r,i);I.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=Ue.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;ot.setup(i,r,s,n,c);let h,g=rt;if(c!==null&&(h=He.get(c),g=it,g.setIndex(h)),i.isMesh)r.wireframe===!0?(I.setLineWidth(r.wireframeLinewidth*Ne()),g.setMode(F.LINES)):g.setMode(F.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),I.setLineWidth(e*Ne()),i.isLineSegments?g.setMode(F.LINES):i.isLineLoop?g.setMode(F.LINE_LOOP):g.setMode(F.LINE_STRIP)}else i.isPoints?g.setMode(F.POINTS):i.isSprite&&g.setMode(F.TRIANGLES);if(i.isBatchedMesh){if(Fe.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?He.get(c).bytesPerElement:1,o=Re.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(F,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function gt(e,t,n,r){ie!==null&&e.isNodeMaterial&&ie.setObject(r,e),Ee===!0&&Qe.setState(e,n,!1),e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,Dt(e,t,r),e.side=0,e.needsUpdate=!0,Dt(e,t,r),e.side=2):Dt(e,t,r)}this.compile=function(e,t,n=null){n===null&&(n=e),ie!==null&&ie.renderStart(e,t,n),A=Xe.get(n),A.init(t),M.push(A),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(A.pushLight(e),e.castShadow&&A.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(A.pushLight(e),e.castShadow&&A.pushShadow(e))}),A.setupLights(),ie!==null&&ie.updateLights(A.state.lightsArray),De=this.localClippingEnabled,Ee=Qe.init(this.clippingPlanes,De),Ee===!0&&Qe.setGlobalState(this.clippingPlanes,t),ie!==null&&$e.render(A.state.shadowsArray,n,t);let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let i=e.material;if(i){if(Array.isArray(i))for(let a=0;a<i.length;a++){let o=i[a];gt(o,n,t,e),r.add(o)}else gt(i,n,t,e),r.add(i)}}),A=M.pop(),ie!==null&&ie.renderEnd(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){r.forEach(function(e){let t=Re.get(e).currentProgram;(t===void 0||t.isReady())&&r.delete(e)}),r.size===0?t(e):setTimeout(n,10)}Fe.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let _t=null;function vt(e){_t&&_t(e)}function yt(){xt.stop()}function bt(){xt.start()}let xt=new Zs;xt.setAnimationLoop(vt),typeof self<`u`&&xt.setContext(self),this.setAnimationLoop=function(e){_t=e,lt.setAnimationLoop(e),e===null?xt.stop():xt.start()},lt.addEventListener(`sessionstart`,yt),lt.addEventListener(`sessionend`,bt),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){R(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(re===!0)return;ie!==null&&ie.renderStart(e,t);let n=lt.enabled===!0&&lt.isPresenting===!0,r=ne!==null&&(P===null||n)&&ne.begin(N,P);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),lt.enabled===!0&&lt.isPresenting===!0&&(ne===null||ne.isCompositing()===!1)&&(lt.cameraAutoUpdate===!0&&lt.updateCamera(t),t=lt.getCamera()),e.isScene===!0&&e.onBeforeRender(N,e,t,P),A=Xe.get(e,M.length),A.init(t),A.state.textureUnits=Be.getTextureUnits(),M.push(A),Oe.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),Te.setFromProjectionMatrix(Oe,Ge,t.reversedDepth),De=this.localClippingEnabled,Ee=Qe.init(this.clippingPlanes,De),O=Je.get(e,j.length),O.init(),j.push(O),lt.enabled===!0&&lt.isPresenting===!0){let e=N.xr.getDepthSensingMesh();e!==null&&St(e,t,-1/0,N.sortObjects)}St(e,t,0,N.sortObjects),O.finish(),ie!==null&&ie.updateLights(A.state.lightsArray),N.sortObjects===!0&&O.sort(be,xe),Me=lt.enabled===!1||lt.isPresenting===!1||lt.hasDepthSensing()===!1,Me&&tt.addToRenderList(O,e),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Ee===!0&&Qe.beginShadows();let i=A.state.shadowsArray;if($e.render(i,e,t),Ee===!0&&Qe.endShadows(),(r&&ne.hasRenderPass())===!1){let n=O.opaque,r=O.transmissive;if(A.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];wt(n,r,e,a)}Me&&tt.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];Ct(O,e,n,n.viewport)}}else r.length>0&&wt(n,r,e,t),Me&&tt.render(e),Ct(O,e,t)}P!==null&&le===0&&(Be.updateMultisampleRenderTarget(P),Be.updateRenderTargetMipmap(P)),r&&ne.end(N),e.isScene===!0&&e.onAfterRender(N,e,t),ot.resetDefaultState(),ue=-1,de=null,M.pop(),M.length>0?(A=M[M.length-1],Be.setTextureUnits(A.state.textureUnits),Ee===!0&&Qe.setGlobalState(N.clippingPlanes,A.state.camera)):A=null,j.pop(),O=j.length>0?j[j.length-1]:null,ie!==null&&ie.renderEnd()};function St(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLightProbeGrid)A.pushLightProbeGrid(e);else if(e.isLight)A.pushLight(e),e.castShadow&&A.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||e.intersectsFrustum(Te)){r&&Ae.setFromMatrixPosition(e.matrixWorld).applyMatrix4(Oe);let i=We.update(e),a=e.material;a.visible&&O.push(e,i,a,n,Ae.z,null,t)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||e.intersectsFrustum(Te))){let i=We.update(e),a=e.material;if(r&&(e.boundingSphere===void 0?(i.boundingSphere===null&&i.computeBoundingSphere(),Ae.copy(i.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),Ae.copy(e.boundingSphere.center)),Ae.applyMatrix4(e.matrixWorld).applyMatrix4(Oe)),Array.isArray(a)){let r=i.groups;for(let o=0,s=r.length;o<s;o++){let s=r[o],c=a[s.materialIndex];c&&c.visible&&O.push(e,i,c,n,Ae.z,s,t)}}else a.visible&&O.push(e,i,a,n,Ae.z,null,t)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)St(i[e],t,n,r)}function Ct(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;A.setupLightsView(n),Ee===!0&&Qe.setGlobalState(N.clippingPlanes,n),r&&I.viewport(fe.copy(r)),i.length>0&&Tt(i,t,n),a.length>0&&Tt(a,t,n),o.length>0&&Tt(o,t,n),I.buffers.depth.setTest(!0),I.buffers.depth.setMask(!0),I.buffers.color.setMask(!0),I.setPolygonOffset(!1)}function wt(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(A.state.transmissionRenderTarget[r.id]===void 0){let e=Fe.has(`EXT_color_buffer_half_float`)||Fe.has(`EXT_color_buffer_float`);A.state.transmissionRenderTarget[r.id]=new Zt(1,1,{generateMipmaps:!0,type:e?g:l,minFilter:c,samples:Math.max(4,Ie.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Rt.workingColorSpace})}let a=A.state.transmissionRenderTarget[r.id],o=r.viewport||fe;a.setSize(o.z*N.transmissionResolutionScale,o.w*N.transmissionResolutionScale);let s=N.getRenderTarget(),u=N.getActiveCubeFace(),d=N.getActiveMipmapLevel();N.setRenderTarget(a),N.getClearColor(he),ge=N.getClearAlpha(),ge<1&&N.setClearColor(16777215,.5),N.clear(),Me&&tt.render(n);let f=N.toneMapping;N.toneMapping=0;let p=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),A.setupLightsView(r),Ee===!0&&Qe.setGlobalState(N.clippingPlanes,r),Tt(e,n,r),Be.updateMultisampleRenderTarget(a),Be.updateRenderTargetMipmap(a),Fe.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,Et(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(Be.updateMultisampleRenderTarget(a),Be.updateRenderTargetMipmap(a))}N.setRenderTarget(s,u,d),N.setClearColor(he,ge),p!==void 0&&(r.viewport=p),N.toneMapping=f}function Tt(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&Et(o,t,n,s,l,c)}}function Et(e,t,n,r,i,a){ie!==null&&i.isNodeMaterial&&ie.setObject(e,i),e.onBeforeRender(N,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(N,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,N.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,N.renderBufferDirect(n,t,r,i,e,a),i.side=2):N.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(N,t,n,r,i,a)}function Dt(e,t,n){t.isScene!==!0&&(t=je);let r=Re.get(e),i=A.state.lights,a=A.state.shadowsArray,o=i.state.version,s=Ke.getParameters(e,i.state,a,t,n,A.state.lightProbeGridArray),c=Ke.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=Ve.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,pt),l=new Map,r.programs=l);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return kt(e,s),d}else s.uniforms=Ke.getUniforms(e),ie!==null&&e.isNodeMaterial&&ie.build(e,n,s),e.onBeforeCompile(s,N),d=Ke.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=Qe.uniform),kt(e,s),r.needsLights=Mt(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.sunLights.value=i.state.sun,f.sunLightShadows.value=i.state.sunShadow,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.sunShadowMatrix.value=i.state.sunShadowMatrix,f.sunShadowCascade.value=i.state.sunShadowCascade,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.lightProbeGrid=A.state.lightProbeGridArray.length>0,r.currentProgram=d,r.uniformsList=null,d}function Ot(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=Kl.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function kt(e,t){let n=Re.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function z(e,t){if(e.length===0)return null;if(e.length===1)return e[0].texture===null?null:e[0];D.setFromMatrixPosition(t.matrixWorld);for(let t=0,n=e.length;t<n;t++){let n=e[t];if(n.texture!==null&&n.boundingBox.containsPoint(D))return n}return null}function At(e,t,n,r,i){t.isScene!==!0&&(t=je),Be.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=P===null?N.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:Rt.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=Ve.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(P===null||P.isXRRenderTarget===!0)&&(h=N.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=Re.get(r),y=A.state.lights;if(Ee===!0&&(De===!0||e!==de)){let t=e===de&&r.id===ue;Qe.setState(r,e,t)}let b=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==y.state.version?b=!0:v.outputColorSpace===s?i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i._colorsTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i._colorsTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?b=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==Qe.numPlanes||v.numIntersection!==Qe.numIntersection)?b=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.toneMapping===h&&v.morphTargetsCount===_?!!v.lightProbeGrid!=A.state.lightProbeGridArray.length>0&&(b=!0):b=!0:b=!0:b=!0:(b=!0,v.__version=r.version);let x=v.currentProgram;b===!0&&(x=Dt(r,t,i),ie&&r.isNodeMaterial&&ie.onUpdateProgram(r,x,v));let S=!1,C=!1,w=!1,T=x.getUniforms(),E=v.uniforms;if(I.useProgram(x.program)&&(S=!0,C=!0,w=!0),r.id!==ue&&(ue=r.id,C=!0),v.needsLights){let e=z(A.state.lightProbeGridArray,i);v.lightProbeGrid!==e&&(v.lightProbeGrid=e,C=!0)}if(S||de!==e){I.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),T.setValue(F,`projectionMatrix`,e.projectionMatrix),T.setValue(F,`viewMatrix`,e.matrixWorldInverse);let t=T.map.cameraPosition;t!==void 0&&t.setValue(F,ke.setFromMatrixPosition(e.matrixWorld)),Ie.logarithmicDepthBuffer&&T.setValue(F,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&T.setValue(F,`isOrthographic`,e.isOrthographicCamera===!0),de!==e&&(de=e,C=!0,w=!0)}if(v.needsLights&&(y.state.sunShadowMap.length>0&&T.setValue(F,`sunShadowMap`,y.state.sunShadowMap,Be),y.state.directionalShadowMap.length>0&&T.setValue(F,`directionalShadowMap`,y.state.directionalShadowMap,Be),y.state.spotShadowMap.length>0&&T.setValue(F,`spotShadowMap`,y.state.spotShadowMap,Be),y.state.pointShadowMap.length>0&&T.setValue(F,`pointShadowMap`,y.state.pointShadowMap,Be)),i.isSkinnedMesh){T.setOptional(F,i,`bindMatrix`),T.setOptional(F,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),T.setValue(F,`boneTexture`,e.boneTexture,Be))}i.isBatchedMesh&&(T.setOptional(F,i,`batchingTexture`),T.setValue(F,`batchingTexture`,i._matricesTexture,Be),T.setOptional(F,i,`batchingIdTexture`),T.setValue(F,`batchingIdTexture`,i._indirectTexture,Be),T.setOptional(F,i,`batchingColorTexture`),i._colorsTexture!==null&&T.setValue(F,`batchingColorTexture`,i._colorsTexture,Be));let D=n.morphAttributes;if((D.position!==void 0||D.normal!==void 0||D.color!==void 0)&&nt.update(i,n,x),(C||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,T.setValue(F,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(E.envMapIntensity.value=t.environmentIntensity),E.dfgLUT!==void 0&&(E.dfgLUT.value=pd()),C){if(T.setValue(F,`toneMappingExposure`,N.toneMappingExposure),v.needsLights&&jt(E,w),a&&r.fog===!0&&qe.refreshFogUniforms(E,a),qe.refreshMaterialUniforms(E,r,ye,ve,A.state.transmissionRenderTarget[e.id]),v.needsLights&&v.lightProbeGrid){let e=v.lightProbeGrid;E.probesSH.value=e.texture,E.probesMin.value.copy(e.boundingBox.min),E.probesMax.value.copy(e.boundingBox.max),E.probesResolution.value.copy(e.resolution)}Kl.upload(F,Ot(v),E,Be)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(Kl.upload(F,Ot(v),E,Be),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&T.setValue(F,`center`,i.center),T.setValue(F,`modelViewMatrix`,i.modelViewMatrix),T.setValue(F,`normalMatrix`,i.normalMatrix),T.setValue(F,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];st.update(n,x),st.bind(n,x)}}return x}function jt(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.sunLights.needsUpdate=t,e.sunLightShadows.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function Mt(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return ce},this.getActiveMipmapLevel=function(){return le},this.getRenderTarget=function(){return P},this.setRenderTargetTextures=function(e,t,n){let r=Re.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),Re.get(e.texture).__webglTexture=t,Re.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=Re.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){P=e,ce=t,le=n;let r=null,i=!1,a=!1;if(e){let o=Re.get(e);if(o.__useDefaultFramebuffer!==void 0){I.bindFramebuffer(F.FRAMEBUFFER,o.__webglFramebuffer),fe.copy(e.viewport),pe.copy(e.scissor),me=e.scissorTest,I.viewport(fe),I.scissor(pe),I.setScissorTest(me),ue=-1;return}if(o.__webglFramebuffer===void 0)Be.setupRenderTarget(e);else if(o.__hasExternalTextures)Be.rebindTextures(e,Re.get(e.texture).__webglTexture,Re.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&Re.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);Be.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=Re.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&Be.useMultisampledRTT(e)===!1?Re.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,fe.copy(e.viewport),pe.copy(e.scissor),me=e.scissorTest}else fe.copy(Se).multiplyScalar(ye).floor(),pe.copy(Ce).multiplyScalar(ye).floor(),me=we;if(n!==0&&(r=ae),I.bindFramebuffer(F.FRAMEBUFFER,r)&&I.drawBuffers(e,r),I.viewport(fe),I.scissor(pe),I.setScissorTest(me),i){let r=Re.get(e.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=Re.get(e.textures[t]);F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=Re.get(e.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,t.__webglTexture,n)}ue=-1};function Nt(e){let t=Re.get(e);return(t.__readFormat!==e.format||t.__readType!==e.type)&&(t.__readFormat=e.format,t.__readType=e.type,t.__formatReadable=Ie.textureFormatReadable(e.format),t.__typeReadable=Ie.textureTypeReadable(e.type)),t}this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){R(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=Re.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){I.bindFramebuffer(F.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;e.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+s);let u=Nt(o);if(u.__formatReadable===!1){R(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(u.__typeReadable===!1){R(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&F.readPixels(t,n,r,i,at.convert(c),at.convert(l),a)}finally{let e=P===null?null:Re.get(P).__webglFramebuffer;I.bindFramebuffer(F.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=Re.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){I.bindFramebuffer(F.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;e.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+s);let d=Nt(o);if(d.__formatReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(d.__typeReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let f=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,f),F.bufferData(F.PIXEL_PACK_BUFFER,a.byteLength,F.STREAM_READ),F.readPixels(t,n,r,i,at.convert(l),at.convert(u),0),F.bindBuffer(F.PIXEL_PACK_BUFFER,null);let p=P===null?null:Re.get(P).__webglFramebuffer;I.bindFramebuffer(F.FRAMEBUFFER,p);let m=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await et(F,m,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,f),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,a),F.bindBuffer(F.PIXEL_PACK_BUFFER,null),F.deleteBuffer(f),F.deleteSync(m),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;Be.setTexture2D(e,0),F.copyTexSubImage2D(F.TEXTURE_2D,n,0,0,o,s,i,a),I.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=at.convert(t.format),_=at.convert(t.type),v;t.isData3DTexture?(Be.setTexture3D(t,0),v=F.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(Be.setTexture2DArray(t,0),v=F.TEXTURE_2D_ARRAY):(Be.setTexture2D(t,0),v=F.TEXTURE_2D),I.activeTexture(F.TEXTURE0),I.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,t.flipY),I.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),I.pixelStorei(F.UNPACK_ALIGNMENT,t.unpackAlignment);let y=I.getParameter(F.UNPACK_ROW_LENGTH),b=I.getParameter(F.UNPACK_IMAGE_HEIGHT),x=I.getParameter(F.UNPACK_SKIP_PIXELS),S=I.getParameter(F.UNPACK_SKIP_ROWS),C=I.getParameter(F.UNPACK_SKIP_IMAGES);I.pixelStorei(F.UNPACK_ROW_LENGTH,h.width),I.pixelStorei(F.UNPACK_IMAGE_HEIGHT,h.height),I.pixelStorei(F.UNPACK_SKIP_PIXELS,l),I.pixelStorei(F.UNPACK_SKIP_ROWS,u),I.pixelStorei(F.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=Re.get(e),r=Re.get(t),h=Re.get(n.__renderTarget),g=Re.get(r.__renderTarget);I.bindFramebuffer(F.READ_FRAMEBUFFER,h.__webglFramebuffer),I.bindFramebuffer(F.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Re.get(e).__webglTexture,i,d+n),F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Re.get(t).__webglTexture,a,m+n)),F.blitFramebuffer(l,u,o,s,f,p,o,s,F.DEPTH_BUFFER_BIT,F.NEAREST);I.bindFramebuffer(F.READ_FRAMEBUFFER,null),I.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||Re.has(e)){let n=Re.get(e),r=Re.get(t);I.bindFramebuffer(F.READ_FRAMEBUFFER,oe),I.bindFramebuffer(F.DRAW_FRAMEBUFFER,se);for(let e=0;e<c;e++)w?F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):F.framebufferTexture2D(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,n.__webglTexture,i),T?F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):F.framebufferTexture2D(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,r.__webglTexture,a),i===0?T?F.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):F.copyTexSubImage2D(v,a,f,p,l,u,o,s):F.blitFramebuffer(l,u,o,s,f,p,o,s,F.COLOR_BUFFER_BIT,F.NEAREST);I.bindFramebuffer(F.READ_FRAMEBUFFER,null),I.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?F.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?F.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):F.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):F.texSubImage2D(F.TEXTURE_2D,a,f,p,o,s,g,_,h);I.pixelStorei(F.UNPACK_ROW_LENGTH,y),I.pixelStorei(F.UNPACK_IMAGE_HEIGHT,b),I.pixelStorei(F.UNPACK_SKIP_PIXELS,x),I.pixelStorei(F.UNPACK_SKIP_ROWS,S),I.pixelStorei(F.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&F.generateMipmap(v),I.unbindTexture()},this.initRenderTarget=function(e){Re.get(e).__webglFramebuffer===void 0&&Be.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?Be.setTextureCube(e,0):e.isData3DTexture?Be.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?Be.setTexture2DArray(e,0):Be.setTexture2D(e,0),I.unbindTexture()},this.resetState=function(){ce=0,le=0,P=null,I.reset(),ot.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return Ge}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Rt._getDrawingBufferColorSpace(e),t.unpackColorSpace=Rt._getUnpackColorSpace()}},hd=(e,t)=>({x:e,y:t}),W=(e,t)=>({x:e.x+t.x,y:e.y+t.y}),gd=(e,t)=>({x:e.x-t.x,y:e.y-t.y}),G=(e,t)=>({x:e.x*t,y:e.y*t}),_d=(e,t)=>e.x*t.x+e.y*t.y,vd=e=>Math.hypot(e.x,e.y),yd=(e,t)=>(e.x-t.x)**2+(e.y-t.y)**2,bd=(e,t,n)=>e+(t-e)*n,xd=(e,t,n)=>Math.min(n,Math.max(t,e)),Sd=e=>({x:Math.cos(e),y:Math.sin(e)}),Cd=e=>({x:-Math.sin(e),y:Math.cos(e)}),wd=e=>{for(;e>Math.PI;)e-=2*Math.PI;for(;e<-Math.PI;)e+=2*Math.PI;return e},Td=(e,t,n,r)=>{let i=t-e,a=r*n;return Math.abs(i)<=a?t:e+Math.sign(i)*a},K=function(e){return e[e.Cone=0]=`Cone`,e[e.Pole=1]=`Pole`,e[e.Sign=2]=`Sign`,e[e.ParkedCar=3]=`ParkedCar`,e[e.Traffic=4]=`Traffic`,e[e.Building=5]=`Building`,e[e.Barrier=6]=`Barrier`,e[e.Pillar=7]=`Pillar`,e[e.Bollard=8]=`Bollard`,e[e.Bin=9]=`Bin`,e[e.Stall=10]=`Stall`,e[e.Board=11]=`Board`,e[e.Wall=12]=`Wall`,e[e.Rock=13]=`Rock`,e[e.Container=14]=`Container`,e}({}),Ed=function(e){return e[e.Road=0]=`Road`,e[e.Rail=1]=`Rail`,e[e.Foot=2]=`Foot`,e[e.Arch=3]=`Arch`,e[e.Shed=4]=`Shed`,e[e.Line=5]=`Line`,e[e.Gantry=6]=`Gantry`,e[e.Tree=7]=`Tree`,e[e.Conveyor=8]=`Conveyor`,e}({}),Dd=1.1,Od=(e,t)=>{if(e.period<=0)return .8+.2*Math.sin(2.1*t+e.fromS);let n=(t+e.late)%e.period;return n<1.1?Math.sin(Math.PI*n/Dd):0},kd=(e,t)=>(t+e.phase)%e.period*e.speed-320,Ad=(e,t)=>{let n=kd(e,t);return n>-10&&n-e.length<10},jd=(e,t)=>{let n=kd(e,t);return n>-e.warn*e.speed&&n-e.length<10},Md=e=>e.s+14,Nd=e=>e.s+42,Pd=e=>e.lateral<0?-1:1,Fd=(e,t,n)=>t>e.s-26&&t<e.s+e.length+26&&n*Pd(e)>7&&n*Pd(e)<Math.abs(e.lateral)+5.5,Id=(e,t,n)=>t>Md(e)-2&&t<Nd(e)+2&&Math.abs(n-e.lateral)<3.8,Ld=(e,t)=>_d(gd(t,e.hillOrigin),e.hillDir);function Rd(e,t){if(e.hillGrade<=0)return 0;let n=Ld(e,t);return e.hillGrade*Math.max(0,Math.min(n-e.hillFoot,e.hillFar-n))}function zd(e,t){let n=Ld(e,t);return e.hillGrade<=0||n<=e.hillFoot||n>=e.hillFar?0:n<(e.hillFoot+e.hillFar)*.5?1:-1}function Bd(e,t,n){return e.hillGrade*zd(e,t)*_d(Sd(n),e.hillDir)}function Vd(e,t,n,r){let i=0;for(let a of e.winds)if(t>a.fromS&&t<a.toS&&a.shortcut===r){let e=a.period>0?1:Math.min(1,Math.min(t-a.fromS,a.toS-t)/14);i+=a.push*e*Od(a,n)}return i}function Hd(e,t,n){return e.scales.some(e=>Fd(e,t,n))}var Ud=class{constructor(e){this.s=e*2654435761+12345>>>0||1}frand(){return this.s=Math.imul(this.s,1664525)+1013904223>>>0,this.s/4294967296}range(e,t){return e+(t-e)*this.frand()}int(e,t){return e+Math.floor(this.frand()*(t-e+1))}};function Wd(e,t,n){let r=gd(n,t),i=_d(r,r);return yd(e,W(t,G(r,i>0?xd(_d(gd(e,t),r)/i,0,1):0)))}var Gd=2.2;function Kd(e,t,n=0){let r=t/2,i=e.points;if(r<=0){let e=i[0];return W(W(e.pos,G(Sd(e.yaw),t)),G(Cd(e.yaw),n))}if(r>=i.length-1){let e=i[i.length-1];return W(W(e.pos,G(Sd(e.yaw),t-(i.length-1)*2)),G(Cd(e.yaw),n))}let a=Math.floor(r),o=r-a,s=bd(i[a].yaw,i[a+1].yaw,o);return W({x:bd(i[a].pos.x,i[a+1].pos.x,o),y:bd(i[a].pos.y,i[a+1].pos.y,o)},G(Cd(s),n))}function qd(e,t){let n=e.points,r=xd(t/2,0,n.length-1),i=Math.min(Math.floor(r),n.length-2);return bd(n[i].yaw,n[i+1].yaw,r-i)}function Jd(e,t){return e.points[xd(Math.ceil(t/2),0,e.points.length-1)].curvature}var Yd=[1,.35,.02],Xd=[.9,.9,.88],Zd=[.25,.16,.08],Qd=[.55,.55,.52],$d=[[.5,.05,.05],[.05,.12,.4],[.6,.6,.62],[.03,.03,.03],[.45,.4,.1],[.05,.3,.15]],ef=[[.42,.2,.14],[.5,.47,.4],[.2,.23,.28],[.55,.36,.2]],tf=[[.55,.08,.05],[.05,.2,.5],[.08,.35,.15],[.6,.4,.05],[.35,.35,.38],[.5,.2,.05]],nf=class{constructor(e,t={x:0,y:0}){this.c=e,this.pos={x:0,y:0},this.yaw=0,this.pos=t,e.points.length===0&&e.points.push({pos:{...t},yaw:0,curvature:0})}s(){return(this.c.points.length-1)*2}step(e){this.pos=W(this.pos,G(Sd(this.yaw+e*2*.5),2)),this.yaw+=e*2,this.c.points.push({pos:{...this.pos},yaw:this.yaw,curvature:e})}straight(e){let t=Math.round(e/2);for(let e=0;e<t;e++)this.step(0)}turn(e,t){let n=e*Math.PI/180,r=Math.max(1,Math.ceil(Math.abs(n)*t/2));for(let e=0;e<r;e++)this.step(n/(r*2))}},rf=class{constructor(e){this.c=e,this.paint=0}bollard(e,t){this.round(8,e,t,.3,1.1,[.85,.7,.05])}tank(e,t,n,r){this.round(7,e,t,n,r,[.75,.75,.72],!0)}lamp(e,t){this.round(1,e,t,.2,8,[.16,.16,.18])}containers(e,t,n,r,i){this.box(14,e,t,6.1*n,1.3*r,2.6*i,tf[this.paint++%tf.length],!0)}forklift(e,t,n,r){let i=this.blank(4);i.half=hd(1.6,.9),i.height=1.3,i.swayWidth=t,i.swayRate=n,i.swayPhase=r,i.color=[.9,.6,.02],this.place(i,e,0)}boulder(e,t,n){for(let t of this.c.points)if(yd(t.pos,e)<(11+n)**2)return;let r=this.blank(7);r.radius=n,r.height=n*1.3,r.solid=!0,r.color=[.32,.3,.28],r.s=t,r.lateral=100,r.pos=e,this.c.obstacles.push(r)}shortcut(e,t,n){this.c.shortcuts.push({fromS:e,toS:t,from:Kd(this.c,e),to:Kd(this.c,t),halfWidth:n})}leap(e,t,n,r,i,a){let o=gd(e.to,e.from),s=vd(o),c=(e.toS-e.fromS)/s;this.c.jumps.push({s:e.fromS+t*c,gap:n*c,pos:W(e.from,G(o,t/s)),yaw:Math.atan2(o.y,o.x),depth:40,left:r,right:i,shortcut:!0,squeeze:c,gorge:!0,putBackS:a})}wind(e,t,n){this.c.winds.push({fromS:e,toS:t,push:n,period:0,late:0,shortcut:!1})}wave(e,t,n,r,i=!1){this.c.winds.push({fromS:e,toS:t,push:n,period:4.4,late:r,shortcut:i})}place(e,t,n){e.s=t,e.lateral=n,e.pos=Kd(this.c,t,n),e.yaw=qd(this.c,t),this.c.obstacles.push(e)}blank(e){return{kind:e,s:0,lateral:0,pos:hd(0,0),yaw:0,half:hd(0,0),radius:0,height:1,solid:!1,trafficSpeed:0,color:[1,1,1]}}round(e,t,n,r,i,a,o=!1){let s=this.blank(e);s.radius=r,s.height=i,s.color=a,s.solid=o,this.place(s,t,n)}box(e,t,n,r,i,a,o,s){let c=this.blank(e);c.half=hd(r,i),c.height=a,c.color=o,c.solid=s,this.place(c,t,n)}cone(e,t){this.round(0,e,t,.3,.7,Yd)}pole(e,t){this.round(1,e,t,.22,9,Zd)}sign(e,t){this.round(2,e,t,.15,3,[.85,.75,.1])}car(e,t,n=0){let r=this.blank(n===0?3:4);r.half=hd(2.2,.95),r.height=1.5,r.trafficSpeed=n,r.color=$d[this.paint++%$d.length],this.place(r,e,t)}building(e,t,n,r,i){this.box(5,e,t,n,r,i,ef[this.paint++%ef.length],!0)}barrier(e,t){this.box(6,e,t,3,.4,1,Qd,!0)}bridge(e,t,n=0){this.c.bridges.push({s:e,clearance:t,pos:Kd(this.c,e),yaw:qd(this.c,e),kind:n});for(let r of[-1,1])n===5?this.round(7,e,r*10.6,.3,8.2,Zd,!0):n===7?this.round(7,e,r*10.6,1.1,7,[.14,.09,.05],!0):this.round(7,e,r*10.6,.9,t+1.2,n===3?[.4,.19,.1]:n===6?[.85,.62,.04]:Qd,!0)}boxAt(e,t,n,r,i,a,o,s,c){let l=this.blank(e);l.half=hd(i,a),l.height=o,l.color=s,l.solid=c,l.s=r,l.lateral=100,l.pos=t,l.yaw=n,this.c.obstacles.push(l)}narrow(e,t){for(let t=48;t>=12;t-=12){let n=bd(7.4,5.4,(48-t)/36);this.round(0,e-t,n,.3,.7,Xd),this.round(0,e-t,-n,.3,.7,Xd)}for(let n=0;n<t-1;n+=6)this.barrier(e+n,5),this.barrier(e+n,-5);this.c.narrows.push({s:e-3,length:t,halfWidth:5});let n=e-3+t*.5;this.c.waters.push({from:Kd(this.c,n,-240),to:Kd(this.c,n,240),half:4.5,clearHalf:5.4,deep:!1})}jump(e,t,n=130,r=130){this.c.jumps.push({s:e,gap:t,pos:Kd(this.c,e),yaw:qd(this.c,e),depth:1.7,left:n,right:r,shortcut:!1,squeeze:1,gorge:!1,putBackS:-1})}note(e,t){this.c.notes.push({s:e,text:t})}finish(){let e=this.c;for(let t=e.stopS-70;t<=e.stopS-10;t+=12)this.cone(t,7.5),this.cone(t,-7.5);for(let t of[46,e.stopS])for(let e of[-1,1])this.round(7,t,e*9.4,.35,9,[.03,.03,.035],!0)}};function af(){return{name:``,blurb:``,parSeconds:130,stormSpeed:19.3,payScale:1,reputation:0,town:`DES MOINES`,port:!1,city:!1,night:!1,desert:!1,coast:!1,finale:!1,endless:!1,points:[],obstacles:[],bridges:[],narrows:[],jumps:[],shortcuts:[],winds:[],crossings:[],scales:[],gifts:[],waters:[],notes:[],length:0,stopS:0,stopLength:45,hillOrigin:{x:0,y:0},hillDir:{x:1,y:0},hillFoot:0,hillFar:0,hillGrade:0}}function of(e){let t=new rf(e),n=(t,n,r=1/220)=>{for(let i=t;i<=n;i+=6)if(Math.abs(Jd(e,i))>r||zd(e,Kd(e,i))!==0||zd(e,Kd(e,i,20))!==0)return!1;return!0},r=(t,n,r,i)=>{let a=!0;for(let o of e.obstacles){let e=Math.abs(o.lateral)-Math.max(o.half.y,o.radius);o.trafficSpeed!==0||o.lateral*i<0||e>19||(a&&=o.s+Math.max(o.half.x,o.radius)<t-r||o.s-Math.max(o.half.x,o.radius)>n+r)}for(let r of e.bridges)a&&=r.s<t-15||r.s>n+15;for(let r of e.narrows)a&&=r.s+r.length<t-30||r.s>n+30;for(let r of e.jumps)a&&=r.s+r.gap<t-70||r.s>n+70;for(let r of e.waters)for(let i=t-30;i<=n+30&&a;i+=10)a&&=Wd(Kd(e,i,12),r.from,r.to)>(r.half+12)**2&&Wd(Kd(e,i,-12),r.from,r.to)>(r.half+12)**2;for(let r of e.shortcuts)a&&=r.toS<t-50||r.fromS>n+50;for(let r of e.crossings)a&&=r.s<t-120||r.s>n+120;for(let r of e.scales)a&&=r.s+r.length<t-60||r.s>n+60;return a};if(!e.city&&!e.port){let i=420,a=640;for(let o=300;o<e.stopS-380;o+=30)!e.coast&&o>=i&&n(o-40,o+40)&&r(o-20,o+20,12,0)?(e.crossings.push({s:o,skew:(Math.round(o/30)%2==0?1:-1)*.28,period:44,phase:o*.37%44,length:84,speed:22,warn:6,pos:Kd(e,o),yaw:qd(e,o)}),t.note(o,`RAIL CROSSING  /  lights going: stop, or gun it`),i=e.endless?o+1600:e.stopS,a=Math.max(a,o+260)):o>=a&&n(o-15,o+72,1/120)&&r(o-28,o+86,6,1)&&(e.scales.push({s:o,length:58,lateral:15.5,pos:Kd(e,o),yaw:qd(e,o)}),t.note(o,`WEIGH STATION  /  pull in right, stop on the plate`),a=e.endless?o+1800:e.stopS,i=Math.max(i,o+260))}for(let t=330;t<e.stopS-200;t+=470){let n=Math.round(t/470),i=n%2==0?1:-1;r(t-10,t+10,6,i)&&!Hd(e,t,i*6.4)&&e.gifts.push({s:t,lateral:i*6.4,repair:Math.floor(n/2)%2==1,pos:Kd(e,t,i*6.4)})}for(let n of e.bridges)for(let e of[-1,1])t.box(12,n.s,e*48.8,3,40,9,[0,0,0],!0);for(let n=250;n<e.stopS-170;n+=430){let r=Math.round(n/430)%2==0?1:-1,i=Kd(e,n,r*18),a=zd(e,i)===0;for(let t of e.shortcuts)a&&=Wd(i,t.from,t.to)>256;for(let t of e.crossings)a&&=Math.abs(n-t.s)>60;for(let t of e.scales)a&&=n<t.s-40||n>t.s+t.length+40;for(let t=0;t<e.points.length&&a;t+=3)a=yd(e.points[t].pos,i)>169;for(let t of e.obstacles)a&&=yd(t.pos,i)>(vd(t.half)+t.radius+8)**2;for(let t of e.jumps)a&&=t.shortcut?yd(t.pos,i)>36100:n<t.s-30||n>t.s+t.gap+30;for(let t of e.bridges)a&&=Math.abs(n-t.s)>70;for(let t of e.narrows)a&&=n<t.s-60||n>t.s+t.length+60;a&&t.boxAt(11,i,qd(e,n)+Math.PI-r*.3,n,9.2,.5,13.5,[.012,.012,.015],!1)}return e.notes.sort((e,t)=>e.s-t.s),e}function sf(){let e=af();e.name=`FARM ROAD`,e.blurb=`Open country and a small town, out to the wind farm. Fast, with two tight corners.`,e.parSeconds=143,e.stormSpeed=16.6,e.town=`DES MOINES`;let t=new nf(e);t.straight(260);let n=t.s();t.turn(45,140);let r=t.s();t.straight(170);let i=t.s();t.turn(-90,32);let a=t.s();t.straight(130);let o=t.s();t.turn(90,32);let s=t.s();t.straight(220);let c=t.s();t.turn(-120,110);let l=t.s();t.straight(190);let u=t.s();t.turn(60,60);let d=t.s();t.turn(-60,60);let f=t.s();t.straight(320);let p=t.s();t.turn(90,40);let m=t.s();t.straight(400),e.stopS=t.s(),t.straight(e.stopLength+70),e.length=t.s();let h=new rf(e),g=9.5;h.note(150,`TRAFFIC  /  go round it`),h.car(170,4,9),h.car(n+60,4,10),h.sign(n-10,g),h.note(r+90,`LOW BRIDGE  /  hold SPACE to duck the load`),h.bridge(r+90,4.4),h.car(r+30,4,10);let _=i+25;h.note(i,`TIGHT LEFT  /  brake, hold E to swing the tail wide`),h.building(_,-18,7,7,9),h.pole(i+8,g),h.pole(i+25,g),h.pole(i+42,g),h.building(i-40,20,14,7,7),h.building(i-44,-19,12,6,11),h.note(a+20,`PARKED CARS  /  keep to the middle`),h.car(a+22,5.7),h.car(a+34,5.7),h.car(a+52,-5.7),h.car(a+74,5.7),h.car(a+96,-5.7),h.building(a+40,19,22,6,10),h.building(a+95,19,18,6,7),h.building(a+60,-19,30,6,8);let v=o+25;h.note(o,`TIGHT RIGHT  /  brake, hold Q to swing the tail wide`),h.building(v,18,7,7,12),h.pole(o+8,-9.5),h.pole(o+25,-9.5),h.pole(o+42,-9.5),h.car(s+40,4,10),h.note(s+120,`RAIL BRIDGE  /  hold SPACE`),h.bridge(s+120,4.4,1),h.car(s+420,-4,-11),h.note(c,`LONG LEFT  /  poles on the outside`);for(let e=c+20;e<l-10;e+=34)h.pole(e,g);h.car(c+70,4,11),h.car(l+360,-4,-11);let y=l+100;h.note(y,`NARROW BRIDGE  /  straight through the middle`),h.narrow(y,18),h.note(u,`ESS BEND  /  right, then left`),h.pole(u+32,g),h.sign(u+6,-11.5),h.pole(d+32,-9.5),h.sign(d+6,11.5),h.car(f+50,4,12),h.note(f+120,`LOW BRANCHES  /  duck, then again for the grain conveyor`),h.bridge(f+120,4.4,7),h.bridge(f+215,4.4,8),h.car(f+490,-4,-10);let b=p+31;return h.note(p,`RIGHT  /  brake, hold Q`),h.building(b,19.5,8,8,8),h.pole(p+12,-9.5),h.pole(p+31,-9.5),h.pole(p+50,-9.5),h.note(m+150,`JUMP THE RIVER  /  45 mph or more, and keep it straight`),h.jump(m+150,26),h.note(e.stopS,`SITE  /  brake and stop in the green box`),h.finish(),of(e)}function cf(){let e=af();e.name=`THE PORT`,e.reputation=5,e.blurb=`Tight and technical: a container yard, forklifts crossing, three gantries and a hairpin round the tanks.`,e.port=!0,e.payScale=1.15,e.parSeconds=116,e.stormSpeed=15.9,e.town=`HOUSTON`;let t=new nf(e,{x:0,y:9e3});t.straight(300);let n=t.s();t.turn(90,40);let r=t.s();t.straight(80);let i=t.s();t.turn(-90,40);let a=t.s();t.straight(70);let o=t.s();t.turn(-90,40);let s=t.s();t.straight(80);let c=t.s();t.turn(90,40);let l=t.s();t.straight(290);let u=t.s();t.turn(-180,46);let d=t.s();t.straight(210);let f=t.s();t.turn(40,55);let p=t.s();t.turn(-40,55);let m=t.s();t.straight(300),e.stopS=t.s(),t.straight(e.stopLength+70),e.length=t.s();let h=new rf(e),g=9.5,_=14.6;for(let e=60;e<n-20;e+=26)h.bollard(e,g),h.bollard(e,-9.5);h.note(150,`BROKEN-DOWN TRUCK  /  go round it`),h.car(170,4),h.note(n,`TIGHT RIGHT  /  brake, hold Q to swing the tail wide`),h.containers(n+31,21,1,5,3),h.bollard(n+12,-9.5),h.bollard(n+40,-9.5),h.containers(r+48,_,4,2,3),h.containers(r+46,-14.6,4,2,2),h.note(i,`TIGHT LEFT  /  hold E`),h.containers(i+31,-21,1,5,2),h.bollard(i+27,g),h.note(a+35,`FORKLIFT CROSSING  /  time it, or wait`),h.forklift(a+35,7.5,.85,0),h.note(o,`TIGHT LEFT  /  hold E`),h.containers(o+31,-21,1,5,3),h.bollard(o+27,g),h.containers(s+46,_,4,2,3),h.containers(s+48,-14.6,4,2,3),h.car(s+36,-5.7),h.note(c,`TIGHT RIGHT  /  hold Q`),h.containers(c+31,21,1,5,2),h.bollard(c+27,-9.5),h.car(l+262,-4,-9),h.note(l+75,`THREE GANTRIES  /  duck each one, mind the forklifts`),h.bridge(l+75,4.4,Ed.Gantry),h.forklift(l+115,7.5,.7,1),h.bridge(l+155,4.4,Ed.Gantry),h.forklift(l+195,7.5,1,2.5),h.bridge(l+235,4.4,Ed.Gantry),h.containers(l+150,22,9,3,3),h.containers(l+150,-22,9,3,2),h.note(u,`HAIRPIN LEFT  /  brake hard, hold E all the way round`),h.tank(u+72,-46,17,14),h.tank(u+22,-20,5,9),h.tank(u+122,-20,5,9);for(let e=u+18;e<d-10;e+=27)h.bollard(e,-10);return h.car(d+30,5.7),h.car(d+62,-5.7),h.note(d+120,`GAP IN THE QUAY  /  jump it: 45 mph or more`),h.jump(d+120,26,40,130),h.note(f,`CHICANE  /  right, then left`),h.bollard(f+19,g),h.bollard(p+19,-9.5),h.containers(f+19,20,1,3,2),h.containers(p+19,-20,1,3,2),h.car(m+80,4,10),h.note(e.stopS,`SITE  /  brake and stop in the green box`),h.finish(),of(e)}function lf(){let e=af();e.name=`MOUNTAIN PASS`,e.blurb=`Up one side and down the other. The climb is slow and the storm is not; the way down wants to run away with you.`,e.reputation=12,e.payScale=1.3,e.parSeconds=138,e.stormSpeed=15.5,e.town=`DENVER`;let t={x:0,y:18e3};e.hillOrigin=t,e.hillDir={x:1,y:0},e.hillGrade=.14;let n=new nf(e,t);n.straight(240);let r=n.s();n.turn(60,60);let i=n.s();n.straight(150);let a=n.s();n.turn(-120,36);let o=n.s();n.straight(150);let s=n.s();n.turn(120,36);let c=n.s();n.straight(150),n.turn(-60,60);let l=n.s();n.straight(140);let u=n.s();n.turn(60,60);let d=n.s();n.straight(150);let f=n.s();n.turn(-120,36);let p=n.s();n.straight(150);let m=n.s();n.turn(120,36);let h=n.s();n.straight(150),n.turn(-60,60);let g=n.s();n.straight(420),e.stopS=n.s(),n.straight(e.stopLength+70),e.length=n.s();let _=Ld(e,Kd(e,l+70));e.hillFoot=Ld(e,Kd(e,r+12)),e.hillFar=2*_-e.hillFoot;let v=new rf(e);v.car(80,4,8),v.note(170,`SNOW SHED  /  hold SPACE to duck`),v.bridge(170,4.4,Ed.Shed),v.note(r,`THE CLIMB  /  it gets slow, and the storm does not. Boost helps`);let y=(t,n,r)=>{v.note(t,r);for(let e of[8,31,54])v.bollard(t+e,-n*10.1);v.boulder(Kd(e,t+31,n*21),t+31,3)};y(a,-1,`HAIRPIN LEFT  /  brake, hold E to swing the tail wide`),y(s,1,`HAIRPIN RIGHT  /  brake, hold Q`),y(f,-1,`HAIRPIN LEFT  /  downhill: brake EARLY`),y(m,1,`HAIRPIN RIGHT  /  downhill: brake EARLY`);let b=(t,n,r)=>{let i=t+82.5,a=n+67.5;v.note(i-6,r),v.shortcut(i,a,4.5);let o=e.shortcuts[e.shortcuts.length-1],s=gd(o.to,o.from),c=vd(s),l=G(s,1/c),u={x:-l.y,y:l.x};for(let e of[.22,.5,.78]){let t=e===.5?6.2:7.6;for(let n of[-1,1])v.boulder(W(W(o.from,G(l,c*e)),G(u,n*t)),bd(i,a,e),1.6)}};return b(i,o,`SHORTCUT RIGHT  /  dirt track straight up: steep and narrow`),b(d,p,`SHORTCUT RIGHT  /  dirt track straight down: fast, and hard to stop`),v.car(o+112,4),v.note(c+80,`ROCKFALL  /  keep left`),v.round(K.Pillar,c+80,3.2,1.5,1.9,[.32,.3,.28],!0),v.round(K.Pillar,c+86,5.4,1.2,1.5,[.32,.3,.28],!0),v.note(l,`OVER THE TOP  /  it runs away downhill: brake early`),v.sign(l+70,9.5),v.sign(l+70,-9.5),v.car(u+220,-4,-9),v.car(h+60,4),v.note(g+150,`LOW LINE  /  hold SPACE`),v.bridge(g+150,4.4,Ed.Line),v.car(g+230,4,11),v.note(e.stopS,`SITE  /  brake and stop in the green box`),v.finish(),of(e)}function uf(){let e=af();e.name=`DOWNTOWN`,e.blurb=`The city at night. The avenue goes the long way round each block; the alley and the market are the short ways through.`,e.city=!0,e.night=!0,e.reputation=20,e.payScale=1.45,e.parSeconds=133,e.stormSpeed=14.5,e.town=`NEW YORK`;let t=new nf(e,{x:0,y:27e3}),n=Math.PI/2*240+60+100,r=e=>{t.turn(90*e,60),t.straight(30),t.turn(-90*e,60),t.straight(100),t.turn(-90*e,60),t.straight(30),t.turn(90*e,60)};t.straight(200);let i=t.s();r(1);let a=t.s();t.straight(230);let o=t.s();t.turn(-90,40);let s=t.s();t.straight(110);let c=t.s();r(-1);let l=t.s();t.straight(200);let u=t.s();t.turn(90,60);let d=t.s();t.straight(200),e.stopS=t.s(),t.straight(e.stopLength+70),e.length=t.s();let f=new rf(e),p=new Ud(41),m=41/1.45,h=32.27586206896552,g=5.7,_=(e,t,n)=>{let r=Math.max(1,Math.ceil((t-e)/46)),i=(t-e)/r;for(let t=0;t<r;t++)f.building(e+(t+.5)*i,n*23,i*.5-.6,10,p.range(11,38))},v=(e,t)=>{let n=1;for(let r=e;r<=t;r+=42)f.lamp(r,n*9.4),n=-n},y=(t,r,i)=>{let a=Math.PI/2*60,o=t+n,s=i?11:5.5;f.shortcut(t,o,i?9.5:4.5);let c=e.shortcuts[e.shortcuts.length-1],l=gd(c.to,c.from),u=vd(l),d=G(l,1/u),h=G({x:-d.y,y:d.x},r),_=Math.atan2(d.y,d.x),v=(e,t)=>W(W(c.from,G(d,e)),G(h,t)),y=e=>bd(t,o,e/u),b=t+a,x=b+30+a,S=x+100+a,C=(e,t,n,r,i,a,o)=>{let s=t-e>=r-n,c=s?t-e:r-n,l=Math.max(1,Math.ceil(c/46));for(let u=0;u<l;u++){let d=u*c/l,m=(u+1)*c/l-.8,h=s?e+d:e,g=s?e+m:t,y=s?n:n+d,b=s?r:n+m,x=(h+g)*.5,S=(y+b)*.5;f.boxAt(K.Building,v(x,S),_,o(x,S),(g-h)*.5,(b-y)*.5,p.range(i,a),ef[f.paint++%ef.length],!0)}},w=e=>y(e),T=(e,t)=>b+(t-60),E=e=>x+(e-120),D=(e,t)=>S+(90-t);C(26,u-28,-s-20,-s,12,24,w),C(73,267,s,s+14,10,20,w);let ee=s+17,O=57.72413793103448;C(73,89,ee,O,12,30,T),C(251,267,ee,O,12,30,D),C(152.27586206896552,187.72413793103448,111,137,16,40,E);for(let e of[120,220])C(e-m,e+m,61.72413793103448,118.27586206896552,20,44,e=>e<u*.5?x-a*.5:S-a*.5);C(27,47,92.27586206896552,183,12,34,T),C(54,286,163,183,12,34,E),C(293,313,92.27586206896552,183,12,34,D),C(-28.27586206896552,m,31.72413793103448,88.27586206896552,16,36,()=>t+a*.5),C(u-m,u+m,31.72413793103448,88.27586206896552,16,36,()=>o-a*.5);let k=[t,b+30,x+100,S+30];for(let e=0;e<4;e++){let t=r*(e===0||e===3?16.5:9.4);f.lamp(k[e]+a*.3,t),f.lamp(k[e]+a*.72,t)}for(let e of[8,50,92])f.lamp(x+e,r*9.4);if(f.car(x+34,r*g),f.car(x+82,-r*g),i){let t=u*.5;for(let e=54;e<u-60+2;e+=15)if(!(Math.abs(e-t)<34))for(let t of[-1,1])f.boxAt(K.Stall,v(e+(t>0?0:7),t*5.4),_,y(e),1.5,1.2,2.6,$d[f.paint++%$d.length],!1);let n=f.blank(K.Pillar);n.radius=2.2,n.height=1.2,n.solid=!0,n.color=Qd,n.s=y(t),n.lateral=100,n.pos=v(t,0),e.obstacles.push(n)}else{let e=1;for(let t=66;t<u-40;t+=44)f.boxAt(K.Bin,v(t,e*2.95),_,y(t),1.5,1.3,1.4,[.05,.22,.12],!1),e=-e}};return _(-50,i-h,1),_(-50,i+16,-1),v(30,i-20),f.car(70,g),f.car(120,-5.7),f.note(150,`RAIL BRIDGE  /  hold SPACE to duck`),f.bridge(150,4.4,Ed.Rail),f.car(188,-4,-10),f.note(i-4,`ALLEY: STRAIGHT ON  /  short, tight`),y(i,1,!1),_(a+h,a+58,1),_(a-20,a+58,-1),_(a+84,o+4,1),_(a+84,o-24,-1),v(a+20,a+50),v(a+96,o-10),f.car(a+205,-4,-10),f.note(a+71,`CROSS STREET  /  taxis crossing: time it, or wait`),f.forklift(a+71,7.5,.85,0),f.note(a+150,`FOOTBRIDGE  /  hold SPACE`),f.bridge(a+150,4.4,Ed.Foot),f.note(o,`TIGHT LEFT  /  brake, hold E to swing the tail wide`),f.building(o+31,-25,9,9,30),f.lamp(o+20,9.4),f.lamp(o+46,9.4),_(s+22,c-h,-1),_(s+4,c+16,1),v(s+14,c-12),f.car(s+30,g),f.car(s+78,-5.7),f.note(s+55,`FOOTBRIDGE  /  hold SPACE`),f.bridge(s+55,4.4,Ed.Foot),f.note(c-4,`MARKET: STRAIGHT ON  /  short, mind the stalls`),y(c,-1,!0),_(l+h,l+78,-1),_(l-20,l+78,1),v(l+16,l+80),f.note(l+118,`CANAL BRIDGE IS UP  /  jump it: 45 mph or more`),f.jump(l+118,26),f.note(u,`RIGHT  /  then the yard`),f.lamp(u+30,-9.4),f.lamp(u+66,-9.4),v(d+20,e.stopS-80),f.car(d+70,4,11),f.note(e.stopS,`SITE  /  brake and stop in the green box`),f.finish(),of(e)}function df(){let e=af();e.name=`THE CANYON`,e.blurb=`Desert, late in the day. The wind comes through every gap in the rock, and the short way is a leap across the gorge.`,e.desert=!0,e.reputation=30,e.payScale=1.6,e.parSeconds=123,e.stormSpeed=15.5,e.town=`SANTA FE`;let t=new nf(e,{x:0,y:36e3}),n=Math.PI/2*280+60+120;t.straight(280);let r=t.s();t.turn(-50,110);let i=t.s();t.straight(180);let a=t.s();t.turn(50,110),t.straight(70);let o=t.s();t.turn(90,70),t.straight(30),t.turn(-90,70);let s=t.s();t.straight(120),t.turn(-90,70),t.straight(30),t.turn(90,70);let c=t.s();t.straight(260);let l=t.s();t.turn(-70,60);let u=t.s();t.straight(200);let d=t.s();t.turn(70,80);let f=t.s();t.straight(240),e.stopS=t.s(),t.straight(e.stopLength+70),e.length=t.s();let p=new rf(e),m=new Ud(53),h=[.42,.2,.1],g=(e,t,n)=>{let r=Math.max(1,Math.ceil((t-e)/30)),i=(t-e)/r;for(let t=0;t<r;t++){let r=m.range(.8,1.15);p.box(K.Rock,e+(t+.5)*i,n*22,i*.5+.5,9,m.range(13,30),[h[0]*r,h[1]*r,h[2]*r],!0)}},_=(e,t)=>p.round(K.Pillar,e,t,m.range(1.4,2.4),2.6,[h[0]*.9,h[1]*.9,h[2]*.9],!0);p.note(116,`CROSSWIND  /  steer into it`),p.wind(120,240,2.3),_(150,14),_(206,14.5),_(60,-14),g(r+40,a+40,-1),g(r+40,i+84,1),g(i+156,a+40,1),p.note(i+40,`ROCK ARCH  /  hold SPACE to duck`),p.bridge(i+40,4.4,Ed.Arch),p.note(i+84,`WIND FROM THE RIGHT  /  keep right`),p.wind(i+84,i+156,-3),p.note(i+170,`ROCK ARCH  /  hold SPACE`),p.bridge(i+170,4.4,Ed.Arch),p.note(o-4,`THE LEAP: STRAIGHT ON  /  hold SHIFT up the ramp`),p.shortcut(o,o+n,5);let v=e.shortcuts[e.shortcuts.length-1],y=vd(gd(v.to,v.from));p.leap(v,176,42,150,134,o-90);let b=G(gd(v.to,v.from),1/y),x={x:-b.y,y:b.x};e.gifts.push({s:bd(v.fromS,v.toS,128/y),lateral:100,repair:!1,pos:W(v.from,G(b,128))});for(let e of[50,95,140,262,318])for(let t of[-1,1])p.boulder(W(W(v.from,G(b,e)),G(x,t*9.5)),bd(v.fromS,v.toS,e/y),1.7);let S=Math.PI/2*70;return p.box(K.Rock,o+S*.5,37,12,12,26,h,!0),p.box(K.Rock,c-S*.5,37,12,12,22,h,!0),g(s+4,s+120-4,1),p.note(s+6,`WIND FROM THE LEFT  /  keep left`),p.wind(s+10,s+120-10,2.8),p.note(c+22,`ROCK ARCH  /  hold SPACE`),p.bridge(c+22,4.4,Ed.Arch),p.note(c+50,`WIND FROM THE RIGHT  /  then from the left`),g(c+44,c+128,-1),p.wind(c+50,c+126,-3.2),g(c+132,c+216,1),p.wind(c+134,c+210,3.2),p.car(c+250,-4,-10),p.note(l,`LEFT  /  brake`),p.box(K.Rock,l+36,-35,11,11,24,h,!0),p.note(u+50,`BROKEN-DOWN TRUCK  /  wind from the right`),p.wind(u+50,u+150,-2.6),p.car(u+110,4),_(u+128,-14),_(u+70,14),p.note(d,`RIGHT  /  then the site, and one more gust`),p.wind(f+30,f+110,-2.4),_(f+70,-14),p.note(e.stopS,`SITE  /  brake and stop in the green box`),p.finish(),of(e)}function ff(){let e=af();e.name=`THE COAST`,e.blurb=`The last job, with the weather already in. The sea comes over the road, and the load goes up from the cape.`,e.coast=!0,e.finale=!0,e.reputation=42,e.payScale=1e6/38e4,e.parSeconds=128,e.stormSpeed=15.5,e.town=`PORTLAND`;let t=new nf(e,{x:0,y:45e3}),n=Math.PI/2*280+80+120;t.straight(220),t.turn(40,120);let r=t.s();t.straight(300),t.turn(-40,120),t.straight(40);let i=t.s();t.turn(90,70),t.straight(40),t.turn(-90,70);let a=t.s();t.straight(120),t.turn(-90,70),t.straight(40),t.turn(90,70);let o=t.s();t.straight(200);let s=t.s();t.turn(-180,50);let c=t.s();t.straight(190);let l=t.s();t.turn(90,60);let u=t.s();t.straight(250),e.stopS=t.s(),t.straight(e.stopLength+70),e.length=t.s();let d=new rf(e),f=(e,t,n)=>{let r=Math.max(1,Math.ceil((t-e)/44)),i=(t-e)/r;for(let t=0;t<r;t++)d.box(K.Barrier,e+(t+.5)*i,n*9.3,i*.5,.4,1,Qd,!0)};d.note(86,`WIND OFF THE SEA  /  steer into it`),d.wind(90,200,2.5),d.car(205,-4,-10),d.note(r+20,`WAVES  /  go between them, or keep left`),f(r+30,r+290,1),d.wave(r+50,r+92,5,0),d.wave(r+140,r+182,5,1.6),d.wave(r+230,r+272,5,3.1),d.note(i-4,`SANDBAR: STRAIGHT ON  /  short, narrow, waves`),d.shortcut(i,i+n,6);let p=e.shortcuts[e.shortcuts.length-1],m=vd(gd(p.to,p.from));for(let e of[120,250])d.wave(bd(p.fromS,p.toS,e/m),bd(p.fromS,p.toS,(e+44)/m),5,e*.01,!0);d.car(a+40,5.7),d.note(a+100,`FOOTBRIDGE  /  hold SPACE to duck`),d.bridge(a+100,4.4,Ed.Foot),d.wind(o+30,o+130,2.8),d.note(o+150,`GANTRY  /  hold SPACE`),d.bridge(o+150,4.4,Ed.Gantry),d.note(s,`HAIRPIN LEFT  /  brake hard, hold E all the way round`),d.tank(s+78,-50,5,34);for(let e=s+14;e<c-8;e+=26)d.bollard(e,-10);return d.note(c+100,`RIVER BRIDGE IS UP  /  jump it: 45 mph or more`),d.jump(c+100,26,34,130),d.note(l,`RIGHT  /  out along the cape`),d.note(u+46,`WAVE FROM THE RIGHT  /  keep right`),f(u+40,u+110,-1),d.wave(u+50,u+92,-5,2),d.wind(u+120,u+205,-2.6),d.note(e.stopS,`SITE  /  brake and stop in the green box`),d.finish(),of(e)}function pf(){let e=af();e.name=`MIDNIGHT RIDGE`,e.blurb=`After dark, by headlights. A long straight, a long climb over the ridge, and a long run home: the place to race.`,e.night=!0,e.reputation=50,e.payScale=1.8,e.parSeconds=136,e.stormSpeed=16.2,e.town=`KANSAS CITY`;let t={x:0,y:54e3};e.hillOrigin=t,e.hillDir={x:1,y:0},e.hillGrade=.09;let n=new nf(e,t);n.straight(380);let r=n.s();n.turn(-40,90),n.straight(60),n.turn(40,90);let i=n.s();n.straight(230);let a=n.s();n.straight(120);let o=n.s();n.straight(230);let s=n.s();n.turn(90,60);let c=n.s();n.straight(140),n.turn(-50,80),n.straight(100),n.turn(50,80);let l=n.s();n.straight(210),n.turn(-90,55);let u=n.s();n.straight(340),e.stopS=n.s(),n.straight(e.stopLength+70),e.length=n.s();let d=Ld(e,Kd(e,a+60));e.hillFoot=Ld(e,Kd(e,i+12)),e.hillFar=2*d-e.hillFoot;let f=new rf(e),p=9.3;f.note(70,`SLOW LORRY  /  go round it`),f.car(150,4,9);for(let e=60;e<r-20;e+=64)f.pole(e,p);f.car(r-60,-4,-11),f.note(r-10,`JINK  /  left, then right`),f.note(i,`THE RIDGE  /  a long climb: keep the boost for it`),f.car(i+150,4,6),f.note(a+60,`BRIDGE OVER THE CREST  /  hold SPACE`),f.bridge(a+60,4.6,Ed.Road),f.note(o,`DOWNHILL  /  brakes are weak, and a right at the bottom`),f.car(o+120,-4,-10);for(let e=i+30;e<s-30;e+=70)f.pole(e,-9.3);f.note(s-50,`TIGHT RIGHT  /  brake, hold Q to swing the tail wide`),f.car(c+50,-4),f.note(c+100,`ESS BEND  /  left, then right`),f.car(c+160,4),f.note(l+30,`LOW WIRES  /  hold SPACE to duck`),f.bridge(l+30,4.4,Ed.Line),f.note(l+110,`NARROW BRIDGE  /  straight through the middle`),f.narrow(l+110,22),f.note(u-50,`TIGHT LEFT  /  brake, hold E to swing the tail wide`),f.car(u+60,4),f.car(u+120,-4,-12),f.car(u+200,4);for(let t=u+20;t<e.stopS-40;t+=64)f.pole(t,p);return f.note(e.stopS-120,`THE SITE  /  into the box`),f.finish(),of(e)}function mf(e,t,n){let r=new Ud(e),i=af();i.name=n?`ENDLESS`:`OPEN ROAD ${e%1e3}`,i.blurb=n?`No site. The road goes on, the storm gets faster, and the run ends when it has you. Pay is by the mile.`:`A road no one has driven: new every day. Everything the other places have, in whatever order it comes.`,i.endless=n,i.payScale=1.25,i.stormSpeed=n?15:16.6;let a=r.int(0,2);i.desert=a===1,i.night=a===2,i.town=i.desert?`PHOENIX`:i.night?`DETROIT`:`OMAHA`;let o=new nf(i,{x:r.range(-2e4,2e4),y:n?102e3:72e3}),s=new rf(i),c=9.5,l=(e,t,n)=>{for(let r=0;r<i.points.length;r+=2)if(Math.abs(r*2-e)>60&&yd(i.points[r].pos,t)<n*n)return!0;return!1};o.straight(260),s.note(150,`TRAFFIC  /  go round it`),s.car(170,4,9);let u=-1,d=()=>({points:i.points.length,obstacles:i.obstacles.length,notes:i.notes.length,bridges:i.bridges.length,narrows:i.narrows.length,jumps:i.jumps.length,winds:i.winds.length,waters:i.waters.length}),f=e=>{i.points.length=e.points,i.obstacles.length=e.obstacles,i.notes.length=e.notes,i.bridges.length=e.bridges,i.narrows.length=e.narrows,i.jumps.length=e.jumps,i.winds.length=e.winds,i.waters.length=e.waters,o.pos={...i.points[i.points.length-1].pos},o.yaw=i.points[i.points.length-1].yaw},p=e=>{let t=0xde0b6b3a7640000,n=gd(i.points[0].pos,G(Sd(i.points[0].yaw),20));for(let r=e;r<i.points.length;r+=2){for(let e=0;e<r-125;e+=2)t=Math.min(t,yd(i.points[r].pos,i.points[e].pos));t=Math.min(t,yd(i.points[r].pos,n)-400)}return Math.sqrt(Math.max(t,0))},m=e=>p(e)<120;for(let e=0;e<t;e++){let t=e===0?0:r.int(0,10);t===u&&(t=(t+1)%11);let n=d(),a=i.points.length,h=wd(o.yaw-i.points[0].yaw),g=Math.abs(h)>1.2?-Math.sign(h):r.frand()>.5?1:-1;for(let e=0;e<12;e++){let h=o.s();switch(t){case 0:{o.straight(230);let e=[[Ed.Road,`LOW BRIDGE  /  hold SPACE to duck the load`],[Ed.Rail,`RAIL BRIDGE  /  hold SPACE`],[Ed.Foot,`FOOTBRIDGE  /  hold SPACE`],[Ed.Line,`LOW LINE  /  hold SPACE`],[Ed.Tree,`LOW BRANCHES  /  hold SPACE`],[Ed.Conveyor,`GRAIN CONVEYOR  /  hold SPACE`],[Ed.Gantry,`GANTRY  /  hold SPACE`],[Ed.Shed,`SNOW SHED  /  hold SPACE to duck`],[Ed.Arch,`ROCK ARCH  /  hold SPACE to duck`]],[t,n]=e[r.int(0,e.length-1)];s.note(h+120,n),s.bridge(h+120,4.4,t),s.car(h+40,4,10);break}case 1:o.turn(g*90,r.range(30,40)),s.note(h,g>0?`TIGHT RIGHT  /  brake, hold Q to swing the tail wide`:`TIGHT LEFT  /  brake, hold E to swing the tail wide`),s.building(h+25,g*18,7,7,r.range(7,12));for(let e of[8,25,42])s.pole(h+e,-g*c);o.straight(60);break;case 2:{let e=r.range(70,120);o.turn(g*e,r.range(100,140)),s.note(h,g>0?`LONG RIGHT  /  poles on the outside`:`LONG LEFT  /  poles on the outside`);for(let e=h+20;e<o.s()-10;e+=34)s.pole(e,-g*c);s.car(h+70,4,11);break}case 3:o.straight(40),s.note(h+40,g>0?`HAIRPIN RIGHT  /  brake hard, hold Q all the way round`:`HAIRPIN LEFT  /  brake hard, hold E all the way round`),o.turn(g*160,34);for(let e of[20,45,70])s.pole(h+40+e,-g*c);o.straight(60);break;case 4:o.straight(50),s.note(h+50,g>0?`CHICANE  /  right, then left`:`CHICANE  /  left, then right`),o.turn(g*55,60),o.turn(-g*55,60),s.pole(h+60,-g*c),s.pole(o.s()-20,g*c),o.straight(40);break;case 5:o.straight(240),s.note(h+140,`NARROW BRIDGE  /  straight through the middle`),s.narrow(h+140,18);break;case 6:{o.straight(300);let e=h+200;l(e,Kd(i,e+13),110)?(s.note(h+150,`TRAFFIC  /  go round it`),s.car(h+160,4,10)):(s.note(e,`JUMP THE RIVER  /  45 mph or more, and keep it straight`),s.jump(e,26,60,60));break}case 7:o.straight(170),s.note(h+20,`PARKED CARS  /  keep to the middle`);for(let e=h+22;e<h+150;e+=r.range(14,26))s.car(e,(r.frand()>.5?1:-1)*5.7);s.building(h+50,19,22,6,r.range(7,11)),s.building(h+110,-19,24,6,r.range(7,11));break;case 8:o.straight(280),s.note(h+40,g>0?`WIND FROM THE RIGHT  /  keep right`:`WIND FROM THE LEFT  /  keep left`),s.wind(h+60,h+240,g*r.range(2.2,3.2)),s.pole(h+100,-g*c),s.pole(h+190,-g*c);break;case 9:o.straight(220),s.note(h+80,g>0?`ROCKFALL  /  keep left`:`ROCKFALL  /  keep right`);for(let e=0;e<4;e++)s.round(K.Pillar,h+110+e*22,g*r.range(4.4,6.2),r.range(1,1.6),1.8,[.32,.3,.28],!0);break;case 10:{o.straight(180);let e=h+110;s.note(e,`NARROW GATE  /  straight through the middle`);for(let t=e-48;t<=e-12;t+=12){let n=bd(7.4,5.2,(t-(e-48))/36);s.cone(t,n),s.cone(t,-n)}s.barrier(e,5),s.barrier(e,-5),s.barrier(e+6,5),s.barrier(e+6,-5);break}}if(!m(a))break;if(f(n),g=-g,e%2==1&&(t=(t+1+r.int(0,9))%11,t=t===u?(t+1)%11:t),e===11){let e=0,n=240,r=-1;for(let t of[0,30,-30,60,-60,90,-90,120,-120,150,-150,180])for(let i of[240,420,640]){let s=d();t!==0&&o.turn(t,70),o.straight(i);let c=p(a);c>r&&(r=c,e=t,n=i),f(s)}e!==0&&o.turn(e,70),o.straight(n),s.note(o.s()-140,`TRAFFIC  /  go round it`),s.car(o.s()-120,4,10),t=7}}u=t,r.frand()<.4&&t!==6&&t!==5&&t!==10&&s.car(o.s()+150,-4,-11)}let h=d(),g=i.points.length,_=i.stopLength+70;{let e=0,t=-1;for(let n of[0,40,-40,80,-80,120,-120,160,-160]){n!==0&&o.turn(n,110),o.straight(380+_);let r=p(g);r>t&&(t=r,e=n),f(h)}e!==0&&o.turn(e,110),o.straight(380+_)}i.stopS=o.s()-_;let v=i.stopS-380;if(s.note(v+120,`SITE  /  brake and stop in the green box`),i.length=o.s(),i.parSeconds=i.length/17,!n)s.finish();else for(let e of[46])for(let t of[-1,1])s.round(K.Pillar,e,t*9.4,.35,9,[.03,.03,.035],!0);return i.notes.sort((e,t)=>e.s-t.s),of(i)}function hf(){return Math.floor(Date.now()/864e5)%1e5}var gf=new Map;function _f(e){let t=Math.max(0,Math.min(8,e)),n=gf.get(t);return n||(n=[sf,cf,lf,uf,df,ff,pf,()=>mf(hf(),11,!1),()=>mf(hf()+1,40,!0)][t](),gf.set(t,n)),n}var vf=[`FARM ROAD`,`THE PORT`,`MOUNTAIN PASS`,`DOWNTOWN`,`THE CANYON`,`THE COAST`,`MIDNIGHT RIDGE`,`OPEN ROAD`,`ENDLESS`],yf=1.3,bf=1.5,xf=1.4,Sf=.56,Cf=.42,wf=1.25,Tf=.276,Ef=9.81,Df=3.2,Of=1.7,kf=.22,Af=.4,jf=.3,Mf=.25,Nf=.07,Pf=.06,Ff=8,If=60,Lf=4e4,Rf=.5,zf=3,Bf=2.6,Vf=.9,Hf=6,Uf=8,Wf=16,Gf=2.2,Kf=1.6,qf=4.5,Jf=2.5,Yf=3,Xf=1.2,Zf=10,Qf=1500,$f=1e3,ep=2500,tp=.3,np=6,rp=230,ip=420,ap=20,op=600,sp=6,cp=1.2,lp=125,up=.34,dp=.2,fp=12,pp=1.2,mp=.6,hp=90,gp=35,_p=8e3,vp=2e4,yp=25e3,bp=2.5,xp=30,Sp=6,Cp=7,wp=5.5,Tp=2.4,Ep=1.2,Dp=2.2,Op=.92,kp=1.6,Ap=.9,jp=12,Mp=.012,Np=2,Pp=6e4,Fp=30,Ip=6,Lp=.09,Rp=110,zp=10,Bp=-7,Vp=-6,Hp=5,Up=1.5,Wp=7,Gp=.25,Kp=1.8,qp=.12,Jp=.03,Yp=.8,Xp=.4,Zp=2.6,Qp=.12,$p=.7,em=.6,tm=5,nm=1.6,rm=4,im=3,am=.45,om=1.5,sm=1.5,cm=1.2,lm=5,um=1.5,dm=6e3,fm=e=>.9+.03*e,pm=e=>.8+.03*e,mm=e=>.5+.012*e,hm=e=>.9+.02*e,gm=e=>e===`blade`||e===`rocket`,_m=e=>e===`transformer`||e===`house`,vm=[{name:`TURBINE BLADE`,blurb:`100 ft long and light. The one to learn on.`,dollyDist:20,loadEnd:30,rootRadius:1.5,tipRadius:.35,rootThickness:3.5,tipThickness:.8,boxy:!1,maxSpeed:26,boostSpeed:40,accel:5,brake:11,grip:7,damageScale:1,basePay:25e4,parFactor:1,stormPace:1,weight:.6,underside:1.7,color:[.88,.88,.86],sail:1,shape:`blade`},{name:`TRANSFORMER`,blurb:`Short, wide and very heavy. Slow to get going, slower to stop, and tall all the way along.`,dollyDist:9,loadEnd:12,rootRadius:2,tipRadius:1.9,rootThickness:3.9,tipThickness:3.7,boxy:!0,maxSpeed:25,boostSpeed:36,accel:3.6,brake:8.5,grip:6,damageScale:.7,basePay:3e5,parFactor:1.03,stormPace:.97,weight:1.4,underside:1.7,color:[.16,.3,.36],sail:.5,shape:`transformer`},{name:`ROCKET STAGE`,blurb:`150 ft long and fragile. The tail is a long way back, and every knock costs more.`,dollyDist:29,loadEnd:46,rootRadius:1.6,tipRadius:1.3,rootThickness:3.2,tipThickness:2.5,boxy:!1,maxSpeed:26,boostSpeed:38,accel:4.6,brake:10,grip:6.5,damageScale:1.6,basePay:38e4,parFactor:1.03,stormPace:1,weight:.9,underside:1.7,color:[.92,.92,.95],sail:.9,shape:`rocket`},{name:`HOUSE`,blurb:`As wide as a lane and a half, and low. Nothing goes under it: what is in the way has to be got round.`,dollyDist:11,loadEnd:15,rootRadius:3,tipRadius:3,rootThickness:3.8,tipThickness:3.8,boxy:!0,maxSpeed:24,boostSpeed:35,accel:4.2,brake:9,grip:6.2,damageScale:1.1,basePay:34e4,parFactor:1.08,stormPace:.94,weight:1.1,underside:1.4,color:[.86,.8,.66],sail:1.1,shape:`house`},{name:`EXCAVATOR`,blurb:`Wide, tall and very heavy, on a low bed. Slow to get going; nothing goes under it.`,dollyDist:12,loadEnd:16,rootRadius:2.3,tipRadius:2.3,rootThickness:3.6,tipThickness:3.6,boxy:!0,maxSpeed:23,boostSpeed:33,accel:3.6,brake:8.5,grip:5.8,damageScale:.8,basePay:33e4,parFactor:1.07,stormPace:.95,weight:1.7,underside:1.2,color:[.85,.58,.05],sail:.5,shape:`excavator`},{name:`YACHT`,blurb:`Tall, light and fragile. The wind takes it, every bridge is a duck, and every knock costs.`,dollyDist:14,loadEnd:20,rootRadius:2.2,tipRadius:.9,rootThickness:3.4,tipThickness:2.4,boxy:!1,maxSpeed:25,boostSpeed:36,accel:4.4,brake:9.5,grip:5.4,damageScale:1.5,basePay:36e4,parFactor:1.04,stormPace:.98,weight:.8,underside:1.3,color:[.95,.95,.97],sail:1.7,shape:`yacht`},{name:`TILT DECK`,blurb:`The recovery deck: low and quick empty, and whatever it carries once it is loaded.`,dollyDist:12,loadEnd:17,rootRadius:1.5,tipRadius:1.5,rootThickness:.5,tipThickness:.5,boxy:!0,maxSpeed:27,boostSpeed:40,accel:4.8,brake:10,grip:6.4,damageScale:1,basePay:0,parFactor:1,stormPace:1,weight:.7,underside:1.4,color:[.2,.2,.22],sail:.4,shape:`deck`}],ym=[{name:`COACH`,blurb:`A 45-foot coach, full height. Long and heavy on the deck.`,halfLength:6.2,height:3.6,weight:1.6,fee:24e4,color:[.75,.76,.8]},{name:`CAMPER`,blurb:`A motorhome: light, tall and wide. It rocks.`,halfLength:4.3,height:3.3,weight:1.1,fee:16e4,color:[.92,.9,.84]},{name:`SCHOOL BUS`,blurb:`The yellow one. Middling in every way.`,halfLength:5.6,height:3.2,weight:1.4,fee:19e4,color:[.95,.72,.05]},{name:`PICKUP`,blurb:`Dead on the shoulder. Short, light, quick up the deck.`,halfLength:2.9,height:1.9,weight:.5,fee:9e4,color:[.62,.1,.08]}],bm=.0015,xm=.55,Sm=2500,Cm=[{name:`MAMMOTH`,strengths:`the all-rounder`,speed:1,pull:1,brakes:1,grip:1,knocks:1,color:[.8,.42,.02]},{name:`BULL`,strengths:`stops, grips, tough. Slower`,speed:.93,pull:.95,brakes:1.2,grip:1.12,knocks:.75,color:[.05,.25,.12]},{name:`HORNET`,strengths:`fast. Fragile, poor brakes`,speed:1.1,pull:1.2,brakes:.88,grip:.93,knocks:1.25,color:[.85,.75,.02]}],wm=[{name:`SAFE`,headStartSeconds:8,mostLeadSeconds:12,payScale:1.2},{name:`TIGHT`,headStartSeconds:5,mostLeadSeconds:8,payScale:1.5},{name:`DARING`,headStartSeconds:3,mostLeadSeconds:5,payScale:2}];function Tm(e,t,n){let r=xd((t-1)/(e.loadEnd-1),0,1);return e.underside+bd(e.rootThickness,e.tipThickness,r)-n*yf}function Em(e,t){return bd(e.rootRadius,e.tipRadius,xd((t-1)/(e.loadEnd-1),0,1))}var Dm=()=>({throttle:0,brake:0,steer:0,tail:0,duck:!1,boost:!1,rescue:!1,fix:!1}),q=function(e){return e[e.Ready=0]=`Ready`,e[e.Countdown=1]=`Countdown`,e[e.Driving=2]=`Driving`,e[e.Lifting=3]=`Lifting`,e[e.Finished=4]=`Finished`,e}({}),J=function(e){return e[e.None=0]=`None`,e[e.CloseCall=1]=`CloseCall`,e[e.Threaded=2]=`Threaded`,e[e.Hit=3]=`Hit`,e[e.BridgeStrike=4]=`BridgeStrike`,e[e.Jackknife=5]=`Jackknife`,e[e.Overshot=6]=`Overshot`,e[e.StormHere=7]=`StormHere`,e[e.Air=8]=`Air`,e[e.Splash=9]=`Splash`,e[e.Rescue=10]=`Rescue`,e[e.BrokeDown=11]=`BrokeDown`,e[e.Patched=12]=`Patched`,e[e.Delivered=13]=`Delivered`,e[e.Train=14]=`Train`,e[e.BeatTrain=15]=`BeatTrain`,e[e.Weighed=16]=`Weighed`,e[e.BlewScale=17]=`BlewScale`,e[e.GotBoost=18]=`GotBoost`,e[e.GotRepair=19]=`GotRepair`,e[e.Fell=20]=`Fell`,e[e.Leapt=21]=`Leapt`,e[e.Wave=22]=`Wave`,e[e.Caught=23]=`Caught`,e[e.Sea=24]=`Sea`,e[e.Miss=25]=`Miss`,e[e.Bolt=26]=`Bolt`,e[e.Found=27]=`Found`,e[e.LinedUp=28]=`LinedUp`,e[e.Scrape=29]=`Scrape`,e[e.Loaded=30]=`Loaded`,e[e.Recovered=31]=`Recovered`,e}({}),Om=class{constructor(){this.phase=0,this.contract=0,this.truck=0,this.risk=0,this.time=0,this.countdown=0,this.hitch={x:0,y:0},this.yaw=0,this.speed=0,this.steer=0,this.trailerYaw=0,this.rearSteer=0,this.duck=0,this.s=0,this.lateral=0,this.offroad=!1,this.airborne=!1,this.airJump=0,this.airClock=0,this.airVz=0,this.height=0,this.inWater=!1,this.waterClock=0,this.waterJump=-1,this.offroadSeconds=0,this.stuckSeconds=0,this.lastKnockTime=-100,this.damage=0,this.hurt=[0,0,0],this.pull=0,this.breakdownLeft=0,this.breakdowns=0,this.boost=0,this.boosting=!1,this.stormS=0,this.inStorm=!1,this.beatStorm=!1,this.closeCalls=0,this.hits=0,this.chain=0,this.bestChain=0,this.bonusDollars=0,this.overshot=!1,this.lastCall=0,this.lastCallTime=-100,this.lastCallDollars=0,this.jumpFalls=[],this.lastTrainTime=-100,this.weighClock=0,this.weighed=!1,this.blewScale=!1,this.wading=!1,this.giftsTaken=[],this.ground=0,this.pitch=0,this.onShortcut=!1,this.blow=0,this.lastWaveTime=-100,this.caughtSeconds=0,this.caught=!1,this.falling=!1,this.fallClock=0,this.liftClock=0,this.craneX=0,this.craneV=0,this.loadX=0,this.loadVX=0,this.loadY=0,this.loadVY=0,this.liftHold=0,this.clangCool=0,this.setDown=!1,this.clangs=0,this.liftGust=0,this.breakdownS=0,this.breakdownLateral=0,this.foundBreakdown=!1,this.linedUp=!1,this.winch=0,this.winchSkew=0,this.loaded=!1,this.busDamage=0,this.towBill=0,this.lastScrapeTime=-100,this.scaleDollars=0,this.fallDollars=0}},km=class{constructor(e){this.course=e,this.state=new Om,this.obstacles=[],this.tuned={...vm[0]},this.boostLasts=Yf,this.bridgeDone=[],this.jumpDone=[],this.nearestPoint=0,this.rescueHeld=!1,this.noStorm=!1,this.recovery=!1,this.broken=0,this.reset()}get rig(){return this.tuned}reset(){let e=this.course,t=this.state,n=new Om;n.contract=t.contract,n.truck=t.truck,n.risk=t.risk,this.state=n;let r=Cm[n.truck];if(this.recovery){n.contract=6;let t=new Ud(e.points.length*31+this.broken*7+5),r=-1e9;n.breakdownS=e.stopS*.55;for(let i=0;i<160;i++){let i=t.range(520,e.stopS-380),a=1e9,o=0,s=!1;for(let t=i-40;t<=i+40;t+=8)o=Math.max(o,Math.abs(Jd(e,t))*180),s||=zd(e,Kd(e,t))!==0;for(let t of e.bridges)a=Math.min(a,Math.abs(t.s-i)-110);for(let t of e.narrows)a=Math.min(a,Math.max(t.s-60-i,i-(t.s+t.length+60)));for(let t of e.crossings)a=Math.min(a,Math.abs(t.s-i)-70);for(let t of e.scales)a=Math.min(a,Math.max(t.s-60-i,i-(t.s+t.length+60)));for(let t of e.jumps)t.shortcut||(a=Math.min(a,Math.max(t.s-330-i,i-(t.s+t.gap+60))));for(let t of e.shortcuts)a=Math.min(a,Math.max(t.fromS-60-i,i-(t.toS+60)));for(let t of e.obstacles)t.trafficSpeed===0&&t.lateral>=0&&t.lateral<60&&(a=Math.min(a,Math.abs(t.s-i)-Math.max(t.half.x,t.radius)-30));a-=o*60+(s?60:0),a>r&&(r=a,n.breakdownS=i)}n.breakdownLateral=10.2}this.tuned={...vm[n.contract]},this.tuned.basePay=Math.round(this.tuned.basePay*e.payScale/1e3)*1e3,this.tuned.maxSpeed*=r.speed,this.tuned.boostSpeed*=r.speed,this.tuned.accel*=r.pull,this.tuned.brake*=r.brakes,this.tuned.grip*=r.grip,this.tuned.damageScale*=r.knocks,this.boostLasts=Yf,n.s=34,n.lateral=4,n.hitch=Kd(e,34,4),n.yaw=qd(e,34),n.trailerYaw=n.yaw,n.stormS=n.s-wm[n.risk].headStartSeconds*this.stormSpeed(),n.ground=Rd(e,n.hitch),this.nearestPoint=17,this.obstacles=e.obstacles.map(e=>({s:e.s,lateral:e.lateral,pos:{...e.pos},yaw:e.yaw+(e.trafficSpeed<0?Math.PI:0),broken:!1,scored:!1,way:1,minGap:1e3,speedAtMinGap:0,lastHitTime:-100})),this.bridgeDone=e.bridges.map(()=>!1),this.jumpDone=e.jumps.map(()=>!1),n.jumpFalls=e.jumps.map(()=>0),n.giftsTaken=e.gifts.map(()=>!1)}start(){this.state.phase===0&&(this.state.phase=1,this.state.countdown=3)}stormSpeed(){return this.course.stormSpeed*this.rig.stormPace+(this.course.endless?this.state.time*Lp:0)}distancePay(){return this.course.endless?Math.round(Math.max(0,this.state.s-34)*Rp/100)*100:0}stormLeadSeconds(){return(this.state.s-this.state.stormS)/this.stormSpeed()}chainScale(){return Math.min(1+Rf*this.state.chain,zf)}parSeconds(){return this.course.parSeconds*this.rig.parFactor}timeBonus(){return this.state.phase===4?Math.max(0,Math.round((this.parSeconds()-this.state.time)*1500)):0}damageCost(){return Math.round(this.state.damage*1500)+this.state.breakdowns*Lf}stormBonus(){return Math.round(this.rig.basePay*(wm[this.state.risk].payScale-1))}recoveryFee(){return ym[this.broken].fee}pay(){let e=this.state;if(this.course.endless)return Math.max(0,this.distancePay()+e.bonusDollars-this.damageCost());if(this.recovery){let t=e.phase===4&&e.loaded?this.recoveryFee():0;return Math.max(0,t+e.bonusDollars-Math.round(e.towBill)-Math.round(e.busDamage)*Sm-this.damageCost())}return Math.max(0,this.rig.basePay+e.bonusDollars+this.timeBonus()+(e.beatStorm?this.stormBonus():0)-this.damageCost()-(e.overshot?1e4:0))}grade(){if(this.course.endless){let e=(this.state.s-34)/1609;return e>=5?`S`:e>=3.5?`A`:e>=2.5?`B`:e>=1.5?`C`:`D`}let e=this.recovery?this.pay()/(this.recoveryFee()*.8):this.pay()/(this.rig.basePay+this.stormBonus()+25e3);return e>=1?`S`:e>=.9?`A`:e>=.75?`B`:e>=.55?`C`:`D`}breakdownPos(){return Kd(this.course,this.state.breakdownS,this.state.breakdownLateral)}breakdownYaw(){return qd(this.course,this.state.breakdownS)}deckTail(){return gd(this.state.hitch,G(Sd(this.state.trailerYaw),this.rig.loadEnd))}atTheBreakdown(){let e=this.state;return this.recovery&&!e.loaded&&Math.abs(e.s-e.breakdownS)<80}nextNote(){let e=this.state,t=null;for(let n of this.course.notes)if(n.s>e.s-14){if(n.s-e.s>230)break;let r=n.text;r.includes(`hold SPACE`)&&!this.mustDuckNear(n.s)&&(r=r.slice(0,r.indexOf(`/`))+`/  clear it, no need to duck`),t={text:r,distance:Math.max(0,n.s-e.s)};break}return this.recovery&&!e.loaded&&e.breakdownS-e.s>-14&&e.breakdownS-e.s<300&&(!t||e.breakdownS-e.s<t.distance+40)&&(t={text:`${ym[this.broken].name} BROKEN DOWN  /  right shoulder: pass her, back up`,distance:Math.max(0,e.breakdownS-e.s)}),t}mustDuckNear(e){for(let t of this.course.bridges)if(!(Math.abs(t.s-e)>30)){for(let e=1;e<=this.rig.loadEnd;e+=1)if(Tm(this.rig,e,0)>t.clearance)return!0}return!1}shout(e,t=0){this.state.lastCall=e,this.state.lastCallTime=this.state.time,this.state.lastCallDollars=t}dent(e,t,n,r){let i=this.state;i.chain=0;let a=e*this.rig.damageScale;i.damage=Math.min(100,i.damage+a),i.hurt[t]+=a,t===0&&r!==0&&(i.pull=xd(i.pull+r*a*.04,-1,1)),i.damage>=100&&i.breakdownLeft<=0&&i.phase===2&&(i.breakdownLeft=Ff,i.breakdowns++,this.shout(11))}step(e,t){let n=this.state;switch(n.phase){case 1:n.countdown-=t,n.countdown<=0&&(n.phase=2);break;case 2:n.time+=t,this.stepDriving(e,t);break;case 3:n.time+=t,this.stepLift(e,t)}this.rescueHeld=e.rescue}rescue(){let e=this.state,t=this.course;if(e.phase!==2||e.airborne)return;let n=xd(e.s,10,t.stopS-10);for(let r of t.jumps)r.shortcut?e.onShortcut&&n>r.s-lp&&n<r.s+r.gap+6&&(n=r.putBackS):n>r.s-lp&&n<r.s+r.gap+6&&(n=Math.max(10,r.s-lp));this.putBack(n),this.shout(10)}putBack(e){let t=this.state,n=this.course;t.s=e,t.lateral=0,t.hitch=Kd(n,e),t.yaw=qd(n,e),t.trailerYaw=t.yaw,t.speed=0,t.steer=0,t.rearSteer=0,t.height=0,t.offroad=!1,t.inWater=!1,t.offroadSeconds=0,t.stuckSeconds=0,t.onShortcut=!1,t.falling=!1,t.fallClock=0,t.airborne=!1,t.ground=Rd(n,t.hitch),t.pitch=0,this.nearestPoint=Math.round(e/2)}project(){let e=this.course,t=this.state,n=this.nearestPoint,r=1/0;for(let i=Math.max(0,this.nearestPoint-12);i<=Math.min(e.points.length-1,this.nearestPoint+40);i++){let a=yd(e.points[i].pos,t.hitch);a<r&&(r=a,n=i)}this.nearestPoint=n;let i=e.points[n],a=gd(t.hitch,i.pos);t.s=n*2+_d(a,Sd(i.yaw)),t.lateral=_d(a,Cd(i.yaw)),t.offroad=Math.abs(t.lateral)>11&&!Hd(e,t.s,t.lateral)&&!(this.atTheBreakdown()&&t.lateral>0&&t.lateral<15),t.onShortcut=!1;for(let n of e.shortcuts){let r=gd(n.to,n.from),i=vd(r),a=G(r,1/i),o=gd(t.hitch,n.from),s=_d(o,a),c=_d(o,{x:-a.y,y:a.x});s<2||s>i-2||Math.abs(c)>n.halfWidth+12||Math.abs(c)>=Math.abs(t.lateral)||(t.onShortcut=!0,t.s=bd(n.fromS,n.toS,s/i),t.lateral=c,t.offroad=Math.abs(c)>n.halfWidth+kp,this.nearestPoint=xd(Math.round(t.s/2),0,e.points.length-1))}}wayYaw(){let e=this.state;if(e.onShortcut){for(let t of this.course.shortcuts)if(e.s>=t.fromS&&e.s<=t.toS){let e=gd(t.to,t.from);return Math.atan2(e.y,e.x)}}return qd(this.course,e.s)}stepDriving(e,t){let n=this.course,r=this.rig,i=this.state,a=i.s;i.rearSteer=Td(i.rearSteer,xd(e.tail,-1,1)*Cf,t,Kf),i.duck=Td(i.duck,+!!e.duck,t,e.duck?qf:Jf),i.boosting=e.boost&&i.boost>0&&e.throttle>.5,i.boosting&&(i.boost=Math.max(0,i.boost-t/this.boostLasts)),i.stormS=this.noStorm?-1e4:Math.max(i.stormS+this.stormSpeed()*t,i.s-wm[i.risk].mostLeadSeconds*this.stormSpeed());let o=i.stormS>i.s;o&&!i.inStorm&&this.shout(7),i.inStorm=o;let s=i.inStorm?Math.sin(i.time*1.7)+.6*Math.sin(i.time*4.3+1):0;if(n.endless&&(i.caughtSeconds=o?i.caughtSeconds+t:Math.max(0,i.caughtSeconds-t*.5),i.caughtSeconds>=Ip)){i.phase=4,i.caught=!0,i.speed=0,i.boosting=!1,i.beatStorm=!1,this.shout(23);return}if(i.waterClock>0){let e=i.waterJump>=0?n.jumps[i.waterJump]:null;i.waterClock-=t,i.speed=0,i.boosting=!1;let a=i.falling?5.800000000000001-i.waterClock:Df-i.waterClock;if(i.height=-Math.min(e?e.depth:Of,Of+.5*Ef*a**2),i.waterClock<=0){let t=e&&e.gorge?n.shortcuts.find(t=>e.s>t.fromS&&e.s<t.toS):void 0,a=e?e.gorge?i.jumpFalls[i.waterJump]<2||!t?e.putBackS:t.fromS+60:i.jumpFalls[i.waterJump]<2?Math.max(10,e.s-lp):e.s+e.gap+r.loadEnd+12:i.s;if(t)for(let e=0;e<n.gifts.length;e++)n.gifts[e].s>t.fromS&&n.gifts[e].s<t.toS&&(i.giftsTaken[e]=!1);this.putBack(a),i.boost=Math.max(i.boost,.5),this.shout(10)}return}i.ground=Rd(n,i.hitch);let c=i.airborne?0:Bd(n,i.hitch,i.yaw);i.pitch+=(Math.atan(c)-i.pitch)*Math.min(1,t*6);let l=i.boosting?r.boostSpeed:r.maxSpeed;if(i.duck>.3&&(l=Math.min(l,20)),i.inStorm&&(l=Math.min(l,21)),i.offroad&&(l=Math.min(l,15)),i.onShortcut&&(l*=Op),c>0&&(l*=Math.max(.35,1-Tp*c)),c<0&&(l*=1-Ep*c),i.wading=!1,!i.airborne)for(let e of n.waters)Wd(i.hitch,e.from,e.to)<e.half*e.half&&Math.abs(i.lateral)>e.clearHalf&&(i.wading=!0);i.wading&&(l=Math.min(l,Sp),i.speed-=Math.sign(i.speed)*Math.min(Math.abs(i.speed),Cp*t));for(let e=0;e<n.gifts.length;e++){let t=n.gifts[e];if(!i.giftsTaken[e]&&yd(W(i.hitch,G(Sd(i.yaw),4.3)),t.pos)<9){if(i.giftsTaken[e]=!0,t.repair){let e=i.damage;i.damage=Math.max(0,i.damage-xp);for(let t=0;t<3;t++)i.hurt[t]*=e>0?i.damage/e:0;this.shout(19)}else i.boost=1,this.shout(18)}}let u=i.damage/100;l*=1-kf*u;let d=r.brake*(1-jf*u)*(c<0?Math.max(.5,1+Dp*c):1),f=r.accel*(1-Af*u),p=r.grip*(1-Mf*u),m=i.breakdownLeft>0;if(m&&(i.breakdownLeft-=t,i.boosting=!1,i.breakdownLeft<=0)){i.damage=If;for(let e=0;e<3;e++)i.hurt[e]*=If/100;i.pull*=.5,this.shout(12)}let h=m?0:xd(e.throttle,0,1)-xd(e.brake,0,1);i.airborne||(m?i.speed=Math.max(0,i.speed-d*.6*t):h>0?i.speed=i.speed<0?Math.min(0,i.speed+d*t):i.speed+f*(i.boosting?Bf:1)*h*Math.max(0,1-(i.speed/l)**2)*t:h<0?i.speed=i.speed>.3?Math.max(0,i.speed+d*h*t):Math.max(-5,i.speed+3*h*t):i.speed-=Math.sign(i.speed)*Math.min(Math.abs(i.speed),Vf*t)),!i.airborne&&!m&&i.speed>0&&(i.speed=Math.max(0,i.speed-c*wp*r.weight*t)),i.speed>l&&!i.airborne&&(i.speed=Math.max(l,i.speed-(i.offroad?Uf:Hf)*t));let g=Math.max(Math.abs(i.speed),1),_=Math.min(Sf,Math.atan(5*p/(g*g)));i.steer=xd(Td(i.steer,i.airborne?0:xd(e.steer,-1,1)*_,t,Gf),-_,_);let v=G(Sd(i.yaw),i.speed),y=Math.abs(i.speed)/r.maxSpeed,b=_d(v,Cd(i.trailerYaw+i.rearSteer))/(r.dollyDist*Math.cos(i.rearSteer)),x=wd(i.yaw-i.trailerYaw),S=i.speed<0&&!i.airborne?b-2.5*Math.abs(i.speed)*Math.sin(x)/r.dollyDist:0,C=this.wayYaw();i.blow=i.airborne?0:Vd(n,i.s,i.time,i.onShortcut);let w=.45+.55*Math.min(1,Math.abs(i.speed)/jp),T=i.blow*Ap*r.sail*w;Math.abs(i.blow)>2.5&&i.time-i.lastWaveTime>3&&n.winds.some(e=>e.period>0&&i.s>e.fromS&&i.s<e.toS)&&(i.lastWaveTime=i.time,this.dent(Np,1,r.loadEnd*.5,Math.sign(i.blow)),this.shout(22));let E=i.airborne?0:i.speed*Math.tan(i.steer)/5+S+s*.03*y+i.pull*Nf*y,D=b+s*.05+i.hurt[2]/100*Pf*y*Math.sin(i.time*3.1)+T*Mp*Math.cos(i.trailerYaw-C);i.yaw+=E*t,i.trailerYaw+=D*t,i.hitch=W(i.hitch,G(v,t)),T!==0&&(i.hitch=W(i.hitch,G(Cd(C),T*t)));let ee=wd(i.yaw-i.trailerYaw);Math.abs(ee)>1.25&&(i.trailerYaw=i.yaw-Math.sign(ee)*wf,i.speed>3&&(i.lastCall!==5||i.time-i.lastCallTime>1.5)&&(this.dent(4,0,.5,-Math.sign(ee)),i.speed*=.5,i.hits++,this.shout(5))),this.project(),i.inWater=!1;for(let e=0;e<n.jumps.length;e++){let t=n.jumps[e];t.shortcut===i.onShortcut&&(!i.airborne&&a<t.s&&i.s>=t.s&&i.speed>np&&(i.airborne=!0,i.airJump=e,i.airClock=0,i.airVz=i.speed*Tf),!i.airborne&&i.s>t.s&&i.s<t.s+t.gap&&(this.jumpDone[e]=!0,i.jumpFalls[e]++,i.inWater=!0,i.waterJump=e,i.speed=0,i.boost=0,t.gorge?(i.falling=!0,i.fallClock=0,i.waterClock=5.800000000000001,i.height=-.5,this.dent(Fp,0,-3,0),i.bonusDollars-=Pp,i.fallDollars-=Pp,i.hits++,this.shout(20,-6e4)):(i.waterClock=Df,i.height=-1.7,this.dent(20,0,-3,0),i.hits++,this.shout(9))))}if(i.airborne){if(i.airClock+=t,i.height=Gd+i.airVz*i.airClock-.5*Ef*i.airClock*i.airClock,i.height<=0){i.airborne=!1,i.height=0;let e=n.jumps[i.airJump];if(i.s>=e.s+e.gap&&!this.jumpDone[i.airJump]){this.jumpDone[i.airJump]=!0;let t=e.gorge?ep*3:ep;i.bonusDollars+=t,i.boost=Math.min(1,i.boost+tp),this.shout(e.gorge?21:8,t)}}}else{i.height=0;for(let e of n.jumps){if(e.shortcut!==i.onShortcut)continue;let t=16*e.squeeze;i.s>e.s-t&&i.s<=e.s&&(i.height=Gd*(i.s-(e.s-t))/t)}}n.coast&&!i.airborne&&!i.inWater&&Math.abs(i.lateral)>23&&i.s>60&&i.s<n.stopS-20&&(i.inWater=!0,i.waterJump=-1,i.waterClock=Df,i.speed=0,i.height=-1.7,this.dent(zp,0,-3,0),i.hits++,this.shout(24));for(let e=0;e<this.obstacles.length;e++){let r=n.obstacles[e],a=this.obstacles[e];if(r.swayWidth){let e=a.lateral;a.lateral=r.swayWidth*Math.sin(i.time*(r.swayRate??1)+(r.swayPhase??0)),a.pos=Kd(n,a.s,a.lateral),a.yaw=qd(n,a.s)+(a.lateral>=e?Math.PI/2:-Math.PI/2)}else if(r.kind===K.Traffic&&!a.broken&&a.s>-60&&a.s<n.length){if(a.s-i.s<(r.trafficSpeed<0?ip:rp)){let e=r.trafficSpeed*a.way;for(let t of n.jumps)(e>0&&a.s>t.s-14&&a.s<t.s||e<0&&a.s<t.s+t.gap+14&&a.s>t.s+t.gap)&&(a.way=-a.way);let o=Math.max(bf,this.rig.rootRadius)+r.half.y+.4,s=Math.abs(a.lateral-i.lateral)<o,c=e<0?a.s-r.half.x-(i.s+6):i.s-this.rig.loadEnd-1-(a.s+r.half.x);s&&c>-3&&c<7||(a.s+=r.trafficSpeed*a.way*t),a.yaw=qd(n,a.s)+(r.trafficSpeed*a.way<0?Math.PI:0)}a.pos=Kd(n,a.s,a.lateral)}}if(i.airborne||this.collide(t),i.offroadSeconds=i.offroad&&!i.airborne?i.offroadSeconds+t:0,i.stuckSeconds=Math.abs(i.speed)<1.5&&i.s<n.stopS-5&&!this.atTheBreakdown()?i.stuckSeconds+t:0,e.rescue&&!this.rescueHeld||i.offroad&&i.stuckSeconds>ap||Math.abs(i.lateral)>op)this.rescue();else{if(this.recovery){i.towBill+=this.recoveryFee()*bm*t;let n=ym[this.broken];if(!i.foundBreakdown&&yd(i.hitch,this.breakdownPos())<3600&&(i.foundBreakdown=!0,this.shout(27)),!i.loaded){let r=this.breakdownYaw(),a=W(this.breakdownPos(),G(Sd(r),n.halfLength)),o=Math.abs(i.speed)<.4,s=Math.abs(wd(i.trailerYaw-r))<.5&&Math.abs(wd(i.yaw-r))<.8,c=o&&s&&yd(this.deckTail(),a)<121;c&&!i.linedUp&&this.shout(28),i.linedUp=c,c&&e.fix?(i.winchSkew+=(xm*(Math.sin(i.time*1.7)+.6*Math.sin(i.time*2.9+1))-1.5*e.steer)*t,i.winchSkew=xd(i.winchSkew,-1.4,1.4),Math.abs(i.winchSkew)>1?(i.busDamage+=3*t,i.time-i.lastScrapeTime>2&&(i.lastScrapeTime=i.time,this.shout(29))):i.winch=Math.min(1,i.winch+t/9),i.winch>=1&&(i.loaded=!0,i.winchSkew=0,this.tuned.rootThickness=n.height,this.tuned.tipThickness=n.height,this.tuned.weight=n.weight,this.tuned.maxSpeed*=.9,this.tuned.boostSpeed*=.9,this.tuned.accel*=.7,this.tuned.brake*=.85,this.tuned.grip*=.9,this.shout(30))):c||(i.winch=Math.max(0,i.winch-t*.5),i.winchSkew=Td(i.winchSkew,0,t,1))}}for(let e of n.crossings){let n=i.s-e.s,a=Math.abs(i.lateral)<10;if(a&&n>-4&&n<r.loadEnd+4&&Ad(e,i.time)&&i.time-i.lastTrainTime>2){i.lastTrainTime=i.time;let t=xd(n,0,r.loadEnd);this.dent(gp,n<5?0:t>r.dollyDist-2?2:1,t,1);let a=Cd(e.yaw+e.skew);i.hitch=W(i.hitch,G(a,n<5?7:4));let o=_d(a,Cd(i.trailerYaw))>0?.45:-.45;i.trailerYaw+=n<5?o*.4:o,i.speed*=.2,i.hits++,this.shout(14)}else if(a&&n>r.loadEnd+4&&n<r.loadEnd+4+Math.max(Math.abs(i.speed),1)*t*1.5&&jd(e,i.time)&&i.time-i.lastTrainTime>2){let e=Math.round(_p*this.chainScale());i.bonusDollars+=e,i.bestChain=Math.max(i.bestChain,++i.chain),this.shout(15,e)}}for(let e of n.scales){if(i.weighed||i.blewScale)break;Id(e,i.s,i.lateral)&&Math.abs(i.speed)<.3?(i.weighClock+=t,i.weighClock>=bp&&(i.weighed=!0,i.bonusDollars+=vp,i.scaleDollars+=vp,this.shout(16,vp))):i.weighClock=0,i.s>e.s+e.length+12&&!i.weighed&&(i.blewScale=!0,i.bonusDollars-=yp,i.scaleDollars-=yp,this.shout(17,-25e3))}n.endless?i.s>=n.stopS&&(i.phase=4,i.speed=0,i.boosting=!1,i.beatStorm=!i.inStorm,this.shout(13)):(i.s>n.stopS+n.stopLength&&(i.overshot||(i.overshot=!0,this.shout(6,-1e4)),i.speed=Math.max(0,i.speed-Wf*t)),this.recovery?i.s>=n.stopS&&Math.abs(i.speed)<.6&&i.loaded&&(i.phase=4,i.speed=0,i.boosting=!1,i.beatStorm=!1,this.shout(31,this.recoveryFee())):i.s>=n.stopS&&Math.abs(i.speed)<.6&&(i.phase=3,i.speed=0,i.boosting=!1,i.beatStorm=!i.inStorm&&!this.noStorm,i.liftClock=0,i.craneX=Bp,i.craneV=0,i.loadX=Bp,i.loadVX=i.inStorm?3:1.5,i.loadY=gm(r.shape)?Vp:Hp,i.loadVY=0,i.liftHold=0,i.clangCool=0,i.setDown=!1,i.clangs=0,this.shout(13)))}}stepLift(e,t){let n=this.state,r=this.rig,i=this.course;n.stormS=this.noStorm?-1e4:n.stormS+this.stormSpeed()*t,n.stormS>n.s&&!n.inStorm&&(n.inStorm=!0,this.shout(7));let a=r.accel/5,o=!gm(r.shape),s=_m(r.shape);n.liftClock+=t;let c=Math.min(1,Math.max(Math.abs(n.craneX),Math.abs(n.loadX))/im),l=(1.2+.28*r.accel)*bd(am,1,c);n.craneV=Td(n.craneV,xd(e.steer,-1,1)*l,t,tm),n.craneX=Math.min(n.craneX+n.craneV*t,2);let u=i.coast||i.desert?1.6:1,d=(n.inStorm?$p:Qp*u)*a*Math.sin(2.3*n.liftClock+.5);if(n.liftGust=(n.inStorm?Zp:Xp*u)*a*(Math.sin(1.3*n.liftClock)+.6*Math.sin(3.1*n.liftClock+1)),n.setDown=o&&n.setDown&&e.throttle<=0,n.setDown)n.loadVX=0,n.loadVY=0;else{let r=o?bd(am,1,xd(n.loadY/om,0,1)):1;n.loadVY=Td(n.loadVY,(xd(e.throttle,0,1)-xd(e.brake,0,1))*nm*r+d,t,rm),n.loadY=Math.min(n.loadY+n.loadVY*t,o?Wp:Up);let i=Math.min(Yp,qp+Jp*n.liftClock);n.loadVX+=(-1.8*Kp*(n.loadX-n.craneX)-2*i*Kp*n.loadVX+n.liftGust)*t,n.loadX+=n.loadVX*t}n.clangCool=Math.max(0,n.clangCool-t),s&&n.loadX>Gp&&(n.loadVX>fm(n.liftClock)?(++n.clangs<=lm&&this.dent(3,1,1.5,0),n.loadVX*=-.6,o||(n.loadY-=sm,n.loadVY=-1),n.clangCool=.8,n.liftHold=0,this.shout(25)):n.loadVX=Math.min(n.loadVX,0),n.loadX=Gp),o&&!n.setDown&&n.loadY<=0&&(n.loadY=0,n.loadVY<-pm(n.liftClock)?(++n.clangs<=lm&&this.dent(3,1,3,0),n.loadVY=cm,n.clangCool=.8,n.liftHold=0,this.shout(25)):(n.loadVX=0,n.loadVY=0,n.setDown=!0));let f=mm(n.liftClock);if(n.liftHold=(o?n.setDown&&(s?n.loadX>-f:Math.abs(n.loadX)<f):Math.abs(n.loadX)<f&&Math.abs(n.loadY)<f&&Math.abs(n.loadVX)<hm(n.liftClock))?n.liftHold+t:Math.max(0,n.liftHold-em*t),n.liftHold>=1.5){n.phase=4,n.loadX=0,n.loadY=0,n.loadVX=0,n.loadVY=0;let e=n.clangs===0?dm:0;n.bonusDollars+=e,this.shout(26,e)}}gapTo(e,t,n){if(e.radius>0){let r=gd(n,t.pos),i=vd(r);return{gap:i-e.radius,away:i>.001?G(r,1/i):{x:1,y:0}}}let r=Sd(t.yaw),i=Cd(t.yaw),a=gd(n,t.pos),o={x:_d(a,r),y:_d(a,i)},s=gd(o,{x:xd(o.x,-e.half.x,e.half.x),y:xd(o.y,-e.half.y,e.half.y)}),c=vd(s);if(c>.001)return{gap:c,away:W(G(r,s.x/c),G(i,s.y/c))};let l=e.half.x-Math.abs(o.x),u=e.half.y-Math.abs(o.y);return{gap:-Math.min(l,u),away:l<u?G(r,Math.sign(o.x)):G(i,Math.sign(o.y))}}collide(e){let t=this.course,n=this.rig,r=this.state,i=Sd(r.yaw),a=G(Sd(r.trailerYaw),-1),o=[W(r.hitch,G(i,1.2)),W(r.hitch,G(i,4.3))],s=W(r.hitch,G(a,n.dollyDist)),c=n.underside-r.duck*yf,l=Math.abs(r.speed);for(let i=0;i<this.obstacles.length;i++){let u=t.obstacles[i],d=this.obstacles[i];if(d.broken||Math.abs(d.s-r.s)>hp&&yd(d.pos,r.hitch)>8100)continue;let f=1e3,p={x:0,y:0};for(let e of o){let{gap:t,away:n}=this.gapTo(u,d,e),r=t-bf;f=Math.min(f,r),r<0&&(p=gd(p,G(n,r)))}let m=0,h=n.dollyDist,g={x:0,y:0};{let{gap:e,away:t}=this.gapTo(u,d,s),n=e-xf;f=Math.min(f,n),n<0&&(m=-n,g=t)}if(u.height>c)for(let e=1;e<=n.loadEnd;e+=2){let{gap:t,away:i}=this.gapTo(u,d,W(r.hitch,G(a,e))),o=t-Em(n,e);f=Math.min(f,o),-o>m&&(m=-o,h=e,g=i)}f<d.minGap&&(d.minGap=f,d.speedAtMinGap=l);let _=Math.abs(p.x)>1e-6||Math.abs(p.y)>1e-6,v=m>0;if(_||v){let t=r.time-d.lastHitTime>mp&&(!u.solid||r.time-r.lastKnockTime>cp);d.lastHitTime=r.time;let i=_?0:h>n.dollyDist-2?2:1,a=_?_d(gd(d.pos,r.hitch),Sd(r.yaw)):h,o=Math.sign(_d(gd(d.pos,r.hitch),Cd(_?r.yaw:r.trailerYaw)));if(u.solid){if(_&&(r.hitch=W(r.hitch,p),t?(this.dent(xd(l*.35,1,9),i,a,o),r.speed*=.35):(r.speed-=Math.sign(r.speed)*xd(l-sp,0,9*e),this.dent(.25*l*e,i,a,o))),v){let n=-_d(g,Cd(r.trailerYaw))*m/h;r.trailerYaw+=xd(n,-.05,.05),r.speed-=Math.sign(r.speed)*Math.min(l,6*e),this.dent(.3*l*e+(t?3:0),_?1:i,_?h:a,o)}t&&(r.hits++,this.shout(3)),r.lastKnockTime=r.time}else{d.broken=!0;let e=0,t=1;switch(u.kind){case K.Sign:e=1,t=.97;break;case K.Bollard:e=2,t=.92;break;case K.Pole:e=4,t=.88;break;case K.Board:e=5,t=.85;break;case K.Bin:e=2,t=.9;break;case K.Stall:e=3,t=.86;break;case K.ParkedCar:e=6,t=.7;break;case K.Traffic:e=8,t=.6}this.dent(e,i,a,o),r.speed*=t,e>0&&(r.hits++,this.shout(3))}}let y=r.s-n.loadEnd-4-u.half.x;if(!d.scored&&!d.broken&&d.s<y&&(d.scored=!0,u.kind!==K.Cone&&u.kind!==K.Sign&&u.kind!==K.Bollard&&u.kind!==K.Wall&&d.lastHitTime<0&&d.minGap<Xf&&d.speedAtMinGap>Zf)){r.closeCalls++;let e=Math.round(Qf*this.chainScale());r.bonusDollars+=e,r.boost=Math.min(1,r.boost+up),r.bestChain=Math.max(r.bestChain,++r.chain),this.shout(1,e)}}let u=Math.abs(r.lateral)<14;for(let e=0;e<t.bridges.length;e++){if(this.bridgeDone[e])continue;let i=t.bridges[e],a=!1,o=1;for(let e=1;e<=n.loadEnd&&!a;e+=1)a=u&&Math.abs(r.s-e-i.s)<pp&&Tm(n,e,r.duck)>i.clearance,o=e;if(a)this.bridgeDone[e]=!0,this.dent(12,1,o,0),r.speed*=.55,r.hits++,this.shout(4);else if(r.s-n.loadEnd>i.s+2&&(this.bridgeDone[e]=!0,l>fp&&u)){let e=Math.round($f*this.chainScale());r.bonusDollars+=e,r.boost=Math.min(1,r.boost+dp),r.bestChain=Math.max(r.bestChain,++r.chain),this.shout(2,e)}}}},Am=(e,t,n)=>Math.max(t,Math.min(n,e)),jm=e=>Am(e,-1,1),Mm=5.5,Nm=2.2;function Pm(e,t){if(e.radius>0)return e.radius;let n=e.yaw-t;return Math.abs(Math.cos(n))*e.half.y+Math.abs(Math.sin(n))*e.half.x}function Fm(e,t={}){let n=Dm(),r=e.state,i=e.course,a=e.rig;if(r.phase===q.Lifting){let e=gm(a.shape),t=_m(a.shape)?-.2:0;n.steer=jm((t-r.loadX)*1.2-r.loadVX*1.6-r.craneV*.2);let i=(e?0:Math.abs(r.loadX-t)<.6&&Math.abs(r.loadVX)<.5?-1:2)-r.loadY;return n.throttle=i>.15?Math.min(1,i):0,n.brake=i<-.15?Math.min(1,-i*(e?1:.5)):0,n}if(r.phase!==q.Driving)return n;let o=null;if(t.shortcuts)for(let e of i.shortcuts){let t=i.jumps.findIndex(t=>t.gorge&&t.s>e.fromS&&t.s<e.toS),n=t>=0&&(r.jumpFalls[t]>=2||r.inStorm&&!r.onShortcut);r.s>e.fromS-40&&r.s<e.toS-10&&!n&&(o=e)}let s=o?Math.atan2(o.to.y-o.from.y,o.to.x-o.from.x):qd(i,r.s),c=o?G(gd(o.to,o.from),1/vd(gd(o.to,o.from))):null,l=c?{x:-c.y,y:c.x}:null,u=o?_d(gd(W(r.hitch,G(Sd(r.yaw),5)),o.from),c):0,d=o?0:4;for(let e=0;e<=70&&!o;e+=6){let t=Jd(i,r.s+e);if(Math.abs(t)>1/50){d=-Math.sign(t)*4;break}}for(let e=0;e<=60&&!o;e+=10){let t=0;for(let n of i.winds)!n.shortcut&&r.s+e>n.fromS&&r.s+e<n.toS&&Math.abs(n.push)>Math.abs(t)&&(t=n.push);if(Math.abs(t)>1){d=-Math.sign(t)*4;break}}let f=a.rootRadius>bf+.6,p=o?[0,o.halfWidth*.45,-o.halfWidth*.45,o.halfWidth*.25,-o.halfWidth*.25,o.halfWidth*.65,-o.halfWidth*.65]:[4,0,-4,2.64,1.32,-1.32,-2.64,6.5,-6.5],m=d,h=1/0,g=1e3,_=!1,v=!1,y=1e3,b=t=>{m=d,h=1/0;for(let n=0;n<(f||o?p.length:3);n++){let b=p[n],x=Math.abs(b-d)*.3+Math.abs(b-r.lateral)*.05,S=1e3;for(let n=0;n<e.obstacles.length;n++){let d=i.obstacles[n],p=e.obstacles[n];if(p.broken||d.kind===0)continue;let m=p.s-r.s,h=p.lateral;if(o){let e=gd(p.pos,o.from);if(h=_d(e,l),m=_d(e,c)-u,Math.abs(h)>o.halfWidth+3)continue}else if(Math.abs(p.lateral)>9)continue;if(t&&d.trafficSpeed>0&&!d.swayWidth&&m>0||m<-a.loadEnd-6||m>(d.trafficSpeed<0?130:60))continue;let g=f&&d.height>a.underside?a.rootRadius+.8:bf+.7;d.trafficSpeed<0&&m>0&&(v=!0),d.trafficSpeed>0&&!d.swayWidth&&m>0&&m<45&&(y=Math.min(y,d.trafficSpeed-(m<16?2:0)));let C=Math.abs(h-b)-Pm(d,s)-g;if(d.swayWidth){let e=Math.max(Math.abs(r.speed),4);C=1e3;for(let t of[-7,-3,0,4,10]){let n=r.time+Math.max(m+t,0)/e,i=d.swayWidth*Math.sin(n*(d.swayRate??1)+(d.swayPhase??0));C=Math.min(C,Math.abs(i-b)-d.half.x-(bf+.9))}m>6&&m<60&&(_=!0)}C<0&&(x+=100-C*10,S=Math.min(S,Math.max(m,0)))}x<h&&(h=x,m=b,g=S)}};b(!1);let x=f&&v&&h>=100,S=f&&!x&&h>=100&&y<999;S&&b(!0);let C=1/0;if(e.recovery&&!r.loaded){let t=ym[e.broken],o=r.breakdownS+t.halfLength+a.loadEnd+2.5;if(r.linedUp)return n.fix=!0,n.steer=jm(r.winchSkew*2),n;if(r.s>r.breakdownS-150){if(r.s>r.breakdownS+t.halfLength+4&&(m=r.breakdownLateral),C=o+22,(r.speed<-.05||Math.abs(r.speed)<.5&&r.s>o+4)&&r.s>o+.6){let t=wd(r.trailerYaw-qd(i,r.s));n.steer=jm(-(r.breakdownLateral-Im(e))*.3-t*2);let a=Math.min(4,Math.max(.6,(r.s-o)*.5));return r.speed>-a?n.brake=1:n.throttle=.4,n}if(r.s>o-4&&r.s<=o+4&&Math.abs(r.speed)<1.5)return r.speed<-.05?n.throttle=1:r.speed>.05&&(n.brake=1),n}}let w=!1,T=0;for(let n of i.scales){let i=r.s<Md(n)||Math.abs(r.lateral-n.lateral)<2.4;(t.weigh??!0)&&!r.weighed&&!r.blewScale&&r.s>n.s-110&&r.s<Md(n)+30&&i&&(e.stormLeadSeconds()>11||Fd(n,r.s,r.lateral))&&(w=!0,r.s>n.s-24&&(m=n.lateral),T=Md(n)+12)}let E=10+.7*Math.abs(r.speed),D;if(o){let e=gd(o.to,o.from),t=vd(e),n=G(e,1/t),i=Am(_d(gd(W(r.hitch,G(Sd(r.yaw),5)),o.from),n)+E,0,t+30);D=W(W(o.from,G(n,i)),G(l,m))}else D=Kd(i,r.s+E,m);let ee=gd(D,W(r.hitch,G(Sd(r.yaw),5))),O=Vd(i,r.s,r.time,r.onShortcut),k=Math.atan2(O*.9*a.sail,Math.max(Math.abs(r.speed),12));n.steer=jm(wd(Math.atan2(ee.y,ee.x)-r.yaw-k)/.2);let te=0;for(let e=0;e<=150;e+=10)te=Math.max(te,-Bd(i,Kd(i,r.s+e),qd(i,r.s+e)));let A=Math.max(1.5,a.brake*Math.max(.5,1-Nm*te)-Mm*te*a.weight),j=a.maxSpeed,M=!0;for(let e=0;e<=150&&!o;e+=4){let t=Math.abs(Jd(i,r.s+e));t>1e-4&&(M=!1,j=Math.min(j,Math.sqrt(a.grip*.72/t+2*A*.62*e)))}_&&h>=100&&(j=Math.min(j,5)),x?j=Math.min(j,g<18?0:5):S&&(j=Math.min(j,y));for(let e of i.narrows)r.s>e.s-60&&r.s<e.s+e.length&&(j=Math.min(j,14));let ne=w;for(let e of i.crossings){let t=e.s-r.s;if(t>-2&&t<120&&jd(e,r.time)){let n=kd(e,r.time);(n<-10?(-n-10)/e.speed:0)<(t+a.loadEnd+8)/Math.max(Math.abs(r.speed),1)+1.5&&(j=Math.min(j,Math.max(0,(t-9)*.5)),ne=!0)}}w&&(j=Math.min(j,Am(Math.sqrt(Math.max(T-r.s,0)*4),0,9))),C<1/0&&(ne=!0,j=Math.min(j,Am(Math.sqrt(Math.max(C-r.s,0)*3),0,12)));let N=!1;for(let e=0;e<=60+2*a.loadEnd&&!N;e+=6)N=Math.abs(Jd(i,r.s+e))>1/50;for(let t=0;N&&t<e.obstacles.length;t++){let n=e.obstacles[t].s-r.s-9,a=i.obstacles[t];a.trafficSpeed>0&&!a.swayWidth&&!e.obstacles[t].broken&&n>-6&&n<45&&(j=Math.min(j,a.trafficSpeed+Math.max(0,n)*.25))}let re=i.stopS+16-r.s;i.endless||(j=Math.min(j,Math.sqrt(Math.max(0,2*A*.5*re))));let ie=!1;for(let e of i.jumps){if(e.shortcut!==!!(o||r.onShortcut))continue;let t=e.s-r.s;if(t<-2||t>220)continue;let n=!0;for(let e=0;e<=t&&!o;e+=4)Math.abs(Jd(i,r.s+e))>1e-4&&(n=!1);n&&(ie=!0,j=Math.max(j,a.maxSpeed))}let ae=!1;for(let e of i.bridges){let t=-1;for(let n=1;n<=a.loadEnd;n+=1)Tm(a,n,0)>e.clearance&&(t=n);if(t<0)continue;let i=r.s-e.s;i>-(8+Math.abs(r.speed)*.5)&&i<t+3&&(n.duck=!0),i>-120&&i<t+3&&(ae=!0),i>-90&&i<10&&(j=Math.min(j,20))}let oe=1/0;for(let e of i.jumps)e.gorge&&r.onShortcut&&(oe=Math.min(oe,(e.s-r.s)/e.squeeze));let se=oe>75&&oe<400;n.boost=r.boost>.25&&(M||ie)&&!ae&&(i.endless||re>250)&&!ne&&!se,n.boost&&(j=a.boostSpeed),r.speed<j-.4?n.throttle=1:r.speed>j+.8&&(n.brake=Am((r.speed-j)/3,.25,1)),j<.5&&Math.abs(r.speed)>.05&&(n.throttle=0,n.brake=1),n.rescue=r.breakdownLeft<=0&&j>=.5&&!(e.recovery&&e.atTheBreakdown())&&(r.stuckSeconds>6&&r.time-r.lastKnockTime<2||r.stuckSeconds>15);let ce=wd(r.yaw-r.trailerYaw),le=3*Am(20/a.dollyDist,.3,1)**2;return n.tail=Math.abs(ce)>.05?jm(-ce*le):0,n}function Im(e){let t=e.deckTail(),n=e.state.s-e.rig.loadEnd;return _d(gd(t,Kd(e.course,n)),Cd(qd(e.course,n)))}var Lm={name:`CopyShader`,uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`},Rm=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error(`THREE.Pass: .render() must be implemented in derived pass.`)}dispose(){}},zm=new Os(-1,1,1,-1,0,1),Bm=new class extends Mr{constructor(){super(),this.setAttribute(`position`,new br([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute(`uv`,new br([0,2,0,0,2,0],2))}},Vm=class{constructor(e){this._mesh=new H(Bm,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,zm)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}},Hm=class extends Rm{constructor(e,t=`tDiffuse`){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof Fo?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Mo.clone(e.uniforms),this.material=new Fo({name:e.name===void 0?`unspecified`:e.name,defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new Vm(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},Um=class extends Rm{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let r=e.getContext(),i=e.state;i.buffers.color.setMask(!1),i.buffers.depth.setMask(!1),i.buffers.color.setLocked(!0),i.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),i.buffers.stencil.setTest(!0),i.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),i.buffers.stencil.setFunc(r.ALWAYS,a,4294967295),i.buffers.stencil.setClear(o),i.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),i.buffers.color.setLocked(!1),i.buffers.depth.setLocked(!1),i.buffers.color.setMask(!0),i.buffers.depth.setMask(!0),i.buffers.stencil.setLocked(!1),i.buffers.stencil.setFunc(r.EQUAL,1,4294967295),i.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),i.buffers.stencil.setLocked(!0)}},Wm=class extends Rm{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}},Gm=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new z);this._width=n.width,this._height=n.height,t=new Zt(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:g}),t.texture.name=`EffectComposer.rt1`}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name=`EffectComposer.rt2`,this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Hm(Lm),this.copyPass.material.blending=0,this.timer=new Fs}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let t=0,r=this.passes.length;t<r;t++){let r=this.passes[t];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(t),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),r.needsSwap){if(n){let t=this.renderer.getContext(),n=this.renderer.state.buffers.stencil;n.setFunc(t.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),n.setFunc(t.EQUAL,1,4294967295)}this.swapBuffers()}Um!==void 0&&(r instanceof Um?n=!0:r instanceof Wm&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new z);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(n,r),this.renderTarget2.setSize(n,r);for(let e=0;e<this.passes.length;e++)this.passes[e].setSize(n,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}},Km=class extends Rm{constructor(e,t,n=null,r=null,i=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=r,this.clearAlpha=i,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new V}render(e,t,n){let r=e.autoClear;e.autoClear=!1;let i,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(i=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==1&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(i),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=r}},qm={name:`LuminosityHighPassShader`,uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new V(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`},Jm=class e extends Rm{constructor(e,t=1,n,r){super(),this.strength=t,this.radius=n,this.threshold=r,this.resolution=e===void 0?new z(256,256):new z(e.x,e.y),this.clearColor=new V(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new Zt(i,a,{type:g,depthBuffer:!1}),this.renderTargetBright.texture.name=`UnrealBloomPass.bright`,this.renderTargetBright.texture.generateMipmaps=!1;for(let e=0;e<this.nMips;e++){let t=new Zt(i,a,{type:g,depthBuffer:!1});t.texture.name=`UnrealBloomPass.h`+e,t.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(t);let n=new Zt(i,a,{type:g,depthBuffer:!1});n.texture.name=`UnrealBloomPass.v`+e,n.texture.generateMipmaps=!1,this.renderTargetsVertical.push(n),i=Math.round(i/2),a=Math.round(a/2)}let o=qm;this.highPassUniforms=Mo.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Fo({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];let s=[6,10,14,18,22];i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let e=0;e<this.nMips;e++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(s[e])),this.separableBlurMaterials[e].uniforms.invSize.value=new z(1/i,1/a),i=Math.round(i/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new B(1,1,1),new B(1,1,1),new B(1,1,1),new B(1,1,1),new B(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Mo.clone(Lm.uniforms),this.blendMaterial=new Fo({uniforms:this.copyUniforms,vertexShader:Lm.vertexShader,fragmentShader:Lm.fragmentShader,premultipliedAlpha:!0,blending:2,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new V,this._oldClearAlpha=1,this._basic=new li,this._fsQuad=new Vm(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),r=Math.round(t/2);this.renderTargetBright.setSize(n,r);for(let e=0;e<this.nMips;e++)this.renderTargetsHorizontal[e].setSize(n,r),this.renderTargetsVertical[e].setSize(n,r),this.separableBlurMaterials[e].uniforms.invSize.value=new z(1/n,1/r),n=Math.round(n/2),r=Math.round(r/2)}render(t,n,r,i,a){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();let o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),a&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=r.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=r.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let s=this.renderTargetBright;for(let n=0;n<this.nMips;n++)this._fsQuad.material=this.separableBlurMaterials[n],this.separableBlurMaterials[n].uniforms.colorTexture.value=s.texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[n]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[n].uniforms.colorTexture.value=this.renderTargetsHorizontal[n].texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[n]),t.clear(),this._fsQuad.render(t),s=this.renderTargetsVertical[n];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(r),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=o}_getSeparableBlurMaterial(e){let t=[],n=e/3;for(let r=0;r<e;r++)t.push(.39894*Math.exp(-.5*r*r/(n*n))/n);let r=[],i=[];for(let n=1;n<e;n+=2){let a=t[n],o=n+1<e?t[n+1]:0,s=a+o;r.push((n*a+(n+1)*o)/s),i.push(s)}return new Fo({defines:{KERNEL_PAIRS:r.length},uniforms:{colorTexture:{value:null},invSize:{value:new z(.5,.5)},direction:{value:new z(.5,.5)},centerWeight:{value:t[0]},gaussianOffsets:{value:r},gaussianWeights:{value:i}},vertexShader:`

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

				}`})}_getCompositeMaterial(e){return new Fo({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

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

				}`})}};Jm.BlurDirectionX=new z(1,0),Jm.BlurDirectionY=new z(0,1);var Ym={name:`OutputShader`,uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`},Xm=class extends Rm{constructor(){super(),this.isOutputPass=!0,this.uniforms=Mo.clone(Ym.uniforms),this.material=new Io({name:Ym.name,uniforms:this.uniforms,vertexShader:Ym.vertexShader,fragmentShader:Ym.fragmentShader}),this._fsQuad=new Vm(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Rt.getTransfer(this._outputColorSpace)===`srgb`&&(this.material.defines.SRGB_TRANSFER=``),this._toneMapping===1?this.material.defines.LINEAR_TONE_MAPPING=``:this._toneMapping===2?this.material.defines.REINHARD_TONE_MAPPING=``:this._toneMapping===3?this.material.defines.CINEON_TONE_MAPPING=``:this._toneMapping===4?this.material.defines.ACES_FILMIC_TONE_MAPPING=``:this._toneMapping===6?this.material.defines.AGX_TONE_MAPPING=``:this._toneMapping===7?this.material.defines.NEUTRAL_TONE_MAPPING=``:this._toneMapping===5&&(this.material.defines.CUSTOM_TONE_MAPPING=``),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},Zm=new ta(1,1,1),Qm=new na(.5,.5,1,18),$m=new ra(.5,1,12),eh=new To(.5,12,8),th=new Map;function nh(e,t=!1,n=0){let r=`${e.join(`,`)}|${t}|${n}`,i=th.get(r);return i||(i=new Lo({color:new V(e[0],e[1],e[2]),roughness:t?.35:.85,metalness:t?.3:0}),n>0&&(i.emissive=new V(e[0],e[1],e[2]),i.emissiveIntensity=n),th.set(r,i)),i}function rh(e,t,n,r,i){e.position.set(t,r,n),e.rotation.set(0,-i,0)}function Y(e,t,n,r,i,a,o,s,c=!1,l=!0){let u=new H(Zm,nh(s,c));return u.position.set(t,r,n),u.scale.set(i,o,a),u.castShadow=l,u.receiveShadow=!0,e.add(u),u}function X(e,t,n,r,i,a,o,s,c=!1){let l=new H(Qm,nh(s,c));return l.position.set(t,r,n),l.scale.set(i,a,i),o===`x`&&(l.rotation.z=Math.PI/2),o===`y`&&(l.rotation.x=Math.PI/2),l.castShadow=!0,l.receiveShadow=!0,e.add(l),l}function ih(e,t,n,r,i,a,o,s,c=!1){let l=new H(new na(a*.5,i*.5,o,18),nh(s,c));return l.position.set(t,r,n),l.rotation.z=Math.PI/2,l.castShadow=!0,l.receiveShadow=!0,e.add(l),l}function ah(e,t,n,r,i,a,o){let s=new H($m,nh(o));return s.position.set(t,r+a*.5,n),s.scale.set(i,a,i),s.castShadow=!0,e.add(s),s}function oh(e,t,n,r,i,a){let o=new H(eh,nh(a));return o.position.set(t,r,n),o.scale.set(i,i,i),o.castShadow=!0,e.add(o),o}function sh(e,t,n,r,i,a,o,s,c=2){let l=new H(Zm,nh(s,!1,c));return l.position.set(t,r,n),l.scale.set(i,o,a),e.add(l),l}function ch(e,t){let n=document.createElement(`canvas`);n.width=e,n.height=e;let r=n.getContext(`2d`),i=12345;return t(r,()=>(i=i*1103515245+12345&2147483647,i/2147483647)),n}function lh(t,n,r){let i=new Zi(t);return i.wrapS=i.wrapT=e,i.repeat.set(n,r),i.anisotropy=8,i.colorSpace=ze,i}function uh(){return lh(ch(512,(e,t)=>{e.fillStyle=`#36363a`,e.fillRect(0,0,512,512);for(let n=0;n<26e3;n++){let n=40+Math.floor(t()*45);e.fillStyle=`rgb(${n},${n},${n+2})`,e.fillRect(t()*512,t()*512,1+t()*2,1+t()*2)}for(let n=0;n<40;n++)e.fillStyle=`rgba(0,0,0,${.05+t()*.1})`,e.beginPath(),e.ellipse(t()*512,t()*512,20+t()*60,8+t()*20,t()*3,0,Math.PI*2),e.fill()}),1,1)}function dh(){return lh(ch(512,(e,t)=>{e.fillStyle=`#4f7a2c`,e.fillRect(0,0,512,512);for(let n=0;n<3e4;n++){let n=95+Math.floor(t()*60);e.fillStyle=`rgb(${n-40+Math.floor(t()*20)},${n},${30+Math.floor(t()*20)})`,e.fillRect(t()*512,t()*512,1+t()*2,2+t()*4)}for(let n=0;n<30;n++)e.fillStyle=`rgba(120,100,60,${.08+t()*.12})`,e.beginPath(),e.ellipse(t()*512,t()*512,30+t()*80,20+t()*50,t()*3,0,Math.PI*2),e.fill()}),1,1)}function fh(){return lh(ch(256,(e,t)=>{e.fillStyle=`#6b6252`,e.fillRect(0,0,256,256);for(let n=0;n<9e3;n++){let n=80+Math.floor(t()*60);e.fillStyle=`rgb(${n+10},${n},${n-15})`,e.fillRect(t()*256,t()*256,1+t()*2,1+t()*2)}}),1,1)}function ph(){let e=new Zi(ch(256,(e,t)=>{e.clearRect(0,0,256,256);for(let n=0;n<28;n++){let n=60+t()*136,r=90+t()*76,i=28+t()*40,a=e.createRadialGradient(n,r,0,n,r,i);a.addColorStop(0,`rgba(255,255,255,0.55)`),a.addColorStop(1,`rgba(255,255,255,0)`),e.fillStyle=a,e.fillRect(0,0,256,256)}}));return e.colorSpace=ze,e}function mh(e,t=`#f5b400`,n=`#0a0a0c`,r=64){let i=document.createElement(`canvas`),a=i.getContext(`2d`);a.font=`900 ${r}px "Archivo Black", Impact, sans-serif`;let o=Math.ceil(a.measureText(e).width)+r;i.width=Math.min(2048,o),i.height=r*1.6;let s=i.getContext(`2d`);s.fillStyle=n,s.fillRect(0,0,i.width,i.height),s.fillStyle=t,s.font=`900 ${r}px "Archivo Black", Impact, sans-serif`,s.textAlign=`center`,s.textBaseline=`middle`,s.fillText(e,i.width/2,i.height/2+r*.05);let c=new Zi(i);return c.colorSpace=ze,c.aspect=i.width/i.height,c}function hh(e){let t=new ds().load(e);return t.colorSpace=ze,t}function gh(e,t=`#f5b400`){let n=document.createElement(`canvas`);n.width=256,n.height=128;let r=n.getContext(`2d`);r.fillStyle=`#0a0a0c`,r.fillRect(0,0,256,128),r.fillStyle=t,r.font=`900 64px "Archivo Black", Impact, sans-serif`,r.textAlign=`center`,r.textBaseline=`middle`,r.fillText(e,128,68);let i=new Zi(n);return i.colorSpace=ze,i}var _h=e=>{for(;e>Math.PI;)e-=2*Math.PI;for(;e<-Math.PI;)e+=2*Math.PI;return e},vh=[.12,.12,.13],yh=[.8,.82,.85],bh=[.05,.05,.05],xh=[.3,.45,.55],Sh=[.95,.75,.05],Ch=[.1,.1,.11],wh=class{wheel(e,t,n,r,i,a,o){let s=new kn;s.position.set(t,i,n);let c=i*.27,l=new Eo(i-c,c,10,28),u=new Lo({color:new V(.06,.06,.06),roughness:.95}),d=new Lo({color:new V(.1,.1,.1),roughness:.9}),f=new Lo({color:new V(.85,.86,.88),roughness:.25,metalness:.8}),p=new Lo({color:new V(.2,.2,.22),roughness:.6,metalness:.4}),m=(e,t)=>{let n=new H(l,u);n.scale.set(1,1,a*.5/c),n.position.z=e,n.castShadow=!0,s.add(n);for(let t=0;t<2;t++){let n=new H(new Eo(i-.02,.012,4,36),d);n.position.z=e+(t===0?-1:1)*a*.16,s.add(n)}let o=new H(new na(i-c+.02,i-c+.02,a*.86,24),d);if(o.rotation.x=Math.PI/2,o.position.z=e,s.add(o),t){let t=r*(e+a*.44),n=new H(new na(i*.58,i*.62,.06,24),f);n.rotation.x=Math.PI/2,n.position.z=r*(Math.abs(e)+a*.4),s.add(n);let o=new H(new na(i*.4,i*.5,.08,20),p);o.rotation.x=Math.PI/2,o.position.z=r*(Math.abs(e)+a*.46),s.add(o);let c=new H(new na(i*.17,i*.17,.1,16),f);c.rotation.x=Math.PI/2,c.position.z=t+r*.03,s.add(c);for(let e=0;e<8;e++){let n=e/8*Math.PI*2,a=new H(new na(.035,.035,.05,6),f);a.rotation.x=Math.PI/2,a.position.set(Math.cos(n)*i*.3,Math.sin(n)*i*.3,t+r*.02),s.add(a)}}};return o?(m(-a*.52*r,!1),m(a*.52*r,!0)):m(0,!0),e.add(s),s}constructor(e,t,n){this.scene=e,this.truck=new kn,this.trailer=new kn,this.load=new kn,this.cradle=new kn,this.wheels=[],this.frontWheels=[],this.brakeLamps=[],this.flames=[],this.deckPivot=null,this.deckLength=16,this.deckTilt=0,this.winchCable=null,this.vehicle=null,this.vehicleKind=null,this.flashers=[],this.loadFree=!1,this.buildTruck(t),this.buildTrailer(n),this.buildLoad(n),e.add(this.truck,this.trailer,this.load)}remove(){this.scene.remove(this.truck,this.trailer,this.load),this.vehicle&&this.vehicle.parent?.remove(this.vehicle)}buildTruck(e){let t=e.color,n=e.name===`BULL`,r=e.name===`HORNET`,i=n?2.4:r?1.9:2.2,a=this.truck;if(Y(a,2.6,0,1,7.4,2.8,.8,t,!0),Y(a,4.4,0,1.4+i*.5,2.6,2.8,i,t,!0),!r)Y(a,2.2,0,1.4+i*.45,1.8,2.8,i*.9,t,!0),Y(a,2.2,0,1.4+i*.9+.05,1.9,2.4,.1,t,!0);else{Y(a,2.9,0,1.4+i+.5,.9,2.6,.12,t,!0);for(let e of[-1,1])Y(a,2.9,e*1.2,1.4+i+.25,.5,.1,.5,t,!0)}Y(a,.2,0,1.45,1.4,1.6,.12,vh),X(a,.2,0,1.5,1.2,.08,`up`,[.3,.3,.32]),Y(a,5.76,0,1.4+i*.3,.06,2,.9,yh,!0);for(let e=0;e<5;e++)Y(a,5.8,0,1.4+i*.3-.36+e*.18,.04,1.9,.06,[.06,.06,.07]);if(Y(a,5.76,0,1.4+i*.3+.55,.06,2.1,.12,yh,!0),Y(a,6.6,0,.62,.3,3,.5,yh,!0),n){for(let e of[.5,1.2,1.9])X(a,6.95,0,e,.14,3.1,`y`,yh,!0);for(let e of[-1.3,-.45,.45,1.3])Y(a,6.95,e,1.2,.12,.12,1.8,vh);Y(a,6.7,0,1,.4,1,.5,vh)}Y(a,5.95,0,1.4+i-.02,.6,2.9,.08,t,!0);for(let e of[-.9,-.45,0,.45,.9])sh(a,5.6,e,1.4+i+.04,.12,.18,.08,[1,.6,.1],1.6);for(let e of[-.5,.5])X(a,4.6,e,1.4+i+.2,.18,.9,`x`,yh,!0);Y(a,4.1,0,1.4+i*.27,.03,2.84,.04,yh,!0);for(let e of[-1,1]){let r=n?.38:.3;X(a,2.9,e*1.2,2.4+i*.5,r,i+.2,`up`,yh,!0);let o=sh(a,2.9,e*1.2,2.4+i+.6,.5,.5,1.4,[1,.55,.1],4);o.visible=!1,this.flames.push(o);for(let t of[-.7,.7])this.wheels.push(this.wheel(a,t,e*1.18,e,.65,.42,!0));let s=this.wheel(a,5,e*1.3,e,.65,.42,!1);this.wheels.push(s),this.frontWheels.push(s),Y(a,5,e*1.3,1.36,1.7,.9,.14,t,!0),Y(a,0,e*1.3,1.38,3,.9,.14,t,!0),Y(a,4.9,e*1.41,1.4+i*.66,1.1,.05,i*.34,xh,!0),Y(a,2.2,e*1.41,1.4+i*.6,.6,.05,.5,xh,!0),Y(a,5.4,e*1.75,1.4+i*.75,.05,.7,.05,vh),Y(a,5.4,e*1.75,1.4+i*.35,.05,.7,.05,vh),Y(a,5.4,e*2.05,1.4+i*.55,.12,.08,1,vh),Y(a,5.46,e*2.05,1.4+i*.55,.02,.06,.9,yh,!0),Y(a,3.65,e*1.42,1.4+i*.45,.2,.03,.05,yh,!0),Y(a,3.1,e*1.44,1.4+i*.4,.04,.04,.9,yh,!0),X(a,1.5,e*1.12,.92,.72,1.7,`x`,yh,!0),sh(a,6.52,e*1.05,.98,.1,.5,.26,[1,.95,.8],2),sh(a,5.72,e*1.25,1.4+i-.08,.06,.2,.1,[1,.6,.1],2),Y(a,3.6,e*1.35,.45,.9,.5,.06,vh),Y(a,3.6,e*1.35,.85,.9,.5,.06,vh),Y(a,-1.45,e*1.25,.5,.05,.7,.8,[.012,.012,.015]);let c=new H(new wo(.9,.5),new Lo({map:gh(`AXLON`),roughness:.5}));c.position.set(4.05,1.4+i*.27,e*1.42),c.rotation.y=e>0?0:Math.PI,a.add(c)}Y(a,5.72,0,1.4+i*.66,.05,2.5,i*.38,xh,!0),Y(a,6.45,0,1,.1,2.6,.5,yh,!0)}buildTrailer(e){let t=this.trailer;Y(t,-e.dollyDist*.5,0,1.1,e.dollyDist,1.2,.5,vh),Y(t,-e.dollyDist,0,.85,5.4,3,.5,Ch,!0);for(let n of[-1.6,0,1.6])for(let r of[-1,1])this.wheels.push(this.wheel(t,-e.dollyDist+n,r*1.15,r,.5,.36,!0));for(let n of[-1,1]){Y(t,-e.dollyDist,n*1.3,1.08,5.2,.9,.12,[.08,.08,.09]);for(let r=-2;r>-e.dollyDist+1;r-=1.2)Y(t,r,n*.63,1,.6,.04,.12,Math.round(-r/1.2)%2==0?[.9,.05,.03]:[.92,.92,.9],!1,!1)}let n=-e.dollyDist-2.78;for(let e=0;e<8;e++)Y(t,n,-1.4+.4*e,1.05,.1,.4,.5,e%2==0?Sh:vh,!1,!1);for(let e of[-1,1])this.brakeLamps.push(sh(t,n-.04,e*.85,.62,.1,.5,.26,[1,.1,.05],1));Y(t,-1.2,0,1.25,2.6,2.6,.3,Ch,!0),Y(t,-.6,0,.95,1,1.4,.4,vh);for(let n=-3;n>-e.dollyDist+2;n-=2.2)Y(t,n,0,1.37,2,1.4,.04,[.25,.25,.27],!1,!1);Y(t,-e.dollyDist+3.4,.9,.8,1,.6,.6,vh),Y(t,n+.3,0,.45,.1,2.6,.12,vh);for(let n of[-1,1]){for(let r=-3;r>-e.dollyDist+2;r-=2.2)sh(t,r,n*.63,1.34,.18,.04,.06,[1,.6,.1],1.2);Y(t,-e.dollyDist-2.3,n*1.2,.45,.04,.6,.6,[.012,.012,.015])}t.add(this.cradle)}buildLoad(e){let t=this.load,n=e.loadEnd-1,r=-(1+e.loadEnd)*.5,i=e.underside,a=e.rootRadius*2,o=[.22,.22,.2],s=(e,t)=>(e.rotation.z=t*Math.PI/180,e),c=(e,t)=>(e.rotation.x=t*Math.PI/180,e);switch(e.shape){case`transformer`:{Y(this.trailer,r,0,i-.25,n+1,a-.4,.4,vh);let o=e.rootThickness-.9;Y(t,r,0,i+o*.5,n*.8,a*.75,o,e.color,!0);for(let s of[-1,1])for(let c=-n*.38;c<=n*.38;c+=.45)Y(t,r+c,s*(a*.375+.35),i+o*.5,.12,.7,o-.4,[e.color[0]*.8,e.color[1]*.8,e.color[2]*.8]);Y(t,r,0,i+o+.12,n*.82,a*.78,.24,[.12,.2,.24]),X(t,r-n*.15,0,i+o+.9,1.2,n*.5,`x`,[.5,.52,.52],!0);for(let e of[-a*.25,0,a*.25]){X(t,r+n*.25,e,i+o+.6,.4,.9,`up`,[.6,.45,.3]);for(let a=.2;a<.9;a+=.2)X(t,r+n*.25,e,i+o+.25+a,.55,.06,`up`,[.6,.45,.3])}for(let e of[-1,1])for(let s of[-1,1])Y(t,r+e*n*.38,s*a*.3,i+o+.4,.4,.12,.5,vh);for(let e of[-n*.4,0,n*.4])Y(t,r+e,0,i+.2,.35,a+.1,.4,Sh);break}case`rocket`:{for(let e of[-n*.35,0,n*.35]){for(let t of[-1,1])Y(this.trailer,r+e,t*1.3,i+.4,.6,.4,.8,vh);Y(this.trailer,r+e,0,i-.1,.6,3.2,.3,vh)}let a=e.rootRadius*2,o=i+a*.5;X(t,r+n*.05,0,o,a,n*.74,`x`,e.color,!0);for(let e=-n*.3;e<=n*.35;e+=n*.16)X(t,r+e,0,o,a+.08,.3,`x`,[.75,.75,.78],!0);X(t,r-n*.2,0,o,a+.06,n*.12,`x`,[.1,.35,.8],!0);let s=ih(t,r+n*.5-n*.08,0,o,a*.3,a,n*.16,e.color,!0);s.rotation.z=Math.PI/2;let c=ih(t,r-n*.42,0,o,a,a*.92,n*.2,e.color,!0);c.rotation.z=Math.PI/2;let l=ih(t,r-n*.5+.8,0,o,a*.55,a*.85,2,[.3,.3,.32],!0);l.rotation.z=Math.PI/2;for(let i of[-1,1])Y(t,r-n*.46,i*(a*.5+.7),o,2.4,1.4,.12,e.color,!0);for(let e of[-1,1])Y(t,r-n*.1,e*(a*.5-.5),o+a*.5-.6,.8,.2,.5,vh);break}case`house`:{let o=2.5;Y(this.trailer,r,0,i-.25,n+1,a-.6,.4,vh),Y(t,r,0,i+o*.5,n,a,o,e.color);for(let e of[-1,1]){c(Y(t,r,e*a*.26,i+o+.62,n+.7,a*.58,.22,[.33,.12,.08]),e*22);for(let o=-n*.5+2.2;o<n*.5-1;o+=3.2)Y(t,r+o,e*(a*.5+.03),i+1.45,1.3,.08,1,[.1,.16,.22],!0,!1),Y(t,r+o,e*(a*.5+.05),i+1.45,1.4,.04,.06,[.95,.95,.92],!1,!1),Y(t,r+o,e*(a*.5+.05),i+1.45,.06,.04,1.1,[.95,.95,.92],!1,!1)}for(let s of[-1,1])Y(t,r+s*(n*.5-.15),0,i+o+.3,.3,a*.66,.6,e.color),Y(t,r+s*(n*.5-.15),0,i+o+.85,.3,a*.3,.5,e.color);Y(t,r-n*.5-.03,.9,i+1.05,.08,1,2,[.3,.08,.05]),Y(t,r+2.5,-1.1,i+o+1.2,.8,.8,1.2,[.4,.16,.1]);for(let e of[-n*.5,0,n*.5])Y(t,r+e,0,i+.2,.35,a+.1,.4,Sh);break}case`excavator`:{let c=e.color,l=[c[0]*.75,c[1]*.75,c[2]*.75];Y(this.trailer,r,0,i-.25,n+1,a-.4,.4,vh);for(let e of[-1,1]){Y(t,r,e*1.55,i+.55,n*.62,.9,1.1,o),Y(t,r,e*1.55,i+1.15,n*.66,1,.2,vh),Y(t,r,e*1.55,i+.1,n*.66,1,.2,vh);for(let a=-n*.28;a<=n*.28;a+=n*.14)X(t,r+a,e*1.55,i+.55,.7,1.02,`y`,[.18,.18,.2])}Y(t,r,0,i+.9,n*.4,2.4,.6,o),X(t,r,0,i+1.35,2.6,.3,`up`,vh),Y(t,r-.6,0,i+2.3,n*.5,a-.2,1.8,c,!0),Y(t,r-n*.5+1.2,0,i+2.3,1.4,a,1.9,l,!0),Y(t,r-n*.5+.48,0,i+2.3,.06,e.rootRadius*1.6,.5,vh);for(let a of[-1,1])sh(t,r-n*.5+.48,a*(e.rootRadius-.4),i+3,.06,.3,.2,[1,.1,.05],2);Y(t,r+n*.12,1.2,i+2.9,2.2,1.6,2,c,!0),Y(t,r+n*.12,1.2,i+3.1,2.24,1.64,1.1,xh,!0),Y(t,r-.6,0,i+3.3,n*.3,1.6,.3,l),s(Y(t,r+n*.18,-.6,i+2.6,n*.42,.7,.8,c,!0),-14),s(Y(t,r+n*.44,-.6,i+1.9,n*.28,.5,.6,c,!0),50),Y(t,r+n*.5-.4,-.6,i+.7,1.5,1.6,1.1,o);for(let e of[-n*.5,0,n*.5])Y(t,r+e,0,i+.2,.35,a+.1,.4,Sh);break}case`yacht`:{let o=e.color,l=[.04,.09,.22];Y(this.trailer,r,0,i-.25,n+1,3.2,.4,vh);for(let e of[-n*.3,n*.25])for(let t of[-1,1])c(Y(this.trailer,r+e,t*1.5,i+.55,.3,.3,1.1,[.2,.2,.21]),t*-18);let u=t=>e.rootRadius*2+(e.tipRadius*1.2-e.rootRadius*2)*t*t;for(let e=0;e<6;e++){let a=(e+.5)/6,s=r-n*.5+a*n,c=u(a);Y(t,s,0,i+1.2,n/6*1.05,c,1.6,o,!0),Y(t,s,0,i+.35,n/6*1.05,c*.8,.5,l,!0)}let d=X(t,r-n*.1,0,i+.95,e.rootRadius*1.9,n*.78,`x`,o,!0);d.scale.x=1.9,s(Y(t,r+n*.5-1.6,0,i+1.9,3.2,e.tipRadius*2.2,.9,o,!0),-16),Y(t,r-n*.1,0,i+.62,n*.8,a+.04,.16,l,!0),Y(t,r-n*.05,0,i+.1,n*.3,.3,.9,l,!0),Y(t,r-n*.5+.1,0,i+1.3,.2,a+.05,1.5,[o[0]*.9,o[1]*.9,o[2]*.9],!0);let f=new H(new wo(1.8,.4),new Lo({map:gh(`AXLEYARD`),roughness:.5,transparent:!0}));f.position.set(r-n*.5-.02,i+1.4,0),f.rotation.y=-Math.PI/2,t.add(f);for(let a of[-1,1]){for(let e=-n*.45;e<n*.3;e+=n*.12){let o=u((e+n*.5)/n);X(t,r+e,a*(o*.5-.1),i+2.35,.06,.7,`up`,yh,!0)}Y(t,r-n*.08,a*(e.rootRadius*.75+.02),i+2.6,n*.3,.06,.5,xh,!0)}Y(t,r-n*.08,0,i+2.5,n*.36,e.rootRadius*1.5,1.1,o,!0),Y(t,r-n*.08,0,i+3.1,n*.3,e.rootRadius*1.2,.14,[o[0]*.85,o[1]*.85,o[2]*.85],!0),X(t,r+n*.05,.6,i+2.2,.18,n*.85,`x`,yh,!0),Y(t,r+n*.3,-.4,i+2.15,n*.18,.5,.3,l);break}case`deck`:{this.deckLength=n,this.deckPivot=new kn,this.deckPivot.position.set(-e.dollyDist,i-.15,0),t.add(this.deckPivot);let r=this.deckPivot,a=e.dollyDist-1,o=a-n*.5;Y(r,o,0,0,n,3,.3,e.color,!0),Y(r,o,0,.17,n-.3,2.7,.04,[.14,.14,.15],!1,!1);for(let e=a-1;e>a-n+1;e-=1.5)Y(r,e,0,.2,.08,2.7,.02,[.3,.3,.32],!1,!1);for(let e of[-1,1])Y(r,o,e*1.45,.25,n,.1,.2,Sh);Y(r,a-n+.2,0,-.02,.5,3,.26,Sh),Y(r,a-.6,0,.55,1,2.4,.8,vh),X(r,a-.6,0,.6,.7,2,`y`,[.55,.56,.58],!0),X(r,a-1.25,0,.3,.18,1.2,`y`,yh,!0),this.winchCable=Y(r,a-1.2,0,.35,1,.05,.05,[.1,.1,.1],!1,!1),this.winchCable.visible=!1;let s=X(this.trailer,-4,0,i-.5,.3,2.4,`x`,yh,!0);s.rotation.z=Math.PI/2-.3;break}default:{let n=(e.loadEnd-1)/16;for(let r=0;r<16;r++){let i=1+(r+.5)*n,a=Tm(e,i,0)-e.underside,o=r%5==4?Sh:e.color,s=Em(e,i-n*.5)*2,c=Em(e,i+n*.5)*2;if(e.boxy)Y(t,-i,0,e.underside+a*.5,n*1.03,s,a,o,!0);else{let r=ih(t,-i,0,e.underside+a*.5,s,c,n*1.03,o,!0);r.scale.y=a/Math.max(s,.01)}}}}e.shape!==`deck`&&Y(t,-e.loadEnd-.4,0,e.underside+.4,.9,.9,.9,[.9,.05,.03])}setBroken(e,t){this.vehicle&&this.vehicle.parent?.remove(this.vehicle),this.vehicleKind=e,this.flashers=[];let n=new kn;this.vehicle=n,this.scene.add(n);let r=e.halfLength*2,i=e.height,a=t===1?2.5:2.6,o=e.halfLength,s=-e.halfLength,c=[.92,.92,.9],l=(e,t)=>{X(n,e,t,.55,1.1,.4,`y`,bh),X(n,e,t+Math.sign(t)*.21,.55,.6,.04,`y`,yh,!0)},u=(e,t,r,i)=>this.flashers.push(sh(n,e,t,r,.06,.28,.2,i,3)),d=(e,t,r,i,a)=>sh(n,e,t,r,.05,i,a,[1,.95,.8],2),f=(e,t,r,i,a)=>sh(n,e,t,r,.05,i,a,[1,.08,.04],1.5),p=[1,.6,.05];if(t===0){Y(n,0,0,.5+(i-.5)*.5,r,a,i-.5,e.color,!0),Y(n,0,0,.75,r+.02,a+.02,.5,vh);for(let t of[-1,1]){Y(n,.3,t*(a*.5+.02),i-1.05,r-2.4,.05,1.3,xh,!0);for(let e=-r*.5+1.9;e<r*.5-1.4;e+=1.55)Y(n,e,t*(a*.5+.04),i-1.05,.07,.03,1.3,vh);Y(n,0,t*(a*.5+.02),1.3,r,.03,.22,[e.color[0]*.5,e.color[1]*.5,e.color[2]*.5]),Y(n,0,t*(a*.5+.03),1.48,r-.6,.02,.05,yh,!0),Y(n,o+.7,t*(a*.5+.5),i-1.1,.14,.22,.45,vh),d(o+.03,t*(a*.5-.4),1,.4,.22),f(s-.03,t*(a*.5-.35),1.15,.3,.45),u(o+.04,t*(a*.5-.95),1,p),u(s-.04,t*(a*.5-.8),1.15,p);for(let e of[o-2.2,s+2.6,s+3.9])l(e,t*(a*.5-.2))}Y(n,o+.03,0,i-1.15,.05,a-.3,1.7,xh,!0),sh(n,o+.04,0,i-.25,.05,a-.9,.28,[1,.5,.05],2),Y(n,s-.03,0,i-.65,.05,a-.7,.8,xh,!0);for(let e of[-2.6,2.4])Y(n,e,0,i+.14,1.6,1.4,.28,[.8,.8,.78])}else if(t===1){let t=[.45,.08,.1],m=[.8,.6,.2];Y(n,-1,0,.5+(i-.5)*.5,r-2,a,i-.5,e.color,!0),Y(n,o-1,0,i-.55,2,a,1.1,e.color,!0),Y(n,o-1,0,1.3,2,a-.2,1.5,e.color,!0),Y(n,o+.02,0,1.75,.05,a-.5,.9,xh,!0),Y(n,o+.03,0,1.05,.05,a-.8,.4,vh),Y(n,o+.05,0,.72,.14,a-.1,.26,[.55,.56,.58]);for(let e of[-1,1])Y(n,-1,e*(a*.5+.02),1.55,r-2.4,.03,.14,t),Y(n,-1,e*(a*.5+.02),1.72,r-2.4,.03,.05,m),Y(n,-2.6,e*(a*.5+.02),i-1.1,1.3,.05,.8,xh,!0),Y(n,-.6,e*(a*.5+.02),i-1.1,1.1,.05,.8,xh,!0),Y(n,o-1,e*(a*.5-.08),1.6,1.2,.05,.6,xh,!0),d(o+.03,e*(a*.5-.4),1.3,.3,.2),f(s-.03,e*(a*.5-.3),1.2,.25,.35),u(o+.04,e*(a*.5-.85),1.3,p),u(s-.04,e*(a*.5-.75),1.2,p),l(o-1.3,e*(a*.5-.2)),l(s+2.2,e*(a*.5-.2)),l(s+2.2,e*(a*.5-.62));Y(n,-1.55,a*.5+.02,1.9,.75,.03,2.1,[.75,.73,.68]),X(n,-1,a*.5+.12,i-.25,.2,r-3.2,`x`,[.5,.5,.52]);for(let e=1.2;e<3.1;e+=.4)Y(n,s-.1,.7,e,.05,.45,.05,yh,!0);X(n,s-.2,-.5,1.4,.85,.26,`x`,bh),Y(n,-1.6,0,i+.14,1,.9,.28,c)}else if(t===3){let t=o-3.3;Y(n,0,0,.75,r-.2,a-.4,.45,vh),Y(n,o-.9,0,1.1,1.8,a,.5,e.color,!0),Y(n,o-2.45,0,1+(i-1)*.5,1.9,a,i-1,e.color,!0);let c=r*.5+t-.2;Y(n,t-c*.5-.1,0,1.2,c,a,.7,e.color,!0),Y(n,t-c*.5-.1,0,1.5,c-.3,a-.2,.08,vh),Y(n,t-.6,0,1.6,.5,a-.3,.45,[.5,.5,.52],!0),Y(n,o-1.6,0,i-.45,.05,a-.5,.7,xh,!0),Y(n,o+.02,0,1.05,.05,a-.6,.45,vh),Y(n,o+.08,0,.7,.14,a,.22,[.55,.56,.58]),Y(n,s-.08,0,.7,.14,a,.22,[.55,.56,.58]),Y(n,o-2.2,0,i+.1,.25,1.4,.18,vh);for(let e of[-1,1])Y(n,o-2.45,e*(a*.5+.02),i-.55,1.7,.05,.6,xh,!0),d(o+.03,e*(a*.5-.35),1.1,.35,.25),f(s-.03,e*(a*.5-.25),1.2,.2,.5),u(o-2.2,e*.4,i+.1,p),u(s-.04,e*(a*.5-.6),1.2,p),l(o-1.2,e*(a*.5-.15)),l(s+1.4,e*(a*.5-.15))}else{Y(n,-.65,0,.5+(i-.5)*.5,r-1.3,a,i-.5,e.color,!0),Y(n,-.65,0,i-.05,r-1.7,a-.2,.1,c),Y(n,o-.65,0,1.35,1.3,a-.3,1.3,e.color,!0),Y(n,o+.02,0,1.3,.04,a-.8,.8,vh);for(let e of[1.1,1.3,1.5])Y(n,o+.04,0,e,.02,a-.9,.04,yh,!0);Y(n,o+.05,0,.75,.14,a,.28,vh),Y(n,s-.05,0,.75,.14,a,.28,vh),Y(n,o-1.28,0,i-1,.05,a-.4,1.1,xh,!0),Y(n,s-.03,0,i-1,.05,a-.8,.9,xh,!0);for(let e of[-1,1]){for(let t=s+1.4;t<o-2.6;t+=1.25)Y(n,t,e*(a*.5+.01),i-1,1.1,.03,1,vh),Y(n,t,e*(a*.5+.03),i-1,.95,.05,.85,xh,!0);for(let t of[.95,1.55,2.25])Y(n,-.65,e*(a*.5+.02),t,r-1.5,.04,.1,vh);d(o+.03,e*(a*.5-.45),1.5,.3,.25),f(s-.03,e*(a*.5-.35),1.3,.25,.4),u(o-1.27,e*(a*.5-.25),i-.2,[1,.08,.04]),u(s-.04,e*(a*.5-.25),i-.2,[1,.08,.04]),u(o+.04,e*(a*.5-.9),1.5,p),l(o-1.6,e*(a*.5-.2)),l(s+2.6,e*(a*.5-.2))}Y(n,o-2.2,-(a*.5+.35),1.6,.05,.5,.5,[.85,.05,.03])}}updateRecovery(e,t,n,r,i){let a=this.vehicle,o=this.vehicleKind,s=this.deckPivot;if(!a||!o||!s)return;let c=Math.floor(i*2)%2==0;for(let t=0;t<this.flashers.length;t++)this.flashers[t].visible=!e.loaded&&t%2==0===c;let l=this.deckLength-(t.dollyDist-1),u=Math.asin(Math.min(.5,(t.underside-.15)/l)),d=!e.loaded&&(e.linedUp||e.winch>0)?u:0;this.deckTilt+=Math.sign(d-this.deckTilt)*Math.min(Math.abs(d-this.deckTilt),r*.25),s.rotation.z=this.deckTilt;let f=t.dollyDist-1;if(!e.loaded&&e.winch<=0){a.parent!==this.scene&&(a.parent?.remove(a),this.scene.add(a)),rh(a,n.x,n.y,n.ground,n.yaw),a.rotation.set(0,-n.yaw,0,`YXZ`),this.winchCable&&(this.winchCable.visible=e.linedUp),this.winchCable&&e.linedUp&&this.cable(f-1.2,t.dollyDist-t.loadEnd-1);return}a.parent!==s&&(a.parent?.remove(a),s.add(a)),this.load.updateMatrixWorld(!0);let p=s.worldToLocal(new B(n.x,n.ground,n.y)),m=p.x,h=p.z,g=f-1.6-o.halfLength,_=e.loaded?1:e.winch,v=m+(g-m)*_,y=h*(1-_),b=f-this.deckLength,x=Math.max(0,Math.min(1,(v+o.halfLength-b)/(o.halfLength*2))),S=(-(t.underside-.15)-v*Math.sin(this.deckTilt))/Math.cos(this.deckTilt);a.position.set(v,.15*x+S*(1-x),y),a.rotation.set(0,e.winchSkew*.12*!e.loaded+(1-_)*-_h(n.yaw-e.trailerYaw),-this.deckTilt*(1-x),`YXZ`),this.winchCable&&(this.winchCable.visible=!e.loaded,e.loaded||this.cable(f-1.2,v+o.halfLength))}cable(e,t){let n=this.winchCable;n.scale.x=Math.max(.1,e-t),n.position.x=(e+t)*.5}resetRecovery(){this.deckTilt=0,this.deckPivot&&(this.deckPivot.rotation.z=0)}headlights(){for(let e of[-1,1]){let t=new Ds(new V(1,.95,.85),260,110,.42,.5,1.4);t.position.set(6.7,1,e*1),t.target.position.set(60,-1.5,e*2.5),t.castShadow=!1,this.truck.add(t,t.target)}}placeLoad(e,t,n,r,i){this.loadFree=!0,this.load.position.set(e,n,t),this.load.rotation.set(0,-r,i?Math.PI/2:0,`YXZ`)}update(e,t,n=0){let r=e.height+e.ground;rh(this.truck,e.hitch.x,e.hitch.y,r,e.yaw),rh(this.trailer,e.hitch.x,e.hitch.y,r,e.trailerYaw);let i=e.duck*yf;this.cradle.position.y=-i,this.truck.rotation.set(0,-e.yaw,e.pitch,`YXZ`),this.trailer.rotation.set(0,-e.trailerYaw,e.pitch,`YXZ`),this.loadFree||(rh(this.load,e.hitch.x,e.hitch.y,r-i+n,e.trailerYaw),this.load.rotation.set(0,-e.trailerYaw,e.pitch,`YXZ`));for(let t of this.wheels)t.rotation.z-=e.speed*.016/.65;for(let t of this.frontWheels)t.rotation.y=-e.steer;for(let t of this.brakeLamps)t.material.emissiveIntensity=e.speed>.5&&e.boosting?.2:1;for(let t of this.flames)t.visible=e.boosting,e.boosting&&t.scale.set(.4+Math.random()*.3,1+Math.random()*1.2,.4+Math.random()*.3)}loadCentre(e,t){let n=G(Sd(e.trailerYaw),-(1+t.loadEnd)*.5),r=W(e.hitch,n);return{x:r.x,y:r.y,up:e.height+e.ground+t.underside+t.rootThickness*.5}}bogie(e,t){return W(e.hitch,G(Sd(e.trailerYaw),-t.dollyDist))}},Th=[.55,.55,.52],Eh=[.62,.6,.56],Z=[.12,.12,.13],Dh=[.8,.82,.85],Oh=[.05,.05,.05],kh=[.3,.45,.55],Ah=[.95,.75,.05],jh=[.96,.7,.04],Mh=[.1,.35,.8],Nh=[.92,.92,.9],Ph=[.3,.24,.15],Fh=[.42,.4,.38],Ih=[.45,.14,.08],Lh=[.35,.24,.12],Rh=[.9,.9,.86],zh=[.05,.2,.4],Bh=`/play/axlon-face.png`,Vh=new Map;function Hh(e,t){let n=e.join(`,`)+(t?`|`+t.uuid:``),r=Vh.get(n);return r||(r=new Lo({color:new V(e[0],e[1],e[2]),roughness:.95,side:2,map:t??null}),Vh.set(n,r)),r}function Uh(e,t,n,r,i,a,o,s=!0,c,l=8){let u=[],d=[],f=[],p=0;for(let o=t;o<=n;o+=2){let t=Kd(e,o,-r),n=Kd(e,o,i);u.push(t.x,a+Rd(e,t),t.y,n.x,a+Rd(e,n),n.y),d.push(0,o/l,(r+i)/l,o/l),p>0&&f.push(p-2,p,p-1,p-1,p,p+1),p+=2}let m=new Mr;m.setAttribute(`position`,new br(u,3)),m.setAttribute(`uv`,new br(d,2)),m.setIndex(f),m.computeVertexNormals();let h=new H(m,Hh(o,c));return h.receiveShadow=s,h.frustumCulled=!1,h}function Wh(e,t,n,r,i,a,o,s=8){let c=gd(n,t),l=vd(c),u=G(c,1/l),d={x:-u.y,y:u.x},f=[],p=[],m=[],h=0;for(let n=0;n<=l+.01;n+=Math.min(4,l)){let a=W(t,G(u,Math.min(n,l))),o=W(a,G(d,-r*.5)),c=W(a,G(d,r*.5));f.push(o.x,i+Rd(e,o),o.y,c.x,i+Rd(e,c),c.y),p.push(0,n/s,r/s,n/s),h>0&&m.push(h-2,h,h-1,h-1,h,h+1),h+=2}let g=new Mr;g.setAttribute(`position`,new br(f,3)),g.setAttribute(`uv`,new br(p,2)),g.setIndex(m),g.computeVertexNormals();let _=new H(g,Hh(a,o));return _.receiveShadow=!0,_.frustumCulled=!1,_}function Gh(e,t,n,r,i,a,o,s=`#0a0a0c`,c=!1){let l=mh(t,o,s),u=l.aspect,d=new H(new wo(a*u,a),new Lo({map:l,roughness:.6}));return d.position.set(n,i,r),d.rotation.y=c?Math.PI/2:-Math.PI/2,e.add(d),d}function Kh(e,t,n,r,i,a=!1,o=!1){let s=new H(new wo(i,i*640/549),new Lo({map:hh(Bh),roughness:.7,transparent:!0}));return s.position.set(t,r,n),s.rotation.y=o?a?Math.PI:0:a?Math.PI/2:-Math.PI/2,e.add(s),s}function qh(e,t){for(let n=e;n;n=n.parent)if(n===t)return!0;return!1}var Jh=class{constructor(e,t){this.c=t,this.group=new kn,this.obstacleMeshes=[],this.rotors=[],this.movers=[],this.crossingShows=[],this.giftPivots=[],this.waterMats=[],this.readouts=[],this.boards=[],this.siteLamps=[],this.hook=null,this.boomTip=new B,this.siteGroup=null,this.siteExtras=[],this.mark={x:0,y:0,up:0,yaw:0,hanging:!1},this.markGlows=[],this.gloom=0;let n=this.group,r=1/0,i=-1/0,a=1/0,o=-1/0;for(let e of t.points)r=Math.min(r,e.pos.x),i=Math.max(i,e.pos.x),a=Math.min(a,e.pos.y),o=Math.max(o,e.pos.y);let s={x:(r+i)*.5,y:(a+o)*.5},c=t.hillGrade>0,l=t.desert||t.coast||t.port?fh():t.city?uh():dh();l.repeat.set(500,500);let u=t.coast?[.1,.32,.5]:t.desert?[.9,.72,.45]:t.port?[.7,.7,.68]:t.city?[.5,.5,.52]:[.75,.85,.6],d=new wo(12e3,12e3,c?400:96,c?400:96);if(c){let e=d.attributes.position;for(let n=0;n<e.count;n++)e.setZ(n,Rd(t,{x:e.getX(n)+s.x,y:-e.getY(n)+s.y}));d.computeVertexNormals()}let f=new H(d,new Lo({color:new V(...u),map:l,roughness:t.coast?.55:1,metalness:t.coast?.1:0}));if(f.rotation.x=-Math.PI/2,f.position.set(s.x,t.coast?-.6:-.12,s.y),f.receiveShadow=!0,n.add(f),this.ground=f,t.coast){f.material.map=null,this.waterMats.push(f.material);let e=fh();n.add(Uh(t,-120,t.length+40,23,23,-.1,[.88,.8,.6],!0,e,10));for(let r of t.shortcuts)n.add(Wh(t,r.from,r.to,r.halfWidth*2+10,-.1,[.88,.8,.6],e,10))}n.add(Uh(t,-80,t.length,11,11,0,[.9,.86,.8],!0,fh(),6)),n.add(Uh(t,-80,t.length,8,8,.02,[1,1,1],!0,uh(),8)),n.add(Uh(t,0,t.length,7.7,-7.5,.03,Rh,!1)),n.add(Uh(t,0,t.length,-7.5,7.7,.03,Rh,!1));for(let e=0;e<t.length;e+=9)n.add(Uh(t,e,e+3,.12,.12,.03,[.9,.75,.1],!1));t.endless||n.add(Uh(t,t.stopS,t.stopS+t.stopLength,7.4,7.4,.035,[.1,.7,.2],!1)),this.buildShortcuts(),this.buildDepot();for(let e of t.obstacles)this.obstacleMeshes.push(this.buildObstacle(e));for(let e of t.bridges)this.buildBridge(e);for(let e of t.narrows)this.buildNarrow(e.s+e.length*.5,e.length,e.halfWidth);for(let e of t.crossings)this.buildCrossing(e);for(let e of t.scales)this.buildScale(e);this.buildGifts(),this.buildJumps(),t.endless||this.buildSite(),!t.city&&!t.port&&this.plantTrees(),this.storm=new H(new wo(1,1),new li({visible:!1}));let p=this.cloudTex??=ph();for(let e=0;e<26;e++){let t=new ni(new Hr({map:p,color:new V(.1,.1,.13),transparent:!0,opacity:.92,depthWrite:!1,fog:!1})),n=120+Math.random()*120;t.scale.set(n,n*.55,1),t.position.set((e-12.5)*40+(Math.random()-.5)*30,25+Math.random()*60,(Math.random()-.5)*30),this.storm.add(t)}let m=new H(new wo(1e3,70),new li({color:new V(.25,.27,.32),transparent:!0,opacity:.55,side:2,depthWrite:!1,fog:!1}));m.position.set(0,35,10),this.storm.add(m),n.add(this.storm),e.add(n)}pivotAt(e,t,n=0){let r=new kn;return rh(r,e.x,e.y,n+Rd(this.c,e),t),this.group.add(r),r}buildShortcuts(){let e=this.c;for(let t of e.shortcuts){let n=e.city?uh():fh(),r=e.city?[.7,.7,.7]:e.coast?[.85,.78,.58]:[.72,.6,.42];this.group.add(Wh(e,t.from,t.to,t.halfWidth*2+1.2,.015,r,n,6));let i=gd(t.to,t.from),a=Math.atan2(i.y,i.x),o=W(t.from,G(i,10/vd(i))),s=this.pivotAt(o,a);for(let e of[-1,1])Y(s,0,e*(t.halfWidth+1.2),1.6,.14,.14,3.2,Z),Y(s,0,e*(t.halfWidth+1.2),2.9,.1,1.6,.6,Ah)}}mover(e,t,n,r=0,i=!1,a=!0){this.movers.push({part:e,path:t,speed:n,at:r,thereAndBack:i,spin:!1,facesAhead:a})}buildDepot(){let e=this.c,t=this.pivotAt(Kd(e,0),qd(e,0)),n=fh();n.repeat.set(20,16);let r=new H(new wo(116,96),new Lo({map:n,color:new V(.9,.86,.8),roughness:1}));r.rotation.x=-Math.PI/2,r.position.set(-12,.01,0),r.receiveShadow=!0,t.add(r);let i=(e,n,r,i)=>{let a=Math.max(1,Math.round(Math.hypot(r-e,i-n)/6));for(let o=0;o<=a;o++)Y(t,e+(r-e)*o/a,n+(i-n)*o/a,1.1,.12,.12,2.2,Z);for(let a of[.7,1.4,2.1]){let o=Y(t,(e+r)*.5,(n+i)*.5,a,Math.hypot(r-e,i-n),.05,.05,Z,!1,!1);o.rotation.y=-Math.atan2(i-n,r-e)}};i(-70,-48,-70,48),i(-70,-48,46,-48),i(-70,48,46,48),i(46,-48,46,-11.1),i(46,11.1,46,48);for(let e of[-1,1])Y(t,46,e*10.4,4.2,1.5,1.5,8.4,[.5,.42,.34]);Y(t,46,0,9.4,.5,22.3,3.2,[.012,.012,.015]),Y(t,46,0,11.1,.54,22.3,.22,jh),Y(t,46,0,7.7,.54,22.3,.22,Mh);for(let n of[-1,1])Gh(t,`AXLEYARD   ${e.town}`,46+n*.3,1.6*n,10,1.5,`#f5b400`,`rgba(0,0,0,0)`,n>0),Gh(t,`TRAILERS  &  TRUCKS`,46+n*.3,1.6*n,8.5,.7,`#eeeeee`,`rgba(0,0,0,0)`,n>0),Kh(t,46+n*.3,-8.6*n,9.4,2.4,n>0);for(let[e,n]of[[-64,-42],[-64,42],[34,-42],[34,42]])X(t,e,n,6.5,.3,13,`up`,Z),Y(t,e,n+Math.sign(-n)*1.2,13,.4,2.4,.3,Z),sh(t,e,n+Math.sign(-n)*2.2,12.85,.6,.9,.14,[.6,.6,.55],.6);for(let e of[-1,1])for(let n=-62;n<26;n+=4.5)Y(t,n,e*32,.06,.15,12,.02,[.75,.75,.72],!1,!1);X(t,40,-15.4,7,.2,14,`up`,Dh,!0),Y(t,40,-17,12.6,.06,3,2,[.05,.17,.4]),Kh(t,40.05,-17,12.6,1.5);for(let e of[-1,1])for(let n of[-2,0,2])X(t,46+n,e*11.6,.5,.3,1,`up`,jh);for(let e=0;e<3;e++)for(let n=0;n<3+e%2;n++)X(t,-64+e*2.4,34,.3+n*.6,1.6,.55,`up`,Oh),X(t,-64+e*2.4,34,.3+n*.6,.9,.57,`up`,[.24,.24,.26]);for(let e=0;e<2;e++)for(let n=0;n<5;n++)Y(t,-56+e*2,34+e*1.6,.08+n*.16,1.2,1,.14,Lh);for(let e of[-1,1])X(t,-66,e*44,6,.3,12,`up`,Z),sh(t,-66,e*44,12.2,1.2,1.2,.4,[.3,.3,.3],.5);let a=(e,n,r,i,a,o,s)=>{if(Y(t,e,n,a*.5,r,i,a,o),Y(t,e,n,a+.4,r+.8,i+.8,.8,[.33,.33,.35]),s){let o=n<0?1:-1;Y(t,e,n+o*(i*.5+.1),a-.9,r*.7,.1,1.2,[.012,.012,.015]);let c=Gh(t,s,e,n+o*(i*.5+.22),a-.9,.7,`#f5b400`,`rgba(0,0,0,0)`);c.rotation.y=o>0?0:Math.PI}};a(-56,-38,14,9,4,Nh,`AXLEYARD`),Kh(t,-56,-33.3,2,1.4,!1,!0),a(-30,-36,20,13,7,[.55,.57,.58],`SERVICE`),Y(t,-30,-29.4,3,8,.1,5.6,[.1,.1,.11]);let o=[[.8,.42,.02],[.85,.85,.83],[.05,.08,.3],[.6,.06,.04],[.05,.25,.1]],s=(e,n,r,i)=>{let a=new kn;a.position.set(e,0,n),a.rotation.y=-r,Y(a,-2,0,1.1,12,3,.5,i,!0),Y(a,5,0,1.45,3,1.4,.45,i,!0),Y(a,5.5,0,.7,.3,1,1,Z);for(let e of[-6,-7.6])for(let t of[-1,1])X(a,e,t*1.25,.5,1,.6,`y`,Oh);for(let e=0;e<6;e++)Y(a,-8.05,-1.25+.5*e,1.1,.1,.5,.5,e%2==0?Ah:Z,!1,!1);t.add(a)},c=(e,n,r,i)=>{let a=new kn;a.position.set(e,0,n),a.rotation.y=-r,Y(a,0,0,1,7.4,2.8,.8,i,!0),Y(a,1.8,0,2.5,2.6,2.8,2.2,i,!0),Y(a,3.12,0,2.9,.05,2.5,.9,kh,!0),Y(a,-.4,0,1.9,1.8,2.6,1,Z);for(let e of[-2.4,-1,2.4])for(let t of[-1,1])X(a,e,t*1.25,.55,1.1,.6,`y`,Oh);t.add(a)};for(let e=0;e<2;e++)for(let t=0;t<4;t++)s(-58+t*15,24-e*10,Math.PI/2+.1,o[(t+e)%o.length]);for(let e=0;e<3;e++)c(-50+e*10,-18,Math.PI/2,o[(e+2)%o.length]);for(let e=0;e<2;e++)c(18-e*10,18,-Math.PI/2,o[e%o.length])}buildObstacle(e){let t=new kn;switch(e.kind){case K.Cone:ah(t,0,0,0,e.radius*2,e.height,e.color),Y(t,0,0,.03,.7,.7,.06,e.color);break;case K.Pole:if(e.radius<=.2){let n=-Math.sign(e.lateral||1)*2.4;X(t,0,0,e.height*.5,e.radius*2,e.height,`up`,e.color),Y(t,0,n*.5,e.height-.1,.16,Math.abs(n),.16,e.color),sh(t,0,n,e.height-.3,.6,1.2,.3,[1,.9,.7],2.5),this.siteLamps.push(t.children[t.children.length-1]);break}X(t,0,0,e.height*.5,e.radius*2,e.height,`up`,e.color),Y(t,0,0,e.height-.6,.2,2.2,.16,e.color);for(let n of[-.9,.9])X(t,0,n,e.height-.3,.16,.3,`up`,[.85,.85,.8]);break;case K.Bin:Y(t,0,0,e.height*.5,e.half.x*2,e.half.y*2,e.height,e.color),Y(t,0,0,e.height+.08,e.half.x*2+.1,e.half.y*2+.1,.16,[.04,.16,.09]);for(let n of[-1,1])Y(t,n*(e.half.x+.1),0,e.height*.6,.2,.6,.3,Z);break;case K.Stall:Y(t,0,0,.9,e.half.x*2,e.half.y*2,.08,Lh);for(let n of[-1,1])for(let r of[-1,1])Y(t,n*(e.half.x-.1),r*(e.half.y-.1),1.3,.08,.08,2.6,Z);Y(t,0,0,2.65,e.half.x*2+.6,e.half.y*2+.6,.1,e.color);for(let n=-e.half.x+.3;n<e.half.x;n+=.75)Y(t,n,0,1.15,.55,.9,.42,n%1.5<.75?[.7,.2,.1]:[.2,.5,.15]);Y(t,0,0,.4,e.half.x*1.6,e.half.y*1.6,.8,[.5,.36,.2]);break;case K.Sign:X(t,0,0,e.height*.5,e.radius*2,e.height,`up`,[.5,.5,.5]),Y(t,0,0,e.height-.5,.08,1,1,e.color);break;case K.Pillar:if(e.radius>=1&&e.height<=e.radius*1.4&&e.height>e.radius){let n=e.radius*2.1,r=oh(t,0,0,e.height*.45,n,e.color);r.scale.set(n,e.height*1.1,n*.85),r.rotation.y=e.s*.37,oh(t,e.radius*.4,e.radius*.3,e.height*.3,e.radius*1.2,e.color);break}if(e.radius>=4){X(t,0,0,e.height*.5,e.radius*2,e.height,`up`,e.color);for(let n=1;n<e.height;n+=3)X(t,0,0,n,e.radius*2+.2,.2,`up`,[.5,.5,.48]);let n=oh(t,0,0,e.height,e.radius*2,e.color);n.scale.y*=.15,Y(t,-e.radius-.3,0,e.height*.5,.1,.6,e.height,Z,!1,!1),sh(t,0,0,e.height+.6,.3,.3,.3,[1,.1,.05],2);break}X(t,0,0,e.height*.5,e.radius*2,e.height,`up`,e.color);break;case K.Wall:return null;case K.Board:{for(let e of[-6.5,6.5])Y(t,-.3,e,3,.6,.6,6,Z);Y(t,-.25,0,9.5,.3,18.4,7.4,e.color),Y(t,-.2,0,13.3,.34,18.4,.3,jh),Y(t,-.2,0,5.7,.34,18.4,.3,Mh);for(let e of[-6,0,6])Y(t,.6,e,5.4,1.4,.12,.12,Z),sh(t,1.2,e,5.3,.4,.5,.14,[1,.95,.8],.8);let n=new kn;Kh(n,0,5.6,9.5,5.6,!0),Gh(n,`AXLEYARD.COM`,0,-3,10.6,1.7,`#f5b400`,`rgba(0,0,0,0)`,!0),Gh(n,`TRUCKS   TRAILERS   EQUIPMENT`,0,-3,8.3,.7,`#e6e6e6`,`rgba(0,0,0,0)`,!0),t.add(n);let r=new kn;r.visible=!1;let i=new H(new wo(8.6,6.4),new Lo({color:16777215,roughness:.6}));i.position.set(0,9.5,4.6),i.rotation.y=Math.PI/2,r.add(i),t.add(r),this.boards.push({group:t,plain:n,ad:r,photo:i,s:e.s});break}case K.ParkedCar:case K.Traffic:{if(e.swayWidth){if(this.c.city){Y(t,0,0,.7,3.4,1.8,.6,[.95,.75,.05],!0),Y(t,-.2,0,1.3,1.9,1.6,.6,[.95,.75,.05],!0),Y(t,.78,0,1.3,.05,1.4,.45,kh,!0),Y(t,-.2,0,1.7,.6,.4,.18,[.1,.1,.1]);for(let e of[-1,1])for(let n of[-1.1,1.1])X(t,n,e*.85,.32,.64,.25,`y`,Oh);for(let e of[-1,1])sh(t,1.72,e*.55,.8,.05,.25,.15,[1,.95,.8],2)}else{Y(t,-.3,0,.9,2.4,1.6,.9,e.color,!0),Y(t,-1.3,0,1.2,.5,1.4,.6,Z);for(let e of[-1,1])for(let n of[-.9,.7])X(t,n,e*.8,.35,.7,.3,`y`,Oh);for(let e of[-1,1])Y(t,.9,e*.5,1.4,.12,.12,2.6,Z);Y(t,.9,0,2.7,.12,1.2,.12,Z);for(let e of[-1,1])Y(t,1.6,e*.4,.12,1.2,.14,.06,[.3,.3,.32]);for(let e of[-1,1])Y(t,-.3,e*.7,1.9,1.6,.06,.06,Z);Y(t,-.3,0,2.3,1.6,1.5,.06,Z),Y(t,-.8,0,1.5,.5,.5,.5,[.1,.1,.1]),sh(t,-.3,0,2.45,.2,.2,.2,[1,.5,.05],3)}break}let n=Math.round(e.s/7)%3==0,r=e.half.x*2,i=e.half.y*2;if(Y(t,0,0,.72,r,i,.62,e.color,!0),n){Y(t,.4,0,1.3,r*.42,i*.92,.55,e.color,!0),Y(t,-1.2,0,1.15,r*.44,i*.95,.25,e.color,!0),Y(t,-1.2,0,1,r*.4,i*.8,.04,[.15,.15,.16],!1,!1),Y(t,1,0,1.4,.05,i*.8,.45,kh,!0),Y(t,-.2,0,1.4,.05,i*.8,.4,kh,!0);for(let e of[-1,1])Y(t,.4,e*(i*.46+.01),1.4,r*.34,.04,.4,kh,!0)}else{Y(t,-.2,0,1.3,r*.56,i*.9,.5,e.color,!0),Y(t,.95,0,1.3,.05,i*.78,.42,kh,!0),Y(t,-1.35,0,1.3,.05,i*.78,.38,kh,!0);for(let e of[-1,1])Y(t,-.2,e*(i*.45+.01),1.32,r*.48,.04,.36,kh,!0)}for(let n of[-1,1])Y(t,n*(e.half.x+.08),0,.55,.16,i+.05,.22,[.2,.2,.22]);for(let n of[-1,1])X(t,1.4,n*(e.half.y-.1),.35,.7,.25,`y`,Oh),X(t,-1.4,n*(e.half.y-.1),.35,.7,.25,`y`,Oh),X(t,1.4,n*(e.half.y+.03),.35,.4,.02,`y`,Dh,!0),X(t,-1.4,n*(e.half.y+.03),.35,.4,.02,`y`,Dh,!0),sh(t,e.half.x+.02,n*.6,.85,.05,.3,.18,[1,.95,.8],2),sh(t,-e.half.x-.02,n*.6,.85,.05,.3,.18,[1,.1,.05],1.5),Y(t,.9,n*(i*.5+.12),1.2,.1,.2,.12,[.1,.1,.1]);break}case K.Building:{let n=Math.round(e.s*7+e.lateral*3),r=()=>(n=n*1103515245+12345&2147483647,this.c.night&&n/2147483647<.4);Y(t,0,0,e.height*.5,e.half.x*2,e.half.y*2,e.height,e.color),Y(t,0,0,e.height+.15,e.half.x*2+.6,e.half.y*2+.6,.3,[.25,.1,.08]);for(let n of[-1,1])for(let i=1;i<e.height-1.5;i+=3)for(let a=-e.half.x+2;a<e.half.x-1;a+=3)r()?sh(t,a,n*(e.half.y+.02),i+1.2,1.2,.04,1.4,[1,.85,.55],1.2):Y(t,a,n*(e.half.y+.02),i+1.2,1.2,.04,1.4,[.1,.14,.2],!0,!1);Y(t,e.half.x+.02,0,1.2,.04,1.6,2.4,[.15,.1,.06]);break}case K.Rock:{let n=Math.round(e.s*3+e.lateral),r=()=>(n=n*1103515245+12345&2147483647,n/2147483647),i=t=>[e.color[0]*t,e.color[1]*t,e.color[2]*t],a=Math.max(3,Math.round(e.height/3.2)),o=e.height/a;for(let n=0;n<a;n++){let a=(r()-.5)*1.2-n*.15;Y(t,(r()-.5)*.8,(r()-.5)*.8,n*o+o*.5,e.half.x*2+a,e.half.y*2+a,o*1.02,i(n%2==0?.92+r()*.1:1.05+r()*.1))}let s=Math.max(2,Math.round(e.half.x/4));for(let n=0;n<s;n++){let a=e.half.x*2/s,o=1+r()*4;Y(t,-e.half.x+(n+.5)*a,(r()-.5)*e.half.y,e.height+o*.5,a*(.6+r()*.4),e.half.y*(.8+r()*.8),o,i(.95+r()*.15))}for(let n=0;n<4;n++){let n=r()<.5?-1:1;Y(t,(r()-.5)*e.half.x*1.6,n*(e.half.y+.8+r()),.6+r()*.6,1.5+r()*2.5,1+r()*1.5,1+r(),i(.8+r()*.15)).rotation.set(r()*.4,r()*3,r()*.4)}break}case K.Container:{let n=6.1,r=2.6,i=2.6,a=Math.max(1,Math.round(e.half.x*2/n)),o=Math.max(1,Math.round(e.half.y*2/r)),s=Math.max(1,Math.round(e.height/i)),c=Math.round(e.s),l=()=>(c=c*1103515245+12345&2147483647,c/2147483647),u=[[.55,.08,.05],[.05,.2,.5],[.08,.35,.15],[.6,.4,.05],[.35,.35,.38],[.5,.2,.05]];for(let c=0;c<a;c++)for(let a=0;a<o;a++)for(let o=0;o<s;o++){let s=-e.half.x+(c+.5)*n,d=-e.half.y+(a+.5)*r,f=(o+.5)*i,p=u[Math.floor(l()*u.length)];Y(t,s,d,f,6.02,2.52,2.52,p);for(let e of[-1,1])for(let i=-2.55;i<n*.5;i+=.6)Y(t,s+i,d+e*(r*.5-.02),f,.16,.08,2.3000000000000003,[p[0]*.8,p[1]*.8,p[2]*.8],!1,!1);Y(t,s+n*.5-.02,d,f,.08,2.2,2.3000000000000003,[p[0]*.7,p[1]*.7,p[2]*.7],!1,!1);for(let e of[-.5,.5])Y(t,s+n*.5+.03,d+e,f,.05,.08,2.1,[.75,.75,.72],!1,!1)}break}case K.Barrier:Y(t,0,0,e.height*.5,e.half.x*2,e.half.y*2,e.height,e.color);break;default:Y(t,0,0,e.height*.5,Math.max(e.half.x*2,e.radius*2,.5),Math.max(e.half.y*2,e.radius*2,.5),e.height,e.color)}return rh(t,e.pos.x,e.pos.y,Rd(this.c,e.pos),e.yaw),this.group.add(t),t}buildBridge(e){this.c;let t=this.pivotAt(e.pos,e.yaw),n=e.clearance+.16,r=10.6;switch(e.kind){case Ed.Road:{let r=n+1;Y(t,0,0,n+.5,9,26,1,Eh),Y(t,0,0,n+.08,7.8,25.6,.16,[.42,.41,.38]),Y(t,0,0,r+.03,7,26,.08,[.2,.2,.21]);for(let e of[-4.3,4.3]){Y(t,e,0,r+.45,.3,26,.9,[.7,.68,.64]),Y(t,e*.92,0,r+1.05,.08,26,.1,[.5,.5,.52],!0);for(let n=-12;n<13;n+=2.5)Y(t,e*.92,n,r+.85,.06,.06,.4,[.5,.5,.52])}for(let e of[-6.5,6.5])X(t,-3.9,e,r+4.5,.18,8,`up`,Z),Y(t,-3.3,e,r+8.4,1.4,.2,.2,Z),sh(t,-2.7,e,r+8.3,.6,.4,.14,[1,.9,.7],.8);for(let e=-10;e<13;e+=6)Y(t,0,e,r+.08,.25,2.4,.02,Rh,!1,!1);Y(t,-4.53,0,n+.5,.06,3.6,.7,[.95,.75,.05]),Gh(t,`${(e.clearance*3.28084).toFixed(0)} FT  ${(e.clearance*3.28084%1*12).toFixed(0)} IN`,-4.57,0,n+.5,.5,`#111111`,`rgba(0,0,0,0)`);let i=[];for(let e of[-1,1]){Y(t,0,e*14,r*.5,10,2,r,[.52,.5,.46]);for(let n of[-1,1]){let i=Y(t,n*6.7,e*15.2,r*.42,4.6,.6,r*.84,[.5,.48,.44]);i.rotation.y=n*e*.5}for(let n=0;n<10;n++){let i=r*(1-(n+.5)/10)-.15,a=13+n*1.2;Y(t,0,e*(15+80*(n+.5)/10),i*.5,a,8.1,Math.max(i,.1),[.32,.42,.18]),Y(t,0,e*(15+80*(n+.5)/10),Math.max(i,.1)*.5,a-.5,8.12,Math.max(i,.1)*.55,Ph)}let n=(e,n,r,i,a,o,s)=>{let c=Y(t,0,(e+r)*.5,(n+i)*.5,a,Math.hypot(r-e,i-n),o,s);c.rotation.x=Math.atan2(i-n,r-e)};n(e*14.7,r-.02,e*95,.02,7,.14,[.2,.2,.21]),n(e*95,.05,e*160,.05,7,.06,[.2,.2,.21]),n(e*95,.02,e*160,.02,10,.04,[.45,.4,.34]);for(let n of[-3.9,3.9]){let i=Y(t,n,e*55,r*.5+.7,.08,Math.hypot(80,r),.1,[.5,.5,.52],!0);i.rotation.x=e*Math.atan2(r,80)}let a=new B(0,.1,e*160),o=new B(0,.1,e*95),s=new B(0,r+.07,e*15);e<0?i.push(a,o,s):i.push(s,o,a)}for(let e=0;e<3;e++){let n=e%2==1,r=[.1+.6*(e*7%3)/2,.1+.4*(e*5%2),.1+.5*(e*3%3)/2],a=this.littleCar(r);t.add(a);let o=(n?[...i].reverse():i).map(e=>e.clone().add(new B(n?1.7:-1.7,0,0)));this.mover(a,o,11+2.5*e,e*40,!1,!0)}break}case Ed.Rail:{let e=12.2,r=n+.7;Y(t,0,0,n+.35,4.4,e*2,.7,Fh);for(let r of[-2.4,2.4]){Y(t,r,0,n+.85,.4,e*2,1.7,Ih);for(let i=-11.2;i<e;i+=3)Y(t,r*1.1,i,n+.85,.1,.25,1.6,[.32,.1,.06]);Y(t,r,0,n+1.72,.6,e*2,.08,[.4,.12,.07]),Y(t,r,0,n+.02,.6,e*2,.08,[.4,.12,.07]);for(let i=-11.7;i<e;i+=.6)for(let e of[n+.3,n+1.4])Y(t,r*1.09,i,e,.05,.08,.08,[.25,.08,.05],!1,!1)}X(t,1.6,13.7,r+2.5,.16,5,`up`,Z),Y(t,1.6,13.7,r+4.6,.3,.5,1.2,Z),sh(t,1.5,13.7,r+4.85,.1,.3,.3,[.2,1,.3],2.5),sh(t,1.5,13.7,r+4.35,.1,.3,.3,[1,.1,.05],.3),Y(t,-2.64,0,n+.85,.04,3.2,.7,[.05,.1,.25]),Gh(t,`MILL ROAD`,-2.68,0,n+.85,.45,`#eeeeee`,`rgba(0,0,0,0)`);for(let n=-11.6;n<e;n+=1.5)Y(t,0,n,r+.02,2.6,.3,.12,[.21,.14,.07]);let i=(e,n)=>{for(let i of[-.75,.75])Y(t,i,(e+n)*.5,r+.1,.14,Math.abs(n-e),.16,[.56,.57,.6],!0)};i(-12.2,e);for(let n of[-1,1]){let a=147.8,o=n*86.10000000000001;Y(t,0,o,r*.3,15,a,r*.6,Ph),Y(t,0,o,r*.5-.05,8,a,r-.1,[.34,.28,.17]),Y(t,0,o,r-.04,4.4,a,.1,Fh),Y(t,0,n*12.7,r*.5,15.5,1,r,[.52,.5,.46]);for(let e=0;e<4;e++){let i=r*(.8-.2*e)+.1;Y(t,0,n*(163+6*e),i*.5,13-2*e,6,i,Ph)}i(n*e,n*160)}let a=this.train(6);t.add(a),this.mover(a,[new B(0,r+.18,-114),new B(0,r+.18,114)],15,60,!0,!1);break}case Ed.Tree:{for(let e of[-1,1]){X(t,0,e*r,3.5,2.2,7,`up`,[.2,.13,.07]);for(let n=0;n<5;n++)oh(t,n%2*2-1,e*(11.6+n%3*2.5),8.5+n*1.2,6+n%3*2,[.16+n%2*.04,.38+n%3*.05,.1])}let e=X(t,0,0,n+.6,1.1,23.2,`y`,[.2,.13,.07]);e.rotation.z=.04;for(let e=-2;e<=2;e++)oh(t,e%2*1.5,e*4,n+2.4+Math.abs(e)*.6,4.5+e%2,[.18,.4,.11]);break}case Ed.Conveyor:{let e=13.6;Y(t,0,0,n+1,2.6,e*2,1.8,[.85,.62,.04]),Y(t,0,0,n+.1,2.8,e*2,.2,Z);for(let r=-11.6;r<e;r+=4)Y(t,0,r,n+1,2.7,.15,1.9,[.6,.42,.02]);for(let e of[-1,1]){for(let n=0;n<3;n++)X(t,-2+n*7,e*(17.6+n*1.5),11,6,22,`up`,[.82,.8,.76]);Y(t,5,e*18.6,12,4,4,24,[.6,.58,.54]),Y(t,5,e*18.6,24.5,5,5,1,[.5,.48,.44])}break}case Ed.Foot:Y(t,0,0,n+.3,2.6,22.2,.5,[.35,.37,.4]);for(let e of[-1,1]){Y(t,e*1.2,0,n+1.4,.08,22.2,.08,Z);for(let i=-10.6;i<=r;i+=2)Y(t,e*1.2,i,n+1,.06,.06,1.2,Z);for(let i=-9.6;i<r;i+=2){let r=Y(t,e*1.2,i,n+1,.05,2.2,.05,Z,!1,!1);r.rotation.x=.5*(i%4==0?1:-1)}}for(let e of[-1,1])for(let r=0;r<14;r++)Y(t,0,e*(12.1+r*.9),(n+.1)*(1-r/14),2.4,.9,.3,[.35,.37,.4]);break;case Ed.Arch:{let e=[.42,.2,.1];for(let r of[-1,1])Y(t,0,r*13.6,(n+3)*.5,9,7,n+3,e),Y(t,0,r*10.1,n*.5+1.4,7,2.2,n-1,e),Y(t,0,r*17.6,2.5,7,4,5,[.38,.18,.09]);Y(t,0,0,n+1.8,8,23.2,3.6,e),Y(t,0,0,n+4.2,6,r*1.4,1.6,[.46,.22,.11]),Y(t,-2,3,n+5.4,3,4,1.2,e);break}case Ed.Shed:{let e=n,r=n+3.5,i=25.2,a=Math.atan2(r-e,i);for(let n=-12;n<=12;n+=4)Y(t,n,11.6,e*.5,.5,.5,e,Lh),Y(t,n,11.6,e-.5,.4,1.6,.3,Lh);Y(t,0,-12.8,r*.5,24,1.2,r,[.42,.4,.36]);let o=Y(t,0,-.5,(e+r)*.5+.1,25,Math.hypot(i,r-e)+1.5,.35,[.3,.22,.12]);o.rotation.x=-a;let s=Y(t,0,-.5,(e+r)*.5+.55,24.6,Math.hypot(i,r-e)+.8,.5,[.92,.94,.97],!1);s.rotation.x=-a;for(let n=-11;n<12;n+=2){let o=Y(t,n,-.5,(e+r)*.5-.15,.3,Math.hypot(i,r-e),.3,Lh,!1,!1);o.rotation.x=-a}let c=5,l=()=>(c=c*1103515245+12345&2147483647,c/2147483647);for(let e=-20;e<=20;e+=5){let n=8+l()*6;oh(t,e,-14.6-l()*3,0,n,[.92,.94,.97]).scale.set(n,n*(.45+l()*.2),n*.8)}break}case Ed.Line:for(let e of[n+.1,n+.6,n+1.1]){let n=Y(t,0,0,e-.3,.05,21.599999999999998,.05,[.08,.08,.08],!1,!1);n.scale.y=1,Y(t,0,0,e+.3,.06,r*1.2,.06,[.08,.08,.08],!1,!1)}for(let e of[-1,1])Y(t,0,e*r,n+1.4,.2,2.2,.16,Lh);X(t,.5,r,n-.2,.7,1.2,`up`,[.4,.4,.42]);break;case Ed.Gantry:{let e=25.2;Y(t,0,0,n+1.4,2.2,e,1.6,[.85,.62,.04],!0),Y(t,0,0,n+2.8,2.6,e,.4,[.75,.55,.04]);for(let e of[-1,1])Y(t,0,e*r,n+1.4,2.6,2.6,1.8,[.85,.62,.04]);Y(t,0,3,n+.3,2.2,3,.6,Z),Y(t,0,3,n-.1,1.6,6.1,.3,[.3,.3,.32]),Y(t,1.6,-4,n+.5,1.6,2,1.6,[.3,.33,.38]),sh(t,0,0,n+3.2,.3,.3,.3,[1,.1,.05],2);break}default:Y(t,0,0,n+.6,2.4,24,1.2,Th)}}littleCar(e){let t=new kn;Y(t,0,0,.6,4.2,1.8,.6,e,!0),Y(t,-.3,0,1.15,2.2,1.6,.55,e,!0);for(let e of[-1,1])X(t,1.3,e*.85,.32,.64,.25,`y`,Oh),X(t,-1.3,e*.85,.32,.64,.25,`y`,Oh);return t}train(e){let t=new kn;for(let n=0;n<e;n++){let r=(n-(e-1)*.5)*14,i=n===0,a=i?[.75,.12,.05]:n%2==0?[.45,.3,.15]:[.3,.33,.38];if(Y(t,0,r,1.9,2.8,13,i?3.4:3,a,!0),i)Y(t,0,r+4,3.9,2.4,3.5,.9,[.12,.12,.13]),sh(t,0,r+7-.45,1.6,.6,.1,.4,[1,.95,.8],2.5);else if(n%2==0)for(let e of[-1,1]){let n=Kh(t,e*1.42,r+3.6,2,1.9,e>0);n.rotation.y=e>0?Math.PI/2:-Math.PI/2;let i=Gh(t,`AXLON`,e*1.42,r-1.6,2,1.1,`#f5b400`,`rgba(0,0,0,0)`);i.rotation.y=e>0?Math.PI/2:-Math.PI/2}else for(let e of[-1,1]){let n=Gh(t,`AXLEYARD.COM`,e*1.42,r,2,.8,`#58b8ff`,`rgba(0,0,0,0)`);n.rotation.y=e>0?Math.PI/2:-Math.PI/2}for(let e of[-4.5,4.5])for(let n of[-1,1])X(t,n*.8,r+e,.5,1,.3,`x`,[.2,.2,.22])}return t}buildNarrow(e,t,n){let r=this.c,i=this.pivotAt(Kd(r,e),qd(r,e));Y(i,0,0,.05,t-4,480,.1,[.11,.09,.05],!1,!1);let a=Y(i,0,0,.065,t-9,480,.13,zh,!0,!1);this.waterMats.push(a.material);for(let e of[-1,1])Y(i,e*(t-9)*.5,0,.135,.5,480,.02,[.55,.62,.62],!1,!1);let o=5,s=()=>(o=o*1103515245+12345&2147483647,o/2147483647);for(let e=0;e<40;e++){let r=e%2==0?-1:1,a=(s()-.5)*480*.96;Math.abs(a)<n+4||X(i,r*((t-9)*.5+.3+s()*1.3),a,.5,.5*(.7+s()*.6),1,`up`,[.08,.2,.06])}for(let e=0;e<14;e++){let t=e%2==0?-1:1,r=.6+s()*.7;Y(i,(s()-.5)*11,t*(n+3+s()*20),.3,1.4*r,1.9*r,.8*r,[.2,.2,.19])}Y(i,0,0,.14,t,n*2+.8,.1,[.24,.16,.09]);for(let e=-t*.5+.75;e<t*.5;e+=1.5)Y(i,e,0,.195,.1,n*2-.8,.02,[.14,.1,.05],!1,!1);let c=Math.round(t/3);for(let e of[-1,1]){let r=e*n;Y(i,0,r,1.2,t,.4,.4,Ih),Y(i,0,r,4.4,t-6,.4,.4,Ih);for(let e of[-1,1]){let n=Y(i,e*(t*.5-1.5),r,2.8000000000000003,Math.hypot(3,3.2),.34,.34,Ih);n.rotation.z=-e*Math.atan2(3.2,3)}for(let e=1;e<c;e++){let n=-t*.5+e*3;if(Y(i,n,r,2.8000000000000003,.25,.25,3.2,Ih),e<c-1){let t=e>=c/2,a=Y(i,n+1.5,r,2.8000000000000003,Math.hypot(3,3.2),.16,.16,[.36,.11,.06]);a.rotation.z=(t?1:-1)*Math.atan2(3.2,3)}}}}buildCrossing(e){let t=this.c,n=this.pivotAt(e.pos,e.yaw+e.skew);for(let e of[-1,1])Y(n,0,e*165,.05,4.4,310,.1,Fh,!1,!1);for(let e=-319.25;e<320;e+=1.5)Math.abs(e)>9&&Y(n,0,e,.12,2.6,.3,.12,[.21,.14,.07],!1,!1);Y(n,0,0,.08,3.2,20,.16,[.18,.12,.06],!1,!1);for(let e of[-.75,.75])Y(n,e,0,.16,.14,640,.16,[.56,.57,.6],!0,!1);let r={lights:[],arms:[],armSides:[],train:this.train(6),crossing:e};for(let n of[1,-1]){let i=n*10.2,a=this.pivotAt(Kd(t,e.s-n*9,i),e.yaw);X(a,0,0,1.7,.26,3.4,`up`,[.83,.83,.81]);for(let e of[40,-40]){let t=Y(a,0,0,3.1,.08,1.7,.26,Nh);t.rotation.x=e*Math.PI/180}Y(a,0,0,2.3,.2,1.3,.46,Z);for(let e of[-.42,.42]){let t=sh(a,-.12,e,2.3,.06,.34,.34,[1,.08,.04],3);t.visible=!1,r.lights.push(t)}let o=new kn;o.position.set(.3,1.15,0);for(let e=0;e<6;e++)Y(o,0,-n*(9/6)*(e+.5),0,.12,9/6,.28,e%2==0?[.9,.05,.03]:Nh);Y(o,0,0,0,.3,.5,.5,Z),o.rotation.x=n*85*Math.PI/180,a.add(o),r.arms.push(o),r.armSides.push(n)}n.add(r.train),r.train.position.set(0,.18,kd(e,0)-e.length*.5),this.crossingShows.push(r)}buildScale(e){let t=this.pivotAt(e.pos,e.yaw),n=e.lateral,r=e.length,i=Pd(e),a=i*7,o=uh();o.repeat.set(1.2,r/8);let s=new Lo({map:o,roughness:.95}),c=new H(new ta(1,1,1),s);c.position.set(r*.5,.03,n),c.scale.set(r,.06,9.5),c.receiveShadow=!0,t.add(c);let l=[.2,.2,.21],u=Math.atan2(n-a,26),d=Math.hypot(26,n-a),f=Y(t,-13,(n+a)*.5,.03,d,9.5,.06,l,!1,!1);f.rotation.y=-u;let p=Y(t,r+13,(n+a)*.5,.03,d,9.5,.06,l,!1,!1);p.rotation.y=u;for(let e=0;e<5;e++)ah(t,-26+e*5,a+(n-a)*(e/5)-5.5,0,.6,.7,[1,.35,.02]);for(let e of[-18,-10,-2]){Y(t,e,n-2,.09,3,.4,.02,Rh,!1,!1);let r=Y(t,e+1.8,n-2,.09,1.4,.4,.02,Rh,!1,!1);r.rotation.y=.6;let i=Y(t,e+1.8,n-2,.09,1.4,.4,.02,Rh,!1,!1);i.rotation.y=-.6}let m=(Md(e)+Nd(e))*.5-e.s,h=Nd(e)-Md(e);Y(t,m,n,.06,h+.6,7,.12,[.3,.3,.32]),Y(t,m,n,.1,h,6.4,.06,[.17,.17,.19],!0);for(let e=-h*.5+2;e<h*.5;e+=4)Y(t,m+e,n,.135,.12,6.2,.01,[.4,.4,.42],!1,!1);for(let e of[-1,1])Y(t,m,n+e*3.3,.14,h,.35,.02,jh,!1,!1);for(let e of[-1,1])Y(t,m+e*h*.5,n,.14,.35,6.6,.02,jh,!1,!1);Y(t,m,n,.14,1.5,6.4,.02,jh,!1,!1);let g=7.8,_=m-h*.5-1;for(let e of[-1,1])X(t,_,n+e*6.2,g*.5,.4,g,`up`,Z);Y(t,_,n,8.1,.5,13,.6,Z),Y(t,_,n,6.8999999999999995,.14,11.6,1.7,[.012,.012,.015]);for(let e of[-1,1])X(t,m,n+e*5.8,3.5,.18,7,`up`,Z),Y(t,m,n+e*5.2,6.9,.4,1.4,.2,Z),sh(t,m,n+e*4.7,6.8,.5,.5,.12,[1,.95,.8],1.2);Gh(t,`STOP ON THE SCALE`,_-.1,n,6.8999999999999995,.78,`#f5b400`,`rgba(0,0,0,0)`);for(let e of[-1,1])sh(t,_-.12,n+e*5.4,6.8999999999999995,.1,.5,.5,[1,.7,.1],3);X(t,m+h*.5+2,n+i*4.5,1.6,.2,3.2,`up`,Z),Y(t,m+h*.5+2,n+i*4.5,3.6,.3,3.4,1.4,[.05,.05,.06]);let v=Gh(t,`000000 LB`,m+h*.5+1.83,n+i*4.5,3.6,.7,`#4ee07a`,`rgba(0,0,0,0)`);this.readouts.push({mesh:v,scale:e});let y=m,b=n+i*10;Y(t,y,b,2,9,6,4,[.55,.52,.46]),Y(t,y,b,4.15,9.8,6.8,.3,Z),Y(t,y,b-i*3.02,2.2,5.6,.06,1.4,kh,!0);for(let e of[-3,3])Y(t,y+e,b-i*3.02,2.2,1.2,.06,1.4,kh,!0);Y(t,y+4.52,b,1.1,.06,1.2,2.2,[.15,.1,.06]),Y(t,y,b-i*3.06,3.7,8.2,.08,.9,jh);let x=Gh(t,`WEIGH STATION`,y,b-i*3.12,3.7,.58,`#111111`,`rgba(0,0,0,0)`);x.rotation.y=i>0?Math.PI:0,X(t,y+6,b,4.5,.15,9,`up`,Dh,!0),Y(t,y+6,b+1.2,8.2,.05,2.2,1.4,Mh);let S=i*10.6;X(t,-80,S,1.9,.2,3.8,`up`,Z),Y(t,-80,S,3.3,.1,4.2,1.1,[.04,.22,.1]),Gh(t,`WEIGH STATION`,-80.06,S,3.5,.36,`#eeeeee`,`rgba(0,0,0,0)`),Gh(t,i>0?`>>>`:`<<<`,-80.06,S,3.05,.36,`#f5b400`,`rgba(0,0,0,0)`)}buildGifts(){let e=this.c;for(let t=0;t<e.gifts.length;t++){let n=e.gifts[t],r=n.repair?[.3,1,.4]:[.3,.6,1],i=this.pivotAt(n.pos,0,1.5);sh(i,0,0,0,1.3,1.3,1.3,r,2.5),Y(i,0,0,0,1.36,1.36,.3,Z),Y(i,0,0,0,1.36,.3,1.36,Z),sh(this.group,0,0,0,3.2,3.2,.04,r,.6).position.set(n.pos.x,Rd(e,n.pos)+.03,n.pos.y),i.userData.baseY=Rd(e,n.pos)+1.5,this.movers.push({part:i,path:[],speed:1.2,at:t*.7,thereAndBack:!1,spin:!0,facesAhead:!1}),this.giftPivots.push(i)}}buildJumps(){for(let e of this.c.jumps){let t=this.pivotAt(e.pos,e.yaw);if(e.gorge){this.buildGorge(t,e.gap/e.squeeze,e.left,e.right);continue}let n=new Fa;n.moveTo(-16,0),n.lineTo(0,Gd),n.lineTo(0,0),n.lineTo(-16,0);let r=new bo(n,{depth:16,bevelEnabled:!1}),i=uh();i.repeat.set(2,1);let a=new H(r,new Lo({map:i,roughness:.9}));a.position.set(0,0,-8),a.castShadow=!0,a.receiveShadow=!0,t.add(a);for(let e of[-1,1]){let n=Y(t,-8,e*8.15,Gd*.5+.1,Math.hypot(16,Gd)+.4,.3,.5,[.85,.62,.04],!0);n.rotation.z=Math.atan2(Gd,16);for(let n=-14;n<0;n+=3.5)Y(t,n,e*8.15,Gd*(n+16)/16*.5,.3,.3,Math.max(.2,Gd*(n+16)/16),Z)}for(let e=0;e<10;e++)Y(t,-.3,-7.2+e*1.6,Gd+.02,.6,1.6,.04,e%2==0?Ah:Z,!1,!1);Y(t,-.2,0,Gd*.5-.1,.4,16,Gd-.2,Z);for(let e of[-1,1])Y(t,-22,e*10.2,1.8,.12,.12,3.6,Z),Y(t,-22,e*10.2,3,.08,1.8,1.2,Ah);Y(t,-56,11,2.2,.12,.12,4.4,Z),Y(t,-56,11,3.9,.1,4.6,1.4,[.012,.012,.015]),Gh(t,`BRIDGE OUT  /  RAMP AHEAD`,-56.07,11,3.9,.5,`#f5b400`,`rgba(0,0,0,0)`),Y(t,e.gap*.5,(e.right-e.left)*.5,-.9,e.gap+6,e.left+e.right,1.2,[.11,.09,.05],!1,!1);for(let n of[-3,e.gap+3])Y(t,n,(e.right-e.left)*.5,-.2,.6,e.left+e.right,.8,[.26,.2,.11],!1,!1);let o=Y(t,e.gap*.5,(e.right-e.left)*.5,.1,e.gap,e.left+e.right,.14,this.c.coast?[.1,.32,.5]:zh,!0,!1);o.material=o.material.clone(),this.c.coast&&(o.material.userData.sea=!0),this.waterMats.push(o.material);for(let n of[.3,e.gap-.3])Y(t,n,(e.right-e.left)*.5,.18,.6,e.left+e.right,.02,[.55,.62,.62],!1,!1);let s=3,c=()=>(s=s*1103515245+12345&2147483647,s/2147483647);for(let n=0;n<60;n++){let n=(c()-.5)*(e.left+e.right)*.95+(e.right-e.left)*.5;Math.abs(n)<10||X(t,c()<.5?-.6-c()*1.6:e.gap+.6+c()*1.6,n,.6,.4+c()*.4,1.2,`up`,[.08,.2,.06])}for(let n of[-1,1])Y(t,e.gap+1.5,n*7.6,.6,3,.5,1.2,[.1,.7,.2]);for(let n of[-3.5,e.gap+3.5]){Y(t,n,0,1,5,18,.5,Eh);for(let e of[-1,1])Y(t,n,e*8.6,1.75,5,.3,1,[.7,.68,.64]);for(let e=0;e<6;e++){let r=Y(t,n+(n<0?2.8:-2.8),-6+e*2.6,1.3,1.4,.05,.05,[.4,.2,.1]);r.rotation.z=(n<0?-.5:.5)+e*.2}}}}buildGorge(e,t,n,r){let i=[.42,.2,.1],a=new Fa;a.moveTo(-16,0),a.lineTo(0,Gd),a.lineTo(0,0),a.lineTo(-16,0);let o=new bo(a,{depth:10,bevelEnabled:!1}),s=fh();s.repeat.set(2,1);let c=new H(o,new Lo({map:s,color:new V(.72,.6,.42),roughness:1}));c.position.set(0,0,-5),c.castShadow=!0,c.receiveShadow=!0,e.add(c);for(let t of[-1,1]){let n=Y(e,-8,t*5.15,Gd*.5+.1,Math.hypot(16,Gd)+.4,.3,.4,Lh,!1);n.rotation.z=Math.atan2(Gd,16)}Y(e,-.2,0,Gd*.5-.1,.4,10,Gd-.2,Z);for(let t=0;t<6;t++)Y(e,-.3,-4.2+t*1.6,Gd+.02,.6,1.6,.04,t%2==0?Ah:Z,!1,!1);let l=n+r,u=(r-n)*.5;Y(e,t*.5,u,-20,t+.4,l,40,[.06,.04,.03],!1,!1);let d=Y(e,t*.5,u,-39.7,t*.4,l,.2,zh,!0,!1);this.waterMats.push(d.material);for(let n of[0,t])for(let t=0;t<5;t++){let r=(t+1)*8;Y(e,n+t*.5*(n===0?1:-1),u,-r+4,1.2,l,8,[i[0]*(1-t*.12),i[1]*(1-t*.12),i[2]*(1-t*.12)],!1,!1)}let f=11,p=()=>(f=f*1103515245+12345&2147483647,f/2147483647);for(let n=0;n<40;n++){let n=(p()-.5)*l*.95+u;if(Math.abs(n)<7)continue;let r=p()<.5?-1-p()*6:t+1+p()*6,a=.5+p()*1.4;oh(e,r,n,a*.4,a*2,[i[0]*.9,i[1]*.9,i[2]*.9])}for(let n of[-1,1])Y(e,t+1.5,n*4.4,.6,3,.5,1.2,[.1,.7,.2]);Y(e,-46,8,2.2,.12,.12,4.4,Z),Y(e,-46,8,3.9,.1,4.6,1.4,[.012,.012,.015]),Gh(e,`THE LEAP  /  FLAT OUT`,-46.07,8,3.9,.5,`#f5b400`,`rgba(0,0,0,0)`)}turbine(e,t,n,r=null,i=90,a=57){let o=this.pivotAt({x:e,y:t},n);r&&this.siteExtras.push(o);let s=nh([.94,.94,.93],!0);for(let[e,t,n,r]of[[0,.36,2.3,2.1],[.36,.7,2.1,1.75],[.7,1,1.75,1.35]]){let a=(t-e)*i,c=new H(new na(r,n,a,28),s);c.position.y=e*i+a*.5,c.castShadow=!0,o.add(c),t<1&&X(o,0,0,t*i,r*2+.25,.35,`up`,[.8,.8,.78])}X(o,0,0,.5,9,1,`up`,Th),Y(o,2.25,0,1.5,.12,1.2,2.4,[.3,.3,.32]);let c=new kn;c.position.y=i+1.6,Y(c,-1.6,0,0,11,3.8,3.6,[.93,.93,.92],!0),Y(c,-1.6,0,1.75,10.4,3.4,.3,[.88,.88,.86],!0),Y(c,-6.8,0,0,.7,3.2,3,[.84,.84,.82]),Y(c,-2,0,2.1,1,.8,.5,[.7,.7,.68]),sh(c,-5,0,2.3,.3,.3,.3,[1,.1,.05],2);let l=new H(new na(2.2,2.2,2.6,20),s);l.rotation.z=Math.PI/2,l.position.set(4.6,0,0),c.add(l);let u=new H(new To(2.2,20,14,0,Math.PI*2,0,Math.PI/2),s);u.rotation.z=-Math.PI/2,u.position.set(5.9,0,0),c.add(u);let d=new kn;d.position.set(4.9,0,0);let f=[[0,.12,1.6,2.4],[.12,.55,2.4,1.3],[.55,1,1.3,.2]];for(let e=0;e<3;e++){let t=new kn;t.rotation.x=e*2*Math.PI/3;for(let[e,n,r,i]of f){let o=(n-e)*a,c=new H(new na(i,r,o,10),s);c.position.y=e*a+o*.5+2,c.scale.set(1,1,e===0?.8:.26),c.rotation.y=.25+e*.3,c.castShadow=!0,t.add(c)}d.add(t)}c.add(d),o.add(c),this.rotors.push(d)}setSite(e){let t=this.c;if(t.endless)return;this.siteGroup&&=(this.group.remove(this.siteGroup),null);for(let e of this.siteExtras)this.group.remove(e),this.rotors=this.rotors.filter(t=>!qh(t,e));this.siteExtras=[];let n=qd(t,t.stopS),r=this.pivotAt(Kd(t,t.stopS+t.stopLength*.5,0),n);this.siteGroup=r;let i=nh([.94,.94,.93],!0);switch(e){case`transformer`:{let e=[.16,.3,.36],t=[.45,.2,.12];Y(r,-8,-34,.04,62,46,.08,[.3,.29,.27],!1),Y(r,-12,-22,.3,24.5,7,.6,Th);for(let e of[-2.6,2.6])Y(r,-5.4,-22+e,.62,11,.35,.04,Ah,!1,!1);Y(r,.65,-22,4.6,.8,10,9.2,[.34,.34,.32]),Y(r,6.8,-22,.3,11,7,.6,Th),Y(r,6.8,-22,2.55,9.6,4,3.9,e,!0);for(let e of[-2.5,2.5])Y(r,6.8,-22+e,2.5,7.6,.9,2.8,Z);X(r,6.8,-21,5.3,1.3,6,`x`,[.2,.38,.45],!0);for(let e of[-30,-44]){for(let t of[-17,10])Y(r,t,-22+e,7,.9,.9,14,[.7,.7,.68]);Y(r,-3.5,-22+e,14,28,1,1,[.7,.7,.68]);for(let n=0;n<3;n++)X(r,-12.5+9*n,-22+e,12.7,.45,1.6,`up`,t)}Y(r,-3.5,-118,15,2.2,2.2,30,[.56,.56,.55]),Y(r,-3.5,-118,3,5,5,6,[.56,.56,.55]);for(let e of[20,26])Y(r,-3.5,-118,e,16,1,.8,[.56,.56,.55]);for(let e=0;e<3;e++){let n=3.8+3*e;X(r,n,-21.4,6,.55,3,`up`,t);let i=-12.5+9*e,a=Y(r,i,-59,12,.1,14,.1,Oh,!1,!1);a.visible=!0,Y(r,i,-59,1.6,1.6,1.6,3.2,[.52,.52,.5]),Y(r,(n+i)*.5,-37,9.95,.1,Math.hypot(30,n-i,4.9),.1,Oh,!1,!1).rotation.set(0,Math.atan2(n-i,30),-Math.atan2(4.9,30),`YXZ`)}break}case`rocket`:Y(r,-10,-32,.04,70,60,.08,[.48,.48,.46],!1),Y(r,-14,-22,.6,30,12,1.2,Th),Y(r,-14,-22,.2,26,5,1,[.05,.05,.05],!1,!1),Y(r,0,-30,29,5,5,58,[.5,.07,.04]);for(let e=8;e<58;e+=8)Y(r,0,-30,e,5.3,5.3,.7,Nh);for(let e=4;e<58;e+=6)Y(r,-4,-30,e,3.4,1.2,.3,[.5,.5,.48]);X(r,0,-30,65,.5,14,`up`,Nh),sh(r,0,-30,72.2,.4,.4,.4,[1,.1,.05],3);for(let[e,t]of[[-38,-30],[-34,16]])X(r,e,-22+t,32,.9,64,`up`,[.75,.75,.74]);for(let e of[-30,-42])X(r,-37,-22+e,6,7,12,`up`,Nh),oh(r,-37,-22+e,12,7,Nh).scale.y*=.4;X(r,-25,-27,1,.6,17,`x`,[.6,.6,.58]);for(let e=-30;e<=-18;e+=6)Y(r,e,-27,.5,.3,.3,1,Z);Y(r,-14,-14,1.2,4,3,2.4,[.85,.62,.04]);break;case`house`:{let e=[.12,.24,.08],t=[.42,.2,.14],n=[.33,.12,.08];Y(r,-8,-36,.04,52,42,.08,e,!1),Y(r,-8.5,-22,.3,17.5,7.2,.6,Th);for(let e of[-1,1])Y(r,-7,-22+e*3.1,.62,14,.3,.04,Ah,!1,!1);Y(r,3.4,-22,1.7,6.3,6.8,3.4,t),Y(r,3.4,-22,3.55,7,7.6,.3,n),Y(r,3.4,-18.58,1.3,4.6,.1,2.6,Nh);for(let[e,t]of[[-11,-24],[8,-26]]){Y(r,e,-22+t,1.6,14,6,2.6,[.77,.72,.6]);for(let i of[-1,1]){let a=Y(r,e,-22+t+i*6*.26,3.5,14.7,6*.58,.22,n);a.rotation.x=i*22*Math.PI/180}for(let n=e-5;n<e+5;n+=3)Y(r,n,-22+t+3+.03,1.5,1.2,.06,1,[.1,.16,.22],!0,!1)}for(let e=-30;e<=10;e+=2)(e<-18||e>7.5)&&Y(r,e,-14,.55,.12,.12,1,Nh);for(let[e,t]of[[-26,-6],[-22,-30],[11,-12]])X(r,e,-22+t,1.5,.5,3,`up`,[.16,.1,.05]),oh(r,e,-22+t,4.6,5.5,[.06,.2,.06]);break}case`excavator`:{Y(r,-6,-32,.04,60,44,.08,[.42,.33,.2],!1),Y(r,-10,-36,-2,30,6,4,[.1,.07,.04],!1,!1);for(let e=-22;e<=2;e+=6){let t=oh(r,e,-44,.8,7,[.36,.26,.14]);t.scale.y*=.45}for(let e of[-14,-4])Y(r,e,-36,-.6,5,.3,2.6,[.85,.62,.04]),Y(r,e,-36,-.6,5,5.4,.3,Z,!1,!1);for(let e=-26;e<=10;e+=2.4)Y(r,e,-15,.6,.08,.08,1.2,Z),Y(r,e+1.2,-15,.7,2.4,.03,.9,[1,.4,.05],!1,!1);let e=new kn;e.position.set(8,0,-44),Y(e,0,0,1,6,3,1.2,[.85,.62,.04],!0),Y(e,-1,0,2.3,3.6,2.8,1.4,[.7,.5,.04],!0),Y(e,2.4,0,2.2,1.4,2.6,1.2,[.85,.62,.04],!0);for(let t of[-1,1])for(let n of[-1.8,1.8])X(e,n,t*1.5,.7,1.4,.6,`y`,Oh);r.add(e),Y(r,-16,-19,.5,2,1,1,Th),Y(r,-16,-19,1.4,.1,1.8,.8,[.012,.012,.015]);break}case`yacht`:{let e=Y(r,-14,-46,-.08,70,50,.3,zh,!0,!1);this.waterMats.push(e.material),Y(r,-14,-20.5,.3,70,1.2,1.2,[.5,.5,.48]),Y(r,-8,-34,.5,4,26,.3,Lh);for(let e=-2;e>-24;e-=4)for(let t of[-1,1])X(r,-8+t*1.7,-22+e,-.5,.4,2.2,`up`,[.25,.17,.1]);for(let[e,t,n]of[[-20,-8,[.9,.9,.92]],[4,-10,[.1,.2,.45]],[-22,-18,[.85,.85,.88]]])Y(r,e,-22+t,.4,7,2.4,1,n,!0),Y(r,e-.5,-22+t,1.2,3,1.8,.8,n,!0),X(r,e+.5,-22+t,5,.12,9,`up`,Dh,!0);for(let e of[-1,1]){for(let t of[-14,-6])Y(r,t,-22+e*3.4,3.2,.5,.5,6.4,[.1,.35,.8]),X(r,t,-22+e*3.4,.45,.9,.5,`y`,Oh);Y(r,-10,-22+e*3.4,6.2,9,.6,.6,[.1,.35,.8])}for(let e of[-14,-6])Y(r,e,-22,6.5,.6,7.4,.6,[.1,.35,.8]);Y(r,6,-17,1.5,4,3,3,[.9,.9,.86]),Y(r,6,-17,3.2,4.6,3.6,.3,[.3,.3,.32]),X(r,6,-14,4,.1,8,`up`,Dh),Y(r,6,-13.4,7.4,.04,1.2,.8,Mh);break}case`deck`:{Y(r,-10,-30,.04,70,46,.08,[.36,.34,.31],!1);for(let e=-44;e<=24;e+=2.4)Y(r,e,-8,1.1,.08,.08,2.2,Z);Y(r,-10,-8,2.15,68,.04,.05,Z,!1,!1),Y(r,-10,-8,1.1,68,.02,2,[.25,.27,.28],!1,!1).material=new Lo({color:3356216,transparent:!0,opacity:.35});let e=[[.6,.06,.04],[.85,.85,.83],[.05,.1,.35],[.1,.1,.1],[.45,.42,.1],[.05,.3,.15]];for(let t=0;t<2;t++)for(let n=0;n<6;n++){let i=this.littleCar(e[(n+t*2)%e.length]);i.position.set(-40+n*7,0,-28-t*9),i.rotation.y=Math.PI/2,r.add(i)}Y(r,14,-40,1.8,12,7,3.6,Nh),Y(r,14,-40,3.75,12.6,7.6,.3,[.3,.3,.32]),Y(r,14,-22-14.48,3.1,7,.06,1,[.012,.012,.015]);let t=Gh(r,`AXLEYARD  RECOVERY`,14,-36.4,3.1,.6,`#f5b400`,`rgba(0,0,0,0)`);t.rotation.y=0,Kh(r,18.5,-36.42,1.8,1.4,!1,!0);let n=new kn;n.position.set(-2,0,-40),Y(n,0,0,1,8,2.6,.8,[.85,.08,.05],!0),Y(n,2.6,0,2.3,2.4,2.6,2,[.85,.08,.05],!0),Y(n,3.82,0,2.6,.05,2.2,.9,kh,!0);let i=Y(n,-1.8,0,2.6,5,.6,.6,[.9,.9,.88]);i.rotation.z=.35,sh(n,2.6,0,3.4,.3,1.8,.15,[1,.6,.05],3);for(let e of[-1,1])for(let t of[-2.6,-1.2,2.6])X(n,t,e*1.2,.55,1.1,.6,`y`,Oh);r.add(n);for(let[e,t,n,i]of[[-8.5,-16,17,.25],[-8.5,-22.5,17,.25]])Y(r,e,t,.1,n,i,.04,Ah,!1,!1);break}default:{let e=n+Math.PI*.75,a=Kd(t,t.stopS+t.stopLength*.5,-22);this.turbine(a.x,a.y,e,r);for(let[n,i]of[[t.stopS-260,-140],[t.stopS+60,-220],[t.stopS-120,160],[t.stopS-420,190],[t.stopS+30,300]]){let a=Kd(t,n,i);this.turbine(a.x,a.y,e,r)}Y(r,0,-22,.05,44,30,.1,[.5,.5,.48],!1),Y(r,8,-24,.4,7,7,.8,Th);let o=new H(new na(1.5,2.6,52,24),i);o.position.set(8,26,-24),o.castShadow=!0,r.add(o),Y(r,8,-24,52.8,7.5,3.4,3.4,[.93,.93,.92],!0);let s=new H(new To(1.9,16,12),i);s.position.set(8,52.8,-28.4),r.add(s);for(let e of[-2,2])Y(r,-6+e,-16,.5,.6,2.4,1,Z);let c=new H(new na(1.6,1.6,2.6,18),nh([.9,.9,.88],!0));c.rotation.z=Math.PI/2,c.position.set(-6,2.2,-16),r.add(c);let l=new H(new ra(1.5,2.2,16),nh([.9,.9,.88],!0));l.rotation.z=-Math.PI/2,l.position.set(-3.6,2.2,-16),r.add(l);for(let e of[60,-60]){let t=new kn;t.position.set(8,52.8,-28.4),t.rotation.z=(e-90)*Math.PI/180;for(let[e,n,r,a]of[[0,.12,2.6,3.2],[.12,.55,3.2,1.6],[.55,1,1.6,.3]]){let o=(n-e)*29,s=new H(new na(a*.5,r*.5,o,10),i);s.position.y=e*29+o*.5+1.9,s.scale.set(1,1,.3),s.castShadow=!0,t.add(s)}r.add(t)}}}e===`deck`?this.hook&&=(this.group.remove(this.hook),this.group.remove(this.cable),null):this.buildMarkAndCrane(r,e,-22)}buildMarkAndCrane(e,t,n){let r=this.c,i=t===`blade`||t===`rocket`,[a,o,s,c,l,u]=t===`blade`?[8,n-6.4,50.9,58.5,3,0]:t===`rocket`?[-14,n,1.2,56,3.4,0]:t===`transformer`?[.25,n,.6,15,4,12]:t===`house`?[.25,n,.6,15,6,15]:t===`excavator`?[-4,n-6,.04,14,4.6,16]:[0,n,0,14,4.4,20],d=qd(r,r.stopS),f=Kd(r,r.stopS+r.stopLength*.5,0),p=W(W(f,G(Sd(d),a)),G(Cd(d),o));if(this.mark={x:p.x,y:p.y,up:s+Rd(r,f),yaw:d,hanging:i},this.markGlows=[],i){let t=new H(new Eo(l*.5+.8,.12,8,40),new Lo({color:0,emissive:new V(1,.7,.05),emissiveIntensity:2.5}));t.position.set(a,s,o),e.add(t),this.markGlows.push(t)}else for(let[t,n,r,i]of[[a-u*.5,o-l*.5-.3,u+.6,.25],[a-u*.5,o+l*.5+.3,u+.6,.25],[a+.3,o,.25,l+.6],[a-u-.3,o,.25,l+.6]])this.markGlows.push(sh(e,t,n,s+.08,r,i,.06,[1,.7,.05],2.5));let m=i?26:24,h=new kn;h.position.set(a-m,0,o+(i?0:l*.5+4));for(let e of[-1,1]){Y(h,0,e*3.6,.8,11,1.6,1.6,Z);for(let t=-4.5;t<=4.5;t+=1.5)Y(h,t,e*3.6,.8,.5,1.8,1.8,[.2,.2,.22])}Y(h,0,0,2.3,9,6,2.6,[.85,.62,.04],!0),Y(h,4,-2.3,3.8,2.6,1.6,2.2,Z),Y(h,5.3,-2.3,4,.05,1.4,1.2,kh,!0),Y(h,-4.5,0,3.2,2,5.8,3.8,[.2,.2,.22]),Kh(h,-5.52,0,3.4,1.8,!0);let g=m-1.5-(i?0:u*.5),_=c-3.6,v=Math.hypot(g,_),y=new kn;y.position.set(1.5,3.6,0),y.rotation.z=Math.atan2(_,g);for(let e of[-.5,.5])for(let t of[-.5,.5])Y(y,v*.5,t,e,v,.14,.14,[.85,.62,.04],!0);for(let e=1;e<v;e+=2)Y(y,e,0,.5,.1,1,.1,[.85,.62,.04]),Y(y,e,0,-.5,.1,1,.1,[.85,.62,.04]),Y(y,e,.5,0,.1,.1,1,[.85,.62,.04]),Y(y,e,-.5,0,.1,.1,1,[.85,.62,.04]);i||(h.rotation.y=-Math.atan2(l*.5+4,g)),h.add(y),e.add(h),e.updateMatrixWorld(!0),y.updateMatrixWorld(!0),this.boomTip=y.localToWorld(new B(v,0,0)),this.hook&&(this.group.remove(this.hook),this.group.remove(this.cable)),this.hook=new kn,Y(this.hook,0,0,.3,.6,.3,.6,Z),Y(this.hook,0,0,-.5,.25,.25,1,[.85,.62,.04]),Y(this.hook,.3,0,-1,.8,.25,.25,[.85,.62,.04]),this.hook.position.copy(this.boomTip).setY(this.boomTip.y-10),this.group.add(this.hook),this.cable=new H(new na(.06,.06,1,6),nh([.1,.1,.1])),this.group.add(this.cable),this.setHook(this.boomTip.x,this.boomTip.z,this.boomTip.y-10)}setMark(e){let t=e===`on`?new V(.2,1,.4):e===`clang`?new V(1,.15,.1):new V(1,.7,.05);for(let e of this.markGlows)e.material.emissive.copy(t)}buildSite(){let e=this.c,t=qd(e,e.stopS),n=this.pivotAt(Kd(e,e.stopS+e.stopLength*.5,0),t);for(let e=0;e<2;e++){Y(n,-34+e*8,-16,1.4,7,3,2.8,[.9,.9,.86]),Y(n,-34+e*8,-16,2.9,7.4,3.4,.2,[.3,.3,.32]);for(let t of[-2,0,2])Y(n,-34+e*8+t,-14.48,1.7,1,.05,.9,kh,!0)}Y(n,-40,-20,.9,3,1.6,1.8,[.85,.62,.04]),X(n,-39,-20,2.2,.2,1,`up`,Z);for(let e=0;e<3;e++){let t=this.littleCar([.9,.9,.88]);t.position.set(-24+e*6,0,-12),t.rotation.y=Math.PI/2,n.add(t)}for(let[e,t]of[[-20,-8],[20,-8],[20,-36]])X(n,e,t,8,.25,16,`up`,Z),Y(n,e,t,16.2,1.2,1.2,.4,Z),this.siteLamps.push(sh(n,e,t+.8,16,.6,.3,.4,[1,.95,.8],.4));Y(n,-e.stopLength*.5+2,0,9.4,.5,18.8,1.6,[.012,.012,.015]),Y(n,-e.stopLength*.5+2,0,10.3,.54,18.8,.16,jh),Gh(n,`AXLEYARD   DELIVERS`,-e.stopLength*.5+1.7,0,9.4,.9,`#f5b400`,`rgba(0,0,0,0)`);for(let t of[-1,1]){Y(n,-e.stopLength*.5+2,t*10.6,2.4,.12,.12,4.8,Z);let r=Y(n,-e.stopLength*.5+2,t*10.6+t*.8,4.4,.06,1.6,1,Mh);r.rotation.y=.2}}setListings(e){for(let t=0;t<this.boards.length&&t<e.length;t++){let n=this.boards[t],r=e[t];if(!r.photo)continue;let i=hh(r.photo);n.photo.material.map=i,n.photo.material.needsUpdate=!0;let a=r.title.length>26?r.title.slice(0,25)+`…`:r.title,o=r.price&&r.price>0?`$${Math.round(r.price).toLocaleString(`en-US`)}`:`CALL FOR PRICE`,s=[r.city,r.state].filter(Boolean).join(`, `);Gh(n.ad,`FOR SALE`,0,-4.2,12.2,.7,`#f5b400`,`rgba(0,0,0,0)`,!0),Gh(n.ad,a,0,-4.2,10.7,.8,`#ffffff`,`rgba(0,0,0,0)`,!0),Gh(n.ad,o,0,-4.2,9.2,1,`#4ee07a`,`rgba(0,0,0,0)`,!0),s&&Gh(n.ad,s,0,-4.2,8.1,.55,`#dddddd`,`rgba(0,0,0,0)`,!0),Gh(n.ad,`AXLEYARD.COM`,0,-4.2,6.8,.9,`#58b8ff`,`rgba(0,0,0,0)`,!0),n.plain.visible=!1,n.ad.visible=!0}}setHook(e,t,n){if(!this.hook)return;this.hook.position.set(e,n,t);let r=this.boomTip,i=new B().addVectors(r,this.hook.position).multiplyScalar(.5);this.cable.position.copy(i);let a=new B().subVectors(this.hook.position,r);this.cable.scale.set(1,a.length(),1),this.cable.quaternion.setFromUnitVectors(new B(0,1,0),a.clone().normalize())}plantTrees(){let e=this.c,t=new na(.25,.45,3.5,7),n=new Co(1,1),r=new Mi(t,nh([.3,.2,.1]),700),i=new Mi(n,new Lo({color:16777215,roughness:.9,flatShading:!0}),2100);r.castShadow=!0,i.castShadow=!0,i.receiveShadow=!0;let a=7,o=()=>(a=a*1103515245+12345&2147483647,a/2147483647),s=new en,c=new V,l=0,u=0,d=Kd(e,0);for(;l<700&&u++<4200;){let t=o()*e.length,n=(o()<.5?-1:1)*(18+o()*170),a=Kd(e,t,n),u=(a.x-d.x)**2+(a.y-d.y)**2>8100;if((e.coast||e.desert)&&o()<.8)continue;for(let t of e.shortcuts){let e=gd(t.to,t.from),n=vd(e),r=((a.x-t.from.x)*e.x+(a.y-t.from.y)*e.y)/n,i=Math.abs((-(a.x-t.from.x)*e.y+(a.y-t.from.y)*e.x)/n);r>-10&&r<n+10&&i<t.halfWidth+14&&(u=!1)}for(let t of e.jumps)t.gorge&&(a.x-t.pos.x)**2+(a.y-t.pos.y)**2<28900&&(u=!1);for(let t=0;t<e.points.length&&u;t+=6){let n=e.points[t].pos;(n.x-a.x)**2+(n.y-a.y)**2<256&&(u=!1)}for(let t of e.obstacles)(t.kind===K.Building||t.kind===K.Rock||t.kind===K.Container||t.kind===K.Board)&&(t.pos.x-a.x)**2+(t.pos.y-a.y)**2<900&&(u=!1);for(let n of e.crossings)(Math.abs(t-n.s)<40||Math.abs(n.pos.x-a.x)<320&&Math.abs(n.pos.y-a.y)<320&&Math.abs(Sd(n.yaw+n.skew).x*(a.x-n.pos.x)+Sd(n.yaw+n.skew).y*(a.y-n.pos.y))<8)&&(u=!1);for(let r of e.scales)t>r.s-40&&t<r.s+r.length+40&&n>0&&n<30&&(u=!1);for(let n of e.bridges)Math.abs(t-n.s)<14&&(u=!1);for(let n of e.jumps)t>n.s-10&&t<n.s+n.gap+10&&(u=!1);if(t>e.stopS-40&&(u=!1),!u)continue;let f=.8+o()*1.2,p=Rd(e,a);s.makeScale(f,f,f),s.setPosition(a.x,p+1.75*f,a.y),r.setMatrixAt(l,s);let m=2.2+o()*2,h=.24+o()*.1;for(let e=0;e<3;e++){let t=e/3*Math.PI*2+o(),n=e===0?0:m*.55,r=m*(e===0?1:.7+o()*.25);s.makeScale(r,r*(.85+o()*.4),r),s.setPosition(a.x+Math.cos(t)*n,p+3.5*f+m*.55+(e===0?m*.25:0),a.y+Math.sin(t)*n),i.setMatrixAt(l*3+e,s),c.setHSL(h,.45+o()*.2,.2+o()*.1),i.setColorAt(l*3+e,c)}l++}r.count=l,i.count=l*3,i.instanceColor&&(i.instanceColor.needsUpdate=!0),this.group.add(r,i)}lampsOn(e){if(e!==this.gloom){this.gloom=e;for(let t of this.siteLamps)t.material.emissiveIntensity=.4+2.5*e}}update(e,t,n,r){let i=this.c;for(let t=0;t<e.length;t++){let n=this.obstacleMeshes[t];if(!n)continue;let r=e[t],a=i.obstacles[t];r.broken?(n.rotation.z=a.kind===K.Traffic||a.kind===K.ParkedCar?.5:1.4,n.position.y=.2):a.kind===K.Traffic&&rh(n,r.pos.x,r.pos.y,Rd(i,r.pos),r.yaw)}let a=Kd(i,t.stormS-30);rh(this.storm,a.x,a.y,Rd(i,a),qd(i,t.stormS)+Math.PI/2);for(let e of this.rotors)e.rotation.x+=n*.42;for(let e of this.movers){if(e.spin){e.part.rotation.y+=n*e.speed,e.part.position.y=(e.part.userData.baseY??1.5)+Math.sin(r*2+e.at)*.25;continue}e.at+=n*e.speed;let t=e.path.reduce((t,n,r)=>r>0?t+n.distanceTo(e.path[r-1]):0,0),i=e.thereAndBack?e.at%(t*2):e.at%t,a=!1;e.thereAndBack&&i>t&&(i=t*2-i,a=!0);for(let t=1;t<e.path.length;t++){let n=e.path[t].distanceTo(e.path[t-1]);if(i<=n||t===e.path.length-1){let r=Math.min(1,i/n);if(e.part.position.lerpVectors(e.path[t-1],e.path[t],r),e.facesAhead){let n=new B().subVectors(e.path[t],e.path[t-1]);a&&n.negate(),e.part.rotation.y=Math.atan2(-n.z,n.x)}break}i-=n}}for(let e of this.crossingShows){let i=e.crossing,a=jd(i,t.time),o=Math.floor(r*2.5)%2==0;for(let t=0;t<e.lights.length;t++)e.lights[t].visible=a&&t%2==0===o;for(let t=0;t<e.arms.length;t++){let r=a?0:e.armSides[t]*85*Math.PI/180;e.arms[t].rotation.x+=(r-e.arms[t].rotation.x)*Math.min(1,n*2.5)}e.train.position.z=kd(i,t.time)-i.length*.5}for(let e=0;e<this.giftPivots.length;e++)this.giftPivots[e].visible=!t.giftsTaken[e];for(let e of this.readouts){let n=Math.abs(t.s-(Md(e.scale)+Nd(e.scale))*.5)<20&&Math.abs(t.lateral-e.scale.lateral)<5,i=n?Math.round(68e3+Math.abs(t.speed)*90+Math.sin(r*7)*40):0,a=n?`${i.toLocaleString(`en-US`)} LB`:t.weighed?`WEIGHED  OK`:`------ LB`,o=e.mesh.material;o.shown!==a&&(o.shown=a,o.map=mh(a,n||t.weighed?`#4ee07a`:`#2a6a3a`,`rgba(0,0,0,0)`),o.needsUpdate=!0)}this.lampsOn(Math.max(this.gloom,+!!t.inStorm));for(let e of this.waterMats){let t=e===this.ground.material||e.userData.sea===!0,n=t?[.1,.32,.5]:zh;e.color.setRGB(n[0]+.02*Math.sin(r*1.3),n[1]+.03*Math.sin(r*.9),n[2]+.04*Math.sin(r*.7)),e.roughness=t?.95:.3,e.metalness=t?0:.25}}},Yh=class{constructor(e){this.sunDir=new B,this.clouds=[],this.rainCount=900,this.uniforms={zenith:{value:new V(.25,.48,.9)},horizon:{value:new V(.72,.82,.95)},sunDir:{value:new B(0,1,0)},sunGlow:{value:1}},this.night=0,this.warm=0;let t=new Fo({uniforms:this.uniforms,side:1,depthWrite:!1,fog:!1,vertexShader:`
        varying vec3 vDir;
        void main() {
          vDir = normalize(position);
          vec4 p = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * p;
        }`,fragmentShader:`
        uniform vec3 zenith; uniform vec3 horizon; uniform vec3 sunDir; uniform float sunGlow;
        varying vec3 vDir;
        void main() {
          float up = clamp(vDir.y, 0.0, 1.0);
          vec3 c = mix(horizon, zenith, pow(up, 0.32));
          float s = max(dot(normalize(vDir), normalize(sunDir)), 0.0);
          c += vec3(1.0, 0.95, 0.85) * (pow(s, 600.0) * 1.2 + pow(s, 12.0) * 0.12) * sunGlow;
          if (vDir.y < 0.0) c = mix(horizon, vec3(0.3, 0.32, 0.3), clamp(-vDir.y * 6.0, 0.0, 1.0));
          gl_FragColor = vec4(c, 1.0);
        }`});this.dome=new H(new To(5e3,32,16),t),this.dome.frustumCulled=!1,e.add(this.dome),this.setSun(34,228);let n=ph(),r=99,i=()=>(r=r*1103515245+12345&2147483647,r/2147483647);for(let t=0;t<60;t++){let t=new ni(new Hr({map:n,transparent:!0,opacity:.8+i()*.2,depthWrite:!1,fog:!1})),r=220+i()*420;t.scale.set(r,r*.45,1),t.position.set(-1500+i()*5e3,520+i()*260,-2500+i()*5e3),e.add(t),this.clouds.push(t)}this.rainPositions=new Float32Array(this.rainCount*6);let a=new Mr;a.setAttribute(`position`,new _r(this.rainPositions,3)),this.rain=new Yi(a,new Li({color:new V(.7,.75,.85),transparent:!0,opacity:.45,fog:!1})),this.rain.frustumCulled=!1,this.rain.visible=!1,e.add(this.rain);for(let e=0;e<this.rainCount;e++)this.seedDrop(e,0,0,0,!0)}seedDrop(e,t,n,r,i){let a=this.rainPositions,o=t+(Math.random()-.5)*70,s=r+(Math.random()-.5)*70,c=n+(i?Math.random()*40:30+Math.random()*10);a[e*6]=o,a[e*6+1]=c,a[e*6+2]=s,a[e*6+3]=o-.3,a[e*6+4]=c-1.6,a[e*6+5]=s}setSun(e,t){let n=kt.degToRad(90-e),r=kt.degToRad(t);this.sunDir.setFromSphericalCoords(1,n,r),this.uniforms.sunDir.value.copy(this.sunDir)}update(e,t,n){this.dome.position.copy(t.position);let r=this.night,i=this.warm,a=this.uniforms.zenith.value,o=this.uniforms.horizon.value;a.setRGB(.2-.1*n,.45-.3*n,.92-.72*n),o.setRGB(.62-.4*n,.78-.54*n,.96-.68*n),i>0&&(a.lerp(new V(.25,.4,.75),i*.6),o.lerp(new V(.98,.62,.3),i*.8)),r>0&&(a.lerp(new V(.01,.015,.05),r),o.lerp(new V(.05,.06,.12),r)),this.uniforms.sunGlow.value=(1-n)*(1-r);for(let t of this.clouds)t.position.x+=e*6,t.position.x>4e3&&(t.position.x-=5500),t.material.color.setScalar((1-.7*n)*(1-.9*r));if(this.rain.visible=n>.5,this.rain.visible){let n=this.rainPositions,r=32*e;for(let e=0;e<this.rainCount;e++)n[e*6+1]-=r,n[e*6+4]-=r,n[e*6]-=r*.2,n[e*6+3]-=r*.2,n[e*6+4]<t.position.y-12&&this.seedDrop(e,t.position.x,t.position.y-10,t.position.z,!1);this.rain.geometry.getAttribute(`position`).needsUpdate=!0}}},Xh=[{file:`closing-time`,name:`Closing Time`,artist:`Neil Fernandes`},{file:`bama-country`,name:`Bama Country`,artist:`Kevin MacLeod`},{file:`guts-and-bourbon`,name:`Guts and Bourbon`,artist:`Kevin MacLeod`},{file:`dry-the-hells-are`,name:`Dry the hells are`,artist:`Wired Ant`},{file:`admiral-bob-strikes-the-root`,name:`Admiral Bob Strikes The Root`,artist:`copperhead`}],Zh=Object.fromEntries(Xh.map(e=>[e.file,`${e.name}  ·  ${e.artist}`]));function Qh(e){let t=[...e];for(let e=t.length-1;e>0;e--){let n=Math.floor(Math.random()*(e+1));[t[e],t[n]]=[t[n],t[e]]}return t}var $h=.9,eg=.4,tg=class{constructor(){this.ctx=null,this.engineOscs=[],this.radio=null,this.radioTracks=[Xh[0].file,...Qh(Xh.slice(1).map(e=>e.file))],this.radioAt=0,this.radioOn=!0,this.speaking=null,this.speakingPriority=0,this.speakingUntil=0,this.saidAt=new Map,this.lastCall=J.None,this.lastCallTime=-1,this.spokeNote=``,this.wasStorm=!1,this.stormCloseSaid=!1,this.lastThunder=0,this.bellClock=0,this.paused=!1,this.volume=1,this.mix={music:.8,effects:.6,voice:1},this.ownTracks=[],this.onSong=null}start(){if(this.ctx){this.ctx.state===`suspended`&&this.ctx.resume();return}let e=new AudioContext;this.ctx=e,this.master=e.createGain(),this.master.gain.value=this.volume,this.master.connect(e.destination);let t=t=>{let n=e.createGain();return n.gain.value=t,n.connect(this.master),n};this.musicBus=t(this.mix.music),this.effectsBus=t(this.mix.effects),this.voiceBus=t(this.mix.voice),this.engineGain=e.createGain(),this.engineGain.gain.value=0,this.engineFilter=e.createBiquadFilter(),this.engineFilter.type=`lowpass`,this.engineFilter.frequency.value=700,this.engineFilter.Q.value=1.2,this.engineFilter.connect(this.engineGain).connect(this.effectsBus);for(let[t,n,r]of[[`sawtooth`,1,.35],[`sawtooth`,1.007,.35],[`sine`,.5,.6]]){let i=e.createOscillator();i.type=t,i.frequency.value=60*n,i.scale=n;let a=e.createGain();a.gain.value=r,i.connect(a).connect(this.engineFilter),i.start(),this.engineOscs.push(i)}this.chug=e.createOscillator(),this.chug.frequency.value=12,this.chugDepth=e.createGain(),this.chugDepth.gain.value=0,this.chug.connect(this.chugDepth).connect(this.engineGain.gain),this.chug.start(),this.whine=e.createOscillator(),this.whine.type=`sine`,this.whine.frequency.value=900,this.whineGain=e.createGain(),this.whineGain.gain.value=0,this.whine.connect(this.whineGain).connect(this.effectsBus),this.whine.start(),this.noiseBuffer=e.createBuffer(1,e.sampleRate*2,e.sampleRate);let n=this.noiseBuffer.getChannelData(0);for(let e=0;e<n.length;e++)n[e]=Math.random()*2-1;this.wind=e.createBufferSource(),this.wind.buffer=this.noiseBuffer,this.wind.loop=!0,this.windFilter=e.createBiquadFilter(),this.windFilter.type=`bandpass`,this.windFilter.frequency.value=700,this.windFilter.Q.value=1.4,this.windGain=e.createGain(),this.windGain.gain.value=0,this.wind.connect(this.windFilter).connect(this.windGain).connect(this.effectsBus);let r=e.createBiquadFilter();r.type=`highpass`,r.frequency.value=2800,this.rainGain=e.createGain(),this.rainGain.gain.value=0,this.wind.connect(r).connect(this.rainGain).connect(this.effectsBus),this.wind.start(),this.voiceGain=e.createGain(),this.voiceGain.gain.value=1,this.voiceGain.connect(this.voiceBus),this.radioGain=e.createGain(),this.radioGain.gain.value=$h,this.radioGain.connect(this.musicBus)}setMix(e){if(this.mix={...this.mix,...e},!this.ctx)return;let t=this.ctx.currentTime;this.musicBus.gain.setTargetAtTime(this.mix.music,t,.05),this.effectsBus.gain.setTargetAtTime(this.mix.effects,t,.05),this.voiceBus.gain.setTargetAtTime(this.mix.voice,t,.05)}get ready(){return this.ctx!==null}setVolume(e){this.volume=e,this.ctx&&this.master.gain.setTargetAtTime(e,this.ctx.currentTime,.05)}setPaused(e){this.paused=e,this.ctx&&this.effectsBus.gain.setTargetAtTime(e?0:this.mix.effects,this.ctx.currentTime,.1)}file(e,t){return`/play/${e}/${t}.m4a`}say(e,t=1,n=0){if(!this.ctx)return!1;let r=this.ctx.currentTime,i=this.saidAt.get(e);if(n>0&&i!==void 0&&r-i<n||this.speaking&&!this.speaking.ended&&r<this.speakingUntil&&t<=this.speakingPriority)return!1;this.speaking&&!this.speaking.ended&&this.speaking.pause();let a=new Audio(this.file(`voice`,e));return a.volume=1,this.ctx.createMediaElementSource(a).connect(this.voiceGain),a.play().catch(()=>void 0),this.speaking=a,this.speakingPriority=t,this.speakingUntil=r+4,a.addEventListener(`loadedmetadata`,()=>{this.speakingUntil=r+a.duration}),this.saidAt.set(e,r),this.radioGain.gain.setTargetAtTime($h*eg,r,.08),a.addEventListener(`ended`,()=>this.radioGain.gain.setTargetAtTime($h,this.ctx.currentTime,.5)),!0}oneOf(e,t){return`${e}${1+Math.floor(Math.random()*t)}`}useOwnMusic(e,t=!0){for(let e of this.ownTracks)URL.revokeObjectURL(e.url);this.ownTracks=e.filter(e=>e.type.startsWith(`audio/`)||/\.(mp3|m4a|aac|wav|ogg|flac)$/i.test(e.name)).map(e=>({name:e.name.replace(/\.[^.]+$/,``),url:URL.createObjectURL(e)}));for(let e=this.ownTracks.length-1;e>0;e--){let t=Math.floor(Math.random()*(e+1));[this.ownTracks[e],this.ownTracks[t]]=[this.ownTracks[t],this.ownTracks[e]]}return this.radioAt=0,t&&(this.radioOn=!0,this.radio&&=(this.radio.pause(),null),this.playRadio()),this.ownTracks.length}useOurRadio(){for(let e of this.ownTracks)URL.revokeObjectURL(e.url);this.ownTracks=[],this.radioAt=0,this.radio&&=(this.radio.pause(),null),this.playRadio()}get ownMusic(){return this.ownTracks.length>0}playRadio(){if(!this.ctx||!this.radioOn)return;let e=this.ownTracks.length>0?this.ownTracks[this.radioAt%this.ownTracks.length]:null,t=e?e.name:this.radioTracks[this.radioAt%this.radioTracks.length],n=new Audio(e?e.url:this.file(`radio`,t));this.ctx.createMediaElementSource(n).connect(this.radioGain),n.addEventListener(`ended`,()=>{this.radioAt++,this.playRadio()}),n.addEventListener(`error`,()=>{this.radioAt++,this.radio===n&&this.playRadio()}),n.play().catch(()=>void 0),this.radio=n,this.onSong?.(e?t:Zh[t]??t)}skipRadio(){this.radio&&=(this.radio.pause(),null),this.radioAt++,this.playRadio()}toggleRadio(){this.radioOn=!this.radioOn,!this.radioOn&&this.radio&&(this.radio.pause(),this.radio=null),this.radioOn&&!this.radio&&this.playRadio()}thump(e){if(!this.ctx)return;let t=this.ctx,n=t.createBufferSource();n.buffer=this.noiseBuffer;let r=t.createBiquadFilter();r.type=`lowpass`,r.frequency.value=180;let i=t.createGain();i.gain.setValueAtTime(e,t.currentTime),i.gain.exponentialRampToValueAtTime(.001,t.currentTime+.5),n.connect(r).connect(i).connect(this.effectsBus),n.start(),n.stop(t.currentTime+.5);let a=t.createOscillator();a.frequency.setValueAtTime(70,t.currentTime),a.frequency.exponentialRampToValueAtTime(30,t.currentTime+.4);let o=t.createGain();o.gain.setValueAtTime(e*.8,t.currentTime),o.gain.exponentialRampToValueAtTime(.001,t.currentTime+.4),a.connect(o).connect(this.effectsBus),a.start(),a.stop(t.currentTime+.4)}thunder(){if(!this.ctx)return;let e=this.ctx,t=e.createBufferSource();t.buffer=this.noiseBuffer,t.loop=!0;let n=e.createBiquadFilter();n.type=`lowpass`,n.frequency.setValueAtTime(1400,e.currentTime),n.frequency.exponentialRampToValueAtTime(160,e.currentTime+1.2);let r=e.createGain();r.gain.setValueAtTime(.001,e.currentTime),r.gain.exponentialRampToValueAtTime(.35,e.currentTime+.08),r.gain.exponentialRampToValueAtTime(.001,e.currentTime+2.6),t.connect(n).connect(r).connect(this.effectsBus),t.start(),t.stop(e.currentTime+2.6)}bell(){if(!this.ctx)return;let e=this.ctx,t=e.createOscillator();t.frequency.value=1900;let n=e.createGain();n.gain.setValueAtTime(.12,e.currentTime),n.gain.exponentialRampToValueAtTime(.001,e.currentTime+.25),t.connect(n).connect(this.effectsBus),t.start(),t.stop(e.currentTime+.25)}update(e,t,n,r,i,a){if(!this.ctx)return;let o=this.ctx.currentTime,s=e.rig,c=t.phase===q.Driving,l=Math.max(s.maxSpeed,1),u=Math.abs(t.speed),d=Math.min(4,Math.floor(u/l*5)),f=Math.min(1,u/l*5-d),p=t.phase===q.Ready||!c&&t.phase!==q.Lifting?.1:.15+.85*f,m=c&&r>.1?t.boosting?1:.7:.15,h=48+62*p+5*d;for(let e of this.engineOscs)e.frequency.setTargetAtTime(h*e.scale,o,.06);this.engineFilter.frequency.setTargetAtTime(500+1600*m*(.5+.5*p),o,.08);let g=t.phase===q.Ready?.025:t.phase===q.Finished?.03:.05+.06*m;this.engineGain.gain.setTargetAtTime(g,o,.15),this.chug.frequency.setTargetAtTime(h/4,o,.1),this.chugDepth.gain.setTargetAtTime(g*.35,o,.1),this.whineGain.gain.setTargetAtTime(t.boosting?.035:0,o,.1),this.whine.frequency.setTargetAtTime(900+1400*Math.min(1,u/Math.max(s.boostSpeed,1)),o,.2);let _=c?Math.min(1,Math.abs(t.blow)/3):0;if(this.windGain.gain.setTargetAtTime(_*.12*(.7+.3*Math.sin(o*1.7)),o,.25),this.windFilter.frequency.setTargetAtTime(500+600*_,o,.3),this.rainGain.gain.setTargetAtTime(t.inStorm&&(c||t.phase===q.Lifting)?.05:0,o,.6),t.inStorm&&o-this.lastThunder>11+Math.random()*9&&(this.lastThunder=o,this.thunder()),a&&i&&(this.bellClock+=n,this.bellClock>.5&&(this.bellClock=0,this.bell())),t.lastCall!==this.lastCall||t.lastCallTime!==this.lastCallTime)switch(this.lastCall=t.lastCall,this.lastCallTime=t.lastCallTime,t.lastCall){case J.CloseCall:this.say(this.oneOf(`close`,4),1,3);break;case J.Hit:this.thump(.5),this.say(this.oneOf(`hit`,3),2,5);break;case J.BridgeStrike:this.thump(.8),this.say(`strike`,2);break;case J.Jackknife:this.thump(.6),this.say(`jackknife`,2,14);break;case J.StormHere:this.say(`storm_here`,2,15);break;case J.Air:this.say(`air`,1,6);break;case J.Splash:this.thump(.7),this.say(`splash`,2);break;case J.Rescue:this.say(`rescue`,2);break;case J.BrokeDown:this.say(`broke`,3);break;case J.Patched:this.say(`patched`,3);break;case J.Train:this.thump(1),this.say(`train`,3);break;case J.BeatTrain:this.say(`beattrain`,2);break;case J.Weighed:this.say(`weighed`,2);break;case J.BlewScale:this.say(`blewscale`,2);break;case J.GotBoost:this.say(`gotboost`,1,6);break;case J.GotRepair:this.say(`gotrepair`,1,6);break;case J.Delivered:this.say(e.course.endless?`grade_${e.grade().toLowerCase()}`:e.rig.shape===`blade`?`lift_hub`:e.rig.shape===`transformer`?`lift_pad`:e.rig.shape===`rocket`?`lift_mount`:`lift_plot`,3);break;case J.Miss:this.thump(.6),this.say(`clang`,2,4);break;case J.Found:this.say(`found`,2);break;case J.LinedUp:this.say(`linedup`,2,8);break;case J.Scrape:this.thump(.3),this.say(`scrape`,2,6);break;case J.Loaded:this.thump(.4),this.say(`loaded`,3);break;case J.Recovered:this.say(`recovered`,3),setTimeout(()=>this.say(`grade_${e.grade().toLowerCase()}`,3),2400);break;case J.Bolt:this.thump(.3),this.say(`bolted`,3),setTimeout(()=>this.say(`grade_${e.grade().toLowerCase()}`,3),2600);break;case J.Fell:this.thump(1),this.say(`fell`,3);break;case J.Leapt:this.say(`leap`,2);break;case J.Wave:this.thump(.4),this.say(`waves`,1,12);break;case J.Sea:this.thump(.7),this.say(`splash`,2);break;case J.Caught:this.say(`caught`,3)}if(c){!this.stormCloseSaid&&!t.inStorm&&e.stormLeadSeconds()<3.5&&t.time>6&&(this.stormCloseSaid=!0,this.say(`storm_close`,2,20)),e.stormLeadSeconds()>7&&(this.stormCloseSaid=!1);let n=e.nextNote();if(n){let e=`${n.text}@${Math.round(t.s+n.distance)}`;if(e!==this.spokeNote&&n.distance>20){this.spokeNote=e;let t=this.noteLine(n.text);t&&this.say(t,1,2.5)}}}this.wasStorm=t.inStorm}noteLine(e){let t=e.includes(`/`)?e.slice(0,e.indexOf(`/`)):e,n=e=>t.includes(e);return n(`NARROW`)?`narrow`:n(`THE LEAP`)?`leap`:n(`SHORTCUT`)||n(`ALLEY`)||n(`SANDBAR`)?`shortcut`:n(`MARKET`)?`market`:n(`THE CLIMB`)||n(`THE RIDGE`)?`climb`:n(`OVER THE TOP`)||n(`DOWNHILL`)?`downhill`:n(`ROCKFALL`)?`rocks`:n(`WAVE`)?`waves`:e.toLowerCase().includes(`jump`)?`jump`:t.startsWith(`SITE`)?`site`:n(`HAIRPIN`)?`hairpin`:n(`WIND`)?this.oneOf(`wind`,2):n(`RAIL CROSSING`)||n(`WEIGH`)?``:n(`CROSSING`)||n(`CROSS STREET`)?`crossing`:n(`PARKED`)?`parked`:n(`TRAFFIC`)?this.oneOf(`traffic`,2):n(`ESS BEND`)?`bends`:n(`BRIDGE`)||n(`BRANCH`)||n(`CONVEYOR`)||n(`GANTR`)?e.includes(`clear it`)?``:this.oneOf(`duck`,3):n(`LEFT`)?n(`TIGHT`)?`left1`:`left2`:n(`RIGHT`)?n(`TIGHT`)?`right1`:`right2`:``}hello(){this.ctx&&(this.say(`hello`,2),this.radio||this.playRadio())}go(){this.say(`go`,3)}},ng=`hh-music`,rg=`songs`;function ig(){return new Promise((e,t)=>{let n=indexedDB.open(ng,1);n.onupgradeneeded=()=>n.result.createObjectStore(rg,{autoIncrement:!0}),n.onsuccess=()=>e(n.result),n.onerror=()=>t(n.error)})}async function ag(e){try{let t=await ig();await new Promise((n,r)=>{let i=t.transaction(rg,`readwrite`),a=i.objectStore(rg);a.clear();for(let t of e)a.add({name:t.name,type:t.type,blob:t});i.oncomplete=()=>n(),i.onerror=()=>r(i.error)}),t.close()}catch{}}async function og(){try{let e=await ig(),t=await new Promise((t,n)=>{let r=e.transaction(rg,`readonly`).objectStore(rg).getAll();r.onsuccess=()=>t(r.result),r.onerror=()=>n(r.error)});return e.close(),t.map(e=>new File([e.blob],e.name,{type:e.type}))}catch{return[]}}async function sg(){await ag([])}var cg=class e{constructor(t){this.scene=t,this.sparks=[],this.debris=[],this.puffs=[],this.sparkGeo=new ta(.12,.12,.5),this.sparkMat=new li({color:new V(1,.75,.3)}),this.bitGeo=new ta(.4,.4,.4),this.dustClock=0,this.smokeClock=0;let n=e.soft();this.puffMat=new Hr({map:n,color:new V(.75,.68,.55),transparent:!0,opacity:.5,depthWrite:!1}),this.smokeMat=new Hr({map:n,color:new V(.2,.2,.2),transparent:!0,opacity:.55,depthWrite:!1});for(let e=0;e<60;e++){let e=new H(this.sparkGeo,this.sparkMat);e.visible=!1,t.add(e),this.sparks.push({mesh:e,vel:new B,life:0,spin:new B,grow:0})}for(let e=0;e<30;e++){let e=new H(this.bitGeo,nh([.35,.33,.3]));e.visible=!1,e.castShadow=!0,t.add(e),this.debris.push({mesh:e,vel:new B,life:0,spin:new B,grow:0})}for(let e=0;e<70;e++){let e=new ni(this.puffMat.clone());e.visible=!1,t.add(e),this.puffs.push({mesh:e,vel:new B,life:0,spin:new B,grow:0})}}static soft(){let e=document.createElement(`canvas`);e.width=e.height=64;let t=e.getContext(`2d`),n=t.createRadialGradient(32,32,0,32,32,32);return n.addColorStop(0,`rgba(255,255,255,0.8)`),n.addColorStop(.6,`rgba(255,255,255,0.25)`),n.addColorStop(1,`rgba(255,255,255,0)`),t.fillStyle=n,t.fillRect(0,0,64,64),new Zi(e)}take(e){let t=null;for(let n of e){if(n.life<=0)return n;(!t||n.life<t.life)&&(t=n)}return t}knock(e,t,n,r,i){for(let i=0;i<14*r;i++){let r=this.take(this.sparks);if(!r)break;r.mesh.position.set(e,t+Math.random()*.8,n),r.vel.set((Math.random()-.5)*14,2+Math.random()*8,(Math.random()-.5)*14),r.life=.3+Math.random()*.4,r.mesh.visible=!0}for(let a=0;a<4*r;a++){let r=this.take(this.debris);if(!r)break;r.mesh.position.set(e,t+.5,n),r.vel.set((Math.random()-.5)*9,4+Math.random()*6,(Math.random()-.5)*9),r.spin.set(Math.random()*8,Math.random()*8,Math.random()*8),r.life=1.2+Math.random()*1.2;let a=.4+Math.random()*.9;r.mesh.scale.set(a,a,a),i&&(r.mesh.material=new Lo({color:i,roughness:.8})),r.mesh.visible=!0}}puff(e,t,n,r,i,a,o){let s=this.take(this.puffs);if(!s)return;let c=s.mesh;c.material=r.clone(),c.position.set(e,t,n),c.scale.set(i,i,1),s.vel.set((Math.random()-.5)*1.5,a,(Math.random()-.5)*1.5),s.life=o,s.grow=i*1.6,c.visible=!0}update(e,t,n,r,i,a,o,s,c,l=0){this.dustClock+=e,o&&Math.abs(s)>3&&this.dustClock>.06&&(this.dustClock=0,this.puff(t+(Math.random()-.5)*2,l+.6,n+(Math.random()-.5)*2,this.puffMat,1.5+Math.random(),1.2,1.1)),this.smokeClock+=e,c>55&&this.smokeClock>Math.max(.08,.5-c/200)&&(this.smokeClock=0,this.puff(r,a,i,this.smokeMat,.8+Math.random()*.6,2.2+Math.random(),1.6));for(let t of this.sparks)t.life<=0||(t.life-=e,t.vel.y-=25*e,t.mesh.position.addScaledVector(t.vel,e),t.mesh.lookAt(t.mesh.position.clone().add(t.vel)),(t.life<=0||t.mesh.position.y<0)&&(t.life=0,t.mesh.visible=!1));for(let t of this.debris)t.life<=0||(t.life-=e,t.vel.y-=14*e,t.mesh.position.addScaledVector(t.vel,e),t.mesh.position.y<.2&&(t.mesh.position.y=.2,t.vel.set(t.vel.x*.5,-t.vel.y*.3,t.vel.z*.5),t.spin.multiplyScalar(.5)),t.mesh.rotation.x+=t.spin.x*e,t.mesh.rotation.y+=t.spin.y*e,t.mesh.rotation.z+=t.spin.z*e,t.life<=0&&(t.mesh.visible=!1));for(let t of this.puffs){if(t.life<=0)continue;t.life-=e,t.mesh.position.addScaledVector(t.vel,e);let n=t.mesh;n.scale.x+=t.grow*e*.6,n.scale.y+=t.grow*e*.6,n.material.opacity=Math.max(0,Math.min(.55,t.life*.6)),t.life<=0&&(n.visible=!1)}}},lg=`modulepreload`,ug=function(e){return`/play/`+e},dg={},fg=function(e){return e.pathname.endsWith(`.css`)},pg=function(e,t,n){if(t in e)return e[t];let r=n();if(!r){e[t]=void 0;return}let i=r.then(()=>{e[t]=void 0},n=>{throw e[t]=void 0,n});return e[t]=i,i},mg=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e,i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function s(e){return import.meta.resolve?new URL(import.meta.resolve(e)):new URL(e,import.meta.url)}r=o(t.map(t=>{t=ug(t,n);let r=s(t),i=fg(r);return pg(dg,r.href,()=>{if(e===void 0){e={all:new Set,styles:new Set};let t=document.getElementsByTagName(`link`);for(let n=t.length-1;n>=0;n--){let r=t[n];e.all.add(r.href),r.rel===`stylesheet`&&e.styles.add(r.href)}}if((i?e.styles:e.all).has(r.href))return;let t=document.createElement(`link`);if(t.rel=i?`stylesheet`:lg,i||(t.as=`script`),t.crossOrigin=``,t.href=r.href,a&&t.setAttribute(`nonce`,a),document.head.appendChild(t),i)return new Promise((e,n)=>{t.addEventListener(`load`,e),t.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${r}`)))})})}).filter(e=>e!==void 0))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})},hg=`https://mpchkzqkvkizxeokjhnp.supabase.co`,gg=`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wY2hrenFrdmtpenhlb2tqaG5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MDkzODEsImV4cCI6MjA4MzI4NTM4MX0.1pl9TsdSNEyFZDhpXgIydrRK0Ky1Ucxz1MgvNxzIpmo`,_g=!!gg,vg=`https://axleyard.com`,yg=()=>({apikey:gg,Authorization:`Bearer ${gg}`,"Content-Type":`application/json`}),bg=async e=>{if(!_g)return null;try{let t=await fetch(`${hg}/rest/v1/${e}`,{headers:yg()});return t.ok?await t.json():null}catch{return null}},xg=(e,t)=>{try{localStorage.setItem(e,t)}catch{}},Sg=e=>{try{return localStorage.getItem(e)??``}catch{return``}},Cg=()=>Sg(`hh-driver`),wg=e=>xg(`hh-driver`,e),Tg=()=>Sg(`hh-company`),Eg=e=>xg(`hh-company`,e),Dg=()=>Sg(`hh-event`),Og=e=>xg(`hh-event`,e);function kg(){let e=Sg(`hh-client`);return e||(e=Math.random().toString(36).slice(2,10)+Date.now().toString(36),xg(`hh-client`,e)),e}var Ag=null;function jg(){return _g?Ag??=mg(()=>import(`./module-BirHTz-o.js`).then(e=>e.createBrowserClient(hg,gg)),[]).catch(()=>null):Promise.resolve(null)}async function Mg(){let e=await jg();if(!e)return null;try{let{data:t}=await e.auth.getSession(),n=t.session;if(!n)return null;let{data:r}=await e.from(`game_drivers`).select(`handle,company`).eq(`user_id`,n.user.id).limit(1),i=r&&r.length?r[0]:null;return{userId:n.user.id,token:n.access_token,handle:i?.handle??null,company:i?.company??null}}catch{return null}}async function Ng(e,t,n){let r=await jg();if(!r)return`error`;let{error:i}=await r.from(`game_drivers`).upsert({user_id:e.userId,handle:t,company:n},{onConflict:`user_id`});return i?i.code===`23505`?`taken`:`error`:(e.handle=t,e.company=n,`ok`)}var Pg=()=>`/login?redirect=${encodeURIComponent(location.pathname+location.search)}`;async function Fg(e,t=null){if(!_g)return`error`;try{let n=t&&t.handle?{...e,user_id:t.userId}:e,r=t&&t.handle?{Authorization:`Bearer ${await Ig()??t.token}`}:{},i=await fetch(`${hg}/rest/v1/game_runs`,{method:`POST`,headers:{...yg(),...r,Prefer:`return=minimal`},body:JSON.stringify(n)});return i.ok?`ok`:(await i.text()).includes(`claimed`)?`claimed`:`error`}catch{return`error`}}async function Ig(){let e=await jg();if(!e)return null;let{data:t}=await e.auth.getSession();return t.session?.access_token??null}async function Lg(e,t,n=10){return await bg(`game_board?${new URLSearchParams({select:`driver,company,time_seconds,pay,grade,beat_storm,created_at,verified`,course:`eq.${e}`,load:`eq.${t}`,order:`pay.desc,time_seconds.asc`,limit:String(n)})}`)??[]}async function Rg(e,t=10){return await bg(`game_runs?${new URLSearchParams({select:`driver,company,time_seconds,pay,grade,beat_storm,created_at`,event_code:`eq.${e}`,order:`pay.desc,time_seconds.asc`,limit:String(t)})}`)??[]}async function zg(e){let t=await bg(`game_driver_totals?${new URLSearchParams({select:`driver,company,runs,pay,hours,clean_runs,best_grade`,key:`eq.${e.toLowerCase()}`})}`);return t&&t.length?t[0]:null}async function Bg(e=10){return await bg(`game_company_totals?${new URLSearchParams({select:`company,drivers,runs,pay,hours`,order:`pay.desc`,limit:String(e)})}`)??[]}async function Vg(e){let t=await bg(`game_events?${new URLSearchParams({select:`code,name,starts_at,ends_at,prize`,code:`eq.${e}`})}`);return t&&t.length?t[0]:null}async function Hg(e=6){let t=Math.floor(Math.random()*900),n=await bg(`listings?${new URLSearchParams({select:`id,title,price,city,state,year,make,listing_images(url,sort_order,is_primary)`,status:`eq.active`,deleted_at:`is.null`,order:`published_at.desc`,limit:String(e*3),offset:String(t)})}`);return n?n.filter(e=>e.listing_images&&e.listing_images.length>=3).slice(0,e).map(e=>{let t=[...e.listing_images].sort((e,t)=>Number(t.is_primary)-Number(e.is_primary)||e.sort_order-t.sort_order);return{id:e.id,title:e.title,price:e.price,city:e.city,state:e.state,year:e.year,make:e.make,photo:t[0]?.url??null}}):[]}var Ug=e=>`${vg}/listing/${e}?utm_source=heavyhaul&utm_medium=game`,Wg=new URLSearchParams(location.search),Gg=(()=>{let e=Wg.get(`level`);if(e!==null)return Math.max(0,Math.min(8,Number(e)||0));try{return Math.max(0,Math.min(8,Number(localStorage.getItem(`hh-level`)??0)||0))}catch{return 0}})(),Kg=_f(Gg),Q=new km(Kg);function qg(e){if(e===Gg||Q.state.phase!==q.Ready)return;try{localStorage.setItem(`hh-level`,String(e))}catch{}let t=new URL(location.href);t.searchParams.set(`level`,String(e)),location.href=t.toString()}{let e=document.getElementById(`levels`);for(let t=0;t<9;t++){let n=document.createElement(`button`),r=t===7?`new every day`:t===8?`how far can you get`:t===0?`start here`:_f(t).town.toLowerCase();n.innerHTML=`<b>${t+1}</b>${vf[t]}<small>${r}</small>`,n.classList.toggle(`on`,t===Gg),n.addEventListener(`click`,()=>qg(t)),e.appendChild(n)}document.getElementById(`level-blurb`).textContent=Kg.blurb,document.getElementById(`logo`).src=`/play/axlon-face.png`}var Jg=new md({canvas:document.getElementById(`game`),antialias:!0,powerPreference:`high-performance`});Jg.setPixelRatio(Math.min(window.devicePixelRatio,2)),Jg.shadowMap.enabled=!0,Jg.shadowMap.type=1,Jg.toneMapping=4,Jg.toneMappingExposure=1;var Yg=new Rn;Yg.fog=new Ln(new V(.72,.8,.9),320,2200);var Xg=new As(new V(1,.93,.82),2.8);Xg.castShadow=!0,Xg.shadow.mapSize.set(4096,4096),Xg.shadow.camera.near=1,Xg.shadow.camera.far=500,Xg.shadow.camera.left=-110,Xg.shadow.camera.right=110,Xg.shadow.camera.top=110,Xg.shadow.camera.bottom=-110,Xg.shadow.bias=-4e-4,Xg.shadow.normalBias=.02,Yg.add(Xg,Xg.target);var Zg=new ps(new V(.55,.7,1),new V(.35,.4,.25),.9);Yg.add(Zg);var Qg=new Ts(70,1,.5,6e3),$g=new Yh(Yg),e_=new Jh(Yg,Kg),t_=0,n_=(e,t,n)=>{try{return Math.max(0,Math.min(n,Number(Wg.get(e)??localStorage.getItem(`hh-${e}`)??t)||0))}catch{return t}};Q.recovery=(Wg.get(`mode`)??(()=>{try{return localStorage.getItem(`hh-mode`)}catch{return null}})())===`recovery`,t_=n_(`load`,0,5),Q.broken=n_(`job`,0,ym.length-1),Q.state.truck=n_(`truck`,0,Cm.length-1),Q.state.contract=t_,Q.reset();var r_=new wh(Yg,Cm[Q.state.truck],Q.rig);Q.recovery&&r_.setBroken(ym[Q.broken],Q.broken),e_.setSite(Q.rig.shape);var i_=()=>Q.recovery?`RECOVERY  ${ym[Q.broken].name}`:Q.rig.name;function a_(){Q.state.contract=t_,Q.reset(),r_.remove(),r_=new wh(Yg,Cm[Q.state.truck],Q.rig),Kg.night&&r_.headlights(),Q.recovery&&r_.setBroken(ym[Q.broken],Q.broken),e_.setSite(Q.rig.shape);try{localStorage.setItem(`hh-mode`,Q.recovery?`recovery`:`haul`),localStorage.setItem(`hh-load`,String(t_)),localStorage.setItem(`hh-job`,String(Q.broken)),localStorage.setItem(`hh-truck`,String(Q.state.truck))}catch{}l_();for(let e of document.querySelectorAll(`#trucks button`))e.classList.toggle(`on`,Number(e.dataset.i)===Q.state.truck);for(let e of document.querySelectorAll(`#modes button`))e.classList.toggle(`on`,e.dataset.mode===(Q.recovery?`recovery`:`haul`));document.body.classList.toggle(`recovery`,Q.recovery),u_()}var o_=()=>{document.getElementById(`tagline`).textContent=Q.recovery?`Tow the breakdown home before the clock eats the fee.`:`Get the load there before the storm does.`};function s_(e,t){Q.state.phase===q.Ready&&(Q.recovery?Q.broken=e:t_=e,Q.state.truck=t,a_())}function c_(e){Q.state.phase===q.Ready&&e!==Q.recovery&&(Q.recovery=e,a_())}function l_(){let e=document.getElementById(`loads`);e.innerHTML=``,document.getElementById(`loads-head`).textContent=Q.recovery?`JOB`:`LOAD`,(Q.recovery?ym.map(e=>({name:e.name,pay:e.fee})):vm.slice(0,6).map(e=>({name:e.name,pay:e.basePay}))).forEach((t,n)=>{let r=document.createElement(`button`);r.dataset.i=String(n),r.innerHTML=`${t.name}<small>${Q.recovery?`fee `:``}$${t.pay.toLocaleString(`en-US`)}</small>`,r.classList.toggle(`on`,n===(Q.recovery?Q.broken:t_)),r.addEventListener(`click`,()=>s_(n,Q.state.truck)),e.appendChild(r)})}function u_(){let e=Cm[Q.state.truck];if(Q.recovery){let t=ym[Q.broken];document.getElementById(`cap-name`).textContent=`RECOVERY  ·  ${t.name}`,document.getElementById(`cap-sub`).textContent=`${e.name}  ·  FEE $${t.fee.toLocaleString(`en-US`)}  ·  the clock is on the customer`,document.getElementById(`load-blurb`).textContent=`${t.blurb} Find her, back the deck up to her nose, hold F to winch her on, bring her in.`}else document.getElementById(`cap-name`).textContent=Q.rig.name,document.getElementById(`cap-sub`).textContent=`${e.name}  ·  PAYS $${Q.rig.basePay.toLocaleString(`en-US`)}`,document.getElementById(`load-blurb`).textContent=Q.rig.blurb;document.getElementById(`truck-blurb`).textContent=`${e.name}: ${e.strengths}.`,o_()}{let e=document.getElementById(`modes`);for(let[t,n]of[[`haul`,`HAUL`],[`recovery`,`RECOVERY`]]){let r=document.createElement(`button`);r.dataset.mode=t,r.textContent=n,r.classList.toggle(`on`,t===`recovery`===Q.recovery),r.addEventListener(`click`,()=>c_(t===`recovery`)),e.appendChild(r)}document.body.classList.toggle(`recovery`,Q.recovery),l_(),u_();let t=document.getElementById(`trucks`);Cm.forEach((e,n)=>{let r=document.createElement(`button`);r.dataset.i=String(n),r.innerHTML=`${e.name}<small>${e.strengths}</small>`,r.classList.toggle(`on`,n===Q.state.truck),r.addEventListener(`click`,()=>s_(Q.recovery?Q.broken:t_,n)),t.appendChild(r)})}var d_=new cg(Yg),f_=+!!Kg.night;$g.night=f_,$g.warm=+!!Kg.desert,Kg.night&&r_.headlights(),Kg.desert&&(Xg.color.setRGB(1,.8,.6),$g.setSun(18,250));var p_=Kg.night?[.03,.035,.07]:Kg.desert?[.9,.75,.58]:[.72,.8,.9],m_=-1,h_=0,g_=0,__=new Gm(Jg);__.addPass(new Km(Yg,Qg));var v_=new Jm(new z(1,1),.3,.4,1.5);__.addPass(v_),__.addPass(new Xm);var y_=new tg,b_=!1;function x_(){y_.start(),b_||(b_=!0,setTimeout(()=>y_.hello(),300))}window.addEventListener(`keydown`,x_,{once:!1}),window.addEventListener(`pointerdown`,x_,{once:!1});var S_=new Set;window.addEventListener(`keydown`,e=>{if(S_.add(e.code),[`Space`,`ArrowUp`,`ArrowDown`,`ArrowLeft`,`ArrowRight`].includes(e.code)&&e.preventDefault(),e.code===`KeyN`&&!e.repeat&&document.activeElement?.tagName!==`INPUT`&&(Q.state.phase===q.Ready?y_.toggleRadio():y_.skipRadio(),document.getElementById(`radio-on`).checked=y_.radioOn),(e.code===`KeyP`||e.code===`Escape`)&&!e.repeat&&E_(),(e.code===`Enter`||e.code===`NumpadEnter`)&&!e.repeat&&document.activeElement?.tagName!==`INPUT`){if(C_){E_(),Q.reset(),r_.resetRecovery(),uv=!1;return}w_=!0}Q.state.phase===q.Ready&&/^Digit[1-9]$/.test(e.code)&&document.activeElement?.tagName!==`INPUT`&&qg(Number(e.code.slice(5))-1)});var C_=!1,w_=!1;document.getElementById(`r-go`).addEventListener(`click`,()=>{w_=!0,T_=!0});var T_=!1;function E_(){Q.state.phase!==q.Ready&&(C_=!C_,document.getElementById(`pause`).style.display=C_?`flex`:`none`,y_.setPaused(C_))}document.getElementById(`t-pause`).addEventListener(`click`,E_);for(let e of[`music`,`effects`,`voice`]){let t=document.getElementById(`mix-${e}`);try{let n=localStorage.getItem(`hh-mix-${e}`);n!==null&&(t.value=String(Math.round(Number(n)*100)))}catch{}y_.setMix({[e]:Number(t.value)/100}),t.addEventListener(`input`,()=>y_.setMix({[e]:Number(t.value)/100})),t.addEventListener(`change`,()=>{try{localStorage.setItem(`hh-mix-${e}`,String(Number(t.value)/100))}catch{}})}document.getElementById(`radio-on`).addEventListener(`change`,()=>y_.toggleRadio());var D_=document.getElementById(`music-files`);for(let e of document.querySelectorAll(`.my-music`))e.addEventListener(`click`,e=>{e.stopPropagation(),x_(),D_.click()});function O_(e){for(let t of document.querySelectorAll(`.my-music`))t.textContent=e?`♪ my ${e} song${e===1?``:`s`} on the radio  ·  change`:`♪ play my own music`;for(let t of document.querySelectorAll(`.our-radio`))t.style.display=e?``:`none`;document.getElementById(`radio-on`).checked=y_.radioOn}D_.addEventListener(`change`,()=>{let e=[...D_.files??[]],t=y_.useOwnMusic(e);t&&ag(e),O_(t),D_.value=``});for(let e of document.querySelectorAll(`.our-radio`))e.addEventListener(`click`,e=>{e.stopPropagation(),x_(),y_.useOurRadio(),sg(),O_(0)});og().then(e=>{e.length&&O_(y_.useOwnMusic(e,!1))});var k_=0,A_=``;y_.onSong=e=>{A_=e;let t=document.getElementById(`song`);t.textContent=`♪  ${e}`,t.classList.add(`on`),clearTimeout(k_),k_=window.setTimeout(()=>t.classList.remove(`on`),4500)},window.addEventListener(`keyup`,e=>S_.delete(e.code));var j_=(...e)=>e.some(e=>S_.has(e));function M_(){let e=Dm();return e.throttle=+!!j_(`KeyW`,`ArrowUp`),e.brake=+!!j_(`KeyS`,`ArrowDown`),e.steer=+!!j_(`KeyD`,`ArrowRight`)-!!j_(`KeyA`,`ArrowLeft`),e.tail=+!!j_(`KeyE`)-!!j_(`KeyQ`),e.duck=j_(`Space`),e.boost=j_(`ShiftLeft`,`ShiftRight`),e.rescue=j_(`KeyR`),e.fix=j_(`KeyF`),e}var N_={steer:0,throttle:0,brake:0,duck:!1,boost:!1,fix:!1};function P_(e,t){let n=document.getElementById(e);if(!n)return;let r=e=>{e.preventDefault(),t(!0),n.classList.add(`held`)},i=e=>{e.preventDefault(),t(!1),n.classList.remove(`held`)};n.addEventListener(`pointerdown`,r),n.addEventListener(`pointerup`,i),n.addEventListener(`pointercancel`,i),n.addEventListener(`pointerleave`,i)}P_(`t-left`,e=>N_.steer=e?-1:N_.steer<0?0:N_.steer),P_(`t-right`,e=>N_.steer=e?1:N_.steer>0?0:N_.steer),P_(`t-go`,e=>N_.throttle=+!!e),P_(`t-brake`,e=>N_.brake=+!!e),P_(`t-duck`,e=>N_.duck=e),P_(`t-boost`,e=>N_.boost=e),P_(`t-fix`,e=>N_.fix=e);var F_=matchMedia(`(pointer: coarse)`).matches;document.body.classList.toggle(`touch`,F_),F_&&(document.querySelector(`#title .go`).textContent=`TAP GO TO DRIVE`,document.getElementById(`r-go`).textContent=`TAP HERE TO GO AGAIN`);var $=e=>document.getElementById(e),I_={speed:$(`speed`),time:$(`time`),storm:$(`storm`),note:$(`note`),noteDist:$(`note-dist`),call:$(`call`),damage:$(`damage`),boost:$(`boost-fill`),title:$(`title`),result:$(`result`),countdown:$(`countdown`)},L_=e=>Math.round(Math.abs(e)*2.23694),R_=e=>(e<0?`-`:``)+`$`+Math.abs(e).toLocaleString(`en-US`),z_=e=>`${Math.floor(e/60)}:${(e%60).toFixed(1).padStart(4,`0`)}`;function B_(e,t){let n=t>0?`   +${R_(t)}`:t<0?`   ${R_(t)}`:``;switch(e){case J.CloseCall:return`CLOSE CALL`+n;case J.Threaded:return`THREADED IT`+n;case J.Hit:return`HIT`;case J.BridgeStrike:return`BRIDGE STRIKE`;case J.Jackknife:return`JACKKNIFE`;case J.Overshot:return`OVERSHOT THE BOX`+n;case J.StormHere:return`THE STORM HAS YOU`;case J.Air:return`BIG AIR`+n;case J.Splash:return`IN THE WATER`;case J.Rescue:return`BACK ON THE ROAD`;case J.BrokeDown:return`BROKEN DOWN`;case J.Patched:return`PATCHED UP`;case J.Train:return`THE TRAIN`;case J.BeatTrain:return`BEAT THE TRAIN`+n;case J.Weighed:return`WEIGHED  /  all in order`+n;case J.BlewScale:return`BLEW THE SCALE  /  fined`+n;case J.GotBoost:return`BOOST`;case J.GotRepair:return`REPAIR KIT`;case J.Delivered:return Kg.endless?`END OF THE ROAD`:`IN THE BOX  /  now the lift`;case J.Fell:return`INTO THE GORGE`+n;case J.Leapt:return`MADE THE LEAP`+n;case J.Wave:return`WAVE`;case J.Sea:return`IN THE SEA`;case J.Caught:return`THE STORM HAS YOU`;case J.Miss:return`CLANG`;case J.Found:return`THERE SHE IS`;case J.LinedUp:return F_?`LINED UP  /  hold WINCH`:`LINED UP  /  hold F to winch`;case J.Scrape:return`SCRAPING HER  /  keep her straight`;case J.Loaded:return`ON THE DECK  /  bring her in`;case J.Recovered:return`RECOVERED`+n;case J.Bolt:return(gm(Q.rig.shape)?`BOLTED ON`:`SET DOWN`)+(t>0?`  /  soft touch`+n:``);default:return``}}var V_=J.None,H_=-1,U_=!1,W_=$(`r-post`),G_=$(`r-name`),K_=$(`r-company`),q_=!1,J_=!1,Y_=`job`,X_=null;G_.value=Cg(),K_.value=Tg(),W_.style.display=_g?`flex`:`none`;var Z_=null,Q_=()=>Z_&&Z_.handle?Z_.handle:G_.value.trim();function $_(){let e=W_.querySelector(`button`),t=$(`r-claim`),n=$(`signin`);Z_&&Z_.handle?(G_.style.display=`none`,!K_.value&&Z_.company&&(K_.value=Z_.company),q_||(e.textContent=`POST TO THE BOARD`),t.innerHTML=`posting as <b>${ev(Z_.handle)}</b> <span class="tick">✓</span>`,n.innerHTML=`driving as <b>${ev(Z_.handle)}</b> <span class="tick">✓</span>`):Z_?(G_.style.display=``,q_||(e.textContent=`CLAIM NAME & POST`),t.innerHTML=`signed in: the name you post now is yours for good`,n.innerHTML=`signed in: claim your driver name on your first run`):(G_.style.display=``,t.innerHTML=`<a href="${Pg()}" target="_top">make the name yours: sign in with AXLEYARD</a>`,n.innerHTML=`<a href="${Pg()}" target="_top">sign in</a> to claim your driver name`)}_g&&Mg().then(e=>{Z_=e,$_()});var ev=e=>e.replace(/[<>&]/g,``);{let e=(Wg.get(`event`)??``).toUpperCase().replace(/[^A-Z0-9]/g,``);e&&Og(e);let t=Dg();t&&Vg(t).then(e=>{let t=Date.now();e&&t>=Date.parse(e.starts_at)&&t<=Date.parse(e.ends_at)?(X_=e,$(`r-event`).textContent=`AT ${e.name.toUpperCase()}  /  this run goes on the show's board${e.prize?`  /  `+e.prize:``}`,$(`r-tabs`).querySelector(`[data-tab="event"]`).style.display=``):Og(``)})}var tv=[];Hg(6).then(e=>{tv=e,e_.setListings(e)});async function nv(e){let t=$(`r-board`);if(Y_===`companies`){let e=await Bg(10);t.innerHTML=`<h4>COMPANIES  /  all jobs</h4>`+(e.length?e.map((e,t)=>`<div><span>${t+1}</span><span>${ev(e.company)}</span><span>${e.drivers} driver${e.drivers===1?``:`s`}</span><span>${R_(Number(e.pay))}</span></div>`).join(``):`<div><span></span><span>no company on the board yet: put yours on a run</span></div>`);return}if(Y_===`event`&&X_){let e=await Rg(X_.code,10);t.innerHTML=`<h4>${ev(X_.name.toUpperCase())}</h4>`+(e.length?e.map((e,t)=>`<div><span>${t+1}</span><span>${ev(e.driver)}${e.company?`  ·  `+ev(e.company):``}</span><span>${e.grade}  ${z_(Number(e.time_seconds))}</span><span>${R_(e.pay)}</span></div>`).join(``):`<div><span></span><span>nobody has posted at the show yet</span></div>`);return}let n=await Lg(Kg.name,i_(),10);t.innerHTML=n.length===0?_g?`<h4>THE BOARD</h4><div><span></span><span>nobody has posted a run on this job yet</span></div>`:``:`<h4>THE BOARD  /  `+Kg.name+`</h4>`+n.map((t,n)=>`<div class="${e&&t.pay===e.pay&&Math.abs(t.time_seconds-e.time)<.15&&t.driver.toLowerCase()===Q_().toLowerCase()?`me`:``}"><span>${n+1}</span><span>${ev(t.driver)}${t.verified?` <i class="tick">✓</i>`:``}${t.company?`  ·  `+ev(t.company):``}</span><span>${t.grade}  ${z_(Number(t.time_seconds))}</span><span>${R_(t.pay)}</span></div>`).join(``)}async function rv(){let e=Q_(),t=$(`r-career`);if(!e||!_g){t.innerHTML=``;return}let n=await zg(e);t.innerHTML=n?[[`CAREER PAY`,R_(Number(n.pay))],[`RUNS`,String(n.runs)],[`SEAT HOURS`,Number(n.hours).toFixed(1)],[`CLEAN RUNS`,String(n.clean_runs)],[`BEST`,n.best_grade]].map(([e,t])=>`<div>${e}<b>${t}</b></div>`).join(``):``}function iv(){let e=$(`r-trailers`),t=tv.filter((e,t)=>t<e_.boards.length&&e_.boards[t].s<Q.state.s);e.innerHTML=t.length?`<h4>TRAILERS YOU PASSED TODAY  /  for sale on AXLEYARD</h4>`+t.map(e=>`<a href="${Ug(e.id)}" target="_blank" rel="noopener">${e.photo?`<img src="${e.photo}" alt="" />`:``}<span>${ev(e.title)}</span><span class="price">${e.price&&e.price>0?R_(Math.round(e.price)):`call`}</span></a>`).join(``):``}$(`r-tabs`).addEventListener(`click`,e=>{let t=e.target.closest(`button`);if(t){Y_=t.dataset.tab??`job`;for(let e of $(`r-tabs`).querySelectorAll(`button`))e.classList.toggle(`on`,e===t);nv()}}),W_.addEventListener(`submit`,async e=>{e.preventDefault();let t=Q.state,n=Q_().slice(0,24),r=K_.value.trim().slice(0,40),i=W_.querySelector(`button`);if(!n||q_||t.phase!==q.Finished)return;if(n.length<2||/[<>&]/.test(n)){$(`r-claim`).textContent=`a name of 2 to 24 letters, please`;return}if(wg(n),Eg(r),Z_&&!Z_.handle){i.textContent=`CLAIMING…`;let e=await Ng(Z_,n,r||null);if(e!==`ok`){i.textContent=`CLAIM NAME & POST`,$(`r-claim`).textContent=e===`taken`?`that name is taken: try another`:`could not claim it just now: try again`;return}$_()}q_=!0,W_.classList.add(`posted`),i.textContent=`POSTING…`;let a=await Fg({driver:n,company:r||null,event_code:X_?X_.code:null,course:Kg.name,load:i_(),time_seconds:Math.round(t.time*10)/10,pay:Q.pay(),grade:Q.grade(),damage:Math.round(t.damage),hits:t.hits,close_calls:t.closeCalls,beat_storm:t.beatStorm,client:kg()},Z_);a===`claimed`?(q_=!1,W_.classList.remove(`posted`),i.textContent=`POST TO THE BOARD`,$(`r-claim`).innerHTML=`that name belongs to a signed-in driver: <a href="${Pg()}" target="_top">sign in</a> if it's you, or pick another`):(i.textContent=a===`ok`?`ON THE BOARD`:`COULD NOT POST`,a===`ok`&&(await nv({pay:Q.pay(),time:Math.round(t.time*10)/10}),rv()))}),G_.addEventListener(`keydown`,e=>e.stopPropagation()),K_.addEventListener(`keydown`,e=>e.stopPropagation());function av(){let e=Q.state;I_.speed.textContent=String(L_(e.speed)),I_.time.textContent=z_(e.time);let t=Q.stormLeadSeconds(),n=e.phase===q.Driving||e.phase===q.Lifting||e.phase===q.Finished;Kg.endless?(I_.time.textContent=`${(Math.max(0,e.s-34)/1609).toFixed(2)} mi`,I_.storm.textContent=n?t>0?`STORM  ${t.toFixed(1)} s BEHIND`:`IN THE STORM  ${Math.max(0,6-e.caughtSeconds).toFixed(0)}`:``):I_.storm.textContent=n?t>0?`STORM  ${t.toFixed(1)} s BEHIND`:`IN THE STORM`:``,I_.storm.className=t>8?`green`:t>3?`amber`:`red`,I_.damage.textContent=`DAMAGE  ${Math.round(e.damage)}%`,I_.boost.style.width=`${Math.round(e.boost*100)}%`,$(`boost-hint`).textContent=e.phase===q.Driving?e.boosting?`BOOST`:e.boost<.05?`BOOST  empty: close calls and bridges fill it`:e.boost>.6?`BOOST  hold SHIFT`:`BOOST`:``,$(`boost-hint`).className=e.boosting?`on`:``;let r=Q.recovery&&e.foundBreakdown&&!e.loaded&&Math.abs(e.s-e.breakdownS)<80,i=e.phase===q.Driving&&!r?Q.nextNote():null;I_.note.textContent=i?i.text:``,I_.noteDist.textContent=i?`${Math.round(i.distance*3.28084/10)*10} ft`:e.phase===q.Driving&&Math.abs(e.blow)>.6?e.blow>0?`WIND  →  pushing you right`:`WIND  ←  pushing you left`:``,$(`top`).style.visibility=i||I_.noteDist.textContent?`visible`:`hidden`,(e.lastCall!==V_||e.lastCallTime!==H_)&&(V_=e.lastCall,H_=e.lastCallTime,I_.call.textContent=B_(e.lastCall,e.lastCallDollars),I_.call.classList.remove(`pop`),I_.call.offsetWidth,I_.call.classList.add(`pop`)),e.time-e.lastCallTime>2.2&&e.phase===q.Driving&&(I_.call.textContent=``);{let t=$(`prompt`),n=e.phase===q.Driving?Kg.scales.find(t=>e.s>t.s-60&&e.s<t.s+t.length+12):void 0;if(n&&!e.weighed&&!e.blewScale){let r=Fd(n,e.s,e.lateral),i=Id(n,e.s,e.lateral),a=Math.abs(e.speed)<.3,o=``,s=``,c=!1,l=-1;i&&a?(o=`WEIGHING  /  hold still`,s=`the scale needs the rig stood still`,c=!0,l=Math.min(1,e.weighClock/2.5)):i?(o=`STOP ON THE PLATE`,s=`brake to a stop between the yellow lines`):r&&e.s<Md(n)?(o=`ONTO THE PLATE AHEAD`,s=`the steel deck between the yellow lines, then stop`):r?(o=`YOU DROVE OFF THE PLATE`,s=`back up onto it, or carry on and take the fine`):(o=`WEIGH STATION  /  pull in on the right`,s=`stop on the plate for ${R_(2e4)}, or blow past it for a ${R_(25e3)} fine`),$(`prompt-title`).textContent=o,$(`prompt-title`).className=c?`green`:``,$(`prompt-sub`).textContent=s,$(`prompt-bar`).style.display=l>=0?`block`:`none`,l>=0&&($(`prompt-fill`).style.width=`${Math.round(l*100)}%`),t.style.display=`block`}else n&&e.weighed&&e.s<n.s+n.length+12?($(`prompt-title`).textContent=`WEIGHED  /  all in order`,$(`prompt-title`).className=`green`,$(`prompt-sub`).textContent=`on you go`,$(`prompt-bar`).style.display=`none`,t.style.display=`block`):e.phase!==q.Lifting&&!(Q.recovery&&e.foundBreakdown&&!e.loaded&&e.phase===q.Driving)&&(t.style.display=`none`)}if(Q.recovery&&e.phase===q.Driving&&e.foundBreakdown&&!e.loaded){let t=ym[Q.broken],n=Sd(Q.breakdownYaw()),r=Q.breakdownPos(),i={x:r.x+n.x*t.halfLength,y:r.y+n.y*t.halfLength},a=Q.deckTail(),o={x:a.x-i.x,y:a.y-i.y},s=o.x*n.x+o.y*n.y,c=Math.abs(o.x*n.y-o.y*n.x),l=e.trailerYaw-Q.breakdownYaw();for(;l>Math.PI;)l-=2*Math.PI;for(;l<-Math.PI;)l+=2*Math.PI;let u=e=>`${Math.round(e*3.28084/5)*5} ft`,d=F_?`hold WINCH`:`hold F`,f=F_?`LEFT / RIGHT`:`A / D`,p=``,m=``,h=!1,g=-1;e.linedUp&&e.winch>0?(p=Math.abs(e.winchSkew)>1?`SCRAPING  /  straighten her`:`WINCHING  /  keep her straight`,m=`${d} and steer ${f} against the drift  ·  ${e.winchSkew>.15?`◀ steer left`:e.winchSkew<-.15?`steer right ▶`:`dead straight`}`,h=Math.abs(e.winchSkew)<=1,g=e.winch):e.linedUp?(p=`LINED UP  /  ${d} to winch`,m=`the deck is down at her nose`,h=!0):s>6.6?(p=`BACK UP  ${u(s)}`,m=F_?`BRAKE to back up, until the deck's tail is at her nose`:`S or down arrow, until the deck's tail is at her nose`):s<-6.6?(p=`DRIVE PAST HER  ${u(-s)}`,m=`pull onto the shoulder ahead of her, then back the deck up to her nose`):c>3?(p=`GET ONTO THE SHOULDER`,m=`the deck's tail has to be right in front of her`):Math.abs(l)>.5?(p=`STRAIGHTEN THE TRAILER`,m=`${f} while backing, until it points at her`):(p=`STOP THERE`,m=`stopped and in line, the winch is yours`),$(`prompt-title`).textContent=p,$(`prompt-title`).className=h?`green`:Math.abs(e.winchSkew)>1?`red`:``,$(`prompt-sub`).textContent=m,$(`prompt-bar`).style.display=g>=0?`block`:`none`,g>=0&&($(`prompt-fill`).style.width=`${Math.round(g*100)}%`),$(`prompt`).style.display=`block`,$(`prompt`).classList.add(`lift`)}if(e.phase===q.Lifting){let t=$(`prompt`),n=Q.rig.shape,r=e.liftHold>0,i=n===`blade`?`EASE THE ROOT INTO THE RING AND HOLD IT`:n===`rocket`?`STAND IT ON THE RING`:n===`transformer`?`SET IT DOWN AGAINST THE WALL`:n===`house`?`SET IT DOWN AGAINST THE GARAGE`:`SET IT DOWN IN THE BOX`,a=r?gm(n)?`BOLTING IT ON  /  hold it there`:`BOLTING IT DOWN`:e.clangCool>0?`CLANG  /  too hard`:e.setDown?`NOT IN THE BOX  /  pick it up (W) and try again`:i;$(`prompt-title`).textContent=a,$(`prompt-title`).className=r?`green`:e.clangCool>0?`red`:``,$(`prompt-sub`).textContent=(F_?`LEFT / RIGHT swing the crane  ·  GO / BRAKE raise and lower`:`A / D swing the crane  ·  W / S raise and lower`)+(_m(n)?`  ·  the wall stops it: come in slow`:``),$(`prompt-bar`).style.display=`block`,$(`prompt-fill`).style.width=`${Math.round(Math.min(1,e.liftHold/um)*100)}%`,t.style.display=`block`,t.classList.add(`lift`)}else Q.recovery&&e.phase===q.Driving&&e.foundBreakdown&&!e.loaded||$(`prompt`).classList.remove(`lift`);if(e.phase===q.Finished&&ov<=3&&(I_.call.textContent=B_(e.lastCall,e.lastCallDollars)),I_.title.style.display=e.phase===q.Ready?`flex`:`none`,document.body.classList.toggle(`ready`,e.phase===q.Ready),I_.countdown.textContent=e.phase===q.Countdown?String(Math.ceil(e.countdown)):``,e.phase===q.Finished&&(ov>3||U_)){I_.result.style.display=`flex`,$(`r-head`).textContent=`${Kg.name}  /  ${i_()}`,$(`r-sub`).textContent=Kg.endless?e.caught?`THE STORM HAS YOU`:`THE END OF THE ROAD`:Q.recovery?`RECOVERED`:`DELIVERED`,$(`r-grade`).textContent=Q.grade();let t=e.bonusDollars-e.scaleDollars-e.fallDollars,n=[];e.scaleDollars&&n.push([e.scaleDollars>0?`WEIGHED AT THE SCALE`:`BLEW THE SCALE`,e.scaleDollars]),e.fallDollars&&n.push([`INTO THE GORGE`,e.fallDollars]);let r=Q.recovery?[[`RECOVERY FEE`,Q.recoveryFee()],[`THE CUSTOMER'S CLOCK`,-Math.round(e.towBill)],[`SCRAPES ON HER`,-Math.round(e.busDamage)*2500],[`BONUSES  close calls, jumps, trains`,t],...n,[`DAMAGE TO THE RIG`,-Q.damageCost()]]:Kg.endless?[[`${(Math.max(0,e.s-34)/1609).toFixed(2)} MILES AHEAD OF THE STORM`,Q.distancePay()],[`BONUSES  close calls, jumps, trains`,t],...n,[`DAMAGE`,-Q.damageCost()]]:[[`DELIVERY`,Q.rig.basePay],[`BONUSES  close calls, jumps, trains`,t],...n,[`TIME BONUS`,Q.timeBonus()],[e.beatStorm?`BEAT THE STORM   pay x ${wm[e.risk].payScale.toFixed(1)}`:`CAUGHT BY THE STORM`,e.beatStorm?Q.stormBonus():0],[`DAMAGE`,-Q.damageCost()]];e.overshot&&!Q.recovery&&!Kg.endless&&(r=[...r,[`OVERSHOT THE BOX`,-1e4]]),$(`r-lines`).innerHTML=r.map(([e,t])=>`<div><span>${e}</span><b>${R_(t)}</b></div>`).join(``)+`<div class="pay"><span>PAY</span><b>${R_(Q.pay())}</b></div>`,$(`r-stats`).textContent=`TIME ${z_(e.time)}      DAMAGE ${Math.round(e.damage)}%      CLOSE CALLS ${e.closeCalls}      HITS ${e.hits}`,document.body.classList.add(`result-up`),J_||(J_=!0,nv(),rv(),iv())}else I_.result.style.display=`none`,document.body.classList.remove(`result-up`),J_&&(J_=!1,q_=!1,W_.classList.remove(`posted`),W_.querySelector(`button`).textContent=`POST TO THE BOARD`,$_(),$(`r-board`).innerHTML=``)}var ov=0;function sv(){let e=Q.state,t=e_.mark,n=Sd(t.yaw),r=Q.rig,i=r.shape===`rocket`?e.loadY+r.loadEnd:e.loadY;return{x:t.x+n.x*e.loadX,y:t.y+n.y*e.loadX,up:t.up+i}}function cv(e){let t=Q.state,n=Q.rig;if(t.phase!==q.Lifting&&t.phase!==q.Finished){ov=0,r_.loadFree=!1;return}if(Kg.endless||Q.recovery){t.phase===q.Finished&&(ov+=e);return}t.phase===q.Finished&&(ov+=e);let r=e_.mark,i=sv(),a=r.hanging;r_.placeLoad(i.x,i.y,a?i.up:i.up-n.underside,r.yaw,a);let o=Sd(r.yaw),s=a?0:-(n.loadEnd+1)*.5,c=a?1.4:n.rootThickness+.6,l=t.setDown||t.phase===q.Finished?2.5:0;e_.setHook(i.x+o.x*s,i.y+o.y*s,i.up+c+l),e_.setMark(t.phase===q.Finished||t.liftHold>0?`on`:t.clangCool>0?`clang`:`wait`)}var lv=Q.state.yaw,uv=!1,dv=1,fv=Kg.obstacles.filter(e=>e.solid&&e.height>6&&(e.radius===0||e.radius>3));function pv(e,t){for(let n of fv){let r=e.x-n.pos.x,i=e.y-n.pos.y;if(r*r+i*i>3600||n.height+Rd(Kg,n.pos)<t)continue;if(n.radius>0){if(r*r+i*i<(n.radius+1)**2)return!0;continue}let a=Math.cos(n.yaw),o=Math.sin(n.yaw);if(Math.abs(r*a+i*o)<n.half.x+1&&Math.abs(-r*o+i*a)<n.half.y+1)return!0}return!1}var mv=0,hv=new B,gv=new B,_v=!1;function vv(e){let t=Q.state,n=Q.rig;if((t.phase===q.Lifting||t.phase===q.Finished)&&!t.overshot){let r,i;if(Kg.endless||Q.recovery){let e=r_.loadCentre(t,Q.rig),n=Cd(t.trailerYaw);r=new B(e.x+n.x*26-Math.cos(t.trailerYaw)*8,t.ground+7+ov*.3,e.y+n.y*26-Math.sin(t.trailerYaw)*8),i=new B(e.x,e.up+2,e.y)}else{let e=e_.mark,a=Cd(e.yaw),o=Sd(e.yaw),s=16+n.loadEnd*(e.hanging?.75:.95)+(n.shape===`blade`?24:0),c=n.shape===`rocket`?n.loadEnd*.3+2:e.hanging?-n.loadEnd*.3:2.5,l=e.hanging?-1:-n.loadEnd*.4;i=new B(e.x+o.x*l,e.up+c,e.y+o.y*l),r=new B(i.x+a.x*s,i.y+(e.hanging?2:11)+ov*.4,i.z+a.y*s);let u=t.lastCall===J.Miss?Math.max(0,1-(t.time-t.lastCallTime)/.45):0,d=Math.max(u*.7,t.inStorm&&t.phase===q.Lifting?.1:0);r.x+=(Math.random()*2-1)*d,r.y+=(Math.random()*2-1)*d,r.z+=(Math.random()*2-1)*d}_v||=(hv.copy(r),gv.copy(i),!0),hv.lerp(r,Math.min(1,e*1.6)),gv.lerp(i,Math.min(1,e*1.6)),Qg.position.copy(hv),Qg.lookAt(gv),Qg.fov=56,Qg.updateProjectionMatrix(),Xg.position.set(t.hitch.x+$g.sunDir.x*160,t.ground+$g.sunDir.y*160,t.hitch.y+$g.sunDir.z*160),Xg.target.position.set(t.hitch.x,t.ground,t.hitch.y),$g.update(e,Qg,+!!t.inStorm);return}if(t.phase===q.Ready&&!bv){mv+=e;let r=Math.PI/2+.7*Math.sin(mv*.12),i=Sd(t.yaw),a=Cd(t.yaw),o=W(t.hitch,G(i,-(n.loadEnd*.5-3))),s=W(W(o,G(i,Math.cos(r)*(n.loadEnd*.7+16))),G(a,-Math.sin(r)*(n.loadEnd*.8+17)));Qg.position.set(s.x,t.ground+6+2*Math.sin(mv*.08),s.y),Qg.lookAt(o.x,t.ground+2.2,o.y),Qg.fov=46;let c=window.innerWidth,l=window.innerHeight;Qg.setViewOffset(Math.round(c*1.36),l,0,0,c,l),Qg.updateProjectionMatrix(),Xg.position.set(t.hitch.x+$g.sunDir.x*160,t.ground+$g.sunDir.y*160,t.hitch.y+$g.sunDir.z*160),Xg.target.position.set(t.hitch.x,t.ground,t.hitch.y),Xg.intensity=f_?.6:2.8,Zg.intensity=f_?.5:.9,e_.lampsOn(f_),e_.storm.visible=!1,$g.update(e,Qg,0);return}if(Wg.has(`nostorm`)||(e_.storm.visible=!0),Qg.view?.enabled&&Qg.clearViewOffset(),Q.recovery&&t.phase===q.Driving&&t.foundBreakdown&&!t.loaded){let r=ym[Q.broken];if(t.s>t.breakdownS+r.halfLength-2&&t.s<t.breakdownS+r.halfLength+n.loadEnd+60){let n=Q.breakdownYaw(),i=Sd(n),a=Cd(n),o=Q.breakdownPos(),s={x:o.x+i.x*r.halfLength,y:o.y+i.y*r.halfLength},c=Q.deckTail(),l={x:(s.x+c.x)*.5+i.x*4,y:(s.y+c.y)*.5+i.y*4},u=Rd(Kg,l),d=new B(l.x,u+1,l.y),f=new B(l.x+i.x*6-a.x*18,u+20,l.y+i.y*6-a.y*18);_v||=(hv.copy(f),gv.copy(d),!0),hv.lerp(f,Math.min(1,e*2)),gv.lerp(d,Math.min(1,e*2)),Qg.position.copy(hv),Qg.lookAt(gv),Qg.fov=60,Qg.updateProjectionMatrix(),Xg.position.set(t.hitch.x+$g.sunDir.x*160,t.ground+$g.sunDir.y*160,t.hitch.y+$g.sunDir.z*160),Xg.target.position.set(t.hitch.x,t.ground,t.hitch.y),$g.update(e,Qg,+!!t.inStorm);return}}_v=!1;let r=t.yaw;uv||=(lv=r,!0);let i=r-lv;for(;i>Math.PI;)i-=2*Math.PI;for(;i<-Math.PI;)i+=2*Math.PI;lv+=i*Math.min(1,e*3.5);let a=Sd(lv),o=9+n.loadEnd*.4,s=15+n.loadEnd,c=1;for(let e=1;e<=12&&c===1;e++){let n=e/12;pv(gd(t.hitch,G(a,s*n)),t.ground+o*n+1)&&(c=Math.max(.3,(e-1.5)/12))}dv+=(c-dv)*Math.min(1,e*(c<dv?8:1.5));let l=gd(t.hitch,G(a,s*dv)),u=W(t.hitch,G(a,6)),d=0,f=[J.Hit,J.BridgeStrike,J.Jackknife,J.Splash,J.Air].includes(t.lastCall);d=Math.max(f?1.1*Math.max(0,1-(t.time-t.lastCallTime)/.45):0,t.inStorm?.12:0);let p=()=>(Math.random()*2-1)*d,m=Math.max(Rd(Kg,l),t.ground-4);if(Qg.position.set(l.x+p(),m+o*(.55+.45*dv)+p(),l.y+p()),Qg.lookAt(u.x,t.ground+1+t.height,u.y),Wg.has(`close`)){let e=Cd(t.yaw),n=Sd(t.yaw);Qg.position.set(t.hitch.x+n.x*9+e.x*9,t.ground+2.2,t.hitch.y+n.y*9+e.y*9),Qg.lookAt(t.hitch.x+n.x*2.5,t.ground+1.2,t.hitch.y+n.y*2.5)}let h=88+12*Math.min(1,Math.abs(t.speed)/n.boostSpeed)**2;Qg.fov=2*Math.atan(Math.tan(h*Math.PI/360)/Qg.aspect)*180/Math.PI,Qg.updateProjectionMatrix(),Xg.position.set(t.hitch.x+$g.sunDir.x*160,t.ground+$g.sunDir.y*160,t.hitch.y+$g.sunDir.z*160),Xg.target.position.set(t.hitch.x,t.ground,t.hitch.y);let g=t.phase===q.Driving||t.phase===q.Finished?t.inStorm?1:Math.max(0,1-Q.stormLeadSeconds()/4):0,_=Math.max(g,f_);Yg.fog.color.setRGB(p_[0]*(1-g)+.22*g,p_[1]*(1-g)+.22*g,p_[2]*(1-g)+.28*g),Yg.fog.near=(f_?120:320)-(f_?60:240)*g,Yg.fog.far=(f_?900:2200)-(f_?500:1700)*g,g>.6&&(g_-=e,g_<=0&&(h_=1,g_=4+Math.random()*8)),h_=Math.max(0,h_-e*6),Xg.intensity=(f_?.6-.3*g:2.8-2.3*g)+h_*3,Zg.intensity=(f_?.5-.2*g:.9-.5*g)+h_*2.5,e_.lampsOn(_),$g.update(e,Qg,Math.max(0,g-h_*.8))}function yv(){let e=window.innerWidth,t=window.innerHeight;Jg.setSize(e,t,!1),__.setSize(e,t),v_.resolution.set(e,t),Qg.aspect=e/t,Qg.updateProjectionMatrix()}window.addEventListener(`resize`,yv),yv();var bv=Wg.has(`auto`);function xv(){return Fm(Q)}if(Wg.has(`nostorm`)&&(e_.storm.visible=!1,Q.noStorm=!0),Wg.has(`debug`)&&(window.hh={run:Q,drive:Fm,Phase:q}),Wg.has(`noground`)&&(e_.ground.visible=!1),Wg.has(`gy`)&&(e_.ground.position.y=Number(Wg.get(`gy`))),bv){Q.start();let e=Number(Wg.get(`t`)??0);for(let t=0;t<e;t+=1/120)Q.step(xv(),1/120);let t=Number(Wg.get(`s`)??-1);for(let e=0;t>0&&Q.state.s<t&&e<900;e+=1/120)Q.step(xv(),1/120);let n=Number(Wg.get(`lift`)??-1);for(let e=0;n>=0&&Q.state.phase!==q.Finished&&Q.state.liftClock<n&&e<900;e+=1/120)Q.step(xv(),1/120)}var Sv=1/120,Cv=performance.now(),wv=0;function Tv(e){let t=Math.min(.1,(e-Cv)/1e3);Cv=e;let n=bv?xv():M_();F_&&(n.steer=n.steer||N_.steer,n.throttle=Math.max(n.throttle,N_.throttle),n.brake=Math.max(n.brake,N_.brake),n.duck=n.duck||N_.duck,n.boost=n.boost||N_.boost,n.fix=n.fix||N_.fix);let r=Q.state;for(r.phase===q.Ready&&(n.throttle>0||w_)&&(Q.start(),x_(),y_.go(),A_&&y_.onSong?.(A_),Q.recovery&&setTimeout(()=>y_.say(`dispatch`,3),1800)),r.phase===q.Finished&&w_&&(ov>3||U_||T_?(Q.reset(),r_.resetRecovery(),uv=!1,U_=!1):U_=!0),r.phase!==q.Finished&&(U_=!1),w_=!1,T_=!1,wv+=t;wv>=Sv;)!Wg.has(`freeze`)&&!C_&&Q.step(n,Sv),wv-=Sv;if(cv(t),r_.update(Q.state,Q.rig),Q.recovery){let n=Q.breakdownPos();r_.updateRecovery(Q.state,Q.rig,{x:n.x,y:n.y,yaw:Q.breakdownYaw(),ground:Rd(Kg,n)},t,e/1e3)}e_.update(Q.obstacles,Q.state,t,e/1e3);{let e=Q.state;if([J.Hit,J.BridgeStrike,J.Jackknife,J.Train].includes(e.lastCall)&&e.lastCallTime!==m_){m_=e.lastCallTime;let t=W(e.hitch,G(Sd(e.yaw),3)),n;for(let r=0;r<Q.obstacles.length;r++)if(Math.abs(Q.obstacles[r].lastHitTime-e.time)<.05){t=Q.obstacles[r].pos;let e=Kg.obstacles[r].color;n=new V(e[0],e[1],e[2]);break}e.lastCall===J.BridgeStrike&&(t=W(e.hitch,G(Sd(e.trailerYaw),-6))),d_.knock(t.x,e.lastCall===J.BridgeStrike?4:1,t.y,e.lastCall===J.Hit?1:1.6,n)}let n=W(e.hitch,G(Sd(e.trailerYaw),-Q.rig.dollyDist)),r=W(e.hitch,G(Sd(e.yaw),4.2));d_.update(t,n.x,n.y,r.x,r.y,e.ground+e.height+3.2,e.offroad,e.speed,e.damage,e.ground)}{let e=Kg.crossings.find(e=>Math.abs(e.s-Q.state.s)<140);y_.update(Q,Q.state,t,n.throttle,!!e,e?jd(e,Q.state.time):!1)}vv(t),av(),__.render(),requestAnimationFrame(Tv)}requestAnimationFrame(Tv);