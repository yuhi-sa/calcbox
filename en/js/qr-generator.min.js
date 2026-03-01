document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var QR_API_BASE = 'https://api.qrserver.com/v1/create-qr-code/';
  var QR_SIZE = 300;

  var qrTextInput = document.getElementById('qr-text');
  var generateBtn = document.getElementById('generate-btn');
  var resetBtn = document.getElementById('reset-btn');
  var resultSection = document.getElementById('result');
  var qrCanvas = document.getElementById('qr-canvas');
  var downloadBtn = document.getElementById('download-btn');

  var ctx = qrCanvas.getContext('2d');

  function generateQR() {
    var text = qrTextInput.value.trim();
    if (!text) {
      alert('Please enter text or a URL.');
      return;
    }

    var encodedText = encodeURIComponent(text);
    var apiUrl = QR_API_BASE + '?size=' + QR_SIZE + 'x' + QR_SIZE + '&data=' + encodedText + '&format=png&charset-source=UTF-8';

    // Show a loading state
    qrCanvas.width = QR_SIZE;
    qrCanvas.height = QR_SIZE;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, QR_SIZE, QR_SIZE);
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#888888';
    ctx.fillText('Generating...', QR_SIZE / 2, QR_SIZE / 2);

    resultSection.hidden = false;

    var img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function () {
      qrCanvas.width = QR_SIZE;
      qrCanvas.height = QR_SIZE;
      ctx.drawImage(img, 0, 0, QR_SIZE, QR_SIZE);
      resultSection.scrollIntoView({ behavior: 'smooth' });
    };
    img.onerror = function () {
      ctx.clearRect(0, 0, QR_SIZE, QR_SIZE);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, QR_SIZE, QR_SIZE);
      ctx.fillStyle = '#e74c3c';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Failed to generate QR code', QR_SIZE / 2, QR_SIZE / 2 - 10);
      ctx.fillText('Please check your connection', QR_SIZE / 2, QR_SIZE / 2 + 14);
    };
    img.src = apiUrl;
  }

  function downloadPNG() {
    try {
      var dataURL = qrCanvas.toDataURL('image/png');
      var link = document.createElement('a');
      link.download = 'qrcode.png';
      link.href = dataURL;
      link.click();
    } catch (e) {
      alert('Download failed. Please generate the QR code again and try once more.');
    }
  }

  generateBtn.addEventListener('click', generateQR);

  downloadBtn.addEventListener('click', downloadPNG);

  resetBtn.addEventListener('click', function () {
    qrTextInput.value = '';
    qrCanvas.width = QR_SIZE;
    qrCanvas.height = QR_SIZE;
    ctx.clearRect(0, 0, QR_SIZE, QR_SIZE);
    resultSection.hidden = true;
  });

  // Allow Ctrl/Cmd+Enter in textarea to generate
  qrTextInput.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      generateQR();
    }
  });
});