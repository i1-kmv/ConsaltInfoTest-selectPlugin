const getTemplate = (data = [], placeholder, selectedId) => {
    let text = placeholder || 'Placeholder default'

    const items = data.map(item => {
        let clazz = ''
        if (item.id === selectedId) {
            text = item.value
            clazz = 'selected'
        }
        return `
             <li class="select__item ${clazz}" data-type='item' data-id="${item.id}">${item.value}</li>
        `

    })
    return `
    <div class="select__closearea" data-type="close"></div>
    <div class="select__input" data-type="input">
        <span data-type="value">${text}</span>
        <i class="fas fa-chevron-circle-down" data-type="icon"></i>
    </div>
    <div class="select__dropdown">
        <ul class="select__list">
           ${items.join('')} 
        </ul>
    </div>
    `
}


class Select {
    constructor(selector, options) {
        this.elem = document.querySelector(selector)
        this.options = options
        this.selectedId = options.selectedId
        this.#render()
        this.#setup()
    }

    #render() {
        const {placeholder, data} = this.options
        this.elem.classList.add('select')
        this.elem.innerHTML = getTemplate(data, placeholder, this.selectedId)
    }

    #setup() {
        this.clickHandler = this.clickHandler.bind(this)
        this.elem.addEventListener('click', this.clickHandler)
        this.icon = this.elem.querySelector("[data-type = 'icon']")
        this.value = this.elem.querySelector("[data-type = 'value']")
    }

    clickHandler(e) {
        const { type } = e.target.dataset
        if (type === 'input') {
            this.toggle()
        } else if (type === 'item') {
            const id = e.target.dataset.id
            this.select(id)
        } else if (type === 'close') {
            this.close()
        }
    }

    get current() {
        return this.options.data.find(item => item.id === this.selectedId)
    }

    get isOpen() {
        return this.elem.classList.contains('open')
    }

    toggle() {
        this.isOpen ? this.close() : this.open()
    }

    select(id) {
        this.selectedId = id
        this.value.textContent = this.current.value
        this.elem.querySelectorAll('[data-type="item"]').forEach(item => {
            item.classList.remove('selected')
        })
        this.elem.querySelector(`[data-id="${id}"]`).classList.add('selected')
        this.options.onSelect ? this.options.onSelect(this.current) : null
        this.close()
    }


    open() {
        this.elem.classList.add('open')
        this.icon.classList.remove('fa-chevron-circle-down')
        this.icon.classList.add('fa-chevron-circle-up')
    }


    close() {
        this.elem.classList.remove('open')
        this.icon.classList.remove('fa-chevron-circle-up')
        this.icon.classList.add('fa-chevron-circle-down')

    }

    destroy() {
        this.elem.remove('click', this.clickHandler)
        this.elem.innerHTML = ''
    }




}


const select = new Select('#select', {
    placeholder: 'Select item',
    selectedId: '2',
    data: [
        {id: '1', value: 'HTML'},
        {id: '2', value: 'CSS'},
        {id: '3', value: 'JS'},
        {id: '4', value: 'React'},
        {id: '5', value: 'Redux'},
        {id: '6', value: 'Vue'},
    ],
    onSelect(item) {
        console.log('Selected item', item)
    }
});

window.s = select

