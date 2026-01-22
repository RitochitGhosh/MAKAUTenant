import Property from "../models/property.model.js";
import { errorHandler } from "../utils/error.js";
import { responseHandler } from "../utils/response.js";

export const createPropertyController = async (req, res, next) => {
  try {
    const {
      name,
      description,
      address,
      city,
      state,
      pincode,
      regularPrice,
      discountedPrice,
      bedRooms,
      bathRooms,
      furnished,
      type,
      contactNo,
      images,
    } = req.body;

    if (images?.length > 6) {
      return next(errorHandler(400, "Maximum 6 images allowed!"));
    }

    if (!/^[0-9]{10,15}$/.test(contactNo)) {
      return next(errorHandler(400, "Invalid contact number format"));
    }

    if (discountedPrice && discountedPrice >= regularPrice) {
      return next(
        errorHandler(400, "Discounted price must be less than regular price")
      );
    }

    const newProperty = new Property({
      name,
      description,
      address,
      city,
      state,
      pincode,
      regularPrice,
      discountedPrice,
      bedRooms,
      bathRooms,
      furnished,
      type,
      contactNo,
      images,
      owner: req.user.id,
    });

    const savedProperty = await newProperty.save();
    responseHandler(res, 201, savedProperty, "Propert created successfully!");
  } catch (error) {
    next(error);
  }
};

export const getAllPropertiesController = async (req, res, next) => {
  try {
    const {
      minPrice,
      maxPrice,
      location,
      city,
      bedRooms,
      bathRooms,
      furnished,
      type,
      isAvailable,
      search,
      page = 1,
      limit = 9,
    } = req.query;

    const filter = {};

    // Price Range
    if (!isNaN(minPrice) || !isNaN(maxPrice)) {
      filter.regularPrice = {};
      if (!isNaN(minPrice)) filter.regularPrice.$gte = Number(minPrice);
      if (!isNaN(maxPrice)) filter.regularPrice.$lte = Number(maxPrice);
    }

    // Location (address substring match)
    if (location?.trim()) {
      filter.address = { $regex: location.trim(), $options: "i" };
    }

    // City (city substring match)
    if (city?.trim()) {
      filter.city = { $regex: city.trim(), $options: "i" };
    }

    // Rooms
    if (!isNaN(bedRooms)) filter.bedRooms = Number(bedRooms);
    if (!isNaN(bathRooms)) filter.bathRooms = Number(bathRooms);

    // Booleans
    if (furnished !== undefined) filter.furnished = furnished === "true";
    if (isAvailable !== undefined) filter.isAvailable = isAvailable === "true";

    // Type
    if (type) filter.type = type;

    // Pagination setup
    const skip = (Number(page) - 1) * Number(limit);

    let query = Property.find(filter).sort({ createdAt: -1 });

    // Search (name or description)
    if (search?.trim()) {
      query = query.find({
        $and: [
          filter,
          {
            $or: [
              { name: { $regex: search.trim(), $options: "i" } },
              { description: { $regex: search.trim(), $options: "i" } },
              { address: { $regex: search.trim(), $options: "i" } },
              { city: { $regex: search.trim(), $options: "i" } },
            ],
          },
        ],
      });
    }

    // Count total (optional for frontend)
    const total = await Property.countDocuments(filter);

    // Apply pagination
    const properties = await query.skip(skip).limit(Number(limit));

    res.status(200).json({
      status: "success",
      results: properties.length,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      hasMore: skip + properties.length < total,
      data: properties,
    });
  } catch (err) {
    next(err);
  }
};

export const getSinglePropertyController = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "owner",
      "username email avatar"
    );

    if (!property) return next(errorHandler(404, "Property not found"));

    responseHandler(res, 200, property);
  } catch (err) {
    next(err);
  }
};

export const getPropertiesByOwner = async (req, res, next) => {
  try {
    const { id } = req.params;

    const properties = await Property.find({ owner: id }).sort({
      createdAt: -1,
    });

    if (!properties) errorHandler(404, "No properties!")

    responseHandler(res, 200, properties, "Ok");
  } catch (err) {
    next(err);
  }
};

export const updatePropertyController = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return next(errorHandler(404, "Property not found"));

    if (property.owner.toString() !== req.user.id) {
      return next(errorHandler(403, "Unauthorized to update this property"));
    }

    // Update fields manually
    Object.assign(property, req.body);

    await property.save(); // <- triggers schema validators properly

    responseHandler(res, 200, property, "Property updated successfully");
  } catch (err) {
    next(err);
  }
};

// ✅ Delete Property
export const deletePropertyHandler = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return next(errorHandler(404, "Property not found"));

    if (property.owner.toString() !== req.user.id) {
      return next(errorHandler(403, "Unauthorized to delete this property"));
    }

    await property.deleteOne();
    responseHandler(res, 200, null, "Property deleted successfully");
  } catch (err) {
    next(err);
  }
};
