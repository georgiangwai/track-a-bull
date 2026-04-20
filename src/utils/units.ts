export const cmFromFeetInches = (feet: number, inches: number) => feet * 30.48 + inches * 2.54;

export const cmFromInches = (inches: number) => inches * 2.54;

export const kgFromLbs = (lbs: number) => lbs * 0.45359237;

export const lbsFromKg = (kg: number) => kg / 0.45359237;

export const feetInchesFromCm = (cm: number) => {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches - feet * 12);
  return { feet, inches };
};
