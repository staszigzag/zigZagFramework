import { createVNode as h } from '../ZZFramework/vdom'

const Morty = props => {
    return (
        <div class="card-new">
            <h2 class="card-new__full-name">
                <span class="card-new__first-name">{props.firstName}</span>
                <span class="card-new__last-name">{props.lastName}</span>
            </h2>
        </div>
    )

    // альтернатива jsx
    // return h('div', {class: 'card-new'},
    //     h('p', {class: 'card-new__full-name'},
    //         h('span', {class: 'card-new__first-name'}, props.firstName),
    //         h('span', {class: 'card-new__last-name'}, props.lastName)
    //     )
    // )
}

export default Morty