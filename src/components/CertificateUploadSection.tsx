import React, { useState, useEffect, type ChangeEvent } from "react";
import upload_to_cloud from "../assets/upload_cloud_icon.png";
import file_type_icon from "../assets/file_type_icon.png";
import cross_circle_icon from "../assets/cross_circle_icon.png";
import trash_icon from "../assets/trash_icon.png";
import { useTranslation } from "react-i18next";

const CertificateUploadingSection: React.FC<CertificateUploadingSectionProps> = ({
  showUploadingBlock: propShowUploadingBlock,
  setShowUploadingBlock,
  setFileUploaded,
  errorMsg: propErrorMsg,
  setErrorMsg,
  clickableText,
}) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileSize, setFileSize] = useState<number>(0);
  const [data, setData] = useState<string | null>(null);
  const [localShowUploadingBlock, setLocalShowUploadingBlock] = useState(false);
  const [localErrorMsg, setLocalErrorMsg] = useState(propErrorMsg);

  const { t } = useTranslation();

  // Sync local state with props
  useEffect(() => {
    setLocalShowUploadingBlock(propShowUploadingBlock);
    setLocalErrorMsg(propErrorMsg);
  }, [propShowUploadingBlock, propErrorMsg]);

  const handleFileInputClick = () => {
    document.getElementById("file-upload")?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalShowUploadingBlock(true);
    setShowUploadingBlock(true);
    setProgress(0);

    const file = e.target.files ? e.target.files[0] : null;
    if (!file) return;

    const validExtensions = ["pdf", "png", "jpg", "jpeg"];
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    const maxSizeInBytes = 5 * 1024 * 1024;

    setFileSize(file.size / 1024);
    setLocalErrorMsg("");
    setErrorMsg("");

    if (!validExtensions.includes(fileExtension || "")) {
      setFileName(file.name);
      const err = t("errors.uploadingCertificateErr");
      setLocalErrorMsg(err);
      setErrorMsg(err);
      e.target.value = "";
      return;
    }

    if (file.size > maxSizeInBytes) {
      setFileName(file.name);
      const err = t("upload.error.fileSizeExceeded");
      setLocalErrorMsg(err);
      setErrorMsg(err);
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const fileData = event.target?.result as string;
      setUploading(true);
      setFileName(file.name);
      setData(fileData);

      const uploadSimulation = setInterval(() => {
        setProgress((prev) => {
          const newProgress = Math.min(prev + 20, 100);
          if (newProgress >= 100) {
            clearInterval(uploadSimulation);
            setUploading(false);
            setFileUploaded(true);
          }
          return newProgress;
        });
      }, 500);
    };
    reader.readAsDataURL(file);
  };

  const cancelUpload = () => {
    setFileName(null);
    setProgress(0);
    setUploading(false);
    setLocalErrorMsg("");
    setErrorMsg("");
    setData(null);
    setLocalShowUploadingBlock(false);
    setShowUploadingBlock(false);
    setFileUploaded(false);

    const input = document.getElementById("file-upload") as HTMLInputElement;
    if (input) input.value = "";
  };

  const onChangeFile = () => {
    cancelUpload();
    handleFileInputClick();
  };

  return (
    <div className="flex flex-col">
      <div
        className={`flex flex-col h-[200px] px-6 space-y-3 items-center bg-white border ${
          localErrorMsg ? "border-[#FDA29B]" : "border-[#E4E7EC]"
        } rounded-lg`}
      >
        <input
          id="file-upload"
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleFileChange}
          className="hidden"
        />

        {!localShowUploadingBlock && (
          <>
            <div className="border border-[#E4E7EC] p-2 mt-12 rounded-md">
              <img
                src={upload_to_cloud}
                className="h-4 cursor-pointer"
                alt="upload cloud"
                onClick={handleFileInputClick}
              />
            </div>
            <p className="text-[13px] text-[#475467] text-center">
              <span
                className="text-[13px] text-[#006DE7] font-semibold cursor-pointer"
                onClick={handleFileInputClick}
              >
                {clickableText}
              </span>{" "}
              {t("certificationUploadSec.clickToBrowse")}
            </p>
            <p className="text-[11px] text-[#475467] text-center">
              {t("certificationUploadSec.uploadCertificateInfo")}
            </p>
          </>
        )}

        {/* Uploading Block */}
        {localShowUploadingBlock && !localErrorMsg && (
          <div className="flex items-center justify-between w-full h-[4.5rem] border border-[#E4E7EC] rounded-md px-2.5 mt-12">
            <div className="flex items-center space-x-2 w-full">
              <img src={file_type_icon} className="h-7 w-7" alt="file type" />
              <div className="flex flex-col mt-5 w-full">
                <p className="text-[#344054] text-[0.7rem] font-semibold">
                  {fileName || "CPC.pdf"}
                </p>
                <p className="text-[0.6rem] text-[#475467] font-semibold">
                  {fileSize.toFixed(2)} KB
                </p>
                <div className="flex justify-between gap-x-1 rounded-full h-2.5 mb-4">
                  <div
                    className="bg-[#006DE7] h-1.5 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex flex-col h-7 w-7 gap-2 items-center">
              <img
                src={trash_icon}
                className="h-4 w-4 cursor-pointer"
                alt="trash"
                onClick={cancelUpload}
              />
              <p className="text-[#344054] text-[0.7rem]">{progress}%</p>
            </div>
          </div>
        )}

        {/* Error Block */}
        {localErrorMsg && (
          <div className="flex items-center justify-between w-full h-[4.5rem] border border-[#FDA29B] rounded-md px-2.5 mt-12">
            <div className="flex items-center space-x-2 w-full">
              <img src={file_type_icon} className="h-7 w-7" alt="file type" />
              <div className="flex flex-col mt-5 w-full">
                <p className="text-[#344054] text-[0.7rem] font-semibold">
                  {fileName || "CPC.pdf"}
                </p>
                <div className="flex items-center gap-1">
                  <p className="text-[0.6rem] text-[#475467] font-semibold">
                    {fileSize.toFixed(2)} KB
                  </p>
                  <img src={cross_circle_icon} className="h-3 pl-1.5" alt="error" />
                  <p className="text-[10px] text-[#D92D20]">
                    {t("certificationUploadSec.failed")}
                  </p>
                </div>
                <div className="flex justify-between gap-x-1 rounded-full h-2.5 mb-4">
                  <div className="bg-[#D92D20] h-1.5 rounded-full w-full"></div>
                </div>
              </div>
            </div>
            <p className="text-[#344054] text-[0.7rem]">100%</p>
          </div>
        )}

        {(localShowUploadingBlock || localErrorMsg) && (
          <button
            type="button"
            onClick={onChangeFile}
            className="bg-transparent w-[23%] text-xs text-[#414651] border border-[#D5D7DA] font-semibold py-2.5 text-center rounded-[5px]"
          >
            {t("certificationUploadSec.changeFile")}
          </button>
        )}
      </div>

      {localErrorMsg && <p className="text-xs text-[#D92D20] pt-1">{localErrorMsg}</p>}
    </div>
  );
};

export default CertificateUploadingSection;

interface CertificateUploadingSectionProps {
  showUploadingBlock: boolean;
  setShowUploadingBlock: React.Dispatch<React.SetStateAction<boolean>>;
  setFileUploaded: React.Dispatch<React.SetStateAction<boolean>>;
  errorMsg: string;
  setErrorMsg: React.Dispatch<React.SetStateAction<string>>;
  clickableText: string;
}
