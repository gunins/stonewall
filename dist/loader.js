/*! stonewalljs 2017-04-21 */
!function(global){function getData(script,dataset){var data=script.dataset,keys=Object.keys(data);keys.length>0&&keys.forEach(function(key){dataset[key]=data[key]})}function getDataSet(){var dataset={},scripts=document.getElementsByTagName("script");if(scripts.length>0)for(var a=0;a<scripts.length;a++)getData(scripts[a],dataset);return dataset}function containerStart(dataset){if(void 0!==dataset.name){var config=[["es6Features"],function(cb){cb(function(){require(["widget/App"],function(){require({},[dataset.name],function(App){var container=dataset.target?document.querySelector(dataset.target):document.body,app=new App;app.start(container)})})})}];"true"!==dataset.dev&&config.unshift({baseUrl:(dataset.baseurl?dataset.baseurl:"./target/")+checkEs6,templateDecoders:["coders/component/cpDecoder","coders/placeholders/plDecoder","coders/databind/bdDecoder","coders/style/styleCoder","coders/router/routerDecoder"]}),require.apply(global,config)}}var es6Samples=["class Foo {}","const bar = (x) => x+1",'function Bar(a="a"){};',"function Foo(...a){return [...a]}","let [a,b,c]=[1,2,3]"],checkEs6=function(){"use strict";try{es6Samples.forEach(eval)}catch(e){return"es5"}return"es6"}();define("es6Features",["require"],function(require){function testGlobal(method){return void 0===global[method]}var methods=["Map","Set","Symbol"];return function(done){methods.filter(testGlobal).length>0?require(["babel/polyfill"],function(){done()}):done()}.bind(this)}),document.addEventListener("DOMContentLoaded",function(){containerStart(getDataSet())},!1)}(this);