import axios from "../axios";

const filterBookings = (data) => {
    return axios.post("/api/filter-bookings", data);
};

const updateStatusBooking = (data) => {
    return axios.post("/api/update-status-booking", data);
};

export {
    filterBookings,
    updateStatusBooking
};
