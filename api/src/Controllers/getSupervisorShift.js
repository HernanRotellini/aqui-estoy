const {SupervisorShift} = require("../db");

//* Funcion que setea la tabla SuperiorShift con turnos cada 1 hs, por 24 hs, 7 dias.
async function fillSupervisorShifts() {
    const startHour = 1; // hora de inicio de los turnos
    const endHour = 24; // hora de fin de los turnos
    const timeZone = -3; // timezone para Argentina
    const shifts = [];
  
    for (let day = 0; day < 7; day++) {
      for (let hour = startHour; hour <= endHour; hour++) {
        let hs = hour.toString() + - + (hour+1).toString(); 
        const shift = {
          day: day,
          time: hs,
          timezone: timeZone,
        };
        shifts.push(shift);
      }
    }
 
    await SupervisorShift.bulkCreate(shifts);
    
  }
  //* Ruta que trae la tabla SuperiorShift con todos los turnos creados
  const getSupervisorShift= async(req,res) => {
    try {
        await fillSupervisorShifts()
        const dbSupervisorShift = await SupervisorShift.findAll()
        res.status(200).json(dbSupervisorShift);
       
      } catch (error) {
        res.status(400).json({error: 'Error del servidor'})
      }
    };


  module.exports = {getSupervisorShift, fillSupervisorShifts};