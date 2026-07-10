import {BannerClickAnalytics} from './BannerClickAnalytics'
import { OrdersAnalytics } from './OrdersAnalytics';

export default function DashboardAnalytics() {
    
    return (
        <div className="flex flex-col gap-4 w-full mt-12">
            {/* Top Row */}
            <div className="md:flex-row flex flex-col gap-8 w-full">
                {/* Banner Clicks Chart */}
                <BannerClickAnalytics />

                {/* Orders Analytics */}
                <OrdersAnalytics />
            </div>            
        </div >
    );
}

