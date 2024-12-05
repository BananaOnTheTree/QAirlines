const { Passenger, Ticket, FlightSeat, Flight, Seat, TicketClass} = require('../../models/schemas');
const {Op} = require("sequelize");

// Tìm hoặc tạo hành khách
async function findOrCreatePassenger(data) {
    const { firstName, lastName, dob, gender, email, phoneNumber, passport, ssn, guardianID } = data;

    const whereConditions = {};
    if (passport) whereConditions.Passport = passport;
    if (ssn) whereConditions.SSN = ssn;
    if (email) whereConditions.Email = email;
    if (phoneNumber) whereConditions.PhoneNumber = phoneNumber;

    let passenger = await Passenger.findOne({
        where: {
            ...whereConditions,
            FirstName: firstName,
            LastName: lastName,
            DOB: dob,
            Gender: gender,
        },
    });

    if (!passenger) {
        passenger = await Passenger.create({
            PassID: `P${Math.floor(Math.random() * 1000000)}`,
            FirstName: firstName,
            LastName: lastName,
            DOB: dob,
            Gender: gender,
            Email: email,
            PhoneNumber: phoneNumber,
            Passport: passport,
            SSN: ssn,
            GuardianID: guardianID,
        });
    }

    return passenger;
}

// Đặt vé cho hành khách
async function bookTicket(flightID, seatNo, passID) {
    const flight = await Flight.findByPk(flightID);
    if (!flight) throw new Error('Chuyến bay không tồn tại');

    const ticketID = `T${Math.floor(Math.random() * 1000000)}`;
    const cancellationDeadline = new Date(new Date(flight.DepTime).getTime() - 72 * 60 * 60 * 1000);

    const ticket = await Ticket.create({
        TicketID: ticketID,
        FlightID: flightID,
        AircraftID: flight.AircraftID,
        SeatNo: seatNo,
        PassID: passID,
        CancellationDeadline: cancellationDeadline,
    });

    await FlightSeat.update(
        { TicketID: ticketID },
        { where: { FlightID: flightID, SeatNo: seatNo } }
    );

    return ticket;
}

// Hủy vé
async function cancelTicket(ticketID) {
    const ticket = await Ticket.findByPk(ticketID);
    if (!ticket) throw new Error('Vé không tồn tại');

    await FlightSeat.update(
        { TicketID: null },
        { where: { FlightID: ticket.FlightID, SeatNo: ticket.SeatNo } }
    );

    await ticket.destroy();

    return true;
}

// Lấy thông tin vé theo hành khách
async function getTicketsByPassenger(identifier) {
    // Tìm hành khách người lớn dựa trên SSN hoặc Passport
    const guardian = await Passenger.findOne({
        where: {
            [Op.or]: [
                { SSN: identifier },
                { Passport: identifier }
            ]
        }
    });

    if (!guardian) {
        throw new Error('Guardian not found with the provided SSN or Passport');
    }

    const dependents = await Passenger.findAll({
        where: { GuardianID: guardian.PassID },
        attributes: ['PassID', 'FirstName', 'LastName', 'Gender', 'DOB', 'GuardianID']
    });

    const allPassengers = [
        {
            PassID: guardian.PassID,
            FirstName: guardian.FirstName,
            LastName: guardian.LastName,
            Gender: guardian.Gender,
            DOB: guardian.DOB,
            GuardianID: null
        },
        ...dependents.map(dependent => ({
            PassID: dependent.PassID,
            FirstName: dependent.FirstName,
            LastName: dependent.LastName,
            Gender: dependent.Gender,
            DOB: dependent.DOB,
            GuardianID: dependent.GuardianID
        }))
    ];

    const passengerMap = new Map(
        allPassengers.map(passenger => [passenger.PassID, passenger])
    );

    // Lấy vé của tất cả hành khách này
    let tickets = await Ticket.findAll({
        where: { PassID: { [Op.in]: Array.from(passengerMap.keys()) } },
        include: [
            {
                model: Flight,
            },
            {
                model: FlightSeat,
                include: [{
                    model: Seat,
                    as: 'seatDetails',
                    attributes: ['Class']
                }]
            }
        ],
        distinct: true,
    });

    tickets = Array.from(
        new Map(
            tickets.map(ticket => [`${ticket.TicketID}-${ticket.FlightID}-${ticket.SeatNo}`, ticket])
        ).values()
    );

    if (tickets.length === 0) {
        throw new Error('No tickets found for this guardian and dependents');
    }

    // Kết hợp thông tin hành khách với thông tin vé
    return tickets.map(ticket => {
        const passenger = passengerMap.get(ticket.PassID);
        const flightSeat = ticket.FlightSeat || {};
        const seatClass = flightSeat.seatDetails || {};

        return {
            TicketID: ticket.TicketID,
            Class: seatClass.Class || 'N/A',
            FlightID: ticket.FlightID,
            SeatNo: ticket.SeatNo,
            AircraftID: ticket.AircraftID,
            CancellationDeadline: ticket.CancellationDeadline,
            FlightDetails: ticket.Flight,
            Passenger: passenger
        };
    });
}


// Lấy thông tin vé theo ID kèm theo hạng vé và thông tin hành khách
async function getTicketByID(ticketID) {
    const ticket = await Ticket.findByPk(ticketID);
    if (!ticket) throw new Error('Không tìm thấy vé có ID này');

    const passenger = await Passenger.findByPk(ticket.PassID);
    if (!passenger) throw new Error('Không tìm thấy hành khách');

    const flight = await Flight.findByPk(ticket.FlightID, {
        include: [{
            model: TicketClass,
            as: 'ticketClasses',
            attributes: ['ClassName', 'Price']
        }]
    });

    if (!flight) throw new Error('Không tìm thấy chuyến bay tương ứng');

    const flightSeat = await FlightSeat.findOne({
        where: { TicketID: ticketID },
        include: [{
            model: Seat,
            as: 'seatDetails',
            attributes: ['Class']
        }]
    });

    const seatClass = flightSeat?.seatDetails?.Class || null;
    const ticketClassDetails = seatClass
        ? flight.ticketClasses.find(tc => tc.ClassName === seatClass)
        : null;

    return {
        TicketID: ticket.TicketID,
        FlightID: ticket.FlightID,
        SeatNo: ticket.SeatNo,
        AircraftID: ticket.AircraftID,
        Class: ticketClassDetails.ClassName,
        Price: ticketClassDetails.Price,
        CancellationDeadline: ticket.CancellationDeadline ? ticket.CancellationDeadline.toISOString() : null,
        Passenger: {
            PassID: passenger.PassID,
            FirstName: passenger.FirstName,
            LastName: passenger.LastName,
            DOB: passenger.DOB ? passenger.DOB : null,
            Gender: passenger.Gender
        },
        Flight: {
            FlightID: flight.FlightID,
            DepTime: flight.DepTime ? flight.DepTime.toISOString() : null,
            ArrTime: flight.ArrTime ? flight.ArrTime.toISOString() : null,
            BoardingTime: flight.BoardingTime ? flight.BoardingTime.toISOString() : null,
            DepID: flight.DepID,
            DestID: flight.DestID,
            AircraftID: flight.AircraftID
        }
    };
}

module.exports = {
    findOrCreatePassenger,
    bookTicket,
    cancelTicket,
    getTicketsByPassenger,
    getTicketByID
};
