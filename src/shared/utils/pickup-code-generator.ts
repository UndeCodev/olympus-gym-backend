export function generatePickupCode(userName: string, reservationId: string): string {
  const userPrefix = userName
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '')
    .substring(0, 3)
    .padEnd(3, 'X'); // If userName has less than 3 characters, pad with 'X'
  
  // Last 5 digits of reservationId
  const reservationSuffix = String(reservationId)
    .padStart(5, '0') 
    .slice(-5); 
  
  return `GYM-${userPrefix}-${reservationSuffix}`;
}