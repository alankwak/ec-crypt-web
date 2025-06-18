function isPrime(num) {
    if (num < 2) return false;
    for (let i = 2; i * i <= num; i++) {
      if (num % i === 0) return false;
    }
    return true;
}

const form = document.getElementById('ecForm');
const error = document.getElementById('error');
const modin = document.getElementById('mod');
const ain = document.getElementById('a');
const bin = document.getElementById('b');

form.addEventListener('submit', function(e) {
  const mod = parseInt(modin.value, 10);
  const a = parseInt(ain.value, 10);
  const b = parseInt(bin.value, 10);

  if (!isPrime(mod)) {
    e.preventDefault();
    error.innerHTML = "Mod must be a prime number.";
  } else if ((4*a*a*a + 27*b*b) % mod === 0) {
    e.preventDefault();
    error.innerHTML = `Invalid elliptic curve parameters (4a^3 + 27b^2 (mod${mod})= 0).`;
  } else{
    error.innerHTML = "";
    ain.value = a;
  }
});