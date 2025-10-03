import React from "react";
import truckPassTitle from "../assets/truck_pass_title_white.png";
import driverImage from "../assets/user_photo.png";
import userIcon from "../assets/user_icon.png";
import vehicleIcon from "../assets/vehicle_icon.png";
import consignmentIcon from "../assets/consignment_icon.png";
import routeIcon from "../assets/route_icon.png";
import locationIcon from "../assets/location_icon.png";
import arrow from "../assets/arrow.png";
import calendarIcon from "../assets/calendar_icon.png";
import tickIcon from "../assets/tick_icon.png";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export const TruckPassCard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex justify-center bg-white font-[SF Pro Text]">
      <div className="w-full max-w-[894px] bg-white rounded-t-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between bg-gradient-to-r from-[#2563EB] to-[#4338CA] text-white px-6 py-7 w-full h-[148px]">
          {/* Left side content */}
          <div className="flex flex-col gap-y-2">
            <img src={truckPassTitle} className="h-5 w-40" alt="Truck Pass" />
            <p className="text-sm font-[SF Pro Text]">
              {t("verificationCard.transportAuth")}
            </p>

            <div className="flex items-center space-x-10">
              <p className="text-[16px] bg-[#3B82F64D] rounded-full px-5 font-[SF Pro Text]">
                {t("verificationCard.issuer")}
              </p>
              <p className="text-[16px] bg-[#3B82F64D] rounded-full px-5 font-[SF Pro Text]">
                {t("verificationCard.route")}
              </p>
            </div>
          </div>

          {/* ✅ Verified Badge */}
          <div className="flex items-center gap-2 ">
            <img src={tickIcon} alt="verified" className="w-8 h-8" />
            <span className="border border-green-500 bg-green-100 rounded-full px-3 py-1 text-green-600 text-sm font-medium">Verified</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 flex gap-6">
          <div className="flex flex-col gap-6">
            {/* Driver Details Card*/}
            <div className=" border border-gray-200 rounded-xl p-6 bg-white shadow-md w-[411px] h-[467px]">
              <div className="flex items-center gap-2 mb-4">
                <img src={userIcon} className="w-5 h-5" />
                <h2 className="font-semibold text-lg flex items-center font-[SF Pro Text]">
                  {t("verificationCard.driverCardTitle")}
                </h2>
              </div>

              {/* Driver Header */}
              <div className="flex items-center mb-4">
                <img src={userIcon} alt="Driver" className="w-16 h-16 mr-8" />
                <div>
                  <p className="font-bold text-[18px] font-[SF Pro Text] pb-1">
                    Rajesh Singh
                  </p>
                  <p className="text-blue-600 text-sm font-[SF Pro Text]">
                    {t("verificationCard.driverUIN")}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="divide-y divide-gray-100 text-sm py-[10px] font-[SF Pro Text]">
                <div className="flex justify-between py-3 pb-7 w-[358px] h-[37px]">
                  <span className="text-[#4B5563] font-[SF Pro Text]">
                    {t("verificationCard.driverPhone")}
                  </span>
                  <span className="font-[SF Pro Text]">+1 (555) 123-4567</span>
                </div>
                <div className="flex justify-between py-5 pb-7 w-[358px] h-[37px]">
                  <span className="text-[#4B5563] font-[SF Pro Text]">
                    {t("verificationCard.driverGender")}
                  </span>
                  <span className="font-[SF Pro Text]">Male</span>
                </div>
                <div className="flex justify-between py-5 pb-7 w-[358px] h-[37px]">
                  <span className="text-[#4B5563] font-[SF Pro Text]">
                    {t("verificationCard.driverEmail")}
                  </span>
                  <a
                    href="mailto:myemail@gmail.com"
                    className="text-blue-600 font-[SF Pro Text]"
                  >
                    myemail@gmail.com
                  </a>
                </div>
                <div className="flex justify-between py-5 pb-7 w-[358px] h-[37px]">
                  <span className="text-[#4B5563] font-[SF Pro Text]">
                    {t("verificationCard.driverCity")}
                  </span>
                  <span className="font-[SF Pro Text]">Chandigarh, India</span>
                </div>
                <div className="flex justify-between py-5 pb-7 w-[358px] h-[37px]">
                  <span className="text-[#4B5563] font-[SF Pro Text]">
                    {t("verificationCard.driverLicense")}
                  </span>
                  <span className="font-[SF Pro Text]">D123456789</span>
                </div>
                <div className="flex justify-between py-5 pb-7 w-[358px] h-[37px]">
                  <span className="text-[#4B5563] font-[SF Pro Text]">
                    {t("verificationCard.driverPassport")}
                  </span>
                  <span className="font-[SF Pro Text]">US987654321</span>
                </div>
              </div>
            </div>

            {/* vehicle details */}
            <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-md w-[411px] h-[362px]">
              <div className="flex items-center gap-2">
                <img src={vehicleIcon} />
                <p className="font-bold text-lg font-[SF Pro Text] pb-1">
                  {t("verificationCard.vehicleCardTitle")}
                </p>
              </div>

              <div className="divide-y divide-gray-100 text-sm font-[SF Pro Text]">
                <div className="flex justify-between py-3 w-[358px] h-[37px]">
                  <span className="text-[#4B5563] font-[SF Pro Text]">
                    {t("verificationCard.vehicleNumber")}
                  </span>
                  <span className="font-[SF Pro Text]">CH-6878-5475</span>
                </div>
                <div className="flex justify-between py-5 pb-8 w-[358px] h-[37px]">
                  <span className="text-[#4B5563] font-[SF Pro Text]">
                    {t("verificationCard.vehicleType")}
                  </span>
                  <span className="inline-flex items-center border border-[#F1F5F9] bg-[#F1F5F9] rounded-full px-5 py-2 text-[13px] font-bold font-[SF Pro Text]">
                    Container truck
                  </span>
                </div>
                <div className="flex justify-between py-5 pb-8 w-[358px] h-[37px]">
                  <span className="text-[#4B5563] font-[SF Pro Text]">
                    {t("verificationCard.vehicleAxle")}
                  </span>
                  <span className="font-[SF Pro Text]">6x4 Configuration</span>
                </div>
                <div className="flex justify-between py-5 pb-8 w-[358px] h-[37px]">
                  <span className="text-[#4B5563] font-[SF Pro Text]">
                    {t("verificationCard.vehicleLicense")}
                  </span>
                  <span className="inline-flex items-center border border-[#E2E8F0] rounded-full px-5 py-2 text-[13px] font-bold font-[SF Pro Text]">
                    TX-6789-AB
                  </span>
                </div>
                <div className="flex justify-between py-5 pb-8 w-[358px] h-[37px]"></div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            {/* First QR + Consignment */}
            <div className="flex flex-col gap-6">
              <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-md flex items-center justify-center w-[411px] h-[210px]">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example"
                  alt="QR Code"
                  className="w-[148px] h-[148px]"
                />
              </div>

              <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-md w-[410px] h-[233px]">
                <div className="flex items-center gap-2 mb-[12px]">
                  <img src={consignmentIcon} />
                  <h2 className="font-semibold text-lg flex items-center font-[SF Pro Text]">
                    {t("verificationCard.consignmentTitle")}
                  </h2>
                </div>

                <div className="divide-y divide-gray-100 text-sm font-[SF Pro Text]">
                  <div className="flex justify-between py-3 pb-7 w-[358px] h-[37px]">
                    <span className="text-[#4B5563] font-[SF Pro Text]">
                      {t("verificationCard.consignmentInvoice")}
                    </span>
                    <span className="font-[SF Pro Text]">INV-4234</span>
                  </div>
                  <div className="flex justify-between py-3 pb-7 w-[358px] h-[37px]">
                    <span className="text-[#4B5563] font-[SF Pro Text]">
                      {t("verificationCard.consignmentCMR")}
                    </span>
                    <span className="font-[SF Pro Text]">WF-232322</span>
                  </div>
                  <div className="flex justify-between py-5 pb-7 w-[358px] h-[37px]">
                    <span className="text-[#4B5563] font-[SF Pro Text]">
                      {t("verificationCard.ConsignmentTracking")}
                    </span>
                    <span className="inline-flex items-center border border-[#E2E8F0] rounded-full px-5 py-2 text-[13px] font-[SF Pro Text] font-bold">
                      TRK-23456789ABC
                    </span>
                  </div>
                  <div className="flex justify-between py-5 pb-7 w-[358px] h-[37px]"></div>
                </div>
              </div>
            </div>

            {/* Route & Trade Details */}
            <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-md w-[410px] h-[362px]">
              <div className="flex items-center gap-2 mb-[8px]">
                <img src={routeIcon} />
                <h2 className="font-semibold text-lg flex items-center font-[SF Pro Text]">
                  {t("verificationCard.routeTitle")}
                </h2>
              </div>

              <div className="divide-y divide-gray-100 text-sm font-[SF Pro Text]">
                <div className="flex justify-between py-3 w-[358px] h-[37px]">
                  <span className="text-[#4B5563] font-[SF Pro Text]">
                    {t("verificationCard.routeExporter")}
                  </span>
                  <span className="font-[SF Pro Text]">
                    Global Manufacturing Corp
                  </span>
                </div>
                <div className="flex justify-between py-5 pb-8 w-[358px] h-[37px]">
                  <span className="text-[#4B5563] font-[SF Pro Text]">
                    {t("verificationCard.routeImporter")}
                  </span>
                  <span className="font-[SF Pro Text]">
                    European Distribution Ltd
                  </span>
                </div>
                <div className="flex justify-between py-3 w-[358px] h-[37px]">
                  <div className="text-[#4B5563] border border-[#EFF6FF] bg-[#EFF6FF] w-[358px] px-[6px] py-[10px] h-[98px] rounded-[11px] font-[SF Pro Text]">
                    <div className="flex items-center">
                      <img src={locationIcon} className="h-4 w=4" />
                      <span className="text-[#4B5563] px-[3px] font-[SF Pro Text]">
                        {t("verificationCard.routeRoute")}
                      </span>
                    </div>

                    <div className=" flex justify-between py-3 w-[343px] h-[37px]">
                      <span className="inline-flex items-center border border-[#E2E8F0] rounded-full px-5 py-2 text-[13px] font-extrabold font-[SF Pro Text]">
                        Country A
                      </span>
                      <img src={arrow} alt="" />
                      <span className="inline-flex items-center border border-[#E2E8F0] rounded-full px-5 py-2 text-[13px] font-bold font-[SF Pro Text]">
                        Country B
                      </span>
                    </div>
                    <span className="text-[#4B5563] text-[11px] px-[80px] font-[SF Pro Text]">
                      Port of Detroit → Port of Windsor
                    </span>
                  </div>
                </div>

                {/* Dates Row */}
                <div className="flex justify-between py-[80px] w-[358px] font-[SF Pro Text]">
                  <div className="flex flex-col items-baseline">
                    <div className="flex items-center gap-1 ">
                      <img src={calendarIcon} />
                      <span className="text-[#4B5563] text-[12px] font-[SF Pro Text] pb-[2px]">
                        {t("verificationCard.routeDep")}
                      </span>
                    </div>

                    <span className="inline-flex items-center border border-[#F1F5F9] bg-[#F1F5F9] rounded-full px-13 w-[173px] text-[11px] font-bold font-[SF Pro Text]">
                      01/12/2024
                    </span>
                  </div>
                  <div className="flex flex-col items-baseline">
                    <div className="flex items-center gap-1 ">
                      <img src={calendarIcon} />
                      <span className="text-[#4B5563] text-[12px] font-[SF Pro Text] pb-[2px]">
                        {t("verificationCard.routeReturn")}
                      </span>
                    </div>

                    <span className="inline-flex items-center border border-[#F1F5F9] bg-[#F1F5F9] rounded-full px-13 w-[173px] text-[11px] font-bold font-[SF Pro Text]">
                      05/12/2024
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
