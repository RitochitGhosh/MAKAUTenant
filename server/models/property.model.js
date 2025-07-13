import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Property name is required"],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: 1000,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    pincode: {
      type: String,
      required: true,
      match: /^[0-9]{5,10}$/,
    },
    regularPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    discountedPrice: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.regularPrice;
        },
        message: "Discounted price should be less than regular price",
      },
    },
    bedRooms: {
      type: Number,
      required: true,
      min: 1,
    },
    bathRooms: {
      type: Number,
      required: true,
      min: 1,
    },
    furnished: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ["rent", "sale", "hostel", "pg"],
      required: true,
    },
    contactNo: {
      type: String,
      required: true,
      validate: {
        validator: function (val) {
          return /^[0-9]{10,15}$/.test(val);
        },
        message: "Invalid contact number",
      },
    },
    images: {
      type: [String],
      validate: {
        validator: function (arr) {
          return arr.length <= 6;
        },
        message: "You can upload a maximum of 6 images.",
      },
      default: [],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", propertySchema);

export default Property;
