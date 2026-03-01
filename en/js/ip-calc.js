document.addEventListener('DOMContentLoaded', function () {
  var ipInput = document.getElementById('ip-address');
  var cidrSelect = document.getElementById('cidr');
  var calcBtn = document.getElementById('calc-btn');
  var resetBtn = document.getElementById('reset-btn');
  var resultSection = document.getElementById('result');
  var resultIp = document.getElementById('result-ip');
  var resultMask = document.getElementById('result-mask');
  var resultNetwork = document.getElementById('result-network');
  var resultBroadcast = document.getElementById('result-broadcast');
  var resultRange = document.getElementById('result-range');
  var resultHosts = document.getElementById('result-hosts');
  var resultBinary = document.getElementById('result-binary');

  function parseIp(ipStr) {
    var parts = ipStr.trim().split('.');
    if (parts.length !== 4) return null;
    var octets = [];
    for (var i = 0; i < 4; i++) {
      var n = parseInt(parts[i], 10);
      if (isNaN(n) || n < 0 || n > 255) return null;
      octets.push(n);
    }
    return octets;
  }

  function ipToInt(octets) {
    return ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0;
  }

  function intToIp(num) {
    return [
      (num >>> 24) & 255,
      (num >>> 16) & 255,
      (num >>> 8) & 255,
      num & 255
    ].join('.');
  }

  function intToBinary(num) {
    var parts = [];
    for (var i = 3; i >= 0; i--) {
      var octet = (num >>> (i * 8)) & 255;
      var bin = octet.toString(2);
      while (bin.length < 8) bin = '0' + bin;
      parts.push(bin);
    }
    return parts.join('.');
  }

  calcBtn.addEventListener('click', function () {
    var octets = parseIp(ipInput.value);
    if (!octets) {
      alert('Please enter a valid IP address. (e.g. 192.168.1.100)');
      return;
    }

    var cidr = parseInt(cidrSelect.value, 10);
    var ipInt = ipToInt(octets);

    // Subnet mask
    var maskInt = cidr === 0 ? 0 : (0xFFFFFFFF << (32 - cidr)) >>> 0;

    // Network address
    var networkInt = (ipInt & maskInt) >>> 0;

    // Broadcast address
    var broadcastInt = (networkInt | (~maskInt >>> 0)) >>> 0;

    // Host range
    var totalHosts = Math.pow(2, 32 - cidr);
    var usableHosts = totalHosts > 2 ? totalHosts - 2 : totalHosts;

    var firstHost, lastHost;
    if (cidr >= 31) {
      firstHost = intToIp(networkInt);
      lastHost = intToIp(broadcastInt);
    } else {
      firstHost = intToIp(networkInt + 1);
      lastHost = intToIp(broadcastInt - 1);
    }

    resultIp.textContent = ipInput.value.trim() + '/' + cidr;
    resultMask.textContent = intToIp(maskInt);
    resultNetwork.textContent = intToIp(networkInt);
    resultBroadcast.textContent = intToIp(broadcastInt);
    resultRange.textContent = firstHost + ' - ' + lastHost;
    resultHosts.textContent = usableHosts.toLocaleString() + ' hosts';
    resultBinary.textContent = intToBinary(ipInt);

    resultSection.hidden = false;
    resultSection.scrollIntoView({ behavior: 'smooth' });
  });

  resetBtn.addEventListener('click', function () {
    ipInput.value = '';
    cidrSelect.value = '24';
    resultSection.hidden = true;
  });
});