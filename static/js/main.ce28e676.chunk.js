(this["webpackJsonpreact-app"]=this["webpackJsonpreact-app"]||[]).push([[0],{29:function(t,e,n){},30:function(t,e,n){},50:function(t,e,n){"use strict";n.r(e);var r=n(5),i=n.n(r),o=n(22),a=n.n(o),s=(n(29),n(30),n(11)),c=n.n(s),l=n(1);c.a.defaults.xsrfCookieName="csrftoken",c.a.defaults.xsrfHeaderName="X-CSRFToken";var u,d=function(){var t=function(t){var e=null;if(document.cookie&&""!==document.cookie)for(var n=document.cookie.split(";"),r=0;r<n.length;r++){var i=n[r].replace(" ","");if(i.substring(0,t.length+1)===t+"="){e=decodeURIComponent(i.substring(t.length+1));break}}return e}("csrftoken");return Object(l.jsx)("input",{type:"hidden",name:"csrfmiddlewaretoken",value:null!==t&&void 0!==t?t:""})},f=n(7),h=n(8),v=n(23),g=n(6),b=n(12);function p(t){var e=t.tag,n=t.lines;console.log("## lines",n);var r=n.map((function(t){return t.trim()})).join("\n").replace(/\/\/\\n*/g,"\n\n").replace(/\/\\n*/g,"\n");return console.log("## processed",r),r.split(/\\n\\n+/).map((function(t){return{tag:e,body:t.trim()}}))}!function(t){t[t.withFlowOrder=0]="withFlowOrder",t[t.withBodyOrder=1]="withBodyOrder"}(u||(u={}));var y,j,m=function(){function t(e){var n;Object(f.a)(this,t),this.songParts=e,this.title=void 0,this.flow=void 0,this.linkUrl=void 0,this.bodys=[],this.tagBodyMap=new Map,this.bodysWithNoTag=[],this.comments=[];var r,i=Object(b.a)(e);try{for(i.s();!(r=i.n()).done;){var o=r.value;if(o.category===j.title&&(n=void 0,void 0===this.title?this.title=o.lines.join("\n"):this.logDiscard("title",o)),o.category===j.flow&&(n=void 0,void 0===this.flow?this.flow=o.lines.join(" "):this.logDiscard("flow",o," ")),o.category===j.linkUrl&&(n=void 0,void 0===this.linkUrl?this.linkUrl=o.lines.join("\n"):this.logDiscard("linkUrl",o)),o.category===j.tag&&(n=o.lines[0].toUpperCase()||void 0,console.error("set current tag",n),o.lines.length>1&&this.logDiscard("tag",o.lines.slice(1),", ")),o.category===j.body){console.error("current tag for body",n);var a=this.bodys[this.bodys.length-1];a&&n&&a.tag===n?a.lines=a.lines.concat(o.lines):this.bodys.push({tag:n,lines:o.lines})}o.category===j.comment&&this.comments.push(o.lines.join("\n"))}}catch(s){i.e(s)}finally{i.f()}this.bodysWithNoTag=this.bodys.filter((function(t){return void 0===t.tag})),console.log("bodysWith NoTag",this.bodysWithNoTag),this.tagBodyMap=new Map(this.bodys.flatMap((function(t){var e=t.tag,n=t.lines;return e?[{tag:e,lines:n}]:[]})).map((function(t){return[t.tag,t]})))}return Object(h.a)(t,[{key:"logDiscard",value:function(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"\n";e instanceof Array?console.error("".concat(t," part (").concat(e,") is discarded")):console.error("".concat(t," part (").concat(e.lines.join(n),") is discarded"))}},{key:"toSlideBodyOrder",value:function(){return this.bodys.flatMap((function(t){return p(t)}))}},{key:"toSlideFlowOrder",value:function(){var t=this;if(void 0===this.flow)return this.toSlideBodyOrder();var e=N(this.flow).map((function(t){return t.toUpperCase()})),n=[],r=e.map((function(e){if(e){var r=t.tagBodyMap.get(e);if(r)return n.push(e),r}return e})).flatMap((function(t){return"string"===typeof t?[{tag:t,body:""}]:p(t)})),i=this.bodys.filter((function(t){return t.tag&&!n.includes(t.tag)})).flatMap((function(t){return p(t)})),o=this.bodysWithNoTag.flatMap((function(t){return p(t)}));return r.concat(i).concat(o)}},{key:"toSlides",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:u.withBodyOrder;switch(t){case u.withFlowOrder:return this.toSlideFlowOrder();case u.withBodyOrder:default:return this.toSlideBodyOrder()}}},{key:"toString",value:function(){return"\n\t\t\t* title: ".concat(this.title,"\n\t\t\t* flow: ").concat(this.flow,"\n\t\t\t* linkUrl: ").concat(this.linkUrl,"\n\t\t\t* bodys: ").concat(this.bodys.map((function(t){var e=t.tag,n=t.lines;return"[".concat(e,"]\n").concat(n.join("\n"))})).join("\n\n"),"\n\t\t\t* tagBodyMap: ").concat(this.tagBodyMap,"\n\t\t\t* bodysWithNoTag: ").concat(this.bodysWithNoTag,"\n\t\t\t* comments: ").concat(this.comments,"\n\t\t")}}]),t}(),O=n(13);!function(t){t[t.empty=0]="empty",t[t.linkUrl=1]="linkUrl",t[t.tag=2]="tag",t[t.flow=3]="flow",t[t.title=4]="title",t[t.comment=5]="comment",t[t.body=6]="body",t[t.date=7]="date",t[t.separator=8]="separator",t[t.unknown=9]="unknown"}(j||(j={}));var w=[/^V\d?$/i,/^P?C\d?$/i,/^B\d?$/i,/^E(nding)?$/i,/^\[[A-Z]+\]$/i],x=[].concat(w,[/^x\d$/i,/^\uac04\uc8fc$/]),k=function(t){return x.some((function(e){return e.test(t)}))},N=function(t){return t.split(/[\W_]/).filter((function(t){return/\w/.test(t)}))},C=[/^[-=*][-=* ]+[-=*]$/],M=5,S=0,B=[j.title,j.flow,j.linkUrl],T=(y={},Object(g.a)(y,j.empty,(function(t){return""===t?M:S})),Object(g.a)(y,j.date,(function(t){})),Object(g.a)(y,j.title,(function(t){var e=0;return/^\d./.test(t)&&(e+=2),/\(\w\)$/.test(t)&&(e+=2),/\(\w->\w\)$/.test(t)&&(e+=1),e})),Object(g.a)(y,j.linkUrl,(function(t){return/^https?:\/\/.*$/.test(t)?M:S})),Object(g.a)(y,j.flow,(function(t){var e=N(t);if(1===e.length)return S;var n=e.filter(k);return Math.ceil(5*n.length/e.length)})),Object(g.a)(y,j.tag,(function(t){return e=t,w.some((function(t){return t.test(e)}))?M:/^[A-Z]{,2}\d?$/i.test(t)?3:void 0;var e})),Object(g.a)(y,j.body,(function(t){return/^[\w,"'.)(/ -]+$/i.test(t)?2:1})),Object(g.a)(y,j.comment,(function(t){return/[\uac00-\ud7a3]+/.test(t)?2:0})),Object(g.a)(y,j.separator,(function(t){return e=t,C.some((function(t){return t.test(e)}))?M:S;var e})),y),U=function t(e){var n;Object(f.a)(this,t),this.text=e,this.inferedCategory=void 0;var r=Object(O.a)(j).getValues();this.inferedCategory=null!==(n=r.reduce((function(t,n){var r;if((null===t||void 0===t?void 0:t.score)===M)return t;var i=T[n],o=null===i||void 0===i?void 0:i(e);return void 0!==o&&o>(null!==(r=null===t||void 0===t?void 0:t.score)&&void 0!==r?r:-1)?{value:n,score:o}:t}),void 0))&&void 0!==n?n:{value:j.unknown,score:5}},F=function(){function t(e){Object(f.a)(this,t),this.lines=void 0,this.songsCache=void 0,this.done=!1,this.lines=e.trim().split("\n").map((function(t){return t.trim()})).reduce((function(t,e){var n,r=null!==(n=t[t.length-1])&&void 0!==n?n:"";return""===e&&""===r.text||t.push(new U(e)),t}),[]),console.log(this.lines.map((function(t){return{text:t.text,category:Object(O.a)(j).getKeyOrDefault(t.inferedCategory.value)}})))}return Object(h.a)(t,[{key:"songs",value:function(){if(this.songsCache)return this.songsCache;for(var t=this.getSongParts(),e=[],n=0,r=0,i=0,o=Array.from(t.entries());i<o.length;i++){var a=Object(v.a)(o[i],2),s=a[0],c=a[1];if(!(s<=r))if(c.category===j.separator){var l=t.slice(n,s);P(l)&&(e.push(l),n=s)}else if(B.includes(c.category)){var u=t.slice(s).findIndex((function(t){return t.category===j.body}));if(-1===u)r=Number.MAX_SAFE_INTEGER;else{r=u;var d=t.slice(s,s+u).map((function(t){return t.category}));if(d.includes(j.title)||d.includes(j.flow)||d.includes(j.linkUrl)){var f=t.slice(n,s);P(f)&&(e.push(f),n=s)}}}}var h=t.slice(n);return P(h)&&e.push(h),this.songsCache=e.map((function(t){return new m(t)})),this.songsCache}},{key:"getSongParts",value:function(){var t=this,e=[];return this.lines.forEach((function(t,n){var r=e[e.length-1];void 0===r?e.push({start:n,category:t.inferedCategory.value}):r.category!==t.inferedCategory.value&&(r.end=n,e.push({start:n,category:t.inferedCategory.value}))})),e[e.length-1]&&(e[e.length-1].end=this.lines.length),e.flatMap((function(e){var n=e.start,r=e.end,i=e.category;return void 0===r?[]:[{start:n,end:r,category:i,lines:t.lines.slice(n,r).map((function(t){return t.text}))}]}))}}]),t}();function P(t){return t.filter((function(t){return t.category===j.body})).length>0}function $(t){var e=t.tag,n=t.body;return["[[".concat(null!==e&&void 0!==e?e:"","]]"),n||e].join("\n")}function D(t){return t.map($).join("\n---\n")}var W=function(){function t(e){Object(f.a)(this,t),this.lineParser=void 0,this.songParsers=void 0,this.lineParser=new F(e),this.songParsers=this.lineParser.songs()}return Object(h.a)(t,[{key:"toFormText",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:u.withFlowOrder;return this.songParsers.map((function(e){return D(e.toSlides(t))})).join("\n===\n")}}]),t}(),A=n(51),R=n(53),E=n(52);var _=function(){var t=Object(r.useRef)(null),e=Object(r.useRef)(null),n=Object(r.useRef)(null),i=Object(r.useRef)(null);return Object(l.jsxs)("div",{className:"wrapper",children:[Object(l.jsx)("nav",{className:"navbar navbar-expand-lg navbar-light bg-light",children:Object(l.jsxs)("div",{className:"container",children:[Object(l.jsx)("a",{className:"navbar-brand",href:"{% url 'lyrics' %}",children:"\uac00\uc0ac PPT \uc0dd\uc131\uae30"}),Object(l.jsx)("button",{className:"navbar-toggler",type:"button","data-toggle":"collapse","data-target":"#navbarSupportedContent","aria-controls":"navbarSupportedContent","aria-expanded":"false","aria-label":"Toggle navigation",children:Object(l.jsx)("span",{className:"navbar-toggler-icon"})}),Object(l.jsx)("div",{className:"collapse navbar-collapse",id:"navbarSupportedContent",children:Object(l.jsx)("ul",{className:"navbar-nav mr-auto",children:Object(l.jsx)("li",{className:"nav-item active",children:Object(l.jsx)("a",{className:"nav-link",href:"{% url 'lyrics' %}",children:"\uac00\uc0ac \uc0dd\uc131"})})})})]})}),Object(l.jsx)("div",{className:"container",children:Object(l.jsxs)("div",{className:"App",children:[Object(l.jsxs)("form",{id:"lyrics_form",name:"lyrics_form",ref:t,method:"post",action:"https://jjmean2.pythonanywhere.com/ppt_create/lyrics",children:[Object(l.jsx)(d,{}),Object(l.jsx)("input",{ref:n,type:"hidden",name:"body"}),Object(l.jsx)("input",{ref:i,type:"hidden",name:"filename"})]}),Object(l.jsxs)("div",{className:"page",children:[Object(l.jsx)("div",{className:"button-container",children:Object(l.jsx)("button",{className:"btn btn-primary",onClick:function(){var r;if(t.current&&e.current&&n.current&&i.current){var o=null===(r=e.current)||void 0===r?void 0:r.value;if(o){var a=new W(o).toFormText();n.current.value=a,i.current.value=function(){var t=new Date,e=(7-Object(A.a)(t))%7,n=Object(E.a)(t,e);return"\ud14c\ud790\ub77c \ucc2c\uc591 "+Object(R.a)(n,"yyyy-MM-dd")}(),console.log(a),t.current.submit()}}},children:"\uc81c\ucd9c"})}),Object(l.jsx)("textarea",{className:"form-control",ref:e,id:"lyrics"})]})]})})," "]})},I=function(t){t&&t instanceof Function&&n.e(3).then(n.bind(null,54)).then((function(e){var n=e.getCLS,r=e.getFID,i=e.getFCP,o=e.getLCP,a=e.getTTFB;n(t),r(t),i(t),o(t),a(t)}))};a.a.render(Object(l.jsx)(i.a.StrictMode,{children:Object(l.jsx)(_,{})}),document.getElementById("root")),I()}},[[50,1,2]]]);
//# sourceMappingURL=main.ce28e676.chunk.js.map