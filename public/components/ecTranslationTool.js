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
            <style>
                :host {
                    width: 100%;
                    font-family: Arial, sans-serif;
                    margin-top: 30px;
                    display: flex;
                    justify-content: center;
                }

                #translator {
                    padding: 20px 30px;
                    border-radius: 10px;
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
                    max-width: 700px;
                    width: 100%;
                    box-sizing: border-box;
                }

                label[for="message"] {
                    font-weight: bold;
                    display: block;
                    margin-bottom: 8px;
                }

                .form-content {
                    display: flex;
                    gap: 20px;
                    align-items: flex-start;
                    margin-bottom: 20px;
                }

                textarea {
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 6px;
                    resize: vertical;
                    font-family: monospace;
                    font-size: 14px;
                    width: 100%;
                    height: 100px;
                }

                .sidebar {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    margin-top: 25px;
                }

                .sidebar label {
                    font-weight: normal;
                    display: flex;
                    align-items: center;
                    font-size: 14px;
                }

                .sidebar input[type="radio"] {
                    margin-right: 6px;
                }

                .sidebar button {
                    padding: 8px 16px;
                    border: none;
                    background-color: #007bff;
                    color: white;
                    font-size: 14px;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }

                .sidebar button:hover {
                    background-color: #0056b3;
                }

                #output-box {
                    width: 100%;
                    height: 100px;
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 6px;
                    font-family: monospace;
                    font-size: 14px;
                    background-color: #f9f9f9;
                    resize: none;
                    white-space: pre-wrap;
                    overflow: auto;
                    box-sizing: border-box;
                }
            </style>

            <form id="translator">
                <label for="message">Enter your message:</label>
                <div class="form-content">
                    <textarea id="message" name="message">${existingMessage}</textarea>
                    <div class="sidebar">
                        <label for="encrypt">
                            <input type="radio" id="encrypt" name="messageAction" value="encrypt" required>
                            Encrypt
                        </label>
                        <label for="decrypt">
                            <input type="radio" id="decrypt" name="messageAction" value="decrypt">
                            Decrypt
                        </label>
                        <button type="submit">Translate</button>
                    </div>
                </div>

                <textarea id="output-box" readonly placeholder="Output will appear here...">${this.output}</textarea>
            </form>
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