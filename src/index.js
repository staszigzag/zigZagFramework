import ZigZag from './ZZFramework/core'


const app = new ZigZag({
    el: '#app',
    // свойство которые будут реактивны и доступны в методах или рендер функции
    data: {
        firstName: 'Rick',
        lastName: 'Sanchez',
        age: 70,
        msg: ''
    },
    // методы за которыми будет установленно наблюдение, и они будут вызываться когда изменятся свойства внитри их.
    // они вызываются при создании
    watch: {
        fullName(){
            console.log(`%c Полное имя ${this.firstName} ${this.lastName}`, 'color: red; font-size: 22px')
        },
        ageLogger(){
            console.log(`%c Текущий возраст ${this.age}`, 'color: green; font-size: 16px')
        }
    },
    // обычные методы которые можно использовать например в рендер функции
    methods: {

        handlerInputMsg(msg){
            this.msg = msg
        },
        handlerClickIncrement(){
            this.age++
        }
    },
    // рендер функции, возвращает виртуальную ноду, которай монтируется при создании
    render(h){
        return h('div', {class: 'card'}, [
            h('p', {class: 'card__full-name'}, [
                h('span', {class: 'card__first-name'}, this.firstName),
                h('span', {class: 'card__last-name'}, this.lastName)
            ]),
            h('div', {class: 'card__wrap'}, [
                h('button', {onclick: () => this.handlerClickIncrement()}, `Прожить год жизни`),
                h('span', {class: 'card__age'}, this.age)
            ]),
            h('input', {class: 'card__input-msg', oninput: (evt) => this.handlerInputMsg(evt.target.value)}, ''),
            h('p', {class: 'card__title'}, this.msg ? `Ваше сообщение:` : ''),
            h('p', {class: 'card__msg'}, this.msg)
        ])
    }
})

document.getElementsByClassName('btn-switch')[0].addEventListener('click', () => {
    // после монтирования можно на лету изменять свойства, и передать новую функциию для рендера
    app.firstName = 'Morty'
    app.lastName = 'Smith'
    // TODO если нет используемых своиств то сохраняется старая рендер функция
    app.$render(function(h){
        return h('div', {class: 'card-new'}, [
            h('p', {class: 'card-new__full-name'}, [
                h('span', {class: 'card-new__first-name'}, this.firstName),
                h('span', {class: 'card-new__last-name'}, this.lastName)
            ])
        ])
    })
})

