// routes/commands.js
const express = require('express');
const router = express.Router();

const {
  getAllCoaches,
  getAllAccounts,
  getAllAthletes,
  getAnnouncements,
  createAthlete,
  checkLoginCreds,
  createEvent,
  createTeam,
  getAllEvents,
  createAnnouncement,
  getTeam,
  createExercise,
  createAssignedProgram,
  createProgram,
  createWorkoutTemp,
  getAssignedProgram,
  createWorkoutLog,
  getWorkoutLog,
  updateWorkoutLog,
  getAllWorkoutLogs,
  getAllWorkoutTemplates
} = require('../controllers/requestController');

router.get('/coaches', getAllCoaches);
router.get('/athletes', getAllAthletes);
router.get('/accounts', getAllAccounts);
router.get('/getevents', getAllEvents); 
router.get('/get_all_workout_templates', getAllWorkoutTemplates);
router.post('/getannouncements', getAnnouncements); 
router.post('/createathlete', createAthlete); 
router.post('/loginscheck', checkLoginCreds); 
router.post('/createteam', createTeam); 
router.post('/createevent', createEvent); 
router.post('/createannouncement', createAnnouncement); 
router.post('/findteam', getTeam); 
router.post('/create_exercise', createExercise); 
router.post('/create_assigned_program', createAssignedProgram); 
router.post('/create_program', createProgram); 
router.post('/create_workout_temp', createWorkoutTemp); 
router.post('/get_assigned_program', getAssignedProgram); 
router.post('/create_workout_log', createWorkoutLog); 
router.post('/get_workout_log', getWorkoutLog); 
router.post('/get_all_workout_logs', getAllWorkoutLogs); 
 
router.patch('/update_workout_log/:id', updateWorkoutLog);




module.exports = router;