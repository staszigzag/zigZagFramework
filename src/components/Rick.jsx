import { createVNode as h } from '../ZZFramework/vdom'

const Rick = props => {
    return (
        <div class="card">
            <p class="card__full-name">
                <span class="card__first-name">{props.firstName}</span>
                <span class="card__last-name">{props.lastName}</span>
            </p>
            <div class="card__wrap">
                <button onclick={() => props.handlerClickIncrement()}>Прожить год жизни</button>
                <span class="card__age">{props.age}</span>
            </div>
            <input class="card__input-msg" oninput={evt => props.handlerInputMsg(evt.target.value)}/>
            <p class="card__title">{props.msg ? `Ваше сообщение:` : ''}</p>
            <p class="card__msg">{props.msg}</p>
        </div>
    )
}

export default Rick