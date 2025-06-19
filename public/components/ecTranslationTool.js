class ecTranslationTool extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.output = '';
    }

    static get observedAttributes() {
        return ['output'];
    }

    async attributeChangedCallback(name, oldVal, newVal) {
        if(name === "output") {
            this.output = newVal;
        }
        this.render();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const existingMessage = this.shadowRoot.querySelector('#message')?.value || '';
        
        this.shadowRoot.innerHTML = `
        <form id="translator">
        <label for="message">Enter your message:</label> <br />
        <textarea id="message" name="message" cols="100">${existingMessage}</textarea>
        <label for="encrypt">
            <input type="radio" id="encrypt" name="messageAction" value="encrypt" required>Encrypt
        </label>
        <label for="decrypt">
            <input type="radio" id="decrypt" name="messageAction" value="decrypt">Decrypt
        </label>
        <br>
        <button type="submit" class="btn btn-primary">Translate</button>
        </form>
        <div>
        ${this.output}
        </div>
        `;

        const form = this.shadowRoot.getElementById('translator');

        form.addEventListener('submit', e => {
            e.preventDefault();
            const option = this.shadowRoot.querySelector('input[name="messageAction"]:checked')?.value;
            if(option === 'encrypt') {
                this.dispatchEvent(new CustomEvent('request-encrypt', {
                    detail: {msg: this.shadowRoot.getElementById('message').value},
                    bubbles: true,
                    composed: true
                }));
            } else if (option === 'decrypt') {
                this.dispatchEvent(new CustomEvent('request-decrypt', {
                    detail: {msg: this.shadowRoot.getElementById('message').value},
                    bubbles: true,
                    composed: true
                }));
            }
        })
    }
}

customElements.define('ec-translator', ecTranslationTool);