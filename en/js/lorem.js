document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var modeSelect = document.getElementById('mode-select');
  var countInput = document.getElementById('count-input');
  var startLorem = document.getElementById('start-lorem');
  var generateBtn = document.getElementById('generate-btn');
  var copyBtn = document.getElementById('copy-btn');
  var errorMsg = document.getElementById('error-msg');
  var resultSection = document.getElementById('result');
  var resultInfo = document.getElementById('result-info');
  var loremOutput = document.getElementById('lorem-output');

  var LOREM_FIRST = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

  var WORDS = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'at', 'vero', 'eos',
    'accusamus', 'iusto', 'odio', 'dignissimos', 'ducimus', 'blanditiis',
    'praesentium', 'voluptatum', 'deleniti', 'atque', 'corrupti', 'quos', 'dolores',
    'quas', 'molestias', 'recusandae', 'itaque', 'earum', 'rerum', 'hic',
    'tenetur', 'sapiente', 'delectus', 'aut', 'reiciendis', 'voluptatibus',
    'maiores', 'alias', 'perferendis', 'doloribus', 'asperiores', 'repellat',
    'temporibus', 'quibusdam', 'officiis', 'debitis', 'necessitatibus', 'saepe',
    'eveniet', 'voluptates', 'repudiandae', 'recusandae', 'numquam', 'eius',
    'modi', 'tempora', 'quaerat', 'voluptatem', 'quia', 'consequuntur', 'magni',
    'dolorem', 'porro', 'quisquam', 'nihil', 'impedit', 'quo', 'minus',
    'placeat', 'facere', 'possimus', 'omnis', 'repellendus', 'autem', 'vel',
    'eum', 'fugit', 'harum', 'quidem', 'exercitationem', 'ullam', 'corporis',
    'suscipit', 'laboriosam', 'nemo', 'ipsam', 'voluptas', 'aspernatur',
    'odit', 'fugiat', 'vitae', 'dicta', 'explicabo', 'natus', 'error',
    'totam', 'rem', 'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo',
    'inventore', 'veritatis', 'quasi', 'architecto', 'beatae', 'consequatur',
    'maxime', 'accusantium', 'doloremque', 'laudantium', 'ratione', 'sequi',
    'nesciunt', 'neque', 'porro', 'dolorum', 'fuga', 'similique', 'optio',
    'cumque', 'nihil', 'molestiae', 'iure', 'provident', 'expedita', 'distinctio',
    'nam', 'libero', 'tempore', 'cum', 'soluta', 'nobis', 'eligendi',
    'rerum', 'facilis', 'unde', 'omnis', 'iste'
  ];

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomWord() {
    return WORDS[randomInt(0, WORDS.length - 1)];
  }

  function generateSentence(wordCount) {
    var count = wordCount || randomInt(6, 15);
    var words = [];
    for (var i = 0; i < count; i++) {
      words.push(randomWord());
    }
    // Capitalize first letter
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    // Add commas randomly
    if (count > 6) {
      var commaPos = randomInt(2, Math.floor(count / 2));
      words[commaPos] = words[commaPos] + ',';
    }
    return words.join(' ') + '.';
  }

  function generateParagraph(sentenceCount) {
    var count = sentenceCount || randomInt(4, 8);
    var sentences = [];
    for (var i = 0; i < count; i++) {
      sentences.push(generateSentence());
    }
    return sentences.join(' ');
  }

  function generateWords(count) {
    var words = [];
    for (var i = 0; i < count; i++) {
      words.push(randomWord());
    }
    return words.join(' ');
  }

  function hideError() {
    errorMsg.hidden = true;
    errorMsg.textContent = '';
  }

  function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.hidden = false;
    resultSection.hidden = true;
  }

  generateBtn.addEventListener('click', function () {
    hideError();
    var mode = modeSelect.value;
    var count = parseInt(countInput.value, 10);

    if (isNaN(count) || count < 1) {
      showError('Please enter a number of 1 or greater.');
      return;
    }
    if (count > 100) {
      showError('Please enter a number of 100 or less.');
      return;
    }

    var text = '';
    var useLoremStart = startLorem.checked;

    if (mode === 'paragraphs') {
      var paragraphs = [];
      for (var p = 0; p < count; p++) {
        if (p === 0 && useLoremStart) {
          var rest = generateParagraph(randomInt(3, 7));
          paragraphs.push(LOREM_FIRST + ' ' + rest);
        } else {
          paragraphs.push(generateParagraph());
        }
      }
      text = paragraphs.join('\n\n');
    } else if (mode === 'sentences') {
      var sentences = [];
      for (var s = 0; s < count; s++) {
        if (s === 0 && useLoremStart) {
          sentences.push(LOREM_FIRST);
        } else {
          sentences.push(generateSentence());
        }
      }
      text = sentences.join(' ');
    } else if (mode === 'words') {
      if (useLoremStart) {
        var loremWords = LOREM_FIRST.replace('.', '').split(' ');
        if (count <= loremWords.length) {
          text = loremWords.slice(0, count).join(' ');
        } else {
          text = loremWords.join(' ') + ' ' + generateWords(count - loremWords.length);
        }
      } else {
        text = generateWords(count);
      }
    }

    // Count stats
    var charCount = text.length;
    var wordCount = text.split(/\s+/).filter(function (w) { return w.length > 0; }).length;

    loremOutput.textContent = text;
    resultInfo.textContent = charCount.toLocaleString() + ' characters / ' + wordCount.toLocaleString() + ' words';
    resultSection.hidden = false;
    resultSection.scrollIntoView({ behavior: 'smooth' });
  });

  copyBtn.addEventListener('click', function () {
    var text = loremOutput.textContent;
    if (!text) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        var original = copyBtn.textContent;
        copyBtn.textContent = 'Copied';
        setTimeout(function () {
          copyBtn.textContent = original;
        }, 1500);
      });
    }
  });
});
