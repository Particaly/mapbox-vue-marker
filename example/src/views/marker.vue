<template>
    <div class="vuemarker" :style="{background:randomColor}">V</div>
</template>

<script>
    export default {
        name: "vuemarker",
        data:function(){
            return {
                randomColor:''
            }
        },
        //props默认传入了marker对象和构造marker的vue实例
        props:['marker','parent'],
        mounted() {
            this.randomColor = `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`
            console.log(this);
        },
        /*
        * marker在被添加到地图上和被移除的时候，默认会调用一下两个方法作为回调
        * */
        methods:{
            onAdd(){
                console.log('added');
            },
            onRemove(){
                console.log('removed');
            }
        },
    }
</script>

<style scoped>
.vuemarker{
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: #42b983;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 128px;
    font-weight: bold;
}
</style>