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
            <form id="ecForm">
                <div>
                    <style>
                        input[type=number]::-webkit-outer-spin-button,
                        input[type=number]::-webkit-inner-spin-button {
                            -webkit-appearance: none;
                            margin: 0;
                        }

                        input[type=number] {
                            -moz-appearance: textfield;
                        }
                    </style>
                    <span>y² ≡ x³ +</span>
                    <input type="number" style="width: 40px" id="a" name="a" placeholder="a" step="1" value="${this.a !== null ? this.a : ''}" required>
                    <span>x +</span>
                    <input type="number" style="width: 40px" id="b" name="b" placeholder="b" step="1" value="${this.b !== null ? this.b : ''}" required>
                    <span>( mod </span>
                    <input type="number" style="width: 40px" id="mod" name="mod" min="3" step="1" value="${this.mod}" required>
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
                error.innerHTML = "Mod must be a prime number less than 200.";
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