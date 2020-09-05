export const calculateBmi = (heightInCm: number, weightInKg: number) : string => {
  const heightInMeter = heightInCm / 100.0;
  const bmi = weightInKg / (heightInMeter * heightInMeter);

  // Category: https://en.wikipedia.org/wiki/Body_mass_index#Categories
  if (bmi <= 15) {
    return 'Very severely underweight';
  }
  if (bmi <= 16) {
    return 'Severely underweight';
  }
  if (bmi <= 18.5) {
    return 'Underweight';
  }
  if (bmi <= 25) {
    return 'Normal (healthy weight)';
  }
  if (bmi <= 30) {
    return 'Overweight';
  }
  if (bmi <= 35) {
    return 'Obese Class I (Moderately obese)';
  }
  if (bmi <= 40) {
    return 'Obese Class II (Severely obese)';
  }
  return 'Obese Class III (Very severely obese)';
};
