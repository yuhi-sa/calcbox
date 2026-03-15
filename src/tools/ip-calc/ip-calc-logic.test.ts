import { describe, it, expect } from 'vitest';
import { calculateSubnet, parseCidr, cidrToMask, maskToCidr } from './ip-calc-logic';

describe('ip-calc', () => {
  it('calculates /24 subnet correctly', () => {
    const result = calculateSubnet('192.168.1.0', 24);
    expect(result.networkAddress).toBe('192.168.1.0');
    expect(result.broadcastAddress).toBe('192.168.1.255');
    expect(result.firstHost).toBe('192.168.1.1');
    expect(result.lastHost).toBe('192.168.1.254');
    expect(result.numberOfHosts).toBe(254);
    expect(result.subnetMask).toBe('255.255.255.0');
  });

  it('calculates /16 subnet correctly', () => {
    const result = calculateSubnet('10.0.5.100', 16);
    expect(result.networkAddress).toBe('10.0.0.0');
    expect(result.broadcastAddress).toBe('10.0.255.255');
    expect(result.numberOfHosts).toBe(65534);
  });

  it('converts cidr to mask', () => {
    expect(cidrToMask(24)).toBe('255.255.255.0');
    expect(cidrToMask(16)).toBe('255.255.0.0');
    expect(cidrToMask(8)).toBe('255.0.0.0');
  });

  it('converts mask to cidr', () => {
    expect(maskToCidr('255.255.255.0')).toBe(24);
  });

  it('parses CIDR notation', () => {
    const result = parseCidr('192.168.1.0/24');
    expect(result.ip).toBe('192.168.1.0');
    expect(result.cidr).toBe(24);
  });

  it('throws on invalid CIDR', () => {
    expect(() => parseCidr('invalid')).toThrow();
  });
});
