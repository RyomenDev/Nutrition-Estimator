import { fetchContactsFromHubSpot } from "../api/index.js";
import { formatContact } from "../utils/formatContact.js";

export const GetFilteredContacts = async (req, res) => {
  //   console.log("sending filteredContacts");

  try {
    const { role, country, state, city } = req.query;

    const filters = [];

    if (role) {
      filters.push({
        propertyName: "project_role",
        operator: "CONTAINS_TOKEN",
        value: role,
      });
    }

    if (country) {
      filters.push({
        propertyName: "country",
        operator: "EQ",
        value: country,
      });
    }

    if (state) {
      filters.push({
        propertyName: "state",
        operator: "EQ",
        value: state,
      });
    }

    if (city) {
      filters.push({
        propertyName: "city",
        operator: "EQ",
        value: city,
      });
    }

    filters.push({
      propertyName: "project_role",
      operator: "HAS_PROPERTY",
    });

    const payload = {
      filterGroups: [{ filters }],
      properties: [
        "firstname",
        "lastname",
        "email",
        "phone",
        "country",
        "state",
        "city",
        "hs_state_code",
        "project_role",
      ],
    };

    const results = await fetchContactsFromHubSpot(payload);
    const contacts = results.map(formatContact);

    res.json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error.message);
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
};

export const GetLocationFilters = async (req, res) => {
  //   console.log("sending LocationFilters");

  try {
    const { country, state } = req.query;

    const payload = {
      filterGroups: [
        {
          filters: [
            {
              propertyName: "project_role",
              operator: "HAS_PROPERTY",
            },
          ],
        },
      ],
      properties: ["country", "state", "city", "project_role"],
    };

    const results = await fetchContactsFromHubSpot(payload);

    const allCountries = new Set();
    const allStates = new Set();
    const allCities = new Set();
    const allRoles = new Set();

    results.forEach(({ properties }) => {
      const { country, state, city, project_role } = properties;
      if (country) allCountries.add(country);
      if (state) allStates.add(state);
      if (city) allCities.add(city);
      if (project_role) {
        project_role
          .split(";")
          .filter(Boolean)
          .forEach((r) => allRoles.add(r.trim()));
      }
    });

    const filtered = results.filter((c) => {
      const { country: cCountry, state: cState } = c.properties;
      if (country && cCountry !== country) return false;
      if (state && cState !== state) return false;
      return true;
    });

    const responseObj = {
      roles: Array.from(allRoles).sort(),
    };

    if (!country && !state) {
      responseObj.countries = Array.from(allCountries).sort();
    }

    if (country && !state) {
      const states = new Set();
      filtered.forEach((c) => {
        if (c.properties.state) states.add(c.properties.state);
      });
      responseObj.states = Array.from(states).sort();
    }

    if (country && state) {
      const cities = new Set();
      filtered.forEach((c) => {
        if (c.properties.city) cities.add(c.properties.city);
      });
      responseObj.cities = Array.from(cities).sort();
    }

    res.json(responseObj);
  } catch (error) {
    console.error("Error fetching location filters:", error.message);
    res.status(500).json({ error: "Failed to fetch location filters" });
  }
};
