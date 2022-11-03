const Validator = {
	DOMAIN: 'abcdefghijklmnopqrstuvwxyz0123456789-.',
	DIGITS: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
	watchNum: function(field) {
		field.addEventListener('input', (event) => {
			field.value = field.value.split('').filter(x => this.DIGITS.includes(Number(x))).join('')
		});
	},
	fieldRequired: function(field) {
		let validatorFn = field.validatorFn || function() {};
		field.validatorFn = function() {
			let res = validatorFn.apply(this, arguments);
			if(res && res.error)
				return res;

			let value = field.value.trim();
			if(!value || value.length == 0) {
				return { error: "Brak wymaganego pola" };
			}
			return true;
		}
	},
	fieldMail: function(field) {
		let DM = this.DOMAIN;
		let validatorFn = field.validatorFn || function() {};
		field.validatorFn = function() {
			let res = validatorFn.apply(this, arguments);
			if(res && res.error)
				return res;

			let value = field.value.trim();

			let acc = false;
			let at = false;
			let domain = '';
			for(let i = 0; i < value.length; i++) {
				if(value[i] != '@') {
					if(!at)
						acc = true;
					else if(DM.includes(value[i].toLowerCase()))
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
	fieldPesel: function(field) {
		let validatorFn = field.validatorFn || function() {};
		field.validatorFn = function() {
			let res = validatorFn.apply(this, arguments);
			if(res && res.error)
				return res;

			let value = field.value.trim();

			let weight = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
			let sum = 0;
			let ctrl = Number(value.substring(10, 11));

			const plec = document.querySelector('#plec').value.trim().toLowerCase();

			if(plec == 'k' && Number(value[10]) % 2 != 0) {
				return { error: 'Błędny pesel.' }
			}

			if(plec == 'm' && Number(value[10]) % 2 == 0) {
				return { error: 'Błędny pesel.' }
			}

			for (let i = 0; i < weight.length; i++) {
				sum += (Number(value.substring(i, i + 1)) * weight[i]);
			}
			sum = sum % 10;
			
			if((10 - sum) % 10 != ctrl) {
				return { error: 'Błędny pesel.' }
			}

			return true;
		}
	},
	fieldISBN: function(field) {
		let validatorFn = field.validatorFn || function() {};
		field.validatorFn = function() {
			let res = validatorFn.apply(this, arguments);
			if(res && res.error)
				return res;

			/*let value = field.value.trim().replaceAll('-', '');
			if(value.length == 10) {
				let sum = 0;
				for(let i = 0; i < 10; i++) {
					let num = Number(value[i]);
					sum += num * (10 - i);
				}
				if(sum % 11 != 0) {
					return { error: 'Błędny ISBN.' }
				}
			} else if (value.length == 13) {
				let sum = 0;
				for(let i = 0; i < 10; i++) {
					let num = Number(value[i]);
					sum += num * (i % 2 == 0 ? 1 : 3);
				}
				let mod = sum % 10;
				if(mod != 0) {
					let check = 10 - mod;
					if(value[value.length - 1] != check) {
						return { error: 'Błędny ISBN.' }
					}
				}
			} else {
				return { error: 'Błędny ISBN.' }
			}*/

			return true;
		}
	},
};

const form = document.querySelector('form');
const nums = document.querySelectorAll('#wiek, #pesel, #telefon');
const mails = document.querySelectorAll('#email');
const required = document.querySelectorAll('#imie, #nazwisko, #email, #pesel, #plec, #telefon, #klasa, #tytul, #wydawca, #isbn, #ewid');
const pesel = document.querySelector('#pesel');
const isbn = document.querySelector('#isbn');

nums.forEach(x => Validator.watchNum(x));
mails.forEach(x => Validator.fieldMail(x));
required.forEach(x => Validator.fieldRequired(x));
Validator.fieldPesel(pesel);
Validator.fieldISBN(isbn);

form.addEventListener('submit', (event) => {
	event.preventDefault();
	let err = false;
	[...form.elements].forEach(element => {
		if(element.validatorFn != undefined) {
			let result = element.validatorFn();
			if(result && result.error) {
				event.preventDefault();
				alert(result.error);
				err = true;
			}
		}
	});
	if(!err)
		alert('Super, nie ma serwera ale formularz przeszedł');
});