import { useState } from "react";

const FilterSidebar = ({ onApply }) => {
  const [localFilters, setLocalFilters] = useState({
    type: "",
    city: "",
    minPrice: "",
    maxPrice: "",
    bedRooms: "",
    bathRooms: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLocalFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleApply = () => {
    onApply(localFilters); // Send to Explore
  };

  return (
    <div className="lg:w-64 w-full border border-black p-4 rounded shadow-[3px_3px_0px_#000]">
      <h3 className="text-lg font-bold mb-4">Filters</h3>

      <div className="grid gap-4">
        <input
          type="text"
          name="city"
          value={localFilters.city}
          onChange={handleChange}
          placeholder="City"
          className="input"
        />

        <div className="flex gap-2">
          <input
            type="number"
            name="minPrice"
            value={localFilters.minPrice}
            onChange={handleChange}
            placeholder="Min Price"
            className="input w-1/2"
          />
          <input
            name="maxPrice"
            type="number"
            value={localFilters.maxPrice}
            onChange={handleChange}
            placeholder="Max Price"
            className="input w-1/2"
          />
        </div>

        <div className="flex gap-2">
          <input
            name="bedRooms"
            type="number"
            value={localFilters.bedRooms}
            onChange={handleChange}
            placeholder="Bedrooms"
            className="input w-1/2"
          />
          <input
            name="bathRooms"
            type="number"
            value={localFilters.bathRooms}
            onChange={handleChange}
            placeholder="Bathrooms"
            className="input w-1/2"
          />
        </div>

        <select
          name="type"
          value={localFilters.type}
          onChange={handleChange}
          className="input"
        >
          <option value="">All Types</option>
          <option value="rent">Rent</option>
          <option value="sale">Sale</option>
          <option value="pg">PG</option>
          <option value="hostel">Hostel</option>
        </select>

        <button
          onClick={handleApply}
          className="mt-4 px-4 py-2 bg-black text-white border-2 border-black rounded shadow-[2px_2px_0px_#000] hover:bg-yellow-300 hover:text-black transition"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;
