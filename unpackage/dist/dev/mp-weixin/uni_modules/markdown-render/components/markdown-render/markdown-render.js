(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["uni_modules/markdown-render/components/markdown-render/markdown-render"],{753:function(e,n,t){"use strict";t.r(n);var r=t(754),o=t(756);for(var a in o)["default"].indexOf(a)<0&&function(e){t.d(n,e,(function(){return o[e]}))}(a);t(762);var c,s=t(33),u=Object(s["default"])(o["default"],r["render"],r["staticRenderFns"],!1,null,null,null,!1,r["components"],c);u.options.__file="uni_modules/markdown-render/components/markdown-render/markdown-render.vue",n["default"]=u.exports},754:function(e,n,t){"use strict";t.r(n);var r=t(755);t.d(n,"render",(function(){return r["render"]})),t.d(n,"staticRenderFns",(function(){return r["staticRenderFns"]})),t.d(n,"recyclableRender",(function(){return r["recyclableRender"]})),t.d(n,"components",(function(){return r["components"]}))},755:function(e,n,t){"use strict";var r;t.r(n),t.d(n,"render",(function(){return o})),t.d(n,"staticRenderFns",(function(){return c})),t.d(n,"recyclableRender",(function(){return a})),t.d(n,"components",(function(){return r}));var o=function(){var e=this,n=e.$createElement;e._self._c},a=!1,c=[];o._withStripped=!0},756:function(e,n,t){"use strict";t.r(n);var r=t(757),o=t.n(r);for(var a in r)["default"].indexOf(a)<0&&function(e){t.d(n,e,(function(){return r[e]}))}(a);n["default"]=o.a},757:function(e,n,t){"use strict";(function(e){var r=t(4);Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var o=r(t(758)),a=r(t(759)),c=(r(t(760)),r(t(761))),s=[],u=(0,o.default)({html:!0,highlight:function(e,n){var t="";try{t=a.default.highlightAuto(e).value}catch(d){console.log("err",d),t=u.utils.escapeHtml(e)}var r=t.split(/\n/).slice(0,-1),o=r.map((function(e,n){return""==e?"":'<li><span data-line="'+(n+1)+'"></span>'+e+"</li>"})).join("");o='<ol style="padding: 0px 30px;">'+o+"</ol>",s.push(e);var c='<div style="background:#0d1117;margin-top: 5px;color: #888;padding:5px 0;border-radius: 5px;">';return c+='<pre class="hljs" style="padding:0 8px;margin-bottom:5px;overflow: auto;display: block;border-radius: 5px;"><code>'.concat(o,"</code></pre>"),c+="</div>",c}});u.use(c.default);var d={name:"markdown-render",props:{showCursor:{type:Boolean,default:function(){return!1}},sourceMdContent:{type:String,default:function(){return""}}},data:function(){return{}},computed:{nodes:function(){if(this.sourceMdContent){var e="";if(this.sourceMdContent.split("```").length%2){var n=this.sourceMdContent;"\n"!=n[n.length-1]&&(n+="\n"),n+=' <span class="cursor"></span>',e=u.render(n)}else e=u.render(this.sourceMdContent)+' \n <span class="cursor"></span>';return e=e.replace(/\<img/gi,'<img class="my-custom-img"'),e=e.replace(/\<a/gi,'<a class="my-custom-a"'),e=e.replace(/\<blockquote/gi,'<blockquote class="my-custom-blockquote"'),e=e.replace(/\<table/gi,'<table  class="my-custom-table"'),e=e.replace(/\<td/gi,'<td class="my-custom-table-td"'),e=e.replace(/(?!.*<thead>)(.*?)<th/g,(function(e){return e.replace("<th",'<th class="my-custom-table-th"')})),e}}},methods:{codeCopy:function(n){var t=n.detail.node,r=t.name,o=t.attrs,a=o["code-data-index"],c=o.class;o.href;"a"==r&&"copy-btn"==c&&e.setClipboardData({data:s[a],showToast:!1,success:function(){e.showToast({title:"复制成功",icon:"success"})}})}}};n.default=d}).call(this,t(2)["default"])},762:function(e,n,t){"use strict";t.r(n);var r=t(763),o=t.n(r);for(var a in r)["default"].indexOf(a)<0&&function(e){t.d(n,e,(function(){return r[e]}))}(a);n["default"]=o.a},763:function(e,n,t){}}]);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/markdown-render/components/markdown-render/markdown-render.js.map
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'uni_modules/markdown-render/components/markdown-render/markdown-render-create-component',
    {
        'uni_modules/markdown-render/components/markdown-render/markdown-render-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('2')['createComponent'](__webpack_require__(753))
        })
    },
    [['uni_modules/markdown-render/components/markdown-render/markdown-render-create-component']]
]);
