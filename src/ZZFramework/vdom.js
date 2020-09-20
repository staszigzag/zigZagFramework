// создать виртуальную ноду
export function createVNode(tag, props, children){
    return new vNode(
        tag,
        props,
        children
    )
}

export class vNode {
    constructor(tag, props, children){
        this.tag = tag
        this.props = props
        this.children = children
        this.$el = null
    }

    // монтирует виртуальную ноду в DOM
    mount(container){
        const el = document.createElement(this.tag)

        for(const prop in this.props) {
            // если есть хендлер то вешаем его на элемент
            if (prop.slice(0, 2) === 'on' && prop in el){
                el[prop] = this.props[prop]
            } else {
                el.setAttribute(prop, this.props[prop])
            }
        }
        // если примитив то назначаем его значение, если есть другие ноды то монтируем их
        // TODO добавить дополнительные типы примитивов
        if (typeof this.children === 'string' || typeof this.children === 'number'){
            el.textContent = this.children
        } else if (Array.isArray(this.children)){
            this.children.forEach(child => {
                child.mount(el)
            })
        }
        container.append(el)
        this.$el = el
    }

    // удаляет виртуальную ноду из DOM
    destroy(){
        if (!this.$el){
            console.error('node is not mounted')
            return
        }
        this.$el.remove()
    }

    // сравнивает разницу текущей и новой ноды, и если нужно вносит изменения
    patch(newVNode){
        if (!this.$el){
            console.error('node is not mounted')
            return
        }
        // разные теги
        if (this.tag !== newVNode.tag){
            // монтируем новую и удаляем текущую
            newVNode.mount(this.$el.parentNode)
            this.destroy()
        } else {

            newVNode.$el = this.$el
            // удаляем все атрибуты а затем назначаем новые
            // TODO нужно оптммизировать это, например проверять на равенство
            while(newVNode.$el.attributes.length > 0) {
                // TODO удалить обработчики событий
                newVNode.$el.removeAttribute(newVNode.$el.attributes[0].name)
            }
            for(const prop in newVNode.props) {
                // если есть хендлер то вешаем его на элемент
                if (prop.slice(0, 2) === 'on' && prop in newVNode.$el){
                    newVNode.$el[prop] = newVNode.props[prop]
                } else {
                    newVNode.$el.setAttribute(prop, newVNode.props[prop])
                }
            }
            // монтируем чилдренов новой ноды
            if (typeof newVNode.children === 'string' || typeof newVNode.children === 'number'){
                newVNode.$el.textContent = newVNode.children
            } else if (Array.isArray(newVNode.children)){
                // если в старой ноде чилдрен был примитив то сбрасываем его и монтируем новые ноды
                if (typeof this.children === 'string' || typeof this.children === 'number'){
                    newVNode.$el.textContent = null
                    newVNode.children.forEach(child => {
                        child.mount(newVNode.$el)
                    })
                    // а это если были дочернии ноды
                } else if (Array.isArray(this.children)){
                    const commonLength = Math.min(this.children.length, newVNode.children.length)
                    // меняем общие ноды
                    for(let i = 0; i < commonLength; i++) {
                        this.children[i].patch(newVNode.children[i])
                    }
                    // у старой ноды было больше дочених нод чем у новой, удаляем их
                    if (this.children.length > newVNode.children.length){
                        this.children.slice(newVNode.children.length).forEach(child => {
                            child.destroy()
                        })
                        // у новой ноды больше дочених нод чем у старой, монтируем новые
                    } else if (newVNode.children.length > this.children.length){
                        newVNode.children.slice(this.children.length).forEach(child => {
                            child.mount(this.$el)
                        })
                    }
                }
            }
        }
    }
}





