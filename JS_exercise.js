/* Lista de exemplos em java script */


const btn = document.querySelector('button');
btn.addEventListener('click', () => {
    btn.textContent = 'Mim clicou ai ai ai ai';
    setTimeout(() => {
        btn.textContent = 'Mim aperta';
    }, 1000)
});
