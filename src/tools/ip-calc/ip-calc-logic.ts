export interface IpCalcResult {
  networkAddress: string;
  broadcastAddress: string;
  firstHost: string;
  lastHost: string;
  numberOfHosts: number;
  subnetMask: string;
  cidr: number;
}

function ipToNumber(ip: string): number {
  const parts = ip.split('.').map(Number);
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

function numberToIp(num: number): string {
  return [
    (num >>> 24) & 255,
    (num >>> 16) & 255,
    (num >>> 8) & 255,
    num & 255,
  ].join('.');
}

export function cidrToMask(cidr: number): string {
  const mask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
  return numberToIp(mask);
}

export function maskToCidr(mask: string): number {
  const num = ipToNumber(mask);
  let bits = 0;
  let n = num;
  while (n) {
    bits += n & 1;
    n >>>= 1;
  }
  return bits;
}

export function parseCidr(input: string): { ip: string; cidr: number } {
  const parts = input.trim().split('/');
  if (parts.length !== 2) throw new Error('CIDR形式 (例: 192.168.1.0/24) で入力してください');
  const ip = parts[0];
  const cidr = parseInt(parts[1], 10);
  if (isNaN(cidr) || cidr < 0 || cidr > 32) throw new Error('プレフィックスは0〜32の範囲で指定してください');
  if (!/^\d+\.\d+\.\d+\.\d+$/.test(ip)) throw new Error('無効なIPアドレスです');
  return { ip, cidr };
}

export function calculateSubnet(ip: string, cidr: number): IpCalcResult {
  const ipNum = ipToNumber(ip);
  const maskNum = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
  const networkNum = (ipNum & maskNum) >>> 0;
  const broadcastNum = (networkNum | (~maskNum >>> 0)) >>> 0;
  const hostBits = 32 - cidr;
  const numberOfHosts = hostBits <= 1 ? 0 : Math.pow(2, hostBits) - 2;

  return {
    networkAddress: numberToIp(networkNum),
    broadcastAddress: numberToIp(broadcastNum),
    firstHost: numberOfHosts > 0 ? numberToIp(networkNum + 1) : numberToIp(networkNum),
    lastHost: numberOfHosts > 0 ? numberToIp(broadcastNum - 1) : numberToIp(broadcastNum),
    numberOfHosts,
    subnetMask: numberToIp(maskNum),
    cidr,
  };
}
