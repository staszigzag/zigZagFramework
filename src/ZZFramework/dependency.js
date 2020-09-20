export default class Dependency {
    constructor(){
        this.subscribers = new Set()
    }

    depend(activeEffect){
        if (activeEffect) this.subscribers.add(activeEffect)
    }

    notify(){
        this.subscribers.forEach(subscriber => subscriber())
    }
}