document.addEventListener('DOMContentLoaded', function () {
  var exerciseList = document.getElementById('exercise-list');
  var addBtn = document.getElementById('add-exercise-btn');
  var calcBtn = document.getElementById('calc-btn');
  var resetBtn = document.getElementById('reset-btn');
  var resultSection = document.getElementById('result');
  var eachResult = document.getElementById('each-result');
  var totalCalorie = document.getElementById('total-calorie');
  var onigiriCount = document.getElementById('onigiri-count');
  var bodyWeightInput = document.getElementById('body-weight');

  var exerciseNames = {
    '3.5': 'Walking',
    '7.0': 'Jogging',
    '10.0': 'Running',
    '8.0': 'Swimming',
    '6.8': 'Cycling',
    '2.5': 'Yoga',
    '6.0': 'Weight training',
    '8.8': 'Stair climbing',
    '12.3': 'Jump rope',
    '2.3': 'Stretching'
  };

  var rowCount = 1;

  function createExerciseRow() {
    var div = document.createElement('div');
    div.className = 'exercise-row';
    div.setAttribute('data-index', rowCount);
    div.innerHTML =
      '<div class="form-group">' +
        '<label class="form-label">Exercise type</label>' +
        '<select class="select exercise-type">' +
          '<option value="">Select an exercise</option>' +
          '<option value="3.5">Walking (normal pace)</option>' +
          '<option value="7.0">Jogging</option>' +
          '<option value="10.0">Running</option>' +
          '<option value="8.0">Swimming (freestyle)</option>' +
          '<option value="6.8">Cycling</option>' +
          '<option value="2.5">Yoga</option>' +
          '<option value="6.0">Weight training (high intensity)</option>' +
          '<option value="8.8">Stair climbing</option>' +
          '<option value="12.3">Jump rope</option>' +
          '<option value="2.3">Stretching</option>' +
        '</select>' +
      '</div>' +
      '<div class="form-group">' +
        '<label class="form-label">Duration (minutes)</label>' +
        '<input class="input exercise-time" type="number" min="1" max="600" placeholder="e.g. 30">' +
      '</div>' +
      '<button class="btn btn--secondary remove-exercise-btn" type="button">Remove</button>';
    rowCount++;
    return div;
  }

  addBtn.addEventListener('click', function () {
    var row = createExerciseRow();
    exerciseList.appendChild(row);
    row.querySelector('.remove-exercise-btn').addEventListener('click', function () {
      exerciseList.removeChild(row);
    });
  });

  calcBtn.addEventListener('click', function () {
    var weight = parseFloat(bodyWeightInput.value);
    if (!weight || weight < 20 || weight > 300) {
      alert('Please enter a valid weight (20-300kg).');
      return;
    }

    var rows = exerciseList.querySelectorAll('.exercise-row');
    var total = 0;
    var details = [];
    var hasValid = false;

    for (var i = 0; i < rows.length; i++) {
      var typeSelect = rows[i].querySelector('.exercise-type');
      var timeInput = rows[i].querySelector('.exercise-time');
      var mets = parseFloat(typeSelect.value);
      var minutes = parseFloat(timeInput.value);
      if (!mets || !minutes) continue;
      hasValid = true;
      var hours = minutes / 60;
      var cal = mets * weight * hours * 1.05;
      total += cal;
      details.push({
        name: exerciseNames[typeSelect.value] || 'Unknown',
        minutes: minutes,
        calories: cal
      });
    }

    if (!hasValid) {
      alert('Please enter at least one exercise type and duration.');
      return;
    }

    eachResult.innerHTML = '';
    details.forEach(function (d) {
      var item = document.createElement('div');
      item.className = 'result__item';
      item.innerHTML =
        '<span class="result__label">' + d.name + ' (' + d.minutes + ' min)</span>' +
        '<span class="result__value">' + Math.round(d.calories) + ' kcal</span>';
      eachResult.appendChild(item);
    });

    totalCalorie.textContent = Math.round(total) + ' kcal';

    var rice = total / 200;
    onigiriCount.textContent = 'Approx. ' + rice.toFixed(1) + ' bowls of rice';

    resultSection.hidden = false;
    resultSection.scrollIntoView({ behavior: 'smooth' });
  });

  resetBtn.addEventListener('click', function () {
    bodyWeightInput.value = '';
    var rows = exerciseList.querySelectorAll('.exercise-row');
    for (var i = rows.length - 1; i > 0; i--) {
      exerciseList.removeChild(rows[i]);
    }
    var firstRow = rows[0];
    if (firstRow) {
      firstRow.querySelector('.exercise-type').value = '';
      firstRow.querySelector('.exercise-time').value = '';
    }
    resultSection.hidden = true;
  });
});
