export interface EventProps {
  _id?: string; // MongoDB adds this
  title: string;
  description?: string;
  type: string;
  teamId: string;
  location?: string;
  time?: string; // ISO string format
  start_time: string;
  end_time: string;
  participants?: string[]; // Array of ObjectId strings
}

export interface User {
  _id: string,
  name: String,
  details: String,
  position: String,
  jerseyNumber: Number,
  year: String,
  height: String,
  weight: String,
  speed: String,
  strength: String,
  stats: String,
  workoutHistory: String,
  filmNotes: String,
  injuries: String,
  gameEligibility: String,
  coachComments: String,
}

export interface Team {
  _id?: string;
  name: string;
  sport: string;
  school: string;
  seasonStart?: string; // ISO date string
  seasonEnd?: string; // ISO date string
  adminId?: string; // ObjectId as string
  headCoachId?: string; // ObjectId as string
  assistantCoachIds?: string[]; // Array of ObjectId strings
  athleteIds?: string[]; // Array of ObjectId strings
  createdAt?: string; // From baseOptions
  updatedAt?: string; // From baseOptions
}

export interface Announcement {
  _id?: string;
  title: string;
  description: string;
  teamId: string;
  createdBy: string;
  readBy?: {
    athleteId: string;
    readAt: string;
    _id?: string;
  }[]; // Because readBy is an array of objects
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

/// WORKOUT NEW STUFF
///
///

export interface Exercise {
  id: string;
  name: string;
  type: "lift" | "jump" | "sprint" | "throw" | "drill" | "accessory";
  tags?: string[];
  measurable: boolean;
  default_unit?: "lbs" | "in" | "m/s";
  description?: string;
}

export interface WorkoutEntry {
  type: "Lift" | "Sprint" | "Explosive";
  exercise_id: string;
  name: string;
  status: boolean;
  reps: SetsEntry[];
  percentage?: number[];
  rpe?: number[];
  distance?: number[];
  notes?: string;
}
// connected to WorkoutEntry
export interface SetsEntry {
  targetReps: number,
  actualReps: number,
  weight: number,
  rpe: number,
  completed: { type: boolean, default: false }
}

export interface WorkoutTemplate {
  _id: string;
  team_id: string;
  name: string;
  type: string;
  workoutEntries: WorkoutEntry[];
}

export interface ProgramEntry {
  week: number;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  workout: {
    template_id?: string;
    custom_blocks?: WorkoutEntry[];
    type?: "strength" | "speed" | "mixed";
    notes?: string;
  };
}

export interface AssignedProgram {
  id: string;
  program_id: string;
  team_id: string;
  assigned_to: string[];
  assigned_by: string;
  start_date: string;
  current_week: number;
  duration_weeks: number;
  status?: "active" | "completed" | "paused";
  schedule_override?: ProgramEntry[];
  notes?: string;
}

export interface ProgramInterface {
  _id?: string;
  teamId: string;
  name: string;
  duration_weeks: number;
  created_by: string
  schedule: {
    _id: string;
    week: number;
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
    workout: {
      template_id: string
      type: 'strength' | 'cardio' | 'flexibility' | 'sports' | string; // Add other workout types as needed
      notes?: string;
    };
    custom_blocks: any[];
  }[];
  __v: number;
}

export interface WorkoutLog {
  _id: string | undefined;
  sessionId: string;
  teamId: string;
  workout_template_id: string;
  scheduledDate: Date;
  athlete: {
    athlete_id: string;
    completed: boolean;
    duration: number;
    exercises: {
      exercise_id: string;
      exercise_name: string;
      dropdown_vis: boolean;
      sets: {
        targetReps: number;
        actualReps?: number | undefined;
        weight?: number | undefined;
        rpe?: number | undefined;
        completed: boolean;
      }[];
    }[];

  };
}
