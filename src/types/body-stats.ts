export interface BodyMeasurement {
  id: string;
  date: string;
  weight: number;
  bodyFatPercentage?: number;
  arms?: number;
  chest?: number;
  waist?: number;
  thighs?: number;
}