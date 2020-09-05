/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import { calculateBmi } from './calculateBmi';
import { calculateExercises } from './exerciseCalculator';

const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const { height, weight } = req.query;
  const heightInCm = Number(height);
  const weightInKg = Number(weight);

  if(isNaN(heightInCm) || isNaN(weightInKg) || heightInCm === 0 || weightInKg === 0) {
    res.status(400).json({
      error: 'malformatted parameters'
    });
    return ;
  }

  const bmi = calculateBmi(heightInCm, weightInKg);
  res.json({
    weight: heightInCm,
    height: weightInKg,
    bmi
  });
});

app.post('/exercises', (req, res) => {
  if (!req.body.daily_exercises || !req.body.target) {
    res.status(400).json({
      error: 'parameters missing'
    });
    return ;
  }

  const dailyExerciseHours = req.body.daily_exercises.map((hour: string) => Number(hour));
  const target = Number(req.body.target);

  if (isNaN(target) || dailyExerciseHours.filter((hour: number) => isNaN(hour)).length > 0) {
    res.status(400).json({
      error: 'malformatted parameters'
    });
    return ;
  }

  res.json(calculateExercises(dailyExerciseHours, target));
});



const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
