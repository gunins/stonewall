!function(e,t){"function"==typeof define&&define.amd?define("templating/utils",[],t):"object"==typeof exports?module.exports=t():(e.Templating=e.Templating||{},e.Templating.utils=t())}(this,function(){return{merge:function(e,t){Object.keys(t).forEach(function(n){e[n]=t[n]})}}}),function(e,t){"function"==typeof define&&define.amd?define("coders/component/CpDecoder",["templating/Decoder"],t):"object"==typeof exports?module.exports=t(require("./Decoder")):(e.Templating=e.Templating||{},e.Templating.componentDecoder=t(e.Templating.Decoder))}(this,function(e){var t={tagName:"cp",decode:function(e,t){var n=e.data;n.attribs={};var i={name:n.name,tmpEl:function(o,a){return i.data.instance=new n.src(n.dataset,t,a,e),n.instance.el},data:n||{}};return void 0!==n.dataset.bind&&(i.bind=n.dataset.bind),i}};return e&&e.addDecoder(t),t});;!function(e,n){"function"==typeof define&&define.amd?define("coders/placeholders/plDecoder",["templating/Decoder"],n):"object"==typeof exports?module.exports=n(require("./Decoder")):(e.Templating=e.Templating||{},e.Templating.componentDecoder=n(e.Templating.Decoder))}(this,function(e){var n={tagName:"pl",decode:function(e,n){var t=e.data;return{name:t.name,tmpEl:function(e){return e||document.createElement(t.tag)},parse:function(e){n&&Object.keys(n).forEach(function(t){n[t].run(e)})},data:t}}};return e&&e.addDecoder(n),n});;!function(e,t){"function"==typeof define&&define.amd?define("coders/databind/bdDecoder",["templating/Decoder"],t):"object"==typeof exports?module.exports=t(require("./Decoder")):(e.Templating=e.Templating||{},e.Templating.componentDecoder=t(e.Templating.Decoder))}(this,function(e){var t={tagName:"bd",noAttach:!0,decode:function(e){var t=this.data=e.data,n={name:t.name,tmpEl:function(){return document.createElement(t.tag)},data:t,bind:t.dataset.bind||t.name};return n}};return e&&e.addDecoder(t),t});;!function(e,t){"function"==typeof define&&define.amd?define("coders/router/RouterDecoder",["templating/Decoder"],t):"object"==typeof exports?module.exports=t(require("./Decoder")):(e.Templating=e.Templating||{},e.Templating.componentDecoder=t(e.Templating.Decoder))}(this,function(e){var t={tagName:"rt",noAttach:!0,decode:function(e,t){var n=e.data,o={name:n.name,tmpEl:function(e){return e||document.createElement(n.tag)},parse:function(e){t&&Object.keys(t).forEach(function(n){t[n].run(e)})},data:n||{},route:n.route};return o}};return e&&e.addDecoder(t),t});;!function(e,t){"function"==typeof define&&define.amd?define("coders/style/styleDecoder",["templating/Decoder"],t):"object"==typeof exports?module.exports=t(require("./Decoder")):(e.Templating=e.Templating||{},e.Templating.componentDecoder=t(e.Templating.Decoder))}(this,function(e){var t={tagName:"style",decode:function(e){if(void 0===e.data.styleAttached){e.data.styleAttached=!0;var t=document.createElement("style");t.innerHTML=e.data.style,document.head.appendChild(t)}}};return e&&e.addDecoder(t),t});;!function(e,t){"function"==typeof define&&define.amd?define("templating/Decoder",["templating/utils"],t):"object"==typeof exports?module.exports=t(require("./utils")):(e.Templating=e.Templating||{},e.Templating.Decoder=t(e.Templating.utils))}(this,function(e){function t(e,t){var n;n="li"===t?"ul":"td"===t||"th"===t?"tr":"tr"===t?"tbody":"div";var r=document.createElement(n),a=document.createDocumentFragment();return r.innerHTML=e,a.appendChild(r.firstChild),a.firstChild}function n(e,n,r,a){var i=this._node,d=i.tmpEl(n?e:!1,a),o=i.data.attribs,l=t(i.template,i.data.tag);if(n||Object.keys(o).forEach(function(e){d.setAttribute(e,o[e])}),void 0!==l)for(;l.childNodes.length>0;)d.appendChild(l.childNodes[0]);if(r)i.setParent(r),null!==i.parent&&i.parent.appendChild(d);else{var c=e.parentNode;i.setParent(c),(null!==i.parent||void 0!==i.parent)&&i.parent.replaceChild(d,e)}return this._node.el=d,void 0!==i.parse&&i.parse(d),d}function r(t,r,a){var i=t.tagName,d=this,l={id:t.id,template:t.template,noAttach:o[i].noAttach||t.data.tplSet.noattach,applyAttach:function(){delete this._node.noAttach},setParent:function(e){this._node.parent=e}.bind(d),getParent:function(){return this._node.parent}.bind(d),run:function(e,t,r,i){if(void 0===this._node.noAttach){var o=e.querySelector("#"+this._node.id)||e;if(o)return n.call(d,o,t,r,i||a)}}};r&&(l.children=r),d._node=d._node||{},e.merge(d._node,l),d.data=d._node.data,d.run=function(){return this._node.run.apply(this,arguments)}.bind(this),d.applyAttach=function(){return this._node.applyAttach.apply(this,arguments)}.bind(this)}function a(e,t){t||(t={});var n=!1,i=!1;return e.children.forEach(function(e){var d=e.data.name;if(e.children&&e.children.length>0){var l=t[d]?t[d]:t;i=a.call(this,e,l)}var c=e.tagName;if(c){var d=d;void 0!==d&&(n=n||{},n[d]={},e.getInstance=function(){return n[d]});var u=o[c].decode(e,i);u&&(n[d]._node=u,r.call(n[d],e,i,t[d]||t))}else d&&(n=n||{},n[d]={},n[d]._node={id:e.id,data:e.data});i=!1}.bind(this)),n}function i(e,t){e&&Object.keys(e).forEach(function(n){void 0!==e[n]._node.run&&e[n]._node.run.call(e[n],t),void 0===e[n]._node.el&&void 0===e[n]._node.template&&(e[n]._node.el=t.querySelector("#"+e[n]._node.id),e[n]._node.el.removeAttribute("id"))})}function d(e){this._root="string"==typeof e?JSON.parse(e):e}var o={};return e.merge(d,{addDecoder:function(e){void 0===o[e.tagName]&&(o[e.tagName]=e)}}),e.merge(d.prototype,{addDecoder:d.addDecoder,_renderFragment:function(e,n){var r={},d=t(e.template);return e.children&&e.children.length>0&&(r=a.call(this,e,n||{})),i(r,d),{fragment:d,children:r,templateId:e.templateId}},render:function(e){var t=this._renderFragment(this._root,e);return t}}),d});;/*!
 * Mediator.js Library v0.9.8
 * https://github.com/ajacksified/Mediator.js
 *
 * Copyright 2013, Jack Lawson
 * MIT Licensed (http://www.opensource.org/licenses/mit-license.php)
 *
 * For more information: http://thejacklawson.com/2011/06/mediators-for-modularized-asynchronous-programming-in-javascript/index.html
 * Project on GitHub: https://github.com/ajacksified/Mediator.js
 *
 * Last update: October 19 2013
 */

!function(t,n){"function"==typeof define&&define.amd?define("widget/mediator",[],function(){return t.Mediator=n(),t.Mediator}):"undefined"!=typeof exports?exports.Mediator=n():t.Mediator=n()}(this,function(){function t(){var t=function(){return(65536*(1+Math.random())|0).toString(16).substring(1)};return t()+t()+"-"+t()+"-"+t()+"-"+t()+"-"+t()+t()+t()}function n(e,i,r){return this instanceof n?(this.id=t(),this.fn=e,this.options=i,this.context=r,void(this.channel=null)):new n(e,i,r)}function e(t,n){return this instanceof e?(this.namespace=t||"",this._subscribers=[],this._channels={},this._parent=n,void(this.stopped=!1)):new e(t)}function i(){return this instanceof i?void(this._channels=new e("")):new i}return n.prototype={update:function(t){t&&(this.fn=t.fn||this.fn,this.context=t.context||this.context,this.options=t.options||this.options,this.channel&&this.options&&void 0!==this.options.priority&&this.channel.setPriority(this.id,this.options.priority))}},e.prototype={addSubscriber:function(t,e,i){var r=new n(t,e,i);return e&&void 0!==e.priority?(e.priority=e.priority>>0,e.priority<0&&(e.priority=0),e.priority>=this._subscribers.length&&(e.priority=this._subscribers.length-1),this._subscribers.splice(e.priority,0,r)):this._subscribers.push(r),r.channel=this,r},stopPropagation:function(){this.stopped=!0},getSubscriber:function(t){var n=0,e=this._subscribers.length;for(e;e>n;n++)if(this._subscribers[n].id===t||this._subscribers[n].fn===t)return this._subscribers[n]},setPriority:function(t,n){var e,i,r,s,o=0,a=0;for(a=0,s=this._subscribers.length;s>a&&(this._subscribers[a].id!==t&&this._subscribers[a].fn!==t);a++)o++;e=this._subscribers[o],i=this._subscribers.slice(0,o),r=this._subscribers.slice(o+1),this._subscribers=i.concat(r),this._subscribers.splice(n,0,e)},addChannel:function(t){this._channels[t]=new e((this.namespace?this.namespace+":":"")+t,this)},hasChannel:function(t){return this._channels.hasOwnProperty(t)},returnChannel:function(t){return this._channels[t]},removeSubscriber:function(t){var n=this._subscribers.length-1;if(!t)return void(this._subscribers=[]);for(n;n>=0;n--)(this._subscribers[n].fn===t||this._subscribers[n].id===t)&&(this._subscribers[n].channel=null,this._subscribers.splice(n,1))},publish:function(t){var n,e,i,r=0,s=this._subscribers.length,o=!1;for(s;s>r;r++)o=!1,n=this._subscribers[r],this.stopped||(e=this._subscribers.length,void 0!==n.options&&"function"==typeof n.options.predicate?n.options.predicate.apply(n.context,t)&&(o=!0):o=!0),o&&(n.options&&void 0!==n.options.calls&&(n.options.calls--,n.options.calls<1&&this.removeSubscriber(n.id)),n.fn.apply(n.context,t),i=this._subscribers.length,s=i,i===e-1&&r--);this._parent&&this._parent.publish(t),this.stopped=!1}},i.prototype={getChannel:function(t,n){var e=this._channels,i=t.split(":"),r=0,s=i.length;if(""===t)return e;if(i.length>0)for(s;s>r;r++){if(!e.hasChannel(i[r])){if(n)break;e.addChannel(i[r])}e=e.returnChannel(i[r])}return e},subscribe:function(t,n,e,i){var r=this.getChannel(t||"",!1);return e=e||{},i=i||{},r.addSubscriber(n,e,i)},once:function(t,n,e,i){return e=e||{},e.calls=1,this.subscribe(t,n,e,i)},getSubscriber:function(t,n){var e=this.getChannel(n||"",!0);return e.namespace!==n?null:e.getSubscriber(t)},remove:function(t,n){var e=this.getChannel(t||"",!0);return e.namespace!==t?!1:void e.removeSubscriber(n)},publish:function(t){var n=this.getChannel(t||"",!0);if(n.namespace!==t)return null;var e=Array.prototype.slice.call(arguments,1);e.push(n),n.publish(e)}},i.prototype.on=i.prototype.subscribe,i.prototype.bind=i.prototype.subscribe,i.prototype.emit=i.prototype.publish,i.prototype.trigger=i.prototype.publish,i.prototype.off=i.prototype.remove,i.Channel=e,i.Subscriber=n,i.version="0.9.8",i}),!function(t,n){"function"==typeof define&&define.amd?define("router/MatchBinding",n):"object"==typeof exports?module.exports=n():(t.UrlManager=t.UrlManager||{},t.UrlManager.MatchBinding=n())}(this,function(){function t(n,e){""===e?this.pattern=e=n.replace(/^\(\/\)/g,"").replace(/^\/|$/g,""):(this.pattern=n,e+=n),this.location=e.replace(/\((.*?)\)/g,"$1").replace(/^\/|$/g,"");var i=this.pattern.replace(t.ESCAPE_PARAM,"\\$&").replace(t.OPTIONAL_PARAM,"(?:$1)?").replace(t.NAMED_PARAM,function(t,n){return n?t:"([^/]+)"}).replace(t.SPLAT_PARAM,"(.*?)");this.patternRegExp=new RegExp("^"+i),this.routeHandler=[],this.leaveHandler=[],this.queryHandler=[],this.routes=[]}return t.prototype.onBind=function(){},t.prototype.setOnBind=function(t){this.onBind=t},t.prototype.rebind=function(){void 0!==this.onBind&&this.onBind()},t.prototype.setRoutes=function(t){return this.routes.push(t),this},t.prototype.getRoutes=function(){return this.routes},t.prototype.to=function(t){return this.routeHandler.push(t),this},t.prototype.leave=function(t){return this.leaveHandler.push(t),this},t.prototype.query=function(t){return this.queryHandler.push(t),this},t.prototype.test=function(t){return this.patternRegExp.test(t)},t.prototype.getFragment=function(t){var n=this.applyParams(t);return t.replace(n,"")},t.prototype.applyParams=function(t){var n=this.pattern.replace(/\((.*?)\)/g,"$1").split("/"),e=t.split("/");return e.splice(0,n.length).join("/")},t.prototype.extractParams=function(t){var n=this.patternRegExp.exec(t).slice(1);return n.map(function(t){return t?decodeURIComponent(t):null})},t.prototype.setSubBinder=function(t){return this.subBinder=t,t},t.prototype.getSubBinder=function(){return this.subBinder},t.prototype.getHandler=function(){return this.routeHandler},t.prototype.getLeaveHandler=function(){return this.leaveHandler},t.prototype.getQueryHandler=function(){return this.queryHandler},t.OPTIONAL_PARAM=/\((.*?)\)/g,t.NAMED_PARAM=/(\(\?)?:\w+/g,t.SPLAT_PARAM=/\*\w+/g,t.ESCAPE_PARAM=/[\-{}\[\]+?.,\\\^$|#\s]/g,t}),function(t,n){"function"==typeof define&&define.amd?define("router/MatchBinder",["./MatchBinding"],n):"object"==typeof exports?module.exports=n(require("./MatchBinding")):(t.UrlManager=t.UrlManager||{},t.UrlManager.MatchBinder=n(t.UrlManager.MatchBinding))}(this,function(t){function n(t,n,e,i){this.bindings=[],this.location=i||t||"",this.command=e,this.params=n}return n.prototype.match=function(t,n){var e=this.getMatchBinding(t,this.location);this.bindings.push(e);var i=this.getSubBinder(this.location+t);return e.setSubBinder(i),n&&n(i.match.bind(i)),e},n.prototype.getSubBinder=function(t){return new n(t)},n.prototype.getMatchBinding=function(n,e){return new t(n,e)},n.prototype.filter=function(t){return this.bindings.filter(function(n){return n.test(t)})},n.prototype.run=function(){this.command(this)},n}),function(t,n){"function"==typeof define&&define.amd?define("router/Router",["./MatchBinder"],n):"object"==typeof exports?module.exports=n(require("./MatchBinder")):(t.UrlManager=t.UrlManager||{},t.UrlManager.Router=n(t.UrlManager.MatchBinder))}(this,function(t){function n(t){try{return decodeURIComponent(t.replace(/\+/g," "))}catch(n){return t}}function e(t,n){var e=t.split("&");e.forEach(function(t){var e=t.split("=");n(e.shift(),e.join("="))})}function i(t,n,e,i){var r,s=e.root.substring(0,e.root.length-i.length);return t=t||"",r=n===!0?this.serialize(e.query):n===!1?"":this.serialize(n),s+t+(0===r.length?"":"?"+r)}function r(){this.root=this.getBinder(),this.bindings=[]}return Array.prototype.equals=function(t){if(!t)return!1;if(this.length!=t.length)return!1;for(var n=0,e=this.length;e>n;n++)if(this[n]instanceof Array&&t[n]instanceof Array){if(!this[n].equals(t[n]))return!1}else if(this[n]!=t[n])return!1;return!0},r.prototype.getBinder=function(){return new t},r.prototype.match=function(t){t(this.root.match.bind(this.root))},r.prototype.trigger=function(t){if(this.started){var i=t.split("?",2),r={};i[1]&&e(i[1],function(t,e){e=n(e),r[t]?"string"==typeof r[t]?r[t]=[r[t],e]:r[t].push(e):r[t]=e});var s=i[0].replace(/^\/|$/g,""),o={root:s,query:r},a=[],u=!1;this.bindings.forEach(function(n){var e,i=n.pattern.replace(/\((.*?)\)/g,"$1").replace(/^\//,"").split("/"),r=n.location.split("/"),p=n.prevLoc.replace(/^\//,"").split("/"),h=function(t){var n=t.splice(r.length-i.length,i.length),e=p.splice(0,i.length);return!n.equals(e)};if(e=h(u||s.split("/"))){u=s.split("/").splice(0,r.length-i.length);var c=n.getLeaveHandler(),l=[];n.setOnBind(),this.applyHandler(c,l,o,t),a.push(n)}}.bind(this)),a.forEach(function(t){this.bindings.splice(this.bindings.indexOf(t),1)}.bind(this)),this.find(this.root,s,o)}},r.prototype.find=function(t,n,e){var i=t.filter(n);i.forEach(this.onBinding.bind(this,n,e))},r.prototype.execute=function(t){var n=t.location.split("/"),e=t.params.root.split("/"),i="/"+e.splice(n.length,e.length-n.length).join("/");this.find(t,i,t.params)},r.prototype.onBinding=function(n,e,i){i.setOnBind(this.onBinding.bind(this,n,e,i)),this.runHandler(n,e,i);var r=i.getFragment(n),s=i.getSubBinder();s&&s.bindings&&s.bindings.length>0&&this.find(s,r,e);var o=i.getRoutes();if(o&&o.length>0)for(;o.length>0;){var a=o[0],u=new t(i.getFragment(n),e,this.execute.bind(this),i.location);a(u),s.bindings=s.bindings.concat(u.bindings),o.shift()}},r.prototype.serialize=function(t){var n=[];for(var e in t)t.hasOwnProperty(e)&&n.push(encodeURIComponent(e)+"="+encodeURIComponent(t[e]));return n.join("&")},r.prototype.runHandler=function(t,n,e){if(-1===this.bindings.indexOf(e)){var i=e.getHandler(),r=e.extractParams(t);e.prevLoc=t,this.applyHandler(i,r,n,t),this.bindings.push(e)}var i=e.getQueryHandler();if(i){var r=[];this.applyHandler(i,r,n,t)}},r.prototype.applyHandler=function(t,n,e,r){t&&t.length>0&&t.forEach(function(t){t.apply(this,n.concat({getQuery:function(){return e.query},getLocation:function(t,n){return i.call(this,t,n,e,r)}.bind(this)}))}.bind(this))},r.prototype.start=function(){this.started=!0},r.prototype.stop=function(){this.started=!1},r}),define("widget/utils",[],function(){function t(t){var n=typeof t;if(!("function"===n||"object"===n&&t))return t;for(var e,i,r=1,s=arguments.length;s>r;r++){e=arguments[r];for(i in e)t[i]=e[i]}return t}function n(n,e){var i,r=this;i=n&&null!=n&&hasOwnProperty.call(n,"constructor")?n.constructor:function(){return r.apply(this,arguments)},t(i,r,e);var s=function(){this.constructor=i};return s.prototype=r.prototype,i.prototype=new s,n&&t(i.prototype,n),i.__super__=r.prototype,i}function e(t){return"[object String]"===toString.call(t)}function i(t){var n=typeof t;return"function"===n||"object"===n&&!!t}function r(t){return"[object Array]"===toString.call(t)}return{fnExtend:n,extend:t,isString:e,isObject:i,isArray:r}}),define("widget/App",["./mediator","router/Router","./utils"],function(t,n,e){function i(t){function n(){var n=window.location.href.match(/#(.*)$/);t.trigger(n?n[1]:"")}t.start(),window.addEventListener("hashchange",n,!1),n()}function r(){var r=new n;this.context=e.extend(this.setContext(),{eventBus:new t}),this.beforeInit.apply(this,arguments),void 0!==this.AppContainer&&(this.appContainer=new this.AppContainer({appContext:this.context}),void 0!==this.appContainer._match&&r.match(this.appContainer._match.bind(this.appContainer)),this.setContext(),this.el=this.appContainer.el,setTimeout(function(){this.el.classList.add("show")}.bind(this),100),i(r)),this.init.apply(this,arguments)}return r.extend=e.fnExtend,e.extend(r.prototype,{beforeInit:function(){},init:function(){},setContext:function(){return{}},start:function(t){t instanceof HTMLElement==!0&&t.appendChild(this.el)}}),r});;define("widget/dom",["./utils"],function(e){function t(e){var t=document.createElement(e||"div");return t.setAttribute("style","display:none;"),t}function n(e){var t=e._node;this._events=[],this._node=t,!this.el&&t.el&&(this.el=t.el),this.name||(this.name=t.name),this._node.bind&&!this.bind&&(this.bind=t.bind),!this.dataset&&t.data&&t.data.dataset&&(this.dataset=t.data.dataset),this._node.children&&!this.children&&(this.children=t.children),this.run=t.run,this.applyAttach=t.applyAttach,this.getParent=t.getParent,this.setParent=t.setParent}var i={_after:function(n,i,a){i.placeholder=void 0!==i._node?n.el.querySelector("#"+i._node.id)||t(i._node.data.tag||i.el.tagName):t(i.el.tagName),void 0!==i.run&&(i.el=i.run.call(i,n.el,!0,!1,a)),i._node&&i._node.data&&i._node.data.instance&&e.extend(i,i._node.data.instance)},replace:function(e){e.el.innerHTML="",i._after.apply(this,arguments)},append:function(e,t){void 0!==e.el&&void 0!==t.el&&e.el.appendChild(t.el)},prepend:function(e,t){i.insertBefore(e,t,0)},insertBefore:function(e,t,n){var i=e.el,a=t.el;void 0!==i&&void 0!==a&&(void 0!==i.childNodes[n]?i.insertBefore(a,i.childNodes[n]):i.appendChild(a))},detach:function(e){e.placeholder instanceof HTMLElement==!1&&(e.placeholder=t(e._node.data.tag||e.el.tagName)),e&&e.el&&e.el.parentNode&&e.el.parentNode.replaceChild(e.placeholder,e.el)},attach:function(e){e&&e.el&&e.placeholder&&e.placeholder.parentNode&&e.placeholder.parentNode.replaceChild(e.el,e.placeholder)},add:function(e,n,i,a){e.placeholder=n.querySelector("#"+e._node.id)||t(e._node.data.tag||e.el.tagName),e.el=e.run.call(e,n,!1,i,a)},text:function(e,t){e&&e.el&&(e.el.innerHTML=t)},setAttribute:function(t,n,i){t&&t.el&&(e.isObject(n)?Object.keys(n).forEach(function(e){t.el.setAttribute(e,n[e])}.bind(this)):t.el.setAttribute(n,i))},getAttribute:function(e,t){return e&&e.el?e.el.getAttribute(t):void 0},removeAttribute:function(e,t){e&&e.el&&e.el.removeAttribute(t)},setStyle:function(t,n,i){t&&t.el&&(e.isObject(n)?Object.keys(n).forEach(function(e){t.el.style[e]=n[e]}.bind(this)):t.el.style[n]=i)},getStyle:function(e,t){return e&&e.el&&void 0!==e.el&&void 0!==e.el.style?e.el.style[t]:void 0},removeStyle:function(e,t){e&&e.el&&(e.el.style[t]="")},addClass:function(e,t){e&&e.el&&e.el.classList.add(t)},hasClass:function(e,t){return e&&e.el?e.el.classList.contains(t):!1},removeClass:function(e,t){e&&e.el&&e.el.classList.remove(t)},val:function(e,t){if(e&&e.el){var n=e.el;if(void 0===t)return n.value;n.value=t}},on:function(e,t,n,i){var a=Array.prototype.slice.call(arguments,4,arguments.length),r=e.el,o=t.split(" "),s=function(t){n.apply(i||this,[t,e].concat(a))};o.forEach(function(e){r.addEventListener(e,s)});var d={remove:function(){o.forEach(function(e){r.removeEventListener(e,s)})}};return e._events.push(d),d},remove:function(e){for(;e._events.length>0;)e._events.remove(),e._events.shift();void 0!==e.el&&e.el.remove()},onDOMAttached:function(e){var t=[];if(void 0!==e.el)var n,i=!1,a=function(){if(i)for(;t.length>0;)n=t[0],n(),t.shift();else window.requestAnimationFrame(a),document.body.contains(e.el)&&(i=!0)}.bind(this);return{then:function(e,n){t.push(e.bind(n||this)),window.requestAnimationFrame(a)}.bind(this)}},Element:n};return e.extend(n.prototype,{clone:function(){var t=e.extend({},this);return t._events=[],t},_after:function(e){i._after(this,e)},replace:function(e,t){i.replace(this,e,t)},prepend:function(e){i.prepend(this,e)},insertBefore:function(e,t){i.insertBefore(this,e,t)},append:function(e){i.append(this,e)},text:function(e){i.text(this,e)},add:function(e,t,n){i.add(this,e,t,n)},detach:function(){i.detach(this)},attach:function(){i.attach(this)},setAttribute:function(e,t){i.setAttribute(this,e,t)},getAttribute:function(e){return i.getAttribute(this,e)},removeAttribute:function(e){i.removeAttribute(this,e)},setStyle:function(e,t){i.setStyle(this,e,t)},getStyle:function(e){return i.getStyle(this,e)},removeStyle:function(e){i.removeStyle(this,e)},addClass:function(e){i.addClass(this,e)},hasClass:function(e){return i.hasClass(this,e)},removeClass:function(e){i.removeClass(this,e)},val:function(e){return i.val(this,e)},on:function(){var e=Array.prototype.slice.call(arguments,0);return i.on.apply(!1,[this].concat(e))},onDOMAttached:function(){return i.onDOMAttached(this)},remove:function(){i.remove(this)}}),n.extend=e.fnExtend,i}),function(e,t){"function"==typeof define&&define.amd?define("templating/utils",[],t):"object"==typeof exports?module.exports=t():(e.Templating=e.Templating||{},e.Templating.utils=t())}(this,function(){return{merge:function(e,t){Object.keys(t).forEach(function(n){e[n]=t[n]})}}}),function(e,t){"function"==typeof define&&define.amd?define("templating/Decoder",["templating/utils"],t):"object"==typeof exports?module.exports=t(require("./utils")):(e.Templating=e.Templating||{},e.Templating.Decoder=t(e.Templating.utils))}(this,function(e){function t(e,t){var n;n="li"===t?"ul":"td"===t||"th"===t?"tr":"tr"===t?"tbody":"div";var i=document.createElement(n),a=document.createDocumentFragment();return i.innerHTML=e,a.appendChild(i.firstChild),a.firstChild}function n(e,n,i,a){var r=this._node,o=r.tmpEl(n?e:!1,a),s=r.data.attribs,d=t(r.template,r.data.tag);if(n||Object.keys(s).forEach(function(e){o.setAttribute(e,s[e])}),void 0!==d)for(;d.childNodes.length>0;)o.appendChild(d.childNodes[0]);if(i)r.setParent(i),null!==r.parent&&r.parent.appendChild(o);else{var c=e.parentNode;r.setParent(c),(null!==r.parent||void 0!==r.parent)&&r.parent.replaceChild(o,e)}return this._node.el=o,void 0!==r.parse&&r.parse(o),o}function i(t,i,a){var r=t.tagName,o=this,d={id:t.id,template:t.template,noAttach:s[r].noAttach||t.data.tplSet.noattach,applyAttach:function(){delete this._node.noAttach},setParent:function(e){this._node.parent=e}.bind(o),getParent:function(){return this._node.parent}.bind(o),run:function(e,t,i,r){if(void 0===this._node.noAttach){var s=e.querySelector("#"+this._node.id)||e;if(s)return n.call(o,s,t,i,r||a)}}};i&&(d.children=i),o._node=o._node||{},e.merge(o._node,d),o.data=o._node.data,o.run=function(){return this._node.run.apply(this,arguments)}.bind(this),o.applyAttach=function(){return this._node.applyAttach.apply(this,arguments)}.bind(this)}function a(e,t){t||(t={});var n=!1,r=!1;return e.children.forEach(function(e){var o=e.data.name;if(e.children&&e.children.length>0){var d=t[o]?t[o]:t;r=a.call(this,e,d)}var c=e.tagName;if(c){var o=o;void 0!==o&&(n=n||{},n[o]={},e.getInstance=function(){return n[o]});var l=s[c].decode(e,r);l&&(n[o]._node=l,i.call(n[o],e,r,t[o]||t))}else o&&(n=n||{},n[o]={},n[o]._node={id:e.id,data:e.data});r=!1}.bind(this)),n}function r(e,t){e&&Object.keys(e).forEach(function(n){void 0!==e[n]._node.run&&e[n]._node.run.call(e[n],t),void 0===e[n]._node.el&&void 0===e[n]._node.template&&(e[n]._node.el=t.querySelector("#"+e[n]._node.id),e[n]._node.el.removeAttribute("id"))})}function o(e){this._root="string"==typeof e?JSON.parse(e):e}var s={};return e.merge(o,{addDecoder:function(e){void 0===s[e.tagName]&&(s[e.tagName]=e)}}),e.merge(o.prototype,{addDecoder:o.addDecoder,_renderFragment:function(e,n){var i={},o=t(e.template);return e.children&&e.children.length>0&&(i=a.call(this,e,n||{})),r(i,o),{fragment:o,children:i,templateId:e.templateId}},render:function(e){var t=this._renderFragment(this._root,e);return t}}),o}),function(e){"object"==typeof exports?module.exports=e():"function"==typeof define&&define.amd?define("watch",e):(window.WatchJS=e(),window.watch=window.WatchJS.watch,window.unwatch=window.WatchJS.unwatch,window.callWatchers=window.WatchJS.callWatchers)}(function(){var e={noMore:!1},t=[],n=function(e){var t={};return e&&"[object Function]"==t.toString.call(e)},i=function(e){return"[object Array]"===Object.prototype.toString.call(e)},a=function(e,t){var n=[],a=[];if("string"!=typeof e&&"string"!=typeof t){if(i(e))for(var r=0;r<e.length;r++)void 0===t[r]&&n.push(r);else for(var r in e)e.hasOwnProperty(r)&&void 0===t[r]&&n.push(r);if(i(t))for(var o=0;o<t.length;o++)void 0===e[o]&&a.push(o);else for(var o in t)t.hasOwnProperty(o)&&void 0===e[o]&&a.push(o)}return{added:n,removed:a}},r=function(e){if(null==e||"object"!=typeof e)return e;var t=e.constructor();for(var n in e)t[n]=e[n];return t},o=function(e,t,n,i){try{Object.observe(e,function(e){e.forEach(function(e){e.name===t&&i(e.object[e.name])})})}catch(a){try{Object.defineProperty(e,t,{get:n,set:i,enumerable:!0,configurable:!0})}catch(r){try{Object.prototype.__defineGetter__.call(e,t,n),Object.prototype.__defineSetter__.call(e,t,i)}catch(o){throw new Error("watchJS error: browser not supported :/")}}}},s=function(e,t,n){try{Object.defineProperty(e,t,{enumerable:!1,configurable:!0,writable:!1,value:n})}catch(i){e[t]=n}},d=function(){n(arguments[1])?c.apply(this,arguments):i(arguments[1])?l.apply(this,arguments):h.apply(this,arguments)},c=function(e,t,n,a){if("string"!=typeof e&&(e instanceof Object||i(e))){var r=[];if(i(e))for(var o=0;o<e.length;o++)r.push(o);else for(var s in e)"$val"!=s&&Object.prototype.hasOwnProperty.call(e,s)&&r.push(s);l(e,r,t,n,a),a&&j(e,"$$watchlengthsubjectroot",t,n)}},l=function(e,t,n,a,r){if("string"!=typeof e&&(e instanceof Object||i(e)))for(var o=0;o<t.length;o++){var s=t[o];h(e,s,n,a,r)}},h=function(e,t,a,r,o){"string"!=typeof e&&(e instanceof Object||i(e))&&(n(e[t])||(null!=e[t]&&(void 0===r||r>0)&&c(e[t],a,void 0!==r?r-1:r),v(e,t,a,r),o&&(void 0===r||r>0)&&j(e,t,a,r)))},u=function(){n(arguments[1])?f.apply(this,arguments):i(arguments[1])?p.apply(this,arguments):_.apply(this,arguments)},f=function(e,t){if(!(e instanceof String)&&(e instanceof Object||i(e)))if(i(e)){for(var n=[],a=0;a<e.length;a++)n.push(a);p(e,n,t)}else{var r=function(e){var n=[];for(var i in e)e.hasOwnProperty(i)&&(e[i]instanceof Object?r(e[i]):n.push(i));p(e,n,t)};r(e)}},p=function(e,t,n){for(var i in t)t.hasOwnProperty(i)&&_(e,t[i],n)},v=function(t,n,i,a){var r=t[n];g(t,n),t.watchers||s(t,"watchers",{});var d=!1;t.watchers[n]||(t.watchers[n]=[],d=!0);for(var l=0;l<t.watchers[n].length;l++)if(t.watchers[n][l]===i)return;if(t.watchers[n].push(i),d){var h=function(){return r},u=function(o){var s=r;r=o,0!==a&&t[n]&&c(t[n],i,void 0===a?a:a-1),g(t,n),e.noMore||s!==o&&(m(t,n,"set",o,s),e.noMore=!1)};o(t,n,h,u)}},m=function(e,t,n,i,a){if(void 0!==t)for(var r=0;r<e.watchers[t].length;r++)e.watchers[t][r].call(e,t,n,i,a);else for(var t in e)e.hasOwnProperty(t)&&m(e,t,n,i,a)},b=["pop","push","reverse","shift","sort","slice","unshift","splice"],y=function(e,t,n,i){s(e[t],i,function(){var a=n.apply(e[t],arguments);return h(e,e[t]),"slice"!==i&&m(e,t,i,arguments),a})},g=function(e,t){if(e[t]&&!(e[t]instanceof String)&&i(e[t]))for(var n,a=b.length;a--;)n=b[a],y(e,t,e[t][n],n)},_=function(e,t,n){for(var i=0;i<e.watchers[t].length;i++){var a=e.watchers[t][i];a==n&&e.watchers[t].splice(i,1)}E(e,t,n)},w=function(){for(var e=0;e<t.length;e++){var n=t[e];if("$$watchlengthsubjectroot"===n.prop){var i=a(n.obj,n.actual);(i.added.length||i.removed.length)&&(i.added.length&&l(n.obj,i.added,n.watcher,n.level-1,!0),n.watcher.call(n.obj,"root","differentattr",i,n.actual)),n.actual=r(n.obj)}else{var i=a(n.obj[n.prop],n.actual);if(i.added.length||i.removed.length){if(i.added.length)for(var o=0;o<n.obj.watchers[n.prop].length;o++)l(n.obj[n.prop],i.added,n.obj.watchers[n.prop][o],n.level-1,!0);m(n.obj,n.prop,"differentattr",i,n.actual)}n.actual=r(n.obj[n.prop])}}},j=function(e,n,i,a){var o;o=r("$$watchlengthsubjectroot"===n?e:e[n]),t.push({obj:e,prop:n,actual:o,watcher:i,level:a})},E=function(e,n,i){for(var a=0;a<t.length;a++){var r=t[a];r.obj==e&&r.prop==n&&r.watcher==i&&t.splice(a,1)}};return setInterval(w,50),e.watch=d,e.unwatch=u,e.callWatchers=m,e}),define("widget/parsers/applyAttribute",["watch"],function(e){function t(e,t){var i=e._node.data.tplSet.bind,a=e._node.data.tplSet.update;i&&Object.keys(i).forEach(function(r){function o(t){return void 0!==t&&""!==t?(e.addClass(t),t):!1}var s=i[r],d=t[s];if("class"===r){var c;c=o(d),"true"===a&&n(t,s,function(){c&&e.removeClass(c),c=o(t[s])}.bind(this))}else"checked"===r?(void 0!==d&&(e.el.checked=d),"true"===a&&n(t,s,function(){e.el.checked=t[s]}.bind(this))):(void 0!==d&&e.setAttribute(r,d),"true"===a&&n(t,s,function(){e.setAttribute(r,t[s])}.bind(this)));void 0!==t.text&&e.text(t.text),"true"===a&&n(t,"text",function(){e.text(t.text)}.bind(this))})}{var n=e.watch;e.unwatch,e.callWatchers}return t}),define("widget/parsers/applyEvents",[],function(){function e(e,t,n){void 0!==t&&void 0!==e.el&&t.forEach(function(t){this._events.push(e.on(t.name,t.action,this,n))}.bind(this))}return e}),define("widget/parsers/setBinders",[],function(){function e(e){var t=!1;return Object.keys(e).forEach(function(n){t=t||{};var i=e[n];i._node&&void 0!==i._node.bind&&(t[i._node.bind]=t[i._node.bind]||[],t[i._node.bind].push(i))}.bind(this)),t}return e}),define("widget/parsers/deepBindings",["./setBinders"],function(e){function t(n){return Object.keys(n).forEach(function(i){var a=n[i];a.children&&(n[i].children=t(a.children),n[i].bindings=e(a.children))}),n}return t}),define("widget/parsers/setChildren",["../dom","../utils","./applyEvents","./setBinders","./deepBindings"],function(e,t,n,i,a){function r(t,n){return Object.keys(t).forEach(function(i){var a=t[i],r=a._node;if("string"==typeof a);else if(-1!==["cp"].indexOf(r.data.type))r.children&&!a.children&&(a.children=r.children);else if(a instanceof e.Element!=!0&&(-1!==["pl","bd","rt"].indexOf(r.data.type)||void 0===r.data.type)&&(t[i]=new e.Element(a),"pl"===r.data.type&&void 0!==r.data.tplSet.bind)){var o=r.data.tplSet.bind;Object.keys(o).forEach(function(e){void 0!==n[o[e]]&&("class"!==e?t[i].setAttribute(e,n[o[e]]):t[i].addClass(n[o[e]]))}.bind(this))}}.bind(this)),t}function o(t,s,d){return s=s?r.call(this,s,d):{},t=t?r.call(this,t,d):{},Object.keys(t).forEach(function(r){var c=t[r].children;void 0!==c&&(c=o.call(this,c,s.children,d),t[r].bindings=i(c));var l=t[r],h=s[r];void 0!==h?(void 0!==h.children&&(h.bindings=a(h.children)),void 0!==this.nodes[r]?this.nodes[r].call(this,l,h):void 0!==l&&("string"==typeof h?e.text(l,h):e.replace(l,h),void 0!==h.children&&(l.children=h.children))):void 0!==this.nodes[r]&&"true"===l._node.data.tplSet.noattach&&void 0===l._node.data.dataset.bind&&this.nodes[r].call(this,l),void 0===this.elReady[r]||void 0===l.el&&void 0===l.instance||this.elReady[r].call(this,l);var u=this.events[r];n.call(this,l,u)}.bind(this)),t}return o}),define("widget/parsers/applyBinders",["../dom","../utils","watch","./applyEvents","./applyAttribute"],function(e,t,n,i,a){function r(n,r,d,c){var l=this.events[c._node.name];if(void 0!==c){var h=r[n];if(c.applyAttach(),this.nodes[n]){var u=c;this.nodes[n].call(this,u,d,h)}else if(t.isArray(h)||t.isObject(h)){if(t.isArray(h)){c.applyAttach();var f=function(){var e=!1,u=[],f=function(n){var r=t.extend({},c);e?r.add(d,e):(r.add(d),e=c.getParent()),a.call(this,r,n),o.call(this,n,r),i.call(this,r,l,n),u.push({binder:r,data:n}),this.elReady[r._node.name]&&this.elReady[r._node.name].call(this,r,n)};h.forEach(f.bind(this));var p=c._node.data.tplSet.update;if("true"===p){var v=["pop","shift","splice"];s(r,n,function(e,t,i,a){if(void 0===a&&"push"===t){var o=u.filter(function(e){return e.data===i[0]});0===o.length&&f.call(this,i[0])}else-1!==v.indexOf(t)&&u.forEach(function(e,t){-1===r[n].indexOf(e.data)&&(e.binder.remove(),u.splice(t,1))}.bind(this))}.bind(this))}};f.call(this)}else if(t.isObject(h)){var u=t.extend({},c);e.add(u,d),i.call(this,u,l,h),"cp"===c._node.data.type?e.replace(u,c,h):u._node.data.tplSet.bind?a.call(this,u,h):o.call(this,h,u),this.elReady[u._node.name]&&this.elReady[u._node.name].call(this,u,h)}}else{var u=c;u.add(d),u.text(h),void 0!==this.elReady[u._node.name]&&this.elReady[u._node.name].call(this,u,h),"true"===u._node.data.tplSet.update&&s(r,n,function(){u.text(r[n])}.bind(this)),i.call(this,u,l,h)}}}function o(e,t){var n=t.bindings,i=t.el;e&&void 0!==n&&(Object.keys(e).forEach(function(t){void 0!==n[t]&&(void 0!==n[t].forEach?n[t].forEach(r.bind(this,t,e,i)):r.call(this,t,e,i,n[t]))}.bind(this)),n&&Object.keys(n).forEach(function(t){if(void 0===e[t]){var a=function(o,s,c,l){void 0!==c&&void 0===l&&(n[t].forEach(r.bind(this,t,e,i)),d(e,t,a))}.bind(this);s(e,t,a,0)}}.bind(this)))}{var s=n.watch,d=n.unwatch;n.callWatchers}return o}),define("widget/parsers/setRoutes",["../dom"],function(e){function t(e){var n=e.children;void 0!==n&&Object.keys(n).forEach(function(e){t(n[e])});var i=e.instance;i?i.destroy():void 0!==e.remove&&e.remove(),e.el&&(e.el.remove(),delete e.el)}function n(e,t){void 0!==e&&Object.keys(e).forEach(function(n){var i=e[n];t.call(this,i,i.instance)}.bind(this))}function i(a,r,o){var s=Object.keys(a);s.forEach(function(s){var d=a[s],c=void 0!==d._node?d._node.data.route:void 0;if(void 0!==c&&"cp"!==d._node.data.type){var l=r(c,function(e){void 0!==d.children&&i.call(this,d.children,e,o)}.bind(this));l.to(function(){var i=[].slice.call(arguments,0),a=i.pop();if(i.length>0)var r=i.join("_");void 0!==d.el&&d.sessId!==r&&void 0!==r&&(n.call(this,d.children,t),t(d)),n.call(this,d.children,function(e,t){var n=e._node.data,r=n.dataset;r.params=a,i.length>0&&(r.link=i),t&&t.to&&t.to.apply(t,i.concat(a))}),void 0===d.el?(d.applyAttach(),e.add(d,o,!1),n.call(this,d.children,function(e,t){t&&t.to&&t.to.apply(t,i.concat(a)),!e.el&&t&&t._match&&(l.setRoutes(function(e){t._match.call(t,e.match.bind(e)),e.run()}.bind(this)),t._reRoute=function(){t._applyRoutes(l)})}),r&&(d.sessId=r)):e.attach(d)}.bind(this)),l.leave(function(){n.call(this,d.children,function(e,t){t&&void 0!==t.leave&&t.leave()}.bind(this)),e.detach(d)}.bind(this)),l.query(function(e){n.call(this,d.children,function(t,n){n&&void 0!==n.query&&n.query(e)}.bind(this))}.bind(this))}else if(void 0!==d.children&&"cp"!==d._node.data.type)i.call(this,d.children,r,o);else if(void 0!==d.instance){var h=d.instance;h._match.call(h,r)}}.bind(this))}function a(e){if(!this._match){var t=this.el;this._match=function(n){i.call(this,e,n,t),this.match&&this.match.call(this,n)}.bind(this)}}return a}),define("widget/Constructor",["require","./dom","./utils","./mediator","templating/Decoder","./parsers/applyAttribute","./parsers/setChildren","./parsers/applyBinders","./parsers/setBinders","./parsers/setRoutes","./parsers/applyEvents"],function(e,t,n,i,a,r,o,s,d,c,l){function h(e,r,s,l){if(this._routes=[],this._events=[],this.children={},this.eventBus=new i,this.context=u,void 0!==e.appContext&&n.extend(this.context,e.appContext),void 0!==e.name&&(this.name=e.name),this.beforeInit.apply(this,arguments),l&&l.getInstance){var h=l.getInstance();this.root=new t.Element(h),h.instance=this,h.eventBus=this.eventBus}if(this.template){var f=s?Object.keys(s):[],p=f.length>0?s:this.context.data;p&&(this.data=p[e.bind]||p);var v=new a(this.template),m=v.render(this.data);this.el=m.fragment,this.children=n.extend(o.call(this,m.children,r,e),this.children),this.bindings=d.call(this,this.children),c.call(this,this.children),this.data&&this.applyBinders(this.data,this)}else this.el=document.createElement("div");this.init.apply(this,arguments)}var u={};return n.extend(h.prototype,{nodes:{},events:{},elReady:{},init:function(){},beforeInit:function(){},loadCss:function(e){if(this.context._cssReady=this.context._cssReady||[],-1===this.context._cssReady.indexOf(e)){this.context._cssReady.push(e);var t=document.createElement("link");t.setAttribute("rel","stylesheet"),t.setAttribute("type","text/css"),t.setAttribute("href",e),"undefined"!=typeof t&&document.getElementsByTagName("head")[0].appendChild(t)}},applyBinders:s,detach:function(){this._placeholder||(this._placeholder=document.createElement(this.el.tagName)),this._parent||(this._parent=this.el.parentNode),this.el&&this._parent&&this._parent.replaceChild(this._placeholder,this.el)},attach:function(){this._placeholder&&this._parent&&this._parent.replaceChild(this.el,this._placeholder)},onDestroy:function(){},destroy:function(){for(this.onDestroy(),this.eventBus.remove();this._events.length>0;)this._events[0].remove(),this._events.shift();this.el.remove()},setRoutes:function(e){void 0!==e&&this._routes.push(e)},_applyRoutes:function(e){for(;this._routes.length>0;){var t=this._routes[0];t&&t._match&&e.setRoutes(function(e){t._match.call(t,e.match.bind(e)),e.run()}.bind(this)),this._routes.shift()}e.rebind()},_reRoute:function(){this._routes.splice(0,this._routes.length)},rebind:function(){this._reRoute()},setChildren:function(e,n){var i=e._node.name;void 0!==this.children[i]&&void 0!==this.children[i].el&&t.detach(this.children[i]),e.applyAttach(),"cp"!==e._node.data.type&&(this.children[i]=new t.Element(e)),this.children[i].placeholder=this.el.querySelector("#"+e._node.id),this.children[i].el=e.run(this.el,!1,!1,n),void 0!==this.elReady[i]&&void 0!==this.children[i].el&&this.elReady[i].call(this,this.children[i]);var a=this.events[i];l.call(this,this.children[i],a);var r=this.children[i]._node.data.instance;this.setRoutes(r),this.rebind()},addComponent:function(e,t){var n=t.name,i=t.container;if(void 0===n)throw"you have to define data.name for component.";if(void 0===i)throw"You have to define container for component.";if(void 0!==this.children[n])throw"Component using name:"+n+"! already defined.";var a=this.setComponent(e,t);return a.run(t.container),this.children[n]=a,this.setRoutes(a.instance),this.rebind(),a},setComponent:function(e,n){var i={name:n.name,_node:{data:{tag:"div",type:"cp"}},run:function(a){n.appContext=this.context;var r=new e(n,n.children,n.data);return i.instance=r,i.eventBus=r.eventBus,i.children=i._node.children=r.children,a instanceof HTMLElement==!0?a.parentNode.replaceChild(r.el,a):void 0!==a.el&&void 0!==n.pos?t.insertBefore(a,r,n.pos):void 0!==a.el&&t.append(a,r),r.el}.bind(this)};return i}}),h.extend=n.fnExtend,h});;!function(){function e(e,t){for(var n=0;n<e.length;n++){var r=e[n];0==r.name.indexOf("data-")&&r.name.length>5&&(t[r.name.substr(5)]=r.value)}return t}function t(){var t={},n=document.getElementsByTagName("script");if(n.length>0)for(var r=0;r<n.length;r++){var a=n[r],o=a.attributes;e(o,t)}return t}function n(e){void 0!==e.name&&require([e.name],function(t){var n=e.target?document.querySelector(e.target):document.body,r=new t;r.start(n)})}document.addEventListener("DOMContentLoaded",function(){n(t())},!1)}();