document.addEventListener('DOMContentLoaded', function () {
  var birthdayInput = document.getElementById('birthday');
  var calcBtn = document.getElementById('calc-btn');
  var resetBtn = document.getElementById('reset-btn');
  var resultSection = document.getElementById('result');

  var ETO = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Boar'];

  var ZODIAC = [
    { name: 'Capricorn', start: [1, 1], end: [1, 19] },
    { name: 'Aquarius', start: [1, 20], end: [2, 18] },
    { name: 'Pisces', start: [2, 19], end: [3, 20] },
    { name: 'Aries', start: [3, 21], end: [4, 19] },
    { name: 'Taurus', start: [4, 20], end: [5, 20] },
    { name: 'Gemini', start: [5, 21], end: [6, 21] },
    { name: 'Cancer', start: [6, 22], end: [7, 22] },
    { name: 'Leo', start: [7, 23], end: [8, 22] },
    { name: 'Virgo', start: [8, 23], end: [9, 22] },
    { name: 'Libra', start: [9, 23], end: [10, 23] },
    { name: 'Scorpio', start: [10, 24], end: [11, 22] },
    { name: 'Sagittarius', start: [11, 23], end: [12, 21] },
    { name: 'Capricorn', start: [12, 22], end: [12, 31] }
  ];

  function getEto(year) {
    return ETO[(year - 4) % 12];
  }

  function getZodiac(month, day) {
    for (var i = 0; i < ZODIAC.length; i++) {
      var z = ZODIAC[i];
      var afterStart = month > z.start[0] || (month === z.start[0] && day >= z.start[1]);
      var beforeEnd = month < z.end[0] || (month === z.end[0] && day <= z.end[1]);
      if (afterStart && beforeEnd) return z.name;
    }
    return '';
  }

  function getWareki(year, month, day) {
    var date = new Date(year, month - 1, day);
    if (date >= new Date(2019, 4, 1)) {
      return 'Reiwa ' + (year - 2018 === 1 ? '1' : (year - 2018));
    }
    if (date >= new Date(1989, 0, 8)) {
      return 'Heisei ' + (year - 1988 === 1 ? '1' : (year - 1988));
    }
    if (date >= new Date(1926, 11, 25)) {
      return 'Showa ' + (year - 1925 === 1 ? '1' : (year - 1925));
    }
    if (date >= new Date(1912, 6, 30)) {
      return 'Taisho ' + (year - 1911 === 1 ? '1' : (year - 1911));
    }
    return year + ' AD';
  }

  function calcAge(birthDate, today) {
    var years = today.getFullYear() - birthDate.getFullYear();
    var months = today.getMonth() - birthDate.getMonth();
    var days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      var prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    return { years: years, months: months, days: days };
  }

  function getNextBirthday(birthDate, today) {
    var thisYear = today.getFullYear();
    var bMonth = birthDate.getMonth();
    var bDay = birthDate.getDate();

    var nextBirthday = new Date(thisYear, bMonth, bDay);
    if (bMonth === 1 && bDay === 29) {
      var testDate = new Date(thisYear, 1, 29);
      if (testDate.getMonth() !== 1) {
        nextBirthday = new Date(thisYear, 2, 1);
      }
    }

    if (nextBirthday <= today) {
      nextBirthday = new Date(thisYear + 1, bMonth, bDay);
      if (bMonth === 1 && bDay === 29) {
        var testDate2 = new Date(thisYear + 1, 1, 29);
        if (testDate2.getMonth() !== 1) {
          nextBirthday = new Date(thisYear + 1, 2, 1);
        }
      }
    }

    var diff = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  }

  function getDaysAlive(birthDate, today) {
    var diff = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  }

  calcBtn.addEventListener('click', function () {
    var val = birthdayInput.value;
    if (!val) {
      alert('Please enter your date of birth.');
      return;
    }

    var birth = new Date(val);
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    if (birth > today) {
      alert('Please enter a date of birth on or before today.');
      return;
    }

    var bYear = birth.getFullYear();
    var bMonth = birth.getMonth() + 1;
    var bDay = birth.getDate();

    var age = calcAge(birth, today);
    document.getElementById('age-value').textContent = age.years + ' years ' + age.months + ' months ' + age.days + ' days';

    var wareki = getWareki(bYear, bMonth, bDay);
    document.getElementById('wareki-value').textContent = wareki + ' (' + bMonth + '/' + bDay + ')';

    document.getElementById('eto-value').textContent = getEto(bYear);
    document.getElementById('zodiac-value').textContent = getZodiac(bMonth, bDay);

    var nextBday = getNextBirthday(birth, today);
    document.getElementById('next-birthday').textContent = nextBday + ' days away';

    var daysAlive = getDaysAlive(birth, today);
    document.getElementById('days-alive').textContent = daysAlive.toLocaleString() + ' days';

    resultSection.hidden = false;
    resultSection.scrollIntoView({ behavior: 'smooth' });
  });

  resetBtn.addEventListener('click', function () {
    birthdayInput.value = '';
    resultSection.hidden = true;
  });
});
