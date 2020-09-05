interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number
}

export const calculateExercises = (dailyExerciseHours: Array<number>, target: number) : Result => {
  const periodLength = dailyExerciseHours.length;
  const effectiveExerciseHours = dailyExerciseHours.filter((hour) => hour > 0);
  const totalTrainingHours = effectiveExerciseHours.reduce((a, b) => a + b, 0);
  const trainingDays = effectiveExerciseHours.length;
  const average = totalTrainingHours / periodLength;
  const success = average >= target;
  const meetingPercentage = average / target * 100.0;
  let rating, ratingDescription;
  if (meetingPercentage >= 100) {
    rating = 3;
    ratingDescription = 'Well done';
  } else if (meetingPercentage >= 80) {
    rating = 2;
    ratingDescription = 'Not too bad but could be better';
  } else {
    rating = 1;
    ratingDescription = 'No performance';
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
};
