// создать виртуальную ноду
export function createVNode(tag, props, ...children){
    // проверка для отдельных компонентов
    if (typeof tag === 'function') return tag(props, children)

    return new vNode(
        tag,
        props,
        children
    )
}

function isPrimitive(val){
    // TODO добавить дополнительные типы примитивов
    return typeof val === 'string' || typeof val === 'number'
}

export class vNode {
    constructor(tag, props, children){
        this.tag = tag
        this.props = props || {}
        this.children = children || []
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
        this.children.forEach(child => {
            if (isPrimitive(child)){
                el.textContent = child
            } else if (child instanceof vNode){
                child.mount(el)
            }
        })

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
            const commonLength = Math.min(this.children.length, newVNode.children.length)
            // меняем общие ноды
            for(let i = 0; i < commonLength; i++) {
                // примитивы
                if (isPrimitive(newVNode.children[i]) && isPrimitive(this.children[i])){
                    // TODO проверка на равенство
                    newVNode.$el.textContent = newVNode.children[i]
                    // если в старой ноде чилдрен был примитив то сбрасываем его и монтируем новые ноды
                } else if (!isPrimitive(newVNode.children[i]) && isPrimitive(this.children[i])){
                    newVNode.$el.textContent = null
                    newVNode.children[i].mount(newVNode.$el)
                    // если в новой ноде чилдрен примитив а в старой чилдрее состовной
                } else if (isPrimitive(newVNode.children[i]) && !isPrimitive(this.children[i])){
                    this.children[i].destroy()
                    newVNode.$el.textContent = newVNode.children[i]
                    // дочернии ноды
                } else if (!isPrimitive(newVNode.children[i]) && !isPrimitive(this.children[i])){
                    this.children[i].patch(newVNode.children[i])
                }
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





