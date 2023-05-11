//IMPORTACIONES DE REACT/FUNCIONALES
import * as React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { groupConsecutiveTurns, sortByDay, sortByTime } from './PanelSupervisorHelpers';
import { getAllSupervisorShiftAssign, getAllCompanionShiftAssign } from '../../Redux/Actions/viewActions';
import PopOut from '../../Components/PopOut/PopOut';
//IMPORTACIONES DE MATERIAL UI
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import { Box } from '@mui/system';
import { Button } from '@mui/material';


export default function PanelSupervision() {

    const dispatch = useDispatch(); //Para mandar traer los turnos del back.

    const navigate = useNavigate();

    const [supervisorCells, setSupervisorCells] = React.useState( //Para renderizar los turnos
        [[], [], [], [], [], [], []]
    );

    const [acompananteCells, setAcompananteCells] = React.useState( //Para renderizar los turnos
        [[], [], [], [], [], [], []]
    );

    const [togglePopOut, setTogglePopOut] = React.useState(false); //Estados para el PopOut

    const [popOutData, setPopOutData] = React.useState({
        idPersona: "",
        name: "",
        email: "",
        phone: ""
    })

    const [day, setDay] = React.useState(0); //Para el paginado por dias de la semana

    const { allCompanionShiftAssign, allSupervisorShiftAssign } = useSelector((state) => state.view)

    const { user } = useSelector((state) => state.auth);

    useEffect(() => { //Mando a traer la data del back
        dispatch(getAllSupervisorShiftAssign())
        dispatch(getAllCompanionShiftAssign())
    }, [])

    useEffect(() => { //Dejo este useEffect escuchando actualizaciones del estado, cuando llegue la data, que haga la lógica
        const processedSupervisorShifts = allSupervisorShiftAssign.map((person) => {
            const {
                id,
                name,
                lastName,
                email,
                phone,
                SupervisorShifts,
            } = person;
            const idPersona = id;
            return SupervisorShifts.map((turnos) => {
                let { id, day, time, timezone } = turnos;
                const userTimezone = parseInt(user.CityTimeZone.offSet.split("C")[1].split(":")[0]);
                const diferencia = userTimezone - (timezone)
                if (diferencia === 0) { //Si el usuario tiene la misma timezone que la default
                    return {
                        idPersona,
                        id,
                        name: `${name} ${lastName}`,
                        email,
                        phone,
                        day,
                        time,
                        timezone
                    }
                } else {
                    let start = parseInt(time.split("-")[0].split(":")[0]);
                    let end = parseInt(time.split("-")[1].split(":")[0]);
                    if (end === 0) end = 24;
                    if ((start + (diferencia) >= 0) && (end + (diferencia) <= 24)) { //No hay cambio de dia
                        start = start + (diferencia);
                        end = end + (diferencia);
                        if ((start - 10) < 0) {
                            start = `0${start}:00`
                        } else {
                            start = `${start}:00`
                        }

                        if ((end - 10) < 0) {
                            end = `0${end}:00`
                        } else {
                            end = `${end}:00`
                        }

                        time = `${start}-${end}`;
                    } else { //Hay cambio de día
                        if (start + (diferencia) < 0) { //Si cambia el dia para atras
                            start = 24 + (diferencia);
                            end = 25 + (diferencia);
                            if ((start - 10) < 0) {
                                start = `0${start}:00`
                            } else {
                                start = `${start}:00`
                            }
                            if ((end - 10) < 0) {
                                end = `0${end}:00`
                            } else {
                                end = `${end}:00`
                            }

                            if (day - 1 === -1) {
                                day = 6
                            } else {
                                day = day - 1
                            }
                            time = `${start}-${end}`;
                        } else { //Si cambia el dia para adelante
                            start = -1 + (diferencia);
                            end = 0 + (diferencia);
                            if ((start - 10) < 0) {
                                start = `0${start}:00`
                            } else {
                                start = `${start}:00`
                            }
                            if ((end - 10) < 0) {
                                end = `0${end}:00`
                            } else {
                                end = `${end}:00`
                            }

                            if (day + 1 === 7) {
                                day = 0
                            } else {
                                day = day + 1
                            }
                            time = `${start}-${end}`;
                        }
                    }
                    return {
                        idPersona,
                        id,
                        name: `${name} ${lastName}`,
                        email,
                        phone,
                        day,
                        time,
                        timezone
                    }
                }
            })
        })

        const sortedSupervisorsByDay = sortByDay(processedSupervisorShifts);

        const readySupervisor = groupConsecutiveTurns(sortByTime(sortedSupervisorsByDay))

        const processedCompanionShifts = allCompanionShiftAssign.map((person) => {
            const {
                id,
                name,
                lastName,
                email,
                phone,
                CompanionShifts,
            } = person;
            const idPersona = id;
            return CompanionShifts.map((turnos) => {
                let { id, day, time, timezone } = turnos;
                const userTimezone = parseInt(user.CityTimeZone.offSet.split("C")[1].split(":")[0]);
                const diferencia = userTimezone - (timezone)
                if (diferencia === 0) { //Si el usuario tiene la misma timezone que la default
                    return {
                        idPersona,
                        id,
                        name: `${name} ${lastName}`,
                        email,
                        phone,
                        day,
                        time,
                        timezone
                    }
                } else {
                    let start = parseInt(time.split("-")[0].split(":")[0]);
                    let end = parseInt(time.split("-")[1].split(":")[0]);
                    if (end === 0) end = 24;
                    if ((start + (diferencia) >= 0) && (end + (diferencia) <= 24)) { //No hay cambio de dia
                        start = start + (diferencia);
                        end = end + (diferencia);
                        if ((start - 10) < 0) {
                            start = `0${start}:00`
                        } else {
                            start = `${start}:00`
                        }

                        if ((end - 10) < 0) {
                            end = `0${end}:00`
                        } else {
                            end = `${end}:00`
                        }

                        time = `${start}-${end}`;
                    } else { //Hay cambio de día
                        if (start + (diferencia) < 0) { //Si cambia el dia para atras
                            start = 24 + (diferencia);
                            end = 26 + (diferencia);
                            if ((start - 10) < 0) {
                                start = `0${start}:00`
                            } else {
                                start = `${start}:00`
                            }
                            if ((end - 10) < 0) {
                                end = `0${end}:00`
                            } else {
                                end = `${end}:00`
                            }

                            if (day - 1 === -1) {
                                day = 6
                            } else {
                                day = day - 1
                            }
                            time = `${start}-${end}`;
                        } else { //Si cambia el dia para adelante
                            start = -2 + (diferencia);
                            end = 0 + (diferencia);
                            if ((start - 10) < 0) {
                                start = `0${start}:00`
                            } else {
                                start = `${start}:00`
                            }
                            if ((end - 10) < 0) {
                                end = `0${end}:00`
                            } else {
                                end = `${end}:00`
                            }

                            if (day + 1 === 7) {
                                day = 0
                            } else {
                                day = day + 1
                            }
                            time = `${start}-${end}`;
                        }
                    }
                    return {
                        idPersona,
                        id,
                        name: `${name} ${lastName}`,
                        email,
                        phone,
                        day,
                        time,
                        timezone
                    }
                }
            })
        })

        const sortedCompanionsByDay = sortByDay(processedCompanionShifts);

        const readyCompanion = groupConsecutiveTurns(sortByTime(sortedCompanionsByDay))

        setSupervisorCells(readySupervisor)
        setAcompananteCells(readyCompanion)
    }, [allCompanionShiftAssign, allSupervisorShiftAssign])

    const handleChange = (event) => { //Para el boton de los días.
        setDay(event.target.value);
    };

    return (
        <Box>
            <FormControl sx={{ minWidth: "100px", margin: "10px" }}> {/*Este Form Control Renderiza el Botón de los días*/}
                <InputLabel>Día</InputLabel>
                <Select
                    value={day}
                    label="Día"
                    onChange={handleChange}
                >
                    <MenuItem value={0}>Lunes</MenuItem>
                    <MenuItem value={1}>Martes</MenuItem>
                    <MenuItem value={2}>Miércoles</MenuItem>
                    <MenuItem value={3}>Jueves</MenuItem>
                    <MenuItem value={4}>Viernes</MenuItem>
                    <MenuItem value={5}>Sábado</MenuItem>
                    <MenuItem value={6}>Domingo</MenuItem>
                </Select>
            </FormControl>
            <Typography variant="h7" sx={{ display: "flex", padding: "10px", fontFamily: "poppins" }}>Horarios dispuestos en la zona horaria: {user.CityTimeZone.offSet} {user.CityTimeZone.zoneName}</Typography>
            <TableContainer component={Paper}>
                <Table Table sx={{ minWidth: 650, fontSize: "small" }} size="small">
                    <Box border={"solid"} borderRadius={"10px"}>
                        <TableHead> {/* Head de la Tabla (Texto de Disponibilidad Horaria y Celdas Horarias) */}
                            <TableRow>
                                <TableCell align="center" colSpan={25}>
                                    Disponibilidad horaria
                                </TableCell>
                            </TableRow>
                            <TableRow sx={{ height: "15px" }}>
                                <TableCell sx={{ border: "solid 2px black", minWidth: "50px", padding: "3px" }} align="center"><Typography fontSize={"small"} fontWeight={"bold"}>Horario</Typography></TableCell>
                                {Array.from(Array(24).keys()).map((hour) => {
                                    return (
                                        <TableCell
                                            key={hour}
                                            align="center"
                                            sx={{
                                                border: "solid 2px black",
                                                minWidth: "100px",
                                                padding: "3px",
                                            }}
                                        >
                                            <Typography fontSize={"small"} fontWeight={"bold"}>{hour}-{hour + 1}</Typography>
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        </TableHead>
                        <TableBody> {/* La Tabla en cuestión */}
                            <TableRow> {/* Row para las leyendas */}
                                <TableCell sx={{ border: "solid 1px #e6e6e6", minWidth: "100px", padding: "3px" }} align="center">
                                    <Typography fontSize={"small"} fontWeight={"bold"}>Supervisores</Typography>
                                </TableCell>
                                {Array.from(Array(24).keys()).map((hour) => {
                                    return (
                                        <TableCell key={`supervisor-${hour}`} align="center" sx={{ border: "solid 1px #e6e6e6", minWidth: "100px", padding: "3px" }}>
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                            {supervisorCells[day].map((turno) => {
                                {/* Aca se renderizan todos los turnos en cuestión */ }
                                const { name, email, phone, time, idPersona } = turno;
                                const initialTime = parseInt(time.split('-')[0]);
                                const finalTime = parseInt(time.split('-')[1]);
                                const duration = finalTime !== 0 ? finalTime - initialTime : finalTime + 24 - initialTime;
                                return (
                                    <TableRow sx={{ height: "15px" }}> {/* Retorno una nueva Table Row por cada turno */}
                                        <TableCell></TableCell>
                                        {Array.from(Array(24 - duration + 1).keys()).map((hour) => {
                                            {/* Renderizo las celdas */ }
                                            return (
                                                <TableCell
                                                    size='small'
                                                    onClick={hour === initialTime ? () => { setPopOutData({ idPersona, name, email, phone }); setTogglePopOut(true) } : null}
                                                    key={`${name}-${hour}`}
                                                    align="center"
                                                    colSpan={hour === initialTime ? duration : 1}
                                                    sx={{
                                                        backgroundColor: hour === initialTime ? "orange" : null,
                                                        cursor: hour === initialTime ? "pointer" : null,
                                                        '&:hover': {
                                                            backgroundColor: hour === initialTime ? "#d5ab00" : null,
                                                        },
                                                        whiteSpace: 'nowrap',
                                                        textOverflow: 'ellipsis',
                                                        overflow: 'hidden',
                                                        border: "solid 1px #e6e6e6",
                                                        padding: "3px"
                                                    }}
                                                >
                                                    {hour === initialTime ? <Typography fontSize={"small"} fontWeight={"bold"}>{name}</Typography> : null}
                                                </TableCell>
                                            )
                                        })}
                                    </TableRow>
                                )
                            })}
                            <TableRow> {/* Row para las leyendas */}
                                <TableCell sx={{ border: "solid 1px #e6e6e6", minWidth: "100px", padding: "3px" }}>
                                    <Typography fontSize={"small"} fontWeight={"bold"}>Acompañantes</Typography>
                                </TableCell>
                                {Array.from(Array(24).keys()).map((hour) => {
                                    return (
                                        <TableCell key={`supervisor-${hour}`} align="center" sx={{ border: "solid 1px #e6e6e6", minWidth: "100px", padding: "3px" }}>
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                            {acompananteCells[day].map((turno) => {
                                {/* Aca se renderizan todos los turnos en cuestión */ }
                                const { name, email, phone, time, idPersona } = turno;
                                const initialTime = parseInt(time.split('-')[0]);
                                const finalTime = parseInt(time.split('-')[1]);
                                const duration = finalTime - initialTime;
                                return (
                                    <TableRow> {/* Retorno una nueva Table Row por cada turno */}
                                        <TableCell></TableCell>
                                        {Array.from(Array(24 - duration + 1).keys()).map((hour) => {
                                            {/* Renderizo las celdas */ }
                                            return (
                                                <TableCell
                                                    onClick={hour === initialTime ? () => { setPopOutData({ idPersona, name, email, phone }); setTogglePopOut(true) } : null}
                                                    key={`${name}-${hour}`}
                                                    align="center"
                                                    colSpan={hour === initialTime ? duration : 1}
                                                    sx={{
                                                        backgroundColor: hour === initialTime ? "yellow" : null,
                                                        cursor: hour === initialTime ? "pointer" : null,
                                                        '&:hover': {
                                                            backgroundColor: hour === initialTime ? "#d5ab00" : null,
                                                        },
                                                        whiteSpace: 'nowrap',
                                                        textOverflow: 'ellipsis',
                                                        overflow: 'hidden',
                                                        border: "solid 1px #e6e6e6",
                                                        padding: "3px"
                                                    }}
                                                >
                                                    {hour === initialTime ? <Typography fontSize={"small"} fontWeight={"bold"}>{name}</Typography> : null}
                                                </TableCell>
                                            )
                                        })}
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Box>
                </Table>
            </TableContainer>
            <PopOut setTrigger={setTogglePopOut} trigger={togglePopOut}>
                <Button>
                    <Typography variant="h1" onClick={() => { navigate(`/profile/${popOutData.idPersona}/view`) }}>{popOutData.name}</Typography>
                </Button>
                <Typography variant="h1">{popOutData.email}</Typography>
                <Button>
                    <Typography variant="h1" component="a" href={`https://wa.me/${popOutData.phone}`} target="_blank">
                        {popOutData.phone}
                    </Typography>
                </Button>
            </PopOut>
        </Box>
    )
}
