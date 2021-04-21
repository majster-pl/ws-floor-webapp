const CalendarSpinner = ({numberOfDays }) => {
    return (
        <tbody className={""}>
            <tr colSpan={numberOfDays*2}>
                <td colSpan={numberOfDays*2}>
                    <div
                        className="jumbotron d-flex align-items-center p-0 m-0 bg-transparent"
                        style={{ height: "76vh" }}
                    >
                        <div className="container text-center">
                            <button className="btn btn-primary">
                                <span className="spinner-grow spinner-grow-sm"></span>
                                <span className="pl-2">Loading data...</span>
                            </button>
                        </div>
                    </div>
                </td>
            </tr>
        </tbody>
    );
};

export default CalendarSpinner;
