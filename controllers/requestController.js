// controllers/requestController.js
const { Coach, Athlete, Account, Team, Event, Program, Announcement, Exercise, Workout_Templates, Assigned_Programs, Logs } = require('../models/AppDataModel');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//
//  GET REQUESTS
//

const getAllCoaches = async (req, res) => {
  try {
    const coaches = await Coach.find({}).sort({ createdAt: -1 });
    res.status(200).json(coaches);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllAthletes = async (req, res) => {
  try {
    const athletes = await Athlete.find({}).sort({ createdAt: -1 });
    res.status(200).json(athletes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({}).sort({ createdAt: -1 });
    res.status(200).json(accounts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({}).sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//
//  CREATE / FETCH SPECIFIC
//

const getTeam = async (req, res) => {
  try {
    const { athleteId } = req.body;
    const team = await Team.findOne({
      athleteIds: { $in: [athleteId] }
    }).sort({ createdAt: -1 });

    res.status(200).json(team);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const checkLoginCreds = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Account.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid email' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid password' });

    const athlete = await Athlete.findOne({ accountId: user._id }).select("name position jerseyNumber");
    if (!athlete) return res.status(404).json({ error: 'Athlete not found' });

    res.status(200).json({ message: 'Login successful', athlete });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Creates both account and athlete
const createAthlete = async (req, res) => {
  try {
    const { password, email, role = 'athlete' } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const account = await Account.create({ email, passwordHash: hashedPassword, role });
    const athlete = await Athlete.create({ accountId: account._id });

    res.status(201).json({ account, athlete });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createTeam = async (req, res) => {
  try {
    const { name, sport, school, seasonStart, seasonEnd, adminId, headCoachId, assistantCoachIds = [], athleteIds = [] } = req.body;

    const team = await Team.create({
      name,
      sport,
      school,
      seasonStart: seasonStart || undefined,
      seasonEnd: seasonEnd || undefined,
      adminId,
      headCoachId,
      assistantCoachIds,
      athleteIds
    });

    res.status(201).json({ message: 'Team created', team });
  } catch (error) {
    console.error('Team creation error:', error);
    res.status(400).json({ error: error.message });
  }
};

const createEvent = async (req, res) => {
  try {
    const { title, description, type, teamId, location, date, start_time, end_time, participants = [] } = req.body;

    const event = await Event.create({
      title,
      description,
      type,
      teamId,
      location,
      date,
      start_time,
      end_time,
      participants
    });

    res.status(201).json({ message: 'Event created', event });
  } catch (error) {
    console.error('Event creation error:', error);
    res.status(400).json({ error: error.message });
  }
};

const getAnnouncements = async (req, res) => {
  try {
    const { teamId } = req.body;
    const announcements = await Announcement.find({ teamId }).sort({ createdAt: -1 });
    res.status(200).json(announcements);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createAnnouncement = async (req, res) => {
  try {
    const { title, description, teamId, createdBy } = req.body;
    const announcement = await Announcement.create({ title, description, teamId, createdBy });
    res.status(201).json({ message: 'Announcement created', announcement });
  } catch (error) {
    console.error('Announcement creation error:', error);
    res.status(400).json({ error: error.message });
  }
};

//
//  WORKOUT / PROGRAM
//

const getAssignedProgram = async (req, res) => {
  try {
    const { athleteId, teamId } = req.body;
    const assignedProgram = await Assigned_Programs.find({
      assigned_to: { $in: [athleteId] },
      teamId,
    }).populate({
      path: "program_id",
      populate: {
        path: "schedule.workout.template_id",
        model: "WorkoutTemplate"
      },
    });

    res.status(200).json(assignedProgram);
  } catch (error) {
    console.error('Assigned Program error:', error);
    res.status(400).json({ error: error.message });
  }
};

  const getWorkoutLog = async (req, res) => {
    try {
      const { teamId, workout_template_id, athleteId } = req.body;
      
      const filter = {};
      if (teamId) filter.teamId = teamId;
      if (workout_template_id) filter.workout_template_id = workout_template_id;
      if (athleteId) filter['athlete.athlete_id'] = athleteId;

      const logs = await Logs.find(filter)
        .populate("teamId", "name")
        .populate("program_id", "name")
        .populate("workout_template_id", "name")
        .populate("athlete.athlete_id", "name position jerseyNumber")
        .populate("athlete.exercises.exercise_id", "name description");

      res.status(200).json(logs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching workout logs", error });
    }
  };

  const getAllWorkoutLogs = async (req, res) => {
    try {
      const { userId, teamId, program_ids } = req.body;
      
      console.log('=== GET ALL WORKOUT LOGS ===');
      console.log('Received params:', { userId, teamId, program_ids });
      
      const filter = {};

      if (userId) filter['athlete.athlete_id'] = userId;
      if (teamId) filter.teamId = teamId;

      // TEMPORARILY COMMENT OUT program_ids to test
      // if (program_ids && Array.isArray(program_ids) && program_ids.length > 0) {
      //   filter.program_id = { $in: program_ids };
      // }

      console.log('Filter:', JSON.stringify(filter, null, 2));

      const logs = await Logs.find(filter);
      
      console.log('Logs found:', logs.length);
      
      // Log the first result to see its structure
      if (logs.length > 0) {
        console.log('First log sample:', JSON.stringify(logs[0], null, 2));
      }

      res.status(200).json(logs);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: "Error fetching workout logs", error: error.message });
    }
  };

 const createWorkoutLog = async (req, res) => {
  try {
    const { teamId, workout_template_id, athlete } = req.body;
    
    // Check if a log already exists for this user/workout/team
    const existingLog = await Logs.findOne({
      teamId,
      workout_template_id,
      'athlete.athlete_id': athlete.athlete_id
    });

    if (existingLog) {
      return res.status(200).json(existingLog); // return existing log instead of creating a new one
    }

    const newWorkoutLog = await Logs.create(req.body);
    res.status(201).json(newWorkoutLog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const updateWorkoutLog = async (req, res) => {
  const { id } = req.params;
  console.log(id)
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log("ID not valid")
    return res.status(404).json({ error: 'No such workout log' });
  }
  const workoutLog = await Logs.findOneAndUpdate(
    { _id: id },
    { ...req.body },
    { new: true }
  );

  if (!workoutLog) return res.status(404).json({ error: "No such workout log" });

  res.status(200).json(workoutLog);
};

//
//  CREATE EXERCISES / WORKOUTS / PROGRAMS
//

const createExercise = async (req, res) => {
  try {
    const { name, type, tags, measurable, default_unit, description } = req.body;
    const exercise = await Exercise.create({ name, type, tags, measurable, default_unit, description });
    res.status(201).json({ message: 'Exercise created', exercise });
  } catch (error) {
    console.error('Exercise creation error:', error);
    res.status(400).json({ error: error.message });
  }
};

const createWorkoutTemp = async (req, res) => {
  try {
    const { teamId, name, type, workoutEntries } = req.body;
    const workoutTemp = await Workout_Templates.create({ teamId, name, type, workoutEntries });
    res.status(201).json({ message: 'Workout Template created', workoutTemp });
  } catch (error) {
    console.error('Workout Template creation error:', error);
    res.status(400).json({ error: error.message });
  }
};

const getAllWorkoutTemplates = async (req, res) => {
  try {
    // Fetch all workout templates from the collection
    const templates = await Workout_Templates.find(); 

    res.status(200).json({ message: "Workout Templates fetched", templates });
  } catch (error) {
    console.error("Error fetching workout templates:", error);
    res.status(500).json({ error: error.message });
  }
};

const createProgram = async (req, res) => {
  try {
    const { teamId, name, duration_weeks, created_by, schedule } = req.body;
    const program = await Program.create({ teamId, name, duration_weeks, created_by, schedule });
    res.status(201).json({ message: 'Program created', program });
  } catch (error) {
    console.error('Program creation error:', error);
    res.status(400).json({ error: error.message });
  }
};

const createAssignedProgram = async (req, res) => {
  try {
    const { program_id, teamId, assigned_to,  duration_weeks, assigned_by, start_date, current_week, status, schedule_override, notes } = req.body;
    const assignedProgram = await Assigned_Programs.create({
      program_id, teamId, assigned_to, duration_weeks, assigned_by, start_date, current_week, status, schedule_override, notes
    });
    res.status(201).json({ message: 'Assigned Program created', assignedProgram });
  } catch (error) {
    console.error('Assigned Program error:', error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  // WORKOUT LOGS
  updateWorkoutLog,
  getWorkoutLog,
  createWorkoutLog,
  getAssignedProgram,
  getAllWorkoutLogs,

  // ANNOUNCEMENTS
  createAnnouncement,
  getAnnouncements,

  // TEAMS / USERS
  createTeam,
  getTeam,
  createAthlete,
  checkLoginCreds,
  getAllCoaches,
  getAllAthletes,
  getAllAccounts,
  getAllEvents,

  // PROGRAMS / WORKOUTS
  createExercise,
  createWorkoutTemp,
  createProgram,
  createAssignedProgram,
  getAllWorkoutTemplates,

  // EVENTS
  createEvent
};
