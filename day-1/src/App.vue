<template>
    <div>
        hello vue
        <li v-for="(todo,index) in todos" :key="index">{{todo}}</li>
    </div>
</template>


<script lang="ts">
import {Component,Vue} from 'vue-property-decorator';

@Component({
    components:{
        // todo...
    }
})
export default class Todo extends Vue{
    public todos:string[] = ['香蕉','苹果','橘子']
}   
</script>