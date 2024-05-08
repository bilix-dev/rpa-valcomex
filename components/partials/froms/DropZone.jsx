import Button from "@/components/ui/Button";
import Tooltip from "@/components/ui/Tooltip";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

const DropZone = ({ defaultValue = [], onChange }) => {
  const [files, setFiles] = useState(defaultValue);
  const { getRootProps, getInputProps, isDragAccept } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      const aux = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setFiles(aux);
      onChange(aux);
    },
  });

  return (
    <div>
      <div className="w-full text-center border-dashed border border-secondary-500 rounded-md py-[52px] flex flex-col justify-center items-center">
        {files.length === 0 && (
          <div {...getRootProps({ className: "dropzone" })}>
            <input className="hidden" {...getInputProps()} />
            <img
              src="/assets/images/svg/upload.svg"
              alt=""
              className="mx-auto mb-4"
            />
            {isDragAccept ? (
              <p className="text-sm text-slate-500 dark:text-slate-300 ">
                Inserte su logo aquí ...
              </p>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-300 f">
                Arrastre su logo o haga click para subir uno.
              </p>
            )}
          </div>
        )}
        <div className="flex space-x-4">
          {files.map((file, i) => (
            <div key={i} className="flex-none -mt-4 -mb-4">
              <div className="h-15 w-20">
                <Image
                  src={file.preview}
                  width={500}
                  height={500}
                  alt="Logo"
                  onLoad={() => {
                    URL.revokeObjectURL(file.preview);
                  }}
                />
              </div>
              <Tooltip content="Borrar" placement="top" arrow animation="fade">
                <div className="mt-2">
                  <Button
                    icon="heroicons:trash"
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      setFiles([]);
                      onChange([]);
                    }}
                  />
                </div>
              </Tooltip>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DropZone;
