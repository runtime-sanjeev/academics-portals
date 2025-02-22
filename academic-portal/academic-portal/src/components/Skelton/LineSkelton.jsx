
import PropTypes from "prop-types";

const LineSkelton = ({ height = 40, width = "100%" }) => {
    return (
        <div
            className="bg-gray-300 rounded relative overflow-hidden"
            style={{ height: `${height}px`, width }}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200 to-transparent animate-wave"></div>
        </div>
    );
};

LineSkelton.propTypes = {
    height: PropTypes.number,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default LineSkelton;
