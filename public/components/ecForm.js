class ecForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.a = null;
        this.b = null;
        this.mod = 13;
    }

    static get observedAttributes() {
        return ['a', 'b', 'mod'];
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-family: Arial, sans-serif;
                }

                #ecForm {
                    background: white;
                    padding: 20px 30px;
                    border-radius: 10px;
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }

                input[type=number]::-webkit-outer-spin-button,
                input[type=number]::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }

                input[type=number] {
                    -moz-appearance: textfield;
                    width: 50px;
                    padding: 5px;
                    margin: 0 5px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    text-align: center;
                }

                button {
                    margin-top: 10px;
                    padding: 8px 16px;
                    border: none;
                    background-color: #007bff;
                    color: white;
                    font-size: 14px;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }

                button:hover {
                    background-color: #0056b3;
                }

                #error {
                    display: block;
                    margin-top: 5px;
                    color: red;
                    font-size: 0.9em;
                }
            </style>
        
            <form id="ecForm">
                <div>
                    <h3>Enter elliptic curve parameters:</h3>
                    <span>y² ≡ x³ +</span>
                    <input type="number" style="width: 40px" id="a" name="a" placeholder="a" step="1" value="${this.a !== null ? this.a : ''}" required>
                    <span>x +</span>
                    <input type="number" style="width: 40px" id="b" name="b" placeholder="b" step="1" value="${this.b !== null ? this.b : ''}" required>
                    <span>( mod </span>
                    <input type="number" style="width: 40px" id="mod" name="mod" min="3" max="149" step="1" value="${this.mod}" required>
                    <span>)</span>
                    <span id="error" style="color: red;"></span>
                    <br>
                    <button type="submit" class="btn btn-primary">Submit</button>
                </div>
            </form>
        `;

        function isPrime(num) {
            if (num < 2) return false;
            for (let i = 2; i * i <= num; i++) {
            if (num % i === 0) return false;
            }
            return true;
        }

        const form = this.shadowRoot.getElementById('ecForm');
        const error = this.shadowRoot.getElementById('error');
        const modin = this.shadowRoot.getElementById('mod');
        const ain = this.shadowRoot.getElementById('a');
        const bin = this.shadowRoot.getElementById('b');

        form.addEventListener('submit', e => {
            e.preventDefault();
            const mod = parseInt(modin.value, 10);
            const a = parseInt(ain.value, 10);
            const b = parseInt(bin.value, 10);

            if (!isPrime(mod) || mod >= 200) {
                error.innerHTML = "Mod must be a prime number.";
            } else if ((4*a*a*a + 27*b*b) % mod === 0) {
                error.innerHTML = `Invalid elliptic curve parameters (4a³ + 27b² (mod${mod}) = 0).`;
            } else {
                error.innerHTML = "";
                this.a = a;
                this.b = b;
                this.mod = mod;
                this.dispatchEvent(new CustomEvent('create-new-curve', {
                    bubbles: true,
                    composed: true,
                }))
            }
        });
    }
}

customElements.define('ec-ecform', ecForm);