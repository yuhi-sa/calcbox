document.addEventListener('DOMContentLoaded', function () {
  var foods = [
    { name: 'White rice (cooked)', cal: 168, protein: 2.5, fat: 0.3, carb: 37.1 },
    { name: 'Brown rice (cooked)', cal: 165, protein: 2.8, fat: 1.0, carb: 35.6 },
    { name: 'White bread', cal: 260, protein: 9.3, fat: 4.4, carb: 46.7 },
    { name: 'Udon noodles (boiled)', cal: 105, protein: 2.6, fat: 0.4, carb: 21.6 },
    { name: 'Soba noodles (boiled)', cal: 132, protein: 4.8, fat: 1.0, carb: 26.0 },
    { name: 'Pasta (boiled)', cal: 149, protein: 5.2, fat: 0.9, carb: 28.4 },
    { name: 'Ramen noodles (fresh)', cal: 281, protein: 8.6, fat: 1.2, carb: 55.7 },
    { name: 'Chicken breast (skinless)', cal: 108, protein: 22.3, fat: 1.5, carb: 0.0 },
    { name: 'Chicken thigh (with skin)', cal: 200, protein: 16.2, fat: 14.0, carb: 0.0 },
    { name: 'Pork loin', cal: 263, protein: 19.3, fat: 19.2, carb: 0.2 },
    { name: 'Pork belly', cal: 386, protein: 14.2, fat: 34.6, carb: 0.1 },
    { name: 'Beef round', cal: 182, protein: 21.2, fat: 9.6, carb: 0.5 },
    { name: 'Beef belly', cal: 371, protein: 14.4, fat: 32.9, carb: 0.2 },
    { name: 'Salmon (raw)', cal: 233, protein: 20.1, fat: 16.1, carb: 0.0 },
    { name: 'Tuna (lean, raw)', cal: 125, protein: 26.4, fat: 1.4, carb: 0.1 },
    { name: 'Shrimp (raw)', cal: 82, protein: 18.4, fat: 0.6, carb: 0.3 },
    { name: 'Egg (whole)', cal: 151, protein: 12.3, fat: 10.3, carb: 0.3 },
    { name: 'Milk', cal: 67, protein: 3.3, fat: 3.8, carb: 4.8 },
    { name: 'Yogurt (plain)', cal: 62, protein: 3.6, fat: 3.0, carb: 4.9 },
    { name: 'Cheese (processed)', cal: 339, protein: 22.7, fat: 26.0, carb: 1.3 },
    { name: 'Tofu (firm)', cal: 72, protein: 6.6, fat: 4.2, carb: 1.6 },
    { name: 'Tofu (silken)', cal: 56, protein: 4.9, fat: 3.0, carb: 2.0 },
    { name: 'Natto (fermented soybeans)', cal: 200, protein: 16.5, fat: 10.0, carb: 12.1 },
    { name: 'Cabbage', cal: 23, protein: 1.3, fat: 0.2, carb: 5.2 },
    { name: 'Carrot', cal: 39, protein: 0.7, fat: 0.2, carb: 9.3 },
    { name: 'Spinach', cal: 20, protein: 2.2, fat: 0.4, carb: 3.1 },
    { name: 'Tomato', cal: 19, protein: 0.7, fat: 0.1, carb: 4.7 },
    { name: 'Potato', cal: 76, protein: 1.6, fat: 0.1, carb: 17.6 },
    { name: 'Sweet potato', cal: 134, protein: 1.2, fat: 0.2, carb: 31.5 },
    { name: 'Onion', cal: 37, protein: 1.0, fat: 0.1, carb: 8.8 },
    { name: 'Banana', cal: 86, protein: 1.1, fat: 0.2, carb: 22.5 },
    { name: 'Apple', cal: 54, protein: 0.2, fat: 0.1, carb: 14.6 },
    { name: 'Orange', cal: 46, protein: 0.7, fat: 0.1, carb: 12.0 },
    { name: 'Avocado', cal: 187, protein: 2.5, fat: 18.7, carb: 6.2 },
    { name: 'Broccoli', cal: 33, protein: 4.3, fat: 0.5, carb: 5.2 },
    { name: 'Miso paste', cal: 192, protein: 12.5, fat: 6.0, carb: 17.0 },
    { name: 'Soy sauce', cal: 71, protein: 7.7, fat: 0.0, carb: 10.1 },
    { name: 'Olive oil', cal: 921, protein: 0.0, fat: 100.0, carb: 0.0 },
    { name: 'Butter', cal: 745, protein: 0.6, fat: 81.0, carb: 0.2 }
  ];

  var foodSearch = document.getElementById('food-search');
  var foodSelect = document.getElementById('food-select');
  var foodAmount = document.getElementById('food-amount');
  var addBtn = document.getElementById('add-btn');
  var clearBtn = document.getElementById('clear-btn');
  var foodListSection = document.getElementById('food-list-section');
  var foodTbody = document.getElementById('food-tbody');
  var totalCal = document.getElementById('total-cal');
  var totalProtein = document.getElementById('total-protein');
  var totalFat = document.getElementById('total-fat');
  var totalCarb = document.getElementById('total-carb');

  var addedFoods = [];

  function populateSelect(filter) {
    foodSelect.innerHTML = '<option value="">-- Select a food --</option>';
    var lowerFilter = (filter || '').toLowerCase();
    for (var i = 0; i < foods.length; i++) {
      if (!lowerFilter || foods[i].name.toLowerCase().indexOf(lowerFilter) !== -1) {
        var opt = document.createElement('option');
        opt.value = i;
        opt.textContent = foods[i].name + ' (' + foods[i].cal + ' kcal/100g)';
        foodSelect.appendChild(opt);
      }
    }
  }

  populateSelect('');

  foodSearch.addEventListener('input', function () {
    populateSelect(foodSearch.value);
  });

  function updateTotals() {
    var tCal = 0, tPro = 0, tFat = 0, tCarb = 0;
    for (var i = 0; i < addedFoods.length; i++) {
      tCal += addedFoods[i].cal;
      tPro += addedFoods[i].protein;
      tFat += addedFoods[i].fat;
      tCarb += addedFoods[i].carb;
    }
    totalCal.textContent = tCal.toFixed(1) + ' kcal';
    totalProtein.textContent = tPro.toFixed(1) + ' g';
    totalFat.textContent = tFat.toFixed(1) + ' g';
    totalCarb.textContent = tCarb.toFixed(1) + ' g';
  }

  function renderTable() {
    foodTbody.innerHTML = '';
    for (var i = 0; i < addedFoods.length; i++) {
      (function (idx) {
        var f = addedFoods[idx];
        var tr = document.createElement('tr');
        tr.innerHTML =
          '<td style="border:1px solid var(--color-border);padding:8px;">' + f.name + '</td>' +
          '<td style="border:1px solid var(--color-border);padding:8px;text-align:center;">' + f.amount + '</td>' +
          '<td style="border:1px solid var(--color-border);padding:8px;text-align:center;">' + f.cal.toFixed(1) + '</td>' +
          '<td style="border:1px solid var(--color-border);padding:8px;text-align:center;">' + f.protein.toFixed(1) + '</td>' +
          '<td style="border:1px solid var(--color-border);padding:8px;text-align:center;">' + f.fat.toFixed(1) + '</td>' +
          '<td style="border:1px solid var(--color-border);padding:8px;text-align:center;">' + f.carb.toFixed(1) + '</td>' +
          '<td style="border:1px solid var(--color-border);padding:8px;text-align:center;"><button type="button" class="btn btn--secondary remove-food" style="padding:4px 10px;font-size:0.8rem;">Remove</button></td>';
        tr.querySelector('.remove-food').addEventListener('click', function () {
          addedFoods.splice(idx, 1);
          renderTable();
          updateTotals();
          if (addedFoods.length === 0) {
            foodListSection.hidden = true;
          }
        });
        foodTbody.appendChild(tr);
      })(i);
    }
    updateTotals();
  }

  addBtn.addEventListener('click', function () {
    var idx = parseInt(foodSelect.value, 10);
    if (isNaN(idx) || idx < 0 || idx >= foods.length) {
      alert('Please select a food item.');
      return;
    }
    var amount = parseFloat(foodAmount.value);
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount (g).');
      return;
    }
    var food = foods[idx];
    var ratio = amount / 100;
    addedFoods.push({
      name: food.name,
      amount: amount,
      cal: food.cal * ratio,
      protein: food.protein * ratio,
      fat: food.fat * ratio,
      carb: food.carb * ratio
    });
    foodListSection.hidden = false;
    renderTable();
    foodAmount.value = '';
  });

  clearBtn.addEventListener('click', function () {
    addedFoods = [];
    foodTbody.innerHTML = '';
    foodListSection.hidden = true;
    foodSearch.value = '';
    foodSelect.value = '';
    foodAmount.value = '';
    populateSelect('');
    updateTotals();
  });
});
