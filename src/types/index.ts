export interface Exercise {
  exerciseId: string;
  name: string;
  gifUrl?: string;
  targetMuscles?: string[];
  bodyParts?: string[];
  equipments?: string[];
  secondaryMuscles?: string[];
  instructions?: string[];
}

export type Post = {
  id: string;
  title: string;
  content: string;
};

export interface Nutrient {
  name: string;
  amount: number;
  unit: string;
}
