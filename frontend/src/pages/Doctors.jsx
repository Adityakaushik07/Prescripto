/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Doctors = () => {
  const { speciality } = useParams();
  const [filtterDoc, setFiltterDoc] = useState([]);
  const navigate = useNavigate();

  const { doctors } = useContext(AppContext);

  const applyFiltter = () => {
    if (speciality) {
      setFiltterDoc(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFiltterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFiltter();
  }, [doctors, speciality]);

  return (
    <div>
      <p className="text-gray-600">Browse through the doctors specialist.</p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <div className="flex flex-col gap-4 text-sm text-gray-600">
          {[
            { name: "General physician", path: "/doctors/General physician" },
            { name: "Gynecologist", path: "/doctors/Gynecologist" },
            { name: "Dermatologist", path: "/doctors/Dermatologist" },
            { name: "Pediatricians", path: "/doctors/Pediatricians" },
            { name: "Neurologist", path: "/doctors/Neurologist" },
            { name: "Gastroenterologist", path: "/doctors/Gastroenterologist" },
          ].map((speciality, index) => (
            <p
              key={index}
              onClick={() => navigate(speciality.path)}
              className="w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer"
            >
              {speciality.name}
            </p>
          ))}
        </div>

        <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6">
          {/* Show message when no doctors are available */}
          {filtterDoc.length === 0 && speciality === "Gastroenterologist" && (
            <p className="text-center text-red-500">
              No doctors available for Gastroenterologist at the moment.
            </p>
          )}

          {/* Render doctor cards */}
          {filtterDoc.map((item, index) => (
            <div
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
              onClick={() => navigate(`/appointment/${item._id}`)}
              key={index}
            >
              <img className="bg-blue-50" src={item.image} alt="pic" />
              <div className="p-4">
                <div className="flex items-center gap-2 text-sm text-center text-green-500">
                  <p className="w-2 h-2 rounded-full bg-green-500"></p>
                  <p>Available</p>
                </div>
                <p className="text-gray-900 text-lg font-medium">{item.name}</p>
                <p className="text-gray-600 text-sm">{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
