export interface Permission {
  read: boolean;
  write: boolean;
  execute: boolean;
}

export interface ChmodResult {
  numeric: string;
  symbolic: string;
  lsStyle: string;
}

export function permissionToDigit(perm: Permission): number {
  return (perm.read ? 4 : 0) + (perm.write ? 2 : 0) + (perm.execute ? 1 : 0);
}

export function digitToPermission(digit: number): Permission {
  return {
    read: (digit & 4) !== 0,
    write: (digit & 2) !== 0,
    execute: (digit & 1) !== 0,
  };
}

export function permissionToSymbolic(perm: Permission): string {
  return (perm.read ? 'r' : '-') + (perm.write ? 'w' : '-') + (perm.execute ? 'x' : '-');
}

export function numericToResult(numeric: string): ChmodResult {
  if (!/^[0-7]{3}$/.test(numeric)) {
    throw new Error('3桁の8進数(000〜777)で入力してください');
  }

  const digits = numeric.split('').map(Number);
  const owner = digitToPermission(digits[0]);
  const group = digitToPermission(digits[1]);
  const others = digitToPermission(digits[2]);

  const symbolic = permissionToSymbolic(owner) + permissionToSymbolic(group) + permissionToSymbolic(others);

  return {
    numeric,
    symbolic,
    lsStyle: `-${symbolic}`,
  };
}

export function permissionsToResult(owner: Permission, group: Permission, others: Permission): ChmodResult {
  const numeric = `${permissionToDigit(owner)}${permissionToDigit(group)}${permissionToDigit(others)}`;
  const symbolic = permissionToSymbolic(owner) + permissionToSymbolic(group) + permissionToSymbolic(others);

  return {
    numeric,
    symbolic,
    lsStyle: `-${symbolic}`,
  };
}
