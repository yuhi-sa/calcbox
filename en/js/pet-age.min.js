(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var petTypeRadios = document.querySelectorAll('input[name="pet-type"]');
    var dogSizeGroup = document.getElementById('dog-size-group');
    var petAgeInput = document.getElementById('pet-age-input');
    var calcBtn = document.getElementById('pet-calc-btn');
    var resetBtn = document.getElementById('pet-reset-btn');
    var resultSection = document.getElementById('pet-result');
    var humanAgeValue = document.getElementById('human-age-value');
    var petTypeDisplay = document.getElementById('pet-type-display');
    var ageTableSection = document.getElementById('age-table-section');
    var ageTableHeader = document.getElementById('age-table-header');
    var ageTableBody = document.getElementById('age-table-body');

    function getRadioValue(name) {
      var radios = document.querySelectorAll('input[name="' + name + '"]');
      for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) return radios[i].value;
      }
      return '';
    }

    function toggleDogSize() {
      var petType = getRadioValue('pet-type');
      dogSizeGroup.hidden = petType !== 'dog';
    }

    for (var i = 0; i < petTypeRadios.length; i++) {
      petTypeRadios[i].addEventListener('change', toggleDogSize);
    }

    function calcHumanAge(petAge, type, dogSize) {
      if (petAge <= 0) return 0;
      var year1, year2, perYear;
      if (type === 'cat') {
        year1 = 15; year2 = 24; perYear = 4;
      } else {
        if (dogSize === 'large') {
          year1 = 12; year2 = 22; perYear = 6;
        } else if (dogSize === 'medium') {
          year1 = 15; year2 = 24; perYear = 5;
        } else {
          year1 = 15; year2 = 24; perYear = 4;
        }
      }
      if (petAge <= 1) {
        return Math.round(year1 * petAge);
      } else if (petAge <= 2) {
        return Math.round(year1 + (year2 - year1) * (petAge - 1));
      } else {
        return Math.round(year2 + perYear * (petAge - 2));
      }
    }

    function getTypeLabel(type, dogSize) {
      if (type === 'cat') return 'Cat';
      if (dogSize === 'small') return 'Dog (Small)';
      if (dogSize === 'medium') return 'Dog (Medium)';
      if (dogSize === 'large') return 'Dog (Large)';
      return 'Dog';
    }

    function buildTable(type) {
      ageTableHeader.innerHTML = '';
      ageTableBody.innerHTML = '';
      var thStyle = 'padding:8px 12px;text-align:center;border:1px solid var(--color-border);';
      var tdStyle = 'padding:8px 12px;text-align:center;border:1px solid var(--color-border);';

      if (type === 'dog') {
        ageTableHeader.innerHTML =
          '<th style="' + thStyle + '">Pet age</th>' +
          '<th style="' + thStyle + '">Small dog</th>' +
          '<th style="' + thStyle + '">Medium dog</th>' +
          '<th style="' + thStyle + '">Large dog</th>';
        for (var y = 1; y <= 20; y++) {
          var tr = document.createElement('tr');
          tr.style.backgroundColor = y % 2 === 0 ? 'var(--color-bg-secondary)' : 'var(--color-bg-card)';
          tr.innerHTML =
            '<td style="' + tdStyle + 'font-weight:600;">' + y + ' yrs</td>' +
            '<td style="' + tdStyle + '">' + calcHumanAge(y, 'dog', 'small') + ' yrs</td>' +
            '<td style="' + tdStyle + '">' + calcHumanAge(y, 'dog', 'medium') + ' yrs</td>' +
            '<td style="' + tdStyle + '">' + calcHumanAge(y, 'dog', 'large') + ' yrs</td>';
          ageTableBody.appendChild(tr);
        }
      } else {
        ageTableHeader.innerHTML =
          '<th style="' + thStyle + '">Pet age</th>' +
          '<th style="' + thStyle + '">Human equivalent</th>';
        for (var c = 1; c <= 20; c++) {
          var catTr = document.createElement('tr');
          catTr.style.backgroundColor = c % 2 === 0 ? 'var(--color-bg-secondary)' : 'var(--color-bg-card)';
          catTr.innerHTML =
            '<td style="' + tdStyle + 'font-weight:600;">' + c + ' yrs</td>' +
            '<td style="' + tdStyle + '">' + calcHumanAge(c, 'cat', '') + ' yrs</td>';
          ageTableBody.appendChild(catTr);
        }
      }
    }

    calcBtn.addEventListener('click', function () {
      var petType = getRadioValue('pet-type');
      var dogSize = getRadioValue('dog-size');
      var petAge = parseFloat(petAgeInput.value);
      if (isNaN(petAge) || petAge < 0 || petAge > 30) {
        alert('Please enter a valid pet age (0-30 years).');
        return;
      }
      var humanAge = calcHumanAge(petAge, petType, dogSize);
      humanAgeValue.textContent = 'Approx. ' + humanAge + ' years old';
      petTypeDisplay.textContent = getTypeLabel(petType, dogSize);
      resultSection.hidden = false;
      buildTable(petType);
      ageTableSection.hidden = false;
      resultSection.scrollIntoView({ behavior: 'smooth' });
    });

    resetBtn.addEventListener('click', function () {
      petAgeInput.value = '';
      document.querySelector('input[name="pet-type"][value="dog"]').checked = true;
      document.querySelector('input[name="dog-size"][value="small"]').checked = true;
      toggleDogSize();
      resultSection.hidden = true;
      ageTableSection.hidden = true;
    });
  });
})();
