const Validator = {
	ISBN: new RegExp('^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$'),
	DOMAIN: 'abcdefghijklmnopqrstuvwxyz0123456789-.',
	DIGITS: [1, 2, 3, 4, 5, 6, 7, 8, 9],
	watchNum: function(field) {
		field.addEventListener('input', (event) => {
			field.value = field.value.split('').filter(x => this.DIGITS.includes(Number(x))).join('')
		});
	},
	fieldMail: function(field) {
		let DM = this.DOMAIN;
		let validatorFn = field.validatorFn || function() {};
		field.validatorFn = function() {
			let res = validatorFn.apply(this, arguments);
			if(res && res.error)
				return res;

			let value = field.value;

			let acc = false;
			let at = false;
			let domain = '';
			for(let i = 0; i < value.length; i++) {
				if(value[i] != '@') {
					if(!at)
						acc = true;
					else if(DM.includes(value[i].toLower()))
						domain += value[i];
					else
						return { error: 'Błędny znak w zapisie domeny.' }
				} else if(!at) {
					at = true;
				} else {
					return { error: 'Dwa wystąpienia znaku @ w adresie email.' }
				}
			}
			
			if(domain.startsWith('-') || domain.startsWith('.'))
				return { error: 'Błędny zapis domeny w adresie email.' }
			if(!acc)
				return { error: 'Brak identyfikatora adresu email.' }
			if(!at)
				return { error: 'Brak znaku @ w adresie email.' }
			if(domain.length == 0)
				return { error: 'Brak domeny w adresie email.' }

			return true;
		}
	},
	fieldISBN: function(field) {
		let validatorFn = field.validatorFn || function() {};
		field.validatorFn = function() {
			let res = validatorFn.apply(this, arguments);
			if(res && res.error)
				return res;

			let matches = field.value.match(this.ISBN);
			console.log(matches);
			if(matches.length != 0 && matches[0] != field.value) {
				return { error: "Zły numer ISBN." }
			}
		}
	}
};

const form = document.querySelector('form');
const nums = document.querySelectorAll('*[id="wiek"], *[id="pesel"], *[id="tel"]');
const mails = document.querySelectorAll('*[id="email"]');
const isbn = document.querySelectorAll('*[id="isbn"]');

nums.forEach(x => Validator.watchNum(x));
mails.forEach(x => Validator.fieldMail(x));
isbn.forEach(x => Validator.fieldISBN(x));

form.addEventListener('submit', (event) => {
	event.preventDefault();
	[...form.elements].forEach(element => {
		if(element.validatorFn != undefined) {
			let result = element.validatorFn();
			if(result && result.error) {
				event.preventDefault();
				alert(result.error);
			}
		}
	});
});