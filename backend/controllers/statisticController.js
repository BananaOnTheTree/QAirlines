const { getMonthlyBookingStatistic, getMonthlyIncomeStatistic} = require("../services/statistic/statisticService");

exports.handleMonthlyBooking = async (req, res) => {
    try {
        const { year } = req.query;
        const monthlyStatistics = await getMonthlyBookingStatistic(year);
        return res.status(200).json({
            year,
            monthlyStatistics,
        });
    } catch (error) {
        console.error("Error fetching monthly booking statistics:", error.message);
        return res.status(500).json({ error: "Failed to fetch monthly booking statistics" });
    }
};

exports.handleMonthlyIncome = async (req, res) => {
    try {
        const { year } = req.query;
        const monthlyStatistics = await getMonthlyIncomeStatistic(year);
        return res.status(200).json({
            year,
            monthlyStatistics,
        });
    } catch (error) {
        console.error("Error fetching monthly income statistics:", error.message);
        return res.status(500).json({ error: "Failed to fetch monthly income statistics" });
    }
}