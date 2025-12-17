// models/AppDataModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//I should replace all of the Schema.Types.Objectid stuff with OID later
const OID = Schema.Types.ObjectId;

const baseOptions = {
  timestamps: true, 
};

const CoachSchema = new Schema({
  name: String,
  contact: String,
  teamIds: [{ type: Schema.Types.ObjectId, ref: 'Team' }],
  roles: [String]
}, baseOptions);

const AccountSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'athlete', // or 'coach', 'admin', etc.
  }
}, {
  timestamps: true,
});

const AthleteSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  details: String,
  accountId: { type: Schema.Types.ObjectId, ref: 'Account' },
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
  teamID: String,
  coachComments: String,
}, { 
  timestamps: true,
});

const TeamSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  sport: {
    type: String,
    required: true,
  },
  school: {
    type: String,
    required: true,
  },
  seasonStart: Date ,
  seasonEnd: Date ,
  adminId: { type: Schema.Types.ObjectId, ref: 'Coach' },
  headCoachId: { type: Schema.Types.ObjectId, ref: 'Coach' },
  assistantCoachIds: [{ type: Schema.Types.ObjectId, ref: 'Coach' }],
  athleteIds: [{ type: Schema.Types.ObjectId, ref: 'Athlete' }]
}, baseOptions);

const EventSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  type: String,
  teamId: { type: Schema.Types.ObjectId, ref: 'Team' },
  location: String,
  date: Date,
  start_time: String,  // HH:mm
  end_time: String, 
  participants: [{ type: Schema.Types.ObjectId, ref: 'Athlete' }]
}, baseOptions);

const AchievementSchema = new Schema({
  entityType: String,
  entityId: { type: Schema.Types.ObjectId },
  title: String,
  description: String,
  date: Date
}, baseOptions);

const AnnouncementSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  teamId: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  createdBy: {
    type: String,
    required: true
  },
  readBy: [{
    athleteId: { type: Schema.Types.ObjectId, ref: 'Athlete' },
    readAt: { type: Date, default: Date.now }
  }]
}, baseOptions);

const DrillSchema = new Schema({
  name: String,
  description: String,
  teamId: { type: Schema.Types.ObjectId, ref: 'Team' },
  coachId: { type: Schema.Types.ObjectId, ref: 'Coach' }
}, baseOptions);

const PlaybookSchema = new Schema({
  teamId: { type: Schema.Types.ObjectId, ref: 'Team' },
  name: String,
  content: String
}, baseOptions);

const DocumentSchema = new Schema({
  entityType: String,
  entityId: { type: Schema.Types.ObjectId },
  filePath: String,
  name: String
}, baseOptions);

const NoteSchema = new Schema({
  entityType: String,
  entityId: { type: Schema.Types.ObjectId },
  note: String,
  date: Date
}, baseOptions);

const MessageSchema = new Schema({
  senderId: { type: Schema.Types.ObjectId },
  recipientId: { type: Schema.Types.ObjectId },
  content: String,
  timestamp: Date
}, baseOptions);

const TaskSchema = new Schema({
  title: String,
  description: String,
  entityType: String,
  entityId: { type: Schema.Types.ObjectId },
  dueDate: Date
}, baseOptions);

const WorkoutSchema = new Schema({
  athleteId: { type: Schema.Types.ObjectId, ref: 'Athlete' },
  date: Date,
  type: String,
  metrics: Object
}, baseOptions);

const StatSchema = new Schema({
  athleteId: { type: Schema.Types.ObjectId, ref: 'Athlete' },
  eventId: { type: Schema.Types.ObjectId, ref: 'Event' },
  metrics: Object
}, baseOptions);

const FormationSchema = new Schema({
  teamId: { type: Schema.Types.ObjectId, ref: 'Team' },
  name: String,
  positions: Object
}, baseOptions);

const PlanSchema = new Schema({
  teamId: { type: Schema.Types.ObjectId, ref: 'Team' },
  name: String,
  objectives: String
}, baseOptions);

const PracticeSchema = new Schema({
  teamId: { type: Schema.Types.ObjectId, ref: 'Team' },
  drills: [{ type: Schema.Types.ObjectId, ref: 'Drill' }],
  time: Date,
  location: String
}, baseOptions);

const InventorySchema = new Schema({
  teamId: { type: Schema.Types.ObjectId, ref: 'Team' },
  item: String,
  quantity: Number
}, baseOptions);

const StandardSchema = new Schema({
  teamId: { type: Schema.Types.ObjectId, ref: 'Team' },
  title: String,
  description: String
}, baseOptions);

// might need to redo this one
const PerformanceSchema = new mongoose.Schema({
  athleteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Athlete' },
  event: String,
  stats: mongoose.Schema.Types.Mixed, // or use an object with predefined keys
  notes: String,
  date: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

/// NEW WORKOUT MODELS ... WILL ORGANIZE ONCE ITS FINISHED

/* --- WorkoutEntry & SetsEntry (embedded) --- */

const SetsEntrySchema = new Schema({
  targetReps: { type: Number, required: true },
  actualReps: { type: Number, default: 0 },
  weight: { type: Number, default: 0 },
  rpe: { type: Number, default: 0 },
  completed: { type: Boolean, default: false }
}, { _id: false });

const WorkoutEntrySchema = new Schema({
  type: { type: String, enum: ["Lift","Sprint","Explosive"], required: true },
  // reference to canonical exercise (recommended)
  exercise_id: { type: OID, ref: 'Exercise',required: true  }, 
  name: { type: String, required: true }, // fallback/display name
  reps: { type: [SetsEntrySchema], required: true },
  status: { type: Boolean, default:false },
  percentage: [Number],
  rpe: [Number],
  distance: [Number],
  notes: String
}, { _id: false });

/* --- WorkoutTemplate --- */
const WorkoutTemplateSchema = new Schema({
  teamId: { type: OID, ref: 'Team', required: true },
  name: { type: String, required: true },
  type: { type: String, required: true }, // Upper/Lower/Speed...
  workoutEntries: [WorkoutEntrySchema]
}, { collection: "workout_templates" });

const WorkoutLogSchema = new Schema({
  sessionId: { type: String, required: true, unique: false },
  teamId: { type: OID, ref: "Team", required: true },
  program_id: { type: OID, ref: "AssignedProgram", required: false }, // false untill i know the logs needd program_id
  workout_template_id: { type: OID, ref: "WorkoutTemplate", required: true },
  scheduledDate: {
    type: Date,
    required: true,
  },
  athlete: 
    {
      athlete_id: { type: OID, ref: "Athlete", required: true },
      completed: { type: Boolean, default: false },
      duration: { type: Number, default: 0},
      exercises: [
        {
          exercise_id: { type: OID, ref: "Exercise", required: true },
          exercise_name: String,
          dropdown_vis: Boolean,
          sets: [
            {
              targetReps: Number,
              actualReps: Number,
              weight: Number,
              rpe: Number,
              completed: { type: Boolean, default: false }
            }
          ]
        }
      ]
    }
}, { collection: "workout_log" });


/* --- ProgramEntry (embedded) --- */
const ProgramEntrySchema = new Schema({
  _id: { type: String, required: true },
  week: { type: Number, required: true },
  day: { type: String, enum: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"], required: true },
  workout: {
    template_id: { type: OID, ref: 'WorkoutTemplate' },   // reference to template
    custom_blocks: [WorkoutEntrySchema],                  // inline blocks
    type: { type: String, enum: ["strength","speed","mixed"] },
    notes: String
  }
}, { _id: false });

/* --- Program --- */
const ProgramSchema = new Schema({
  teamId: { type: OID, ref: 'Team', required: true },
  name: { type: String, required: true },
  duration_weeks: Number,
  created_by: { type: OID, ref: 'Coach', required: true }, // coach user id
  schedule: [ProgramEntrySchema]
});

/* --- AssignedProgram --- */
const AssignedProgramSchema = new Schema({
  program_id: { type: OID, ref: 'Program', required: true },
  teamId: { type: OID, ref: 'Team', required: true },
  assigned_to: [{ type: OID, ref: 'Athlete' }],   // array of athlete ObjectIds
  assigned_by: { type: OID, ref: 'Coach', required: true },
  start_date: { type: Date, required: true },
  current_week: { type: Number, default: 1 },
  duration_weeks: { type: Number, required: true },
  status: { type: String, enum: ["active","completed","paused"], default: "active" },
  schedule_override: [ProgramEntrySchema],
  notes: String
}, { collection: "assigned_programs" });

/* --- Exercise --- */
const ExerciseSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["lift","jump","sprint","throw","drill","accessory"], required: true },
  tags: [String],
  measurable: { type: Boolean, required: true },
  default_unit: { type: String, enum: ["lbs","in","m/s", "reps"] },
  description: String
});

const Exercise = mongoose.model('Exercise', ExerciseSchema);
const Workout_Templates = mongoose.model('WorkoutTemplate', WorkoutTemplateSchema);
const Assigned_Programs = mongoose.model('AssignedProgram', AssignedProgramSchema);
const Account = mongoose.model('Account', AccountSchema);
const Coach = mongoose.model("Coach", CoachSchema);
const Athlete = mongoose.model("Athlete", AthleteSchema);
const Team = mongoose.model("Team", TeamSchema);
const Achievement = mongoose.model("Achievement", AchievementSchema);
const Announcement = mongoose.model("Announcement", AnnouncementSchema);
const Event = mongoose.model("Event", EventSchema);
const Drill = mongoose.model("Drill", DrillSchema);
const Playbook = mongoose.model("Playbook", PlaybookSchema);
const Document = mongoose.model("Document", DocumentSchema);
const Note = mongoose.model("Note", NoteSchema);
const Message = mongoose.model("Message", MessageSchema);
const Task = mongoose.model("Task", TaskSchema);
const Program = mongoose.model("Program", ProgramSchema);
const Workout = mongoose.model("Workout", WorkoutSchema);
const Stat = mongoose.model("Stat", StatSchema);
const Formation = mongoose.model("Formation", FormationSchema);
const Plan = mongoose.model("Plan", PlanSchema);
const Practice = mongoose.model("Practice", PracticeSchema);
const Inventory = mongoose.model("Inventory", InventorySchema);
const Standard = mongoose.model("Standard", StandardSchema);
const Performance = mongoose.model('Performance', PerformanceSchema);
// specifcing it because my collection name is different (and I dont want to change it)
const Logs = mongoose.model('WorkoutLog', WorkoutLogSchema, 'workout_log');


module.exports = {
  Logs,
  Exercise,
  Workout_Templates,
  Assigned_Programs,
  Account,
  Coach,
  Athlete,
  Team,
  Achievement,
  Announcement,
  Event,
  Drill,
  Playbook,
  Document,
  Note,
  Message,
  Task,
  Program,
  Workout,
  Stat,
  Formation,
  Plan,
  Practice,
  Inventory,
  Standard,
  Performance
};

