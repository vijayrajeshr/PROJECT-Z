import { NavLink, useParams } from 'react-router-dom';

// Remove the CSS module import:
// import css from './LeftSideCardPanel.module.css';

let LeftSideCardPanel = ({name, data}) => {
    let { userId } = useParams();

    return (
        <div className="bg-white rounded-lg shadow-md mb-4 w-full"> {/* outerDiv: full width card styling */}
            <div className="p-4"> {/* innerDiv: padding inside the card */}
                <div className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3"> {/* title: stylish heading */}
                    {name}
                </div>
                <div className="flex flex-col space-y-1"> {/* body: vertical list of links with spacing */}
                    {data?.map(val => (
                        <NavLink
                            to={`/user/${userId}/${val.hash}`}
                            key={val.hash}
                            // Apply Tailwind classes conditionally for active state
                            className={({ isActive }) =>
                                `block py-2 px-3 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200 ease-in-out ${
                                    isActive ? 'bg-[#02747a20] text-primary-green-500 font-medium' : '' // Active state styling
                                }`
                            }
                        >
                            <span className="text-sm">{val.title}</span> {/* linkTxt: text styling */}
                        </NavLink>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default LeftSideCardPanel;