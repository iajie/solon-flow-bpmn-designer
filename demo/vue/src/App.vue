<template>
    <div>
        <button @click="setProps('lang')">切换语言(当前{{lang}})</button>
        <button @click="setProps('theme')">切换主题({{theme}})</button>
        <button @click="panelShow">属性面板显隐</button>
        <solon-flow-designer ref="designer" :value="value" :theme="theme" :lang="lang" :type="type" :height="95" @change="onChange"/>
    </div>
</template>

<script>
export default {
    data() {
        return {
            value: '',
            designer: null,
            theme: 'light',
            lang: 'zh',
            type: 'yaml',
        }
    },
    methods: {
        onChange(data) {
            this.value = data;
        },
        setProps(type) {
            if (type === "theme") {
                this.theme = this.theme === 'dark' ? 'light' : 'dark';
            }else {
                this.lang = this.lang === 'zh' ? 'en' : 'zh'
            }
        },
        panelShow() {
            console.log(this.$refs.designer.panelShow());
            // this.$refs.designer.panelShow();
        }
    }
}
</script>
