import Dependency from './dependency'
import { createVNode } from './vdom'

export default class ZigZag {
    constructor({data, watch, methods, render, el}){
        this.$rootEl = document.querySelector(el)
        this.activeEffect = null
        this.rootVNode = null

        // добавляем реактивность данным
        this.setReactiveData(data)
        // добавляем наблюдение за методами
        this.setWatchMethods(watch)
        // добавляем методы без наблюдения
        this.setMethods(methods)
        // отрисовываем великолепное приложение))
        this.$render(render)
    }

    setReactiveData(data){
        Object.keys(data).forEach(key => {
            // создаем в замыкинии хранилище для функций от которых будет зависеть свойство из данных
            const dep = new Dependency()
            let value = data[key]

            // добляем наблюдение за своиствами, а так же переносим их в корень
            Object.defineProperty(this, key, {
                get(){
                    // передаем в зависемости функцию которай использует свойство
                    dep.depend(this.activeEffect)
                    return value
                },
                set(newValue){
                    if (newValue !== value){
                        value = newValue
                        // при новом значении вызываем все зависемости для свойств
                        dep.notify()
                    }
                }
            })
        })
    }

    setWatchMethods(methods){
        // добляем наблюдение за методами, а так же переносим их в корень
        Object.keys(methods).forEach(key => {
            // добавляем текущий контекст
            const fn = methods[key].bind(this)
            this[key] = (...arg) => {
                // в момент вызова метода назначаем его активному эфекту(функции которая выполняется), что бы свойств которые в нем используются добавили его в свои зависемости
                this.activeEffect = fn
                fn(...arg)
                this.activeEffect = null
            }
            this[key]()
        })
    }

    setMethods(methods){
        // добляем обычные методы в корень, а так же привязываем контекст
        Object.keys(methods).forEach(key => {
            const fn = methods[key].bind(this)

            this[key] = (...arg) => {
                return fn(...arg)
            }
        })
    }

    // монтирует виртуальную ноду
    // т.ж. этой функцией можно после создания повторно отрисовать приложение
    // TODO добавить тоочечную перерисовку
    $render(fn){
        // создаем корневую рендер функцию, которая отрисует входную функцию в текущем контексте
        const renderRoot = () => {
            const newVNode = fn.call(this, createVNode)
            // первая отрисовка, тогда монтируем
            if (!this.rootVNode){
                this.rootVNode = newVNode
                newVNode.mount(this.$rootEl)
                // следующая отрисовка, токда изменяем
            } else {
                this.rootVNode.patch(newVNode)
                this.rootVNode = newVNode
            }
        }
        // назначаем её активному эфекту(функции которыя выполняется), что бы свойств которые в ней используются добавили ее в свои зависемости
        this.activeEffect = renderRoot
        renderRoot()
        this.activeEffect = null
    }
}