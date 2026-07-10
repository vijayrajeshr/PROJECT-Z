

const mongoose = require('mongoose');

const selectedPlanSubSchema = new mongoose.Schema({
    id: {
        type: String, // String type for id
        required: false // Based on your requirement
    },
    name: {
        type: String,
        required: true
    }
}, { _id: false });
const mealTypeSubSchema = new mongoose.Schema({
    id: {
        type: String, // String type for id
        required: false // Based on your requirement
    },
    name: {
        type: String,
        required: true
    }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                refPath: 'items.productModelType'
            },
            name: {
                type: String,
                required: true,
            },
            description: {
                type: String,
            },
            img: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: [1, 'Quantity cannot be less than 1.'],
            },
            price: {
                type: Number,
                required: true,
            },
            foodType: {
                type: String,
            },
            itemType: {
                type: String,
                enum: ["firm", "tiffin"],
                required: true,
            },
            productModelType: {
                type: String,
                required: true,
                enum: ['Firm', 'Tiffin']
            },
            sourceEntityId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                refPath: "items.sourceEntityName",
            },
            sourceEntityName: {
                type: String,
                enum: ["Firm", "Tiffin"],
                required: true,
            },
            mealType: {
                type: mealTypeSubSchema,
                required: function () {
                    return this.itemType === "tiffin";
                },
            },
            selectedPlan: {
                type: selectedPlanSubSchema,
                required: function () {
                    return this.itemType === "tiffin";
                },
            },
            startDate: {
                type: Date,
                required: function () {
                    return this.itemType === "tiffin";
                },
            },
            endDate: {
                type: Date,
                required: function () {
                    return this.itemType === "tiffin";
                },
            },
            isDeliveredToday:{
                type:Boolean,

            }
        },
    ],
    subtotal: {
        type: Number,
        required: true,
        default: 0,
    },
    deliveryFee: {
        type: Number,
        required: true,
        default: 0,
    },
    platformFee: {
        type: Number,
        required: true,
        default: 0,
    },
    gstCharges: {
        type: Number,
        required: true,
        default: 0,
    },
    totalOtherCharges:[
        {
            name:{
            type:String,
            },
            value:{
                type:Number,
            },
            type:{
                type:String,
            }
    }
    ],
    history: {
        type: Boolean,
        default: false
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    discount: {
        type: Number,
        default: 0,
    },
    offerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer',
        required: false,
    },
    status: {
        type: String,
        enum: ['pending', 'preparing', 'ready', "rejected", 'accept', 'notaccept','user_canceled','completed'],
        default: 'notaccept',
    },
    cancellationReason:{
        type:String,
    },
    cancelledAt:{
        type:Date,
    },
    orderTime: {
        type: Date,
        required: true,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    fav: {
        type: Boolean,
        default: false,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    deliverTime:{
        type:String,
        required:function(){
            return this.itemType === "tiffin";
        }
    },
subStatus:[
    {
    date:{
        type:Date,
    },
    statue:{
    type:String,
    }
    }
    ],
    phone: { countryCode:{
    type:String,
    required: function () {
                    return this.itemType === "tiffin";
                },
    }, number:{ type:String,required: function () {
                return this.itemType === "tiffin";
                }, }},
    address:{
        type:String,
        required: function () {
                    return this.itemType === "tiffin";
        },
    },
    specialInstructions:{
        type:String,
    }
});

// orderSchema.pre('save', function (next) {
    

//     this.totalPrice =
//         this.subtotal + this.deliveryFee + this.platformFee + this.gstCharges - this.discount;
//     this.updatedAt = Date.now();
//     next();
// });

const Order = mongoose.model('OrderTakeAway', orderSchema);

module.exports = Order;