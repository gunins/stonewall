!function(e,t){"function"==typeof define&&define.amd?define("templating/utils",[],t):"object"==typeof exports?module.exports=t():(e.Templating=e.Templating||{},e.Templating.utils=t())}(this,function(){return{merge:function(e,t){Object.keys(t).forEach(function(n){e[n]=t[n]})}}}),function(e,t){"function"==typeof define&&define.amd?define("coders/component/CpDecoder",["templating/Decoder"],t):"object"==typeof exports?module.exports=t(require("./Decoder")):(e.Templating=e.Templating||{},e.Templating.componentDecoder=t(e.Templating.Decoder))}(this,function(e){var t={tagName:"cp",decode:function(e,t){var n=e.data,i={name:n.name,tmpEl:function(e,o){return i.data.instance=new n.src(n.dataset,t,o),n.instance.el},data:n||{}};return void 0!==n.dataset.bind&&(i.bind=n.dataset.bind),i}};return e&&e.addDecoder(t),t});;!function(e,n){"function"==typeof define&&define.amd?define("coders/placeholders/plDecoder",["templating/Decoder"],n):"object"==typeof exports?module.exports=n(require("./Decoder")):(e.Templating=e.Templating||{},e.Templating.componentDecoder=n(e.Templating.Decoder))}(this,function(e){var n={tagName:"pl",decode:function(e,n){var t=e.data;return{name:t.name,tmpEl:function(e){return e||document.createElement(t.tag)},parse:function(e){n&&Object.keys(n).forEach(function(t){n[t].run(e)})},data:t}}};return e&&e.addDecoder(n),n});;!function(e,t){"function"==typeof define&&define.amd?define("coders/databind/bdDecoder",["templating/Decoder"],t):"object"==typeof exports?module.exports=t(require("./Decoder")):(e.Templating=e.Templating||{},e.Templating.componentDecoder=t(e.Templating.Decoder))}(this,function(e){var t={tagName:"bd",noAttach:!0,decode:function(e){var t=this.data=e.data,n={name:t.name,tmpEl:function(){return document.createElement(t.tag)},data:t,bind:t.dataset.bind||t.name};return n}};return e&&e.addDecoder(t),t});;!function(e,t){"function"==typeof define&&define.amd?define("coders/router/RouterDecoder",["templating/Decoder"],t):"object"==typeof exports?module.exports=t(require("./Decoder")):(e.Templating=e.Templating||{},e.Templating.componentDecoder=t(e.Templating.Decoder))}(this,function(e){var t={tagName:"rt",noAttach:!0,decode:function(e,t){var n=e.data,o={name:n.name,tmpEl:function(e){return e||document.createElement(n.tag)},parse:function(e){t&&Object.keys(t).forEach(function(n){t[n].run(e)})},data:n||{},route:n.route};return o}};return e&&e.addDecoder(t),t});;!function(t,e){"function"==typeof define&&define.amd?define("templating/Decoder",["templating/utils"],e):"object"==typeof exports?module.exports=e(require("./utils")):(t.Templating=t.Templating||{},t.Templating.Decoder=e(t.Templating.utils))}(this,function(t){function e(t,e){var n;n="li"===e?"ul":"td"===e||"th"===e?"tr":"tr"===e?"tbody":"div";var i=document.createElement(n),r=document.createDocumentFragment();return i.innerHTML=t,r.appendChild(i.firstChild),r.firstChild}function n(t,n,i,r){var a=this.tmpEl(n?t:!1,r),d=this.name,o=this.data.attribs,h=e(this.template,this.data.tag);if(Object.keys(o).forEach(function(t){a.setAttribute(t,o[t])}),void 0!==h)for(;h.childNodes.length>0;)a.appendChild(h.childNodes[0]);if(void 0!==d&&a.classList.add(d),i)this.setParent(i),null!==this.parent&&this.parent.appendChild(a);else{var c=t.parentNode;this.setParent(c),null!==this.parent&&this.parent.replaceChild(a,t)}return this.el=a,void 0!==this.parse&&this.parse(a),a}function i(e,i){var r=e.tagName;t.merge(this,{id:e.id,template:e.template,noAttach:o[r].noAttach||e.data.tplSet.noattach,instance:n.bind(this),applyAttach:function(){delete this.noAttach},setParent:function(t){this.parent=t}.bind(this),getParent:function(){return this.parent}.bind(this),run:function(t,e,n,i){if(void 0===this.noAttach){var r=t.querySelector("#"+this.id)||t;if(r)return this.instance(r,e,n,i)}}}),i&&(this.children=i)}function r(t){var e=!1,n=!1;return t.children.forEach(function(t){t.children&&t.children.length>0&&(n=r.call(this,t));var d=t.tagName;if(d){var h=o[d].decode(t,n,a);if(h){var c=h.name;void 0!==c&&(e=e||{},e[c]=h,i.call(e[c],t,n))}}n=!1}.bind(this)),e}function a(t,e){Object.keys(t).forEach(function(n){t[n].run(e)})}function d(t){this._root="string"==typeof t?JSON.parse(t):t}var o={};return t.merge(d,{addDecoder:function(t){void 0===o[t.tagName]&&(o[t.tagName]=t)}}),t.merge(d.prototype,{addDecoder:d.addDecoder,_renderFragment:function(t){var n={},i=e(t.template);return t.children&&t.children.length>0&&(n=r.call(this,t)),a(n,i),{fragment:i,children:n}},render:function(){var t=this._renderFragment(this._root);return t}}),d});;/*!
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

!function(t,n){"function"==typeof define&&define.amd?define("widget/mediator",[],function(){return t.Mediator=n(),t.Mediator}):"undefined"!=typeof exports?exports.Mediator=n():t.Mediator=n()}(this,function(){function t(){var t=function(){return(65536*(1+Math.random())|0).toString(16).substring(1)};return t()+t()+"-"+t()+"-"+t()+"-"+t()+"-"+t()+t()+t()}function n(e,i,r){return this instanceof n?(this.id=t(),this.fn=e,this.options=i,this.context=r,void(this.channel=null)):new n(e,i,r)}function e(t,n){return this instanceof e?(this.namespace=t||"",this._subscribers=[],this._channels={},this._parent=n,void(this.stopped=!1)):new e(t)}function i(){return this instanceof i?void(this._channels=new e("")):new i}return n.prototype={update:function(t){t&&(this.fn=t.fn||this.fn,this.context=t.context||this.context,this.options=t.options||this.options,this.channel&&this.options&&void 0!==this.options.priority&&this.channel.setPriority(this.id,this.options.priority))}},e.prototype={addSubscriber:function(t,e,i){var r=new n(t,e,i);return e&&void 0!==e.priority?(e.priority=e.priority>>0,e.priority<0&&(e.priority=0),e.priority>=this._subscribers.length&&(e.priority=this._subscribers.length-1),this._subscribers.splice(e.priority,0,r)):this._subscribers.push(r),r.channel=this,r},stopPropagation:function(){this.stopped=!0},getSubscriber:function(t){var n=0,e=this._subscribers.length;for(e;e>n;n++)if(this._subscribers[n].id===t||this._subscribers[n].fn===t)return this._subscribers[n]},setPriority:function(t,n){var e,i,r,s,o=0,a=0;for(a=0,s=this._subscribers.length;s>a&&(this._subscribers[a].id!==t&&this._subscribers[a].fn!==t);a++)o++;e=this._subscribers[o],i=this._subscribers.slice(0,o),r=this._subscribers.slice(o+1),this._subscribers=i.concat(r),this._subscribers.splice(n,0,e)},addChannel:function(t){this._channels[t]=new e((this.namespace?this.namespace+":":"")+t,this)},hasChannel:function(t){return this._channels.hasOwnProperty(t)},returnChannel:function(t){return this._channels[t]},removeSubscriber:function(t){var n=this._subscribers.length-1;if(!t)return void(this._subscribers=[]);for(n;n>=0;n--)(this._subscribers[n].fn===t||this._subscribers[n].id===t)&&(this._subscribers[n].channel=null,this._subscribers.splice(n,1))},publish:function(t){var n,e,i,r=0,s=this._subscribers.length,o=!1;for(s;s>r;r++)o=!1,n=this._subscribers[r],this.stopped||(e=this._subscribers.length,void 0!==n.options&&"function"==typeof n.options.predicate?n.options.predicate.apply(n.context,t)&&(o=!0):o=!0),o&&(n.options&&void 0!==n.options.calls&&(n.options.calls--,n.options.calls<1&&this.removeSubscriber(n.id)),n.fn.apply(n.context,t),i=this._subscribers.length,s=i,i===e-1&&r--);this._parent&&this._parent.publish(t),this.stopped=!1}},i.prototype={getChannel:function(t,n){var e=this._channels,i=t.split(":"),r=0,s=i.length;if(""===t)return e;if(i.length>0)for(s;s>r;r++){if(!e.hasChannel(i[r])){if(n)break;e.addChannel(i[r])}e=e.returnChannel(i[r])}return e},subscribe:function(t,n,e,i){var r=this.getChannel(t||"",!1);return e=e||{},i=i||{},r.addSubscriber(n,e,i)},once:function(t,n,e,i){return e=e||{},e.calls=1,this.subscribe(t,n,e,i)},getSubscriber:function(t,n){var e=this.getChannel(n||"",!0);return e.namespace!==n?null:e.getSubscriber(t)},remove:function(t,n){var e=this.getChannel(t||"",!0);return e.namespace!==t?!1:void e.removeSubscriber(n)},publish:function(t){var n=this.getChannel(t||"",!0);if(n.namespace!==t)return null;var e=Array.prototype.slice.call(arguments,1);e.push(n),n.publish(e)}},i.prototype.on=i.prototype.subscribe,i.prototype.bind=i.prototype.subscribe,i.prototype.emit=i.prototype.publish,i.prototype.trigger=i.prototype.publish,i.prototype.off=i.prototype.remove,i.Channel=e,i.Subscriber=n,i.version="0.9.8",i}),!function(t,n){"function"==typeof define&&define.amd?define("router/MatchBinding",n):"object"==typeof exports?module.exports=n():(t.UrlManager=t.UrlManager||{},t.UrlManager.MatchBinding=n())}(this,function(){function t(n,e){""===e?this.pattern=e=n.replace(/^\(\/\)/g,"").replace(/^\/|$/g,""):(this.pattern=n,e+=n),this.location=e.replace(/\((.*?)\)/g,"$1").replace(/^\/|$/g,"");var i=this.pattern.replace(t.ESCAPE_PARAM,"\\$&").replace(t.OPTIONAL_PARAM,"(?:$1)?").replace(t.NAMED_PARAM,function(t,n){return n?t:"([^/]+)"}).replace(t.SPLAT_PARAM,"(.*?)");this.patternRegExp=new RegExp("^"+i),this.routeHandler=[],this.leaveHandler=[],this.queryHandler=[],this.routes=[]}return t.prototype.setRoutes=function(t){return this.routes.push(t),this},t.prototype.getRoutes=function(){return this.routes},t.prototype.to=function(t){return this.routeHandler.push(t),this},t.prototype.leave=function(t){return this.leaveHandler.push(t),this},t.prototype.query=function(t){return this.queryHandler.push(t),this},t.prototype.test=function(t){return this.patternRegExp.test(t)},t.prototype.getFragment=function(t){var n=this.applyParams(t);return t.replace(n,"")},t.prototype.applyParams=function(t){var n=this.pattern.replace(/\((.*?)\)/g,"$1").split("/"),e=t.split("/");return e.splice(0,n.length).join("/")},t.prototype.extractParams=function(t){var n=this.patternRegExp.exec(t).slice(1);return n.map(function(t){return t?decodeURIComponent(t):null})},t.prototype.setSubBinder=function(t){return this.subBinder=t,t},t.prototype.getSubBinder=function(){return this.subBinder},t.prototype.getHandler=function(){return this.routeHandler},t.prototype.getLeaveHandler=function(){return this.leaveHandler},t.prototype.getQueryHandler=function(){return this.queryHandler},t.OPTIONAL_PARAM=/\((.*?)\)/g,t.NAMED_PARAM=/(\(\?)?:\w+/g,t.SPLAT_PARAM=/\*\w+/g,t.ESCAPE_PARAM=/[\-{}\[\]+?.,\\\^$|#\s]/g,t}),function(t,n){"function"==typeof define&&define.amd?define("router/MatchBinder",["./MatchBinding"],n):"object"==typeof exports?module.exports=n(require("./MatchBinding")):(t.UrlManager=t.UrlManager||{},t.UrlManager.MatchBinder=n(t.UrlManager.MatchBinding))}(this,function(t){function n(t,n,e,i){this.bindings=[],this.location=i||t||"",this.command=e,this.params=n}return n.prototype.match=function(t,n){var e=this.getMatchBinding(t,this.location);if(this.bindings.push(e),n){var i=this.getSubBinder(this.location+t);e.setSubBinder(i),n(i.match.bind(i))}return e},n.prototype.getSubBinder=function(t){return new n(t)},n.prototype.getMatchBinding=function(n,e){return new t(n,e)},n.prototype.filter=function(t){return this.bindings.filter(function(n){return n.test(t)})},n.prototype.run=function(){this.command(this)},n}),function(t,n){"function"==typeof define&&define.amd?define("router/Router",["./MatchBinder"],n):"object"==typeof exports?module.exports=n(require("./MatchBinder")):(t.UrlManager=t.UrlManager||{},t.UrlManager.Router=n(t.UrlManager.MatchBinder))}(this,function(t){function n(t){try{return decodeURIComponent(t.replace(/\+/g," "))}catch(n){return t}}function e(t,n){var e=t.split("&");e.forEach(function(t){var e=t.split("=");n(e.shift(),e.join("="))})}function i(t,n,e,i){var r,s=e.root.substring(0,e.root.length-i.length);return t=t||"",r=n===!0?this.serialize(e.query):n===!1?"":this.serialize(n),s+t+(0===r.length?"":"?"+r)}function r(){this.root=this.getBinder(),this.bindings=[]}return Array.prototype.equals=function(t){if(!t)return!1;if(this.length!=t.length)return!1;for(var n=0,e=this.length;e>n;n++)if(this[n]instanceof Array&&t[n]instanceof Array){if(!this[n].equals(t[n]))return!1}else if(this[n]!=t[n])return!1;return!0},r.prototype.getBinder=function(){return new t},r.prototype.match=function(t){t(this.root.match.bind(this.root))},r.prototype.trigger=function(t){if(this.started){var i=t.split("?",2),r={};i[1]&&e(i[1],function(t,e){e=n(e),r[t]?"string"==typeof r[t]?r[t]=[r[t],e]:r[t].push(e):r[t]=e});var s=i[0].replace(/^\/|$/g,""),o={root:s,query:r},a=[],u=!1;this.bindings.forEach(function(n){var e,i=n.pattern.replace(/\((.*?)\)/g,"$1").replace(/^\//,"").split("/"),r=n.location.split("/"),p=n.prevLoc.replace(/^\//,"").split("/"),h=function(t){var n=t.splice(r.length-i.length,i.length),e=p.splice(0,i.length);return!n.equals(e)};if(e=h(u||s.split("/"))){u=s.split("/").splice(0,r.length-i.length);var c=n.getLeaveHandler(),l=[];this.applyHandler(c,l,o,t),a.push(n)}}.bind(this)),a.forEach(function(t){this.bindings.splice(this.bindings.indexOf(t),1)}.bind(this)),this.find(this.root,s,o)}},r.prototype.find=function(t,n,e){var i=t.filter(n);i.forEach(this.onBinding.bind(this,n,e))},r.prototype.execute=function(t){var n=t.location.split("/"),e=t.params.root.split("/"),i="/"+e.splice(n.length,e.length-n.length).join("/");this.find(t,i,t.params)},r.prototype.onBinding=function(n,e,i){this.runHandler(n,e,i);var r=i.getFragment(n),s=i.getSubBinder();s&&s.bindings&&s.bindings.length>0&&this.find(s,r,e);var o=i.getRoutes();if(o&&o.length>0)for(;o.length>0;){var a=o[0],u=new t(i.getFragment(n),e,this.execute.bind(this),i.location);a(u),s.bindings=s.bindings.concat(u.bindings),o.shift()}},r.prototype.serialize=function(t){var n=[];for(var e in t)t.hasOwnProperty(e)&&n.push(encodeURIComponent(e)+"="+encodeURIComponent(t[e]));return n.join("&")},r.prototype.runHandler=function(t,n,e){if(-1===this.bindings.indexOf(e)){var i=e.getHandler(),r=e.extractParams(t);e.prevLoc=t,this.applyHandler(i,r,n,t),this.bindings.push(e)}var i=e.getQueryHandler();if(i){var r=[];this.applyHandler(i,r,n,t)}},r.prototype.applyHandler=function(t,n,e,r){t&&t.length>0&&t.forEach(function(t){t.apply(this,n.concat({getQuery:function(){return e.query},getLocation:function(t,n){return i.call(this,t,n,e,r)}.bind(this)}))}.bind(this))},r.prototype.start=function(){this.started=!0},r.prototype.stop=function(){this.started=!1},r}),define("widget/utils",[],function(){function t(t){var n=typeof t;if(!("function"===n||"object"===n&&t))return t;for(var e,i,r=1,s=arguments.length;s>r;r++){e=arguments[r];for(i in e)t[i]=e[i]}return t}function n(n,e){var i,r=this;i=n&&null!=n&&hasOwnProperty.call(n,"constructor")?n.constructor:function(){return r.apply(this,arguments)},t(i,r,e);var s=function(){this.constructor=i};return s.prototype=r.prototype,i.prototype=new s,n&&t(i.prototype,n),i.__super__=r.prototype,i}function e(t){return"[object String]"===toString.call(t)}function i(t){var n=typeof t;return"function"===n||"object"===n&&!!t}function r(t){return"[object Array]"===toString.call(t)}return{fnExtend:n,extend:t,isString:e,isObject:i,isArray:r}}),define("widget/App",["./mediator","router/Router","./utils"],function(t,n,e){function i(t){function n(){var n=window.location.href.match(/#(.*)$/);t.trigger(n?n[1]:"")}t.start(),window.addEventListener("hashchange",n,!1),n()}function r(){var r=new n;this.context=e.extend(this.setContext(),{eventBus:new t}),this.beforeInit.apply(this,arguments),void 0!==this.AppContainer&&(this.appContainer=new this.AppContainer({appContext:this.context}),void 0!==this.appContainer._match&&r.match(this.appContainer._match.bind(this.appContainer)),this.setContext(),this.el=this.appContainer.el,setTimeout(function(){this.el.classList.add("show")}.bind(this),100),i(r)),this.init.apply(this,arguments)}return r.extend=e.fnExtend,e.extend(r.prototype,{beforeInit:function(){},init:function(){},setContext:function(){return{}},start:function(t){t instanceof HTMLElement==!0&&t.appendChild(this.el)}}),r});;!function(t,e){"function"==typeof define&&define.amd?define("templating/utils",[],e):"object"==typeof exports?module.exports=e():(t.Templating=t.Templating||{},t.Templating.utils=e())}(this,function(){return{merge:function(t,e){Object.keys(e).forEach(function(n){t[n]=e[n]})}}}),function(t,e){"function"==typeof define&&define.amd?define("templating/Decoder",["templating/utils"],e):"object"==typeof exports?module.exports=e(require("./utils")):(t.Templating=t.Templating||{},t.Templating.Decoder=e(t.Templating.utils))}(this,function(t){function e(t,e){var n;n="li"===e?"ul":"td"===e||"th"===e?"tr":"tr"===e?"tbody":"div";var i=document.createElement(n),r=document.createDocumentFragment();return i.innerHTML=t,r.appendChild(i.firstChild),r.firstChild}function n(t,n,i,r){var a=this.tmpEl(n?t:!1,r),c=this.name,o=this.data.attribs,s=e(this.template,this.data.tag);if(Object.keys(o).forEach(function(t){a.setAttribute(t,o[t])}),void 0!==s)for(;s.childNodes.length>0;)a.appendChild(s.childNodes[0]);if(void 0!==c&&a.classList.add(c),i)this.setParent(i),null!==this.parent&&this.parent.appendChild(a);else{var l=t.parentNode;this.setParent(l),null!==this.parent&&this.parent.replaceChild(a,t)}return this.el=a,void 0!==this.parse&&this.parse(a),a}function i(e,i){var r=e.tagName;t.merge(this,{id:e.id,template:e.template,noAttach:o[r].noAttach||e.data.tplSet.noattach,instance:n.bind(this),applyAttach:function(){delete this.noAttach},setParent:function(t){this.parent=t}.bind(this),getParent:function(){return this.parent}.bind(this),run:function(t,e,n,i){if(void 0===this.noAttach){var r=t.querySelector("#"+this.id)||t;if(r)return this.instance(r,e,n,i)}}}),i&&(this.children=i)}function r(t){var e=!1,n=!1;return t.children.forEach(function(t){t.children&&t.children.length>0&&(n=r.call(this,t));var c=t.tagName;if(c){var s=o[c].decode(t,n,a);if(s){var l=s.name;void 0!==l&&(e=e||{},e[l]=s,i.call(e[l],t,n))}}n=!1}.bind(this)),e}function a(t,e){Object.keys(t).forEach(function(n){t[n].run(e)})}function c(t){this._root="string"==typeof t?JSON.parse(t):t}var o={};return t.merge(c,{addDecoder:function(t){void 0===o[t.tagName]&&(o[t.tagName]=t)}}),t.merge(c.prototype,{addDecoder:c.addDecoder,_renderFragment:function(t){var n={},i=e(t.template);return t.children&&t.children.length>0&&(n=r.call(this,t)),a(n,i),{fragment:i,children:n}},render:function(){var t=this._renderFragment(this._root);return t}}),c}),function(t){"object"==typeof exports?module.exports=t():"function"==typeof define&&define.amd?define("watch",t):(window.WatchJS=t(),window.watch=window.WatchJS.watch,window.unwatch=window.WatchJS.unwatch,window.callWatchers=window.WatchJS.callWatchers)}(function(){var t={noMore:!1},e=[],n=function(t){var e={};return t&&"[object Function]"==e.toString.call(t)},i=function(t){return"[object Array]"===Object.prototype.toString.call(t)},r=function(t,e){var n=[],r=[];if("string"!=typeof t&&"string"!=typeof e){if(i(t))for(var a=0;a<t.length;a++)void 0===e[a]&&n.push(a);else for(var a in t)t.hasOwnProperty(a)&&void 0===e[a]&&n.push(a);if(i(e))for(var c=0;c<e.length;c++)void 0===t[c]&&r.push(c);else for(var c in e)e.hasOwnProperty(c)&&void 0===t[c]&&r.push(c)}return{added:n,removed:r}},a=function(t){if(null==t||"object"!=typeof t)return t;var e=t.constructor();for(var n in t)e[n]=t[n];return e},c=function(t,e,n,i){try{Object.observe(t,function(t){t.forEach(function(t){t.name===e&&i(t.object[t.name])})})}catch(r){try{Object.defineProperty(t,e,{get:n,set:i,enumerable:!0,configurable:!0})}catch(a){try{Object.prototype.__defineGetter__.call(t,e,n),Object.prototype.__defineSetter__.call(t,e,i)}catch(c){throw new Error("watchJS error: browser not supported :/")}}}},o=function(t,e,n){try{Object.defineProperty(t,e,{enumerable:!1,configurable:!0,writable:!1,value:n})}catch(i){t[e]=n}},s=function(){n(arguments[1])?l.apply(this,arguments):i(arguments[1])?d.apply(this,arguments):h.apply(this,arguments)},l=function(t,e,n,r){if("string"!=typeof t&&(t instanceof Object||i(t))){var a=[];if(i(t))for(var c=0;c<t.length;c++)a.push(c);else for(var o in t)"$val"!=o&&Object.prototype.hasOwnProperty.call(t,o)&&a.push(o);d(t,a,e,n,r),r&&E(t,"$$watchlengthsubjectroot",e,n)}},d=function(t,e,n,r,a){if("string"!=typeof t&&(t instanceof Object||i(t)))for(var c=0;c<e.length;c++){var o=e[c];h(t,o,n,r,a)}},h=function(t,e,r,a,c){"string"!=typeof t&&(t instanceof Object||i(t))&&(n(t[e])||(null!=t[e]&&(void 0===a||a>0)&&l(t[e],r,void 0!==a?a-1:a),v(t,e,r,a),c&&(void 0===a||a>0)&&E(t,e,r,a)))},u=function(){n(arguments[1])?f.apply(this,arguments):i(arguments[1])?p.apply(this,arguments):w.apply(this,arguments)},f=function(t,e){if(!(t instanceof String)&&(t instanceof Object||i(t)))if(i(t)){for(var n=[],r=0;r<t.length;r++)n.push(r);p(t,n,e)}else{var a=function(t){var n=[];for(var i in t)t.hasOwnProperty(i)&&(t[i]instanceof Object?a(t[i]):n.push(i));p(t,n,e)};a(t)}},p=function(t,e,n){for(var i in e)e.hasOwnProperty(i)&&w(t,e[i],n)},v=function(e,n,i,r){var a=e[n];g(e,n),e.watchers||o(e,"watchers",{}),e.watchers[n]||(e.watchers[n]=[]);for(var s=0;s<e.watchers[n].length;s++)if(e.watchers[n][s]===i)return;e.watchers[n].push(i);var d=function(){return a},h=function(c){var o=a;a=c,0!==r&&e[n]&&l(e[n],i,void 0===r?r:r-1),g(e,n),t.noMore||o!==c&&(b(e,n,"set",c,o),t.noMore=!1)};c(e,n,d,h)},b=function(t,e,n,i,r){if(void 0!==e)for(var a=0;a<t.watchers[e].length;a++)t.watchers[e][a].call(t,e,n,i,r);else for(var e in t)t.hasOwnProperty(e)&&b(t,e,n,i,r)},m=["pop","push","reverse","shift","sort","slice","unshift","splice"],y=function(t,e,n,i){o(t[e],i,function(){var r=n.apply(t[e],arguments);return h(t,t[e]),"slice"!==i&&b(t,e,i,arguments),r})},g=function(t,e){if(t[e]&&!(t[e]instanceof String)&&i(t[e]))for(var n,r=m.length;r--;)n=m[r],y(t,e,t[e][n],n)},w=function(t,e,n){for(var i=0;i<t.watchers[e].length;i++){var r=t.watchers[e][i];r==n&&t.watchers[e].splice(i,1)}O(t,e,n)},j=function(){for(var t=0;t<e.length;t++){var n=e[t];if("$$watchlengthsubjectroot"===n.prop){var i=r(n.obj,n.actual);(i.added.length||i.removed.length)&&(i.added.length&&d(n.obj,i.added,n.watcher,n.level-1,!0),n.watcher.call(n.obj,"root","differentattr",i,n.actual)),n.actual=a(n.obj)}else{var i=r(n.obj[n.prop],n.actual);if(i.added.length||i.removed.length){if(i.added.length)for(var c=0;c<n.obj.watchers[n.prop].length;c++)d(n.obj[n.prop],i.added,n.obj.watchers[n.prop][c],n.level-1,!0);b(n.obj,n.prop,"differentattr",i,n.actual)}n.actual=a(n.obj[n.prop])}}},E=function(t,n,i,r){var c;c=a("$$watchlengthsubjectroot"===n?t:t[n]),e.push({obj:t,prop:n,actual:c,watcher:i,level:r})},O=function(t,n,i){for(var r=0;r<e.length;r++){var a=e[r];a.obj==t&&a.prop==n&&a.watcher==i&&e.splice(r,1)}};return setInterval(j,50),t.watch=s,t.unwatch=u,t.callWatchers=b,t}),define("widget/parsers/applyAttribute",["watch"],function(t){function e(t,e){var i=t.data.tplSet.bind,r=t.data.tplSet.update;i&&Object.keys(i).forEach(function(a){var c=i[a];if(void 0!==e[c])if("class"===a){t.addClass(e[c]);var o=e[c];"true"===r&&n(e,c,function(){t.removeClass(o),t.addClass(e[c]),o=e[c]}.bind(this))}else"checked"===a?(t.el.checked=e[c],"true"===r&&n(e,c,function(){t.el.checked=e[c]}.bind(this))):(t.setAttribute(a,e[c]),"true"===r&&n(e,c,function(){t.setAttribute(a,e[c])}.bind(this)));void 0!==e.text&&(t.text(e.text),"true"===r&&n(e,"text",function(){t.text(e.text)}.bind(this)))})}{var n=t.watch;t.unwatch,t.callWatchers}return e}),define("widget/dom",["./utils"],function(t){function e(e){var n=t.extend({},e);t.extend(this,n)}var n={append:function(t,e,n){e.placeholder=t.el.querySelector("#"+e.id),e.el=e.run(t.el,!0,!1,n)},replace:function(t){t.el.innerHTML="",n.append.apply(this,arguments)},detach:function(t){t.el.parentNode&&t.el.parentNode.replaceChild(t.placeholder,t.el)},attach:function(t){t.placeholder.parentNode&&t.placeholder.parentNode.replaceChild(t.el,t.placeholder)},add:function(t,e,n,i){t.placeholder=e.querySelector("#"+t.id),t.el=t.run(e,!1,n,i)},text:function(t,e){t.el.innerHTML=e},setAttribute:function(e,n,i){t.isObject(n)?Object.keys(n).forEach(function(t){e.el.setAttribute(t,n[t])}.bind(this)):e.el.setAttribute(n,i)},removeAttribute:function(t,e){t.el.removeAttribute(e)},setStyle:function(e,n,i){t.isObject(n)?Object.keys(n).forEach(function(t){e.el.style[t]=n[t]}.bind(this)):e.el.style[n]=i},removeStyle:function(t,e){delete t.el.style[e]},addClass:function(t,e){t.el.classList.add(e)},removeClass:function(t,e){t.el.classList.remove(e)},val:function(t,e){var n=t.el;return void 0===e?n.value:void(n.value=e)},on:function(t,e,n,i){var r=Array.prototype.slice.call(arguments,4,arguments.length),a=t.el,c=e.split(" "),o=function(e){n.apply(i||this,[e,t].concat(r))};return c.forEach(function(t){a.addEventListener(t,o)}),{remove:function(){c.forEach(function(t){a.removeEventListener(t,o)})}}},remove:function(t){t.el.remove()},Element:e};return t.extend(e.prototype,{append:function(t){n.append(this,t)},replace:function(t,e){n.replace(this,t,e)},text:function(t){n.text(this,t)},add:function(t,e,i){n.add(this,t,e,i)},detach:function(){n.detach(this)},attach:function(){n.attach(this)},setAttribute:function(t,e){n.setAttribute(this,t,e)},removeAttribute:function(t){n.removeAttribute(this,t)},setStyle:function(t,e){n.setStyle(this,t,e)},removeStyle:function(t){n.removeStyle(this,t)},addClass:function(t){n.addClass(this,t)},removeClass:function(t){n.removeClass(this,t)},val:function(t){return n.val(this,t)},on:function(){var t=Array.prototype.slice.call(arguments,0);return n.on.apply(!1,[this].concat(t))},remove:function(){n.remove(this)}}),e.extend=t.fnExtend,n}),define("widget/parsers/applyEvents",[],function(){function t(t,e,n){void 0!==e&&void 0!==t.el&&e.forEach(function(e){t.on(e.name,e.action,this,n)}.bind(this))}return t}),define("widget/parsers/setBinders",[],function(){function t(t){var e=!1;return Object.keys(t).forEach(function(n){e=e||{};var i=t[n];void 0!==i.bind&&(e[i.bind]=e[i.bind]||[],e[i.bind].push(i))}.bind(this)),e}return t}),define("widget/parsers/deepBindings",["./setBinders"],function(t){function e(n){return Object.keys(n).forEach(function(i){var r=n[i];r.children&&(n[i].children=e(r.children),n[i].bindings=t(r.children))}),n}return e}),define("widget/parsers/setChildren",["../dom","./applyEvents","./setBinders","./deepBindings"],function(t,e,n,i){function r(e){return Object.keys(e).forEach(function(n){e[n]instanceof t.Element!=!0&&(e[n]=new t.Element(e[n])),e[n].children&&(e[n].children=r(e[n].children))}.bind(this)),e}function a(t,c){return c=c?r(c):{},t=t?r(t):{},Object.keys(t).forEach(function(r){var o=t[r].children;void 0!==o&&(o=a.call(this,o,c.children),t[r].bindings=n(o));var s=t[r],l=c[r];void 0!==l&&(void 0!==l.children&&(l.bindings=i(l.children)),void 0!==this.nodes[r]?this.nodes[r].call(this,s,l):void 0!==s&&(s.replace(l),void 0!==l.children&&(s.children=l.children))),void 0!==this.elReady[r]&&void 0!==s.el&&this.elReady[r].call(this,s);var d=this.events[r];e.call(this,s,d)}.bind(this)),t}return a}),define("widget/parsers/applyBinders",["../dom","../utils","watch","./applyEvents","./applyAttribute"],function(t,e,n,i,r){function a(n,o){var s=o.bindings,l=o.el;n&&Object.keys(n).forEach(function(o){if(void 0!==s&&void 0!==s[o]){var d=function(s){var d=this.events[s.name];if(void 0!==s){var h=n[o];if(s.applyAttach(),this.nodes[o]){var u=new t.Element(s);this.nodes[o].call(this,u,l,h)}else if(e.isArray(h)||e.isObject(h)){if(e.isArray(h)){s.applyAttach();var f=function(){var e=!1,u=function(n){var c=new t.Element(s);e?c.add(l,e):(c.add(l),e=s.getParent()),this.elReady[o]&&this.elReady[o].call(this,c,n),r.call(this,c,n),a.call(this,n,c),i.call(this,c,d,n)};h.forEach(u.bind(this));var f=s.data.tplSet.update;"true"===f&&c(n,o,function(t,e,n,i){void 0===i&&"push"==e&&u.call(this,n[0])}.bind(this))};f.call(this)}else if(e.isObject(h)){var u=new t.Element(s);u.add(l),this.elReady[o]&&this.elReady[o].call(this,u,h),i.call(this,u,d,h),"cp"===s.data.type?u.replace(s,h):u.data.tplSet.bind?r.call(this,u,h):a.call(this,h,u)}}else{var u=new t.Element(s);u.add(l),u.text(h),void 0!==this.elReady[o]&&this.elReady[o].call(this,u,h),"true"===u.data.tplSet.update&&c(n,o,function(){u.text(n[o])}.bind(this)),i.call(this,u,d,h)}}};void 0!==s[o].forEach?s[o].forEach(d.bind(this)):d.call(this,s[o])}}.bind(this))}{var c=n.watch;n.unwatch,n.callWatchers}return a}),define("widget/parsers/setRoutes",[],function(){function t(t){if(!this._match){var e=this.el;this._match=function(i){n.call(this,t,i,e),this.match&&this.match.call(this,i)}.bind(this)}}function e(t,e){void 0!==t&&Object.keys(t).forEach(function(n){var i=t[n];e.call(this,i)}.bind(this))}function n(t,i,r){var a=Object.keys(t),c=i;a.forEach(function(a){var o=t[a],s=o.data.route;if(void 0!==s){var l=i(s,function(t){c=t}.bind(this));l.to(function(){var t=[].slice.call(arguments,0),n=t.pop();if(t.length>0)var i=t.join("_");e.call(this,o.children,function(e){var i=e.data,r=i.dataset,a=i.instance;r.params=n,t.length>0&&(r.link=t,a&&a.reset&&a.reset.apply(a,t.concat(n)))}),void 0!==o.el&&o.sessId!==i&&void 0!==i&&(o.detach(),o.el.remove(),delete o.el),void 0===o.el?(o.applyAttach(),o.add(r,!1),e.call(this,o.children,function(t){!t.el&&t.data.instance&&t.data.instance._match&&l.setRoutes(function(e){t.data.instance._match.call(t.data.instance,e.match.bind(e)),e.run()}.bind(this))}),i&&(o.sessId=i)):o.attach()}.bind(this)),l.leave(function(){o.detach()}.bind(this))}void 0!==o.children&&n.call(this,o.children,c,r)}.bind(this))}return t}),define("widget/Constructor",["./utils","./mediator","templating/Decoder","./parsers/applyAttribute","./parsers/setChildren","./parsers/applyBinders","./parsers/setBinders","./parsers/setRoutes"],function(t,e,n,i,r,a,c,o){function s(i,a,s){if(this.eventBus=new e,this.context=l,void 0!==i.appContext&&t.extend(this.context,i.appContext),this.beforeInit.apply(this,arguments),this.template){var d=new n(this.template),h=d.render();this.el=h.fragment,this.data=s?s:this.context.data[i.bind],this.children=r.call(this,h.children,a),this.bindings=c.call(this,this.children),this.routes=o.call(this,this.children),this.data&&this.applyBinders(this.data,this)}else this.el=document.createElement("div");this.init.apply(this,arguments)}var l={};return t.extend(s.prototype,{nodes:{},events:{},elReady:{},init:function(){},beforeInit:function(){},applyBinders:a,destroy:function(){this.el.remove()}}),s.extend=t.fnExtend,s});;!function(){function e(e,t){for(var n=0;n<e.length;n++){var r=e[n];0==r.name.indexOf("data-")&&r.name.length>5&&(t[r.name.substr(5)]=r.value)}return t}function t(){var t={},n=document.getElementsByTagName("script");if(n.length>0)for(var r=0;r<n.length;r++){var a=n[r],o=a.attributes;e(o,t)}return t}function n(e){void 0!==e.name&&require([e.name],function(t){var n=e.target?document.querySelector(e.target):document.body,r=new t;r.start(n)})}document.addEventListener("DOMContentLoaded",function(){n(t())},!1)}();