/*
* 通过vue的render函数来构建组件
*
* 自动代理marker的层级关系，通过传入zIndex参数可手动代理
*
* 不要将marker存储在vue的data中，这将会造成性能问题，markerbox的功能已实现
*
* Powered By J.S.Patrick   980141374@qq.com
* */
import { version } from '../package.json';
import { log } from '@jspatrick/helper';
let vue,mapboxgl,router,store,EventProxy,plug,databox;
/*
* 存储不同页面的不同数据盒子
* */
databox = {
    removeBox:function (path) {
        databox[path] = undefined;
    }
};
/*
* 存放当前页面下的所有类型的marker盒子
* */
class MarkerBox{
    constructor(path){
        this.box = {
            other:[]
        };
        this.hookTrigger = {};
        this.path = path;
    }
    pushMarker(marker,type){
        if(isType('String',type)){
            if(this.box.hasOwnProperty(type)){
                this.box[type].push(marker)
            }else{
                this.box[type] = [marker];
            }
        }else{
            this.box.other.push(marker);
        }
        const vm = marker._vue_parent;
        if(vm){
            const id = vm._uid.toString();
            if(!this.hookTrigger[id]){
                this.hookTrigger[id] = [marker];
                vm.$once('hook:beforeDestroy', () => {
                    let box = [...this.hookTrigger[id]];
                    this.hookTrigger[id] = null;
                    $removeMarker(box);
                });
            } else {
                this.hookTrigger[id].push(marker);
            }
        }
    }
    getMarkerBox(){
        return this.box;
    }
    clear() {
        const box = this.box;
        this.box = {
            other:[]
        };
        $removeMarker(box);
    }
}
/*
* 插件配置对象
* */
plug = {
    install,
    version,
    log:true,
};
/*
* 把marker添加到地图上
*
* params target 可以是数组、对象和通过本插件构造的marker本身,将遍历传入对象所包含的所有marker
*
* parmas map 实例化的mapbox的地图对象
* */
function $addMarker(target,map){
    if(isType('Object',target)||isType('Array',target)){
        if(target._isVueMarker){
            //如果目标是marker
            if(target._vue_parent?._isDestroyed || target._vue_parent?._isBeingDestroyed){
                return console.warn('添加marker时，因为父组件已被销毁，所以上图被阻止了');
            }
            target.addTo(map)
        }else{
            //如果不是marker
            for(let keys in target){ // 遍历目标
                if(target[keys]._isVueMarker){
                    if(target._vue_parent?._isDestroyed || target._vue_parent?._isBeingDestroyed){
                        return console.warn('添加marker时，因为父组件已被销毁，所以上图被阻止了');
                    }
                    target[keys].addTo(map)
                }else if(target[keys].constructor === Array||target[keys].constructor === Object){
                    //仅在目标是对象或数组的情况下继续遍历
                    $addMarker(target[keys],map)
                }
            }
        }
    }
}
/*
* 从地图上移除marker
*
* params target 可以是数组、对象和通过本插件构造的marker本身,将遍历传入对象所包含的所有marker
* */
function $removeMarker(target){
    if(isType('Object',target)||isType('Array',target)){
        if(target._isVueMarker){
            target.remove();
        }else{
            for(let keys in target){ // 遍历目标
                if(target[keys]._isVueMarker){
                    target[keys].remove()
                }else if(target[keys].constructor === Array||target[keys].constructor === Object){
                    //仅在目标是对象或数组的情况下继续遍历
                    $removeMarker(target[keys]);
                }
            }
        }
    }
}
/*
* 制作marker并返回marker对象
*
* parmas options 配置对象
*
* options:{
*       lnglat :Object|Array            ->  能被mapbox识别的经纬度类型,如果不传默认为
*       component :Any(Must)            ->  marker的vue组件
*       anchor :String                  ->  详情见mapbox的marker配置
*       props  :Object                  ->  传入vue组件的props
*       draggable :Boolean              ->  扎点是否可拖动
*       zIndex :Number                  ->  扎点dom的层级
* }
* */
function $makeMarker(options){
    // 预检查必要属性是否存在
    if(!options){return false}
    if(!options.lnglat){
        plug.log&&log('Marker\'s longitude and latitude are undefined')
        options.lnglat = {lng: 116.39146176546785, lat: 39.9031645721154}
    }
    if(!options.component){throw new Error('缺少vue组件')}
    if(!options.anchor){options.anchor = 'bottom'}
    if(!options.props){options.props={}}
    if(!options.draggable){options.draggable=false}

    // 创建根dom
    let div = document.createElement('div');
    div.className = 'marker ';
    if(isType('String', options.className)){
        div.className += options.className
    }else if(isType('Array', options.className)){
        for (let i of options.className){
            div.className += ' '+i;
        }
    }
    // 创建根vue对象
    let extendOption = {template:div};
    // 创建marker对象
    let marker = new mapboxgl.Marker({
        element:div,
        anchor:options.anchor,
        draggable: options.draggable
    }).setLngLat(options.lnglat);
    overwrite(marker,options);
    // 向组件注入props
    options.props['marker'] = marker;
    options.props['parent'] = this;
    // 实例化根组件
    let prePointer = vue.extend(extendOption);
    const vuedom = new prePointer({
        el : div,
        router,
        store,
        render:h => h(options.component,{props:options.props},[])
    });

    //如果有层级参数，设置层级参数
    if(options.zIndex){
        marker._zIndex = options.zIndex;
    }
    // 挂载子组件到根dom
    marker.vue = vuedom.$children[0];
    marker._vue_parent = this;
    div.appendChild(vuedom.$el);
    
    if(options.mid){marker.mid = options.id}
    
    function overwrite(marker,options){
        marker._isVueMarker = true;
        marker.addTo = new Proxy(marker.addTo, {
            apply :function (target, thisArg, argArray) {
                let res = Reflect.apply(...arguments);
                addTo.bind(thisArg)();
                marker._isOnMap = true;
                return res
            }
        });
        marker.remove = new Proxy(marker.remove, {
            apply :function (target, thisArg, argArray) {
                let tempArg = arguments;
                remove.bind(thisArg)(() => {
                    Reflect.apply(...tempArg);
                    marker._isOnMap = false;
                });
            }
        });
        if(options.zIndex === undefined) {
            marker._update = new Proxy(marker._update, {
                apply :function (target, thisArg, argArray) {
                    let res = Reflect.apply(...arguments);
                    update.bind(marker)();
                    return res
                }
            });
        }
        function addTo(){
            if(this._zIndex){
                this.getElement().style.zIndex = this._map.getContainer().clientHeight + this._zIndex;
            }
            if(this.vue&&this.vue.onAdd){
                const mountReady = this.vue._isMounted;
                if(mountReady){
                    this.vue.onAdd();
                }else{
                    this.vue.$once('hook:mounted', this.vue.onAdd);
                }
            }
        }
        function remove(callback){
            if(this.vue&&this.vue.onRemove){
                const result = this.vue.onRemove(callback);
                if(result !== true){
                    const delay = Number(result);
                    if(!isNaN(delay)){
                        setTimeout(() => {
                            callback()
                        },delay)
                    }else{
                        callback()
                    }
                }else{
                    log('移除扎点的返回值为true，需要手动移除marker方法');
                }
            }else{
                callback()
            }
        }
        function update() {
            this.getElement().style.zIndex = ~~this._pos.y;
            try {
                this.vue.markerIndex = ~~this._pos.y;
            }catch (e) {
            
            }
        }
    }
    return marker
}

/*
* 验证类型
* */
function isType(type,target){
    const Tag = `[object ${type}]`;
    return Object.prototype.toString.call(target) === Tag
}
/*
* 函数中转代理，接收vue组件的this作用域
* */
EventProxy = {
    addMarkerHandler:function () {
        $addMarker(...arguments)
    },
    removeMarkerHandler:function () {
        $removeMarker(...arguments)
    },
    makeMarkerHandler:function (options) {
        if(!this||this._isDestroyed||this._isBeingDestroyed){
            return {}
        }
        let marker = $makeMarker.bind(this)(...arguments);
        if(options.usebox){
            if(this.$route&&this.$route.path){
                let path = this.$route.path.replace(/\//g,"_");
                if(!databox[path]){
                    databox[path] = new MarkerBox(path);
                }
                databox[path].pushMarker(marker, options.markerType);
            }else{
                let path = 'markerbox'+this._uid.replace(/\//g,"_");
                if(!databox[path]){
                    databox[path] = new MarkerBox(path);
                }
                databox[path].pushMarker(marker, options.markerType);
            }
        }
        return marker
    },
    getMarkerBox:function () {
        if(this.$route&&this.$route.path){
            let path = this.$route.path.replace(/\//g,"_");
            if(!databox[path]){
                databox[path] = new MarkerBox(path);
            }
            return databox[path].getMarkerBox();
        }
    }
};
/*
* 暴露给vue的安装函数，也是对整个命名空间的初始化
* */
function install(_vue,options) {
    vue = _vue;
    if(!options.mapboxgl){throw new Error('mapboxgl must be used as a parameter to Plug "mapbox-vue-marker" ')}
    if(options.router){
        router = options.router;
        router.afterEach((to, from) => {
            let toPath = to.path.replace(/\//g,"_");
            let fromPath = from.path.replace(/\//g,"_");
            if(!databox[toPath]){
                databox[toPath] = new MarkerBox(toPath);
            }
            if(databox[fromPath]){
                databox[fromPath].clear();
            }
        });
    }
    if(options.store){store = options.store}
    mapboxgl = options.mapboxgl;
    let namebox = {
        '$addMarker':'addMarkerHandler',
        '$removeMarker':'removeMarkerHandler',
        '$makeMarker':'makeMarkerHandler',
        '$getMarkerBox':'getMarkerBox'
    };
    if(!options.rename){
        vue.prototype.$addMarker = EventProxy.addMarkerHandler;
        vue.prototype.$removeMarker = EventProxy.removeMarkerHandler;
        vue.prototype.$makeMarker = EventProxy.makeMarkerHandler;
        vue.prototype.$getMarkerBox = EventProxy.getMarkerBox;
    }else{
        for(let i in namebox){
            let defaultName = i,
                name = options.rename[defaultName],
                handler = namebox[i];
            if(name){
                namebox[i] = name;
                vue.prototype[name] = EventProxy[handler];
            }else{
                vue.prototype[i] = EventProxy[handler];
            }
        }
    }
    plug.log&&log(`😁Mapbox-Vue-Marker ready Verson --> ${version}`)
    // vue.prototype._vueMarkerOption = namebox;
}

export default plug
