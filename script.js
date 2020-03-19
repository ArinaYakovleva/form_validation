'use strict';

// Код валидации формы
function validateForm(params) {
    var form = document.getElementById(params.formId);
    var elements = form.querySelectorAll('input');
    var elementsList = Array.prototype.slice.call(elements);

    var elemRequiredHandler = function (elem) {
        if (elem.hasAttribute('data-required')) {
            if (elem.value == '') {
                elem.classList.add(params.inputErrorClass);
                return true;
            }
        } else {
            if (elem.value == '') {
                return true;
            }
        }

        return false;
    };

    var elemLettersHandler = function (elem) {
        if (elem.dataset.validator == 'letters') {
            var reg = /^[a-zA-Zа-яА-ЯЁё]+$/;
            if (!reg.test(elem.value)) {
                elem.classList.add(params.inputErrorClass);
            }
            return true;
        }

        return false;
    };

    var elemNumberHandler = function (elem) {
        if (elem.dataset.validator == 'number') {
            if (isNaN(elem.value)) {
                elem.classList.add(params.inputErrorClass);
                return true;
            }

            checkNumsBorders(elem);
            return true;
        }

        return false;
    };

    var elemRegexpHandler = function (elem) {
        if (elem.dataset.validator == 'regexp') {
            var reg = new RegExp(elem.dataset.validatorPattern);

            if (!reg.test(elem.value)) {
                elem.classList.add(params.inputErrorClass);
            }
            return true;
        }

        return false;
    };

    var checkNumsBorders = function (elem) {
        var num = Number(elem.value);

        if (elem.hasAttribute('data-validator-min')) {
            if (num < elem.dataset.validatorMin) {
                elem.classList.add(params.inputErrorClass);
            }
        }

        if (elem.hasAttribute('data-validator-max')) {
            if (num > elem.dataset.validatorMax) {
                elem.classList.add(params.inputErrorClass);
            }
        }
    };

    var validateElement = function (elem) {
        if (elemRequiredHandler(elem)) {
            return;
        }

        if (elemLettersHandler(elem)) {
            return;
        }

        if (elemNumberHandler(elem)) {
            return;
        }

        if (elemRegexpHandler(elem)) {
            return;
        }
    };

    var clearFormValidationClass = function () {
        if (form.classList.contains(params.formValidClass)) {
            form.classList.remove(params.formValidClass)
        }

        if (form.classList.contains(params.formInvalidClass)) {
            form.classList.remove(params.formInvalidClass)
        }
    };

    var isFormValid = function () {
        var isFormValid = true;

        elementsList.forEach(function (elem) {
            if (elem.classList.contains(params.inputErrorClass)) {
                elem.classList.remove(params.inputErrorClass)
            }

            validateElement(elem);
            if (elem.classList.contains('input_error')) {
                isFormValid = false;
            }
        });

        return isFormValid;
    };

    var submitEventHandler = function (event) {
        event.preventDefault();
        clearFormValidationClass();

        if (isFormValid()) {
            form.classList.add(params.formValidClass);
        } else {
            form.classList.add(params.formInvalidClass);
        }
    };

    form.addEventListener('focus', function (event) {
        event.preventDefault();

         if(event.target.tagName === 'INPUT') {
             if (event.target.classList.contains(params.inputErrorClass)) {
                 event.target.classList.remove(params.inputErrorClass);
             }
         }
    }, true);

    form.addEventListener('blur', function (event) {
        event.preventDefault();

        if(event.target.tagName === 'INPUT') {
            validateElement(event.target);
        }
    }, true);

    form.addEventListener('submit', submitEventHandler);
}