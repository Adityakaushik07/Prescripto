/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, cuurencySymbol } = useContext(AppContext);
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [soltIndex, setSoltIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  // Fetch doctor info based on docId
  const fetchDocInfo = () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    if (docInfo) {
      setDocInfo(docInfo);
    }
  };

  // Get available slots for the doctor
  const getAvailableSlot = () => {
    const availableSlots = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const cuurentDate = new Date(today);
      cuurentDate.setDate(today.getDate() + i);

      const endTime = new Date(cuurentDate);
      endTime.setHours(21, 0, 0); // End time is 9 PM

      // If it's today, adjust the starting time
      if (i === 0) {
        cuurentDate.setHours(Math.max(cuurentDate.getHours() + 1, 10));
        cuurentDate.setMinutes(cuurentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        cuurentDate.setHours(10);
        cuurentDate.setMinutes(0);
      }

      const timeSlots = [];
      while (cuurentDate < endTime) {
        const formattedTime = cuurentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        timeSlots.push({
          dateTime: new Date(cuurentDate),
          time: formattedTime,
        });

        cuurentDate.setMinutes(cuurentDate.getMinutes() + 30);
      }
      availableSlots.push(timeSlots);
    }

    setDocSlots(availableSlots);
  };

  // Fetch doctor info when `doctors` or `docId` changes
  useEffect(() => {
    if (doctors.length) {
      fetchDocInfo();
    }
  }, [doctors, docId]);

  // Get available slots when doctor info is fetched
  useEffect(() => {
    if (docInfo) {
      getAvailableSlot();
    }
  }, [docInfo]);

  // Debugging: Log the slots array
  useEffect(() => {
    console.log(docSlots); // Corrected to log `docSlots` instead of `docSlot`
  }, [docSlots]);

  return (
    docInfo && (
      <div>
        <div>
          {/* Doctor details */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <img
                className="bg-primary w-full sm:max-w-72 rounded-lg"
                src={docInfo.image}
                alt="Doctor"
              />
            </div>

            <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
              {/* Doctor info */}
              <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
                {docInfo.name}
                <img
                  className="w-5"
                  src={assets.verified_icon}
                  alt="Verified"
                />
              </p>
              <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
                <p>
                  {docInfo.degree} - {docInfo.speciality}
                </p>
                <button className="py-0.5 px-2 border text-xs rounded-full">
                  {docInfo.experience} years
                </button>
              </div>

              {/* Doctor About section */}
              <div>
                <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                  About
                  <img src={assets.info_icon} alt="Info" />
                </p>
                <p className="text-sm text-gray-500 max-w-[700px] mt-1">
                  {docInfo.about}
                </p>
              </div>
              <p className="text-gray-500 font-medium mt-4">
                Appointment fee:{" "}
                <span className="text-gray-600">
                  {cuurencySymbol}
                  {docInfo.fees}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Booking slots */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking slots</p>
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {docSlots.length > 0 &&
              docSlots.map((item, index) => (
                <div
                  onClick={() => setSoltIndex(index)}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    soltIndex === index
                      ? "bg-primary text-white"
                      : "border boder-gray-200"
                  }`}
                  key={index}
                >
                  <p>{item[0] && daysOfWeek[item[0].dateTime.getDay()]}</p>
                  <p>{item[0] && item[0].dateTime.getDate()}</p>{" "}
                  {/* Fixed the typo: `datetime` -> `dateTime` */}
                </div>
              ))}
          </div>
          <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4 ">
            {docSlots.length &&
              docSlots[soltIndex].map((item, index) => (
                <p
                  onClick={() => setSlotTime(item.time)}
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                    item.time === slotTime
                      ? "bg-primary text-white"
                      : "text-gray-400 border border-gray-300"
                  } `}
                  key={index}
                >
                  {item.time.toLowerCase()}
                </p>
              ))}
          </div>
          <button className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6">
            Book an appointment
          </button>
        </div>

        {/* Listing Related Doctors */}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality}/>
      </div>
    )
  );
};

export default Appointment;
