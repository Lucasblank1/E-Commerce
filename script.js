(function(){
	const priceElement = document.querySelector('.price-now');
	const selectParcelas = document.getElementById('parcelas');
	const valorParcela = document.getElementById('valor-parcela');
	const buyForm = document.getElementById('buy-form');
	const buyButton = document.getElementById('btn-comprar');
	const year = document.getElementById('ano');

	if(year){ year.textContent = new Date().getFullYear(); }

	function parsePreco(value){
		// Accepts both data-preco attribute (dot as decimal) and displayed BRL text
		const attr = priceElement?.getAttribute('data-preco');
		if(attr){ return parseFloat(attr); }
		const numbers = (value || '').replace(/[^0-9,.-]/g,'').replace('.', '').replace(',', '.');
		const parsed = parseFloat(numbers);
		return isNaN(parsed) ? 0 : parsed;
	}

	function formatBRL(num){
		return num.toLocaleString('pt-BR', { style:'currency', currency:'BRL' });
	}

	function updateInstallment(){
		const preco = parsePreco(priceElement?.textContent || '');
		const n = parseInt(selectParcelas?.value || '1', 10);
		if(!valorParcela) return;
		if(!n || n <= 1){
			valorParcela.textContent = `à vista: ${formatBRL(preco)}`;
			return;
		}
		const cada = preco / n; // sem juros
		valorParcela.textContent = `${n}x de ${formatBRL(cada)} sem juros`;
	}

	selectParcelas?.addEventListener('change', updateInstallment);
	updateInstallment();

	buyForm?.addEventListener('submit', function(e){
		e.preventDefault();
		buyButton.disabled = true;
		buyButton.textContent = 'Redirecionando...';
		// Simula checkout: abra WhatsApp com mensagem pré-preenchida
		const n = parseInt(selectParcelas?.value || '1', 10);
		const preco = parsePreco(priceElement?.textContent || '');
		const cada = n > 1 ? (preco / n) : preco;
		const msg = encodeURIComponent(`Olá! Quero comprar o Vocalis e Pet. Plano: ${n}x de ${formatBRL(cada)} (total ${formatBRL(preco)}).`);
		const url = `https://wa.me/?text=${msg}`;
		setTimeout(()=>{ window.location.href = url; }, 600);
		setTimeout(()=>{
			buyButton.disabled = false;
			buyButton.textContent = 'Comprar agora';
		}, 2200);
	});
})(); 