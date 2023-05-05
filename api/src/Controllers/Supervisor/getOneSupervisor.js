const { Supervisor, CityTimeZone, SupervisorShift, Companion } = require("../../db");

//Controlador para verificar login de un Supervisor y llenar el perfil
const getOneSupervisor = async (req, res) => {
  try {
    let supervisor;
    //Se obtiene el email y contraseña desde el formulario
    const { email } = req.body;
    //Se busca el supervisor por email
    supervisor = await Supervisor.findOne({
      where: { email: email},
      include: [
        {
          model: SupervisorShift,
          attributes: ["id", "day", "time", "timezone"],
          through: { attributes: [] },
        },
        {
          model: Companion,
          attributes: ['name', 'lastName', "phone", "profilePhoto", "country"],
        },
      ],
    });
    //Si existe el supervisor y la contraseña coincide se procede a responder
    if (supervisor && supervisor.isActive) {
      //Retorna un supervisor con todos sus datos (Sirve para cargar el perfil)
      return res.status(200).json(supervisor);
    }
    if (supervisor && !supervisor.isActive) {
      return res
        .status(400)
        .json("Cuenta inactiva comuniquese con el administrador");
    } else {
      //Devuelve error si alguno de los datos no coincide
      return res.status(404).json("El Supervisor no se encontro");
    }
  } catch (error) {
    res.status(404).json("El Supervisor no se encontro");
  }
};

module.exports = getOneSupervisor;
