import Navbar from "../../components/Navbars/NavigationBar2/NavigationBar2";
import UserProfileRightsideBar from "../../components/UserProfileComponents/UserProfileRightsideBar/UserProfileRightsideBar";

import LeftSideCardPanel from '../../utils/Cards/LeftSideCardPanel/LeftSideCardPanel';
import UserHero from '../../utils/UserProfileUtils/UserHero/UserHero';
// import SuggestedFollowCard from '../../utils/UserProfileUtils/SuggestedFollowCard/SuggestedFollowCard'; // Uncomment if needed
import ProfileWidget from "../../utils/UserProfileUtils/ProfileWidget/ProfileWidget";

// userImg is not directly used in this component's rendering, so it's commented out.
// import userImg from '/images/koushil.jpg';

const User = () => {
    let data1 = [
        {title: "Reviews", hash: "reviews"},
        // {title: "Photos", hash: "photos"},
        {title: "Recently Viewed", hash: "recently-viewed"},
        // {title: "Blog Posts", hash: "blog-posts"},
        {title:"Notifications", hash: "notification"},
      
    ];
    let data2 = [
        {title: "Takeaway orders", hash: "take-away"},
        {title: "Favorite Orders", hash: "favorite-orders"},
    ];
    let data5 = [
        {title: "Yours Booking", hash: "bookings"},
    ];
    let data6=[
        {title:"Your Tiffin Orders",hash:"orders"},
        {title:"Your Tiffin Fav Orders",hash:"fav-tiffin-orders"},
    ]
    let data4=[
        {title:"Favorite Restaurants" , hash:"fav-restaurants"},
        {title:"Favorite Tiffins" , hash:"fav-Tiffin"},
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col"> {/* Outer container for the entire page, takes min screen height, light gray background, column flex */}
            <div className="w-full">
                <Navbar />
            </div>
            <div className="w-full">
                <UserHero /> {/* UserHero: should span the full width of its parent */}
            </div>

            {/* Main content area: split into left and right columns */}
            <div className="flex flex-col lg:flex-row justify-center p-4 lg:p-6 mx-auto w-full max-w-7xl flex-grow"> {/* mainbody: responsive flex, centered, with max width, grows to fill space */}
                {/* Left sidebar: 20% width on large screens */}
                <div className="w-full lg:w-[20%] mb-4 lg:mb-0"> {/* Adjusted for gap */}
                    <LeftSideCardPanel name='ACTIVITY' data={data1} />
                    <LeftSideCardPanel name='TAKEAWAY ORDERS' data={data2} />
                    <LeftSideCardPanel name='TIFFIN ORDERS' data={data6} />
                    <LeftSideCardPanel name='TABLE BOOKING' data={data5} />
                    <LeftSideCardPanel name='RESTAURANT / TIFFIN' data={data4} />
                    {/* <SuggestedFollowCard name='SUGGESTED FOODIES TO FOLLOW' data={data3} /> */}
                    <ProfileWidget />
                </div>
                {/* Right content area: 70% width on large screens */}
                <div className="w-full lg:w-[70%]"> {/* Adjusted for gap */}
                    <UserProfileRightsideBar />
                </div>
            </div>
        </div>
    );
}

export default User;
